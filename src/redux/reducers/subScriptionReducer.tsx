import * as actionTypes from "../types";

const INITIAL_STATE: any = {
  subScription: null
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
    default:
      return state;
  }
};

export default subScriptionReducer;
