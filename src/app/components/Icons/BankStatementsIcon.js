// components/BankStatementsIcon.js
import React from 'react';

const BankStatementsIcon = ({ className = '', onClick }) => {
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
        d="M12 2l7 7v11a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2h5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 2v8h8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h8M8 16h8"
      />
    </svg>
  );
};

export default BankStatementsIcon;
