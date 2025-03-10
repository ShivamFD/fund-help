// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyDonations = () => {
//   const [donations, setDonations] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//         if (!userInfo || !userInfo.token) {
//           setError("You must be logged in to view donations.");
//           setLoading(false);
//           return;
//         }

//         const { data } = await axios.get("http://localhost:5000/api/donations/my-donations", {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         });

//         setDonations(data);
//       } catch (err) {
//         console.error("Error fetching user donations:", err);
//         setError("Error fetching donations.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDonations();
//   }, []);

//   if (loading) return <p>Loading donations...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
//       <h1 className="text-3xl font-bold mb-6">My Donations</h1>
//       {donations.length === 0 ? (
//         <p>No donations found.</p>
//       ) : (
//         <table className="w-full border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border border-gray-300 px-4 py-2">Fundraiser</th>
//               <th className="border border-gray-300 px-4 py-2">Amount</th>
//               <th className="border border-gray-300 px-4 py-2">Fundraiser Status</th>
//               <th className="border border-gray-300 px-4 py-2">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {donations.map((don) => (
//               <tr key={don._id}>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {don.fundraiser?.title || "Unknown"}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">₹{don.amount}</td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {don.fundraiser?.status || "N/A"}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {new Date(don.createdAt).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default MyDonations;
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token) {
          setError("You must be logged in to see donations.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/donations/my-donations", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setDonations(data);
      } catch (err) {
        console.error("Error fetching my donations:", err);
        setError("Error fetching my donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyDonations();
  }, []);

  if (loading) return <p>Loading donations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (donations.length === 0) return <p>No donations found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">My Donations</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Fundraiser</th>
            <th className="border px-4 py-2">Amount (INR)</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id}>
              <td className="border px-4 py-2">
                {donation.fundraiser?.title || "Unknown Fundraiser"}
              </td>
              <td className="border px-4 py-2">₹{donation.amount}</td>
              <td className="border px-4 py-2">{donation.status}</td>
              <td className="border px-4 py-2">
                {new Date(donation.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyDonations;
