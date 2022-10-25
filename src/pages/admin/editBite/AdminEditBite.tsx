import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import DelBiteModal from "../../../components/modals/DelBiteModal"
import RemoveBiteVideoModal from "../../../components/modals/RemoveBiteVideoModal"
import Avatar from "../../../components/general/avatar"
import Input from "../../../components/general/input"
import TeaserCard from "../../../components/general/TeaserCard"
import Button from "../../../components/general/button"
import { biteAction } from "../../../redux/actions/biteActions"
import { BackIcon, VisibleIcon, HiddenIcon, DeleteIcon, AddIcon, RemoveIcon } from "../../../assets/svg"
import { SET_BITE } from "../../../redux/types"
import "../../../assets/styles/admin/editBite/AdminEditBiteStyle.scss"

const AdminEditBite = () => {
    const { biteId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const biteState = useSelector((state: any) => state.bite)
    const { bite, thumbnails } = biteState
    const [title, setTitle] = useState("")
    const [removeIndex, setRemoveIndex] = useState(0)

    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openRemoveBiteVideoModal, setOpenRemoveBiteVideoModal] = useState(false)

    const changeVisible = (visible: any) => { dispatch(biteAction.changeVisible(biteId, visible)) }
    const changeVideoVisible = (index: any, visible: any) => { dispatch(biteAction.changeVideoVisible(biteId, index, visible)) }
    useEffect(() => { dispatch(biteAction.getBiteById(biteId)) }, [biteId])

    return (
        <div className="admin-edit-bite-wrapper">
            <DelBiteModal
                show={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                handleSubmit={() => { dispatch(biteAction.deleteBite(biteId, navigate)) }}
            />
            <RemoveBiteVideoModal
                show={openRemoveBiteVideoModal}
                onClose={() => setOpenRemoveBiteVideoModal(false)}
                handleSubmit={() => {
                    dispatch(biteAction.removeVideoFromBite(biteId, removeIndex))
                    setOpenRemoveBiteVideoModal(false)
                }}
            />
            <div className="page-header">
                <div onClick={() => navigate('/admin/edit-bite')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Bite</span></div>
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '10px' }} onClick={() => changeVisible(!bite.visible)}>
                        {bite ? bite.visible ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" /> : <></>}
                    </div>
                    <div onClick={() => setOpenDeleteModal(true)}><DeleteIcon color="#EFA058" /></div>
                </div>
            </div>
            <div className="edit-bite">
                <div className="avatar-title">
                    <div className="avatar">
                        {bite.owner &&
                            <Avatar
                                avatar={bite.owner.avatar.indexOf('uploads') !== -1 ? `${process.env.REACT_APP_SERVER_URL}/${bite.owner.avatar}` : bite.owner.avatar}
                                username={bite.owner.name}
                                avatarStyle={"horizontal"}
                            />
                        }
                    </div>
                    <div className="bite-title">
                        <span>{bite?.title}</span>
                    </div>
                </div>
                <div className="edit-title">
                    <Input
                        label="Edit title for this Bite"
                        placeholder="Bite title"
                        type="input"
                        width={"100%"}
                        title={title}
                        setTitle={setTitle}
                        wordCount={100}
                    />
                </div>
                <div className="edit-video">
                    <div className="bite-videos">
                        {bite.videos.map((video: any, index: any) => (
                            <div key={index}>
                                <div className="bite-video" >
                                    <TeaserCard
                                        cover={video.coverUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.coverUrl}` : ""}
                                        teaser={video.videoUrl ? `${process.env.REACT_APP_SERVER_URL}/${video.videoUrl}` : ""}
                                        type={"dareme"}
                                    />
                                    <div className="view-icon" onClick={() => changeVideoVisible(index, !video.visible)}>
                                        {video.visible ?
                                            <VisibleIcon color="white" /> :
                                            <HiddenIcon color="white" />
                                        }

                                    </div>
                                    <div className="remove-icon" onClick={() => {
                                        setRemoveIndex(index)
                                        setOpenRemoveBiteVideoModal(true)
                                    }}>
                                        <RemoveIcon color="white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="action-buttons">
                    {bite.videos.length > 0 &&
                        <Button
                            text="Edit thumbnail"
                            fillStyle="fill"
                            color="primary"
                            shape="rounded"
                            width={"250px"}
                            handleSubmit={() => { }}
                        />
                    }
                    {bite.videos.length < 3 &&
                        <Button
                            text="Upload Bite Video"
                            fillStyle="fill"
                            color="primary"
                            shape="rounded"
                            width={"250px"}
                            icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                            handleSubmit={() => { }}
                        />
                    }
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        text="Save"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"250px"}
                        handleSubmit={() => { }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminEditBite