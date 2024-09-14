import axios from "axios";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: "http://localhost:3001/api", 
  headers: {
    "Content-Type": "application/json",
  },
});
//add tocken if exist:
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Adjust based on where you store the token

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
