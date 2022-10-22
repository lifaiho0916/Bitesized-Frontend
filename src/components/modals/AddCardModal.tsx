import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/AddCardModalStyle.scss"

const AddCardModal = (props: any) => {
    const { show, child, onClose } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="addcard">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span></span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        {child}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCardModal