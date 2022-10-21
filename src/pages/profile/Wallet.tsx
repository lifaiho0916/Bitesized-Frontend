import { useEffect, useState, useRef, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import {
    BalanceIcon,
    MoneyIcon,
    MoreIcon,
    SpreadIcon,
    StripeIcon,
    BackIcon
} from "../../assets/svg"
import Dialog from "../../components/general/dialog"
import Button from "../../components/general/button"
import ContainerBtn from "../../components/general/containerBtn"
import { LanguageContext } from "../../routes/authRoute"
import { SET_PREVIOUS_ROUTE, SET_TRANSACTIONS } from "../../redux/types"
import { transactionAction } from "../../redux/actions/transactionActions"
import "../../assets/styles/profile/profileWalletStyle.scss"

const useOutsideAlerter = (ref: any, moreInfo: any) => {
    const [more, setMore] = useState(moreInfo);
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            setMore(moreInfo);
            if (ref.current && !ref.current.contains(event.target)) {
                if (moreInfo) setMore(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, moreInfo]);
    return more;
}

const Wallet = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const userState = useSelector((state: any) => state.auth)
    const transactionState = useSelector((state: any) => state.transaction)
    const loadState = useSelector((state: any) => state.load)
    const { user } = userState
    const { transactions } = transactionState
    const { currencyRate } = loadState
    const [openConnectStripe, setOpenConnectStripe] = useState(false)
    const [moreInfo, setMoreInfo] = useState(false)
    const wrapRef = useRef<any>(null)
    const contexts = useContext(LanguageContext)
    const [amount, setAmount] = useState('')
    const [stripePayout, setStripePayout] = useState(false)
    const res = useOutsideAlerter(wrapRef, moreInfo)
    const [payout, setPayout] = useState(false)

    const getLocalCurrency = (currency: any) => {
        let res = ''
        if (currency === 'usd') res += 'US $'
        else if (currency === 'hkd') res += 'HK $'
        else if (currency === 'inr') res += 'Rp ₹'
        else if (currency === 'twd') res += 'NT $'
        else res += 'RM '
        return res
    }

    const getLocalCurrencyPrice = (price: any, currency: any) => {
        const rate = currency === 'usd' ? 1 : currencyRate[`${currency}`]
        return (price * rate).toFixed(2).toLocaleString()
    }

    useEffect(() => { if (!res) setMoreInfo(res) }, [res])
    useEffect(() => { if (user) dispatch(transactionAction.getTransactions(0, "", user.id)) }, [location, dispatch, user])

    return (
        <div className="profile-wallet-wrapper">
            <div className="page-header">
                <div onClick={() => navigate(`/${user.personalisedUrl}`)}><BackIcon color="black" /></div>
                <div className="page-title"><span>My Wallet</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="profile-wallet">
                <Dialog
                    display={openConnectStripe}
                    wrapExit={() => { setOpenConnectStripe(false); }}
                    title="Stay tuned!"
                    context={"We will be launching this\nfeature soon."}
                    icon={{
                        pos: 0,
                        icon: <SpreadIcon color="#EFA058" width="60px" height="60px" />
                    }}
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
                                setStripePayout(true)
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
                                handleSubmit={() => {
                                    // setPayout(true) 
                                    setOpenConnectStripe(true)
                                }}
                            />
                        </div>
                    </div>
                    <div className="local-currency">
                        <span>≈ {(user && currencyRate) ? (getLocalCurrencyPrice(user.earnings * 0.9, user.currency)) : 0.00} {user ? user.currency.toUpperCase() : ''}</span>
                    </div>
                </div>
                <div className="transaction-history">
                    <div className="header">
                        <div className="coin-icon">
                            <MoneyIcon color="black" />
                        </div>
                        <div className="title">Transaction history</div>
                        <div className="more-icon">
                            <div onClick={() => { setMoreInfo(true) }}><MoreIcon color="black" /></div>
                            <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
                                <div className="list" onClick={() => {
                                    setMoreInfo(false)
                                    dispatch(transactionAction.getTransactions(1, "", user.id))
                                }}>
                                    {contexts.WALLET_LETTER.FIRST_DAYS}
                                </div>
                                <div className="list" onClick={() => {
                                    setMoreInfo(false)
                                    dispatch(transactionAction.getTransactions(2, "", user.id))
                                }}>
                                    {contexts.WALLET_LETTER.SECOND_DAYS}
                                </div>
                                <div className="list" onClick={() => {
                                    setMoreInfo(false)
                                    dispatch(transactionAction.getTransactions(3, "", user.id))
                                }}>
                                    {"Anytime"}
                                </div>
                            </div>
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
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction: any, index: any) => (
                                            <tr key={index}>
                                                <td>
                                                    {transaction.type === 2 && <span style={{ color: '#D94E27' }}>{currencyRate ? getLocalCurrency(transaction.currency) + `${transaction.localPrice.toFixed(1)}` : ''}</span>}
                                                    {transaction.type === 3 && <span style={{ color: '#10B981' }}>{currencyRate ? getLocalCurrency(transaction.bite.currency) + `${transaction.bite.price.toFixed(1)}` : ''}</span>}
                                                </td>
                                                <td>
                                                    <span className="detail">
                                                        {transaction.type === 2 && `Unlock Paid bite: [${transaction.bite.title}]`}
                                                        {transaction.type === 3 && `Earnings from: [${transaction.bite.title}]`}
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
            </div>
        </div>
    )
}

export default Wallet