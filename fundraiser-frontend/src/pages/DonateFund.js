import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AnimatedCard from "../components/AnimatedCard"; // Ensure the correct path

const DonateFund = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        // Fetch only "active" fundraisers
        const { data } = await axios.get("http://localhost:5000/api/fundraisers?status=active");
        setFundraisers(data);
      } catch (err) {
        console.error("Error fetching fundraisers:", err);
        setError("Error fetching fundraisers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFundraisers();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading fundraisers...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Fundraisers</h1>

      {fundraisers.length === 0 ? (
        <p className="text-center text-gray-500">No active fundraisers available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fundraisers.map((fundraiser) => (
            <Link key={fundraiser._id} to={`/fundraiser/${fundraiser._id}`}>
              <AnimatedCard>
                {fundraiser.image && (
                  <img
                    src={`http://localhost:5000${fundraiser.image}`}
                    alt={fundraiser.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{fundraiser.title}</h2>
                <p className="text-gray-600 mb-2">{fundraiser.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">₹{fundraiser.goalAmount}</span>
                  <span className="text-green-600 font-bold">₹{fundraiser.raisedAmount}</span>
                </div>
              </AnimatedCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonateFund;
