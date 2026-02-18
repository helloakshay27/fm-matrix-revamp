import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchOccupantUsers } from "@/store/slices/occupantUsersSlice";
import { fetchOccupantUserCounts } from "@/store/slices/occupantUserCountsSlice";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Users, Download, X, Eye, Plus, Send, Copy, Check } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { ImportOccupantUsers } from "@/components/ImportOccupantUsers";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { OccupantUsersFilterDialog } from "@/components/OccupantUsersFilterDialog";
import { useAppSelector } from "@/store/hooks";
import { debounce } from "lodash";
import { getUser } from "@/utils/auth";
import { useLocation } from "react-router-dom";

const columns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true },
  { key: "active", label: "Active", sortable: true, draggable: true },
  { key: "name", label: "User Name", sortable: true, draggable: true },
  { key: "gender", label: "Gender", sortable: true, draggable: true },
  { key: "mobile", label: "Mobile Number", sortable: true, draggable: true },
  { key: "email", label: "Email", sortable: true, draggable: true },
  // { key: "company", label: "Vendor Company Name", sortable: true, draggable: true },
  { key: "departmentName", label: "Department", sortable: true, draggable: true },
  { key: "entity", label: "Entity Name", sortable: true, draggable: true },
  { key: "department", label: "Unit", sortable: true, draggable: true },
  // { key: "role", label: "Role", sortable: true, draggable: true },
  { key: "employeeId", label: "Employee ID", sortable: true, draggable: true },
  { key: "createdBy", label: "Created By", sortable: true, draggable: true },
  { key: "accessLevel", label: "Access Level", sortable: true, draggable: true },
  { key: "type", label: "Type", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, draggable: true },
  { key: "faceRecognition", label: "Face Recognition", sortable: true, draggable: true },
  { key: "appDownloaded", label: "App Downloaded", sortable: true, draggable: true },
];

export const OccupantUserMasterDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const isRestrictedUser = user?.email === 'karan.balsara@zycus.com';
  const isOpsConsole = location.pathname.includes('/ops-console/');

  // OTP state management
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpData, setOtpData] = useState<any>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [occupantUser, setOccupantUser] = useState([]);
  const [occupantUsersState, setOccupantUsersState] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [filters, setFilters] = useState<{
    name?: string;
    email?: string;
    mobile?: string;
    status?: string;
    entity?: string;
    downloaded?: undefined | boolean;
  }>({
    name: "",
    email: "",
    mobile: "",
    status: "",
    entity: "",
    downloaded: undefined,
  });

  const {
    users: occupantUsersData,
    pagination: statePagination,
    loading,
  } = useAppSelector((state: RootState) => state.occupantUsers as any);
  const occupantUserCounts = useAppSelector(
    (state: RootState) => state.occupantUserCounts
  );

  const {
    total: totalUsers = 0,
    approved: approvedUsers = 0,
    pending: pendingUsers = 0,
    rejected: rejectedUsers = 0,
    appDownloaded = 0,
  } = occupantUserCounts || {};

  const [showActionPanel, setShowActionPanel] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const data: any = occupantUsersData;
    if (data?.transformedUsers) {
      setOccupantUser(data.transformedUsers);
      setOccupantUsersState(data.transformedUsers);
      setPagination({
        current_page:
          statePagination?.current_page ?? data.pagination?.current_page ?? 1,
        total_count:
          statePagination?.total_count ?? data.pagination?.total_count ?? 0,
        total_pages:
          statePagination?.total_pages ?? data.pagination?.total_pages ?? 0,
      });
    } else if (Array.isArray(data)) {
      setOccupantUser(data);
      setOccupantUsersState(data);
      setPagination((prev) => ({
        current_page: statePagination?.current_page ?? prev.current_page,
        total_count: statePagination?.total_count ?? prev.total_count,
        total_pages: statePagination?.total_pages ?? prev.total_pages,
      }));
    }
  }, [occupantUsersData, statePagination]);

  const handleApplyFilters = async (newFilters: {
    name?: string;
    email?: string;
    mobile?: string;
    status?: string;
    entity?: string;
    downloaded?: undefined | boolean;
    search?: string;
  }) => {
    setFilters(newFilters);
    const [firstName = "", lastName = ""] =
      newFilters?.name?.trim().split(" ") ?? [];
    await dispatch(
      fetchOccupantUsers({
        page: 1,
        perPage: 10,
        firstname_cont: firstName,
        lastname_cont: lastName,
        mobile_cont: newFilters.mobile,
        email_cont: newFilters.email,
        lock_user_permission_status_eq: newFilters.status,
        entity_id_eq: newFilters.entity,
        app_downloaded_eq: newFilters.downloaded,
        search_all_fields_cont: newFilters.search,
        lock_user_permissions_user_type_eq: 'pms_occupant',
      })
    );
    toast.success("Filters applied successfully");
    setFilterDialogOpen(false);
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `https://${localStorage.getItem(
          "baseUrl"
        )}/pms/account_setups/export_occupant_users.xlsx`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "occupant_users.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const { setCurrentSection } = useLayout();

  const fetchUsers = () => {
    try {
      dispatch(
        fetchOccupantUsers({ page: pagination.current_page, perPage: 10, lock_user_permissions_user_type_eq: 'pms_occupant' })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isRestrictedUser) {
      navigate("/maintenance/asset");
      return;
    }
    setCurrentSection("Master");
    fetchUsers();
    dispatch(fetchOccupantUserCounts('occupant'));
  }, [setCurrentSection, dispatch]);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      handleApplyFilters({
        search: searchQuery,
      });
    }, 500),
    [pagination.current_page]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handlePageChange = async (page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    try {
      dispatch(
        fetchOccupantUsers({
          page: page,
          perPage: 10,
          firstname_cont: filters?.name?.split(" ")[0],
          lastname_cont: filters?.name?.split(" ")[1],
          email_cont: filters.email,
          lock_user_permission_status_eq: filters.status,
          entity_id_eq: filters.entity,
          app_downloaded_eq: filters.downloaded,
          search_all_fields_cont: searchTerm,
          // lock_user_permissions_user_type_eq: 'pms_occupant',
        })
      );
    } catch (error) {
      toast.error("Failed to fetch bookings");
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // Status update functionality
  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    if (!baseUrl || !token) {
      toast.error("Missing authentication credentials");
      return;
    }

    try {
      const response = await fetch(
        `https://${baseUrl}/pms/users/status_update.jsong?id=${userId}&active=${isActive}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setOccupantUsersState((prevUsers) =>
        prevUsers.map((user) =>
          user.lockUserId === userId
            ? {
              ...user,
              active: isActive,
              status: isActive ? "Active" : "Inactive",
            }
            : user
        )
      );

      toast.success("User status updated successfully!");
    } catch (error: unknown) {
      console.error("Status toggle failed:", error);
      toast.error("Failed to update user status.");
    }
  };

  const getStatusBadgeProps = (status: string | null) => {
    if (status === "approved" || status === "active") {
      return {
        className: "bg-green-600 text-white hover:bg-green-700 cursor-pointer",
        children: "Approved",
      };
    } else if (status === "pending") {
      return {
        className: "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer",
        children: "Pending",
      };
    } else if (status === "rejected") {
      return {
        className: "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer",
        children: "Rejected",
      };
    } else {
      return {
        className: "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer",
        children: "Pending",
      };
    }
  };

  const handleStatusClick = (user: any) => {
    console.log(user);
    setSelectedUser(user);
    setSelectedStatus(user.status ?? "pending");
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedUser?.lockUserId) return;

    try {
      const baseUrl = localStorage.getItem("baseUrl") ?? "";
      const token = localStorage.getItem("token") ?? "";

      const response = await fetch(
        `https://${baseUrl}/pms/users/status_update?id=${selectedUser.lockUserId}&status=${selectedStatus}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Update both local states for immediate UI update
      setOccupantUser((prevUsers: any[]) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
              ...user,
              status: selectedStatus,
            }
            : user
        )
      );

      setOccupantUsersState((prevUsers: any[]) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
              ...user,
              status: selectedStatus,
            }
            : user
        )
      );

      toast.success("User status updated successfully!");
      dispatch(fetchOccupantUserCounts('occupant')); // Refresh counts
      setStatusDialogOpen(false);
      setSelectedUser(null);
      setSelectedStatus("");
    } catch (error: unknown) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    }
  };

  const renderCell = (user: any, columnKey: string) => {
    switch (columnKey) {
      case "active":
        return (
          <Switch
            checked={user.active}
            onCheckedChange={(checked) =>
              handleToggleUserStatus(user.lockUserId ?? "", checked)
            }
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={!user.lockUserId}
          />
        );
      case "type":
        return (
          <Badge variant="secondary">
            {user?.type || "-"}
          </Badge>
        );
      case "status":
        return (
          <Badge
            {...getStatusBadgeProps(user.status)}
            onClick={() => handleStatusClick(user)}
          />
        );
      case "faceRecognition":
        return (
          <Badge variant={user.faceRecognition === "Yes" || user.faceRecognition === true ? "default" : "secondary"}>
            {user.faceRecognition === "Yes" || user.faceRecognition === true ? "Yes" : "No"}
          </Badge>
        );
      case "appDownloaded":
        return (
          <Badge variant={user.appDownloaded === "Yes" || user.appDownloaded === true ? "default" : "secondary"}>
            {user.appDownloaded === "Yes" || user.appDownloaded === true ? "Yes" : "No"}
          </Badge>
        );
      case "gender":
        return user.gender || "";
      case "employeeId":
        return user.employeeId || "";
      case "accessLevel":
        return user.accessLevel || "";
      case "department":
        return user.department || "";
      case "departmentName":
        return user.departmentName || "";
      case "entity":
        return user.entity || "";
      case "company":
        return user.company || "";
      default:
        return user[columnKey] || "";
    }
  };

  // Handle OTP generation
  const handleGenerateOTP = async (email: string) => {
    const baseUrl = localStorage.getItem("baseUrl");
    if (!baseUrl) {
      toast.error("Base URL not found");
      return;
    }

    try {
      setOtpLoading(true);
      const response = await axios.get(
        `https://${baseUrl}/get_otps/generate_otp.json?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOtpData(response.data);
      setOtpDialogOpen(true);
      toast.success(response.data.message || "OTP generated successfully");
    } catch (error) {
      console.error("OTP generation failed:", error);
      toast.error("Failed to generate OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Copy to clipboard handler
  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const leftActions = (
    <>
      <Button
        onClick={() => setShowActionPanel(true)}
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
      >
        <Plus className="w-4 h-4" />
        Action
      </Button>
    </>
  );

  if (isRestrictedUser) return null;

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div className="w-full space-y-6">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Users"
            value={totalUsers}
            icon={<Users className="w-6 h-6 text-[#C72030]" />}
            onClick={fetchUsers}
          />
          <StatsCard
            title="Approved"
            value={approvedUsers}
            icon={<Users className="w-6 h-6 text-[#C72030]" />}
            onClick={() => handleApplyFilters({ status: "approved" })}
            className="cursor-pointer"
          />
          <StatsCard
            title="Pending"
            value={pendingUsers}
            icon={<Users className="w-6 h-6 text-[#C72030]" />}
            onClick={() => handleApplyFilters({ status: "pending" })}
            className="cursor-pointer"
          />
          <StatsCard
            title="Rejected"
            value={rejectedUsers}
            icon={<Users className="w-6 h-6 text-[#C72030]" />}
            onClick={() => handleApplyFilters({ status: "rejected" })}
            className="cursor-pointer"
          />
          <StatsCard
            title="App Downloaded"
            value={appDownloaded}
            icon={<Download className="w-6 h-6 text-[#C72030]" />}
            onClick={() => handleApplyFilters({ downloaded: true })}
            className="cursor-pointer"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <EnhancedTable
            data={occupantUsersState}
            columns={columns}
            renderCell={renderCell}
            renderActions={(item: any) => (
              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    location.pathname.includes("/club-management/")
                      ? navigate(
                        `/club-management/users/occupant-users/view/${item.id}`
                      )
                      : navigate(`/master/user/occupant-users/view/${item.id}`);
                  }}
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {isOpsConsole && item.email && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateOTP(item.email);
                    }}
                    title="Send OTP"
                    disabled={otpLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
            onFilterClick={() => setFilterDialogOpen(true)}
            enableExport
            handleExport={handleExport}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            storageKey="occupant-user-master-table"
            searchPlaceholder="Search users..."
            loading={loading}
            leftActions={leftActions}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.current_page - 1))
                  }
                  className={
                    pagination.current_page === 1 || loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(
                      Math.min(
                        pagination.total_pages,
                        pagination.current_page + 1
                      )
                    )
                  }
                  className={
                    pagination.current_page === pagination.total_pages ||
                      loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {showActionPanel && (
        <SelectionPanel
          onAdd={() => location.pathname.includes("/club-management/")
            ? navigate("/club-management/users/occupant-users/add")
            : navigate("/master/user/occupant-users/add")}
          onImport={() => {
            setShowActionPanel(false);
            setIsImportModalOpen(true);
          }}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <OccupantUsersFilterDialog
        filterDialogOpen={filterDialogOpen}
        setFilterDialogOpen={setFilterDialogOpen}
        filters={filters}
        setFilters={setFilters}
        handleApplyFilters={handleApplyFilters}
      />

      <Dialog
        open={statusDialogOpen}
        onClose={setStatusDialogOpen}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent className="p-0 bg-white">
          <div className="px-6 py-3 border-b mb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Update Status</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="px-6 py-3 space-y-6">
            <FormControl fullWidth>
              <InputLabel id="status-label">Select Status</InputLabel>
              <Select
                labelId="status-label"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <div className="flex justify-center">
              <Button
                onClick={handleStatusUpdate}
                className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2 rounded-md"
                disabled={!selectedStatus || selectedStatus === "Select Status"}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImportOccupantUsers
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onRefresh={() => {
          fetchUsers();
          dispatch(fetchOccupantUserCounts('occupant'));
        }}
      />

      {/* OTP Dialog */}
      <Dialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent className="p-0 bg-white">
          <div className="px-6 py-3 border-b mb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">OTP Details</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOtpDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {otpData && (
            <div className="px-6 py-4 space-y-4">
              {/* OTP */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">OTP Code</p>
                    <p className="text-3xl font-bold text-green-700">
                      {otpData.get_otp?.otp}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(String(otpData.get_otp?.otp), 'otp')}
                    className="flex items-center gap-2"
                  >
                    {copiedField === 'otp' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy
                  </Button>
                </div>
              </div>

              {/* Email */}
              {otpData.get_otp?.email && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{otpData.get_otp.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(otpData.get_otp.email, 'email')}
                  >
                    {copiedField === 'email' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {/* Mobile */}
              {otpData.get_otp?.mobile && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <p className="text-sm font-medium">{otpData.get_otp.mobile}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(otpData.get_otp.mobile, 'mobile')}
                  >
                    {copiedField === 'mobile' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {/* Organization Info */}
              {otpData.organization && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Organization</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{otpData.organization.name}</p>
                    <p className="text-xs text-gray-600">{otpData.organization.domain}</p>
                  </div>
                </div>
              )}

              {/* Message */}
              {otpData.message && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{otpData.message}</p>
                </div>
              )}

              {/* Created At */}
              {otpData.get_otp?.created_at && (
                <div className="text-xs text-gray-500 text-center">
                  Generated at: {new Date(otpData.get_otp.created_at).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
