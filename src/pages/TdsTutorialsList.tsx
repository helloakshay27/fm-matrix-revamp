import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const TdsTutorialList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [tutorials, setTutorials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [tdsTutorialsPermissions, setTdsTutorialsPermissions] = useState({});
  const navigate = useNavigate();

  const getPageFromStorage = () => {
    return (
      parseInt(localStorage.getItem("tds_tutorial_list_currentPage")) || 1
    );
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  const getTdsTutorialsPermissions = () => {
    try {
      const lockRolePermissions = localStorage.getItem("lock_role_permissions");
      if (!lockRolePermissions) return {};

      const permissions = JSON.parse(lockRolePermissions);
      return permissions.tds_tutorials || {};
    } catch (e) {
      console.error("Error parsing lock_role_permissions:", e);
      return {};
    }
  };

  useEffect(() => {
    const permissions = getTdsTutorialsPermissions();
    setTdsTutorialsPermissions(permissions);
  }, []);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/tds_tutorials.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      const tutorialList = response.data.tds_tutorials || response.data || [];
      setTutorials(tutorialList);
      setPagination({
        current_page: getPageFromStorage(),
        total_count: tutorialList.length,
        total_pages: Math.ceil(tutorialList.length / pageSize),
      });
    } catch (error) {
      console.error("Error fetching TDS tutorial data:", error);
      toast.error("Failed to fetch TDS tutorials");
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("tds_tutorial_list_currentPage", pageNumber);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tutorial?")) {
      return;
    }

    try {
      await axios.delete(`${baseURL}/tds_tutorials/${id}.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setTutorials((prev) => prev.filter((item) => item.id !== id));
      toast.success("Tutorial deleted successfully!");
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      toast.error("Failed to delete tutorial.");
    }
  };

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      (tutorial.name || tutorial.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (tutorial.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const totalFiltered = filteredTutorials.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedTutorials = filteredTutorials.slice(
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
            <span className="text-[#C72030] font-medium">TDS Tutorials</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TDS TUTORIALS</h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search tutorials..."
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
          {tutorials.length < 1 && tdsTutorialsPermissions.create === "true" && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
              onClick={() => navigate("/setup-member/tds-tutorials-create")}
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
              <span>Add Tutorial</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">TDS Tutorial List</h3>
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
                          style={{ borderColor: "#fff", width: "100px" }}
                        >
                          Action
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff", width: "80px" }}
                        >
                          Sr No
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff", minWidth: "200px" }}
                        >
                          Name
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 text-center"
                          style={{ borderColor: "#fff", width: "150px" }}
                        >
                          Attachment
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedTutorials.length > 0 ? (
                        displayedTutorials.map((tutorial, index) => (
                          <TableRow
                            key={tutorial.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-3 px-4">
                              {tdsTutorialsPermissions.destroy === "true" && (
                                <button
                                  onClick={() => handleDelete(tutorial.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Delete Tutorial"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </button>
                              )}
                            </TableCell>
                            <TableCell className="py-3 px-4 font-medium">
                              {startIndex + index + 1}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {tutorial.name || tutorial.title || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex justify-center items-center">
                                {tutorial.attachment?.document_url ? (
                                  tutorial.attachment.document_content_type?.startsWith(
                                    "video/"
                                  ) ? (
                                    <video
                                      width="100"
                                      height="65"
                                      autoPlay
                                      muted
                                      loop
                                      playsInline
                                      className="rounded-lg border border-gray-200"
                                      style={{ objectFit: "cover" }}
                                    >
                                      <source
                                        src={tutorial.attachment.document_url}
                                        type={tutorial.attachment.document_content_type}
                                      />
                                    </video>
                                  ) : tutorial.attachment.document_content_type?.startsWith(
                                      "image/"
                                    ) ? (
                                    <img
                                      src={tutorial.attachment.document_url}
                                      alt="Tutorial"
                                      className="rounded-lg border border-gray-200"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <a
                                      href={tutorial.attachment.document_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                      >
                                        <path
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                          stroke="#1C1B1F"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </a>
                                  )
                                ) : (
                                  <span className="text-sm text-gray-500 italic">
                                    No attachment
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-12 text-gray-500"
                          >
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No tutorials found</p>
                                <p className="text-sm text-gray-400">
                                  Try adjusting your search criteria
                                </p>
                              </div>
                            ) : (
                              "No tutorials found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedTutorials.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* First Button */}
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        pagination.current_page === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#8B0203] text-white hover:bg-[#6d0102]"
                      }`}
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.current_page === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-double-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.854 1.146a.5.5 0 0 1 0 .708L6.207 7.5l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                        />
                      </svg>
                      First
                    </button>

                    {/* Previous Button */}
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        pagination.current_page === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#8B0203] text-white hover:bg-[#6d0102]"
                      }`}
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
                      disabled={pagination.current_page === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.854 1.146a.5.5 0 0 1 0 .708L6.207 7.5l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                        />
                      </svg>
                      Prev
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                      {(() => {
                        const totalPages = Math.ceil(totalFiltered / pageSize);
                        const currentPage = pagination.current_page;
                        const pageNumbers = [];

                        let startPage = Math.max(currentPage - 2, 1);
                        let endPage = Math.min(startPage + 4, totalPages);

                        if (endPage - startPage < 5) {
                          startPage = Math.max(endPage - 4, 1);
                        }

                        if (startPage > 1) {
                          pageNumbers.push(
                            <button
                              key={1}
                              className="px-4 py-2 rounded-lg font-medium bg-[#8B0203] text-white hover:bg-[#6d0102] transition-colors"
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </button>
                          );
                          if (startPage > 2) {
                            pageNumbers.push(
                              <span className="text-gray-500" key="ellipsis-start">
                                ...
                              </span>
                            );
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(
                            <button
                              key={i}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                pagination.current_page === i
                                  ? "bg-[#8B0203] text-white cursor-default"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={() => handlePageChange(i)}
                            >
                              {i}
                            </button>
                          );
                        }

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pageNumbers.push(
                              <span className="text-gray-500" key="ellipsis-end">
                                ...
                              </span>
                            );
                          }
                          pageNumbers.push(
                            <button
                              key={totalPages}
                              className="px-4 py-2 rounded-lg font-medium bg-[#8B0203] text-white hover:bg-[#6d0102] transition-colors"
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </button>
                          );
                        }

                        return pageNumbers;
                      })()}
                    </div>

                    {/* Next Button */}
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        pagination.current_page === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#8B0203] text-white hover:bg-[#6d0102]"
                      }`}
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                      disabled={pagination.current_page === totalPages}
                    >
                      Next
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.146 1.146a.5.5 0 0 1 0 .708L9.793 7.5 4.146 12.354a.5.5 0 0 1-.708-.708L8.293 7.5 3.438 2.646a.5.5 0 0 1 .708-.708z"
                        />
                      </svg>
                    </button>

                    {/* Last Button */}
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        pagination.current_page === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#8B0203] text-white hover:bg-[#6d0102]"
                      }`}
                      onClick={() =>
                        handlePageChange(Math.ceil(totalFiltered / pageSize))
                      }
                      disabled={pagination.current_page === totalPages}
                    >
                      Last
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-double-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.146 1.146a.5.5 0 0 1 0 .708L9.793 7.5 4.146 12.354a.5.5 0 0 1-.708-.708L8.293 7.5 3.438 2.646a.5.5 0 0 1 .708-.708z"
                        />
                      </svg>
                    </button>
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

export default TdsTutorialList;
