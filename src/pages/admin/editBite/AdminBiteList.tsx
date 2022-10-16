import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { biteAction } from "../../../redux/actions/biteActions"

const AdminBiteList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const biteState = useSelector((state: any) => state.bite)
    const { bites } = biteState

    useEffect(() => { dispatch(biteAction.getAllBites()) }, [])

    return (
        <div>

        </div>
    )
}

export default AdminBiteList