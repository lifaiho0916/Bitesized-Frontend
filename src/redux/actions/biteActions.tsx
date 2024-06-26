import { Dispatch } from "redux"
import * as api from "../../api"
import { SET_LOADING_TRUE, SET_LOADING_FALSE, SET_BITES, SET_DIALOG_STATE, SET_BITE, SET_BITE_INITIAL, SET_UPLOADED_PROCESS, SET_UPLOADING, SET_SEARCH_RESULTS } from "../types"

export const biteAction = {
    getSearchResult: (search: any) => async (dispatch: Dispatch<any>) => {
        try {
            const response = await api.searchResult(search)
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_SEARCH_RESULTS, payload: payload.result })
            }
        } catch (err) {
            console.log(err)
        }
    },

    saveBite: (bite: any, personalisedUrl: any, navigate: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_UPLOADING, payload: true })
            let uploadFiles: any = []
            let cnt = 0

            bite.videos.forEach((video: any) => {
                uploadFiles.push(video.coverUrl)
                uploadFiles.push(video.videoUrl)
            })

            uploadFiles.forEach(async (file: any, index: any) => {
                const formData = new FormData()
                formData.append("file", file)
                if (index % 2 === 0) {
                    const response = await api.uploadCover(formData, {
                        headers: { "content-type": "multipart/form-data" }
                    })
                    const { data } = response
                    const { payload } = data
                    bite.videos[index / 2].coverUrl = payload.path
                    cnt++
                    if (cnt === (bite.videos.length * 2)) {
                        const response1 = await api.CreateBite({ bite: bite })
                        if (response1.data.success) {
                            dispatch({ type: SET_UPLOADING, payload: false })
                            navigate(`/${personalisedUrl}?tab=mybites`)
                        }
                    }
                } else {
                    const response = await api.uploadVideo(formData, {
                        headers: { "content-type": "multipart/form-data" },
                        onUploadProgress: (progress: any) => {
                            const { loaded, total } = progress
                            const percentageProgress = Math.floor((loaded / total) * 100)
                            dispatch({ type: SET_UPLOADED_PROCESS, payload: { index: Math.floor(index / 2), percent: percentageProgress } })
                        }
                    })
                    const { data } = response
                    const { payload } = data
                    bite.videos[Math.floor(index / 2)].videoUrl = payload.path
                    cnt++
                    if (cnt === (bite.videos.length * 2)) {
                        const response1 = await api.CreateBite({ bite: bite })
                        if (response1.data.success) {
                            dispatch({ type: SET_UPLOADING, payload: false })
                            navigate(`/${personalisedUrl}?tab=mybites`)
                        }
                    }
                }
            })
        } catch (err) {
            dispatch({ type: SET_LOADING_FALSE })
            console.log(err)
        }
    },

    editBite: (bite: any, navigate: any) => async (dispatch: Dispatch<any>) => {
        try {
            let uploadFiles: any = []
            let cnt = 0
            let len = 0

            bite.videos.forEach((video: any, index: any) => {
                if (typeof video.coverUrl === "object") {
                    uploadFiles.push({
                        index: index,
                        type: 'image',
                        file: video.coverUrl
                    })
                    len++
                }
                if (typeof video.videoUrl === "object") {
                    uploadFiles.push({
                        index: index,
                        type: 'video',
                        file: video.videoUrl
                    })
                    len++
                }
            })

            if (uploadFiles.length) {
                dispatch({ type: SET_UPLOADING, payload: true })
                uploadFiles.forEach(async (upload: any, index: any) => {
                    const formData = new FormData()
                    formData.append("file", upload.file)
                    if (upload.type === 'image') {
                        const response = await api.uploadCover(formData, {
                            headers: { "content-type": "multipart/form-data" }
                        })
                        const { data } = response
                        const { payload } = data
                        bite.videos[upload.index].coverUrl = payload.path
                        cnt++
                        if (cnt === len) {
                            const response1 = await api.UpdateBite(bite._id, { bite: bite })
                            if (response1.data.success) {
                                dispatch({ type: SET_UPLOADING, payload: false })
                                navigate('/admin/edit-bite')
                            }
                        }
                    } else {
                        const response = await api.uploadVideo(formData, {
                            headers: { "content-type": "multipart/form-data" },
                            onUploadProgress: (progress: any) => {
                                const { loaded, total } = progress
                                const percentageProgress = Math.floor((loaded / total) * 100)
                                dispatch({ type: SET_UPLOADED_PROCESS, payload: { index: Math.floor(index / 2), percent: percentageProgress } })
                            }
                        })
                        const { data } = response
                        const { payload } = data
                        bite.videos[upload.index].videoUrl = payload.path
                        cnt++
                        if (cnt === len) {
                            const response1 = await api.UpdateBite(bite._id, { bite: bite })
                            if (response1.data.success) {
                                dispatch({ type: SET_UPLOADING, payload: false })
                                navigate('/admin/edit-bite')
                            }
                        }
                    }
                })
            } else {
                dispatch({ type: SET_LOADING_TRUE })
                const response1 = await api.UpdateBite(bite._id, { bite: bite })
                if (response1.data.success) {
                    dispatch({ type: SET_LOADING_FALSE })
                    navigate('/admin/edit-bite')
                }
            }

        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
            dispatch({ type: SET_UPLOADING, payload: false })
        }
    },

    saveBiteByUserId: (bite: any, userId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_UPLOADING, payload: true })
            let uploadFiles: any = []
            let cnt = 0

            bite.videos.forEach((video: any) => {
                uploadFiles.push(video.coverUrl)
                uploadFiles.push(video.videoUrl)
            })

            uploadFiles.forEach(async (file: any, index: any) => {
                const formData = new FormData()
                formData.append("file", file)
                if (index % 2 === 0) {
                    const response = await api.uploadCover(formData, {
                        headers: { "content-type": "multipart/form-data" }
                    })
                    const { data } = response
                    const { payload } = data
                    bite.videos[index / 2].coverUrl = payload.path
                    cnt++
                    if (cnt === (bite.videos.length * 2)) {
                        const response1 = await api.CreateBiteByUserId(userId, { bite: bite })
                        if (response1.data.success) {
                            dispatch({ type: SET_UPLOADING, payload: false })
                            navigate("/admin/create-bite")
                        }
                    }
                } else {
                    const response = await api.uploadVideo(formData, {
                        headers: { "content-type": "multipart/form-data" },
                        onUploadProgress: (progress: any) => {
                            const { loaded, total } = progress
                            const percentageProgress = Math.floor((loaded / total) * 100)
                            dispatch({ type: SET_UPLOADED_PROCESS, payload: { index: Math.floor(index / 2), percent: percentageProgress } })
                        }
                    })
                    const { data } = response
                    const { payload } = data
                    bite.videos[Math.floor(index / 2)].videoUrl = payload.path
                    cnt++
                    if (cnt === (bite.videos.length * 2)) {
                        const response1 = await api.CreateBiteByUserId(userId, { bite: bite })
                        if (response1.data.success) {
                            dispatch({ type: SET_UPLOADING, payload: false })
                            navigate("/admin/create-bite")
                        }
                    }
                }
            })
        } catch (err) {
            dispatch({ type: SET_LOADING_FALSE })
            console.log(err)
        }
    },

    getBitesFromHome: (filter: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITES, payload: [] })
            const response = await api.getAllBites(filter)
            dispatch({ type: SET_LOADING_FALSE })
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITES, payload: payload.bites })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getBitesByPersonalisedUrl: (url: any, userId: any, tab: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_BITES, payload: [] })
            const response = await api.getBitesByPersonalisedUrl(url, userId, tab)
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITES, payload: payload.bites })
            }
        } catch (err) {
            console.log(err)
        }
    },

    unLockBite: (id: any, currency: any, amount: any, token: any, saveCheck: any, holder: any, cardType: any, subscribe: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            let response: any = null
            if (currency) response = await api.unLockBite(id, { currency: currency, amount: amount, token: token, saveCheck: saveCheck, holder: holder, cardType: cardType, subscribe: subscribe })
            else response = await api.unLockBite(id, {})

            dispatch({ type: SET_LOADING_FALSE })
            const { data } = response
            const { payload } = data

            if (data.success) {
                dispatch({ type: SET_BITE, payload: payload.bite })
                dispatch({ type: SET_DIALOG_STATE, payload: 'unlock_bite' })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getBitesList: (categories: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITES, payload: [] })
            const response = await api.getBitesList(categories)
            const { data } = response

            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITES, payload: payload.bites })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getAllBites: () => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITE_INITIAL })
            const response = await api.getAllBites(0)
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITES, payload: payload.bites })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getBiteById: (biteId: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITE_INITIAL })
            const response = await api.getBiteById(biteId)
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITE, payload: payload.bite })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    changeVisible: (id: any, visible: any) => async (dispatch: Dispatch<any>, getState: any) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.changeBiteVisible(id, { visible: visible })
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                let bite = getState().bite.bite
                bite.visible = visible
                dispatch({ type: SET_BITE, payload: bite })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getBitesAdmin: (type: any, search: any, sort: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITE_INITIAL })
            const response = await api.getBitesAdmin(type === null ? 'all' : type, search, sort)
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITES, payload: payload.bites })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getBitesSortByCommentAdmin: (type: any, search: any, sort: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITE_INITIAL })
            const response = await api.getBitesSortByCommentAdmin(type === null ? 'all' : type, search, sort)
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITES, payload: payload.bites })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    deleteBite: (id: any, navigate: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.deleteBite(id)
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) navigate('/admin/edit-bite')
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    removeVideoFromBite: (id: any, index: any) => async (dispatch: Dispatch<any>, getState: any) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.removeVideoFromBite(id, index)
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                let bite = getState().bite.bite
                const videos = bite.videos.filter((video: any, i: any) => i !== index)
                dispatch({ type: SET_BITE, payload: { ...bite, videos: videos } })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    changeVideoVisible: (id: any, index: any, visible: any) => async (dispatch: Dispatch<any>, getState: any) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.changeVideoVisible(id, index, { visible: visible })
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                let bite = getState().bite.bite
                bite.videos[index].visible = visible
                dispatch({ type: SET_BITE, payload: bite })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getBitesByUserIdAndCategory: (userId: any, biteId: any) => async (dispatch: Dispatch<any>) => {
        try {
            const response = await api.getBitesByUserIdAndCategory(userId, biteId)
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITES, payload: payload.bites })
            }
        } catch (err) {
            console.log(err)
        }
    },

    sendComment: (biteId: any, comment: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.sendComment(biteId, { comment: comment })
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITE, payload: payload.bite })
            }
            dispatch({ type: SET_LOADING_FALSE })
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    deleteComment: (biteId: any, index: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.deleteComment(biteId, index)
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_BITE, payload: payload.bite })
            }
            dispatch({ type: SET_LOADING_FALSE })
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    clearCommentNotification: (biteId: any) => async (dispatch: Dispatch<any>) => {
        try {
            await api.clearCommentNotification(biteId)
        } catch (err) {
            console.log(err)
        }
    }
}