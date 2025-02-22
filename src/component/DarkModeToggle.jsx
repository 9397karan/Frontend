import React, { useState, useEffect } from "react";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

const DarkModeToggle = () => {
  // Set darkMode to true by default
  const [darkMode, setDarkMode] = useState(true);

  // Load saved dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      const isDarkMode = savedMode === "true";
      setDarkMode(isDarkMode);
      document.documentElement.classList.toggle("dark", isDarkMode);
    } else {
      // If no preference is saved, default to dark mode
      document.documentElement.classList.add("dark");
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
        <span className="text-gray-800 dark:text-white">
          <CiLight size={30} /> {/* Light Mode Icon */}
        </span>
      ) : (
        <span className="text-gray-800 dark:text-white">
          <MdDarkMode size={30} /> {/* Dark Mode Icon */}
        </span>
      )}
    </button>
  );
};

export default DarkModeToggle;
