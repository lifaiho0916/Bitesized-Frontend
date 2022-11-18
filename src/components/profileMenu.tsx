import { useNavigate } from "react-router-dom"
import '../assets/styles/profile/components/profileMenuStyle.scss'

const ProfileMenu = (props: any) => {
  const { urls, texts, selectedText } = props
  const navigate = useNavigate()

  return (
    <div className="profile-menu-wrapper">
      {urls.map((url: any, index: any) => (
        <div key={index} className={selectedText === texts[index] ? "dareme-fanwall-active" : 'dareme-fanwall'} onClick={() => { navigate(`/${url}`) }}>
          {texts[index]}
        </div>  
      ))}
    </div>
  )
}

export default ProfileMenu
