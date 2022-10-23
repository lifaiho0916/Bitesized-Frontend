import { Dispatch } from "redux"
import * as api from "../../api"
import { SET_LOADING_TRUE, SET_LOADING_FALSE, SET_BITES, SET_USERS, SET_DIALOG_STATE, SET_BITE, SET_BITE_INITIAL } from "../types"

export const biteAction = {
    saveBite: (bite: any, navigate: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const config = { headers: { "content-type": "multipart/form-data" } }
            const uploadFuncs: any = []
            bite.videos.forEach((video: any) => {
                const formData = new FormData()
                formData.append("file", video.videoUrl)
                const formData1 = new FormData()
                formData1.append("file", video.coverUrl)
                uploadFuncs.push(api.uploadVideo(formData, config))
                uploadFuncs.push(api.uploadCover(formData1, config))
            })

            const responses: any = await Promise.all(uploadFuncs)
            for (let i = 0; i < bite.videos.length; i++) {
                bite.videos[i].videoUrl = responses[i * 2].data.payload.path
                bite.videos[i].coverUrl = responses[i * 2 + 1].data.payload.path
            }

            const response = await api.CreateBite({ bite: bite })

            const { data } = response
            if (data.success) {
                dispatch({ type: SET_LOADING_FALSE })
                navigate("/")
            }
        } catch (err) {
            dispatch({ type: SET_LOADING_FALSE })
            console.log(err)
        }
    },

    saveBiteByUserId: (bite: any, userId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const config = { headers: { "content-type": "multipart/form-data" } }
            const uploadFuncs: any = []
            bite.videos.forEach((video: any) => {
                const formData = new FormData()
                formData.append("file", video.videoUrl)
                const formData1 = new FormData()
                formData1.append("file", video.coverUrl)
                uploadFuncs.push(api.uploadVideo(formData, config))
                uploadFuncs.push(api.uploadCover(formData1, config))
            })

            const responses: any = await Promise.all(uploadFuncs)
            for (let i = 0; i < bite.videos.length; i++) {
                bite.videos[i].videoUrl = responses[i * 2].data.payload.path
                bite.videos[i].coverUrl = responses[i * 2 + 1].data.payload.path
            }

            const response = await api.CreateBiteByUserId(userId, { bite: bite })

            const { data } = response
            if (data.success) {
                dispatch({ type: SET_LOADING_FALSE })
                navigate("/admin/create-free-bite")
            }
        } catch (err) {
            dispatch({ type: SET_LOADING_FALSE })
            console.log(err)
        }
    },

    getHomeSessions: () => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITE, payload: null })
            dispatch({ type: SET_DIALOG_STATE, payload: "" })
            dispatch({ type: SET_BITES, payload: [] })
            dispatch({ type: SET_USERS, payload: [] })
            const responses = await Promise.all([
                api.getAllBites(),
                api.getOwnersOfBites()
            ])

            dispatch({ type: SET_LOADING_FALSE })
            if (responses[0].data.success && responses[1].data.success) {
                dispatch({ type: SET_BITES, payload: responses[0].data.payload.bites })
                dispatch({ type: SET_USERS, payload: responses[1].data.payload.users })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getProfileSessions: (personalisedUrl: any, userId: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITES, payload: [] })
            dispatch({ type: SET_USERS, payload: [] })
            const responses = await Promise.all([
                api.getBitesByPersonalisedUrl(personalisedUrl, userId),
                api.getUserByPersonalisedUrl(personalisedUrl)
            ])

            dispatch({ type: SET_LOADING_FALSE })
            if (responses[0].data.success && responses[1].data.success) {
                dispatch({ type: SET_BITES, payload: responses[0].data.payload.bites })
                dispatch({ type: SET_USERS, payload: responses[1].data.payload.users })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    unLockBite: (id: any, currency: any, amount: any, token: any) => async (dispatch: Dispatch<any>, getState: any) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            let response: any = null
            if (currency) response = await api.unLockBite(id, { currency: currency, amount: amount, token: token })
            else response = await api.unLockBite(id, {})

            let bites = getState().bite.bites

            dispatch({ type: SET_LOADING_FALSE })
            const { data } = response
            const { payload } = data

            if (data.success) {
                const foundIndex = bites.findIndex((bite: any) => String(bite._id) === String(payload.bite._id))
                bites[foundIndex] = payload.bite
                dispatch({ type: SET_BITES, payload: bites })
                if (currency === null) dispatch({ type: SET_DIALOG_STATE, payload: 'unlock_free' })
            } else {
                console.log(payload)
            }

        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getBitesList: () => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_BITES, payload: [] })
            const response = await api.getBitesList()
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
            const response = await api.getAllBites()
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
}