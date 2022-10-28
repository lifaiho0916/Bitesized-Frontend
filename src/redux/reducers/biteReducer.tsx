import * as actionTypes from '../types'

const INITIAL_STATE: any = {
    bite: {
        title: null,
        price: null,
        currency: null,
        videos: []
    },
    bites: [],
    thumbnails: [[], [], []],
    selectedIndexs: [0, 0, 0],
    aligns: [true, true, true]
}

const biteReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action

    switch (action.type) {
        case actionTypes.SET_BITE:
            return {
                ...state,
                bite: payload
            }
        case actionTypes.SET_BITES:
            return {
                ...state,
                bites: payload
            }
        case actionTypes.SET_THUMBNAILS:
            return {
                ...state,
                thumbnails: payload
            }
        case actionTypes.SET_SELECTED_INDEXES:
            return {
                ...state,
                selectedIndexs: payload
            }
        case actionTypes.SET_VIDEO_ALIGNS:
            return {
                ...state,
                aligns: payload
            }
        case actionTypes.SET_BITE_INITIAL:
            return {
                bite: {
                    title: null,
                    price: null,
                    currency: null,
                    videos: []
                },
                bites: [],
                thumbnails: [[], [], []],
                selectedIndexs: [0, 0, 0],
                aligns: [true, true, true]
            }
        default:
            return state
    }
}

export default biteReducer