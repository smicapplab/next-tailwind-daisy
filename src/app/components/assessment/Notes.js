import { postApi } from "@/helpers/api-helpers";
import { formatDate, formatToPeso } from "@/helpers/formatter";
import React, { useState, lazy, useEffect } from "react";

const MenuIcon = lazy(() => import("../Icons/MenuIcon"));
const CreditParameter = lazy(() => import("./CreditParameter.js"));

const Notes = ({ loanStatus }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNote, setSelectedNote] = useState({});
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const getNotes = async () => {
    setLoading(true);
    try {
      const data = await postApi("assessment/get-notes", {
        loanStatus,
      });
      setTableData(data.notes);
    } catch (err) {
      addToast({
        message: "It is what it is... error eh? Luckily this is a test. Ooops!",
        type: "error",
      });
      console.error("Error fetching pending items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map(({ loanNumber }) => loanNumber));
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

  const openModal = (noteDetails) => {
    setSelectedNote(noteDetails);
    document.getElementById("credit-modal").showModal();
  };

  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      if (isMounted) {
        await getNotes();
      }
    };

    fetchNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const ActionMenu = (noteDetails) => {
    return (
      <div className="dropdown">
        <div tabIndex={0} role="button" className="m-1">
          <MenuIcon />
        </div>
        <ul
          tabIndex={0}
          className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
        >
          <li>
            <a onClick={() => openModal(noteDetails)}>Run</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-4 w-full p-10">
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      ) : (
        <div className="w-full">
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
                <th></th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((noteDetails) => (
                <tr key={noteDetails.loanNumber}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedRows.includes(noteDetails.loanNumber)}
                      onChange={() => handleSelectRow(noteDetails.loanNumber)}
                    />
                  </td>
                  <td>{noteDetails?.businessName || ""}</td>
                  <td>{noteDetails?.loanNumber || ""}</td>
                  <td>{formatToPeso(noteDetails?.loanAmount)}</td>
                  <td>{formatDate(noteDetails?.applicationDate)}</td>
                  <td>{noteDetails?.rm.name || "-"}</td>
                  <td>{noteDetails?.cm.name || "-"}</td>
                  <td>
                    <ActionMenu noteDetails={noteDetails} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <CreditParameter selectedNote={selectedNote} doReload={getNotes} />
          <div className="divider w-full"></div>
          <div className="p-5 flex justify-end">
            <button className=" btn btn-primary" onClick={handleSubmit}>
              Submit Selected
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notes;
