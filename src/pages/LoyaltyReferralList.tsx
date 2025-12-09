import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {baseURL} from "../pages/baseurl/apiDomain";
import Pagination from "../components/reusable/Pagination";

const LoyaltyReferralList = () => {
  const [referrals, setReferrals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState("");
  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("referral_list_currentPage")) || 1;
  };
  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `${baseURL}referrals/get_all_referrals`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            setError("Unauthorized: Please check your API key or token.");
          } else {
            setError(`HTTP error! status: ${response.status}`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setReferrals(data.referrals || []);
        console.log(data.referrals);
        setPagination((prevState) => ({
          ...prevState,
          total_count: data.referrals.length,
          total_pages: Math.ceil(data.referrals.length / pageSize),
          current_page: getPageFromStorage(),
        }));
      } catch (error) {
        console.error("Error fetching referral data:", error);
        setError("Failed to fetch data.");
        setReferrals([]);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchReferrals();
  }, []);

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("referral_list_currentPage", pageNumber);
  };

  // Update filteredReferrals to search all displayed columns
  const filteredReferrals = referrals.filter((referral) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return [
      referral.name,
      referral.email,
      referral.mobile,
      referral.referral_code,
      referral.project_name,
    ]
      .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
      .some((v) => v.includes(q));
  });

  const totalFiltered = filteredReferrals.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);

  const displayedReferrals = filteredReferrals.slice(
    (pagination.current_page - 1) * pageSize,
    pagination.current_page * pageSize
  );

  return (
    <div className="w-100">
      <div className="module-data-section container-fluid">
        <div className="card mt-3 mx-3">
          <div className="card-header mb-0">
            <h3 className="card-title">Loyalty Referrals</h3>
          </div>
          <div className="card-body">
            {/* <p className="pointer">
              <span>Referrals</span> &gt; Manage Referrals
            </p> */}
            <div className="d-flex justify-content-between align-items-center">
          <div />
          <div className="d-flex align-items-center">
            <div className="input-group me-3">
              <input
                type="text"
                className="form-control tbl-search table_search"
                placeholder="Search by name or description"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((prev) => ({ ...prev, current_page: 1 }));
                }}
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
          className="tbl-container mt-4"
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
              <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '16%' }}>Sr No</th>
                    <th style={{ width: '16%' }}>Name</th>
                    <th style={{ width: '16%' }}>Email</th>
                    <th style={{ width: '16%' }}>Mobile No</th>
                    <th style={{ width: '16%' }}>Referral Code</th>
                    <th style={{ width: '16%' }}>Project Name</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                  {displayedReferrals.length > 0 ? (
                    displayedReferrals.map((referral, index) => (
                      <tr key={referral.id}>
                        <td>{(pagination.current_page - 1) * pageSize + index + 1}</td>
                        <td>{referral.name}</td>
                        <td>{referral.email}</td>
                        <td>{referral.mobile}</td>
                        <td>{referral.referral_code || "N/A"}</td>
                        <td>{referral.project_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No referrals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {!loading && totalFiltered > 0 && (
                <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                  <ul className="pagination justify-content-center d-flex">
                    <li
                      className={`page-item ${
                        pagination.current_page === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.current_page === 1}
                      >
                        First
                      </button>
                    </li>
                    <li
                      className={`page-item ${
                        pagination.current_page === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
                        disabled={pagination.current_page === 1}
                      >
                        Prev
                      </button>
                    </li>
                    
                    {/* Dynamic page numbers with ellipsis */}
                    {(() => {
                      const maxVisiblePages = 5;
                      const currentPage = pagination.current_page;
                      const pages = [];
                      
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                      
                      // Adjust start page if we're near the end
                      if (endPage - startPage < maxVisiblePages - 1) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }
                      
                      // First page and ellipsis
                      if (startPage > 1) {
                        pages.push(
                          <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => handlePageChange(1)}>
                              1
                            </button>
                          </li>
                        );
                        
                        if (startPage > 2) {
                          pages.push(
                            <li key="start-ellipsis" className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                      }
                      
                      // Visible page numbers
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                            <button className="page-link" onClick={() => handlePageChange(i)}>
                              {i}
                            </button>
                          </li>
                        );
                      }
                      
                      // Last page and ellipsis
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <li key="end-ellipsis" className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        
                        pages.push(
                          <li key={totalPages} className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
                            <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                              {totalPages}
                            </button>
                          </li>
                        );
                      }
                      
                      return pages;
                    })()}
                    
                    <li
                      className={`page-item ${
                        pagination.current_page === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                        disabled={pagination.current_page === totalPages}
                      >
                        Next
                      </button>
                    </li>
                    <li
                      className={`page-item ${
                        pagination.current_page === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={pagination.current_page === totalPages}
                      >
                        Last
                      </button>
                    </li>
                  </ul>
                  <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
                    Showing{" "}
                    {Math.min(
                      (pagination.current_page - 1) * pageSize + 1 || 1,
                      totalFiltered
                    )}{" "}
                    to{" "}
                    {Math.min(
                      pagination.current_page * pageSize,
                      totalFiltered
                    )}{" "}
                    of {totalFiltered} entries
                  </p>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LoyaltyReferralList;

