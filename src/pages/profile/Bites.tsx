import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import ProfileMenu from "../../components/profileMenu"
import CategoryBtn from "../../components/general/categoryBtn"
import BiteCardProfile from "../../components/bite/BiteCardProfile"
import { biteAction } from "../../redux/actions/biteActions"
import { BackIcon } from "../../assets/svg"
import CONSTANT from "../../constants/constant"
import '../../assets/styles/profile/creatorListStyle.scss'

const Bites = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const biteState = useSelector((state: any) => state.bite)
    const { bites } = biteState
    const [categories, setCategories] = useState<Array<any>>([])
    const sortedCategories: any = CONSTANT.BITE_CATEGORIES.map((category: any, index: any) => { return { text: category, index: index }})
        .sort((first: any, second: any) => {
            if(first.text > second.text) return 1
            else if(first.text < second.text) return -1
            else return 0
        })

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

    useEffect(() => { dispatch(biteAction.getBitesList(categories)) }, [location, dispatch, categories])

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
            <div className="creator-list">
                <div className="sort-item">
                    <div className="sort-letter">Sort by:</div>
                    {sortedCategories.map((category: any, index: any) => (
                        <div className="item" key={index} onClick={() => { selectCategory(category.index) }}>
                            <CategoryBtn text={category.text} pressed={includeCategory(category.index) ? true : false} />
                        </div>
                    ))}
                </div>
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