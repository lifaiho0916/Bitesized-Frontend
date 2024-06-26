import { useContext, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { LanguageContext } from "../../../routes/authRoute"
import CategoryBtn from "../../../components/general/categoryBtn"
import { authAction } from "../../../redux/actions/authActions"
import CreatorSm from "../../../components/general/CreatorSm"
import { SearchIcon } from "../../../assets/svg"
import { SET_BITE_INITIAL, SET_UPLOADED_PROCESS } from "../../../redux/types"
import "../../../assets/styles/admin/createBite/AdminCreatorListStyle.scss"

const AdminCreatorList = (props: any) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const contexts = useContext(LanguageContext)
    const [categories, setCategories] = useState<Array<any>>([])
    const userState = useSelector((state: any) => state.auth)
    const { users } = userState

    const [search, setSearch] = useState("")

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

    useEffect(() => { dispatch(authAction.getUsersByCategory(categories, search)) }, [categories, dispatch])

    return (
        <div className="admin-creator-list-wrapper">
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
            <div className="search-bar">
                <SearchIcon color="#EFA058" />
                <input
                    placeholder="Username"
                    className="search-input"
                    onChange={(e) => { setSearch(e.target.value) }}
                    onKeyUp={(e) => { if (e.keyCode === 13) dispatch(authAction.getUsersByCategory(categories, search)) }}
                />
            </div>
            <div className="creators">
                {users.map((user: any, index: any) => (
                    <div className="creator" key={index}>
                        <CreatorSm
                            user={user}
                            handleSubmit={(type: any) => {
                                dispatch({ type: SET_UPLOADED_PROCESS, payload: [0, 0, 0] })
                                dispatch({ type: SET_BITE_INITIAL })
                                navigate(`/admin/create-bite/${type === 0 ? 'free' : 'paid'}`, { state: { user: user } })
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminCreatorList