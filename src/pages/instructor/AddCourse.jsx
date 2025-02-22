import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form } from "react-router-dom";
import { FormItem } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";

const AddCoursePage = () => {

   const instructorId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;

  const [courseForm, setCourseForm] = useState({
    courseName: "",
    courseLevel: "Beginner",
    coursePrice: "",
    creator: instructorId,
    category: "",
    courseDuration: "",
    courseDesc: "",
    file: "",
    id: null,
  });

  const [coursePicPreview, setCoursePicPreview] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading spinner

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({ ...courseForm, [name]: value });
  };

  const handleCoursePicChange = (e) => {
    const file = e.target.files[0];
    setCourseForm({ ...courseForm, file: file });
    if (file) {
      setTimeout(() => {
        setCoursePicPreview(URL.createObjectURL(file));
      }, 1000);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(courseForm).forEach((key) => {
      if (key !== "id") {
        formData.append(key, courseForm[key]);
      }
    });

    setLoading(true); // Set loading to true when submitting the form

    try {
      const response = await axios.post("https://backend-dup.onrender.com/course/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      setCourseForm({ ...courseForm, id: response.data.courseId });
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Failed to add course."}`);
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div className="p-8 bg-gray-400 dark:bg-gray-600  text-white min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Add Course</h1>
        
      </div>
      <Form onSubmit={handleCourseSubmit}>
        <FormItem>
          <Label>Course Name</Label>
          <Input
            name="courseName"
            value={courseForm.courseName}
            onChange={handleCourseChange}
            required
          />
        </FormItem>
        <FormItem>
          <Label>Course Level</Label>
          <select
            name="courseLevel"
            value={courseForm.courseLevel}
            onChange={handleCourseChange}
            required
            className="block w-full px-4 py-2  dark:bg-black border bg-white dark:text-white text-black border-gray-300 rounded-md "
          >
            <option value="Beginner">Beginner</option>
            <option value="Medium">Medium</option>
            <option value="Advance">Advance</option>
          </select>
        </FormItem>
        <FormItem>
          <Label>Course Price</Label>
          <Input
            name="coursePrice"
            type="number"
            className="block w-full px-4 py-2  dark:bg-black border bg-white dark:text-white text-black border-gray-300 rounded-md"
            value={courseForm.coursePrice}
            onChange={handleCourseChange}
          />
        </FormItem>
        <FormItem>
          <Label>Category</Label>
          <select
            name="category"
            value={courseForm.category}
            onChange={handleCourseChange}
            className="block w-full px-4 py-2  dark:bg-black border bg-white dark:text-white text-black border-gray-300 rounded-md "
          >
            <option value="Data Science">Data Science</option>
            <option value="Next JS">Next JS</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Fullstack Development">Fullstack Development</option>
            <option value="MERN Stack Development">MERN Stack Development</option>
            <option value="Javascript">Javascript</option>
            <option value="Python">Python</option>
            <option value="Docker">Docker</option>
            <option value="MongoDB">MongoDB</option>
            <option value="HTML">HTML</option>
          </select>
        </FormItem>
        <FormItem>
          <Label>Course Duration</Label>
          <Input
            name="courseDuration"
             className="block w-full px-4 py-2  dark:bg-black border bg-white dark:text-white text-black border-gray-300 rounded-md"
            value={courseForm.courseDuration}
            onChange={handleCourseChange}
            required
          />
        </FormItem>
        <FormItem>
          <Label>Course Description</Label>
          <Textarea
            name="courseDesc"
             className="block w-full px-4 py-2  dark:bg-black border bg-white dark:text-white text-black border-gray-300 rounded-md"
            value={courseForm.courseDesc}
            onChange={handleCourseChange}
            required
          />
        </FormItem>
        <FormItem>
          <Label>Course Image</Label>
          <Input type="file" onChange={handleCoursePicChange} required />
          {coursePicPreview && (
            <img
              src={coursePicPreview}
              alt="Course Preview"
              className="mt-2 w-48 h-48 object-cover"
            />
          )}
        </FormItem>
        {loading ? (
          <Loader /> 
        ) : (
          <Button type="submit" className="mt-4">Add Course</Button>
        )}

{courseForm.id && (
          <Link to={`/instructor/course/${courseForm.id}/add_lessons`} className="p-3 m-2 rounded-md text-white bg-gray-800" >
            Add Lesson
          </Link>
        )}
      </Form>
    </div>
  );
};

export default AddCoursePage;
