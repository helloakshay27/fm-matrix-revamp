-import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "../components/reusable/Pagination";

export default function DemandNotes() {
  const [demandNotes, setDemandNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("demand_notes_currentPage")) || 1;
  };
  const [currentPage, setCurrentPage] = useState(getPageFromStorage());
  const pageSize = 10;

  useEffect(() => {
    const fetchDemandNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://piramal-loyalty-dev.lockated.com/demand_notes"
        );
        setDemandNotes(response.data.demand_notes || []);
      } catch (error) {
        setError("Failed to fetch demand notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDemandNotes();

    // Parse search query from URL if any
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const handlePageChange = (pageNumber) => {
    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPage);
    localStorage.setItem("demand_notes_currentPage", validPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    localStorage.setItem("demand_notes_currentPage", 1);
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Filter by booking_number, customer_code, or demand_number
  const filteredData = demandNotes.filter((note) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (note.booking_number && note.booking_number.toLowerCase().includes(q)) ||
      (note.customer_code && note.customer_code.toLowerCase().includes(q)) ||
      (note.demand_number && note.demand_number.toLowerCase().includes(q))
    );
  });

  const totalFiltered = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
      localStorage.setItem("demand_notes_currentPage", 1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const displayedNotes = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-100">
      <div className="module-data-section mt-2">
        {/* <p className="pointer">
          <span>Demand Notes</span> &gt; Manage Demand Notes
        </p> */}
        <div className="card mt-3 mx-3">
          <div className="card-header mb-0">
            <h3 className="card-title">Manage Demand Notes</h3>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div />
              <div className="d-flex align-items-center">
                <div className="input-group me-3">
                  <input
                    type="text"
                    className="form-control tbl-search table_search"
                    placeholder="Search by name or description"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="input-group-append">
                    <button type="button" className="btn btn-md btn-default">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                          fill="#8B0203"
                        />
                        <path
                          d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                          fill="#8B0203"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tbl-container"
              style={{
                height: "100%",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <>
                  <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>                <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Project ID</th>
                      <th>Booking Number</th>
                      <th>Customer Code</th>
                      <th>Demand Number</th>
                      <th>Percentage</th>
                      <th>Amount</th>
                      <th>Raised Date</th>
                      <th>Expected Date</th>
                      <th>CGST</th>
                      <th>SGST</th>
                      <th>Total Tax</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                    <tbody style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                      {displayedNotes.length > 0 ? (
                        displayedNotes.map((note, idx) => (
                          <tr key={note.id}>
                            <td style={{ width: '7%' }}>{startIndex + idx + 1}</td>
                            <td style={{ width: '7%' }}>{note.project_id ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.booking_number ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.customer_code ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.demand_number ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.percentage ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.amount ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.raised_date ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.expected_date ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.cgst ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.sgst ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.total_tax_amount ?? ""}</td>
                            <td style={{ width: '7%' }}>{note.total_amount ?? ""}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="13" className="text-center">
                            No demand notes found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
              {/* Pagination Controls */}
              {!loading && totalFiltered > 0 && (
                <nav className="d-flex justify-content-between align-items-center m-4">
                  <ul
                    className="pagination justify-content-center align-items-center"
                    style={{ listStyleType: "none", padding: "0" }}
                  >
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        style={{ padding: "8px 12px", color: "#a78847" }}
                      >
                        First
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ padding: "8px 12px", color: "#a78847" }}
                      >
                        Prev
                      </button>
                    </li>

                    {/* Dynamic page numbers */}
                    {(() => {
                      const pages = [];
                      const maxVisiblePages = 5;
                      const halfVisible = Math.floor(maxVisiblePages / 2);
                      let startPage, endPage;

                      if (totalPages <= maxVisiblePages) {
                        startPage = 1;
                        endPage = totalPages;
                      } else {
                        if (currentPage <= halfVisible) {
                          startPage = 1;
                          endPage = maxVisiblePages;
                        } else if (currentPage + halfVisible >= totalPages) {
                          startPage = totalPages - maxVisiblePages + 1;
                          endPage = totalPages;
                        } else {
                          startPage = currentPage - halfVisible;
                          endPage = currentPage + halfVisible;
                        }
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(i);
                      }

                      return pages.map((pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNumber)}
                            style={{
                              padding: "8px 12px",
                              color: pageNumber === currentPage ? "#fff" : "#a78847",
                              backgroundColor: pageNumber === currentPage ? "#a78847" : "#fff",
                              border: "2px solid #a78847",
                              borderRadius: "3px",
                            }}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ));
                    })()}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ padding: "8px 12px", color: "#a78847" }}
                      >
                        Next
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        style={{ padding: "8px 12px", color: "#a78847" }}
                      >
                        Last
                      </button>
                    </li>
                  </ul>
                  <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
                    Showing {totalFiltered > 0 ? startIndex + 1 : 0} to{" "}
                    {Math.min(startIndex + pageSize, totalFiltered)} of{" "}
                    {totalFiltered} entries
                  </p>
                </nav>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
