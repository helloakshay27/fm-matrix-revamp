import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useSocietyGatesQuery } from "../hooks/useSocietyGatesQuery";
import { useUpdateSocietyGateMutation } from "../hooks/useUpdateSocietyGateMutation";
import type { SocietyGateApiItem } from "../types/societyGate";

interface SmartsecureGate {
  id: string;
  gateId: number;
  society: string;
  tower: string;
  gateName: string;
  gateDevice: string;
  userName: string;
  status: boolean;
  active: boolean;
  createdBy: string;
}

const mapToRow = (item: SocietyGateApiItem): SmartsecureGate => ({
  id: String(item.id),
  gateId: item.id,
  // society.name is frequently null in practice — the resource (site) name
  // is the more reliable fallback.
  society: item.society?.name || item.resource?.name || "N/A",
  tower: item.building?.name || "N/A",
  gateName: item.gate_name || "N/A",
  gateDevice: item.gate_device || "N/A",
  userName: item.user?.name || "N/A",
  status: item.approve === 1,
  active: item.active === 1,
  createdBy: item.created_by?.name || "N/A",
});

const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, draggable: false, defaultVisible: true, hideable: false },
  { key: "gateId", label: "ID", sortable: true, draggable: true, defaultVisible: true },
  { key: "society", label: "Society", sortable: true, draggable: true, defaultVisible: true },
  { key: "tower", label: "Tower", sortable: true, draggable: true, defaultVisible: true },
  { key: "gateName", label: "Gate Name", sortable: true, draggable: true, defaultVisible: true },
  { key: "gateDevice", label: "Gate Device", sortable: true, draggable: true, defaultVisible: true },
  { key: "userName", label: "User Name", sortable: true, draggable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: false, draggable: true, defaultVisible: true },
  { key: "active", label: "Active", sortable: true, draggable: true, defaultVisible: true },
  { key: "createdBy", label: "Created By", sortable: true, draggable: true, defaultVisible: true },
];

export const SmartsecureIntegrationTab = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useSocietyGatesQuery(currentPage);
  const [searchTerm, setSearchTerm] = useState("");

  // Optimistic override while the update request for a toggle is in
  // flight — reverted if the request fails.
  const [statusOverrides, setStatusOverrides] = useState<Record<string, boolean>>({});
  const updateGateMutation = useUpdateSocietyGateMutation();

  const gates = useMemo(
    () =>
      (data?.quikgate_society_gates ?? []).map((item) => {
        const row = mapToRow(item);
        return statusOverrides[row.id] === undefined
          ? row
          : { ...row, status: statusOverrides[row.id] };
      }),
    [data, statusOverrides]
  );

  // Edit needs the raw record (resource_id/building_id/user_id) — there's
  // no confirmed single-gate GET endpoint, so it's passed via router state
  // from the data this list already has.
  const rawGatesById = useMemo(() => {
    const map = new Map<number, SocietyGateApiItem>();
    (data?.quikgate_society_gates ?? []).forEach((item) => map.set(item.id, item));
    return map;
  }, [data]);

  const totalPages = data?.quikgate_pagination.total_pages ?? 1;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const windowStart = Math.max(2, currentPage - 1);
    const windowEnd = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);
    if (windowStart > 2) pages.push("ellipsis");
    for (let page = windowStart; page <= windowEnd; page++) pages.push(page);
    if (windowEnd < totalPages - 1) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handleAdd = () => {
    navigate("/ops-console/settings/gate-integration/add");
  };

  const handleEdit = (gate: SmartsecureGate) => {
    const rawGate = rawGatesById.get(gate.gateId);
    if (!rawGate) {
      toast.error("Unable to load gate details. Please refresh and try again.");
      return;
    }
    navigate(`/ops-console/settings/gate-integration/edit/${gate.gateId}`, {
      state: { gate: rawGate },
    });
  };

  const handleStatusToggle = (id: string, checked: boolean) => {
    const rawGate = rawGatesById.get(Number(id));
    if (!rawGate) {
      toast.error("Unable to load gate details. Please refresh and try again.");
      return;
    }

    setStatusOverrides((prev) => ({ ...prev, [id]: checked }));

    updateGateMutation.mutate(
      {
        id: rawGate.id,
        payload: {
          gate_name: rawGate.gate_name,
          gate_device: rawGate.gate_device,
          society_block_id: rawGate.building_id ?? rawGate.society_block_id ?? 0,
          building_id: rawGate.building_id ?? 0,
          user_id: rawGate.user_id ?? 0,
          approve: checked ? 1 : 0,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Gate status ${checked ? "enabled" : "disabled"} successfully`);
        },
        onError: () => {
          // Revert the optimistic toggle on failure.
          setStatusOverrides((prev) => ({ ...prev, [id]: !checked }));
          toast.error("Failed to update gate status. Please try again.");
        },
      }
    );
  };

  const renderCell = (item: SmartsecureGate, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <Button
            size="sm"
            variant="ghost"
            className="p-1"
            onClick={() => handleEdit(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        );
      case "society":
        return <span>{item.society}</span>;
      case "status":
        return (
          <Switch
            checked={item.status}
            onCheckedChange={(checked) => handleStatusToggle(item.id, checked)}
          />
        );
      case "active":
        return item.active ? "Yes" : "No";
      default:
        return item[columnKey as keyof SmartsecureGate] ?? "N/A";
    }
  };

  return (
    <div className="space-y-4">
      <EnhancedTable
        data={gates}
        columns={columns}
        renderCell={renderCell}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
        emptyMessage={isError ? "Failed to load gates. Please try again." : "No gates found"}
        loading={isLoading}
        pagination={false}
        leftActions={
          <Button className="bg-brand hover:bg-brand-hover text-white" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        }
      />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default SmartsecureIntegrationTab;
