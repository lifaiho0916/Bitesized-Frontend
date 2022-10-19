import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/DelBiteModalStyle.scss"

const HideUserModal = (props: any) => {
    const { show, onClose, handleSubmit } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="delbite">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span style={{ color: '#D94E27' }}>Confirm!</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body" style={{ display: 'flex', justifyContent: 'center' }}>
                        <span style={{ width: '220px' }}>Once you click confirm, this account will be hidden from all session.</span>
                    </div>
                    <div className="modal-footer">
                        <Button
                            text="Decline"
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

export default HideUserModal