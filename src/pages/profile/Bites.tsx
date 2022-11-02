import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import ProfileMenu from "../../components/profileMenu"
import BiteCardProfile from "../../components/bite/BiteCardProfile"
import { biteAction } from "../../redux/actions/biteActions"
import { BackIcon } from "../../assets/svg"
import '../../assets/styles/profile/creatorListStyle.scss'

const Bites = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const biteState = useSelector((state: any) => state.bite)
    const { bites } = biteState

    useEffect(() => { dispatch(biteAction.getBitesList()) }, [location, dispatch])

    return (
        <div className="creator-wrapper">
            <div className="page-header">
                <div onClick={() => { navigate('/') }}><BackIcon color="black" /></div>
                <div className="page-title"><span>List of Bite-sized Knowledge</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="list-menu">
                <ProfileMenu
                    selectedText="Bites"
                    texts={["Creators", "Bites"]}
                    urls={["creators", "bites"]}
                />
            </div>
            <div className="bites">
                {bites.map((bite: any, index: any) => (
                    <div className="bite" key={index}>
                        <BiteCardProfile
                            bite={bite}
                            same={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Bites