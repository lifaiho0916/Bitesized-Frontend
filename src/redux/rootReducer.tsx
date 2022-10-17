import { combineReducers } from "redux"
import authReducer from "./reducers/authReducer"
import loadRedcuer from "./reducers/loadReducer"
import notificationReducer from './reducers/notificationReducer'
import transactionReducer from './reducers/transactionReducer'
import biteReducer from "./reducers/biteReducer"
import socialAccountReducer from "./reducers/socialAccountReducer"

const rootReducer = combineReducers({
    auth: authReducer,
    load: loadRedcuer,
    notification: notificationReducer,
    transaction: transactionReducer,
    bite: biteReducer,
    accounts: socialAccountReducer,
})

export default rootReducer