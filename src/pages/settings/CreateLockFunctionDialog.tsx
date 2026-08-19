import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { moduleService, LockModule } from "@/services/moduleService";
import {
  lockFunctionService,
  CreateLockFunctionPayload,
} from "@/services/lockFunctionService";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";

interface CreateLockFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLockFunctionCreated?: () => void;
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

export const CreateLockFunctionDialog = ({
  open,
  onOpenChange,
  onLockFunctionCreated,
}: CreateLockFunctionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modules, setModules] = useState<LockModule[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    action_name: "",
    module_id: "",
    lock_controller_id: "",
    phase_id: "",
    react_link: "",
    parent_function: "",
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await moduleService.fetchModules();
        setModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Failed to load modules");
      }
    };

    if (open) {
      fetchModules();
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Function name is required");
      return false;
    }
    if (!formData.action_name.trim()) {
      toast.error("Action name is required");
      return false;
    }
    if (!formData.module_id) {
      toast.error("Module selection is required");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      action_name: "",
      module_id: "",
      lock_controller_id: "",
      phase_id: "",
      react_link: "",
      parent_function: "",
    });
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateLockFunctionPayload = {
        lock_function: {
          name: formData.name,
          action_name: formData.action_name,
          active: true,
          module_id: parseInt(formData.module_id, 10),
          lock_controller_id: formData.lock_controller_id
            ? parseInt(formData.lock_controller_id, 10)
            : undefined,
          phase_id: formData.phase_id
            ? parseInt(formData.phase_id, 10)
            : undefined,
          react_link: formData.react_link || undefined,
          parent_function: formData.parent_function || undefined,
        },
      };

      const createdFunction =
        await lockFunctionService.createLockFunction(payload);

      if (createdFunction) {
        toast.success("Lock Function created successfully!");
        resetForm();
        onOpenChange(false);
        onLockFunctionCreated?.();
      } else {
        toast.error("Failed to create lock function");
      }
    } catch (error: any) {
      console.error("Error creating lock function:", error);
      toast.error(
        `Failed to create lock function: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
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
              Create Lock Function
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <TextField
            label="Function Name *"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            label="Action Name *"
            value={formData.action_name}
            onChange={(e) => handleInputChange("action_name", e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <FormControl fullWidth variant="outlined" className="sm:col-span-2">
            <InputLabel id="lock-function-module-label">Module *</InputLabel>
            <MuiSelect
              labelId="lock-function-module-label"
              label="Module *"
              value={formData.module_id}
              onChange={(e) =>
                handleInputChange("module_id", e.target.value as string)
              }
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Module</em>
              </MenuItem>
              {modules.map((module) => (
                <MenuItem
                  key={module.id}
                  value={module.id?.toString() || ""}
                >
                  {module.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="React Link"
            value={formData.react_link}
            onChange={(e) => handleInputChange("react_link", e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldStyles}
            className="sm:col-span-2"
          />

          <TextField
            label="Parent Function"
            value={formData.parent_function}
            onChange={(e) =>
              handleInputChange("parent_function", e.target.value)
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
            className="sm:col-span-2"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting}
            className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto disabled:!opacity-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "CREATE"
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateLockFunctionDialog;
