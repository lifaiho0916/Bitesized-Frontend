import { Dispatch } from "redux"
import * as api from "../../api"
import { SET_PAYMENT } from "../types"

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
    }
}