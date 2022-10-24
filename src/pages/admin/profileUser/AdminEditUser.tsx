import { useState, useEffect, useContext, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import AvatarEditor from "react-avatar-editor"
import Input from "../../../components/general/input"
import Button from "../../../components/general/button"
import ToggleBtn from "../../../components/toggleBtn"
import HideUserModal from "../../../components/modals/HideUserModal"
import { BackIcon, VisibleIcon, HiddenIcon, EditIcon } from "../../../assets/svg"
import { authAction } from "../../../redux/actions/authActions"
import { LanguageContext } from "../../../routes/authRoute"
import { SET_PROFILE } from "../../../redux/types"
import "../../../assets/styles/admin/profileUser/AdminEditUserStyle.scss"

const AdminEditUser = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const contexts = useContext(LanguageContext)
    const userState = useSelector((state: any) => state.auth)
    const { users, profile, nameExist, urlExist } = userState
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [index, setIndex] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [name, setName] = useState<string>(profile.name)
    const [url, setUrl] = useState<string>(profile.personalisedUrl)
    const [bioText, setBioText] = useState(profile.bioText)
    const [subscribe, setSubscribe] = useState(profile.subscribe)
    const { state } = location
    let imageEditor: any = null

    const [openHideModal, setOpenHideModal] = useState(false)

    const setEditorRef = (editor: any) => (imageEditor = editor)
    const changeVisible = (visible: any) => {
        setOpenHideModal(false)
        dispatch(authAction.changeUserVisible(user._id, visible))
    }
    const handleFileUpload = (e: any) => {
        const files = e.target.files
        if (files.length > 0) {
            const file = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) })
            const state = { ...profile, avatar: file }
            dispatch({ type: SET_PROFILE, payload: state })
        }
    }
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
            dispatch(authAction.editProfile(name, url, profile.category, bioText, subscribe, imageFile, "admin/profile-user", user._id, navigate))
        }
    }

    useEffect(() => {
        if (state === null) navigate('/admin/profile-user')
        else setIndex(state.index)
    }, [location])
    useEffect(() => {
        if (index) {
            if (users.length === 0) navigate('/admin/profile-user')
            setUser(users[index - 1])
        }
    }, [index])
    useEffect(() => {
        if (user && profile.name === null) {
            dispatch({
                type: SET_PROFILE,
                payload: {
                    category: user.categories,
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
    }, [profile, user])
    useEffect(() => { if (name !== "" && user) dispatch(authAction.checkName(name, user._id)) }, [name, dispatch])
    useEffect(() => { if (url !== "" && user) dispatch(authAction.checkUrl(url, user._id)) }, [url, dispatch])

    return (
        <div className="admin-edit-user-wrapper">
            {user &&
                <>
                    <HideUserModal
                        show={openHideModal}
                        onClose={() => setOpenHideModal(false)}
                        handleSubmit={() => changeVisible(!user.visible)}
                    />
                    <div className="page-header">
                        <div onClick={() => navigate('/admin/profile-user')}><BackIcon color="black" /></div>
                        <div className="page-title"><span>User account</span></div>
                        <div>
                            <div onClick={() => {
                                if (user.visible) setOpenHideModal(true)
                                else changeVisible(!user.visible)
                            }}>
                                {user.visible ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" />}
                            </div>
                        </div>
                    </div>
                    <div className="admin-edit-user">
                        <div className="old-setting">
                            <div className="title"><span>Current Settings:</span></div>
                            <div className="avatar">
                                <AvatarEditor
                                    image={user.avatar.indexOf('uploads') === -1 ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}`}
                                    width={140}
                                    height={140}
                                    border={20}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            </div>
                            <div className="name">
                                <Input
                                    type="input"
                                    size="small"
                                    label={contexts.EDIT_PROFILE_LETTER.DISPLAY_NAME}
                                    wordCount={20}
                                    title={user.name}
                                    setTitle={() => { }}
                                    setFocus={() => { }}
                                    readOnly={true}
                                />
                            </div>
                            <div className="url">
                                <Input
                                    type="input"
                                    size="small"
                                    label={contexts.EDIT_PROFILE_LETTER.PERSONALISED_URL}
                                    wordCount={40}
                                    title={user.personalisedUrl}
                                    setTitle={() => { }}
                                    setFocus={() => { }}
                                    readOnly={true}
                                />
                            </div>
                            <div className="url">
                                <Input
                                    type="input"
                                    size="small"
                                    label={"Bio"}
                                    wordCount={50}
                                    title={user.bioText}
                                    setTitle={() => { }}
                                    setFocus={() => { }}
                                    readOnly={true}
                                />
                            </div>
                            {user.subscribe.available &&
                                <div className="subscription">
                                    <span>Subscription function</span>
                                    <ToggleBtn
                                        toggle={user.subscribe.switch}
                                    />
                                </div>
                            }
                            <div className="categories">
                                {user.categories.map((category: any, index: any) => (
                                    <div key={index} className="category"><span>{contexts.CREATOR_CATEGORY_LIST[category]}</span></div>
                                ))}
                            </div>
                        </div>
                        <div className="new-setting">
                            <div className="title"><span>Edit here:</span></div>
                            <div className="avatar">
                                <AvatarEditor
                                    ref={setEditorRef}
                                    image={profile.avatar ? profile.avatar.preview : user.avatar.indexOf('uploads') === -1 ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}`}
                                    width={140}
                                    height={140}
                                    border={20}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
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
                            <div className="name">
                                <Input
                                    type="input"
                                    size="small"
                                    placeholder={contexts.EDIT_PROFILE_LETTER.EDIT_HERE}
                                    label={contexts.EDIT_PROFILE_LETTER.DISPLAY_NAME}
                                    wordCount={20}
                                    title={name ? name : ""}
                                    setTitle={setName}
                                    setFocus={() => { }}
                                />
                            </div>
                            <span className="display-name-error">
                                {nameExist === true ? contexts.EDIT_PROFILE_LETTER.DISPLAY_NAME_ERROR : ""}
                            </span>
                            <div className="url">
                                <Input
                                    type="input"
                                    size="small"
                                    placeholder="bitesized.creatogether.io/jackychan"
                                    label={contexts.EDIT_PROFILE_LETTER.PERSONALISED_URL}
                                    wordCount={40}
                                    title={url ? url : ""}
                                    setTitle={setUrl}
                                    setFocus={() => { }}
                                />
                            </div>
                            <span className="display-name-error">
                                {urlExist === true ? contexts.EDIT_PROFILE_LETTER.URL_ERROR : ""}
                            </span>
                            <div className="url">
                                <Input
                                    type="input"
                                    size="small"
                                    placeholder="Tell the world about who you are :)"
                                    label={"Bio"}
                                    wordCount={50}
                                    title={bioText ? bioText : ""}
                                    setTitle={setBioText}
                                    setFocus={() => { }}
                                />
                            </div>
                            {user.subscribe.available &&
                                <div className="subscription">
                                    <span>Subscription function</span>
                                    <ToggleBtn
                                        toggle={subscribe}
                                        setToggle={setSubscribe}
                                    />
                                </div>
                            }
                            <div style={{ marginTop: '20px' }}>
                                <Button
                                    text="Edit Link Social Accounts"
                                    fillStyle="outline"
                                    color="primary"
                                    shape="rounded"
                                    width={"270px"}
                                    icon={[
                                        <EditIcon color="#EFA058" />,
                                        <EditIcon color="white" />,
                                        <EditIcon color="white" />,
                                    ]}
                                    handleSubmit={() => { }}
                                />
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Button
                                    text="Edit Categories"
                                    fillStyle="outline"
                                    color="primary"
                                    shape="rounded"
                                    width={"270px"}
                                    icon={[
                                        <EditIcon color="#EFA058" />,
                                        <EditIcon color="white" />,
                                        <EditIcon color="white" />,
                                    ]}
                                    handleSubmit={() => {
                                        const state = { ...profile, name: name, personalisedUrl: url, bioText: bioText, subscribe: subscribe }
                                        dispatch({ type: SET_PROFILE, payload: state })
                                        navigate('/admin/profile-user/edit/categories', { state: { index: index } })
                                    }}
                                />
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <Button
                                    text="Save"
                                    fillStyle="fill"
                                    color="primary"
                                    shape="rounded"
                                    handleSubmit={handleSave}
                                />
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default AdminEditUser