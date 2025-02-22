
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";
import CourseActions from "@/component/CourseActions";
import  Spinner  from "../component/Spinner";


const CourseDetails = () => {

  const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id : null; 

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = React.useState(null);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      navigate("/");
    };
  
    window.addEventListener("popstate", handleBackButton);
  
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);


  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `https://backend-dup.onrender.com/lecture/${courseId}`
        );
        setCourseDetails(response.data);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to fetch course details.");
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (!courseDetails) {
    return <Spinner/>;
  }


  const { course, lectures,instructor } = courseDetails;
  const firstLecture = lectures[0]?.lessons[0] || {};
  console.log(instructor[0].name)

  return (
    <div className="space-y-5 mt-16">
      <div className="bg-[#2D2F31] text-white sm:mt-5">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">{course.courseName}</h1>
          <p className="text-base md:text-lg">{course.courseLevel} Level</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">{instructor[0].name}</span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {new Date(course.updatedAt).toLocaleDateString()}</p>
          </div>
          <p>Students enrolled: {course.enrolledUsers.length || 0}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm">{course.courseDesc}</p>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {lectures[0]?.lessons.length || 0} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lectures[0]?.lessons.map((lesson, idx) => (
                <div key={lesson._id} className="flex items-center gap-3 text-sm">
                  <span>
                    {lesson.isPreview ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>{lesson.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={firstLecture.video_URL || ""}
                  controls={true}
                />
              </div>
              <h1>{firstLecture.title || "No Lecture Available"}</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                Course Price: ₹{course.coursePrice}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
            <CourseActions courseId={courseId} userId={userId} /> 
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
