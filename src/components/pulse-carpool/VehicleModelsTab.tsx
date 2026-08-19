import { useEffect, useState } from "react";
import { Plus, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import {
  VehicleBrand,
  VehicleModel,
  fetchVehicleBrands,
  fetchVehicleModels,
  createVehicleModel,
  updateVehicleModel,
  toggleVehicleModelActive,
} from "@/services/vehicleConfigApi";
import { usePulseEvents } from "@/components/PostHogPulseEvents";

const columns: ColumnConfig[] = [
  { key: "id", label: "Id", sortable: true, draggable: true },
  { key: "name", label: "Model Name", sortable: true, draggable: true },
  { key: "brand", label: "Brand", sortable: true, draggable: true },
  { key: "seat", label: "Seats", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: false, draggable: false },
];

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: unknown } })?.response?.data;
  if (data && typeof data === "object") {
    const source = (data as { errors?: unknown; message?: unknown; error?: unknown }).errors ?? data;
    if (source && typeof source === "object" && !Array.isArray(source)) {
      const messages = Object.entries(source as Record<string, unknown>).flatMap(([field, msgs]) => {
        const list = Array.isArray(msgs) ? msgs : [msgs];
        const label = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ");
        return list.map((msg) => `${label} ${msg}`);
      });
      if (messages.length) return messages.join(", ");
    }
    const flat = data as { message?: unknown; error?: unknown };
    if (typeof flat.message === "string") return flat.message;
    if (typeof flat.error === "string") return flat.error;
  }
  return fallback;
};

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#1A1A1A" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)", borderWidth: 2 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

export const VehicleModelsTab = () => {
  const pulseEvents = usePulseEvents();
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState<string>("");
  const [seat, setSeat] = useState<string>("");

  const brandNameById = (id: number) =>
    brands.find((b) => b.id === id)?.name ?? "-";

  const loadData = async () => {
    setLoading(true);
    try {
      const [modelData, brandData] = await Promise.all([
        fetchVehicleModels(),
        fetchVehicleBrands(),
      ]);
      setModels(modelData);
      setBrands(brandData);
    } catch (error) {
      console.error("Failed to fetch vehicle models", error);
      toast.error("Failed to load vehicle models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingModel(null);
    setName("");
    setBrandId("");
    setSeat("");
    setIsModalOpen(true);
  };

  const openEditModal = (model: VehicleModel) => {
    setEditingModel(model);
    setName(model.name);
    setBrandId(String(model.vehicle_brand_id));
    setSeat(model.seat !== undefined && model.seat !== null ? String(model.seat) : "");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Model name is required");
      return;
    }
    if (!brandId) {
      toast.error("Brand selection is required");
      return;
    }
    if (!seat || Number(seat) < 1 || Number(seat) > 9) {
      toast.error("Seats must be a number between 1 and 9");
      return;
    }

    setSubmitting(true);
    try {
      const modelProps = {
        model_name: name.trim(),
        brand_id: Number(brandId),
        seats: Number(seat),
      };
      if (editingModel) {
        await updateVehicleModel(editingModel.id, name.trim(), Number(brandId), Number(seat));
        pulseEvents.onVehicleModelSaved("updated", modelProps);
        toast.success("Model updated successfully");
      } else {
        await createVehicleModel(name.trim(), Number(brandId), Number(seat));
        pulseEvents.onVehicleModelSaved("added", modelProps);
        toast.success("Model added successfully");
      }
      setIsModalOpen(false);
      setName("");
      setBrandId("");
      setSeat("");
      setEditingModel(null);
      await loadData();
    } catch (error) {
      console.error("Failed to save vehicle model", error);
      toast.error(
        getApiErrorMessage(error, editingModel ? "Failed to update model" : "Failed to add model")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (model: VehicleModel) => {
    try {
      await toggleVehicleModelActive(model.id);
      toast.success("Status updated successfully");
      loadData();
    } catch (error) {
      console.error("Failed to toggle model status", error);
      toast.error("Failed to update status");
    }
  };

  const renderCell = (item: VehicleModel, columnKey: string) => {
    if (columnKey === "brand") {
      return item.vehicle_brand?.name ?? brandNameById(item.vehicle_brand_id);
    }
    if (columnKey === "status") {
      return (
        <button
          type="button"
          onClick={() => handleToggleStatus(item)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.active ? "bg-brand" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.active ? "translate-x-6" : "translate-x-1"
              }`}
          />
        </button>
      );
    }
    return item[columnKey as keyof VehicleModel] ?? "-";
  };

  const renderActions = (item: VehicleModel) => (
    <Button size="sm" variant="ghost" className="p-1" onClick={() => openEditModal(item)} title="Edit">
      <Edit className="w-4 h-4" />
    </Button>
  );

  const leftActions = (
    <Button className="bg-brand hover:bg-brand-hover text-white" onClick={openAddModal}>
      <Plus size={18} className="mr-2" />
      Add Model
    </Button>
  );

  return (
    <div>
      <EnhancedTable
        data={models}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        loading={loading}
        emptyMessage="No vehicle models found"
        pagination={true}
        pageSize={10}
        storageKey="vehicle-models-table"
        enableSearch={true}
        getItemId={(item: VehicleModel) => String(item.id)}
      />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="xs">
        <DialogContent>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle sx={{ padding: 0, fontSize: "18px", fontWeight: 550 }}>
              {editingModel ? "Edit Model" : "Add New Model"}
            </DialogTitle>
            <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <div className="space-y-4 py-2">
            <FormControl fullWidth sx={fieldStyles}>
              <InputLabel shrink>
                Brand<span style={{ color: "var(--color-error)" }}> *</span>
              </InputLabel>
              <Select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value as string)}
                label="Brand"
                notched
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <span style={{ color: "#999" }}>Select brand</span>
                </MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={String(brand.id)}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={
                <span>
                  Model Name<span style={{ color: "var(--color-error)" }}> *</span>
                </span>
              }
              placeholder="Enter model name"
              InputLabelProps={{ shrink: true }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              sx={fieldStyles}
            />
            <TextField
              fullWidth
              type="number"
              label={
                <span>
                  Seats<span style={{ color: "var(--color-error)" }}> *</span>
                </span>
              }
              placeholder="Enter number of seats"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 1, max: 9 }}
              value={seat}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (Number(value) >= 1 && Number(value) <= 9)) {
                  setSeat(value);
                }
              }}
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
              {submitting ? "Saving..." : editingModel ? "Update" : "Add"}
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
