import React, { useEffect, useRef } from "react";

import Course from "./Course";
import Aboutus from "../assets/Aboutus.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Testimonial from "../component/Testimonial";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);


const Home = () => {
   const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);
  const courseSectionRef = useRef(null);

  useEffect(() => {
  

    // Set initial styles for the hero section elements
    gsap.set([heroTextRef.current, heroImageRef.current], {
      opacity: 0,
    });

    gsap.set(heroTextRef.current, {
      x: -50, 
      scale: 0.9, 
    });

    gsap.set(heroImageRef.current, {
      x: 50, 
      scale: 0.9, 
    });

    // Animate the hero text
    gsap.to(heroTextRef.current, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heroTextRef.current,
        start: "top 85%",
      },
    });

    // Animate the hero image
    gsap.to(heroImageRef.current, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heroImageRef.current,
        start: "top 85%",
      },
    });

    gsap.to(courseSectionRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: courseSectionRef.current,
        start: "top 85%",
      },
    });

   

    // Refresh ScrollTrigger to ensure it works correctly
    ScrollTrigger.refresh();
  }, []);


  return (
    <>
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 mt-12 text-gray-800 dark:text-gray-200 min-h-[90vh] flex items-center justify-center px-4 sm:px-8 xl:px-20 w-full">
  <div className="flex flex-col md:flex-row items-center max-w-7xl w-full mx-auto space-y-8 md:space-y-0 mt-8 md:space-x-12">
    {/* Text Content */}
    <div 
    ref={heroTextRef} 
    className="text-center md:text-left flex-1 w-full px-4">
      <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight mb-6">
        Getting <span className="text-blue-600 dark:text-blue-400">Quality Education</span> Is Now More{" "}
        <span className="text-blue-600 dark:text-blue-400">Easy</span>
      </h1>
      <p className="text-lg sm:text-xl xl:text-2xl mb-8">
        Provides you with the latest online learning system and materials that help your knowledge grow.
      </p>
      <Link
        to={"/courseexplore"}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Explore Courses
      </Link>
    </div>

    {/* Image Container */}
    <div ref={heroImageRef} className="relative flex-1 flex justify-center w-full">
      <img
        src="/Hero.png"
        alt="Hero"
        className="w-72 h-72 md:w-[500px] md:h-[500px] xl:h-[550px] mx-auto rounded-full object-cover"
      />
    </div>
  </div>
</section>


      {/* Course Section */}
      <section ref={courseSectionRef} >
        <Course />
      </section>

      {/* About Us Section */}
      <section className="bg-white dark:bg-gray-900 py-12 px-6 lg:px-20">
        <div className="container mx-auto">
          <h2 className="text-3xl xl:text-4xl font-extrabold text-gray-900 dark:text-white text-left mb-8">About Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
            <div >
              <img src={Aboutus} alt="About Us" className="rounded-lg shadow-lg" />
            </div>
            <div  >
              <p className="text-lg xl:text-xl text-gray-700 dark:text-gray-300 mb-6">
                Welcome to our eLearning Management System! Our platform is designed to make{" "}
                <span className="text-blue-600 font-semibold">education</span> accessible, engaging, and effective.
              </p>
              <p className="text-lg xl:text-xl text-gray-700 dark:text-gray-300 mb-6">
                Our mission is to provide top-notch learning tools and virtual classrooms, powered by{" "}
                <span className="text-blue-600 font-semibold">innovation</span> and advanced technology.
              </p>
              <p className="text-lg xl:text-xl text-gray-700 dark:text-gray-300">
                Join us on this journey of <span className="text-blue-600 font-semibold">success</span> and limitless learning opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section  className="">
        <Testimonial />
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white py-6 md:h-72 xl:h-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 xl:gap-10">
            <div>
              <h3 className="text-lg xl:text-xl font-semibold mb-4">Company</h3>
              <ul>
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Courses</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg xl:text-xl font-semibold mb-4">Support</h3>
              <ul>
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg xl:text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
                <a href="#" className="hover:text-blue-600"><FaTwitter /></a>
                <a href="#" className="hover:text-blue-600"><FaInstagram /></a>
                <a href="#" className="hover:text-blue-600"><FaLinkedin /></a>
              </div>
            </div>
            <div>
              <h3 className="text-lg xl:text-xl font-semibold mb-4">Newsletter</h3>
              <p className="mb-4">Sign up for our newsletter to get the latest updates.</p>
              <form className="flex">
                <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l-md text-gray-800 dark:text-gray-200" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
            <p>&copy; 2025 Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
