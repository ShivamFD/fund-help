// // src/pages/MyFundraiser.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyFundraiser = () => {
//   const [pending, setPending] = useState([]);
//   const [active, setActive] = useState([]);
//   const [successful, setSuccessful] = useState([]);
//   const [failed, setFailed] = useState([]);

//   const [selectedTab, setSelectedTab] = useState("pending");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUserFundraisers = async () => {
//       try {
//         const userInfo = localStorage.getItem("userInfo")
//           ? JSON.parse(localStorage.getItem("userInfo"))
//           : null;
//         if (!userInfo || !userInfo.token) {
//           setError("You must be logged in.");
//           setLoading(false);
//           return;
//         }

//         const { data } = await axios.get("http://localhost:5000/api/fundraisers/mine", {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         });

//         setPending(data.pendingFundraisers || []);
//         setActive(data.activeFundraisers || []);
//         setSuccessful(data.successfulFundraisers || []);
//         setFailed(data.failedFundraisers || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching user fundraisers:", err);
//         setError("Error fetching user fundraisers.");
//         setLoading(false);
//       }
//     };

//     fetchUserFundraisers();
//   }, []);

//   if (loading) return <p>Loading your fundraisers...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded">
//       <h1 className="text-3xl font-bold mb-6 text-center">My Fundraisers</h1>

//       {/* Tabs */}
//       <div className="flex justify-center mb-4">
//         {["pending", "active", "successful", "failed"].map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 mx-2 rounded ${
//               selectedTab === tab ? "bg-blue-600 text-white" : "bg-gray-300"
//             }`}
//             onClick={() => setSelectedTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="space-y-4">
//         {selectedTab === "pending" && <FundraiserList fundraisers={pending} statusLabel="Pending" />}
//         {selectedTab === "active" && <FundraiserList fundraisers={active} statusLabel="Active" />}
//         {selectedTab === "successful" && <FundraiserList fundraisers={successful} statusLabel="Successful" />}
//         {selectedTab === "failed" && <FundraiserList fundraisers={failed} statusLabel="Failed" />}
//       </div>
//     </div>
//   );
// };

// const FundraiserList = ({ fundraisers, statusLabel }) => {
//   if (!fundraisers.length) {
//     return <p className="text-center text-gray-500">No {statusLabel} fundraisers found.</p>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {fundraisers.map((f) => (
//         <div key={f._id} className="border p-4 rounded shadow">
//           <h2 className="text-xl font-bold mb-2">{f.title}</h2>
//           <p className="mb-2">{f.description}</p>
//           <p>
//             <strong>Goal:</strong> ₹{f.goalAmount} | <strong>Raised:</strong> ₹{f.raisedAmount}
//           </p>
//           <p className="text-sm text-gray-600">Status: {f.status}</p>
//           {f.status === "rejected" && f.rejectionMessage && (
//             <p className="text-red-600 mt-2">Reason: {f.rejectionMessage}</p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyFundraiser;
// src/pages/MyFundraiser.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyFundraiser = () => {
  const [pending, setPending] = useState([]);
  const [active, setActive] = useState([]);
  const [successful, setSuccessful] = useState([]);
  const [failed, setFailed] = useState([]);

  const [selectedTab, setSelectedTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserFundraisers = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;
        if (!userInfo || !userInfo.token) {
          setError("You must be logged in.");
          setLoading(false);
          return;
        }

        // Call /api/fundraisers/mine
        const { data } = await axios.get("http://localhost:5000/api/fundraisers/mine", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setPending(data.pendingFundraisers || []);
        setActive(data.activeFundraisers || []);
        setSuccessful(data.successfulFundraisers || []);
        setFailed(data.failedFundraisers || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user fundraisers:", err);
        setError("Error fetching user fundraisers.");
        setLoading(false);
      }
    };

    fetchUserFundraisers();
  }, []);

  if (loading) return <p>Loading your fundraisers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">My Fundraisers</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-4">
        {["pending", "active", "successful", "failed"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 mx-2 rounded ${
              selectedTab === tab ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {selectedTab === "pending" && <FundraiserList fundraisers={pending} statusLabel="Pending" />}
        {selectedTab === "active" && <FundraiserList fundraisers={active} statusLabel="Active" />}
        {selectedTab === "successful" && <FundraiserList fundraisers={successful} statusLabel="Successful" />}
        {selectedTab === "failed" && <FundraiserList fundraisers={failed} statusLabel="Failed" />}
      </div>
    </div>
  );
};

const FundraiserList = ({ fundraisers, statusLabel }) => {
  if (!fundraisers.length) {
    return <p className="text-center text-gray-500">No {statusLabel} fundraisers found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fundraisers.map((f) => (
        <div key={f._id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">{f.title}</h2>
          <p className="mb-2">{f.description}</p>
          <p>
            <strong>Goal:</strong> ₹{f.goalAmount} | <strong>Raised:</strong> ₹{f.raisedAmount}
          </p>
          <p className="text-sm text-gray-600">Status: {f.status}</p>
          {f.status === "rejected" && f.rejectionMessage && (
            <p className="text-red-600 mt-2">Reason: {f.rejectionMessage}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyFundraiser;
