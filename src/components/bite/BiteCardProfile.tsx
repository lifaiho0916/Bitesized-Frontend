import { useState, useContext, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { LanguageContext } from "../../routes/authRoute"
import { ClockIcon, NoOfPeopleIcon, UnlockIcon, LockedIcon } from "../../assets/svg"
import NextBtn from "../../assets/img/next-bright.png"
import { SET_PREVIOUS_ROUTE } from "../../redux/types"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/bite/BiteCardProfileStyle.scss"

const BiteCardProfile = (props: any) => {
    const { bite, same } = props
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const contexts = useContext(LanguageContext)
    const userState = useSelector((state: any) => state.auth)
    const loadState = useSelector((state: any) => state.load)
    const { currencyRate } = loadState
    const { user } = userState

    const [videoIndex, setVideoIndex] = useState(0)
    const [hover, setHover] = useState(false)

    const PrevVideo = (e: any) => {
        e.stopPropagation()
        if (videoIndex > 0) setVideoIndex((index) => index - 1)
    }
    const NextVideo = (e: any) => {
        e.stopPropagation()
        if (videoIndex < bite.videos.length - 1) setVideoIndex((index) => index + 1)
    }

    const displayTime = (left: any) => {
        const passTime = Math.abs(left)
        let res: any = 'Posted'
        if (Math.floor(passTime / (3600 * 24 * 30)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24 * 30)) + '' + (Math.floor(passTime / (3600 * 24 * 30)) === 1 ? contexts.ITEM_CARD.MONTH : contexts.ITEM_CARD.MONTHS)
        else if (Math.floor(passTime / (3600 * 24 * 7)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24 * 7)) + '' + (Math.floor(passTime / (3600 * 24 * 7)) === 1 ? contexts.ITEM_CARD.WEEK : contexts.ITEM_CARD.WEEKS)
        else if (Math.floor(passTime / (3600 * 24)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24)) + '' + (Math.floor(passTime / (3600 * 24)) === 1 ? contexts.ITEM_CARD.DAY : contexts.ITEM_CARD.DAYS)
        else if (Math.floor(passTime / 3600) >= 1) res = res + ' ' + Math.floor(passTime / 3600) + '' + (Math.floor(passTime / 3600) === 1 ? contexts.ITEM_CARD.HOUR : contexts.ITEM_CARD.HOURS)
        else if (Math.floor(passTime / 60) > 0) res = res + ' ' + Math.floor(passTime / 60) + '' + (Math.floor(passTime / 60) === 1 ? contexts.ITEM_CARD.MIN : contexts.ITEM_CARD.MINS)
        if (Math.floor(passTime / 60) > 0) res += contexts.ITEM_CARD.AGO
        else res = 'Just ' + res
        return res
    }
    const displayPrice = (currency: any, price: any, userCurrency: any) => {
        if (currency) {
            if (currencyRate) {
                const rate = currency === 'usd' ? 1.0 : currencyRate[`${currency}`]
                const usdAmount = price / rate
                const rate1 = userCurrency === 'usd' ? 1.0 : currencyRate[`${userCurrency}`]
                const localPrice = usdAmount * rate1
                const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === userCurrency)
                let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
                return res + localPrice.toFixed(2)
            }
        } return "FREE"
    }

    const lock = useMemo(() => {
        if (user === null) return true
        if (user.role === "ADMIN" || (bite.owner && String(bite.owner._id) === String(user.id))) return false
        return bite.purchasedUsers.every((purchaseInfo: any) => String(purchaseInfo.purchasedBy) !== String(user.id))
    }, [user, bite])

    const clickCard = () => {
        if (user) {
            dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname })
            navigate(`/bite/detail/${bite._id}`, { state: { owner: user.id === bite.owner._id ? true : false } })
        } else {
            dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname })
            navigate('/auth/signup')
        }
    }

    return (
        <div
            className="bite-card-profile-wrapper"
            onClick={clickCard}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="unlock-purchase-info"
                style={{
                    background:
                        same ? (user && user.id === bite.owner._id) ? '#EFA058' : '#65E265'
                            : bite.currency ? lock ? '#30D8CE' : '#65E265' : '#F8907A'
                }}
            >
                {same ?
                    <span style={{ marginRight: '5px' }}>{(user && user.id === bite.owner._id) ? 'My Bite' : 'Unlocked'}</span>
                    :
                    <span style={{ marginRight: '5px' }}>{bite.currency ? lock ? displayPrice(bite.currency, bite.price, user ? user.currency : 'usd') : 'Unlocked' : 'Free'}</span>
                }
                {bite.purchasedUsers.length > 0 &&
                    <>
                        <NoOfPeopleIcon color="white" width={18} height={18} />
                        <span>&nbsp;{bite.purchasedUsers.length} {bite.currency ? "purchased" : "unlocked"}</span>
                    </>
                }
            </div>
            <div className="bite-body">
                <div className="video-part">
                    <div className="cover-image" style={{ backgroundColor: bite.currency ? lock ? '#97D8D4' : '#D8F7D8' : '#FBBEB1' }}>
                        {videoIndex > 0 &&
                            <div className="prev-video" onClick={PrevVideo}>
                                <img src={NextBtn} alt="prevvideo" />
                            </div>
                        }
                        {videoIndex < bite.videos.length - 1 &&
                            <div className="next-video" onClick={NextVideo}>
                                <img src={NextBtn} alt="nextvideo" />
                            </div>
                        }
                        <img
                            src={`${process.env.REACT_APP_SERVER_URL}/${bite.videos[videoIndex].coverUrl}`}
                            alt="coverImage"
                            width={'100%'}
                        />
                        {user === null &&
                            <div className="lock-btn">
                                <div className={`button ${hover ? 'hover' : ''}`}>
                                    {hover ? <UnlockIcon color="white" width={21} height={20} /> : <LockedIcon color="#EFA058" width={20} height={20} />}
                                    <span>Unlock</span>
                                </div>
                            </div>
                        }
                        <div
                            className="video-count"
                            style={{ width: `${bite.videos.length * 55}px` }}
                        >
                            {bite.videos.map((video: any, index: any) => (
                                <div key={index} className={videoIndex === index ? "active-bar" : "inactive-bar"} ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="left-time">
                    <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;<span>{displayTime(bite.time)}</span>
                </div>
                <div className="bite-title">
                    <span>{bite.title}</span>
                </div>
            </div>
        </div>
    )
}

export default BiteCardProfile