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
  CreateLockSubFunctionPayload,
} from "@/services/lockSubFunctionService";
import { lockFunctionService } from "@/services/lockFunctionService";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";

interface CreateLockSubFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLockSubFunctionCreated?: () => void;
}

interface LockFunctionOption {
  id: number;
  name: string;
}

const PREDEFINED_SUB_FUNCTIONS = [
  { value: "add", label: "Add" },
  { value: "edit", label: "Edit" },
  { value: "list", label: "List" },
  { value: "export", label: "Export" },
  { value: "import", label: "Import" },
  { value: "delete", label: "Delete" },
  { value: "view", label: "View" },
  { value: "approve", label: "Approve" },
  { value: "reject", label: "Reject" },
  { value: "custom", label: "Custom (Enter manually)" },
];

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

export const CreateLockSubFunctionDialog = ({
  open,
  onOpenChange,
  onLockSubFunctionCreated,
}: CreateLockSubFunctionDialogProps) => {
  const [subFunctionName, setSubFunctionName] = useState("");
  const [selectedPredefined, setSelectedPredefined] = useState("");
  const [parentFunctionId, setParentFunctionId] = useState("");
  const [lockFunctions, setLockFunctions] = useState<LockFunctionOption[]>([]);
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFunctions, setIsLoadingFunctions] = useState(true);

  useEffect(() => {
    const fetchLockFunctions = async () => {
      if (!open) return;

      setIsLoadingFunctions(true);
      try {
        const data = await lockFunctionService.fetchLockFunctions();
        setLockFunctions(
          data.map((func) => ({
            id: func.id,
            name: func.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching lock functions:", error);
        toast.error("Failed to load lock functions");
      } finally {
        setIsLoadingFunctions(false);
      }
    };

    fetchLockFunctions();
  }, [open]);

  const validateForm = () => {
    if (!subFunctionName.trim()) {
      toast.error("Sub function name is required");
      return false;
    }
    if (!parentFunctionId) {
      toast.error("Please select a parent function");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setSubFunctionName("");
    setSelectedPredefined("");
    setParentFunctionId("");
    setActive(true);
  };

  const handlePredefinedChange = (value: string) => {
    setSelectedPredefined(value);
    if (value !== "custom") {
      const selected = PREDEFINED_SUB_FUNCTIONS.find(
        (item) => item.value === value
      );
      if (selected) {
        setSubFunctionName(selected.label);
      }
    } else {
      setSubFunctionName("");
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload: CreateLockSubFunctionPayload = {
      lock_sub_function: {
        lock_function_id: parseInt(parentFunctionId, 10),
        name: subFunctionName,
        sub_function_name: subFunctionName,
        active,
      },
    };

    try {
      await lockSubFunctionService.createLockSubFunction(payload);
      toast.success("Lock Sub Function created successfully!");
      resetForm();
      onOpenChange(false);
      onLockSubFunctionCreated?.();
    } catch (error: any) {
      console.error("Error creating lock sub function:", error);
      toast.error(
        `Failed to create lock sub function: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const nameDisabled =
    selectedPredefined !== "custom" && selectedPredefined !== "";

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
              Create Lock Sub Function
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
          <FormControl fullWidth variant="outlined" className="sm:col-span-2">
            <InputLabel id="create-sub-fn-type-label">
              Sub Function Type
            </InputLabel>
            <MuiSelect
              labelId="create-sub-fn-type-label"
              label="Sub Function Type"
              value={selectedPredefined}
              onChange={(e) => handlePredefinedChange(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select type</em>
              </MenuItem>
              {PREDEFINED_SUB_FUNCTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="Sub Function Name *"
            value={subFunctionName}
            onChange={(e) => setSubFunctionName(e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldStyles}
            disabled={nameDisabled}
            className="sm:col-span-2"
          />

          <FormControl fullWidth variant="outlined" className="sm:col-span-2">
            <InputLabel id="create-sub-fn-parent-label">
              Parent Function *
            </InputLabel>
            <MuiSelect
              labelId="create-sub-fn-parent-label"
              label="Parent Function *"
              value={parentFunctionId}
              onChange={(e) => setParentFunctionId(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
              disabled={isLoadingFunctions}
            >
              <MenuItem value="">
                <em>
                  {isLoadingFunctions
                    ? "Loading..."
                    : lockFunctions.length === 0
                      ? "No functions available"
                      : "Select parent function"}
                </em>
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
              id="create-sub-fn-active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked === true)}
            />
            <Label htmlFor="create-sub-fn-active" className="text-sm font-medium">
              Active
            </Label>
          </div>
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

export default CreateLockSubFunctionDialog;
