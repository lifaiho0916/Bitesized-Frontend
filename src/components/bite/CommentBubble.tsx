import Avatar from "../general/avatar"
import "../../assets/styles/bite/CommentBubbleStyle.scss"

const CommentBubble = (props: any) => {
    const { comment } = props

    return (
        <div className="comment-bubble-wrapper">
            <div className="avatar-name-action">
                <div className="avatar-name">
                    <div className="avatar">
                        <Avatar
                            avatar={comment?.commentedBy ? comment?.commentedBy.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${comment.commentedBy.avatar}` : comment.commentedBy.avatar : ''}
                            size="mobile"
                        />
                    </div>
                    <div className="name-category">

                    </div>
                </div>
                <div className="action-part">

                </div>
            </div>
            <div>

            </div>
            <div>
                
            </div>
        </div>
    )
}

export default CommentBubble