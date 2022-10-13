import { useNavigate } from "react-router-dom"
import '../assets/styles/profile/components/profileMenuStyle.scss'

const ProfileMenu = (props: any) => {
  const { url } = props
  const navigate = useNavigate()

  return (
    <div className="profile-menu-wrapper">
      <div className={props.menu === "purchase" ? "dareme-fanwall-active" : 'dareme-fanwall'} onClick={() => { navigate(`/${url}`) }}>
        My purchases
      </div>
      <div className={props.menu === "mine" ? 'dareme-fanwall-active' : "dareme-fanwall"} onClick={() => { navigate(`/${url}/fanwall`) }}>
        My Bites
      </div>
    </div>
  )
}

export default ProfileMenu
