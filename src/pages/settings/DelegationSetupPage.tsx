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
import { Plus } from "lucide-react";
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
  delegation_for?: string;
  starts_at?: string;
  ends_at?: string;
  reason?: string;
  created_by?: string;
  created_at?: string;
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
      case "delegation_for":
        return delegationForLabels[item.delegation_for ?? ""] || item.delegation_for || "-";
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

      <AddDelegationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={fetchDelegations}
      />
    </div>
  );
};

export default DelegationSetupPage;
