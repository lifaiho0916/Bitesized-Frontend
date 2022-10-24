import * as actionTypes from '../types'

const INITIAL_STATE: any = {
    user: null,
    users: [],
    nameExist: false,
    urlExist: false,
    lang: 'EN',
    profile: {
        category: [],
        avatar: null,
        name: null,
        personalisedUrl: null,
        bioText: null,
        subscribe: null
    }
}

const authReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: payload
            }
        case actionTypes.SET_USERS:
            return {
                ...state,
                users: payload
            }
        case actionTypes.SET_PROFILE:
            return {
                ...state,
                profile: payload
            }
        case actionTypes.SET_NAME_EXIST:
            return {
                ...state,
                nameExist: payload,
            }
        case actionTypes.SET_URL_EXIST:
            return {
                ...state,
                urlExist: payload
            }
        case actionTypes.SET_LANGUAGE:
            return {
                ...state,
                lang: payload
            }
        case actionTypes.SET_USER_INITIAL: {
            return {
                user: null,
                users: [],
                nameExist: false,
                urlExist: false,
                stripeID: null,
                cardNum: null,
                lang: 'EN',
                profile: {
                    category: [],
                    avatar: null,
                    name: null,
                    personalisedUrl: null,
                    bioText: null,
                    subscribe: null
                }
            }
        }
        default:
            return state;
    }
};

export default authReducer;