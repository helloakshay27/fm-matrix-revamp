import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { moduleService, CreateModulePayload } from "@/services/moduleService";
import { TextField } from "@mui/material";

interface CreateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModuleCreated?: () => void;
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

export const CreateModuleDialog = ({
  open,
  onOpenChange,
  onModuleCreated,
}: CreateModuleDialogProps) => {
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

  const handleClose = () => {
    setFormData({
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
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateModulePayload = {
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

      await moduleService.createModule(payload);
      toast.success("Module created successfully");
      onModuleCreated?.();
      handleClose();
    } catch (error) {
      console.error("Error creating module:", error);
      toast.error("Failed to create module");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[500px] bg-white overflow-visible rounded-[24px] p-7">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Create New Module
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
                Module Name *
              </label>
              <TextField
                placeholder="Module Name *"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
                Abbreviation *
              </label>
              <TextField
                placeholder="Abbreviation *"
                value={formData.abbreviation}
                onChange={(e) =>
                  handleInputChange("abbreviation", e.target.value)
                }
                fullWidth
                variant="outlined"
                sx={fieldStyles}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
                Display Name *
              </label>
              <TextField
                placeholder="Display Name *"
                value={formData.show_name}
                onChange={(e) => handleInputChange("show_name", e.target.value)}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
              />
            </div>
          </div>

          <div className="fm-action-bar pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="fm-action-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="fm-action-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
