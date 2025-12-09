import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";


const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("enquiry_list_currentPage")) || 1;
  };
  
  const [currentPage, setCurrentPage] = useState(getPageFromStorage());
  const pageSize = 10;

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}/enquiry_forms/get_all_enquiry.json`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setEnquiries(response.data.Enquiries || []);
      } catch (error) {
        setError("Failed to fetch enquiries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
    
    // Parse search query from URL if any
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("s[name_cont]");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

console.log("Enquiries:", enquiries);
  const handlePageChange = (pageNumber) => {
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPage);
    localStorage.setItem("enquiry_list_currentPage", validPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    localStorage.setItem("enquiry_list_currentPage", 1);
    
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("s[name_cont]", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Filter data by project name
  const filteredData = enquiries.filter(
    (enquiry) => 
      !searchQuery || 
      (enquiry.project?.project_name && 
       enquiry.project.project_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate pagination values
  const totalFiltered = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  
  // Ensure current page is valid after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
      localStorage.setItem("enquiry_list_currentPage", 1);
    }
  }, [totalPages, currentPage]);

  // Get current page data
  const startIndex = (currentPage - 1) * pageSize;
  const displayedEnquiries = filteredData.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="main-content">
      {/* <div className="website-content overflow-auto"> */}
        <div className="module-data-section container-fluid">
          <div className="d-flex justify-content-end px-4 pt-2 mt-3">
            <div className="col-md-4 pe-2 pt-2">
              <form
                onSubmit={handleSearchSubmit}
                action="/pms/departments"
                acceptCharset="UTF-8"
                method="get"
              >
                <div className="input-group">
                  <input
                    type="text"
                    name="s[name_cont]"
                    id="s_name_cont"
                    className="form-control tbl-search table_search"
                    placeholder="Search"
                    fdprocessedid="u38fp"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="input-group-append">
                    <button
                      type="submit"
                      className="btn btn-md btn-default"
                      fdprocessedid="2wqzh"
                    >
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
              </form>
            </div>
          </div>
          <div className="module-data-section container-fluid">
          <div className="card mt-4 pb-4 mx-3">
            <div className="card-header">
              <h3 className="card-title">Enquiry List</h3>
            </div>
            <div className="card-body mt-3 pb-4 pt-0">
              {loading ? (
                <div className="text-center">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{ color: "var(--red)" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="tbl-container mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr No</th>
                        <th>Project Name</th>
                        <th>Segments</th>
                        <th>Name</th>
                        <th>Mobile Number</th>
                        <th>Email</th>
                        <th>Prefer Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedEnquiries.length > 0 ? (
                        displayedEnquiries.map((enquiry, index) => (
                          <tr key={enquiry.id}>
                            <td>{startIndex + index + 1}</td>
                            <td>{enquiry.project?.project_name || "-"}</td>
                            <td>{enquiry.segment || "-"}</td>
                            <td>{enquiry.name || "-"}</td>
                            <td>{enquiry.mobile_number || "-"}</td>
                            <td>{enquiry.email || "-"}</td>
                            <td>{enquiry.prefer_date || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No enquiries found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {!loading && totalFiltered > 0 && (
               <div className="d-flex align-items-center justify-content-between px-3 pagination-section">
                <ul className="pagination" role="navigation" aria-label="pager">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        First
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                    </li>
                    {Array.from(
                      { length: Math.min(5, totalPages) },
                      (_, i) => {
                        // Show pages around current page
                        let pageToShow;
                        if (totalPages <= 5) {
                          pageToShow = i + 1;
                        } else {
                          const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                          pageToShow = startPage + i;
                        }
                        return pageToShow;
                      }
                    ).map((pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Last
                      </button>
                    </li>
                  </ul>
                  <p>
                    Showing {totalFiltered > 0 ? startIndex + 1 : 0} to{" "}
                    {Math.min(startIndex + pageSize, totalFiltered)} of{" "}
                    {totalFiltered} entries
                  </p>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default EnquiryList;