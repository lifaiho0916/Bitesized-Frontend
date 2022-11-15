import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import Button from "../../../components/general/button"
import { SearchIcon } from "../../../assets/svg"
import { transactionAction } from "../../../redux/actions/transactionActions"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/admin/transaction/AdminTransactionStyle.scss"

const AdminTransaction = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const transactionState = useSelector((state: any) => state.transaction)
    const loadState = useSelector((state: any) => state.load)
    const [searchParams] = useSearchParams()
    const code = searchParams.get('type')
    const [search, setSearch] = useState("")
    const { transactions } = transactionState
    const { currencyRate } = loadState

    const getUSD = (biteCurrency: any, price: any) => {
        const rate = biteCurrency === 'usd' ? 1 : currencyRate[`${biteCurrency}`]
        return price / rate
    }

    const getLocalCurrency = (currency: any) => {
        const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
        let res = CONSTANT.CURRENCY_SYMBOLS[index]
        return res
    }

    useEffect(() => {
        dispatch(transactionAction.getTransactions(code === null ? 'all' : code, search))
    }, [code, location])

    return (
        <div className="transaction-wrapper">
            <div className="transaction">
                <div className="navigate-btns">
                    <div className="btn">
                        <Button
                            text="All record"
                            fillStyle={code === null ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction')}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="Paid Bite"
                            fillStyle={code === 'paid' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction?type=paid')}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="FREE Bite"
                            fillStyle={code === 'free' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction?type=free')}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="Earnings"
                            fillStyle={code === 'earn' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction?type=earn')}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="Cash out"
                            fillStyle={code === 'cash' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction?type=cash')}
                        />
                    </div>
                </div>
                <div className="search-bar">
                    <SearchIcon color="#EFA058" />
                    <input
                        placeholder="Username"
                        className="search-input"
                        onChange={(e) => { setSearch(e.target.value) }}
                        onKeyUp={(e) => { if (e.keyCode === 13) dispatch(transactionAction.getTransactions(code === null ? 'all' : code, search)) }}
                    />
                </div>
                <div className="users-data scroll-bar">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
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