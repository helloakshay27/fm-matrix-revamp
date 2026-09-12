import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Checkbox,
  ListItemText,
  type MenuProps,
} from "@mui/material";
import { X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import { useAuthStore } from "@/stores/authStore";

interface Site {
  id: number;
  name: string;
}

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
    site_ids?: Array<string | number>;
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

const ALL_DELEGATION_FOR_VALUES = DELEGATION_FOR_OPTIONS.map((option) => option.value);

const emptyForm = {
  delegator_id: "",
  delegatee_id: "",
  site_ids: [] as string[],
  delegation_for: [...ALL_DELEGATION_FOR_VALUES] as string[],
  starts_at: "",
  ends_at: "",
  reason: "",
};

export const AddDelegationModal = ({ isOpen, onClose, onCreated, delegation }: AddDelegationModalProps) => {
  // Compute MenuProps at render time so we can attach the menu into
  // the dialog container and avoid viewport/positioning/overflow issues.
  // const dialogContainer = typeof document !== "undefined" ? document.getElementById("add-delegation-dialog") : undefined;
const delegateeMenuProps: Partial<MenuProps> = {
  PaperProps: {
    style: {
      maxHeight: 280,
      overflowY: "auto" as const,
    },
  },
};

const siteMenuProps: Partial<MenuProps> = {
  PaperProps: {
    style: {
      maxHeight: 280,
      overflowY: "auto" as const,
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

  const normalizeSiteIds = (value?: Array<string | number> | string | number) => {
    if (Array.isArray(value)) return value.map((id) => String(id));
    if (value === undefined || value === null || value === "") return [];
    return [String(value)];
  };

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});

    if (delegation) {
      const isoToDate = (v?: string) => (v && v.indexOf("T") > -1 ? v.split("T")[0] : v ?? "");
      setForm({
        delegator_id: delegation.delegator_id ? String(delegation.delegator_id) : String(currentUser?.id ?? ""),
        delegatee_id: delegation.delegatee_id ? String(delegation.delegatee_id) : "",
        site_ids: normalizeSiteIds(delegation.site_ids ?? delegation.site_id),
        delegation_for: delegation.delegation_for && delegation.delegation_for.length ? delegation.delegation_for : [...ALL_DELEGATION_FOR_VALUES],
        starts_at: isoToDate(delegation.starts_at),
        ends_at: isoToDate(delegation.ends_at),
        reason: delegation.reason ?? "",
      });
    } else {
      setForm({ ...emptyForm, delegation_for: [...ALL_DELEGATION_FOR_VALUES] });
      if (currentUser?.id) {
        setForm((prev) => ({ ...prev, delegator_id: String(currentUser.id) }));
      }
    }

    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [usersRes, sitesRes] = await Promise.all([
          apiClient.get("/pms/users/get_escalate_to_users.json"),
          apiClient.get("/pms/sites/allowed_sites.json"),
        ]);

        const fetchedSites = Array.isArray(sitesRes.data?.sites) ? sitesRes.data.sites : [];
        setUsers(Array.isArray(usersRes.data?.users) ? usersRes.data.users : []);
        setSites(fetchedSites);

        if (!delegation || !delegation.id) {
          setForm((prev) => ({
            ...prev,
            site_ids: prev.site_ids.length ? prev.site_ids : fetchedSites.map((site) => String(site.id)),
            delegation_for: prev.delegation_for.length ? prev.delegation_for : [...ALL_DELEGATION_FOR_VALUES],
          }));
        }
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

  const toggleDelegationFor = (value: string) => {
    setForm((prev) => {
      const exists = prev.delegation_for.includes(value);
      const nextValues = exists
        ? prev.delegation_for.filter((item) => item !== value)
        : [...prev.delegation_for, value];
      return { ...prev, delegation_for: nextValues };
    });
    setErrors((prev) => ({ ...prev, delegation_for: "" }));
  };

  const selectAllDelegationFor = () => {
    setForm((prev) => ({ ...prev, delegation_for: [...ALL_DELEGATION_FOR_VALUES] }));
    setErrors((prev) => ({ ...prev, delegation_for: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof typeof emptyForm, string>> = {};
    if (!form.delegatee_id) nextErrors.delegatee_id = "Delegatee is required.";
    if (!form.site_ids.length) nextErrors.site_ids = "At least one site is required.";
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
      const payload = {
        delegation: {
          delegator_id: form.delegator_id,
          delegatee_id: form.delegatee_id,
          site_ids: form.site_ids,
          delegation_for: form.delegation_for,
          starts_at: toIsoString(form.starts_at, "09:00:00"),
          ends_at: toIsoString(form.ends_at, "18:00:00"),
          reason: form.reason,
        },
      };

      if (delegation && delegation.id) {
        await apiClient.patch(`/delegations/${delegation.id}`, payload);
        toast.success("Delegation updated successfully");
      } else {
        await apiClient.post("/delegations", payload);
        toast.success("Delegation created successfully");
      }
      onCreated();
      onClose();
    } catch (error: any) {
      console.error("Error creating delegation:", error);

      let message = "Failed to save delegation";
      const responseData = error?.response?.data;

      if (typeof responseData === "string") {
        message = responseData;
      } else if (responseData && typeof responseData === "object") {
        const directMessage =
          responseData.message ||
          responseData.error ||
          responseData.errors?.message ||
          responseData.errors?.[0] ||
          responseData.detail;

        if (typeof directMessage === "string") {
          message = directMessage;
        } else if (Array.isArray(directMessage)) {
          const joined = directMessage.filter(Boolean).join(", ");
          if (joined) message = joined;
        } else if (responseData?.errors && typeof responseData.errors === "object") {
          const nested = Object.values(responseData.errors).flat().filter(Boolean);
          if (nested.length) message = nested.join(", ");
        }
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: 16,
          overflow: "visible",
          background: "white",
        },
      }}
    >
      <DialogContent
        id="add-delegation-dialog"
        className="w-full bg-white overflow-visible"
        sx={{ overflow: "visible" }}
      >
        <div className="flex items-center justify-between">
          <DialogTitle sx={{ p: 0, fontSize: 20, fontWeight: 600 }}>
            {isEdit ? "EDIT DELEGATION" : "ADD DELEGATION"}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

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

          <FormControl fullWidth required size="small" error={!!errors.site_ids}>
            <InputLabel>Site</InputLabel>
            <Select
              multiple
              value={form.site_ids}
              onChange={(event) => {
                const selected = event.target.value;
                const selectedValues = Array.isArray(selected) ? selected : [selected];
                if (selectedValues.includes("all")) {
                  updateField("site_ids", sites.map((site) => String(site.id)));
                  return;
                }
                updateField("site_ids", selectedValues.filter(Boolean) as string[]);
              }}
              label="Site"
              disabled={loadingOptions}
              renderValue={(selected) => {
                const selectedIds = selected as string[];
                if (selectedIds.length === 0) return "Select sites";
                if (selectedIds.length === sites.length && sites.length > 0) return "All sites selected";
                return selectedIds
                  .map((id) => sites.find((site) => String(site.id) === id)?.name)
                  .filter(Boolean)
                  .join(", ");
              }}
              MenuProps={siteMenuProps}
            >
              <MenuItem value="all" onClick={() => updateField("site_ids", sites.map((site) => String(site.id)))}>
                <Checkbox checked={sites.length > 0 && form.site_ids.length === sites.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {sites.map((site) => (
                <MenuItem key={site.id} value={String(site.id)}>
                  <Checkbox checked={form.site_ids.includes(String(site.id))} />
                  <ListItemText primary={site.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="rounded-md border border-gray-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Delegation For</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={selectAllDelegationFor}
              >
                Select All
              </Button>
            </div>

            <div className="space-y-2">
              {DELEGATION_FOR_OPTIONS.map((option) => {
                const checked = form.delegation_for.includes(option.value);
                return (
                  <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                    <Checkbox
                      checked={checked}
                      onChange={() => toggleDelegationFor(option.value)}
                      size="small"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>

            {errors.delegation_for && <p className="mt-2 text-xs text-red-500">{errors.delegation_for}</p>}
          </div>

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