import { useEffect, useState } from "react";
import React from "react";
import SearchResult from "../component/SearchResult";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CourseExplore = () => {
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortOrder, setSortOrder] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedDuration, setSelectedDuration] = useState(""); 
    const [selectedPriceRange, setSelectedPriceRange] = useState(""); 

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search");

    const getAllCourses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("https://backend-dup.onrender.com/course");
            const courses = response.data.data;
            console.log(courses);
            
            setAllCourses(Array.isArray(courses) ? courses : []);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setAllCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    useEffect(() => {
        let filtered = [...allCourses];

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(course => selectedCategories.includes(course.category));
        }

        if (selectedLevel) {
            filtered = filtered.filter(course => course.courseLevel === selectedLevel);
        }

        if (selectedPriceRange) {
            if (selectedPriceRange === "Low") {
                filtered = filtered.filter(course => course.coursePrice <= 499);
            } else if (selectedPriceRange === "Medium") {
                filtered = filtered.filter(course => course.coursePrice > 499 && course.coursePrice <= 999);
            } else if (selectedPriceRange === "High") {
                filtered = filtered.filter(course => course.coursePrice > 999);
            }
        }

        if (selectedDuration) {
            const [min, max] = selectedDuration.split("-").map(Number);
            filtered = filtered.filter(course => course.courseDuration >= min && course.courseDuration <= max);
        }

        if (sortOrder) {
            filtered.sort((a, b) => sortOrder === "priceLowToHigh" ? a.coursePrice - b.coursePrice : b.coursePrice - a.coursePrice);
        }

        setFilteredCourses(filtered);
    }, [selectedCategories, selectedLevel, selectedPriceRange, selectedDuration, sortOrder, allCourses]);

    return (
        <section className="dark:bg-gray-900 w-full  min-h-screen flex flex-col mt-12">
            <div className="flex max-w-7xl mx-auto p-6 flex-col md:flex-row bg-white mt-4 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[70vh]">
                <aside className="w-full md:w-1/4 p-6 md:p-10 bg-gray-50 dark:bg-gray-800 shadow-lg mt-6 rounded-lg top-4">
                    <h3 className="text-xl font-semibold mb-4 text-center border-b pb-4">Filters</h3>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Sort By:</label>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <option value="">Default</option>
                            <option value="priceLowToHigh">Price: Low to High</option>
                            <option value="priceHighToLow">Price: High to Low</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Level:</label>
                        <select name="level" onChange={(e) => setSelectedLevel(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <option value="">All</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Medium">Medium</option>
                            <option value="Advance">Advance</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Price Range (INR):</label>
                        <select value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <option value="">All</option>
                            <option value="Low">₹100 - ₹499</option>
                            <option value="Medium">₹500 - ₹999</option>
                            <option value="High">₹1000+</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Duration (Hours):</label>
                        <select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <option value="">All</option>
                            <option value="1-10">1 - 10 Hours</option>
                            <option value="11-20">11 - 20 Hours</option>
                            <option value="21-30">21 - 30 Hours</option>
                        </select>
                    </div>
                </aside>

                <main className="flex-1 p-6 -mt-4">
                    <h1 className="text-3xl font-bold mb-5 text-center">Explore Courses</h1>
                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredCourses.map((course) => (
                                <SearchResult key={course._id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No courses found</p>
                    )}
                </main>
            </div>
        </section>
    );
};

export default CourseExplore;
