import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import type { ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";

// Incident model shared by every role's list/detail pages. Records are mapped from the
// VI Incident API in viIncidentApi.ts.

export type ViIncidentRole = "reporter" | "spoc" | "action_owner" | "functional_head";
export type ViIncidentActionType = "corrective" | "preventive";

export interface ViIncidentAttachment {
  id: string;
  name: string;
  url: string;
}

export interface ViIncidentInjury {
  id: string;
  name: string;
  age: string;
  personTypeId: string;
  personType: string;
  natureOfInjuryId: string;
  natureOfInjury: string;
  bodyPartId: string;
  bodyPart: string;
  vendor: string;
  subVendor: string;
}

/** One action owner's share of an action plan (open → draft → closed). */
export interface ViIncidentAssignment {
  id: string;
  owner: ViActiveUserOption | null;
  status: string;
  actionTaken: string;
  closureDate: string; // yyyy-mm-dd
  attachments: ViIncidentAttachment[];
}

/** A corrective or preventive plan for one checklist item, with one assignment per owner. */
export interface ViIncidentActionPlan {
  id: string;
  checklistItemId: string;
  actionType: ViIncidentActionType;
  description: string;
  targetDate: string; // yyyy-mm-dd
  extendTargetDate: string; // yyyy-mm-dd
  extensionReason: string;
  status: string;
  assignments: ViIncidentAssignment[];
}

/** A root cause the SPOC selected (checklist sub-sub category). */
export interface ViIncidentChecklistItem {
  id: string;
  name: string;
  /** "Category / Sub Category" the item sits under. */
  path: string;
}

export interface ViIncidentInvestigation {
  submitted: boolean;
  required: boolean;
  notRequiredReason: string;
  daysAwayFromWork: string;
  restrictedWorkDays: string;
  breach: boolean;
  breachSafetyRuleId: string;
  breachSafetyRule: string;
  /** Free text entered when the "Others" safety rule was chosen. */
  breachSafetyRuleOther: string;
  summary: string;
  conclusionId: string;
  conclusion: string;
}

export interface ViIncidentRecord {
  id: number;
  incidentNo: string;
  /** Workflow status label, e.g. "Pending By SPOC". */
  status: string;
  statusKey: string;
  /** Stored status: draft / open / closed. */
  storedStatus: string;
  canEdit: boolean;
  reporter: { name: string; mailId: string; employer: string };
  dateOfReport: string;
  timeOfReport: string;
  dateOfIncident: string;
  timeOfIncident: string;
  incidentDateIso: string;
  incidentTime24: string;
  circle: string;
  personnelArea: string;
  workLocation: string;
  facilityType: string;
  incidentLocation: string;
  function: string;
  classification: string;
  category: string;
  subCategory: string;
  /** Master ids, for prefilling the edit form. */
  ids: {
    circle: string;
    personnelArea: string;
    workLocation: string;
    function: string;
    facilityType: string;
    classification: string;
    category: string;
    subCategory: string;
  };
  /** Free text entered when the "Others" master was chosen. */
  otherValues: { classification: string; category: string; subCategory: string; facilityType: string };
  incident: string;
  injuryHappened: boolean;
  spoc: string;
  functionalHead: string;
  spocUser: ViActiveUserOption | null;
  functionalHeadUser: ViActiveUserOption | null;
  attachments: ViIncidentAttachment[];
  injuries: ViIncidentInjury[];
  investigation: ViIncidentInvestigation;
  checklistItems: ViIncidentChecklistItem[];
  actionPlans: ViIncidentActionPlan[];
  /** Assignment ids belonging to the logged-in action owner (action owner list rows). */
  myAssignmentIds: string[];
  /** Statuses (open / draft / closed) of those assignments. */
  myAssignmentStatuses: string[];
  /** Counters the list endpoints add to each row. */
  injuriesCount: number;
  actionPlansCount: number;
  assignmentsCount: number;
  pendingAssignmentsCount: number;
}

/** Status tone classes for the incident status pill. */
export const VI_INCIDENT_STATUS_TONE: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-700",
  Open: "bg-blue-100 text-blue-700",
  Closed: "bg-green-100 text-green-700",
  "Pending By SPOC": "bg-yellow-100 text-yellow-700",
  "Pending By Action Owner": "bg-yellow-100 text-yellow-700",
  "Closed By Action Owner": "bg-green-100 text-green-700",
  "Closed By SPOC": "bg-green-100 text-green-700",
  "Incident Closed": "bg-green-100 text-green-700",
  default: "bg-orange-100 text-orange-700",
};

export const INCIDENT_COLUMNS: ColumnConfig[] = [
  { key: "incidentNo", label: "Incident ID", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "classification", label: "Classification", sortable: true, defaultVisible: true },
  { key: "category", label: "Category", sortable: true, defaultVisible: true },
  { key: "incidentLocation", label: "Incident Location", sortable: true, defaultVisible: true },
  { key: "dateOfIncident", label: "Date of Incident", sortable: true, defaultVisible: true },
  { key: "timeOfIncident", label: "Time of Incident", sortable: true, defaultVisible: true },
  { key: "circle", label: "Circle", sortable: true, defaultVisible: true },
  { key: "spoc", label: "SPOC", sortable: true, defaultVisible: true },
  { key: "functionalHead", label: "Functional Head", sortable: true, defaultVisible: true },
  { key: "injuriesCount", label: "Injuries", sortable: true, defaultVisible: false },
  { key: "actionPlansCount", label: "Action Plans", sortable: true, defaultVisible: false },
  { key: "assignmentsCount", label: "Assignments", sortable: true, defaultVisible: false },
  { key: "pendingAssignmentsCount", label: "Pending Assignments", sortable: true, defaultVisible: false },
];

/** Incident-card fields (ID, Status, Classification, Location) — the list columns in the role designs. */
export const INCIDENT_CARD_COLUMNS: ColumnConfig[] = [
  { key: "incidentNo", label: "Incident ID", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "classification", label: "Classification", sortable: true, defaultVisible: true },
  { key: "incidentLocation", label: "Incident Location", sortable: true, defaultVisible: true },
];

export const ACTION_TYPE_LABEL: Record<ViIncidentActionType, string> = {
  corrective: "Corrective",
  preventive: "Preventive",
};

export const todayIso = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

// "2026-09-18" -> "18 Sep 2026"
export const formatIncidentDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

/** The deadline in force: the extended date when set, else the target date. */
export const planDeadline = (plan: ViIncidentActionPlan) => plan.extendTargetDate || plan.targetDate;

export const isPlanClosed = (plan: ViIncidentActionPlan) =>
  plan.status.toLowerCase() === "closed" ||
  (plan.assignments.length > 0 && plan.assignments.every((a) => a.status === "closed"));

/** The SPOC may extend a deadline only once it has passed and the plan is still open. */
export const isPlanExpired = (plan: ViIncidentActionPlan) =>
  !isPlanClosed(plan) && Boolean(planDeadline(plan)) && planDeadline(plan) < todayIso();

/** Due label shown on an open action plan, e.g. "Due 18 Sep". */
export const viIncidentPlanDueLabel = (plans: ViIncidentActionPlan[]) => {
  const open = plans.filter((plan) => !isPlanClosed(plan) && planDeadline(plan)).map(planDeadline).sort();
  return open.length ? `Due ${formatIncidentDate(open[0]).replace(/\s\d{4}$/, "")}` : undefined;
};

/** Owners who haven't submitted their action on the given plans (unique, in plan order). */
export const pendingOwnerNames = (plans: ViIncidentActionPlan[]) => [
  ...new Set(
    plans
      .flatMap((plan) => plan.assignments)
      .filter((a) => a.status !== "closed")
      .map((a) => a.owner?.name || "Unassigned"),
  ),
];

/** An owner's action taken saved but not submitted: "draft", or still open with an action taken filled in. */
export const isAssignmentDraft = (a: ViIncidentAssignment) =>
  a.status === "draft" || (a.status !== "closed" && Boolean(a.actionTaken));

/**
 * The logged-in owner (`isMine`) holds a draft action taken on this still-open incident — from the
 * row's my_assignments, or the plans' assignments.
 */
export const hasMyActionDraft = (incident: ViIncidentRecord, isMine: (a: ViIncidentAssignment) => boolean) =>
  incident.storedStatus !== "closed" &&
  (incident.myAssignmentStatuses.includes("draft") ||
    incident.actionPlans.some((plan) => plan.assignments.some((a) => isMine(a) && isAssignmentDraft(a))));

/**
 * The SPOC saved the investigation as a draft (anything filled in on the action plan form) and the
 * incident is still waiting on them. List rows may leave the investigation out — check the detail.
 */
export const hasSpocDraft = (incident: ViIncidentRecord) => {
  const inv = incident.investigation;
  return (
    incident.storedStatus === "open" &&
    !inv.submitted &&
    Boolean(
      incident.actionPlans.length ||
        incident.actionPlansCount ||
        incident.checklistItems.length ||
        inv.summary ||
        inv.notRequiredReason ||
        inv.daysAwayFromWork ||
        inv.restrictedWorkDays ||
        inv.breach ||
        inv.breachSafetyRuleId ||
        inv.conclusionId,
    )
  );
};

/**
 * Whose end the incident is waiting on, from its workflow stage: the reporter (draft), the SPOC
 * (pending by SPOC) or every action owner who hasn't submitted yet. Empty once nothing is pending.
 */
export const incidentPendingWith = (incident: ViIncidentRecord): { role: string; names: string[] } | null => {
  switch (incident.statusKey) {
    case "draft":
      return { role: "Reporter", names: [incident.reporter.name || "Reporter"] };
    case "pending_by_spoc":
      return { role: "SPOC", names: [incident.spoc || "SPOC"] };
    case "pending_by_action_owner": {
      const names = pendingOwnerNames(incident.actionPlans);
      return names.length ? { role: names.length > 1 ? "Action Owners" : "Action Owner", names } : null;
    }
    default:
      return null;
  }
};

export interface ViIncidentPlanGroup {
  item: ViIncidentChecklistItem;
  corrective: ViIncidentActionPlan[];
  preventive: ViIncidentActionPlan[];
}

/** Action plans grouped under the checklist item (root cause) they address, in selection order. */
export const groupPlansByItem = (
  items: ViIncidentChecklistItem[],
  plans: ViIncidentActionPlan[],
): ViIncidentPlanGroup[] => {
  const known = new Map(items.map((item) => [item.id, item]));
  const order = [...items.map((item) => item.id), ...plans.map((plan) => plan.checklistItemId)].filter(
    (id, index, all) => all.indexOf(id) === index,
  );
  return order
    .map((id) => ({
      item: known.get(id) ?? { id, name: `Checklist item ${id}`, path: "" },
      corrective: plans.filter((p) => p.checklistItemId === id && p.actionType === "corrective"),
      preventive: plans.filter((p) => p.checklistItemId === id && p.actionType === "preventive"),
    }))
    .filter((group) => group.corrective.length || group.preventive.length);
};
