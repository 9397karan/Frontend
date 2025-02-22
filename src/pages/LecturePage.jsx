import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { PlayCircle } from "lucide-react";
import { MdAssignment } from "react-icons/md";
import { PiCertificateFill } from "react-icons/pi";
import { IoCall } from "react-icons/io5";
import io from "socket.io-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Spinner from "../component/Spinner";

const socket = io("http://localhost:5000");

const LecturePage = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState(null);
  const [passingScore, setPassingScore] = useState(null);
  const [replies, setReplies] = useState([]);

  // Get user details from localStorage
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userId = user?._id;
  const storedPassed = localStorage.getItem(`quiz_passed_${courseId}`);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get(`https://backend-dup.onrender.com/lecture/${courseId}`);
        const { lectures, course, playingLecture } = response.data;

        setLectures(lectures);
        setCourse(course);

        if (playingLecture?.lessons?.length > 0) {
          setSelectedLecture(playingLecture.lessons[0]);
        } else if (lectures.length > 0) {
          setSelectedLecture(lectures[0].lessons[0]);
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to fetch lectures.");
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [courseId, userId]);

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const res = await axios.get(`https://backend-dup.onrender.com/api/questions/quiz-result/${userId}/${courseId}`);

        if (res.data?.score !== undefined && res.data?.passingScore !== undefined && res.data?.passingScore !== 0) {
          setUserScore(res.data.score);
          setPassingScore(res.data.passingScore);
        } else {
          setUserScore(null);
          setPassingScore(null);
        }
      } catch (error) {
        console.error(error);
        setUserScore(null);
        setPassingScore(null);
      }
    };

    if (userId) {
      fetchQuizResult();
    }
  }, [courseId, userId]);

  const handleLectureClick = (lesson) => {
    setSelectedLecture(lesson);
  };

  const handleRequestCall = async () => {
    if (!userId || !course?.creator?._id) {
      alert("Instructor details not found!");
      return;
    }

    try {
      const notificationData = {
        senderId: userId, // Student ID
        receiverId: course.creator._id, // Instructor ID
        message: `A student has requested a call for the course: ${course.courseName}`,
      };

      const res = await axios.post("https://backend-dup.onrender.com/api/notifications/add", notificationData);
      
      // Emit socket event
      socket.emit("send_notification", res.data);

      alert("Call request sent to the instructor!");
    } catch (error) {
      console.error("Failed to send request:", error);
      alert("Failed to send call request.");
    }
  };

  useEffect(() => {
    // Listen for instructor replies
    socket.on("receive_reply", (newReply) => {
      setReplies((prevReplies) => [...prevReplies, newReply]);
    });

    return () => {
      socket.off("receive_reply");
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-12 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{course?.courseName || "Course Name"}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Created by{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {course?.creator?.name}
            </span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Video Player Section */}
          <div className="w-full lg:w-2/3">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="w-full aspect-video mb-4 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {selectedLecture ? (
                    <ReactPlayer url={selectedLecture?.video_URL} width="100%" height="100%" controls />
                  ) : (
                    <p className="text-center">No video selected</p>
                  )}
                </div>
                <h1 className="text-lg font-bold">{selectedLecture?.title || "Select a lecture to view"}</h1>
              </CardContent>
            </Card>
          </div>

          {/* Lecture List Section */}
          <div className="w-full lg:w-1/3">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lectures.map((lecture) =>
                  lecture.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      onClick={() => handleLectureClick(lesson)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        selectedLecture?._id === lesson?._id ? "bg-blue-100 dark:bg-blue-800" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>
                        <PlayCircle size={20} className="text-blue-600 dark:text-blue-400" />
                      </span>
                      <p className="flex-1">{lesson?.title}</p>
                    </div>
                  ))
                )}

                <Link to={`/course/${courseId}/quiztest`} className="flex items-center gap-3 p-3 text-white bg-orange-500 rounded-lg shadow-md transition-all duration-300 hover:bg-orange-600 hover:shadow-lg">
                  <MdAssignment size={20} className="text-white" />
                  Attempt Quiz
                </Link>

                {storedPassed === "true" && (
                  <Link to={`/certificate/${userId}/${courseId}`} className="flex items-center gap-3 p-3 text-white bg-green-500 rounded-lg shadow-md transition-all duration-300 hover:bg-green-600 hover:shadow-lg">
                    <PiCertificateFill size={20} className="text-white" />
                    Download Certificate
                  </Link>
                )}

                {/* Request a Call Button */}
                <button
                  onClick={handleRequestCall}
                  className="flex items-center justify-center w-full p-3 text-white bg-blue-500 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
                >
                  <IoCall size={20} className="text-white" />
                  Request a Call
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePage;
