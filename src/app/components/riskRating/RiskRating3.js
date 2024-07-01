import React, { useState } from "react";

const RiskRating3 = ({ position ="mt-1 -ml-24" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block font-normal">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 cursor-pointer text-orange-500"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <circle cx="10" cy="10" r="8" />
        <line x1="10" y1="14" x2="10" y2="10" />
        <line x1="10" y1="6" x2="10" y2="6" />
      </svg>

      {showTooltip && (
        <div className={`${position} absolute z-10 bg-white text-gray-700 border border-gray-300 shadow-lg rounded-lg p-2 w-48`}>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">Rating</th>
                <th className="px-2 py-1">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">A+</td>
                <td className="border px-2 py-1 text-right">{">"} 739</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">A</td>
                <td className="border px-2 py-1 text-right">700 - 739</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">A-</td>
                <td className="border px-2 py-1 text-right">680 - 699</td>
              </tr>

              <tr>
                <td className="border px-2 py-1">B</td>
                <td className="border px-2 py-1 text-right">660 - 679</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">B-</td>
                <td className="border px-2 py-1 text-right">635 - 659</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">C+</td>
                <td className="border px-2 py-1 text-right">615 - 634</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">C</td>
                <td className="border px-2 py-1 text-right">590 - 614</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">C-</td>
                <td className="border px-2 py-1 text-right">{"<"} 590</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiskRating3;
