import { useEffect, useState, useLayoutEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import decode from "jwt-decode";
import ContainerBtn from "../components/general/containerBtn";
import Button from "../components/general/button";
import SideMenu from "../components/sideMenu";
import Avatar from "../components/general/avatar";
import LangDialog from "../components/general/langDialog"
import { authAction } from "../redux/actions/authActions";
import { LogoIcon, AddIcon, LanguageIcon, SearchIcon, BackIcon } from "../assets/svg";
import { biteAction } from "../redux/actions/biteActions";
import { LanguageContext } from "../routes/authRoute";
import { SET_PREVIOUS_ROUTE, SET_SEARCH_RESULTS } from "../redux/types";
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

const useOutsideAlerter = (ref: any, moreInfo: any) => {
  const [more, setMore] = useState(moreInfo)
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      setMore(moreInfo)
      if (ref.current && !ref.current.contains(event.target)) {
        if (moreInfo) setMore(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, moreInfo])
  return more
}

const Header = () => {
  const width = useWindowSize()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const contexts = useContext(LanguageContext)
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false)
  const [openLangSelect, setOpenLangSelect] = useState(false)
  const sideMenuRightPosition = openSideMenu === true ? "0px" : "-300px"
  const { user, lang } = userState
  const [openSearch, setOpenSearch] = useState(false)
  const [search, setSearch] = useState("")
  const { searchResults } = loadState
  const [searchResult, setSearchResult] = useState(false)
  const wrapRef = useRef<any>(null)
  const res = useOutsideAlerter(wrapRef, searchResult)

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

  const setLang = () => { setOpenLangSelect(true) }
  useEffect(() => { if (!res) setSearchResult(res) }, [res])
  useEffect(() => {
    const token = localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`)
    if (token) {
      const decodedToken: any = decode(JSON.parse(token))
      if (decodedToken.exp * 1000 < new Date().getTime()) handleLogout()
    }
  }, [location, dispatch]);

  useEffect(() => { dispatch(biteAction.getSearchResult(search)) }, [search])
  useEffect(() => {
    if (searchResults.length > 0) setSearchResult(true)
    else setSearchResult(false)
  }, [searchResults])

  return (
    <div className="header-padding">
      <div className="header-wrapper">
        <LangDialog
          display={openLangSelect}
          wrapExit={() => { setOpenLangSelect(false) }}
          exit={() => { setOpenLangSelect(false) }}
          title="Langue/Language"
          langauge={lang}
        />
        <div className="header">
          <div className="mobile-search-input"
            style={{
              transition: '0.3s',
              marginRight: openSearch ? 0 : `${-width * 2}px`
            }}
          >
            <div className="back-icon" onClick={() => {
              setOpenSearch(false)
              setSearch("")
            }}>
              <BackIcon color="black" width={25} height={25} />
            </div>
            <div className="search-input">
              <div className="icon-part">
                <SearchIcon color="#7E7875" />
              </div>
              <div className="input-text">
                <input value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="search-icon">
              <SearchIcon color="#7E7875" />
            </div>
            <div className="search-result" style={searchResult === true ? { visibility: 'visible', opacity: 1 } : {}}>
              {searchResults.map((result: any, index: any) => (
                <div className="search-item" key={index} onClick={() => {
                  navigate(result.url)
                  dispatch({ type: SET_SEARCH_RESULTS, payload: [] })
                  setSearch("")
                }}>
                  <span>
                    {result.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
                    <div className="desktop-search-bar">
                      <div className="search-input">
                        <div className="icon-part">
                          <SearchIcon color="#7E7875" />
                        </div>
                        <div className="input-text">
                          <input value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                      </div>
                      <div className="search-icon">
                        <SearchIcon color="#7E7875" />
                      </div>
                      <div className="search-result" style={searchResult === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
                        {searchResults.map((result: any, index: any) => (
                          <div className="search-item" key={index} onClick={() => {
                            navigate(result.url)
                            dispatch({ type: SET_SEARCH_RESULTS, payload: [] })
                            setSearch("")
                          }}>
                            <span>
                              {result.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="desktop-create-btn" onClick={gotoCreate}>
                      <ContainerBtn
                        icon={[<AddIcon color="white" />, <AddIcon color="white" />]}
                        styleType="fill"
                        text={contexts.GENERAL_LETTER.CREATE}
                      />
                    </div>
                    <div className="mobile-search-icon" onClick={() => setOpenSearch(true)}>
                      <SearchIcon color="#54504e" width={30} height={30} />
                    </div>
                    <div className="mobile-create-btn" onClick={gotoCreate}>
                      <AddIcon color="#54504e" />
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
                    top: '65px'
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
                    {width > 680 ?
                      <Button
                        text={lang === 'EN' ? 'Français' : 'English'}
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        icon={[
                          <LanguageIcon color="white" />,
                          <LanguageIcon color="white" />,
                          <LanguageIcon color="white" />
                        ]}
                        handleSubmit={setLang}
                      />
                      :
                      <div className="mobile-btn" onClick={setLang}>
                        <LanguageIcon color="white" />,
                      </div>
                    }
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
                  top: '65px'
                }}
                onClick={() => setOpenSideMenu(false)}
              ></div>
            }
          </div>
        </div>
      </div>
    </div >
  );
};

export default Header;
