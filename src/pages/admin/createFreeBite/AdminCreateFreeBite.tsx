import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import CreatorLg from "../../../components/general/CreatorLg"
import { BackIcon } from "../../../assets/svg"
import "../../../assets/styles/admin/createFreeBite/AdminCreateFreeBiteStyle.scss"

const AdminCreateFreeBite = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { user } = state


    return (
        <div className="create-free-bite-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/admin/create-free-bite')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Posting on FREE Bite</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="create-free-bite">
                <div className="creator">
                    <CreatorLg user={user} />
                </div>
            </div>

        </div>
    )
}

export default AdminCreateFreeBite