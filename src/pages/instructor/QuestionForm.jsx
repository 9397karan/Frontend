import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useParams } from 'react-router-dom';

const QuestionForm = () => {
    const { courseId } = useParams(); 
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null;

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [maxScore, setMaxScore] = useState('');
    const [totalQuestions, setTotalQuestions] = useState('');
    const [passingScore, setPassingScore] = useState('');
    const [questions, setQuestions] = useState([]);

    // Fetch questions from API
    const fetchQuestions = async () => {
        try {
            const res = await api.get(`/api/questions/${courseId}`);
            console.log('API Response:', res.data);
    
            if (!Array.isArray(res.data)) {
                console.error('Unexpected API response format:', res.data);
                return;
            }
    
            setQuestions(res.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [courseId]); 

    // Add a new question
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newQuestion = { courseId, userId, question, options, correctAnswer, maxScore, totalQuestions, passingScore };

        try {
            const res = await api.post('/api/questions/add', newQuestion);
            setQuestions((prev) => [...prev, res.data.question]);
            setQuestion('');
            setOptions(['', '', '', '']);
            setCorrectAnswer('');
            setMaxScore('');
            setTotalQuestions('');
            setPassingScore('');
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    // Delete a question
    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/questions/delete/${id}`);
            setQuestions((prev) => prev.filter((q) => q._id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div className="p-6 rounded-lg mt-6 shadow-md transition duration-300 dark:bg-gray-800 dark:text-white bg-white text-gray-900">
            <h2 className="text-xl font-bold mb-4">Manage Questions</h2>

            {/* Add Question Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter question"
                    required
                    className="w-full p-2 border rounded-lg dark:text-black focus:outline-none focus:ring focus:ring-blue-500"
                />
                {options.map((option, index) => (
                    <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                        required
                        className="w-full p-2 border rounded-lg dark:text-black focus:outline-none focus:ring focus:ring-blue-500"
                    />
                ))}
                <input
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="Correct Answer"
                    required
                    className="w-full p-2 border rounded-lg focus:outline-none dark:text-black focus:ring focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    placeholder="Max Score"
                    required
                    className="w-full p-2 border rounded-lg focus:outline-none dark:text-black focus:ring focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    placeholder="Total Questions"
                    
                    className="w-full p-2 border rounded-lg focus:outline-none dark:text-black focus:ring focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    placeholder="Passing Score"
                 
                    className="w-full p-2 border rounded-lg focus:outline-none dark:text-black focus:ring focus:ring-blue-500"
                />
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Add Question
                </button>
            </form>

            {/* Display Questions List */}
            {questions.length > 0 ? (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">All Questions</h3>
                    <ul className="space-y-2">
                        {questions.map((q) => (
                            <li key={q._id} className="p-2 border rounded-lg flex justify-between items-center">
                                <span>{q.question}</span>
                                <button
                                    onClick={() => handleDelete(q._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="mt-4 text-gray-500">No questions available.</p>
            )}
        </div>
    );
};

export default QuestionForm;
