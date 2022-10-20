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
    const { user } = userState
    const { transactions } = transactionState
    const [openConnectStripe, setOpenConnectStripe] = useState(false)
    const [moreInfo, setMoreInfo] = useState(false)
    const wrapRef = useRef<any>(null)
    const contexts = useContext(LanguageContext)
    const [amount, setAmount] = useState('')
    const [stripePayout, setStripePayout] = useState(false)
    const res = useOutsideAlerter(wrapRef, moreInfo)
    const [payout, setPayout] = useState(false)

    useEffect(() => { if (!res) setMoreInfo(res) }, [res])
    useEffect(() => { if(user) dispatch(transactionAction.getTransactions(0, "", user.id)) }, [location, dispatch])

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
                                    setMoreInfo(false);
                                    dispatch({ type: SET_TRANSACTIONS, payload: [] });
                                    //   dispatch(transactionActions.getUserTransactionsByDays(30));
                                    navigate(`/myaccount/wallet/donuts-transactions`);
                                }}>
                                    {contexts.WALLET_LETTER.FIRST_DAYS}
                                </div>
                                <div className="list" onClick={() => {
                                    setMoreInfo(false);
                                    dispatch({ type: SET_TRANSACTIONS, payload: [] });
                                    //   dispatch(transactionActions.getUserTransactionsByDays(60));
                                    navigate(`/myaccount/wallet/donuts-transactions`);
                                }}>
                                    {contexts.WALLET_LETTER.SECOND_DAYS}
                                </div>
                                <div className="list" onClick={() => {
                                    setMoreInfo(false);
                                    dispatch({ type: SET_TRANSACTIONS, payload: [] });
                                    //   dispatch(transactionActions.getUserTransactionsByDays(0));
                                    navigate(`/myaccount/wallet/donuts-transactions`);
                                }}>
                                    {contexts.WALLET_LETTER.ALL_DAYS}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="transactions-data">
                        {transactions.length === 0 ?
                            <div className="no-transaction">No record so far</div>
                            :
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Fee</th>
                                        <th>Detail</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                {/* {users.length > 0 &&
                                    <tbody>
                                        {users.map((user: any, index: any) => {
                                            if (user.date) {
                                                return (
                                                    <tr key={index} onClick={() => {
                                                        dispatch({
                                                            type: SET_PROFILE,
                                                            payload: {
                                                                category: [],
                                                                avatar: null,
                                                                name: null,
                                                                personalisedUrl: null,
                                                                bioText: null
                                                            }
                                                        })
                                                        dispatch({ type: SET_NAME_EXIST, payload: false })
                                                        dispatch({ type: SET_URL_EXIST, payload: false })
                                                        navigate('/admin/profile-user/edit', { state: { index: index + 1 } })
                                                    }}>
                                                        <td>{new Date(user.date).toUTCString().slice(5, 11)} {new Date(user.date).toUTCString().slice(14, 16)}</td>
                                                        <td>
                                                            <Avatar
                                                                size="small"
                                                                avatar={user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : user.avatar}
                                                                username={user.name}
                                                                avatarStyle="horizontal"
                                                            />
                                                        </td>
                                                        <td>{user.role === "ADMIN" ? '***' : `$ ${user.earnings ? user.earnings.toFixed(2) : '0.00'}`}</td>
                                                        <td>{user.email}</td>
                                                        <td style={{ textAlign: 'center' }}>{user.videoCnt}</td>
                                                        <td style={{ textAlign: 'center' }}>{user.biteCnt}</td>
                                                        <td></td>
                                                        <td style={{ textAlign: 'center' }}>{user.visible ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" />}</td>
                                                    </tr>
                                                )
                                            }
                                        })}
                                    </tbody>
                                } */}
                            </table>
                        }
                    </div>
                    {/* {transactions.length > 0 &&
                transactions.map((transaction: any, index: any) => (
                  <div className="row" key={index}>
                    <div className="col1">
                      <CreatoCoinIcon color={calcColor(transaction?.description, transaction?.user1) ? "#27AE60" : "#AE0000"} />
                      <div style={calcColor(transaction?.description, transaction?.user1) ? { color: "#27AE60" } : { color: "#AE0000" }} >{transaction.description === 3 ? 0 : (transaction.donuts).toLocaleString()}</div>
                    </div>
                    <div className="col2">
                      <div>
                        {transaction.description === 2 && `Purchase - ${transaction.donuts} Donuts`}
                        {transaction.description === 3 && `Vote Donut x1`}
                        {transaction.description === 4 && "Earnings from DareMe"}
                        {transaction.description === 5 && "Vote as SuperFans"}
                        {transaction.description === 6 && "Dare Request"}
                        {transaction.description === 7 && "Donuts Refund"}
                        {(transaction.description === 9 || transaction.description === 8) && "Tipping Donuts"}
                        {transaction.description === 10 && "Unlock Exclusive Content"}
                      </div>
                    </div>
                    <div className="col3">
                      <div>{new Date(transaction?.date).toUTCString().slice(5, 11)}</div>
                    </div>
                  </div>
                ))
              } */}
                </div>
            </div>
        </div>
    )
}

export default Wallet
