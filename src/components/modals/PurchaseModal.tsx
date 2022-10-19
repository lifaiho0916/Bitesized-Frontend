import { useSelector } from "react-redux"
import Avatar from "../general/avatar"
import Button from "../general/button"
import { CloseIcon } from "../../assets/svg"
import "../../assets/styles/modals/PurchaseModalStyle.scss"

const PurchaseModal = (props: any) => {
    const { show, title, onClose, bite, handleSubmit } = props
    const loadState = useSelector((state: any) => state.load)
    const { currencyRate } = loadState

    const displayPrice = (currency: any, price: any) => {
        if (currency) {
            if (currency === 'usd') return `$USD ${price.toFixed(2)}`
            else return `$USD ${currencyRate ? (price / currencyRate[`${currency}`]).toFixed(2) : ''}`
        } return "FREE"
    }

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="purchase">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>{title ? title : ''}</span>
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
                                avatar={bite ? bite.owner.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${bite.owner.avatar}` : bite.owner.avatar : ""}
                                size="mobile"
                            />
                            <div className="creator-price">
                                <div className="creator">
                                    <span>{bite ? bite.owner.name : ""}</span>
                                </div>
                                <div className="price">
                                    <span>{bite ? displayPrice(bite.currency, bite.price) : ''}</span>
                                </div>
                            </div>
                            <div className="bite-title">
                                <span>{bite ? bite.title : ''}</span>
                            </div>
                        </div>

                        <div className="next-btn">
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