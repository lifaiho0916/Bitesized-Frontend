import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import Tabs from "../../../components/general/Tabs"
import { SearchIcon, AscendIcon, DescendIcon } from "../../../assets/svg"
import { transactionAction } from "../../../redux/actions/transactionActions"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/admin/transaction/AdminTransactionStyle.scss"

const AdminTransaction = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const transactionState = useSelector((state: any) => state.transaction)
    const loadState = useSelector((state: any) => state.load)
    const [searchParams] = useSearchParams()
    const code = searchParams.get('tab')
    const [option, setOtpion] = useState(0)
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState(-1)
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

    useEffect(() => {
        dispatch(transactionAction.getTransactions(code === null ? 'all' : code, search, sort))
        if(code === null) setOtpion(0)
        else if(code === "paid") setOtpion(1)
        else if(code === "free") setOtpion(2)
        else if(code === "earn") setOtpion(3)
        else if(code === "cash") setOtpion(4)
        else setOtpion(5)
    }, [code, location, dispatch, sort])

    return (
        <div className="transaction-wrapper">
            <div className="transaction">
                <div className="navigate-btns">
                    <Tabs
                        tabWidth="100px"
                        list={[
                            { 
                                text: "All record",
                                route: `${location.pathname}`
                            }, 
                            { 
                                text: "Paid Bite",
                                route: `${location.pathname}?tab=paid`
                            },
                            {
                                text: 'FREE Bite',
                                route: `${location.pathname}?tab=free`
                            },
                            {
                                text: 'Earnings',
                                route: `${location.pathname}?tab=earn`
                            },
                            {
                                text: 'Cash out',
                                route:  `${location.pathname}?tab=cash`
                            },
                            {
                                text: 'Subscription',
                                route:  `${location.pathname}?tab=subscription`
                            }
                        ]}
                        initialOption={option}
                    />
                </div>
                <div className="search-bar">
                    <SearchIcon color="#EFA058" />
                    <input
                        placeholder="Username"
                        className="search-input"
                        onChange={(e) => { setSearch(e.target.value) }}
                        onKeyUp={(e) => { if (e.keyCode === 13) dispatch(transactionAction.getTransactions(code === null ? 'all' : code, search, sort)) }}
                    />
                </div>
                <div className="users-data scroll-bar">
                    <table className="data-table">
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
                                <th>Description</th>
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
                                        <td>{transaction.user ? transaction.user.name : 'Deleted User'}</td>
                                        <td>
                                            {transaction.type === 1 && `Unlock FREE bite: [${transaction.bite.title}]`}
                                            {transaction.type === 2 && `Unlock Paid bite: [${transaction.bite.title}]`}
                                            {transaction.type === 3 && `Earnings from paid bite: [${transaction.bite.title}]`}
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
    )
}

export default AdminTransaction