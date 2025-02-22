import { BarChart3, Users, BookOpen, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { MdOutlineMenuBook } from "react-icons/md";

const Sidebar2 = ({ info }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "dashboard", label: "Dashboard", icon: <BarChart3 size={22} /> },
    { to: "instructor", label: "Instructors", icon: <BookOpen size={22} /> },
    { to: "allusers", label: "Users", icon: <Users size={22} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row dark:bg-gray-900">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:block w-[250px] space-y-6 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen bg-white dark:bg-gray-800 shadow-lg">
        <h2 className="text-xl font-bold dark:text-white mb-4">Menu</h2>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors dark:text-white"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Sidebar for smaller screens */}
      <div className="lg:hidden flex flex-col p-5 mt-16 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="dark:text-white"
        >
          {isOpen ? <X size={28} /> : <MdOutlineMenuBook size={28} />}
        </button>
        {isOpen && (
          <div className="mt-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors dark:text-white"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 p-5 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar2;
