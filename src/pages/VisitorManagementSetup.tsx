import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { useLayout } from "@/contexts/LayoutContext";
import { ticketManagementAPI } from "@/services/ticketManagementAPI";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  VisitorGateFilterDialog,
  type VisitorGateFilters,
} from "@/components/VisitorGateFilterDialog";

interface VisitorGateData {
  id: number;
  society: string;
  tower: string;
  gateName: string;
  gateDevice: string;
  userName: string;
  status: boolean;
  active: boolean;
  createdBy: string;
}

interface SocietyGateAPIResponse {
  id: number;
  gate_name: string;
  gate_device: string;
  approve: number;
  active: number;
  society?: {
    name: string;
  };
  building?: {
    name: string;
  };
  user?: {
    name: string;
  };
  created_by?: {
    name: string;
  };
}

const columns: ColumnConfig[] = [
  { key: "society", label: "Society", sortable: true, defaultVisible: true },
  { key: "tower", label: "Tower", sortable: true, defaultVisible: true },
  { key: "gateName", label: "Gate Name", sortable: true, defaultVisible: true },
  {
    key: "gateDevice",
    label: "Gate Device ID",
    sortable: true,
    defaultVisible: true,
  },
  { key: "userName", label: "User Name", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  {
    key: "createdBy",
    label: "Created By",
    sortable: true,
    defaultVisible: true,
  },
];

const emptyFilters: VisitorGateFilters = {
  society: "",
  tower: "",
  gateName: "",
  userName: "",
  status: "",
};

export const VisitorManagementSetup = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VisitorGateFilters>(emptyFilters);

  const [visitorGateData, setVisitorGateData] = useState<VisitorGateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  useEffect(() => {
    setCurrentSection("Settings");
  }, [setCurrentSection]);

  const fetchSocietyGates = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const response = await ticketManagementAPI.getSocietyGates(
          page,
          perPage
        );

        if (response && response.smart_secure_society_gates) {
          const mappedData = response.smart_secure_society_gates.map(
            (gate: SocietyGateAPIResponse) => ({
              id: gate.id,
              society: gate.society?.name || "N/A",
              tower: gate.building?.name || "N/A",
              gateName: gate.gate_name,
              gateDevice: gate.gate_device,
              userName: gate.user?.name || "N/A",
              status: gate.approve === 1,
              active: gate.active === 1,
              createdBy: gate.created_by?.name || "N/A",
            })
          );

          setVisitorGateData(mappedData);

          if (response.smart_secure_pagination) {
            setCurrentPage(response.smart_secure_pagination.current_page);
            setTotalPages(response.smart_secure_pagination.total_pages);
          }
        } else {
          setVisitorGateData([]);
        }
      } catch (error) {
        console.error("Error fetching society gates:", error);
        toast.error("Failed to load society gates. Please try again.");
        setVisitorGateData([]);
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchSocietyGates(currentPage);
  }, [fetchSocietyGates, currentPage]);

  const filteredData = useMemo(() => {
    return visitorGateData.filter((item) => {
      const society = item.society.toLowerCase();
      const tower = item.tower.toLowerCase();
      const gateName = item.gateName.toLowerCase();
      const gateDevice = String(item.gateDevice || "").toLowerCase();
      const userName = item.userName.toLowerCase();
      const createdBy = item.createdBy.toLowerCase();
      const status = item.status ? "active" : "inactive";

      if (filters.society && !society.includes(filters.society.toLowerCase())) {
        return false;
      }
      if (filters.tower && !tower.includes(filters.tower.toLowerCase())) {
        return false;
      }
      if (
        filters.gateName &&
        !gateName.includes(filters.gateName.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.userName &&
        !userName.includes(filters.userName.toLowerCase())
      ) {
        return false;
      }
      if (filters.status && status !== filters.status.toLowerCase()) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          society.includes(q) ||
          tower.includes(q) ||
          gateName.includes(q) ||
          gateDevice.includes(q) ||
          userName.includes(q) ||
          createdBy.includes(q) ||
          String(item.id).includes(q) ||
          status.includes(q)
        );
      }

      return true;
    });
  }, [visitorGateData, filters, searchTerm]);

  const handleStatusToggle = (id: number, field: "status" | "active") => {
    setVisitorGateData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    );

    const updatedItem = visitorGateData.find((item) => item.id === id);
    const newValue = updatedItem ? !updatedItem[field] : false;
    toast.success(
      `${field === "status" ? "Status" : "Active state"} is ${
        newValue ? "Active" : "Deactive"
      }`
    );
  };

  const renderActions = (item: VisitorGateData) => (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-brand hover:bg-brand-selected"
        onClick={() =>
          navigate(`/settings/visitor-management/setup/edit/${item.id}`)
        }
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item: VisitorGateData, columnKey: string) => {
    switch (columnKey) {
      case "society":
        return (
          <div className="truncate max-w-[300px]" title={item.society}>
            {item.society}
          </div>
        );
      case "tower":
        return item.tower || "--";
      case "gateName":
        return item.gateName;
      case "gateDevice":
        return (
          <span className="font-mono text-sm">{item.gateDevice}</span>
        );
      case "userName":
        return item.userName;
      case "status":
        return (
          <div
            className="flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch
              checked={item.status}
              onCheckedChange={() => handleStatusToggle(item.id, "status")}
            />
          </div>
        );
      case "createdBy":
        return item.createdBy;
      default:
        return "-";
    }
  };

  const leftActions = (
    <Button
      onClick={() => navigate("/settings/visitor-management/setup/add-gate")}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  return (
    <div className="p-6 space-y-6">
      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="visitor-management-setup-table"
        emptyMessage={
          searchTerm || Object.values(filters).some(Boolean)
            ? "No visitor gates found matching your search"
            : "No visitor gates found"
        }
        loading={loading}
        loadingMessage="Loading visitor gates..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        disableClientSearch
        onFilterClick={() => setShowFilters(true)}
        hideTableExport
        pagination
        pageSize={perPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        getItemId={(item) => String(item.id)}
      />

      <VisitorGateFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters(emptyFilters)}
      />
    </div>
  );
};
