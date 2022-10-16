import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import AvatarEditor from 'react-avatar-editor'
import Button from "../../components/general/button"
import { BackIcon } from "../../assets/svg"
import NextBtn from "../../assets/img/next-grey.png"
import { SET_BITE } from "../../redux/types"
import "../../assets/styles/bite/EditCoverStyle.scss"

const EditCoverImage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const loadState = useSelector((state: any) => state.load)
    const biteState = useSelector((state: any) => state.bite)
    const { prevRoute } = loadState
    const { bite, thumbnails } = biteState
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
        navigate(prevRoute)
    }

    const setEditorRef1 = (editor: any) => (imageEditor1 = editor)
    const setEditorRef2 = (editor: any) => (imageEditor2 = editor)
    const setEditorRef3 = (editor: any) => (imageEditor3 = editor)


    return (
        <div className="edit-cover-wrapper">
            <div className="page-header">
                <div onClick={gotoCreateBite}><BackIcon color="black" /></div>
                <div className="page-title"><span>Edit thumbnail</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <div className="edit-cover">
                <div className="cover-editor">
                    <div className="next-prev-btn"
                        style={{ transform: 'rotate(180deg)' }}
                        onClick={PrevCover}
                    >
                        {videoIndex > 0 ?
                            <img src={NextBtn} alt="Prev" />
                            :
                            <div style={{ width: '23px' }}></div>
                        }
                    </div>
                    <div className="thumb-editor">
                        <div style={{ display: 'flex', marginLeft: `${-250 * videoIndex}px` }}>
                            {thumbnails[0] &&
                                <AvatarEditor
                                    ref={setEditorRef1}
                                    image={thumbnails[0]?.preview}
                                    width={220}
                                    height={389}
                                    border={15}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                            {thumbnails[1] &&
                                <AvatarEditor
                                    ref={setEditorRef2}
                                    image={thumbnails[1]?.preview}
                                    width={220}
                                    height={389}
                                    border={15}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                            {thumbnails[2] &&
                                <AvatarEditor
                                    ref={setEditorRef3}
                                    image={thumbnails[2]?.preview}
                                    width={220}
                                    height={389}
                                    border={15}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={1.0}
                                />
                            }
                        </div>
                    </div>
                    <div className="next-prev-btn" onClick={NextCover}>
                        {videoIndex < bite.videos.length - 1 ?
                            <img src={NextBtn} alt="Next" />
                            :
                            <div style={{ width: '23px' }}></div>
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        text="Save"
                        fillStyle="fill"
                        color="primary"
                        shape="rounded"
                        width={"220px"}
                        handleSubmit={gotoCreateBite}
                    />
                </div>
            </div>
        </div>
    )
}

export default EditCoverImage