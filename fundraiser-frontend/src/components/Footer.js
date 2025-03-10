import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner py-4 mt-8">
      <div className="container mx-auto text-center text-gray-600">
        © {new Date().getFullYear()} Fundraiser. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
