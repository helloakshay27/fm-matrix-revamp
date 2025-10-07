import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  RefreshCw,
  UnlockIcon,
  Lock,
  Calendar,
  User,
  Mail,
  Phone,
  AlertCircle,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface LockedUsersResponse {
  locked_users: LockedUser[];
  total_count: number;
}

export const LockedUsersDashboard = () => {
  const [lockedUsers, setLockedUsers] = useState<LockedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<LockedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<LockedUser | null>(null);
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Fetch locked users
  const fetchLockedUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        getFullUrl("/pms/users/locked_users.json"),
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
        getFullUrl(`/pms/users/${selectedUser.id}/unlock_account.json`),
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
        <Button
          onClick={fetchLockedUsers}
          disabled={loading}
          className="bg-[#C72030] hover:bg-[#a81c29] text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Locked Users
            </CardTitle>
            <Lock className="w-4 h-4 text-[#C72030]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {lockedUsers.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Filtered Results
            </CardTitle>
            <Search className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {filteredUsers.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Status
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "Loading..." : "Active"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name, email, mobile, department, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-[#C72030]" />
              <span className="ml-3 text-gray-600">Loading locked users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UnlockIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No matching users found" : "No locked users"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "All user accounts are currently unlocked"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Locked At</TableHead>
                    <TableHead>Failed Attempts</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#C72030] bg-opacity-10 flex items-center justify-center">
                            <User className="w-5 h-5 text-[#C72030]" />
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
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.department || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.designation || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.locked_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {user.failed_attempts || 0} attempts
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {user.lock_reason || "Multiple failed login attempts"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => openUnlockDialog(user)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <UnlockIcon className="w-4 h-4 mr-2" />
                          Unlock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
};
