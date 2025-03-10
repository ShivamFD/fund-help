// src/pages/Donate.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Donate = () => {
  const { id } = useParams(); // Fundraiser ID
  const [donationAmount, setDonationAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDonate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    if (!userInfo) {
      setError("You must be logged in to donate.");
      setLoading(false);
      return;
    }

    try {
      // Create Razorpay order via backend
      const response = await axios.post(
        "http://localhost:5000/api/donations/create-razorpay-order",
        { fundraiserId: id, donationAmount: parseFloat(donationAmount) },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const { orderId } = response.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Set this in .env (frontend)
        amount: donationAmount * 100, // in paise
        currency: "INR",
        name: "Fundraiser Donation",
        description: "Support this cause",
        order_id: orderId,
        handler: function (response) {
          verifyPayment(response);
        },
        prefill: {
          email: userInfo.email,
        },
        theme: { color: "#528FF0" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      console.error("Error creating payment order:", err);
      setError(err.response?.data?.message || "Error processing donation.");
      setLoading(false);
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    try {
      await axios.post(
        "http://localhost:5000/api/donations/verify-payment",
        {
          order_id: razorpayResponse.razorpay_order_id,
          payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      navigate("/donation-success");
    } catch (error) {
      setError("Payment verification failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Donate to Fundraiser</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center mb-4">Processing payment...</p>}
      <form onSubmit={handleDonate} className="space-y-4">
        <div>
          <label className="block text-gray-700">Donation Amount (INR)</label>
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            min="1"
            placeholder="Enter amount in ₹"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Donate with Razorpay
        </button>
      </form>
    </div>
  );
};

export default Donate;
