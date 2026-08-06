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
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  moduleService,
  LockModule,
  CreateModulePayload,
} from "@/services/moduleService";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";

interface EditModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: LockModule;
  onModuleUpdated?: () => void;
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

export const EditModuleDialog = ({
  open,
  onOpenChange,
  module,
  onModuleUpdated,
}: EditModuleDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    show_name: "",
    module_type: "",
    charged_per: "",
    no_of_licences: 10,
    min_billing: 1000,
    rate: 150,
    max_billing: 5000,
    total_billing: 2000,
    rate_type: "fixed",
    active: true,
    phase_id: 1,
  });

  useEffect(() => {
    if (module) {
      setFormData({
        name: module.name || "",
        abbreviation: module.abbreviation || "",
        show_name: module.show_name || "",
        module_type: module.module_type || "",
        charged_per: module.charged_per || "",
        no_of_licences: module.no_of_licences || 10,
        min_billing: module.min_billing || 1000,
        rate: module.rate || 150,
        max_billing: module.max_billing || 5000,
        total_billing: module.total_billing || 2000,
        rate_type: module.rate_type || "fixed",
        active: module.active,
        phase_id: module.phase_id || 1,
      });
    }
  }, [module]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Module name is required");
      return false;
    }
    if (!formData.abbreviation.trim()) {
      toast.error("Abbreviation is required");
      return false;
    }
    if (!formData.show_name.trim()) {
      toast.error("Display name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !module.id) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<CreateModulePayload> = {
        lock_module: {
          name: formData.name,
          abbreviation: formData.abbreviation,
          show_name: formData.show_name,
          module_type: formData.module_type,
          charged_per: formData.charged_per,
          no_of_licences: formData.no_of_licences,
          min_billing: formData.min_billing,
          rate: formData.rate,
          max_billing: formData.max_billing,
          total_billing: formData.total_billing,
          rate_type: formData.rate_type,
          active: formData.active,
          phase_id: formData.phase_id,
        },
      };

      const response = await moduleService.updateModule(module.id, payload);

      if (response.success) {
        toast.success("Module updated successfully");
        onModuleUpdated?.();
        onOpenChange(false);
      } else {
        toast.error(response.message || "Failed to update module");
      }
    } catch (error) {
      console.error("Error updating module:", error);
      toast.error("Failed to update module");
    } finally {
      setIsSubmitting(false);
    }
  };

  const moduleTypeOptions = [
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
    { value: "enterprise", label: "Enterprise" },
    { value: "custom", label: "Custom" },
  ];

  const chargedPerOptions = [
    { value: "user", label: "Per User" },
    { value: "license", label: "Per License" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const rateTypeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "variable", label: "Variable" },
    { value: "tiered", label: "Tiered" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="w-full sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white overflow-x-visible"
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
              Edit Module
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <TextField
              label="Module Name *"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <TextField
              label="Abbreviation *"
              value={formData.abbreviation}
              onChange={(e) =>
                handleInputChange("abbreviation", e.target.value)
              }
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <TextField
              label="Display Name *"
              value={formData.show_name}
              onChange={(e) => handleInputChange("show_name", e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              className="sm:col-span-2"
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel id="edit-module-type-label">Module Type</InputLabel>
              <MuiSelect
                labelId="edit-module-type-label"
                label="Module Type"
                value={formData.module_type}
                onChange={(e) =>
                  handleInputChange("module_type", e.target.value)
                }
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Module Type</em>
                </MenuItem>
                {moduleTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="edit-charged-per-label">Charged Per</InputLabel>
              <MuiSelect
                labelId="edit-charged-per-label"
                label="Charged Per"
                value={formData.charged_per}
                onChange={(e) =>
                  handleInputChange("charged_per", e.target.value)
                }
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Charging Basis</em>
                </MenuItem>
                {chargedPerOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              label="Number of Licenses"
              type="number"
              value={formData.no_of_licences}
              onChange={(e) =>
                handleInputChange(
                  "no_of_licences",
                  parseInt(e.target.value, 10) || 0
                )
              }
              inputProps={{ min: 1 }}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <TextField
              label="Phase ID"
              type="number"
              value={formData.phase_id}
              onChange={(e) =>
                handleInputChange(
                  "phase_id",
                  parseInt(e.target.value, 10) || 1
                )
              }
              inputProps={{ min: 1 }}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <TextField
              label="Rate"
              type="number"
              value={formData.rate}
              onChange={(e) =>
                handleInputChange("rate", parseFloat(e.target.value) || 0)
              }
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel id="edit-rate-type-label">Rate Type</InputLabel>
              <MuiSelect
                labelId="edit-rate-type-label"
                label="Rate Type"
                value={formData.rate_type}
                onChange={(e) =>
                  handleInputChange("rate_type", e.target.value)
                }
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                {rateTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              label="Minimum Billing"
              type="number"
              value={formData.min_billing}
              onChange={(e) =>
                handleInputChange(
                  "min_billing",
                  parseFloat(e.target.value) || 0
                )
              }
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <TextField
              label="Maximum Billing"
              type="number"
              value={formData.max_billing}
              onChange={(e) =>
                handleInputChange(
                  "max_billing",
                  parseFloat(e.target.value) || 0
                )
              }
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <TextField
              label="Total Billing"
              type="number"
              value={formData.total_billing}
              onChange={(e) =>
                handleInputChange(
                  "total_billing",
                  parseFloat(e.target.value) || 0
                )
              }
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              className="sm:col-span-2"
            />

            <div className="flex items-center space-x-2 sm:col-span-2 pt-1">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  handleInputChange("active", checked)
                }
              />
              <Label htmlFor="active" className="text-sm font-medium">
                Active
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto disabled:!opacity-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "UPDATE"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-brand text-brand px-8 w-full sm:w-auto"
            >
              CANCEL
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
