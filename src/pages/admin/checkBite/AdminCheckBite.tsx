import { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Avatar from "../../../components/general/avatar"
import TeaserCard from "../../../components/general/TeaserCard"
import { biteAction } from "../../../redux/actions/biteActions"
import { BackIcon, ClockIcon, DescendIcon, AscendIcon } from "../../../assets/svg"
import { LanguageContext } from "../../../routes/authRoute"
import { transactionAction } from "../../../redux/actions/transactionActions"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/admin/editBite/AdminEditBiteStyle.scss"

const AdminCheckBite = () => {
    const { biteId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const contexts = useContext(LanguageContext)
    const biteState = useSelector((state: any) => state.bite)
    const transactionState = useSelector((state: any) => state.transaction)
    const loadState = useSelector((state: any) => state.load)
    const [sort, setSort] = useState(-1)
    const { bite } = biteState
    const { transactions } = transactionState
    const { currencyRate } = loadState

    const getUSD = (biteCurrency: any, price: any) => {
        const rate = biteCurrency === 'usd' ? 1 : currencyRate[`${biteCurrency}`]
        return price / rate
    }

    const getLocalCurrency = (currency: any) => {
        const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
        let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
        return res
    }

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

    useEffect(() => { dispatch(biteAction.getBiteById(biteId)) }, [biteId])
    useEffect(() => { dispatch(transactionAction.getTransactionsByBiteId(biteId, sort)) }, [biteId, sort])

    return (
        <div className="admin-edit-bite-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/admin/check-bite')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Check Bite</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="edit-bite">
                <div className="header-title">Bite detail</div>
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
                    </div>
                    <div className="bite-title">
                        <span>{bite?.title}</span>
                    </div>
                </div>
                <div className="edit-video">
                    <div className="bite-videos">
                        {bite.videos.map((video: any, index: any) => (
                            <div key={index}>
                                <div className="bite-video" >
                                    <TeaserCard
                                        cover={video.coverUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.coverUrl}` : ""}
                                        teaser={video.videoUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.videoUrl}` : ""}
                                        type={"dareme"}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="header-title" style={{ marginTop: '40px' }}>Bite transaction history</div>
                <div className="transaction-history">
                    <div className="data-table scroll-bar" style={transactions.length <= 5 ? { height: 'fit-content' } : {}}>
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
                                    <th>In USD</th>
                                    <th>In Local Currencies</th>
                                </tr>
                            </thead>
                            {transactions.length > 0 &&
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
                                                {transaction.type === 2 && <span style={{ color: '#D94E27' }}>- {currencyRate ? (getUSD(transaction.bite.currency, transaction.bite.price)).toFixed(2) : ''}</span>}
                                                {transaction.type === 3 && <span style={{ color: '#10B981' }}>+ {currencyRate ? (getUSD(transaction.bite.currency, transaction.bite.price)).toFixed(2) : ''}</span>}
                                            </td>
                                            <td>
                                                {transaction.type === 1 && <span style={{ color: '#D94E27' }}>- 0</span>}
                                                {transaction.type === 2 && <span style={{ color: '#D94E27' }}>- {currencyRate ? getLocalCurrency(transaction.currency) + `${transaction.localPrice.toFixed(2)}` : ''}</span>}
                                                {transaction.type === 3 && <span style={{ color: '#10B981' }}>+ {currencyRate ? getLocalCurrency(transaction.bite.currency) + `${transaction.bite.price.toFixed(2)}` : ''}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminCheckBite