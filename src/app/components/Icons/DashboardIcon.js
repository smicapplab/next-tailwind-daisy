// components/DashboardIcon.js
import React from 'react';

const DashboardIcon = ({ className = '', onClick }) => {
  return (
    <svg
      onClick={onClick}
      className={`w-6 h-6 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h8v8H3zM3 13h8v8H3zM13 3h8v8h-8zM13 13h8v8h-8z"
      />
    </svg>
  );
};

export default DashboardIcon;
