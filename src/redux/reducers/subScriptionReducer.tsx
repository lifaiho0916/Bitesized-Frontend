import * as actionTypes from "../types";

const INITIAL_STATE: any = {
  subScription: null,
  subScriptions: [],
  subscribers: [],
  total: 0,
};

const subScriptionReducer = (state: any = INITIAL_STATE, action: any) => {
  const { payload = null } = action;
  switch (action.type) {
    case actionTypes.SET_SUBSCRIPTION: {
       return {
            ...state,
            subScription: payload
        } 
      }
    case actionTypes.SET_SUBSCRIPTIONS: {
      return {
            ...state,
            subScriptions: payload
        } 
      }
    case actionTypes.SET_SUBSCRIBERS: {
      return {
          ...state,
          subscribers: payload
        }
      }
    case actionTypes.SET_TOTAL_SUBSCRIBERS: {
      return {
        ...state,
        total: payload
      }
    }
    default:
      return state;
  }
};

export default subScriptionReducer;
