// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//       localStorage.setItem('userInfo', JSON.stringify(data));
//       // Dispatch event to notify Navbar of user change
//       window.dispatchEvent(new Event('userChange'));
//       navigate('/');
//     } catch (error) {
//       console.error('Error logging in', error);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>
//         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
//           Login
//         </button>
//       </form>
//       <p className="mt-4 text-center">
//         Don't have an account?{' '}
//         <Link to="/register" className="text-blue-600 hover:text-blue-800">
//           Register
//         </Link>
//       </p>
//     </motion.div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ Store data based on user type (Admin/User)
      if (data.isAdmin) {
        localStorage.setItem("adminInfo", JSON.stringify(data)); // Save admin info
        navigate("/admin/dashboard"); // Redirect to Admin Dashboard
      } else {
        localStorage.setItem("userInfo", JSON.stringify(data)); // Save normal user info
        navigate("/"); // Redirect to Home
      }

      // Dispatch event to notify Navbar to update
      window.dispatchEvent(new Event("userChange"));
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      {/* Show Error Message If Login Fails */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:text-blue-800">
          Register
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;
