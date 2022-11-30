import { Dispatch } from "redux"
import * as api from "../../api"
import { SET_LOADING_FALSE, SET_LOADING_TRUE, SET_SUBSCRIPTION, SET_DIALOG_STATE, SET_SUBSCRIBERS, SET_TOTAL_SUBSCRIBERS } from "../types"

export const subScriptionAction = {
    getSubScription: (userId: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({
                type: SET_SUBSCRIPTION,
                payload: null
            })
            const response = await api.getSubScription(userId)
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({
                    type: SET_SUBSCRIPTION,
                    payload: payload.subScription
                })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    saveSubscription: (subscription: any, navigate: any, url: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.saveSubScription({ subScription: subscription })
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) navigate(url)
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    editSubscription: (planId: any, subscription: any, navigate: any, url: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.editSubScription(planId, { subScription: subscription })
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) navigate(url)
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    deleteSubScription: (planId: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.deleteSubScription(planId)
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                dispatch({
                    type: SET_SUBSCRIPTION,
                    payload: null
                })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    setSubScriptionVisible: (planId: any, visible: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.setSubScriptionVisible(planId, { visible: visible })
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({
                    type: SET_SUBSCRIPTION,
                    payload: payload.subScription
                })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    subscribePlan: (planId: any, currency: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.subscribePlan(planId, { currency: currency })
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if(data.success) {
                const { payload } = data
                dispatch({ type: SET_DIALOG_STATE, payload: 'subscribed' })
                dispatch({
                    type: SET_SUBSCRIPTION,
                    payload: payload.subScription
                })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    getSubscribersByUserId: (sort: any, currentPage: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_SUBSCRIBERS, payload: [] })
            const response = await api.getSubscribersByUserId(sort, currentPage)
            const { data } = response
            if(data.success) {
                const { payload } = data
                dispatch({ type: SET_SUBSCRIBERS, payload: payload.subscribers })
                dispatch({ type: SET_TOTAL_SUBSCRIBERS, payload: payload.total })
            }
        } catch (err) {
            console.log(err)
        }
    },

    unSubscribe: (id: any) => async (dispatch: Dispatch<any>, getState: any) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.unSubscribe({ id: id })
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if(data.success) {
                const { payload } = data
                const scribers = getState().subScription.subscribers;
                let resScribers = scribers.map((scriber: any) => {
                    if(String(scriber._id) === String(payload.subscriber._id)) return payload.subscriber
                    else return scriber
                })
                dispatch({ type: SET_SUBSCRIBERS, payload: resScribers })
                dispatch({ type: SET_DIALOG_STATE, payload: 'unsubscribed' })
            }
        } catch (err) {
            console.log(err)
        }
    }
}