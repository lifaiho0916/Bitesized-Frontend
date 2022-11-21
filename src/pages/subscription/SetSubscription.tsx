import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import Input from "../../components/general/input";
import Button from "../../components/general/button";
import CurrencySelect from "../../components/stripe/CurrencySelect";
import { AddIcon, BackIcon, RemoveIcon } from "../../assets/svg";
import { subScriptionAction } from "../../redux/actions/subScriptionActions";
import CONSTANT from "../../constants/constant";
import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../assets/styles/subscription/SetSubscriptionStyle.scss";

const SetSubscription = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.auth);
  const subScriptionState = useSelector((state: any) => state.subScription)
  const { user } = userState;
  const { subScription } = subScriptionState

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [option, setOption] = useState(0);
  const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
  const [description, setDescription] = useState<any>(null);
  const [benefits, setBenefits] = useState<any>([ "1 month FREE pass to all Bite content" ]);

  const publishEnable = useMemo(() => {
    if (name === "" || price === "" || Number(price) === 0) return false;
    return true;
  }, [price, name]);

  useEffect(() => {
    if(user) {
      if (user.subscribe.available === false || user.subscribe.switch === false) navigate(`/${user.personalisedUrl}`)
      if(subScription) {
        setName(subScription.name)
        setPrice(subScription.price)
        setBenefits(subScription.benefits)
        setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(subScription.description))))
        setDescription(JSON.parse(subScription.description))
        const foundIndex = CONSTANT.CURRENCIES.findIndex((currency: any) => currency.toLowerCase() === subScription.currency)
        setOption(foundIndex)
      } else {
        const foundIndex = CONSTANT.CURRENCIES.findIndex((currency: any) => currency.toLowerCase() === user.currency)
        setOption(foundIndex)
      }
    }
  }, [subScription ,user, navigate])

  const onEditorStateChange = (state: any) => {
    const text = state.getCurrentContent().getPlainText("");
    if (text.length <= 300) setEditorState(state);
  };

  const benefitsChange = (text: any, index: any) => {
    const benefitTemps = [...benefits];
    benefitTemps[index] = text;
    setBenefits(benefitTemps);
  };

  const addNewBenefit = () => {
    let benefitTemps = [...benefits];
    benefitTemps.push("");
    setBenefits(benefitTemps);
  };

  const removeBenefit = (index: any) => {
    if (index === 0) return;
    let benefitTemps = benefits.filter((benefit: any, i: any) => i !== index);
    setBenefits(benefitTemps);
  };

  const submit = () => {
    if (publishEnable) {
      const newSubscription = subScription._id ? {
        name: name,
        price: Number(price),
        currency: CONSTANT.CURRENCIES[option].toLowerCase(),
        benefits: benefits.filter((benefit: any) => benefit !== ""),
        description: JSON.stringify(description)
      } : {
        ...subScription,
        name: name,
        price: Number(price),
        currency: CONSTANT.CURRENCIES[option].toLowerCase(),
        benefits: benefits.filter((benefit: any) => benefit !== ""),
        description: JSON.stringify(description)
      };

      if(subScription._id) {
        dispatch(
          subScriptionAction.editSubscription(
            subScription._id,
            newSubscription,
            navigate,
            `/${user?.personalisedUrl}?tab=subscription`
          )
        );
      } else {
        dispatch(
          subScriptionAction.saveSubscription(
            newSubscription,
            navigate,
            `/${user?.personalisedUrl}?tab=subscription`
          )
        );
      }
    }
  };

  return (
    <div className="set-subscription-wrapper">
      <div className="page-header">
        <div
          onClick={() => navigate(`/${user?.personalisedUrl}?tab=subscription`)}
        >
          <BackIcon color="black" />
        </div>
        <div className="page-title">
          <span>Set subscription</span>
        </div>
        <div style={{ width: "24px" }}></div>
      </div>

      <div className="set-subscription">
        <div className="subscription-detail">
          <div className="detail-title">
            <span>Name</span>
          </div>
          <div style={{ marginTop: "15px", marginBottom: "25px" }}>
            <Input
              type="input"
              placeholder="Name your subscriber"
              width={"100%"}
              wordCount={50}
              title={name}
              setTitle={setName}
            />
          </div>
          <div className="detail-title">
            <span>$ Monthly price to subscribe</span>
          </div>
          <div style={{ marginTop: "15px", marginBottom: "10px" }}>
            <Input
              type="input"
              placeholder="Price input"
              width={"100%"}
              step={0.1}
              minnum={0}
              maxnum={1000000000000}
              isNumber={true}
              title={price}
              setTitle={setPrice}
            />
          </div>
          <div style={{ marginBottom: "30px" }}>
            <CurrencySelect
              option={option}
              setOption={setOption}
              options={CONSTANT.DISPLAY_CURRENCIES}
              width={"100%"}
            />
            <p>( We will convert your price in USD as default)</p>
          </div>

          <div className="detail-title">
            <span>Subscription description (optional)</span>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              onContentStateChange={setDescription}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="description-editor"
              placeholder="Tell your subscriber why they join your subscription"
              toolbar={{
                options: ["inline", "list"],
                inline: {
                  inDropdown: false,
                  options: ["bold", "italic", "underline"],
                },
                list: {
                  inDropdown: false,
                  options: ["unordered"],
                },
              }}
            />
            <div className="word-count">
              (
              {editorState === null
                ? 0
                : editorState.getCurrentContent().getPlainText().length}
              /300 characters)
            </div>
          </div>
        </div>
        <div className="subscription-detail">
          <div className="detail-title">
            <span>Subscriber benefits (optional)</span>
          </div>
          <div style={{ marginBottom: "30px" }}>
            {benefits.map((benefit: any, index: any) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <div className="benefit">
                  <TextareaAutosize
                    readOnly={index === 0 ? true : false}
                    onChange={(e) => benefitsChange(e.target.value, index)}
                    value={benefit}
                    placeholder="Input benefit"
                  />
                </div>
                <div
                  className={`remove-btn ${
                    index === 0 ? "inactive" : "active"
                  }`}
                  onClick={() => removeBenefit(index)}
                >
                  <RemoveIcon
                    color={index === 0 ? "#E1E0DF" : "#DE5A67"}
                    width={20}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="add-benefit" onClick={addNewBenefit}>
            <AddIcon color="#EFA058" />
            <span>Add new benefit</span>
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          text="Submit"
          fillStyle={publishEnable ? "fill" : undefined}
          color="primary"
          width={"320px"}
          shape="rounded"
          handleSubmit={submit}
        />
      </div>
    </div>
  );
};

export default SetSubscription;
