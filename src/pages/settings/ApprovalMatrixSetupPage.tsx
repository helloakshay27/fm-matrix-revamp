import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Edit, Plus } from "lucide-react";
import { apiClient } from "@/utils/apiClient";
import { format } from "date-fns";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  ApprovalMatrixFilterDialog,
  type ApprovalMatrixFilters,
} from "@/components/ApprovalMatrixFilterDialog";

interface ApprovalData {
  id: number;
  approval_function_name: string;
  created_at: string;
  created_by: string;
}

const columns: ColumnConfig[] = [
  { key: "id", label: "Id", sortable: true, defaultVisible: true },
  {
    key: "approval_function_name",
    label: "Function",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "created_at",
    label: "Created On",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "created_by",
    label: "Created by",
    sortable: true,
    defaultVisible: true,
  },
];

const emptyFilters: ApprovalMatrixFilters = {
  functionName: "",
  createdBy: "",
  id: "",
};

const ApprovalMatrixSetupPage = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();

  const [approvalData, setApprovalData] = useState<ApprovalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ApprovalMatrixFilters>(emptyFilters);

  useEffect(() => {
    // The API paginates server-side (see `pagination.total_pages` in the
    // response) — a single unparameterized request only returns page 1, so
    // every page is fetched and concatenated here to keep the existing
    // client-side search/filter/pagination below working over the full list.
    const extractList = (data: unknown): ApprovalData[] => {
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") {
        for (const key of ["invoice_approvals", "approvals", "data", "result"]) {
          const candidate = (data as Record<string, unknown>)[key];
          if (Array.isArray(candidate)) return candidate as ApprovalData[];
        }
      }
      return [];
    };

    const extractTotalPages = (data: unknown): number => {
      if (!data || typeof data !== "object") return 1;
      const pagination = (data as Record<string, unknown>).pagination;
      if (!pagination || typeof pagination !== "object") return 1;
      const totalPages = (pagination as Record<string, unknown>).total_pages;
      return typeof totalPages === "number" && totalPages > 0 ? totalPages : 1;
    };

    const fetchApprovalData = async () => {
      try {
        setLoading(true);

        const firstPage = await apiClient.get(
          "/pms/admin/invoice_approvals.json?page=1"
        );
        const allRows = extractList(firstPage.data);
        const totalPages = extractTotalPages(firstPage.data);

        for (let page = 2; page <= totalPages; page++) {
          const response = await apiClient.get(
            `/pms/admin/invoice_approvals.json?page=${page}`
          );
          allRows.push(...extractList(response.data));
        }

        setApprovalData(allRows);
      } catch (error) {
        console.error("Error fetching approval data:", error);
        setApprovalData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const filteredData = useMemo(() => {
    return approvalData.filter((item) => {
      const id = String(item.id ?? "");
      const functionName = String(item.approval_function_name || "").toLowerCase();
      const createdBy = String(item.created_by || "").toLowerCase();
      const createdAt = formatDate(item.created_at).toLowerCase();

      if (filters.id && !id.includes(filters.id.trim())) {
        return false;
      }
      if (
        filters.functionName &&
        !functionName.includes(filters.functionName.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.createdBy &&
        !createdBy.includes(filters.createdBy.toLowerCase())
      ) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          id.includes(q) ||
          functionName.includes(q) ||
          createdBy.includes(q) ||
          createdAt.includes(q)
        );
      }

      return true;
    });
  }, [approvalData, filters, searchTerm]);

  const handleApplyFilters = (nextFilters: ApprovalMatrixFilters) => {
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setFilters(emptyFilters);
  };

  const renderActions = (item: ApprovalData) => (
    <div className="flex items-center justify-center gap-1">
      {shouldShow("Approval Matrix", "update") && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          title="Edit"
          onClick={() =>
            navigate(`/settings/approval-matrix/setup/edit/${item.id}`)
          }
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const renderCell = (item: ApprovalData, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="font-medium">{item.id}</span>;
      case "approval_function_name":
        return item.approval_function_name || "-";
      case "created_at":
        return formatDate(item.created_at);
      case "created_by":
        return item.created_by || "-";
      default:
        return "-";
    }
  };

  const leftActions = shouldShow("Approval Matrix", "create") ? (
    <Button
      onClick={() => navigate("/settings/approval-matrix/setup/add")}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  ) : null;

  return (
    <div className="p-6 sm:p-8 min-h-screen bg-transparent space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-[#1a1a1a]">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings" className="text-[#1a1a1a]">
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/settings/approval-matrix"
              className="text-[#1a1a1a]"
            >
              Approval Matrix
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-brand">Setup</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Heading level="h1" className="text-[#1a1a1a]">
        APPROVAL MATRIX SETUP
      </Heading>

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="approval-matrix-setup-table"
        emptyMessage={
          searchTerm || Object.values(filters).some(Boolean)
            ? "No approval matrices found matching your search"
            : "No approval matrices found"
        }
        loading={loading}
        loadingMessage="Loading approval matrices..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        disableClientSearch
        onFilterClick={() => setShowFilters(true)}
        hideTableExport
        pagination
        pageSize={10}
        getItemId={(item) => String(item.id)}
      />

      <ApprovalMatrixFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default ApprovalMatrixSetupPage;
