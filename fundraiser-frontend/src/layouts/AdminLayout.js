import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle Sidebar for Mobile View
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Hidden on small screens, shown on larger screens */}
      <div className={`fixed md:relative z-50 ${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow md:ml-[1rem]">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="p-6 mt-16">{children}</div> {/* Added margin-top for navbar spacing */}
      </div>
    </div>
  );
};

export default AdminLayout;
