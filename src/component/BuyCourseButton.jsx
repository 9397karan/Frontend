import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React from "react";

const stripePromise = loadStripe("pk_test_51Qmu74G7hLxsSjVpwP3gm11GcCsLOwSNXJNknNfyUo5g77SRdAjIpNKz05NMVFYhrqRpKfJtKFfSMVwcZF1gg9Dw00zCd3pN1K");


const BuyCourseButton = ({ courseId, userId }) => {
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      const response = await axios.post("https://backend-dup.onrender.com/api/create-checkout-session", {
        userId,
        courseId,
      });

      const session = response.data; 

      if (session.success) {
        
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        console.error("Error:", session.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error.response?.data || error.message);
    }
  };

  return (
    <button onClick={handleCheckout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Buy Course</button>
  );
};

export default BuyCourseButton;
