import { useEffect, useMemo, useState, useLayoutEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ReactPaginate from 'react-paginate'
import { BackIcon, ForwardIcon } from "../../assets/svg"
import ProfileMenu from "../../components/profileMenu";
import Avatar from "../../components/general/avatar";
import { subScriptionAction } from "../../redux/actions/subScriptionActions";
import "../../assets/styles/subscription/SubscriptionDetailStyle.scss"
import SubscriptionCard from "../../components/SubscriptionCard";

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

const SubscriptionDetail = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const width = useWindowSize()
    const userState = useSelector((state: any) => state.auth)
    const subscriptionState = useSelector((state: any) => state.subScription)
    const { subScription } = subscriptionState
    const { user } = userState
    const [searchParams] = useSearchParams()
    const code: any = searchParams.get("tab")
    const [sort, setSort] = useState(-1)
    const [page, setPage] = useState(0)
    const [selectedIndex, setSelectedIndex] = useState(-1)

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
        if(user) {
            setSelectedIndex(-1)
            dispatch(subScriptionAction.getSubscribersByOwner(user.id, code === null ? 'all' : code, sort))
        }
    }, [code, sort, dispatch, user])

    return (
        <div className="subscription-detail-wrapper">
             <div className="page-header">
                <div onClick={() => {
                    if(width < 800 && selectedIndex !== -1) setSelectedIndex(-1)
                    else navigate(`/${user.personalisedUrl}?tab=subscription`)}
                }><BackIcon color="black" /></div>
                <div className="page-title"><span>Subscription detail</span></div>
                <div style={{ width: '24px' }}></div>
            </div>

            {(width < 800 && selectedIndex !== -1) ?
                <div className="subscriber-detail-mobile">
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
            :
                <div className="subscription-detail">
                    <ProfileMenu
                        selectedText={code === null ? "All record" : code === "unsubscribed" ? "Unsubscribed" : "Subscribing"}
                        texts={["All record", "Unsubscribed", "Subscribing"]}
                        urls={[`subscription/detail`, `subscription/detail?tab=unsubscribed`, `subscription/detail?tab=subscribing`]}
                    />
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
                                            if(width < 800) window.scrollTo(0, 0)
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
                                        {subScription.subscribers[selectedIndex].data.map((data: any) => (
                                            <div style={{ margin: '10px 0px', display: 'flex', justifyContent: 'center' }}>
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
            }
        </div>
    )
}

export default SubscriptionDetail