import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import Spinner from "../../component/Spinner";
import Loader from "@/component/Loader";

const AddLesson = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [lectures, setLectures] = useState([]);
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://backend-dup.onrender.com/lecture/${courseId}`);
      setLectures(response?.data?.lectures || []);
    } catch (error) {
      console.log("Failed to fetch course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      alert("Please provide all required fields.");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("isPreview", isPreview);

    try {
      const response = await axios.post(
        `https://backend-dup.onrender.com/course/${courseId}/add_lessons`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      fetchLessons();

      setTitle("");
      setFile(null);
      setIsPreview(false);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lectureId, lessonId) => {
    try {
      const response = await axios.delete(
        `https://backend-dup.onrender.com/lecture/delete-lesson/${lectureId}/${lessonId}`
      );
      if (response.status === 200) {
        alert("Lesson deleted successfully!");
        fetchLessons();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete the lesson.");
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-300">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-bold mb-6">Add Lesson</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-2">Title</Label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-2">Video</Label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {file && <p className="text-sm text-green-600 mt-2">Selected file: {file.name}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
              className="toggle"
            />
            <label className="ml-2">Is this video FREE?</label>
          </div>
          <div className="flex flex-wrap space-x-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md flex-grow sm:w-auto">
              {saving ? <Loader /> : "Save Lesson"}
            </button>
            <button
              onClick={() => {
                setTitle("");
                setFile(null);
                setIsPreview(false);
                document.querySelector('input[type="file"]').value = "";
              }}
              type="reset"
              className="bg-red-600 text-white px-4 py-2 rounded-md flex-grow sm:w-auto"
            >
              Reset
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-xl font-bold mt-6">Lectures</h3>
          {loading ? (
            <Loader />
          ) :  lectures.length === 0 ? (
            <p className="text-center text-gray-600">No lectures found. Start by adding a lesson.</p>
          ) : (
            lectures.map((lecture) => (
              <div key={lecture._id} className="mb-6">
                <h4 className="text-lg font-semibold">
                  {lecture?.course?.courseName || "Course Name Not Found"}
                </h4>
                <ul>
                  {lecture.lessons.map((lesson) => (
                    <li key={lesson?.id} className="flex flex-col sm:flex-row items-center justify-between border p-4 rounded-md mb-4">
                      <div className="w-full">
                        <h5 className="font-bold">{lesson?.title || "Untitled Lesson"}</h5>
                        <div className="mt-2 md:w-[60%]">
                          <ReactPlayer url={lesson?.video_URL} controls width="100%" height="auto" />
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(lecture._id, lesson.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 sm:mt-0 sm:w-auto sm:ml-4"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
