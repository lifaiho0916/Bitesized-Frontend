import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Button from "../../../components/general/button";
import "../../../assets/styles/admin/termsAndPrivacy/AdminTermsAndPrivacyStyle.scss";

const AdminTermsAndPrivacy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("type");

  useEffect(() => {
    if (code === null) navigate(`${location.pathname}?type=terms`);
  }, [code]);

  return (
    <div className="admin-terms-and-privacy-wrapper">
      <div className="admin-terms-and-privacy">
        <div className="navigate-btns">
          <div className="btn">
            <Button
              text="Terms & Conditions"
              fillStyle={code === "terms" ? "fill" : "outline"}
              shape="rounded"
              color="primary"
              with={"100px"}
              handleSubmit={() => navigate(`${location.pathname}?type=terms`)}
            />
          </div>
          <div className="btn">
            <Button
              text="Privacy Policy"
              fillStyle={code === "privacy" ? "fill" : "outline"}
              shape="rounded"
              color="primary"
              with={"100px"}
              handleSubmit={() => navigate(`${location.pathname}?type=privacy`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTermsAndPrivacy;
