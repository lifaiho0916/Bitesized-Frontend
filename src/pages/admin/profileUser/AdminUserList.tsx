import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Avatar from "../../../components/general/avatar"
import { SearchIcon, HiddenIcon, VisibleIcon } from "../../../assets/svg"
import { authAction } from "../../../redux/actions/authActions"
import { SET_PROFILE, SET_NAME_EXIST, SET_URL_EXIST } from "../../../redux/types"
import "../../../assets/styles/admin/profileUser/AdminUsersStyle.scss"

const AdminUserList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userState = useSelector((state: any) => state.auth)
    const [search, setSearch] = useState("")
    const { users } = userState

    useEffect(() => { dispatch(authAction.getUsersList("")) }, [])

    return (
        <div className="admin-users-wrapper">
            <div className="search-bar">
                <SearchIcon color="#EFA058" />
                <input className="search-input" onChange={(e) => { setSearch(e.target.value) }} onKeyUp={(e) => { if (e.keyCode === 13) dispatch(authAction.getUsersList(search)) }} />
            </div>
            <div className="users-data scroll-bar">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>DOJ</th>
                            <th>Username</th>
                            <th>Earnings</th>
                            <th>Email</th>
                            <th style={{ textAlign: 'center' }}>Video Uploaded</th>
                            <th style={{ textAlign: 'center' }}>Bite Post</th>
                            <th style={{ textAlign: 'center' }}>Payment Status</th>
                            <th style={{ textAlign: 'center' }}>Account Status</th>
                        </tr>
                    </thead>
                    {users.length > 0 &&
                        <tbody>
                            {users.map((user: any, index: any) => {
                                if (user.date) {
                                    return (
                                        <tr key={index} onClick={() => {
                                            dispatch({
                                                type: SET_PROFILE,
                                                payload: {
                                                    category: [],
                                                    avatar: null,
                                                    name: null,
                                                    personalisedUrl: null,
                                                    bioText: null
                                                }
                                            })
                                            dispatch({ type: SET_NAME_EXIST, payload: false })
                                            dispatch({ type: SET_URL_EXIST, payload: false })
                                            navigate('/admin/profile-user/edit', { state: { index: index + 1 } })
                                        }}>
                                            <td>{new Date(user.date).toUTCString().slice(5, 11)} {new Date(user.date).toUTCString().slice(14, 16)}</td>
                                            <td>
                                                <Avatar
                                                    size="small"
                                                    avatar={user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : user.avatar}
                                                    username={user.name}
                                                    avatarStyle="horizontal"
                                                />
                                            </td>
                                            <td>{user.role === "ADMIN" ? '***' : user.earnings}</td>
                                            <td>{user.email}</td>
                                            <td style={{ textAlign: 'center' }}>{user.videoCnt}</td>
                                            <td style={{ textAlign: 'center' }}>{user.biteCnt}</td>
                                            <td></td>
                                            <td style={{ textAlign: 'center' }}>{user.visible ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" />}</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    )
}

export default AdminUserList