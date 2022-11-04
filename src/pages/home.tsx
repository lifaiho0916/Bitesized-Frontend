import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useContext, useState, useLayoutEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { LanguageContext } from "../routes/authRoute"
import Carousel from "react-spring-3d-carousel"
import { config } from "react-spring"
import Avatar from "../components/general/avatar"
import BiteCardHome from "../components/bite/BiteCardHome"
import { SET_USERS } from "../redux/types"
import { biteAction } from "../redux/actions/biteActions"
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
  const carouselRef = useRef<any>(null)
  const [cards, setCards] = useState<any>([])

  const { users } = userState
  const { bites } = biteState

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

  useEffect(() => { dispatch(biteAction.getHomeSessions()) }, [location, dispatch])

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

  useEffect(() => {
    setCards(bites.map((bite: any, i: any) => {
      return {
        key: i,
        content: (
          <div style={{ width: 'fit-content', height: 'fit-content', transform: 'scale(0.9)' }}>
            <BiteCardHome bite={bite} index={i} />
          </div>
        )
      }
    }))
  }, [bites])

  return (
    <div className="home-wrapper">
      {bites.length > 0 &&
        <div className="section" style={{ marginTop: '20px' }}>
          <div className="title">💡Bite-sized Knowledge</div>
          <div className="see-more" onClick={gotoBites}>
            <div className="description">Learn Something New In Minutes</div>
            <div className="divider"></div>
            <div className="see-more-btn">{width < 680 ? '··· ' : ''}see more</div>
          </div>
          <div className="underline"></div>
          {width > 680 ?
            <div className="daremes scroll-bar">
              {bites.map((bite: any, i: any) => (
                <div className="dareme" key={i}>
                  <BiteCardHome bite={bite} />
                </div>
              ))}
            </div>
            :
            <div style={{ height: '650px' }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <Carousel
                slides={
                  cards.map((slide: any, index: any) => {
                    return { ...slide, onClick: () => setGoToSlide(index) }
                  })
                }
                goToSlide={goToSlide}
                offsetRadius={1}
                showNavigation={false}
                animationConfig={config.gentle}
                ref={carouselRef}
              />
            </div>
          }

        </div>
      }
      {users.length > 0 &&
        <div className="section">
          <div className="title">Creators You Might Like 🎨</div>
          <div className="see-more" onClick={gotoCreators}>
            <div className="description">Explore Skills & Knowledge from Creators</div>
            <div className="divider"></div>
            <div className="see-more-btn">{width < 680 ? '··· ' : ''}see more</div>
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