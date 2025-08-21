import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { FMUser, getFMUsers } from "@/store/slices/fmUserSlice";
import { fetchUserCounts } from "@/store/slices/userCountsSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  X,
  SlidersHorizontal,
} from "lucide-react";
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import debounce from "lodash/debounce";

const transformFMUserData = (apiUser: FMUser) => ({
  id: apiUser.id.toString(),
  userName: `${apiUser.firstname} ${apiUser.lastname}`,
  gender: apiUser.gender,
  mobile: apiUser.mobile,
  email: apiUser.email,
  vendorCompany: apiUser.vendor_name,
  entityName: apiUser.entity_name,
  unit: apiUser.unit_name,
  department: apiUser.department?.department_name,
  role: apiUser?.role_name,
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

const columns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true },
  { key: "userName", label: "User Name", sortable: true, draggable: true },
  { key: "gender", label: "Gender", sortable: true, draggable: true },
  { key: "mobile", label: "Mobile Number", sortable: true, draggable: true },
  { key: "email", label: "Email", sortable: true, draggable: true },
  { key: "unit", label: "Unit", sortable: true, draggable: true },
  { key: "department", label: "Department", sortable: true, draggable: true },
  { key: "role", label: "Role", sortable: true, draggable: true },
  { key: "active", label: "Active", sortable: true, draggable: true },
  {
    key: "employeeId",
    label: "Employee ID",
    sortable: true, draggable: true,
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

const CRMFMUserDashboard = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    error,
  } = useSelector((state: RootState) => state.getFMUsers);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [cloneRoleDialogOpen, setCloneRoleDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("handover");
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    email: "",
  });

  const [fmUsersData, setFmUsersData] = useState<any[]>([]);
  const [filteredFMUsersData, setFilteredFMUsersData] = useState<any[]>([]);
  const [cloneLoading, setCloneLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      try {
        if (searchQuery.trim() === "") {
          const response = await dispatch(getFMUsers({
            baseUrl,
            token,
            perPage: 10,
            currentPage: 1
          })).unwrap();
          const transformedData = response.fm_users.map(transformFMUserData);
          setFmUsersData(transformedData);
          setFilteredFMUsersData(transformedData);
          setPagination({
            current_page: response.current_page,
            total_count: response.total_count,
            total_pages: response.total_pages
          });
          return;
        }

        const response = await axios.get(
          `https://${baseUrl}/pms/account_setups/fm_users.json?q[search_all_fields_cont]=${searchQuery}&per_page=10&page=${pagination.current_page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transformedData = response.data.fm_users.map(transformFMUserData);
        setFilteredFMUsersData(transformedData);
        setPagination({
          current_page: response.data.current_page,
          total_count: response.data.total_count,
          total_pages: response.data.total_pages
        });
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to perform search.");
      }
    }, 500),
    [dispatch, baseUrl, token]
  );

  const fetchUsers = async () => {
    try {
      const response = await dispatch(getFMUsers({ baseUrl, token, perPage: 10, currentPage: pagination.current_page })).unwrap();
      const transformedData = response.fm_users.map(transformFMUserData);
      setFmUsersData(transformedData);
      setFilteredFMUsersData(transformedData);
      setPagination({
        current_page: response.current_page,
        total_count: response.total_count,
        total_pages: response.total_pages
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch, baseUrl, token]);

  useEffect(() => {
    setCurrentSection("Master");
    dispatch(fetchUserCounts());
  }, [setCurrentSection, dispatch]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleViewUser = (id: string) => {
    navigate(`/master/user/fm-users/view/${id}`);
  };

  const handleExportUser = async () => {
    try {
      const response = await axios.get(
        `https://${localStorage.getItem(
          "baseUrl"
        )}/pms/account_setups/export_users.xlsx`,
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
        )}/pms/account_setups/fm_users.json?${queryString}&per_page=10&page=${pagination.current_page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const transformedFilteredData =
        response.data.fm_users.map(transformFMUserData);
      setFilteredFMUsersData(transformedFilteredData);
      setPagination({
        current_page: 1,
        total_pages: response.data.total_pages,
        total_count: response.data.total_count,
      });
      setFilterDialogOpen(false);

      toast.success("Filters applied successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply filters.");
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
    } else if (status === "rejected") {
      return {
        className:
          "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer",
        children: "Rejected",
      };
    } else {
      return {
        className:
          "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer",
        children: "Pending",
      };
    }
  };

  const handleApplyFilters = () => {
    handleFilter();
  };

  const handleCloneRoleSubmit = async () => {
    setCloneLoading(true);
    try {
      const operationType = activeTab === "handover" ? "transfer" : "clone";
      const response = await axios.post(
        `https://${baseUrl}/pms/users/clone_user.json?clone_from_id=${fromUser}&clone_to_id=${toUser}&type=${operationType}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Failed to ${operationType} role`);
      }

      toast.success(`Role ${operationType} successful!`);
      setCloneRoleDialogOpen(false);
      setFromUser("");
      setToUser("");
      setActiveTab("handover");
    } catch (error) {
      console.error("Role operation failed:", error);
      toast.error(`Failed to ${activeTab === "handover" ? "transfer" : "clone"} role.`);
    } finally {
      setCloneLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      email: "",
    });
    setFilteredFMUsersData(fmUsersData);
    setPagination({
      ...pagination,
      current_page: 1
    });
    setFilterDialogOpen(false);

    toast.success("Filters reset successfully!");
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePageChange = async (page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    try {
      const response = await dispatch(getFMUsers({ baseUrl, token, perPage: 10, currentPage: page })).unwrap();
      const transformedData = response.fm_users.map(transformFMUserData);
      setFmUsersData(transformedData);
      setFilteredFMUsersData(transformedData);
    } catch (error) {
      toast.error('Failed to fetch bookings');
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
        <PaginationItem key={1} className='cursor-pointer'>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            disabled={loading}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1" >
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                disabled={loading}
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
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                disabled={loading}
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
              <PaginationItem key={i} className='cursor-pointer'>
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  disabled={loading}
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
          <PaginationItem key={totalPages} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              disabled={loading}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              disabled={loading}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

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

  const renderCell = (user: any, columnKey: string) => {
    switch (columnKey) {
      case "active":
        return (
          <span>
            {user.active ? "Yes" : "No"}
          </span>
        )
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

  const leftActions = (
    <>
      <Button
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={() => setCloneRoleDialogOpen(true)}
      >
        <SlidersHorizontal size={15} />
        Clone / Transfer
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
      <EnhancedTable
        data={filteredFMUsersData}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        storageKey="fm-user-master-table"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search users..."
        enableExport={true}
        exportFileName="fm_users"
        handleExport={handleExportUser}
        onFilterClick={() => setFilterDialogOpen(true)}
        leftActions={leftActions}
        loading={loading}
        selectable={false}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

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
              onValueChange={(value) => {
                setActiveTab(value);
                setFromUser("");
                setToUser("");
              }}
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
            </Tabs>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleCloneRoleSubmit}
                className="bg-[#C72030] hover:bg-[#a91b29] text-white px-8 py-2 rounded-md"
                disabled={!toUser || !fromUser || cloneLoading}
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

export default CRMFMUserDashboard;