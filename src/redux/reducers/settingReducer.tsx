import * as actionTypes from '../types'

const INITIAL_STATE: any = {
    termsAndPrivacy: null
}

const settingRedcuer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_TERMS_AND_PRIVACY:
            return {
                ...state,
                termsAndPrivacy: payload
            }
        default:
            return state;
    }
};

export default settingRedcuer;