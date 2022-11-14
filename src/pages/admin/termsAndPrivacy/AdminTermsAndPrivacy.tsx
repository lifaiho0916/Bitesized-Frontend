import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
// import { DraftBlockType, DraftBlockRenderConfig, Editor, EditorState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import Immutable from "immutable"
import Button from "../../../components/general/button";
import { settingAction } from "../../../redux/actions/settingActions";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../assets/styles/admin/termsAndPrivacy/AdminTermsAndPrivacyStyle.scss";

const myBlockStyleFn = (contentBlock: any) => {
  const type = contentBlock.getType()
  console.log(type)
  if (type === 'header-one') {
    console.log("adsfsda")
    return 'superFancyBlockquote';
  }
}

const AdminTermsAndPrivacy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  const settingState = useSelector((state: any) => state.setting)
  const { termsAndPrivacy } = settingState
  const [searchParams] = useSearchParams();
  const code = searchParams.get("type");
  const [initialState, setInitialState] = useState<any>(null)
  const [changeState, setChangeState] = useState<any>(null)
  // const [editorState, setEditorState] = useState<any>(EditorState.createEmpty())

  const onContentStateChange = (state: any) => {
    setChangeState(state)
  }

  // const onEditorStateChange = (state: any) => { setEditorState(state) }

  const save = () => {
    const payload = {
      terms: code === "terms" ? changeState : termsAndPrivacy.terms,
      privacy: code === "privacy" ? changeState : termsAndPrivacy.privacy
    }
    dispatch(settingAction.saveTermAndPrivacy(payload))
  }

  useEffect(() => {
    if (code === null) navigate(`${location.pathname}?type=terms`)
    else {
      if (code === "terms") {
        setInitialState(termsAndPrivacy ? termsAndPrivacy?.terms : null)
        setChangeState(termsAndPrivacy ? termsAndPrivacy?.terms : null)
      } else {
        setInitialState(termsAndPrivacy ? termsAndPrivacy?.privacy : null)
        setChangeState(termsAndPrivacy ? termsAndPrivacy?.privacy : null)
      }
    }
  }, [code, termsAndPrivacy])

  useEffect(() => {
    dispatch(settingAction.getTermsAndPrivacy())
  }, [dispatch])

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
        {/* <Editor
          editorState={editorState}
          onChange={onEditorStateChange}
        /> */}
        <Editor
          contentState={initialState}
          onContentStateChange={onContentStateChange}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editor-style"
          
          customBlockRenderFunc={myBlockStyleFn}
          toolbar={{
            options: ['blockType', 'inline', 'list', 'textAlign', 'link'],
            inline: {
              inDropdown: false,
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
            list: {
              inDropdown: false,
              options: ['unordered', 'ordered'],
            },
            textAlign: {
              inDropdown: false,
              options: ['left', 'center', 'right', 'justify'],
            },
            link: {
              inDropdown: false,
              showOpenOptionOnHover: true,
              defaultTargetOption: '_self',
              options: ['link', 'unlink'],
            }
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
