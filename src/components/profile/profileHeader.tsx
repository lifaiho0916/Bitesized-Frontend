import { useEffect, useState, useContext, useRef, useLayoutEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { LanguageContext } from "../../routes/authRoute"
import Button from "../general/button"
import Avatar from "../general/avatar"
import SubscribeModal from "../modals/SubscribeModal"
import AddCardModal from "../modals/AddCardModal"
import SubscribeSuccessModal from "../modals/SubscribeSoccessModal"
import {
  CheckIcon,
  EditIcon,
  MoreIcon,
} from "../../assets/svg"
import YoutubeSvg from "../../assets/svg/youtube.svg"
import IgSvg from "../../assets/svg/ig.svg"
import { accountAction } from "../../redux/actions/socialAccountActions"
import { subScriptionAction } from "../../redux/actions/subScriptionActions"
import { SET_DIALOG_STATE, SET_NAME_EXIST, SET_PROFILE, SET_URL_EXIST } from "../../redux/types"
import "../../assets/styles/profile/components/profileHeaderStyle.scss"

const useOutsideAlerter = (ref: any, moreInfo: any) => {
  const [more, setMore] = useState(moreInfo)
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      setMore(moreInfo)
      if (ref.current && !ref.current.contains(event.target)) {
        if (moreInfo) setMore(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, moreInfo])
  return more
}

const ProfileHeader = (props: any) => {
  const { same, profileUser, user } = props
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const contexts = useContext(LanguageContext)
  const [moreInfo, setMoreInfo] = useState(false)
  const wrapRef = useRef<any>(null)
  const res = useOutsideAlerter(wrapRef, moreInfo)
  const ref = useRef<any>(null)

  const [showMore, setShowMore] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [currency, setCurrency] = useState('usd')
  const [card, setCard] = useState(false)

  const accountState = useSelector((state: any) => state.account)
  const subScriptionState = useSelector((state: any) => state.subScription);
  const paymentState = useSelector((state: any) => state.payment)
  const loadState = useSelector((state: any) => state.load)
  const { account } = accountState
  const { subScription } = subScriptionState;
  const { payment } = paymentState
  const { dlgState } = loadState

  const [openSubscribeModal, setOpenSubscribeModal] = useState(false)
  const [openAddCardModal, setOpenAddCardModal] = useState(false)
  const [openSubscribeSuccessModal, setOpenSubscribeSuccessModal] = useState(false)

  const hasYoutube = useMemo(() => {
    if(account && account.social && account.social.youtube) return true
    else return false
  }, [account])

  const hasInstagram = useMemo(() => {
    if(account && account.social && account.social.instagram) return true
    else return false
  }, [account])

  const categoryText = useMemo(() => {
    if (profileUser) {
      if (profileUser.categories.length === 0) return ""
      else {
        let categories = profileUser.categories
        let texts = ""
        categories.sort((a: any, b: any) => { return a > b ? 1 : a < b ? -1 : 0 })
        categories.forEach((categoryIndex: any, index: any) => {
          texts += contexts.CREATOR_CATEGORY_LIST[categoryIndex]
          if (index < categories.length - 1) texts += "/"
        })
        return texts
      }
    }
  }, [profileUser, contexts.CREATOR_CATEGORY_LIST])

  const subscribed = useMemo(() => {
    if(subScription && user) {
      const fitlers = subScription.subscribers.filter((subscriber: any) => (String(subscriber.user) === String(user.id)) && subscriber.status === true)
      if(fitlers.length > 0) return true
      else return false
    } return false
  }, [subScription, user])

  const subscribe = () => {
    if(user) setOpenSubscribeModal(true)
    else navigate('/auth/signup')
  }

  const handleSubscribe = () => {
    setOpenSubscribeModal(false)
    if(payment) dispatch(subScriptionAction.subscribePlan(subScription._id, currency))
    else {
      setCard(true)
      setOpenAddCardModal(true)
    }
  }

  useEffect(() => {
    if(payment && card) {
      dispatch(subScriptionAction.subscribePlan(subScription._id, currency))
      setCard(false)
    }
  }, [payment, card, currency, subScription, dispatch])

  useEffect(() => { if (!res) setMoreInfo(res) }, [res])
  useLayoutEffect(() => {
    if (ref) {
      const updateSize = () => {
        if (ref.current.offsetWidth < ref.current.scrollWidth) setShowLink(true)
        else setShowLink(false)
      }
      updateSize()
      window.addEventListener("resize", updateSize)
      return () => window.removeEventListener("resize", updateSize)
    }
  }, [profileUser])

  useEffect(() => { if(profileUser) dispatch(accountAction.getAccount(profileUser._id)) }, [profileUser, dispatch])
  useEffect(() => { if(dlgState === "subscribed") setOpenSubscribeSuccessModal(true) }, [dlgState])

  return (
    <div className="profile-header">
      <SubscribeModal
        show={openSubscribeModal}
        onClose={() => setOpenSubscribeModal(false)}
        profileUser={profileUser}
        categoryText={categoryText}
        subScription={subScription}
        setCurrency={setCurrency}
        handleSubmit={handleSubscribe}
      />
      <AddCardModal
        show={openAddCardModal}
        onClose={() => setOpenAddCardModal(false)}
      />
      <SubscribeSuccessModal
        show={openSubscribeSuccessModal}
        creatorName={profileUser?.name}
        subscriptionName={subScription?.name}
        onClose={() => {
          dispatch({ type: SET_DIALOG_STATE, payload: "" })
          setOpenSubscribeSuccessModal(false)}
        }
        handleSubmit={() => {
          dispatch({ type: SET_DIALOG_STATE, payload: "" })
          setOpenSubscribeSuccessModal(false)
          navigate(`/${user?.personalisedUrl}?tab=subscription`)
        }}
      />
      <div className="avatar">
        <Avatar
          size="mobile"
          avatar={profileUser ? profileUser.avatar.indexOf('uploads') === -1 ? profileUser.avatar : `${process.env.REACT_APP_SERVER_URL}/${profileUser.avatar}` : ''}
        />
        <div className="social-icon-other">
          {hasYoutube === true &&
            <div 
              style={{ width:'40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => { window.open(`https://www.youtube.com/channel/${account.social.youtube}`, "_blank") }}
            >
              <img src={YoutubeSvg} alt="youtubeSvg" />
            </div>
          }
          {hasInstagram === true &&
            <div 
              style={{width:'40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => {}}
            >
              <img src={IgSvg} alt="igSvg" />
            </div>
          }
        </div>
      </div>
      <div className="ellipsis-icon" onClick={() => setMoreInfo(true)}>
        <MoreIcon color="black" />
      </div>
      <div className="userinfo-btns">
        <div className="name-category">
          <div className="name">
            <span>{profileUser ? profileUser.name : ''}</span>
          </div>
          <div className="category">
            <span>{categoryText}</span>
          </div>
        </div>
        <div className="btn-part">
          {(same === false && subScription && subScription.visible) &&
            <>
            {subscribed ?
              <Button
                text="Subscribed"
                fillStyle="outline"
                color="primary"
                shape="rounded"
                icon={[<CheckIcon color="#EFA058"/>, <CheckIcon color="white"/>, <CheckIcon color="white"/>]}
                handleSubmit={() => navigate(`/${user.personalisedUrl}?tab=subscription`)}
              />
             :
              <Button
                text="Subscribe"
                fillStyle="fill"
                color="primary"
                shape="rounded"
                handleSubmit={subscribe}
              />
            }
            </>
          }
        </div>
      </div>
      <div className="bio-text" style={profileUser?.bioText === "" ? { margin: '0px' } : {}}>
        <div ref={ref} className={showMore ? "" : "container"} style={{ width: showLink ? showMore ? '100%' : 'calc(100% - 55px)' : '100%' }}>
          {profileUser?.bioText}
        </div>
        {(showLink && !showMore) &&
          <div className="see-more" style={{ width: '50px' }}>
            <span onClick={() => { setShowMore(!showMore) }}>see more</span>
          </div>
        }
      </div>
      {same === true &&
        <div className="edit-profile-btn">
          <div className="edit-btn" onClick={() => {
            dispatch({
              type: SET_PROFILE,
              payload: {
                category: [],
                avatar: null,
                name: null,
                personalisedUrl: null,
                bioText: null,
                subscribe: null
              }
            })
            dispatch({ type: SET_NAME_EXIST, payload: false })
            dispatch({ type: SET_URL_EXIST, payload: false })
            navigate('/myaccount/edit')
          }}>
            <EditIcon color="white" />&nbsp;<span>{contexts.PROFILE.EDIT_PROFILE}</span>
          </div>
        </div>
      }
      <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
        <div className="list" onClick={() => {
          navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/${profileUser.personalisedUrl}`)
          setMoreInfo(false)
        }}>{"Copy link"}</div>
        <div className="list" onClick={() => { setMoreInfo(false) }}>{contexts.PROFILE_LETTER.CANCEL}</div>
      </div>
    </div >
  )
}

export default ProfileHeader
