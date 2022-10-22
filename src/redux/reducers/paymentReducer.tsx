import * as actionTypes from '../types'

const INITIAL_STATE: any = {
    payment: null
}

const paymentReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action

    switch (action.type) {
        case actionTypes.SET_PAYMENT:
            return {
                ...state,
                payment: payload
            }
        case actionTypes.SET_PAYMENT_INITIAL:
            return {
                payment: null
            }
        default:
            return state
    }
}

export default paymentReducer