import React from "react";
import PropTypes from "prop-types";
import { SearchIcon } from "../Icons/SearchIcon";
import { EmailIcon } from "../Icons/EmailIcon";

const iconTypes = ["search", "email"];

const svgIcons = {
  search: <SearchIcon />,
  email: <EmailIcon />,
};

const TextInput = ({
  name,
  value,
  placeholder = "",
  startIcon,
  endIcon,
  type = "text"
}) => {
  return (
    <label className="input input-bordered flex items-center gap-2">
      {startIcon && svgIcons[startIcon]}
      <input
        type={type}
        className="grow"
        placeholder={placeholder}
        name={name}
        value={value}
      />
      {endIcon && svgIcons[endIcon]}
    </label>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  startIcon: PropTypes.oneOf(iconTypes),
  endIcon: PropTypes.oneOf(iconTypes),
};

export default TextInput;
