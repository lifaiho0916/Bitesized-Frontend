import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Avatar from "../general/avatar"
import CurrencySelect from "../stripe/CurrencySelect"
import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/PurchaseModalStyle.scss"

const currencies = ['USD', 'INR', 'TWD', 'HKD', 'MYR']
const displayCurrencies = ['USD - US Dollar', 'INR - Indian Rupee', 'TWD - New Taiwan Dollar', 'HKD - Hong Kong Dollar', 'MYR - Malaysian Ringgit']

const PurchaseModal = (props: any) => {
    const { show, onClose, bite, handleSubmit, setCurrency } = props
    const loadState = useSelector((state: any) => state.load)
    const userState = useSelector((state: any) => state.auth)
    const { currencyRate } = loadState
    const { user } = userState
    const [option, setOption] = useState(0)

    const displayPrice = (currency: any, price: any) => {
        if (currency) {
            let res = ""
            if (currency === 'usd') res += 'US $'
            else if (currency === 'hkd') res += 'HK $'
            else if (currency === 'inr') res += 'Rp ₹'
            else if (currency === 'twd') res += 'NT $'
            else res += 'RM '
            return res + price.toFixed(2)
        }
    }

    const displaySelectedPrice = (biteCurrency: any, price: any) => {
        if (currencyRate) {
            const usdPrice = biteCurrency === 'usd' ? price : price / currencyRate[`${biteCurrency}`]
            const currency = currencies[option].toLowerCase()
            const rate = currency === 'usd' ? 1.0 : currencyRate[`${currency}`]
            return ((usdPrice * 1.034 + 0.3) * rate).toFixed(2)
        }
    }

    useEffect(() => { setCurrency(currencies[option].toLowerCase()) }, [option])
    useEffect(() => {
        if (user) {
            const foundIndex = currencies.findIndex((currency: any) => currency.toLowerCase() === user.currency)
            setOption(foundIndex)
        }
    }, [user])

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="purchase">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span></span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="black" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="sub-title">
                            <span>Purchase a Bite</span>
                        </div>
                        <div className="purchase-card">
                            <Avatar
                                avatar={bite.owner ? bite.owner.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${bite.owner.avatar}` : bite.owner.avatar : ""}
                                size="mobile"
                            />
                            <div className="creator-price">
                                <div className="creator">
                                    <span>{bite.owner ? bite.owner.name : ""}</span>
                                </div>
                                <div className="price">
                                    <span>{bite.owner ? displayPrice(bite.currency, bite.price) : ''}</span>
                                </div>
                            </div>
                            <div className="bite-title">
                                <span>{bite.owner ? bite.title : ''}</span>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="sub-title">
                            <span>Select Currency</span>
                        </div>

                        <CurrencySelect
                            label="You will pay in:"
                            option={option}
                            setOption={setOption}
                            options={displayCurrencies}
                            width={'100%'}
                        />

                        <div className="charge-amount">
                            <span>You will be charged for&nbsp;</span>
                            <span style={{ color: '#EF4444' }}>{bite.owner ? displaySelectedPrice(bite.currency, bite.price) : ''}</span>
                            <span>&nbsp;in {currencies[option]}</span>
                        </div>
                        <div className="charge-amount" style={{ marginTop: '0px' }}>
                            <span>(Including processing fee)</span>
                        </div>
                        <div className="terms-and-privacy">
                            <span>By Clicking Next, you agree to <a href="https://www.notion.so/Terms-Conditions-of-Use-4e807f509cf54d569031fe254afbf713">Creato’s Terms & Conditions</a>, and <a href="https://www.notion.so/Privacy-Policy-f718ec335447402a8bb863cb72d3ee33">Privacy Policy</a>, and for payment processor - Stripe to charge your payment method.</span>
                        </div>
                        <div className="next-btn" style={{ marginBottom: '15px' }}>
                            <Button
                                text="Next"
                                fillStyle="fill"
                                color="primary"
                                shape="rounded"
                                width={'220px'}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseModal