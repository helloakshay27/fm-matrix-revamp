import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

// import LoginModal from "../components/LoginModal";
import SignInRustomjee from "./sign_pages/signInRustomjee";
import { baseURL } from "../pages/baseurl/apiDomain"

const HomeLoanRequest = () => {
  const [showModal, setShowModal] = useState(false);
  const [homeLoans, setHomeLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const location = useLocation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = String(date.getFullYear()); // Get last two digits of the year
    return `${day}-${month}-${year}`;
  };
  const token = localStorage.getItem("access_token");

  const getMembers = async () => {
    const storedValue = sessionStorage.getItem("selectedId");
    try {
      const response = await axios.get(
        `${baseURL}loyalty/members.json`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      ; // Initialize filteredItems


      // Format the created_at date for each member
      const formattedMembers = response.data.map((member) => ({
        ...member,
        tier_validity: formatDate(member.tier_validity), // Use the correct date property
        last_sign_in: formatDate(member.last_sign_in)
      }));

      setMembers(formattedMembers); // Set formatted members
      setFilteredItems(formattedMembers); // Also set filtered items
    } catch (error) {
      console.error("Error fetching member details:", error);
      // @ts-ignore
      setError("Failed to fetch members. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    const fetchHomeLoans = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://piramal-loyalty-dev.lockated.com/home_loans_request"
        );
        setHomeLoans(response.data.home_loans || []);
        setFilteredItems(response.data.home_loans || []);
      } catch (error) {
        console.error("Error fetching home loan requests:", error);
        setError("Failed to fetch home loan requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeLoans();

    // Parse search query from URL if any
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  const handleReset = () => {
    setSearchTerm("");
    setFilteredItems(homeLoans);
    setCurrentPage(1);
  };

  // Handle search submission (e.g., when pressing 'Go!')
  const handleSearch = () => {
    const filtered = homeLoans.filter((loan) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      // Check all displayed columns for a match
      return [
        loan.loan_type,
        loan.employment_type,
        loan.monthly_income,
        loan.birth_date,
        loan.dob,
        loan.preferred_time,
        loan.preffered_time,
        loan.bank_name,
        loan.amount,
        loan.required_loan_amt,
        loan.tenure,
        loan.customer_code,
        loan.booking_number,
        loan.status,
      ]
        .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
        .some((v) => v.includes(q));
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
    setSuggestions([]);
  };


  // Handle search input change
  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim()) {
      const filtered = homeLoans.filter((loan) => {
        const q = term.toLowerCase();
        return [
          loan.loan_type,
          loan.employment_type,
          loan.monthly_income,
          loan.birth_date,
          loan.dob,
          loan.preferred_time,
          loan.preffered_time,
          loan.bank_name,
          loan.amount,
          loan.required_loan_amt,
          loan.tenure,
          loan.customer_code,
          loan.booking_number,
          loan.status,
        ]
          .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
          .some((v) => v.includes(q));
      });

      setFilteredItems(filtered);
      setSuggestions(filtered.slice(0, 10)); // Limit suggestions to 10
      setSelectedIndex(-1);
      setCurrentPage(1); // Reset to first page when filtering
    } else {
      setFilteredItems(homeLoans);
      setSuggestions([]);
      setCurrentPage(1);
    }
  };

  // Fix keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selectedItem = suggestions[selectedIndex];
        setSearchTerm(`${selectedItem.firstname} ${selectedItem.lasttname}`);
        setFilteredItems([selectedItem]);
        setSuggestions([]);
        setCurrentPage(1);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  // Fix suggestion click
  const handleSuggestionClick = (loan) => {
    setSearchTerm(`${loan.customer_code || loan.booking_number || loan.bank_name}`);
    setSuggestions([]);
    setFilteredItems([loan]);
    setCurrentPage(1);
  };

  // Add missing handlePageChange function
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Fix sorting functionality
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const currentItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;

  const Pagination = ({
    currentPage,
    totalPages,
    totalEntries,
    onPageChange,
  }) => {
    const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

    return (
      <div className="d-flex justify-content-between align-items-center px-3 mt-2">
        <ul className="pagination justify-content-center d-flex">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Last
            </button>
          </li>
        </ul>
        <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
          {totalEntries === 0 
            ? "Showing 0 to 0 of 0 entries"
            : `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`
          }
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="w-100">
        <div className="module-data-section container-fluid">
          <div className="card mt-3 mx-3">
            <div className="card-header mb-0">
              <h3 className="card-title">Home Loan Requests</h3>
            </div>
            <div className="card-body">
              {/* Add breadcrumb navigation */}
              {/* <p className="pointer mb-3">
                <span>Home</span> &gt; <span>Loyalty</span> &gt; <span>Home Loan Requests</span>
              </p> */}

              <div className="d-flex justify-content-between align-items-center">
                <Link to="">
                  {/* Add button if needed */}
                </Link>
                <div className="d-flex align-items-center">
                  <div className="input-group me-3">
                    <input
                      type="text"
                      className="form-control tbl-search table_search"
                      placeholder="Search by Customer Code, Bank Name, etc."
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default" onClick={handleSearch}>
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
                    {suggestions.length > 0 && (
                      <ul
                        className="suggestions-list position-absolute"
                        style={{
                          listStyle: "none",
                          padding: "0",
                          marginTop: "5px",
                          border: "1px solid #ddd",
                          maxHeight: "200px",
                          overflowY: "auto",
                          width: "100%",
                          zIndex: 1,
                          backgroundColor: "#fff",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          top: "100%",
                          left: "0"
                        }}
                      >
                        {suggestions.map((loan, index) => (
                          <li
                            key={loan.id}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              backgroundColor: selectedIndex === index ? "#f8f9fa" : "transparent"
                            }}
                            className={selectedIndex === index ? "highlight" : ""}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => handleSuggestionClick(loan)}
                          >
                            {loan.customer_code || loan.booking_number || loan.bank_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="tbl-container mt-4"
                style={{
                  height: "100%",
                  overflowX: "auto",
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
                    <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px', minWidth: '1200px' }}>
                      <thead>
                        <tr>
                          <th style={{ width: '8%' }}>Sr No</th>
                          <th style={{ width: '8%' }}>Loan Type</th>
                          <th style={{ width: '8%' }}>Employment Type</th>
                          <th style={{ width: '8%' }}>Monthly Income</th>
                          <th style={{ width: '8%' }}>Birth Date</th>
                          <th style={{ width: '8%' }}>Preferred Time</th>
                          <th style={{ width: '8%' }}>Bank Name</th>
                          <th style={{ width: '8%' }}>Amount</th>
                          <th style={{ width: '8%' }}>Tenure</th>
                          <th style={{ width: '8%' }}>Customer Code</th>
                          <th style={{ width: '8%' }}>Booking Number</th>
                          <th style={{ width: '8%' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                        {currentItems.length > 0 ? currentItems.map((loan, idx) => (
                          <tr key={loan.id || idx}>
                            <td>{startIndex + idx + 1}</td>
                            <td>{loan.loan_type ?? ""}</td>
                            <td>{loan.employment_type ?? ""}</td>
                            <td>{loan.monthly_income ?? ""}</td>
                            <td>{loan.birth_date ?? loan.dob ?? ""}</td>
                            <td>{loan.preferred_time ?? loan.preffered_time ?? ""}</td>
                            <td>{loan.bank_name ?? ""}</td>
                            <td>{loan.amount ?? loan.required_loan_amt ?? ""}</td>
                            <td>{loan.tenure ?? ""}</td>
                            <td>{loan.customer_code ?? ""}</td>
                            <td>{loan.booking_number ?? ""}</td>
                            <td>{loan.status ?? ""}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>
                              No home loan requests found matching your search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalEntries={sortedItems.length}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeLoanRequest;


