import Button from "../general/button"
import { CloseIcon, RewardIcon } from "../../assets/svg"
import "../../assets/styles/modals/UnLockFreeModalStyle.scss"


const UnLockFreeModal = (props: any) => {
    const { show, title, onClose, bite, handleSubmit } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="unlockfree">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span className="title">{title ? title : ''}</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="reward-icon">
                            <RewardIcon color="#efa058" width={60} height={60} />
                        </div>
                        <div className="sub-title">
                            <span>You have unlock this FREE Bite </span>
                        </div>
                        <div className="bite-title">
                            <span>{bite ? bite.title : ''}</span>
                        </div>
                        <div className="check-profile-btn">
                            <Button
                                text="Check on profile"
                                shape="rounded"
                                color="primary"
                                fillStyle="fill"
                                width={'180px'}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnLockFreeModal