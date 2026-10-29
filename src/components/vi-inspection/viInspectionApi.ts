import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getUser } from "@/utils/auth";
import { arr, obj, personName, text, toAttachment } from "@/components/vi-audit/useViAuditDetail";
import type { MasterOption } from "@/components/vi-audit/useViAuditMasters";
import { errorToast, num, viIncidentRequest } from "@/components/vi-incident/viIncidentApi";
import {
  VI_INSPECTION_LIST_PER_PAGE,
  workflowLabel,
  type ViInspectionActionPlan,
  type ViInspectionActionTaken,
  type ViInspectionActionType,
  type ViInspectionAssignment,
  type ViInspectionAttachment,
  type ViInspectionChecklistResponse,
  type ViInspectionExtension,
  type ViInspectionPerson,
  type ViInspectionRecord,
  type ViInspectionRole,
} from "./viInspectionData";

// VI Inspection API (docs/vi_inspection/API.md): form masters, checklist questions, role lists and
// dashboards, inspection detail, Inspector draft/submit, SPOC action plans + target-date extension,
// Action Owner action-taken entries and assignment submit. Envelope: { code, data, pagination }.

type Raw = Record<string, unknown>;

/** Same authenticated JSON / multipart request as the other VI modules; throws with the API message. */
export const viInspectionRequest = viIncidentRequest;
export { errorToast, num };

const bool = (value: unknown) => value === true || value === 1 || String(value).toLowerCase() === "true";
const unwrap = (json: unknown): Raw => {
  const root = obj(json);
  return obj(root.data ?? root);
};

export const currentUserId = () => text(getUser()?.id);

/**
 * Whether an assignment is the logged-in user's. Without an owner id on the assignment, a viewer who
 * is only an Action Owner on this inspection only ever receives their own assignments (API.md §8).
 */
export const isMyAssignment = (assignment: ViInspectionAssignment, inspection: ViInspectionRecord) => {
  if (assignment.owner?.id) return assignment.owner.id === currentUserId();
  return inspection.roles.length > 0 && inspection.roles.every((role) => role === "action_owner");
};

/** GET `path` (skipped while null); `reload` refetches. */
const useViInspectionQuery = (path: string | null, errorMessage: string) => {
  const [json, setJson] = useState<unknown>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) {
      setJson(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    viInspectionRequest(path, { signal: controller.signal })
      .then((result) => setJson(result))
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(errorMessage, error);
        toast.error(errorMessage);
        setJson(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [path, version, errorMessage]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { json, loading, reload };
};

// ---------------------------------------------------------------------------------------------
// Parsers (field names per API.md; alternatives are accepted so small serializer changes don't break)

const toFile = (value: unknown, index: number): ViInspectionAttachment => {
  const { name, url } = toAttachment(value);
  return { id: text(obj(value).id) || `att-${index}`, name, url };
};
const attachments = (r: Raw) => arr(r.attachments, r.documents).map(toFile);

const toPerson = (value: unknown, fallbackId?: unknown, fallbackName?: unknown): ViInspectionPerson | null => {
  const p = obj(value);
  const id = text(p.id, fallbackId);
  const name = text(personName(p), fallbackName);
  if (!id && !name) return null;
  return {
    id,
    name: name || `User ${id}`,
    email: text(p.email) || undefined,
    mobile: text(p.mobile) || undefined,
    designation: text(p.designation, p.employer_name, p.employer, p.company_name) || undefined,
  };
};

/** Name of an associated master: `<key>_name`, or the nested record's name. */
const masterName = (r: Raw, key: string) => {
  const nested = obj(r[key]);
  return text(
    r[`${key}_name`],
    nested.name,
    nested.cluster_name,
    nested.work_location_name,
    nested.department_name,
    nested.facility_type_name,
  );
};
const masterId = (r: Raw, key: string) => text(r[`${key}_id`], obj(r[key]).id);

const toActionTaken = (r: Raw): ViInspectionActionTaken => ({
  id: text(r.id),
  description: text(r.description),
  closureDate: text(r.closure_date).slice(0, 10),
  attachments: attachments(r),
});

const toAssignment = (r: Raw): ViInspectionAssignment => ({
  id: text(r.id),
  owner: toPerson(r.responsible_person ?? r.owner ?? r.user, r.responsible_person_id, r.responsible_person_name),
  status: text(r.status).toLowerCase() || "open",
  submittedAt: text(r.submitted_at),
  closureDate: text(r.closure_date).slice(0, 10),
  actionTakens: arr(r.action_takens, r.vi_inspection_action_takens).map(toActionTaken),
});

const toExtension = (r: Raw): ViInspectionExtension => ({
  previousDate: text(r.previous_target_date, r.previous_date, r.from_date).slice(0, 10),
  newDate: text(r.extend_target_date, r.new_target_date, r.new_date, r.to_date).slice(0, 10),
  reason: text(r.extension_reason, r.reason),
  by: text(personName(r.extended_by ?? r.created_by ?? r.user), r.extended_by_name, r.created_by_name),
  at: text(r.created_at, r.extended_at),
});

const toActionPlan = (r: Raw): ViInspectionActionPlan => ({
  id: text(r.id),
  checklistResponseId: text(r.checklist_response_id, r.vi_inspection_checklist_response_id),
  actionType: (text(r.action_type).toLowerCase() === "preventive" ? "preventive" : "corrective") as ViInspectionActionType,
  description: text(r.action_description, r.description),
  targetDate: text(r.target_date).slice(0, 10),
  extendTargetDate: text(r.extend_target_date).slice(0, 10),
  extensionReason: text(r.extension_reason),
  status: text(r.status).toLowerCase() || "draft",
  extensions: arr(r.extensions).map(toExtension),
  assignments: arr(r.assignments, r.action_assignments).map(toAssignment),
});

const toChecklistResponse = (r: Raw, index: number): ViInspectionChecklistResponse => ({
  id: text(r.id),
  questionId: text(r.checklist_question_master_id, r.question_id),
  question: text(r.question_text_snapshot, r.question, obj(r.checklist_question_master).question),
  position: num(r.position_snapshot, r.position, index + 1),
  answer: text(r.answer),
  remark: text(r.remark, r.remarks),
  attachments: attachments(r),
  actionPlans: arr(r.action_plans).map(toActionPlan),
});

export const toInspectionRecord = (r: Raw): ViInspectionRecord => {
  const workflowKey = text(r.workflow_status_key) || text(r.status).toLowerCase();
  return {
    id: num(r.id),
    inspectionNo: text(r.inspection_no) || (r.id ? `INS-${String(r.id).padStart(4, "0")}` : ""),
    status: text(r.status).toLowerCase(),
    workflowKey,
    workflowLabel: text(r.workflow_status) || workflowLabel(workflowKey),
    inspectionDate: text(r.inspection_date, r.inspection_at).slice(0, 10),
    circleId: masterId(r, "circle"),
    circle: masterName(r, "circle"),
    personalAreaId: masterId(r, "personal_area"),
    personalArea: masterName(r, "personal_area"),
    workLocationId: masterId(r, "work_location"),
    workLocation: masterName(r, "work_location"),
    inspectionTypeId: masterId(r, "inspection_type"),
    inspectionType: masterName(r, "inspection_type"),
    inspectorLocation: text(r.inspector_location),
    inspectionSiteId: masterId(r, "inspection_site"),
    inspectionSite: masterName(r, "inspection_site"),
    departmentId: masterId(r, "department"),
    department: text(masterName(r, "department"), r.function_name),
    facilityTypeId: masterId(r, "facility_type"),
    facilityType: masterName(r, "facility_type"),
    inspector: toPerson(r.inspector, r.inspector_id, r.inspector_name),
    spoc: toPerson(r.spoc, r.spoc_id, r.spoc_name),
    functionalHead: toPerson(r.functional_head, r.functional_head_id, r.functional_head_name),
    targetDate: text(r.target_date).slice(0, 10),
    submittedAt: text(r.submitted_at),
    canEdit: bool(r.can_edit),
    canManageActionPlans: bool(r.can_manage_action_plans),
    roles: Array.isArray(r.roles) ? r.roles.map(String).filter(Boolean) : [],
    checklistResponses: arr(r.checklist_responses)
      .map(toChecklistResponse)
      .sort((a, b) => a.position - b.position),
    checklistResponsesCount: num(r.checklist_responses_count),
    actionPlansCount: num(r.action_plans_count),
    assignmentsCount: num(r.assignments_count),
    pendingAssignmentsCount: num(r.pending_assignments_count),
  };
};

// ---------------------------------------------------------------------------------------------
// Form masters & checklist questions

export interface ViInspectionMasters {
  circles: MasterOption[];
  personalAreas: MasterOption[];
  workLocations: MasterOption[];
  departments: MasterOption[];
  facilityTypes: MasterOption[];
  inspectionTypes: MasterOption[];
}

const toOptions = (records: Raw[]): MasterOption[] =>
  records
    .map((r) => ({
      value: text(r.id),
      label: text(r.name, r.cluster_name, r.work_location_name, r.department_name, r.facility_type_name, r.title),
    }))
    .filter((o) => o.value && o.label);

/** Dropdowns of the inspection form and filters (GET /vi_inspections/masters.json). */
export const useViInspectionMasters = () => {
  const { json, loading } = useViInspectionQuery("/vi_inspections/masters.json", "Failed to load inspection dropdown options");
  const masters = useMemo<ViInspectionMasters>(() => {
    const d = unwrap(json);
    return {
      circles: toOptions(arr(d.circles)),
      personalAreas: toOptions(arr(d.personal_areas)),
      workLocations: toOptions(arr(d.work_locations)),
      departments: toOptions(arr(d.departments)),
      facilityTypes: toOptions(arr(d.facility_types)),
      inspectionTypes: toOptions(arr(d.inspection_types)),
    };
  }, [json]);
  return { masters, loading };
};

export interface ViInspectionQuestion {
  id: string;
  question: string;
  position: number;
}

/** Active checklist questions of a type, in order (GET /vi_inspections/checklist_questions.json). */
export const useViInspectionChecklistQuestions = (inspectionTypeId: string) => {
  const { json, loading } = useViInspectionQuery(
    inspectionTypeId
      ? `/vi_inspections/checklist_questions.json?${new URLSearchParams({ inspection_type_id: inspectionTypeId })}`
      : null,
    "Failed to load checklist questions",
  );
  const questions = useMemo<ViInspectionQuestion[]>(() => {
    const root = obj(json);
    const rows = Array.isArray(root.data) ? (root.data as Raw[]) : arr(obj(root.data).checklist_questions, root.checklist_questions);
    return rows
      .map((r, i) => ({ id: text(r.id), question: text(r.question), position: num(r.position, i + 1) }))
      .filter((q) => q.id)
      .sort((a, b) => a.position - b.position);
  }, [json]);
  return { questions, loading };
};

export interface ViInspectionNearbySite extends MasterOption {
  /** Site name only (the option label also carries code and distance). */
  name: string;
}

/**
 * Active sites of a lat_long_required type within 2 km of the inspector, nearest first
 * (GET /vi_inspections/nearby_sites.json?inspection_type_id=&latitude=&longitude=). Skipped until
 * the type and the inspector's coordinates are known.
 */
export const useViInspectionNearbySites = (
  inspectionTypeId: string,
  coords: { latitude: number; longitude: number } | null,
) => {
  const { json, loading } = useViInspectionQuery(
    inspectionTypeId && coords
      ? `/vi_inspections/nearby_sites.json?${new URLSearchParams({
          inspection_type_id: inspectionTypeId,
          latitude: String(coords.latitude),
          longitude: String(coords.longitude),
        })}`
      : null,
    "Failed to load nearby sites",
  );
  const sites = useMemo<ViInspectionNearbySite[]>(() => {
    const root = obj(json);
    const rows = Array.isArray(json)
      ? (json as Raw[])
      : Array.isArray(root.data)
        ? (root.data as Raw[])
        : arr(obj(root.data).sites, obj(root.data).nearby_sites, root.sites, root.nearby_sites);
    return rows
      .map((r) => {
        const name = text(r.name, r.site_name);
        const code = text(r.code);
        const distance = Number(r.distance_m);
        const away = Number.isFinite(distance)
          ? distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`
          : "";
        return {
          value: text(r.id),
          name,
          label: [code ? `${name} (${code})` : name, away].filter(Boolean).join(" — "),
        };
      })
      .filter((site) => site.value && site.name);
  }, [json]);
  return { sites, loading };
};

// ---------------------------------------------------------------------------------------------
// Lists, dashboards, detail

const LIST_ENDPOINTS: Record<ViInspectionRole, string> = {
  inspector: "/vi_inspections/inspector_inspections.json",
  spoc: "/vi_inspections/spoc_inspections.json",
  action_owner: "/vi_inspections/action_owner_inspections.json",
  functional_head: "/vi_inspections/functional_head_inspections.json",
};

export interface ViInspectionListPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

/** One page of a role's inspections; `query` holds the list filters (date_from, status, circle_id…). */
export const useViInspectionList = (role: ViInspectionRole, page: number, query: Record<string, string>) => {
  const queryKey = JSON.stringify(query);
  const path = useMemo(() => {
    const params = new URLSearchParams({
      ...(JSON.parse(queryKey) as Record<string, string>),
      page: String(page),
      per_page: String(VI_INSPECTION_LIST_PER_PAGE),
    });
    return `${LIST_ENDPOINTS[role]}?${params.toString()}`;
  }, [role, page, queryKey]);
  const { json, loading, reload } = useViInspectionQuery(path, "Failed to load inspections");

  return useMemo(() => {
    const root = obj(json);
    const rows = Array.isArray(root.data) ? (root.data as Raw[]) : arr(obj(root.data).vi_inspections, root.vi_inspections);
    const meta = obj(root.pagination ?? root.meta);
    const totalCount = num(meta.total_count, meta.total, rows.length);
    return {
      inspections: rows.map(toInspectionRecord),
      loading,
      reload,
      pagination: {
        currentPage: num(meta.current_page) || page,
        totalPages: Math.max(1, num(meta.total_pages, Math.ceil(totalCount / VI_INSPECTION_LIST_PER_PAGE))),
        totalCount,
      } as ViInspectionListPagination,
    };
  }, [json, loading, reload, page]);
};

/** Role dashboard cards — flat numbers (GET /vi_inspections/<role>_dashboard.json). */
export const useViInspectionDashboard = (role: ViInspectionRole) => {
  const { json, loading } = useViInspectionQuery(`/vi_inspections/${role}_dashboard.json`, "Failed to load inspection summary");
  const counts = useMemo(() => {
    const data = unwrap(json);
    const nested = obj(data[role]);
    return Object.keys(nested).length ? nested : data;
  }, [json, role]);
  return { counts, loading };
};

/** One inspection with responses, plans, assignments and action-taken entries (GET /vi_inspections/:id.json). */
export const useViInspectionDetail = (id: string | undefined) => {
  const { json, loading, reload } = useViInspectionQuery(
    id ? `/vi_inspections/${encodeURIComponent(id)}.json` : null,
    "Failed to load inspection",
  );
  const inspection = useMemo(() => (json ? toInspectionRecord(unwrap(json)) : null), [json]);
  return { inspection, loading, reload };
};

export const fetchViInspection = async (id: number | string) =>
  toInspectionRecord(unwrap(await viInspectionRequest(`/vi_inspections/${encodeURIComponent(String(id))}.json`)));

// ---------------------------------------------------------------------------------------------
// Inspector: create / update draft, submit

export interface InspectionResponseInput {
  questionId: string;
  answer: string;
  remark: string;
  files: File[];
  removeAttachmentIds: string[];
}

export interface InspectionFormInput {
  inspection_date: string;
  circle_id: string;
  personal_area_id: string;
  work_location_id: string;
  inspection_type_id: string;
  inspector_location: string;
  /** Lat/long-required types only: the inspector's coordinates and the nearby site picked. */
  latitude?: string;
  longitude?: string;
  inspection_site_id?: string;
  department_id: string;
  facility_type_id: string;
  spoc_id: string;
  functional_head_id: string;
  target_date: string;
  responses: InspectionResponseInput[];
}

// Multipart so checklist attachments go with the form (vi_inspection[checklist_responses][i][attachments][]).
const inspectionFormData = ({ responses, ...fields }: InspectionFormInput, submit: boolean) => {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    // Location fields only go out when set (other types don't use them).
    if (value === undefined || (["latitude", "longitude", "inspection_site_id"].includes(key) && !value)) return;
    form.append(`vi_inspection[${key}]`, value ?? "");
  });
  responses.forEach((r, i) => {
    const prefix = `vi_inspection[checklist_responses][${i}]`;
    form.append(`${prefix}[checklist_question_master_id]`, r.questionId);
    form.append(`${prefix}[answer]`, r.answer);
    form.append(`${prefix}[remark]`, r.remark);
    r.files.forEach((file) => form.append(`${prefix}[attachments][]`, file));
    r.removeAttachmentIds.forEach((id) => form.append(`${prefix}[remove_attachment_ids][]`, id));
  });
  form.append("submit", String(submit));
  return form;
};

/**
 * Saves the Inspector's inspection: POST /vi_inspections.json (new) or PATCH /vi_inspections/:id.json
 * (own draft), then POST /vi_inspections/:id/submit.json when submitting an existing draft.
 * Returns the inspection id.
 */
export const saveViInspection = async (id: string | undefined, input: InspectionFormInput, submit: boolean) => {
  if (!id) {
    const json = await viInspectionRequest("/vi_inspections.json", { method: "POST", body: inspectionFormData(input, submit) });
    return text(unwrap(json).id);
  }
  await viInspectionRequest(`/vi_inspections/${encodeURIComponent(id)}.json`, {
    method: "PATCH",
    body: inspectionFormData(input, false),
  });
  if (submit) await viInspectionRequest(`/vi_inspections/${encodeURIComponent(id)}/submit.json`, { method: "POST" });
  return id;
};

// ---------------------------------------------------------------------------------------------
// SPOC: action plans + target-date extension

export interface ActionPlanInput {
  id: string | null;
  checklist_response_id: string;
  action_type: ViInspectionActionType;
  action_description: string;
  target_date: string;
  responsible_person_ids: string[];
}

/** PUT /vi_inspections/:id/action_plans.json (draft) or POST …/action_plans/submit.json (submit). */
export const saveViInspectionActionPlans = (
  inspectionId: string,
  actionPlans: ActionPlanInput[],
  removeActionPlanIds: string[],
  submit: boolean,
) =>
  viInspectionRequest(
    `/vi_inspections/${encodeURIComponent(inspectionId)}/action_plans${submit ? "/submit" : ""}.json`,
    {
      method: submit ? "POST" : "PUT",
      body: { action_plans: actionPlans, remove_action_plan_ids: removeActionPlanIds },
    },
  );

/** PUT /vi_inspection_action_plans/:id/extend_target_date.json — SPOC only; history kept by the API. */
export const extendViInspectionTargetDate = (planId: string, extendTargetDate: string, extensionReason: string) =>
  viInspectionRequest(`/vi_inspection_action_plans/${encodeURIComponent(planId)}/extend_target_date.json`, {
    method: "PUT",
    body: { extend_target_date: extendTargetDate, extension_reason: extensionReason },
  });

// ---------------------------------------------------------------------------------------------
// Action Owner: action-taken entries + assignment submit

export interface ActionTakenInput {
  description: string;
  closureDate: string;
  files: File[];
  removeAttachmentIds: string[];
}

const actionTakenFormData = (input: ActionTakenInput, assignmentId?: string) => {
  const form = new FormData();
  if (assignmentId) form.append("action_assignment_id", assignmentId);
  form.append("vi_inspection_action_taken[description]", input.description);
  form.append("vi_inspection_action_taken[closure_date]", input.closureDate);
  input.files.forEach((file) => form.append("vi_inspection_action_taken[attachments][]", file));
  input.removeAttachmentIds.forEach((id) => form.append("vi_inspection_action_taken[remove_attachment_ids][]", id));
  return form;
};

/** POST /vi_inspection_action_takens.json — a new entry on the owner's assignment (assignment → draft). */
export const createViInspectionActionTaken = (assignmentId: string, input: ActionTakenInput) =>
  viInspectionRequest("/vi_inspection_action_takens.json", {
    method: "POST",
    body: actionTakenFormData(input, assignmentId),
  });

/** PATCH /vi_inspection_action_takens/:id.json — own entry on an unsubmitted assignment. */
export const updateViInspectionActionTaken = (id: string, input: ActionTakenInput) =>
  viInspectionRequest(`/vi_inspection_action_takens/${encodeURIComponent(id)}.json`, {
    method: "PATCH",
    body: actionTakenFormData(input),
  });

/** DELETE /vi_inspection_action_takens/:id.json */
export const deleteViInspectionActionTaken = (id: string) =>
  viInspectionRequest(`/vi_inspection_action_takens/${encodeURIComponent(id)}.json`, { method: "DELETE" });

/** POST /vi_inspection_action_assignments/:id/submit.json — closes only this owner's assignment. */
export const submitViInspectionAssignment = (id: string) =>
  viInspectionRequest(`/vi_inspection_action_assignments/${encodeURIComponent(id)}/submit.json`, { method: "POST" });
