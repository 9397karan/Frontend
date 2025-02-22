import { useEffect, useState } from "react";
import React from "react";
import api from "@/utils/api";
import Spinner from "../../component/Spinner";

const CourseExplore = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const getAllCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/user/course/${user._id}`);
      const courses = response.data.enrolledCourses;
      setAllCourses(Array.isArray(courses) ? courses : []);
    } catch (error) {
      setError(error);
      setAllCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  const handleContinueCourse = (courseId) => {
    window.location.href = `/course-progress/${courseId}`;
  };

  if (loading) return <Spinner />;
  

  return (
    <section className="w-full min-h-screen p-2 sm:p-6  bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-white">
        Enrolled Courses
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
        {allCourses.map((course, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col transition-all duration-300"
          >
            <img
              src={course.coursePic.url}
              alt={course.courseName}
              className="h-40 sm:h-48 w-full object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {course.courseName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {course.courseDesc || "No description available."}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-auto">
                Level: {course.courseLevel || "N/A"}
              </p>
            </div>
            <button
              onClick={() => handleContinueCourse(course._id)}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300"
            >
              Continue Course
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseExplore;