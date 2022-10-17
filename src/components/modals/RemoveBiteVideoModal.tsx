import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/DelBiteModalStyle.scss"

const RemoveBiteVideoModal = (props: any) => {
    const { show, onClose, handleSubmit } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span>Remove Bite video</span>
                    <div className="close-btn" onClick={onClose}>
                        <CloseIcon color="black" width={30} height={30} />
                    </div>
                </div>
                <div className="modal-body">
                    <span>Once you remove video, this video will be no longer applicable in this post.</span>
                </div>
                <div className="modal-footer">
                    <Button
                        text="Cancel"
                        fillStyle="outline"
                        color="primary"
                        shape="rounded"
                        width={'80px'}
                        handleSubmit={onClose}
                    />
                    <Button
                        text="OK"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={'80px'}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}

export default RemoveBiteVideoModal