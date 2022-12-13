import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useContext, useState, useLayoutEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { LanguageContext } from "../routes/authRoute"
import Carousel from "react-spring-3d-carousel"
import { config } from "react-spring"
import Avatar from "../components/general/avatar"
import BiteCardHome from "../components/bite/BiteCardHome"
import { SET_USERS } from "../redux/types"
import { biteAction } from "../redux/actions/biteActions"
import { authAction } from "../redux/actions/authActions"
import CONSTANT from "../constants/constant"
import "../assets/styles/homeStyle.scss"

const useWindowSize = () => {
  const [size, setSize] = useState(0)
  useLayoutEffect(() => {
    const updateSize = () => { setSize(window.innerWidth) }
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])
  return size
}

const Home = () => {
  const width = useWindowSize()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const userState = useSelector((state: any) => state.auth)
  const biteState = useSelector((state: any) => state.bite)
  const contexts = useContext(LanguageContext)
  const [goToSlide, setGoToSlide] = useState<any>(null)
  const [cards, setCards] = useState<any>([])

  const { users } = userState
  const { bites } = biteState

  const [biteFilter, setBiteFilter] = useState(0)

  const showCategories = (categories: any) => {
    let category = ''
    categories.forEach((cate: any, index: any) => {
      category += contexts.CREATOR_CATEGORY_LIST[cate]
      if (index !== categories.length - 1) category += '/'
    })
    return category
  }
  const gotoCreators = () => { navigate('/creators') }
  const gotoBites = () => { navigate('/bites') }
  const gotoCreatoProfile = (url: any) => {
    dispatch({ type: SET_USERS, payload: [] })
    navigate(url)
  }

  useEffect(() => {
    dispatch(biteAction.getBitesFromHome(biteFilter))
  }, [location, dispatch, biteFilter])

  useEffect(() => {
    dispatch(authAction.getOwnersOfBites())
  }, [location, dispatch])

  let xDown: any = null
  let yDown: any = null

  const getTouches = (evt: any) => { return (evt.touches || evt.originalEvent.touches) }

  const handleTouchStart = (evt: any) => {
    const firstTouch = getTouches(evt)[0]
    xDown = firstTouch.clientX
    yDown = firstTouch.clientY
  }

  const handleTouchMove = (evt: any) => {
    if (!xDown || !yDown) return

    let xUp = evt.touches[0].clientX
    let yUp = evt.touches[0].clientY

    let xDiff = xDown - xUp
    let yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        if (goToSlide + 1 > bites.length - 1) setGoToSlide(0)
        else setGoToSlide((prev: any) => prev + 1)
      }
      else {
        if (goToSlide - 1 < 0) setGoToSlide(bites.length - 1)
        else setGoToSlide((prev: any) => prev - 1)
      }
    }
    xDown = null
    yDown = null
  }

  const preventTouch = (e: any) => {
    const minValue = 10 // threshold
    let xUp = e.touches[0].clientX
    let yUp = e.touches[0].clientY

    let xDiff = xDown - xUp
    let yDiff = yDown - yUp

    if (Math.abs(xDiff) > minValue && Math.abs(yDiff) < 50) {
      e.preventDefault()
      e.returnValue = false
      return false
    }
  }

  useEffect(() => {
    if (bites.length === 2) setGoToSlide(0)
    setCards(bites.map((bite: any, i: any) => {
      return {
        key: i,
        content: (
          <div style={{ width: 'fit-content', height: 'fit-content', transform: 'scale(0.9)' }}>
            <BiteCardHome bite={bite} />
          </div>
        )
      }
    }))
  }, [bites])

  useEffect(() => {
    window.addEventListener('touchmove', preventTouch, { passive: false })
    return () => {
      window.removeEventListener('touchmove', preventTouch)
    }
  }, [])

  return (
    <div className="home-wrapper">
      <div className="section" style={{ marginTop: '20px' }}>
        <div className="title">{contexts.HOME.BSK}</div>
        <div className="see-more" onClick={gotoBites}>
          <div className="description">{contexts.HOME.BSK_DESC}</div>
          <div className="divider"></div>
          <div className="see-more-btn">{width < 680 ? '··· ' : ''}{contexts.GENERAL.SEE_MORE}</div>
        </div>
        <div className="underline"></div>
        {/* <div className="bite-tags">
          <div
            className={biteFilter === -1 ? "tag active" : "tag"}
            onClick={() => setBiteFilter(-1)}
          >
            <span>Latest</span>
          </div>
          <div
            className={biteFilter === 0 ? "tag active" : "tag"}
            onClick={() => setBiteFilter(0)}
          >
            <span>All</span>
          </div>
          {CONSTANT.BITE_CATEGORIES.map((category: any, index: any) => (
            <div
              className={biteFilter === index + 1 ? "tag active" : "tag"}
              key={index}
              onClick={() => setBiteFilter(index + 1)}
            >
              <span>{category}</span>
            </div>
          ))}
        </div> */}
        {bites.length === 1 ?
          <div className="daremes scroll-bar" style={width < 680 ? { justifyContent: 'center', height: '650px', position: 'relative' } : {}}>
            {bites.map((bite: any, i: any) => (
              <div className="dareme" key={i} style={width < 680 ? { position: 'absolute', transform: 'scale(0.9)', top: -15 } : {}}>
                <BiteCardHome bite={bite} />
              </div>
            ))}
          </div>
          :
          <>
            {width > 680 ?
              <div className="daremes scroll-bar">
                {bites.map((bite: any, i: any) => (
                  <div className="dareme" key={i}>
                    <BiteCardHome bite={bite} />
                  </div>
                ))}
              </div>
              : bites.length === 2 ?
                <div
                  style={{ height: '650px', width: '100%', position: 'relative' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                >
                  {bites.map((bite: any, i: any) => (
                    <div style={i === 0 ? {
                      position: 'absolute',
                      zIndex: goToSlide === 0 ? 5 : 0,
                      left: goToSlide === 1 ? -60 : 0,
                      transform: goToSlide !== i ? 'scale(0.50)' : 'scale(0.9)',
                      transition: 'ease-in-out 0.3s',
                      top: -15
                    } : {
                      position: 'absolute',
                      zIndex: goToSlide === 1 ? 5 : 0,
                      right: goToSlide === 0 ? -60 : 0,
                      transform: goToSlide !== i ? 'scale(0.5)' : 'scale(0.9)',
                      transition: 'ease-in-out 0.3s',
                      top: -15
                    }} key={i}>
                      <div className={goToSlide !== i ? "dark" : ""} >
                        <BiteCardHome bite={bite} />
                      </div>
                    </div>
                  ))}
                </div>
                :
                <div className="daremes-mobile"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  style={bites.length === 0 ? { height: 0 } : {}}
                >
                  <Carousel
                    slides={cards.map((slide: any, index: any) => { return { ...slide, onClick: () => setGoToSlide(index) } })}
                    goToSlide={goToSlide}
                    offsetRadius={1}
                    showNavigation={false}
                    animationConfig={config.gentle}
                  />
                </div>
            }
          </>
        }
      </div>
      {
        users.length > 0 &&
        <div className="section">
          <div className="title">{contexts.HOME.CREATOR}</div>
          <div className="see-more" onClick={gotoCreators}>
            <div className="description">{contexts.HOME.CREATOR_DESC}</div>
            <div className="divider"></div>
            <div className="see-more-btn">{width < 680 ? '··· ' : ''}{contexts.GENERAL.SEE_MORE}</div>
          </div>
          <div className="underline"></div>
          <div className="users scroll-bar">
            {users.map((user: any, index: any) => (
              <div key={index} className="user" onClick={() => gotoCreatoProfile(`/${user.personalisedUrl}`)}>
                <Avatar
                  avatar={user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : user.avatar}
                  size="web"
                  hover={true}
                  avatarStyle="vertical"
                  category={showCategories(user.categories)}
                  username={user.name}
                />
              </div>
            ))}
          </div>
        </div>
      }
    </div >
  )
}

export default Home