import React from "react";

const RunIcon = ({ className = "", onClick }) => {
  return (
    <svg
      onClick={onClick}
      className={`w-6 h-6 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>
  );
};

export default RunIcon;
