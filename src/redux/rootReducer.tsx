import { combineReducers } from "redux"
import authReducer from "./reducers/authReducer"
import loadRedcuer from "./reducers/loadReducer"
import biteReducer from "./reducers/biteReducer"
import socialAccountReducer from "./reducers/socialAccountReducer"
import transactionReducer from "./reducers/transactionReducer"
import paymentReducer from "./reducers/paymentReducer"
import settingRedcuer from "./reducers/settingReducer"
import subScriptionReducer from "./reducers/subScriptionReducer"

const rootReducer = combineReducers({
    auth: authReducer,
    load: loadRedcuer,
    bite: biteReducer,
    transaction: transactionReducer,
    account: socialAccountReducer,
    payment: paymentReducer,
    setting: settingRedcuer,
    subScription: subScriptionReducer
})

export default rootReducer