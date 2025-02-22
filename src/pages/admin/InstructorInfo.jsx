import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useParams } from 'react-router-dom'
import api from '@/utils/api'

export const InstructorInfo = () => {
  const [details, setDetails] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await api.get(`/course/instructors/${id}/courses`);
      setDetails(res.data.data);
    };
    fetchDetails();
  }, [id]);  // Add `id` as a dependency to refetch when `id` changes

  return (
    <Table>
      <TableCaption>List of courses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Index</TableHead>
          <TableHead>Course Name</TableHead>
          <TableHead>No. of Students</TableHead>
          <TableHead>Course Price</TableHead>
          <TableHead className="text-right">Total earned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {details.map((course, index) => (
          <TableRow key={course._id}>
            <TableCell className="font-medium">{index + 1}</TableCell> {/* Display actual index */}
            <TableCell>{course.courseName}</TableCell>
            <TableCell>{course.totalStudents}</TableCell>
            <TableCell>{course.coursePrice}</TableCell>
            <TableCell className="text-right">{course.totalRevenue}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
