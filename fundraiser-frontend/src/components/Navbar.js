import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // State for mobile menu toggle (for widths below 768px)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for desktop profile dropdown toggle (for widths ≥768px)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const profileDropdownRef = useRef(null);

  // Update user info from localStorage
  const updateUser = () => {
    const storedUser = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    setUserInfo(storedUser);
  };

  useEffect(() => {
    updateUser();
    window.addEventListener('userChange', updateUser);
    return () => {
      window.removeEventListener('userChange', updateUser);
    };
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    window.dispatchEvent(new Event('userChange'));
    navigate('/');
  };

  // For "Create" link: if not logged in, redirect to login.
  const handleCreateClick = (e) => {
    if (!userInfo) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Fundraiser
        </Link>
        {/* Desktop Menu (≥768px) */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/create"
            onClick={handleCreateClick}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition"
          >
            Get Fund
          </Link>

          <Link to="/my-donations" className="text-gray-700 hover:text-blue-600 transition">
            My Donations
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">
            Contact
          </Link>

          {userInfo ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="text-gray-700 hover:text-blue-600 transition focus:outline-none"
              >
                {userInfo.name}
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                  <Link
                    onClick={() => setProfileDropdownOpen(false)}
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
              Login
            </Link>
          )}
        </div>
        {/* Mobile Menu Toggle (<768px) */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu (Vertical List, one by one) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-2 space-y-2">
            <Link
              onClick={() => setMobileMenuOpen(false)}
              to="/about"
              className="block text-gray-700 hover:text-blue-600 transition"
            >
              About Us
            </Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              to="/contact"
              className="block text-gray-700 hover:text-blue-600 transition"
            >
              Contact
            </Link>
            <Link
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleCreateClick(e);
              }}
              to="/create"
              className="block text-gray-700 hover:text-blue-600 transition"
            >
              Get Fund
            </Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              to="/my-donations"
              className="block text-gray-700 hover:text-blue-600 transition"
            >
              My Donations
            </Link>
            {userInfo ? (
              <>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  to="/profile"
                  className="block text-gray-700 hover:text-blue-600 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                onClick={() => setMobileMenuOpen(false)}
                to="/login"
                className="block text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
