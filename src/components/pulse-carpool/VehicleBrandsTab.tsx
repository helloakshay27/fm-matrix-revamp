import { useEffect, useState } from "react";
import { Plus, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { capturePulseEvent } from "@/utils/posthogHelpers";

const columns: ColumnConfig[] = [
  { key: "id", label: "Id", sortable: true, draggable: true },
  { key: "name", label: "Brand Name", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: false, draggable: false },
];

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#1A1A1A" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)", borderWidth: 2 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

export const VehicleBrandsTab = () => {
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
        toast.success("Brand updated successfully");
      } else {
        await createVehicleBrand(name.trim());
        // Pulse Carpool Vehicle Brand Added
        capturePulseEvent("Pulse Carpool Vehicle Brand Added", {
          brand_name: name.trim(),
        });
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
        <button
          type="button"
          onClick={() => handleToggleStatus(item)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            item.active ? "bg-brand" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              item.active ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      );
    }
    return item[columnKey as keyof VehicleBrand] ?? "-";
  };

  const renderActions = (item: VehicleBrand) => (
    <Button size="sm" variant="ghost" className="p-1" onClick={() => openEditModal(item)} title="Edit">
      <Edit className="w-4 h-4" />
    </Button>
  );

  const leftActions = (
    <Button className="bg-brand hover:bg-brand-hover text-white" onClick={openAddModal}>
      <Plus size={18} className="mr-2" />
      Add Brand
    </Button>
  );

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
          <div className="space-y-4 py-2">
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
              sx={fieldStyles}
            />
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-brand hover:bg-brand-hover text-white min-w-[100px]"
            >
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
