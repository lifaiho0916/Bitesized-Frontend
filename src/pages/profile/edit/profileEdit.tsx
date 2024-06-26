import { useEffect, useState, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import AvatarEditor from 'react-avatar-editor'
import { authAction } from "../../../redux/actions/authActions"
import ContainerBtn from "../../../components/general/containerBtn"
import Button from "../../../components/general/button"
import Input from "../../../components/general/input"
import ToggleBtn from "../../../components/toggleBtn"
import { SET_PROFILE } from "../../../redux/types"
import { AddIcon, SpreadIcon, BackIcon } from "../../../assets/svg"
import Dialog from "../../../components/general/dialog"
import { LanguageContext } from "../../../routes/authRoute"
import "../../../assets/styles/profile/profileEditStyle.scss"

const ProfileEdit = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let imageEditor: any = null
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, profile, nameExist, urlExist } = userState
  const { prevRoute } = loadState
  const [name, setName] = useState<string>(profile.name)
  const [url, setUrl] = useState<string>(profile.personalisedUrl)
  const [bioText, setBioText] = useState(profile.bioText)
  const [subscribe, setSubscribe] = useState(profile.subscribe)
  const [openLinkSocial, setOpenLinkSocial] = useState(false)
  const contexts = useContext(LanguageContext)

  const handleSave = async () => {
    if (nameExist === false && urlExist === false) {
      let imageFile: any = null
      if (profile.avatar && imageEditor) {
        const canvas = imageEditor.getImage()
        let url = canvas.toDataURL('image/png')
        const res = await fetch(url)
        const blob = await res.blob()
        imageFile = new File([blob], 'avatar.png', blob)
      }
      dispatch(authAction.editProfile(name, url, profile.category, bioText, subscribe, imageFile, prevRoute.indexOf('bite') !== -1 ? prevRoute : `/${url}` , user.id, navigate))
    }
  }

  const setEditorRef = (editor: any) => (imageEditor = editor)

  const handleFileUpload = (e: any) => {
    const files = e.target.files
    if (files.length > 0) {
      const file = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) })
      const state = { ...profile, avatar: file }
      dispatch({ type: SET_PROFILE, payload: state })
    }
  }

  useEffect(() => { if (name !== "" && user) dispatch(authAction.checkName(name, user.id)) }, [name, dispatch, user])
  useEffect(() => { if (url !== "" && user) dispatch(authAction.checkUrl(url, user.id)) }, [url, dispatch, user])

  useEffect(() => {
    if (user && profile.name === null) {
      dispatch({
        type: SET_PROFILE,
        payload: {
          category: user.category,
          avatar: null,
          name: user.name,
          personalisedUrl: user.personalisedUrl,
          bioText: user.bioText,
          subscribe: user.subscribe.switch
        }
      })
      setName(user.name)
      setUrl(user.personalisedUrl)
      setBioText(user.bioText)
      setSubscribe(user.subscribe.switch)
    }
  }, [profile, user, dispatch])

  return (
    <div className="profile-edit-wrapper">
      <div className="page-header">
        <div onClick={() => navigate(`/${user.personalisedUrl}`)}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.PROFILE.EDIT_PROFILE}</span></div>
        <div style={{ width: '24px' }}></div>
      </div>
      <div className="profile-edit">
        <Dialog
          display={openLinkSocial}
          wrapExit={() => { setOpenLinkSocial(false) }}
          title={contexts.DIALOG.HEADER_TITLE.STAY_TUNED}
          icon={
            {
              pos: 0,
              icon: <SpreadIcon color="#EFA058" width="50px" height="50px" />
            }
          }
          context={contexts.DIALOG.BODY_LETTER.LAUNCHING_SOON}
        />
        <div className="avatar-info">
          <div className="avatar">
            {user &&
              <AvatarEditor
                ref={setEditorRef}
                image={profile.avatar ? profile.avatar.preview : user.avatar.indexOf('uploads') === -1 ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}`}
                width={150}
                height={150}
                border={30}
                color={[0, 0, 0, 0.6]} // RGBA
                scale={1.0}
              />
            }
          </div>
          <div className="description" onClick={() => fileInputRef.current?.click()}>{contexts.GENERAL.EDIT}</div>
          <input
            hidden
            ref={fileInputRef}
            type="file"
            accept="image/*"
            value=""
            onChange={handleFileUpload}
          />
        </div>
        <div className="display-name">
          <Input
            type="input"
            placeholder={contexts.PROFILE.DISPLAY_NAME}
            size="small"
            label={contexts.PROFILE.DISPLAY_NAME}
            wordCount={20}
            title={name ? name : ''}
            setTitle={setName}
            setFocus={() => { }}
          />
        </div>
        {nameExist === true ?
          <span className="display-name-error">
            {contexts.EDIT_PROFILE_LETTER.DISPLAY_NAME_ERROR}
          </span> : ""
        }
        <div className="url">
          <Input
            type="input"
            placeholder="creatogether.io/jackychan"
            label={contexts.PROFILE.PERSONAL_URL}
            wordCount={40}
            size="small"
            title={url ? url : ''}
            isUrl={true}
            setTitle={setUrl}
            setFocus={() => { }}
          />
        </div>
        {urlExist === true ?
          <span className="display-name-error">
            {contexts.EDIT_PROFILE_LETTER.URL_ERROR}
          </span> : ""
        }
        <div className="url">
          <Input
            type="input"
            placeholder="Tell the world about who you are :)"
            label={"Bio"}
            wordCount={50}
            size="small"
            title={bioText ? bioText : ''}
            setTitle={setBioText}
            setFocus={() => { }}
          />
        </div>
        {(user && user.subscribe && user.subscribe.available) &&
          <div className="subscription">
            <span>Subscription function</span>
            <ToggleBtn
              toggle={subscribe}
              setToggle={setSubscribe}
            />
          </div>
        }
        <div
          className="social-link"
          onClick={() => {
            const state = { ...profile, name: name, personalisedUrl: url, bioText: bioText, subscribe: subscribe }
            dispatch({ type: SET_PROFILE, payload: state })
            navigate("/myaccount/edit/connect-social")
          }}
        >
          <ContainerBtn
            styleType="outline"
            icon={[<AddIcon color="#efa058" />, <AddIcon color="white" />, <AddIcon color="white" />]}
            text={contexts.PROFILE.LINK_SOCIAL}
          />
        </div>
        <div
          className="categories"
          onClick={() => {
            const state = { ...profile, name: name, personalisedUrl: url, bioText: bioText, subscribe: subscribe }
            dispatch({ type: SET_PROFILE, payload: state })
            navigate(`/myaccount/edit/categories`)
          }}
        >
          <ContainerBtn styleType="outline" text={contexts.GENERAL.CATEGORIES} />
        </div>
        <div className="save-btn">
          <Button
            fillStyle="fill"
            text={contexts.GENERAL.SAVE}
            color="primary"
            shape="rounded"
            width="100px"
            handleSubmit={handleSave}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileEdit
