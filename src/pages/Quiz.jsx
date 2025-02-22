import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [passingScore, setPassingScore] = useState(null);
    const [passed, setPassed] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const { courseId } = useParams();
    const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id : null;

    useEffect(() => {
        // Check if user already passed
        const storedScore = localStorage.getItem(`quiz_score_${courseId}`);
        const storedPassed = localStorage.getItem(`quiz_passed_${courseId}`);

        if (storedScore && storedPassed) {
            setScore(parseInt(storedScore));
            setPassed(storedPassed === "true");
            return; 
        }

        axios.get(`https://backend-dup.onrender.com/api/questions/${courseId}`)
            .then(res => {
                setQuestions(res.data);
                if (res.data.length > 0) {
                    setPassingScore(res.data[0].passingScore); 
                }
            })
            .catch(err => console.error(err));
    }, [courseId]);

    const handleChange = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = () => {
        axios.post('https://backend-dup.onrender.com/api/questions/submit-quiz', { userId, courseId, answers })
            .then(res => {
                setScore(res.data.score);
                setPassed(res.data.passed);

                // Store in localStorage
                localStorage.setItem(`quiz_score_${courseId}`, res.data.score);
                localStorage.setItem(`quiz_passed_${courseId}`, res.data.passed);

                console.log(res.data);
            })
            .catch(err => console.error(err));
    };
    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    const handleReattempt = () => {
        setScore(null);
        setPassed(false);
        setAnswers({});
        setCurrentQuestionIndex(0);

        localStorage.removeItem(`quiz_score_${courseId}`);
        localStorage.removeItem(`quiz_passed_${courseId}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white p-6">
            <div className="bg-gray-200 dark:bg-gray-800 shadow-xl rounded-lg p-6 w-full max-w-2xl transition-all transform hover:scale-105">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-6">
                    Quiz
                </h2>

                {passed ? (
                    // Show only score & certificate if user passed
                    <div className="text-center mt-6 bg-gray-900 text-white p-6 rounded-lg shadow-md">
                        <p className="text-lg font-bold mb-4">Your Score: {score}</p>
                        <button
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-2 rounded-lg transition-all"
                            onClick={() => (window.location.href = `/certificate/${userId}/${courseId}`)}
                        >
                            Download Certificate
                        </button>
                    </div>
                ) : score !== null ? (
                    // Show only score & reattempt button if failed
                    <div className="text-center mt-6 bg-gray-900 text-white p-6 rounded-lg shadow-md">
                        <p className="text-lg font-bold mb-4">Your Score: {score}</p>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg transition-all"
                            onClick={handleReattempt}
                        >
                            Reattempt Quiz
                        </button>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
                        <p className="text-gray-800 dark:text-gray-300 text-lg">
                            No questions available for this course.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Question Card */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-all">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                {questions[currentQuestionIndex].question}
                            </h3>
                            <div className="space-y-3">
                                {questions[currentQuestionIndex].options.map((option) => (
                                    <label
                                        key={option}
                                        className="block bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-md cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-600 transition-all"
                                    >
                                        <input
                                            type="radio"
                                            name={questions[currentQuestionIndex]._id}
                                            value={option}
                                            className="mr-2 accent-blue-600"
                                            checked={answers[questions[currentQuestionIndex]._id] === option}
                                            onChange={() => handleChange(questions[currentQuestionIndex]._id, option)}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                className={`px-6 py-2 rounded-lg text-white font-bold transition-all ${
                                    currentQuestionIndex === 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gray-700 hover:bg-gray-800"
                                }`}
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>

                            {currentQuestionIndex < questions.length - 1 ? (
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg transition-all"
                                    onClick={handleNext}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg transition-all"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Quiz;
