/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext({
  url: `${import.meta.env.VITE_API_BACKEND}`,
  token: "",
  user: null,
  setToken: () => {},
  setUser: () => {},
  fetchWithAuth: async () => {},
});

const StoreContextProvider = (props) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const handleSetToken = (newToken) => {
    setToken(newToken);
    try {
      if (newToken) {
        localStorage.setItem("token", newToken);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Failed to access localStorage for token:", error);
    }
  };

  const handleSetUser = (newUser) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to access localStorage for user:", error);
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    let accessToken = localStorage.getItem("token");

    if (!options.headers) options.headers = {};
    options.headers["Authorization"] = `Bearer ${accessToken}`;
    options.headers["Content-Type"] = "application/json";

    let response = await fetch(url, options);

    if (response.status === 401) {
      console.log("Token expired, trying to refresh...");
      accessToken = await refreshAccessToken();
      if (!accessToken) return null;

      options.headers["Authorization"] = `Bearer ${accessToken}`;
      response = await fetch(url, options);
    }

    return response.json();
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        console.log("No refresh token found, logging out...");
        handleSetToken("");
        handleSetUser(null);
        return null;
      }

      const response = await fetch(
        `${contextValue.url}/api/user/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSetToken(data.accessToken);
        return data.accessToken;
      } else {
        console.log("Failed to refresh token:", data.message);
        handleSetToken("");
        handleSetUser(null);
        return null;
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      handleSetToken("");
      handleSetUser(null);
      return null;
    }
  };

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(storedUser);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  const contextValue = {
    url: `${import.meta.env.VITE_API_BACKEND}`,
    token,
    user,
    setToken: handleSetToken,
    setUser: handleSetUser,
    fetchWithAuth,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
