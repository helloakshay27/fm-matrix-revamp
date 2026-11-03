import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { Dialog, DialogContent, TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { muiFieldStyles } from "@/features/vi-inspection/master/utils";
import type { TrainingCategory } from "../api/trainingCategoryApi";

const schema = z.object({
  category_name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name must be 100 characters or less"),
});

export type TrainingCategoryFormData = z.infer<typeof schema>;

interface TrainingCategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** When set, the dialog edits this record; otherwise it creates a new one. */
  category?: TrainingCategory | null;
  onSubmit: (data: TrainingCategoryFormData) => void;
  isSubmitting?: boolean;
}

export const TrainingCategoryFormDialog = ({
  open,
  onClose,
  category,
  onSubmit,
  isSubmitting,
}: TrainingCategoryFormDialogProps) => {
  const isEdit = !!category;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrainingCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: { category_name: "" },
  });

  useEffect(() => {
    if (open) reset({ category_name: category?.name ?? "" });
  }, [open, category, reset]);

  // MUI forwards `ref` to the wrapper div — RHF needs the <input> itself, via inputRef.
  const { ref: nameRef, ...nameField } = register("category_name");

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
          <h5 className="text-lg font-semibold">
            {isEdit ? "EDIT TRAINING CATEGORY" : "ADD TRAINING CATEGORY"}
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

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <TextField
            label="Category Name"
            required
            placeholder="e.g. OFC"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1, ...muiFieldStyles }}
            error={!!errors.category_name}
            helperText={errors.category_name?.message}
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
