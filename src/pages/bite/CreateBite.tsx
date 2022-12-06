import { useEffect, useState, useLayoutEffect, useRef, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ReactPlayer from "react-player"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Input from "../../components/general/input"
import TeaserCardPopUp from "../../components/general/TeaserCardPopUp"
import CurrencySelect from "../../components/stripe/CurrencySelect"
import ContainerBtn from "../../components/general/containerBtn"
import Dialog from "../../components/general/dialog"
import Select from "../../components/general/select"
import Button from "../../components/general/button"
import PublishBiteModal from "../../components/modals/PublishBiteModal"
import { AddIcon, BackIcon, PlayIcon, RemoveIcon, DragHandleIcon } from "../../assets/svg"
import { biteAction } from "../../redux/actions/biteActions"
import { SET_BITE, SET_PREVIOUS_ROUTE, SET_SELECTED_INDEXES, SET_VIDEO_ALIGNS } from "../../redux/types"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/bite/CreateBiteStyle.scss"

const useWindowSize = () => {
    const [size, setSize] = useState(0)
    useLayoutEffect(() => {
        const updateSize = () => { setSize(window.innerWidth) }
        window.addEventListener("resize", updateSize)
        updateSize()
        return () => window.removeEventListener("resize", updateSize)
    }, [])
    return size
}

const reOrder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

const CreateBite = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const fileInputRef = useRef<HTMLInputElement>(null)
    const biteState = useSelector((state: any) => state.bite)
    const userState = useSelector((state: any) => state.auth)
    const { bite, selectedIndexs, aligns } = biteState
    const { user } = userState

    const [title, setTitle] = useState(bite.title ? bite.title : '')
    const [price, setPrice] = useState(bite.price ? bite.price : '')
    const [currency, setCurrency] = useState(0)
    const [category, setCategory] = useState(0)
    const [videoIndex, setVideoIndex] = useState(-1)
    const [free, setFree] = useState(false)

    const width = useWindowSize()
    const [play, setPlay] = useState(false)

    const [openVideoPopup, setOpenVideoPopUp] = useState(false)
    const [openQuit, setOpenQuit] = useState(false)
    const [openPublish, setOpenPublish] = useState(false)

    const publish = () => {
        if (!publishEnable) return
        setOpenPublish(true)
    }
    const publishBite = () => {
        setOpenPublish(false)
        const newBite = free ? {
            ...bite,
            title: title,
            category: category
        } : {
            ...bite,
            title: title,
            price: price,
            category: category,
            currency: (CONSTANT.CURRENCIES[currency]).toLowerCase()
        }
        dispatch(biteAction.saveBite(newBite, user.personalisedUrl, navigate))
    }
    const displayDuration = (duration: any) => { return Math.floor(duration / 60) + ":" + (Math.round(duration % 60) < 10 ? '0' : '') + Math.round(duration % 60) }
    const popUpTeaser = (index: any) => {
        setVideoIndex(index)
        setOpenVideoPopUp(true)
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
                    duration: video.duration
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
        const newBite = free ? {
            ...bite,
            title: title,
        } : {
            ...bite,
            title: title,
            price: price,
            currency: (CONSTANT.CURRENCIES[currency]).toLowerCase()
        }
        dispatch({ type: SET_BITE, payload: newBite })
        dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname })
        navigate('/bite/create/edit-thumbnail')
    }
    const removeVideo = (index: any) => {
        let videos = bite.videos.filter((video: any, i: any) => i !== index)
        let tempAligns = aligns.filter((align: any, i: any) => i !== index)
        tempAligns.push(true)
        let indexes = selectedIndexs.filter((ind: any, i: any) => i !== index)
        indexes.push(0)
        dispatch({ type: SET_VIDEO_ALIGNS, payload: tempAligns })
        dispatch({ type: SET_SELECTED_INDEXES, payload: indexes })
        dispatch({ type: SET_BITE, payload: { ...bite, videos: videos } })
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

    const publishEnable = useMemo(() => {
        if (title === "" || bite.videos.length === 0) return false
        if (!free && (price === "" || Number(price) === 0)) return false
        return true
    }, [title, price, bite, free])

    useEffect(() => { setFree(location.pathname.substring(location.pathname.length - 4) === 'free') }, [location])

    const getItemStyle = (isDragging: any, draggableStyle: any) => ({
        userSelect: 'none',
        background: isDragging ? '#FFC88F' : '#FFFFFF',
        ...draggableStyle,
    })

    useEffect(() => {
        if(user) {
            CONSTANT.CURRENCIES.forEach((cur: any, index: any) => {
                if(cur.toLowerCase() === user.currency) setCurrency(index)
            })
        }
    }, [user])

    return (
        <div className="create-bite-wrapper">
            <div className="page-header">
                <div onClick={() => setOpenQuit(true)}><BackIcon color="black" /></div>
                <div className="page-title"><span>Posting on Bite</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <TeaserCardPopUp
                display={openVideoPopup}
                exit={() => {
                    setOpenVideoPopUp(false)
                    setVideoIndex(-1)
                }}
                teaser={(bite.videos.length === 0 || videoIndex === -1) ? "" : bite.videos[videoIndex].videoUrl.preview ? bite.videos[videoIndex].videoUrl.preview : bite.videos[videoIndex].videoUrl}
            />
            <Dialog
                display={openQuit}
                wrapExit={() => setOpenQuit(false)}
                title="Quit?"
                context="Your draft will not be saved."
                buttons={[
                    {
                        text: 'Quit',
                        handleClick: () => navigate('/bite/create-type')
                    },
                    {
                        text: 'Cancel',
                        handleClick: () => setOpenQuit(false)
                    }
                ]}
            />
            <PublishBiteModal
                show={openPublish}
                onClose={() => setOpenPublish(false)}
                handleSubmit={publishBite}
            />
            <div className="create-bite">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided, snapshot) => (
                            <div className="uploaded-vidoes"
                                ref={provided.innerRef}
                                style={{ height: bite.videos.length === 0 ? '0px' : width > 880 ? '460px' : '200px' }}
                                {...provided.droppableProps}
                            >
                                {bite.videos.map((video: any, index: any) => (
                                    <Draggable key={video.id} draggableId={video.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div className="uploaded-video"
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
                                                                    if (width > 880) {
                                                                        setVideoIndex(index)
                                                                        setPlay(true)
                                                                    } else popUpTeaser(index)
                                                                }}>
                                                                    <PlayIcon color="white" width={width < 880 ? '18' : '28'} height={width < 880 ? '18' : '28'} />
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
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: width < 880 ? '8px' : '16px' }}>
                                                        <DragHandleIcon width={width < 880 ? '' : 30} height={width < 880 ? '' : 10} color={snapshot.isDragging ? "#EA8426" : "#BAB6B5"} />
                                                    </div>
                                                </div>
                                                <div className="bin-btn" onClick={() => removeVideo(index)}>
                                                    <RemoveIcon color="white" width={30} height={30} />
                                                </div>
                                                {(width < 880 || index !== videoIndex) &&
                                                    <div className="time-duration">
                                                        <span>{displayDuration(video.duration)}</span>
                                                    </div>
                                                }
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <div className="upload-edit-btns">
                    {bite.videos.length > 0 &&
                        <div className="upload-btn">
                            <Button
                                text="Edit thumbnail"
                                width={280}
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
                                width={280}
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
                            onReady={() => { if (video.coverUrl === null) setTimeout(() => getFirstFrame(index), 500) }}
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
                        placeholder="Tell the story..."
                        title={title}
                        setTitle={setTitle}
                    />
                </div>

                <div className="first-divider"></div>
                <div className="session-title">
                    <span>Category</span>
                </div>
                <div className="currency-selection">
                    <Select
                        width={'100%'}
                        option={category}
                        setOption={setCategory}
                        options={CONSTANT.BITE_CATEGORIES}
                    />
                </div>
                

                {!free &&
                    <div>
                        <div className="second-divider"></div>
                        <div className="session-title">
                            <span> $ Price to unlock</span>
                        </div>
                        <div className="session-input">
                            <Input
                                type="input"
                                isNumber={true}
                                width={'100%'}
                                minnum={0}
                                maxnum={100000000000000}
                                step={0.1}
                                placeholder="$1 USD is ideal for bite-size!"
                                title={price}
                                setTitle={setPrice}
                            />
                        </div>

                        <div className="third-divider"></div>
                        <div className="currency-selection">
                            <CurrencySelect
                                width={'100%'}
                                option={currency}
                                setOption={setCurrency}
                                options={CONSTANT.DISPLAY_CURRENCIES}
                            />
                        </div>

                        <div className="firth-divider"></div>
                        <div className="currency-description">
                            <span>(We will convert your price in USD as default)</span>
                        </div>
                    </div>
                }

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
        </div >
    )
}

export default CreateBite