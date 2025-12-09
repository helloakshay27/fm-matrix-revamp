import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "../components/reusable/Pagination";

export default function LockPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A'; // Invalid date check
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  };

  const getPayments = async () => {
    try {
      const response = await axios.get(
        `https://piramal-loyalty-dev.lockated.com/lock_payments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setPayments(response.data);
      setFilteredItems(response.data);
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setError("Failed to fetch payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  const handleReset = () => {
    setSearchTerm("");
    setFilteredItems(payments);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const filtered = payments.filter((payment) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return [
        payment.id,
        payment.order_number,
        payment.payment_date,
        payment.payment_mode,
        payment.total_amount,
        payment.paid_amount,
        payment.payment_status,
        payment.pg_transaction_id,
        payment.payment_gateway,
      ]
        .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
        .some((v) => v.includes(q));
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bVal === null || bVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;

        if (['payment_date', 'created_at', 'updated_at'].includes(sortConfig.key)) {
          const dateA = new Date(aVal).getTime();
          const dateB = new Date(bVal).getTime();
          if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }

        if (['id', 'total_amount', 'paid_amount'].includes(sortConfig.key)) {
          aVal = Number(aVal);
          bVal = Number(bVal);
        }

        if (String(aVal).toLowerCase() < String(bVal).toLowerCase()) return sortConfig.direction === 'asc' ? -1 : 1;
        if (String(aVal).toLowerCase() > String(bVal).toLowerCase()) return sortConfig.direction === 'asc' ? 1 : -1;
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

  const Pagination = ({ currentPage, totalPages, totalEntries, onPageChange }) => {
    const startEntry = totalEntries > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

    return (
      <div className="d-flex justify-content-between align-items-center px-3 mt-2">
        <ul className="pagination justify-content-center d-flex">
          <li
            className={`page-item ${currentPage === 1 ? "disabled" : ""
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
            className={`page-item ${currentPage === 1 ? "disabled" : ""
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
              className={`page-item ${currentPage === pageNumber ? "active" : ""
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
            className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
            className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </p>
      </div>
    );
  };

  return (
    <div className="w-100">
      <div className="module-data-section mt-2">
        {/* <p className="pointer">
          <span>Payments</span> &gt; Lock Payments
        </p> */}
        <div className="card mt-3 mx-3">
          <div className="card-header mb-0">
            <h3 className="card-title">Lock Payments</h3>
          </div>
          <div className="card-body">

            <div className="d-flex justify-content-end align-items-center">
              <div className="d-flex align-items-center">
                <div className="input-group me-3">
                  <input
                    type="text"
                    className="form-control tbl-search table_search"
                    placeholder="Search by name or description"
                    value={searchTerm}
                    onChange={(e) => {
                      handleSearchInputChange(e);
                      handleSearch();
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

            <div className="tbl-container mt-4" style={{
              height: "100%",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <>
                  <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>                <thead>
                    <tr>
                      <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('payment_date')} style={{ cursor: 'pointer' }}>Payment Date {sortConfig.key === 'payment_date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('payment_mode')} style={{ cursor: 'pointer' }}>Payment Mode {sortConfig.key === 'payment_mode' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('total_amount')} style={{ cursor: 'pointer' }}>Total Amount {sortConfig.key === 'total_amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('paid_amount')} style={{ cursor: 'pointer' }}>Paid Amount {sortConfig.key === 'paid_amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('payment_status')} style={{ cursor: 'pointer' }}>Status {sortConfig.key === 'payment_status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('pg_transaction_id')} style={{ cursor: 'pointer' }}>Transaction ID {sortConfig.key === 'pg_transaction_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                      <th onClick={() => requestSort('payment_gateway')} style={{ cursor: 'pointer' }}>Gateway {sortConfig.key === 'payment_gateway' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                    </tr>
                  </thead>
                    <tbody style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                      {currentItems.length > 0 ? currentItems.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.id}</td>
                          <td>{formatDate(payment.payment_date)}</td>
                          <td>{payment.payment_mode || 'N/A'}</td>
                          <td>{payment.total_amount}</td>
                          <td>{payment.paid_amount ?? 'N/A'}</td>
                          <td>{payment.payment_status}</td>
                          <td>{payment.pg_transaction_id || 'N/A'}</td>
                          <td>{payment.payment_gateway || 'N/A'}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="8" className="text-center py-3">No payments found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalEntries={sortedItems.length} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}