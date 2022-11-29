import { useMemo, useContext } from "react"
import { useSelector } from "react-redux"
import Avatar from "./general/avatar"
import Button from "./general/button"
import { LanguageContext } from "../routes/authRoute"
import CONSTANT from "../constants/constant"
import "../assets/styles/subscription/SubscriptionCardStyle.scss"

const SubscriptionCard = (props: any) => {
    const { subscriber, handleSubmit } = props
    const contexts = useContext(LanguageContext)
    const loadState = useSelector((state: any) => state.load)
    const { currencyRate } = loadState

    const categoryText = useMemo(() => {
        if (subscriber.plan) {
          if (subscriber.plan.user.categories.length === 0) return ""
          else {
            let categories = subscriber.plan.user.categories
            let texts = ""
            categories.sort((a: any, b: any) => { return a > b ? 1 : a < b ? -1 : 0 })
            categories.forEach((categoryIndex: any, index: any) => {
              texts += contexts.CREATOR_CATEGORY_LIST[categoryIndex]
              if (index < categories.length - 1) texts += "/"
            })
            return texts
          }
        }
      }, [subscriber, contexts.CREATOR_CATEGORY_LIST])

    const getLocalCurrency = (currency: any) => {
        const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
        let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
        return res
    }

    return (
        <div className="subscription-card-wrapper">
            <div className="user-info">
                <Avatar
                    size="mobile"
                    avatar={subscriber.plan ? subscriber.plan.user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${subscriber.plan.user.avatar}` : subscriber.plan.user.avatar : ''}
                />
                <div className="user-name-category">
                    <div className="username">
                        <span>{subscriber && subscriber.plan.user.name}</span>
                    </div>
                    <div className="user-category">
                        <span>{categoryText}</span>
                    </div>
                </div>
            </div>

            <div className="subscription-status">
                <div className="status-fee">
                    <div className="status-fee-part">
                        <div className="status-title">
                            <span>Status</span>
                        </div>
                        <div className="status-info">
                            <span>{(subscriber && currencyRate) ? subscriber.status ? 'Subscribing' : 'Unsubscribed' : ''} </span>
                        </div>
                    </div>
                    <div className="status-fee-part">
                        <div className="status-title">
                            <span>Subscription fee</span>
                        </div>
                        <div className="status-info">
                            <span>{subscriber && `${getLocalCurrency(subscriber.currency)}${subscriber.status ? (JSON.parse(subscriber.plan.multiPrices)[`${subscriber.currency}`] * 1.034 + 0.3 * (subscriber.currency === 'usd' ? 1.0 : currencyRate[`${subscriber.currency}`])).toFixed(1) : subscriber.price.toFixed(1) }`} </span>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '30px' }}></div>
                <div className="status-date">
                    <div className="status-date-part">
                        <span>Subscribe plan:</span>
                    </div>
                    <div className="status-date-part">
                        <span>{subscriber && (subscriber.status ? subscriber.plan.name : subscriber.planName)}</span>
                    </div>
                </div>
                <div className="status-date">
                    <div className="status-date-part">
                        <span>Subscribe since:</span>
                    </div>
                    <div className="status-date-part">
                        <span>
                            {subscriber && subscriber.createdAt.substring(8, 10) + "." + subscriber.createdAt.substring(5, 7) + "." + subscriber.createdAt.substring(0, 4)}
                        </span>
                    </div>
                </div>
                <div className="status-date">
                    <div className="status-date-part">
                        <span>{subscriber && (subscriber.status ? 'Next payment date:' : 'Effective until:')}</span>
                    </div>
                    <div className="status-date-part">
                        <span>
                            {subscriber && subscriber.nextInvoiceAt.substring(8, 10) + "." + subscriber.nextInvoiceAt.substring(5, 7) + "." + subscriber.nextInvoiceAt.substring(0, 4)}
                        </span>
                    </div>
                </div>
                <div className="benefits">
                    <div className="benefits-title">
                        <span>Subscribers can enjoy</span>
                    </div>
                    <div className="benefits-body">
                        {subscriber && 
                            <ul>
                                {subscriber.status ? 
                                    subscriber.plan.benefits.map((benefit: any, index: any) => (
                                        <li key={index}>{benefit}</li>
                                    )) 
                                :
                                    subscriber.benefits.map((benefit: any, index: any) => (
                                        <li key={index}>{benefit}</li>
                                    ))
                                }
                            </ul>
                        }
                    </div>
                </div>
                {(subscriber && subscriber.status === true) &&
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            fillStyle="fill"
                            color="secondary"
                            shape="rounded"
                            width={'240px'}
                            text="Unsubscribe"
                            handleSubmit={handleSubmit}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default SubscriptionCard