import { CloseIcon } from "../../assets/svg"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/modals/UnsubscribedConfirmModalStyle.scss"

const UnsubscribedSuccessModal = (props: any) => {
    const { show, onClose, currency, planName, price, deadline } = props

    const getLocalCurrency = (currency: any) => {
        const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
        let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
        return res
    }

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="unsubscribed">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header" style={{ backgroundColor: '#DE5A67' }}>
                        <span style={{ color: 'white' }}>You have unsubscribed</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="white" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body" style={{ padding: '15px 18px 30px 18px' }}>
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
                </div>
            </div>
        </div>
    )
}

export default UnsubscribedSuccessModal