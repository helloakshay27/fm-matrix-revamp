import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const HomeLoanRequestsList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [homeLoans, setHomeLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("home_loan_requests_currentPage")) || 1;
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
    const fetchHomeLoans = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/home_loans_request`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const loansData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.home_loans || []);

        setHomeLoans(loansData);
        setPagination({
          current_page: getPageFromStorage(),
          total_count: loansData.length,
          total_pages: Math.ceil(loansData.length / pageSize),
        });
      } catch (error) {
        console.error("Error fetching home loan requests:", error);
        toast.error("Failed to fetch home loan requests");
        setHomeLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeLoans();
  }, [baseURL]);

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));
    localStorage.setItem("home_loan_requests_currentPage", pageNumber);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchQuery(term);

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

      setSuggestions(filtered.slice(0, 10));
      setSelectedIndex(-1);
      setPagination((prev) => ({ ...prev, current_page: 1 }));
    } else {
      setSuggestions([]);
      setPagination((prev) => ({ ...prev, current_page: 1 }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selectedItem = suggestions[selectedIndex];
        setSearchQuery(selectedItem.customer_code || selectedItem.booking_number || "");
        setSuggestions([]);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (loan) => {
    setSearchQuery(loan.customer_code || loan.booking_number || loan.bank_name || "");
    setSuggestions([]);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const filteredLoans = Array.isArray(homeLoans)
    ? homeLoans.filter((loan) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
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
      })
    : [];

  const sortedLoans = useMemo(() => {
    let sortableItems = [...filteredLoans];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bVal === null || bVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;

        if (['birth_date', 'dob'].includes(sortConfig.key)) {
          const dateA = new Date(aVal).getTime();
          const dateB = new Date(bVal).getTime();
          if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }

        if (['amount', 'required_loan_amt', 'monthly_income', 'tenure'].includes(sortConfig.key)) {
          aVal = Number(aVal);
          bVal = Number(bVal);
        }

        if (String(aVal).toLowerCase() < String(bVal).toLowerCase()) return sortConfig.direction === 'asc' ? -1 : 1;
        if (String(aVal).toLowerCase() > String(bVal).toLowerCase()) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredLoans, sortConfig]);

  const totalFiltered = sortedLoans.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedLoans = sortedLoans.slice(
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
            <span className="text-[#C72030] font-medium">Home Loan Requests</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">HOME LOAN REQUESTS</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80 relative">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search loan requests..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
              />
              <button type="button" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z" fill="#8B0203"/>
                  <path d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z" fill="#8B0203"/>
                </svg>
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((loan, index) => (
                  <li
                    key={loan.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${selectedIndex === index ? 'bg-gray-100' : ''}`}
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

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Loan Requests List</h3>
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
                <div className="rounded-lg border border-gray-200 overflow-x-auto">
                  <Table className="border-separate" style={{ minWidth: "1400px" }}>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "80px" }}>Sr No</TableHead>
                        <TableHead onClick={() => requestSort('loan_type')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "120px" }}>
                          Loan Type{getSortIcon('loan_type')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('employment_type')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "150px" }}>
                          Employment{getSortIcon('employment_type')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('monthly_income')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "130px" }}>
                          Monthly Income{getSortIcon('monthly_income')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('birth_date')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "120px" }}>
                          Birth Date{getSortIcon('birth_date')}
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Preferred Time</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Bank Name</TableHead>
                        <TableHead onClick={() => requestSort('amount')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "120px" }}>
                          Amount{getSortIcon('amount')}
                        </TableHead>
                        <TableHead onClick={() => requestSort('tenure')} className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer" style={{ borderColor: "#fff", width: "100px" }}>
                          Tenure{getSortIcon('tenure')}
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Customer Code</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Booking Number</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: "#fff", width: "100px" }}>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedLoans.length > 0 ? (
                        displayedLoans.map((loan, index) => (
                          <TableRow key={loan.id || index} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell className="py-3 px-4">{loan.loan_type || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{loan.employment_type || "-"}</TableCell>
                            <TableCell className="py-3 px-4">₹{loan.monthly_income?.toLocaleString() || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{formatDate(loan.birth_date || loan.dob)}</TableCell>
                            <TableCell className="py-3 px-4">{loan.preferred_time || loan.preffered_time || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{loan.bank_name || "-"}</TableCell>
                            <TableCell className="py-3 px-4">₹{(loan.amount || loan.required_loan_amt)?.toLocaleString() || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{loan.tenure ? `${loan.tenure} yrs` : "-"}</TableCell>
                            <TableCell className="py-3 px-4">{loan.customer_code || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{loan.booking_number || "-"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                loan.status === 'approved' || loan.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : loan.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : loan.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {loan.status || 'N/A'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No loan requests found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No loan requests found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedLoans.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* ...existing pagination code similar to LockPaymentsList... */}
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

export default HomeLoanRequestsList;
