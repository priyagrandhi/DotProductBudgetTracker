import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  //axiosInstance.get('/api/transactions/?page=2&type=expense');

  timeout: 5000,
  headers: {
    //Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    //console.log("Request URL:", config.url);
    console.log("Request headers:", config.headers);
    return config;
  },
  
  (error) => Promise.reject(error)
);

export default axiosInstance;
