import React, { useState, useEffect } from "react";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-md focus:outline-none"
      title="Toggle Dark Mode"
    >
      {darkMode ? (
        <span className="text-gray-800 dark:text-white "><CiLight size={30}/> </span> // Light Mode
      ) : (
        <span className="text-gray-800 dark:text-white"> <MdDarkMode size={30}/> </span> // Dark Mode
      )}
    </button>
  );
};

export default DarkModeToggle;
