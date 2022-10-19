import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { BackIcon, VisibleIcon, HiddenIcon } from "../../../assets/svg"
import { authAction } from "../../../redux/actions/authActions"
import "../../../assets/styles/admin/profileUser/AdminEditUserStyle.scss"

const AdminEditUser = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector((state: any) => state.auth)
    const [index, setIndex] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const { state } = location
    const { users } = userState

    const changeVisible = (visible: any) => { dispatch(authAction.changeUserVisible(user._id, visible)) }
    useEffect(() => {
        if (state === null) navigate('/admin/profile-user')
        else setIndex(state.index)
    }, [location])
    useEffect(() => {
        if (index) {
            if (users.length === 0) navigate('/admin/profile-user')
            setUser(users[index - 1])
        }
    }, [index])

    return (
        <div className="admin-edit-user-wrapper">
            {user &&
                <>
                    <div className="page-header">
                        <div onClick={() => navigate('/admin/profile-user')}><BackIcon color="black" /></div>
                        <div className="page-title"><span>User account</span></div>
                        <div>
                            <div onClick={() => changeVisible(!user.visible)}>
                                {user.visible ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" />}
                            </div>
                        </div>
                    </div>
                    <div className="admin-edit-user">
                        <div className="old-setting">

                        </div>
                        <div className="new-setting">
                            
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default AdminEditUser