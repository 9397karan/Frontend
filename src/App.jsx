import CourseDetails from './pages/CourseDetails';
import CourseExplore from './pages/CourseExplore';
import Home from './pages/Home.jsx';
import React from 'react';
import MainLayout from './component/MainLayout';
import { createBrowserRouter, Navigate, RouterProvider,useLocation } from "react-router-dom";
import Dashboard from './pages/instructor/Dashboard';
import Sidebar from './pages/instructor/Sidebar';
import CourseTable from './pages/instructor/CourseTable';
import AddCourse from './pages/instructor/AddCourse';
import AddLesson from './pages/instructor/AddLesson';
import LecturePage from './pages/LecturePage';
import UserDashboard from './pages/User/UserDashboard';
import UserSidebar from './pages/User/UserSidebar';
import MyLearning from './pages/User/MyLearning';
import Login from './pages/login';
import Register from './pages/Register';
import Sidebar2 from './pages/admin/Sidebar2';
import { Instructor } from './pages/admin/Instructor';
import { AllUser } from './pages/admin/AllUser';
import { InstructorInfo } from './pages/admin/InstructorInfo';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import QuestionForm from './pages/instructor/QuestionForm';
import Quiz from './pages/Quiz';
import Certificate from './pages/User/Certificate';
import { Room } from './pages/instructor/Room';
import MeetingsPage from './pages/instructor/MeetingsPage';
import { ToastContainer } from 'react-toastify';


export const AdminProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const location = useLocation();

  if (user && user?.role === "admin") {
    return children;
  } else {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
};


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "course/:courseId/quiztest",
        element: <Quiz />,
      },
      {
        path: "courseexplore",
        element: <CourseExplore />,
      },
      {
        path: "certificate/:userId/:courseId",
        element: <Certificate />,
      },
      {
        path: "course-detail/:courseId",
        element: <CourseDetails />,
      },
      {
        path: "course-progress/:courseId",
        element: <LecturePage />,
      },
      // Instructor Routes
      {
        path: "instructor",
        element: <Sidebar />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course/meeting",
            element: <MeetingsPage />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId/add_lessons",
            element: <AddLesson />,
          },
          {
            path: "course/:courseId/addquestions",
            element: <QuestionForm />,
          },
          {
            path: "course/edit/:id",
            element: <AddCourse />,
          },
        ],
      },
      // User Routes
      {
        path: "user",
        element: <UserSidebar />,
        children: [
          {
            path: "dashboard",
            element: <UserDashboard />,
          },
          {
            path: "my-learning",
            element: <MyLearning />,
          },
        ],
      },
      // Admin Routes
      {
        path: "admin",
        element:(<AdminProtectedRoute> <Sidebar2 /> </AdminProtectedRoute>),
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "instructor",
            element: <Instructor />,
          },
          {
            path: "allusers",
            element: <AllUser />,
          },
          {
            path: "instructor/:id/course",
            element: <InstructorInfo />,
          },
        ],
      },
    ],
  },
  // Meeting Route (Outside MainLayout to remove nav)
  {
    path: "meeting/:roomID",
    element: <Room />,
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
      <ToastContainer />
    </main>
  );
}

export default App;

