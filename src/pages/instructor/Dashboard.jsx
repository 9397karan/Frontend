import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/card";
import api from "@/utils/api";


const Dashboard = () => {
  const instructorId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;
 
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/course/total-students-revenue/${instructorId}`);
      console.log(res);
      setData(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 mt-10 bg-gray-100 min-h-screen dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Dashboard</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-700 to-blue-500">
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-700 to-purple-500">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.totalRevenue}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
