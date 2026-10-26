import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { getUser } from "@/utils/auth";
import { apiErrorMessage } from "@/components/vi-audit/viAuditApi";
import { arr, obj, personName, text, toAttachment } from "@/components/vi-audit/useViAuditDetail";
import type { MasterOption } from "@/components/vi-audit/useViAuditMasters";
import type { ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import {
  isAssignmentDraft,
  type ViIncidentActionPlan,
  type ViIncidentActionType,
  type ViIncidentAssignment,
  type ViIncidentAttachment,
  type ViIncidentChecklistItem,
  type ViIncidentInjury,
  type ViIncidentRecord,
  type ViIncidentRole,
} from "./viIncidentData";

// VI Incident API (docs/vi_incident/API.md): masters, role lists / dashboards, incident detail,
// reporter create/update, SPOC investigation, action plan extension and action owner assignments.

type Raw = Record<string, unknown>;

export const VI_INCIDENT_LIST_ENDPOINTS: Record<ViIncidentRole, string> = {
  reporter: "/vi_incidents/reporter_incidents.json",
  spoc: "/vi_incidents/spoc_incidents.json",
  action_owner: "/vi_incidents/action_owner_incidents.json",
  functional_head: "/vi_incidents/functional_head_incidents.json",
};
export const VI_INCIDENT_LIST_PER_PAGE = 20;

export const num = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  }
  return 0;
};

const bool = (value: unknown) => value === true || value === 1 || String(value).toLowerCase() === "true";

// ---------------------------------------------------------------------------------------------
// Requests

/** Authenticated JSON (or multipart, for a FormData body) request; throws with the API's error message. */
export const viIncidentRequest = async (
  path: string,
  { method = "GET", body, signal }: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<unknown> => {
  const isForm = body instanceof FormData;
  const response = await fetch(getFullUrl(path), {
    method,
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
      ...(body !== undefined && !isForm ? { "Content-Type": "application/json" } : {}),
    },
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    signal,
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) throw new Error(apiErrorMessage(json) || `Request failed with status ${response.status}`);
  return json;
};

/** "Failed to save draft: <API message>" */
export const errorToast = (prefix: string, error: unknown) => {
  console.error(prefix, error);
  const message = error instanceof Error ? error.message : "";
  toast.error(`${prefix}${message ? `: ${message}` : ""}`);
};

/** GET `path` (skipped while null); `reload` refetches. */
const useViIncidentQuery = (path: string | null, errorMessage: string) => {
  const [json, setJson] = useState<unknown>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    viIncidentRequest(path, { signal: controller.signal })
      .then(setJson)
      .catch((error) => {
        if (controller.signal.aborted) return;
        errorToast(errorMessage, error);
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
// Response mapping (field names are read defensively: nested objects or flat *_id / *_name)

const KOLKATA = "Asia/Kolkata";

// Date / time from "2026-10-23", "09:30" or an ISO datetime (read in the app time zone).
const dateTimeParts = (value: string): { date: string; time: string } => {
  if (!value) return { date: "", time: "" };
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return { date: value, time: "" };
  if (/^\d{1,2}:\d{2}/.test(value)) return { date: "", time: value.slice(0, value.indexOf(":") + 3).padStart(5, "0") };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { date: value.slice(0, 10), time: "" };
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KOLKATA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(parsed);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
};

const isoDate = (value: unknown) => dateTimeParts(text(value)).date;

// "2026-03-23" -> "23/03/2026"
const displayDate = (iso: string) => (iso ? iso.split("-").reverse().join("/") : "");

// "13:20" -> "01:20 PM"
const displayTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

const masterLabel = (r: Raw) =>
  text(r.name, r.cluster_name, r.work_location_name, r.department_name, r.title, r.label, r.value);

const masterId = (r: Raw, key: string) => text(r[`${key}_id`], obj(r[key]).id);
const masterName = (r: Raw, key: string) => text(masterLabel(obj(r[key])), r[`${key}_name`]);

const toUser = (r: Raw, key: string): ViActiveUserOption | null => {
  const person = obj(r[key]);
  const id = text(r[`${key}_id`], person.id);
  if (!id) return null;
  return {
    id,
    name: text(personName(person), r[`${key}_name`]) || `User ${id}`,
    email: text(person.email) || undefined,
  };
};

const toIncidentAttachment = (value: unknown): ViIncidentAttachment => ({
  id: text(obj(value).id),
  ...toAttachment(value),
});

// "pending_by_spoc" -> "Pending By SPOC" (the API's own label style).
const titleCase = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => (word.toLowerCase() === "spoc" ? "SPOC" : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");

// The API sends `workflow_status` as a label; a bare key (no label available) is formatted from the key.
const workflowLabel = (value: string) => (/^[a-z_]+$/.test(value) ? titleCase(value) : value);

const toAssignment = (a: Raw): ViIncidentAssignment => ({
  id: text(a.id),
  owner: toUser(a, "responsible_person") ?? toUser(a, "user") ?? toUser(a, "action_owner"),
  status: text(a.status).toLowerCase() || "open",
  actionTaken: text(a.action_taken),
  closureDate: isoDate(a.closure_date),
  attachments: arr(a.attachments, a.documents).map(toIncidentAttachment),
});

const checklistItemId = (r: Raw) =>
  text(r.checklist_sub_sub_category_id, obj(r.checklist_sub_sub_category).id);

// Checklist item name / path from a selection or plan row carrying nested category records.
const toChecklistItem = (r: Raw, id: string): ViIncidentChecklistItem => ({
  id,
  name: text(masterName(r, "checklist_sub_sub_category")) || `Checklist item ${id}`,
  path: [masterName(r, "checklist_category"), masterName(r, "checklist_sub_category")].filter(Boolean).join(" / "),
});

const toActionPlan = (p: Raw): ViIncidentActionPlan => ({
  id: text(p.id),
  checklistItemId: checklistItemId(p),
  actionType: (text(p.action_type).toLowerCase() === "preventive" ? "preventive" : "corrective") as ViIncidentActionType,
  description: text(p.action_description, p.description),
  targetDate: isoDate(p.target_date),
  extendTargetDate: isoDate(p.extend_target_date),
  extensionReason: text(p.extension_reason),
  status: text(p.status),
  assignments: arr(p.assignments, p.action_assignments, p.vi_incident_action_assignments).map(toAssignment),
});

const toInjury = (i: Raw): ViIncidentInjury => ({
  id: text(i.id),
  name: text(i.impacted_person_name),
  age: text(i.impacted_person_age),
  personTypeId: masterId(i, "injured_person_type"),
  personType: masterName(i, "injured_person_type"),
  natureOfInjuryId: masterId(i, "nature_of_injury"),
  natureOfInjury: masterName(i, "nature_of_injury"),
  bodyPartId: masterId(i, "body_part"),
  bodyPart: masterName(i, "body_part"),
  vendor: text(i.vendor),
  subVendor: text(i.sub_vendor),
});

/** Maps one incident (list row or GET /vi_incidents/:id.json) onto the shared record. */
export const toIncidentRecord = (r: Raw, index = 0): ViIncidentRecord => {
  const id = num(r.id) || index + 1;
  const storedStatus = text(r.status).toLowerCase();
  const rawWorkflow = text(r.workflow_status);
  const statusKey = text(r.workflow_status_key) || (rawWorkflow.includes("_") ? rawWorkflow : "") || storedStatus;
  const status = (rawWorkflow && workflowLabel(rawWorkflow)) || workflowLabel(statusKey) || titleCase(storedStatus);

  const incidentAt = text(r.incident_at, r.incident_datetime, r.incident_date_time);
  const at = dateTimeParts(incidentAt);
  const incidentDateIso = isoDate(r.incident_date) || at.date;
  const incidentTime24 = dateTimeParts(text(r.incident_time)).time || at.time;
  const reported = dateTimeParts(text(r.reported_at, r.submitted_at, r.created_at));

  const reporter = obj(r.reporter ?? r.created_by ?? r.user);
  const spocUser = toUser(r, "spoc");
  const functionalHeadUser = toUser(r, "functional_head");

  // "Others" masters carry their free-text value.
  const withOther = (key: string) => text(r[`${key}_other_value`]) || masterName(r, key);

  // Investigation may be nested or flattened onto the incident. On the incident itself
  // `submitted_at` is the reporter's submission — the SPOC's is `spoc_submitted_at`.
  const invRaw = obj(r.investigation ?? r.vi_incident_investigation);
  const nestedInv = Object.keys(invRaw).length > 0;
  const inv = nestedInv ? invRaw : r;
  const investigationSubmitted =
    Boolean(text(r.spoc_submitted_at)) ||
    (nestedInv &&
      (bool(invRaw.submitted) || Boolean(text(invRaw.submitted_at)) || text(invRaw.status).toLowerCase() === "submitted")) ||
    !["", "draft", "pending_by_spoc", "open"].includes(statusKey);

  const actionPlans = arr(r.action_plans, inv.action_plans, r.vi_incident_action_plans).map(toActionPlan);

  // Selected checklist items: explicit selections first, then whatever the plans reference.
  const items = new Map<string, ViIncidentChecklistItem>();
  for (const row of arr(r.checklist_items, r.checklist_selections, inv.checklist_items, inv.checklist_selections)) {
    const itemId = checklistItemId(row) || text(row.id);
    if (itemId && !items.has(itemId)) items.set(itemId, toChecklistItem(row, itemId));
  }
  for (const value of [
    ...(Array.isArray(r.checklist_sub_sub_category_ids) ? r.checklist_sub_sub_category_ids : []),
    ...(Array.isArray(inv.checklist_sub_sub_category_ids) ? inv.checklist_sub_sub_category_ids : []),
  ]) {
    const itemId = text(value);
    if (itemId && !items.has(itemId)) items.set(itemId, toChecklistItem({}, itemId));
  }
  arr(r.action_plans, inv.action_plans, r.vi_incident_action_plans).forEach((p) => {
    const itemId = checklistItemId(p);
    if (!itemId) return;
    const fromPlan = toChecklistItem(p, itemId);
    const existing = items.get(itemId);
    if (!existing || (existing.name.startsWith("Checklist item") && !fromPlan.name.startsWith("Checklist item"))) {
      items.set(itemId, fromPlan);
    }
  });

  return {
    id,
    incidentNo: text(r.incident_no, r.incident_number, r.incident_code) || String(id),
    status,
    statusKey,
    storedStatus,
    canEdit: r.can_edit === undefined ? storedStatus === "draft" : bool(r.can_edit),
    reporter: {
      name: text(personName(reporter), r.reporter_name, r.created_by_name),
      mailId: text(reporter.email, r.reporter_email),
      employer: text(reporter.employer, reporter.designation, reporter.company_name, r.reporter_employer),
    },
    dateOfReport: displayDate(reported.date),
    timeOfReport: displayTime(reported.time),
    dateOfIncident: displayDate(incidentDateIso),
    timeOfIncident: incidentTime24 ? displayTime(incidentTime24) : "",
    incidentDateIso,
    incidentTime24,
    circle: masterName(r, "circle"),
    personnelArea: masterName(r, "personal_area"),
    workLocation: masterName(r, "work_location"),
    facilityType: withOther("facility_type"),
    incidentLocation: text(r.location, r.incident_location),
    function: masterName(r, "department"),
    classification: withOther("classification"),
    category: withOther("category"),
    subCategory: withOther("sub_category"),
    ids: {
      circle: masterId(r, "circle"),
      personnelArea: masterId(r, "personal_area"),
      workLocation: masterId(r, "work_location"),
      function: masterId(r, "department"),
      facilityType: masterId(r, "facility_type"),
      classification: masterId(r, "classification"),
      category: masterId(r, "category"),
      subCategory: masterId(r, "sub_category"),
    },
    otherValues: {
      classification: text(r.classification_other_value),
      category: text(r.category_other_value),
      subCategory: text(r.sub_category_other_value),
      facilityType: text(r.facility_type_other_value),
    },
    incident: text(r.incident_details, r.details),
    injuryHappened: bool(r.injury_happened),
    spoc: spocUser?.name ?? "",
    functionalHead: functionalHeadUser?.name ?? "",
    spocUser,
    functionalHeadUser,
    attachments: arr(r.attachments, r.documents).map(toIncidentAttachment),
    injuries: arr(r.injuries, r.injuries_attributes, r.vi_incident_injuries).map(toInjury),
    investigation: {
      submitted: investigationSubmitted,
      required: bool(inv.investigation_required),
      notRequiredReason: text(inv.investigation_not_required_reason),
      daysAwayFromWork: text(inv.days_away_from_work),
      restrictedWorkDays: text(inv.restricted_work_days),
      breach: bool(inv.breach_of_absolute_safety_rules),
      breachSafetyRuleId: masterId(inv, "breach_safety_rule"),
      breachSafetyRule: masterName(inv, "breach_safety_rule"),
      breachSafetyRuleOther: text(inv.breach_safety_rule_other_value),
      summary: text(inv.investigation_summary),
      conclusionId: masterId(inv, "investigation_conclusion"),
      conclusion: masterName(inv, "investigation_conclusion"),
    },
    checklistItems: [...items.values()],
    actionPlans,
    myAssignmentIds: arr(r.my_assignments).map((a) => text(a.id)).filter(Boolean),
    myAssignmentStatuses: arr(r.my_assignments).map((a) => text(a.status).toLowerCase()).filter(Boolean),
    injuriesCount: num(r.injuries_count),
    actionPlansCount: num(r.action_plans_count),
    assignmentsCount: num(r.assignments_count),
    pendingAssignmentsCount: num(r.pending_assignments_count),
  };
};

const unwrap = (json: unknown): Raw => {
  const root = obj(json);
  return obj(root.vi_incident ?? root.incident ?? root.data ?? root);
};

// ---------------------------------------------------------------------------------------------
// Masters

export interface ViIncidentMasters {
  circles: MasterOption[];
  personalAreas: MasterOption[];
  workLocations: MasterOption[];
  departments: MasterOption[];
  facilityTypes: MasterOption[];
  classifications: MasterOption[];
  categories: MasterOption[];
  subCategories: MasterOption[];
  injuredPersonTypes: MasterOption[];
  naturesOfInjury: MasterOption[];
  bodyParts: MasterOption[];
  breachSafetyRules: MasterOption[];
  investigationConclusions: MasterOption[];
  checklistCategories: MasterOption[];
}

const EMPTY_MASTERS: ViIncidentMasters = {
  circles: [],
  personalAreas: [],
  workLocations: [],
  departments: [],
  facilityTypes: [],
  classifications: [],
  categories: [],
  subCategories: [],
  injuredPersonTypes: [],
  naturesOfInjury: [],
  bodyParts: [],
  breachSafetyRules: [],
  investigationConclusions: [],
  checklistCategories: [],
};

const toOptions = (value: unknown): MasterOption[] =>
  arr(value)
    .map((r) => ({ value: text(r.id), label: masterLabel(r) }))
    .filter((option) => option.value && option.label);

// One masters request per login, shared by the forms and filter dialogs.
let mastersCache: { auth: string; promise: Promise<ViIncidentMasters> } | null = null;

const loadMasters = () => {
  // Cache key only — a missing token must not throw here (the request itself reports it).
  let auth = "";
  try {
    auth = getAuthHeader();
  } catch {
    auth = "";
  }
  if (mastersCache?.auth !== auth) {
    const promise = viIncidentRequest("/vi_incidents/masters.json").then((json) => {
      const root = obj(json);
      const d = obj(root.data ?? root);
      return {
        circles: toOptions(d.circles),
        personalAreas: toOptions(d.personal_areas),
        workLocations: toOptions(d.work_locations),
        departments: toOptions(d.departments),
        facilityTypes: toOptions(d.facility_types),
        classifications: toOptions(d.classifications),
        categories: toOptions(d.categories),
        subCategories: toOptions(d.sub_categories),
        injuredPersonTypes: toOptions(d.injured_person_types),
        naturesOfInjury: toOptions(d.natures_of_injury),
        bodyParts: toOptions(d.body_parts),
        breachSafetyRules: toOptions(d.breach_safety_rules),
        investigationConclusions: toOptions(d.investigation_conclusions),
        checklistCategories: toOptions(d.checklist_categories),
      };
    });
    promise.catch(() => {
      mastersCache = null;
    });
    mastersCache = { auth, promise };
  }
  return mastersCache.promise;
};

/** Dropdown masters for the incident forms and filters (GET /vi_incidents/masters.json). */
export const useViIncidentMasters = () => {
  const [masters, setMasters] = useState<ViIncidentMasters>(EMPTY_MASTERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadMasters()
      .then((result) => active && setMasters(result))
      .catch((error) => active && errorToast("Failed to load incident dropdown options", error))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { masters, loading };
};

/** True when the chosen master is the "Others" record (which needs `<field>_other_value`). */
export const isOthersOption = (options: MasterOption[], value: string) =>
  /^others?$/i.test(options.find((option) => option.value === value)?.label.trim() ?? "");

export interface ViIncidentChecklistCategory {
  id: string;
  name: string;
  subCategories: { id: string; name: string; items: { id: string; name: string }[] }[];
}

/** Checklist categories with their sub / sub-sub categories (GET /vi_incidents/checklist_hierarchy.json). */
export const useViIncidentChecklistHierarchy = (categoryIds: string[]) => {
  const path = categoryIds.length
    ? `/vi_incidents/checklist_hierarchy.json?${categoryIds.map((id) => `category_ids[]=${encodeURIComponent(id)}`).join("&")}`
    : null;
  const { json, loading } = useViIncidentQuery(path, "Failed to load root cause checklist");
  const categories = useMemo<ViIncidentChecklistCategory[]>(() => {
    const data = obj(json).data;
    const rows = Array.isArray(data) ? (data as Raw[]) : data ? [obj(data)] : [];
    return rows.map((c) => ({
      id: text(c.id),
      name: text(c.name),
      subCategories: arr(c.sub_categories).map((s) => ({
        id: text(s.id),
        name: text(s.name),
        items: arr(s.sub_sub_categories).map((i) => ({ id: text(i.id), name: text(i.name) })),
      })),
    }));
  }, [json]);
  return { categories, loading };
};

// ---------------------------------------------------------------------------------------------
// Lists, dashboards, detail

export interface ViIncidentListPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

/** One page of a role's incident list; `query` holds workflow_status / q[...] filters. */
export const useViIncidentList = (role: ViIncidentRole, page: number, query: Record<string, string>) => {
  const queryKey = JSON.stringify(query);
  const path = useMemo(() => {
    const params = new URLSearchParams({
      ...(JSON.parse(queryKey) as Record<string, string>),
      page: String(page),
      per_page: String(VI_INCIDENT_LIST_PER_PAGE),
    });
    return `${VI_INCIDENT_LIST_ENDPOINTS[role]}?${params.toString()}`;
  }, [role, page, queryKey]);
  const { json, loading } = useViIncidentQuery(path, "Failed to load incidents");

  return useMemo(() => {
    const root = obj(json);
    const data = root.data;
    const rows = Array.isArray(data)
      ? (data as Raw[])
      : arr(obj(data).vi_incidents, obj(data).incidents, root.vi_incidents, root.incidents);
    const meta = obj(root.pagination ?? root.meta ?? obj(data).pagination);
    const totalCount = num(meta.total_count, meta.total, meta.total_entries, rows.length);
    return {
      incidents: rows.map(toIncidentRecord),
      loading,
      pagination: {
        currentPage: num(meta.current_page, meta.page) || page,
        totalPages: Math.max(1, num(meta.total_pages, Math.ceil(totalCount / VI_INCIDENT_LIST_PER_PAGE))),
        totalCount,
      } as ViIncidentListPagination,
    };
  }, [json, loading, page]);
};

/** Role dashboard counters (GET /vi_incidents/<role>_dashboard.json). */
export const useViIncidentDashboard = (role: ViIncidentRole) => {
  const { json, loading } = useViIncidentQuery(`/vi_incidents/${role}_dashboard.json`, "Failed to load incident summary");
  const dashboard = useMemo(() => {
    const root = obj(json);
    const data = obj(root.data ?? root);
    // dashboard.json?role= nests the counters under the role name.
    const nested = obj(data[role]);
    return Object.keys(nested).length ? nested : data;
  }, [json, role]);
  return { dashboard, loading };
};

/** A top-level dashboard counter, first of `keys` present. */
export const dashboardCount = (dashboard: Raw, ...keys: string[]) => num(...keys.map((key) => dashboard[key]));

/** The API's label for a `workflow` / `milestones` counter, or `fallback` when it sends none. */
export const dashboardGroupLabel = (
  dashboard: Raw,
  group: "workflow" | "milestones",
  key: string,
  fallback: string,
) => text(obj(obj(dashboard[group])[key]).label) || fallback;

/** A `workflow` / `milestones` counter — `{ key: { label, count } }` or `{ key: n }`. */
export const dashboardGroupCount = (dashboard: Raw, group: "workflow" | "milestones", key: string) => {
  const entry = obj(dashboard[group])[key];
  return num(obj(entry).count, entry);
};

/**
 * Status filter options exactly as the API reports them (dashboard `workflow`:
 * `{ key: { label, count } }`) — no built-in list; empty until the dashboard loads.
 */
export const dashboardWorkflowOptions = (dashboard: Raw): MasterOption[] =>
  Object.entries(obj(dashboard.workflow))
    .map(([key, entry]) => {
      const label = text(obj(entry).label) || titleCase(key);
      const count = obj(entry).count;
      return { value: key, label: count === undefined ? label : `${label} (${num(count)})` };
    })
    .filter((option) => option.value && option.label);

// Action owner dashboard counters → the `assignment_status` value each one counts.
const ASSIGNMENT_STATUS_COUNTERS: [counter: string, status: string][] = [
  ["pending_actions", "open"],
  ["draft_actions", "draft"],
  ["completed_actions", "closed"],
];

/**
 * "My actions" filter options for the action owner list: the API's own `assignment_statuses`
 * list when it sends one, otherwise one option per assignment counter the dashboard reports
 * (label from the counter's name). No counts: they count actions (assignments), while the list
 * shows each incident once — 8 completed actions can sit on 2 incidents. Empty until the dashboard loads.
 */
export const dashboardAssignmentStatusOptions = (dashboard: Raw): MasterOption[] => {
  const fromApi = arr(dashboard.assignment_statuses)
    .map((s) => ({ value: text(s.key, s.value, s.status), label: text(s.label, s.name) }))
    .filter((option) => option.value && option.label);
  if (fromApi.length) return fromApi;
  return ASSIGNMENT_STATUS_COUNTERS.filter(([counter]) => dashboard[counter] !== undefined).map(([counter, status]) => ({
    value: status,
    label: titleCase(counter.replace(/_actions$/, "")),
  }));
};

/** One incident with injuries, investigation and action plans (GET /vi_incidents/:id.json). */
export const useViIncidentDetail = (id: string | undefined) => {
  const { json, loading, reload } = useViIncidentQuery(
    id ? `/vi_incidents/${encodeURIComponent(id)}.json` : null,
    "Failed to load incident",
  );
  const incident = useMemo(() => (json ? toIncidentRecord(unwrap(json)) : null), [json]);
  return { incident, loading, reload };
};

/**
 * Full records (GET /vi_incidents/:id.json) for the given list rows — for what list rows leave out,
 * e.g. the SPOC's saved investigation / action plans. A failed fetch just leaves that row out.
 */
export const useViIncidentDetails = (ids: number[]) => {
  const idsKey = ids.join(",");
  const [details, setDetails] = useState<Map<number, ViIncidentRecord>>(new Map());

  useEffect(() => {
    if (!idsKey) {
      setDetails(new Map());
      return;
    }
    const controller = new AbortController();
    Promise.all(
      idsKey.split(",").map((id) =>
        viIncidentRequest(`/vi_incidents/${encodeURIComponent(id)}.json`, { signal: controller.signal })
          .then((json) => toIncidentRecord(unwrap(json)))
          .catch(() => null),
      ),
    ).then((records) => {
      if (controller.signal.aborted) return;
      setDetails(new Map(records.filter((r): r is ViIncidentRecord => r !== null).map((r) => [r.id, r])));
    });
    return () => controller.abort();
  }, [idsKey]);

  return details;
};

/** Logged-in user's id — action owners only see / act on their own assignments. */
export const currentUserId = () => text(getUser()?.id);

// The incident an assignment row belongs to (flat id, nested incident, or via its action plan).
const assignmentIncidentId = (a: Raw) => {
  const plan = obj(a.action_plan ?? a.vi_incident_action_plan);
  return text(
    a.vi_incident_id,
    a.incident_id,
    obj(a.vi_incident ?? a.incident).id,
    plan.vi_incident_id,
    plan.incident_id,
    obj(plan.vi_incident ?? plan.incident).id,
  );
};

/**
 * Ids of the logged-in owner's assignments on one incident
 * (GET /vi_incident_action_assignments.json — the API only returns the caller's own).
 */
export const useViIncidentMyAssignmentIds = (incidentId: string | undefined) => {
  const { json, loading } = useViIncidentQuery(
    incidentId ? "/vi_incident_action_assignments.json?per_page=100" : null,
    "Failed to load your assignments",
  );
  const ids = useMemo(
    () => assignmentRows(json).filter((a) => assignmentIncidentId(a) === incidentId).map((a) => text(a.id)).filter(Boolean),
    [json, incidentId],
  );
  return { ids, loading };
};

const assignmentRows = (json: unknown) => {
  const root = obj(json);
  const data = root.data;
  return Array.isArray(data) ? (data as Raw[]) : arr(obj(data).assignments, root.assignments);
};

/**
 * Incidents where the logged-in owner has saved an action taken without submitting it — status
 * "draft", or still open with an action taken filled in (GET /vi_incident_action_assignments.json).
 */
export const useViIncidentMyDraftIncidentIds = () => {
  const { json } = useViIncidentQuery("/vi_incident_action_assignments.json?per_page=100", "Failed to load your assignments");
  return useMemo(() => draftIncidentIds(json), [json]);
};

export const draftIncidentIds = (assignmentsJson: unknown) =>
  new Set(
    assignmentRows(assignmentsJson)
      .filter((row) => isAssignmentDraft(toAssignment(row)))
      .map(assignmentIncidentId)
      .filter(Boolean),
  );

/**
 * The incident's plans narrowed to the logged-in action owner's assignments: those listed by the
 * assignments API (`myAssignmentIds`), else `my_assignments` / a responsible-person match.
 */
export const isMyAssignment = (incident: ViIncidentRecord, myAssignmentIds: string[] = []) => {
  const me = currentUserId();
  return (a: ViIncidentAssignment) =>
    myAssignmentIds.includes(a.id) ||
    incident.myAssignmentIds.includes(a.id) ||
    (Boolean(me) && a.owner?.id === me);
};

/** Plans narrowed to the logged-in owner's own assignments — for editing their action taken. */
export const myActionPlans = (incident: ViIncidentRecord, myAssignmentIds: string[] = []) => {
  const mine = isMyAssignment(incident, myAssignmentIds);
  return incident.actionPlans
    .map((plan) => ({ ...plan, assignments: plan.assignments.filter(mine) }))
    .filter((plan) => plan.assignments.length > 0);
};

/**
 * Plans the logged-in owner is on, with EVERY owner's assignment kept — so the action owner's view
 * shows co-owners too, and whose action is still pending.
 */
export const plansAssignedToMe = (incident: ViIncidentRecord, myAssignmentIds: string[] = []) => {
  const mine = isMyAssignment(incident, myAssignmentIds);
  return incident.actionPlans.filter((plan) => plan.assignments.some(mine));
};

// ---------------------------------------------------------------------------------------------
// Writes

/** Reporter: create (POST) or update a draft (PATCH); `submit` submits it. */
export const saveViIncident = (id: string | undefined, viIncident: Raw, submit: boolean) =>
  viIncidentRequest(id ? `/vi_incidents/${encodeURIComponent(id)}.json` : "/vi_incidents.json", {
    method: id ? "PATCH" : "POST",
    body: { vi_incident: viIncident, submit },
  });

/** Reporter: submit an own draft as it is saved (the API validates it). */
export const submitViIncident = (id: string) =>
  viIncidentRequest(`/vi_incidents/${encodeURIComponent(id)}/submit.json`, { method: "POST" });

/** SPOC: save the investigation + checklist + action plans; `submit` releases them to owners. */
export const saveViIncidentInvestigation = (id: string, body: Raw, submit: boolean) =>
  viIncidentRequest(`/vi_incidents/${encodeURIComponent(id)}/investigation.json`, {
    method: "PATCH",
    body: { ...body, submit },
  });

/** SPOC: push an expired deadline out. */
export const extendViIncidentTargetDate = (planId: string, extendTargetDate: string, extensionReason: string) =>
  viIncidentRequest(`/vi_incident_action_plans/${encodeURIComponent(planId)}/extend_target_date.json`, {
    method: "PUT",
    body: { vi_incident_action_plan: { extend_target_date: extendTargetDate, extension_reason: extensionReason } },
  });

/** Action owner: save an assignment draft (multipart, so files upload as-is). */
export const saveViIncidentAssignment = (
  id: string,
  { actionTaken, closureDate, files, removeAttachmentIds }: {
    actionTaken: string;
    closureDate: string;
    files: File[];
    removeAttachmentIds: string[];
  },
) => {
  const form = new FormData();
  form.append("vi_incident_action_assignment[action_taken]", actionTaken);
  form.append("vi_incident_action_assignment[closure_date]", closureDate);
  files.forEach((file) => form.append("vi_incident_action_assignment[attachments][]", file));
  removeAttachmentIds.forEach((attachmentId) =>
    form.append("vi_incident_action_assignment[remove_attachment_ids][]", attachmentId),
  );
  return viIncidentRequest(`/vi_incident_action_assignments/${encodeURIComponent(id)}.json`, {
    method: "PATCH",
    body: form,
  });
};

/** Action owner: submit an assignment (needs action_taken + closure_date). */
export const submitViIncidentAssignment = (id: string, actionTaken: string, closureDate: string) =>
  viIncidentRequest(`/vi_incident_action_assignments/${encodeURIComponent(id)}/submit.json`, {
    method: "POST",
    body: { vi_incident_action_assignment: { action_taken: actionTaken, closure_date: closureDate } },
  });
