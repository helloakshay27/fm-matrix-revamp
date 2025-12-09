import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalEntries, 
  onPageChange,
  itemsPerPage = 10,
  showingText = "Showing"
}) => {
  const startEntry = totalEntries > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-between align-items-center px-3 mt-2">
      <ul className="pagination justify-content-center d-flex">
        <li
          className={`page-item ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
        </li>
        <li
          className={`page-item ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
        </li>
        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${
              currentPage === pageNumber ? "active" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </li>
      </ul>
      <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
        {showingText} {startEntry} to {endEntry} of {totalEntries} entries
      </p>
    </div>
  );
};

export default Pagination;