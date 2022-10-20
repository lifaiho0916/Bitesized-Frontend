import { Dispatch } from "redux"
import * as api from '../../api'
import { SET_LOADING_FALSE, SET_LOADING_TRUE, SET_TRANSACTIONS } from "../types"

export const transactionAction = {
    getTransactions: (type: any, search: any, userId: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_TRANSACTIONS, payload: [] })
            const response = await api.getTransactions({ type: type, search: search, userId: userId })
            const { data } = response

            dispatch({ type: SET_LOADING_FALSE })
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_TRANSACTIONS, payload: payload.transactions })
            }
        } catch (err) {
            console.log(err)
            dispatch({ type: SET_LOADING_FALSE })
        }
    }
}