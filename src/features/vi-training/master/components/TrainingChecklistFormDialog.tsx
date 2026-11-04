import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2, X } from "lucide-react";
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
import { muiFieldStyles, muiTextareaStyles } from "@/features/vi-inspection/master/utils";
import type { TrainingCategory } from "../api/trainingCategoryApi";
import {
  MAX_OPTIONS,
  MIN_OPTIONS,
  optionLetter,
  type TrainingQuestion,
} from "../api/trainingChecklistApi";

const schema = z
  .object({
    training_subject_id: z.string().min(1, "Training category is required"),
    question: z
      .string()
      .trim()
      .min(1, "Question is required")
      .max(500, "Question must be 500 characters or less"),
    options: z
      .array(z.object({ text: z.string().trim().min(1, "Option text is required") }))
      .min(MIN_OPTIONS, `Add at least ${MIN_OPTIONS} options`)
      .max(MAX_OPTIONS, `At most ${MAX_OPTIONS} options`),
    correct_answer: z.string().min(1, "Select the correct answer"),
  })
  .refine(
    (data) => {
      const index = data.correct_answer.charCodeAt(0) - 65;
      return index >= 0 && index < data.options.length;
    },
    { path: ["correct_answer"], message: "Select the correct answer" }
  );

export type TrainingChecklistFormData = z.infer<typeof schema>;

const EMPTY_OPTIONS = Array.from({ length: MIN_OPTIONS }, () => ({ text: "" }));

interface TrainingChecklistFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** When set, the dialog edits this record; otherwise it creates a new one. */
  question?: TrainingQuestion | null;
  categories: TrainingCategory[];
  categoriesLoading?: boolean;
  /** Pre-selects this category on create (e.g. the category the list is filtered by). */
  defaultCategoryId?: string;
  onSubmit: (data: TrainingChecklistFormData) => void;
  isSubmitting?: boolean;
}

export const TrainingChecklistFormDialog = ({
  open,
  onClose,
  question,
  categories,
  categoriesLoading,
  defaultCategoryId,
  onSubmit,
  isSubmitting,
}: TrainingChecklistFormDialogProps) => {
  const isEdit = !!question;
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TrainingChecklistFormData>({
    resolver: zodResolver(schema),
    defaultValues: { training_subject_id: "", question: "", options: EMPTY_OPTIONS, correct_answer: "" },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "options" });
  const optionCount = watch("options").length;

  useEffect(() => {
    if (!open) return;
    reset({
      training_subject_id: question
        ? String(question.training_subject_id)
        : defaultCategoryId ?? "",
      question: question?.question ?? "",
      options: question?.options?.length
        ? question.options.map((option) => ({ text: option.text }))
        : EMPTY_OPTIONS,
      correct_answer: question?.correct_answer ?? "",
    });
  }, [open, question, defaultCategoryId, reset]);

  // Only active categories can be picked — but keep the record's current category visible on edit.
  const options = useMemo(
    () =>
      categories.filter(
        (category) => category.active || category.id === question?.training_subject_id
      ),
    [categories, question]
  );

  // Removing an option shifts the letters after it, so keep the correct answer on the same option.
  const removeOption = (index: number) => {
    const current = getValues("correct_answer");
    const currentIndex = current ? current.charCodeAt(0) - 65 : -1;
    remove(index);
    if (currentIndex === index) setValue("correct_answer", "");
    else if (currentIndex > index) setValue("correct_answer", optionLetter(currentIndex - 1));
  };

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
            {isEdit ? "EDIT TRAINING QUESTION" : "ADD TRAINING QUESTION"}
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
            name="training_subject_id"
            render={({ field }) => (
              <FormControl
                fullWidth
                variant="outlined"
                required
                error={!!errors.training_subject_id}
                sx={{ mt: 1 }}
              >
                <InputLabel shrink>Training Category</InputLabel>
                <MuiSelect
                  label="Training Category"
                  value={field.value}
                  onChange={(e) => field.onChange(String(e.target.value))}
                  onBlur={field.onBlur}
                  displayEmpty
                  notched
                  // The API doesn't allow moving a question to another category.
                  disabled={categoriesLoading || isEdit}
                  sx={muiFieldStyles}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                >
                  <MenuItem value="" disabled>
                    <em>{categoriesLoading ? "Loading categories..." : "Select training category"}</em>
                  </MenuItem>
                  {options.map((category) => (
                    <MenuItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.training_subject_id ? (
                  <FormHelperText>{errors.training_subject_id.message}</FormHelperText>
                ) : (
                  isEdit && <FormHelperText>The category can't be changed after creation</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <TextField
            label="Question"
            required
            placeholder="e.g. Which training is applicable for Underground/ Fibre work?"
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={muiTextareaStyles}
            error={!!errors.question}
            helperText={errors.question?.message}
            {...questionField}
            inputRef={questionRef}
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[#1A1A18]">
                Options <span className="text-brand-error">*</span>
              </span>
              <span className="text-xs text-gray-500">
                {MIN_OPTIONS}–{MAX_OPTIONS} options
              </span>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => {
                const { ref, ...optionField } = register(`options.${index}.text`);
                return (
                  <div key={field.id} className="flex items-start gap-2">
                    <span className="mt-3 w-6 shrink-0 text-sm font-semibold text-gray-600">
                      {optionLetter(index)}.
                    </span>
                    <TextField
                      placeholder={`Option ${optionLetter(index)}`}
                      fullWidth
                      size="small"
                      variant="outlined"
                      error={!!errors.options?.[index]?.text}
                      helperText={errors.options?.[index]?.text?.message}
                      {...optionField}
                      inputRef={ref}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-8 w-8 p-0 text-brand-error hover:bg-gray-100"
                      onClick={() => removeOption(index)}
                      disabled={optionCount <= MIN_OPTIONS}
                      title="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
            {errors.options?.message && (
              <p className="mt-1 text-xs text-brand-error">{errors.options.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ text: "" })}
              disabled={optionCount >= MAX_OPTIONS}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add option
            </Button>
          </div>

          <Controller
            control={control}
            name="correct_answer"
            render={({ field }) => (
              <FormControl fullWidth variant="outlined" required error={!!errors.correct_answer}>
                <InputLabel shrink>Correct Answer</InputLabel>
                <MuiSelect
                  label="Correct Answer"
                  value={field.value}
                  onChange={(e) => field.onChange(String(e.target.value))}
                  onBlur={field.onBlur}
                  displayEmpty
                  notched
                  sx={muiFieldStyles}
                >
                  <MenuItem value="" disabled>
                    <em>Select the correct option</em>
                  </MenuItem>
                  {fields.map((_, index) => (
                    <MenuItem key={optionLetter(index)} value={optionLetter(index)}>
                      {optionLetter(index)}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.correct_answer && <FormHelperText>{errors.correct_answer.message}</FormHelperText>}
              </FormControl>
            )}
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
