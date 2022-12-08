import { useContext } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ProfileIcon, SettingIcon, LanguageIcon, ListViewIcon, MoneyIcon, GridViewIcon } from "../assets/svg"
import { LanguageContext } from "../routes/authRoute"
import { LogoutIcon } from "../constants/awesomeIcons"
import "../assets/styles/sideMenuStyle.scss"

const SideMenu = (props: any) => {
  const navigate = useNavigate()
  const contexts = useContext(LanguageContext)
  const userState = useSelector((state: any) => state.auth)
  const user = userState.user

  const handleAdminPanel = () => {
    navigate("/admin/check-bite")
    props.setOpen(false)
  }
  const handleProfile = () => {
    navigate(`/${user.personalisedUrl}`)
    props.setOpen(false)
  }
  const handleWallet = () => {
    navigate(`/myaccount/wallet`)
    props.setOpen(false)
  }
  const handleCreators = () => {
    navigate(`/creators`)
    props.setOpen(false)
  }
  const handleBites = () => {
    navigate('/bites')
    props.setOpen(false)
  }
  const handleSetting = () => {
    navigate(`/myaccount/setting`)
    props.setOpen(false)
  }
  const handleLanguage = () => {
    navigate(`/myaccount/setting/language-currency`)
    props.setOpen(false)
  }

  return (
    <div className="side-menu-wrapper">
      <div className="side-menu">
        {(user && user.role === "ADMIN") &&
          <div className="list" onClick={handleAdminPanel}>
            <div className="icon">
              <ProfileIcon color="black" />
            </div>
            <p>Admin Panel</p>
          </div>
        }
        <div className="list" onClick={handleProfile}>
          <div className="icon">
            <ProfileIcon color="black" />
          </div>
          <p>{contexts.SIDEMENU.MY_PROFILE}</p>
        </div>
        <div className="list" onClick={handleWallet}>
          <div className="icon">
            <MoneyIcon color="black" />
          </div>
          <p>{contexts.SIDEMENU.MY_WALLET}</p>
        </div>
        <div className="list" onClick={handleCreators}>
          <div className="icon">
            <GridViewIcon color="black" />
          </div>
          <p>{contexts.SIDEMENU.LIST_OF_CREATORS}</p>
        </div>
        <div className="list" onClick={handleBites}>
          <div className="icon">
            <ListViewIcon color="black" />
          </div>
          <p>{contexts.SIDEMENU.LIST_OF_BITES}</p>
        </div>
        <div className="list" onClick={handleLanguage} >
          <div className="icon">
            <LanguageIcon color="black" />
          </div>
          <p>{contexts.SIDEMENU.LANGUAGE_CURRENCY}</p>
        </div>
        <div className="list" onClick={handleSetting}>
          <div className="icon">
            <SettingIcon color="black" />
          </div>
          <p>{contexts.SIDEMENU.SETTING}</p>
        </div>
        <div className="logout list" onClick={props.handleLogout} >
          <div className="icon" style={{ paddingLeft: '2px' }}>
            <LogoutIcon color="black" />
          </div>
          <p>{contexts.SIDEMENU.LOGOUT}</p>
        </div>
      </div>
    </div>
  )
}

export default SideMenu