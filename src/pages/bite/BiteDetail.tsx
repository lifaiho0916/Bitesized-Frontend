import { useEffect, useState, useContext, useMemo } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Avatar from "../../components/general/avatar"
import Button from "../../components/general/button"
import ReactPlayer from "react-player"
import UnLockFreeModal from "../../components/modals/UnLockFreeModal"
import PurchaseModal from "../../components/modals/PurchaseModal"
import PaymentModal from "../../components/modals/PaymentModal"
import { BackIcon, ClockIcon, PlayIcon, UnlockIcon, AscendIcon, DescendIcon, LockedIcon } from "../../assets/svg"
import { LanguageContext } from "../../routes/authRoute"
import { biteAction } from "../../redux/actions/biteActions"
import { paymentAction } from "../../redux/actions/paymentActions"
import { transactionAction } from "../../redux/actions/transactionActions"
import { SET_DIALOG_STATE } from "../../redux/types"
import NoTransactionImg from "../../assets/img/no-bite-transaction.png"
import "../../assets/styles/bite/BiteDetailStyle.scss"

const BiteDetail = () => {
    const { biteId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const contexts = useContext(LanguageContext)
    const loadState = useSelector((state: any) => state.load)
    const userState = useSelector((state: any) => state.auth)
    const biteState = useSelector((state: any) => state.bite)
    const transactionState = useSelector((state: any) => state.transaction)
    const paymentState = useSelector((state: any) => state.payment)

    const { state } = location
    const { payment } = paymentState
    const { prevRoute, dlgState, currencyRate } = loadState
    const { bite } = biteState
    const { user } = userState
    const { transactions } = transactionState

    const [sort, setSort] = useState(-1)
    const [videoIndex, setVideoIndex] = useState(-1)
    const [play, setPlay] = useState(false)
    const [copied, setCopied] = useState(false)
    const [currency, setCurrency] = useState('usd')

    const [openFreeUnlock, setOpenFreeUnLock] = useState(false)
    const [openPurchaseModal, setOpenPurchaseModal] = useState(false)
    const [openPaymentModal, setOpenPaymentModal] = useState(false)
    const [cardHover, SetCardHover] = useState(false)
    const [hover, setHover] = useState(false)

    const displayTime = (left: any) => {
        const passTime = Math.abs(left)
        let res: any = 'Posted'
        if (Math.floor(passTime / (3600 * 24 * 30)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24 * 30)) + '' + (Math.floor(passTime / (3600 * 24 * 30)) === 1 ? contexts.ITEM_CARD.MONTH : contexts.ITEM_CARD.MONTHS)
        else if (Math.floor(passTime / (3600 * 24 * 7)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24 * 7)) + '' + (Math.floor(passTime / (3600 * 24 * 7)) === 1 ? contexts.ITEM_CARD.WEEK : contexts.ITEM_CARD.WEEKS)
        else if (Math.floor(passTime / (3600 * 24)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24)) + '' + (Math.floor(passTime / (3600 * 24)) === 1 ? contexts.ITEM_CARD.DAY : contexts.ITEM_CARD.DAYS)
        else if (Math.floor(passTime / 3600) >= 1) res = res + ' ' + Math.floor(passTime / 3600) + '' + (Math.floor(passTime / 3600) === 1 ? contexts.ITEM_CARD.HOUR : contexts.ITEM_CARD.HOURS)
        else if (Math.floor(passTime / 60) > 0) res = res + ' ' + Math.floor(passTime / 60) + '' + (Math.floor(passTime / 60) === 1 ? contexts.ITEM_CARD.MIN : contexts.ITEM_CARD.MINS)
        if (Math.floor(passTime / 60) > 0) res += contexts.ITEM_CARD.AGO
        else res = 'Just ' + res
        return res
    }

    const lock = useMemo(() => {
        if (user === null) return true
        if (user.role === "ADMIN" || (bite.owner && String(bite.owner._id) === String(user.id))) return false
        if (bite.owner) return bite.purchasedUsers.every((purchaseInfo: any) => String(purchaseInfo.purchasedBy) !== String(user.id))
        return true
    }, [user, bite])

    const localPrice = useMemo(() => {
        if (currencyRate && user && bite.owner) {
            const rate = bite.currency === 'usd' ? 1.0 : currencyRate[`${bite.currency}`]
            const usdAmount = bite.price / rate
            const rate1 = user.currency === 'usd' ? 1.0 : currencyRate[`${user.currency}`]
            const price = usdAmount * rate1
            return price.toFixed(2)
        }
    }, [bite, user, currencyRate])

    const unLockBite = () => {
        if (bite.currency) setOpenPurchaseModal(true)
        else dispatch(biteAction.unLockBite(bite._id, bite.currency, bite.price, null, null, null, null))
    }

    const getLocalCurrency = (currency: any) => {
        let res = ''
        if (currency === 'usd') res += 'US $'
        else if (currency === 'hkd') res += 'HK $'
        else if (currency === 'inr') res += 'Rp ₹'
        else if (currency === 'twd') res += 'NT $'
        else res += 'RM '
        return res
    }

    useEffect(() => {
        dispatch(paymentAction.getPayment())
        dispatch(biteAction.getBiteById(biteId))
    }, [biteId, dispatch])
    useEffect(() => {
        if (dlgState === 'unlock_bite') setOpenFreeUnLock(true)
    }, [dlgState])
    useEffect(() => {
        if ((state && state.owner === true) || (user && bite.owner && (String(user.id) === String(bite.owner._id)))) {
            dispatch(transactionAction.getTransactionsByBiteId(biteId, sort))
        }
    }, [biteId, sort, dispatch, state, user, bite])

    const displayEmptyRow = (count: any) => {
        var indents: any = []
        for (var i = 0; i < count; i++) {
            indents.push(<tr key={i}><td></td><td></td><td></td><td></td></tr>)
        }
        return indents
    }

    return (
        <div className="bite-detail-wrapper">
            <div className="page-header">
                <div onClick={() => navigate(prevRoute)}><BackIcon color="black" /></div>
                <div className="page-title"><span>Bite Details</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            {bite &&
                <div className="bite-detail">
                    <UnLockFreeModal
                        show={openFreeUnlock}
                        onClose={() => {
                            setOpenFreeUnLock(false)
                            dispatch({ type: SET_DIALOG_STATE, payload: "" })
                        }}
                        bite={bite}
                        handleSubmit={() => {
                            dispatch({ type: SET_DIALOG_STATE, payload: "" })
                            navigate(`/${user?.personalisedUrl}`)
                        }}
                    />
                    <PurchaseModal
                        show={openPurchaseModal}
                        setCurrency={setCurrency}
                        onClose={() => setOpenPurchaseModal(false)}
                        bite={bite}
                        handleSubmit={() => {
                            setOpenPurchaseModal(false)
                            setOpenPaymentModal(true)
                        }}
                    />
                    <PaymentModal
                        show={openPaymentModal}
                        onClose={() => setOpenPaymentModal(false)}
                        bite={bite}
                        currency={currency}
                        payment={payment}
                    />
                    <div className="main-detail">
                        <div className="avatar-title">
                            <div className="left-time">
                                <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;<span>{displayTime(bite?.time)}</span>
                            </div>
                            <div className="avatar">
                                {bite.owner &&
                                    <Avatar
                                        avatar={bite.owner.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${bite.owner.avatar}` : bite.owner.avatar}
                                        username={bite.owner.name}
                                        avatarStyle={"horizontal"}
                                    />
                                }
                                <Button
                                    text="Subscribe"
                                    fillStyle="fill"
                                    color="primary"
                                    shape="rounded"
                                    handleSubmit={() => { window.open('https://www.creatogether.app/subscribenow', '_blank') }}
                                />
                            </div>
                            <div className="status-chip">
                                <div className={`chip ${bite.currency ? 'paid' : 'free'}`}>
                                    {bite.currency ? user ? getLocalCurrency(user.currency) + localPrice : '' : 'Free'}
                                </div>
                                {!lock &&
                                    <div className={`chip ${(state && state.owner === true) ? 'mine' : 'unlock'}`}>
                                        {(state && state.owner === true) ? 'My Bite' : 'Unlocked'}
                                    </div>
                                }
                            </div>
                            <div className="bite-title">
                                <span>{bite?.title}</span>
                            </div>
                        </div>
                        {lock &&
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    text="Unlock this bite"
                                    fillStyle="outline"
                                    color="primary"
                                    shape="rounded"
                                    width={"250px"}
                                    icon={[
                                        <LockedIcon color="#EFA058" />, <UnlockIcon color="white" />, <UnlockIcon color="white" />
                                    ]}
                                    handleSubmit={unLockBite}
                                />
                            </div>
                        }
                    </div>
                    {((state && state.owner === true) || (user && bite.owner && (String(user.id) === String(bite.owner._id)))) &&
                        <>
                            <div className="header-title" style={{ marginTop: '40px' }}>Bite transaction history</div>
                            {transactions.length > 0 ?
                                <div className="transaction-history">
                                    <div className="data-table scroll-bar">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span>Date</span>
                                                            <div style={{ cursor: 'pointer' }}
                                                                onClick={() => setSort(-sort)}
                                                            >
                                                                {sort === -1 ? <DescendIcon /> : <AscendIcon />}
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th>Time</th>
                                                    <th>Username</th>
                                                    <th>In Local Currencies</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((transaction: any, index: any) => (
                                                    <tr key={index}>
                                                        <td>{new Date(transaction.createdAt).toUTCString().slice(5, 16)}</td>
                                                        <td>{new Date(transaction.createdAt).toUTCString().slice(17, 25)}</td>
                                                        <td>
                                                            {transaction.user ?
                                                                <Avatar
                                                                    avatar={transaction.user.avatar ? transaction.user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${transaction.user.avatar}` : transaction.user.avatar : ""}
                                                                    username={transaction.user.name}
                                                                    avatarStyle="horizontal"
                                                                />
                                                                :
                                                                'Deleted User'}
                                                        </td>
                                                        <td>
                                                            {transaction.type === 1 && <span style={{ color: '#D94E27' }}>- 0</span>}
                                                            {transaction.type === 2 && <span style={{ color: '#D94E27' }}>- {currencyRate ? getLocalCurrency(transaction.currency) + `${transaction.localPrice.toFixed(2)}` : ''}</span>}
                                                            {transaction.type === 3 && <span style={{ color: '#10B981' }}>+ {currencyRate ? getLocalCurrency(transaction.bite.currency) + `${transaction.bite.price.toFixed(2)}` : ''}</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {transactions.length < 5 && displayEmptyRow(5 - transactions.length)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                :
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                    <img
                                        src={NoTransactionImg}
                                        alt="Notransaction"
                                    />
                                </div>
                            }
                            <div className="share-letter">
                                <span>{transactions.length > 0 ? 'Share your Bite to others to earn more!' : 'No record yet, share your Bite to others!'}</span>
                                <div style={{ marginTop: '15px' }}>
                                    <Button
                                        text={copied ? "Link copied!" : "Copy link"}
                                        fillStyle="fill"
                                        color="primary"
                                        shape="rounded"
                                        width={'280px'}
                                        handleSubmit={() => {
                                            navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}${location.pathname}`)
                                            setCopied(true)
                                            setTimeout(() => { setCopied(false) }, 2000)
                                        }}
                                    />
                                </div>
                            </div>

                        </>
                    }
                    <div className="video-part">
                        <div className="bite-videos scroll-bar">
                            {bite?.videos.map((video: any, index: any) => (
                                <div key={index}>
                                    <div className="bite-video" onClick={() => {
                                        if (play) {
                                            if (index !== videoIndex) setVideoIndex(index)
                                            else {
                                                setPlay(false)
                                                setVideoIndex(-1)
                                            }
                                        }
                                    }} style={{ backgroundColor: bite.currency ? lock ? '#97D8D4' : '#D8F7D8' : '#FBBEB1' }}>
                                        {lock ?
                                            <>
                                                <img
                                                    src={video.coverUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.coverUrl}` : ""}
                                                    alt="cover"
                                                    width={'100%'}
                                                />
                                                <div className="lock-video"></div>
                                                <div className="lock-btn">
                                                    <Button
                                                        text="Unlock"
                                                        fillStyle="outline"
                                                        color="primary"
                                                        shape="rounded"
                                                        icon={[<LockedIcon color="#EFA058" />, <UnlockIcon color="white" />, <UnlockIcon color="white" />]}
                                                        handleSubmit={unLockBite}
                                                    />
                                                </div>
                                            </>
                                            :
                                            <>
                                                {(play && index === videoIndex) ?
                                                    <ReactPlayer
                                                        className="react-player"
                                                        url={video.videoUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.videoUrl}` : ''}
                                                        playing={play}
                                                        playsinline={true}
                                                        config={{
                                                            file: {
                                                                attributes: {
                                                                    controlsList: 'nodownload noremoteplayback noplaybackrate',
                                                                    disablePictureInPicture: true,
                                                                }
                                                            }
                                                        }}
                                                        controls
                                                    />
                                                    :
                                                    <>
                                                        <img
                                                            src={video.coverUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.coverUrl}` : ""}
                                                            alt="cover"
                                                            width={'100%'}
                                                        />
                                                        <div className="play-icon"
                                                            onClick={() => {
                                                                setVideoIndex(index)
                                                                setPlay(true)
                                                            }}
                                                        ><PlayIcon color="white" /></div>
                                                    </>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default BiteDetail