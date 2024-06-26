import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import decode from "jwt-decode"
import Header from "./header"
import Sidebar from "./sidebar"
import Uploading from "../components/general/Uploading"
import Loading from "../components/general/loading"
import { authAction } from "../redux/actions/authActions"
import "../assets/styles/layout/layoutAdminStyle.scss"

const Layout = (props: any) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loadState = useSelector((state: any) => state.load)
    const token: any = JSON.parse(localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`) || '{}')

    useEffect(() => {
        if (localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`)) {
            const decoded: any = decode(token);
            if (decoded.role !== "ADMIN") navigate("/")
            if (decoded.exp * 1000 < new Date().getTime()) dispatch(authAction.logout(navigate))
        }
    }, [dispatch, navigate])

    return (
        <>
            <Loading loading={loadState.loading} />
            {loadState.uploading && <Uploading />}
            <Header />
            <div className="layout-admin">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="main-body scroll-bar">
                    {props.child}
                </div>
            </div>
        </>
    )
}

export default Layout
