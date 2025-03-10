// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UpdateProfile from './pages/UpdateProfile';
import Profile from './components/Profile';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import CreateFundraiser from './pages/CreateFundraiser';
import MyFundraiser from './pages/MyFundraiser';
import EditFundraiser from './pages/EditFundraiser';
import FundraiserDetail from './pages/FundraiserDetail';
import Donate from './pages/Donate';
import DonationSucess from './pages/DonationSucess';
import DonationCancel from './pages/DonationCancel';
import MyDonations from './pages/MyDonations';
import DonateFund from './pages/DonateFund';

// Admin Routes Component
import AdminRoutes from "./routes/AdminRoutes";

const AppContent = () => {
  const location = useLocation();
  // Check if the current path starts with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreateFundraiser />} />
          <Route path="/mine" element={<MyFundraiser />} />
          <Route path="/edit-fundraiser/:id" element={<EditFundraiser />} />
          <Route path="/fundraiser/:id" element={<FundraiserDetail />} />
          <Route path="/donate/:id" element={<Donate />} />
          <Route path="/donate-fund" element={<DonateFund />} />
          <Route path="/donation-success" element={<DonationSucess />} />
          <Route path="/donation-cancel" element={<DonationCancel />} />
          <Route path="/my-donations" element={<MyDonations />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
