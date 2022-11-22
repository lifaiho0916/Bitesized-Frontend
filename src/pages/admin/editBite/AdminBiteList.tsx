import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import Button from "../../../components/general/button"
import Tabs from "../../../components/general/Tabs"
import { biteAction } from "../../../redux/actions/biteActions"
import { SearchIcon, AscendIcon, DescendIcon, VisibleIcon, HiddenIcon } from "../../../assets/svg"
import { SET_BITE, SET_SELECTED_INDEXES, SET_UPLOADED_PROCESS } from "../../../redux/types"
import "../../../assets/styles/admin/editBite/AdminBiteListStyle.scss"

const AdminBiteList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [sort, setSort] = useState(-1)
    const [option, setOtpion] = useState(0)
    const biteState = useSelector((state: any) => state.bite)
    const { bites } = biteState
    const code = searchParams.get("tab")

    const [search, setSearch] = useState("")

    useEffect(() => { 
        dispatch(biteAction.getBitesAdmin(code, search, sort)) 
        if(code === null) setOtpion(0)
        else if( code === "paid" ) setOtpion(1)
        else setOtpion(2)
    }, [code, location, sort])

    return (
        <div className="admin-bite-list-wrapper">
            <div className="admin-bite">
                <div className="navigate-btns">
                    <Tabs
                        tabWidth="100px"
                        list={[
                        { 
                            text: "All record",
                            route: `${location.pathname}`
                        }, 
                        { 
                            text: "Paid Bite",
                            route: `${location.pathname}?tab=paid`
                        },
                        {
                            text: 'FREE Bite',
                            route: `${location.pathname}?tab=free`
                        }
                        ]}
                        initialOption={option}
                    />
                </div>
                <div className="search-bar">
                    <SearchIcon color="#EFA058" />
                    <input
                        placeholder="Bite title"
                        className="search-input"
                        onChange={(e) => { setSearch(e.target.value) }}
                        onKeyUp={(e) => { if (e.keyCode === 13) dispatch(biteAction.getBitesAdmin(code, search, sort)) }}
                    />
                </div>
                <div className="bite-list">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Post Date</span>
                                        <div style={{ cursor: 'pointer' }}
                                            onClick={() => setSort(-sort)}
                                        >
                                            {sort === -1 ? <DescendIcon /> : <AscendIcon />}
                                        </div>
                                    </div>
                                </th>
                                <th>Post Time</th>
                                <th>Bite title</th>
                                <th>Status</th>
                                <th>Author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bites.map((bite: any, index: any) => (
                                <tr key={index} onClick={() => {
                                    dispatch({ type: SET_BITE, payload: bite })
                                    dispatch({ type: SET_UPLOADED_PROCESS, payload: [0, 0, 0] })
                                    if(location.pathname.indexOf('edit-bite')) dispatch({ type: SET_SELECTED_INDEXES, payload: [-1, -1, -1]})
                                    navigate(`${location.pathname}/${bite._id}`)
                                }}>
                                    <td>{new Date(bite.date).toUTCString().slice(5, 16)}</td>
                                    <td>{new Date(bite.date).toUTCString().slice(17, 25)}</td>
                                    <td>{bite.title}</td>
                                    <td style={{ textAlign: 'center' }}>{bite.visible ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" />}</td>
                                    <td>{bite.owner.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminBiteList