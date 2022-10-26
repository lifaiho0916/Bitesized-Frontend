import { useState, useContext, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import Avatar from "../general/avatar"
import Button from "../general/button"
import { LanguageContext } from "../../routes/authRoute"
import { ClockIcon, NoOfPeopleIcon, UnlockIcon } from "../../assets/svg"
import { SET_PREVIOUS_ROUTE } from "../../redux/types"
import NextBtn from "../../assets/img/next-bright.png"
import "../../assets/styles/bite/BiteCardHomeStyle.scss"

const BiteCardHome = (props: any) => {
    const { bite } = props
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const contexts = useContext(LanguageContext)
    const userState = useSelector((state: any) => state.auth)
    const loadState = useSelector((state: any) => state.load)
    const { user } = userState
    const { currencyRate } = loadState

    const [videoIndex, setVideoIndex] = useState(0)
    const [lock, setLock] = useState(true)

    const clickCard = () => {
        if (user) {
            dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname })
            navigate(`/bite/detail/${bite._id}`, { state: { owner: user.id === bite.owner._id ? true : false } })
        }
        else navigate('/auth/signup')
    }

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
                let res = ""
                if (userCurrency === 'usd') res += 'US $'
                else if (userCurrency === 'hkd') res += 'HK $'
                else if (userCurrency === 'inr') res += 'Rp ₹'
                else if (userCurrency === 'twd') res += 'NT $'
                else res += 'RM '
                return res + localPrice.toFixed(2)
            }
        } return "FREE"
    }

    const findPurchasedUser = (purchaseInfo: any) => {
        return String(purchaseInfo.purchasedBy) !== String(user.id)
    }

    const checkUnLock = () => {
        if (user === null) {
            setLock(true)
            return
        }
        if (bite.owner) {
            if (user.role === "ADMIN" || (String(bite.owner._id) === String(user.id))) {
                setLock(false)
                return
            }

            setLock(bite.purchasedUsers.every(findPurchasedUser))
        }
    }

    useEffect(() => checkUnLock(), [bite, user])

    return (
        <div className="bite-card-home-wrapper" onClick={clickCard}>
            <div className="top-info">
                <div className="owner-avatar">
                    <Avatar
                        size="mobile"
                        avatar={bite.owner.avatar.indexOf('uploads') === -1 ? bite.owner.avatar : `${process.env.REACT_APP_SERVER_URL}/${bite.owner.avatar}`}
                        handleClick={(e: any) => {
                            e.stopPropagation()
                            navigate(`/${bite.owner.personalisedUrl}`)
                        }}
                    />
                </div>
                <div className="ownername-lefttime-wrapper">
                    <div className="ownername-lefttime">
                        <div className="owner-name">
                            <span>{bite.owner.name}</span>
                        </div>
                        <div className="left-time">
                            <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;<span>{displayTime(bite.time)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bite-body">
                <div className="video-part">
                    <div className="cover-image">
                        {videoIndex > 0 &&
                            <div className="prev-video" onClick={PrevVideo}>
                                <img src={NextBtn} alt="next video" />
                            </div>
                        }
                        {videoIndex < bite.videos.length - 1 &&
                            <div className="next-video" onClick={NextVideo}>
                                <img src={NextBtn} alt="next video" />
                            </div>
                        }

                        <img
                            src={`${process.env.REACT_APP_SERVER_URL}/${bite.videos[videoIndex].coverUrl}`}
                            alt="coverImage"
                            width={'100%'}
                        />
                        {user === null &&
                            <div className="lock-btn">
                                <Button
                                    text="Unlock"
                                    shape="rounded"
                                    fillStyle="outline"
                                    color="primary"
                                    icon={[<UnlockIcon color="#EFA058" />, <UnlockIcon color="white" />, <UnlockIcon color="white" />]}
                                    handleSubmit={() => { }}
                                />
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
                <div className={bite.currency ? !lock ? "price-unlocked" : "price-purchased" : "price-free"}>
                    <span>{!lock ? 'Unlocked' : displayPrice(bite.currency, bite.price, user ? user.currency : 'usd')}</span>
                    {bite.purchasedUsers.length > 0 && <span style={{ marginLeft: '10px' }}><NoOfPeopleIcon color="white" width={18} height={18} />&nbsp;{bite.purchasedUsers.length} {bite.currency ? "purchased" : "unlocked"}</span>}
                </div>
                <div className="bite-title">
                    <span>{bite.title}</span>
                </div>
            </div>
        </div>
    )
}

export default BiteCardHome