import { useEffect, useMemo } from "react";
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
import type { InspectionType } from "../api/inspectionTypeApi";
import type { InspectionChecklistQuestion } from "../api/inspectionChecklistApi";
import { muiFieldStyles, muiTextareaStyles } from "../utils";

const schema = z.object({
  inspection_type_id: z.string().min(1, "Inspection type is required"),
  question: z.string().trim().min(1, "Question is required").max(500, "Question must be 500 characters or less"),
});

export type InspectionChecklistFormData = z.infer<typeof schema>;

interface InspectionChecklistFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** When set, the dialog edits this record; otherwise it creates a new one. */
  checklistQuestion?: InspectionChecklistQuestion | null;
  inspectionTypes: InspectionType[];
  inspectionTypesLoading?: boolean;
  /** Pre-selects this type on create (e.g. the type the list is filtered by). */
  defaultInspectionTypeId?: string;
  onSubmit: (data: InspectionChecklistFormData) => void;
  isSubmitting?: boolean;
}

export const InspectionChecklistFormDialog = ({
  open,
  onClose,
  checklistQuestion,
  inspectionTypes,
  inspectionTypesLoading,
  defaultInspectionTypeId,
  onSubmit,
  isSubmitting,
}: InspectionChecklistFormDialogProps) => {
  const isEdit = !!checklistQuestion;
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InspectionChecklistFormData>({
    resolver: zodResolver(schema),
    defaultValues: { inspection_type_id: "", question: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        inspection_type_id: checklistQuestion
          ? String(checklistQuestion.inspection_type_id)
          : defaultInspectionTypeId ?? "",
        question: checklistQuestion?.question ?? "",
      });
    }
  }, [open, checklistQuestion, defaultInspectionTypeId, reset]);

  // Only active types can be picked — but keep the record's current type visible on edit.
  const options = useMemo(
    () =>
      inspectionTypes.filter(
        (type) => type.active || type.id === checklistQuestion?.inspection_type_id
      ),
    [inspectionTypes, checklistQuestion]
  );

  // MUI forwards `ref` to the wrapper div — RHF needs the <textarea> itself, via inputRef.
  const { ref: questionRef, ...questionField } = register("question");

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
            {isEdit ? "EDIT CHECKLIST QUESTION" : "ADD CHECKLIST QUESTION"}
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
          <Controller
            control={control}
            name="inspection_type_id"
            render={({ field }) => (
              <FormControl
                fullWidth
                variant="outlined"
                required
                error={!!errors.inspection_type_id}
                sx={{ mt: 1 }}
              >
                <InputLabel shrink>Inspection Type</InputLabel>
                <MuiSelect
                  label="Inspection Type"
                  value={field.value}
                  onChange={(e) => field.onChange(String(e.target.value))}
                  onBlur={field.onBlur}
                  displayEmpty
                  notched
                  disabled={inspectionTypesLoading}
                  sx={muiFieldStyles}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                >
                  <MenuItem value="" disabled>
                    <em>{inspectionTypesLoading ? "Loading inspection types..." : "Select inspection type"}</em>
                  </MenuItem>
                  {options.map((type) => (
                    <MenuItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.inspection_type_id && (
                  <FormHelperText>{errors.inspection_type_id.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <TextField
            label="Question"
            required
            placeholder="e.g. Are exits clear?"
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={muiTextareaStyles}
            error={!!errors.question}
            helperText={errors.question?.message}
            {...questionField}
            inputRef={questionRef}
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
