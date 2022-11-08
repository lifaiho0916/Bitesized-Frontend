import { useState, useEffect, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { biteAction } from "../../redux/actions/biteActions"
import ProfileHeader from "../../components/profile/profileHeader"
import ProfileMenu from "../../components/profileMenu"
import Button from "../../components/general/button"
import BiteCardProfile from "../../components/bite/BiteCardProfile"
import { AddIcon, CreatoCoinIcon } from "../../assets/svg"
import "../../assets/styles/profile/profileStyle.scss"

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

const Profile = () => {
  const width = useWindowSize()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const biteState = useSelector((state: any) => state.bite)
  const userState = useSelector((state: any) => state.auth)
  const { bites } = biteState
  const { user, users } = userState
  const authuser = users.length ? users[0] : null
  const [isSame, setIsSame] = useState(false)
  // const [scrollIndex, setScrollIndex] = useState(0)
  // const [scrollWidth, setScrollWidth] = useState<any>([])

  const [searchParams] = useSearchParams()
  const code = searchParams.get("mybites")

  useEffect(() => {
    const personalisedUrl = location.pathname.substring(1)
    dispatch(biteAction.getProfileSessions(personalisedUrl, user?.id))
  }, [location.pathname, dispatch, user])

  useEffect(() => {
    if (authuser && user && user.id === authuser._id) setIsSame(true)
    else setIsSame(false)
  }, [authuser, user])

  useEffect(() => {
    // 0 
    // 0 295(295)
    // 0 297(297) 595(298)
    // 0 297(297) 597(300) 895(298)
    // 0 297(297) 597(300) 897(300) 1195(298)
    // let array: any = []
    // let left = 0
    // bites.filter((bite: any, index: any) => {
    //   if (isSame) {
    //     if (code === null) return String(bite.owner._id) !== String(authuser._id)
    //     else return String(bite.owner._id) === String(authuser._id)
    //   } else return true
    // }).forEach((bite: any, index: any, biteArray: any) => {
    //   if (index === 0) array.push(left)
    //   else if (index === 1) {
    //     if (biteArray.length === 2) left = left + 295
    //     else left = left + 297
    //     array.push(left)
    //   }
    //   else if (index === biteArray.length - 1) {
    //     left = left + 298
    //     array.push(left)
    //   } else {
    //     left = left + 300
    //     array.push(left)
    //   }
    // })
    // setScrollWidth([...array])
  }, [bites, isSame, code, authuser])

  return (
    <div className="profile-wrapper">
      <div className="profile">
        <ProfileHeader same={isSame} profileUser={authuser ? authuser : null} />
        {isSame ?
          <>
            <div className="profile-menu">
              <ProfileMenu
                selectedText={code === null ? "My Purchases" : "My Bites"}
                texts={["My Purchases", "My Bites"]}
                urls={authuser ? [authuser.personalisedUrl, `${authuser.personalisedUrl}?mybites`] : ["", ""]}
              />
            </div>
            <div className="creators-bite">
              {(bites.length > 0 && authuser) ?
                <div className="bite-card" onScroll={(e: any) => {
                  // console.log(e.target.scrollLeft)
                  // scrollWidth.forEach((width: any, index: any) => {
                  //   if (Math.abs(e.target.scrollLeft - width) <= 1) setScrollIndex(index)
                  // })
                }}>
                  {bites.filter((bite: any) => {
                    if (code === null) return String(bite.owner._id) !== String(authuser._id)
                    else return String(bite.owner._id) === String(authuser._id)
                  }).sort((first: any, second: any) => {
                    if (user) {
                      let firstDate: any = "2322"
                      let secondDate: any = "2322"
                      let firstIndex = first.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id))
                      let secondIndex = second.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id))
                      if (firstIndex !== -1) firstDate = first.purchasedUsers[firstIndex].purchasedAt
                      if (secondIndex !== -1) secondDate = second.purchasedUsers[secondIndex].purchasedAt
                      if (firstDate < secondDate) return 1
                      else if (firstDate > secondDate) return -1
                      else {
                        if (first.date < second.date) return 1
                        else if (first.date > second.date) return -1
                        return 0
                      }
                    } else {
                      if (first.currency && second.currency === null) return 1
                      else if (first.currency === null && second.currency) return -1
                      else {
                        if (first.date < second.date) return 1
                        else if (first.date > second.date) return -1
                        return 0
                      }
                    }
                  }).map((bite: any, index: any) => (
                    <div className="profile-bite" key={index} /*style={(width < 680 && index === scrollIndex) ? { transform: 'scale(1.03)' } : {}}*/>
                      <BiteCardProfile bite={bite} same={isSame} />
                    </div>
                  ))}
                </div> :
                <div className="no-data">
                  <span>There is no "Bite" yet </span>
                  {code !== null &&
                    <div
                      style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Button
                        text="Create"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"300px"}
                        icon={[
                          <AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />
                        ]}
                        handleSubmit={() => navigate('/bite/create-type')}
                      />
                    </div>
                  }
                </div>
              }
            </div>
          </>
          :
          <div className="creators-bite">
            <div className="title">
              <CreatoCoinIcon color="#EFA058" width={30} height={30} />
              <p>{authuser ? authuser.name : ''}'s Bite</p>
            </div>
            {(bites.length > 0 && authuser) ?
              <div className="bite-card" onScroll={(e: any) => {
                // scrollWidth.forEach((width: any, index: any) => {
                //   if (Math.abs(e.target.scrollLeft - width) <= 1) setScrollIndex(index)
                // })
              }}>
                {bites.sort((first: any, second: any) => {
                  if (user) {
                    let firstDate: any = "2222"
                    let secondDate: any = "2222"
                    let firstIndex = first.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id))
                    let secondIndex = second.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id))
                    if (firstIndex !== -1) firstDate = first.purchasedUsers[firstIndex].purchasedAt
                    if (secondIndex !== -1) secondDate = second.purchasedUsers[secondIndex].purchasedAt
                    if (firstDate > secondDate) return 1
                    else if (firstDate < secondDate) return -1
                    else {
                      if (first.date < second.date) return 1
                      else if (first.date > second.date) return -1
                      return 0
                    }
                  } else {
                    if (first.currency && second.currency === null) return 1
                    else if (first.currency === null && second.currency) return -1
                    else {
                      if (first.date < second.date) return 1
                      else if (first.date > second.date) return -1
                      return 0
                    }
                  }
                })
                  .map((bite: any, index: any) => (
                    <div className="profile-bite" key={index} /*style={(width < 680 && index === scrollIndex) ? { transform: 'scale(1.03)' } : {}}*/>
                      <BiteCardProfile bite={bite} />
                    </div>
                  ))}
              </div>
              :
              <div className="no-data">
                <span>There is no "Bite" yet </span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Profile