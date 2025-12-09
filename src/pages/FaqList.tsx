import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const FaqList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [toggleLoading, setToggleLoading] = useState({}); // Track loading state for individual toggles
  
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("faq_list_currentPage")) || 1;
  };
  
  const [currentPage, setCurrentPage] = useState(getPageFromStorage());
  const pageSize = 10;

useEffect(() => {
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const params = {};
      const urlParams = new URLSearchParams(location.search);
      const searchParam = urlParams.get("s[question_cont]");
      if (searchParam) {
        params["s[question_cont]"] = searchParam;
      }
      const response = await axios.get(
        `${baseURL}faqs.json`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params,
        }
      );
      if (response.data && response.data.faqs) {
        setFaqs(response.data.faqs);
        setCategoryId(response.data.faq_category_id);
        setSubCategoryId(response.data.faq_sub_category_id);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error.response || error);
      setError("Failed to fetch FAQs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  fetchFaqs();

  // Parse search query from URL if any
  const params = new URLSearchParams(location.search);
  const searchParam = params.get("s[question_cont]");
  if (searchParam) {
    setSearchQuery(searchParam);
  }
}, [location.search]);

  const handlePageChange = (pageNumber) => {
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPage);
    localStorage.setItem("faq_list_currentPage", validPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    localStorage.setItem("faq_list_currentPage", 1);
    
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("s[question_cont]", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleToggleEvent = async (id, currentStatus) => {
    toast.dismiss();
    // Set loading state for this specific FAQ
    setToggleLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      // Fixed: Remove the extra slash from the URL
      const response = await axios.put(
        `${baseURL}faqs/${id}.json`,
        { 
          faq: { // Wrap the data in 'faq' object as expected by Rails
            active: !currentStatus 
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      
      // Update the FAQ in the state immediately for better UX
      setFaqs(faqs.map(faq => 
        faq.id === id ? { ...faq, active: !currentStatus } : faq
      ));
      
      // Clear any previous errors
      setError(null);
       toast.success("Status Updated successfully!");
      
    } catch (error) {
      console.error("Error toggling FAQ status:", error);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Server error: ${error.response.status}`;
        setError(`Failed to update FAQ status: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        setError("Failed to update FAQ status: No response from server");
      } else {
        // Something else happened
        setError("Failed to update FAQ status: " + error.message);
      }
    } finally {
      // Clear loading state for this specific FAQ
      setToggleLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Filter data by question or answer
  const filteredData = faqs.filter(
    (faq) => 
      !searchQuery || 
      (faq.question && 
       faq.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.answer && 
       faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.faq_tag && 
       faq.faq_tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate pagination values
  const totalFiltered = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  
  // Ensure current page is valid after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
      localStorage.setItem("faq_list_currentPage", 1);
    }
  }, [totalPages, currentPage]);

  // Get current page data
  const startIndex = (currentPage - 1) * pageSize;
  const displayedFaqs = filteredData.slice(
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
            <span className="text-[#C72030] font-medium">FAQ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Add Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 outline-none"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
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
            </form>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
            onClick={() => navigate("/setup-member/faq-create")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
            </svg>
            <span>Add FAQ</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">FAQ List</h3>
              <div className="flex gap-4 text-sm text-gray-600">
                {categoryId && (
                  <span>Category ID: <span className="font-medium">{categoryId}</span></span>
                )}
                {subCategoryId && (
                  <span>Sub Category ID: <span className="font-medium">{subCategoryId}</span></span>
                )}
              </div>
            </div>
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
                          style={{ borderColor: "#fff" }}
                        >
                          Action
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff" }}
                        >
                          Sr No
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff" }}
                        >
                          FAQ Category
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff" }}
                        >
                          Question
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4"
                          style={{ borderColor: "#fff" }}
                        >
                          Answer
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedFaqs.length > 0 ? (
                        displayedFaqs.map((faq, index) => (
                          <TableRow
                            key={faq.id || index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    navigate(`/setup-member/faq-edit/${faq.id}`)
                                  }
                                  className="text-gray-600 hover:text-[#8B0203] transition-colors"
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
                                </button>
                                <button
                                  onClick={() =>
                                    handleToggleEvent(faq.id, faq.active)
                                  }
                                  disabled={toggleLoading[faq.id]}
                                  className="toggle-button"
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: toggleLoading[faq.id] ? "wait" : "pointer",
                                    padding: 0,
                                    width: "70px",
                                    opacity: toggleLoading[faq.id] ? 0.5 : 1,
                                  }}
                                >
                                  {faq.active ? (
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
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 font-medium">
                              {startIndex + index + 1}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {faq.faq_category_name || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="max-w-xs truncate" title={faq.question}>
                                {faq.question || "-"}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div
                                className="max-w-md"
                                style={{
                                  wordWrap: "break-word",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {faq.answer || "-"}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-12 text-gray-500"
                          >
                            {searchQuery
                              ? "No FAQs found matching your search."
                              : "No FAQs found."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {!loading && totalFiltered > 0 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        First
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Prev
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageToShow;
                          if (totalPages <= 5) {
                            pageToShow = i + 1;
                          } else {
                            const startPage = Math.max(
                              1,
                              Math.min(currentPage - 2, totalPages - 4)
                            );
                            pageToShow = startPage + i;
                          }
                          return pageToShow;
                        }
                      ).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            currentPage === pageNumber
                              ? "bg-[#C72030] text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          currentPage === totalPages
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
                        <span className="font-medium">
                          {totalFiltered > 0 ? startIndex + 1 : 0}
                        </span>{" "}
                        to{" "}
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

export default FaqList;