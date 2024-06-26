import { Dispatch } from "redux";
import {
  SET_LOADING_FALSE,
  SET_LOADING_TRUE,
  SET_NAME_EXIST,
  SET_USER,
  SET_USERS,
  SET_URL_EXIST,
  SET_CURRENCY_RATE
} from "../types";
import ReactGA from "react-ga4";
import { googleLogout } from "@react-oauth/google";
import decode from "jwt-decode";
import * as api from "../../api";

export const authAction = {
  logout: (navigate: any) => async (dispatch: Dispatch<any>) => {
    const token = JSON.parse(
      localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`) || "{}"
    );
    const decodedToken: any = decode(token);
    if (decodedToken.authType === "Google") googleLogout();
    localStorage.clear();
    dispatch({ type: SET_USER, payload: null });
    navigate("/");
  },

  googleAuth:
    (userData: any, navigate: any, prevRoute: any) =>
    async (dispatch: Dispatch<any>) => {
      try {
        const response = await api.googleAuth(userData);
        const { data } = response;
        if (data.success) {
          const { payload } = data;
          localStorage.clear();
          localStorage.setItem(
            `${process.env.REACT_APP_CREATO_TOKEN}`,
            JSON.stringify(payload.token)
          );
          dispatch({ type: SET_USER, payload: payload.user });
          if (payload.new) {
            ReactGA.event("sign_up", { method: "Google" });
            navigate("/myaccount/edit");
          } else {
            ReactGA.event("login", { method: "Google" });
            navigate(prevRoute);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

  appleAuth:
    (userData: any, navigate: any, prevRoute: any) =>
    async (dispatch: Dispatch<any>) => {
      try {
        const response = await api.appleAuth(userData);
        const { data } = response;
        if (data.success) {
          const { payload } = data;
          localStorage.clear();
          localStorage.setItem(
            `${process.env.REACT_APP_CREATO_TOKEN}`,
            JSON.stringify(payload.token)
          );
          dispatch({ type: SET_USER, payload: payload.user });
          if (payload.new) {
            ReactGA.event("sign_up", { method: "Apple" });
            navigate("/myaccount/edit");
          } else {
            ReactGA.event("login", { method: "Apple" });
            navigate(prevRoute);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

  getAuthData: () => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.getAuthData();
      const { data } = response;
      if (data.success) {
        const { payload } = data;
        dispatch({ type: SET_USER, payload: payload.user });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getCurrencyRate: () => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.getCurrencyRate();
      const { data } = response;
      if (data.success) {
        const { payload } = data;
        dispatch({ type: SET_CURRENCY_RATE, payload: payload.currencyRate });
      }
    } catch (err) {
      console.log(err);
    }
  },

  editProfile:
    (
      name: any,
      url: any,
      category: any,
      bioText: any,
      subscribe: any,
      avatarFile: any,
      navUrl: any,
      userId: any,
      navigate: any
    ) =>
    async (dispatch: Dispatch<any>, getState: any) => {
      try {
        dispatch({ type: SET_LOADING_TRUE });
        let resultAvatar: any = null;
        if (avatarFile) {
          const formData = new FormData();
          formData.append("file", avatarFile);
          const config = { headers: { "content-type": "multipart/form-data" } };
          resultAvatar = await api.editAvatar(formData, config);
        }
        let path = null;
        if (resultAvatar?.data) path = resultAvatar.data.path;
        const response = await api.editProfile({
          name: name,
          url: url,
          category: category,
          bioText: bioText,
          subscribe: subscribe,
          avatar: path,
          id: userId,
        });
        const { data } = response;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          const user = getState().auth.user;
          const { payload } = data;
          if (String(userId) === String(user.id))
            dispatch({ type: SET_USER, payload: payload.user });
          navigate(navUrl);
        }
      } catch (err) {
        console.log(err);
        dispatch({ type: SET_LOADING_FALSE });
      }
    },

  setLanguageCurrency:
    (lang: any, currency: any, navigate: any) =>
    async (dispatch: Dispatch<any>, getState: any) => {
      try {
        dispatch({ type: SET_LOADING_TRUE });
        const response = await api.setLanguageCurrency({
          lang: lang,
          currency: currency,
        });
        const { data } = response;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          let user = getState().auth.user;
          const state = { ...user, language: lang, currency: currency };
          dispatch({ type: SET_USER, payload: state });
          navigate("/");
        }
      } catch (err) {
        console.log(err);
        dispatch({ type: SET_LOADING_FALSE });
      }
    },

  getUsersList: (search: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      dispatch({ type: SET_USERS, payload: [] });

      const response = await api.getUsersList({ search: search });
      const { data } = response;
      dispatch({ type: SET_LOADING_FALSE });

      if (data.success) {
        const { payload } = data;
        dispatch({ type: SET_USERS, payload: payload.users });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: SET_LOADING_FALSE });
    }
  },

  checkName: (name: any, userId: any) => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.checkName({ name: name, id: userId });
      const { data } = response;
      if (data.success) {
        const { payload } = data;
        dispatch({ type: SET_NAME_EXIST, payload: payload.exist });
      }
    } catch (err) {
      console.log(err);
    }
  },

  checkUrl: (url: any, userId: any) => async (dispatch: Dispatch<any>) => {
    try {
      const response = await api.checkUrl({ url: url, id: userId });
      const { data } = response;
      if (data.success) {
        const { payload } = data;
        dispatch({ type: SET_URL_EXIST, payload: payload.exist });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getCreatorsByCategory:
    (categories: any) => async (dispatch: Dispatch<any>) => {
      try {
        dispatch({ type: SET_LOADING_TRUE });
        dispatch({ type: SET_USERS, payload: [] });
        const response = await api.getCreatorsByCategory(categories);
        const { data } = response;
        dispatch({ type: SET_LOADING_FALSE });
        const { payload } = data;
        if (data.success)
          dispatch({ type: SET_USERS, payload: payload.creators });
      } catch (err) {
        console.log(err);
        dispatch({ type: SET_LOADING_FALSE });
      }
    },

  getUsersByCategory: (categories: any, search: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      dispatch({ type: SET_USERS, payload: [] });
      const response = await api.getUsersByCategory(categories, search);
      const { data } = response;
      dispatch({ type: SET_LOADING_FALSE });
      const { payload } = data;
      if (data.success) dispatch({ type: SET_USERS, payload: payload.users });
    } catch (err) {
      console.log(err);
      dispatch({ type: SET_LOADING_FALSE });
    }
  },

  changeUserVisible:
    (userId: any, visible: any) =>
    async (dispatch: Dispatch<any>, getState: any) => {
      try {
        dispatch({ type: SET_LOADING_TRUE });
        const response = await api.changeUserVisible(userId, {
          visible: visible,
        });
        const { data } = response;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          let users = getState().auth.users;
          const index = users.findIndex(
            (user: any) => String(user._id) === String(userId)
          );
          users[index].visible = visible;
          dispatch({ type: SET_USERS, payload: users });
        }
      } catch (err) {
        console.log(err);
        dispatch({ type: SET_LOADING_FALSE });
      }
    },

  setSubscribeByAdmin:
    (userId: any, available: any) =>
    async (dispatch: Dispatch<any>, getState: any) => {
      try {
        dispatch({ type: SET_LOADING_TRUE });
        const response = await api.setSubscribebyAdmin({
          user: userId,
          available: available,
        });
        const { data } = response;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          const users = getState().auth.users;
          const foundIndex = users.findIndex(
            (user: any) => String(user._id) === String(userId)
          );
          users[foundIndex].subscribe.available = available;
          dispatch({ type: SET_USERS, payload: users });
        }
      } catch (err) {
        console.log(err);
        dispatch({ type: SET_LOADING_FALSE });
      }
    },

    getUserByPersonalisedUrl: (url: any) => async (dispatch: Dispatch<any>) => {
      try {
        dispatch({ type: SET_LOADING_TRUE })
        dispatch({ type: SET_USERS, payload: [] })
        const response: any = await api.getUserByPersonalisedUrl(url)
        dispatch({ type: SET_LOADING_FALSE })
        const { data } = response
        if (data.success) {
          const { payload}  = data  
          dispatch({ type: SET_USERS, payload: payload.users })
        }
      } catch (err) {
        dispatch({ type: SET_LOADING_FALSE })
        console.log(err)
      }
    },

    getOwnersOfBites: () => async (dispatch: Dispatch<any>) => {
      try {
        dispatch({ type: SET_LOADING_TRUE })
        dispatch({ type: SET_USERS, payload: [] })
        const response = await api.getOwnersOfBites()

        dispatch({ type: SET_LOADING_FALSE })
        const { data } = response
        if (data.success) {
          const { payload } = data
          dispatch({ type: SET_USERS, payload: payload.users })
        }
    } catch (err) {
        console.log(err)
        dispatch({ type: SET_LOADING_FALSE })
    }
    }
};
