import { useContext, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import CategoryBtn from "../../components/general/categoryBtn"
import Creator from "../../components/profile/creator"
import ProfileMenu from "../../components/profileMenu"
import { LanguageContext } from "../../routes/authRoute"
import { authAction } from "../../redux/actions/authActions"
import { BackIcon } from "../../assets/svg"
import '../../assets/styles/profile/creatorListStyle.scss'

const Creators = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const contexts = useContext(LanguageContext)
  const [categories, setCategories] = useState<Array<any>>([])
  const userState = useSelector((state: any) => state.auth)
  const { users } = userState

  const selectCategory = (index: any) => {
    var array = [...categories]
    if (includeCategory(index)) {
      let i = categories.findIndex((category: any) => category === index)
      array.splice(i, 1)
    } else array.push(index)
    setCategories(array)
  }

  const includeCategory = (index: any) => {
    if (categories.findIndex((category: any) => category === index) !== -1) return true
    return false
  }

  useEffect(() => { dispatch(authAction.getCreatorsByCategory(categories)) }, [categories, dispatch])

  return (
    <div className="creator-wrapper">
      <div className="page-header">
        <div onClick={() => { navigate('/') }}><BackIcon color="black" /></div>
        <div className="page-title"><span>List of Creators</span></div>
        <div style={{ width: '24px' }}></div>
      </div>
      <div className="list-menu">
        <ProfileMenu
          selectedText="Creators"
          texts={["Creators", "Bites"]}
          urls={["creators", "bites"]}
        />
      </div>
      <div className="creator-list">
        <div className="sort-item">
          <div className="sort-letter">Sort by:</div>
          {contexts.CREATOR_CATEGORY_LIST.map((category: any, index: any) => (
            <div className="item" key={index} onClick={() => { selectCategory(index) }}>
              <CategoryBtn text={category} pressed={includeCategory(index) ? true : false} />
            </div>
          ))}
        </div>
      </div>
      <div className="creators">
        {users.map((user: any, index: any) => (
          <div className="creator" key={index}>
            <Creator user={user} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Creators