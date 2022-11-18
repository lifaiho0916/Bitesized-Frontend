import * as actionTypes from '../types';

const INITIAL_STATE: any = {
  account: null
};

const socialAccountReducer: any = ( state: any = INITIAL_STATE, action: any ) => {
  const { payload = null } = action;

  switch (action.type) {
    case actionTypes.SET_SOCIAL_ACCOUNT: {
      return { 
        ...state,
        account: payload
      }
    }
    default:
      return state;
  }
};

export default socialAccountReducer
