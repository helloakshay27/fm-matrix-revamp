import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";

const NoticeboardList = () => {
  const [noticeboards, setNoticeboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [noticeboardPermission, setNoticeboardPermission] = useState({});
  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("noticeboard_list_currentPage")) || 1;
  };
  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;
  const navigate = useNavigate();

  const getNoticeboardPermission = () => {
    try {
      const lockRolePermissions = localStorage.getItem("lock_role_permissions");
      if (!lockRolePermissions) return { create: "true", update: "true", show: "true", destroy: "true" };

      const permissions = JSON.parse(lockRolePermissions);
      // Return default permissions if noticeboard permissions don't exist
      return permissions.noticeboard || { create: "true", update: "true", show: "true", destroy: "true" };
    } catch (e) {
      console.error("Error parsing lock_role_permissions:", e);
      return { create: "true", update: "true", show: "true", destroy: "true" };
    }
  };

  useEffect(() => {
    const permissions = getNoticeboardPermission();
    console.log("Noticeboard permissions:", permissions);
    setNoticeboardPermission(permissions);
  }, []);

  useEffect(() => {
    const fetchNoticeboards = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`${baseURL}noticeboards.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);

        // Handle different response formats - API returns direct array
        let noticeboardsData = [];
        if (Array.isArray(data)) {
          // API returns direct array of noticeboards
          noticeboardsData = data;
        } else if (data.noticeboards && Array.isArray(data.noticeboards)) {
          noticeboardsData = data.noticeboards;
        } else if (data.data && Array.isArray(data.data)) {
          noticeboardsData = data.data;
        }

        console.log("Processed noticeboards data:", noticeboardsData);
        console.log("Number of noticeboards:", noticeboardsData.length);
        setNoticeboards(noticeboardsData);

        setPagination({
          current_page: getPageFromStorage(),
          total_count: noticeboardsData.length,
          total_pages: Math.ceil(noticeboardsData.length / pageSize),
        });

      } catch (error) {
        console.error("Error fetching noticeboards:", error);
        toast.error("Failed to fetch noticeboards");
        setNoticeboards([]);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchNoticeboards();
  }, []); // Empty dependency array to run only once on mount

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prevState) => ({ ...prevState, current_page: 1 }));
  };

  const filteredNoticeboards = noticeboards
    .filter((noticeboard) =>
      (noticeboard.notice_heading || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (noticeboard.notice_text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (noticeboard.notice_type || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  console.log("Total noticeboards:", noticeboards.length);
  console.log("Filtered noticeboards:", filteredNoticeboards.length);
  console.log("Search query:", searchQuery);

  const displayedNoticeboards = filteredNoticeboards
    .slice(
      (pagination.current_page - 1) * pageSize,
      pagination.current_page * pageSize
    );

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("noticeboard_list_currentPage", pageNumber);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("s[name_cont]", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  const handleToggleNoticeboard = async (noticeboardId, currentStatus) => {
    try {
      const response = await fetch(`${baseURL}noticeboards/${noticeboardId}.json`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noticeboard: { active: !currentStatus } }),
      });

      toast.success("Updated Status");
      if (!response.ok) {
        throw new Error("Failed to update noticeboard status");
      }

      // Update the local state after API success
      setNoticeboards((prevNoticeboards) =>
        prevNoticeboards.map((noticeboard) =>
          noticeboard.id === noticeboardId ? { ...noticeboard, active: !currentStatus } : noticeboard
        )
      );
    } catch (error) {
      console.error("Error updating noticeboard status:", error);
    }
  };

  function formatDateTimeManual(datetime) {
    if (!datetime) return "-";
    const date = new Date(datetime);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="main-content">
      {/* <div className="website-content overflow-auto"> */}
      <div className="module-data-section container-fluid">
        <div className="d-flex justify-content-end px-4">
          <div className="col-md-4 pe-2 mt-1 ">
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

          <div className="card-tools">
            <button
              className="purple-btn2 rounded-3"
              fdprocessedid="xn3e6n"
              onClick={() => navigate("/noticeboard-create")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={26}
                height={20}
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>

              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="module-data-section container-fluid">
          <div className="card mt-3 pb-4 mx-3">
            <div className="card-header">                <h3 className="card-title">Broadcast List</h3>
            </div>

            <div className="card-body mt-3 pt-0">
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
                <>
                  <div className="tbl-container ">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Sr No</th>
                          <th>Notice Heading</th>
                          <th>Notice Type</th>
                          <th>Project</th>
                          <th>Expire Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {displayedNoticeboards.length === 0 ? (
                          <tr>
                            <td colSpan="6">No noticeboards found.</td>
                          </tr>
                        ) : (
                          displayedNoticeboards.map((noticeboard, index) => (
                            <tr key={noticeboard.id}>
                              <td>
                                {/* <a
                                  href=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/noticeboard-edit/${noticeboard.id}`);
                                  }}
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
                                </a> */}
                                <a
                                  href=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/noticeboard-details/${noticeboard.id}`);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-eye"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                                  </svg>
                                </a>
                              </td>
                              <td>
                                {(pagination.current_page - 1) * pageSize +
                                  index +
                                  1}
                              </td>

                              <td>{noticeboard.notice_heading || "-"}</td>
                              <td>{noticeboard.notice_type ? noticeboard.notice_type.charAt(0).toUpperCase() + noticeboard.notice_type.slice(1).toLowerCase() : "-"}</td>
                              <td>{noticeboard.project_name || "-"}</td>

                              <td>{formatDateTimeManual(noticeboard.expire_time)}</td>
                              <td>
                                <button
                                  onClick={() =>
                                    handleToggleNoticeboard(noticeboard.id, noticeboard.active)
                                  }
                                  className="toggle-button"
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    width: "70px",
                                  }}
                                >
                                  {noticeboard.active ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="40"
                                      height="25"
                                      fill="#de7008"
                                      className="bi bi-toggle-on"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="40"
                                      height="25"
                                      fill="#667085"
                                      className="bi bi-toggle-off"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                                    </svg>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default NoticeboardList;
