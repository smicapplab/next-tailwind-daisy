import { formatCurrency } from "@/helpers/formatter";
import React, { useEffect, useState } from "react";

const LimitedInput = ({
  type = "text",
  placeholder = "",
  name,
  value,
  onChange,
  startIcon,
  endIcon,
  min = -10000000,
  max = 10000000,
  className = "grow",
  width = "full",
}) => {
  const [initialFormat, setInitialFormat] = useState(true);

  const handleChange = (e) => {
    let inputValue = e.target.value;
    onChange(inputValue);
  };

  const handleBlur = (e) => {
    let inputValue = parseFloat(e.target.value.replace(/,/g, ""));

    if (isNaN(inputValue)) {
      inputValue = 0;
    }

    inputValue = Math.max(min, Math.min(inputValue, max));

    const formattedValue = formatCurrency(inputValue);

    onChange(formattedValue);
  };

  useEffect( () => {
    if( value && initialFormat ){
        const formattedValue = formatCurrency(value);
        onChange(formattedValue);
        setInitialFormat(false)
    }
  }, 
  [value])

  return (
    <label
      className={`input input-bordered flex items-center gap-2 ${
        width === "full" ? "w-full" : ""
      }`}
      style={{ width: width !== "full" ? width : "auto" }}
    >
      {startIcon && <span className="icon">{startIcon}</span>}
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {endIcon && <span className="icon">{endIcon}</span>}
    </label>
  );
};

export default LimitedInput;
