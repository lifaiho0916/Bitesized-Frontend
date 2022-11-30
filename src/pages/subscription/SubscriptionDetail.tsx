import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { BackIcon } from "../../assets/svg"

const SubscriptionDetail = (props: any) => {
    const navigate = useNavigate()
    const userState = useSelector((state: any) => state.auth)
    const { user } = userState

    return (
        <div className="subscription-detail-wrapper">
             <div className="page-header">
                <div onClick={() => navigate(`/${user.personalisedUrl}?tab=subscription`)}><BackIcon color="black" /></div>
                <div className="page-title"><span>My Wallet</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
        </div>
    )
}

export default SubscriptionDetail