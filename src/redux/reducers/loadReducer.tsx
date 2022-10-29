import * as actionTypes from '../types'

const INITIAL_STATE: any = {
    loading: false,
    uploading: false,
    prevRoute: "/",
    dlgState: "",
    currencyRate: null,
    uploadProcess: [0, 0, 0]
}

const loadRedcuer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_LOADING_TRUE:
            return {
                ...state,
                loading: true
            }
        case actionTypes.SET_LOADING_FALSE:
            return {
                ...state,
                loading: false
            }
        case actionTypes.SET_PREVIOUS_ROUTE:
            return {
                ...state,
                prevRoute: payload
            }
        case actionTypes.SET_DIALOG_STATE:
            return {
                ...state,
                dlgState: payload
            }
        case actionTypes.SET_CURRENCY_RATE:
            return {
                ...state,
                currencyRate: payload
            }
        case actionTypes.SET_UPLOADED_PROCESS:
            const { index, percent } = payload
            let stateTemp = [...state.uploadProcess]
            stateTemp[index] = percent

            return {
                ...state,
                uploadProcess: [...stateTemp]
            }
        case actionTypes.SET_UPLOADING:
            return {
                ...state,
                uploading: payload
            }
        default:
            return state;
    }
};

export default loadRedcuer;