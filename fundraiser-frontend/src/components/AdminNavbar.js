import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Added FaSignOutAlt for logout icon

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch admin name from localStorage
  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    setAdminName(adminInfo?.name || "Admin");
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Pending Approvals", path: "/admin/approve-fundraisers" },
    { label: "Users", path: "/admin/users" },
    { label: "Donations", path: "/admin/donations" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 w-full z-20 shadow-md md:left-[15rem] md:w-[calc(100%-15rem)]">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-lg font-medium">{adminName}</span>
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed top-0 left-0 w-64 bg-gray-900 text-white h-full shadow-xl z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6">
          <h2 className="text-xl font-semibold mb-6">Admin Menu</h2>
          <ul className="space-y-3 flex-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false); // Close sidebar on click
                  }}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 mt-auto"
          >
            <span>Logout</span>
            <FaSignOutAlt className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overlay for sidebar (closes sidebar when clicked) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminNavbar;