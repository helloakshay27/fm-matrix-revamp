import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import { fetchSites, Site } from "@/services/sitesAPI";

interface User {
  id: number;
  full_name: string;
}

interface AddDelegationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
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

const emptyForm = {
  delegate_for_id: "",
  delegatee_id: "",
  site_id: "",
  starts_at: "",
  ends_at: "",
  reason: "",
};

export const AddDelegationModal = ({ isOpen, onClose, onCreated }: AddDelegationModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(emptyForm);
    setErrors({});

    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [usersRes, sitesRes] = await Promise.all([
          apiClient.get("/pms/users/get_escalate_to_users.json"),
          fetchSites(),
        ]);
        setUsers(Array.isArray(usersRes.data?.users) ? usersRes.data.users : []);
        setSites(sitesRes.sites);
      } catch (error) {
        console.error("Error loading delegation form options:", error);
        setUsers([]);
        setSites([]);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [isOpen]);

  const updateField = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof typeof emptyForm, string>> = {};
    if (!form.delegate_for_id) nextErrors.delegate_for_id = "Delegate For is required.";
    if (!form.delegatee_id) nextErrors.delegatee_id = "Delegatee is required.";
    if (!form.site_id) nextErrors.site_id = "Site is required.";
    if (!form.starts_at) nextErrors.starts_at = "Start date is required.";
    if (!form.ends_at) nextErrors.ends_at = "End date is required.";
    if (form.starts_at && form.ends_at && form.starts_at > form.ends_at) {
      nextErrors.ends_at = "End date must be on or after the start date.";
    }
    if (!form.reason.trim()) nextErrors.reason = "Reason is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await apiClient.post("/delegations", {
        delegation: {
          delegate_for_id: form.delegate_for_id,
          delegatee_id: form.delegatee_id,
          site_id: form.site_id,
          delegation_for: "purchase_order_approval",
          starts_at: form.starts_at,
          ends_at: form.ends_at,
          reason: form.reason,
        },
      });
      toast.success("Delegation created successfully");
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating delegation:", error);
      toast.error("Failed to create delegation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full sm:max-w-[500px] bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          if ((e.target as HTMLElement).closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root")) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root")) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">ADD DELEGATION</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <FormControl fullWidth variant="outlined" error={!!errors.delegate_for_id}>
            <InputLabel shrink>Delegate For *</InputLabel>
            <MuiSelect
              label="Delegate For *"
              displayEmpty
              value={form.delegate_for_id}
              onChange={(e) => updateField("delegate_for_id", String(e.target.value))}
              sx={fieldStyles}
              disabled={loadingOptions}
            >
              <MenuItem value="">
                <em>Select Delegate For</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={String(user.id)}>
                  {user.full_name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" error={!!errors.delegatee_id}>
            <InputLabel shrink>Delegatee *</InputLabel>
            <MuiSelect
              label="Delegatee *"
              displayEmpty
              value={form.delegatee_id}
              onChange={(e) => updateField("delegatee_id", String(e.target.value))}
              sx={fieldStyles}
              disabled={loadingOptions}
            >
              <MenuItem value="">
                <em>Select Delegatee</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={String(user.id)}>
                  {user.full_name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" error={!!errors.site_id}>
            <InputLabel shrink>Site *</InputLabel>
            <MuiSelect
              label="Site *"
              displayEmpty
              value={form.site_id}
              onChange={(e) => updateField("site_id", String(e.target.value))}
              sx={fieldStyles}
              disabled={loadingOptions}
            >
              <MenuItem value="">
                <em>Select Site</em>
              </MenuItem>
              {sites.map((site) => (
                <MenuItem key={site.id} value={String(site.id)}>
                  {site.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="Delegation For"
            value="Purchase Order Approval"
            fullWidth
            variant="outlined"
            disabled
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Starts At *"
              type="date"
              value={form.starts_at}
              onChange={(e) => updateField("starts_at", e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              error={!!errors.starts_at}
              helperText={errors.starts_at}
              sx={fieldStyles}
            />
            <TextField
              label="Ends At *"
              type="date"
              value={form.ends_at}
              onChange={(e) => updateField("ends_at", e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              error={!!errors.ends_at}
              helperText={errors.ends_at}
              sx={fieldStyles}
            />
          </div>

          <TextField
            label="Reason *"
            value={form.reason}
            onChange={(e) => updateField("reason", e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            error={!!errors.reason}
            helperText={errors.reason}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
          >
            {isSubmitting ? "Creating..." : "Create Delegation"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-brand text-brand px-8 w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
