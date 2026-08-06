import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  lockSubFunctionService,
  LockSubFunction,
  UpdateLockSubFunctionPayload,
} from "@/services/lockSubFunctionService";
import { lockFunctionService, LockFunction } from "@/services/lockFunctionService";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";

interface EditLockSubFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockSubFunctionId: number | null;
  onLockSubFunctionUpdated?: () => void;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 14px" },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const EditLockSubFunctionDialog = ({
  open,
  onOpenChange,
  lockSubFunctionId,
  onLockSubFunctionUpdated,
}: EditLockSubFunctionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lockFunctions, setLockFunctions] = useState<LockFunction[]>([]);
  const [lockSubFunction, setLockSubFunction] =
    useState<LockSubFunction | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sub_function_name: "",
    active: true,
    lock_function_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!open || !lockSubFunctionId) return;

      setLoading(true);
      try {
        const [subFunctionData, functionsData] = await Promise.all([
          lockSubFunctionService.fetchLockSubFunction(lockSubFunctionId),
          lockFunctionService.fetchLockFunctions(),
        ]);

        setLockSubFunction(subFunctionData);
        setLockFunctions(functionsData);
        setFormData({
          name: subFunctionData.name || "",
          sub_function_name: subFunctionData.sub_function_name || "",
          active: Boolean(subFunctionData.active),
          lock_function_id:
            subFunctionData.lock_function_id?.toString() || "",
        });
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(`Failed to load data: ${error.message}`);
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, lockSubFunctionId, onOpenChange]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (
      !lockSubFunction ||
      !formData.sub_function_name.trim() ||
      !formData.lock_function_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpdateLockSubFunctionPayload = {
        lock_sub_function: {
          name: formData.name.trim() || formData.sub_function_name.trim(),
          sub_function_name: formData.sub_function_name.trim(),
          active: formData.active,
          lock_function_id: parseInt(formData.lock_function_id, 10),
        },
      };

      await lockSubFunctionService.updateLockSubFunction(
        lockSubFunction.id,
        payload
      );
      toast.success("Lock sub function updated successfully!");
      onOpenChange(false);
      onLockSubFunctionUpdated?.();
    } catch (error: any) {
      console.error("Error updating lock sub function:", error);
      toast.error(
        `Failed to update lock sub function: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="w-full sm:max-w-[500px] bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              ".MuiPopover-root, .MuiModal-root, .MuiMenu-root"
            )
          ) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              ".MuiPopover-root, .MuiModal-root, .MuiMenu-root"
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Edit Lock Sub Function
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <TextField
                label="Sub Function Name *"
                value={formData.sub_function_name}
                onChange={(e) =>
                  handleChange("sub_function_name", e.target.value)
                }
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                className="sm:col-span-2"
              />

              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                className="sm:col-span-2"
              />

              <FormControl
                fullWidth
                variant="outlined"
                className="sm:col-span-2"
              >
                <InputLabel id="edit-sub-fn-parent-label">
                  Parent Function *
                </InputLabel>
                <MuiSelect
                  labelId="edit-sub-fn-parent-label"
                  label="Parent Function *"
                  value={formData.lock_function_id}
                  onChange={(e) =>
                    handleChange(
                      "lock_function_id",
                      e.target.value as string
                    )
                  }
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select parent function</em>
                  </MenuItem>
                  {lockFunctions.map((func) => (
                    <MenuItem key={func.id} value={func.id.toString()}>
                      {func.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <div className="flex items-center space-x-2 sm:col-span-2 pt-1">
                <Checkbox
                  id="edit-sub-fn-active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    handleChange("active", checked === true)
                  }
                />
                <Label
                  htmlFor="edit-sub-fn-active"
                  className="text-sm font-medium"
                >
                  Active
                </Label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto disabled:!opacity-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "UPDATE"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="border-brand text-brand px-8 w-full sm:w-auto"
              >
                CANCEL
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditLockSubFunctionDialog;
