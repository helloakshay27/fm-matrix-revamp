import React, { useEffect, useState, useCallback } from "react";
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
import { Plus, Edit } from "lucide-react";
import { apiClient } from "@/utils/apiClient";
import { format } from "date-fns";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { AddDelegationModal } from "@/components/AddDelegationModal";

interface DelegationData {
  created_by_name: string;
  id: number;
  delegatee_id?: number;
  delegatee_name?: string;
  delegatee?: { id?: number; full_name?: string };
  site_id?: number;
  site_name?: string;
  site?: { id?: number; name?: string };
  delegation_for?: string | string[];
  starts_at?: string;
  ends_at?: string;
  reason?: string;
  created_by?: string;
  created_at?: string;
  delegator_name?: string;
}

const columns: ColumnConfig[] = [
  { key: "id", label: "Id", sortable: true, defaultVisible: true },
  {key: "delegator_name", label: "Delegator", sortable: true, defaultVisible: true },
  { key: "delegatee", label: "Delegatee", sortable: true, defaultVisible: true },
  { key: "site", label: "Site", sortable: true, defaultVisible: true },
  { key: "delegation_for", label: "Delegation For", sortable: true, defaultVisible: true },
  { key: "starts_at", label: "Starts At", sortable: true, defaultVisible: true },
  { key: "ends_at", label: "Ends At", sortable: true, defaultVisible: true },
  { key: "reason", label: "Reason", sortable: false, defaultVisible: true },
  { key: "created_by_name", label: "Created by", sortable: true, defaultVisible: true },
];

const delegationForLabels: Record<string, string> = {
  purchase_order_approval: "Purchase Order Approval",
};

const extractList = (data: unknown): DelegationData[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const key of ["delegations", "data", "result"]) {
      const candidate = (data as Record<string, unknown>)[key];
      if (Array.isArray(candidate)) return candidate as DelegationData[];
    }
  }
  return [];
};

const DelegationSetupPage = () => {
  const { shouldShow } = useDynamicPermissions();

  const [delegationData, setDelegationData] = useState<DelegationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDelegation, setSelectedDelegation] = useState<DelegationData | null>(null);

  const fetchDelegations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/delegations.json");
      setDelegationData(extractList(response.data));
    } catch (error) {
      console.error("Error fetching delegations:", error);
      setDelegationData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDelegations();
  }, [fetchDelegations]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const filteredData = delegationData.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const delegatee = String(item.delegatee_name || item.delegatee?.full_name || "").toLowerCase();
    const site = String(item.site_name || item.site?.name || "").toLowerCase();
    const reason = String(item.reason || "").toLowerCase();
    return (
      String(item.id ?? "").includes(q) ||
      delegatee.includes(q) ||
      site.includes(q) ||
      reason.includes(q)
    );
  });

  const renderCell = (item: DelegationData, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="font-medium">{item.id}</span>;
      case "delegatee":
        return item.delegatee_name || item.delegatee?.full_name || item.delegatee_id || "-";
      case 'delegator_name':
        return item.delegator_name || "-";
      case "site":
        return item.site_name || item.site?.name || item.site_id || "-";
      case "delegation_for": {
        const val = item.delegation_for;
        if (Array.isArray(val)) {
          const labels = val.map((v) => delegationForLabels[v] || v);
          return labels.join(", ") || "-";
        }
        return delegationForLabels[String(val) ?? ""] || String(val) || "-";
      }
      case "starts_at":
        return formatDate(item.starts_at);
      case "ends_at":
        return formatDate(item.ends_at);
      case "reason":
        return item.reason || "-";
      case "created_by_name":
        return item.created_by_name || "-";
      default:
        return "-";
    }
  };

  const leftActions = shouldShow("Delegation", "create") ? (
    <Button
      onClick={() => setIsAddModalOpen(true)}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  ) : null;

  const renderActions = (item: DelegationData) => {
    return (
      <div className="flex items-center">
        {shouldShow("Delegation", "edit") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedDelegation(item);
              setIsAddModalOpen(true);
            }}
            className="h-8 w-8 p-0"
            title="Edit delegation"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </Button>
        )}
      </div>
    );
  };

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
            <BreadcrumbPage className="text-brand">Delegation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Heading level="h1" className="text-[#1a1a1a]">
        DELEGATION SETUP
      </Heading>

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="delegation-setup-table"
        emptyMessage={searchTerm ? "No delegations found matching your search" : "No delegations found"}
        loading={loading}
        loadingMessage="Loading delegations..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        disableClientSearch
        hideTableExport
        pagination
        pageSize={10}
        getItemId={(item) => String(item.id)}
      />

      {
        (() => {
          const del = selectedDelegation
            ? {
                id: selectedDelegation.id,
                delegator_id:
                  // prefer explicit delegator_id if present, otherwise try common fallback keys
                  (selectedDelegation as any).delegator_id ?? (selectedDelegation as any).created_by ?? undefined,
                delegatee_id: selectedDelegation.delegatee_id ?? selectedDelegation.delegatee?.id,
                site_id: selectedDelegation.site_id ?? selectedDelegation.site?.id,
                delegation_for: Array.isArray(selectedDelegation.delegation_for)
                  ? selectedDelegation.delegation_for
                  : selectedDelegation.delegation_for
                  ? [String(selectedDelegation.delegation_for)]
                  : [],
                starts_at: selectedDelegation.starts_at,
                ends_at: selectedDelegation.ends_at,
                reason: selectedDelegation.reason,
              }
            : null;
          return (
            <AddDelegationModal
              isOpen={isAddModalOpen}
              onClose={() => {
                setIsAddModalOpen(false);
                setSelectedDelegation(null);
              }}
              onCreated={() => {
                fetchDelegations();
                setIsAddModalOpen(false);
                setSelectedDelegation(null);
              }}
              delegation={del}
            />
          );
        })()
      }
    </div>
  );
};

export default DelegationSetupPage;
