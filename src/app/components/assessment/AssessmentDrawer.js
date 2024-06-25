import { useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";

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
        <div className="menu bg-base-200 text-base-content min-h-full w-1/2 sm:w-9/10 p-4">
          <h1 className="text-lg font-bold">{ noteToAssess.loanNumber }({ noteToAssess.businessName })</h1>
          <div className="divider w-full"></div>
        </div>
      </div>
    </div>
  );
});

export default AssessmentDrawer;