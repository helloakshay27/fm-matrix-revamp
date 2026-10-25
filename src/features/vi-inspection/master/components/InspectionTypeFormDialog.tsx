import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { Dialog, DialogContent, TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { InspectionType } from "../api/inspectionTypeApi";
import { muiFieldStyles } from "../utils";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  lat_long_required: z.boolean(),
});

export type InspectionTypeFormData = z.infer<typeof schema>;

interface InspectionTypeFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** When set, the dialog edits this record; otherwise it creates a new one. */
  inspectionType?: InspectionType | null;
  onSubmit: (data: InspectionTypeFormData) => void;
  isSubmitting?: boolean;
}

export const InspectionTypeFormDialog = ({
  open,
  onClose,
  inspectionType,
  onSubmit,
  isSubmitting,
}: InspectionTypeFormDialogProps) => {
  const isEdit = !!inspectionType;
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InspectionTypeFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", lat_long_required: false },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: inspectionType?.name ?? "",
        lat_long_required: !!inspectionType?.lat_long_required,
      });
    }
  }, [open, inspectionType, reset]);

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
      maxWidth="xs"
    >
      <DialogContent>
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg font-semibold">
            {isEdit ? "EDIT INSPECTION TYPE" : "ADD INSPECTION TYPE"}
          </h5>
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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Name"
            required
            placeholder="e.g. Fire safety"
            autoFocus
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: muiFieldStyles }}
            sx={{ mt: 1 }}
            error={!!errors.name}
            helperText={errors.name?.message}
            {...nameField}
            inputRef={nameRef}
          />

          {/* Add only — on existing types it's toggled from the list. */}
          {!isEdit && (
            <Controller
              control={control}
              name="lat_long_required"
              render={({ field }) => (
                <div className="flex items-center gap-3 mt-4">
                  <Label htmlFor="inspection-type-lat-long" className="text-sm font-medium">
                    Lat/Long Required
                  </Label>
                  <Switch
                    id="inspection-type-lat-long"
                    ref={field.ref}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </div>
              )}
            />
          )}

          <div className="flex gap-3 pt-6 items-center justify-end">
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
