import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import SelectBox from "../components/ui/select-box";

const EncashList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [encashRequests, setEncashRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [transactionMode, setTransactionMode] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("encash_list_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  const transactionModeOptions = [
    { label: "Select Mode", value: "" },
    { label: "UPI", value: "UPI" },
    { label: "NEFT", value: "NEFT" },
    { label: "RTGS", value: "RTGS" },
    { label: "IMPS", value: "IMPS" },
  ];

  const fetchEncashRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/encash_requests.json?is_admin=true`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      const requestsData = Array.isArray(response.data) ? response.data : [];
      setEncashRequests(requestsData);
      setPagination({
        current_page: getPageFromStorage(),
        total_count: requestsData.length,
        total_pages: Math.ceil(requestsData.length / pageSize),
      });
    } catch (error) {
      console.error("Error fetching encash requests:", error);
      toast.error("Failed to fetch encash requests");
      setEncashRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncashRequests();
  }, [baseURL]);

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));
    localStorage.setItem("encash_list_currentPage", pageNumber);
  };

  const handleStatusChange = async (id, status) => {
    if (status === "completed") {
      const request = encashRequests.find((req) => req.id === id);
      setSelectedRequest(request);
      setShowModal(true);
    }
  };

  const handleCompleteRequest = async () => {
    if (!selectedRequest || !transactionMode || !transactionNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axios.put(
        `${baseURL}/encash_requests/${selectedRequest.id}.json`,
        {
          encash_request: {
            status: "completed",
            transaction_mode: transactionMode,
            transaction_number: transactionNumber,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowModal(false);
      setTransactionMode("");
      setTransactionNumber("");
      setSelectedRequest(null);

      await fetchEncashRequests();
      toast.success("Request completed successfully!");
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update request");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const filteredRequests = Array.isArray(encashRequests)
    ? encashRequests.filter((request) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return [
          request.person_name,
          request.account_number,
          request.status,
          request.ifsc_code,
          request.branch_name,
        ]
          .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
          .some((v) => v.includes(q));
      })
    : [];

  const totalFiltered = filteredRequests.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedRequests = filteredRequests.slice(startIndex, startIndex + pageSize);

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
            <span className="text-[#C72030] font-medium">Encash Requests</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ENCASH REQUESTS</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search encash requests..."
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
            <h3 className="text-lg font-bold text-gray-900">Encash Requests List</h3>
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
                  <Table className="border-separate" style={{ minWidth: "1600px" }}>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r text-center" style={{ borderColor: "#fff", width: "80px" }}>ID</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "150px" }}>Person Name</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r text-right" style={{ borderColor: "#fff", width: "100px" }}>Points</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r text-right" style={{ borderColor: "#fff", width: "100px" }}>Fee</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r text-right" style={{ borderColor: "#fff", width: "120px" }}>Amount</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Account Number</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>IFSC Code</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "150px" }}>Branch</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "180px" }}>Created At</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r text-center" style={{ borderColor: "#fff", width: "120px" }}>Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 text-center" style={{ borderColor: "#fff", width: "150px" }}>Transaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedRequests.length > 0 ? (
                        displayedRequests.map((request) => (
                          <TableRow key={request.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium text-center">{request.id}</TableCell>
                            <TableCell className="py-3 px-4">{request.person_name || "-"}</TableCell>
                            <TableCell className="py-3 px-4 text-right">{request.points_to_encash?.toLocaleString() || "0"}</TableCell>
                            <TableCell className="py-3 px-4 text-right">{formatCurrency(request.facilitation_fee)}</TableCell>
                            <TableCell className="py-3 px-4 text-right font-semibold">{formatCurrency(request.amount_payable)}</TableCell>
                            <TableCell className="py-3 px-4">{request.account_number || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{request.ifsc_code || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{request.branch_name || "-"}</TableCell>
                            <TableCell className="py-3 px-4 text-sm">{formatDate(request.created_at)}</TableCell>
                            <TableCell className="py-3 px-4 text-center">
                              <select
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border outline-none transition-colors ${
                                  request.status === "completed"
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                }`}
                                value={request.status}
                                onChange={(e) => handleStatusChange(request.id, e.target.value)}
                              >
                                <option value="requested">Requested</option>
                                <option value="completed">Completed</option>
                              </select>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-center">
                              {request.transaction_mode && request.transaction_number ? (
                                <div className="text-sm">
                                  <div className="font-medium">{request.transaction_mode}</div>
                                  <div className="text-gray-500">{request.transaction_number}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No encash requests found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No encash requests found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedRequests.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* ...existing pagination code similar to other list pages... */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Complete Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Complete Encash Request</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {selectedRequest && (
                <div>
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Request Details:</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Person:</span>
                        <span className="ml-2 font-medium">{selectedRequest.person_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Points:</span>
                        <span className="ml-2 font-medium">{selectedRequest.points_to_encash?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount Payable:</span>
                        <span className="ml-2 font-medium text-[#8B0203]">{formatCurrency(selectedRequest.amount_payable)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Account:</span>
                        <span className="ml-2 font-medium">{selectedRequest.account_number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Transaction Mode
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <SelectBox
                        options={transactionModeOptions}
                        value={transactionMode}
                        onChange={(value) => setTransactionMode(value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Transaction Number
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                        value={transactionNumber}
                        onChange={(e) => setTransactionNumber(e.target.value)}
                        placeholder="Enter transaction number"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteRequest}
                className="px-6 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium"
              >
                Complete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncashList;
