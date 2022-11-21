import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { BackIcon } from "../../assets/svg"
import { subScriptionAction } from "../../redux/actions/subScriptionActions"
import "../../assets/styles/subscription/SetSubscriptionStyle.scss"

const SetSubscription = (props: any) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector((state: any) => state.auth)

    const { user } = userState

    useEffect(() => {
        if(user && (user.subscribe.available === false || user.subscribe.switch === false)) navigate(`/${user.personalisedUrl}`)
    }, [user, navigate])

    return (
        <div className="set-subscription-wrapper">
            <div className="page-header">
                <div onClick={() => navigate(`/${user?.personalisedUrl}?tab=subscription`)}><BackIcon color="black" /></div>
                <div className="page-title"><span>Set subscription</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            
            <div className="set-subscription">

            </div>
        </div>
    )
}

export default SetSubscription