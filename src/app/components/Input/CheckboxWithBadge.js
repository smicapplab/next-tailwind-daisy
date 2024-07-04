import React from "react";

const CheckboxWithBadge = ({ field, value, onChange, trueLabel = "Pass", falseLabel = "Fail", trueClass = "badge-success", falseClass = "badge-error" }) => {
  return (
    <div className="flex justify-between">
        <input
          type="checkbox"
          className="toggle toggle-success"
          checked={value === trueLabel}
          onChange={(e) => onChange(field, e.target.checked ? trueLabel : falseLabel)}
        />
        <div className={`badge badge-outline ${value === trueLabel ? trueClass : falseClass}`}>
          {value}
        </div>
    </div>
  );
};

export default CheckboxWithBadge;