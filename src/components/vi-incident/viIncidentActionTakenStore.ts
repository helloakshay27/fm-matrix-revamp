import type { ViIncidentActionPlan } from "./viIncidentData";

// Remembers action-taken submissions in this browser until the Incident API exists, so the detail
// page can hide "Add Action Taken" and show what was submitted. Replace with the API response later.
const STORAGE_KEY = "vi-incident-action-taken";

type Taken = NonNullable<ViIncidentActionPlan["taken"]>;
type SubmittedByIncident = Record<string, Record<string, Taken>>;

const readAll = (): SubmittedByIncident => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

/** Submitted action taken for an incident, keyed by action plan id (empty if not submitted yet). */
export const getSubmittedActionTaken = (incidentId: string | undefined): Record<string, Taken> =>
  (incidentId && readAll()[incidentId]) || {};

export const saveSubmittedActionTaken = (incidentId: string | undefined, byPlan: Record<string, Taken>) => {
  if (!incidentId) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAll(), [incidentId]: byPlan }));
  } catch {
    // storage unavailable — the detail page then simply keeps showing the button
  }
};
