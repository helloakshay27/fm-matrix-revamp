import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Eye, Loader2, Search } from "lucide-react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { useDebounce } from "@/hooks/useDebounce";

const fieldStyles = {
  height: "45px",
  "& .MuiInputBase-root": {
    height: "45px",
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
  },
  "& .MuiSelect-select": {
    padding: "12px 14px",
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

interface AdminUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  mobile: string;
  country_code: string;
  user_organization_name?: string;
  user_company_name?: string;
  site_name?: string;
  user_type: string;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface UsersApiResponse {
  users: AdminUser[];
  pagination?: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}

// Column configuration
const columns: ColumnConfig[] = [
  {
    key: "actions",
    label: "Action",
    sortable: false,
    hideable: false,
    draggable: false,
  },
  {
    key: "fullname",
    label: "Name",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "mobile",
    label: "Mobile",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "user_organization_name",
    label: "Organization",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  // {
  //   key: "user_company_name",
  //   label: "Company",
  //   sortable: true,
  //   hideable: true,
  //   draggable: true,
  // },
  // {
  //   key: "site_name",
  //   label: "Site",
  //   sortable: true,
  //   hideable: true,
  //   draggable: true,
  // },
  {
    key: "user_type",
    label: "User Type",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "created_at",
    label: "Created At",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

export const AdminUsersDashboard = () => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchUsers(currentPage, perPage, debouncedSearchQuery);
  }, [currentPage, perPage, debouncedSearchQuery, statusFilter]);

  const fetchUsers = async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: limit.toString(),
        ...(search && { search }),
        ...(statusFilter !== "all" && {
          "q[active_eq]": statusFilter === "active" ? "true" : "false",
        }),
      });

      const url = getFullUrl(
        `/pms/users/organization_admin_users.json?${queryParams}`
      );
      console.log("Fetching users from:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data: UsersApiResponse = await response.json();
        console.log("API Response:", data);
        console.log("Users array:", data.users);
        console.log("Users length:", data.users?.length);

        setUsers(data.users || []);

        if (data.pagination) {
          setTotalCount(data.pagination.total_count);
          setTotalPages(data.pagination.total_pages);
        } else {
          setTotalCount(data.users?.length || 0);
          setTotalPages(1);
        }
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        toast.error("Failed to load users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (
    userId: number,
    currentStatus: boolean | null
  ) => {
    try {
      const newStatus = !currentStatus;
      const response = await fetch(getFullUrl(`/pms/users/${userId}.json`), {
        method: "PUT",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            active: newStatus,
          },
        }),
      });

      if (response.ok) {
        toast.success(
          `User ${newStatus ? "activated" : "deactivated"} successfully`
        );
        fetchUsers(currentPage, perPage, debouncedSearchQuery);
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Error updating user status");
    }
  };

  const handleViewUser = (userId: number) => {
    navigate(`/ops-console/admin/users/${userId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserTypeLabel = (userType: string) => {
    const labels: { [key: string]: string } = {
      pms_organization_admin: "Organization Admin",
      pms_company_admin: "Company Admin",
      pms_site_admin: "Site Admin",
      pms_admin: "Admin",
      pms_guest: "Guest",
      super_admin: "Super Admin",
    };
    return labels[userType] || userType;
  };

  const renderRow = (user: AdminUser) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleViewUser(user.id)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-[#C72030]" />
        </button>
      </div>
    ),
    fullname: user.fullname || `${user.firstname} ${user.lastname}`,
    email: (
      <a
        href={`mailto:${user.email}`}
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {user.email}
      </a>
    ),
    mobile: `+${user.country_code} ${user.mobile}`,
    user_organization_name: user.organization_list || "-",
    user_company_name: user.user_company_name || "-",
    site_name: user.site_name || "-",
    user_type: (
      <span className="text-sm text-gray-700">
        {getUserTypeLabel(user.user_type)}
      </span>
    ),
    status: (
      <div className="flex items-center gap-2">
        <Switch
          checked={user.active === true}
          onCheckedChange={() => handleToggleUserStatus(user.id, user.active)}
          className="data-[state=checked]:bg-[#C72030]"
        />
        <span
          className={`text-sm ${
            user.active === true
              ? "text-green-600"
              : user.active === false
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {user.active === true
            ? "Active"
            : user.active === false
              ? "Inactive"
              : "Pending"}
        </span>
      </div>
    ),
    created_at: formatDate(user.created_at),
  });

  console.log("Users state:", users);
  console.log("Users length:", users.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Admin Users</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage organization admin users and their permissions
          </p>
        </div>
        <Button
          onClick={() => navigate("/ops-console/admin/create-admin-user")}
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Admin User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <TextField
            placeholder="Search by name, email, phone, organization, company, or site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: fieldStyles,
              startAdornment: <Search className="text-gray-400 w-4 h-4 mr-2" />,
            }}
          />
        </div>
        <div className="flex gap-4">
          <FormControl variant="outlined" style={{ minWidth: 160 }}>
            <InputLabel shrink>Status Filter</InputLabel>
            <MuiSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as string)}
              label="Status Filter"
              displayEmpty
              MenuProps={selectMenuProps}
              sx={fieldStyles}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900">
              No users found
            </h3>
            <p className="text-gray-500 mt-2">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating a new admin user."}
            </p>
          </div>
        ) : (
          <>
            <EnhancedTaskTable
              key={`users-table-${users.length}-${currentPage}`}
              columns={columns}
              data={users}
              renderRow={renderRow}
              getItemId={(user) => user.id.toString()}
              storageKey="admin-users-table"
              emptyMessage="No users found"
            />
            <div className="border-t p-4">
              <TicketPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                entriesPerPage={perPage.toString()}
                onEntriesPerPageChange={handlePerPageChange}
                totalCount={totalCount}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
