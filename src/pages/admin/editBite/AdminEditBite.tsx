import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import DelBiteModal from "../../../components/modals/DelBiteModal"
import { biteAction } from "../../../redux/actions/biteActions"
import { BackIcon, VisibleIcon, HiddenIcon, DeleteIcon } from "../../../assets/svg"
import "../../../assets/styles/admin/editBite/AdminEditBiteStyle.scss"


const AdminEditBite = () => {
    const { biteId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const biteState = useSelector((state: any) => state.bite)
    const { bite } = biteState

    const changeVisible = (visible: any) => { dispatch(biteAction.changeVisible(biteId, visible)) }
    const deleteBite = () => { dispatch(biteAction.deleteBite(biteId, navigate)) }
    useEffect(() => { if (bite.title === null) dispatch(biteAction.getBiteById(biteId)) }, [bite])

    return (
        <div className="admin-edit-bite-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/admin/edit-bite')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Bite</span></div>
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '10px' }} onClick={() => changeVisible(!bite.visible)}>
                        {bite ? bite.visible ? <HiddenIcon color="#EFA058" /> : <VisibleIcon color="#EFA058" /> : <></>}
                    </div>
                    <div onClick={deleteBite}><DeleteIcon color="#EFA058" /></div>
                </div>
            </div>
        </div>
    )
}

export default AdminEditBite