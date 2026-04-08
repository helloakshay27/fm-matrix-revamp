import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  RefreshCw,
  UserPlus,
  Users,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  Crown,
  ChevronDown,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Settings,
  Clock,
  Plus,
  Check,
} from "lucide-react";

interface TeamUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive" | "pending";
  role: string;
  department: string;
  reportingManager?: string;
  isHOD?: boolean;
  isAdmin?: boolean;
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [groupByDept, setGroupByDept] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);

  const departments = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Finance",
    "Operations",
    "Customer Support",
    "Front End",
    "Back End",
    "QA",
  ];

  const roles = [
    "Admin",
    "Manager",
    "Team Lead",
    "Senior Developer",
    "Developer",
    "Junior Developer",
    "Designer",
    "HR Specialist",
    "Sales Executive",
  ];

  useEffect(() => {
    // Load users from API or localStorage
    const mockUsers: TeamUser[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@company.com",
        phone: "+1 234-567-8900",
        status: "active",
        role: "Admin",
        department: "Front End",
        isHOD: true,
        isAdmin: true,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@company.com",
        phone: "+1 234-567-8901",
        status: "active",
        role: "Team Lead",
        department: "Engineering",
        reportingManager: "John Doe",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        phone: "+1 234-567-8902",
        status: "inactive",
        role: "Developer",
        department: "Back End",
        reportingManager: "Jane Smith",
      },
      {
        id: "4",
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
        phone: "+1 234-567-8903",
        status: "active",
        role: "Designer",
        department: "Front End",
        reportingManager: "John Doe",
      },
      {
        id: "5",
        name: "David Brown",
        email: "david.brown@company.com",
        phone: "+1 234-567-8904",
        status: "pending",
        role: "HR Specialist",
        department: "HR",
        reportingManager: "Jane Smith",
      },
    ];
    
    setUsers(mockUsers);
    calculateStats(mockUsers);
  }, []);

  const calculateStats = (userList: TeamUser[]) => {
    const newStats = {
      total: userList.length,
      active: userList.filter(u => u.status === "active").length,
      inactive: userList.filter(u => u.status === "inactive").length,
      pending: userList.filter(u => u.status === "pending").length,
    };
    setStats(newStats);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesUserType = userTypeFilter === "all" ||
                           (userTypeFilter === "admin" && user.isAdmin) ||
                           (userTypeFilter === "hod" && user.isHOD) ||
                           (userTypeFilter === "regular" && !user.isAdmin && !user.isHOD);
    
    return matchesSearch && matchesDepartment && matchesRole && matchesUserType;
  });

  const groupedUsers = groupByDept 
    ? departments.reduce((acc, dept) => {
        acc[dept] = filteredUsers.filter(user => user.department === dept);
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

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (user: TeamUser) => {
    if (user.isAdmin) {
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    }
    if (user.isHOD) {
      return <Badge className="bg-blue-100 text-blue-800">HOD: {user.department}</Badge>;
    }
    return <Badge variant="outline">{user.role}</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
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
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
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
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "invitations"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Invitations
            <Badge className="ml-2 bg-yellow-100 text-yellow-800">4</Badge>
          </button>
          <button
            onClick={() => setActiveTab("email-logs")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "email-logs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Email Logs
          </button>
        </nav>
      </div>

      {/* User Statistics Cards */}
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
          {/* Row 1: Select all / Bulk Edit */}
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

          {/* Row 2: Search + Filters */}
          <div className="flex items-center w-full gap-2">
            <div className="flex-[2] min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or jo"
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
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
              Group by Dept
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <div className="space-y-4">
        {Object.entries(groupedUsers).map(([groupName, groupUsers]) => (
          <Card key={groupName}>
            {groupByDept && (
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{groupName} ({groupUsers.length})</CardTitle>
              </CardHeader>
            )}
            <CardContent className="space-y-3">
              {groupUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    />
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        {getStatusBadge(user.status)}
                        {getRoleBadge(user)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                        {user.reportingManager && (
                          <div className="flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Reports to: {user.reportingManager}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
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
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by inviting users to your team"}
            </p>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bulk Edit Dialog */}
      <Dialog open={isBulkEditOpen} onOpenChange={setIsBulkEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Bulk Edit Users ({selectedUsers.length})
            </DialogTitle>
            <DialogDescription>
              Make changes to multiple users at once. Selected users will be updated with the changes you make below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Selected Users Summary */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Selected Users</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.slice(0, 10).map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <Badge key={userId} variant="secondary" className="text-xs">
                        {user.name}
                      </Badge>
                    ) : null;
                  })}
                  {selectedUsers.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedUsers.length - 10} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bulk Edit Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-status">Change Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="No change" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    <SelectItem value="active">Set to Active</SelectItem>
                    <SelectItem value="inactive">Set to Inactive</SelectItem>
                    <SelectItem value="pending">Set to Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-role">Change Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="No change" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-department">Change Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="No change" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-manager">Change Reporting Manager</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="No change" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-900">Additional Actions</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="send-email" />
                  <Label htmlFor="send-email" className="text-sm">Send notification email to users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="reset-password" />
                  <Label htmlFor="reset-password" className="text-sm">Reset passwords and send new credentials</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remove-access" />
                  <Label htmlFor="remove-access" className="text-sm text-red-600">Remove all access permissions</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsBulkEditOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                // Handle bulk edit logic here
                // Update selected users with new values
                const updatedUsers = users.map(user => {
                  if (selectedUsers.includes(user.id)) {
                    // Apply bulk changes to selected users
                    return { ...user };
                  }
                  return user;
                });
                setUsers(updatedUsers);
                setIsBulkEditOpen(false);
                setSelectedUsers([]);
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Apply Changes ({selectedUsers.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamSetup;
