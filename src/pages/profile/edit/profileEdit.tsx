import { useEffect, useState, useRef, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import AvatarEditor from 'react-avatar-editor'
import { authAction } from "../../../redux/actions/authActions"
import ContainerBtn from "../../../components/general/containerBtn"
import Button from "../../../components/general/button"
import Input from "../../../components/general/input"
import { SET_NAME_EXIST, SET_PROFILE, SET_URL_EXIST } from "../../../redux/types"
import { AddIcon, SpreadIcon, BackIcon } from "../../../assets/svg"
import Dialog from "../../../components/general/dialog"
import { LanguageContext } from "../../../routes/authRoute"
import "../../../assets/styles/profile/profileEditStyle.scss"

const ProfileEdit = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  let imageEditor: any = null
  const userState = useSelector((state: any) => state.auth)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, profile } = userState
  const existName = userState.nameExist
  const existURL = userState.urlExist
  const [name, setName] = useState<string>("")
  const [url, setUrl] = useState<string>('www.creatogether.io/')
  const [openLinkSocial, setOpenLinkSocial] = useState(false)
  const contexts = useContext(LanguageContext)

  const handleSave = async () => {
    if (existName === false && existURL === false) {
      let imageFile: any = null
      if (profile.avatarFile && imageEditor) {
        const canvas = imageEditor.getImage()
        let url = canvas.toDataURL('image/png')
        const res = await fetch(url)
        const blob = await res.blob()
        imageFile = new File([blob], 'avatar.png', blob)
      }
      // const url = creatoURL.substring(0, 20)
      if (url !== 'www.creatogether.io/') alert("Wrong Url")
      else {
        // const creato = creatoURL.substring(20)
        // dispatch(authAction.saveProfileInfo(displayName, creato, profile.category, imageFile, navigate))
      }
    }
  };

  const setEditorRef = (editor: any) => (imageEditor = editor)

  const handleFileUpload = (e: any) => {
    const files = e.target.files
    if (files.length > 0) {
      const file = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) })
      const state = { ...profile, avatarFile: file }
      dispatch({ type: SET_PROFILE, payload: state })
    }
  }

  useEffect(() => { if (name !== "") dispatch(authAction.checkName(name)) }, [name, dispatch])
  useEffect(() => { if (url !== "") dispatch(authAction.checkUrl(url)) }, [url, dispatch])

  useEffect(() => {
    if (user && profile.name === null) {
      setName(user.name)
      setUrl(user.personalisedUrl)
    }
  }, [profile, user])

  return (
    <div className="profile-edit-wrapper">
      <div className="page-header">
        <div onClick={() => navigate(`/${user.personalisedUrl}`)}><BackIcon color="black" /></div>
        <div className="page-title"><span>Edit Profile</span></div>
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
                image={profile.avatarFile ? profile.avatarFile.preview : user.avatar.indexOf('uploads') === -1 ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}`}
                width={150}
                height={150}
                border={30}
                color={[0, 0, 0, 0.6]} // RGBA
                scale={1.0}
              />
            }
          </div>
          <div className="description" onClick={() => fileInputRef.current?.click()}>{contexts.EDIT_PROFILE_LETTER.EDIT}</div>
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
            placeholder={contexts.EDIT_PROFILE_LETTER.EDIT_HERE}
            size="small"
            label={contexts.EDIT_PROFILE_LETTER.DISPLAY_NAME}
            wordCount={20}
            title={name ? name : ''}
            setTitle={setName}
            setFocus={() => { }}
          />
        </div>
        {existName === true ?
          <span className="display-name-error">
            {contexts.EDIT_PROFILE_LETTER.DISPLAY_NAME_ERROR}
          </span> : ""
        }
        <div className="url">
          <Input
            type="input"
            placeholder="bitesized.creatogether.io/jackychan"
            label={contexts.EDIT_PROFILE_LETTER.PERSONALISED_URL}
            wordCount={40}
            size="small"
            title={url ? url : ''}
            isUrl={true}
            setTitle={setUrl}
            setFocus={() => { }}
          />
        </div>
        {existURL === true ?
          <span className="display-name-error">
            {contexts.EDIT_PROFILE_LETTER.URL_ERROR}
          </span> : ""
        }
        <div
          className="social-link"
          onClick={() => {
            navigate("/myaccount/edit/connect_social")
            // setOpenLinkSocial(true);
          }}
        >
          <ContainerBtn
            styleType="outline"
            icon={[<AddIcon color="#efa058" />, <AddIcon color="white" />, <AddIcon color="white" />]}
            text={contexts.EDIT_PROFILE_LETTER.LINK_SOCIAL_ACCOUNT}
          />
        </div>
        <div
          className="categories"
          onClick={() => {
            const state = { ...profile, displayName: name, creatoUrl: url };
            dispatch({ type: SET_PROFILE, payload: state });
            navigate(`/myaccount/edit/categories`);
          }}
        >
          <ContainerBtn styleType="outline" text={contexts.EDIT_PROFILE_LETTER.CATEGORIES} />
        </div>
        <div className="save-btn">
          <Button
            fillStyle="fill"
            text={contexts.GENERAL_LETTER.SAVE}
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
