import { useState, useEffect, useContext } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Avatar from "../general/avatar"
import CurrencySelect from "../stripe/CurrencySelect"
import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import { LanguageContext } from "../../routes/authRoute"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/modals/PurchaseModalStyle.scss"


const PurchaseModal = (props: any) => {
    const { show, onClose, bite, handleSubmit, setCurrency } = props
    const loadState = useSelector((state: any) => state.load)
    const userState = useSelector((state: any) => state.auth)
    const { currencyRate } = loadState
    const { user } = userState
    const [option, setOption] = useState(0)
    const contexts = useContext(LanguageContext)

    const displayPrice = (currency: any, price: any) => {
        if (currency) {
            const index = CONSTANT.CURRENCIES.findIndex((cur: any) => cur.toLowerCase() === currency)
            let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index]
            return res + price.toFixed(2)
        }
    }

    const displaySelectedPrice = (biteCurrency: any, price: any) => {
        if (currencyRate) {
            const usdPrice = biteCurrency === 'usd' ? price : price / currencyRate[`${biteCurrency}`]
            const currency = CONSTANT.CURRENCIES[option].toLowerCase()
            const rate = currency === 'usd' ? 1.0 : currencyRate[`${currency}`]
            return ((usdPrice * 1.034 + 0.3) * rate).toFixed(2)
        }
    }

    useEffect(() => { setCurrency(CONSTANT.CURRENCIES[option].toLowerCase()) }, [option, setCurrency])
    useEffect(() => {
        if (user) {
            const foundIndex = CONSTANT.CURRENCIES.findIndex((currency: any) => currency.toLowerCase() === user.currency)
            setOption(foundIndex)
        }
    }, [user, show])

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
                            <span>{contexts.MODALS.PURCHASE_BITE}</span>
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
                            <span>{contexts.MODALS.SELECT_CURRENCY}</span>
                        </div>

                        <CurrencySelect
                            label={contexts.MODALS.YOU_WILL_PAY_IN}
                            option={option}
                            setOption={setOption}
                            options={contexts.DISPLAY_CURRENCIES}
                            width={'100%'}
                        />

                        <div className="charge-amount">
                            <span>{contexts.MODALS.YOU_WILL_CHARGE_FOR}</span>
                            <span style={{ color: '#EF4444' }}>{bite.owner ? displaySelectedPrice(bite.currency, bite.price) : ''}</span>
                            <span>{contexts.MODALS.IN}{CONSTANT.CURRENCIES[option]}</span>
                        </div>
                        <div className="charge-amount" style={{ marginTop: '0px' }}>
                            <span>{contexts.MODALS.INCLUDE_PROCESSFEE}</span>
                        </div>
                        <div className="terms-and-privacy">
                            <span>{contexts.MODALS.PURCHASE_TANDC_PART1}<Link to="/terms">{contexts.MODALS.PURCHASE_TANDC_PART2}</Link>{contexts.MODALS.PURCHASE_TANDC_PART3}<Link to="/privacy-policy">{contexts.MODALS.PURCHASE_TANDC_PART4}</Link>{contexts.MODALS.PURCHASE_TANDC_PART5}</span>
                        </div>
                        <div className="next-btn" style={{ marginBottom: '15px' }}>
                            <Button
                                text={contexts.GENERAL.NEXT}
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