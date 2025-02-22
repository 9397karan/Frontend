import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Activity, Book, UserCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import api from "@/utils/api";
import Spinner from "../../component/Spinner";

const UserDashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const User = JSON.parse(localStorage.getItem("user"));

  const getAllCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/user/course/${User._id}`);
      const courses = response.data.enrolledCourses;

      if (Array.isArray(courses)) {
        setAllCourses(courses);
      } else {
        console.error("Courses data is not an array:", courses);
        setAllCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  const totalCourses = allCourses.length;
  const coursesInProgress = allCourses.filter(
    (course) => course.status === "in-progress"
  ).length;
  const progress =
    coursesInProgress > 0
      ? ((coursesInProgress / totalCourses) * 100).toFixed(2)
      : 0;

  return (
    <div className="p-4 sm:p-6 min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Welcome, {isLoaded || !isSignedIn ? "👤" : User.name}
        </h1>
        <p className="text-lg text-gray-300">
          Ready to continue your learning journey?
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-xl">
          <CardHeader className="flex items-center">
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 mr-4" />
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{allCourses.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-xl">
          <CardHeader className="flex items-center">
            <Book className="w-8 h-8 sm:w-10 sm:h-10 mr-4" />
            <CardTitle>Courses in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">
              {isLoading ? <Spinner /> : coursesInProgress}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-black to-gray-800 text-white shadow-xl">
          <CardHeader className="flex items-center">
            <UserCircle className="w-8 h-8 sm:w-10 sm:h-10 mr-4" />
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">
              {isLoading ? <Spinner /> : `${progress}%`}
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Your Enrolled Courses</h2>
        <div className="overflow-x-auto">
          {allCourses.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-500">
                  <th className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                    Course
                  </th>
                  <th className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                    Course Level
                  </th>
                  <th className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCourses.map((course, index) => (
                  <tr key={index} className="border-b dark:border-gray-500">
                    <td className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                      {course.courseName}
                    </td>
                    <td className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                      {course.courseLevel}
                    </td>
                    <td className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                      {course.coursePrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-300">No courses enrolled yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;