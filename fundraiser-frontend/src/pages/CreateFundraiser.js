// // src/pages/CreateFundraiser.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const CreateFundraiser = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [goalAmount, setGoalAmount] = useState("");
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [hasPendingFundraiser, setHasPendingFundraiser] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkPendingFundraiser = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//         if (!userInfo || !userInfo.token) return;

//         const { data } = await axios.get("http://localhost:5000/api/fundraisers/mine", {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         });

//         // Check if there's a fundraiser with status "pending"
//         if (data.pendingFundraisers.length > 0) {
//           setHasPendingFundraiser(true);
//         }
//       } catch (err) {
//         console.error("Error checking pending fundraiser:", err);
//       }
//     };

//     checkPendingFundraiser();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     if (!userInfo || !userInfo.token) {
//       setError("You must be logged in to create a fundraiser.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("goalAmount", goalAmount);
//       if (image) {
//         formData.append("image", image);
//       }

//       await axios.post("http://localhost:5000/api/fundraisers", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       });

//       setLoading(false);
//       setHasPendingFundraiser(true); // Prevent further form submissions
//     } catch (err) {
//       console.error("Error creating fundraiser:", err);
//       setError("Error creating fundraiser. Please try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="text-2xl font-bold mb-4 text-center">Create Fundraiser</h1>

//       {hasPendingFundraiser ? (
//         <div className="text-center">
//           <p className="text-green-600 text-lg font-semibold">Your fundraiser request is pending admin approval.</p>
//           <button
//             onClick={() => navigate("/mine")}
//             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Check My Fundraisers
//           </button>
//         </div>
//       ) : (
//         <>
//           {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//           {loading && <p className="text-center mb-4">Submitting fundraiser...</p>}

//           <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//             <div>
//               <label className="block text-gray-700">Title</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Goal Amount</label>
//               <input
//                 type="number"
//                 value={goalAmount}
//                 onChange={(e) => setGoalAmount(e.target.value)}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Image</label>
//               <input
//                 type="file"
//                 onChange={(e) => setImage(e.target.files[0])}
//                 className="w-full"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//             >
//               Submit for Approval
//             </button>
//           </form>
//         </>
//       )}
//     </motion.div>
//   );
// };

// export default CreateFundraiser;
// src/pages/CreateFundraiser.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateFundraiser = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPendingFundraiser, setHasPendingFundraiser] = useState(false);
  const navigate = useNavigate();

  // CHECK IF USER ALREADY HAS A PENDING FUNDRAISER
  useEffect(() => {
    const checkPendingFundraiser = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token) return;

        const { data } = await axios.get("http://localhost:5000/api/fundraisers/mine", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        // If user has a pending fundraiser, stop them from submitting again
        if (data.pendingFundraisers.length > 0) {
          setHasPendingFundraiser(true);
        }
      } catch (err) {
        console.error("Error checking pending fundraiser:", err);
      }
    };

    checkPendingFundraiser();
  }, []);

  // SUBMIT HANDLER ✅
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.token) {
      setError("You must be logged in to create a fundraiser.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("goalAmount", goalAmount);
      if (image) {
        formData.append("image", image);
      }

      // Send fundraiser request to backend
      await axios.post("http://localhost:5000/api/fundraisers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setLoading(false);
      setHasPendingFundraiser(true); // Prevent further form submissions
    } catch (err) {
      console.error("Error creating fundraiser:", err);
      setError("Error creating fundraiser. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Create Fundraiser</h1>

      {hasPendingFundraiser ? (
        <div className="text-center">
          <p className="text-green-600 text-lg font-semibold">Your fundraiser request is pending admin approval.</p>
          <button
            onClick={() => navigate("/mine")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Check My Fundraisers
          </button>
        </div>
      ) : (
        <>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loading && <p className="text-center mb-4">Submitting fundraiser...</p>}

          <form onSubmit={submitHandler} className="space-y-4" encType="multipart/form-data">
            <div>
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Goal Amount</label>
              <input
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Image</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit for Approval
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default CreateFundraiser;
