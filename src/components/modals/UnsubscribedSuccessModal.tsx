import { useMemo } from "react"
import { useSelector } from "react-redux"
import { CloseIcon } from "../../assets/svg"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/modals/UnsubscribedConfirmModalStyle.scss"

const UnsubscribedSuccessModal = (props: any) => {
    const { show, onClose, subscriber } = props
    const loadState = useSelector((state: any) => state.load)
    const { currencyRate } = loadState

    const getLocalCurrency = (currency: any) => {
        const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
        let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
        return res
    }

    const price = useMemo(() => {
        if(subscriber && currencyRate) {
            if(subscriber.status) return JSON.parse(subscriber.plan.multiPrices)[`${subscriber.currency}`] * 1.034 + 0.3 * (subscriber.currency === 'usd' ? 1.0 : currencyRate[`${subscriber.currency}`])
            else return subscriber.price
        } return 0
    }, [subscriber, currencyRate])

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
                            <span>{subscriber && (subscriber.status ? subscriber.plan.name : subscriber.planName )}</span>
                        </div>
                        <div className="subscription-fee">
                            <span>{(subscriber && currencyRate) && getLocalCurrency(subscriber.currency)}{price.toFixed(1)}/month</span>
                        </div>
                        <div className="explain">
                            <ul>
                                <li>
                                    You can still have the access to all subscription feature until {subscriber && subscriber.nextInvoiceAt?.substring(8, 10) + "." + subscriber.nextInvoiceAt?.substring(5, 7) + "." + subscriber.nextInvoiceAt?.substring(0, 4)}
                                </li>
                                <li>
                                    You can no longer enjoy this subscription price after {subscriber && subscriber.nextInvoiceAt?.substring(8, 10) + "." + subscriber.nextInvoiceAt?.substring(5, 7) + "." + subscriber.nextInvoiceAt?.substring(0, 4)}
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