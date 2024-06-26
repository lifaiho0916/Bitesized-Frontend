import { useEffect, useState, createContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import decode from "jwt-decode"
import { authAction } from "../redux/actions/authActions"
import { EN, FR } from "../constants/language"
import { SET_LANGUAGE } from '../redux/types'
import Layout from '../layout/layout'
import Layout1 from "../layout/layout1"
import "../assets/styles/AuthRouteStyle.scss"
// import socketIOClient from "socket.io-client"

interface routeProps {
    child: any;
    routeType?: string;
}

// var socket = socketIOClient(`${process.env.REACT_APP_SERVER_URL}`);
export const LanguageContext = createContext<any>(null);

const AuthRoute = (props: routeProps) => {
    const { child, routeType } = props
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [contexts, setContexts] = useState(EN);
    const authState = useSelector((state: any) => state.auth);
    const user = authState.user;
    const language = authState.lang;
    const location = useLocation();
    const token: any = JSON.parse(localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`) || '{}');

    // const walletChange = (wallet: any) => {
    //     const state = { ...user, wallet: wallet };
    //     dispatch({ type: SET_USER, payload: state });
    // }

    useEffect(() => {
        if (user) {
            const lang: any = user.language === 'EN' ? EN : FR;
            setContexts(lang);
            // socket.emit('connected', user.email, user.role);
            // socket.on("wallet_change", (donuts: any) => walletChange(donuts));
            // socket.on("create_notification", () => dispatch(notificationAction.setNotification()));
        }
    }, [user]);

    useEffect(() => {
        if (user === null) {
            // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            let lang: any = EN
            let langLetter: any = 'EN'
            // if (timezone === 'Asia/Shanghai' || timezone === 'Asia/Urumqi' || timezone === 'Asia/Hong_Kong' || timezone === 'Asia/Chongqing') {
            //     lang = CH
            //     langLetter = 'CH'
            // }
            dispatch({ type: SET_LANGUAGE, payload: langLetter })
            setContexts(lang)
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (user === null) {
            const lang: any = language === 'EN' ? EN : FR;
            setContexts(lang)
        }
    }, [language, user])

    useEffect(() => {
        if (routeType === 'private') {
            if (localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`)) {
                const decoded: any = decode(token);
                if (decoded.exp * 1000 < new Date().getTime()) dispatch(authAction.logout(navigate))
            } else navigate("/")
        }
    }, [navigate, routeType, dispatch, token])

    useEffect(() => {
        if (localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`)) {
            const decoded: any = decode(token)
            if (decoded.exp * 1000 < new Date().getTime()) dispatch(authAction.logout(navigate))
            else dispatch(authAction.getAuthData())
        }
        dispatch(authAction.getCurrencyRate())
    }, [dispatch, token, navigate])

    useEffect(() => { window.scrollTo(0, 0) }, [location])

    return (
        <LanguageContext.Provider value={contexts}>
            {location.pathname.indexOf('/admin') !== -1 ? <Layout1 child={child} /> : <Layout child={child} />}
        </LanguageContext.Provider>
    );
}

export default AuthRoute;