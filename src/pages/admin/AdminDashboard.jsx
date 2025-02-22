import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/utils/api';
import { Activity, Book, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const AdminDashboard = () => {
    const [info, setInfo] = useState({ students: 0, instructors: 0, popularCourses: [] });

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await api.get('/course/dashboard');
            setInfo(res.data);
            console.log(res.data);
        };
        fetchDetails();
    }, []);

    return (
        <section className="dark:bg-gray-900 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-2xl rounded-lg p-2">
            <CardHeader className="flex items-center">
              <Activity className="w-10 h-10 mr-4" />
              <CardTitle className="text-base">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold">{info.students}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-2xl rounded-lg p-2">
            <CardHeader className="flex items-center">
              <Book className="w-10 h-10 mr-4" />
              <CardTitle className="text-base">Total Instructors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold">{info.instructors}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-800 p-2 sm:p-6 rounded-lg shadow-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" /> Popular Courses
          </h2>
          <div className="min-w-full">
            <table className="w-full border-collapse border border-gray-700 text-white text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="border border-gray-700 px-2 py-2">Course Name</th>
                  <th className="border border-gray-700 px-2 py-2">Level</th>
                  <th className="border border-gray-700 px-2 py-2">Price (₹)</th>
                  <th className="border border-gray-700 px-2 py-2">Enrolled Users</th>
                </tr>
              </thead>
              <tbody>
                {info.popularCourses.map((course) => (
                  <tr key={course._id} className="text-center bg-gray-800 hover:bg-gray-700 transition">
                    <td className="border border-gray-700 px-2 py-2">{course.courseName}</td>
                    <td className="border border-gray-700 px-2 py-2">{course.courseLevel}</td>
                    <td className="border border-gray-700 px-2 py-2">{course.coursePrice}</td>
                    <td className="border border-gray-700 px-2 py-2">{course.enrolledUserCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
};
