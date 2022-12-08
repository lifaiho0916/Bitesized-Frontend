import { useContext } from "react"
import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import { LanguageContext } from "../../routes/authRoute"
import "../../assets/styles/modals/PublishBiteModalStyle.scss"

const PublishBiteModal = (props: any) => {
    const { show, onClose, handleSubmit } = props
    const contexts = useContext(LanguageContext)

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="publishbite">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>{contexts.GENERAL.CONFIRM}:</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <span>{contexts.MODALS.POST_NOT_EDIT}</span>
                    </div>
                    <div className="modal-footer">
                        <Button
                            text={contexts.GENERAL.PUBLISH}
                            fillStyle="fill"
                            color="primary"
                            shape="rounded"
                            width={'180px'}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublishBiteModal