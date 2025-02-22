import React, { useState } from "react";
import api from "../utils/api";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import img from "../assets/loginimg.svg";
import Spinner from "../component/Spinner";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/user/login", formData);
      setLoading(false);

      enqueueSnackbar(data.message, { variant: "success" });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data?.user?.email?.trim().toLowerCase() === "admin@gmail.com") {
        navigate("/admin/dashboard");
      } else if (data?.user?.role === "instructor") {
         navigate("/instructor/dashboard");   
      }else{
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      console.log("Login Error:", error);

      if (error.response) {
        enqueueSnackbar(error.response.data?.message || "Login failed. Please try again.", { variant: "error" });
      } else if (error.request) {
        enqueueSnackbar("No response from server. Please check your connection.", { variant: "warning" });
      } else {
        enqueueSnackbar("An unexpected error occurred. Please try again.", { variant: "error" });
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-700 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 bg-gradient-to-r from-blue-300 to-blue-500">
          <img src={img} alt="Illustration" className="w-full h-48 lg:h-full object-cover" />
        </div>

        <form className="w-full lg:w-1/2 p-8" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded shadow-lg hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
