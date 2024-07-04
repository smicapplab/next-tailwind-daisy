import React, { useState } from "react";

const RiskRating4 = ({ position ="mt-1 -ml-24" }) => {
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
                <td className="border px-2 py-1">AAA</td>
                <td className="border px-2 py-1 text-right">{">"} 740</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">AA</td>
                <td className="border px-2 py-1 text-right">717 - 740</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">A</td>
                <td className="border px-2 py-1 text-right">705 - 716</td>
              </tr>

              <tr>
                <td className="border px-2 py-1">BBB</td>
                <td className="border px-2 py-1 text-right">695 - 704</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">BB</td>
                <td className="border px-2 py-1 text-right">685 - 694</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">B</td>
                <td className="border px-2 py-1 text-right">675 - 684</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">CCC</td>
                <td className="border px-2 py-1 text-right">665 - 674</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">CC</td>
                <td className="border px-2 py-1 text-right">650 - 664</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">C</td>
                <td className="border px-2 py-1 text-right">630 - 649</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">CI</td>
                <td className="border px-2 py-1 text-right">615 - 629</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">R</td>
                <td className="border px-2 py-1 text-right">600 - 614</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">SD</td>
                <td className="border px-2 py-1 text-right">585 - 599</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">D</td>
                <td className="border px-2 py-1 text-right">535 - 584</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">NR</td>
                <td className="border px-2 py-1 text-right">{">"} 535</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiskRating4;
