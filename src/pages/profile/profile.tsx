import { useState, useEffect, useContext, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { biteAction } from "../../redux/actions/biteActions"
import ProfileHeader from "../../components/profile/profileHeader"
import ProfileMenu from "../../components/profileMenu"
import ContainerBtn from "../../components/general/containerBtn"
import DareMeProfileCard from "../../components/profile/dareMeProfileCard"
import { Dare2Icon, HotIcon, AddIcon, RewardIcon, CreatoCoinIcon } from "../../assets/svg"
import { SET_PREVIOUS_ROUTE, SET_DIALOG_STATE } from "../../redux/types"
import { LanguageContext } from "../../routes/authRoute"
import "../../assets/styles/profile/profileStyle.scss"

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const contexts = useContext(LanguageContext)
  const daremeState = useSelector((state: any) => state.dareme)
  const fundmeState = useSelector((state: any) => state.fundme)
  const userState = useSelector((state: any) => state.auth)
  const { daremes } = daremeState
  const { fundmes } = fundmeState
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
            {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.isUser === true).length > 0)
              || (fundmes.length > 0 && fundmes.filter((fundme: any) => fundme.isUser === true).length > 0) ?
              <>
                {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.isUser === true).length > 0) &&
                  <div className="bite-card">
                    {daremes.filter((dareme: any) => dareme.isUser === true)
                      .map((dareme: any, index: any) => (
                        <div className="profile-bite" key={index}>
                          <DareMeProfileCard
                            item={{
                              id: dareme._id,
                              title: dareme.title,
                              teaser: `${process.env.REACT_APP_SERVER_URL}/${dareme.teaser}`,
                              cover: `${process.env.REACT_APP_SERVER_URL}/${dareme.cover}`,
                              size: dareme.sizeType,
                              leftTime: dareme.time,
                              voters: dareme.voteInfo.length,
                              donuts: dareme.donuts
                            }}
                            handleSubmit={() => { dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${authuser?.personalisedUrl}` }) }}
                          />
                        </div>
                      ))}
                  </div>
                }
              </>
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