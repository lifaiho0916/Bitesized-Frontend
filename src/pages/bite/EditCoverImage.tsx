import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import AvatarEditor from 'react-avatar-editor'
import Button from "../../components/general/button"
import { AddIcon, BackIcon, FitHeightIcon, FitWidthIcon } from "../../assets/svg"
import { SET_BITE } from "../../redux/types"
import "../../assets/styles/bite/EditCoverStyle.scss"

const EditCoverImage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const loadState = useSelector((state: any) => state.load)
    const biteState = useSelector((state: any) => state.bite)
    const { prevRoute } = loadState
    const { bite, thumbnails } = biteState
    const [aligns, setAligns] = useState<any>([true, true, true])
    const [videoIndex, setVideoIndex] = useState(0)
    let imageEditor1: any = null
    let imageEditor2: any = null
    let imageEditor3: any = null

    const NextCover = async () => { if (videoIndex < bite.videos.length - 1) setVideoIndex((index) => index + 1) }
    const PrevCover = async () => { if (videoIndex > 0) setVideoIndex((index) => index - 1) }

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
                                    image={thumbnails[0]?.preview}
                                    width={220}
                                    height={aligns[0] ? 389 : 165}
                                    border={aligns[0] ? 15 : [15, 125]}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                            {thumbnails[1] &&
                                <AvatarEditor
                                    ref={setEditorRef2}
                                    image={thumbnails[1]?.preview}
                                    width={220}
                                    height={aligns[1] ? 389 : 165}
                                    border={aligns[1] ? 15 : [15, 125]}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                            {thumbnails[2] &&
                                <AvatarEditor
                                    ref={setEditorRef3}
                                    image={thumbnails[2]?.preview}
                                    width={220}
                                    height={aligns[2] ? 389 : 165}
                                    border={aligns[2] ? 15 : [15, 125]}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                        </div>
                    </div>
                </div>
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
                        handleSubmit={() => { }}
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