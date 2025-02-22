import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import api from "@/utils/api";

const InstructorTable = () => {
  const [tabled, setTable] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await api.get("course/instructors/revenue");
      setTable(res.data.data);
    };
    fetchDetails();
  }, []);

  console.log(tabled);

  return (
    <div className="p-8 bg-gray-100 min-h-screen dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        All Instructors
      </h1>

      <Table>
        <TableCaption>Instructor Revenue Overview</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Enrolled Students</TableHead>
            <TableHead>Total Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tabled.map((course) => (
            <TableRow key={course._id}>
              <Link to={`/admin/instructor/${course._id}/course`}>
                <TableCell>{course.userInfo.name}</TableCell>
              </Link>
              <TableCell>{course.totalStudents}</TableCell>
              <TableCell>{course.totalRevenue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstructorTable;
