import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  RefreshCw,
  UnlockIcon,
  Calendar,
  User,
  Mail,
  Phone,
  AlertCircle,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { API_CONFIG, getAuthHeader, getFullUrl } from "@/config/apiConfig";

interface LockedUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  mobile?: string;
  country_code?: string;
  locked_at: string;
  failed_attempts?: number;
  lock_reason?: string;
  department?: string;
  designation?: string;
}

interface PaginationData {
  current_page: number;
  total_count: number;
  total_pages: number;
}

interface LockedUsersResponse {
  locked_users: LockedUser[];
  pagination: PaginationData;
}

const lockedUserColumns: ColumnConfig[] = [
  { key: "user", label: "User", sortable: false, hideable: true, defaultVisible: true, draggable: true },
  { key: "contact", label: "Contact", sortable: false, hideable: true, defaultVisible: true, draggable: true },
  { key: "department", label: "Department", sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: "locked_at", label: "Locked At", sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: "failed_attempts", label: "Failed Attempts", sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: "lock_reason", label: "Reason", sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

export const LockedUsersDashboard = () => {
  const [lockedUsers, setLockedUsers] = useState<LockedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<LockedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<LockedUser | null>(null);
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkUnlocking, setBulkUnlocking] = useState(false);
  const [bulkUnlockDialogOpen, setBulkUnlockDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  // Fetch locked users
  const fetchLockedUsers = async (page: number = 1) => {
    setLoading(true);
    try {
      const baseUrl = location.pathname.startsWith("/master")
        ? "/pms/users/locked_users.json?selected_site_wise=true"
        : "/pms/users/locked_users.json";
      const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`;

      const response = await fetch(
        getFullUrl(url),
        {
          method: "GET",
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LockedUsersResponse = await response.json();
      setLockedUsers(data.locked_users || []);
      setFilteredUsers(data.locked_users || []);

      if (data.pagination) {
        setPagination(data.pagination);
      }

      if (data.locked_users?.length === 0) {
        toast.info("No locked users found");
      }
    } catch (error: any) {
      console.error("Error fetching locked users:", error);
      toast.error(
        error.message || "Failed to load locked users"
      );
      // Set empty arrays on error
      setLockedUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchLockedUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(lockedUsers);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = lockedUsers.filter(
      (user) =>
        user.firstname?.toLowerCase().includes(lowerSearch) ||
        user.lastname?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.mobile?.includes(searchTerm) ||
        user.department?.toLowerCase().includes(lowerSearch) ||
        user.designation?.toLowerCase().includes(lowerSearch)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, lockedUsers]);

  // Handle unlock user
  const handleUnlockUser = async () => {
    if (!selectedUser) return;

    setUnlocking(true);
    try {
      const response = await fetch(
        getFullUrl(`/pms/users/${selectedUser.id}/unlock_user.json`),
        {
          method: "GET",
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to unlock user account");
      }

      toast.success(
        `Account unlocked successfully for ${selectedUser.firstname} ${selectedUser.lastname}`
      );

      // Remove unlocked user from the list
      setLockedUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));

      setUnlockDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Error unlocking user:", error);
      toast.error(error.message || "Failed to unlock user account");
    } finally {
      setUnlocking(false);
    }
  };

  // Open unlock dialog
  const openUnlockDialog = (user: LockedUser) => {
    setSelectedUser(user);
    setUnlockDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle individual checkbox selection
  // (EnhancedTable string ids deta hai — yahan number me convert karte hain)
  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    const userId = Number(itemId);
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(userId);
    } else {
      newSelectedIds.delete(userId);
    }
    setSelectedIds(newSelectedIds);
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(filteredUsers.map((user) => user.id));
      setSelectedIds(allIds);
    }
  };

  // Handle bulk unlock users
  const handleBulkUnlockUsers = async () => {
    if (selectedIds.size === 0) return;

    setBulkUnlocking(true);
    try {
      const response = await fetch(
        getFullUrl("/pms/users/bulk_unlock_users.json"),
        {
          method: "POST",
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: Array.from(selectedIds),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to unlock user accounts");
      }

      const result = await response.json();
      toast.success(
        `Successfully unlocked ${selectedIds.size} user account${selectedIds.size > 1 ? "s" : ""}`
      );

      // Remove unlocked users from the list
      const selectedIdsArray = Array.from(selectedIds);
      setLockedUsers((prev) =>
        prev.filter((u) => !selectedIdsArray.includes(u.id))
      );
      setFilteredUsers((prev) =>
        prev.filter((u) => !selectedIdsArray.includes(u.id))
      );

      // Clear selections
      setSelectedIds(new Set());
      setBulkUnlockDialogOpen(false);
    } catch (error: any) {
      console.error("Error unlocking users:", error);
      toast.error(error.message || "Failed to unlock user accounts");
    } finally {
      setBulkUnlocking(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      await fetchLockedUsers(page);
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load page data. Please try again.");
    }
  };

  const renderCell = (user: LockedUser, columnKey: string) => {
    switch (columnKey) {
      case "user":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
              <User className="w-5 h-5 text-brand" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {user.firstname} {user.lastname}
              </div>
              <div className="text-sm text-gray-500">
                ID: {user.id}
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            {user.mobile && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {user.country_code && `+${user.country_code} `}
                {user.mobile}
              </div>
            )}
          </div>
        );
      case "department":
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {user.department || "N/A"}
            </div>
            <div className="text-sm text-gray-500">
              {user.designation || "N/A"}
            </div>
          </div>
        );
      case "locked_at":
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {formatDate(user.locked_at)}
          </div>
        );
      case "failed_attempts":
        return (
          <Badge className="bg-brand-light text-brand border-brand hover:bg-brand-light">
            {user.failed_attempts || 0} attempts
          </Badge>
        );
      case "lock_reason":
        return (
          <span className="text-sm text-gray-600">
            {user.lock_reason || "Multiple failed login attempts"}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locked Users</h1>
          <p className="text-gray-500 mt-1">
            Manage and unlock user accounts that have been locked
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Locked Users"
          value={pagination.total_count}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />

        <StatsCard
          title="Filtered Results"
          value={filteredUsers.length}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />

        <StatsCard
          title="Status"
          value={loading ? "Loading..." : "Active"}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
      </div>

      {/* Table — search filters the current page client-side (as before), paging stays server-side */}
      <EnhancedTable
        data={filteredUsers}
        columns={lockedUserColumns}
        renderCell={renderCell}
        getItemId={(user) => String(user.id)}
        storageKey="locked-users-table"
        selectable={true}
        selectedItems={Array.from(selectedIds).map(String)}
        onSelectAll={handleSelectAll}
        onSelectItem={handleCheckboxChange}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        disableClientSearch={true}
        searchPlaceholder="Search by name, email, mobile, department, or designation..."
        emptyMessage={searchTerm ? "No matching users found" : "No locked users"}
        loading={loading}
        pagination={true}
        currentPage={pagination.current_page}
        totalPages={pagination.total_pages}
        onPageChange={handlePageChange}
        leftActions={
          selectedIds.size > 0 ? (
            <Button
              onClick={() => setBulkUnlockDialogOpen(true)}
              disabled={bulkUnlocking}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UnlockIcon className="w-4 h-4 mr-2" />
              Unlock ({selectedIds.size})
            </Button>
          ) : null
        }
        rightActions={
          <Button
            onClick={() => {
              setPagination((prev) => ({ ...prev, current_page: 1 }));
              fetchLockedUsers(1);
            }}
            disabled={loading}
            variant="ghost"
            className="fm-button-fix fm-button-brand"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {/* Unlock Confirmation Dialog */}
      <Dialog open={unlockDialogOpen} onOpenChange={setUnlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlock the account for{" "}
              <strong>
                {selectedUser?.firstname} {selectedUser?.lastname}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-3 py-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Email</div>
                  <div className="text-sm text-gray-600">{selectedUser.email}</div>
                </div>
              </div>

              {selectedUser.mobile && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Mobile</div>
                    <div className="text-sm text-gray-600">
                      {selectedUser.country_code && `+${selectedUser.country_code} `}
                      {selectedUser.mobile}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Locked At</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(selectedUser.locked_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-red-700">Lock Reason</div>
                  <div className="text-sm text-red-600">
                    {selectedUser.lock_reason || "Multiple failed login attempts"}
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    Failed Attempts: {selectedUser.failed_attempts || 0}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnlockDialogOpen(false)}
              disabled={unlocking}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnlockUser}
              disabled={unlocking}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {unlocking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <UnlockIcon className="w-4 h-4 mr-2" />
                  Unlock Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Unlock Confirmation Dialog */}
      <Dialog open={bulkUnlockDialogOpen} onOpenChange={setBulkUnlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Multiple User Accounts</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlock <strong>{selectedIds.size} user account{selectedIds.size > 1 ? "s" : ""}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-700">Selected Users</div>
                <div className="text-sm text-blue-600 mt-2">
                  {selectedIds.size} user account{selectedIds.size > 1 ? "s" : ""} will be unlocked
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkUnlockDialogOpen(false)}
              disabled={bulkUnlocking}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUnlockUsers}
              disabled={bulkUnlocking}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {bulkUnlocking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <UnlockIcon className="w-4 h-4 mr-2" />
                  Unlock All
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
