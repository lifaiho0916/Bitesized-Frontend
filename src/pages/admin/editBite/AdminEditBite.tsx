import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import DelBiteModal from "../../../components/modals/DelBiteModal"
import Avatar from "../../../components/general/avatar"
import Input from "../../../components/general/input"
import TeaserCard from "../../../components/general/TeaserCard"
import Button from "../../../components/general/button"
import { biteAction } from "../../../redux/actions/biteActions"
import { BackIcon, VisibleIcon, HiddenIcon, DeleteIcon, AddIcon, RemoveIcon } from "../../../assets/svg"
import "../../../assets/styles/admin/editBite/AdminEditBiteStyle.scss"

const AdminEditBite = () => {
    const { biteId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const biteState = useSelector((state: any) => state.bite)
    const { bite, thumbnails } = biteState
    const [title, setTitle] = useState("")

    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const changeVisible = (visible: any) => { dispatch(biteAction.changeVisible(biteId, visible)) }
    useEffect(() => { if (bite.title === null) dispatch(biteAction.getBiteById(biteId)) }, [bite])

    return (
        <div className="admin-edit-bite-wrapper">
            <DelBiteModal
                show={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                handleSubmit={() => { dispatch(biteAction.deleteBite(biteId, navigate)) }}
            />
            <div className="page-header">
                <div onClick={() => navigate('/admin/edit-bite')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Bite</span></div>
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '10px' }} onClick={() => changeVisible(!bite.visible)}>
                        {bite ? bite.visible ? <HiddenIcon color="#EFA058" /> : <VisibleIcon color="#EFA058" /> : <></>}
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
                                </div>
                                <div className="video-action">
                                    <div className="icons">
                                        <RemoveIcon color="white" />
                                    </div>
                                    <div className="icons">
                                        <HiddenIcon color="white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {bite.videos.length < 3 &&
                            <div className="bite-video">
                                <div className="add-icon">
                                    <AddIcon color="white" width={30} height={30} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        text="Save"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"250px"}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminEditBite