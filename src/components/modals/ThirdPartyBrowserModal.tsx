import { CloseIcon } from "../../assets/svg"
import Button from "../general/button"
import "../../assets/styles/modals/ThirdPartyBrowserModalStyle.scss"

const ThirdPartBrowserModal = (props: any) => {
    const { show, onClose, handleSubmit } = props

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="thirdpartymoal">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>Open In Browser 🌐</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <span>Open in browser for</span><br />
                        <span>a better experience</span>
                        <br /><br />
                        <span>開啓瀏覽器</span><br />
                        <span>獲得更好的用戶體驗</span>
                    </div>
                    <div className="modal-footer">
                        <Button
                            text="Open / 開啓"
                            fillStyle="fill"
                            color="primary"
                            shape="rounded"
                            width={'70%'}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThirdPartBrowserModal