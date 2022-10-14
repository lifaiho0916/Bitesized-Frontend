import { useNavigate } from "react-router-dom"
import '../assets/styles/profile/components/profileMenuStyle.scss'

const ProfileMenu = (props: any) => {
  const { urls, texts, selectedText } = props
  const navigate = useNavigate()

  return (
    <div className="profile-menu-wrapper">
      <div className={selectedText === texts[0] ? "dareme-fanwall-active" : 'dareme-fanwall'} onClick={() => { navigate(`/${urls[0]}`) }}>
        {texts[0]}
      </div>
      <div className={selectedText === texts[1] ? 'dareme-fanwall-active' : "dareme-fanwall"} onClick={() => { navigate(`/${urls[1]}`) }}>
        {texts[1]}
      </div>
    </div>
  )
}

export default ProfileMenu
