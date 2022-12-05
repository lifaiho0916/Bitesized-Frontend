import Button from "../general/button"
import { CloseIcon, RewardIcon, BiteIcon, NotificationSubscribedIcon } from "../../assets/svg"
import "../../assets/styles/modals/UnLockModalStyle.scss"

const UnLockModal = (props: any) => {
    const { show, onClose, bite, handleSubmit, subscribed } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="unlock">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span className="title">Successful</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="reward-icon">
                            {subscribed ?
                                <NotificationSubscribedIcon color="#efa058" width={60} height={60} />
                            :
                            (bite && bite.currency) ?
                                <BiteIcon color="#efa058" width={60} height={60} />
                                :
                                <RewardIcon color="#efa058" width={60} height={60} />
                        }
                        </div>
                        <div className="sub-title">
                            <span>You have unlocked this {bite.currency ? '' : 'FREE'} Bite {subscribed ? 'through subscription' : ''}</span>
                        </div>
                        <div className="bite-title">
                            <span>{bite ? bite.title : ''}</span>
                        </div>
                        <div className="check-profile-btn">
                            <Button
                                text="Check on profile"
                                shape="rounded"
                                color="primary"
                                fillStyle="outline"
                                width={'190px'}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                        <div className="check-profile-btn">
                            <Button
                                text="Watch the content"
                                shape="rounded"
                                color="primary"
                                fillStyle="fill"
                                width={'190px'}
                                handleSubmit={onClose}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnLockModal