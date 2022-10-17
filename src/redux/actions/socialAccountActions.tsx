import { Dispatch } from 'redux'
import * as api from '../../api'
import {
    ADD_SOCIAL_ACCOUNTS,
    DELETE_SOCIAL_ACCOUNTS,
    GET_SOCIAL_ACCOUNTS,
} from '../types'
export const accountAction = {
    getAccounts: (userId: any) => async (dispatch: Dispatch<any>) => {
        try {
            const response = await api.getSocialAccount(userId)
            dispatch({ type: GET_SOCIAL_ACCOUNTS, payload: response.data.data })
        } catch (error) {
            console.log(error);
        }
    },
    addAccount:
        (data: any, cb: Function = () => { }) =>
            async (dispatch: Dispatch<any>) => {
                try {
                    const response = await api.addSocialAccount(data)
                    dispatch({ type: ADD_SOCIAL_ACCOUNTS, payload: response.data.data })
                    cb(true)
                } catch (error) {
                    cb(false)
                    console.log(error)
                }
            },
    removeAccount: (id: any) => async (dispatch: Dispatch<any>) => {
        try {
            await api.removeSocialAccount(id)
            dispatch({ type: DELETE_SOCIAL_ACCOUNTS, payload: id })
        } catch (error) {
            console.log(error)
        }
    },
};
