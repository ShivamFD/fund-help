import React, { useState, useEffect } from "react";
// import image1 from "../assets/Image1.jpg";
// import image2 from "../assets/Image2.jpg";
// import image3 from "../assets/Image3.jpg";
import image4 from "../assets/Image4.jpg";
import image5 from "../assets/Image5.jpg";
import image6 from "../assets/Image6.jpg";

const ImageCarousel = () => {
  // Use local images instead of URLs
  const images = [image4,image5,image6];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  // Scroll down function on "Donate Now" button click
  const handleDonateClick = () => {
    const donateSection = document.getElementById("donate-section");
    if (donateSection) {
      donateSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Motivational Donation Message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
          "Your small contribution can change lives"
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Join us in making a difference. Many people struggle to afford even a single meal a day. 
          Your donation can bring hope and relief to those in need.
        </p>
        <button
          onClick={handleDonateClick}
          className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-full text-lg font-semibold transition"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};
export default ImageCarousel;
