import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  RefreshCw,
  UserPlus,
  Users,
  Send,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Crown,
  Eye,
  EyeOff,
  Settings,
  Clock,
  Check,
  Loader2,
} from "lucide-react";
import apiClient from "@/utils/apiClient";
import { ENDPOINTS, getFullUrl } from "@/config/apiConfig";
import { TicketPagination } from "@/components/TicketPagination";
import { departmentService, Department } from "@/services/departmentService";
import { roleService, BCRole } from "@/services/roleService";
import { userService, UserInvitationPayload } from "@/services/userService";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

interface TeamUser {
  id: number;
  full_name: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  active: boolean;
  is_admin: boolean;
  user_type: string | null;
  role_id: number | null;
  department_id: number | null;
  department: string | null;
  report_to_id: number | null;
  report_to: string | null;
  birth_date: string | null;
  gender: string | null;
  created_at: string;
  job_title: string | null;
  is_hod: boolean | null;
  city?: string | null;
  state?: string | null;
  pin_code?: string | null;
  address?: string | null;
  anniversary_date?: string | null;
  date_of_joining?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_number?: string | null;
  avatar?: string;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

const TeamSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "inactive" | "invitations" | "email-logs">("active");
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [rolesList, setRolesList] = useState<BCRole[]>([]);
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [groupByDept, setGroupByDept] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isBulkInviteOpen, setIsBulkInviteOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [bulkEmails, setBulkEmails] = useState("");
  const [inviteForm, setInviteForm] = useState<UserInvitationPayload>({
    email: "",
    display_name: "",
    mobile: "",
    designation: "",
    department_id: "",
    role_id: ""
  });

  const fetchRoles = async () => {
    try {
      const data = await roleService.fetchBusinessCompassRoles();
      setRolesList(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.fetchDepartments();
      setDepartmentsList(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchUsers = async (page: number = currentPage, term: string = searchTerm, limit: number = pageSize) => {
    setIsLoading(true);
    try {
      if (activeTab === "invitations" || activeTab === "invitation-history" || activeTab === "email-logs") {
        let res: any;
        const queryParams: any = {};
        if (departmentFilter !== "all") {
          queryParams["q[department_id_eq]"] = departmentFilter;
        }

        if (activeTab === "email-logs") {
          res = await userService.fetchEmailLogs(queryParams);
        } else {
          const fetchMethod = activeTab === "invitations" 
            ? userService.fetchPendingInvitations 
            : userService.fetchInvitationHistory;
          res = await fetchMethod.call(userService, queryParams);
        }

        if (res.success) {
          if (activeTab === "email-logs") {
            const mappedLogs = res.logs.map((log: any) => ({
              id: log.id,
              full_name: log.display_name || log.email.split("@")[0],
              email: log.email,
              active: false,
              is_email_log: true,
              status: log.status,
              sent_at: log.sent_at,
              resent_at: log.resent_at,
              avatar: ""
            } as any));
            setUsers(mappedLogs);
            setTotalItems(res.total);
          } else {
            // Map invitations to match TeamUser structure for common rendering
            const mappedInvitations = res.invitations.map((inv: any) => ({
              id: inv.id,
              full_name: inv.display_name || inv.email.split("@")[0],
              email: inv.email,
              mobile: inv.mobile || "",
              active: false,
              department: inv.department || "N/A",
              job_title: inv.designation || "N/A",
              is_invitation: true,
              status: inv.status,
              invited_at: inv.invited_at,
              invited_by: inv.invited_by,
              avatar: ""
            } as any));
            
            setUsers(mappedInvitations);
            setTotalItems(res.total);
          }
          
          setTotalPages(Math.ceil(res.total / limit));
          setMeta({
            total: res.total,
            active: 0,
            inactive: 0,
            pending: activeTab === "invitations" ? res.total : 0,
            page: 1,
            per_page: limit
          });
        }
        setIsLoading(false);
        return;
      }

      const queryParams: any = {
        page: page,
        per_page: limit,
      };

      // Filter by active status based on tab
      if (activeTab === "active") {
        queryParams["q[active_eq]"] = "true";
      } else if (activeTab === "inactive") {
        queryParams["q[active_eq]"] = "false";
      }

      if (term.trim()) {
        queryParams["q[firstname_or_lastname_or_email_cont]"] = term.trim();
      }

      // Filter by department ID
      if (departmentFilter !== "all") {
        queryParams["q[department_id_eq]"] = departmentFilter;
      }

      // Filter by role ID
      if (roleFilter !== "all") {
        queryParams["q[role_id_eq]"] = roleFilter;
      }

      const response = await apiClient.get(ENDPOINTS.TEAM_MEMBERS, { 
        params: queryParams 
      });
      
      if (response.data.success) {
        setUsers(response.data.users || []);
        const meta = response.data.meta;
        if (meta) {
          setStats({
            total: meta.total || 0,
            active: meta.active || 0,
            inactive: meta.inactive || 0,
            pending: meta.pending || 0,
          });
          setTotalItems(meta.total || 0);
          setTotalPages(Math.ceil((meta.total || 0) / (meta.per_page || limit)));
          
          if (meta.page && meta.page !== page) {
            setCurrentPage(meta.page);
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch team members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvitation = async (id: number | string) => {
    try {
      const res = await userService.resendInvitation(id);
      if (res.success) {
        toast.success(res.message || "Invitation resent successfully");
      } else {
        toast.error(res.message || "Failed to resend invitation");
      }
    } catch (error) {
      toast.error("An error occurred while resending invitation");
    }
  };

  const handleWithdrawInvitation = async (id: number | string) => {
    try {
      const res = await userService.withdrawInvitation(id);
      if (res.success) {
        toast.success(res.message || "Invitation withdrawn successfully");
        fetchUsers(currentPage); // Refresh to remove the item
      } else {
        toast.error(res.message || "Failed to withdraw invitation");
      }
    } catch (error) {
      toast.error("An error occurred while withdrawing invitation");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [activeTab, departmentFilter, roleFilter, userTypeFilter, debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  const handlePerPageChange = (limit: number) => {
    setPageSize(limit);
    setCurrentPage(1);
    fetchUsers(1, searchTerm, limit);
  };

  const handleInviteSubmit = async () => {
    if (!inviteForm.email || !inviteForm.display_name) {
      toast.error("Please fill in required fields");
      return;
    }
    
    setIsInviting(true);
    try {
      const res = await userService.inviteUser(inviteForm);
      if (res.success) {
        toast.success(res.message || "Invitation sent successfully");
        setIsInviteOpen(false);
        setInviteForm({
          email: "",
          display_name: "",
          mobile: "",
          designation: "",
          department_id: "",
          role_id: ""
        });
        fetchUsers(1); // Refresh list to catch any status changes
      } else {
        toast.error(res.message || "Failed to send invitation");
      }
    } catch (error) {
      toast.error("An error occurred while sending invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleBulkInviteSubmit = async () => {
    if (!bulkEmails.trim()) {
      toast.error("Please enter at least one email");
      return;
    }

    const emailArray = bulkEmails
      .split(/[\s,]+/) // Split by whitespace or comma
      .map(e => e.trim())
      .filter(e => e && e.includes("@")); // Basic validation

    if (emailArray.length === 0) {
      toast.error("No valid emails found");
      return;
    }

    setIsInviting(true);
    try {
      const res = await userService.bulkInvite({ emails: emailArray });
      if (res.success) {
        toast.success(`Successfully sent ${res.sent} invitations`);
        if (res.skipped > 0) {
          toast.info(`${res.skipped} emails were skipped: ${res.skipped_emails.join(", ")}`);
        }
        setIsBulkInviteOpen(false);
        setBulkEmails("");
        fetchUsers(1);
      } else {
        toast.error("Failed to send bulk invitations");
      }
    } catch (error) {
      toast.error("An error occurred during bulk invitation");
    } finally {
      setIsInviting(false);
    }
  };


  const filteredUsers = users;

  const groupedUsers = groupByDept 
    ? departmentsList.reduce((acc, dept) => {
        acc[dept.department_name] = filteredUsers.filter(user => user.department_id === dept.id);
        return acc;
      }, {} as Record<string, TeamUser[]>)
    : { "All Users": filteredUsers };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
    }
  };

  const getRoleBadge = (user: TeamUser) => {
    if (user.is_admin) {
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    }
    if (user.is_hod) {
      return <Badge className="bg-blue-100 text-blue-800">HOD: {user.department}</Badge>;
    }
    return <Badge variant="outline">{user.job_title || "Team Member"}</Badge>;
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage your team members, roles, and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => fetchUsers(currentPage)}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsBulkInviteOpen(true)}>
            <Users className="h-4 w-4" />
            Bulk Invite
          </Button>
        </div>
      </div>

      {/* User Status Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all ${
              activeTab === "active"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Active Users
            <Badge className="ml-2 bg-blue-100 text-blue-800">{stats.active}</Badge>
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all ${
              activeTab === "inactive"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Inactive Users
            <Badge className="ml-2 bg-red-100 text-red-800">{stats.inactive}</Badge>
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all ${
              activeTab === "invitations"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Invitations
            <Badge className="ml-2 bg-yellow-100 text-yellow-800">{stats.pending}</Badge>
          </button>
          <button
            onClick={() => setActiveTab("invitation-history")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all ${
              activeTab === "invitation-history"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Invitation History
          </button>
          <button
            onClick={() => setActiveTab("email-logs")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all ${
              activeTab === "email-logs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Email Logs
          </button>
        </nav>
      </div>

      {/* User Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <EyeOff className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List Controls */}
      <Card className="mb-6 rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : "Select all"}
              </label>
            </div>
            {selectedUsers.length > 0 && (
              <Button
                className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2 h-9 px-4 text-sm"
                onClick={() => setIsBulkEditOpen(true)}
              >
                <Check className="h-4 w-4" />
                Bulk Edit ({selectedUsers.length})
              </Button>
            )}
          </div>

          <div className="flex items-center w-full gap-2">
            <div className="flex-[2] min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm border-gray-200 w-full rounded-lg"
                />
              </div>
            </div>

            <div className="flex-[1.5] min-w-0">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="h-9 text-sm border-gray-200 w-full rounded-lg">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departmentsList.map(dept => (
                    <SelectItem key={dept.id} value={dept.id?.toString() || ""}>{dept.department_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-0">
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="h-9 text-sm border-gray-200 w-full rounded-lg">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="hod">HOD</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-0">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-9 text-sm border-gray-200 w-full rounded-lg">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {rolesList.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => setGroupByDept(!groupByDept)}
              className={`flex items-center gap-2 h-9 text-sm font-medium border-gray-300 whitespace-nowrap flex-shrink-0 rounded-lg ${
                groupByDept ? "bg-gray-100" : ""
              }`}
            >
              <Users className="h-4 w-4" />
              Group by Dept
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User List or Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedUsers).map(([groupName, groupUsers]) => (
            groupUsers.length > 0 && (
              <Card key={groupName}>
                {groupByDept && (
                  <CardHeader className="pb-3 border-b mb-3">
                    <CardTitle className="text-lg">{groupName} ({groupUsers.length})</CardTitle>
                  </CardHeader>
                )}
                <CardContent className="space-y-3 p-3 pt-0">
                  {groupUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                        />
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.full_name} />
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{user.full_name}</p>
                            {user.is_invitation ? (
                              <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-200">
                                Pending Invite
                              </Badge>
                            ) : user.is_email_log ? (
                              <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">
                                Email Log
                              </Badge>
                            ) : (
                              getStatusBadge(user.active)
                            )}
                            {getRoleBadge(user)}
                          </div>
                          {(user.email || user.mobile) && (
                            <div className="flex items-center gap-3 mt-1">
                              {user.email && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {user.email}
                                </div>
                              )}
                              {user.mobile && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {user.mobile}
                                </div>
                              )}
                            </div>
                          )}
                          {user.is_invitation && (
                            <p className="text-[10px] text-gray-400 mt-1">
                              Invited at {new Date(user.invited_at).toLocaleDateString()} by {user.invited_by}
                            </p>
                          )}
                          {user.is_email_log && (
                            <div className="mt-1 space-y-0.5">
                              <p className="text-[10px] text-gray-400">
                                Sent at {new Date(user.sent_at).toLocaleString()}
                              </p>
                              {user.resent_at && (
                                <p className="text-[10px] text-blue-400 italic">
                                  Resent at {new Date(user.resent_at).toLocaleString()}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.mobile || "N/A"}
                            </div>
                            {user.report_to && (
                              <div className="flex items-center gap-1">
                                <Crown className="h-3 w-3 text-amber-500" />
                                Reports to: {user.report_to}
                              </div>
                            )}
                            {user.department && (
                              <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-[10px] uppercase py-0">{user.department}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.is_invitation && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 flex items-center gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                            onClick={() => handleResendInvitation(user.id)}
                          >
                            <Send className="h-3 w-3" />
                            Resend
                          </Button>
                        )}
                        {user.is_invitation && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 flex items-center gap-2 text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                            onClick={() => handleWithdrawInvitation(user.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Withdraw
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2 text-blue-600" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2 text-gray-600" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          ))}

          {!isLoading && users.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  {searchTerm ? "No users match your search criteria. Try adjusting your filters." : "No users found in this department or category."}
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => {setSearchTerm(""); setDepartmentFilter("all"); fetchUsers(1, "");}}>Reset Filters</Button>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {!isLoading && users.length > 0 && (
            <div className="mt-6 flex justify-center">
              <TicketPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalItems}
                perPage={pageSize}
                isLoading={isLoading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Bulk Edit Dialog */}
      <Dialog open={isBulkEditOpen} onOpenChange={setIsBulkEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Bulk Edit Users ({selectedUsers.length})
            </DialogTitle>
            <DialogDescription>
              Apply changes to all selected users simultaneously.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="p-4">
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Selected Users ({selectedUsers.length})</h4>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {selectedUsers.slice(0, 15).map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <Badge key={userId} variant="secondary" className="text-[10px]">
                        {user.full_name}
                      </Badge>
                    ) : null;
                  })}
                  {selectedUsers.length > 15 && (
                    <Badge variant="outline" className="text-[10px]">
                      +{selectedUsers.length - 15} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Change Status</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="No change" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Change Role</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="No change" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    {rolesList.map(role => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Change Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="No change" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    {departmentsList.map(dept => <SelectItem key={dept.id} value={dept.id?.toString() || ""}>{dept.department_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkEditOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsBulkEditOpen(false)}>
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Invite New Team Member
            </DialogTitle>
            <DialogDescription>
              Send an email invitation to join your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Full Name *</Label>
              <Input
                id="invite-name"
                placeholder="John Doe"
                value={inviteForm.display_name}
                onChange={(e) => setInviteForm({ ...inviteForm, display_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address *</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="john.doe@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-mobile">Mobile Number</Label>
              <Input
                id="invite-mobile"
                placeholder="9988776655"
                value={inviteForm.mobile}
                onChange={(e) => setInviteForm({ ...inviteForm, mobile: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={inviteForm.department_id as string}
                  onValueChange={(val) => setInviteForm({ ...inviteForm, department_id: val })}
                >
                  <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
                  <SelectContent>
                    {departmentsList.map(dept => (
                      <SelectItem key={dept.id} value={dept.id?.toString() || ""}>{dept.department_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={inviteForm.role_id as string}
                  onValueChange={(val) => setInviteForm({ ...inviteForm, role_id: val })}
                >
                  <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                  <SelectContent>
                    {rolesList.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-designation">Designation</Label>
              <Input
                id="invite-designation"
                placeholder="Software Engineer"
                value={inviteForm.designation}
                onChange={(e) => setInviteForm({ ...inviteForm, designation: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)} disabled={isInviting}>Cancel</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={handleInviteSubmit}
              disabled={isInviting}
            >
              {isInviting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Invite Dialog */}
      <Dialog open={isBulkInviteOpen} onOpenChange={setIsBulkInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Bulk Invite Team Members
            </DialogTitle>
            <DialogDescription>
              Enter multiple email addresses separated by commas or new lines.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-emails">Email Addresses</Label>
              <Textarea
                id="bulk-emails"
                placeholder="email1@example.com, email2@example.com..."
                className="min-h-[150px]"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
              />
              <p className="text-[10px] text-gray-500">
                You can copy-paste from a spreadsheet or a list. Invalid formats will be automatically filtered.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkInviteOpen(false)} disabled={isInviting}>Cancel</Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={handleBulkInviteSubmit}
              disabled={isInviting}
            >
              {isInviting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Send Invitations"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamSetup;
