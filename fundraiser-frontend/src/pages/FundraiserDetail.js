import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const FundraiserDetail = () => {
  const { id } = useParams(); // fundraiser ID from the URL
  const navigate = useNavigate(); // for redirecting on successful payment

  const [fundraiser, setFundraiser] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchFundraiser = async () => {
      try {
        // 1) Fetch the fundraiser by ID
        const { data } = await axios.get(`http://localhost:5000/api/fundraisers/${id}`);
        setFundraiser(data);
      } catch (err) {
        console.error("Error fetching fundraiser:", err);
        setError("Error fetching fundraiser details.");
      } finally {
        setLoading(false);
      }
    };
    fetchFundraiser();
  }, [id]);

  // Handle donation - create a Razorpay order, then open the Razorpay checkout
  const handleDonate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        setError("You must be logged in to donate.");
        return;
      }

      // 2) Block donation if fundraiser is pending or rejected
      if (fundraiser.status === "pending" || fundraiser.status === "rejected") {
        setError(`Cannot donate to a ${fundraiser.status} fundraiser.`);
        return;
      }

      // 3) Create Razorpay order on backend
      const createOrderRes = await axios.post(
        "http://localhost:5000/api/donations/create-razorpay-order",
        {
          fundraiserId: fundraiser._id,
          donationAmount: parseFloat(donationAmount),
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      const { orderId, key_id } = createOrderRes.data;
      if (!orderId || !key_id) {
        setError("Error creating Razorpay order. Please try again.");
        return;
      }

      // 4) Setup Razorpay options
      const options = {
        key: key_id,
        amount: parseFloat(donationAmount) * 100,
        currency: "INR",
        name: "Fundraiser Donation",
        description: "Donate to this cause",
        order_id: orderId,
        handler: async (resp) => {
          await verifyPayment(resp);
        },
        prefill: {
          // optional user data
          // can also do: userInfo.name, userInfo.email if you stored them
        },
        theme: { color: "#528FF0" },
      };

      // 5) Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
      setError("Error creating payment order. Please try again.");
    }
  };

  // 6) Verify Payment after successful Razorpay popup
  const verifyPayment = async (razorpayResponse) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.post(
        "http://localhost:5000/api/donations/verify-payment",
        {
          order_id: razorpayResponse.razorpay_order_id,
          payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      // Instead of staying on the same page, redirect to success page
      navigate("/donation-success");
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Payment verification failed. Please try again.");
    }
  };

  if (loading) return <p>Loading fundraiser details...</p>;
  if (error && !fundraiser) return <p className="text-red-500">{error}</p>;
  if (!fundraiser) return <p className="text-red-500">Fundraiser not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <h1 className="text-3xl font-bold mb-4">{fundraiser.title}</h1>
      <p className="mb-2">{fundraiser.description}</p>
      <p className="mb-2">
        <strong>Goal:</strong> ₹{fundraiser.goalAmount} | <strong>Raised:</strong> ₹{fundraiser.raisedAmount}
      </p>
      <p className="mb-2">
        <strong>Status:</strong> {fundraiser.status}
      </p>
      {fundraiser.image && (
        <img
          src={`http://localhost:5000${fundraiser.image}`}
          alt={fundraiser.title}
          className="w-full h-auto object-cover rounded mb-4"
        />
      )}

      {/* Show donation form if fundraiser is "active" or "successful" */}
      {(fundraiser.status === "active" || fundraiser.status === "successful") ? (
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
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Donate
          </button>
        </form>
      ) : (
        <p className="mt-4 text-gray-500">Donations are not available for this fundraiser.</p>
      )}
    </div>
  );
};

export default FundraiserDetail;
