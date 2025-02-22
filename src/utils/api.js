import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-dup.onrender.com", 
  withCredentials: true,
});

export default api;
