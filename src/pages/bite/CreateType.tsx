
import { useEffect, useContext } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "../../components/general/button"
import { BackIcon, AddIcon } from "../../assets/svg"
import CreateImage from "../../assets/img/create.png"
import { LanguageContext } from "../../routes/authRoute"
import { SET_BITE_INITIAL, SET_UPLOADED_PROCESS } from "../../redux/types"
import "../../assets/styles/bite/CreateTypeStyle.scss"

const CreateType = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const contexts = useContext(LanguageContext)

    useEffect(() => {
        dispatch({ type: SET_BITE_INITIAL })
        dispatch({ type: SET_UPLOADED_PROCESS, payload: [0, 0, 0] })
    }, [dispatch])

    return (
        <div className="create-type-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/')}><BackIcon color="black" /></div>
                <div className="page-title"><span>{contexts.BITETYPE.MAKE_BITE}</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="create-type">
                <img src={CreateImage} alt="createImage" />
                <div className="type-description">
                    <span>{contexts.BITETYPE.SHARE_FREE}</span>
                </div>
                <div className="first-divider"></div>
                <Button
                    text={contexts.BITETYPE.FREE_BITE}
                    width="320px"
                    fillStyle="fill"
                    shape="rounded"
                    color="primary"
                    icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                    handleSubmit={() => navigate('/bite/create/free')}
                />
                <div className="second-divider"></div>
                <div className="type-description">
                    <span>{contexts.BITETYPE.SHARE_EARNING}</span>
                </div>
                <div className="first-divider"></div>
                <Button
                    text={contexts.BITETYPE.PAID_BITE}
                    width="320px"
                    fillStyle="fill"
                    shape="rounded"
                    color="primary"
                    icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                    handleSubmit={() => navigate('/bite/create/paid')}
                />
            </div>
        </div>
    )
}

export default CreateType