import { useContext } from "react"
import Avatar from "./avatar"
import Button from "./button"
import { LanguageContext } from "../../routes/authRoute"
import { AddIcon } from "../../assets/svg"
import "../../assets/styles/CreatorStyle.scss"

const CreatorSm = (props: any) => {
    const { user, handleSubmit } = props
    const contexts = useContext(LanguageContext)

    return (
        <div className="creator-component-wrapper">
            <div className="avatar-userdata">
                <div className="avatar">
                    <Avatar
                        avatar={(user && user.avatar) ? user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : user.avatar : ''}
                        size={'mobile'}
                    />
                </div>
                <div className="userdata">
                    <div className="creator-name">
                        <span>{user?.name}</span>
                    </div>
                    <div className="creator-category">
                        {user?.categories.map((category: any, index: any, array: any) => (
                            <span key={index}>{contexts.CREATOR_CATEGORY_LIST[category]}{index < array.length - 1 && "/"}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    text={"Create FREE Bite"}
                    fillStyle="outline"
                    color="primary"
                    width={"155px"}
                    icon={[<AddIcon color="#EFA058" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    )
}

export default CreatorSm