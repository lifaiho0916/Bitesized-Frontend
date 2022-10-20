import * as actionTypes from '../types'

const INITIAL_STATE: any = {
    transactions: []
}

const transactionReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_TRANSACTIONS:
            return { 
                ...state, 
                transactions: payload 
            }
        default:
            return state;
    }
};

export default transactionReducer