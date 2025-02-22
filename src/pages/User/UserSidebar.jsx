import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
<div className="flex dark:bg-gray-900 ">
  {/* Sidebar for larger screens */}
  <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky pt-24 h-screen ">
    <div className="space-y-4">
      <Link to="dashboard" className="flex items-center gap-2 dark:text-white">
        <ChartNoAxesColumn size={22} />
        <h1 className="hidden sm:block">Dashboard</h1>
      </Link>
      <Link to="my-learning" className="flex items-center gap-2 dark:text-white">
        <SquareLibrary size={22} />
        <h1 className="hidden sm:block">My Learning</h1>
      </Link>
    </div>
  </div>

  {/* Sidebar for smaller screens */}
  <div className="lg:hidden flex flex-col items-start p-5 mt-20 space-y-4 border-r border-gray-300 dark:border-gray-700">
    <Link to="dashboard" className="flex items-center gap-2 dark:text-white">
      <ChartNoAxesColumn size={22} />
    </Link>
    <Link to="my-learning" className="flex items-center gap-2 dark:text-white">
      <SquareLibrary size={22} />
    </Link>
  </div>

 
  <div className="flex-1 p-12 sm:p-6 md:p-30 lg:p-16 dark:bg-gray-900">
  <Outlet />
</div>

</div>


   
  );
};

export default Sidebar;
