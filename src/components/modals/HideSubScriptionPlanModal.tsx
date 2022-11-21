import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/HideSubScriptionStyle.scss"

const HideSubScriptionModal = (props: any) => {
    const { show, onClose, handleSubmit } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="hidesubscription">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>Hide subscription?</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <ul>
                            <li>Removes this subscription plan from your page and new subscribers will not be able to join.</li>
                            <li>This membership level continues to be valid for subscribers who have already subscribed.</li>
                            <li>You may republish this membership level at any time.</li>
                        </ul>
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
                            text="Hide now"
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

export default HideSubScriptionModal