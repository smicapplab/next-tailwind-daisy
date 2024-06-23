import React from "react";

const CheckboxWithBadge = ({ label, field, value, onChange, trueLabel = "Pass", falseLabel = "Fail", trueClass = "badge-success", falseClass = "badge-error" }) => {
  return (
    <>
      <div className="p-2 col-span-2 h-5">{label}</div>
      <div className="p-2 col-span-1 h-5">
        <input
          type="checkbox"
          className="toggle toggle-success"
          checked={value === trueLabel}
          onChange={(e) => onChange(field, e.target.checked ? trueLabel : falseLabel)}
        />
      </div>
      <div className="p-2 col-span-1 h-5">
        <div className={`badge badge-outline ${value === trueLabel ? trueClass : falseClass}`}>
          {value}
        </div>
      </div>
    </>
  );
};

export default CheckboxWithBadge;