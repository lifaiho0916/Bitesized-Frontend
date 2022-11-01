import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useContext, useState, useLayoutEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { LanguageContext } from "../routes/authRoute"
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
  const [scrollIndex, setScrollIndex] = useState(0)
  const [scrollWidth, setScrollWidth] = useState<any>([])

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
  useEffect(() => {
    // 0 
    // 0 341(341) 
    // 0 343(343) 686(343) (3 bites)
    // 0 343(343) 688(345) 1031(343)
    // 0 343(343) 688(345) 1033(345) 1376(343)
    let array: any = []
    let left = 0
    bites.forEach((bite: any, index: any, biteArray: any) => {
      if (index === 0) array.push(left)
      else if (index === 1) {
        if (biteArray.length === 2) left = left + 341
        else left = left + 343
        array.push(left)
      }
      else if (index === biteArray.length - 1) {
        left = left + 343
        array.push(left)
      } else {
        left = left + 345
        array.push(left)
      }
    })
    setScrollWidth(array)
  }, [bites])

  return (
    <div className="home-wrapper">
      {bites.length > 0 &&
        <div className="section" style={{ marginTop: '20px' }}>
          <div className="title">💡Bite-sized Knowledge</div>
          <div className="see-more" onClick={gotoBites}>
            <div className="description">Learn new knowledge within 15 minutes</div>
            <div className="divider"></div>
            <div className="see-more-btn">{width < 680 ? '··· ' : ''}see more</div>
          </div>
          <div className="underline"></div>
          <div className="daremes scroll-bar"
            onScroll={(e: any) => {
              scrollWidth.forEach((width: any, index: any) => {
                if (Math.abs(e.target.scrollLeft - width) <= 1) setScrollIndex(index)
              })
            }}
          >
            {bites.map((bite: any, i: any) => (
              <div className="dareme" key={i} style={(width < 680 && i === scrollIndex) ? { transform: 'scale(1.03)' } : {}}>
                <BiteCardHome bite={bite} />
              </div>
            ))}
          </div>
        </div>
      }
      {users.length > 0 &&
        <div className="section">
          <div className="title">🧑‍💻 Creators You Might Like</div>
          <div className="see-more" onClick={gotoCreators}>
            <div className="description">Start discover new area of your learning</div>
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