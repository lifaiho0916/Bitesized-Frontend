import { useState, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import ReactPlayer from "react-player"
import Avatar from "../general/avatar"
import Button from "../general/button"
import { LanguageContext } from "../../routes/authRoute"
import { ClockIcon, NoOfPeopleIcon, PlayIcon, UnlockIcon } from "../../assets/svg"
import NextBtn from "../../assets/img/next-bright.png"
import "../../assets/styles/bite/BiteCardProfileStyle.scss"

const BiteCardProfile = (props: any) => {
    const { bite, setBite } = props
    const navigate = useNavigate()
    const contexts = useContext(LanguageContext)
    const userState = useSelector((state: any) => state.auth)
    const { user } = userState

    const [videoIndex, setVideoIndex] = useState(0)
    const [play, setPlay] = useState(false)
    const [lock, setLock] = useState(true)

    const PrevVideo = () => {
        if (videoIndex > 0) setVideoIndex((index) => index - 1)
    }
    const NextVideo = () => {
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
    const displayPrice = (currency: any, price: any) => {
        let res: any = ''
        if (currency === 'usd') res += "US $" + price
        else if (currency === 'hkd') res += 'HK $' + price
        else if (currency === 'twd') res += 'NT $' + price
        else if (currency === 'inr') res += 'Rp ₹' + price
        else if (currency === 'myr') res += 'RM ' + price
        else res = "FREE"
        return res
    }

    const findPurchasedUser = (purchasedInfo: any) => {
        return String(purchasedInfo.purchasedBy) !== String(user.id)
    }

    const checkUnLock = () => {
        if (user === null) {
            setLock(true)
            return
        }
        if (String(bite.owner._id) === String(user.id)) {
            setLock(false)
            return
        }

        setLock(bite.purchasedUsers.every(findPurchasedUser))
    }

    const Unlock = () => {
        if (user) setBite(bite)
        else navigate('/auth/signin')
    }

    useEffect(() => { checkUnLock() }, [bite, user])

    return (
        <div className="bite-card-profile-wrapper">
            <div className="unlock-purchase-info"
                style={{ background: bite.currency ? lock ? '#30D8CE' : '#65E265' : '#F8907A' }}
            >
                <span>{bite.currency ? lock ? displayPrice(bite.currency, bite.price) : 'Unlocked' : 'Free'}</span>&nbsp;&nbsp;
                {bite.purchasedUsers.length > 0 &&
                    <>
                        <NoOfPeopleIcon color="white" width={18} height={18} />
                        <span>&nbsp;{bite.purchasedUsers.length} {bite.currency ? "purchased" : "unlocked"}</span>
                    </>
                }
            </div>
            <div className="bite-body">
                <div className="video-part"
                    onClick={() => {
                        if (play) { setPlay(false) }
                    }}
                >
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
                        {play === true ?
                            <ReactPlayer
                                className="react-player"
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: 'nodownload noremoteplayback noplaybackrate',
                                            disablePictureInPicture: true,
                                        }
                                    }
                                }}
                                url={`${process.env.REACT_APP_SERVER_URL}/${bite.videos[videoIndex].videoUrl}`}
                                playing={play}
                                playsinline={true}
                                controls
                            />
                            :
                            <>
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}/${bite.videos[videoIndex].coverUrl}`}
                                    alt="cover Image"
                                    width={'100%'}
                                />
                                {lock ?
                                    <div className="lock-btn">
                                        <Button
                                            text="Unlock"
                                            shape="rounded"
                                            fillStyle="outline"
                                            color="primary"
                                            icon={[<UnlockIcon color="#EFA058" />, <UnlockIcon color="white" />, <UnlockIcon color="white" />]}
                                            handleSubmit={Unlock}
                                        />
                                    </div>
                                    :
                                    <div className="play-icon" onClick={() => setPlay(true)}>
                                        <PlayIcon color="white" />
                                    </div>
                                }
                            </>
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