import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { moduleService, LockModule } from "@/services/moduleService";
import { CreateModuleDialog } from "./CreateModuleDialog";
import { EditModuleDialog } from "./EditModuleDialog";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  LockModuleFilterDialog,
  type LockModuleFilters,
} from "@/components/LockModuleFilterDialog";

const columns: ColumnConfig[] = [
  { key: "name", label: "Name", sortable: true, defaultVisible: true },
  {
    key: "show_name",
    label: "Display Name",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "abbreviation",
    label: "Abbreviation",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "module_type",
    label: "Module Type",
    sortable: true,
    defaultVisible: true,
  },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "rate", label: "Rate", sortable: true, defaultVisible: true },
];

const emptyFilters: LockModuleFilters = {
  name: "",
  displayName: "",
  abbreviation: "",
  moduleType: "",
  status: "",
};

export const LockModuleList = () => {
  const { shouldShow } = useDynamicPermissions();
  const [modules, setModules] = useState<LockModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<LockModuleFilters>(emptyFilters);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LockModule | null>(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await moduleService.fetchModules();
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const name = String(module.name || "").toLowerCase();
      const showName = String(module.show_name || "").toLowerCase();
      const abbreviation = String(module.abbreviation || "").toLowerCase();
      const moduleType = String(module.module_type || "").toLowerCase();
      const status = module.active ? "active" : "inactive";

      if (filters.name && !name.includes(filters.name.toLowerCase())) {
        return false;
      }
      if (
        filters.displayName &&
        !showName.includes(filters.displayName.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.abbreviation &&
        !abbreviation.includes(filters.abbreviation.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.moduleType &&
        !moduleType.includes(filters.moduleType.toLowerCase())
      ) {
        return false;
      }
      if (filters.status && status !== filters.status.toLowerCase()) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          name.includes(q) ||
          showName.includes(q) ||
          abbreviation.includes(q) ||
          moduleType.includes(q) ||
          status.includes(q) ||
          String(module.rate || "")
            .toLowerCase()
            .includes(q)
        );
      }

      return true;
    });
  }, [modules, filters, searchTerm]);

  const handleEditModule = (module: LockModule) => {
    setSelectedModule(module);
    setEditDialogOpen(true);
  };

  const handleDeleteModule = async (module: LockModule) => {
    if (!module.id) return;

    if (
      !confirm(`Are you sure you want to delete the module "${module.name}"?`)
    ) {
      return;
    }

    try {
      await moduleService.deleteModule(module.id);
      toast.success("Module deleted successfully");
      fetchModules();
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error("Failed to delete module");
    }
  };

  const handleModuleCreated = () => {
    fetchModules();
    setCreateDialogOpen(false);
  };

  const handleModuleUpdated = () => {
    fetchModules();
    setEditDialogOpen(false);
    setSelectedModule(null);
  };

  const handleApplyFilters = (nextFilters: LockModuleFilters) => {
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setFilters(emptyFilters);
  };

  const renderActions = (module: LockModule) => (
    <div className="flex items-center justify-center gap-2">
      {shouldShow("Lock Module", "update") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditModule(module)}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {shouldShow("Lock Module", "destroy") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteModule(module)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const renderCell = (module: LockModule, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <span className="font-medium">{module.name}</span>;
      case "show_name":
        return module.show_name || "-";
      case "abbreviation":
        return (
          <Badge variant="outline" className="text-xs">
            {module.abbreviation || "-"}
          </Badge>
        );
      case "module_type":
        return module.module_type || "-";
      case "status":
        return (
          <Badge variant={module.active ? "default" : "secondary"}>
            {module.active ? "Active" : "Inactive"}
          </Badge>
        );
      case "rate":
        return module.rate
          ? `${module.rate}${module.rate_type ? ` (${module.rate_type})` : ""}`
          : "-";
      default:
        return (module as Record<string, unknown>)[columnKey] != null
          ? String((module as Record<string, unknown>)[columnKey])
          : "-";
    }
  };

  const leftActions = shouldShow("Lock Module", "create") ? (
    <Button
      onClick={() => setCreateDialogOpen(true)}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Module
    </Button>
  ) : null;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">
        Lock Modules
      </h1>

      <EnhancedTable
        data={filteredModules}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="lock-modules-table"
        emptyMessage={
          searchTerm || Object.values(filters).some(Boolean)
            ? "No modules found matching your search"
            : "No modules found"
        }
        loading={loading}
        loadingMessage="Loading modules..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search modules by name, abbreviation, or display name..."
        disableClientSearch
        onFilterClick={() => setShowFilters(true)}
        hideTableExport={true}
        getItemId={(module) => String(module.id)}
      />

      <LockModuleFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <CreateModuleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onModuleCreated={handleModuleCreated}
      />

      {selectedModule && (
        <EditModuleDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          module={selectedModule}
          onModuleUpdated={handleModuleUpdated}
        />
      )}
    </div>
  );
};
