import { useEffect, useState } from "react";
import { TextField, type MenuProps } from "@mui/material";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useViAuditMasters } from "./useViAuditMasters";
import {
  auditFieldSx,
  SelectField,
} from "./AuditFormFields";

/** Filters for an audit list page. Empty strings mean "not filtered". */
export interface ViAuditFilters {
  dateOfAudit: string;
  status: string;
  circle: string; // cluster id
  classification: string; // classification id
  personnelArea: string; // circle id
  workLocation: string; // work location id
  facilityType: string; // visit business area id
}

export const EMPTY_AUDIT_FILTERS: ViAuditFilters = {
  dateOfAudit: "",
  status: "",
  circle: "",
  classification: "",
  personnelArea: "",
  workLocation: "",
  facilityType: "",
};

export const activeAuditFilterCount = (filters: ViAuditFilters) =>
  Object.values(filters).filter(Boolean).length;

/** Ransack params for the list APIs (only the filters that are set). */
export const auditFiltersToParams = (filters: ViAuditFilters): Record<string, string> => {
  const map: [keyof ViAuditFilters, string][] = [
    ["dateOfAudit", "q[audit_date_eq]"],
    ["status", "q[status_eq]"],
    ["circle", "q[cluster_id_eq]"],
    // classification is an observation field: audits with at least one matching observation
    ["classification", "q[observations_classification_id_eq]"],
    ["personnelArea", "q[circle_id_eq]"],
    ["workLocation", "q[work_location_id_eq]"],
    ["facilityType", "q[visit_business_area_id_eq]"],
  ];
  return Object.fromEntries(map.filter(([key]) => filters[key]).map(([key, param]) => [param, filters[key]]));
};

// Dropdown menus inside the (Radix) dialog — same setup as the ticket filter: open right under
// the field, above the dialog, without MUI taking focus away from the dialog.
const FILTER_MENU_PROPS: Partial<MenuProps> = {
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
  disableScrollLock: true,
  sx: { zIndex: 9999 },
  PaperProps: {
    style: {
      maxHeight: 280,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
  },
};

// Clicks inside an open MUI menu mustn't count as "outside" the dialog (that would close it).
const isInsideMuiMenu = (target: EventTarget | null) =>
  target instanceof HTMLElement && !!target.closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root");

export interface AuditStatusOption {
  value: string;
  label: string;
}

/**
 * Filter dialog for the Vi Audit list pages. Each list page keeps its own filters and passes
 * the statuses that make sense for that role. Dropdowns use the Add Audit masters.
 */
export const AuditFilterDialog = ({
  open,
  onClose,
  filters,
  onApply,
  statusOptions,
}: {
  open: boolean;
  onClose: () => void;
  /** Currently applied filters (the dialog edits a copy until Apply). */
  filters: ViAuditFilters;
  onApply: (filters: ViAuditFilters) => void;
  statusOptions: AuditStatusOption[];
}) => {
  const { masters, loading } = useViAuditMasters();
  const [draft, setDraft] = useState<ViAuditFilters>(filters);

  // Start from the applied filters each time the dialog opens.
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const set = (key: keyof ViAuditFilters) => (value: string) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()} modal={false}>
      <DialogContent
        className="sm:max-w-2xl rounded-2xl p-8"
        onPointerDownOutside={(e) => {
          if (isInsideMuiMenu(e.target)) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isInsideMuiMenu(e.target)) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Filters</DialogTitle>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
          <TextField
            fullWidth
            type="date"
            label="Date of Audit"
            value={draft.dateOfAudit}
            onChange={(e) => set("dateOfAudit")(e.target.value)}
            sx={auditFieldSx}
            InputLabelProps={{ shrink: true }}
          />
          <SelectField
            menuProps={FILTER_MENU_PROPS}
            label="Status"
            value={draft.status}
            onChange={set("status")}
            options={statusOptions}
            placeholder="Select status"
          />
          <SelectField
            menuProps={FILTER_MENU_PROPS}
            label="Circle"
            value={draft.circle}
            onChange={set("circle")}
            options={masters.clusters}
            loading={loading}
            placeholder="Select audit circle"
          />
          <SelectField
            menuProps={FILTER_MENU_PROPS}
            label="Observation Classification"
            value={draft.classification}
            onChange={set("classification")}
            options={masters.classifications}
            loading={loading}
            placeholder="Select classification"
          />
          <SelectField
            menuProps={FILTER_MENU_PROPS}
            label="Personnel Area"
            value={draft.personnelArea}
            onChange={set("personnelArea")}
            options={masters.circles}
            loading={loading}
            placeholder="Select personnel area"
          />
          <SelectField
            menuProps={FILTER_MENU_PROPS}
            label="Work Location"
            value={draft.workLocation}
            onChange={set("workLocation")}
            options={masters.workLocations}
            loading={loading}
            placeholder="Select work location"
          />
          <SelectField
            menuProps={FILTER_MENU_PROPS}
            label="Type of Facility"
            value={draft.facilityType}
            onChange={set("facilityType")}
            options={masters.visitBusinessAreas}
            loading={loading}
            placeholder="Select type of facility"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            type="button"
            className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => {
              setDraft(EMPTY_AUDIT_FILTERS);
              onApply(EMPTY_AUDIT_FILTERS);
              onClose();
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
