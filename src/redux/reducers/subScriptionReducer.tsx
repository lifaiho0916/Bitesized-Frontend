import * as actionTypes from "../types";

const INITIAL_STATE: any = {
  subScription: null,
  subscribers: []
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
    case actionTypes.SET_SUBSCRIBERS: {
      return {
          ...state,
          subscribers: payload
        }
      }
    default:
      return state;
  }
};

export default subScriptionReducer;
