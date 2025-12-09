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
import { Users, Download, X, Eye, Plus } from "lucide-react";
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

const columns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true },
  { key: "name", label: "Name", sortable: true, draggable: true },
  { key: "mobile", label: "Mobile Number", sortable: true, draggable: true },
  { key: "email", label: "Email", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, draggable: true },
  {
    key: "appDownloaded",
    label: "App Downloaded",
    sortable: true,
    draggable: true,
  },
];

export const GuestUserMasterDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [occupantUser, setOccupantUser] = useState([]);
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
        lock_user_permissions_user_type_eq: 'pms_guest',
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
      link.setAttribute("download", "guest_users.xlsx");
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
        fetchOccupantUsers({ page: pagination.current_page, perPage: 10, lock_user_permissions_user_type_eq: 'pms_guest' })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrentSection("Club Management");
    fetchUsers();
    dispatch(fetchOccupantUserCounts('guest'));
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
          lock_user_permissions_user_type_eq: 'pms_guest',
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
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis-start">
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
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
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
  const getStatusBadgeProps = (status: string | null) => {
    if (status === "approved" || status === "active") {
      return {
        variant: "default" as const,
        className:
          "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer",
        children: "Approved",
      };
    } else if (status === "pending") {
      return {
        variant: "secondary" as const,
        className:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer",
        children: "Pending",
      };
    } else if (status === "rejected") {
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer",
        children: "Rejected",
      };
    } else {
      return {
        variant: "secondary" as const,
        className:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer",
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

      // Update local state
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

      toast.success("User status updated successfully!");
      dispatch(fetchOccupantUserCounts('guest')); // Refresh counts
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
      case "status":
        return (
          <Badge
            {...getStatusBadgeProps(user.status)}
            onClick={() => handleStatusClick(user)}
          />
        );
      default:
        return user[columnKey];
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

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Guests"
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

      <div className="overflow-x-auto">
        <EnhancedTable
          data={occupantUser}
          columns={columns}
          renderCell={renderCell}
          renderActions={(item: any) => (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/club-management/users/guest/view/${item.id}`);
                }}
                title="View"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )}
          onFilterClick={() => setFilterDialogOpen(true)}
          enableExport
          handleExport={handleExport}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          storageKey="fm-guest-user-table"
          searchPlaceholder="Search guests..."
          loading={loading}
          leftActions={leftActions}
        />
      </div>        {pagination.total_pages > 0 && (
          <div className="flex justify-center items-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious
                    onClick={() =>
                      pagination.current_page > 1 &&
                      handlePageChange(pagination.current_page - 1)
                    }
                    className={
                      pagination.current_page === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem className="cursor-pointer">
                  <PaginationNext
                    onClick={() =>
                      pagination.current_page < pagination.total_pages &&
                      handlePageChange(pagination.current_page + 1)
                    }
                    className={
                      pagination.current_page === pagination.total_pages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {showActionPanel && (
        <SelectionPanel
          onAdd={() => navigate("/club-management/users/guest/add")}
          onImport={() => {}}
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
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Update Guest Status</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setStatusDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
