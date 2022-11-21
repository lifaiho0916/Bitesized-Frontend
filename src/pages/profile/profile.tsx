import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import { biteAction } from "../../redux/actions/biteActions";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileMenu from "../../components/profileMenu";
import Button from "../../components/general/button";
import BiteCardProfile from "../../components/bite/BiteCardProfile";
import {
  AddIcon,
  Bite1Icon,
  CreatoCoinIcon,
  MoreIcon,
  NotificationOutlineIcon,
} from "../../assets/svg";
import { authAction } from "../../redux/actions/authActions";
import { subScriptionAction } from "../../redux/actions/subScriptionActions";
import subscriptionImg from "../../assets/img/subscription.png";
import { SET_PREVIOUS_ROUTE } from "../../redux/types";
import CONSTANT from "../../constants/constant";
import "../../assets/styles/profile/profileStyle.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const biteState = useSelector((state: any) => state.bite);
  const userState = useSelector((state: any) => state.auth);
  const subScriptionState = useSelector((state: any) => state.subScription);
  const { bites } = biteState;
  const { user, users } = userState;
  const { subScription } = subScriptionState;

  const [searchParams] = useSearchParams();
  const code: any = searchParams.get("tab");

  useEffect(() => {
    const personalisedUrl = pathname.substring(1);
    dispatch(authAction.getUserByPersonalisedUrl(personalisedUrl));
  }, [pathname, dispatch]);

  useEffect(() => {
    const personalisedUrl = pathname.substring(1);
    if (code === "subscription")
      dispatch(subScriptionAction.getSubScription(user?.id));
    else
      dispatch(
        biteAction.getBitesByPersonalisedUrl(personalisedUrl, user?.id, code)
      );
    dispatch({
      type: SET_PREVIOUS_ROUTE,
      payload: `/${user?.personalisedUrl}`,
    });
  }, [pathname, dispatch, user, code]);

  const authuser = useMemo(() => {
    if (users.length > 0) return users[0];
    else return null;
  }, [users]);

  const isSame = useMemo(() => {
    if (authuser && user && user.id === authuser._id) return true;
    else return false;
  }, [authuser, user]);

  const getLocalCurrency = (currency: any) => {
    const index = CONSTANT.CURRENCIES.findIndex(
      (cur: any) => cur.toLowerCase() === currency
    );
    let res = CONSTANT.CURRENCY_SYMBOLS[index];
    return res;
  };

  return (
    <div className="profile-wrapper">
      <div className="profile">
        <ProfileHeader same={isSame} profileUser={authuser ? authuser : null} />
        {isSame && (
          <div className="profile-menu">
            <ProfileMenu
              selectedText={
                code === null
                  ? "My Purchases"
                  : code === "mybites"
                  ? "My Bites"
                  : "Subscription"
              }
              texts={["My Purchases", "My Bites", "Subscription"]}
              urls={
                authuser
                  ? [
                      authuser.personalisedUrl,
                      `${authuser.personalisedUrl}?tab=mybites`,
                      `${authuser.personalisedUrl}?tab=subscription`,
                    ]
                  : ["", "", ""]
              }
            />
            {/* <ProfileMenu
              selectedText={code === null ? "My Purchases" : "My Bites" }
              texts={["My Purchases", "My Bites"]}
              urls={ authuser ? [ authuser.personalisedUrl, `${authuser.personalisedUrl}?tab=mybites` ] : ["", ""] }
            /> */}
          </div>
        )}
        {code === "subscription" ? (
          <div className="subscription">
            {user &&
              user.subscribe.available === true &&
              user.subscribe.switch === true && (
                <>
                  <div className="subscription-title">
                    <CreatoCoinIcon color="#EA8426" />
                    <span>Manage my subscription</span>
                  </div>

                  <div className="subscription-body">
                    {subScription === null ? (
                      <>
                        <div className="subscription-body-title">
                          <span>Subscription</span>
                        </div>
                        <div className="subscription-body-main">
                          <div className="image">
                            <img src={subscriptionImg} alt="subscription" />
                          </div>
                          <div className="description">
                            <span>
                              You can provide subscription-only benefits for
                              subscribe members, such as additional creative
                              content, subscription to member-only communities,
                              etc.
                            </span>
                            <div
                              className="subscription-btn"
                              onClick={() => navigate("/subscription/set")}
                            >
                              <span>Set subscription</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="subscription-name-price">
                          <div className="subscription-name">
                            <span>{subScription.name}</span>
                            <div>
                              <MoreIcon color="black" />
                            </div>
                          </div>
                          <div className="subscription-price">
                            <span>
                              {getLocalCurrency(subScription.currency)}
                              {subScription.price}/month
                            </span>
                          </div>
                        </div>
                        <div
                          className="subscription-description"
                          dangerouslySetInnerHTML={{
                            __html: subScription.description ? draftToHtml(subScription.description) : "",
                          }}
                        />
                        <div style={{ borderTop: '2px solid #A6A29F', marginBottom: '15px' }}></div>
                        <div className="benefit-header">
                          <span>Subscribers can enjoy</span>
                        </div>
                        <div className="benefits">
                          <ul>
                            {subScription.benefits.map((benefit: any, index: any) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
                          <Button
                            text="Subscription detail"
                            fillStyle="fill"
                            width={'300px'}
                            color="primary"
                            handleSubmit={() => {}}
                          />
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                          <Button
                            text="Edit subscription"
                            fillStyle="fill"
                            width={'300px'}
                            color="primary"
                            handleSubmit={() => {}}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            <div className="subscription-title">
              <NotificationOutlineIcon color="#EA8426" width={24} />
              <span>I have subscribed</span>
            </div>
          </div>
        ) : (
          <div className="creators-bite">
            {!isSame && authuser && (
              <div className="title">
                <Bite1Icon color="#EFA058" width={30} height={30} />
                <span>{authuser.name}’s Bite-sized knowledge</span>
              </div>
            )}
            {bites.length > 0 && authuser ? (
              <div className="bite-card">
                {bites
                  .sort((first: any, second: any) => {
                    if (user) {
                      let firstDate: any = "2322";
                      let secondDate: any = "2322";
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
                      if (firstDate < secondDate) return 1;
                      else if (firstDate > secondDate) return -1;
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
                    <div className="profile-bite" key={index}>
                      <BiteCardProfile bite={bite} same={isSame} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-data">
                <span>There is no "Bite" yet </span>
                {code === "mybites" && (
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
        )}
      </div>
    </div>
  );
};

export default Profile;
