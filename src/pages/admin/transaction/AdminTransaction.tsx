import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import Button from "../../../components/general/button"
import { SearchIcon } from "../../../assets/svg"
import "../../../assets/styles/admin/transaction/AdminTransactionStyle.scss"

const AdminTransaction = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const code = searchParams.get('type')
    const [search, setSearch] = useState("")

    useEffect(() => {
        
    }, [code])

    return (
        <div className="transaction-wrapper">
            <div className="transaction">
                <div className="navigate-btns">
                    <div className="btn">
                        <Button
                            text="All record"
                            fillStyle={code === null ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction')}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="Paid Bite"
                            fillStyle={code === 'paid' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction?type=paid')}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="FREE Bite"
                            fillStyle={code === 'free' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction?type=free')}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="Earnings"
                            fillStyle={code === 'earn' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction?type=earn')}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="Cash out"
                            fillStyle={code === 'cash' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate('/admin/transaction?type=cash')}
                        />
                    </div>
                </div>
                <div className="search-bar">
                    <SearchIcon color="#EFA058" />
                    <input
                        placeholder="Username"
                        className="search-input"
                        onChange={(e) => { setSearch(e.target.value) }}
                        onKeyUp={(e) => { if (e.keyCode === 13) { } }}
                    />
                </div>
                <div className="users-data scroll-bar">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Username</th>
                                <th>Description</th>
                                <th>In USD</th>
                                <th>In Local Currencies</th>
                            </tr>
                        </thead>
                        {/* {users.length > 0 &&
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
                                })} */}
                            {/* </tbody> */}
                        {/* } */}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminTransaction