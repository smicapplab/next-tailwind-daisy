import React, { useEffect, useState } from "react";
import LimitedInput from "../Input/LimitedInput";
import CheckboxWithBadge from "../Input/CheckboxWithBadge";
import { postApi } from "@/helpers/api-helpers";

const Comments = ({ selectedNote, doReload }) => {
  const { noteDetails = {} } = selectedNote;
  const [noteToAssess, setNoteToAssess] = useState(noteDetails);

  const doSubmit = async () => {
    const data = await postApi("assessment/run-score", {
      noteToAssess,
    });

    const modal = document.getElementById("comment-modal");
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
    <dialog id="comment-modal" className="modal modal-bottom sm:modal-middle">
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
          xxxx
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

export default Comments;
