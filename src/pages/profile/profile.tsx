import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ReactPaginate from 'react-paginate'
import draftToHtml from "draftjs-to-html";
import { biteAction } from "../../redux/actions/biteActions";
import ProfileHeader from "../../components/profile/profileHeader";
import DelSubScriptionModal from "../../components/modals/DelSubScriptionPlanModal";
import HideSubScriptionModal from "../../components/modals/HideSubScriptionPlanModal";
import UnsubscribedConfirmModal from "../../components/modals/UnsubscribedConfirmModal";
import UnsubscribedSuccessModal from "../../components/modals/UnsubscribedSuccessModal";
import ProfileMenu from "../../components/profileMenu";
import Button from "../../components/general/button";
import BiteCardProfile from "../../components/bite/BiteCardProfile";
import SubscriptionCard from "../../components/SubscriptionCard";
import {
  AddIcon,
  Bite1Icon,
  CreatoCoinIcon,
  HiddenIcon,
  MoreIcon,
  NotificationOutlineIcon,
  VisibleIcon,
} from "../../assets/svg";
import { authAction } from "../../redux/actions/authActions";
import { subScriptionAction } from "../../redux/actions/subScriptionActions";
import { paymentAction } from "../../redux/actions/paymentActions";
import subscriptionImg from "../../assets/img/subscription.png";
import { SET_DIALOG_STATE, SET_PREVIOUS_ROUTE, SET_SUBSCRIPTION, SET_TOTAL_SUBSCRIBERS } from "../../redux/types";
import CONSTANT from "../../constants/constant";
import "../../assets/styles/profile/profileStyle.scss";

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

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const biteState = useSelector((state: any) => state.bite);
  const userState = useSelector((state: any) => state.auth);
  const loadState = useSelector((state: any) => state.load);
  const subScriptionState = useSelector((state: any) => state.subScription);
  const { bites } = biteState;
  const { user, users } = userState;
  const { subScription, subscribers, total } = subScriptionState;
  const { dlgState } = loadState

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [sort, setSort] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const [searchParams] = useSearchParams();
  const code: any = searchParams.get("tab");
  const [moreInfo, setMoreInfo] = useState(false)
  const wrapRef = useRef<any>(null)
  const res = useOutsideAlerter(wrapRef, moreInfo)
  const [openDelPlan, setOpenDelPlan] = useState(false)
  const [openHidePlan, setOpenHidePlan] = useState(false)
  const [openUnsubscribeConfirm, setOpenUnsubscribeConfirm] = useState(false)
  const [openUnsubscribedSuccess, setOpenUnsubscribedSuccess] = useState(false)

  useEffect(() => {
    const personalisedUrl = pathname.substring(1);
    dispatch(authAction.getUserByPersonalisedUrl(personalisedUrl));
  }, [pathname, dispatch]);

  useEffect(() => { if (!res) setMoreInfo(res) }, [res])

  useEffect(() => {
    const personalisedUrl = pathname.substring(1);
    if (code === "subscription" && user) {
      dispatch(subScriptionAction.getSubScription(user?.id));
    } else dispatch(biteAction.getBitesByPersonalisedUrl(personalisedUrl, user?.id, code));
    dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${user?.personalisedUrl}` });
  }, [pathname, dispatch, user, code]);

  useEffect(() => {
    if (code === "subscription" && user) {
      dispatch(subScriptionAction.getSubscribersByUserId(sort, currentPage))
    }
  }, [code, sort, currentPage, user, dispatch])

  const authuser = useMemo(() => {
    if (users.length > 0) return users[0];
    else return null;
  }, [users]);

  useEffect(() => { 
    if(code === "subscription") {
      dispatch({ type: SET_TOTAL_SUBSCRIBERS, payload: 0 }) 
      setCurrentPage(0)
    }
  }, [code, dispatch])

  const isSame = useMemo(() => {
    if (authuser && user && user.id === authuser._id) return true;
    else return false;
  }, [authuser, user]);

  const getLocalCurrency = (currency: any) => {
    const index = CONSTANT.CURRENCIES.findIndex(
      (cur: any) => cur.toLowerCase() === currency
    );
    let res = CONSTANT.CURRENCIES[index] + ' ' + CONSTANT.CURRENCY_SYMBOLS[index];
    return res;
  };

  useEffect(() => {
    if(authuser && code !== "subscription" && isSame === false) {
      dispatch(subScriptionAction.getSubScription(authuser._id))
      dispatch(paymentAction.getPayment())
    }
  }, [isSame, authuser, code, dispatch])

  useEffect(() => {
    if(dlgState === 'unsubscribed') {
      setOpenUnsubscribeConfirm(false)
      setOpenUnsubscribedSuccess(true)
    }
  }, [dlgState])

  return (
    <div className="profile-wrapper">
      <div className="profile">
        <ProfileHeader same={isSame} profileUser={authuser ? authuser : null} user={user} />
        <DelSubScriptionModal
          show={openDelPlan}
          onClose={() => setOpenDelPlan(false)}
          handleSubmit={() => {
            setOpenDelPlan(false)
            dispatch(subScriptionAction.deleteSubScription(subScription?._id))
          }}
        />
        <HideSubScriptionModal
          show={openHidePlan}
          onClose={() => setOpenHidePlan(false)}
          handleSubmit={() => {
            setOpenHidePlan(false)
            dispatch(subScriptionAction.setSubScriptionVisible(subScription?._id, !subScription?.visible))
          }}
        />
        <UnsubscribedConfirmModal
          show={openUnsubscribeConfirm}
          onClose={() => setOpenUnsubscribeConfirm(false)}
          subscriber={selectedIndex !== -1 && subscribers[selectedIndex] ? subscribers[selectedIndex] : undefined }
          handleSubmit={() => { dispatch(subScriptionAction.unSubscribe(subscribers[selectedIndex]?._id)) }}
        />
        <UnsubscribedSuccessModal
          show={openUnsubscribedSuccess}
          onClose={() => {
            setOpenUnsubscribedSuccess(false)
            dispatch({ type: SET_DIALOG_STATE, payload: "" })
          }}
          subscriber={selectedIndex !== -1 && subscribers[selectedIndex] ? subscribers[selectedIndex] : undefined }
        />
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

                  {subScription && subScription.visible === false && <div className="hide-plan">***This subscription is hidden***</div>}
                  <div className="subscription-body" style={{ marginTop: subScription && subScription.visible === false ? '0px' : '30px' }}>
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
                              onClick={() => {
                                dispatch({ type: SET_SUBSCRIPTION, payload: null })
                                navigate("/subscription/set")
                              }}
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
                            <div style={{ position: 'relative' }}>
                              <div onClick={() => { setMoreInfo(true) }}><MoreIcon color="black" /></div>
                              <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
                                <div className="list" onClick={() => {
                                    setMoreInfo(false)
                                    if(subScription.visible) setOpenHidePlan(true)
                                    else dispatch(subScriptionAction.setSubScriptionVisible(subScription?._id, !subScription?.visible))
                                }}>
                                    {subScription.visible ? <HiddenIcon color="#000000" /> : <VisibleIcon color="#000000" /> }
                                    <span>{subScription.visible ? "Hide this subscription plan" : "Show this subscription plan" }</span>
                                </div>
                                {/* <div className="list" onClick={() => {
                                    setMoreInfo(false)
                                    setOpenDelPlan(true)
                                }}>
                                    <DeleteIcon color="#000000" /><span>Delete this subscription plan</span>
                                </div> */}
                            </div>
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
                            __html: subScription.description ? draftToHtml(JSON.parse(subScription.description)) : "",
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
                            handleSubmit={() => navigate("/subscription/set")}
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
            <div className="subscription-body" style={{ boxShadow: 'none' }}>
              {total === 0 ? 
                <div className="no-subscription">
                  <span>There is no “subscription” yet </span> 
                </div>
                : 
                <>
                  <div className="sort-subscription">
                    <span>Sort by:</span>
                    <select onChange={(e) => { setSort(Number(e.target.value)) }} 
                    >
                      <option value="0">Latest join</option>
                      <option value="1">Earliest join</option>
                      <option value="2">Payment due date</option>
                      <option value="3">Subscribing</option>
                      <option value="4">Unsubscribed</option>
                    </select>
                  </div>
                  <div className="subscription-data">
                    {subscribers.map((subscriber: any, index: any) => (
                      <div key={index} className="subscription-card">
                        <SubscriptionCard 
                          subscriber={subscriber}
                          handleSubmit={() => {
                            setSelectedIndex(index)
                            setOpenUnsubscribeConfirm(true)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="subscription-pagination">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">"
                      onPageChange={(e: any) => setCurrentPage(e.selected) }
                      pageRangeDisplayed={1}
                      pageCount={Math.ceil(total / 2)}
                      previousLabel="<"
                      marginPagesDisplayed={1}
                      pageLinkClassName="page-link"
                      previousLinkClassName="page-link"
                      nextLinkClassName="page-link"
                      breakLinkClassName="page-link"
                      pageClassName="page-item"
                      previousClassName="page-item"
                      nextClassName="page-item"
                      breakClassName="page-item"
                      containerClassName="pagination"
                      activeClassName="active"
                      renderOnZeroPageCount={undefined}
                    />
                  </div>
                </>
              }
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
