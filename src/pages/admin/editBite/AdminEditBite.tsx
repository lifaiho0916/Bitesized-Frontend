import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import DelBiteModal from "../../../components/modals/DelBiteModal"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import RemoveBiteVideoModal from "../../../components/modals/RemoveBiteVideoModal"
import Avatar from "../../../components/general/avatar"
import Input from "../../../components/general/input"
import ReactPlayer from "react-player"
import Button from "../../../components/general/button"
import { biteAction } from "../../../redux/actions/biteActions"
import { BackIcon, VisibleIcon, HiddenIcon, DeleteIcon, AddIcon, RemoveIcon, PlayIcon, DragHandleIcon } from "../../../assets/svg"
import { SET_BITE, SET_SELECTED_INDEXES, SET_VIDEO_ALIGNS, SET_PREVIOUS_ROUTE } from "../../../redux/types"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/admin/editBite/AdminEditBiteStyle.scss"
import Select from "../../../components/general/select"

const reOrder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

const AdminEditBite = () => {
    const { biteId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const biteState = useSelector((state: any) => state.bite)
    const { bite, selectedIndexs, aligns } = biteState
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState(bite.category ? bite.category : 0)
    const [removeIndex, setRemoveIndex] = useState(0)
    const [videoIndex, setVideoIndex] = useState(-1)
    const [play, setPlay] = useState(false)

    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openRemoveBiteVideoModal, setOpenRemoveBiteVideoModal] = useState(false)

    const changeVisible = (visible: any) => { dispatch(biteAction.changeVisible(biteId, visible)) }
    const changeVideoVisible = (index: any, visible: any) => {
        if (bite.videos[index].id) {
            let videos = bite.videos
            videos[index].visible = visible
            dispatch({
                type: SET_BITE, payload: {
                    ...bite,
                    videos: videos
                }
            })
        } else dispatch(biteAction.changeVideoVisible(biteId, index, visible))
    }

    const saveBite = () => {
        const resBite = {
            ...bite,
            title: title !== '' ? title : bite.title,
            category: category
        }

        dispatch(biteAction.editBite(resBite, navigate))
    }

    const uploadVideo = (e: any) => {
        const { files } = e.target
        if (files.length === 0) return
        let len = bite.videos.length === 0 ? files.length > 3 ? 3 : files.length
            : files.length > (3 - bite.videos.length) ? 3 - bite.videos.length : files.length
        for (let i = 0; i < len; i++) {
            if (files[i].size > CONSTANT.MAX_BITE_FILE_SIZE) {
                alert("Please keep file size below 100MB")
                return
            }
        }

        for (let i = 0; i < len; i++) {
            const loadFile = Object.assign(files[i], { preview: URL.createObjectURL(files[i]) })
            window.URL = window.URL || window.webkitURL
            const video = document.createElement('video')
            video.preload = "metadata"
            video.onloadedmetadata = evt => {
                let videos = bite.videos
                videos.push({
                    id: loadFile.name,
                    coverUrl: null,
                    videoUrl: loadFile,
                    duration: video.duration,
                    visible: true
                })
                dispatch({ type: SET_BITE, payload: { ...bite, videos: videos } })
            }
            video.src = URL.createObjectURL(loadFile)
        }
    }
    const getFirstFrame = async (index: any) => {
        const video: any = document.getElementById(`element${index}`)?.firstChild
        let canvas = document.createElement("canvas") as HTMLCanvasElement
        let context = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context?.drawImage(video, 0, 0)
        let url = canvas.toDataURL('image/png')
        const res = await fetch(url)
        const blob = await res.blob()
        const file = new File([blob], 'cover.png', blob)
        const cover = Object.assign(file, { preview: url })
        const videos = bite.videos
        videos[index].coverUrl = cover
        dispatch({ type: SET_BITE, payload: { ...bite, videos: videos } })
    }

    const gotoEditThumbnail = () => {
        dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname })
        navigate(`/admin/edit-bite/${biteId}/edit-thumbnail`)
    }

    const onDragEnd = (result: any) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        const items = reOrder(
            bite.videos,
            result.source.index,
            result.destination.index
        )

        const tempAligns = reOrder(
            aligns,
            result.source.index,
            result.destination.index
        )

        const indexes = reOrder(
            selectedIndexs,
            result.source.index,
            result.destination.index
        )

        dispatch({ type: SET_VIDEO_ALIGNS, payload: tempAligns })
        dispatch({ type: SET_SELECTED_INDEXES, payload: indexes })
        dispatch({
            type: SET_BITE,
            payload: {
                ...bite, videos: items
            }
        })
    }

    const getItemStyle = (isDragging: any, draggableStyle: any) => ({
        userSelect: 'none',
        background: isDragging ? '#FFC88F' : '#FFFFFF',
        ...draggableStyle,
    })

    useEffect(() => { if (bite.title === null) navigate('/admin/edit-bite') }, [bite])

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
                    if (bite.videos[removeIndex].id) {
                        let videos = bite.videos.filter((video: any, index: any) => index !== removeIndex)
                        dispatch({
                            type: SET_BITE, payload: {
                                ...bite,
                                videos: videos
                            }
                        })
                    } else dispatch(biteAction.removeVideoFromBite(biteId, removeIndex))
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
                        {bite.category &&
                            <div className="bite-category">
                                <span>{CONSTANT.BITE_CATEGORIES[bite.category]}</span>
                            </div>
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
                <div className="edit-category">
                    <h4 className="color-primary-level5">Category</h4>
                    <Select
                        width={'100%'}
                        option={category}
                        setOption={setCategory}
                        options={CONSTANT.BITE_CATEGORIES}
                    />
                </div>
                <div className="edit-video">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided, snapshot) => (
                                <div className="bite-videos"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {bite.videos.map((video: any, index: any) => (
                                        <Draggable key={video.id ? video.id : video.videoUrl} draggableId={video.id ? video.id : video.videoUrl} index={index}>
                                            {(provided, snapshot) => (
                                                <div className="bite-video"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <div className="bite-main-part">
                                                        <div className="bite-part" onClick={() => {
                                                            if (play) {
                                                                if (videoIndex === index) {
                                                                    setPlay(false)
                                                                    setVideoIndex(-1)
                                                                } else setVideoIndex(index)
                                                            }
                                                        }}>
                                                            {(index !== videoIndex) &&
                                                                <>
                                                                    <div className="cover-image">
                                                                        {video.coverUrl &&
                                                                            <img
                                                                                src={video.coverUrl.preview ? video.coverUrl.preview : `${process.env.REACT_APP_SERVER_URL}/${video.coverUrl}`}
                                                                                alt="coverImage"
                                                                                width={'100%'}
                                                                            />
                                                                        }
                                                                    </div>
                                                                    <div className="play-icon" onClick={() => {
                                                                        setVideoIndex(index)
                                                                        setPlay(true)
                                                                    }}>
                                                                        <PlayIcon color="white" width={'28'} height={'28'} />
                                                                    </div>
                                                                </>
                                                            }
                                                            {(play && videoIndex === index) &&
                                                                <>
                                                                    <ReactPlayer
                                                                        className="react-player"
                                                                        url={video.videoUrl.preview ? video.videoUrl.preview : `${process.env.REACT_APP_SERVER_URL}/${video.videoUrl}`}
                                                                        playing={play}
                                                                        playsinline={true}
                                                                        config={{
                                                                            file: {
                                                                                attributes: {
                                                                                    controlsList: 'nodownload noremoteplayback noplaybackrate',
                                                                                    disablePictureInPicture: true,
                                                                                }
                                                                            }
                                                                        }}
                                                                        controls
                                                                    />
                                                                </>
                                                            }
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                                                            <DragHandleIcon width={30} height={10} color={snapshot.isDragging ? "#EA8426" : "#BAB6B5"} />
                                                        </div>
                                                    </div>
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
                                            )}

                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className="action-buttons">
                    {bite.videos.length > 0 &&
                        <Button
                            text="Edit thumbnail"
                            fillStyle="fill"
                            color="primary"
                            shape="rounded"
                            width={"250px"}
                            handleSubmit={gotoEditThumbnail}
                        />
                    }
                    {bite.videos.length < 3 &&
                        <>
                            <Button
                                text="Upload Bite Video"
                                fillStyle="fill"
                                color="primary"
                                shape="rounded"
                                width={"250px"}
                                icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                                handleSubmit={() => fileInputRef.current?.click()}
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={uploadVideo}
                                hidden
                                multiple
                                accept="video/*"
                                value=""
                            />
                        </>
                    }
                </div>
                <div style={{ display: 'none' }}>
                    {bite.videos.map((video: any, index: any) => (
                        <ReactPlayer
                            id={`element${index}`}
                            key={index}
                            url={video.videoUrl.preview ? video.videoUrl.preview : `${process.env.REACT_APP_SERVER_URL}/${video.videoUrl}`}
                            playing={false}
                            onReady={() => { if (video.coverUrl === null) setTimeout(() => getFirstFrame(index), 500) }}
                        />
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        text="Save"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"250px"}
                        handleSubmit={saveBite}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminEditBite