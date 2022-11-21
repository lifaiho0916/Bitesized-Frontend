import { Dispatch } from "redux"
import * as api from "../../api"
import { SET_LOADING_FALSE, SET_LOADING_TRUE, SET_SUBSCRIPTION } from "../types"

export const subScriptionAction = {
    getSubScription: (userId: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
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
}