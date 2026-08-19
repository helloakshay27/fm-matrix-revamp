import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  InvoiceApprovalsFilterDialog,
  type InvoiceApprovalsFilters,
} from "@/components/InvoiceApprovalsFilterDialog";

interface InvoiceApproval {
  id: number;
  approval_function_name: string;
  created_at: string;
  created_by: string;
  active: boolean;
}

const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return isoString;
  }
};

const StatusDropdown = ({
  id,
  active,
  onStatusChange,
}: {
  id: number;
  active: boolean;
  onStatusChange: (id: number, newActive: boolean) => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isActive = active !== false;

  const handleSelect = async (value: boolean) => {
    if (value === isActive) {
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(false);
    await onStatusChange(id, value);
    setLoading(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-200 ${
          isActive
            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
        } ${loading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isActive ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        {loading ? "Updating…" : isActive ? "Active" : "Inactive"}
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-36 rounded-lg shadow-lg bg-white border border-gray-200 py-1 left-0">
            <button
              onClick={() => handleSelect(true)}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isActive && (
                <Check className="w-3.5 h-3.5 mr-2 text-green-600" />
              )}
              {!isActive && <span className="w-3.5 h-3.5 mr-2" />}
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Active
              </span>
            </button>
            <button
              onClick={() => handleSelect(false)}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {!isActive && (
                <Check className="w-3.5 h-3.5 mr-2 text-gray-600" />
              )}
              {isActive && <span className="w-3.5 h-3.5 mr-2" />}
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Inactive
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

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
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
];

const emptyFilters: InvoiceApprovalsFilters = {
  id: "",
  functionName: "",
  createdBy: "",
  status: "",
};

export const InvoiceApprovalsPage = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const lockAccountId = localStorage.getItem("lock_account_id");
  const normalizedBaseUrl = baseUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const shouldPassLockAccountId =
    normalizedBaseUrl === "club-uat-api.lockated.com";

  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceApprovals, setInvoiceApprovals] = useState<InvoiceApproval[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] =
    useState<InvoiceApprovalsFilters>(emptyFilters);

  useEffect(() => {
    const fetchInvoiceApprovals = async () => {
      try {
        setLoading(true);
        const listUrl = shouldPassLockAccountId
          ? `/pms/admin/invoice_approvals.json?lock_account_id=${lockAccountId}`
          : "/pms/admin/invoice_approvals.json";
        const response = await apiClient.get(listUrl);
        const data = response.data;

        let approvals: InvoiceApproval[] = [];
        if (Array.isArray(data)) {
          approvals = data;
        } else if (data && Array.isArray(data.invoice_approvals)) {
          approvals = data.invoice_approvals;
        } else {
          console.error("Unexpected data format:", data);
        }

        setInvoiceApprovals(approvals);
      } catch (error) {
        console.error("Error fetching invoice approvals:", error);
        toast.error("Failed to load invoice approvals");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceApprovals();
  }, [lockAccountId, shouldPassLockAccountId]);

  const handleStatusChange = async (id: number, newActive: boolean) => {
    try {
      const url = shouldPassLockAccountId
        ? `/pms/admin/invoice_approvals/${id}.json?lock_account_id=${lockAccountId}`
        : `/pms/admin/invoice_approvals/${id}.json`;

      await apiClient.patch(url, {
        invoice_approval: { active: newActive },
      });

      setInvoiceApprovals((list) =>
        list.map((item) =>
          item.id === id ? { ...item, active: newActive } : item
        )
      );

      toast.success(`Status updated to ${newActive ? "Active" : "Inactive"}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredData = useMemo(() => {
    return invoiceApprovals.filter((item) => {
      const id = String(item.id ?? "");
      const functionName = String(
        item.approval_function_name || ""
      ).toLowerCase();
      const createdBy = String(item.created_by || "").toLowerCase();
      const createdAt = formatDate(item.created_at).toLowerCase();
      const status = item.active !== false ? "active" : "inactive";

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
      if (filters.status && status !== filters.status.toLowerCase()) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          id.includes(q) ||
          functionName.includes(q) ||
          createdBy.includes(q) ||
          createdAt.includes(q) ||
          status.includes(q)
        );
      }

      return true;
    });
  }, [invoiceApprovals, filters, searchTerm]);

  const renderActions = (item: InvoiceApproval) => (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-gray-100"
        title="Edit"
        onClick={() => navigate(`/settings/invoice-approvals/edit/${item.id}`)}
      >
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item: InvoiceApproval, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="font-medium">{item.id}</span>;
      case "approval_function_name":
        return item.approval_function_name || "-";
      case "created_at":
        return (
          <span className="text-gray-600">{formatDate(item.created_at)}</span>
        );
      case "created_by":
        return <span className="text-gray-600">{item.created_by || "-"}</span>;
      case "status":
        return (
          <StatusDropdown
            id={item.id}
            active={item.active}
            onStatusChange={handleStatusChange}
          />
        );
      default:
        return "-";
    }
  };

  const leftActions = (
    <Button
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
      onClick={() => navigate("/settings/invoice-approvals/add")}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="text-sm text-gray-600">
        Setup &gt; <span className="text-brand">Invoice Approvals</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">INVOICE APPROVALS</h1>

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="invoice-approvals-table"
        emptyMessage={
          searchTerm || Object.values(filters).some(Boolean)
            ? "No invoice approvals found matching your search"
            : "No invoice approvals found"
        }
        loading={loading}
        loadingMessage="Loading invoice approvals..."
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

      <InvoiceApprovalsFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters(emptyFilters)}
      />
    </div>
  );
};
