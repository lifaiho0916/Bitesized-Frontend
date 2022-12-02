import { useNavigate, useParams } from "react-router-dom"
import { BackIcon } from "../../../assets/svg"
import "../../../assets/styles/admin/subscription/AdminSubscriptionDetailStyle.scss"

const AdminSubscriptionDetail = () => {
    const navigate = useNavigate()
    const { userId } = useParams()

    console.log(userId)

    return (
        <div className="admin-subscription-detail-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/admin/subscription')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Subscription detail</span></div>
                <div style={{ width: '24px' }}></div>
            </div>

            <div className="admin-subscription-detail">
                <div className="divider"></div>
                <div className="subscription-overview">
                    
                </div>
            </div>
        </div>
    )
}

export default AdminSubscriptionDetail