import { useEffect, useState, useContext } from "react"
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import AppleLogin from 'react-apple-login'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import Dialog from "../components/general/dialog"
import { LanguageContext } from "../routes/authRoute"
import { 
  AppleIcon,
  // FacebookIcon,
  GoogleIcon
} from "../constants/awesomeIcons"
import { SET_DIALOG_STATE } from "../redux/types"
import { authAction } from "../redux/actions/authActions"
import "../assets/styles/signupStyle.scss"
const InApp = require("detect-inapp")

declare global {
  interface Window {
    FB: any;
  }
}

const CustomGoogleLogin = (props: any) => {
  const { dispatch, lang, preveRoute, navigate } = props
  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } })
        const { data } = userInfo

        let browser = ""
        if (navigator.userAgent.indexOf("Chrome") !== -1) browser = 'Chrome'
        else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari"
        else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = 'Firefox'

        const userData = {
          name: data.name,
          email: data.email,
          authId: data.sub,
          avatar: data.picture,
          lang: lang,
          browser: browser
        }

        dispatch(authAction.googleAuth(userData, navigate, preveRoute))
      } catch (err) {
        console.log(err)
      }
    },
    onError: errorResponse => console.log(errorResponse),
  })

  return (
    <div className="icon" onClick={() => googleLogin()}>
      <GoogleIcon color="#EFA058" />
    </div>
  )
}

const Auth = (props: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loadState = useSelector((state: any) => state.load)
  const { dlgState, prevRoute } = loadState
  const inapp = new InApp(navigator.userAgent || navigator.vendor || window.FB)
  const [openWith, setOpenWith] = useState(inapp.browser === 'instagram' || inapp.browser === 'facebook' || navigator.userAgent.toLowerCase().indexOf('line') !== -1 ? true : false);
  const [isHover, setIsHover] = useState(false)
  const [isHover1, setIsHover1] = useState(false)
  const [openSignupMethodErrorDlg, SetOpenSignupMethodErrorDlg] = useState(false)
  const lang = useSelector((state: any) => state.auth.lang)
  const contexts = useContext(LanguageContext)

  const signupStyle = {
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: isHover === true ? "black" : "#BCB6A9",
    textDecoration: isHover === true ? "underline" : "none",
  }

  const aStyle = {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    alignItems: "center",
    color: isHover === true ? "black" : "#BCB6A9",
    textDecoration: isHover === true ? "underline" : "none",
  }

  const aStyle1 = {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    alignItems: "center",
    color: isHover1 === true ? "black" : "#BCB6A9",
    textDecoration: isHover1 === true ? "underline" : "none",
  }

  // const responseFacebook = (response: any) => {
  //   console.log(response)
  //   let browser = "";
  //   if (navigator.userAgent.indexOf("Chrome") !== -1) browser = 'Chrome';
  //   else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari";
  //   else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = 'Firefox';

  //   const userData = ({
  //     name: response.name,
  //     avatar: response.picture.data.url,
  //     email: response.email,
  //     facebookId: response.id,
  //     browser: browser
  //   });
  //   if (props.isSignin) dispatch(authAction.facebookSigninUser(userData, navigate, prevRoute));
  //   else dispatch(authAction.facebookSignupUser(userData, navigate, prevRoute));
  // }

  const responseApple = (response: any) => {
    if (!response.error) {
      let browser = ""
      if (navigator.userAgent.indexOf("Chrome") !== -1) browser = 'Chrome'
      else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari"
      else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = 'Firefox'

      const userData = {
        token: response.authorization.id_token,
        userInfo: response.user ? response.user : null,
        browser: browser,
        lang: lang,
      }

      dispatch(authAction.appleAuth(userData, navigate, prevRoute))
    }
  }

  useEffect(() => {
    if (dlgState.state) {
      if (dlgState.type === 'error_signup_method') SetOpenSignupMethodErrorDlg(true)
    }
  }, [dlgState])

  return (
    <>
      <Dialog
        display={openSignupMethodErrorDlg}
        title="Oops!"
        exit={() => {
          SetOpenSignupMethodErrorDlg(false)
          dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
        }}
        wrapExit={() => {
          SetOpenSignupMethodErrorDlg(false)
          dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
        }}
        context={"You've already signed up with Creato! 😄👏🏻"}
        buttons={[
          {
            text: 'Sign In Now',
            handleClick: () => {
              SetOpenSignupMethodErrorDlg(false)
              navigate('/auth/signin')
            }
          }
        ]}
      />
      <Dialog
        display={openWith}
        title="Open In Browser 🌐"
        context={"Open in browser\nfor a better experience.\n\n開啓瀏覽器\n獲得更好的用戶體驗"}
        exit={() => { setOpenWith(false); }}
        wrapExit={() => { setOpenWith(false); }}
        buttons={[
          {
            text: 'Open / 開啓',
            handleClick: () => {
              const serverUrl = `${process.env.REACT_APP_SERVER_URL}`
              if (navigator.userAgent.indexOf('like Mac') !== -1) {
                if (navigator.userAgent.toLowerCase().indexOf('line') !== -1) {
                  window.open(`googlechrome://${serverUrl.substring(8)}/auth/signin`);
                } else {
                  window.open(`googlechrome://${serverUrl.substring(8)}/auth/signin`);
                }
              } else if (navigator.userAgent.indexOf('Android') !== -1) {
                if (navigator.userAgent.toLowerCase().indexOf('line') !== -1) {
                  let link = document.createElement('a');
                  link.setAttribute("href", `intent:${serverUrl}/auth/signin#Intent;end`);
                  link.setAttribute("target", "_blank");
                  link.click();
                } else {
                  window.open(`googlechrome://${serverUrl.substring(8)}/auth/signin`);
                }
              }
            }
          }
        ]}
      />
      <div className="signup-wrapper">
        {props.isSignin === false ? (
          <div>
            <h4>{contexts.AUTH_LETTER.SIGN_UP_TO_ENJOY}</h4>
            <br />
            <ul>
              <li>✅ Gain bite-sized knowledge in seconds.</li>
              <li>✅ Learn skills curated by Creators.</li>
              <li>✅ Few minutes well spent in daily learning.</li>
            </ul>
            <br />
            <h2>{contexts.AUTH_LETTER.SIGN_UP_WITH}</h2>
          </div>
        ) : (
          <h2>
            {contexts.AUTH_LETTER.WELCOME_BACK}
            <br />
            <br />
            {contexts.AUTH_LETTER.LOGIN_WITH}
          </h2>
        )}
        <div className="icons">
          <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
            <CustomGoogleLogin
              lang={lang}
              dispatch={dispatch}
              preveRoute={prevRoute}
              navigate={navigate}
            />
          </GoogleOAuthProvider>
          {/* <FacebookLogin
            appId={CONSTANT.FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            scope="public_profile,email,user_link"
            callback={responseFacebook}
            render={(renderProps) => (
              <div className="icon" onClick={renderProps.onClick}>
                <FacebookIcon color="#EFA058" />
              </div>
            )}
          /> */}
          <AppleLogin
            clientId={`${process.env.REACT_APP_APPLE_CLIENT_ID}`}
            redirectURI={`${process.env.REACT_APP_APPLE_REDIRECT_URL}`}
            callback={responseApple} // Catch the response
            scope="email name"
            responseMode="query"
            usePopup={true}
            render={(renderProps) => (
              <div className="icon" onClick={renderProps.onClick}>
                <AppleIcon color="#EFA058" />
              </div>
            )}
          />
        </div>
        {
          props.isSignin === false ? (
            <p>{contexts.AUTH_LETTER.BY_SIGN_UP}
              <a
                onMouseOver={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                style={aStyle}
                href="https://www.notion.so/Terms-Conditions-of-Use-4e807f509cf54d569031fe254afbf713" target="_blank"> {contexts.AUTH_LETTER.TERMS}</a>{contexts.AUTH_LETTER.AND}<a onMouseOver={() => setIsHover1(true)}
                  onMouseLeave={() => setIsHover1(false)}
                  style={aStyle1} href="https://www.notion.so/Privacy-Policy-f718ec335447402a8bb863cb72d3ee33" target="_blank">{contexts.AUTH_LETTER.PRIVACY_POLICY}</a></p>
          ) : (
            <div
              style={{
                display: "flex",
              }}
            >
              <p>{contexts.AUTH_LETTER.NEW_CREATO}</p>
              <p
                onMouseOver={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => navigate('/auth/signup')}
                style={signupStyle}
              >
                {contexts.AUTH_LETTER.SIGN_UP}
              </p>
              <p>{contexts.AUTH_LETTER.NOW}</p>
            </div>
          )
        }
      </div >
    </>
  )
}

export default Auth
