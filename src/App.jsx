import CourseDetails from './pages/CourseDetails';
import CourseExplore from './pages/CourseExplore';
import Home from './pages/Home.jsx';
import React, { useState, useEffect } from 'react';
import MainLayout from './component/MainLayout';
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from "react-router-dom";
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
import SplashScreen from './SplashScreen';

// Admin Protected Route
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

// Router Configuration
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
        element: <AdminProtectedRoute><Sidebar2 /></AdminProtectedRoute>,
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

// App Component
function App() {
  const [loading, setLoading] = useState(true);
   const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if the app has been loaded before in this session
    const hasAppLoadedBefore = sessionStorage.getItem('hasAppLoadedBefore');

    if (hasAppLoadedBefore) {
      // If the app has loaded before in this session, skip the splash screen
      setLoading(false);
    } else {
      // If the app is loading for the first time in this session, set the flag in sessionStorage
      sessionStorage.setItem('hasAppLoadedBefore', 'true');
    }

     const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);
    const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted PWA installation");
        } else {
          console.log("User dismissed PWA installation");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  return (
    <main>
      {loading ? (
        <SplashScreen onComplete={() => setLoading(false)} />
      ) : (
        <>
          <RouterProvider router={appRouter} />
          <ToastContainer />
          {showInstallButton && (
            <button 
              onClick={handleInstallClick} 
              style={{
                position: "fixed", bottom: "20px", right: "20px",
                padding: "10px 20px", backgroundColor: "#007bff", color: "#fff",
                border: "none", borderRadius: "5px", cursor: "pointer",
                fontSize: "16px"
              }}>
              Install App
            </button>
          )}
        </>
      )}
    </main>
  );
}

export default App;
