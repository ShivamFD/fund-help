import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    if (!storedUser) {
      navigate('/login');
    } else {
      setUserInfo(storedUser);
    }
  }, [navigate]);

  if (!userInfo) {
    return null;
  }

  return (
    <motion.div 
      className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Welcome to Your Profile
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Profile Details */}
        <div className="md:w-1/2 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Details</h2>
          <div className="mb-4">
            <span className="font-semibold text-gray-600">Name:</span> {userInfo.name}
          </div>
          <div className="mb-4">
            <span className="font-semibold text-gray-600">Email:</span> {userInfo.email}
          </div>
          <div className="mt-6">
            <Link
              to="/update-profile"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </Link>
          </div>
        </div>

        {/* Right Side - My Fundraiser Section */}
        <div className="md:w-1/2 bg-green-50 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">Your Fundraising Journey</h2>
          <p className="text-gray-700 mb-6">
            Manage your fundraiser by viewing, editing, or deleting it. Click the button below to go to your fundraiser page.
          </p>
          <button
            onClick={() => navigate('/mine')}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
          >
            Go to My Fundraiser
          </button>
        </div>
      </div>

      {/* My Donations Section */}
      <div className="mt-10 p-6 bg-yellow-50 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-3 text-yellow-700">Your Donation History</h2>
        <p className="text-gray-700 mb-4">
          View all the contributions you've made to help others in need.
        </p>
        <Link
          to="/my-donations"
          className="bg-yellow-600 text-white py-2 px-6 rounded-lg hover:bg-yellow-700 transition"
        >
          View My Donations
        </Link>
      </div>
    </motion.div>
  );
};

export default Profile;
