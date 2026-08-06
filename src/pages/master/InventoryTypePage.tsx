import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { Plus, Pencil } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { inventoryTypeService } from "@/services/inventoryTypeService";
import { toast } from "sonner";
import {
  InventoryTypeFilterDialog,
  type InventoryTypeFilters,
} from "@/components/InventoryTypeFilterDialog";

export interface InventoryType {
  id: number;
  name: string;
  material_type_code: string;
  category: string;
  material_type_description: string;
  active?: boolean | null;
}

const emptyFilters: InventoryTypeFilters = {
  name: "",
  code: "",
  category: "",
  status: "",
};

const InventoryTypePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSettingsRoute = location.pathname.includes(
    "/settings/inventory-management"
  );
  const basePath = isSettingsRoute
    ? "/settings/inventory-management/inventory-type"
    : "/master/inventory-type";

  const [inventoryTypes, setInventoryTypes] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimisticActive, setOptimisticActive] = useState<
    Record<number, boolean>
  >({});
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<InventoryTypeFilters>(emptyFilters);

  const isActiveValue = (val: any) =>
    val === null || String(val) === "true" || String(val) === "1";

  const handleToggleActive = async (id: number) => {
    const item = inventoryTypes.find((it) => it.id === id);
    if (!item) return;
    const newActive = !(optimisticActive[id] !== undefined
      ? optimisticActive[id]
      : isActiveValue(item.active));
    setOptimisticActive((prev) => ({ ...prev, [id]: newActive }));
    try {
      await inventoryTypeService.updateInventoryType(id, {
        pms_inventory_type: { active: newActive },
      });
      setInventoryTypes((list) =>
        list.map((it) => (it.id === id ? { ...it, active: newActive } : it))
      );
      toast.success(
        `Inventory type ${newActive ? "activated" : "deactivated"} successfully.`
      );
    } catch {
      toast.error("Failed to update status.");
      setOptimisticActive((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  useEffect(() => {
    const fetchInventoryTypes = async () => {
      try {
        setLoading(true);
        const data = await inventoryTypeService.getInventoryTypes();
        setInventoryTypes(data);
      } catch {
        toast.error("Failed to fetch inventory types.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryTypes();
  }, []);

  const handleAdd = () => {
    navigate(`${basePath}/add`);
  };

  const handleEdit = (id: number) => {
    navigate(`${basePath}/edit/${id}`);
  };

  const filteredData = useMemo(() => {
    return inventoryTypes
      .filter((item) => {
        const name = String(item.name || "").toLowerCase();
        const code = String(item.material_type_code || "").toLowerCase();
        const category = String(item.category || "").toLowerCase();
        const description = String(
          item.material_type_description || ""
        ).toLowerCase();
        const isActive =
          optimisticActive[item.id] !== undefined
            ? optimisticActive[item.id]
            : isActiveValue(item.active);
        const status = isActive ? "active" : "inactive";

        if (filters.name && !name.includes(filters.name.toLowerCase())) {
          return false;
        }
        if (filters.code && !code.includes(filters.code.toLowerCase())) {
          return false;
        }
        if (
          filters.category &&
          !category.includes(filters.category.toLowerCase())
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
            code.includes(q) ||
            category.includes(q) ||
            description.includes(q) ||
            status.includes(q)
          );
        }

        return true;
      })
      .map((it, idx) => ({ ...it, srno: idx + 1 }));
  }, [inventoryTypes, filters, searchTerm, optimisticActive]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Inventory Types</h1>

      {showActionPanel && (
        <SelectionPanel
          actions={[{ label: "Add", icon: Plus, onClick: handleAdd }]}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <EnhancedTable
        loading={loading}
        loadingMessage="Loading inventory types..."
        columns={[
          { key: "srno", label: "Sr. No.", sortable: true, defaultVisible: true },
          {
            key: "actions",
            label: "Actions",
            sortable: false,
            defaultVisible: true,
            hideable: false,
          },
          { key: "name", label: "Name", sortable: true, defaultVisible: true },
          {
            key: "material_type_code",
            label: "Code",
            sortable: true,
            defaultVisible: true,
          },
          {
            key: "category",
            label: "Category",
            sortable: true,
            defaultVisible: true,
          },
          {
            key: "material_type_description",
            label: "Description",
            sortable: true,
            defaultVisible: true,
          },
          {
            key: "active",
            label: "Status",
            sortable: false,
            defaultVisible: true,
          },
        ]}
        data={filteredData}
        leftActions={
          <Button
            onClick={() => setShowActionPanel((prev) => !prev)}
            className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Action
          </Button>
        }
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        disableClientSearch
        onFilterClick={() => setShowFilters(true)}
        hideTableExport
        pagination
        pageSize={10}
        storageKey="inventory-types-table"
        getItemId={(item) => String(item.id)}
        renderCell={(row, key) => {
          if (key === "srno") return <span>{row[key]}</span>;
          if (key === "actions") {
            return (
              <div className="flex gap-2 justify-center items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-brand hover:bg-brand-selected"
                  onClick={() => handleEdit(row.id)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            );
          }
          if (key === "material_type_description") {
            return (
              <span
                className="inline-block max-w-[220px] truncate align-middle"
                title={row[key]}
              >
                {row[key]}
              </span>
            );
          }
          if (key === "active") {
            const isActive =
              optimisticActive[row.id] !== undefined
                ? optimisticActive[row.id]
                : isActiveValue(row.active);
            return (
              <div className="flex items-center justify-center">
                <Switch
                  checked={isActive}
                  onCheckedChange={() => handleToggleActive(row.id)}
                />
              </div>
            );
          }
          return row[key];
        }}
        emptyMessage={
          searchTerm || Object.values(filters).some(Boolean)
            ? "No inventory types found matching your search"
            : "No inventory types found."
        }
      />

      <InventoryTypeFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters(emptyFilters)}
      />
    </div>
  );
};

export default InventoryTypePage;
