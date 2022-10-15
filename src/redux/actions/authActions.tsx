import { Dispatch } from "redux"
import { SET_LOADING_FALSE, SET_LOADING_TRUE, SET_NAME_EXIST, SET_USER, SET_USERS, SET_URL_EXIST, SET_TIPAVAILABLE, SET_TIPFUNCTION, SET_PREVIOUS_ROUTE } from "../types";
import * as api from '../../api'

export const authAction = {
  logout: (navigate: any) => async (dispatch: Dispatch<any>) => {
    localStorage.clear()
    dispatch({ type: SET_USER, payload: null })
    navigate("/")
  },

  googleSignupUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.googleSignup(userData)
      const { data } = response
      if (data.success) {
        const { payload } = data
        localStorage.clear()
        localStorage.setItem(`${process.env.REACT_APP_CREATO_TOKEN}`, JSON.stringify(payload.token))
        dispatch({ type: SET_USER, payload: payload.user })
        navigate(prevRoute === '' ? '/' : prevRoute)
      }
    } catch (err) {
      console.log(err)
    }
  },

  googleSigninUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.googleSignin(userData)
      const { data } = response
      if (data.success) {
        const { payload } = data
        localStorage.clear()
        localStorage.setItem(`${process.env.REACT_APP_CREATO_TOKEN}`, JSON.stringify(payload.token))
        dispatch({ type: SET_USER, payload: payload.user })
        navigate(prevRoute === '' ? '/' : prevRoute)
      }
    } catch (err) {
      console.log(err)
    }
  },

  appleSignupUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.appleSignup(userData)
      const { data } = response
      if (data.success) {
        const { payload } = data
        localStorage.clear()
        localStorage.setItem(`${process.env.REACT_APP_CREATO_TOKEN}`, JSON.stringify(payload.token))
        dispatch({ type: SET_USER, payload: payload.user })
        navigate(prevRoute === '' ? '/' : prevRoute)
      }
    } catch (err) {
      console.log(err)
    }
  },

  appleSigninUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.appleSignin(userData)
      const { data } = response
      if (data.success) {
        const { payload } = data
        localStorage.clear()
        localStorage.setItem(`${process.env.REACT_APP_CREATO_TOKEN}`, JSON.stringify(payload.token))
        dispatch({ type: SET_USER, payload: payload.user })
        navigate(prevRoute === '' ? '/' : prevRoute)
      }
    } catch (err) {
      console.log(err)
    }
  },

  // facebookSignupUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
  //   api.facebookSignup(userData)
  //     .then((result) => {
  //       const { data } = result;
  //       localStorage.clear();
  //       localStorage.setItem(`${process.env.REACT_APP_CREATO_TOKEN}`, JSON.stringify(data.token));
  //       dispatch({ type: SET_USER, payload: data.user });
  //       if (data.new) {
  //         dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome", state: true } });
  //         navigate("/");
  //       } else navigate(prevRoute);
  //     }).catch(err => console.log(err));
  // },

  // facebookSigninUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
  //   api.facebookSignin(userData)
  //     .then((result) => {
  //       const { data } = result;
  //       localStorage.clear();
  //       localStorage.setItem(`${process.env.REACT_APP_CREATO_TOKEN}`, JSON.stringify(data.token));
  //       dispatch({ type: SET_USER, payload: data.user });
  //       if (data.new) {
  //         dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome", state: true } });
  //         navigate("/");
  //       } else navigate(prevRoute);
  //     }).catch(err => console.log(err));
  // },

  getAuthData: () => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.getAuthData()
      const { data } = response
      if (data.success) {
        const { payload } = data
        dispatch({ type: SET_USER, payload: payload.user })
      }
    } catch (err) {
      console.log(err)
    }
  },

  saveProfileInfo: (name: any, creatoUrl: any, category: any, avatar: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    let resultAvatar = null;
    if (avatar) {
      const formData = new FormData();
      formData.append("file", avatar);
      const config = { headers: { "content-type": "multipart/form-data" } };
      resultAvatar = await api.editAvatar(formData, config);
    }
    let path = null;
    if (resultAvatar?.data) path = resultAvatar.data.path;
    api.saveProfileInfo({ name: name, creatoUrl: creatoUrl, category: category, path: path })
      .then((res) => {
        const { data } = res;
        if (data.success) {
          dispatch({ type: SET_LOADING_FALSE });
          dispatch({ type: SET_USER, payload: data.user });
          navigate(`/${creatoUrl}`);
        }
      }).catch(err => console.log(err));
  },

  setLanguage: (lang: any, userData: any) => async (dispatch: Dispatch<any>) => {
    api.setLanguage({ lang: lang })
      .then((result) => {
        const { data } = result;
        if (data.success) {
          const state = { ...userData, language: lang };
          dispatch({ type: SET_USER, payload: state });
        }
      }).catch(err => console.log(err));
  },

  getUsersList: (search: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_USERS, payload: [] });
    api.getUsersList({ search: search })
      .then((result) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_USERS, payload: data.users });
        dispatch({ type: SET_LOADING_FALSE });
      }).catch(err => console.log(err));
  },

  checkName: (name: any) => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.checkName({ name: name })
      const { data } = response
      if (data.success) {
        const { payload } = data
        dispatch({ type: SET_NAME_EXIST, payload: payload.exist })
      }
    } catch (err) {
      console.log(err)
    }
  },

  checkUrl: (url: any) => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.checkUrl({ url: url })
      const { data } = response
      if (data.success) {
        const { payload } = data
        dispatch({ type: SET_URL_EXIST, payload: payload.exist })
      }
    } catch (err) {
      console.log(err)
    }
  },

  setTipFunction: (tipValue: any, userId: any, users: any, index: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.setTipFunction({ tipValue: tipValue, id: userId })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          users[index].tipFunction = tipValue;
          dispatch({ type: SET_USERS, payload: users });
        }
      }).catch(err => console.log(err));
  },

  getUserFromUrl: (url: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_USERS, payload: [] });
    api.getUserFromUrl({ url: url })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) dispatch({ type: SET_USERS, payload: data.user });
      }).catch(err => console.log(err));
  },

  inviteFriend: (code: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    api.inviteFriend({ referralLink: code })
      .then((result) => {
        const { data } = result
        if (data.success) {
          const payload = data.data

          const referralInfo = {
            userId: payload.userId,
            index: payload.index,
            date: new Date()
          }

          localStorage.setItem("referral_info", JSON.stringify(referralInfo))
          navigate('/auth/signup')
        }
      }).catch(err => console.log(err))
  },

  getCreatorsByCategory: (categories: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE })
      dispatch({ type: SET_USERS, payload: [] })
      const response = await api.getCreatorsByCategory({ categories: categories })
      const { data } = response
      dispatch({ type: SET_LOADING_FALSE })
      const { payload } = data
      if (data.success) dispatch({ type: SET_USERS, payload: payload.creators })
    } catch (err) {
      console.log(err)
      dispatch({ type: SET_LOADING_FALSE })
    }
  }
}