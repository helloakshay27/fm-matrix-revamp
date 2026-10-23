// Shared types, status tones and placeholder data for the Vi Audit detail screens.
// Placeholder data — swap for the live Audit API once the backend endpoint is available.

export type ViObservationStatus =
  | "Pending By SPOC"
  | "Pending By Action Owner"
  | "Closed By Action Owner";

export type ViActionPlanStatus = "Pending By Action Owner" | "Closed By Action Owner";

export interface ViActionPlan {
  id: string;
  /** Display number from the API, e.g. "Ca01" (id stays the server id used in URLs). */
  actionNo?: string;
  description: string;
  actionOwner: string;
  targetDate: string;
  dueLabel?: string;
  status: ViActionPlanStatus;
  /** CAPA progress from the API: label ("CAPA Plan Not Started") and key ("capa_plan_not_started"). */
  capaProgress?: string;
  capaProgressKey?: string;
}

export interface ViObservation {
  id: string;
  title?: string;
  area?: string;
  description: string;
  dueLabel?: string;
  status: ViObservationStatus;
  assignedSpoc: string;
  functionalHead: string;
  attachments: string[];
  /** Attachment files from the API (name + URL), when available. */
  attachmentFiles?: { name: string; url: string }[];
  correctiveActions: ViActionPlan[];
  preventiveActions: ViActionPlan[];
}

export interface ViAuditDetail {
  id: string;
  auditCode: string;
  auditType: "Corporate" | "Circle";
  status: "Open" | "Closed" | "Draft";
  auditor: { name: string; mailId: string; designation: string };
  basic: {
    auditId: string;
    dateOfAudit: string;
    circle: string;
    personnelArea: string;
    workLocation: string;
    facilityType: string;
    auditLocation: string;
    function: string;
  };
  classification: { classification: string; category: string; subCategory: string };
  people: { fte: string[]; others: { name: string; designation: string }[] };
  vendor: { vendorName: string; subVendorName: string };
  observations: ViObservation[];
}

// Standard tinted status pills — one tone per state, used on every audit screen.
export const VI_AUDIT_STATUS_TONE: Record<string, string> = {
  Open: "bg-[rgba(107,155,204,0.15)] text-[#3F6E9E]",
  Closed: "bg-[rgba(26,26,24,0.06)] text-[rgba(26,26,24,0.68)]",
  Completed: "bg-[rgba(121,140,94,0.15)] text-[#56683F]",
  Draft: "bg-[rgba(237,196,136,0.28)] text-[#8A6420]",
  Submitted: "bg-[rgba(107,155,204,0.15)] text-[#3F6E9E]",
  "In progress": "bg-[rgba(237,196,136,0.28)] text-[#8A6420]",
  "Pending By SPOC": "bg-[rgba(231,132,142,0.15)] text-[#B04A55]",
  "Pending By Action Owner": "bg-[rgba(237,196,136,0.28)] text-[#8A6420]",
  "Closed By Action Owner": "bg-[rgba(121,140,94,0.15)] text-[#56683F]",
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const actionPlans = (prefix: string): ViActionPlan[] => [
  {
    id: `${prefix}01`,
    description: LOREM,
    actionOwner: "Varne Shah",
    targetDate: "18 Sep 2026",
    status: "Pending By Action Owner",
  },
  {
    id: `${prefix}02`,
    description: LOREM,
    actionOwner: "Varne Shah",
    targetDate: "18 Sep 2026",
    dueLabel: "Due 18 Sep",
    status: "Closed By Action Owner",
  },
];

const observation = (
  n: number,
  status: ViObservationStatus,
  dueLabel?: string,
  title?: string,
  area?: string,
): ViObservation => ({
  id: `Obs${String(n).padStart(2, "0")}`,
  title,
  area,
  description: LOREM,
  dueLabel,
  status,
  assignedSpoc: "Shahab Mirza",
  functionalHead: "Kshitij Rasal",
  attachments: ["site-photo-1.jpg", "site-photo-2.jpg", "site-photo-3.jpg"],
  correctiveActions: actionPlans("Ca"),
  preventiveActions: actionPlans("Pa"),
});

const buildViAuditDetail = (id: string | undefined): ViAuditDetail => ({
  id: id || "1",
  auditCode: `Audit0${id || "1"}`,
  auditType: "Corporate",
  status: "Closed",
  auditor: { name: "Sohail Ansari", mailId: "sohail.ansari@mail.com", designation: "Safety Head" },
  basic: {
    auditId: String(id || "01").padStart(2, "0"),
    dateOfAudit: "23/03/2026",
    circle: "Birla",
    personnelArea: "Worli",
    workLocation: "Worli",
    facilityType: "Birla",
    auditLocation: "Birla Centurion Pvt. Ltd., Wing B, Floor 3, Room 203, Common Area",
    function: "-",
  },
  classification: {
    classification: "Non-Compliance",
    category: "Fire Safety",
    subCategory: "-",
  },
  people: { fte: ["Arun Mohan"], others: [] },
  vendor: { vendorName: "Jethalal & Sons Pvt. Ltd.", subVendorName: "-" },
  observations: [
    observation(1, "Pending By SPOC"),
    observation(2, "Pending By Action Owner", "Due 19 Sep"),
    observation(3, "Closed By Action Owner"),
    observation(4, "Pending By Action Owner", "Due 19 Sep"),
    observation(5, "Pending By SPOC", "Due 19 Sep"),
    observation(6, "Pending By Action Owner", "Due 16 Sep", "Fire extinguisher inspection overdue", "Level 2 · East wing"),
    observation(7, "Pending By SPOC", "Due 18 Sep", "Emergency exit signage is missing", "Level 3 · Common area"),
    observation(8, "Closed By Action Owner", "Due 14 Sep", "Electrical panel access obstructed", "Basement · Utility room"),
  ],
});

// Base URL per audit role. Auditor uses the original audit-list routes; SPOC has its own
// detail / observation / action-plan routes under /safety/audit/spoc.
export type ViAuditRoleKey = "auditor" | "spoc" | "action-owner" | "functional-head";

export const viAuditBasePath = (role: ViAuditRoleKey = "auditor") =>
  role === "spoc"
    ? "/safety/audit/spoc"
    : role === "action-owner"
      ? "/safety/audit/action-owner"
      : role === "functional-head"
        ? "/safety/audit/functional-head"
        : "/safety/audit-list";

// --- Action taken (placeholder persistence) ---------------------------------------
// Until the Audit API exists, plans closed via "Add Action Taken" are remembered for the
// browser session so every role's screens show them as "Closed By Action Owner".
const CLOSED_PLANS_KEY = "vi_audit_closed_action_plans";

const readClosedPlans = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(CLOSED_PLANS_KEY) || "[]");
  } catch {
    return [];
  }
};

const planKey = (auditId: string, observationId: string, planId: string) =>
  `${auditId}/${observationId}/${planId}`;

export const markViActionPlanClosed = (auditId: string, observationId: string, planId: string) => {
  try {
    const closed = new Set(readClosedPlans());
    closed.add(planKey(auditId, observationId, planId));
    sessionStorage.setItem(CLOSED_PLANS_KEY, JSON.stringify([...closed]));
  } catch {
    // Storage unavailable — the status simply won't persist across pages.
  }
};

export const getViAuditDetail = (id: string | undefined): ViAuditDetail => {
  const audit = buildViAuditDetail(id);
  const closed = new Set(readClosedPlans());
  if (closed.size === 0) return audit;
  const close = (observationId: string) => (plan: ViActionPlan): ViActionPlan =>
    closed.has(planKey(audit.id, observationId, plan.id))
      ? { ...plan, status: "Closed By Action Owner" }
      : plan;
  return {
    ...audit,
    observations: audit.observations.map((obs) => ({
      ...obs,
      correctiveActions: obs.correctiveActions.map(close(obs.id)),
      preventiveActions: obs.preventiveActions.map(close(obs.id)),
    })),
  };
};

export type ViPlanKind = "corrective" | "preventive";

// Finds one action plan (and whether it is corrective or preventive) within an observation.
export const findViActionPlan = (
  observation: ViObservation,
  planId: string | undefined,
): { plan: ViActionPlan; kind: ViPlanKind } | null => {
  const corrective = observation.correctiveActions.find((p) => p.id === planId);
  if (corrective) return { plan: corrective, kind: "corrective" };
  const preventive = observation.preventiveActions.find((p) => p.id === planId);
  return preventive ? { plan: preventive, kind: "preventive" } : null;
};
