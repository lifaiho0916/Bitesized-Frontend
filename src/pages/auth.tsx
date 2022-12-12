import { useState, useContext } from "react";
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import AppleLogin from "react-apple-login";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ThirdPartBrowserModal from "../components/modals/ThirdPartyBrowserModal";
import { LanguageContext } from "../routes/authRoute";
import { AppleButton, GoogleButton } from "../assets/svg";
import { authAction } from "../redux/actions/authActions";
import "../assets/styles/signupStyle.scss";
const InApp = require("detect-inapp");

declare global {
  interface Window {
    FB: any;
  }
}

const CustomGoogleLogin = (props: any) => {
  const { dispatch, lang, prevRoute, navigate } = props;
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const { data } = userInfo;

        let browser = "";
        if (navigator.userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
        else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari";
        else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = "Firefox";

        const userData = {
          name: data.name,
          email: data.email,
          authId: data.sub,
          avatar: data.picture,
          lang: lang,
          browser: browser,
        };

        dispatch(authAction.googleAuth(userData, navigate, prevRoute));
      } catch (err) {
        console.log(err);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div
      style={{
        cursor: "pointer",
        background: "#FFFFFF",
        boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
        borderRadius: "10px",
        width: "42px",
        height: "42px",
      }}
      onClick={() => googleLogin()}
    >
      <GoogleButton />
    </div>
  );
};

const Auth = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loadState = useSelector((state: any) => state.load);
  const { prevRoute } = loadState;
  const inapp = new InApp(navigator.userAgent || navigator.vendor || window.FB);
  const [openWith, setOpenWith] = useState(
    inapp.browser === "instagram" ||
      inapp.browser === "facebook" ||
      navigator.userAgent.toLowerCase().indexOf("line") !== -1
      ? true
      : false
  );
  const [isHover, setIsHover] = useState(false);
  const [isHover1, setIsHover1] = useState(false);
  // const [openSignupMethodErrorDlg, SetOpenSignupMethodErrorDlg] = useState(false)
  const userState = useSelector((state: any) => state.auth);
  const contexts = useContext(LanguageContext);
  const { lang } = userState;

  const signupStyle = {
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: isHover === true ? "black" : "#BCB6A9",
    textDecoration: isHover === true ? "underline" : "none",
  };

  const aStyle = {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    alignItems: "center",
    color: isHover === true ? "black" : "#BCB6A9",
    textDecoration: isHover === true ? "underline" : "none",
  };

  const aStyle1 = {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    alignItems: "center",
    color: isHover1 === true ? "black" : "#BCB6A9",
    textDecoration: isHover1 === true ? "underline" : "none",
  };

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
      let browser = "";
      if (navigator.userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
      else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari";
      else if (navigator.userAgent.indexOf("Firefox") !== -1)
        browser = "Firefox";

      const userData = {
        token: response.authorization.id_token,
        userInfo: response.user ? response.user : null,
        browser: browser,
        lang: lang,
      };

      dispatch(authAction.appleAuth(userData, navigate, prevRoute));
    }
  };

  // useEffect(() => {
  //   if (dlgState.state) {
  //     if (dlgState.type === 'error_signup_method') SetOpenSignupMethodErrorDlg(true)
  //   }
  // }, [dlgState])

  return (
    <>
      {/* <Dialog
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
      /> */}
      <ThirdPartBrowserModal
        show={openWith}
        onClose={() => setOpenWith(false)}
        handleSubmit={() => {
          const url = `${process.env.REACT_APP_CLIENT_URL}`;
          if (navigator.userAgent.indexOf("like Mac") !== -1) {
            if (navigator.userAgent.toLowerCase().indexOf("line") !== -1) {
              window.open(`googlechrome://${url.substring(8)}/auth/signin`);
            } else {
              window.open(`googlechrome://${url.substring(8)}/auth/signin`);
            }
          } else if (navigator.userAgent.indexOf("Android") !== -1) {
            if (navigator.userAgent.toLowerCase().indexOf("line") !== -1) {
              let link = document.createElement("a");
              link.setAttribute("href", `intent:${url}/auth/signin#Intent;end`);
              link.setAttribute("target", "_blank");
              link.click();
            } else {
              window.open(`googlechrome://${url.substring(8)}/auth/signin`);
            }
          }
        }}
      />
      <div className="signup-wrapper">
        {props.isSignin === false ? (
          <div>
            <h4>{contexts.AUTH.SIGN_UP_TO_ENJOY}</h4>
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
            {contexts.AUTH.HEADER}
            <br />
            <br />
            {contexts.AUTH.LOGIN_WITH}
          </h2>
        )}
        <div className="icons">
          <GoogleOAuthProvider
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
          >
            <CustomGoogleLogin
              lang={lang}
              dispatch={dispatch}
              prevRoute={prevRoute}
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
              <div
                style={{
                  cursor: "pointer",
                  background: "#FFFFFF",
                  boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
                  borderRadius: "10px",
                  width: "42px",
                  height: "42px",
                }}
                onClick={renderProps.onClick}
              >
                <AppleButton />
              </div>
            )}
          />
        </div>
        {props.isSignin === false ? (
          <p>
            {contexts.AUTH_LETTER.BY_SIGN_UP}
            <Link
              onMouseOver={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              style={aStyle}
              to="/terms"
            >
              {" "}
              {contexts.AUTH_LETTER.TERMS}
            </Link>
            {contexts.AUTH_LETTER.AND}
            <Link
              onMouseOver={() => setIsHover1(true)}
              onMouseLeave={() => setIsHover1(false)}
              style={aStyle1}
              to="/privacy-policy"
            >
              {contexts.AUTH_LETTER.PRIVACY_POLICY}
            </Link>
          </p>
        ) : (
          <div style={{ display: "flex", alignItems: 'center' }}>
            <p>{contexts.AUTH.SIGN_UP_PART1}&nbsp;</p>
            <p
              onMouseOver={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onClick={() => navigate("/auth/signup")}
              style={signupStyle}
            >
              {contexts.AUTH.SIGN_UP_PART2}
            </p>
            <p>&nbsp;{contexts.AUTH.SIGN_UP_PART3}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Auth;
