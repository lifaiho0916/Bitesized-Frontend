import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import Tabs from "../../../components/general/Tabs"
import { SearchIcon, AscendIcon, DescendIcon } from "../../../assets/svg"
import { subScriptionAction } from "../../../redux/actions/subScriptionActions"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/admin/transaction/AdminTransactionStyle.scss"

const AdminSubscriptionList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const subscriptionState = useSelector((state: any) => state.subScription)
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState(-1)
    const { subScriptions } = subscriptionState
    const [option, setOption] = useState(0)
    const [searchParams] = useSearchParams()
    const code = searchParams.get('tab')

    const getLocalCurrency = (currency: any) => {
        const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
        let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
        return res
    }

    useEffect(() => { 
        dispatch(subScriptionAction.getSubScriptions(code === null ? 'all' : code, sort, search))
        if(code === null) setOption(0)
        else if(code === "ongoing") setOption(1)
        else setOption(2)
    }, [dispatch, sort, code])

    return (
        <div className="transaction-wrapper">
            <div className="transaction">
                <div className="transaction-header">
                    <div className="header-title">
                        <span>List of subscription </span>
                    </div>
                </div>
                <div className="navigate-btns">
                    <Tabs
                        tabWidth="120px"
                        list={[
                            { 
                                text: "All",
                                route: `${location.pathname}`
                            }, 
                            { 
                                text: "On-going",
                                route: `${location.pathname}?tab=ongoing`
                            },
                            {
                                text: 'Hidden',
                                route: `${location.pathname}?tab=hidden`
                            },
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
                        onKeyUp={(e) => { if (e.keyCode === 13) dispatch(subScriptionAction.getSubScriptions(code === null ? 'all' : code, sort, search))
                    }}
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
                                <th>Owner</th>
                                <th>Name</th>
                                <th>
                                    <span>Sub fee/month</span>
                                    <br/>
                                    <span>In USD</span>
                                </th>
                                <th>
                                    <span>Sub fee/month</span>
                                    <br/>
                                    <span>In Local Currencies</span>
                                </th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        {subScriptions.length > 0 &&
                            <tbody>
                                {subScriptions.map((subscription: any, index: any) => (
                                    <tr key={index}>
                                        <td>{new Date(subscription.createdAt).toUTCString().slice(5, 16)}</td>
                                        <td>{new Date(subscription.createdAt).toUTCString().slice(17, 25)}</td>
                                        <td>{subscription.user ? subscription.user.name : 'Deleted User'}</td>
                                        <td>{subscription.name}</td>
                                        <td>{JSON.parse(subscription.multiPrices)['usd'].toFixed(1)}</td>
                                        <td>{getLocalCurrency(subscription.currency) + JSON.parse(subscription.multiPrices)[subscription.currency]}</td>
                                        <td>{subscription.visible ? 'On-going' : 'Hidden' }</td>
                                        <td>
                                            <div className="see-more-btn" onClick={() => navigate(`/admin/subscription/${subscription.user._id}`)}>
                                                <span>see more</span>
                                            </div>
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

export default AdminSubscriptionList