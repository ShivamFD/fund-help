import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="text-gray-700">
        If you have any questions or need support, please email us at{' '}
        <a href="mailto:support@fundraiser.com" className="text-blue-600">
          support@fundraiser.com
        </a>.
      </p>
    </div>
  );
};

export default Contact;
