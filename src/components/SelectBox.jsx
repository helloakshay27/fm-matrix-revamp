import React from "react";
import Select from "react-select";

export default function SelectBox({
  label,
  options,
  value,
  onChange,
  style = {},
  className = "",
  isDisableFirstOption = false,
  card = false,
  placeholder,
  table = false,
  mom = false,
  validator = false,
}) {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "30px",
      padding: "1px",
      position: "relative",
      zIndex: 8,
      border: validator ? "1px solid red" : table ? "none" : "1px solid #b3b2b2",

      boxShadow: state.isFocused ? "#ccc" : base.boxShadow,
      "&:hover": {
        outline: "none",
      },
      borderRadius: "0px",
      backgroundColor: table ? "none" : card ? "#FAF8F5" : "#fff",
      fontSize: "12px",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0px 6px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "32px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      padding: "5px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: state.isSelected
        ? "#D3D3D3"
        : state.isFocused
          ? "#c72030"
          : "transparent",
      color: state.isSelected ? "#333" : state.isFocused ? "white" : "black",
      cursor: "pointer",
      padding: "10px",
      borderRadius: "4px",
      fontSize: "13px",
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
      color: "#333",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#666",
      fontSize: "12px",
    }),
  };

  const formattedOptions = isDisableFirstOption
    ? options.map((option, index) => ({
      ...option,
      isDisabled: index === 0,
    }))
    : options;

  const selected = formattedOptions.find((opt) => opt.value === value) || null;

  return (
    <div className={`${className}`} style={style} >
      {label && <label>{label}</label>}
      <Select
        options={formattedOptions}
        value={selected}
        onChange={(option) => onChange(mom ? option : option?.value)}
        isOptionDisabled={(option) => option.isDisabled}
        styles={customStyles}
        menuPortalTarget={document.body}
        placeholder={placeholder}
        menuPosition="fixed"
      />
    </div>
  );
}
