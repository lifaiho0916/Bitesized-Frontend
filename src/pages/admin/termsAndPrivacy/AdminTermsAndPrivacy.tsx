import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import Button from "../../../components/general/button";
import Tabs from "../../../components/general/Tabs";
import { settingAction } from "../../../redux/actions/settingActions";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../assets/styles/admin/termsAndPrivacy/AdminTermsAndPrivacyStyle.scss";

const AdminTermsAndPrivacy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const settingState = useSelector((state: any) => state.setting);
  const { termsAndPrivacy } = settingState;
  const [searchParams] = useSearchParams();
  const code = searchParams.get("tab");
  const [initialState, setInitialState] = useState<any>(null);
  const [changeState, setChangeState] = useState<any>(null);
  const [option, setOption] = useState(0)

  const save = () => {
    const payload = {
      terms: code === "terms" ? changeState : termsAndPrivacy.terms,
      privacy: code === "privacy" ? changeState : termsAndPrivacy.privacy,
    };
    dispatch(settingAction.saveTermAndPrivacy(payload));
  };

  useEffect(() => {
    if (code === null) navigate(`${location.pathname}?tab=terms`);
    else {
      if (code === "terms") {
        setOption(0)
        setInitialState(termsAndPrivacy ? termsAndPrivacy?.terms : null);
        setChangeState(termsAndPrivacy ? termsAndPrivacy?.terms : null);
      } else {
        setOption(1)
        setInitialState(termsAndPrivacy ? termsAndPrivacy?.privacy : null);
        setChangeState(termsAndPrivacy ? termsAndPrivacy?.privacy : null);
      }
    }
  }, [code, termsAndPrivacy]);

  useEffect(() => {
    dispatch(settingAction.getTermsAndPrivacy());
  }, [dispatch]);

  return (
    <div className="admin-terms-and-privacy-wrapper">
      <div className="admin-terms-and-privacy">
        <div className="navigate-btns">
          <Tabs
            tabWidth="150px"
            list={[
              { 
                text: "Terms & Conditions",
                route: `${location.pathname}?tab=terms`
              }, 
              { 
                text: "Privacy Policy",
                route: `${location.pathname}?tab=privacy`
              }
            ]}
            initialOption={option}
          />
          {/* <div className="btn">
            <Button
              text="Terms & Conditions"
              fillStyle={code === "terms" ? "fill" : "outline"}
              shape="rounded"
              color="primary"
              with={"100px"}
              handleSubmit={() => navigate(`${location.pathname}?tab=terms`)}
            />
          </div>
          <div className="btn">
            <Button
              text="Privacy Policy"
              fillStyle={code === "privacy" ? "fill" : "outline"}
              shape="rounded"
              color="primary"
              with={"100px"}
              handleSubmit={() => navigate(`${location.pathname}?tab=privacy`)}
            />
          </div> */}
        </div>
        <Editor
          contentState={initialState}
          onContentStateChange={setChangeState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editor-style"
          toolbar={{
            options: [
              "blockType",
              "inline",
              "fontSize",
              "fontFamily",
              "list",
              "textAlign",
              "colorPicker",
              "link",
            ],
            blockType: {
              inDropdown: true,
              options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
            },
            inline: {
              inDropdown: false,
              options: ["bold", "italic", "underline"],
            },
            fontSize: {
              options: [
                8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96,
              ],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
            },
            fontFamily: {
              options: ["Lato"],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
            },
            list: {
              inDropdown: false,
              options: ["unordered", "ordered"],
            },
            textAlign: {
              inDropdown: false,
              options: ["left", "center", "right", "justify"],
            },
            colorPicker: {
              // icon: color,
              className: undefined,
              component: undefined,
              popupClassName: undefined,
              colors: ["#EFA058", "#000000"],
            },
            link: {
              inDropdown: false,
              showOpenOptionOnHover: true,
              defaultTargetOption: "_self",
              options: ["link", "unlink"],
            },
          }}
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          text="Save"
          fillStyle="fill"
          shape="rounded"
          color="primary"
          width="250px"
          handleSubmit={save}
        />
      </div>
    </div>
  );
};

export default AdminTermsAndPrivacy;
