import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, ClipboardList, Clock, FileEdit, ListChecks, Search } from "lucide-react";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import type { ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";

// VI Inspection types and constants (docs/vi_inspection/API.md). Records are parsed from the API in
// viInspectionApi.ts.

export type ViInspectionRole = "inspector" | "spoc" | "action_owner" | "functional_head";
export type ViInspectionActionType = "corrective" | "preventive";

export const ACTION_TYPES: ViInspectionActionType[] = ["corrective", "preventive"];
export const ACTION_TYPE_LABEL: Record<ViInspectionActionType, string> = {
  corrective: "Corrective",
  preventive: "Preventive",
};

export const CHECKLIST_ANSWERS = ["Yes", "No", "NA"] as const;

export const INSPECTION_PATHS: Record<ViInspectionRole, string> = {
  inspector: "/safety/vi-inspection/inspector",
  spoc: "/safety/vi-inspection/spoc",
  action_owner: "/safety/vi-inspection/action-owner",
  functional_head: "/safety/vi-inspection/functional-head",
};

export interface ViInspectionAttachment {
  id: string;
  name: string;
  url: string;
}

export interface ViInspectionPerson extends ViActiveUserOption {
  designation?: string;
}

/** One action-taken entry of an owner's assignment (many per assignment). */
export interface ViInspectionActionTaken {
  id: string;
  description: string;
  closureDate: string;
  attachments: ViInspectionAttachment[];
}

/** One responsible person's work on a plan: open → draft (entries saved) → closed (submitted). */
export interface ViInspectionAssignment {
  id: string;
  owner: ViInspectionPerson | null;
  status: string;
  submittedAt: string;
  closureDate: string;
  actionTakens: ViInspectionActionTaken[];
}

export interface ViInspectionExtension {
  previousDate: string;
  newDate: string;
  reason: string;
  by: string;
  at: string;
}

export interface ViInspectionActionPlan {
  id: string;
  checklistResponseId: string;
  actionType: ViInspectionActionType;
  description: string;
  targetDate: string;
  extendTargetDate: string;
  extensionReason: string;
  /** draft (SPOC only) → open (released to owners) → closed. */
  status: string;
  extensions: ViInspectionExtension[];
  assignments: ViInspectionAssignment[];
}

export interface ViInspectionChecklistResponse {
  id: string;
  questionId: string;
  /** Question text as it was when answered (question_text_snapshot). */
  question: string;
  position: number;
  answer: string;
  remark: string;
  attachments: ViInspectionAttachment[];
  actionPlans: ViInspectionActionPlan[];
}

export interface ViInspectionRecord {
  id: number;
  inspectionNo: string;
  /** Persisted status: draft | open | closed. */
  status: string;
  /** Derived workflow label key and text (workflow_status_key / workflow_status). */
  workflowKey: string;
  workflowLabel: string;
  inspectionDate: string;
  circleId: string;
  circle: string;
  personalAreaId: string;
  personalArea: string;
  workLocationId: string;
  workLocation: string;
  inspectionTypeId: string;
  inspectionType: string;
  inspectorLocation: string;
  departmentId: string;
  department: string;
  facilityTypeId: string;
  facilityType: string;
  inspector: ViInspectionPerson | null;
  spoc: ViInspectionPerson | null;
  functionalHead: ViInspectionPerson | null;
  targetDate: string;
  submittedAt: string;
  canEdit: boolean;
  canManageActionPlans: boolean;
  roles: string[];
  checklistResponses: ViInspectionChecklistResponse[];
  checklistResponsesCount: number;
  actionPlansCount: number;
  assignmentsCount: number;
  pendingAssignmentsCount: number;
}

// ---------------------------------------------------------------------------------------------
// Workflow

export const WORKFLOW_LABEL: Record<string, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
  pending_by_spoc: "Pending By SPOC",
  closed_by_spoc: "Closed By SPOC",
  pending_by_action_owner: "Pending By Action Owner",
  closed_by_action_owner: "Closed By Action Owner",
  inspection_closed: "Inspection Closed",
};

const WORKFLOW_TONE: Record<string, string> = {
  draft: "bg-[#FBE3D8] text-[#B5502A]",
  open: "bg-[#DCE8F4] text-[#2F5F8F]",
  pending_by_spoc: "bg-[#F5B5A6] text-[#8A2F1B]",
  closed_by_spoc: "bg-[#DCE8F4] text-[#2F5F8F]",
  pending_by_action_owner: "bg-[#F8E4C7] text-[#8A5A12]",
  closed_by_action_owner: "bg-[#DDEBD3] text-[#4A6B2E]",
  closed: "bg-[#DDEBD3] text-[#4A6B2E]",
  inspection_closed: "bg-[#DDEBD3] text-[#4A6B2E]",
};

export const workflowTone = (key: string) => WORKFLOW_TONE[key] ?? WORKFLOW_TONE.open;

/** "pending_by_spoc" → "Pending By SPOC" (unknown keys are title-cased). */
export const workflowLabel = (key: string) =>
  WORKFLOW_LABEL[key] ??
  key
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => (w.toLowerCase() === "spoc" ? "SPOC" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

/** Status filter values of the list APIs (`draft` only exists for the Inspector's own inspections). */
export const statusFilterOptions = (role: ViInspectionRole) =>
  [
    ...(role === "inspector" ? ["draft"] : []),
    "open",
    "closed",
    "pending_by_spoc",
    "closed_by_spoc",
    "pending_by_action_owner",
    "closed_by_action_owner",
  ].map((value) => ({ value, label: WORKFLOW_LABEL[value] }));

// One owner's progress on an assignment.
export const ASSIGNMENT_STATUS: Record<string, { label: string; tone: string }> = {
  closed: { label: "Action Taken", tone: "bg-[#DDEBD3] text-[#4A6B2E]" },
  draft: { label: "In Progress", tone: "bg-[#F8E4C7] text-[#8A5A12]" },
  open: { label: "Pending", tone: "bg-[#F5B5A6] text-[#8A2F1B]" },
};
export const assignmentStatus = (status: string) => ASSIGNMENT_STATUS[status] ?? ASSIGNMENT_STATUS.open;

export const isPlanDraft = (plan: ViInspectionActionPlan) => plan.status.toLowerCase() === "draft";
export const isPlanClosed = (plan: ViInspectionActionPlan) => plan.status.toLowerCase() === "closed";
/** The deadline in force: the latest extension, else the original target date. */
export const planDeadline = (plan: ViInspectionActionPlan) => plan.extendTargetDate || plan.targetDate;

// ---------------------------------------------------------------------------------------------
// Dates

export const todayIso = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

/** "2026-09-18" (or an ISO timestamp) → "18 Sep 2026". */
export const formatInspectionDate = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// ---------------------------------------------------------------------------------------------
// List

export const INSPECTION_COLUMNS: ColumnConfig[] = [
  { key: "inspectionNo", label: "Inspection No.", sortable: true, defaultVisible: true },
  { key: "workflowLabel", label: "Status", sortable: true, defaultVisible: true },
  { key: "inspectionType", label: "Inspection Type", sortable: true, defaultVisible: true },
  { key: "inspectionDateLabel", label: "Date of Inspection", sortable: true, defaultVisible: true },
  { key: "circle", label: "Circle", sortable: true, defaultVisible: true },
  { key: "personalArea", label: "Personnel Area", sortable: true, defaultVisible: true },
  { key: "workLocation", label: "Work Location", sortable: true, defaultVisible: true },
  { key: "facilityType", label: "Type of Facility", sortable: true, defaultVisible: true },
  { key: "inspectorLocation", label: "Inspector Location", sortable: true, defaultVisible: false },
  { key: "spocName", label: "SPOC", sortable: true, defaultVisible: true },
  { key: "functionalHeadName", label: "Functional Head", sortable: true, defaultVisible: true },
  { key: "targetDateLabel", label: "Target Date", sortable: true, defaultVisible: true },
];

export const VI_INSPECTION_LIST_PER_PAGE = 20;

// ---------------------------------------------------------------------------------------------
// Dashboards — exactly the cards of API.md §7, per role.

export interface InspectionStatCard {
  key: string;
  title: string;
  icon: LucideIcon;
}

const STAGE_CARDS: InspectionStatCard[] = [
  { key: "pending_by_spoc", title: "Pending By SPOC", icon: Search },
  { key: "closed_by_spoc", title: "Closed By SPOC", icon: CheckCircle2 },
  { key: "pending_by_action_owner", title: "Pending By Action Owner", icon: Clock },
  { key: "closed_by_action_owner", title: "Closed By Action Owner", icon: CheckCircle2 },
];

export const DASHBOARD_CARDS: Record<ViInspectionRole, InspectionStatCard[]> = {
  inspector: [
    { key: "total_inspection", title: "Total Inspection", icon: ClipboardList },
    { key: "open_inspection", title: "Open Inspection", icon: AlertTriangle },
    { key: "closed_inspection", title: "Closed Inspection", icon: CheckCircle2 },
    { key: "draft_inspection", title: "Draft Inspection", icon: FileEdit },
    ...STAGE_CARDS,
  ],
  spoc: [
    { key: "total_assigned_inspection", title: "Total Assigned Inspection", icon: ClipboardList },
    { key: "open_inspection", title: "Open Inspection", icon: AlertTriangle },
    { key: "closed_inspection", title: "Closed Inspection", icon: CheckCircle2 },
    ...STAGE_CARDS,
  ],
  action_owner: [
    { key: "total_assigned_inspection", title: "Total Assigned Inspection", icon: ClipboardList },
    { key: "total_assigned_actions", title: "Total Assigned Actions", icon: ListChecks },
    { key: "pending_actions", title: "Pending Actions", icon: Clock },
    { key: "draft_actions", title: "Draft Actions", icon: FileEdit },
    { key: "completed_actions", title: "Completed Actions", icon: CheckCircle2 },
    { key: "open_inspection", title: "Open Inspection", icon: AlertTriangle },
    { key: "closed_inspection", title: "Closed Inspection", icon: CheckCircle2 },
    STAGE_CARDS[2],
    STAGE_CARDS[3],
  ],
  functional_head: [
    { key: "total_assigned_inspection", title: "Total Assigned Inspection", icon: ClipboardList },
    { key: "open_inspection", title: "Open Inspection", icon: AlertTriangle },
    { key: "closed_inspection", title: "Closed Inspection", icon: CheckCircle2 },
    ...STAGE_CARDS,
  ],
};
