import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField } from "@mui/material";
import { toast } from "sonner";
import { moduleService, LockPhase } from "@/services/moduleService";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

const columns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, defaultVisible: true },
  { key: "name", label: "Name", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
];

interface PhaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase?: LockPhase | null;
  onSaved: () => void;
}

const PhaseDialog = ({ open, onOpenChange, phase, onSaved }: PhaseDialogProps) => {
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(phase?.name || "");
      setActive(phase ? !!phase.active : true);
    }
  }, [open, phase]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Phase name is required");
      return;
    }

    const payload = { lock_phase: { name: name.trim(), active } };

    try {
      setSaving(true);
      if (phase?.id) {
        await moduleService.updatePhase(phase.id, payload);
        toast.success("Phase updated successfully");
      } else {
        await moduleService.createPhase(payload);
        toast.success("Phase created successfully");
      }
      onSaved();
    } catch (error) {
      console.error("Error saving phase:", error);
      toast.error(phase?.id ? "Failed to update phase" : "Failed to create phase");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{phase?.id ? "Edit Phase" : "Add Phase"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <TextField
            label="Name"
            placeholder="Enter phase name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="phase-active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked === true)}
            />
            <Label htmlFor="phase-active">Active</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-[#1a1a18] hover:bg-[#12100e] text-white"
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {phase?.id ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const LockPhasesList = () => {
  const { shouldShow } = useDynamicPermissions();
  const [phases, setPhases] = useState<LockPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<LockPhase | null>(null);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      const data = await moduleService.fetchPhases();
      setPhases(data);
    } catch (error) {
      console.error("Error fetching phases:", error);
      toast.error("Failed to load phases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  const filteredPhases = useMemo(() => {
    if (!searchTerm.trim()) return phases;
    const q = searchTerm.toLowerCase();
    return phases.filter((phase) => {
      const status = phase.active ? "active" : "inactive";
      return (
        String(phase.name || "").toLowerCase().includes(q) ||
        String(phase.id || "").includes(q) ||
        status.includes(q)
      );
    });
  }, [phases, searchTerm]);

  const handleAddPhase = () => {
    setSelectedPhase(null);
    setDialogOpen(true);
  };

  const handleEditPhase = (phase: LockPhase) => {
    setSelectedPhase(phase);
    setDialogOpen(true);
  };

  const handleDeletePhase = async (phase: LockPhase) => {
    if (!phase.id) return;

    if (!confirm(`Are you sure you want to delete the phase "${phase.name}"?`)) {
      return;
    }

    try {
      await moduleService.deletePhase(phase.id);
      toast.success("Phase deleted successfully");
      fetchPhases();
    } catch (error) {
      console.error("Error deleting phase:", error);
      toast.error("Failed to delete phase");
    }
  };

  const handlePhaseSaved = () => {
    fetchPhases();
    setDialogOpen(false);
    setSelectedPhase(null);
  };

  const renderActions = (phase: LockPhase) => (
    <div className="flex items-center justify-center gap-2">
      {shouldShow("Lock Phase", "update") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditPhase(phase)}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {shouldShow("Lock Phase", "destroy") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeletePhase(phase)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const renderCell = (phase: LockPhase, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return phase.id ?? "-";
      case "name":
        return <span className="font-medium">{phase.name}</span>;
      case "status":
        return (
          <span
            className={
              phase.active
                ? "rounded-full bg-green-100 px-[10px] py-[3px] text-[11px] font-medium text-green-700"
                : "rounded-full bg-gray-100 px-[10px] py-[3px] text-[11px] font-medium text-gray-600"
            }
          >
            {phase.active ? "Active" : "Inactive"}
          </span>
        );
      default:
        return (phase as Record<string, unknown>)[columnKey] != null
          ? String((phase as Record<string, unknown>)[columnKey])
          : "-";
    }
  };

  const leftActions = shouldShow("Lock Phase", "create") ? (
    <Button
      onClick={handleAddPhase}
      className="bg-[#1a1a18] hover:bg-[#12100e] text-white h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Phase
    </Button>
  ) : null;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">
        Lock Phases
      </h1>

      <EnhancedTable
        data={filteredPhases}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="lock-phases-table"
        emptyMessage={
          searchTerm ? "No phases found matching your search" : "No phases found"
        }
        loading={loading}
        loadingMessage="Loading phases..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search phases by name..."
        disableClientSearch
        hideTableExport={true}
        getItemId={(phase) => String(phase.id)}
      />

      <PhaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        phase={selectedPhase}
        onSaved={handlePhaseSaved}
      />
    </div>
  );
};
