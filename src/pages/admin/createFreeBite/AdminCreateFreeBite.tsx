import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import CreatorLg from "../../../components/general/CreatorLg"
import ContainerBtn from "../../../components/general/containerBtn"
import ReactPlayer from "react-player"
import TeaserCard from "../../../components/general/TeaserCard"
import Input from "../../../components/general/input"
import PublishBiteModal from "../../../components/modals/PublishBiteModal"
import Button from "../../../components/general/button"
import { BackIcon, RemoveIcon, AddIcon } from "../../../assets/svg"
import { biteAction } from "../../../redux/actions/biteActions"
import CONSTANT from "../../../constants/constant"
import { SET_BITE, SET_BITE_THUMBNAILS, SET_PREVIOUS_ROUTE } from "../../../redux/types"
import "../../../assets/styles/admin/createFreeBite/AdminCreateFreeBiteStyle.scss"

const AdminCreateFreeBite = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const biteState = useSelector((state: any) => state.bite)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [title, setTitle] = useState('')
    const [publishEnable, setPublishEnable] = useState(false)
    const { state } = location
    let user: any = null
    if (state) user = state.user

    const { bite, thumbnails } = biteState
    const [openPublish, setOpenPublish] = useState(false)

    const publish = () => {
        if (!publishEnable) return
        setOpenPublish(true)
    }
    const publishBite = () => {
        const newBite = {
            ...bite,
            title: title,
        }
        dispatch(biteAction.saveBiteByUserId(newBite, user._id, navigate))
    }
    const displayDuration = (duration: any) => { return Math.floor(duration / 60) + ":" + (Math.round(duration % 60) < 10 ? '0' : '') + Math.round(duration % 60) }
    const uploadVideo = (e: any) => {
        const { files } = e.target
        if (files.length === 0) return
        let len = bite.videos.length === 0 ? files.length > 3 ? 3 : files.length
            : files.length > (3 - bite.videos.length) ? 3 - bite.videos.length : files.length
        for (let i = 0; i < len; i++) {
            if (files[i].size > CONSTANT.MAX_BITE_FILE_SIZE) {
                alert("file size is over 150M")
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
                let thumbs = thumbnails
                thumbs.push('')
                videos.push({
                    coverUrl: null,
                    videoUrl: loadFile,
                    duration: video.duration
                })
                dispatch({ type: SET_BITE, payload: { ...bite, videos: videos } })
                dispatch({ type: SET_BITE_THUMBNAILS, payload: thumbs })
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
        const thumbs = thumbnails
        videos[index].coverUrl = cover
        thumbs[index] = cover
        dispatch({ type: SET_BITE, payload: { ...bite, videos: videos } })
        dispatch({ type: SET_BITE_THUMBNAILS, payload: thumbs })
    }
    const gotoEditThumbnail = () => {
        dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname })
        navigate('/admin/create-free-bite/detail/edit-thumbnail', { state: { user: user } })
    }
    const removeVideo = (index: any) => {
        let videos = bite.videos.filter((video: any, i: any) => i !== index)
        let thumbs = thumbnails.filter((thumb: any, i: any) => i !== index)
        dispatch({ type: SET_BITE, payload: { ...bite, videos: videos } })
        dispatch({ type: SET_BITE_THUMBNAILS, payload: thumbs })
    }

    useEffect(() => {
        if (title === "" || bite.videos.length === 0) {
            setPublishEnable(false)
            return
        }
        setPublishEnable(true)
    }, [title, bite])

    useEffect(() => { if (state === null) navigate('/admin/create-free-bite') }, [])

    return (
        <div className="create-free-bite-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/admin/create-free-bite')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Posting on FREE Bite</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <PublishBiteModal
                show={openPublish}
                onClose={() => setOpenPublish(false)}
                handleSubmit={publishBite}
            />
            <div className="create-free-bite">
                <div className="creator">
                    <CreatorLg user={user} />
                </div>

                <div className="create-bite">
                    <div className="uploaded-vidoes" style={{ height: bite.videos.length === 0 ? '0px' : '495px' }}>
                        {bite.videos.map((video: any, index: any) => (
                            <div className="uploaded-video" key={index}>
                                <TeaserCard
                                    cover={video.coverUrl ? video.coverUrl.preview : null}
                                    teaser={video.videoUrl.preview}
                                    type={"dareme"}
                                />
                                <div className="bin-btn" onClick={() => removeVideo(index)}>
                                    <RemoveIcon color="white" width={30} height={30} />
                                </div>
                                <div className="time-duration">
                                    <span>{displayDuration(video.duration)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="upload-edit-btns">
                        {bite.videos.length > 0 &&
                            <div className="upload-btn">
                                <Button
                                    text="Edit thumbnail"
                                    width={250}
                                    shape="rounded"
                                    fillStyle="fill"
                                    color="primary"
                                    handleSubmit={gotoEditThumbnail}
                                />
                            </div>
                        }
                        {bite.videos.length < 3 &&
                            <div className="upload-btn">
                                <Button
                                    text="Upload Bite Videos"
                                    width={250}
                                    shape="rounded"
                                    fillStyle="fill"
                                    color="primary"
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
                            </div>
                        }
                    </div>
                    <div className="react-player-hidden">
                        {bite.videos.map((video: any, index: any) => (
                            <ReactPlayer
                                id={`element${index}`}
                                key={index}
                                url={video.videoUrl.preview}
                                playing={false}
                                onReady={() => { if (video.coverUrl === null) setTimeout(() => getFirstFrame(index), 1000) }}
                            />
                        ))}
                    </div>

                    <div className="first-divider"></div>
                    <div className="session-title">
                        <span>Bite Title</span>
                    </div>
                    <div className="session-input">
                        <Input
                            type="input"
                            width={'100%'}
                            wordCount={100}
                            placeholder="How to be a content creators?"
                            title={title}
                            setTitle={setTitle}
                        />
                    </div>

                    <div className="fifth-divider"></div>
                    <div className="publish-btn" onClick={publish}>
                        <ContainerBtn
                            styleType="fill"
                            color="primary"
                            text="Publish"
                            disabled={!publishEnable}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdminCreateFreeBite