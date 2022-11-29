import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/modals/UnsubscribedConfirmModalStyle.scss"

const UnsubscribedConfirmModal = (props: any) => {
    const { show, onClose, handleSubmit, currency, planName, price, deadline } = props

    const getLocalCurrency = (currency: any) => {
        const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
        let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
        return res
    }

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="unsubscribed">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>Unsubscribe</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="plan-name">
                            <span>{planName}</span>
                        </div>
                        <div className="subscription-fee">
                            <span>{currency && getLocalCurrency(currency)}{price && price.toFixed(1)}/month</span>
                        </div>
                        <div className="explain">
                            <ul>
                                <li>
                                    You can still have the access to all subscription feature until {deadline?.substring(8, 10) + "." + deadline?.substring(5, 7) + "." + deadline?.substring(0, 4)}
                                </li>
                                <li>
                                    You can no longer enjoy this subscription price after {deadline?.substring(8, 10) + "." + deadline?.substring(5, 7) + "." + deadline?.substring(0, 4)}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button
                            text="Cancel"
                            fillStyle="outline"
                            color="primary"
                            shape="rounded"
                            width={'110px'}
                            handleSubmit={onClose}
                        />
                        <Button
                            text="Unsubscribe"
                            fillStyle="fill"
                            color="secondary"
                            shape="rounded"
                            width={'110px'}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnsubscribedConfirmModal