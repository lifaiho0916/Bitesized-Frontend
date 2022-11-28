import { Dispatch } from "redux"
import * as api from "../../api"
import { SET_LOADING_FALSE, SET_LOADING_TRUE, SET_SUBSCRIPTION } from "../types"

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
                dispatch({
                    type: SET_SUBSCRIPTION,
                    payload: payload.subScription
                })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    }
}