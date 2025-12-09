import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const SiteVisitSlotConfigList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [slots, setSlots] = useState([]);
  const [siteSlotsPermissions, setSiteSlotsPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("siteSlotVisitCurrentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  const getSiteSlotsPermissions = () => {
    try {
      const lockRolePermissions = localStorage.getItem("lock_role_permissions");
      if (!lockRolePermissions) return {};

      const permissions = JSON.parse(lockRolePermissions);
      return permissions.site_slot || {};
    } catch (e) {
      console.error("Error parsing lock_role_permissions:", e);
      return {};
    }
  };

  useEffect(() => {
    setSiteSlotsPermissions(getSiteSlotsPermissions());
  }, []);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/site_schedule/all_site_schedule_slots.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const fetchedSlots = response.data.slots || [];
      setSlots(fetchedSlots);

      setPagination({
        current_page: getPageFromStorage(),
        total_count: fetchedSlots.length,
        total_pages: Math.ceil(fetchedSlots.length / pageSize),
      });
    } catch (error) {
      console.error("Error fetching site visit slots:", error);
      toast.error("Failed to load visit slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("siteSlotVisitCurrentPage", pageNumber);
  };

  const handleToggle = async (slotId, currentStatus) => {
    toast.dismiss();
    try {
      const updatedStatus = currentStatus ? 0 : 1;

      const postData = {
        active: updatedStatus,
      };

      await axios.put(`${baseURL}/site_schedules/${slotId}.json`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === slotId ? { ...slot, active: updatedStatus } : slot
        )
      );

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating slot status:", error.response?.data || error);
      toast.error("Failed to update status");
    }
  };

  const filteredSlots = slots.filter((slot) =>
    (slot.project_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFiltered = filteredSlots.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedSlots = filteredSlots.slice(
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
            <span className="text-[#C72030] font-medium">Visit Slot</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">VISIT SLOT</h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search slots..."
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
          {siteSlotsPermissions.create === "true" && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
              onClick={() => navigate("/setup-member/site-visit-slot-config")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>
              <span>Add Slot</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Visit Slot List</h3>
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
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r text-center" style={{ borderColor: "#fff", width: "100px" }}>Active</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: "#fff", minWidth: "200px" }}>Start Time & End Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedSlots.length > 0 ? (
                        displayedSlots.map((slot, index) => (
                          <TableRow key={slot.id || index} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex justify-center">
                                {siteSlotsPermissions.show === "true" && (
                                  <button
                                    onClick={() => handleToggle(slot.id, slot.active)}
                                    className="text-gray-600 hover:opacity-80 transition-opacity"
                                  >
                                    {slot.active ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="#28a745" viewBox="0 0 16 16">
                                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                                      </svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="#6c757d" viewBox="0 0 16 16">
                                        <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zM5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                                      </svg>
                                    )}
                                  </button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                                {slot.start_time} to {slot.end_time}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No slots found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No slots found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedSlots.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* First */}
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.current_page === 1}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      First
                    </button>

                    {/* Previous */}
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Prev
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      )
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= pagination.current_page - 1 &&
                              page <= pagination.current_page + 1)
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && page !== array[index - 1] + 1 && (
                              <span className="text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                pagination.current_page === page
                                  ? "bg-[#8B0203] text-white"
                                  : "bg-white text-gray-900 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>

                    {/* Next */}
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === totalPages}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Next
                    </button>

                    {/* Last */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={pagination.current_page === totalPages}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Last
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

export default SiteVisitSlotConfigList;
