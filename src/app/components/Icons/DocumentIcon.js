import React from 'react';

const DocumentIcon = ({ className = '', onClick, dimension = 6 }) => {
  return (
    <svg
      onClick={onClick}
      className={`w-${dimension} h-${dimension} ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0010.586 2H6zm4 0v4h4V4.828l-4-4V2zm0 10H8v-2h2v2zm0 4H8v-2h2v2z"
      />
    </svg>
  );
};

export default DocumentIcon;
