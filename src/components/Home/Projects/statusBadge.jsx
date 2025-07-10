import { useState, useEffect, useRef } from "react";

const StatusBadge = ({
  status: initialStatus,
  statusOptions,
  onStatusChange,
}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Create a ref for the wrapper div to detect outside clicks
  const wrapperRef = useRef(null);

  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusSelect = (newStatus) => {
    setCurrentStatus(newStatus);
    setIsDropdownOpen(false);

    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener on unmount or when dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      className="status-badge-wrapper"
      style={{ position: "relative", display: "inline-block" }}
      ref={wrapperRef} // Attach ref here
    >
      <div
        onClick={toggleDropdown}
        className="status-display"
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && toggleDropdown()
        }
      >
        <span
          className={`status-${currentStatus
            ?.toLowerCase()
            .replace("_", "-")} rounded-full w-[5px] h-[5px]`}
        ></span>
        <span>
          {currentStatus &&
            currentStatus
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
        </span>
      </div>

      {isDropdownOpen && (
        <div
          className="status-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            minWidth: "100%",
            zIndex: 1000,
          }}
        >
          {statusOptions &&
            statusOptions?.map((option) => (
              <span
                key={option}
                onClick={() => handleStatusSelect(option)}
                className={`dropdown-item ${option?.toLowerCase().replace(" ", "-") ===
                  currentStatus?.toLowerCase().replace(" ", "-")
                  ? "selected"
                  : ""
                  }`}
                role="option"
                aria-selected={
                  option?.toLowerCase().replace(" ", "-") ===
                  currentStatus?.toLowerCase().replace(" ", "-")
                }
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  handleStatusSelect(option)
                }
              >
                {option
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

export default StatusBadge;
