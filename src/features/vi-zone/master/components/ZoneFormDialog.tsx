import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { muiFieldStyles } from "@/features/vi-inspection/master/utils";
import type { CircleOption, ViZone } from "../api/zoneApi";

const schema = z.object({
  company_cluster_id: z.string().min(1, "Circle is required"),
  name: z
    .string()
    .trim()
    .min(1, "Zone name is required")
    .max(100, "Zone name must be 100 characters or less"),
});

export type ZoneFormData = z.infer<typeof schema>;

interface ZoneFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** When set, the dialog edits this record; otherwise it creates a new one. */
  zone?: ViZone | null;
  circles: CircleOption[];
  circlesLoading?: boolean;
  /** Pre-selects this circle on create (e.g. the circle the list is filtered by). */
  defaultCircleId?: string;
  onSubmit: (data: ZoneFormData) => void;
  isSubmitting?: boolean;
}

export const ZoneFormDialog = ({
  open,
  onClose,
  zone,
  circles,
  circlesLoading,
  defaultCircleId,
  onSubmit,
  isSubmitting,
}: ZoneFormDialogProps) => {
  const isEdit = !!zone;
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZoneFormData>({
    resolver: zodResolver(schema),
    defaultValues: { company_cluster_id: "", name: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      company_cluster_id: zone ? String(zone.company_cluster_id ?? "") : defaultCircleId ?? "",
      name: zone?.name ?? "",
    });
  }, [open, zone, defaultCircleId, reset]);

  // MUI forwards `ref` to the wrapper div — RHF needs the <input> itself, via inputRef.
  const { ref: nameRef, ...nameField } = register("name");

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: "16px" } }}
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg font-semibold">{isEdit ? "EDIT ZONE" : "ADD ZONE"}</h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Controller
            control={control}
            name="company_cluster_id"
            render={({ field }) => (
              <FormControl
                fullWidth
                variant="outlined"
                required
                error={!!errors.company_cluster_id}
                sx={{ mt: 1 }}
              >
                <InputLabel shrink>Circle</InputLabel>
                <MuiSelect
                  label="Circle"
                  value={field.value}
                  onChange={(e) => field.onChange(String(e.target.value))}
                  onBlur={field.onBlur}
                  displayEmpty
                  notched
                  // The API doesn't allow moving a zone to another circle.
                  disabled={circlesLoading || isEdit}
                  sx={muiFieldStyles}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                >
                  <MenuItem value="" disabled>
                    <em>{circlesLoading ? "Loading circles..." : "Select circle"}</em>
                  </MenuItem>
                  {circles.map((circle) => (
                    <MenuItem key={circle.id} value={circle.id}>
                      {circle.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.company_cluster_id ? (
                  <FormHelperText>{errors.company_cluster_id.message}</FormHelperText>
                ) : (
                  isEdit && <FormHelperText>The circle can't be changed after creation</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <TextField
            label="Zone Name"
            required
            placeholder="e.g. Vizag"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={muiFieldStyles}
            error={!!errors.name}
            helperText={errors.name?.message}
            {...nameField}
            inputRef={nameRef}
          />

          <div className="flex gap-3 pt-2 items-center justify-end">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={isSubmitting}
              className="h-[42px] sm:h-[42px] px-[22px] text-[13px] font-semibold rounded-[8px]"
            >
              Cancel
            </Button>
            <Button type="submit" className="fm-action-primary" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
