import { useMemo } from "react"
import { useSelector } from "react-redux"
import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/modals/UnsubscribedConfirmModalStyle.scss"
import { json } from "stream/consumers"

const UnsubscribedConfirmModal = (props: any) => {
    const { show, onClose, handleSubmit, subscriber } = props
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
                    <div className="modal-header">
                        <span>Unsubscribe</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
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