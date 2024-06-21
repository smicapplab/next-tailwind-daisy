import { formatDate, formatToPeso } from "@/helpers/formatter";
import React from "react";

const Notes = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Business Name</th>
            <th>Loan Number</th>
            <th>Loan Amount</th>
            <th>Application Date</th>
            <th>RM</th>
            <th>CM</th>
          </tr>
        </thead>

        <tbody>
          {data.map(({ businessName, loanNumber, loanAmount, cm = {}, rm = {}, applicationDate,  }) => (
            <tr>
              <th>
                <input type="checkbox" className="checkbox" />
              </th>
              <th>{businessName || ""}</th>
              <th>{loanNumber || ""}</th>
              <th>{formatToPeso(loanAmount)}</th>
              <th>{formatDate(applicationDate)}</th>
              <th>{rm.name || "-"}</th>
              <th>{cm.name || "-"}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notes;
