import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AnimatedCard from '../components/AnimatedCard';
import { Link } from 'react-router-dom';
import ImageCarousel from "../components/ImageCarousel";
const Home = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/fundraisers');
        setFundraisers(data);
      } catch (error) {
        console.error('Error fetching fundraisers', error);
      }
    };

    fetchFundraisers();
  }, []);

  return (
    <div className='-mt-[28px]'   >
      <div>
        <div >
        <ImageCarousel />
        <div id="donate-section" className="mt-16 p-8 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold">Make a Difference Today</h2>
        <p className="mt-4 text-lg text-gray-600">
          Every contribution brings hope and support to those in need.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-semibold transition"
        onClick={() => navigate("/donate-fund")}
        >
          Proceed to Donate
        </button>
      </div>
    </div>
      </div>
     
    </div>
  );
};

export default Home;
