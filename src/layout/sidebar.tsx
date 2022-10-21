import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  NoOfPeopleIcon,
  EditIcon,
  AddIcon,
  MoneyIcon,
  SearchIcon
} from "../assets/svg"
import "../assets/styles/sidebarStyle.scss"

const NavLink = (props: any) => {
  const isActive = props.pathname.indexOf(props.to) !== -1 ? props.to === "/admin" && props.to !== props.pathname ? false : true : false;

  useEffect(() => {
    if (isActive) props.setActivePath(props.to);
  }, [isActive]);

  return (
    <Link to={props.to} className={isActive ? "list-item active" : "list-item"}
      onMouseOver={() => { props.setHoverPath(props.to) }}
      onMouseLeave={() => { props.setHoverPath("") }} >
      {props.children}
    </Link>
  )
}

const Sidebar = () => {
  const location = useLocation();
  const [hoverPath, setHoverPath] = useState("");
  const [activePath, setActivePath] = useState("")

  return (
    <div className="sidebar-wrapper">
      <div className="list">
        <NavLink to="/admin/check-bite" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <SearchIcon className="icon-svg" color={location.pathname.indexOf('/admin/check-bite') !== -1 ? "#EFA058" : hoverPath === "/admin/check-bite" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Check Bite</span>
          </div>
        </NavLink>
        <NavLink to="/admin/edit-bite" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <EditIcon className="icon-svg" color={location.pathname.indexOf('/admin/edit-bite') !== -1 ? "#EFA058" : hoverPath === "/admin/edit-bite" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Edit Bite</span>
          </div>
        </NavLink>
        <NavLink to="/admin/create-free-bite" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <AddIcon className="icon-svg" color={location.pathname.indexOf('/admin/create-free-bite') !== -1 ? "#EFA058" : hoverPath === "/admin/create-free-bite" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Create FREE Bite - Users</span>
          </div>
        </NavLink>
        <NavLink to="/admin/transaction" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <MoneyIcon className="icon-svg" color={location.pathname.indexOf('/admin/transaction') !== -1 ? "#EFA058" : hoverPath === "/admin/transaction" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Transaction</span>
          </div>
        </NavLink>
        <NavLink to="/admin/profile-user" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <NoOfPeopleIcon className="icon-svg" color={location.pathname.indexOf('/admin/profile-user') !== -1 ? "#EFA058" : hoverPath === "/admin/profile-user" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Profile - Users</span>
          </div>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
