import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useContext, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { LanguageContext } from "../routes/authRoute"
import Avatar from "../components/general/avatar"
import BiteCardHome from "../components/bite/BiteCardHome"
import PurchaseModal from "../components/modals/PurchaseModal"
import UnLockFreeModal from "../components/modals/UnLockFreeModal"
import PaymentForm from "../components/stripe/paymentForm"
import { SET_DIALOG_STATE, SET_USERS } from "../redux/types"
import { biteAction } from "../redux/actions/biteActions"
import "../assets/styles/homeStyle.scss"

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const userState = useSelector((state: any) => state.auth)
  const biteState = useSelector((state: any) => state.bite)
  const loadState = useSelector((state: any) => state.load)
  const contexts = useContext(LanguageContext)
  const [bite, setBite] = useState<any>(null)
  const [openFreeUnlock, setOpenFreeUnLock] = useState(false)
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false)
  const [openPaymentForm, setOpenPaymentForm] = useState(false)

  const { users, user } = userState
  const { bites } = biteState
  const { dlgState } = loadState

  const showCategories = (categories: any) => {
    let category = ''
    categories.forEach((cate: any, index: any) => {
      category += contexts.CREATOR_CATEGORY_LIST[cate]
      if (index !== categories.length - 1) category += '/'
    })
    return category
  }
  const gotoCreators = () => { navigate('/creators') }
  const gotoBites = () => { navigate('/bites') }
  const gotoCreatoProfile = (url: any) => {
    dispatch({ type: SET_USERS, payload: [] })
    navigate(url)
  }

  useEffect(() => { dispatch(biteAction.getHomeSessions()) }, [location, dispatch])
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
    <div className="home-wrapper">
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
      {bites.length > 0 &&
        <div className="section" style={{ marginTop: '20px' }}>
          <div className="title">Bite-sized Knowledge 💡</div>
          <div className="see-more" onClick={gotoBites}>See More</div>
          <div className="daremes scroll-bar">
            {bites.map((bite: any, i: any) => (
              <div className="dareme" key={i}>
                <BiteCardHome bite={bite} setBite={setBite} />
              </div>
            ))
            }
          </div>
        </div>
      }
      {users.length > 0 &&
        <div className="section">
          <div className="title">Creators You Might Like 🎨</div>
          <div className="see-more" onClick={gotoCreators}>See More</div>
          <div className="users scroll-bar">
            {users.map((user: any, index: any) => (
              <div key={index} className="user" onClick={() => gotoCreatoProfile(`/${user.personalisedUrl}`)}>
                <Avatar
                  avatar={user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : user.avatar}
                  size="web"
                  avatarStyle="vertical"
                  category={showCategories(user.categories)}
                  username={user.name}
                />
              </div>
            ))}
          </div>
        </div>
      }
    </div >
  )
}

export default Home