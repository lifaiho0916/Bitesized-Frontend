import * as actionTypes from '../types';
interface StateTypes {
  accounts: any[];
}

const INITIAL_STATE: StateTypes = {
  accounts: [],
};

const socialAccountReducer: any = (
  state: StateTypes = INITIAL_STATE,
  action: any
) => {
  const { payload = null } = action;

  switch (action.type) {
    case actionTypes.GET_SOCIAL_ACCOUNTS: {
      return { ...state, accounts: payload };
    }
    case actionTypes.ADD_SOCIAL_ACCOUNTS: {
      return { ...state, accounts: [...state.accounts, payload] };
    }
    case actionTypes.DELETE_SOCIAL_ACCOUNTS: {
      const accounts = state.accounts.filter((i) => i._id !== payload);
      return { ...state, accounts };
    }
    default:
      return state;
  }
};

export default socialAccountReducer
