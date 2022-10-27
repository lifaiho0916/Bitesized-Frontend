import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import ReactPlayer from "react-player"
import AvatarEditor from 'react-avatar-editor'
import Button from "../../components/general/button"
import { AddIcon, BackIcon, FitHeightIcon, FitWidthIcon } from "../../assets/svg"
import { SET_BITE, SET_LOADING_TRUE, SET_LOADING_FALSE } from "../../redux/types"
import "../../assets/styles/bite/EditCoverStyle.scss"

const EditCoverImage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const loadState = useSelector((state: any) => state.load)
    const biteState = useSelector((state: any) => state.bite)
    const { prevRoute } = loadState
    const { bite, thumbnails } = biteState
    const fileInputRef = useRef<HTMLInputElement>(null)
    let imageEditor1: any = null
    let imageEditor2: any = null
    let imageEditor3: any = null
    const playerRef = useRef<ReactPlayer>(null)
    const [thumbs, setThumbs] = useState<any>([[], [], []])
    const [selectedIndexs, setSelecteIndexes] = useState<any>([0, 0, 0])
    const [uploadedThumbs, setUploadedThumbs] = useState<any>([null, null, null])
    const [seekCnt, setSeekCnt] = useState<any>(null)
    const [aligns, setAligns] = useState<any>([true, true, true])
    const [videoIndex, setVideoIndex] = useState(0)

    const NextCover = async () => {
        if (videoIndex < bite.videos.length - 1) {
            setSeekCnt(null)
            setVideoIndex((index) => index + 1)
        }
    }
    const PrevCover = async () => {
        if (videoIndex > 0) {
            setSeekCnt(null)
            setVideoIndex((index) => index - 1)
        }
    }

    const gotoCreateBite = async () => {
        const videos = bite.videos
        if (thumbnails[0]) {
            const canvas = imageEditor1.getImage()
            let url = canvas.toDataURL('image/png')
            const res = await fetch(url)
            const blob = await res.blob()
            const imageFile = new File([blob], 'edit.png', blob)
            const cover = Object.assign(imageFile, { preview: url })
            videos[0].coverUrl = cover
        }
        if (thumbnails[1]) {
            const canvas = imageEditor2.getImage()
            let url = canvas.toDataURL('image/png')
            const res = await fetch(url)
            const blob = await res.blob()
            const imageFile = new File([blob], 'edit.png', blob)
            const cover = Object.assign(imageFile, { preview: url })
            videos[1].coverUrl = cover
        }
        if (thumbnails[2]) {
            const canvas = imageEditor3.getImage()
            let url = canvas.toDataURL('image/png')
            const res = await fetch(url)
            const blob = await res.blob()
            const imageFile = new File([blob], 'edit.png', blob)
            const cover = Object.assign(imageFile, { preview: url })
            videos[2].coverUrl = cover
        }
        dispatch({ type: SET_BITE, payload: { ...bite, videos: videos } })
        navigate(prevRoute, { state: { user: location.state ? location.state.user : null } })
    }

    const setEditorRef1 = (editor: any) => (imageEditor1 = editor)
    const setEditorRef2 = (editor: any) => (imageEditor2 = editor)
    const setEditorRef3 = (editor: any) => (imageEditor3 = editor)

    const setFit = (index: any) => {
        let alignTemps: any = aligns
        alignTemps[index] = !alignTemps[index]
        setAligns([...alignTemps])
    }

    const getCoverURL = () => {
        let canvas = document.createElement("canvas") as HTMLCanvasElement
        const video: any = document.getElementById("element")?.firstChild
        let context = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context?.drawImage(video, 0, 0)
        let url = canvas.toDataURL('image/png')
        return url
    }

    const uploadThumbnail = (e: any) => {
        const { files } = e.target
        if (files.length === 0) return
        const loadFile = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) })
        let uploadeds = uploadedThumbs
        uploadeds[videoIndex] = loadFile
        setUploadedThumbs([...uploadeds])
    }

    useEffect(() => {
        if (seekCnt !== null) {
            if (seekCnt >= 0 && seekCnt < 10) {
                let period = bite.videos[videoIndex].duration / 10
                let tempThumbs = thumbs
                let url = getCoverURL()
                tempThumbs[videoIndex].push(url)
                setThumbs(tempThumbs)
                playerRef.current?.seekTo(period * seekCnt)
            }
            if (seekCnt === 10) dispatch({ type: SET_LOADING_FALSE })
        }
    }, [seekCnt])

    return (
        <div className="edit-cover-wrapper">
            <div className="page-header" style={location.state ? { maxWidth: '100%', margin: '25px 20px' } : {}}>
                <div onClick={gotoCreateBite}><BackIcon color="black" /></div>
                <div className="page-title"><span>Edit thumbnail</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="edit-cover">
                <div className="cover-editor">
                    <div className="thumb-editor">
                        <div style={{ display: 'flex', marginLeft: `${-250 * videoIndex}px` }}>
                            {thumbnails[0] &&
                                <AvatarEditor
                                    ref={setEditorRef1}
                                    image={uploadedThumbs[0] ? uploadedThumbs[0].preview : thumbs[0].length > 0 ? thumbs[0][selectedIndexs[0]] : ''}
                                    width={220}
                                    height={aligns[0] ? 389 : 140}
                                    border={aligns[0] ? 15 : [15, 135]}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                            {thumbnails[1] &&
                                <AvatarEditor
                                    ref={setEditorRef2}
                                    image={uploadedThumbs[1] ? uploadedThumbs[1].preview : thumbs[1].length > 0 ? thumbs[1][selectedIndexs[1]] : ''}
                                    width={220}
                                    height={aligns[1] ? 389 : 140}
                                    border={aligns[1] ? 15 : [15, 135]}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                            {thumbnails[2] &&
                                <AvatarEditor
                                    ref={setEditorRef3}
                                    image={uploadedThumbs[2] ? uploadedThumbs[2].preview : thumbs[2].length > 0 ? thumbs[2][selectedIndexs[2]] : ''}
                                    width={220}
                                    height={aligns[2] ? 389 : 140}
                                    border={aligns[2] ? 15 : [15, 135]}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                        </div>
                    </div>
                </div>
                <ReactPlayer
                    hidden
                    id="element"
                    ref={playerRef}
                    url={bite?.videos[videoIndex]?.videoUrl?.preview}
                    onReady={() => {
                        if (thumbs[videoIndex].length === 0) {
                            dispatch({ type: SET_LOADING_TRUE })
                            setSeekCnt(0)
                        }
                    }}
                    onSeek={() => { if (seekCnt <= 10) setSeekCnt((prev: any) => prev + 1) }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px auto 0px auto', width: '320px' }}>
                    <Button
                        text="< Prev"
                        shape="rounded"
                        fillStyle={videoIndex > 0 ? 'fill' : undefined}
                        color="primary"
                        width={videoIndex > 0 ? videoIndex === bite.videos.length - 1 ? '155px' : '100px' : '100px'}
                        handleSubmit={PrevCover}
                    />
                    <Button
                        text="Next >"
                        shape="rounded"
                        color="primary"
                        fillStyle={videoIndex < bite.videos.length - 1 ? 'fill' : undefined}
                        width={videoIndex < bite.videos.length - 1 ? videoIndex === 0 ? '155px' : '100px' : '100px'}
                        handleSubmit={NextCover}
                    />
                </div>
                <div className="cover-images scroll-bar">
                    {thumbs[videoIndex].map((thumb: any, index: any) => (
                        <div className="cover" key={index}>
                            <div
                                className={`cover-item ${selectedIndexs[videoIndex] === index ? 'hover-style' : ''}`}
                                onClick={() => {
                                    let indexes = selectedIndexs
                                    indexes[videoIndex] = index
                                    setSelecteIndexes([...indexes])
                                }}
                            >
                                <img
                                    src={thumb}
                                    alt="coverImage"
                                    width={'100%'}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        text={aligns[videoIndex] ? 'Fit with width' : 'Fit with height'}
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"290px"}
                        icon={aligns[videoIndex] ?
                            [<FitWidthIcon color="white" />, <FitWidthIcon color="white" />, <FitWidthIcon color="white" />] :
                            [<FitHeightIcon color="white" />, <FitHeightIcon color="white" />, <FitHeightIcon color="white" />]
                        }
                        handleSubmit={() => setFit(videoIndex)}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        text="Upload a new thumbnail"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"290px"}
                        icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                        handleSubmit={() => fileInputRef.current?.click()}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={uploadThumbnail}
                        hidden
                        accept="image/*"
                        value=""
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        text="Save all changes"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"290px"}
                        handleSubmit={gotoCreateBite}
                    />
                </div>
            </div>
        </div>
    )
}

export default EditCoverImage