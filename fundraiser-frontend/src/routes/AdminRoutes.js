// src/routes/AdminRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminDonations from "../pages/AdminDonations";
import AdminFundraiserApprove from "../pages/AdminFundraiserApprove";




const AdminRoutes = () => {
  // Optionally, you could add a client-side check:
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  if (!adminInfo || !adminInfo.token) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/approve-fundraisers" element={<AdminFundraiserApprove />} />

        <Route path="/users" element={<AdminUsers />} />
        <Route path="/donations" element={<AdminDonations />} />
        {/* Add additional admin routes here */}
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
