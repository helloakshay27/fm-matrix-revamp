import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import { fetchSites, Site } from "@/services/sitesAPI";
import { useAuthStore } from "@/stores/authStore";

// MENU_PROPS: prefer rendering the menu into `document.body` (portal)
// which gives Popper a clean positioning context when parent elements use transforms.
const MENU_PROPS: any = {
  disablePortal: false,
  PaperProps: {
    style: {
      zIndex: 1400,
      maxHeight: 320,
    },
  },
};

interface User {
  id: number;
  full_name: string;
}

interface AddDelegationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  // optional delegation to edit; when provided the modal will operate in edit mode
  delegation?: {
    id?: number | string;
    delegator_id?: string | number;
    delegatee_id?: string | number;
    site_id?: string | number;
    delegation_for?: string[];
    starts_at?: string; // ISO or yyyy-mm-dd
    ends_at?: string;
    reason?: string;
  } | null;
}

// Delegation For options: value/label pairs
const DELEGATION_FOR_OPTIONS = [
  { value: "purchase_order_approval", label: "Purchase Order Approval" },
  { value: "work_order_approval", label: "Work Order Approval" },
  { value: "grn_approval", label: "GRN Approval" },
  { value: "work_order_invoice_approval", label: "Work Order Invoice Approval" },
];

const emptyForm = {
  delegator_id: "",
  delegatee_id: "",
  site_id: "",
  delegation_for: [] as string[],
  starts_at: "",
  ends_at: "",
  reason: "",
};

export const AddDelegationModal = ({ isOpen, onClose, onCreated, delegation }: AddDelegationModalProps) => {
  // Compute MenuProps at render time so we can attach the menu into
  // the dialog container and avoid viewport/positioning/overflow issues.
  // const dialogContainer = typeof document !== "undefined" ? document.getElementById("add-delegation-dialog") : undefined;
const delegateeMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 280,
      overflowY: "auto",
    },
  },
};

const siteMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 280,
      overflowY: "auto",
    },
  },
};
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const { user: currentUser } = useAuthStore();
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!delegation?.id;

  useEffect(() => {
    if (!isOpen) return;
    // reset errors
    setErrors({});

    // If editing an existing delegation, prefill the form from it.
    if (delegation) {
      const isoToDate = (v?: string) => (v && v.indexOf("T") > -1 ? v.split("T")[0] : v ?? "");
      setForm({
        delegator_id: delegation.delegator_id ? String(delegation.delegator_id) : String(currentUser?.id ?? ""),
        delegatee_id: delegation.delegatee_id ? String(delegation.delegatee_id) : "",
        site_id: delegation.site_id ? String(delegation.site_id) : "",
        delegation_for: delegation.delegation_for ?? [],
        starts_at: isoToDate(delegation.starts_at),
        ends_at: isoToDate(delegation.ends_at),
        reason: delegation.reason ?? "",
      });
    } else {
      // new delegation: reset form and pre-fill delegator
      setForm(emptyForm);
      if (currentUser?.id) {
        setForm((prev) => ({ ...prev, delegator_id: String(currentUser.id) }));
      }
    }

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

  const updateField = (field: keyof typeof emptyForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof typeof emptyForm, string>> = {};
    // if (!form.delegator_id) nextErrors.delegator_id = "Delegator is required.";
    if (!form.delegatee_id) nextErrors.delegatee_id = "Delegatee is required.";
    if (!form.site_id) nextErrors.site_id = "Site is required.";
    if (!form.delegation_for.length) nextErrors.delegation_for = "Delegation For is required.";
    if (!form.starts_at) nextErrors.starts_at = "Start date is required.";
    if (!form.ends_at) nextErrors.ends_at = "End date is required.";
    if (form.starts_at && form.ends_at && form.starts_at > form.ends_at) {
      nextErrors.ends_at = "End date must be on or after the start date.";
    }
    if (!form.reason.trim()) nextErrors.reason = "Reason is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Converts a yyyy-mm-dd date input value into an ISO 8601 UTC string,
  // matching the "2026-09-10T09:00:00Z" shape expected by the API.
  const toIsoString = (dateValue: string, time = "00:00:00") => {
    if (!dateValue) return "";
    return `${dateValue}T${time}Z`;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (delegation && delegation.id) {
        await apiClient.patch(`/delegations/${delegation.id}`, {
          delegation: {
            delegator_id: form.delegator_id,
            delegatee_id: form.delegatee_id,
            site_id: form.site_id,
            delegation_for: form.delegation_for,
            starts_at: toIsoString(form.starts_at, "09:00:00"),
            ends_at: toIsoString(form.ends_at, "18:00:00"),
            reason: form.reason,
          },
        });
        toast.success("Delegation updated successfully");
      } else {
        await apiClient.post("/delegations", {
          delegation: {
            delegator_id: form.delegator_id,
            delegatee_id: form.delegatee_id,
            site_id: form.site_id,
            delegation_for: form.delegation_for,
            starts_at: toIsoString(form.starts_at, "09:00:00"),
            ends_at: toIsoString(form.ends_at, "18:00:00"),
            reason: form.reason,
          },
        });
        toast.success("Delegation created successfully");
      }
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating delegation:", error);
      toast.error("Failed to save delegation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<Dialog open={isOpen} onOpenChange={onClose} modal={false}>      <DialogContent
        id="add-delegation-dialog"
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
            <DialogTitle className="text-lg font-semibold">{isEdit ? "EDIT DELEGATION" : "ADD DELEGATION"}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <FormControl fullWidth required size="small" error={!!errors.delegatee_id}>
            <InputLabel>Delegatee</InputLabel>
            <Select
              value={form.delegatee_id}
              onChange={(e) => updateField("delegatee_id", String(e.target.value))}
              label="Delegatee"
              disabled={loadingOptions}
              MenuProps={delegateeMenuProps}
            >
              <MenuItem value="">
                <em>Select a user</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={String(user.id)}>
                  {user.full_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required size="small" error={!!errors.site_id}>
            <InputLabel>Site</InputLabel>
            <Select
              value={form.site_id}
              onChange={(e) => updateField("site_id", String(e.target.value))}
              label="Site"
              disabled={loadingOptions}
              MenuProps={siteMenuProps}
            >
              <MenuItem value="">
                <em>Select a site</em>
              </MenuItem>
              {sites.map((site) => (
                <MenuItem key={site.id} value={String(site.id)}>
                  {site.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            multiple
            options={DELEGATION_FOR_OPTIONS}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            value={DELEGATION_FOR_OPTIONS.filter((o) => form.delegation_for.includes(o.value))}
            onChange={(_, newValue) => updateField("delegation_for", newValue.map((v) => v.value))}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={{ mr: 1 }} />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Delegation For"
                size="small"
                required
                error={!!errors.delegation_for}
                helperText={errors.delegation_for}
              />
            )}
            // PopperProps={{
            //   modifiers: [
            //     { name: "preventOverflow", options: { boundary: dialogContainer || undefined } },
            //     { name: "flip", enabled: false },
            //   ],
            // }}
PaperComponent={(props) => (
  <div {...props} style={{ maxHeight: 320, overflow: "auto" }} />
)}
            disabled={loadingOptions}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Starts At"
              type="date"
              value={form.starts_at}
              onChange={(e) => updateField("starts_at", e.target.value)}
              fullWidth
              required
              size="small"
              InputLabelProps={{ shrink: true }}
              error={!!errors.starts_at}
              helperText={errors.starts_at}
            />
            <TextField
              label="Ends At"
              type="date"
              value={form.ends_at}
              onChange={(e) => updateField("ends_at", e.target.value)}
              fullWidth
              required
              size="small"
              InputLabelProps={{ shrink: true }}
              error={!!errors.ends_at}
              helperText={errors.ends_at}
            />
          </div>

          <TextField
            label="Reason"
            value={form.reason}
            onChange={(e) => updateField("reason", e.target.value)}
            fullWidth
            required
            multiline
            rows={3}
            size="small"
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
            {isSubmitting ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Update Delegation" : "Create Delegation"}
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