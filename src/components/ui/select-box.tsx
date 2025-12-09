import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";

export default function SelectBox({
  label,
  options,
  defaultValue,
  onChange,
  style = {},
  className = "",
  isDisableFirstOption = false,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (defaultValue) {
      const defaultOption = options.find((option) => option.label === defaultValue || option.value === defaultValue);
      setSelectedOption(defaultOption);
    }
  }, [defaultValue, options]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "35px", // Reduce the height of the box
      height: "30px", // Explicit height control
      padding: "0px 4px", // Reduce padding to make it more compact
      //overflowY: "auto",
      borderColor: state.isFocused ? "#80bdff" : base.borderColor,
      // "&:hover": {
      //   borderColor: "#80bdff",
      // },
      boxShadow: state.isFocused ? "0 0 0 4px rgba(128, 189, 255, 0.5)" : base.boxShadow,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0px 6px", // Reduce padding inside the box
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "32px", // Match the control height
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999, // Ensure the dropdown appears above other elements
      padding: "5px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Ensure portal menu is on top
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#ccc" : state.isFocused ? "var(--red)" : base.backgroundColor,
      color: state.isSelected ? "#000" : state.isFocused ? "#fff" : "#000", // Set text color to black
      cursor: "pointer",
      padding: "10px",
      borderRadius: "4px",
    }),
    multiValueRemove: (base, state) => ({
      ...base,
      color: state.isFocused ? "var(--red)" : base.color,
      "&:hover": {
        backgroundColor: "var(--red)",
        color: "#fff",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333", // Dark grey color for selected value
    }),
    placeholder: (base) => ({
      ...base,
      color: "#666", // Dark grey color for placeholder
    }),
  };

  // Disable the first option if isDisableFirstOption is true
  const formattedOptions = isDisableFirstOption
    ? options.map((option, index) => ({
      ...option,
      isDisabled: index === 0,
    }))
    : options;

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption?.value);
  };

  return (
    <div className={`${className}`} style={style}>
      {label && <label>{label}</label>}
      <Select
        options={formattedOptions}
        value={selectedOption}
        onChange={handleChange}
        isOptionDisabled={(option) => option.isDisabled}
        styles={customStyles}
        menuPortalTarget={document.body}
      />
    </div>
  );
}