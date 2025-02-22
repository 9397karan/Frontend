import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    visible && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-[#111827] text-white z-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center px-4 w-full flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Stylish Code-Inspired Logo */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center transform rotate-45">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 md:h-16 md:w-16 text-white transform -rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </motion.svg>
            </div>
          </motion.div>

          {/* Animated Heading */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mt-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            CodeTech
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.p
            className="text-lg md:text-xl mt-4 text-gray-300 max-w-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Empowering Learning, One Code at a Time
          </motion.p>

          {/* Animated Loader */}
          <motion.div
            className="mt-6 md:mt-8 w-10 h-10 md:w-12 md:h-12 border-4 border-t-transparent border-white rounded-full animate-spin"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          />
        </motion.div>
      </motion.div>
    )
  );
}