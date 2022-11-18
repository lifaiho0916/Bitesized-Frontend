import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { biteAction } from "../../redux/actions/biteActions";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileMenu from "../../components/profileMenu";
import Button from "../../components/general/button";
import BiteCardProfile from "../../components/bite/BiteCardProfile";
import { AddIcon, Bite1Icon, CreatoCoinIcon, NotificationOutlineIcon } from "../../assets/svg";
import { authAction } from "../../redux/actions/authActions";
import subscriptionImg from "../../assets/img/subscription.png"
import "../../assets/styles/profile/profileStyle.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const biteState = useSelector((state: any) => state.bite);
  const userState = useSelector((state: any) => state.auth);
  const { bites } = biteState;
  const { user, users } = userState;

  const [searchParams] = useSearchParams();
  const code: any = searchParams.get("tab");

  useEffect(() => {
    const personalisedUrl = location.pathname.substring(1);
    dispatch(authAction.getUserByPersonalisedUrl(personalisedUrl))
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const personalisedUrl = location.pathname.substring(1);
    dispatch(biteAction.getBitesByPersonalisedUrl(personalisedUrl, user?.id, code))
  },[location.pathname, dispatch, user, code])

  const authuser = useMemo(() => {
    if(users.length > 0) return users[0]
    else return null
  }, [users])

  const isSame = useMemo(() => {
    if (authuser && user && user.id === authuser._id) return true
    else return false
  }, [authuser, user])

  return (
    <div className="profile-wrapper">
      <div className="profile">
        <ProfileHeader same={isSame} profileUser={authuser ? authuser : null} />
        {isSame &&
          <div className="profile-menu">
            <ProfileMenu
              selectedText={code === null ? "My Purchases" : code === "mybites" ?  "My Bites" : "Subscription" }
              texts={["My Purchases", "My Bites", "Subscription"]}
              urls={ authuser ? [ authuser.personalisedUrl, `${authuser.personalisedUrl}?tab=mybites`, `${authuser.personalisedUrl}?tab=subscription` ] : ["", "", ""] }
            />
            {/* <ProfileMenu
              selectedText={code === null ? "My Purchases" : "My Bites" }
              texts={["My Purchases", "My Bites"]}
              urls={ authuser ? [ authuser.personalisedUrl, `${authuser.personalisedUrl}?tab=mybites` ] : ["", ""] }
            /> */}
          </div>
        }
            {code === "subscription" ? 
              <div className="subscription">
                {(user && user.subscribe.available === true && user.subscribe.switch === true) &&
                <>
                  <div className="subscription-title">
                    <CreatoCoinIcon color="#EA8426" /><span>Manage my subscription</span>
                  </div>
                  <div className="subscription-body">
                    <div className="subscription-body-title">
                      <span>Subscription</span>
                    </div>
                    <div className="subscription-body-main">
                      <div className="image">
                      <img src={subscriptionImg} alt="subscription" />
                      </div>
                      <div className="description">
                        <span>You can provide subscription-only benefits for subscribe members, such as additional creative content, subscription to member-only communities, etc.</span>
                        <div className="subscription-btn">
                          <span>Set subscription</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
                }
                <div className="subscription-title">
                  <NotificationOutlineIcon color="#EA8426" width={24} /><span>I have subscribed</span>
                </div>
              </div>
              :
            <div className="creators-bite">
            {(!isSame && authuser) &&
              <div className="title">
                <Bite1Icon color="#EFA058" width={30} height={30} />
                <span>{authuser.name}’s Bite-sized knowledge</span>
              </div>
            }
              {bites.length > 0 && authuser ? (
                <div className="bite-card">
                  {bites.sort((first: any, second: any) => {
                      if (user) {
                        let firstDate: any = "2322";
                        let secondDate: any = "2322";
                        let firstIndex = first.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id));
                        let secondIndex = second.purchasedUsers.findIndex((purchaseInfo: any) => String(purchaseInfo.purchasedBy) === String(user.id));
                        if (firstIndex !== -1) firstDate = first.purchasedUsers[firstIndex].purchasedAt;
                        if (secondIndex !== -1) secondDate = second.purchasedUsers[secondIndex].purchasedAt;
                        if (firstDate < secondDate) return 1;
                        else if (firstDate > secondDate) return -1;
                        else {
                          if (first.date < second.date) return 1;
                          else if (first.date > second.date) return -1;
                          return 0;
                        }
                      } else {
                        if (first.currency && second.currency === null) return 1;
                        else if (first.currency === null && second.currency) return -1;
                        else {
                          if (first.date < second.date) return 1;
                          else if (first.date > second.date) return -1;
                          return 0;
                        }
                      }
                    })
                    .map((bite: any, index: any) => (
                      <div className="profile-bite" key={index}>
                        <BiteCardProfile bite={bite} same={isSame} />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="no-data">
                  <span>There is no "Bite" yet </span>
                  {code === 'mybites' && (
                    <div
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        text="Create"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"300px"}
                        icon={[
                          <AddIcon color="white" />,
                          <AddIcon color="white" />,
                          <AddIcon color="white" />,
                        ]}
                        handleSubmit={() => navigate("/bite/create-type")}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
        } 
      </div>
    </div>
  );
};

export default Profile;
