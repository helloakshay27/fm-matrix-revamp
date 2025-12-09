import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const UserList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPermission, setUserPermission] = useState({});
  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("user_list_currentPage")) || 1;
  };
  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;
  const navigate = useNavigate();

  const getUserPermission = () => {
    try {
      const lockRolePermissions = localStorage.getItem("lock_role_permissions");
      if (!lockRolePermissions) return {};

      const permissions = JSON.parse(lockRolePermissions);
      return permissions.user || {}; // Fetching user-specific permissions
    } catch (e) {
      console.error("Error parsing lock_role_permissions:", e);
      return {};
    }
  };

  useEffect(() => {
    const permissions = getUserPermission();
    console.log("User permissions:", permissions);
    setUserPermission(permissions);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`${baseURL}users/get_users.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (Array.isArray(data.users)) {
          setUsers(data.users);

          setPagination({
            current_page: getPageFromStorage(),
            total_count: data.users.length,
            total_pages: Math.ceil(data.users.length / pageSize),
          });
        } else {
          console.error("API response does not contain users array", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to run only once on mount

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prevState) => ({ ...prevState, current_page: 1 }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedUsers = filteredUsers.slice(
    (pagination.current_page - 1) * pageSize,
    pagination.current_page * pageSize
  );

  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      current_page: pageNumber,
    }));
    localStorage.setItem("user_list_currentPage", pageNumber);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("s[name_or_email_cont]", searchQuery);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleToggleUser = async (userId, currentStatus) => {
    toast.dismiss();
    try {
      const response = await fetch(`${baseURL}users/${userId}.json`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: { active: !currentStatus } }),
      });

      toast.success("Updated Status");
      
      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Update the local state after API success
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

    useEffect(() => {
      setPagination(prev => ({
        ...prev,
        total_count: filteredUsers.length,
        total_pages: Math.ceil(filteredUsers.length / pageSize),
        current_page: searchQuery ? 1 : prev.current_page // Reset to page 1 when searching
      }));
    }, [filteredUsers.length, pageSize, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-full">
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <form
              onSubmit={handleSearchSubmit}
              action="/pms/users"
              acceptCharset="UTF-8"
              method="get"
            >
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <input
                  type="text"
                  name="s[name_or_email_cont]"
                  id="s_name_or_email_cont"
                  className="flex-1 px-4 py-2 outline-none"
                  placeholder="Search by name or email"
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

          {/* {userPermission.create === "true" && ( */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
            onClick={() => navigate("/setup-member/user-create")}
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
            <span>Add User</span>
          </button>
          {/* )} */}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Users List</h3>
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
                        <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Action</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Sr No</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>First Name</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Last Name</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Email</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Mobile</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Status</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {displayedUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">No users found.</TableCell>
                          </TableRow>
                        ) : (
                          displayedUsers.map((user, index) => (
                            <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  {/* {userPermission.update === "true" && ( */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigate(
                                        `/setup-member/user-edit/${user.id}`
                                      );
                                    }}
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
                                  {/* )} */}
                                  {/* {userPermission.show === "true" && ( */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigate(`/setup-member/user-details/${user.id}`);
                                    }}
                                    className="text-gray-600 hover:text-[#8B0203] transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-eye"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
                                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                                    </svg>
                                  </button>
                                  {/* )} */}
                                </div>
                              </TableCell>
                              <TableCell className="py-3 px-4">
                                {(pagination.current_page - 1) * pageSize +
                                  index +
                                  1}
                              </TableCell>
                              <TableCell className="py-3 px-4">{user.firstname || "-"}</TableCell>
                              <TableCell className="py-3 px-4">{user.lastname || "-"}</TableCell>
                              <TableCell className="py-3 px-4">{user.email || "-"}</TableCell>
                              <TableCell className="py-3 px-4">
                                {user.country_code
                                  ? `+${user.country_code} `
                                  : ""}
                                {user.mobile || "-"}
                              </TableCell>
                              <TableCell className="py-3 px-4">
                                {/* {userPermission.destroy === "true" && ( */}
                                  <button
                                    onClick={() =>
                                      handleToggleUser(user.id, user.active)
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
                                    {user.active ? (
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
                                {/* )} */}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Pagination Section */}
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                      {/* First Button */}
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

                      {/* Previous Button */}
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

                      {/* Dynamic Page Numbers with Ellipsis */}
                      {(() => {
                        const totalPages = pagination.total_pages;
                        const currentPage = pagination.current_page;
                        const pageNumbers = [];

                        let startPage = Math.max(currentPage - 2, 1);
                        let endPage = Math.min(startPage + 4, totalPages);

                        // Adjust start if end is near total
                        if (endPage - startPage < 4) {
                          startPage = Math.max(endPage - 4, 1);
                        }

                        // Show first page and ellipsis if needed
                        if (startPage > 1) {
                          pageNumbers.push(
                            <button
                              key={1}
                              onClick={() => handlePageChange(1)}
                              className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              1
                            </button>
                          );
                          if (startPage > 2) {
                            pageNumbers.push(
                              <span key="start-ellipsis" className="px-2 text-gray-500">
                                ...
                              </span>
                            );
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                pagination.current_page === i
                                  ? "bg-[#C72030] text-white"
                                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }

                        // Show end ellipsis and last page
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pageNumbers.push(
                              <span key="end-ellipsis" className="px-2 text-gray-500">
                                ...
                              </span>
                            );
                          }
                          pageNumbers.push(
                            <button
                              key={totalPages}
                              onClick={() => handlePageChange(totalPages)}
                              className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              {totalPages}
                            </button>
                          );
                        }

                        return pageNumbers;
                      })()}

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.total_pages}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pagination.current_page === pagination.total_pages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>

                      {/* Last Button */}
                      <button
                        onClick={() => handlePageChange(pagination.total_pages)}
                        disabled={pagination.current_page === pagination.total_pages}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          pagination.current_page === pagination.total_pages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Last
                      </button>
                    </div>

                    {/* Showing entries count */}
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
                        <span className="font-medium">{pagination.total_count}</span>{" "}
                        entries
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default UserList;
