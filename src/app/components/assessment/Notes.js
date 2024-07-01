import { postApi } from "@/helpers/api-helpers";
import { formatToPeso } from "@/helpers/formatter";
import React, {
  useState,
  lazy,
  useEffect,
  useContext,
  useRef,
  Suspense,
} from "react";
import { ToastContext } from "@/app/store/context/ToastContextProvider";
import { SearchIcon } from "../Icons/SearchIcon";
import { formatDate } from "date-fns";
const AssessmentDrawer = lazy(() => import("./AssessmentDrawer"));
const MenuIcon = lazy(() => import("../Icons/MenuIcon"));
const CreditParameter = lazy(() => import("./CreditParameter.js"));

const headers = [
  "Business Name",
  "Loan Number",
  "Loan Amount",
  "Application Date",
  "RM",
  "CM",
];

const Notes = ({ loanStatus, getPendingCount }) => {
  const { addToast } = useContext(ToastContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNote, setSelectedNote] = useState({});
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [cms, setCms] = useState([]);
  const [rms, setRms] = useState([]);
  const [issuers, setIssuers] = useState([]);

  const drawerRef = useRef();

  const getUniqueFieldValues = () => {
    const cmValues = tableData.map((item) => item?.cm?.name);
    const rmValues = tableData.map((item) => item?.rm?.name);
    const issuerValues = tableData.map((item) => item?.pk);

    setCms([...new Set(cmValues)]);
    setRms([...new Set(rmValues)]);
    setIssuers([...new Set(issuerValues)]);
  };

  const getNotes = async () => {
    setLoading(true);
    try {
      const data = await postApi("assessment/get-notes", {
        loanStatus,
      });
      if (getPendingCount) {
        await getPendingCount();
      }

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

  const openCreditModal = (noteDetails) => {
    setSelectedNote(noteDetails);
    document.getElementById("credit-modal").showModal();
  };

  const openCommentModal = (noteDetails) => {
    // setSelectedNote(noteDetails);
    // document.getElementById("credit-modal").showModal();
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

  const getBadgeClass = (score) => {
    if (score.startsWith("A")) {
      return "badge-success";
    }
    if (score.startsWith("B")) {
      return "badge-warning";
    }
    if (score.startsWith("C")) {
      return "badge-error";
    }
  };

  const openDrawer = (selected) => {
    if (drawerRef.current) {
      drawerRef.current.openDrawer();
      setSelectedNote(selected);
    }
  };

  useEffect(() => {
    getUniqueFieldValues();
  }, [tableData]);

  useEffect(() => {
    setSelectedNote({});
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
            <a onClick={() => openCreditModal(noteDetails)}>Run Assessment</a>
          </li>
          {loanStatus === "done" && (
            <li>
              <a onClick={() => openDrawer(noteDetails)}>View Results</a>
            </li>
          )}
          <li>
            <a onClick={() => openCommentModal(noteDetails)}>
              Add/View Comments
            </a>
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
          <div className="card">
            <div className="card-body">
              <div className="w-full max-w-lg">
                <label className="input input-bordered flex items-center gap-2">
                  <input type="text" className="grow" placeholder="Search" />
                  <SearchIcon />
                </label>
              </div>
              <div className="w-full flex align-middle">
                <select className="select select-bordered w-full max-w-xs mr-1">
                  <option disabled selected>
                    Issuers
                  </option>
                  {issuers?.map((issuer) => (
                    <option key={issuer}>{issuer}</option>
                  ))}
                </select>
                <select className="select select-bordered w-full max-w-xs mr-1">
                  <option disabled selected>
                    Relationship Managers
                  </option>
                  {rms?.map((rm) => (
                    <option key={rm}>{rm}</option>
                  ))}
                </select>

                <select className="select select-bordered w-full max-w-xs mr-1">
                  <option disabled selected>
                    Credit Managers
                  </option>
                  {cms?.map((cm) => (
                    <option key={cm}>{cm}</option>
                  ))}
                </select>

                <button className="btn btn-square btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 12.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 018 17V12.414L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
                {headers.map((h) => (
                  <th className="text-center text-primary font-semibold text-sm">
                    {h}
                  </th>
                ))}
                <th className="flex justify-center items-center text-primary font-semibold text-sm">
                  {loanStatus === "done"
                    ? "Run Date"
                    : "Missing/Expired Documents"}
                </th>
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
                  <td>
                    {noteDetails?.businessName || ""}
                    {loanStatus === "done" ? (
                      <>
                        <span
                          className={`badge ${getBadgeClass(
                            noteDetails.score.riskRating1
                          )} badge-xs ml-2 p-2 text-white`}
                        >
                          {noteDetails.score.totalScore}
                        </span>
                        <span
                          className={`badge ${getBadgeClass(
                            noteDetails.score.riskRating1
                          )} badge-xs ml-1 p-2 text-white`}
                        >
                          {noteDetails.score.riskRating1}
                        </span>
                        <span
                          className={`badge badge-xs ml-1 p-2
                ${noteDetails.score?.color === "WHITE" && "badge-outline"}
                ${noteDetails.score?.color === "GRAY" && "bg-gray-500 text-white"}
                ${
                  noteDetails.score?.color === "BLACK" && "bg-black text-white"
                }`}
                        >
                          {noteDetails.score?.color.toLowerCase()}
                        </span>
                      </>
                    ) : (
                      <>
                        {noteDetails.isNew && (
                          <div className="badge badge-success badge-xs ml-2 p-2 text-white">
                            new
                          </div>
                        )}
                        {noteDetails.dpd30os.attribute !== "NULL" && (
                          <div className="badge badge-error badge-xs ml-2 p-2 text-white">
                            DPD 31
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  <td>{noteDetails?.loanNumber || ""}</td>
                  <td>{formatToPeso(noteDetails?.loanAmount)}</td>
                  <td>
                    {formatDate(
                      new Date(noteDetails?.applicationDate),
                      "MMM dd, yyyy"
                    )}
                  </td>
                  <td>{noteDetails?.rm.name || "-"}</td>
                  <td>{noteDetails?.cm.name || "-"}</td>
                  <td>
                    {loanStatus === "done" ? (
                      <>
                        {formatDate(
                          new Date(noteDetails?.score?.runDate),
                          "MMM dd, yyyy"
                        )}{" "}
                        <br />
                        {noteDetails?.score?.decision &&
                          noteDetails?.score?.decision
                            ?.split(",")
                            .map((d) => (
                              <span className="badge badge-error badge-xs p-2 mr-2 text-white">
                                {d.trim()}
                              </span>
                            ))}
                      </>
                    ) : (
                      <>
                        {noteDetails.documents?.length > 0 && (
                          <>
                            {noteDetails.documents?.map((doc) => (
                              <span className="badge badge-error text-white flex items-center m-1 text-xs overflow-ellipsis whitespace-nowrap">
                                {doc}
                              </span>
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </td>
                  <td>
                    <ActionMenu noteDetails={noteDetails} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Suspense
            fallback={<span className="loading loading-dots loading-lg"></span>}
          >
            <CreditParameter selectedNote={selectedNote} doReload={getNotes} />
          </Suspense>
          <div className="divider w-full"></div>
          <div className="p-5 flex justify-between">
            <button
              className={`btn btn-primary`}
              onClick={handleSubmit}
              disabled={selectedRows.length === 0}
            >
              Run Assessment For All Selected
            </button>
            {/* {loanStatus === "pending" ? (
              <div className="join">
                <button className="join-item btn btn-sm btn-active">1</button>
                <button className="join-item btn btn-sm">2</button>
                <button className="join-item btn btn-sm">3</button>
                <button className="join-item btn btn-sm">4</button>
              </div>
            ) : (
              <></>
            )} */}
          </div>
          {loanStatus === "done" && (
            <Suspense
              fallback={
                <div className="h-screen flex items-center justify-center">
                  <span className="loading loading-dots loading-lg"></span>
                </div>
              }
            >
              <AssessmentDrawer
                ref={drawerRef}
                selectedNote={selectedNote}
                doReload={getNotes}
              />
            </Suspense>
          )}
        </div>
      )}
    </>
  );
};

export default Notes;
