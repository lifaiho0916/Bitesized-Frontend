import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../general/avatar'
import Button from '../general/button'
import { LanguageContext } from '../../routes/authRoute'
import { ProfileIcon } from '../../assets/svg'
import '../../assets/styles/profile/components/creatorStyle.scss'

const Creator = (props: any) => {
  const { user } = props
  const contexts = useContext(LanguageContext)
  const navigate = useNavigate()

  return (
    <div className="creator-comp-wrapper">
      <div className="avatar-userinfo">
        <div className="avatar">
          <Avatar
            avatar={(user && user.avatar) ? user.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : user.avatar : ''}
            size={'mobile'}
          />
        </div>
        <div className="name-category">
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
      <div className="buttons">
        <Button
          text={contexts.GENERAL.PROFILE}
          fillStyle="outline"
          color="primary"
          width={"80px"}
          icon={[<ProfileIcon color="#EFA058" />, <ProfileIcon color="white" />, <ProfileIcon color="white" />]}
          handleSubmit={() => { navigate(`/${user?.personalisedUrl}`) }}
        />
      </div>
    </div>
  )
}

export default Creator