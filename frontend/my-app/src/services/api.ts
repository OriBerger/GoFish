import axios from "axios";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL , 
  headers: {
    "Content-Type": "application/json",
  },
});
//add tocken if exist:
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
