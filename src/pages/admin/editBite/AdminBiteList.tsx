import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { biteAction } from "../../../redux/actions/biteActions"
import "../../../assets/styles/admin/editBite/AdminBiteListStyle.scss"

const AdminBiteList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const biteState = useSelector((state: any) => state.bite)
    const { bites } = biteState

    useEffect(() => { dispatch(biteAction.getAllBites()) }, [])

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
                        </tr>
                    </thead>
                    <tbody>
                        {bites.map((bite: any, index: any) => (
                            <tr key={index}>
                                <td>{new Date(bite.date).toUTCString().slice(5, 16)}</td>
                                <td>{new Date(bite.date).toUTCString().slice(17, 25)}</td>
                                <td>{bite.title}</td>
                                <td>{bite.owner.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminBiteList