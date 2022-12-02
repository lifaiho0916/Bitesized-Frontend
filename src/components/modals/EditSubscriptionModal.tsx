import { useState, useMemo, useEffect } from "react"
import TextareaAutosize from "react-textarea-autosize";
import Button from "../general/button"
import Input from "../general/input"
import CurrencySelect from "../stripe/CurrencySelect"
import { CloseIcon, AddIcon, RemoveIcon } from "../../assets/svg"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CONSTANT from "../../constants/constant"
import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { subScriptionAction } from "../../redux/actions/subScriptionActions";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../assets/styles/modals/EditSubscriptionModalStyle.scss"

const EditSubscriptionModal = (props: any) => {
    const { show, onClose, subScription } = props
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [price, setPrice] = useState("");
    const [option, setOption] = useState(0);
    const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());
    const [description, setDescription] = useState<any>(null);
    const [benefits, setBenefits] = useState<any>([ "1 month FREE pass to all Bite content" ]);

    const onEditorStateChange = (state: any) => {
        const text = state.getCurrentContent().getPlainText("");
        if (text.length <= 300) setEditorState(state);
    };

    const publishEnable = useMemo(() => {
        if (name === "" || price === "" || Number(price) === 0) return false;
        return true;
      }, [price, name]);
    
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
          const newSubscription = {
            name: name,
            price: Number(price),
            currency: CONSTANT.CURRENCIES[option].toLowerCase(),
            benefits: benefits.filter((benefit: any) => benefit !== ""),
            description: JSON.stringify(description)
          }
            dispatch(
                subScriptionAction.editSubscription(
                    subScription._id,
                    newSubscription,
                    navigate,
                    `/admin/subscription`
                )
            )
        }
    };

    useEffect(() => {
        if(subScription) {
            setName(subScription.name)
            setPrice(subScription.price)
            setBenefits(subScription.benefits)
            setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(subScription.description))))
            setDescription(JSON.parse(subScription.description))
            const foundIndex = CONSTANT.CURRENCIES.findIndex((currency: any) => currency.toLowerCase() === subScription.currency)
            setOption(foundIndex)
        }
      }, [subScription, show])

    return (
        <div className={`modal${show ? ' show' : ''}`} onClick={onClose}>
            <div id="editsubscription">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <span>Delete subscription?</span>
                        <div className="close-btn" onClick={onClose}>
                            <CloseIcon color="white" width={30} height={30} />
                        </div>
                    </div>
                    <div className="modal-body">
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
                        <div className="divider"></div>
                    </div>
                    <div className="modal-footer">
                        <div>
                            <Button
                                text="Cancel"
                                fillStyle="outline"
                                color="primary"
                                shape="rounded"
                                width={'80px'}
                                handleSubmit={onClose}
                            />
                        </div>
                        <div style={{ marginLeft: '30px' }}>
                            <Button
                                text="Confirm"
                                fillStyle={publishEnable ? "fill" : undefined}
                                color="primary"
                                shape="rounded"
                                width={'80px'}
                                handleSubmit={submit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditSubscriptionModal