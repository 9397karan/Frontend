import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Activity, Book, UserCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import api from "@/utils/api";
import Spinner from "../../component/Spinner";

const UserDashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [allCourses, setAllCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const User = JSON.parse(localStorage.getItem("user"));

  // Fetch all enrolled courses
  const getAllCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/user/course/${User._id}`);
      setAllCourses(response.data.enrolledCourses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch completed courses
  const getCompletedCourses = async () => {
    try {
      const response = await api.get(`/user/courseCompleted/${User._id}`);
      setCompletedCourses(response.data.completedCourses || []);
    } catch (error) {
      console.error("Error fetching completed courses:", error);
      setCompletedCourses([]);
    }
  };

  useEffect(() => {
    getAllCourses();
    getCompletedCourses();
  }, []);

  const totalCourses = allCourses.length;
  const completedCount = completedCourses.length;
  const pendingCourses = totalCourses - completedCount;

  return (
    <div className="p-6 min-h-screen text-white">
      {/* Welcome Section */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold">
          Welcome, {isLoaded || !isSignedIn ? "👤" : User.name}
        </h1>
        <p className="text-lg text-gray-300">Ready to continue your learning journey?</p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-xl">
          <CardHeader className="flex items-center">
            <Activity className="w-10 h-10 mr-4" />
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCourses}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-xl">
          <CardHeader className="flex items-center">
            <Book className="w-10 h-10 mr-4" />
            <CardTitle>Pending Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? <Spinner /> : pendingCourses}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-black to-gray-800 text-white shadow-xl">
          <CardHeader className="flex items-center">
            <UserCircle className="w-10 h-10 mr-4" />
            <CardTitle>Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? <Spinner /> : completedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses Table */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Enrolled Courses</h2>
        <table className="w-full text-white border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border border-gray-700">Course Name</th>
              <th className="p-3 border border-gray-700">Course Level</th>
              <th className="p-3 border border-gray-700">Price</th>
              <th className="p-3 border border-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center py-4"><Spinner /></td>
              </tr>
            ) : allCourses.length > 0 ? (
              allCourses.map((course) => (
                <tr key={course._id} className="border border-gray-700">
                  <td className="p-3 border border-gray-700">{course.courseName.charAt(0).toUpperCase() + course.courseName.slice(1)}</td>
                  <td className="p-3 border border-gray-700">{course.courseLevel}</td>
                  <td className="p-3 border border-gray-700">{course.coursePrice}</td>
                  <td className="p-3 border border-gray-700">
                    {completedCourses.some(c => c._id === course._id) ? "Completed" : "In Progress"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">No enrolled courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
