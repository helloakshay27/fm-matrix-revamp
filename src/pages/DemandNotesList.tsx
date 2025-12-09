import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const DemandNotesList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [demandNotes, setDemandNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("demand_notes_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  useEffect(() => {
    const fetchDemandNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/demand_notes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const notesData = Array.isArray(response.data)
          ? response.data
          : response.data.demand_notes || [];

        setDemandNotes(notesData);
        setPagination({
          current_page: getPageFromStorage(),
          total_count: notesData.length,
          total_pages: Math.ceil(notesData.length / pageSize),
        });
      } catch (error) {
        console.error("Error fetching demand notes:", error);
        toast.error("Failed to fetch demand notes");
        setDemandNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandNotes();

    // Parse search query from URL if any
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [baseURL, location.search]);

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));
    localStorage.setItem("demand_notes_currentPage", pageNumber);
  };

  const filteredNotes = Array.isArray(demandNotes)
    ? demandNotes.filter((note) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return [
          note.booking_number,
          note.customer_code,
          note.demand_number,
          note.project_id,
        ]
          .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
          .some((v) => v.includes(q));
      })
    : [];

  const totalFiltered = filteredNotes.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedNotes = filteredNotes.slice(
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
            <span className="text-[#C72030] font-medium">Demand Notes</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">DEMAND NOTES</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search demand notes..."
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
            <h3 className="text-lg font-bold text-gray-900">Demand Notes List</h3>
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
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "80px" }}>Sr No</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>Project ID</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Booking Number</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Customer Code</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Demand Number</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>Percentage</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Amount</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Raised Date</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Expected Date</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>CGST</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>SGST</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Total Tax</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: "#fff", width: "130px" }}>Total Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedNotes.length > 0 ? (
                        displayedNotes.map((note, index) => (
                          <TableRow key={note.id || index} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell className="py-3 px-4">{note.project_id || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{note.booking_number || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{note.customer_code || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{note.demand_number || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{note.percentage ? `${note.percentage}%` : "-"}</TableCell>
                            <TableCell className="py-3 px-4">₹{note.amount?.toLocaleString() || "0"}</TableCell>
                            <TableCell className="py-3 px-4">{note.raised_date || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{note.expected_date || "-"}</TableCell>
                            <TableCell className="py-3 px-4">₹{note.cgst?.toLocaleString() || "0"}</TableCell>
                            <TableCell className="py-3 px-4">₹{note.sgst?.toLocaleString() || "0"}</TableCell>
                            <TableCell className="py-3 px-4">₹{note.total_tax_amount?.toLocaleString() || "0"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <span className="font-semibold text-[#8B0203]">
                                ₹{note.total_amount?.toLocaleString() || "0"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={13} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No demand notes found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No demand notes found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedNotes.length > 0 && totalPages > 1 && (
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

export default DemandNotesList;
