import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BACKEND}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.log("Refreshing token...");
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BACKEND}/api/user/refresh-token`,
            {},
            { withCredentials: true }
          );

          localStorage.setItem("token", data.accessToken);
          isRefreshing = false;
          onRefreshed(data.accessToken);
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;