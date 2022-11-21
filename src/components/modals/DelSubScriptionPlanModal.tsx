import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/DelSubScriptionStyle.scss"

const DelSubScriptionModal = (props: any) => {
    const { show, onClose, handleSubmit } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="delsubscription">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>Delete subscription?</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <span>Are you sure you want to delete this subscription?</span>
                        <br/><br/>
                        <span>Once deleted, it cannot be restored.</span>
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
                            text="Delete"
                            fillStyle="fill"
                            color="primary"
                            shape="rounded"
                            width={'80px'}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DelSubScriptionModal