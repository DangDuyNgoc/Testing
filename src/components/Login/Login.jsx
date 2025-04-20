/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./Login.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = ({ setShowLogin }) => {
  const { url, setToken, setUser } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (!data.email) {
      return toast.error("Please enter your email!");
    }

    if (!data.password) {
      return toast.error("Please enter your password!");
    }

    try {
      let newUrl = url;
      if (currentState === "Login") {
        newUrl += "/api/user/login";
      } else {
        newUrl += "/api/user/registration";
      }

      const response = await axios.post(newUrl, data);

      if (response.data.user?.role === 1) {
        if (response.data.success) {
          setToken(response.data.accessToken);
          setUser(response.data.user);
          toast.success(response.data.message);
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setShowLogin(false);
        } else {
          toast.error(response.data?.message);
        }
      } else {
        toast.error("You are not authorized to access this page");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="login">
      <form onSubmit={onLogin} className="login-container">
        <div className="login-title">
          <h2>{currentState}</h2>
          <button
            type="button"
            className="close-button"
            onClick={() => setShowLogin(false)}
          >
            X
          </button>
          <img
            src={assets.cross_icon}
            alt=""
            onClick={() => setShowLogin(false)}
          />
        </div>
        <div className="login-input">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            value={data.email}
            type="email"
            onChange={onChangeHandler}
            placeholder="Your email"
          />
          <input
            name="password"
            value={data.password}
            type="password"
            onChange={onChangeHandler}
            placeholder="Your password"
          />
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
