import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import sign from "../../assets/sign.png";
import stamp from "../../assets/stamp.png";
import Spinner from "@/component/Spinner";

const Certificate = () => {
    const [user, setUser] = useState(null);
    const [course, setCourse] = useState(null);
    const { courseId, userId } = useParams();
    const [certificate, setCertificate] = useState(null);
    const certificateRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("https://backend-dup.onrender.com/api/certificates", { userId, courseId });
                if (response.status === 200) {
                    setUser(response.data.user);
                    setCourse(response.data.course);
                    setCertificate(response.data.certificate);
                }
            } catch (error) {
                console.error("Error fetching course/user data:", error);
            }
        };
        fetchData();
    }, [userId, courseId]);

    const handleDownloadPDF = () => {
        if (certificateRef.current) {
            html2canvas(certificateRef.current, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("landscape", "mm", "a4");
                const imgWidth = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                pdf.save("Certificate.pdf");
            });
        }
    };

    return (
        <div className="flex flex-col items-center  dark:bg-gray-900  justify-center bg-gray-200 p-6 min-h-screen md:h-[900px]">
            <div 
                ref={certificateRef} 
                className="relative bg-white shadow-2xl text-center w-full max-w-4xl md:w-[70%] md:h-[70%] lg:max-w-6xl border-[10px] border-black p-6 md:p-12 flex flex-col items-center justify-center"
                id="certificate"
            >
                <div className="absolute inset-[10px] md:inset-[20px] border-[5px] md:border-[10px] border-blue-600"></div>
                <div className="absolute text-[80px] md:text-[200px] text-blue-400 font-bold opacity-10">CODETECH</div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mt-4">Certificate of Completion</h1>
                <h2 className="text-lg md:text-2xl font-semibold text-gray-600 mt-2">
                    Presented by <span className="text-blue-600">Codetec</span>
                </h2>
                
                {user && course ? (
                    <>
                        <p className="text-sm md:text-lg mt-6">This is to certify that</p>
                        <h2 className="text-xl md:text-4xl font-bold mt-3 text-gray-900">{user.name}</h2>
                        <p className="text-sm md:text-lg mt-3">has successfully completed the course</p>
                        <h3 className="text-lg md:text-2xl font-semibold mt-3 text-gray-700">{course.courseName}</h3>
                        <p className="mt-6 text-gray-500 text-xs md:text-base">Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
                    </>
                ) : (
                    <Spinner />
                )}

                <div className="mt-8 flex flex-col md:flex-row justify-between items-center w-full max-w-2xl px-4 md:px-12">
                    <div className="w-full md:w-1/3 text-center text-gray-700 font-bold">
                        <span>{new Date().toLocaleDateString()}</span>
                        <span className="block">Date</span>
                    </div>
                    <div className="w-full md:w-1/3 text-center text-gray-700 font-bold flex flex-col items-center mt-4 md:mt-0">
                        <img src={sign} alt="Signature" className="h-8 md:h-12 w-auto mb-1" />
                        Authorized Signatory
                    </div>
                </div>

                <div className="absolute bottom-10 right-[50%] translate-x-1/2 w-16 md:w-24 h-16 md:h-24">
                    <img src={stamp} alt="Stamp" className="w-full h-full" />
                </div>
            </div>

            <button
                onClick={handleDownloadPDF}
                className="mt-8 bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-md hover:bg-blue-700 transition shadow-lg text-base md:text-lg font-semibold"
            >
                Download Certificate 
            </button>
        </div>
    );
};

export default Certificate;
