import * as actionTypes from '../types'

const INITIAL_STATE: any = {
    user: null,
    users: [],
    nameExist: false,
    urlExist: false,
    stripeID: null,
    cardNum: null,
    lang: 'CH',
    payment: null,
    profile: {
        category: [],
        avatar: null,
        name: null,
        personalisedUrl: null,
        bioText: null,
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
                urlExit: payload
            }
        case actionTypes.SET_STRIPEID:
            state.stripeID = payload.stripeID;
            state.cardNum = payload.cardNum;
            return { ...state };
        case actionTypes.SET_LANGUAGE:
            state.lang = payload;
            return { ...state };
        case actionTypes.SET_PAYMENT:
            state.payment = payload
            return { ...state }
        case actionTypes.SET_USER_INITIAL: {
            return {
                user: null,
                users: [],
                nameExist: false,
                urlExist: false,
                stripeID: null,
                cardNum: null,
                lang: 'CH',
                payment: null,
                profile: {
                    category: [],
                    avatar: null,
                    name: null,
                    personalisedUrl: null,
                    bioText: null,
                }
            }
        }
        default:
            return state;
    }
};

export default authReducer;