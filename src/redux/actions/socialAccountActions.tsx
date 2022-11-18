import { Dispatch } from 'redux';
import * as api from '../../api';
import {
  SET_SOCIAL_ACCOUNT,
  SET_LOADING_FALSE,
  SET_LOADING_TRUE
} from '../types';
export const accountAction = {
  getAccount: (userId: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_SOCIAL_ACCOUNT, payload: null })
      const response = await api.getSocialAccount(userId)
      const { data } = response
      
      if(data.success) {
        const { payload } = data
        dispatch({ type: SET_SOCIAL_ACCOUNT, payload: payload.socialAccount})
      }
    } catch (error) {
      console.log(error);
    }
  },
  addAccount: (socialInfo: any) => async (dispatch: Dispatch<any>) => {
      try {
        dispatch({ type: SET_LOADING_TRUE })
        const response = await api.addSocialAccount(socialInfo)
        const { data } = response
        dispatch({ type: SET_LOADING_FALSE })
        if(data.success) {
          const { payload } = data
          alert("Youtube account is connected successfully")
          dispatch({ type: SET_SOCIAL_ACCOUNT, payload: payload.socialAccount });
        }
      } catch (error) {
        dispatch({ type: SET_LOADING_FALSE })
        console.log(error)
      }
    },
  removeAccount: (id: any, social: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE })
      const response = await api.removeSocialAccount(id, social)
      const { data } = response
      dispatch({ type: SET_LOADING_FALSE })
      if(data.success) {
        const { payload } = data
        dispatch({ type: SET_SOCIAL_ACCOUNT, payload: payload.socialAccount })
      }
    } catch (error) {
      dispatch({ type: SET_LOADING_FALSE })
      console.log(error);
    }
  },
};
