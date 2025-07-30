import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchFMUsers, FMUser } from "@/store/slices/fmUserSlice";
import { fetchUserCounts } from "@/store/slices/userCountsSlice";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Upload,
  Download,
  Filter,
  Eye,
  Search,
  Users,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TextField, Box } from "@mui/material";
import { ImportFmUsers } from "@/components/ImportFmUsers";
import axios from "axios";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";

// Transform API data to table format
const transformFMUserData = (apiUser: FMUser) => ({
  id: apiUser.id.toString(),
  userName: `${apiUser.firstname} ${apiUser.lastname}`,
  gender: apiUser.gender,
  mobile: apiUser.mobile,
  email: apiUser.email,
  vendorCompany: apiUser.vendor_name,
  entityName: apiUser.entity_name,
  unit: apiUser.unit_name,
  role: apiUser.lock_user_permission?.role_for,
  employeeId: apiUser.lock_user_permission?.employee_id,
  createdBy: apiUser.created_by_name,
  accessLevel: apiUser.lock_user_permission?.access_level,
  type: apiUser.user_type
    ? apiUser.user_type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    : "",
  status: apiUser?.lock_user_permission?.status,
  faceRecognition: apiUser.face_added,
  appDownloaded: apiUser.app_downloaded === "Yes",
  active: apiUser.lock_user_permission?.active,
  lockUserId: apiUser.lock_user_permission?.id
});

export const FMUserMasterDashboard = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: fmUsersResponse,
    loading,
    error,
  } = useSelector((state: RootState) => state.fmUsers);
  const { data: userCounts, loading: countsLoading } = useSelector(
    (state: RootState) => state.userCounts
  );
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [cloneRoleDialogOpen, setCloneRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeTab, setActiveTab] = useState("handover");
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showImportModal, setShowImportModal] = useState(false);
  const pageSize = 10;
  const [filters, setFilters] = useState({
    name: "",
    email: "",
  });

  // Transform API data to table format
  const [fmUsersData, setFmUsersData] = useState<any[]>([]);
  const [filteredFMUsersData, setFilteredFMUsersData] = useState<any[]>([]);

  useEffect(() => {
    if (fmUsersResponse?.fm_users) {
      const transformedData = fmUsersResponse.fm_users.map(transformFMUserData);
      setFmUsersData(transformedData);
      setFilteredFMUsersData(transformedData);
    }
  }, [fmUsersResponse]);

  useEffect(() => {
    setCurrentSection("Master");
    dispatch(fetchFMUsers());
    dispatch(fetchUserCounts());
  }, [setCurrentSection, dispatch]);

  // Define columns for EnhancedTable
  const columns: ColumnConfig[] = [
    { key: "active", label: "Active", sortable: true, draggable: true },
    { key: "id", label: "ID", sortable: true, draggable: true },
    { key: "userName", label: "User Name", sortable: true, draggable: true },
    { key: "gender", label: "Gender", sortable: true, draggable: true },
    { key: "mobile", label: "Mobile Number", sortable: true, draggable: true },
    { key: "email", label: "Email", sortable: true, draggable: true },
    {
      key: "vendorCompany",
      label: "Vendor Company Name",
      sortable: true,
      draggable: true,
    },
    {
      key: "entityName",
      label: "Entity Name",
      sortable: true,
      draggable: true,
    },
    { key: "unit", label: "Unit", sortable: true, draggable: true },
    { key: "role", label: "Role", sortable: true, draggable: true },
    {
      key: "employeeId",
      label: "Employee ID",
      sortable: true,
      draggable: true,
    },
    { key: "createdBy", label: "Created By", sortable: true, draggable: true },
    {
      key: "accessLevel",
      label: "Access Level",
      sortable: true,
      draggable: true,
    },
    { key: "type", label: "Type", sortable: true, draggable: true },
    { key: "status", label: "Status", sortable: true, draggable: true },
    {
      key: "faceRecognition",
      label: "Face Recognition",
      sortable: true,
      draggable: true,
    },
    {
      key: "appDownloaded",
      label: "App Downloaded",
      sortable: true,
      draggable: true,
    },
  ];

  // Use API data for stats if available, otherwise fallback to calculated values
  const totalUsers = userCounts?.total_users ?? fmUsersData.length;
  const approvedUsers =
    userCounts?.approved ?? fmUsersData.filter((user) => user.active).length;
  const pendingUsers = userCounts?.pending ?? 0;
  const rejectedUsers =
    userCounts?.rejected ?? fmUsersData.filter((user) => !user.active).length;
  const appDownloaded =
    userCounts?.app_downloaded_count ??
    fmUsersData.filter((user) => user.appDownloaded).length;

  const handleAddUser = () => {
    navigate("/master/user/fm-users/add");
  };

  const handleEditUser = (id: string) => {
    navigate(`/master/user/fm-users/edit/${id}`);
  };

  const handleViewUser = (id: string) => {
    navigate(`/master/user/fm-users/view/${id}`);
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      // Make PUT request to update user status
      const response = await fetch(
        `https://${baseUrl}/pms/users/status_update.jsong?id=${userId}&active=${isActive}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is in scope
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local UI state
      setFmUsersData((prevUsers) =>
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
      setFilteredFMUsersData((prevUsers) =>
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

      toast({
        title: "Status Updated",
        description: `User ${isActive ? "activated" : "deactivated"} successfully!`,
      });
    } catch (error) {
      console.error("Status toggle failed:", error);

      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleStatusClick = (user: any) => {
    setSelectedUser(user);
    setSelectedStatus(user.status);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      // Call the PUT API to update the user status
      const response = await fetch(
        `https://${baseUrl}/pms/users/status_update?id=${selectedUser?.lockUserId}&status=${selectedStatus}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // make sure token is defined
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      toast({
        title: "Status Updated",
        description: `User status updated to ${selectedStatus} successfully!`,
      });

      setStatusDialogOpen(false);
      setSelectedUser(null);
      setSelectedStatus("");

      dispatch(fetchFMUsers());
    } catch (error) {
      console.error("Error updating user status:", error);

      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportUser = async () => {
    try {
      const response = await axios.get(
        `https://${localStorage.getItem(
          "baseUrl"
        )}/pms/account_setups/export_users.json`,
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
      link.setAttribute("download", "fm_users.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = async () => {
    try {
      const [firstName, lastName = ""] = filters.name.trim().split(" ");
      const newFilterParams = {
        "q[firstname_cont]": firstName,
        "q[lastname_cont]": lastName,
        "q[email_cont]": filters.email,
      };

      const queryString = new URLSearchParams(newFilterParams).toString();
      const response = await axios.get(
        `https://${localStorage.getItem(
          "baseUrl"
        )}/pms/account_setups/fm_users.json?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const transformedFilteredData =
        response.data.fm_users.map(transformFMUserData);
      setFilteredFMUsersData(transformedFilteredData);
      setCurrentPage(1);
      setFilterDialogOpen(false);

      toast({
        title: "Filters Applied",
        description: "Users filtered successfully!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeProps = (status: string) => {
    if (status === "active" || status === "approved") {
      return {
        className: "bg-green-600 text-white hover:bg-green-700 cursor-pointer",
        children: "Approved",
      };
    } else if (status === "pending") {
      return {
        className:
          "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer",
        children: "Pending",
      };
    } else {
      return {
        className: "bg-red-600 text-white hover:bg-red-700 cursor-pointer",
        children: "Rejected",
      };
    }
  };

  const handleApplyFilters = () => {
    handleFilter();
  };

  const handleCloneRoleSubmit = async () => {
    try {
      if (activeTab === "handover") {
        toast({
          title: "Handover Successful",
          description: `Role handover from ${fromUser} to ${toUser} completed successfully!`,
        });
      } else {
        toast({
          title: "Clone Successful",
          description: `Role cloned to ${toUser} successfully!`,
        });
      }

      setCloneRoleDialogOpen(false);
      setFromUser("");
      setToUser("");
      setActiveTab("handover");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      email: "",
    });
    setFilteredFMUsersData(fmUsersData);
    setCurrentPage(1);
    setFilterDialogOpen(false);
    toast({
      title: "Filters Reset",
      description: "Filters have been reset successfully!",
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Render actions for each row
  const renderActions = (user: any) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleViewUser(user.id)}
      className="hover:bg-gray-100"
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  // Render custom cells for specific columns
  const renderCell = (user: any, columnKey: string) => {
    switch (columnKey) {
      case "active":
        return (
          <Switch
            checked={user.active}
            onCheckedChange={(checked) =>
              handleToggleUserStatus(user.lockUserId, checked)
            }
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
        );
      case "type":
        return (
          <Badge variant={user.type === "Internal" ? "default" : "secondary"}>
            {user.type}
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
          <Badge variant={user.faceRecognition ? "default" : "secondary"}>
            {user.faceRecognition ? "Yes" : "No"}
          </Badge>
        );
      case "appDownloaded":
        return (
          <Badge variant={user.appDownloaded ? "default" : "secondary"}>
            {user.appDownloaded ? "Yes" : "No"}
          </Badge>
        );
      default:
        return user[columnKey];
    }
  };

  // Left actions for the table
  const leftActions = (
    <>
      <Button
        onClick={handleAddUser}
        className="bg-[#C72030] hover:bg-[#a91b29] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add FM User
      </Button>
      <Button
        variant="outline"
        className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
        onClick={() => setShowImportModal(true)}
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
      <Button
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={() => setCloneRoleDialogOpen(true)}
      >
        Clone Role
      </Button>
    </>
  );

  if (error) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">
          FM User Master
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Approved Users"
          value={approvedUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Pending Users"
          value={pendingUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Rejected Users"
          value={rejectedUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="App Downloaded"
          value={appDownloaded}
          icon={<Download className="w-6 h-6" />}
        />
      </div>

      <EnhancedTable
        data={filteredFMUsersData}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        storageKey="fm-user-master-table"
        pagination={true}
        pageSize={pageSize}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users..."
        enableExport={true}
        exportFileName="fm_users"
        handleExport={handleExportUser}
        onFilterClick={() => setFilterDialogOpen(true)}
        leftActions={leftActions}
        loading={loading}
        selectable={false}
      />

      <ImportFmUsers
        open={showImportModal}
        onOpenChange={setShowImportModal}
        title="Bulk Upload"
        context="custom_forms"
      />

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Filter
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6">
            <Box className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  placeholder="Enter Name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  placeholder="Enter Email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            </Box>
          </div>

          <div className="flex justify-end gap-3 p-6 pt-0 border-t mt-4">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="bg-[#f6f4ee] text-[#C72030] hover:bg-[#ede9e0] border-[#C72030] px-6 py-2 text-sm font-medium rounded-lg mt-4"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-[#f6f4ee] text-[#C72030] hover:bg-[#ede9e0] border-none px-6 py-2 text-sm font-medium rounded-lg mt-4"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 bg-white">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Update
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full bg-white" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem
                  value="Select Status"
                  disabled
                  className="text-gray-400"
                >
                  Select Status
                </SelectItem>
                <SelectItem value="approved" className="hover:bg-blue-50">
                  Approved
                </SelectItem>
                <SelectItem value="rejected" className="hover:bg-blue-50">
                  Rejected
                </SelectItem>
                <SelectItem value="pending" className="hover:bg-blue-50">
                  Pending
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-center pt-4">
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

      <Dialog open={cloneRoleDialogOpen} onOpenChange={setCloneRoleDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 bg-white">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Clone Role
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCloneRoleDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="handover"
                  className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
                >
                  Handover To
                </TabsTrigger>
                <TabsTrigger
                  value="clone"
                  className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
                >
                  Clone To
                </TabsTrigger>
              </TabsList>

              <TabsContent value="handover" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    From User
                  </label>
                  <Select value={fromUser} onValueChange={setFromUser}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      {fmUsersData.length > 0 ? (
                        fmUsersData.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.userName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled className="text-gray-400">
                          No users available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    To User
                  </label>
                  <Select value={toUser} onValueChange={setToUser}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      {fmUsersData.length > 0 ? (
                        fmUsersData.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.userName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled className="text-gray-400">
                          No users available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="clone" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    To User
                  </label>
                  <Select value={toUser} onValueChange={setToUser}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      {fmUsersData.length > 0 ? (
                        fmUsersData.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.userName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled className="text-gray-400">
                          No users available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleCloneRoleSubmit}
                className="bg-[#C72030] hover:bg-[#a91b29] text-white px-8 py-2 rounded-md"
                disabled={!toUser || (activeTab === "handover" && !fromUser)}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
