import React, { useEffect, useState } from "react";
import LimitedInput from "../Input/LimitedInput";
import CheckboxWithBadge from "../Input/CheckboxWithBadge";
import { postApi } from "@/helpers/api-helpers";

const CreditParameter = ({ selectedNote, doReload }) => {
  const { noteDetails = {} } = selectedNote;
  const [noteToAssess, setNoteToAssess] = useState(noteDetails);

  const doSubmit = async () => {
    const data = await postApi("assessment/run-score", {
      noteToAssess,
    });

    const modal = document.getElementById("credit-modal");
    if (modal) {
      modal.close();
    }

    doReload();
  };

  const updateNote = (field, value) => {
    setNoteToAssess((prevNote) => {
      if (field === "averageMargin") {
        return {
          ...prevNote,
          industry: {
            ...prevNote.industry,
            averageMargin: value,
          },
        };
      } else {
        return {
          ...prevNote,
          [field]: value,
        };
      }
    });
  };

  useEffect(() => {
    setNoteToAssess(noteDetails);
  }, [selectedNote]);

  return (
    <dialog id="credit-modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-11/12 max-w-5xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          {noteToAssess.loanNumber} ({noteToAssess.businessName})
        </h3>
        <div className="divider w-full"></div>
        <div className="overflow-x-auto">
          <table className="table">
            <tbody>
              <tr className="hover">
                <td className="text-primary font-bold">Field Survey</td>
                <td className="hover">
                  <CheckboxWithBadge
                    label=""
                    field="fieldSurvey"
                    value={noteToAssess.fieldSurvey}
                    onChange={updateNote}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="text-primary font-bold">Payment Underlying</td>
                <td>
                  <CheckboxWithBadge
                    label="Payment Underlying"
                    field="paymentUnderlying"
                    value={noteToAssess.paymentUnderlying}
                    onChange={updateNote}
                    trueLabel="Common"
                    falseLabel="Solid"
                    trueClass="badge-neutral"
                    falseClass="badge-warning"
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="text-primary font-bold">Bank Debt</td>
                <td>
                  <LimitedInput
                    value={noteToAssess?.bankDebt || "0.00"}
                    onChange={(value) => updateNote("bankDebt", value)}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="text-primary font-bold">Ongoing Applications Amount</td>
                <td>
                  {" "}
                  <LimitedInput
                    min={0}
                    max={10000000}
                    value={noteToAssess?.loanAmount || "0.00"}
                    onChange={(value) => updateNote("loanAmount", value)}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="text-primary font-bold">Industry Name / Score</td>
                <td>
                  {noteToAssess?.industry?.name} /{" "}
                  {noteToAssess?.industry?.industryScore}
                </td>
              </tr>
              <tr className="hover">
                <td className="text-primary font-bold">Industry Margin (%)</td>
                <td>
                  <LimitedInput
                    min={0}
                    max={100}
                    value={noteToAssess?.industry?.averageMargin || "0.00"}
                    onChange={(value) => updateNote("averageMargin", value)}
                    width="40%"
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="text-primary font-bold">NFIS check</td>
                <td>
                  <CheckboxWithBadge
                    field="nfis"
                    value={noteToAssess.nfis}
                    onChange={updateNote}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="text-primary font-bold">AML check</td>
                <td>
                  <CheckboxWithBadge
                    field="aml"
                    value={noteToAssess.aml}
                    onChange={updateNote}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="text-primary font-bold">CMAP check</td>
                <td>
                  <CheckboxWithBadge
                    field="cmap"
                    value={noteToAssess.cmap}
                    onChange={updateNote}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="py-4 grid grid-cols-4 gap-4 text-sm "></div>
        <div className="divider w-full"></div>
        <div className="flex place-content-between">
          <form method="dialog">
            <button className="btn btn-active">Cancel</button>
          </form>
          <button
            className="btn btn-active btn-secondary text-white"
            onClick={doSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CreditParameter;
