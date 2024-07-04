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
import ClearIcon from "../Icons/ClearIcon";
import Comments from "./Comments";
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

const filterTableData = (tableData, filters) => {
  return tableData.filter((item) => {
    const filterByCM = filters.cm ? item.cm.name.includes(filters.cm) : true;
    const filterByRM = filters.rm ? item.rm.name.includes(filters.rm) : true;
    const filterByIssuer = filters.issuer
      ? item.businessName.includes(filters.issuer)
      : true;
    const filterByKeyword = filters.keyword
      ? item.loanNumber.includes(filters.keyword)
      : true;

    return filterByCM && filterByRM && filterByIssuer && filterByKeyword;
  });
};

const Notes = ({ loanStatus, getPendingCount }) => {
  const { addToast } = useContext(ToastContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNote, setSelectedNote] = useState({});
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState({
    keyword: "",
    cm: "",
    rm: "",
    issuer: "",
  });
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

  const clearFilters = () => {
    setFilters({
      keyword: "",
      cm: "",
      rm: "",
      issuer: "",
    });
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

  const handleSubmit = async () => {
    setBulkLoading(true);
    try {
      await postApi("assessment/bulk-assessment", {
        selectedRows,
      });
      await getNotes();
    } catch (err) {
      addToast({
        message: "It is what it is... error eh? Luckily this is a test. Ooops!",
        type: "error",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const openCreditModal = (noteDetails) => {
    setSelectedNote(noteDetails);
    document.getElementById("credit-modal").showModal();
  };

  const openCommentModal = (noteDetails) => {
    setSelectedNote(noteDetails);
    document.getElementById("comment-modal").showModal();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
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

  const filteredData = filterTableData(tableData, filters);

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
                  <input
                    name="keyword"
                    type="text"
                    className="grow"
                    placeholder="Search"
                    value={filters.keyword}
                    onChange={handleFilterChange}
                  />
                  <SearchIcon />
                </label>
              </div>
              <div className="w-full flex align-middle">
                <select
                  name="issuer"
                  className="select select-bordered w-full max-w-xs mr-1"
                  value={filters.issuer}
                  onChange={handleFilterChange}
                >
                  <option value="" disabled>
                    Issuers
                  </option>
                  {issuers?.map((issuer, i) => (
                    <option key={i} value={issuer}>
                      {issuer}
                    </option>
                  ))}
                </select>
                <select
                  name="rm"
                  className="select select-bordered w-full max-w-xs mr-1"
                  value={filters.rm}
                  onChange={handleFilterChange}
                >
                  <option value="" disabled>
                    Relationship Managers
                  </option>
                  {rms?.map((rm, i) => (
                    <option key={i} value={rm}>
                      {rm}
                    </option>
                  ))}
                </select>

                <select
                  name="cm"
                  className="select select-bordered w-full max-w-xs mr-1"
                  value={filters.cm}
                  onChange={handleFilterChange}
                >
                  <option value="" disabled>
                    Credit Managers
                  </option>
                  {cms?.map((cm, i) => (
                    <option key={i} value={cm}>
                      {cm}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-neutral ml-2 text-white"
                  onClick={clearFilters}
                >
                  <ClearIcon /> Clear Filter
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
                  <th
                    key={h}
                    className="text-center text-primary font-semibold text-sm"
                  >
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
              {filteredData.map((noteDetails) => (
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
                ${
                  noteDetails.score?.color === "GRAY" &&
                  "bg-gray-500 text-white"
                }
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
                          noteDetails?.score?.decision?.split(",").map((d) => (
                            <span
                              key={d}
                              className="badge badge-error badge-xs p-2 mr-2 text-white"
                            >
                              {d.trim()}
                            </span>
                          ))}
                      </>
                    ) : (
                      <>
                        {noteDetails.documents?.length > 0 && (
                          <>
                            {noteDetails.documents?.map((doc) => (
                              <span
                                key={doc}
                                className="badge badge-error text-white flex items-center m-1 text-xs overflow-ellipsis whitespace-nowrap"
                              >
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
          <Suspense
            fallback={<span className="loading loading-dots loading-lg"></span>}
          >
            <Comments selectedNote={selectedNote} doReload={getNotes} />
          </Suspense>
          <div className="divider w-full"></div>
          <div className="p-5 flex justify-between">
            {bulkLoading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              <button
                className={`btn btn-primary`}
                onClick={() => handleSubmit()}
                disabled={selectedRows.length === 0}
              >
                Run Assessment For All Selected
              </button>
            )}
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
