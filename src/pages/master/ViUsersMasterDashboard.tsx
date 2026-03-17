import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";
import { useDispatch } from "react-redux";
import moment from "moment";
import { AppDispatch, RootState } from "@/store/store";
import { fetchViUsers, ViUser } from "@/store/slices/viUsersSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, Eye, Edit, Search } from "lucide-react";
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
import { useAppSelector } from "@/store/hooks";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import axios from "axios";

const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, draggable: true },
    { key: "active", label: "Active", sortable: true, draggable: true },
    { key: "name", label: "User Name", sortable: true, draggable: true },
    { key: "email", label: "Email", sortable: true, draggable: true },
    { key: "mobile", label: "Mobile", sortable: true, draggable: true },
    { key: "gender", label: "Gender", sortable: true, draggable: true },
    { key: "employeeType", label: "Employee Type", sortable: true, draggable: true },
    { key: "departmentName", label: "Department", sortable: true, draggable: true },
    { key: "roleName", label: "Role", sortable: true, draggable: true },
    { key: "circleName", label: "Circle", sortable: true, draggable: true },
    { key: "siteName", label: "Site", sortable: true, draggable: true },
    { key: "clusterName", label: "Cluster", sortable: true, draggable: true },
    { key: "designation", label: "Designation", sortable: true, draggable: true },
    { key: "workLocation", label: "Work Location", sortable: true, draggable: true },
    { key: "webEnabled", label: "Web Enabled", sortable: true, draggable: true },
    { key: "status", label: "Status", sortable: true, draggable: true },
    { key: "registrationSource", label: "Registration Source", sortable: true, draggable: true },
    { key: "joiningDate", label: "Joining Date", sortable: true, draggable: true },
    { key: "createdAt", label: "Created At", sortable: true, draggable: true },
];

export const ViUsersMasterDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { setCurrentSection } = useLayout();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [webEnabledFilter, setWebEnabledFilter] = useState<boolean>(true);

    const { users, pagination, loading } = useAppSelector(
        (state: RootState) => state.viUsers
    );

    const [localPagination, setLocalPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
    });

    useEffect(() => {
        if (pagination) {
            setLocalPagination(pagination);
        }
    }, [pagination]);

    const fetchUsers = useCallback(
        (page = 1, search = "", webEnabled = true) => {
            dispatch(
                fetchViUsers({
                    page,
                    perPage: 10,
                    employee_type_cont: "internal",
                    web_enabled_eq: webEnabled,
                    search,
                })
            );
        },
        [dispatch]
    );

    useEffect(() => {
        setCurrentSection("Master");
        fetchUsers(1, "", webEnabledFilter);
    }, [setCurrentSection, fetchUsers, webEnabledFilter]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((searchQuery: string, webEnabled: boolean) => {
            fetchUsers(1, searchQuery, webEnabled);
        }, 500),
        [fetchUsers]
    );

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        debouncedSearch(value, webEnabledFilter);
    };

    const handleWebEnabledFilterChange = (checked: boolean) => {
        setWebEnabledFilter(checked);
        fetchUsers(1, searchTerm, checked);
    };

    const handlePageChange = async (page: number) => {
        setLocalPagination((prev) => ({
            ...prev,
            current_page: page,
        }));
        fetchUsers(page, searchTerm, webEnabledFilter);
    };

    // Status update functionality
    const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        if (!baseUrl || !token) {
            toast.error("Missing authentication credentials");
            return;
        }

        try {
            await axios.put(
                `https://${baseUrl}/pms/users/status_update.json?id=${userId}&active=${isActive}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("User status updated successfully!");
            fetchUsers(localPagination.current_page, searchTerm, webEnabledFilter);
        } catch (error: unknown) {
            console.error("Status toggle failed:", error);
            toast.error("Failed to update user status.");
        }
    };

    const getStatusBadgeProps = (status: string | null) => {
        if (status === "approved" || status === "active") {
            return {
                className: "bg-green-600 text-white hover:bg-green-700",
                children: "Approved",
            };
        } else if (status === "pending") {
            return {
                className: "bg-yellow-500 text-white hover:bg-yellow-600",
                children: "Pending",
            };
        } else if (status === "rejected") {
            return {
                className: "bg-red-500 text-white hover:bg-red-600",
                children: "Rejected",
            };
        } else {
            return {
                className: "bg-gray-500 text-white hover:bg-gray-600",
                children: status || "Unknown",
            };
        }
    };

    const renderCell = (user: ViUser, columnKey: string): React.ReactNode => {
        switch (columnKey) {
            case "active":
                return (
                    <Switch
                        checked={user.active}
                        onCheckedChange={(checked) =>
                            handleToggleUserStatus(user.id, checked)
                        }
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                );
            case "status":
                return <Badge {...getStatusBadgeProps(user.status)} />;
            case "webEnabled":
                return (
                    <Badge variant={user.webEnabled ? "default" : "secondary"}>
                        {user.webEnabled ? "Yes" : "No"}
                    </Badge>
                );
            case "joiningDate":
                return user.joiningDate
                    ? moment(user.joiningDate).format("DD/MM/YYYY")
                    : "-";
            case "createdAt":
                return user.createdAt
                    ? moment(user.createdAt).format("DD/MM/YYYY HH:mm")
                    : "-";
            case "mobile":
                return user.mobile || "-";
            case "gender":
                return user.gender || "-";
            case "designation":
                return user.designation || "-";
            default: {
                const value = user[columnKey as keyof ViUser];
                if (typeof value === "object" && value !== null) {
                    return "-";
                }
                return String(value) || "-";
            }
        }
    };

    const renderPaginationItems = () => {
        if (!localPagination.total_pages || localPagination.total_pages <= 0) {
            return null;
        }
        const items = [];
        const totalPages = localPagination.total_pages;
        const currentPage = localPagination.current_page;
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

    return (
        <div className="w-full p-4 sm:p-6 space-y-6">
            <div className="w-full space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-[#C72030]" />
                        <h1 className="text-2xl font-semibold text-gray-800">FTE Users</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="webEnabledFilter"
                                checked={webEnabledFilter}
                                onCheckedChange={handleWebEnabledFilterChange}
                                className="data-[state=checked]:bg-[#C72030]"
                            />
                            <Label htmlFor="webEnabledFilter" className="text-sm text-gray-600 cursor-pointer">
                                Web Enabled Only
                            </Label>
                        </div>
                        <div className="text-sm text-gray-500">
                            Total: {localPagination.total_count || 0} users
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <EnhancedTable
                        data={users}
                        columns={columns}
                        renderCell={renderCell}
                        renderActions={(item: ViUser) => (
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/master/user/vi-users/view/${item.id}`);
                                    }}
                                    title="View"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/master/user/vi-users/edit/${item.id}`);
                                    }}
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        storageKey="vi-users-master-table"
                        searchPlaceholder="Search by name, email or mobile..."
                        loading={loading}
                    />
                </div>

                <div className="flex justify-center mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        handlePageChange(Math.max(1, localPagination.current_page - 1))
                                    }
                                    className={
                                        localPagination.current_page === 1 || loading
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
                                                localPagination.total_pages,
                                                localPagination.current_page + 1
                                            )
                                        )
                                    }
                                    className={
                                        localPagination.current_page === localPagination.total_pages ||
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
        </div>
    );
};
