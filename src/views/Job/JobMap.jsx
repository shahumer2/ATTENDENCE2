import React from 'react';

const JobMap = ({ latitude, longitude, address }) => {
  let googleMapsUrl = "";

  if (latitude && longitude) {
    // Use coordinates if available
    googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  } else if (address) {
    // Fallback to address if coordinates are missing
    googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
  }

  if (!googleMapsUrl) {
    return (
      <span className="text-red-500">Location not available</span>
    );
  }

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
      title="View location on Google Maps"
    >
      <svg
        className="w-5 h-5 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      View Map
    </a>
  );
};

export default JobMap;
