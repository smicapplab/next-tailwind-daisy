import React from "react";

const OpenIcon = ({ className = "", onClick }) => {
  return (
    <svg
      onClick={onClick}
      className={`w-6 h-6 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 3h4v4"></path>
      <path d="M21 3l-9 9"></path>
      <path d="M14 3h-8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    </svg>
  );
};

export default OpenIcon;
