import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { loadStripe } from "@stripe/stripe-js"
import {
    Elements,
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js"
import Button from "../general/button"
import { SET_LOADING_TRUE, SET_LOADING_FALSE } from "../../redux/types"
import { CloseIcon, VisaCardIcon, VisaCardActiveIcon, MasterCardIcon, MasterCardActiveIcon, AECardIcon, AECardActiveIcon, UnionPayCardIcon, UnionPayCardActiveIcon } from "../../assets/svg"
import { paymentAction } from "../../redux/actions/paymentActions"
import "../../assets/styles/modals/AddCardModalStyle.scss"

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`)

const PaymentForm = (props: any) => {
    const { onClose } = props
    const dispatch = useDispatch()
    const [numberInfo, setNumberInfo] = useState<any>(null)
    const [cardType, setCardType] = useState("")
    const [holder, setHolder] = useState("")
    const elements = useElements()
    const stripe = useStripe()

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()
            if (!stripe || !elements) return
            const cardNumberElement: any = elements?.getElement(CardNumberElement)
            if (!cardNumberElement) console.log('No exit card!')
            dispatch({ type: SET_LOADING_TRUE })
            const token = await stripe.createToken(cardNumberElement, { name: holder })
            if (token.error) {
                dispatch({ type: SET_LOADING_FALSE })
                console.log(token.error.message)
            }

            onClose()
            dispatch(paymentAction.addCard(token.token, holder, cardType))
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    }

    useEffect(() => {
        const cardNumberElement: any = elements?.getElement(CardNumberElement)
        if (cardNumberElement) cardNumberElement.clear()
        const expiryElement: any = elements?.getElement(CardExpiryElement)
        if (expiryElement) expiryElement.clear()
        const cvcElement: any = elements?.getElement(CardCvcElement)
        if (cvcElement) cvcElement.clear()
        setHolder("")
    }, [props.show])

    const elementStyle = {
        lineHeight: '42px',
        color: '#54504E'
    }

    useEffect(() => {
        if (numberInfo) {
            if (numberInfo.empty === true) setCardType("")
            if (numberInfo.brand === "visa" && numberInfo.error?.code !== "invalid_number") setCardType("visa")
            if (numberInfo.brand === "mastercard" && numberInfo.error?.code !== "invalid_number") setCardType("mastercard")
            if (numberInfo.brand === "amex" && numberInfo.error?.code !== "invalid_number") setCardType("amex")
            if (numberInfo.brand === "unionpay" && numberInfo.error?.code !== "invalid_number") setCardType("unionpay")
        }
    }, [numberInfo])

    return (
        <form onSubmit={handleSubmit}>
            <div className="card-types">
                <div className="letter">
                    <span>Card Number</span>
                </div>
                <div className="card-type">
                    <div className="card">{cardType === "visa" ? <VisaCardActiveIcon /> : <VisaCardIcon />}</div>
                    <div className="card">{cardType === "mastercard" ? <MasterCardActiveIcon /> : <MasterCardIcon />}</div>
                    <div className="card">{cardType === "amex" ? <AECardActiveIcon /> : <AECardIcon />}</div>
                    <div className="card">{cardType === "unionpay" ? <UnionPayCardActiveIcon /> : <UnionPayCardIcon />}</div>
                </div>
            </div >
            <div className="card-number">
                <CardNumberElement
                    onChange={(e) => setNumberInfo(e)}
                    options={{
                        style: {
                            base: elementStyle,
                        },
                    }}
                />
            </div>
            <div className="card-holder-name">
                <div className="letter">
                    <span>Name of Card Holder</span>
                </div>
                <div className="holder-name">
                    <input
                        value={holder}
                        onChange={(e: any) => setHolder(e.target.value)}
                        placeholder="Card holder name"
                    />
                </div>
            </div>
            <div className="expire-cvv">
                <div className="expire">
                    <div className="letter">
                        <span>Expiry</span>
                    </div>
                    <div className="expire-ele">
                        <CardExpiryElement
                            options={{
                                style: {
                                    base: elementStyle,
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="cvv">
                    <div className="letter">
                        <span>CVV</span>
                    </div>
                    <div className="cvv-ele">
                        <CardCvcElement
                            options={{
                                style: {
                                    base: elementStyle,
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                    text={"Save"}
                    fillStyle="fill"
                    color="primary"
                    shape="rounded"
                    width={'220px'}
                    handleSubmit={handleSubmit}
                />
            </div>
        </form>
    )
}

const AddCardModal = (props: any) => {
    const { show, onClose } = props

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
                        <div className="header-card-title">
                            <span>Add a new Card</span>
                        </div>
                        <Elements stripe={stripePromise}>
                            <PaymentForm {...props} />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCardModal