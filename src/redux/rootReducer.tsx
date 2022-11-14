import { combineReducers } from "redux"
import authReducer from "./reducers/authReducer"
import loadRedcuer from "./reducers/loadReducer"
import biteReducer from "./reducers/biteReducer"
import socialAccountReducer from "./reducers/socialAccountReducer"
import transactionReducer from "./reducers/transactionReducer"
import paymentReducer from "./reducers/paymentReducer"
import settingRedcuer from "./reducers/settingReducer"

const rootReducer = combineReducers({
    auth: authReducer,
    load: loadRedcuer,
    bite: biteReducer,
    transaction: transactionReducer,
    accounts: socialAccountReducer,
    payment: paymentReducer,
    setting: settingRedcuer
})

export default rootReducer