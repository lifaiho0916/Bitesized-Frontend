import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { biteAction } from "../../redux/actions/biteActions"
import ProfileHeader from "../../components/profile/profileHeader"
import ProfileMenu from "../../components/profileMenu"
import Button from "../../components/general/button"
import BiteCardProfile from "../../components/bite/BiteCardProfile"
import PurchaseModal from "../../components/modals/PurchaseModal"
import PaymentForm from "../../components/stripe/paymentForm"
import UnLockFreeModal from "../../components/modals/UnLockFreeModal"
import { AddIcon, CreatoCoinIcon } from "../../assets/svg"
import { SET_PREVIOUS_ROUTE, SET_DIALOG_STATE } from "../../redux/types"
import "../../assets/styles/profile/profileStyle.scss"

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const biteState = useSelector((state: any) => state.bite)
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const { bites } = biteState
  const { user, users } = userState
  const { dlgState } = loadState
  const authuser = users.length ? users[0] : null
  const [isSame, setIsSame] = useState(false)

  const [bite, setBite] = useState<any>(null)
  const [openFreeUnlock, setOpenFreeUnLock] = useState(false)
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false)
  const [openPaymentForm, setOpenPaymentForm] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()
  const code = searchParams.get("mybites")

  useEffect(() => {
    const personalisedUrl = location.pathname.substring(1)
    dispatch(biteAction.getProfileSessions(personalisedUrl, user?.id))
  }, [location.pathname, dispatch, user])

  useEffect(() => {
    if (authuser && user && user.id === authuser._id) setIsSame(true)
    else setIsSame(false)
  }, [authuser, user])

  useEffect(() => {
    if (dlgState === 'unlock_free') setOpenFreeUnLock(true)
  }, [dlgState])

  useEffect(() => {
    if (bite) {
      if (bite.currency) setOpenPurchaseModal(true)
      else dispatch(biteAction.unLockBite(bite._id, bite.currency, bite.price, null, null))
    }
  }, [bite])

  useEffect(() => {
    if (code !== null && authuser) {
      if (user) {
        if (String(user.id) !== String(authuser._id)) navigate(`/${authuser.personalisedUrl}`)
      } else navigate(`/${authuser.personalisedUrl}`)
    }
  }, [code, user, authuser])

  return (
    <div className="profile-wrapper">
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
      <div className="profile">
        <ProfileHeader same={isSame} profileUser={authuser ? authuser : null} />
        {isSame ?
          <>
            <div className="profile-menu">
              <ProfileMenu
                selectedText={code === null ? "My Purchases" : "My Bites"}
                texts={["My Purchases", "My Bites"]}
                urls={authuser ? [authuser.personalisedUrl, `${authuser.personalisedUrl}?mybites`] : ["", ""]}
              />
            </div>
            <div className="creators-bite">
              {(bites.length > 0 && authuser) ?
                <div className="bite-card">
                  {bites.filter((bite: any) => {
                    if (code === null) return String(bite.owner._id) !== String(authuser._id)
                    else return String(bite.owner._id) === String(authuser._id)
                  }).sort((first: any, second: any) => {
                    if (user) {
                      let firstDate: any = "2322"
                      let secondDate: any = "2322"
                      let firstIndex = first.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id))
                      let secondIndex = second.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id))
                      if (firstIndex !== -1) firstDate = first.purchasedUsers[firstIndex].purchasedAt
                      if (secondIndex !== -1) secondDate = second.purchasedUsers[secondIndex].purchasedAt
                      if (firstDate > secondDate) return 1
                      else if (firstDate < secondDate) return -1
                      else {
                        if (first.date < second.date) return 1
                        else if (first.date > second.date) return -1
                        return 0
                      }
                    } else {
                      if (first.currency && second.currency === null) return 1
                      else if (first.currency === null && second.currency) return -1
                      else {
                        if (first.date < second.date) return 1
                        else if (first.date > second.date) return -1
                        return 0
                      }
                    }
                  }).map((bite: any, index: any) => (
                    <div className="profile-bite" key={index}>
                      <BiteCardProfile bite={bite} setBite={setBite} same={isSame} />
                    </div>
                  ))}
                </div> :
                <div className="no-data">
                  <span>There is no "Bite" yet </span>
                  {code !== null &&
                    <div
                      style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Button
                        text="Create"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"300px"}
                        icon={[
                          <AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />
                        ]}
                        handleSubmit={() => navigate('/bite/create-type')}
                      />
                    </div>
                  }
                </div>
              }
            </div>
          </>
          :
          <div className="creators-bite">
            <div className="title">
              <CreatoCoinIcon color="#EFA058" width={30} height={30} />
              <p>{authuser ? authuser.name : ''}'s Bite</p>
            </div>
            {(bites.length > 0 && authuser) ?
              <div className="bite-card">
                {bites.sort((first: any, second: any) => {
                  if (user) {
                    let firstDate: any = "2222"
                    let secondDate: any = "2222"
                    let firstIndex = first.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id))
                    let secondIndex = second.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id))
                    if (firstIndex !== -1) firstDate = first.purchasedUsers[firstIndex].purchasedAt
                    if (secondIndex !== -1) secondDate = second.purchasedUsers[secondIndex].purchasedAt
                    if (firstDate > secondDate) return 1
                    else if (firstDate < secondDate) return -1
                    else {
                      if (first.date < second.date) return 1
                      else if (first.date > second.date) return -1
                      return 0
                    }
                  } else {
                    if (first.currency && second.currency === null) return 1
                    else if (first.currency === null && second.currency) return -1
                    else {
                      if (first.date < second.date) return 1
                      else if (first.date > second.date) return -1
                      return 0
                    }
                  }
                })
                  .map((bite: any, index: any) => (
                    <div className="profile-bite" key={index}>
                      <BiteCardProfile bite={bite} setBite={setBite} />
                    </div>
                  ))}
              </div>
              :
              <div className="no-data">
                <span>There is no "Bite" yet </span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Profile