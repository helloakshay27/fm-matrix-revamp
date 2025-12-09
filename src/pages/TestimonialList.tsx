import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const TestimonialList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [testimonialPermissions, setTestimonialPermissions] = useState({});
  const [activeToastId, setActiveToastId] = useState(null); // Add this state

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("testimonial_list_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;
  const navigate = useNavigate();

  const getTestimonialPermissions = () => {
    try {
      const lockRolePermissions = localStorage.getItem("lock_role_permissions");
      if (!lockRolePermissions) return {};

      const permissions = JSON.parse(lockRolePermissions);
      return permissions.testimonial || {};
    } catch (e) {
      console.error("Error parsing lock_role_permissions:", e);
      return {};
    }
  };

  useEffect(() => {
    setTestimonialPermissions(getTestimonialPermissions());
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          `${baseURL}testimonials.json?company_id=1`
        );
        setTestimonials(response.data.testimonials || []);
        setPagination((prevState) => ({
          ...prevState,
          total_count: response.data.testimonials.length,
          total_pages: Math.ceil(response.data.testimonials.length / pageSize),
          current_page: getPageFromStorage(),
        }));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch testimonials.");
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTestimonials = searchQuery
    ? testimonials.filter(
        (testimonial) =>
          testimonial.user_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          testimonial.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : testimonials;

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("testimonial_list_currentPage", pageNumber);
  };

  const displayedTestimonials = filteredTestimonials
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(
      (pagination.current_page - 1) * pageSize,
      pagination.current_page * pageSize
    );

  // Fixed toggle function for testimonials
  const handleToggle = async (id, currentStatus) => {
    toast.dismiss();
    const updatedStatus = !currentStatus;

    // Dismiss any existing toast first (if using toast)
    if (activeToastId) {
      // toast.dismiss(activeToastId);
    }

    try {
      await axios.put(
        `${baseURL}testimonials/${id}.json`,
        { testimonial: { active: updatedStatus } }, // Changed from 'project' to 'testimonial'
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Update testimonials state instead of projects
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, active: updatedStatus } : item
        )
      );

      // Show success message (uncomment if using toast)
      // const newToastId = toast.success("Status updated successfully!", {
      //   duration: 3000,
      //   position: "top-center",
      //   id: `toggle-${id}`,
      // });
      // setActiveToastId(newToastId);
      toast.success("Status updated successfully!");
      console.log("Status updated successfully!");
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast.error(
        "Limit reached: only 5 active banners allowed. Please deactivate one before activating another."
      );

      // Show error message (uncomment if using toast)
      // const newToastId = toast.error("Failed to update status.", {
      //   duration: 3000,
      //   position: "top-center",
      //   id: `toggle-error-${id}`,
      // });
      // setActiveToastId(newToastId);
    }
  };

  const handleToggleShow = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;

    // Dismiss any existing toast first
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }

    try {
      await axios.put(
        `${baseURL}testimonials/${id}.json`,
        { testimonial: { show_on_home: updatedStatus } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, show_on_home: updatedStatus } : item
        )
      );

      const newToastId = toast.success("Status updated successfully!", {
        duration: 3000,
        position: "top-center",
        id: `toggle-${id}`,
      });

      setActiveToastId(newToastId);
    } catch (error) {
      console.error("Error updating status:", error);

      let errorMessage = "An error occurred.";
      if (error.response && error.response.status === 400) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          errorMessage = errors.join(" "); // Combine all error messages
        } else if (typeof errors === "string") {
          errorMessage = errors;
        }
      }

      const newToastId = toast.error(errorMessage, {
        duration: 3000,
        position: "top-center",
        id: `toggle-error-${id}`,
      });

      setActiveToastId(newToastId);
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
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Testimonial</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TESTIMONIAL</h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={handleSearch}
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
          </div>
          {testimonialPermissions.create === "true" && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
              onClick={() => navigate("/setup-member/testimonials")}
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
              <span>Add Testimonial</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Testimonials List</h3>
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
                          User Name
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff" }}
                        >
                          Content
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff" }}
                        >
                          Created At
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r"
                          style={{ borderColor: "#fff" }}
                        >
                          Updated At
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4"
                          style={{ borderColor: "#fff" }}
                        >
                          Show on Home
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedTestimonials.length > 0 ? (
                        displayedTestimonials.map((testimonial, index) => (
                          <TableRow
                            key={testimonial.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    navigate("/setup-member/testimonial-edit", {
                                      state: { testimonial },
                                    })
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
                                {testimonialPermissions.show === "true" && (
                                  <button
                                    onClick={() =>
                                      handleToggle(
                                        testimonial.id,
                                        testimonial.active
                                      )
                                    }
                                    className="toggle-button"
                                    style={{
                                      border: "none",
                                      background: "none",
                                      cursor: "pointer",
                                      padding: 0,
                                      width: "70px",
                                    }}
                                  >
                                    {testimonial.active ? (
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
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 font-medium">
                              {(pagination.current_page - 1) * pageSize +
                                index +
                                1}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {testimonial.user_name || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4 max-w-md truncate">
                              {testimonial.content || "-"}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {new Date(testimonial.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              {new Date(testimonial.updated_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <button
                                onClick={() =>
                                  handleToggleShow(
                                    testimonial.id,
                                    testimonial.show_on_home
                                  )
                                }
                                className="toggle-button"
                                style={{
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "70px",
                                }}
                              >
                                {testimonial.show_on_home ? (
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
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-12 text-gray-500"
                          >
                            No testimonials available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedTestimonials.length > 0 && (
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
                      {Array.from(
                        { length: pagination.total_pages },
                        (_, i) => i + 1
                      ).map((page) => (
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
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                        disabled={
                          pagination.current_page === pagination.total_pages
                        }
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pagination.current_page === pagination.total_pages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.total_pages)}
                        disabled={
                          pagination.current_page === pagination.total_pages
                        }
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pagination.current_page === pagination.total_pages
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
                          {Math.min(
                            (pagination.current_page - 1) * pageSize + 1 || 1,
                            pagination.total_count
                          )}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            pagination.current_page * pageSize,
                            pagination.total_count
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {pagination.total_count}
                        </span>{" "}
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

export default TestimonialList;
