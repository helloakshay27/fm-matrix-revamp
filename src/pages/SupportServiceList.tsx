import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const SupportServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("service_list_currentPage")) || 1;
  };
  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });
  const pageSize = 10;

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}osr_services.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setServices(response.data);
        setPagination({
          current_page: getPageFromStorage(),
          total_count: response.data.length,
          total_pages: Math.ceil(response.data.length / pageSize),
        });
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPagination((prev) => ({ ...prev, current_page: pageNumber }));
    localStorage.setItem("service_list_currentPage", pageNumber);
  };
  

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFiltered = filteredServices.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);

  const displayedServices = filteredServices.slice(
    (pagination.current_page - 1) * pageSize,
    pagination.current_page * pageSize
  );
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
  };
  

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
                  className="form-control tbl-search table_search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                  }}
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-md btn-default">
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
            {/* <div className="card-tools mt-1">
                <button
                  className="purple-btn2 rounded-3"
                  onClick={() => navigate("/specification")}
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
              </div> */}
          </div>

          <div className="module-data-section container-fluid">
          <div className="card mt-4 pb-4 mx-3">
            <div className="card-header">
              <h3 className="card-title">Support Service List</h3>
            </div>
            <div className="card-body mt-4 pb-4 pt-0">
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
                <div className="tbl-container mt-4">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>
                        <th>Service Category</th>
                        <th>Property Type</th>
                        <th>Unit Type</th>
                        <th>Price Range From</th>
                        <th>Price Range To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedServices.length > 0 ? (
                        displayedServices.map((service, index) => (
                          <tr key={service.id}>
                            {(pagination.current_page - 1) * pageSize +
                              index +
                              1}
                            <td>{service.name || "-"}</td>
                            <td>{service.email || "-"}</td>
                            <td>{service.mobile_number || "-"}</td>
                            <td>{service.service_category || "-"}</td>
                            <td>{service.property_type || "-"}</td>
                            <td>{service.unit_type || "-"}</td>
                            <td>{service.price_range_from || "-"}</td>
                            <td>{service.price_range_to || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No services found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-between px-3 pagination-section"> 
            <ul className="pagination" role="navigation" aria-label="pager">
                <li
                  className={`page-item ${
                    pagination.current_page === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
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
                  >
                    Previous
                  </button>
                </li>

                {/* {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${
                      pagination.current_page === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))} */}
                {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        )
                            .filter(
                                (page) =>
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= pagination.current_page - 1 &&
                                        page <= pagination.current_page + 1)
                            )
                            .map((page, index, array) => (
                                <Fragment key={page}>
                                    {index > 0 && page !== array[index - 1] + 1 && (
                                        <li className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    )}
                                    <li
                                        key={page}
                                        className={`page-item ${pagination.current_page === page ? "active" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                </Fragment>
                            ))}
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
                  >
                    Last
                  </button>
                </li>
              </ul>
              <p>
                Showing{" "}
                {Math.min(
                  (pagination.current_page - 1) * pageSize + 1,
                  pagination.total_count
                )}{" "}
                to
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
      {/* </div> */}
    </div>
  );
};

export default SupportServiceList;
