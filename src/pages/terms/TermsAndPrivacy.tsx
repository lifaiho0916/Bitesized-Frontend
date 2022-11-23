import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { settingAction } from "../../redux/actions/settingActions";
import { BackIcon } from "../../assets/svg";
import draftToHtml from "draftjs-to-html";
import "../../assets/styles/terms/TermsAndPrivacyStyle.scss";

const TermsAndPrivacy = (props: any) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const settingState = useSelector((state: any) => state.setting);
  const { termsAndPrivacy } = settingState;

  useEffect(() => {
    dispatch(settingAction.getTermsAndPrivacy());
  }, [dispatch]);

  return (
    <div className="terms-privacy-wrapper">
      <div className="page-header">
        <div></div>
        <div className="page-title">
          <span>
            {location.pathname === "/terms"
              ? "Terms & Conditions of Use"
              : "Privacy Policy"}
          </span>
        </div>
        <div></div>
      </div>

      <div className="terms-privacy">
        <div
          dangerouslySetInnerHTML={{
            __html: draftToHtml(
              termsAndPrivacy
                ? location.pathname === "/terms"
                  ? termsAndPrivacy.terms
                    ? JSON.parse(termsAndPrivacy.terms)
                    : null
                  : termsAndPrivacy.privacy
                  ? JSON.parse(termsAndPrivacy.privacy)
                  : null
                : null
            ),
          }}
        />
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
