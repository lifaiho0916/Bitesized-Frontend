import { Routes, Route, Navigate } from 'react-router-dom'

import AuthRoute from './authRoute'
import Auth from "../pages/auth"
import Home from "../pages/home"

import CreateType from '../pages/bite/CreateType'
import CreateBite from '../pages/bite/CreateBite'
import EditCoverImage from '../pages/bite/EditCoverImage'

import Profile from '../pages/profile/profile'
import Creators from '../pages/profile/creators'
import Bites from '../pages/profile/Bites'

import ProfileEdit from '../pages/profile/edit/profileEdit'

import ProfileWallet from '../pages/profile/wallet/profileWallet'
import GeneralSetting from '../pages/profile/setting/generalSetting'
import Earning from '../pages/profile/wallet/earning'
import Balance from '../pages/profile/wallet/balance'
import Invitefriends from '../pages/profile/setting/inviteFriends'
import Payment from '../pages/profile/setting/payment'
import Language from '../pages/profile/setting/language'
import Socialaccount from '../pages/profile/edit/socialAccount'
import Categories from '../pages/profile/edit/categories'

import AdminHome from '../pages/admin/home'
import UserList from '../pages/admin/userList'

import Error404 from '../pages/error/error404'

////// ADMIN NOTIFICATIONS /////////
import Notifications from '../pages/admin/notification/notifications'
import NotificationSetting from '../pages/admin/notification/notificationSetting'
import NotificationNew from '../pages/admin/notification/notificationNew'
import NotificationHistory from '../pages/admin/notification/notificationHistory'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute child={<Home />} />} />
      <Route path="auth/signin" element={<AuthRoute child={<Auth isSignin={true} />} />} />
      <Route path="auth/signup" element={<AuthRoute child={<Auth isSignin={false} />} />} />

      <Route path="bite/create_type" element={<AuthRoute child={<CreateType />} routeType="private" />} />
      <Route path="bite/create/free" element={<AuthRoute child={<CreateBite />} routeType="private" />} />
      <Route path="bite/create/paid" element={<AuthRoute child={<CreateBite />} routeType="private" />} />
      <Route path="bite/create/edit_thumbnail" element={<AuthRoute child={<EditCoverImage />} routeType="private" />} />

      <Route path="/:creatorLink" element={<AuthRoute child={<Profile />} />} />
      <Route path="creators" element={<AuthRoute child={<Creators />} />} />
      <Route path="bites" element={<AuthRoute child={<Bites />} />} />

      <Route path="myaccount/edit" element={<AuthRoute child={<ProfileEdit />} routeType="private" />} />
      
      <Route path="myaccount/edit/categories" element={<AuthRoute child={<Categories />} routeType="private" />} />
      <Route path="myaccount/edit/connect_social" element={<AuthRoute child={<Socialaccount />} routeType="private" />} />
      <Route path="myaccount/wallet" element={<AuthRoute child={<ProfileWallet />} routeType="private" />} />
      <Route path="myaccount/wallet/donuts-transactions" element={<AuthRoute child={<Balance />} routeType="private" />} />
      <Route path="myaccount/wallet/earning" element={<AuthRoute child={<Earning />} routeType="private" />} />
      <Route path="myaccount/setting" element={<AuthRoute child={<GeneralSetting />} routeType="private" />} />
      <Route path="myaccount/setting/language" element={<AuthRoute child={<Language />} routeType="private" />} />
      <Route path="myaccount/setting/invitefriends" element={<AuthRoute child={<Invitefriends />} routeType="private" />} />
      <Route path="myaccount/setting/payment" element={<AuthRoute child={<Payment />} routeType="private" />} />

      <Route path="admin" element={<AuthRoute child={<AdminHome />} routeType="private" />} />
      <Route path="admin/users" element={<AuthRoute child={<UserList />} routeType="private" />} />
      <Route path="admin/notifications" element={<AuthRoute child={<Notifications />} routeType="private" />} />
      <Route path="admin/notifications/new" element={<AuthRoute child={<NotificationNew />} routeType="private" />} />
      <Route path="admin/notifications/setting" element={<AuthRoute child={<NotificationSetting />} routeType="private" />} />
      <Route path="admin/notifications/history" element={<AuthRoute child={<NotificationHistory />} routeType="private" />} />

      <Route path="/not-founder-cover" element={<Error404 />} />
      <Route path="*" element={<Navigate to="/not-founder-cover" replace />} />
    </Routes>
  );
}

export default AppRoutes;