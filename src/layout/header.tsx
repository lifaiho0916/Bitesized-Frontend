import { useEffect, useState, useLayoutEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import decode from "jwt-decode";
import ContainerBtn from "../components/general/containerBtn";
import Button from "../components/general/button";
import SideMenu from "../components/sideMenu";
import Avatar from "../components/general/avatar";
import LangDialog from "../components/general/langDialog"
import { authAction } from "../redux/actions/authActions";
import { LogoIcon, AddIcon, LanguageIcon } from "../assets/svg";
import { LanguageContext } from "../routes/authRoute";
import { SET_DIALOG_STATE, SET_PREVIOUS_ROUTE, SET_USERS } from "../redux/types";
import "../assets/styles/headerStyle.scss";

const useWindowSize = () => {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() { setSize(window.innerWidth); }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const Header = () => {
  const width = useWindowSize()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const userState = useSelector((state: any) => state.auth)
  const contexts = useContext(LanguageContext)
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false)
  const [openLangSelect, setOpenLangSelect] = useState(false)
  const sideMenuRightPosition = openSideMenu === true ? "0px" : "-300px"
  const { user, lang } = userState

  const handleSubmit = () => {
    dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname })
    navigate("/auth/signin")
  }

  const handleLogout = () => {
    setOpenSideMenu(false)
    dispatch({ type: SET_PREVIOUS_ROUTE, payload: "/" })
    dispatch(authAction.logout(navigate))
  };

  const showSideMenu = () => { setOpenSideMenu(!openSideMenu) }
  const gotoHome = () => { navigate("/") }
  const gotoAdminHome = () => { navigate('/admin/check-bite') }
  const gotoCreate = () => { navigate("/bite/create-type") }

  const setLang = () => {
    setOpenLangSelect(true);
  }

  useEffect(() => {
    const token = localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`)
    if (token) {
      const decodedToken: any = decode(JSON.parse(token))
      if (decodedToken.exp * 1000 < new Date().getTime()) handleLogout()
    }
  }, [location, dispatch]);

  return (
    <div className="header-padding" style={user ? user.role === "ADMIN" ? width > 1010 ? {} : { padding: '87px' } : width > 1010 ? {} : { padding: '60px' } : {}}>
      <div className="header-wrapper">
        <LangDialog
          display={openLangSelect}
          wrapExit={() => { setOpenLangSelect(false) }}
          exit={() => { setOpenLangSelect(false) }}
          title="語言/Language"
          langauge={lang}
        />
        <div className="header">
          <div className="user-header">
            <div className="dare-creator" onClick={gotoHome}>
              <div className="header-logo" style={{ marginRight: '10px' }}><LogoIcon width={40} height={40} /></div>
              <h2>Creato</h2>
            </div>
            {user ? (
              <div className="user-info">
                {user &&
                  <>
                    {user.role === "ADMIN" &&
                      <div className="desktop-admin-btn" onClick={gotoAdminHome}>
                        <ContainerBtn styleType="fill" text={"Admin"} />
                      </div>
                    }
                    <div className="desktop-create-btn" onClick={gotoCreate}>
                      <ContainerBtn
                        icon={[<AddIcon color="white" />, <AddIcon color="white" />]}
                        styleType="fill"
                        text={contexts.GENERAL_LETTER.CREATE}
                      />
                    </div>
                  </>
                }
                <div className="avatar" onClick={showSideMenu}>
                  {user.new_notification && <div className="red-dot"></div>}
                  <Avatar
                    size="small"
                    avatarStyle="horizontal"
                    username=""
                    avatar={user.avatar.indexOf('uploads') === -1 ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}`}
                  />
                </div>
                <div
                  className="sideMeun"
                  style={{
                    right: sideMenuRightPosition,
                    top: user.role === "ADMIN" ? width > 1010 ? '70px' : '175px' : width > 1010 ? '70px' : '119px'
                  }}
                >
                  <SideMenu
                    setOpen={setOpenSideMenu}
                    handleLogout={handleLogout}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="sign-lang-btn">
                  <div className="lang-btn">
                    <Button
                      text={lang === 'EN' ?
                        width > 880 ? ' 繁體中文' : '中文' :
                        width > 880 ? 'English' : 'Eng'
                      }
                      fillStyle="fill"
                      color="primary"
                      shape="rounded"
                      icon={width > 880 ? [
                        <LanguageIcon color="white" />,
                        <LanguageIcon color="white" />,
                        <LanguageIcon color="white" />
                      ]
                        : undefined}
                      handleSubmit={setLang}
                    />
                  </div>
                  <div>
                    <Button
                      text={contexts.DIALOG.BUTTON_LETTER.SIGN_IN}
                      fillStyle="fill"
                      color="primary"
                      shape="rounded"
                      handleSubmit={handleSubmit}
                    />
                  </div>
                </div>
              </>
            )}
            {user &&
              <div
                className="transparent-bg"
                style={{
                  visibility: `${openSideMenu === true ? "visible" : "hidden"}`,
                  opacity: `${openSideMenu === true ? "0.2" : "0.0"}`,
                  top: user.role === "ADMIN" ? width > 1010 ? '70px' : '175px' : width > 1010 ? '70px' : '119px'
                }}
                onClick={() => setOpenSideMenu(false)}
              ></div>
            }
          </div>
          {user &&
            <>
              {user.role === "ADMIN" &&
                <div className="mobile-admin-btn" onClick={gotoAdminHome}>
                  <ContainerBtn styleType="fill" text={"Admin"} />
                </div>
              }
              <div className="mobile-create-btn" onClick={gotoCreate}>
                <ContainerBtn
                  icon={[<AddIcon color="white" />, <AddIcon color="white" />]}
                  styleType="fill"
                  text={contexts.GENERAL_LETTER.CREATE}
                />
              </div>
            </>
          }
        </div>
      </div>
    </div >
  );
};

export default Header;
