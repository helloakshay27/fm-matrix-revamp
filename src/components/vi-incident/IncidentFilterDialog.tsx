import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SelectField } from "@/components/vi-audit/AuditFormFields";
import { useViAuditMasters } from "@/components/vi-audit/useViAuditMasters";
import { VI_INCIDENT_STATUSES, type ViIncidentRecord } from "./viIncidentData";

// Filter values hold the selected option's label (not its id), so they compare directly
// against the incident record's names.
export interface IncidentFilters {
  dateOfIncident: string; // yyyy-mm-dd
  timeOfIncident: string; // hh:mm (24h)
  status: string;
  circle: string;
  classification: string;
  personnelArea: string;
  workLocation: string;
  facilityType: string;
}

export const EMPTY_INCIDENT_FILTERS: IncidentFilters = {
  dateOfIncident: "",
  timeOfIncident: "",
  status: "",
  circle: "",
  classification: "",
  personnelArea: "",
  workLocation: "",
  facilityType: "",
};

// "23/03/2026" -> "2026-03-23"
const displayDateToIso = (value: string) => {
  const [day, month, year] = value.split("/");
  return day && month && year ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` : "";
};

// "01:20 PM" -> "13:20"
const displayTimeTo24h = (value: string) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(value.trim());
  if (!match) return "";
  let hours = parseInt(match[1], 10);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${match[2]}`;
};

const sameText = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export const matchesIncidentFilters = (incident: ViIncidentRecord, filters: IncidentFilters) =>
  (!filters.dateOfIncident || displayDateToIso(incident.dateOfIncident) === filters.dateOfIncident) &&
  (!filters.timeOfIncident || displayTimeTo24h(incident.timeOfIncident) === filters.timeOfIncident) &&
  (!filters.status || sameText(incident.status, filters.status)) &&
  (!filters.circle || sameText(incident.circle, filters.circle)) &&
  (!filters.classification || sameText(incident.classification, filters.classification)) &&
  (!filters.personnelArea || sameText(incident.personnelArea, filters.personnelArea)) &&
  (!filters.workLocation || sameText(incident.workLocation, filters.workLocation)) &&
  (!filters.facilityType || sameText(incident.facilityType, filters.facilityType));

/** Filters dialog shared by every incident list (Reporter / SPOC / Action Owner / Functional Head). */
export const IncidentFilterDialog = ({
  open,
  onClose,
  filters,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  filters: IncidentFilters;
  onApply: (filters: IncidentFilters) => void;
}) => {
  const { masters, loading } = useViAuditMasters();
  const [draft, setDraft] = useState<IncidentFilters>(filters);

  // Start from the applied filters each time the dialog opens.
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const set = (patch: Partial<IncidentFilters>) => setDraft((prev) => ({ ...prev, ...patch }));

  // Selects work with option labels as values, so the filter compares against record names.
  const labelOptions = (options: { label: string }[]) => options.map((option) => option.label);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#1A1A18]">Filters</DialogTitle>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
          <TextField
            fullWidth
            type="date"
            label="Date of Incident"
            value={draft.dateOfIncident}
            onChange={(e) => set({ dateOfIncident: e.target.value })}
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
          <SelectField
            label="Status"
            value={draft.status}
            onChange={(v) => set({ status: v })}
            options={VI_INCIDENT_STATUSES}
            placeholder="Select status"
          />
          <SelectField
            label="Circle"
            value={draft.circle}
            onChange={(v) => set({ circle: v })}
            options={labelOptions(masters.clusters)}
            loading={loading}
            placeholder="Select incident circle"
          />
          <SelectField
            label="Incident classification"
            value={draft.classification}
            onChange={(v) => set({ classification: v })}
            options={labelOptions(masters.classifications)}
            loading={loading}
            placeholder="Select classification"
          />
          <SelectField
            label="Personnel Area"
            value={draft.personnelArea}
            onChange={(v) => set({ personnelArea: v })}
            options={labelOptions(masters.circles)}
            loading={loading}
            placeholder="Select personnel area"
          />
          <SelectField
            label="Work Location"
            value={draft.workLocation}
            onChange={(v) => set({ workLocation: v })}
            options={labelOptions(masters.workLocations)}
            loading={loading}
            placeholder="Select work location"
          />
          <SelectField
            label="Type of Facility"
            value={draft.facilityType}
            onChange={(v) => set({ facilityType: v })}
            options={labelOptions(masters.visitBusinessAreas)}
            loading={loading}
            placeholder="Select type of facility"
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
