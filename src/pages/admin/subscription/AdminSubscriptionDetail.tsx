import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { BackIcon, EditIcon, HiddenIcon, VisibleIcon, ForwardIcon } from "../../../assets/svg"
import Button from "../../../components/general/button"
import ProfileMenu from "../../../components/profileMenu"
import Avatar from "../../../components/general/avatar"
import SubscriptionCard from "../../../components/SubscriptionCard"
import { subScriptionAction } from "../../../redux/actions/subScriptionActions"
import { getLocalCurrency, getLocalPriceFromCurrency } from "../../../constants/functions"
import "../../../assets/styles/admin/subscription/AdminSubscriptionDetailStyle.scss"

const AdminSubscriptionDetail = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const subscriptionState = useSelector((state: any) => state.subScription)
    const loadState = useSelector((state: any) => state.load)
    const { userId } = useParams()
    const [sort, setSort] = useState(-1)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [searchParams] = useSearchParams()
    const code = searchParams.get("tab")
    const [page, setPage] = useState(0)
    const { subScription } = subscriptionState
    const { currencyRate } = loadState

    const totalEarning = useMemo(() => {
        let price = 0;
        if(subScription) {
            subScription.totalSubscribers.forEach((subscriber: any) => {
                subscriber.data.forEach((sub: any) => {
                    price += getLocalPriceFromCurrency(subScription.currency, sub.earnings, sub.currency, currencyRate)
                })
            })
        } return price
    }, [subScription])

    const totalCount = useMemo(() => {
        if(subScription) return subScription.subscribers.length
        return 0
    }, [subScription])

    const resSubscribers = useMemo(() => {
        if(subScription) {
            if(subScription.subscribers.length > 0 && subScription.subscribers[0].userId) {
                return subScription.subscribers.slice(page * 10, (page + 1) * 10)
            } else return []
        }
        else return []
    }, [subScription, page])

    useEffect(() => { 
        setSelectedIndex(-1)
        dispatch(subScriptionAction.getSubscribersByOwner(userId, code === null ? 'all' : code, sort))
    }, [dispatch, code, sort])

    return (
        <div className="admin-subscription-detail-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/admin/subscription')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Subscription detail</span></div>
                <div
                    onClick={() => dispatch(subScriptionAction.setSubScriptionVisible(subScription._id, !subScription.visible))}
                >{subScription && (subScription.visible === true ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" /> )}</div>
            </div>
            {subScription &&
                <div className="admin-subscription-detail">
                    <div className="subscription-overview">
                        <div className="plan-name">
                            <h2 className="color-primary-level5 bold-md">{subScription.name}</h2>
                        </div>
                        <div className="plan-description">
                            <div className="plan-info color-nuetral-level8 bold-sm">
                                <div>
                                    <h5>Owner: {subScription.user.name}</h5>
                                </div>
                                <div>
                                    <h5>Created: {subScription.createdAt.substring(8, 10) + "." + subScription.createdAt.substring(5, 7) + "." + subScription.createdAt.substring(0, 4)}</h5>
                                </div>
                                <div>
                                    <h5>Monthly sub. fee: {getLocalCurrency(subScription.currency) + subScription.price}</h5>
                                </div>
                            </div>
                            <div className="plan-info color-nuetral-level8">
                                <div>
                                    <h5>Number of total subscriber: {subScription.totalSubscribers.length}</h5>
                                </div>
                                <div>
                                    <h5>Number of current subscriber: {subScription.totalSubscribers.filter((sub: any) => sub.active === true).length}</h5>
                                </div>
                            </div>
                            <div className="plan-status">
                                <div>
                                    <h6 className="color-nuetral-level8 bold-sm">Status</h6>
                                    <h4 className="color-primary-level5 bold-lg">{subScription.visible ? 'On-going' : 'Hidden' }</h4>
                                </div>
                                <div>
                                    <h6 className="color-nuetral-level8 bold-sm">Subscription earning</h6>
                                    <h4 className="color-primary-level5 bold-lg">{getLocalCurrency(subScription.currency) + Math.round(totalEarning)}</h4>
                                </div>
                            </div>
                            <div>
                                <Button
                                    text="Edit"
                                    fillStyle="outline"
                                    shape="rounded"
                                    color="primary"
                                    icon={[
                                        <EditIcon color="#EFA058" />, <EditIcon color="white" />, <EditIcon color="white" />
                                    ]}
                                    width={'100px'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="subscriber-detail">
                        <div className="record-menu"> 
                            <ProfileMenu
                                selectedText={code === null ? "All record" : code === "unsubscribed" ? "Unsubscribed" : "Subscribing"}
                                texts={["All record", "Unsubscribed", "Subscribing"]}
                                urls={[`admin/subscription/${userId}`, `admin/subscription/${userId}?tab=unsubscribed`, `admin/subscription/${userId}?tab=subscribing`]}
                            />
                        </div>
                        <div className="subscription-detail-body">
                            <div className="subscription-detail-main">
                                <div className="subscriber-list">
                                    <div className="subscription-detail-header">
                                        <div>
                                            <h4 className="color-primary-level5 bold-lg">{code === null ? 'All record' : code === 'unsubscribed' ? 'Unsubscribed list' : 'Subscribing list' }</h4>
                                            <h6 className="color-nuetral-level6 bold-sm">Showing {totalCount === 0 ? 0 : page * 10 + 1}-{Math.ceil(totalCount / 10) > (page + 1) ? 10 : totalCount - page * 10 } items, {totalCount} in total</h6>
                                        </div>
                                        <div className="subscription-detail-sort">
                                        <select onChange={(e) => {
                                            setSort(Number(e.target.value))
                                            setPage(0)
                                            setSelectedIndex(-1)
                                        }}>
                                            <option value="-1">Latest join</option>
                                            <option value="1">Earliest join</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="subscriber-list-body">
                                        {resSubscribers.map((sub: any, index: any) => (
                                            <div className="subscriber" key={index} onClick={() => {
                                                setSelectedIndex(index)
                                            }}>
                                                <div className="avatar-name">
                                                    <Avatar
                                                        size="small"
                                                        avatar={sub.data[0].user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${sub.data[0].user.avatar}` : sub.data[0].user.avatar}
                                                    />
                                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', color: selectedIndex === index ? '#EFA058' : '#000000' }}>
                                                        <span>{sub.data[0].user.name}</span>
                                                    </div>
                                                </div>
                                                <ForwardIcon color={selectedIndex === index ? '#EFA058' : "black"} />
                                            </div>        
                                        ))}
                                    </div>
                                    {totalCount > 0 &&
                                        <div className="subscription-detail-pagination">   
                                            <ReactPaginate
                                                breakLabel="..."
                                                nextLabel=">"
                                                onPageChange={(e: any) => setPage(e.selected) }
                                                pageRangeDisplayed={1}
                                                pageCount={Math.ceil(totalCount / 10)}
                                                previousLabel="<"
                                                marginPagesDisplayed={1}
                                                pageLinkClassName="page-link"
                                                previousLinkClassName="page-link"
                                                nextLinkClassName="page-link"
                                                breakLinkClassName="page-link"
                                                pageClassName="page-item"
                                                previousClassName="page-item"
                                                nextClassName="page-item"
                                                breakClassName="page-item"
                                                containerClassName="pagination"
                                                activeClassName="active"
                                                renderOnZeroPageCount={undefined}
                                            />
                                        </div>
                                    }
                                </div>

                                <div className="subscriber-detail">
                                    {selectedIndex !== -1 &&
                                        <>
                                            {subScription.subscribers[selectedIndex].data.map((data: any, index: any) => (
                                                <div style={{ margin: '10px 0px', display: 'flex', justifyContent: 'center' }} key={index}>
                                                    <SubscriptionCard
                                                        user={true}
                                                        subscriber={{
                                                            ...data,
                                                            plan: {
                                                                user: data.user,
                                                                name: subScription.name,
                                                                benefits: subScription.benefits,
                                                                multiPrices: subScription.multiPrices
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default AdminSubscriptionDetail