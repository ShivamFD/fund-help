
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AdminFundraiserApprove = () => {
//   const [pendingFundraisers, setPendingFundraisers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPendingFundraisers = async () => {
//       try {
//         // 1) Get admin info/token from localStorage
//         const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
//         if (!adminInfo || !adminInfo.token) {
//           // If no admin token, redirect to login
//           navigate("/login");
//           return;
//         }

//         // 2) Fetch all fundraisers from your admin route
//         // e.g., GET /api/admin/fundraisers
//         const response = await axios.get("http://localhost:5000/api/admin/fundraisers", {
//           headers: { Authorization: `Bearer ${adminInfo.token}` },
//         });

//         // 3) Filter only "pending" status
//         const allFundraisers = response.data;
//         const pending = allFundraisers.filter((f) => f.status === "pending");

//         setPendingFundraisers(pending);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching pending fundraisers:", err);
//         setError("Error fetching pending fundraisers.");
//         setLoading(false);
//       }
//     };

//     fetchPendingFundraisers();
//   }, [navigate]);

//   // Loading / Error states
//   if (loading) return <p>Loading pending fundraisers...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   // If no pending fundraisers
//   if (pendingFundraisers.length === 0) {
//     return <p className="text-gray-500">No pending fundraisers found.</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
//       <h1 className="text-3xl font-bold mb-6 text-center">Pending Fundraiser Approvals</h1>
//       {pendingFundraisers.map((fundraiser) => (
//         <FundraiserApprovalCard key={fundraiser._id} fundraiser={fundraiser} />
//       ))}
//     </div>
//   );
// };

// const FundraiserApprovalCard = ({ fundraiser }) => {
//   const [rejectionMessage, setRejectionMessage] = useState("");

//   const handleApprove = async () => {
//     try {
//       const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
//       await axios.put(
//         `http://localhost:5000/api/admin/fundraisers/${fundraiser._id}/status`,
//         { status: "active" }, // Approve
//         { headers: { Authorization: `Bearer ${adminInfo.token}` } }
//       );
//       window.location.reload(); // Refresh to remove from pending
//     } catch (err) {
//       console.error("Error approving fundraiser:", err);
//       alert("Error approving fundraiser. Check console for details.");
//     }
//   };

//   const handleReject = async () => {
//     if (!rejectionMessage.trim()) {
//       alert("Please provide a rejection reason.");
//       return;
//     }
//     try {
//       const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
//       await axios.put(
//         `http://localhost:5000/api/admin/fundraisers/${fundraiser._id}/status`,
//         {
//           status: "rejected",
//           rejectionMessage,
//         },
//         { headers: { Authorization: `Bearer ${adminInfo.token}` } }
//       );
//       window.location.reload(); // Refresh to remove from pending
//     } catch (err) {
//       console.error("Error rejecting fundraiser:", err);
//       alert("Error rejecting fundraiser. Check console for details.");
//     }
//   };

//   return (
//     <div className="border w-full ml-[16rem] p-4 rounded shadow mb-4 bg-white sm:ml-[0]">
//       <h2 className="text-xl font-bold mb-2">{fundraiser.title}</h2>
//       <p className="mb-1">{fundraiser.description}</p>
//       <p className="mb-1">
//         <strong>Goal:</strong> ₹{fundraiser.goalAmount} | <strong>Raised:</strong> ₹{fundraiser.raisedAmount}
//       </p>
//       {fundraiser.image && (
//         <img
//           src={`http://localhost:5000${fundraiser.image}`}
//           alt={fundraiser.title}
//           className="w-32 h-32 object-cover rounded-md mt-2"
//         />
//       )}
//       <div className="flex gap-4 mt-4">
//         <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//           Approve
//         </button>
//         <button onClick={handleReject} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
//           Reject
//         </button>
//       </div>
//       <input
//         type="text"
//         className="mt-2 w-full px-3 py-2 border rounded"
//         placeholder="Enter rejection reason"
//         value={rejectionMessage}
//         onChange={(e) => setRejectionMessage(e.target.value)}
//       />
//     </div>
//   );
// };

// export default AdminFundraiserApprove;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar"; // Adjust the import path as needed

const AdminFundraiserApprove = () => {
  const [pendingFundraisers, setPendingFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingFundraisers = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        if (!adminInfo?.token) {
          navigate("/admin/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/admin/fundraisers", {
          headers: { Authorization: `Bearer ${adminInfo.token}` },
        });

        const pending = response.data.filter((f) => f.status === "pending");
        setPendingFundraisers(pending);
      } catch (err) {
        console.error("Error fetching pending fundraisers:", err);
        setError(err.response?.data?.message || "Failed to load pending fundraisers.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingFundraisers();
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <main className="flex-grow ml-0 md:ml-[15rem] mt-16 p-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Pending Fundraiser Approvals
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : pendingFundraisers.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">No pending fundraisers found.</p>
          ) : (
            <div className="space-y-6">
              {pendingFundraisers.map((fundraiser) => (
                <FundraiserApprovalCard
                  key={fundraiser._id}
                  fundraiser={fundraiser}
                  onUpdate={() =>
                    setPendingFundraisers((prev) =>
                      prev.filter((f) => f._id !== fundraiser._id)
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const FundraiserApprovalCard = ({ fundraiser, onUpdate }) => {
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      await axios.put(
        `http://localhost:5000/api/admin/fundraisers/${fundraiser._id}/status`,
        { status: "active" },
        { headers: { Authorization: `Bearer ${adminInfo.token}` } }
      );
      onUpdate(); // Update parent state instead of reloading
    } catch (err) {
      console.error("Error approving fundraiser:", err);
      alert("Failed to approve fundraiser. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionMessage.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    setIsProcessing(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      await axios.put(
        `http://localhost:5000/api/admin/fundraisers/${fundraiser._id}/status`,
        { status: "rejected", rejectionMessage },
        { headers: { Authorization: `Bearer ${adminInfo.token}` } }
      );
      onUpdate(); // Update parent state instead of reloading
    } catch (err) {
      console.error("Error rejecting fundraiser:", err);
      alert("Failed to reject fundraiser. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{fundraiser.title}</h2>
      <p className="text-gray-600 mb-3 line-clamp-2">{fundraiser.description}</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <p className="text-gray-700">
          <strong>Goal:</strong> ₹{fundraiser.goalAmount.toLocaleString()} |{" "}
          <strong>Raised:</strong> ₹{fundraiser.raisedAmount.toLocaleString()}
        </p>
        {fundraiser.image && (
          <img
            src={`http://localhost:5000${fundraiser.image}`}
            alt={fundraiser.title}
            className="w-24 h-24 object-cover rounded-md sm:ml-auto"
          />
        )}
      </div>
      <div className="space-y-4">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter rejection reason (required for rejection)"
          value={rejectionMessage}
          onChange={(e) => setRejectionMessage(e.target.value)}
          disabled={isProcessing}
        />
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Approve"}
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFundraiserApprove;