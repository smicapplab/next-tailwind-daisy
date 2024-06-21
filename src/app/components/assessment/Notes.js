import { formatDate, formatToPeso } from "@/helpers/formatter";
import React, { useState } from "react";

const Notes = ({ data = [] }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(({ loanNumber }) => loanNumber));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (loanNumber) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(loanNumber)
        ? prevSelectedRows.filter((id) => id !== loanNumber)
        : [...prevSelectedRows, loanNumber]
    );
  };

  const handleSubmit = () => {
    console.log("Selected Rows:", selectedRows);
    // Add your submission logic here
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
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
          {data.map(({ businessName, loanNumber, loanAmount, cm = {}, rm = {}, applicationDate }) => (
            <tr key={loanNumber}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedRows.includes(loanNumber)}
                  onChange={() => handleSelectRow(loanNumber)}
                />
              </td>
              <td>{businessName || ""}</td>
              <td>{loanNumber || ""}</td>
              <td>{formatToPeso(loanAmount)}</td>
              <td>{formatDate(applicationDate)}</td>
              <td>{rm.name || "-"}</td>
              <td>{cm.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary mt-4" onClick={handleSubmit}>
        Submit Selected
      </button>
    </div>
  );
};

export default Notes;