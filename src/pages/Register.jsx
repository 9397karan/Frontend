import React, { useState } from "react";
import api from "../utils/api";
import { useSnackbar } from "notistack";
import { useNavigate, Navigate } from "react-router-dom";
import img from "../assets/login.png";

const Register = () => {
  const user = localStorage.getItem("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/register", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      navigate("/login");
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Registration failed", { variant: "error" });
    }
  };

  return user ? (
    <Navigate to="/" />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10 sm:mt-8 dark:bg-gray-900 p-6 transition-colors duration-500">
      <div className="flex flex-col lg:flex-row bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden w-full max-w-4xl">
        <form className="p-8 w-full lg:w-1/2" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800 dark:text-gray-100">Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

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

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-3 border mb-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded transition-all duration-500 transform hover:scale-105 shadow-lg"
          >
            Register
          </button>
        </form>

        <div className="w-4/4  sm:w-2/4 flex items-center justify-center p-6 bg-gradient-to-r from-blue-300 to-blue-500 transition-colors duration-500">
          <img src={img} alt="Illustration" className="w-4/4" />
        </div>
      </div>
    </div>
  );
};

export default Register;
