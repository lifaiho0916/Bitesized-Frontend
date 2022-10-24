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
export const CreateBiteByUserId = (id: any, data: any) => API.post(`/api/bite/create/${id}`, data)

export const getAllBites = () => API.get('/api/bite')
export const unLockBite = (id: any, data: any) => API.put(`/api/bite/${id}/unlock`, data)
export const getBitesByPersonalisedUrl = (url: any, userId: any) => API.get(`/api/bite/personalurl/${url}${userId ? `?userId=${userId}` : ''}`)
export const getBitesList = () => API.get('/api/bite/list')
export const getBitesAdmin = (type: any, search: any, sort: any) => API.get(`/api/bite/adminlist?type=${type}&search=${search}&sort=${sort}`)
export const getBiteById = (id: any) => API.get(`/api/bite/${id}`)
export const changeBiteVisible = (id: any, data: any) => API.put(`/api/bite/${id}/setvisible`, data)
export const deleteBite = (id: any) => API.delete(`/api/bite/${id}`)
export const removeVideoFromBite = (id: any, index: any) => API.delete(`/api/bite/${id}/${index}`)
export const changeVideoVisible = (id: any, index: any, data: any) => API.put(`/api/bite/${id}/${index}/setvisible`, data)

export const getAuthData = () => API.get('/api/auth')
export const getCurrencyRate = () => API.get('/api/auth/currencyrate')
export const editProfile = (data: any) => API.post('/api/auth/profile/save', data)
export const editAvatar = (data: any, config: any) => API.post('/api/auth/avatar/upload', data, config)
export const checkName = (data: any) => API.post('/api/auth/checkname', data)
export const checkUrl = (data: any) => API.post('/api/auth/checkurl', data)
export const getOwnersOfBites = () => API.get('/api/auth/owners')
export const getUserByPersonalisedUrl = (url: any) => API.get(`/api/auth/personalurl/${url}`)
export const getCreatorsByCategory = (data: any) => API.post('/api/auth/creators', data)
export const getUsersByCategory = (data: any) => API.post('/api/auth/list', data)
export const getUsersList = (data: any) => API.post('/api/auth/users', data)
export const changeUserVisible = (id: any, data: any) => API.put(`/api/auth/${id}/setvisible`, data)
export const setLanguageCurrency = (data: any) => API.post('/api/auth/setting/lang-currency', data)
export const setSubscribebyAdmin = (data: any) => API.put('/api/auth/subscribe/available', data)

export const getTransactions = (type: any, search: any) => API.get(`/api/transaction?type=${type}&search=${search}`)
export const getTransactionsByUserId = (userId: any, type: any, sort: any) => API.get(`/api/transaction/user/${userId}?type=${type}&sort=${sort}`)
export const getTransactionsByBiteId = (biteId: any, sort: any) => API.get(`/api/transaction/bite/${biteId}?sort=${sort}`)

export const getPayment = () => API.get('/api/payment')
export const addCard = (data: any) => API.post('/api/payment/card', data)
export const deleteCard = () => API.delete('/api/payment/card')

export const getSocialAccount = (userId: any) => API.get(`/api/social-accounts/${userId}`)
export const addSocialAccount = (data: any) => API.post('/api/social-accounts/add', data)
export const removeSocialAccount = (id: any) => API.delete(`/api/social-accounts/delete/${id}`)

export const googleSignin = (data: any) => API.post('/api/auth/googleSignin', data)
export const googleSignup = (data: any) => API.post('/api/auth/googleSignup', data)
export const facebookSignin = (data: any) => API.post('/api/auth/facebookSignin', data)
export const facebookSignup = (data: any) => API.post('/api/auth/facebookSignup', data)
export const appleSignin = (data: any) => API.post('/api/auth/appleSignin', data)
export const appleSignup = (data: any) => API.post('/api/auth/appleSignup', data)
