import { useMemo, useContext, useState, useRef, useEffect } from "react"
import Avatar from "../general/avatar"
import { useDispatch } from "react-redux"
import ShowMoreText from "react-show-more-text"
import { LanguageContext } from "../../routes/authRoute"
import { DeleteIcon, MoreIcon } from "../../assets/svg"
import { biteAction } from "../../redux/actions/biteActions"
import "../../assets/styles/bite/CommentBubbleStyle.scss"

const useOutsideAlerter = (ref: any, moreInfo: any) => {
    const [more, setMore] = useState(moreInfo)
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            setMore(moreInfo)
            if (ref.current && !ref.current.contains(event.target)) {
                if (moreInfo) setMore(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [ref, moreInfo])
    return more
}

const CommentBubble = (props: any) => {
    const contexts = useContext(LanguageContext)
    const dispatch = useDispatch()
    const { comment, isOwnBite, index, biteId, isOwnComment } = props
    const wrapRef = useRef<any>(null)
    const [more, setMore] = useState(false)
    const res = useOutsideAlerter(wrapRef, more)

    const categoryText = useMemo(() => {
        if (comment.commentedBy) {
            if (comment.commentedBy.categories.length === 0) return ""
            else {
                let categories = comment.commentedBy.categories
                let texts = ""
                categories.sort((a: any, b: any) => { return a > b ? 1 : a < b ? -1 : 0 })
                categories.forEach((categoryIndex: any, index: any) => {
                    texts += contexts.CREATOR_CATEGORY_LIST[categoryIndex]
                    if (index < categories.length - 1) texts += "/"
                })
                return texts
            }
        }
    }, [comment, contexts.CREATOR_CATEGORY_LIST])

    useEffect(() => { if (!res) setMore(res) }, [res])

    return (
        <div className="comment-bubble-wrapper">
            <div className="avatar-name-action" >
                <div className="avatar-name">
                    <div className="avatar">
                        <Avatar
                            avatar={comment?.commentedBy ? comment?.commentedBy.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${comment.commentedBy.avatar}` : comment.commentedBy.avatar : ''}
                            size="mobile"
                        />
                    </div>
                    <div className="name-category">
                        <div className="name">
                            <span>{comment?.commentedBy?.name}</span>
                        </div>
                        <div className="category">
                            <span>{categoryText}</span>
                        </div>
                    </div>
                </div>
                <div className="action-part">
                    {(isOwnBite || isOwnComment) &&
                        <>
                            <div onClick={() => setMore(true)}><MoreIcon color="black" /></div>
                            <div className="drop-down-list" style={more === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
                                <div className="list" onClick={() => {
                                    setMore(false)
                                    dispatch(biteAction.deleteComment(biteId, index))
                                }}><DeleteIcon color="#54504E" /><span style={{ marginLeft: '10px' }}>Delete Comment</span></div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="comment-body">
                <div className="comment-text">
                    <ShowMoreText
                        lines={3}
                        more="... see more"
                        less="... see less"
                        className="content-css"
                        anchorClass="see-more-less"
                        expanded={false}
                        width={0}
                        truncatedEndingComponent={""}
                    >
                        {comment?.text}
                    </ShowMoreText>
                </div>
                <div className="commented-date">
                    <span>{comment.commentedAt ? comment.commentedAt.substring(5, 7) + '.' + comment.commentedAt.substring(8, 10) + '.' + comment.commentedAt.substring(0, 4) : ''}</span>
                </div>
            </div>
        </div>
    )
}

export default CommentBubble