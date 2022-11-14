import { Dispatch } from "redux"
import * as api from "../../api"
import { SET_LOADING_FALSE, SET_LOADING_TRUE, SET_TERMS_AND_PRIVACY } from "../types"

export const settingAction = {
    getTermsAndPrivacy: () => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.getTermsAndPrivacy()
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_LOADING_FALSE })
                dispatch({
                    type: SET_TERMS_AND_PRIVACY,
                    payload: payload.termsAndPrivacy
                })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    saveTermAndPrivacy: (termsAndPrivacy: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.saveTermsAndPrivacy({ termsAndPrivacy: termsAndPrivacy })
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_LOADING_FALSE })
                dispatch({
                    type: SET_TERMS_AND_PRIVACY,
                    payload: payload.termsAndPrivacy
                })
            }
        } catch (err) {

            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    }
}