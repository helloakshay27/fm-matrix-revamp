import { useEffect, useState } from "react";
import { Plus, Edit, X, Save, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TextField, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import {
  VehicleBrand,
  fetchVehicleBrands,
  createVehicleBrand,
  updateVehicleBrand,
  toggleVehicleBrandActive,
} from "@/services/vehicleConfigApi";
import { usePulseEvents } from "@/components/PostHogPulseEvents";
import { FormSection, assetFieldStyles } from "@/components/common/FormSection";

const columns: ColumnConfig[] = [
  { key: "id", label: "Id", sortable: true, draggable: true },
  { key: "name", label: "Brand Name", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: false, draggable: false },
];

export const VehicleBrandsTab = () => {
  const pulseEvents = usePulseEvents();
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<VehicleBrand | null>(null);
  const [name, setName] = useState("");

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await fetchVehicleBrands();
      setBrands(data);
    } catch (error) {
      console.error("Failed to fetch vehicle brands", error);
      toast.error("Failed to load vehicle brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openAddModal = () => {
    setEditingBrand(null);
    setName("");
    setIsModalOpen(true);
  };

  const openEditModal = (brand: VehicleBrand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingBrand) {
        await updateVehicleBrand(editingBrand.id, name.trim());
        pulseEvents.onVehicleBrandSaved("updated", name.trim());
        toast.success("Brand updated successfully");
      } else {
        await createVehicleBrand(name.trim());
        pulseEvents.onVehicleBrandSaved("added", name.trim());
        toast.success("Brand added successfully");
      }
      setIsModalOpen(false);
      setName("");
      setEditingBrand(null);
      await loadBrands();
    } catch (error) {
      console.error("Failed to save vehicle brand", error);
      toast.error(editingBrand ? "Failed to update brand" : "Failed to add brand");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (brand: VehicleBrand) => {
    try {
      await toggleVehicleBrandActive(brand.id);
      toast.success("Status updated successfully");
      loadBrands();
    } catch (error) {
      console.error("Failed to toggle brand status", error);
      toast.error("Failed to update status");
    }
  };

  const renderCell = (item: VehicleBrand, columnKey: string) => {
    if (columnKey === "status") {
      return (
        <Switch
          checked={!!item.active}
          onCheckedChange={() => handleToggleStatus(item)}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }
    return item[columnKey as keyof VehicleBrand] ?? "-";
  };

  const renderActions = (item: VehicleBrand) => (
    <Button size="sm" variant="ghost" className="p-1" onClick={() => openEditModal(item)} title="Edit">
      <Edit className="w-4 h-4" />
    </Button>
  );

  const leftActions = <Button type="button" size="sm" className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium" onClick={openAddModal}><Plus className="w-4 h-4 mr-2" />Add Brand</Button>;

  return (
    <div>
      <EnhancedTable
        data={brands}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        loading={loading}
        emptyMessage="No vehicle brands found"
        pagination={true}
        pageSize={10}
        storageKey="vehicle-brands-table"
        enableSearch={true}
        getItemId={(item: VehicleBrand) => String(item.id)}
      />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="xs">
        <DialogContent>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle sx={{ padding: 0, fontSize: "18px", fontWeight: 550 }}>
              {editingBrand ? "Edit Brand" : "Add New Brand"}
            </DialogTitle>
            <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <FormSection title="BRAND DETAILS" icon={Tags}>
            <TextField
              fullWidth
              label={
                <span>
                  Brand Name<span style={{ color: "var(--color-error)" }}> *</span>
                </span>
              }
              placeholder="Enter brand name"
              InputLabelProps={{ shrink: true }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              InputProps={{ sx: assetFieldStyles }}
            />
          </FormSection>
          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-brand hover:bg-brand-hover text-white min-w-[100px]"
            >
              <Save className="w-4 h-4 mr-2" />
              {submitting ? "Saving..." : editingBrand ? "Update" : "Add"}
            </Button>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="min-w-[100px]">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
