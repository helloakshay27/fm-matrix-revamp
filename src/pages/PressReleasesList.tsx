import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const PressReleasesList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [pressReleases, setPressReleases] = useState([]);
  const [filteredReleases, setFilteredReleases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pressReleasePermissions, setPressReleasePermissions] = useState({});

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("press_list_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const [pageSize] = useState(10);
  const navigate = useNavigate();

  const getPressReleasePermissions = () => {
    try {
      const lockRolePermissions = localStorage.getItem("lock_role_permissions");
      if (!lockRolePermissions) return {};
  
      const permissions = JSON.parse(lockRolePermissions);
      return permissions.press_releases || {};
    } catch (e) {
      console.error("Error parsing lock_role_permissions:", e);
      return {};
    }
  };

  useEffect(() => {
    const permissions = getPressReleasePermissions();
    console.log("Press Release permissions:", permissions);
    setPressReleasePermissions(permissions);
  }, []);

  const fetchPressReleases = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/press_releases.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (Array.isArray(data.press_releases)) {
        setPressReleases(data.press_releases);
        setFilteredReleases(data.press_releases);

        setPagination({
          current_page: getPageFromStorage(),
          total_count: data.press_releases.length,
          total_pages: Math.ceil(data.press_releases.length / pageSize) || 1,
        });
      } else {
        console.error("API response does not contain press_releases array", data);
        toast.error("Failed to fetch press releases");
      }
    } catch (error) {
      console.error("Error fetching press releases:", error);
      toast.error("Error fetching press releases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPressReleases();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredReleases(pressReleases);
      setPagination({
        current_page: 1,
        total_count: pressReleases.length,
        total_pages: Math.ceil(pressReleases.length / pageSize) || 1,
      });
      return;
    }

    const filtered = pressReleases.filter((release) => {
      const query = searchQuery.toLowerCase();
      return (
        (release.title && release.title.toLowerCase().includes(query)) ||
        (release.company_name && release.company_name.toLowerCase().includes(query)) ||
        (release.project_name && release.project_name.toLowerCase().includes(query)) ||
        (release.description && release.description.toLowerCase().includes(query))
      );
    });

    setFilteredReleases(filtered);
    setPagination({
      current_page: 1,
      total_count: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize) || 1,
    });
    localStorage.setItem("press_list_currentPage", 1);
  }, [searchQuery, pressReleases, pageSize]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.total_pages) return;

    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));

    localStorage.setItem("press_list_currentPage", pageNumber);
  };

  const totalFiltered = filteredReleases.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedReleases = filteredReleases.slice(
    (pagination.current_page - 1) * pageSize,
    pagination.current_page * pageSize
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
            <span className="text-gray-400">Content</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Press Releases</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PRESS RELEASES</h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search press releases..."
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
          {pressReleasePermissions.create === "true" && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
              onClick={() => navigate("/setup-member/press-releases-create")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>
              <span>Add Press Release</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Press Releases List</h3>
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
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>Action</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "80px" }}>Sr No</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "180px" }}>Title</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "200px" }}>Description</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "150px" }}>Press Source</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Release Date</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 text-center" style={{ borderColor: "#fff", width: "120px" }}>Attachment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedReleases.length > 0 ? (
                        displayedReleases.map((release, index) => (
                          <TableRow key={release.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4">
                              {pressReleasePermissions.update === "true" && (
                                <button
                                  onClick={() => navigate(`/setup-member/press-releases-edit/${release.id}`)}
                                  className="text-gray-600 hover:text-[#8B0203] transition-colors"
                                >
                                  {/* ...existing SVG... */}
                                </button>
                              )}
                            </TableCell>
                            <TableCell className="py-3 px-4 font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell className="py-3 px-4">{release.title || "-"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div style={{ maxWidth: "250px", wordWrap: "break-word", whiteSpace: "normal", lineHeight: "1.5" }}>
                                {release.description || "-"}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">{release.press_source || "-"}</TableCell>
                            <TableCell className="py-3 px-4">{release.release_date || "-"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex justify-center items-center">
                                {release.attachfile?.document_url ? (
                                  <img src={release.attachfile.document_url} alt="Press Release" className="rounded-lg border border-gray-200" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                                ) : (
                                  <span className="text-sm text-gray-500 italic">No image</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No press releases found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No press releases found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedReleases.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* ...existing pagination code... */}
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

export default PressReleasesList;
