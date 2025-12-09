import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const SitevisitList = () => {
  const [siteVisits, setSiteVisits] = useState([]);
  // const [filteredSiteVisits, setFilteredSiteVisits] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [siteVisitPermission, setSiteVisitPermission] = useState({});
  const navigate = useNavigate();
  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("sitevisit_list_currentPage")) || 1;
  };
  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });
  const pageSize = 10;

  const getSiteVisitPermission = () => {
            try {
              const lockRolePermissions = localStorage.getItem("lock_role_permissions");
              if (!lockRolePermissions) return {};
          
              const permissions = JSON.parse(lockRolePermissions);
              return permissions.site_visit || {}; // 👈 Fetching amenities-specific permissions
            } catch (e) {
              console.error("Error parsing lock_role_permissions:", e);
              return {};
            }
          };
        
          useEffect(() => {
            const permissions = getSiteVisitPermission();
            console.log("Event permissions:", permissions);
            setSiteVisitPermission(permissions);
          }, []);
  

  useEffect(() => {
    const fetchSiteVisits = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${baseURL}site_schedule_requests/all_site.json`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const data = response.data;
        setSiteVisits(data);
        // setFilteredSiteVisits;
        setPagination({
          current_page: getPageFromStorage(),
          total_count: data.length,
          total_pages: Math.ceil(data.length / pageSize),
        });
      } catch (error) {
        setError("Failed to fetch site visits. Please try again later.");
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };
    fetchSiteVisits();
  }, []);

  // useEffect(() => {
  //   if (!searchQuery) {
  //     setFilteredSiteVisits(siteVisits);
  //     return;
  //   }
  //   const filteredData = siteVisits.filter(
  //     (visit) => visit.project_name && visit.project_name.includes(searchQuery)
  //   );
  //   setFilteredSiteVisits(filteredData);
  // }, [searchQuery, siteVisits]);

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("sitevisit_list_currentPage", pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prevState) => ({ ...prevState, current_page: 1 }));
  };
  const filteredData = siteVisits?.filter(
    (visit) =>
      !searchQuery ||
      (visit.project_name &&
        visit.project_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalFiltered = filteredData?.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("s[name_cont]", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const startIndex = (pagination.current_page - 1) * pageSize;
  // const paginatedData = filteredSiteVisits.slice(
  //   startIndex,
  //   startIndex + pageSize
  // );

  const displayedVisits = filteredData?.slice(
    (pagination.current_page - 1) * pageSize,
    pagination.current_page * pageSize
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
                          fill="var(--red)"
                        />
                        <path
                          d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                          fill="var(--red)"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>{" "}
            </div>
            {/* <div className="card-tools mt-1">
              <button
                className="purple-btn2 rounded-3"
                fdprocessedid="xn3e6n"
                onClick={() => navigate("/sitevisit-create")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                </svg>
                <span>Add</span>
              </button>
            </div> */}
          </div>
          <div className="card mt-3 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Site Visit List</h3>
            </div>
            <div className="card-body mt-3 pb-4 pt-0">
              {loading ? (
                <div className="text-center">
                  <div
                    className="spinner-border"
                    role="stastus"
                    style={{ color: "var(--red)" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="tbl-container mt-4">
                  <table className="w-100">
                    <thead>
                      <tr>
                      {/* <th>Action</th> */}

                        <th>Sr No</th>
                        <th>Status</th>
                        <th>Scheduled Time</th>
                        <th>Project Name</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>

                      </tr>
                    </thead>
                    <tbody>
                      {displayedVisits?.length > 0 ? (
                        displayedVisits.map((visit, index) => (
                          <tr key={visit.id}>
                            {/* <td>
                              <a
                                href={`/sitevisit-edit/${visit.id}`}
                                className="me-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M13.93 6.46611L8.7982 11.5979C8.68827 11.7078 8.62708 11.862 8.62708 12.0183L8.67694 14.9367C8.68261 15.2495 8.93534 15.5023 9.24815 15.5079L12.1697 15.5578H12.1788C12.3329 15.5578 12.4803 15.4966 12.5879 15.3867L19.2757 8.69895C19.9341 8.0405 19.9341 6.96723 19.2757 6.30879L17.8806 4.91368C17.561 4.59407 17.1349 4.4173 16.6849 4.4173C16.2327 4.4173 15.8089 4.5941 15.4893 4.91368L13.93 6.46611C13.9334 6.46271 13.93 6.46271 13.93 6.46611ZM11.9399 14.3912L9.8274 14.3561L9.79227 12.2436L14.3415 7.69443L16.488 9.84091L11.9399 14.3912ZM16.3066 5.73151C16.5072 5.53091 16.8574 5.53091 17.058 5.73151L18.4531 7.12662C18.6593 7.33288 18.6593 7.66948 18.4531 7.87799L17.3096 9.0215L15.1631 6.87502L16.3066 5.73151Z"
                                    fill="#667085"
                                  />
                                  <path
                                    d="M7.42035 20H16.5797C18.4655 20 20 18.4655 20 16.5797V12.0012C20 11.6816 19.7393 11.4209 19.4197 11.4209C19.1001 11.4209 18.8395 11.6816 18.8395 12.0012V16.582C18.8395 17.8264 17.8274 18.8418 16.5797 18.8418H7.42032C6.17593 18.8418 5.16048 17.8298 5.16048 16.582V7.42035C5.16048 6.17596 6.17254 5.16051 7.42032 5.16051H12.2858C12.6054 5.16051 12.866 4.89985 12.866 4.58026C12.866 4.26066 12.6054 4 12.2858 4H7.42032C5.53449 4 4 5.53452 4 7.42032V16.5797C4.00227 18.4677 5.53454 20 7.42035 20Z"
                                    fill="#667085"
                                  />
                                </svg>
                              </a>
                            </td> */}
                            <td>{startIndex + index + 1}</td>
                            <td>{visit.status || "-"}</td>
                            <td>{visit.scheduled_time || "-"}</td>
                            <td>{visit.project_name || "-"}</td>
                            <td>{visit.name || "-"}</td>
                            <td>{visit.email || "-"}</td>
                            <td>{visit.mobile_no || "-"}</td>
                            
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No site visits found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="d-flex align-items-center justify-content-between px-3 pagination-section">
                    <ul
                      className="pagination"
                      role="navigation"
                      aria-label="pager"
                    >
                      {/* First Button */}
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

                      {/* Previous Button */}
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

                      {/* Dynamic Page Numbers with Ellipsis */}
                      {(() => {
                        const totalPages = pagination.total_pages;
                        const currentPage = pagination.current_page;
                        const pageNumbers = [];

                        let startPage = Math.max(currentPage - 2, 1);
                        let endPage = Math.min(startPage + 4, totalPages);

                        // Adjust start if end is near total
                        if (endPage - startPage < 5) {
                          startPage = Math.max(endPage - 4, 1);
                        }

                        // Show first page and ellipsis if needed
                        if (startPage > 1) {
                          pageNumbers.push(
                            <li key={1} className="page-item">
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(1)}
                              >
                                1
                              </button>
                            </li>
                          );
                          if (startPage > 2) {
                            pageNumbers.push(
                              <li
                                key="start-ellipsis"
                                className="page-item disabled"
                              >
                                <span className="page-link">...</span>
                              </li>
                            );
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(
                            <li
                              key={i}
                              className={`page-item ${
                                pagination.current_page === i ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(i)}
                              >
                                {i}
                              </button>
                            </li>
                          );
                        }

                        // Show end ellipsis and last page
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pageNumbers.push(
                              <li
                                key="end-ellipsis"
                                className="page-item disabled"
                              >
                                <span className="page-link">...</span>
                              </li>
                            );
                          }
                          pageNumbers.push(
                            <li key={totalPages} className="page-item">
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(totalPages)}
                              >
                                {totalPages}
                              </button>
                            </li>
                          );
                        }

                        return pageNumbers;
                      })()}

                      {/* Next Button */}
                      <li
                        className={`page-item ${
                          pagination.current_page === pagination.total_pages
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.current_page + 1)
                          }
                          disabled={
                            pagination.current_page === pagination.total_pages
                          }
                        >
                          Next
                        </button>
                      </li>

                      {/* Last Button */}
                      <li
                        className={`page-item ${
                          pagination.current_page === pagination.total_pages
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(pagination.total_pages)
                          }
                          disabled={
                            pagination.current_page === pagination.total_pages
                          }
                        >
                          Last
                        </button>
                      </li>
                    </ul>

                    {/* Showing entries count */}
                    <div>
                      <p className="mb-0">
                        Showing{" "}
                        {Math.min(
                          (pagination.current_page - 1) * pageSize + 1 || 1,
                          pagination.total_count
                        )}{" "}
                        to{" "}
                        {Math.min(
                          pagination.current_page * pageSize,
                          pagination.total_count
                        )}{" "}
                        of {pagination.total_count} entries
                      </p>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default SitevisitList;
