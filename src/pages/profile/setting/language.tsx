import { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { CheckIcon, BackIcon } from "../../../assets/svg"
import { useSelector } from "react-redux"
import { authAction } from "../../../redux/actions/authActions"
import { LanguageContext } from "../../../routes/authRoute"
import "../../../assets/styles/profile/languageStyle.scss"

const LanguageCurrency = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const contexts = useContext(LanguageContext)
  const { prevRoute } = loadState
  const { user } = userState

  return (
    <div className="lang-currency-wrapper">
      <div className="page-header">
        <div onClick={() => navigate(prevRoute)}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.LANGUAGE}</span></div>
        <div style={{ width: '24px' }}></div>
      </div>
      <div className="lang-currency">
        <div className="languages">
          <div className="language" onClick={() => { dispatch(authAction.setLanguage('EN', user)); }}>
            <div>English</div>
            <CheckIcon
              color={user?.language === "EN" ? "black" : "rgba(0,0,0,0)"}
            />
          </div>
          <div className="language" onClick={() => { dispatch(authAction.setLanguage('CH', user)); }}>
            <div>繁體中文</div>
            <CheckIcon
              color={user?.language === "CH" ? "black" : "rgba(0,0,0,0)"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageCurrency
