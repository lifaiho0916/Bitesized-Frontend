import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { biteAction } from "../../../redux/actions/biteActions"
import { HiddenIcon, VisibleIcon } from "../../../assets/svg"
import "../../../assets/styles/admin/editBite/AdminBiteListStyle.scss"

const AdminBiteList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const biteState = useSelector((state: any) => state.bite)
    const { bites } = biteState

    useEffect(() => { dispatch(biteAction.getBitesAdmin()) }, [])

    return (
        <div className="admin-bite-list-wrapper">
            <div className="bite-list">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Post Date</th>
                            <th>Post Time</th>
                            <th>Bite title</th>
                            <th>author</th>
                            <th>Visible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bites.map((bite: any, index: any) => (
                            <tr key={index} onClick={() => { navigate(`/admin/edit-bite/${bite._id}`) }}>
                                <td>{new Date(bite.date).toUTCString().slice(5, 16)}</td>
                                <td>{new Date(bite.date).toUTCString().slice(17, 25)}</td>
                                <td>{bite.title}</td>
                                <td>{bite.owner.name}</td>
                                <td style={{ textAlign: 'center' }}>{bite.visible ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" />}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminBiteList