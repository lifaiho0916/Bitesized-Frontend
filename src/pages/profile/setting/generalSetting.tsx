import { useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  AlertIcon,
  CreatoCoinIcon,
  ForwardIcon,
  LanguageIcon,
  NoOfPeopleIcon,
  BackIcon
} from "../../../assets/svg"
import { WalletIcon } from "../../../constants/awesomeIcons"
import { useNavigate, Link } from "react-router-dom"
import { LanguageContext } from "../../../routes/authRoute"
import { SET_PREVIOUS_ROUTE } from "../../../redux/types"
import "../../../assets/styles/profile/generalSettingStyle.scss"

const GeneralSetting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.auth);
  const contexts = useContext(LanguageContext);
  const user = userState.user;

  return (
    <div className="setting-wrapper">
      <div className="page-header">
        <div onClick={() => navigate(`/${user.personalisedUrl}`)}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.SETTINGS}</span></div>
        <div style={{ width: '24px' }}></div>
      </div>
      <div className="setting-general">
        <div className="settings">
          <div className="setting" onClick={() => navigate(`/myaccount/setting/payout`)}>
            <div className="part" style={{ marginLeft: '4px' }}>
              <WalletIcon color="black" />
              <div className="title">{contexts.SETTINGS_LETTER.PAYOUT}</div>
            </div>
            <ForwardIcon color="black" />
          </div>
          <div
            className="setting"
            onClick={() => {
              dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/myaccount/setting` });
              navigate(`/myaccount/setting/language-currency`)
            }}
          >
            <div className="part">
              <LanguageIcon color="black" />
              <div className="title">Language and Currency</div>
            </div>
            <ForwardIcon color="black" />
          </div>
          <a href="https://www.creatogether.app/" target="_blank" rel="noreferrer">
            <div className="setting">
              <div className="part">
                <CreatoCoinIcon color="black" />
                <div className="title">{contexts.SETTINGS_LETTER.ABOUT_US}</div>
              </div>
            </div>
          </a>
          <Link to="/terms">
            <div className="setting">
              <div className="part">
                <NoOfPeopleIcon color="" />
                <div className="title">{contexts.SETTINGS_LETTER.TERMS_CONDITIONS}</div>
              </div>
            </div>
          </Link>
          <Link to="/privacy-policy">
            <div className="setting">
              <div className="part">
                <NoOfPeopleIcon color="" />
                <div className="title">{contexts.SETTINGS_LETTER.PRIVACY_POLICIES}</div>
              </div>
            </div>
          </Link>
          <a href="https://www.creatogether.app/contact-us" target="_blank" rel="noreferrer">
            <div className="setting">
              <div className="part">
                <AlertIcon color="black" />
                <div className="title">{contexts.SETTINGS_LETTER.CONTACT_US}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default GeneralSetting
