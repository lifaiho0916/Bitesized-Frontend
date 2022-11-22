import { useEffect, useState, useContext, useRef, useLayoutEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { LanguageContext } from "../../routes/authRoute"
import Button from "../general/button"
import Avatar from "../general/avatar"
import SubscribeModal from "../modals/SubscribeModal"
import {
  EditIcon,
  MoreIcon,
} from "../../assets/svg"
import YoutubeSvg from "../../assets/svg/youtube.svg"
import IgSvg from "../../assets/svg/ig.svg"
import { accountAction } from "../../redux/actions/socialAccountActions"
import { SET_NAME_EXIST, SET_PROFILE, SET_URL_EXIST } from "../../redux/types"
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

  const accountState = useSelector((state: any) => state.account)
  const subScriptionState = useSelector((state: any) => state.subScription);
  const { account } = accountState
  const { subScription } = subScriptionState;

  const [openSubscribeModal, setOpenSubscribeModal] = useState(false)

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

  const subscribe = () => {
    if(user) {
      setOpenSubscribeModal(true)
    } else navigate('/auth/signup')
  }

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

  useEffect(() => { if(profileUser) dispatch(accountAction.getAccount(profileUser._id)) }, [profileUser])

  return (
    <div className="profile-header">
      <SubscribeModal
        show={openSubscribeModal}
        onClose={() => setOpenSubscribeModal(false)}
        profileUser={profileUser}
        categoryText={categoryText}
        subScription={subScription}
        setCurrency={setCurrency}
        handleSubmit={() => { console.log("sss") }}
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
            <Button
              text="Subscribe"
              fillStyle="fill"
              color="primary"
              shape="rounded"
              handleSubmit={subscribe}
            />
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
            <EditIcon color="white" />&nbsp;<span>Edit profile</span>
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
