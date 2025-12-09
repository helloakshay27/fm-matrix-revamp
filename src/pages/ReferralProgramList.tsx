import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const ReferralProgramList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [referrals, setReferrals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeToastId, setActiveToastId] = useState(null);

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
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${baseURL}/referral_configs.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      const referralList = data.referrals || data.referral_configs || data || [];

      setReferrals(referralList);
      setPagination((prevState) => ({
        ...prevState,
        total_count: referralList.length,
        total_pages: Math.ceil(referralList.length / pageSize),
        current_page: getPageFromStorage(),
      }));
    } catch (error) {
      console.error("Error fetching referral data:", error);
      setError("Failed to fetch referral data. Please try again.");
      toast.error("Failed to fetch referral programs");
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("referral_list_currentPage", pageNumber);
  };

  const filteredReferrals = referrals.filter(
    (referral) =>
      (referral.title || referral.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (referral.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const totalFiltered = filteredReferrals.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);

  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedReferrals = filteredReferrals.slice(
    (pagination.current_page - 1) * pageSize,
    pagination.current_page * pageSize
  );

  const handleToggle = async (id, currentStatus) => {
    toast.dismiss();
    const updatedStatus = !currentStatus;

    try {
      if (updatedStatus) {
        const deactivatePromises = referrals
          .filter((item) => item.active && item.id !== id)
          .map((item) =>
            axios.put(
              `${baseURL}/referral_configs/${item.id}.json`,
              { referral_config: { active: false } },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
              }
            )
          );
        await Promise.all(deactivatePromises);
      }

      await axios.put(
        `${baseURL}/referral_configs/${id}.json`,
        { referral_config: { active: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setReferrals((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, active: updatedStatus }
            : updatedStatus
            ? { ...item, active: false }
            : item
        )
      );

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
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
            <span className="text-gray-400">Referral Program</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">List</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">REFERRAL PROGRAM</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dc2626" className="mr-3 mt-0.5" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search by title or description"
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
            <h3 className="text-lg font-bold text-gray-900">Referral Program List</h3>
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
            ) : error ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#dc3545" className="inline-block mb-4" viewBox="0 0 16 16">
                  <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
                  <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                </svg>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  className="px-6 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors inline-flex items-center gap-2"
                  onClick={fetchReferrals}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                  </svg>
                  Retry
                </button>
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
                          style={{ borderColor: "#fff", width: "140px" }}
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
                          style={{ borderColor: "#fff", minWidth: "180px" }}
                        >
                          Title
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff", minWidth: "250px" }}
                        >
                          Description
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 text-center"
                          style={{ borderColor: "#fff", width: "150px" }}
                        >
                          Attachments
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedReferrals.length > 0 ? (
                        displayedReferrals.map((referral, index) => (
                          <TableRow
                            key={referral.id || index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/referral-program-edit/${referral.id}`)}
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
                                      d="M13.93 6.46611L8.7982 11.5979C8.68827 11.7078 8.62708 11.862 8.62708 12.0183L8.67694 14.9367C8.68261 15.2495 8.93534 15.5023 9.24815 15.5079L12.1697 15.5578H12.1788C12.3329 15.5578 12.4803 15.4966 12.5879 15.3867L19.2757 8.69895C19.9341 8.0405 19.9341 6.96723 19.2757 6.30879L17.8806 4.91368C17.561 4.59407 17.1349 4.4173 16.6849 4.4173C16.2327 4.4173 15.8089 4.5941 15.4893 4.91368L13.93 6.46611ZM11.9399 14.3912L9.8274 14.3561L9.79227 12.2436L14.3415 7.69443L16.488 9.84091L11.9399 14.3912ZM16.3066 5.73151C16.5072 5.53091 16.8574 5.53091 17.058 5.73151L18.4531 7.12662C18.6593 7.33288 18.6593 7.66948 18.4531 7.87799L17.3096 9.0215L15.1631 6.87502L16.3066 5.73151Z"
                                      fill="#667085"
                                    />
                                    <path
                                      d="M7.42035 20H16.5797C18.4655 20 20 18.4655 20 16.5797V12.0012C20 11.6816 19.7393 11.4209 19.4197 11.4209C19.1001 11.4209 18.8395 11.6816 18.8395 12.0012V16.582C18.8395 17.8264 17.8274 18.8418 16.5797 18.8418H7.42032C6.17593 18.8418 5.16048 17.8298 5.16048 16.582V7.42035C5.16048 6.17596 6.17254 5.16051 7.42032 5.16051H12.2858C12.6054 5.16051 12.866 4.89985 12.866 4.58026C12.866 4.26066 12.6054 4 12.2858 4H7.42032C5.53449 4 4 5.53452 4 7.42032V16.5797C4.00227 18.4677 5.53454 20 7.42035 20Z"
                                      fill="#667085"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleToggle(referral.id, referral.active)}
                                  className="text-gray-600 hover:opacity-80 transition-opacity"
                                  title={referral.active ? "Deactivate" : "Activate"}
                                >
                                  {referral.active ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="40"
                                      height="24"
                                      fill="#28a745"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="40"
                                      height="24"
                                      fill="#6c757d"
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
                              {referral.title || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div style={{
                                maxWidth: "350px",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                lineHeight: "1.5"
                              }}>
                                {referral.description || "-"}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex justify-center items-center">
                                {referral.attachments && referral.attachments.length > 0 ? (
                                  (() => {
                                    const previewFile = referral.attachments.find(
                                      (file) =>
                                        file.document_content_type?.startsWith("image/") ||
                                        file.document_content_type?.startsWith("video/")
                                    );

                                    if (!previewFile)
                                      return <span className="text-sm text-gray-500">Attachment available</span>;

                                    return previewFile.document_content_type.startsWith("video/") ? (
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
                                          src={previewFile.document_url}
                                          type={previewFile.document_content_type}
                                        />
                                      </video>
                                    ) : (
                                      <img
                                        src={previewFile.document_url}
                                        alt="Preview"
                                        className="rounded-lg border border-gray-200"
                                        style={{
                                          width: "100px",
                                          height: "65px",
                                          objectFit: "cover"
                                        }}
                                      />
                                    );
                                  })()
                                ) : (
                                  <span className="text-sm text-gray-500 italic">No attachments</span>
                                )}
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
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No referral configs found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No referral configs found"
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            pagination.current_page === page
                              ? "bg-[#C72030] text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
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
                        <span className="font-medium">
                          {totalFiltered === 0 ? 0 : startIndex + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(startIndex + displayedReferrals.length, totalFiltered)}
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

export default ReferralProgramList;
