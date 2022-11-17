import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import Button from "../../../components/general/button"
import { biteAction } from "../../../redux/actions/biteActions"
import { SearchIcon, AscendIcon, DescendIcon, VisibleIcon, HiddenIcon } from "../../../assets/svg"
import { SET_BITE } from "../../../redux/types"
import "../../../assets/styles/admin/editBite/AdminBiteListStyle.scss"

const AdminCommentBiteList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [sort, setSort] = useState(-1)
    const biteState = useSelector((state: any) => state.bite)
    const { bites } = biteState
    const code = searchParams.get("type")

    const [search, setSearch] = useState("")

    useEffect(() => { dispatch(biteAction.getBitesAdmin(code, search, sort)) }, [code, location, sort])

    return (
        <div className="admin-bite-list-wrapper">
            <div className="admin-bite">
                <div className="navigate-btns">
                    <div className="btn">
                        <Button
                            text="All record"
                            fillStyle={code === null ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate(`${location.pathname}`)}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="Paid Bite"
                            fillStyle={code === 'paid' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate(`${location.pathname}?type=paid`)}
                        />
                    </div>
                    <div className="btn">
                        <Button
                            text="FREE Bite"
                            fillStyle={code === 'free' ? "fill" : "outline"}
                            shape="rounded"
                            color="primary"
                            with={"100px"}
                            handleSubmit={() => navigate(`${location.pathname}?type=free`)}
                        />
                    </div>
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
                                        <span>Latest comment post Date</span>
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
                                    navigate(`${location.pathname}/${bite._id}`)
                                }}>
                                    <td>{new Date(bite.date).toUTCString().slice(5, 16)}</td>
                                    <td>{new Date(bite.date).toUTCString().slice(17, 25)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className={ bite.commentNotification && bite.commentNotification === true ? "red-dot" : "normal"}></div>     
                                            <span>{bite.title}</span>
                                        </div>
                                    </td>
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

export default AdminCommentBiteList