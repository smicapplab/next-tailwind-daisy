import React, { useEffect, useState } from "react";
import LimitedInput from "../Input/LimitedInput";
import CheckboxWithBadge from "../Input/CheckboxWithBadge";
import { postApi } from "@/helpers/api-helpers";

const CreditParameter = ({ selectedNote, doReload }) => {
  const { noteDetails = {} } = selectedNote;
  const [noteToAssess, setNoteToAssess] = useState(noteDetails);

  const doSubmit = async () => {
    console.log({
      noteToAssess
    })

    const data = await postApi("assessment/run-score", {
      noteToAssess,
    });

    const modal = document.getElementById("credit-modal");
    if (modal) {
      modal.close();
    }

    doReload()
  }

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
  }, [noteDetails]);

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
        <div className="py-4 grid grid-cols-4 gap-4">
          <CheckboxWithBadge
            label="Field Survey"
            field="fieldSurvey"
            value={noteToAssess.fieldSurvey}
            onChange={updateNote}
          />

          <CheckboxWithBadge
            label="Payment Underlying"
            field="paymentUnderlying"
            value={noteToAssess.paymentUnderlying}
            onChange={updateNote}
            trueLabel="Common"
            falseLabel="Solid"
            trueClass="badge-primary"
            falseClass="badge-secondary"
          />

          <div className="p-2 col-span-2 h-10">Bank Debt</div>
          <div className="p-2 col-span-2 h-10">
            <LimitedInput
              value={noteToAssess?.bankDebt || ""}
              onChange={(value) => updateNote("bankDebt", value)}
            />
          </div>

          <div className="p-2 col-span-2 h-10">Ongoing Applications Amount</div>
          <div className="p-2 col-span-2 h-10">
            <LimitedInput
              min={0}
              max={10000000}
              value={noteToAssess?.loanAmount || ""}
              onChange={(value) => updateNote("loanAmount", value)}
            />
          </div>

          <div className="p-2 col-span-2 h-10">Industry Margin (%)</div>
          <div className="p-2 col-span-2 h-10">
            <LimitedInput
              min={0}
              max={100}
              value={noteToAssess?.industry?.averageMargin || ""}
              onChange={(value) => updateNote("averageMargin", value)}
              width="40%"
            />
          </div>

          <CheckboxWithBadge
            label="NFIS check"
            field="nfis"
            value={noteToAssess.nfis}
            onChange={updateNote}
          />

          <CheckboxWithBadge
            label="CMAP check"
            field="aml"
            value={noteToAssess.aml}
            onChange={updateNote}
          />

          <CheckboxWithBadge
            label="AML check"
            field="cmap"
            value={noteToAssess.cmap}
            onChange={updateNote}
          />
        </div>
        <div className="divider w-full"></div>
        <div className="flex place-content-between">
          <form method="dialog">
            <button className="btn btn-active">Cancel</button>
          </form>
          <button className="btn btn-active btn-secondary text-white" onClick={doSubmit}>
            Submit
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CreditParameter;
