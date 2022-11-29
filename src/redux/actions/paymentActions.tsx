import { Dispatch } from "redux"
import * as api from "../../api"
import { SET_LOADING_FALSE, SET_LOADING_TRUE, SET_PAYMENT } from "../types"

export const paymentAction = {
    getPayment: () => async (dispatch: Dispatch<any>) => {
        try {
            const response = await api.getPayment()
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({
                    type: SET_PAYMENT,
                    payload: payload.payment.length === 0 ? null : payload.payment[0]
                })
            }
        } catch (err) {
            console.log(err)
        }
    },

    addCard: (token: any, holder: any, cardType: any) => async (dispatch: Dispatch<any>) => {
        try {
            const response = await api.addCard({ token: token, holder: holder, cardType: cardType })
            const { data } = response
            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_PAYMENT, payload: payload.payment })
            }
        } catch (err: any) {
            const { response } = err
            console.log(response.data.msg)
            dispatch({ type: SET_LOADING_FALSE })
        }
    },

    deleteCard: () => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            const response = await api.deleteCard()
            dispatch({ type: SET_LOADING_FALSE })
            const { data } = response
            if (data.success) dispatch({ type: SET_PAYMENT, payload: null })
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    }
}