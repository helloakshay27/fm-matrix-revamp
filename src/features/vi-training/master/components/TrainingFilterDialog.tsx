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
import { muiFieldStyles as fieldStyles } from "@/features/vi-inspection/master/utils";

/** Anything with an id and a name (training categories, circles). */
export interface FilterOptionItem {
  id: number | string;
  name: string;
}

export interface TrainingFilterValues {
  categoryId: string;
  /** "" (all) | "true" | "false" */
  active: string;
}

const EMPTY_FILTERS: TrainingFilterValues = { categoryId: "", active: "" };

interface TrainingFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Currently applied filters (from the URL). */
  filters: TrainingFilterValues;
  /** Shows the category filter when given (checklist page, zone circles). */
  categories?: FilterOptionItem[];
  /** Label of the category filter. Defaults to "Training Category". */
  categoryLabel?: string;
  /** Text of its "all" option. Defaults to "All categories". */
  allCategoriesLabel?: string;
  onApplyFilters: (filters: TrainingFilterValues) => void;
}

export const TrainingFilterDialog = ({
  open,
  onOpenChange,
  filters,
  categories,
  categoryLabel = "Training Category",
  allCategoriesLabel = "All categories",
  onApplyFilters,
}: TrainingFilterDialogProps) => {
  // Draft values — only written to the URL on Apply / Reset.
  const [draft, setDraft] = useState<TrainingFilterValues>(filters);

  useEffect(() => {
    if (open) setDraft(filters);
    // Re-seed from the URL each time the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleChange = (field: keyof TrainingFilterValues, value: string) => {
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
          {categories && (
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>{categoryLabel}</InputLabel>
              <MuiSelect
                label={categoryLabel}
                value={draft.categoryId}
                onChange={(e) => handleChange("categoryId", String(e.target.value))}
                displayEmpty
                notched
                sx={fieldStyles}
                MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
              >
                <MenuItem value="">
                  <em>{allCategoriesLabel}</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          )}

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
