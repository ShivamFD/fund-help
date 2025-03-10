
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalFundraisers: 0,
//     activeFundraisers: 0,
//     pendingFundraisers: 0,
//     rejectedFundraisers: 0,
//     totalDonations: 0,
//     topDonors: [],
//   });
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:5000/api/admin/dashboard", {
//           headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("adminInfo")).token}` },
//         });

//         setStats(data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         setError("Error fetching dashboard data. Please try again.");
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   return (
//     <div className="flex">
//       {/* Fixed Navbar */}
      

//       {/* Main Content */}
//       <main className="ml-[16rem] mt-16 p-6 overflow-y-auto flex-grow bg-gray-100 h-[calc(100vh-4rem)] sm:w-full ml-0">
//         {error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Total Users */}
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
//               <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
//             </div>

//             {/* Total Fundraisers */}
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold text-gray-700">Total Fundraisers</h2>
//               <p className="text-3xl font-bold text-purple-600">{stats.totalFundraisers}</p>
//             </div>

//             {/* Active Fundraisers */}
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold text-gray-700">Active Fundraisers</h2>
//               <p className="text-3xl font-bold text-green-600">{stats.activeFundraisers}</p>
//             </div>

//             {/* Pending Fundraisers */}
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold text-gray-700">Pending Approvals</h2>
//               <p className="text-3xl font-bold text-yellow-500">{stats.pendingFundraisers}</p>
//             </div>

//             {/* Rejected Fundraisers */}
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold text-gray-700">Rejected Fundraisers</h2>
//               <p className="text-3xl font-bold text-red-500">{stats.rejectedFundraisers}</p>
//             </div>

//             {/* Total Donations */}
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold text-gray-700">Total Donations</h2>
//               <p className="text-3xl font-bold text-blue-600">₹{stats.totalDonations}</p>
//             </div>

//             {/* Top Donors */}
//             <div className="bg-white p-6 rounded-lg shadow-md text-center col-span-2">
//               <h2 className="text-xl font-semibold text-gray-700">Top Donors</h2>
//               {stats.topDonors.length > 0 ? (
//                 <ul className="mt-3">
//                   {stats.topDonors.map((donor, index) => (
//                     <li key={index} className="text-lg font-semibold text-gray-600">
//                       {donor.name} - ₹{donor.totalDonated}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 mt-3">No donations yet.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from '../components/AdminNavbar'; // Assuming AdminNavbar is in the same directory

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFundraisers: 0,
    activeFundraisers: 0,
    pendingFundraisers: 0,
    rejectedFundraisers: 0,
    totalDonations: 0,
    topDonors: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        if (!adminInfo?.token) throw new Error("No admin token found");

        const { data } = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${adminInfo.token}` },
        });

        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Total Fundraisers", value: stats.totalFundraisers, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Active Fundraisers", value: stats.activeFundraisers, color: "text-green-600", bg: "bg-green-50" },
    { title: "Pending Approvals", value: stats.pendingFundraisers, color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "Rejected Fundraisers", value: stats.rejectedFundraisers, color: "text-red-600", bg: "bg-red-50" },
    { title: "Total Donations", value: `₹${stats.totalDonations.toLocaleString()}`, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-grow ml-0 md:ml-[15rem] mt-16 p-6 bg-gray-100 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
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
        ) : (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statCards.map((card) => (
                <div
                  key={card.title}
                  className={`p-6 rounded-xl shadow-md ${card.bg} hover:shadow-lg transition-shadow duration-200`}
                >
                  <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
                  <p className={`text-3xl font-bold ${card.color} mt-2`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Top Donors Section */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Donors</h2>
              {stats.topDonors.length > 0 ? (
                <ul className="space-y-3">
                  {stats.topDonors.map((donor, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-lg font-medium text-gray-700">{donor.name}</span>
                      <span className="text-lg font-semibold text-blue-600">
                        ₹{donor.totalDonated.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No donations yet.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;