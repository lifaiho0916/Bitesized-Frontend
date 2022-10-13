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
import { SET_PROFILE_DATA } from "../../redux/types"
import { subscribeUser } from '../../api'
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

const useWindowSize = () => {
  const [size, setSize] = useState(0)
  useLayoutEffect(() => {
    const updateSize = () => { setSize(window.innerWidth) }
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])
  return size
}

const ProfileHeader = (props: any) => {
  const { same, profileUser } = props
  const width = useWindowSize()
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
    try {
      if (user) {
        const result = await subscribeUser(profileUser._id)
        if (result.data.success) setSubscribed(!subscribed)
      } else navigate('/auth/signin')
    } catch (err) {
      console.log({ err })
    }
  }

  useEffect(() => {
    if (!res) setMoreInfo(res)
  }, [res])

  return (
    <div className="profile-header">
      <div className="avatar" style={{ justifyContent: same ? 'center' : 'space-between' }}>
        <Avatar
          size="mobile"
          avatar={profileUser ? profileUser.avatar.indexOf('uploads') === -1 ? profileUser.avatar : `${process.env.REACT_APP_SERVER_URL}/${profileUser.avatar}` : ''}
        />
        {same === false &&
          <div className="social-icon-other">
            <div style={{ marginLeft: '15px' }}><YoutubeIcon color="#E17253" /></div>
            <div style={{ marginLeft: '5px' }}><InstagramIcon color="#E17253" /></div>
          </div>
        }
      </div >
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
          {same ?
            <div className="social-icon">
              <div style={{ marginLeft: '15px' }}><YoutubeIcon color="#E17253" /></div>
              <div style={{ marginLeft: '5px' }}><InstagramIcon color="#E17253" /></div>
            </div>
            :
            <Button
              text="Subscribe"
              fillStyle="fill"
              color="primary"
              shape="rounded"
              handleSubmit={() => { }}
            />
          }
        </div>
      </div>
      {same === true &&
        <div className="edit-profile-btn" style={{ justifyContent: width < 680 ? 'center' : 'flex-end' }}>
          <div className="edit-btn">
            <EditIcon color="white" />&nbsp;<span>Edit profile</span>
          </div>
        </div>
      }
      {/* <div className="icons">
        {props.property === "view" ? (
          <>
            <div style={{ marginRight: '10px' }}>
              {subscribed ?
                <Button
                  handleSubmit={subscribedUser}
                  color="primary"
                  shape="pill"
                  fillStyle="fill"
                  icon={[<NotificationSubscribedIcon color="white" />, <NotificationSubscribedIcon color="white" />, <NotificationSubscribedIcon color="white" />]}
                />
                :
                <Button
                  handleSubmit={subscribedUser}
                  color="primary"
                  shape="pill"
                  fillStyle="fill"
                  icon={[<NotificationOutlineIcon color="white" />, <NotificationOutlineIcon color="white" />, <NotificationOutlineIcon color="white" />]}
                />
              }
            </div>
          </>
        ) : (
          <>
            <div className="pen-icon" onClick={() => {
              if (user) {
                dispatch({
                  type: SET_PROFILE_DATA, payload: {
                    category: user.category,
                    avatarFile: null,
                    displayName: user.name,
                    creatoUrl: `www.creatogether.io/${user.personalisedUrl}`
                  }
                })
                navigate(`/myaccount/edit`)
              }
            }}>
              <EditIcon color="white" /><span>&nbsp;Edit</span>
            </div> */}
      {/* <div style={{ marginLeft: '15px' }}><YoutubeIcon color="#E17253" /></div>
            <div style={{ marginLeft: '5px' }}><InstagramIcon color="#E17253" /></div> */}
      {/* </>
        )}
      </div> */}
      <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
        <div className="list" onClick={() => {
          navigator.clipboard.writeText(`www.creatogether.io/${profileUser.personalisedUrl}`);
          setMoreInfo(false);
        }}>{contexts.PROFILE_LETTER.COPY_PROFILE_LINK}</div>
        <div className="list" onClick={() => { setMoreInfo(false) }}>{contexts.PROFILE_LETTER.CANCEL}</div>
      </div>
    </div >
  )
}

export default ProfileHeader
