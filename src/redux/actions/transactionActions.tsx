import { Dispatch } from "redux"
import * as api from '../../api'
import { SET_LOADING_FALSE, SET_LOADING_TRUE, SET_TRANSACTIONS } from "../types"

export const transactionAction = {
    getTransactions: (type: any, search: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_LOADING_TRUE })
            dispatch({ type: SET_TRANSACTIONS, payload: [] })
            const response = await api.getTransactions(type, search)
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
    },

    getTransactionsByBiteId: (biteId: any, sort: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_TRANSACTIONS, payload: [] })
            const response = await api.getTransactionsByBiteId(biteId, sort)
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_TRANSACTIONS, payload: payload.transactions })
            }
        } catch (err) {
            console.log(err)
        }
    },

    getTransactionsByUserId: (userId: any, type: any, sort: any) => async (dispatch: Dispatch<any>) => {
        try {
            dispatch({ type: SET_TRANSACTIONS, payload: [] })
            const response = await api.getTransactionsByUserId(userId, type, sort)
            const { data } = response
            if (data.success) {
                const { payload } = data
                dispatch({ type: SET_TRANSACTIONS, payload: payload.transactions })
            }
        } catch (err) {
            console.log(err)
        }
    }
}