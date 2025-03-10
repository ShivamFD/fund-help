// src/pages/DonationCancel.js
import React from "react";
import { Link } from "react-router-dom";

const DonationCancel = () => {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Donation Cancelled</h1>
      <p>Your donation was cancelled. Please try again if you wish to donate.</p>
      <Link to="/" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
        Go to Home
      </Link>
    </div>
  );
};

export default DonationCancel;
