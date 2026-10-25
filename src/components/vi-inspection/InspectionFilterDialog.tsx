import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { auditFieldSx } from "@/components/vi-audit/ViAuditUi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IncidentSelectField } from "@/components/vi-incident/IncidentFormFields";
import type { ViInspectionMasters } from "./viInspectionApi";
import { statusFilterOptions, type ViInspectionRole } from "./viInspectionData";

/**
 * The list filters, keyed by their API / URL parameter names (API.md §6) — the list page keeps them in
 * the URL and sends them to the API as-is.
 */
export const INSPECTION_FILTER_KEYS = [
  "date_from",
  "date_to",
  "status",
  "circle_id",
  "personal_area_id",
  "work_location_id",
  "facility_type_id",
  "inspection_type_id",
] as const;

export type InspectionFilterKey = (typeof INSPECTION_FILTER_KEYS)[number];
export type InspectionFilters = Record<InspectionFilterKey, string>;

export const EMPTY_INSPECTION_FILTERS = Object.fromEntries(
  INSPECTION_FILTER_KEYS.map((key) => [key, ""]),
) as InspectionFilters;

/** Filters dialog shared by the four inspection lists. */
export const InspectionFilterDialog = ({
  role,
  open,
  onClose,
  filters,
  onApply,
  masters,
  loading,
}: {
  role: ViInspectionRole;
  open: boolean;
  onClose: () => void;
  filters: InspectionFilters;
  onApply: (filters: InspectionFilters) => void;
  /** Dropdown masters, loaded once by the list page. */
  masters: ViInspectionMasters;
  loading: boolean;
}) => {
  const [draft, setDraft] = useState<InspectionFilters>(filters);

  // Start from the applied (URL) filters each time the dialog opens.
  useEffect(() => {
    if (open) setDraft(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (patch: Partial<InspectionFilters>) => setDraft((prev) => ({ ...prev, ...patch }));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {/* Centred with mx-auto instead of translate(-50%): once open the dialog has no transform, so the
          select menus (disablePortal) open right under their inputs. It keeps the standard fade + zoom
          (the transform only exists while animating); the slide offsets are zeroed because they assume
          the translate-centred default. */}
      <DialogContent className="left-0 right-0 top-[5vh] mx-auto translate-x-0 translate-y-0 transform-none data-[state=open]:!slide-in-from-left-0 data-[state=open]:!slide-in-from-top-0 data-[state=closed]:!slide-out-to-left-0 data-[state=closed]:!slide-out-to-top-0 sm:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Filters</DialogTitle>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
          <TextField
            sx={auditFieldSx}
            fullWidth
            type="date"
            label="Date of Inspection — From"
            value={draft.date_from}
            onChange={(e) => set({ date_from: e.target.value })}
            inputProps={{ max: draft.date_to || undefined }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={auditFieldSx}
            fullWidth
            type="date"
            label="Date of Inspection — To"
            value={draft.date_to}
            onChange={(e) => set({ date_to: e.target.value })}
            inputProps={{ min: draft.date_from || undefined }}
            InputLabelProps={{ shrink: true }}
          />
          <IncidentSelectField
            label="Status"
            value={draft.status}
            onChange={(v) => set({ status: v })}
            options={statusFilterOptions(role)}
            placeholder="Select status"
          />
          <IncidentSelectField
            label="Circle"
            value={draft.circle_id}
            onChange={(v) => set({ circle_id: v })}
            options={masters.circles}
            loading={loading}
            placeholder="Select circle"
          />
          <IncidentSelectField
            label="Personnel Area"
            value={draft.personal_area_id}
            onChange={(v) => set({ personal_area_id: v })}
            options={masters.personalAreas}
            loading={loading}
            placeholder="Select personnel area"
          />
          <IncidentSelectField
            label="Work Location"
            value={draft.work_location_id}
            onChange={(v) => set({ work_location_id: v })}
            options={masters.workLocations}
            loading={loading}
            placeholder="Select work location"
          />
          <IncidentSelectField
            label="Type of Facility"
            value={draft.facility_type_id}
            onChange={(v) => set({ facility_type_id: v })}
            options={masters.facilityTypes}
            loading={loading}
            placeholder="Select type of facility"
          />
          <IncidentSelectField
            label="Inspection Type"
            value={draft.inspection_type_id}
            onChange={(v) => set({ inspection_type_id: v })}
            options={masters.inspectionTypes}
            loading={loading}
            placeholder="Select inspection type"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            type="button"
            className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => {
              setDraft(EMPTY_INSPECTION_FILTERS);
              onApply(EMPTY_INSPECTION_FILTERS);
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
