import axios from "axios"

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL })

API.interceptors.request.use((req: any) => {
    const token = JSON.parse(localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`) || '{}')
    if (localStorage.getItem(`${process.env.REACT_APP_CREATO_TOKEN}`)) {
        req.headers.Authorization = `Bearer ${token}`
        req.headers.Range = 'bytes=0~'
    }
    return req
})

export const uploadVideo = (data: any, config: any) => API.post('/api/bite/upload/video', data, config)
export const uploadCover = (data: any, config: any) => API.post('/api/bite/upload/cover', data, config)
export const CreateBite = (data: any) => API.post('/api/bite/create', data)

export const getAllBites = () => API.get('/api/bite')
export const unLockBite = (id: any, data: any) => API.put(`/api/bite/${id}/unlock`, data)
export const getBitesByPersonalisedUrl = (url: any, userId: any) => API.get(`/api/bite/personalurl/${url}${userId ? `?userId=${userId}` : ''}`)
export const getBitesList = () => API.get('/api/bite/list')
export const getBitesAdmin = () => API.get('/api/bite/adminlist')
export const getBiteById = (id: any) => API.get(`/api/bite/${id}`)
export const changeBiteVisible = (id: any, data: any) => API.post(`/api/bite/${id}/setvisible`, data)
export const deleteBite = (id: any) => API.delete(`/api/bite/${id}`)
export const removeVideoFromBite = (id: any, index: any) => API.delete(`/api/bite/${id}/${index}`)

export const getAuthData = () => API.get('/api/auth')
export const editProfile = (data: any) => API.post('/api/auth/profile/save', data)
export const editAvatar = (data: any, config: any) => API.post('/api/auth/avatar/upload', data, config)
export const checkName = (data: any) => API.post('/api/auth/checkname', data)
export const checkUrl = (data: any) => API.post('/api/auth/checkurl', data)
export const getOwnersOfBites = () => API.get('/api/auth/owners')
export const getUserByPersonalisedUrl = (url: any) => API.get(`/api/auth/personalurl/${url}`)
export const getCreatorsByCategory = (data: any) => API.post('/api/auth/creators', data)

export const googleSignin = (data: any) => API.post('/api/auth/googleSignin', data)
export const googleSignup = (data: any) => API.post('/api/auth/googleSignup', data)
export const facebookSignin = (data: any) => API.post('/api/auth/facebookSignin', data)
export const facebookSignup = (data: any) => API.post('/api/auth/facebookSignup', data)
export const appleSignin = (data: any) => API.post('/api/auth/appleSignin', data)
export const appleSignup = (data: any) => API.post('/api/auth/appleSignup', data)

export const getUserFromUrl = (data: any) => API.post('/api/auth/userFromUrl', data)
export const setLanguage = (data: any) => API.post('/api/auth/setting/lang', data);
export const inviteFriend = (data: any) => API.post('/api/auth/invite_friend', data)


export const buyDonuts = (data: any) => API.post('/api/payment/buy', data);
export const getStripeID = () => API.get('/api/payment/stripeId');
export const connectStripe = (data: any) => API.post('/api/payment/connect_stripe', data)
export const disconnectStripe = (data: any) => API.post('/api/payment/disconnect_stripe', data)
export const getPaymentInfo = () => API.get('/api/payment/payment_info')
export const stripePayout = (data: any) => API.post('/api/payment/payout/stripe', data)

//ADMIN API
export const getUsersList = (data: any) => API.post('/api/auth/users', data);
export const getDareMeList = (data: any) => API.post('/api/dareme/daremes', data);
export const setDareMeShow = (data: any, daremeId: any) => API.post(`/api/dareme/daremes/${daremeId}`, data)
export const deleteDareMe = (daremeId: any) => API.delete(`/api/dareme/daremes/${daremeId}`);
export const updateDareMe = (daremeId: any, daremeData: any) => API.put(`/api/dareme/daremes/${daremeId}`, daremeData);
export const deleteOption = (daremeId: any, optionId: any) => API.delete(`/api/dareme/daremes/${daremeId}/options/${optionId}`);
export const getTransactions = (type: any) => API.get(`/api/transactions/${type}`);
export const addAdminDonuts = (data: any) => API.post('/api/transactions/add/adminDonuts', data);
export const transferDonuts = (data: any) => API.post('/api/transactions/transfer/donuts', data);
export const getUserLatest5Transactions = () => API.get('/api/transactions/user/latest');
export const getUserTransactionsByDays = (data: any) => API.post('/api/transactions/user/days', data);
export const getTips = () => API.get('/api/tip/list');
export const getTipProfile = (url: any) => API.get(`/api/tip/profile/${url}`);
export const setTipFunction = (data: any) => API.post('/api/tip/profile/tipsetting', data);
export const setTipFunctionByUser = (data: any) => API.post('/api/tip/profile_edit/tipsetting', data)
export const changeVisible = (data: any) => API.post('/api/tip/profile/changevisible', data);
export const getTipData = (tipId: any) => API.get(`/api/tip/${tipId}`);
export const updateTip = (tipId: any, data: any) => API.post(`/api/tip/${tipId}/update`, data);
export const deleteTip = (tipId: any) => API.delete(`/api/tip/${tipId}`);
export const getActiveTipUsers = () => API.get('/api/tip/users/tipactive')
export const getFanwallList = () => API.get('/api/fanwall/fanwalls')
export const getReferralLinks = () => API.get('/api/referral')
export const changeRewardDonuts = (data: any) => API.post('/api/referral/change_reward', data)
export const transferDonutsForReferral = (data: any) => API.post('/api/referral/send_donuts', data)
export const getReferralLinkDetail = (userId: any) => API.get(`/api/referral/${userId}`)

///Notification API////
export const getNotificationSetting = () => API.get('/api/notification/setting');
export const addNotificationSetting = (data: any) => API.post('/api/notification/setting', data);
export const getNotificationType = () => API.get('/api/notification/type');
export const addNotificationType = (data: any) => API.post('/api/notification/type', data);
export const setNotificationAuto = (data: any) => API.put('/api/notification/type', data);
export const subscribeUser = (id: any) => API.post(`/api/notification/subscribe_user/${id}`);
export const setNotification = () => API.get('/api/notification/set');
export const getNotifications = () => API.get('/api/notification');
export const readNotification = (data: any) => API.post('/api/notification/read', data);
export const getNotificationHistory = () => API.get('/api/notification/history');