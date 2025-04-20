/* eslint-disable no-unused-vars */
import "./Sidebar.css";
import { assets } from "../../assets/assets.js";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "./../../context/StoreContext";
import { message } from "antd";

const Sidebar = ({ setShowLogin }) => {
  const { token, user } = useContext(StoreContext) || {};

  const checkAuth = (event, path) => {
    if (!token) {
      event.preventDefault();
      message.warning("Please login to access this page");
      setShowLogin(true);
    } else if (user?.role !== 1) {
      event.preventDefault();
      message.error("You do not have permission to access this page");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-option">
        <NavLink
          to="/product"
          className="wrapper"
          onClick={(e) => checkAuth(e, "/product")}
        >
          <img src={assets.add_icon} alt="" />
          <p>Product</p>
        </NavLink>

        <NavLink
          to="/category"
          className="wrapper"
          onClick={(e) => checkAuth(e, "/category")}
        >
          <img src={assets.add_icon} alt="" />
          <p>Category</p>
        </NavLink>

        <NavLink
          to="/order"
          className="wrapper"
          // onClick={(e) => checkAuth(e, "/order")}
        >
          <img src={assets.order_icon} alt="" />
          <p>Orders Items</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
