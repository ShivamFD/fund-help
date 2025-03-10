import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const EditFundraiser = () => {
  const { id } = useParams(); // ✅ Get fundraiser ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!id) {
      setError("Invalid fundraiser ID.");
      return;
    }

    const fetchFundraiser = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/fundraisers/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setTitle(data.title);
        setGoalAmount(data.goalAmount);
      } catch (err) {
        console.error("Error fetching fundraiser details:", err);
        setError("Error fetching fundraiser details.");
      }
    };

    fetchFundraiser();
  }, [id, userInfo.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('goalAmount', goalAmount);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`http://localhost:5000/api/fundraisers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      navigate('/mine'); // ✅ Redirect user to MyFundraiser page after update
    } catch (err) {
      console.error("Error updating fundraiser:", err);
      setError("Error updating fundraiser.");
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Fundraiser</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Goal Amount</label>
          <input
            type="number"
            value={goalAmount}
            onChange={e => setGoalAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            onChange={e => setImage(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Update Fundraiser
        </button>
      </form>
    </motion.div>
  );
};

export default EditFundraiser;
