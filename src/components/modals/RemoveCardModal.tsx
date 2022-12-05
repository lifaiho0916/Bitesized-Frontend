import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/RemoveCardModalStyle.scss"


const RemoveCardModal = (props: any) => {
    const { show, onClose, handleSubmit } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="removecard">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>Warning</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <span>All your subscription plans <strong>will be cleared</strong> if you remove the credit card from your wallet.<br/><br/>Are you sure that you want to remove the card?</span>
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
                            text="Confirm"
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

export default RemoveCardModal