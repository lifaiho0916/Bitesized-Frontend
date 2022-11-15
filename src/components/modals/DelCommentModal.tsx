import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/DelCommentModal.scss"


const DelCommentModal = (props: any) => {
    const { show, onClose, handleSubmit } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="deletecomment">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>Confirm:</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <span>This comment will be deleted forever</span>
                    </div>
                    <div className="modal-footer">
                        <Button
                            text="Delete"
                            fillStyle="fill"
                            color="primary"
                            shape="rounded"
                            width={'200px'}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DelCommentModal