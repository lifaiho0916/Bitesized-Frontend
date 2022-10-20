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
import Socialaccount from '../pages/profile/edit/socialAccount'
import Categories from '../pages/profile/edit/categories'
import Wallet from '../pages/profile/Wallet'

///----------------ADMIN-----------------==////
//EDIT-BITE
import AdminBiteList from '../pages/admin/editBite/AdminBiteList'
import AdminEditBite from '../pages/admin/editBite/AdminEditBite'
//CREATE-FREE-BITE
import AdminCreatorList from '../pages/admin/createFreeBite/AdminCreatorList'
import AdminCreateFreeBite from '../pages/admin/createFreeBite/AdminCreateFreeBite'
//ProfileUser
import AdminUserList from '../pages/admin/profileUser/AdminUserList'
import AdminEditUser from '../pages/admin/profileUser/AdminEditUser'
//Transaction
import AdminTransaction from '../pages/admin/transaction/AdminTransaction'

import GeneralSetting from '../pages/profile/setting/generalSetting'
import LanguageCurrency from '../pages/profile/setting/language'

import Error404 from '../pages/error/error404'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute child={<Home />} />} />
      <Route path="auth/signin" element={<AuthRoute child={<Auth isSignin={true} />} />} />
      <Route path="auth/signup" element={<AuthRoute child={<Auth isSignin={false} />} />} />

      <Route path="bite/create-type" element={<AuthRoute child={<CreateType />} routeType="private" />} />
      <Route path="bite/create/free" element={<AuthRoute child={<CreateBite />} routeType="private" />} />
      <Route path="bite/create/paid" element={<AuthRoute child={<CreateBite />} routeType="private" />} />
      <Route path="bite/create/edit-thumbnail" element={<AuthRoute child={<EditCoverImage />} routeType="private" />} />

      <Route path="/:creatorLink" element={<AuthRoute child={<Profile />} />} />
      <Route path="creators" element={<AuthRoute child={<Creators />} />} />
      <Route path="bites" element={<AuthRoute child={<Bites />} />} />

      <Route path="myaccount/edit" element={<AuthRoute child={<ProfileEdit />} routeType="private" />} />
      <Route path="myaccount/edit/categories" element={<AuthRoute child={<Categories />} routeType="private" />} />
      <Route path="myaccount/edit/connect-social" element={<AuthRoute child={<Socialaccount />} routeType="private" />} />
      <Route path="myaccount/wallet" element={<AuthRoute child={<Wallet />} routeType="private" />} />

      <Route path="admin/edit-bite" element={<AuthRoute child={<AdminBiteList />} routeType="private" />} />
      <Route path="admin/edit-bite/:biteId" element={<AuthRoute child={<AdminEditBite />} routeType="private" />} />
      <Route path="admin/create-free-bite" element={<AuthRoute child={<AdminCreatorList />} routeType="private" />} />
      <Route path="admin/create-free-bite/detail" element={<AuthRoute child={<AdminCreateFreeBite />} routeType="private" />} />
      <Route path="admin/create-free-bite/detail/edit-thumbnail" element={<AuthRoute child={<EditCoverImage />} routeType="private" />} />
      <Route path="admin/profile-user" element={<AuthRoute child={<AdminUserList />} routeType="private" />} />
      <Route path="admin/profile-user/edit" element={<AuthRoute child={<AdminEditUser />} routeType="private" />} />
      <Route path="admin/profile-user/edit/categories" element={<AuthRoute child={<Categories />} routeType="private" />} />
      <Route path="admin/transaction" element={<AuthRoute child={<AdminTransaction />} routeType="private" />} />

      <Route path="myaccount/setting" element={<AuthRoute child={<GeneralSetting />} routeType="private" />} />
      <Route path="myaccount/setting/language-currency" element={<AuthRoute child={<LanguageCurrency />} routeType="private" />} />
      
      <Route path="/not-founder-cover" element={<Error404 />} />
      <Route path="*" element={<Navigate to="/not-founder-cover" replace />} />
    </Routes>
  );
}

export default AppRoutes;