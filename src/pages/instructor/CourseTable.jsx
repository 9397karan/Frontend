import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import axios from "axios";


const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get instructor ID from local storage
  const instructorId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;

  console.log("Instructor ID:", instructorId);

  useEffect(() => {
    if (!instructorId) {
      setLoading(false);
      setError("Instructor ID not found");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await api.get(`/course/instructor/${instructorId}`);
        const data = response.data;
        setCourses(data.courses);
      } catch (err) {
        setError("No Courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [instructorId]);
  const calculate = (price, stud) => {
    return price * stud;
  }
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://backend-dup.onrender.com/course/delete/${id}`);
      alert("Course Deleted")
      window.location.reload()
    } catch (error) {
      alert(error.message);
    }

  }
  return (
    <div className="p-1 mt-10 sm:p-6  bg-gray-100 w-full h-screen dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>

      <Card className="bg-white dark:bg-gray-700">
        <div className="flex justify-between items-center">
          <p className="font-bold text-xl text-center mb-3 ml-6 dark:text-white">All Courses</p>
          <Link to="/instructor/course/create" className="px-4 py-2 mb-3 mt-2 rounded-md mr-5 bg-gray-900 text-white">
            Create Course
          </Link>
        </div>

        <CardContent>
          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Loading courses...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">No courses found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-500">
                  <th className="text-left p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">Course</th>
                  <th className="text-left p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">Students</th>
                  <th className="text-left p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">Revenue</th>
                  <th className="text-left p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index} className="border-b dark:border-gray-500">
                    <td className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                      {course.courseName}
                    </td>
                    <td className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                      {course.enrolledUsers ? course.enrolledUsers.length : 0}
                    </td>
                    <td className="p-2 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white">
                      ₹{calculate(course?.coursePrice, course?.enrolledUsers.length)}
                    </td>
                    <td className="p-2 border border-gray-300 dark:border-gray-500">
                      <div className="flex items-center gap-6">

                        <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => handleDelete(course?._id)}>
                          <MdDelete size={25} />
                        </button>
                        <Button asChild>
                          <Link to={`/instructor/course/${course._id}/add_lessons`}>Add Lecture</Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link to={`/instructor/course/${course._id}/addquestions`}>Add Question</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTable;
