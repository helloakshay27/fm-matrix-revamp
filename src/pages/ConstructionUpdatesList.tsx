import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";


const ConstructionUpdatesList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [constructionUpdates, setConstructionUpdates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [constructionPermissions, setConstructionPermissions] = useState({});
  const navigate = useNavigate();

  const pageSize = 10;
  const getPageFromStorage = () =>
    parseInt(localStorage.getItem("construction_updates_list_currentPage")) || 1;
  
  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const getConstructionPermissions = () => {
    try {
      const lockRolePermissions = localStorage.getItem("lock_role_permissions");
      if (!lockRolePermissions) return {};

      const permissions = JSON.parse(lockRolePermissions);
      return permissions.construction_updates || {};
    } catch (e) {
      console.error("Error parsing lock_role_permissions:", e);
      return {};
    }
  };

  useEffect(() => {
    const permissions = getConstructionPermissions();
    setConstructionPermissions(permissions);
  }, []);

  useEffect(() => {
    const fetchConstructionUpdates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/construction_updates.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const updates = Array.isArray(response.data.construction_updates)
          ? response.data.construction_updates
          : Array.isArray(response.data)
          ? response.data
          : [];

        setConstructionUpdates(updates);
        setPagination({
          total_count: updates.length,
          total_pages: Math.ceil(updates.length / pageSize),
          current_page: getPageFromStorage(),
        });
      } catch (error) {
        console.error("Error fetching construction updates:", error);
        toast.error("Failed to fetch construction updates");
      } finally {
        setLoading(false);
      }
    };

    fetchConstructionUpdates();
  }, [baseURL]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
    localStorage.setItem("construction_updates_list_currentPage", page);
  };

  const handleToggle = async (id, currentStatus) => {
    const updatedStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`${baseURL}/construction_updates/${id}.json`, {
        construction_update: { status: updatedStatus },
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      setConstructionUpdates((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: updatedStatus } : item
        )
      );
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this construction update?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseURL}/construction_updates/${id}.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.success("Construction update deleted successfully!");

      setConstructionUpdates((prevUpdates) =>
        prevUpdates.filter((update) => update.id !== id)
      );
      setPagination((prevState) => ({
        ...prevState,
        total_count: prevState.total_count - 1,
        total_pages: Math.ceil((prevState.total_count - 1) / pageSize),
      }));
    } catch (error) {
      console.error("Error deleting construction update:", error);
      toast.error("Error deleting construction update. Please try again.");
    }
  };

  const filteredUpdates = constructionUpdates.filter(
    (update) =>
      (update.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (update.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const totalFiltered = filteredUpdates.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedUpdates = filteredUpdates.slice(
    startIndex,
    startIndex + pageSize
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <span className="text-[#C72030] font-medium">Construction Updates</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CONSTRUCTION UPDATES</h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search by title or description..."
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
          {constructionPermissions.create === "true" && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
              onClick={() => navigate("/setup-member/construction-updates-create")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>
              <span>Add Update</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Construction Updates List</h3>
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
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "140px" }}>Action</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "80px" }}>Sr No</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "150px" }}>Title</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "200px" }}>Description</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Date</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Project</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>Site</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>Building</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 text-center" style={{ borderColor: "#fff", width: "120px" }}>Attachment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedUpdates.length > 0 ? (
                        displayedUpdates.map((update, index) => (
                          <TableRow key={update.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {constructionPermissions.update === "true" && (
                                  <button
                                    onClick={() => navigate(`/setup-member/construction-updates-edit/${update.id}`)}
                                    className="text-gray-600 hover:text-[#8B0203] transition-colors"
                                  >
                                    {/* ...existing edit SVG... */}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleToggle(update.id, update.status)}
                                  className="text-gray-600 hover:opacity-80 transition-opacity"
                                >
                                  {update.status === "active" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="#28a745" viewBox="0 0 16 16">
                                      <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="#6c757d" viewBox="0 0 16 16">
                                      <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zM5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                                    </svg>
                                  )}
                                </button>
                                {constructionPermissions.delete === "true" && (
                                  <button
                                    onClick={() => handleDelete(update.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell className="py-3 px-4">{update.title || "-"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div style={{ maxWidth: "250px", wordWrap: "break-word", whiteSpace: "normal", lineHeight: "1.5" }}>
                                {update.description || "-"}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">{formatDate(update.on_date)}</TableCell>
                            <TableCell className="py-3 px-4">{update.project_name || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{update.site_name || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{update.building_name || "-"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex justify-center items-center">
                                {update.attachment?.document_url ? (
                                  (() => {
                                    const contentType = update.attachment.document_content_type || '';
                                    const isVideo = contentType.startsWith('video/');
                                    const isImage = contentType.startsWith('image/');
                                    
                                    if (isVideo) {
                                      return (
                                        <video width="80" height="80" autoPlay muted loop playsInline className="rounded-lg border border-gray-200" style={{ objectFit: "cover" }}>
                                          <source src={update.attachment.document_url} type={contentType} />
                                        </video>
                                      );
                                    } else if (isImage) {
                                      return (
                                        <img src={update.attachment.document_url} alt="Attachment" className="rounded-lg border border-gray-200" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                                      );
                                    } else {
                                      return <span className="text-sm text-gray-500 italic">File</span>;
                                    }
                                  })()
                                ) : (
                                  <span className="text-sm text-gray-500 italic">No attachment</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No construction updates found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No construction updates found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedUpdates.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* ...existing pagination code similar to SiteList... */}
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

export default ConstructionUpdatesList;
