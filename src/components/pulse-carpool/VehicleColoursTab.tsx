import { useEffect, useState } from "react";
import { Plus, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import {
  VehicleColour,
  fetchVehicleColours,
  createVehicleColour,
  updateVehicleColour,
  toggleVehicleColourActive,
} from "@/services/vehicleConfigApi";
import { usePulseEvents } from "@/components/PostHogPulseEvents";

const columns: ColumnConfig[] = [
  { key: "id", label: "Id", sortable: true, draggable: true },
  { key: "name", label: "Colour Name", sortable: true, draggable: true },
  { key: "swatch", label: "Colour", sortable: false, draggable: false },
  { key: "status", label: "Status", sortable: false, draggable: false },
];

const DEFAULT_HEX = "#000000";

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#1A1A1A" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)", borderWidth: 2 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

export const VehicleColoursTab = () => {
  const pulseEvents = usePulseEvents();
  const [colours, setColours] = useState<VehicleColour[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColour, setEditingColour] = useState<VehicleColour | null>(null);
  const [name, setName] = useState("");
  const [hexCode, setHexCode] = useState(DEFAULT_HEX);

  const loadColours = async () => {
    setLoading(true);
    try {
      const data = await fetchVehicleColours();
      setColours(data);
    } catch (error) {
      console.error("Failed to fetch vehicle colours", error);
      toast.error("Failed to load vehicle colours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColours();
  }, []);

  const openAddModal = () => {
    setEditingColour(null);
    setName("");
    setHexCode(DEFAULT_HEX);
    setIsModalOpen(true);
  };

  const openEditModal = (colour: VehicleColour) => {
    setEditingColour(colour);
    setName(colour.name);
    setHexCode(colour.hex_code || DEFAULT_HEX);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Colour name is required");
      return;
    }
    if (!hexCode.trim()) {
      toast.error("Colour is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingColour) {
        await updateVehicleColour(editingColour.id, name.trim(), hexCode);
        pulseEvents.onVehicleColourSaved("updated", name.trim(), hexCode);
        toast.success("Colour updated successfully");
      } else {
        await createVehicleColour(name.trim(), hexCode);
        pulseEvents.onVehicleColourSaved("added", name.trim(), hexCode);
        toast.success("Colour added successfully");
      }
      setIsModalOpen(false);
      setName("");
      setHexCode(DEFAULT_HEX);
      setEditingColour(null);
      await loadColours();
    } catch (error) {
      console.error("Failed to save vehicle colour", error);
      toast.error(editingColour ? "Failed to update colour" : "Failed to add colour");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (colour: VehicleColour) => {
    try {
      await toggleVehicleColourActive(colour.id);
      toast.success("Status updated successfully");
      loadColours();
    } catch (error) {
      console.error("Failed to toggle colour status", error);
      toast.error("Failed to update status");
    }
  };

  const renderCell = (item: VehicleColour, columnKey: string) => {
    if (columnKey === "swatch") {
      return (
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-5 w-5 rounded-full border border-gray-300"
            style={{ backgroundColor: item.hex_code }}
          />
          <span className="text-sm text-gray-600">{item.hex_code}</span>
        </div>
      );
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
    return item[columnKey as keyof VehicleColour] ?? "-";
  };

  const renderActions = (item: VehicleColour) => (
    <Button size="sm" variant="ghost" className="p-1" onClick={() => openEditModal(item)} title="Edit">
      <Edit className="w-4 h-4" />
    </Button>
  );

  const leftActions = (
    <Button className="bg-brand hover:bg-brand-hover text-white" onClick={openAddModal}>
      <Plus size={18} className="mr-2" />
      Add Colour
    </Button>
  );

  return (
    <div>
      <EnhancedTable
        data={colours}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        loading={loading}
        emptyMessage="No vehicle colours found"
        pagination={true}
        pageSize={10}
        storageKey="vehicle-colours-table"
        enableSearch={true}
        getItemId={(item: VehicleColour) => String(item.id)}
      />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="xs">
        <DialogContent>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle sx={{ padding: 0, fontSize: "18px", fontWeight: 550 }}>
              {editingColour ? "Edit Colour" : "Add New Colour"}
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
                  Colour Name<span style={{ color: "var(--color-error)" }}> *</span>
                </span>
              }
              placeholder="Enter colour name"
              InputLabelProps={{ shrink: true }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              sx={fieldStyles}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Colour <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={hexCode}
                  onChange={(e) => setHexCode(e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <TextField
                  value={hexCode}
                  onChange={(e) => setHexCode(e.target.value)}
                  placeholder="#000000"
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...fieldStyles, maxWidth: 140 }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-brand hover:bg-brand-hover text-white min-w-[100px]"
            >
              {submitting ? "Saving..." : editingColour ? "Update" : "Add"}
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
