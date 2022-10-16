import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { LanguageContext } from "../../../routes/authRoute"
import { useSelector } from 'react-redux'
import { SET_PROFILE } from '../../../redux/types'
import CategoryBtn from "../../../components/general/categoryBtn"
import Button from '../../../components/general/button'
import { BackIcon } from '../../../assets/svg'
import "../../../assets/styles/profile/categoriesStyle.scss"

const Categories = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const contexts = useContext(LanguageContext);
  const userState = useSelector((state: any) => state.auth)
  const { profile } = userState
  const [categories, setCategories] = useState<Array<any>>([])

  const selectCategory = (index: any) => {
    var array = [...categories]
    if (includeCategory(index)) {
      let array_index = 0
      for (let i = 0; i < categories.length; i++) if (categories[i] === index) array_index = i
      array.splice(array_index, 1)
    } else {
      if (array.length < 3) array.push(index)
    }
    setCategories(array)
  }

  const handleSave = () => {
    const state = { ...profile, category: categories }
    dispatch({ type: SET_PROFILE, payload: state })
    navigate(`/myaccount/edit`)
  }

  const includeCategory = (index: any) => {
    for (let i = 0; i < categories.length; i++) if (categories[i] === index) return true
    return false
  }

  useEffect(() => { setCategories(profile.category) }, [profile])

  return (
    <div className="categories-wrapper">
      <div className="page-header">
        <div onClick={() => navigate(`/myaccount/edit`)}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.CHOOSE_CATEGORY}</span></div>
        <div style={{ width: '24px' }}></div>
      </div>
      <div className="categories-body">
        <div className="description">{contexts.EDIT_PROFILE_LETTER.CATEGORY_LETTER}</div>
        <div className="categories">
          {contexts.CREATOR_CATEGORY_LIST.map((title: any, i: any) => (
            <div className="category" key={i} onClick={() => { selectCategory(i) }}>
              <CategoryBtn text={title} color="primary" pressed={includeCategory(i) ? true : false} />
            </div>
          ))}
        </div>
        <div className="save-btn">
          <Button
            fillStyle="fill"
            text={contexts.GENERAL_LETTER.SAVE}
            color="primary"
            shape="rounded"
            width="100px"
            handleSubmit={handleSave}
          />
        </div>
      </div>
    </div>
  )
}

export default Categories
