// // // src/components/AdminSidebar.js
// // import React from "react";
// // import { useNavigate } from "react-router-dom";

// // const AdminSidebar = () => {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="w-64 bg-gray-800 text-white p-4 h-screen">
// //       <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
// //       <ul>
// //         <li className="mb-2">
// //           <button onClick={() => navigate("/admin/dashboard")} className="hover:underline w-full text-left">
// //             Dashboard
// //           </button>
// //         </li>
// //         <li className="mb-2">
// //           <button onClick={() => navigate("/admin/approve-fundraisers")} className="hover:underline w-full text-left">
// //             Pending Approvals
// //           </button>
// //         </li>
// //         <li className="mb-2">
// //           <button onClick={() => navigate("/admin/users")} className="hover:underline w-full text-left">
// //             Users
// //           </button>
// //         </li>
// //         <li className="mb-2">
// //           <button onClick={() => navigate("/admin/donations")} className="hover:underline w-full text-left">
// //             Donations
// //           </button>
// //         </li>
// //       </ul>
// //       <div className="mt-8">
// //         <button
// //           onClick={() => navigate("/admin/logout")}
// //           className="flex items-center w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
// //         >
// //           <span className="mr-2">Logout</span>
// //           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //             <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 4.5zM3 10a1.5 1.5 0 011.5-1.5h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 10zm1.5 4.5A1.5 1.5 0 003 13.5v0A1.5 1.5 0 004.5 12h7a1.5 1.5 0 010 3h-7z" clipRule="evenodd" />
// //             <path d="M12.293 8.293a1 1 0 011.414 0L17 11.586l-3.293 3.293a1 1 0 01-1.414-1.414L14.586 12H7a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
// //           </svg>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminSidebar;
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const AdminSidebar = () => {
//   const navigate = useNavigate();

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem("adminInfo"); // Remove admin session
//     navigate("/login"); // Redirect to login page
//   };

//   return (
//     <div className="w-64 bg-gray-800 text-white p-4 h-screen relative">
//       <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
//       <ul>
//         <li className="mb-2">
//           <button onClick={() => navigate("/admin/dashboard")} className="hover:underline w-full text-left">
//             Dashboard
//           </button>
//         </li>
//         <li className="mb-2">
//           <button onClick={() => navigate("/admin/approve-fundraisers")} className="hover:underline w-full text-left">
//             Pending Approvals
//           </button>
//         </li>
//         <li className="mb-2">
//           <button onClick={() => navigate("/admin/users")} className="hover:underline w-full text-left">
//             Users
//           </button>
//         </li>
//         <li className="mb-2">
//           <button onClick={() => navigate("/admin/donations")} className="hover:underline w-full text-left">
//             Donations
//           </button>
//         </li>
//       </ul>

//       {/* Logout Button at the Bottom */}
//       <div className="absolute bottom-20 w-full">
//         <button
//           onClick={handleLogout}
//           className="flex items-center w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
//         >
//           <span className="mr-2">Logout</span>
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 4.5zM3 10a1.5 1.5 0 011.5-1.5h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 10zm1.5 4.5A1.5 1.5 0 003 13.5v0A1.5 1.5 0 004.5 12h7a1.5 1.5 0 010 3h-7z" clipRule="evenodd" />
//             <path d="M12.293 8.293a1 1 0 011.414 0L17 11.586l-3.293 3.293a1 1 0 01-1.414-1.414L14.586 12H7a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminInfo"); // Remove admin session
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-screen fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
      <ul className="space-y-3">
        <li>
          <button onClick={() => navigate("/admin/dashboard")} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Dashboard
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/admin/approve-fundraisers")} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Pending Approvals
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/admin/users")} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Users
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/admin/donations")} className="w-full text-left hover:bg-gray-700 p-2 rounded">
            Donations
          </button>
        </li>
      </ul>

      {/* Logout Button at the Bottom, Inside the Container */}
      <div className="absolute bottom-6 left-4 w-[calc(100%-2rem)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          <span className="mr-2">Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 4.5zM3 10a1.5 1.5 0 011.5-1.5h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 10zm1.5 4.5A1.5 1.5 0 003 13.5v0A1.5 1.5 0 004.5 12h7a1.5 1.5 0 010 3h-7z" clipRule="evenodd" />
            <path d="M12.293 8.293a1 1 0 011.414 0L17 11.586l-3.293 3.293a1 1 0 01-1.414-1.414L14.586 12H7a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
