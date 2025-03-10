// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminDonation = () => {
//   const [donations, setDonations] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
//         if (!adminInfo || !adminInfo.token) {
//           setError("Unauthorized. Please log in as Admin.");
//           setLoading(false);
//           return;
//         }

//         const { data } = await axios.get("http://localhost:5000/api/admin/donations", {
//           headers: { Authorization: `Bearer ${adminInfo.token}` },
//         });

//         setDonations(data);
//       } catch (err) {
//         console.error("Error fetching donations:", err);
//         setError("Error fetching donations.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDonations();
//   }, []);

//   if (loading) return <p>Loading donations...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (donations.length === 0) return <p>No donations found.</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
//       <h1 className="text-3xl font-bold mb-6">All Donations</h1>
//       <table className="w-full border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border border-gray-300 px-4 py-2">Donor</th>
//             <th className="border border-gray-300 px-4 py-2">Fundraiser</th>
//             <th className="border border-gray-300 px-4 py-2">Amount</th>
//             <th className="border border-gray-300 px-4 py-2">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {donations.map((donation) => (
//             <tr key={donation._id}>
//               <td className="border border-gray-300 px-4 py-2">
//                 {donation.donor?.name || "Anonymous"}
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {donation.fundraiser?.title || "Unknown"}
//               </td>
//               <td className="border border-gray-300 px-4 py-2">₹{donation.amount}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {new Date(donation.createdAt).toLocaleString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminDonation;
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        if (!adminInfo || !adminInfo.token) {
          setError("Unauthorized. Please log in as admin.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/donations/all", {
          headers: { Authorization: `Bearer ${adminInfo.token}` },
        });

        setDonations(data);
      } catch (err) {
        console.error("Error fetching admin donations:", err);
        setError("Error fetching donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <p>Loading donations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!donations.length) return <p>No donations found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-3xl font-bold mb-6">All Donations (Admin)</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Donor</th>
            <th className="border px-4 py-2">Fundraiser</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((don) => (
            <tr key={don._id}>
              <td className="border px-4 py-2">
                {don.donor?.name || "Anonymous"}
              </td>
              <td className="border px-4 py-2">
                {don.fundraiser?.title || "Unknown"}
              </td>
              <td className="border px-4 py-2">₹{don.amount}</td>
              <td className="border px-4 py-2">{don.status}</td>
              <td className="border px-4 py-2">
                {new Date(don.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDonation;
