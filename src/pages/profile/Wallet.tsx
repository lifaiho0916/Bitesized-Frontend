import { useEffect, useState, useRef, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import {
    MoneyIcon,
    MoreIcon,
    BackIcon,
    AddIcon,
    VisaCardIcon,
    VisaCardActiveIcon,
    MasterCardIcon,
    MasterCardActiveIcon,
    AECardIcon,
    AECardActiveIcon,
    UnionPayCardIcon,
    UnionPayCardActiveIcon,
    DescendIcon,
    AscendIcon
} from "../../assets/svg"
import Dialog from "../../components/general/dialog"
import Button from "../../components/general/button"
import AddCardModal from "../../components/modals/AddCardModal"
import RemoveCardModal from "../../components/modals/RemoveCardModal"
import { LanguageContext } from "../../routes/authRoute"
import { transactionAction } from "../../redux/actions/transactionActions"
import { paymentAction } from "../../redux/actions/paymentActions"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/profile/profileWalletStyle.scss"

const useOutsideAlerter = (ref: any, moreInfo: any) => {
    const [more, setMore] = useState(moreInfo)
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            setMore(moreInfo)
            if (ref.current && !ref.current.contains(event.target)) {
                if (moreInfo) setMore(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [ref, moreInfo])
    return more
}

const Wallet = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const userState = useSelector((state: any) => state.auth)
    const transactionState = useSelector((state: any) => state.transaction)
    const loadState = useSelector((state: any) => state.load)
    const paymentState = useSelector((state: any) => state.payment)
    const { user } = userState
    const { transactions } = transactionState
    const { currencyRate } = loadState
    const { payment } = paymentState
    const [moreInfo, setMoreInfo] = useState(false)
    const [removeCard, setRemoveCard] = useState(false)
    const wrapRef = useRef<any>(null)
    const wrapRef1 = useRef<any>(null)
    const contexts = useContext(LanguageContext)
    const res = useOutsideAlerter(wrapRef, moreInfo)
    const res1 = useOutsideAlerter(wrapRef1, removeCard)
    const [payout, setPayout] = useState(false)
    const [sort, setSort] = useState(-1)
    const [period, setPeriod] = useState(30)

    const [openAddCard, setOpenAddCard] = useState(false)
    const [openRemoveCard, setOpenRemoveCard] = useState(false)

    const getLocalCurrency = (currency: any) => {
        const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
        let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
        return res
    }

    const getLocalCurrencyPrice = (price: any, currency: any) => {
        const rate = currency === 'usd' ? 1 : currencyRate[`${currency}`]
        return (price * rate).toFixed(2).toLocaleString()
    }

    useEffect(() => { if (!res) setMoreInfo(res) }, [res])
    useEffect(() => { if (!res1) setRemoveCard(res1) }, [res1])
    useEffect(() => { if (user) dispatch(transactionAction.getTransactionsByUserId(user.id, sort, period)) }, [location, dispatch, user, sort, period])
    useEffect(() => { dispatch(paymentAction.getPayment()) }, [dispatch, location])

    return (
        <div className="profile-wallet-wrapper">
            <div className="page-header">
                <div onClick={() => navigate(`/${user.personalisedUrl}`)}><BackIcon color="black" /></div>
                <div className="page-title"><span>My Wallet</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="profile-wallet">
                <RemoveCardModal
                    show={openRemoveCard}
                    onClose={() => setOpenRemoveCard(false)}
                    handleSubmit={() => {
                        setOpenRemoveCard(false)
                        dispatch(paymentAction.deleteCard())
                    }}
                />
                <AddCardModal
                    show={openAddCard}
                    onClose={() => setOpenAddCard(false)}
                />
                <Dialog
                    display={payout}
                    title="Payout"
                    exit={() => { setPayout(false) }}
                    wrapExit={() => { setPayout(false) }}
                    context="Please select payout method"
                    buttons={[
                        {
                            text: 'Stripe',
                            handleClick: () => {
                                setPayout(false)
                                // setStripePayout(true)
                            }
                        },
                        {
                            text: 'Fill a Form',
                            handleClick: () => {
                                setPayout(false)
                                window.open("https://www.creatogether.app/altpayout", '_blank')
                            }
                        }
                    ]}
                />
                {(user && user.earnings > 0) &&
                    <div className="cashable">
                        <div className="title">Cashable amount</div>
                        <div className="content">
                            <div className="part">
                                <div className="icon">
                                    <Button
                                        color="primary"
                                        icon={[
                                            <MoneyIcon color="white" />,
                                            <MoneyIcon color="white" />,
                                            <MoneyIcon color="white" />,
                                        ]}
                                        shape="pill"
                                        fillStyle="fill"
                                        handleSubmit={() => { }}
                                    />
                                </div>
                                <div className="number">
                                    <span>{user ? (user.earnings * 0.9).toFixed(2).toLocaleString() : 0.00} (USD)</span>
                                </div>
                            </div>
                            <div className="btn">
                                <Button
                                    color="primary"
                                    fillStyle="outline"
                                    shape="rounded"
                                    text={contexts.WALLET_LETTER.CASH_OUT}
                                    handleSubmit={() => navigate('/myaccount/setting/payout')}
                                />
                            </div>
                        </div>
                        <div className="local-currency">
                            <span>≈ {(user && currencyRate) ? (getLocalCurrencyPrice(user.earnings * 0.9, user.currency)) : 0.00} {user ? user.currency.toUpperCase() : ''}</span>
                        </div>
                    </div>
                }
                <div className="transaction-history">
                    <div className="header">
                        <div className="coin-icon"></div>
                        <div className="title">Transaction history</div>
                        <div className="time-period">
                            <select onChange={(e) => { setPeriod(Number(e.target.value)) }}>
                                <option value="30">Past 30 days</option>
                                <option value="60">Past 60 days</option>
                                <option value="-1">Anytime</option>
                            </select>
                        </div>
                    </div>
                    <div className="transactions-data">
                        {transactions.length === 0 ?
                            <div className="no-transaction">No record so far</div>
                            :
                            <div className="data-table scroll-bar" style={transactions.length <= 5 ? { height: 'fit-content' } : {}}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fee</th>
                                            <th>Detail</th>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction: any, index: any) => (
                                            <tr key={index}>
                                                <td>
                                                    {transaction.type === 2 && <span style={{ color: '#D94E27' }}>- {currencyRate ? getLocalCurrency(transaction.currency) + `${transaction.localPrice.toFixed(1)}` : ''}</span>}
                                                    {transaction.type === 3 && <span style={{ color: '#10B981' }}>+ {currencyRate ? getLocalCurrency(transaction.bite.currency) + `${transaction.bite.price.toFixed(1)}` : ''}</span>}
                                                    {(transaction.type === 6 && transaction.currency === undefined) && <span style={{ color: '#10B981' }}>+ {currencyRate ? getLocalCurrency(transaction.subscription.currency) + `${transaction.subscription.price.toFixed(1)}` : ''}</span>}
                                                    {(transaction.type === 6 && transaction.currency) && <span style={{ color: '#D94E27' }}>- {currencyRate ? getLocalCurrency(transaction.currency) + `${transaction.localPrice.toFixed(1)}` : ''}</span>}
                                                </td>
                                                <td>
                                                    <span className="detail">
                                                        {transaction.type === 2 && `Unlock Paid bite: [${transaction.bite.title}]`}
                                                        {transaction.type === 3 && `Earnings from: [${transaction.bite.title}]`}
                                                        {(transaction.type === 6 && transaction.currency) && `Subscription fee of: [${transaction.subscription.owner.name} - ${transaction.subscription.planName}]`}
                                                        {(transaction.type === 6 && transaction.currency === undefined) &&`Subscription from: [${transaction.subscription.subscriber.name}]`}
                                                    </span>
                                                </td>
                                                <td>{new Date(transaction.createdAt).toUTCString().slice(5, 11)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
                <div className="card-info">
                    <div className="card-info-header">
                        <div className="coin-icon"></div>
                        <div className="title">
                            <span>Payment details</span>
                        </div>
                        {payment ?
                            <div className="more-icon">
                                <div onClick={() => setRemoveCard(true)}><MoreIcon color="black" /></div>
                                <div className="drop-down-list" style={removeCard === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef1}>
                                    <div className="list" onClick={() => {
                                        setRemoveCard(false)
                                        setOpenRemoveCard(true)
                                    }}>Remove card</div>
                                </div>
                            </div> :
                            <div style={{ width: '22px' }}></div>
                        }
                    </div>
                    {payment ?
                        <div className="user-card">
                            <div className="card-type">
                                <div className="card">{payment.stripe.cardType === "visa" ? <VisaCardActiveIcon /> : <VisaCardIcon />}</div>
                                <div className="card">{payment.stripe.cardType === "mastercard" ? <MasterCardActiveIcon /> : <MasterCardIcon />}</div>
                                <div className="card">{payment.stripe.cardType === "amex" ? <AECardActiveIcon /> : <AECardIcon />}</div>
                                <div className="card">{payment.stripe.cardType === "unionpay" ? <UnionPayCardActiveIcon /> : <UnionPayCardIcon />}</div>
                            </div>
                            <div className="card-number">
                                <span>···· ···· ···· {payment.stripe.cardNumber}</span><br />
                                <span>Name: {payment.stripe.cardHolder}</span>
                            </div>
                        </div> :
                        <>
                            <div className="no-records">
                                <span>No record so far</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    text="Add new card"
                                    fillStyle="fill"
                                    color="primary"
                                    shape="rounded"
                                    width={'250px'}
                                    icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                                    handleSubmit={() => setOpenAddCard(true)}
                                />
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Wallet
