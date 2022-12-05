import { useEffect, useState, useContext, useMemo, useLayoutEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import TextareaAutosize from 'react-textarea-autosize'
import Avatar from "../../components/general/avatar"
import Button from "../../components/general/button"
import Input from "../../components/general/input"
import ReactPlayer from "react-player"
import UnLockFreeModal from "../../components/modals/UnLockModal"
import PurchaseModal from "../../components/modals/PurchaseModal"
import PaymentModal from "../../components/modals/PaymentModal"
import DelCommentModal from "../../components/modals/DelCommentModal"
import AddCardModal from "../../components/modals/AddCardModal"
import SubscribeModal from "../../components/modals/SubscribeModal"
import SubscribeSuccessModal from "../../components/modals/SubscribeSoccessModal"
import BiteCardProfile from "../../components/bite/BiteCardProfile"
import CommentBubble from "../../components/bite/CommentBubble"
import { BackIcon, ClockIcon, UnlockIcon, AscendIcon, DescendIcon, LockedIcon, Bite1Icon, BiteIcon, CommentIcon, SendIcon, CheckIcon } from "../../assets/svg"
import { LanguageContext } from "../../routes/authRoute"
import { biteAction } from "../../redux/actions/biteActions"
import { paymentAction } from "../../redux/actions/paymentActions"
import { subScriptionAction } from "../../redux/actions/subScriptionActions"
import { transactionAction } from "../../redux/actions/transactionActions"
import { SET_DIALOG_STATE, SET_PREVIOUS_ROUTE } from "../../redux/types"
import { getLocalCurrency } from "../../constants/functions"
import NoTransactionImg from "../../assets/img/no-bite-transaction.png"
import "../../assets/styles/bite/BiteDetailStyle.scss"

const useWindowSize = () => {
    const [size, setSize] = useState(0)
    useLayoutEffect(() => {
        const updateSize = () => { setSize(window.innerWidth) }
        window.addEventListener("resize", updateSize)
        updateSize()
        return () => window.removeEventListener("resize", updateSize)
    }, [])
    return size
}

const BiteDetail = () => {
    const { biteId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const width = useWindowSize()
    const contexts = useContext(LanguageContext)
    const loadState = useSelector((state: any) => state.load)
    const userState = useSelector((state: any) => state.auth)
    const biteState = useSelector((state: any) => state.bite)
    const transactionState = useSelector((state: any) => state.transaction)
    const paymentState = useSelector((state: any) => state.payment)
    const subscriptionState = useSelector((state: any) => state.subScription)

    const { state } = location
    const { payment } = paymentState
    const { prevRoute, dlgState, currencyRate } = loadState
    const { bite, bites } = biteState
    const { user } = userState
    const { transactions } = transactionState
    const { subScription } = subscriptionState

    const [sort, setSort] = useState(-1)
    const [copied, setCopied] = useState(false)
    const [currency, setCurrency] = useState('usd')
    const [comment, setComment] = useState('')
    const [deleteIndex, setDeleteIndex] = useState(-1)
    const [card, setCard] = useState(false)

    const [openFreeUnlock, setOpenFreeUnLock] = useState(false)
    const [openPurchaseModal, setOpenPurchaseModal] = useState(false)
    const [openPaymentModal, setOpenPaymentModal] = useState(false)
    const [openDeleteCommentModal, setOpenDeleteCommentModal] = useState(false)
    const [openSubscribeModal, setOpenSubscribeModal] = useState(false)
    const [openAddCardModal, setOpenAddCardModal] = useState(false)
    const [openSubscribeSuccessModal, setOpenSubscribeSuccessModal] = useState(false)

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

    const isOwner = useMemo(() => {
        if (user && bite.owner && (String(user.id) === String(bite.owner._id))) return true
        else return false
    }, [user, bite])

    const localPrice = useMemo(() => {
        if (currencyRate && bite.owner) {
            const rate = bite.currency === 'usd' ? 1.0 : currencyRate[`${bite.currency}`]
            const usdAmount = bite.price / rate
            let rate1: any
            if(user) rate1 = user.currency === 'usd' ? 1.0 : currencyRate[`${user.currency}`]
            else rate1 = 1.0
            const price = usdAmount * rate1
            return price.toFixed(2)
        }
    }, [bite, user, currencyRate])

    const subscribed = useMemo(() => {
        if(subScription && user) {
          const fitlers = subScription.subscribers.filter((subscriber: any) => (String(subscriber.user) === String(user.id)) && subscriber.status === true)
          if(fitlers.length > 0) return true
          else return false
        } return false
      }, [subScription, user])

    const unLockBite = () => {
        if (user) {
            if (bite.currency) {
                if(subscribed) { 
                    dispatch(biteAction.unLockBite(bite._id, bite.currency, bite.price, null, null, null, null, true))
                }
                else setOpenPurchaseModal(true)
            }
            else dispatch(biteAction.unLockBite(bite._id, bite.currency, bite.price, null, null, null, null, false))
        } else {
            dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname })
            navigate('/auth/signin')
        }
    }

    const sendComment = () => {
        dispatch(biteAction.sendComment(biteId, comment))
        setComment("")
    }

    const subscribe = () => {
        if(user) setOpenSubscribeModal(true)
        else navigate('/auth/signup')
    }

    const handleSubscribe = () => {
        setOpenSubscribeModal(false)
        if(payment) dispatch(subScriptionAction.subscribePlan(subScription._id, currency))
        else {
            setCard(true)
            setOpenAddCardModal(true)
        }
    }

    const categoryText = useMemo(() => {
        if (bite.owner) {
          if (bite.owner.categories.length === 0) return ""
          else {
            let categories = bite.owner.categories
            let texts = ""
            categories.sort((a: any, b: any) => { return a > b ? 1 : a < b ? -1 : 0 })
            categories.forEach((categoryIndex: any, index: any) => {
              texts += contexts.CREATOR_CATEGORY_LIST[categoryIndex]
              if (index < categories.length - 1) texts += "/"
            })
            return texts
          }
        }
      }, [bite, contexts.CREATOR_CATEGORY_LIST])

    useEffect(() => {
        if (user) dispatch(paymentAction.getPayment())
        dispatch(biteAction.getBiteById(biteId))
    }, [biteId, dispatch, user])
    useEffect(() => { if (dlgState === 'unlock_bite') setOpenFreeUnLock(true) }, [dlgState])
    useEffect(() => { if (isOwner) dispatch(transactionAction.getTransactionsByBiteId(biteId, sort)) }, [isOwner, biteId, sort, dispatch])
    useEffect(() => { if (bite.owner && isOwner === false) {
        dispatch(biteAction.getBitesByUserIdAndCategory(bite.owner._id, bite._id)) 
        dispatch(subScriptionAction.getSubScription(bite.owner._id))
    }}, [bite.title, isOwner, dispatch])
    useEffect(() => {
        if (bite.comments && bite.comments.length) {
            const buffer: any = document.getElementById("scroll")
            buffer.scrollTop = buffer.scrollHeight
        }
    }, [bite])
    useEffect(() => {
        if(payment && card) {
          dispatch(subScriptionAction.subscribePlan(subScription._id, currency))
          setCard(false)
        }
      }, [payment, card, currency, subScription, dispatch])

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
            {bite.title &&
                <div className="bite-detail">
                    <AddCardModal
                        show={openAddCardModal}
                        onClose={() => setOpenAddCardModal(false)}
                    />
                    <SubscribeModal
                        show={openSubscribeModal}
                        onClose={() => setOpenSubscribeModal(false)}
                        profileUser={{
                            avatar: bite.owner.avatar,
                            name: bite.owner.name
                        }}
                        categoryText={categoryText}
                        subScription={subScription}
                        setCurrency={setCurrency}
                        handleSubmit={handleSubscribe}
                    />
                    <SubscribeSuccessModal
                        show={openSubscribeSuccessModal}
                        creatorName={bite.owner.name}
                        subscriptionName={subScription?.name}
                        onClose={() => {
                        dispatch({ type: SET_DIALOG_STATE, payload: "" })
                        setOpenSubscribeSuccessModal(false)}
                        }
                        handleSubmit={() => {
                        dispatch({ type: SET_DIALOG_STATE, payload: "" })
                        setOpenSubscribeSuccessModal(false)
                        navigate(`/${user?.personalisedUrl}?tab=subscription`)
                        }}
                    />
                    <UnLockFreeModal
                        show={openFreeUnlock}
                        onClose={() => {
                            setOpenFreeUnLock(false)
                            dispatch({ type: SET_DIALOG_STATE, payload: "" })
                        }}
                        bite={bite}
                        subscribed={true}
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
                    <DelCommentModal
                        show={openDeleteCommentModal}
                        onClose={() => setOpenDeleteCommentModal(false)}
                        handleSubmit={() => {
                            setOpenDeleteCommentModal(false)
                            dispatch(biteAction.deleteComment(biteId, deleteIndex))
                        }}
                    />
                    <div className="main-detail">
                        <div className="avatar-title">
                            <div className="left-time">
                                <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;<span>{displayTime(bite?.time)}</span>
                            </div>
                            <div className="avatar">
                                <Avatar
                                    avatar={bite.owner.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${bite.owner.avatar}` : bite.owner.avatar}
                                    username={bite.owner.name}
                                    avatarStyle={"horizontal"}
                                    handleClick={() => navigate(`/${bite.owner.personalisedUrl}`)}
                                />
                                 {(subScription && subScription.visible) &&
                                    <>
                                        {subscribed ?
                                            <Button
                                            text="Subscribed"
                                            fillStyle="outline"
                                            color="primary"
                                            shape="rounded"
                                            icon={[<CheckIcon color="#EFA058"/>, <CheckIcon color="white"/>, <CheckIcon color="white"/>]}
                                            handleSubmit={() => navigate(`/${user.personalisedUrl}?tab=subscription`)}
                                            />
                                            :
                                            <Button
                                            text="Subscribe"
                                            fillStyle="fill"
                                            color="primary"
                                            shape="rounded"
                                            handleSubmit={subscribe}
                                            />
                                        }
                                    </>
                                }
                            </div>
                            <div className="status-chip">
                                <div className={`chip ${bite.currency ? 'paid' : 'free'}`}>
                                    {bite.currency ? getLocalCurrency(user ? user.currency : 'usd') + localPrice : 'Free'}
                                </div>
                                {!lock &&
                                    <div className={`chip ${(state && state.owner === true) ? 'mine' : 'unlock'}`}>
                                        {(state && state.owner === true) ? 'My Bite' : 'Unlocked'}
                                    </div>
                                }
                            </div>
                            <div className="bite-title">
                                <span>{bite.title}</span>
                            </div>
                        </div>
                        {lock &&
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    text={ subscribed ? "Unlock this bite for free" : "Unlock this bite"}
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
                    {isOwner &&
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
                            {bite.videos.map((video: any, index: any) => (
                                <div key={index}>
                                    <div className="bite-video" style={{ backgroundColor: bite.currency ? lock ? '#97D8D4' : '#D8F7D8' : '#FBBEB1' }}>
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
                                            <ReactPlayer
                                                className="react-player"
                                                url={video.videoUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.videoUrl}` : ''}
                                                playing={true}
                                                config={{
                                                    file: {
                                                        attributes: {
                                                            controlsList: 'nodownload noremoteplayback noplaybackrate',
                                                            disablePictureInPicture: true,
                                                        }
                                                    }
                                                }}
                                                light={video.coverUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.coverUrl}` : ''}
                                                controls
                                            />
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="comment">
                        <div className="section-header">
                            <CommentIcon color="#EFA058" width={25} height={25} /><span>Comments</span>
                        </div>
                        <div className="comment-body">
                            {bite.comments.length > 0 ?
                                <div className="bubble-part scroll-bar-lg" id="scroll">
                                    {bite.comments.map((comment: any, index: any) => (
                                        <div className="bubble" key={index} style={(user && String(comment.commentedBy._id) === String(user.id)) && width > 680 ? { marginLeft: 'auto' } : {}}>
                                            <CommentBubble
                                                comment={comment}
                                                isOwnBite={user && bite.owner && String(user.id) === String(bite.owner._id) ? true : false}
                                                isOwnComment={(user && String(comment.commentedBy._id) === String(user.id)) ? true : false}
                                                index={index}
                                                deleteComment={(i: any) => {
                                                    setDeleteIndex(i)
                                                    setOpenDeleteCommentModal(true)
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                :
                                <div className="no-comments">
                                    <span>Be the first one to comment</span>
                                </div>
                            }
                            {
                                (user && !lock) &&
                                <div className="input-comment">
                                    <div style={{ width: comment === "" ? '100%' : 'calc(100% - 60px)' }}>
                                        {
                                            width < 680 ?
                                                <div className="mobile-input">
                                                    <div className="input-part">
                                                        <TextareaAutosize
                                                            minRows={1}
                                                            maxRows={3}
                                                            onChange={e => setComment(e.target.value)}
                                                            value={comment}
                                                            maxLength={200}
                                                            placeholder="Add a comment"
                                                        />
                                                    </div>
                                                    <div className="word-count">
                                                        <span>({comment.length}/200 characters)</span>
                                                    </div>
                                                </div>
                                                :
                                                <Input
                                                    type={"input"}
                                                    placeholder="Add a comment"
                                                    title={comment}
                                                    setTitle={setComment}
                                                    width={'100%'}
                                                    wordCount={200}
                                                />
                                        }
                                    </div>
                                    {comment !== "" &&
                                        <div className="send-btn" onClick={sendComment}>
                                            <SendIcon color="white" width={22} height={22} />
                                        </div>
                                    }
                                </div>
                            }
                        </div >
                    </div >

                    {isOwner === false &&
                        <>
                            {bites.filter((bite: any) => bite.isCreator === true).length > 0 &&
                                <div className="creator-bites">
                                    <div className="section-header">
                                        <Bite1Icon color="#EFA058" width={width < 680 ? 50 : 30} height={width < 680 ? 50 : 30} />
                                        <span>Other Bite-sized knowledge from this creator</span>
                                    </div>
                                    <div className="bite-card">
                                        {bites.filter((bite: any) => bite.isCreator === true).map((bite: any, index: any) => (
                                            <div className="profile-bite" key={index}>
                                                <BiteCardProfile bite={bite} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }

                            {bites.filter((bite: any) => bite.isCreator === false).length > 0 &&
                                <div className="creator-bites" style={{ marginTop: '20px' }}>
                                    <div className="section-header">
                                        <BiteIcon color="#EFA058" width={width < 680 ? 45 : 25} height={width < 680 ? 45 : 25} />
                                        <span>Featured Bite-sized knowledge you may like</span>
                                    </div>
                                    <div className="bite-card">
                                        {bites.filter((bite: any) => bite.isCreator === false).map((bite: any, index: any) => (
                                            <div className="profile-bite" key={index}>
                                                <BiteCardProfile bite={bite} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div >
            }
        </div >
    )
}

export default BiteDetail