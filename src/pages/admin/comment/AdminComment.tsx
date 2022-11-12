import { useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import CommentBubble from "../../../components/bite/CommentBubble"
import Avatar from "../../../components/general/avatar"
import Input from "../../../components/general/input"
import { BackIcon, ClockIcon, CommentIcon, SendIcon } from "../../../assets/svg"
import { LanguageContext } from "../../../routes/authRoute"
import { biteAction } from "../../../redux/actions/biteActions"
import "../../../assets/styles/admin/comment/AdminCommentStyle.scss"

const AdminComment = (props: any) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const contexts = useContext(LanguageContext)
    const biteState = useSelector((state: any) => state.bite)
    const userState = useSelector((state: any) => state.auth)
    const loadState = useSelector((state: any) => state.load)
    const { bite } = biteState
    const { user } = userState
    const { currencyRate } = loadState

    const [comment, setComment] = useState("")

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

    const localPrice = useMemo(() => {
        if (currencyRate && user && bite.owner) {
            const rate = bite.currency === 'usd' ? 1.0 : currencyRate[`${bite.currency}`]
            const usdAmount = bite.price / rate
            const rate1 = user.currency === 'usd' ? 1.0 : currencyRate[`${user.currency}`]
            const price = usdAmount * rate1
            return price.toFixed(2)
        }
    }, [bite, user, currencyRate])

    const getLocalCurrency = (currency: any) => {
        let res = ''
        if (currency === 'usd') res += 'US $'
        else if (currency === 'hkd') res += 'HK $'
        else if (currency === 'inr') res += 'Rp ₹'
        else if (currency === 'twd') res += 'NT $'
        else res += 'RM '
        return res
    }

    const isOwner = useMemo(() => {
        if (user && bite.owner && (String(user.id) === String(bite.owner._id))) return true
        else return false
    }, [user, bite])

    const sendComment = () => {
        dispatch(biteAction.sendComment(bite._id, comment))
        setComment("")
    }

    useEffect(() => {
        if (bite.comments && bite.comments.length) {
            const buffer: any = document.getElementById("scroll")
            buffer.scrollTop = buffer.scrollHeight
        }
    }, [bite])
    useEffect(() => { if (bite.title === null) navigate('/admin/comment') }, [bite])

    return (
        <div className="admin-comment-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/admin/comment')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Comment</span></div>
                <div style={{ width: '24px' }}>
                </div>
            </div>
            <div className="admin-comment">
                <div className="avatar-thumbnail-part">
                    <div className="avatar-part">
                        <div className="avatar-title">
                            <div className="left-time">
                                <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;<span>{displayTime(bite?.time)}</span>
                            </div>
                            <div className="avatar">
                                {bite.owner &&
                                    <Avatar
                                        avatar={bite.owner.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${bite.owner.avatar}` : bite.owner.avatar}
                                        username={bite.owner.name}
                                        avatarStyle={"horizontal"}
                                        handleClick={() => navigate(`/${bite.owner.personalisedUrl}`)}
                                    />
                                }
                            </div>
                            <div className="status-chip">
                                <div className={`chip ${bite.currency ? 'paid' : 'free'}`}>
                                    {bite.currency ? user ? getLocalCurrency(user.currency) + localPrice : '' : 'Free'}
                                </div>
                                <div className={`chip ${isOwner ? 'mine' : 'unlock'}`}>
                                    {isOwner ? 'My Bite' : 'Unlocked'}
                                </div>
                            </div>
                            <div className="bite-title">
                                <span>{bite.title}</span>
                            </div>
                        </div>
                    </div>
                    <div className="thumbnail-part">
                        {bite.videos.map((video: any, index: any) => (
                            <div key={index} className="thumbnail" style={{ backgroundColor: bite.currency ? '#D8F7D8' : '#FBBEB1' }}>
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}/${video.coverUrl}`}
                                    width={120}
                                    alt="coverImage"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {bite.title &&
                    <div className="comment-part">
                        <div className="section-header">
                            <CommentIcon color="#EFA058" width={30} height={30} /><span>Comments</span>
                        </div>
                        <div className="comment-body">
                            {bite.comments.length > 0 ?
                                <div className="bubble-part scroll-bar-lg" id="scroll">
                                    {bite.comments.map((comment: any, index: any) => (
                                        <div className="bubble" key={index} style={(user && String(comment.commentedBy._id) === String(user.id)) ? { marginLeft: 'auto' } : {}}>
                                            <CommentBubble
                                                comment={comment}
                                                isOwnBite={true}
                                                isOwnComment={(user && String(comment.commentedBy._id) === String(user.id)) ? true : false}
                                                index={index}
                                                biteId={bite._id}
                                            />
                                        </div>
                                    ))}
                                </div>
                                :
                                <div className="no-comments">
                                    <span>Be the first one to comment</span>
                                </div>
                            }
                            {
                                user &&
                                <div className="input-comment">
                                    <div style={{ width: 'calc(100% - 60px)' }}>
                                        <Input
                                            type={"input"}
                                            placeholder="Add a comment"
                                            title={comment}
                                            setTitle={setComment}
                                            width={'100%'}
                                            wordCount={200}
                                        />
                                    </div>
                                    <div className="send-btn" onClick={sendComment}>
                                        <SendIcon color="white" width={22} height={22} />
                                    </div>
                                </div>
                            }
                        </div >
                    </div>
                }
            </div>
        </div>
    )
}

export default AdminComment