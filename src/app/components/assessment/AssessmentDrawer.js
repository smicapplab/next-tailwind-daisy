import { formatDate } from "date-fns";
import numeral from "numeral";
import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import RiskRating1 from "../riskRating/RiskRating1";
import RiskRating4 from "../riskRating/RiskRating4";
import RiskRating3 from "../riskRating/RiskRating3";
import RiskRating2 from "../riskRating/RiskRating2";

const AssessmentDrawer = forwardRef(({ selectedNote }, ref) => {
  const { noteDetails = {} } = selectedNote;
  const [noteToAssess, setNoteToAssess] = useState(noteDetails);

  const drawerCheckboxRef = useRef(null);

  useImperativeHandle(ref, () => ({
    openDrawer: () => {
      if (drawerCheckboxRef.current) {
        drawerCheckboxRef.current.checked = true;
      }
    },
    closeDrawer: () => {
      if (drawerCheckboxRef.current) {
        drawerCheckboxRef.current.checked = false;
      }
    },
  }));

  useEffect(() => {
    setNoteToAssess(noteDetails);
  }, [selectedNote]);

  return (
    <div className="drawer drawer-end">
      <input
        id="assessment-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerCheckboxRef}
      />
      <div className="drawer-side">
        <label
          htmlFor="assessment-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-1/2 sm:w-9/10 flex items-center">
          <div className="p-1 rounded-lg w-full">
            <div className="m-2">
              <span className="text-lg font-bold">
                {noteToAssess.loanNumber} ({noteToAssess.businessName})
              </span>
              <div
                className={`badge ml-2
                ${noteToAssess.score?.color === "WHITE" && "badge-outline"}
                ${
                  noteToAssess.score?.color === "GRAY" &&
                  "bg-gray-500 text-white"
                }
                ${
                  noteToAssess.score?.color === "BLACK" && "bg-black text-white"
                }`}
              >
                {noteToAssess.score?.color.toLowerCase()}
              </div>
              <div className="divider w-full"></div>
              <div className="card card-bordered bg-white">
                <div className="card-body">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {noteToAssess.score?.totalScore}
                      </div>
                      <div>Total Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {noteToAssess.score?.riskRating1}
                      </div>
                      <div>
                        Risk Rating <RiskRating1 />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {noteToAssess.score?.decision}
                      </div>
                      <div>Decision</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card card-bordered bg-white mt-2">
                <div className="card-body">
                  <span className="text-lg font-bold">Summary</span>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Run Date</th>
                        <td>
                          {noteToAssess.score &&
                            noteToAssess.score.runDate &&
                            formatDate(
                              new Date(noteToAssess.score.runDate),
                              "MMM dd, yyyy"
                            )}
                        </td>
                      </tr>
                      <tr>
                        <th>Loan Amount</th>
                        <td>
                          {numeral(noteToAssess.loanAmount || 0).format(
                            "0,000.00"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Field Survey</th>
                        <td>{noteToAssess.fieldSurvey}</td>
                      </tr>
                      <tr></tr>
                      <tr>
                        <th>NFIS</th>
                        <td>{noteToAssess.nfis}</td>
                      </tr>
                      <tr>
                        <th>AML</th>
                        <td>{noteToAssess.aml}</td>
                      </tr>
                      <tr>
                        <th>CMAP</th>
                        <td>{noteToAssess.cmap}</td>
                      </tr>
                      <tr>
                        <th>Bank Debt</th>
                        <td>
                          {numeral(noteToAssess.bankDebt).format("0,000.00")}
                        </td>
                      </tr>
                      <tr>
                        <th>Customer Type</th>
                        <td>
                          {
                            noteToAssess.score?.customerType
                              ?.attribute
                          }
                        </td>
                        <td className="text-right">
                          {numeral(
                            noteToAssess.score?.customerType
                              ?.partialScore
                          ).format("0.00")}
                        </td>
                      </tr>
                      <tr>
                        <th>Payment Underlying</th>
                        <td>
                          {
                            noteToAssess.score?.paymentUnderlyingScore
                              ?.attribute
                          }
                        </td>
                        <td className="text-right">
                          {numeral(
                            noteToAssess.score?.paymentUnderlyingScore
                              ?.partialScore
                          ).format("0.00")}
                        </td>
                      </tr>
                      <tr>
                        <th>30 Days Past Due</th>
                        <td>
                          {noteToAssess.dpd30os?.attribute === "NULL"
                            ? "0.00"
                            : noteToAssess.dpd30os?.attribute}
                        </td>
                        <td className="text-right">
                          {noteToAssess.dpd30os?.partialScore}
                        </td>
                      </tr>
                      <tr>
                        <th>Industry</th>
                        <td>{noteToAssess.industry?.name}</td>
                        <td className="text-right">
                          {numeral(noteToAssess.industry?.industryScore).format(
                            "0.00"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Debt-Service Coverage Ratio</th>
                        <td>{noteToAssess.score?.dscr.attribute}</td>
                        <td className="text-right">
                          {numeral(
                            noteToAssess.score?.dscr?.partialScore
                          ).format("0.00")}
                        </td>
                      </tr>
                      <tr>
                        <th>Debt Equity Ratio</th>
                        <td>{noteToAssess.score?.debtEquityRatio.attribute}</td>
                        <td className="text-right">
                          {numeral(
                            noteToAssess.score?.debtEquityRatio?.partialScore
                          ).format("0.00")}
                        </td>
                      </tr>
                      <tr>
                        <th>Current Ratio</th>
                        <td>{noteToAssess.score?.currentRatio.attribute}</td>
                        <td className="text-right">
                          {numeral(
                            noteToAssess.score?.currentRatio?.partialScore
                          ).format("0.00")}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Avg Credits</th>
                        <td>{noteToAssess.score?.totalAvgCredits.attribute}</td>
                        <td className="text-right">
                          {numeral(
                            noteToAssess.score?.totalAvgCredits?.partialScore
                          ).format("0.00")}
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <span className="mr-2">Risk Rating 1</span>{" "}
                          <RiskRating1 position="-mt-16 ml-5" />
                        </th>
                        <td className="flex items-center">
                          {noteToAssess.score?.riskRating1}{" "}
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <span className="mr-2">Risk Rating 2</span>{" "}
                          <RiskRating2 position="-mt-16 ml-5" />
                        </th>
                        <td>{noteToAssess.score?.riskRating2}</td>
                      </tr>
                      <tr>
                        <th>
                          <span className="mr-2">Risk Rating 3</span>{" "}
                          <RiskRating3 position="-mt-36 ml-5" />
                        </th>
                        <td>{noteToAssess.score?.riskRating3}</td>
                      </tr>
                      <tr>
                        <th>
                          <span className="mr-2">Risk Rating 4</span>{" "}
                          <RiskRating4 position="-mt-96 ml-5" />
                        </th>
                        <td>{noteToAssess.score?.riskRating4}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AssessmentDrawer;
