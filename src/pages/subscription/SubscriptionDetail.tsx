import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { BackIcon } from "../../assets/svg"
import ProfileMenu from "../../components/profileMenu";
import "../../assets/styles/subscription/SubscriptionDetailStyle.scss"
import { subScriptionAction } from "../../redux/actions/subScriptionActions";

const SubscriptionDetail = (props: any) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector((state: any) => state.auth)
    const { user } = userState
    const [searchParams] = useSearchParams()
    const code: any = searchParams.get("tab")

    useEffect(() => { dispatch(subScriptionAction.getSubscribersByOwner(code === null ? 'all' : code))}, [code])

    return (
        <div className="subscription-detail-wrapper">
             <div className="page-header">
                <div onClick={() => navigate(`/${user.personalisedUrl}?tab=subscription`)}><BackIcon color="black" /></div>
                <div className="page-title"><span>Subscription detail</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="subscription-detail">
                <ProfileMenu
                    selectedText={code === null ? "All record" : code === "unsubscribed" ? "Unsubscribed" : "Subscribing"}
                    texts={["All record", "Unsubscribed", "Subscribing"]}
                    urls={[`subscription/detail`, `subscription/detail?tab=unsubscribed`, `subscription/detail?tab=subscribing`]}
                />
                <div className="subscription-detail-body">
                    <div className="subscription-detail-header">
                        <div className="subscription-detail-title">
                            <h1 className="color-primary-level5">{code === null ? 'All record' : code === 'unsubscribed' ? 'Unsubscribed list' : 'Subscribing list' }</h1>
                            <h2 className="color-nuetral-level6">Showing 1-10 items, N in total</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionDetail