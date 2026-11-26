import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalLockedUsers, setTotalLockedUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // Tracks the latest request so out-of-order responses (fast typing) are ignored
  const latestRequestRef = useRef(0);
  const [selectedUser, setSelectedUser] = useState<LockedUser | null>(null);
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkUnlocking, setBulkUnlocking] = useState(false);
  const [bulkUnlockDialogOpen, setBulkUnlockDialogOpen] = useState(false);

  const filteredLockedUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return lockedUsers;

    const queryDigits = query.replace(/\D/g, "");
    return lockedUsers.filter((user) => {
      const phoneDigits = `${user.country_code || ""}${user.mobile || ""}`.replace(/\D/g, "");
      const searchableValues = [
        user.id,
        user.firstname,
        user.lastname,
        `${user.firstname} ${user.lastname}`,
        user.email,
        user.mobile,
        user.country_code,
        phoneDigits,
      ];

      return searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      ) || (queryDigits.length > 0 && phoneDigits.includes(queryDigits));
    });
  }, [lockedUsers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredLockedUsers.length / pageSize));
  const paginatedLockedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLockedUsers.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredLockedUsers]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Fetch locked users
  const fetchLockedUsers = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    setLoading(true);
    try {
      const baseUrl = location.pathname.startsWith("/master")
        ? "/pms/users/locked_users.json?selected_site_wise=true"
        : "/pms/users/locked_users.json";

      const fetchPage = async (page: number): Promise<LockedUsersResponse> => {
        const url = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${page}`;
        const response = await fetch(getFullUrl(url), {
          method: "GET",
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      };

      const firstPage = await fetchPage(1);
      const allLockedUsers = firstPage.locked_users || [];
      const totalPages = firstPage.pagination?.total_pages || 1;

      for (let page = 2; page <= totalPages; page++) {
        if (requestId !== latestRequestRef.current) return;
        const data = await fetchPage(page);
        allLockedUsers.push(...(data.locked_users || []));
      }

      if (requestId !== latestRequestRef.current) return;
      setLockedUsers(allLockedUsers);
      setTotalLockedUsers(firstPage.pagination?.total_count ?? allLockedUsers.length);

      if (allLockedUsers.length === 0) {
        toast.info("No locked users found");
      }
    } catch (error: any) {
      if (requestId !== latestRequestRef.current) return;
      console.error("Error fetching locked users:", error);
      toast.error(
        error.message || "Failed to load locked users"
      );
      setLockedUsers([]);
      setTotalLockedUsers(0);
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Load every page so the client-side search can match the full locked-user list.
  useEffect(() => {
    fetchLockedUsers();
  }, [fetchLockedUsers]);

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
      setTotalLockedUsers((prev) => Math.max(0, prev - 1));

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
      setSelectedIds((previous) => new Set([
        ...previous,
        ...paginatedLockedUsers.map((user) => user.id),
      ]));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
      setTotalLockedUsers((prev) => Math.max(0, prev - selectedIdsArray.length));

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
          value={totalLockedUsers}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />

        <StatsCard
          title="Filtered Results"
          value={filteredLockedUsers.length}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />

        <StatsCard
          title="Status"
          value={loading ? "Loading..." : "Active"}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
      </div>

      {/* All pages are loaded so search covers every locked user. */}
      <EnhancedTable
        data={paginatedLockedUsers}
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
        onSearchChange={handleSearchChange}
        disableClientSearch={true}
        searchPlaceholder="Search by name, email or phone..."
        emptyMessage={searchTerm ? "No matching users found" : "No locked users"}
        loading={loading}
        pagination={true}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
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
              setCurrentPage(1);
              setSelectedIds(new Set());
              fetchLockedUsers();
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
