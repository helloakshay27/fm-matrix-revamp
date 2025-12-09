import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import axios from "axios";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const HomeLoanList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [error, setError] = useState(null);
  const [homeLoans, setHomeLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [homeLoanPermissions, setHomeLoanPermissions] = useState({});

  const getHomeLoanPermissions = () => {
    try {
      const lockRolePermissions = localStorage.getItem("lock_role_permissions");
      if (!lockRolePermissions) return {};

      const permissions = JSON.parse(lockRolePermissions);
      return permissions.home_loan || {};
    } catch (e) {
      console.error("Error parsing lock_role_permissions:", e);
      return {};
    }
  };

  useEffect(() => {
    setHomeLoanPermissions(getHomeLoanPermissions());
  }, []);

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("home_loan_list_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  const filteredHomeLoans = homeLoans
    .filter((loan) =>
      searchQuery
        ? (loan.project?.Project_Name?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (loan.project?.project_address?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (loan.required_loan_amt?.toString() || "").includes(searchQuery)
        : true
    )
    .sort((a, b) => (b.id || 0) - (a.id || 0));

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total_count: filteredHomeLoans.length,
      total_pages: Math.ceil(filteredHomeLoans.length / pageSize),
      current_page: searchQuery ? 1 : prev.current_page,
    }));
  }, [filteredHomeLoans.length, pageSize, searchQuery]);

  const displayedHomeLoans = filteredHomeLoans.slice(
    (pagination.current_page - 1) * pageSize,
    pagination.current_page * pageSize
  );

  useEffect(() => {
    const fetchHomeLoans = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/home_loans.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setHomeLoans(response.data.home_loans || []);
      } catch (error) {
        setError("Failed to fetch home loans. Please try again later.");
        console.error("Error fetching home loans:", error);
        toast.error("Failed to fetch home loans");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeLoans();
  }, [baseURL]);

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("home_loan_list_currentPage", pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalFiltered = filteredHomeLoans.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

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
            <span className="text-[#C72030] font-medium">Home Loans</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">HOME LOANS</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search by project name or address..."
                value={searchQuery}
                onChange={handleSearchChange}
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
            <h3 className="text-lg font-bold text-gray-900">Home Loan List</h3>
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
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "80px" }}>Sr No</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "200px" }}>Project Name</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "250px" }}>Project Address</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Loan Amount</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Tenure (Years)</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "180px" }}>Preferred Banks</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: "#fff", width: "130px" }}>Created Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedHomeLoans.length > 0 ? (
                        displayedHomeLoans.map((loan, index) => (
                          <TableRow key={loan.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell className="py-3 px-4">{loan.project?.Project_Name || "-"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div style={{ maxWidth: "300px", wordWrap: "break-word", whiteSpace: "normal", lineHeight: "1.5" }}>
                                {loan.project?.project_address || "-"}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">{formatCurrency(loan.required_loan_amt)}</TableCell>
                            <TableCell className="py-3 px-4">{loan.tenure || "-"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                {loan.preffered_banks && loan.preffered_banks.length > 0 ? (
                                  loan.preffered_banks.map((bank, bankIndex) => (
                                    <span key={bankIndex} className="text-sm">
                                      {bank.bank_name}
                                      {bankIndex !== loan.preffered_banks.length - 1 && ","}
                                    </span>
                                  ))
                                ) : (
                                  "-"
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">{formatDate(loan.created_at)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No home loans found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No home loans found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedHomeLoans.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handlePageChange(1)} disabled={pagination.current_page === 1} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${pagination.current_page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>First</button>
                      <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${pagination.current_page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>Prev</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${pagination.current_page === page ? "bg-[#C72030] text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>{page}</button>
                      ))}
                      <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page === totalPages} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${pagination.current_page === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>Next</button>
                      <button onClick={() => handlePageChange(totalPages)} disabled={pagination.current_page === totalPages} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${pagination.current_page === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>Last</button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Showing <span className="font-medium">{totalFiltered === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + displayedHomeLoans.length, totalFiltered)}</span> of <span className="font-medium">{totalFiltered}</span> entries
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

export default HomeLoanList;