import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { LanguageContext } from "../../routes/authRoute"
import Button from "../general/button"
import Avatar from "../general/avatar"
import {
  EditIcon,
  InstagramIcon,
  MoreIcon,
  YoutubeIcon,
} from "../../assets/svg"
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
  const { same, profileUser } = props
  const navigate = useNavigate()
  const userStore = useSelector((state: any) => state.auth);
  const dispatch = useDispatch()
  const { user } = userStore
  const contexts = useContext(LanguageContext)
  const [categoryText, setCategoryText] = useState("")
  const [moreInfo, setMoreInfo] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const wrapRef = useRef<any>(null)
  const res = useOutsideAlerter(wrapRef, moreInfo)
  const ref = useRef<any>(null)

  const [showMore, setShowMore] = useState(false)
  const [showLink, setShowLink] = useState(false)

  useEffect(() => {
    if (profileUser && profileUser.categories.length) {
      let categories = profileUser.categories
      let texts = ""
      categories.sort((a: any, b: any) => { return a > b ? 1 : a < b ? -1 : 0 })
      categories.forEach((categoryIndex: any, index: any) => {
        texts += contexts.CREATOR_CATEGORY_LIST[categoryIndex]
        if (index < categories.length - 1) texts += "/"
      })
      setCategoryText(texts)
    }
  }, [profileUser, contexts.CREATOR_CATEGORY_LIST])

  useEffect(() => {
    // if (user && profileUser) {
    //   profileUser.subscribed_users.forEach((item: any) => {
    //     if (item + "" === user.id + "") setSubscribed(true)
    //   })
    // }
  }, [user, profileUser])

  const subscribedUser = async () => {
    // try {
    //   if (user) {
    //     const result = await subscribeUser(profileUser._id)
    //     if (result.data.success) setSubscribed(!subscribed)
    //   } else navigate('/auth/signin')
    // } catch (err) {
    //   console.log({ err })
    // }
  }

  useEffect(() => {
    if (!res) setMoreInfo(res)
  }, [res])

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

  return (
    <div className="profile-header">
      <div className="avatar">
        <Avatar
          size="mobile"
          avatar={profileUser ? profileUser.avatar.indexOf('uploads') === -1 ? profileUser.avatar : `${process.env.REACT_APP_SERVER_URL}/${profileUser.avatar}` : ''}
        />
        <div className="social-icon-other">
          <div style={{ marginLeft: '15px' }}><YoutubeIcon color="#E17253" /></div>
          <div style={{ marginLeft: '5px' }}><InstagramIcon color="#E17253" /></div>
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
          {same === false &&
            <Button
              text="Subscribe"
              fillStyle="fill"
              color="primary"
              shape="rounded"
              handleSubmit={() => { window.open('https://www.creatogether.app/subscribenow', '_blank') }}
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
          navigator.clipboard.writeText(`bitesized.creatogether.io/${profileUser.personalisedUrl}`);
          setMoreInfo(false)
        }}>{"Copy link"}</div>
        <div className="list" onClick={() => { setMoreInfo(false) }}>{contexts.PROFILE_LETTER.CANCEL}</div>
      </div>
    </div >
  )
}

export default ProfileHeader
