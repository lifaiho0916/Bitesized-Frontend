import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import Avatar from "../general/avatar";
import CurrencySelect from "../stripe/CurrencySelect";
import Button from "../general/button";
import { CloseIcon } from "../../assets/svg";
import CONSTANT from "../../constants/constant";
import "../../assets/styles/modals/SubscribeModalStyle.scss";

const SubscribeModal = (props: any) => {
  const {
    show,
    onClose,
    profileUser,
    handleSubmit,
    setCurrency,
    categoryText,
    subScription,
  } = props;
  const loadState = useSelector((state: any) => state.load);
  const userState = useSelector((state: any) => state.auth);
  const { currencyRate } = loadState;
  const { user } = userState;
  const [option, setOption] = useState(0);

  const displayPrice = (currency: any, price: any) => {
    if (currency) {
      const index = CONSTANT.CURRENCIES.findIndex(
        (cur: any) => cur.toLowerCase() === currency
      );
      let res =
        CONSTANT.CURRENCIES[index] + " " + CONSTANT.CURRENCY_SYMBOLS[index];
      return res + price.toFixed(1);
    }
  };

  const displaySelectedPrice =  useMemo(() => {
    if (subScription && currencyRate) {
      const prices = JSON.parse(subScription.multiPrices)
      const currency = CONSTANT.CURRENCIES[option].toLowerCase();
      const rate = currency === "usd" ? 1.0 : currencyRate[`${currency}`];
      return (prices[`${currency}`] * 1.034 + 0.3 * rate).toFixed(2);
    }
  }, [currencyRate, subScription, option]);

  useEffect(() => {
    setCurrency(CONSTANT.CURRENCIES[option].toLowerCase());
  }, [option, setCurrency]);
  useEffect(() => {
    if (user) {
      const foundIndex = CONSTANT.CURRENCIES.findIndex(
        (currency: any) => currency.toLowerCase() === user.currency
      );
      setOption(foundIndex);
    }
  }, [user, show]);

  return (
    <div className={`modal${show ? " show" : ""}`} onClick={onClose}>
      <div id="subscribe">
        {subScription && (
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span></span>
              <div className="close-btn" onClick={onClose}>
                <CloseIcon color="black" width={30} height={30} />
              </div>
            </div>
            <div className="modal-body">
              <div className="purchase-card">
                <Avatar
                  avatar={
                    profileUser
                      ? profileUser.avatar.indexOf("uploads") !== -1
                        ? `${process.env.REACT_APP_SERVER_URL}/${profileUser.avatar}`
                        : profileUser.avatar
                      : ""
                  }
                  size="mobile"
                />
                <div className="creator-name">
                  <span>{profileUser ? profileUser.name : ""}</span>
                </div>
                <div className="creator-category">
                  <span>{categoryText}</span>
                </div>
              </div>
              <div className="divider-desktop"></div>

              <div className="main-body">
                <div className="sub-body">
                  <div className="sub-title">
                    <span>{subScription?.name}</span>
                  </div>
                  <div className="membership">
                    <span>
                      {displayPrice(
                        subScription?.currency,
                        subScription?.price
                      )}
                      /month
                    </span>
                  </div>
                  {subScription.description && (
                    <div
                      className="description"
                      dangerouslySetInnerHTML={{
                        __html: draftToHtml(
                          JSON.parse(subScription.description)
                        ),
                      }}
                    />
                  )}
                  <div className="sub-title">
                    <span>Subscribers can enjoy</span>
                  </div>
                  <div className="benefits">
                    <ul>
                      {subScription.benefits.map((benefit: any, index: any) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="divider"></div>
                <div className="sub-body">
                  <div className="sub-title" style={{ marginBottom: "10px" }}>
                    <span>Select Currency</span>
                  </div>

                  <CurrencySelect
                    label="You will pay in:"
                    option={option}
                    setOption={setOption}
                    options={CONSTANT.DISPLAY_CURRENCIES}
                    width={"100%"}
                  />

                  <div className="charge-amount">
                    <span>You will be charged for&nbsp;</span>
                    <span style={{ color: "#EF4444" }}>
                      {displaySelectedPrice}
                    </span>
                    <span>&nbsp;in {CONSTANT.CURRENCIES[option]}</span>
                  </div>
                  <div className="charge-amount" style={{ marginTop: "0px" }}>
                    <span>(Including processing fee)</span>
                  </div>
                  <div className="terms-and-privacy">
                    <span>
                      By Clicking Next, you agree to{" "}
                      <Link to="/terms">Creato’s Terms & Conditions</Link>, and{" "}
                      <Link to="/privacy-policy">Privacy Policy</Link>, and for
                      payment processor - Stripe to charge your payment method.
                    </span>
                  </div>
                  <div className="next-btn" style={{ marginBottom: "15px" }}>
                    <Button
                      text="Subscribe"
                      fillStyle="fill"
                      color="primary"
                      shape="rounded"
                      width={"240px"}
                      handleSubmit={handleSubmit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
