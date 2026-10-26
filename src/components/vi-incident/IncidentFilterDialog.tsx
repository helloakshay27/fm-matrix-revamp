import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IncidentSelectField } from "./IncidentFormFields";
import type { MasterOption } from "@/components/vi-audit/useViAuditMasters";
import { useViIncidentMasters } from "./viIncidentApi";

// Filter values hold master ids / the workflow status key; the list sends them to the API.
export interface IncidentFilters {
  dateFrom: string; // yyyy-mm-dd
  dateTo: string; // yyyy-mm-dd
  timeOfIncident: string; // hh:mm (24h)
  status: string; // workflow_status key
  circle: string;
  classification: string;
  category: string;
  subCategory: string;
  personnelArea: string;
  workLocation: string;
  facilityType: string;
  function: string;
}

export const EMPTY_INCIDENT_FILTERS: IncidentFilters = {
  dateFrom: "",
  dateTo: "",
  timeOfIncident: "",
  status: "",
  circle: "",
  classification: "",
  category: "",
  subCategory: "",
  personnelArea: "",
  workLocation: "",
  facilityType: "",
  function: "",
};

/** The list endpoints' query params (workflow_status + ransack q[...]) for the applied filters. */
export const incidentFiltersToQuery = (filters: IncidentFilters): Record<string, string> => {
  const query: Record<string, string> = {
    workflow_status: filters.status,
    "q[incident_date_gteq]": filters.dateFrom,
    "q[incident_date_lteq]": filters.dateTo,
    "q[incident_time_eq]": filters.timeOfIncident,
    "q[circle_id_eq]": filters.circle,
    "q[classification_id_eq]": filters.classification,
    "q[category_id_eq]": filters.category,
    "q[sub_category_id_eq]": filters.subCategory,
    "q[personal_area_id_eq]": filters.personnelArea,
    "q[work_location_id_eq]": filters.workLocation,
    "q[facility_type_id_eq]": filters.facilityType,
    "q[department_id_eq]": filters.function,
  };
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value));
};

/** Filters dialog shared by every incident list (Reporter / SPOC / Action Owner / Functional Head). */
export const IncidentFilterDialog = ({
  open,
  onClose,
  filters,
  onApply,
  statusOptions,
}: {
  open: boolean;
  onClose: () => void;
  filters: IncidentFilters;
  onApply: (filters: IncidentFilters) => void;
  /** Workflow statuses from the role's dashboard (see dashboardWorkflowOptions). */
  statusOptions: MasterOption[];
}) => {
  const { masters, loading } = useViIncidentMasters();
  const [draft, setDraft] = useState<IncidentFilters>(filters);

  // Start from the applied filters each time the dialog opens.
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const set = (patch: Partial<IncidentFilters>) => setDraft((prev) => ({ ...prev, ...patch }));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {/* Centred with margins and NO transform: select menus render inside the dialog (disablePortal, so
          picking an option isn't an "outside click"), and any transform on an ancestor — even
          translate(0,0) — becomes their positioning frame, pushing them away from the input. */}
      <DialogContent className="left-0 right-0 top-[5vh] mx-auto translate-x-0 translate-y-0 transform-none data-[state=open]:animate-none data-[state=closed]:animate-none sm:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#1A1A18]">Filters</DialogTitle>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
          <TextField
            fullWidth
            type="date"
            label="Date of Incident — From"
            value={draft.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            inputProps={{ max: draft.dateTo || undefined }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="date"
            label="Date of Incident — To"
            value={draft.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            inputProps={{ min: draft.dateFrom || undefined }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="time"
            label="Time of Incident"
            value={draft.timeOfIncident}
            onChange={(e) => set({ timeOfIncident: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <IncidentSelectField
            label="Status"
            value={draft.status}
            onChange={(v) => set({ status: v })}
            options={statusOptions}
            placeholder="Select status"
          />
          <IncidentSelectField
            label="Circle"
            value={draft.circle}
            onChange={(v) => set({ circle: v })}
            options={masters.circles}
            loading={loading}
            placeholder="Select incident circle"
          />
          <IncidentSelectField
            label="Incident classification"
            value={draft.classification}
            onChange={(v) => set({ classification: v })}
            options={masters.classifications}
            loading={loading}
            placeholder="Select classification"
          />
          <IncidentSelectField
            label="Category"
            value={draft.category}
            onChange={(v) => set({ category: v })}
            options={masters.categories}
            loading={loading}
            placeholder="Select category"
          />
          <IncidentSelectField
            label="Sub Category"
            value={draft.subCategory}
            onChange={(v) => set({ subCategory: v })}
            options={masters.subCategories}
            loading={loading}
            placeholder="Select sub category"
          />
          <IncidentSelectField
            label="Personnel Area"
            value={draft.personnelArea}
            onChange={(v) => set({ personnelArea: v })}
            options={masters.personalAreas}
            loading={loading}
            placeholder="Select personnel area"
          />
          <IncidentSelectField
            label="Work Location"
            value={draft.workLocation}
            onChange={(v) => set({ workLocation: v })}
            options={masters.workLocations}
            loading={loading}
            placeholder="Select work location"
          />
          <IncidentSelectField
            label="Type of Facility"
            value={draft.facilityType}
            onChange={(v) => set({ facilityType: v })}
            options={masters.facilityTypes}
            loading={loading}
            placeholder="Select type of facility"
          />
          <IncidentSelectField
            label="Function"
            value={draft.function}
            onChange={(v) => set({ function: v })}
            options={masters.departments}
            loading={loading}
            placeholder="Select function"
          />
        </div>

        <div className="fm-action-bar pt-4">
          <button
            type="button"
            className="fm-action-secondary"
            onClick={() => {
              setDraft(EMPTY_INCIDENT_FILTERS);
              onApply(EMPTY_INCIDENT_FILTERS);
              onClose();
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="fm-action-primary"
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
