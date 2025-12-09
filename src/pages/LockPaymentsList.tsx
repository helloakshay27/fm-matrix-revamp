import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const LockPaymentsList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("lock_payments_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/lock_payments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        // Ensure we always have an array
        let paymentsData = [];
        if (Array.isArray(response.data)) {
          paymentsData = response.data;
        } else if (response.data?.payments && Array.isArray(response.data.payments)) {
          paymentsData = response.data.payments;
        } else if (response.data?.lock_payments && Array.isArray(response.data.lock_payments)) {
          paymentsData = response.data.lock_payments;
        }

        setPayments(paymentsData);
        setPagination({
          current_page: getPageFromStorage(),
          total_count: paymentsData.length,
          total_pages: Math.ceil(paymentsData.length / pageSize),
        });
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast.error("Failed to fetch lock payments");
        setPayments([]); // Ensure it's always an array
        setPagination({
          current_page: 1,
          total_count: 0,
          total_pages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [baseURL]);

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));
    localStorage.setItem("lock_payments_currentPage", pageNumber);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredPayments = Array.isArray(payments) 
    ? payments.filter((payment) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
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
      })
    : [];

  const sortedPayments = useMemo(() => {
    let sortableItems = [...filteredPayments];
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
  }, [filteredPayments, sortConfig]);

  const totalFiltered = sortedPayments.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedPayments = sortedPayments.slice(
    startIndex,
    startIndex + pageSize
  );

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Loyalty</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Lock Payments</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LOCK PAYMENTS</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((prev) => ({ ...prev, current_page: 1 }));
                }}
              />
              <button type="button" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z" fill="#8B0203"/>
                  <path d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z" fill="#8B0203"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Lock Payments List</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#8B0203] rounded-full animate-spin" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table className="border-separate">
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                        <TableHead onClick={() => requestSort('id')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "80px" }}>
                          ID{getSortIcon('id')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('payment_date')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "130px" }}>
                          Payment Date{getSortIcon('payment_date')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('payment_mode')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "120px" }}>
                          Payment Mode{getSortIcon('payment_mode')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('total_amount')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "120px" }}>
                          Total Amount{getSortIcon('total_amount')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('paid_amount')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "120px" }}>
                          Paid Amount{getSortIcon('paid_amount')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('payment_status')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "100px" }}>
                          Status{getSortIcon('payment_status')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('pg_transaction_id')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", minWidth: "180px" }}>
                          Transaction ID{getSortIcon('pg_transaction_id')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('payment_gateway')} className="font-semibold text-gray-900 py-3 px-4 cursor-pointer" style={{ borderColor: "#fff", width: "120px" }}>
                          Gateway{getSortIcon('payment_gateway')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedPayments.length > 0 ? (
                        displayedPayments.map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{payment.id}</TableCell>
                            <TableCell className="py-3 px-4">{formatDate(payment.payment_date)}</TableCell>
                            <TableCell className="py-3 px-4">{payment.payment_mode || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">₹{payment.total_amount?.toLocaleString() || '0'}</TableCell>
                            <TableCell className="py-3 px-4">₹{payment.paid_amount?.toLocaleString() || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.payment_status === 'success' || payment.payment_status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.payment_status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.payment_status || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-4">{payment.pg_transaction_id || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">{payment.payment_gateway || 'N/A'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No payments found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No payments found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedPayments.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.current_page === 1}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pagination.current_page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        First
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pagination.current_page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Prev
                      </button>

                      {/* Dynamic Page Numbers */}
                      {(() => {
                        const maxVisiblePages = 5;
                        const currentPage = pagination.current_page;
                        const pages = [];
                        
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        if (endPage - startPage < maxVisiblePages - 1) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }
                        
                        if (startPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              onClick={() => handlePageChange(1)}
                              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            >
                              1
                            </button>
                          );
                          
                          if (startPage > 2) {
                            pages.push(
                              <span key="start-ellipsis" className="px-2 py-1.5 text-sm text-gray-500">
                                ...
                              </span>
                            );
                          }
                        }
                        
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                currentPage === i
                                  ? "bg-[#C72030] text-white"
                                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }
                        
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="end-ellipsis" className="px-2 py-1.5 text-sm text-gray-500">
                                ...
                              </span>
                            );
                          }
                          
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => handlePageChange(totalPages)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                currentPage === totalPages
                                  ? "bg-[#C72030] text-white"
                                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {totalPages}
                            </button>
                          );
                        }
                        
                        return pages;
                      })()}

                      <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === totalPages}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pagination.current_page === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={pagination.current_page === totalPages}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pagination.current_page === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Last
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(startIndex + pageSize, totalFiltered)}</span> of{" "}
                        <span className="font-medium">{totalFiltered}</span> entries
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockPaymentsList;
