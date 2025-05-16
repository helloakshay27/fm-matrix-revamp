import React, { useState, useEffect } from 'react';

const StatusBadge = ({ status:initialStatus ,statusOptions, onStatusChange}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log(statusOptions);

  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusSelect = (newStatus) => {
    setCurrentStatus(newStatus);
    setIsDropdownOpen(false);
    onStatusChange(newStatus);
    // if (onStatusChange) {
    //   onStatusChange(newStatus);
    // }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  return (
    <div className="status-badge-wrapper">
      <div
        onClick={toggleDropdown}
        className={`status-display status-${currentStatus.toLowerCase().replace(' ', '-')}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleDropdown()}
      >
        {currentStatus}
      </div>

      {isDropdownOpen && (
        <div className="status-dropdown">
          {statusOptions.map((option) => (
            <span
              key={option}
              onClick={() => handleStatusSelect(option)}
              className={`dropdown-item ${option.toLowerCase().replace(' ', '-') === currentStatus.toLowerCase().replace(' ', '-') ? 'selected' : ''}`}
              role="option"
              aria-selected={option.toLowerCase().replace(' ', '-') === currentStatus.toLowerCase().replace(' ', '-')}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStatusSelect(option)}
            >
              {option}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBadge;