import { useState, useEffect, useContext, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { biteAction } from "../../redux/actions/biteActions"
import ProfileHeader from "../../components/profile/profileHeader"
import ProfileMenu from "../../components/profileMenu"
import ContainerBtn from "../../components/general/containerBtn"
import DareMeProfileCard from "../../components/profile/dareMeProfileCard"
import { CreatoCoinIcon } from "../../assets/svg"
import { SET_PREVIOUS_ROUTE, SET_DIALOG_STATE } from "../../redux/types"
import { LanguageContext } from "../../routes/authRoute"
import "../../assets/styles/profile/profileStyle.scss"

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const contexts = useContext(LanguageContext)
  const biteState = useSelector((state: any) => state.bite)
  const userState = useSelector((state: any) => state.auth)
  const { bites } = biteState
  const { user, users } = userState
  const authuser = users.length ? users[0] : null
  const [isSame, setIsSame] = useState(false)

  useEffect(() => {
    const personalisedUrl = location.pathname.substring(1)
    dispatch(biteAction.getProfileSessions(personalisedUrl))
  }, [location, dispatch])

  useEffect(() => {
    if (authuser && user && user.id === authuser._id) setIsSame(true)
    else setIsSame(false)
  }, [authuser, user])

  return (
    <div className="profile-wrapper">
      <div className="profile">
        <ProfileHeader same={isSame} profileUser={authuser ? authuser : null} />
        {isSame ?
          <>
            <div className="profile-menu">
              <ProfileMenu menu={"purchase"} url={authuser ? authuser.personalisedUrl : ''} />
            </div>
          </>
          :
          <div className="creators-bite">
            <div className="title">
              <CreatoCoinIcon color="#EFA058" width={30} height={30} />
              <p>{authuser ? authuser.name : ''}'s Bite</p>
            </div>
            {bites.length > 0 ?
              <div className="bite-card">
                {bites.map((bite: any, index: any) => (
                  <div className="profile-bite" key={index}>
                  </div>
                ))}
              </div>
              :
              <div className="no-data">
                <span>There is no "Bite" yet </span>
                {/* {(authuser && user && user.personalisedUrl === authuser.personalisedUrl) ?
                  <div style={{ width: '330px', margin: '0px auto' }} onClick={() => { navigate("/create") }}>
                    <ContainerBtn text="Create" styleType="fill" icon={[<AddIcon color="white" />, <AddIcon color="white" />]} />
                  </div> :
                  
                } */}
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Profile