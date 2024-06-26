import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

API.interceptors.request.use((req: any) => {
	const token = JSON.parse(
		localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`) || "{}"
	);
	if (localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`)) {
		req.headers.Authorization = `Bearer ${token}`;
		req.headers.Range = "bytes=0~";
	}
	return req;
});

export const searchResult = (search: any) =>
	API.get(`/api/search?search=${search}`);

export const uploadVideo = (data: any, config: any) =>
	API.post("/api/bite/upload/video", data, config);
export const uploadCover = (data: any, config: any) =>
	API.post("/api/bite/upload/cover", data, config);
export const CreateBite = (data: any) => API.post("/api/bite/create", data);
export const CreateBiteByUserId = (id: any, data: any) =>
	API.post(`/api/bite/create/${id}`, data);
export const UpdateBite = (id: any, data: any) =>
	API.put(`/api/bite/${id}`, data);

export const getAllBites = (filter: any) =>
	API.get(`/api/bite?filter=${filter}`);
export const unLockBite = (id: any, data: any) =>
	API.put(`/api/bite/${id}/unlock`, data);
export const getBitesByPersonalisedUrl = (url: any, userId: any, tab: any) =>
	API.get(
		`/api/bite/personalurl/${url}${
			userId ? `?userId=${userId}&tab=${tab}` : ""
		}`
	);
export const getBitesList = (categories: any) =>
	API.get(`/api/bite/list?categories=${categories}`);
export const getBitesAdmin = (type: any, search: any, sort: any) =>
	API.get(`/api/bite/adminlist?type=${type}&search=${search}&sort=${sort}`);
export const getBitesSortByCommentAdmin = (type: any, search: any, sort: any) =>
	API.get(`/api/bite/list_comment?type=${type}&search=${search}&sort=${sort}`);
export const getBiteById = (id: any) => API.get(`/api/bite/${id}`);
export const changeBiteVisible = (id: any, data: any) =>
	API.put(`/api/bite/${id}/setvisible`, data);
export const deleteBite = (id: any) => API.delete(`/api/bite/${id}`);
export const removeVideoFromBite = (id: any, index: any) =>
	API.delete(`/api/bite/${id}/${index}`);
export const changeVideoVisible = (id: any, index: any, data: any) =>
	API.put(`/api/bite/${id}/${index}/setvisible`, data);
export const getBitesByUserIdAndCategory = (userId: any, biteId: any) =>
	API.get(`/api/bite/user/${userId}?biteId=${biteId}`);
export const sendComment = (id: any, data: any) =>
	API.put(`/api/bite/${id}/comment`, data);
export const deleteComment = (id: any, index: any) =>
	API.delete(`/api/bite/${id}/comment/${index}`);
export const clearCommentNotification = (id: any) =>
	API.get(`/api/bite/${id}/comment/notification`);

export const getAuthData = () => API.get("/api/auth");
export const googleAuth = (data: any) => API.post("/api/auth/google", data);
export const appleAuth = (data: any) => API.post("/api/auth/apple", data);
export const editProfile = (data: any) =>
	API.post("/api/auth/profile/save", data);
export const editAvatar = (data: any, config: any) =>
	API.post("/api/auth/avatar/upload", data, config);
export const checkName = (data: any) => API.post("/api/auth/checkname", data);
export const checkUrl = (data: any) => API.post("/api/auth/checkurl", data);
export const getOwnersOfBites = () => API.get("/api/auth/owners");
export const getUserByPersonalisedUrl = (url: any) =>
	API.get(`/api/auth/personalurl/${url}`);
export const getCreatorsByCategory = (categories: any) =>
	API.get(`/api/auth/creators?categories=${categories}`);
export const getUsersByCategory = (categories: any, search: any) =>
	API.get(`/api/auth/list?categories=${categories}&search=${search}`);
export const getUsersList = (data: any) => API.post("/api/auth/users", data);
export const changeUserVisible = (id: any, data: any) =>
	API.put(`/api/auth/${id}/setvisible`, data);
export const setLanguageCurrency = (data: any) =>
	API.post("/api/auth/setting/lang-currency", data);
export const setSubscribebyAdmin = (data: any) =>
	API.put("/api/auth/subscribe/available", data);

export const getTransactions = (
	type: any,
	search: any,
	sort: any,
	period: any
) =>
	API.get(
		`/api/transaction?type=${type}&search=${search}&sort=${sort}&period=${period}`
	);
export const getTransactionsByUserId = (userId: any, sort: any, period: any) =>
	API.get(`/api/transaction/user/${userId}?sort=${sort}&period=${period}`);
export const getTransactionsByBiteId = (biteId: any, sort: any) =>
	API.get(`/api/transaction/bite/${biteId}?sort=${sort}`);

export const getPayment = () => API.get("/api/payment");
export const addCard = (data: any) => API.post("/api/payment/card", data);
export const deleteCard = () => API.delete("/api/payment/card");

export const getSocialAccount = (userId: any) =>
	API.get(`/api/social-accounts/${userId}`);
export const addSocialAccount = (data: any) =>
	API.post("/api/social-accounts", data);
export const addInstagramAccount = (data: any) =>
	API.post("/api/social-accounts/instagramlogin", data);
export const removeSocialAccount = (id: any, social: any) =>
	API.delete(`/api/social-accounts/${id}?social=${social}`);

export const getSubScription = (userId: any) =>
	API.get(`/api/subscription/${userId}`);
export const getSubScriptions = (type: any, sort: any, search: any) =>
	API.get(`/api/subscription/list?type=${type}&sort=${sort}&search=${search}`);
export const saveSubScription = (data: any) =>
	API.post("/api/subscription", data);
export const deleteSubScription = (id: any) =>
	API.delete(`/api/subscription/${id}`);
export const setSubScriptionVisible = (id: any, data: any) =>
	API.put(`/api/subscription/${id}/setvisible`, data);
export const editSubScription = (id: any, data: any) =>
	API.put(`/api/subscription/${id}`, data);
export const subscribePlan = (id: any, data: any) =>
	API.put(`/api/subscription/${id}/create`, data);
export const getSubscribersByUserId = (sort: any, page: any) =>
	API.get(`/api/subscription/user-subscribers?sort=${sort}&page=${page}`);
export const getSubscribersByOwner = (userId: any, code: any, sort: any) =>
	API.get(
		`/api/subscription/owner-subscribers?type=${code}&sort=${sort}&user=${userId}`
	);
export const unSubscribe = (data: any) =>
	API.put(`/api/subscription/unsubscribe`, data);
//SETTING
export const getCurrencyRate = () => API.get("/api/setting/currencyrate");
export const getTermsAndPrivacy = () => API.get("/api/setting/terms-privacy");
export const saveTermsAndPrivacy = (data: any) =>
	API.post("/api/setting/terms-privacy", data);

export const facebookSignin = (data: any) =>
	API.post("/api/auth/facebookSignin", data);
export const facebookSignup = (data: any) =>
	API.post("/api/auth/facebookSignup", data);
