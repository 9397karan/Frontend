import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect } from "react";
import CourseCard from "../component/CourseCard"; 
import axios from "axios";
import { Link } from "react-router-dom";

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden flex flex-col w-full">
      <Skeleton className="w-full h-40" />
      <div className="px-5 py-4 space-y-3 flex-1 flex flex-col justify-between">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

const Course = () => {
  const [allcourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://backend-dup.onrender.com/course");
      console.log(response.data);
      const courses = response.data.data;

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

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl m-auto p-6">
        <div className="flex justify-between items-center">
          <h2 className="font-bold md:text-3xl text-2xl  text-center mb-6 dark:text-white">
            Popular courses 
          </h2>
          <Link
            to="/courseexplore"
            className="px-4 py-2 border rounded-md text-blue-600 dark:text-blue-400 mb-6 border-blue-600 dark:border-blue-400 bg-transparent hover:bg-blue-100 dark:hover:bg-blue-800"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => <CourseSkeleton key={index} />)
            : allcourses.map((course) => (
                <CourseCard course={course} key={course._id} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Course;
