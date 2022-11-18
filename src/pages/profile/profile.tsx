import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { biteAction } from "../../redux/actions/biteActions";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileMenu from "../../components/profileMenu";
import Button from "../../components/general/button";
import BiteCardProfile from "../../components/bite/BiteCardProfile";
import { AddIcon, CreatoCoinIcon } from "../../assets/svg";
import { authAction } from "../../redux/actions/authActions";
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
        {isSame ? (
          <>
            <div className="profile-menu">
              <ProfileMenu
                selectedText={code === null ? "My Purchases" : "My Bites"}
                texts={["My Purchases", "My Bites"]}
                urls={
                  authuser
                    ? [
                        authuser.personalisedUrl,
                        `${authuser.personalisedUrl}?tab=mybites`,
                      ]
                    : ["", ""]
                }
              />
            </div>
              <div className="creators-bite">
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
                        <div
                          className="profile-bite"
                          key={
                            index
                          }
                        >
                          <BiteCardProfile bite={bite} same={isSame} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <span>There is no "Bite" yet </span>
                    {code !== null && (
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
          </>
        ) : (
          <div className="creators-bite">
            <div className="title">
              <CreatoCoinIcon color="#EFA058" width={30} height={30} />
              <p>{authuser ? authuser.name : ""}'s Bite</p>
            </div>
            {bites.length > 0 && authuser ? (
              <div
                className="bite-card"
                onScroll={(e: any) => {
                  // scrollWidth.forEach((width: any, index: any) => {
                  //   if (Math.abs(e.target.scrollLeft - width) <= 1) setScrollIndex(index)
                  // })
                }}
              >
                {bites
                  .sort((first: any, second: any) => {
                    if (user) {
                      let firstDate: any = "2222";
                      let secondDate: any = "2222";
                      let firstIndex = first.purchasedUsers.findIndex(
                        (purchaseInfo: any) =>
                          String(purchaseInfo.purchasedBy) === String(user.id)
                      );
                      let secondIndex = second.purchasedUsers.findIndex(
                        (purchaseInfo: any) =>
                          String(purchaseInfo.purchasedBy) === String(user.id)
                      );
                      if (firstIndex !== -1)
                        firstDate =
                          first.purchasedUsers[firstIndex].purchasedAt;
                      if (secondIndex !== -1)
                        secondDate =
                          second.purchasedUsers[secondIndex].purchasedAt;
                      if (firstDate > secondDate) return 1;
                      else if (firstDate < secondDate) return -1;
                      else {
                        if (first.date < second.date) return 1;
                        else if (first.date > second.date) return -1;
                        return 0;
                      }
                    } else {
                      if (first.currency && second.currency === null) return 1;
                      else if (first.currency === null && second.currency)
                        return -1;
                      else {
                        if (first.date < second.date) return 1;
                        else if (first.date > second.date) return -1;
                        return 0;
                      }
                    }
                  })
                  .map((bite: any, index: any) => (
                    <div
                      className="profile-bite"
                      key={
                        index
                      }
                    >
                      <BiteCardProfile bite={bite} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-data">
                <span>There is no "Bite" yet </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
