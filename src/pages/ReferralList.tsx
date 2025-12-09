import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const ReferralList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [referrals, setReferrals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/referrals/get_all_referrals`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Unauthorized: Please check your credentials.");
          } else if (response.status === 500) {
            toast.error("Server error. Please try again later.");
          } else {
            toast.error(`Error: ${response.status}`);
          }
          setReferrals([]);
          setPagination({
            current_page: 1,
            total_count: 0,
            total_pages: 0,
          });
          setLoading(false);
          return;
        }

        const data = await response.json();
        const referralsData = Array.isArray(data.referrals) ? data.referrals : 
                             Array.isArray(data) ? data : [];
        
        setReferrals(referralsData);
        setPagination({
          current_page: getPageFromStorage(),
          total_count: referralsData.length,
          total_pages: Math.ceil(referralsData.length / pageSize),
        });
      } catch (error) {
        console.error("Error fetching referral data:", error);
        toast.error("Failed to fetch referral data");
        setReferrals([]);
        setPagination({
          current_page: 1,
          total_count: 0,
          total_pages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [baseURL]);

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("referral_list_currentPage", pageNumber);
  };

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
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedReferrals = filteredReferrals.slice(
    startIndex,
    startIndex + pageSize
  );

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
            <span className="text-[#C72030] font-medium">Referrals</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">REFERRALS</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search referrals..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((prev) => ({ ...prev, current_page: 1 }));
                }}
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
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
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Referral List</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div
                  className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#8B0203] rounded-full animate-spin"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table className="border-separate">
                    <TableHeader>
                      <TableRow
                        className="hover:bg-gray-50"
                        style={{ backgroundColor: "#e6e2d8" }}
                      >
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff", width: "80px" }}
                        >
                          Sr No
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff", minWidth: "150px" }}
                        >
                          Name
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff", minWidth: "200px" }}
                        >
                          Email
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff", width: "130px" }}
                        >
                          Mobile No
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff", width: "150px" }}
                        >
                          Referral Code
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4"
                          style={{ borderColor: "#fff", minWidth: "180px" }}
                        >
                          Project Name
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedReferrals.length > 0 ? (
                        displayedReferrals.map((referral, index) => (
                          <TableRow
                            key={referral.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-3 px-4 font-medium">
                              {startIndex + index + 1}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {referral.name || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {referral.email || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {referral.mobile || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {referral.referral_code || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {referral.project_name || "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-12 text-gray-500"
                          >
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No referrals found</p>
                                <p className="text-sm text-gray-400">
                                  Try adjusting your search criteria
                                </p>
                              </div>
                            ) : (
                              "No referrals found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedReferrals.length > 0 && totalPages > 1 && (
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
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
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

                        let startPage = Math.max(
                          1,
                          currentPage - Math.floor(maxVisiblePages / 2)
                        );
                        let endPage = Math.min(
                          totalPages,
                          startPage + maxVisiblePages - 1
                        );

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
                              <span
                                key="start-ellipsis"
                                className="px-2 py-1.5 text-sm text-gray-500"
                              >
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
                              <span
                                key="end-ellipsis"
                                className="px-2 py-1.5 text-sm text-gray-500"
                              >
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
                        Showing{" "}
                        <span className="font-medium">{startIndex + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(startIndex + pageSize, totalFiltered)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{totalFiltered}</span>{" "}
                        entries
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

export default ReferralList;
