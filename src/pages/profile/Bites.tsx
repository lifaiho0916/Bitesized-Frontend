import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import ProfileMenu from "../../components/profileMenu"
import BiteCardProfile from "../../components/bite/BiteCardProfile"
import PurchaseModal from "../../components/modals/PurchaseModal"
import PaymentForm from "../../components/stripe/paymentForm"
import UnLockFreeModal from "../../components/modals/UnLockFreeModal"
import { biteAction } from "../../redux/actions/biteActions"
import { BackIcon } from "../../assets/svg"
import { SET_DIALOG_STATE } from "../../redux/types"
import '../../assets/styles/profile/creatorListStyle.scss'

const Bites = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const biteState = useSelector((state: any) => state.bite)
    const loadState = useSelector((state: any) => state.load)
    const userState = useSelector((state: any) => state.auth)
    const [bite, setBite] = useState<any>(null)
    const { bites } = biteState
    const { dlgState } = loadState
    const { user } = userState

    const [openFreeUnlock, setOpenFreeUnLock] = useState(false)
    const [openPurchaseModal, setOpenPurchaseModal] = useState(false)
    const [openPaymentForm, setOpenPaymentForm] = useState(false)

    useEffect(() => { dispatch(biteAction.getBitesList()) }, [location, dispatch])
    useEffect(() => {
        if (dlgState === 'unlock_free') setOpenFreeUnLock(true)
    }, [dlgState])

    useEffect(() => {
        if (bite) {
            if (bite.currency) setOpenPurchaseModal(true)
            else dispatch(biteAction.unLockBite(bite._id, bite.currency, bite.price, null))
        }
    }, [bite])

    return (
        <div className="creator-wrapper">
            <div className="page-header">
                <div onClick={() => { navigate('/') }}><BackIcon color="black" /></div>
                <div className="page-title"><span>List of Bites</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <PurchaseModal
                show={openPurchaseModal}
                onClose={() => {
                    setOpenPurchaseModal(false)
                    setBite(null)
                }}
                bite={bite}
                handleSubmit={() => {
                    if (user) {
                        setOpenPurchaseModal(false)
                        setOpenPaymentForm(true)
                    }
                }}
            />
            <UnLockFreeModal
                show={openFreeUnlock}
                title="Sucessful"
                onClose={() => {
                    setOpenFreeUnLock(false)
                    dispatch({ type: SET_DIALOG_STATE, payload: "" })
                }}
                bite={bite}
                handleSubmit={() => {
                    dispatch({ type: SET_DIALOG_STATE, payload: "" })
                    navigate(`/${user.personalisedUrl}`)
                }}
            />
            <PaymentForm
                display={openPaymentForm}
                exit={() => {
                    setBite(null)
                    setOpenPaymentForm(false)
                }}
                wrapExit={() => {
                    setBite(null)
                    setOpenPaymentForm(false)
                }}
                bite={bite ? { id: bite._id, currency: bite.currency, price: bite.price } : null}
            />
            <div className="list-menu">
                <ProfileMenu
                    selectedText="Bites"
                    texts={["Creators", "Bites"]}
                    urls={["creators", "bites"]}
                />
            </div>
            <div className="bites">
                {bites.map((bite: any, index: any) => (
                    <div className="bite" key={index}>
                        <BiteCardProfile
                            bite={bite}
                            setBite={setBite} same={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Bites