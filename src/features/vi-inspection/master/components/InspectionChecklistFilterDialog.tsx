import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import type { InspectionType } from "../api/inspectionTypeApi";
import { muiFieldStyles as fieldStyles } from "../utils";


export interface InspectionChecklistFilterValues {
  inspectionTypeId: string;
  /** "" (all) | "true" | "false" */
  active: string;
}

const EMPTY_FILTERS: InspectionChecklistFilterValues = { inspectionTypeId: "", active: "" };

interface InspectionChecklistFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Currently applied filters (from the URL). */
  filters: InspectionChecklistFilterValues;
  inspectionTypes: InspectionType[];
  onApplyFilters: (filters: InspectionChecklistFilterValues) => void;
}

export const InspectionChecklistFilterDialog = ({
  open,
  onOpenChange,
  filters,
  inspectionTypes,
  onApplyFilters,
}: InspectionChecklistFilterDialogProps) => {
  // Draft values — only written to the URL on Apply / Reset.
  const [draft, setDraft] = useState<InspectionChecklistFilterValues>(filters);

  useEffect(() => {
    if (open) setDraft(filters);
    // Re-seed from the URL each time the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleChange = (field: keyof InspectionChecklistFilterValues, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters(draft);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
    onApplyFilters(EMPTY_FILTERS);
    onOpenChange(false);
  };

  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: "16px" } }}
      open={open}
      onClose={() => onOpenChange(false)}
      fullWidth
      maxWidth="xs"
    >
      <DialogContent>
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg font-semibold">FILTER BY</h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Inspection Type</InputLabel>
            <MuiSelect
              label="Inspection Type"
              value={draft.inspectionTypeId}
              onChange={(e) => handleChange("inspectionTypeId", String(e.target.value))}
              displayEmpty
              notched
              sx={fieldStyles}
              MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
            >
              <MenuItem value="">
                <em>All inspection types</em>
              </MenuItem>
              {inspectionTypes.map((type) => (
                <MenuItem key={type.id} value={String(type.id)}>
                  {type.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Status</InputLabel>
            <MuiSelect
              label="Status"
              value={draft.active}
              onChange={(e) => handleChange("active", String(e.target.value))}
              displayEmpty
              notched
              sx={fieldStyles}
            >
              <MenuItem value="">
                <em>All statuses</em>
              </MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex gap-3 pt-4 items-center justify-end">
          <Button
            onClick={handleReset}
            variant="outline"
            className="h-[42px] sm:h-[42px] px-[22px] text-[13px] font-semibold rounded-[8px]"
          >
            Reset
          </Button>
          <Button onClick={handleApply} className="fm-action-primary">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
