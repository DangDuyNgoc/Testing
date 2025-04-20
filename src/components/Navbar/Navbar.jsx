/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Avatar, Button } from "antd";
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    toast.success("Logout Successfully");
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  return (
    <div className="navbar bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src={assets.logo} alt="Logo" className="h-10" />
        <span className="text-xl font-bold text-white">App Name</span>
      </div>

      <div className="flex items-center space-x-4">
        <Avatar src={assets.profile_image} alt="Profile" size="large" />
        {token ? (
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-600"
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
