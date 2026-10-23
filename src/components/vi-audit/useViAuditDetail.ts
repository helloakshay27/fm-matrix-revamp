import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import type {
  ViActionPlan,
  ViAuditDetail,
  ViObservation,
  ViObservationStatus,
  ViActionPlanStatus,
} from "./viAuditData";

type Raw = Record<string, unknown>;

export const obj = (value: unknown): Raw => (value && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : {});
export const arr = (...values: unknown[]): Raw[] => {
  for (const value of values) if (Array.isArray(value)) return value as Raw[];
  return [];
};
export const text = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
};
export const personName = (value: unknown) => {
  const p = obj(value);
  return text(p.full_name, p.name, [text(p.firstname), text(p.lastname)].filter(Boolean).join(" "), p.email);
};

// "pending_by_spoc" -> "Pending By SPOC", "closed" -> "Closed"
// First non-empty value as a label.
const statusLabel = (...values: unknown[]) =>
  text(...values)
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => (word.toLowerCase() === "spoc" ? "SPOC" : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");

// Attachments may be URLs, data URLs or { url, file_name / name } objects.
export const toAttachment = (value: unknown) => {
  if (typeof value === "string") {
    const nameFromDataUrl = value.match(/^data:[^;,]*;name=([^;,]+)/)?.[1];
    return { name: nameFromDataUrl || decodeURIComponent(value.split("?")[0].split("/").pop() || "attachment"), url: value };
  }
  const a = obj(value);
  const url = text(a.url, a.document_url, a.file_url, a.document);
  return { name: text(a.file_name, a.document_name, a.name, url.split("?")[0].split("/").pop()) || "attachment", url };
};

export const toActionPlan = (raw: Raw, index: number, prefix: string): ViActionPlan => ({
  id: text(raw.id) || `${prefix}${index + 1}`,
  actionNo: text(raw.action_no) || undefined,
  description: text(raw.action_plan, raw.description, raw.action),
  actionOwner: text(personName(raw.responsible_person ?? raw.action_owner), raw.responsible_person_name, raw.action_owner_name),
  targetDate: text(raw.extend_target_date, raw.extended_target_date, raw.target_date),
  status: (statusLabel(raw.status) || "Pending By Action Owner") as ViActionPlanStatus,
  capaProgress: text(raw.capa_progress) || undefined,
  capaProgressKey: text(raw.capa_progress_key) || undefined,
  capaClosureKey: text(raw.capa_closure_key) || undefined,
  canAddCapa: typeof raw.can_add_capa === "boolean" ? raw.can_add_capa : undefined,
  capas: arr(raw.capas, raw.actions_taken).map((c, i) => ({
    id: text(c.id) || String(i + 1),
    description: text(c.action_taken, c.description, c.action),
    closureDate: text(c.closure_date, c.closed_on),
    attachments: arr(c.attachments, c.documents).map(toAttachment),
  })),
});

export const toObservation = (raw: Raw, index: number): ViObservation => {
  const attachments = arr(raw.attachments, raw.documents).map(toAttachment);
  // Plans come as one action_plans array (action_type: corrective / preventive); older shapes
  // used separate corrective_actions / preventive_actions arrays.
  const plans = arr(raw.action_plans);
  const plansOfType = (type: string) => plans.filter((p) => text(p.action_type).toLowerCase() === type);
  return {
    id: text(raw.id) || String(index + 1),
    observationNo: text(raw.observation_no) || undefined,
    title: text(raw.title) || undefined,
    area: text(raw.area) || undefined,
    description: text(raw.observation, raw.description),
    // workflow_status is the API's display label (e.g. "Pending By Action Owner"); status is the raw key.
    status: (statusLabel(raw.workflow_status, raw.status) || "Pending By SPOC") as ViObservationStatus,
    assignedSpoc: text(personName(raw.spoc), raw.spoc_name),
    functionalHead: text(personName(raw.functional_head), raw.functional_head_name),
    attachments: attachments.map((a) => a.name),
    attachmentFiles: attachments,
    correctiveActions: (plans.length ? plansOfType("corrective") : arr(raw.corrective_actions, raw.corrective_action_plans)).map((p, i) => toActionPlan(p, i, "Ca")),
    preventiveActions: (plans.length ? plansOfType("preventive") : arr(raw.preventive_actions, raw.preventive_action_plans)).map((p, i) => toActionPlan(p, i, "Pa")),
  };
};

// Maps GET /vi_audits/:id.json onto the detail-view model.
const toAuditDetail = (json: unknown, fallbackId: string): ViAuditDetail => {
  const root = obj(json);
  const r = obj(root.vi_audit ?? root.audit ?? root.data ?? root);
  const id = text(r.id) || fallbackId;
  const createdBy = obj(r.created_by ?? r.auditor ?? r.user);
  const auditCode = text(r.audit_code, r.audit_number) || `Audit${id}`;
  const people = arr(r.people_interacted_with, r.people);

  return {
    id,
    auditCode,
    auditType: statusLabel(r.audit_type) as ViAuditDetail["auditType"],
    status: statusLabel(r.status) as ViAuditDetail["status"],
    auditor: {
      name: text(personName(createdBy), r.created_by_name, r.auditor_name),
      mailId: text(createdBy.email, r.created_by_email),
      designation: text(createdBy.designation, r.designation),
    },
    basic: {
      auditId: auditCode,
      dateOfAudit: text(r.audit_date, r.date_of_audit),
      circle: text(obj(r.cluster).cluster_name, r.cluster_name),
      personnelArea: text(obj(r.circle).name, r.circle_name),
      workLocation: text(obj(r.work_location).work_location_name, r.work_location_name),
      facilityType: text(obj(r.visit_business_area).name, r.visit_business_area_name),
      auditLocation: text(r.audit_location),
      function: text(obj(r.department).department_name, r.department_name),
    },
    classification: {
      classification: text(obj(r.classification).name, r.classification_name),
      category: text(obj(r.category).name, r.category_name),
      subCategory: text(obj(r.sub_category).name, r.sub_category_name),
    },
    people: {
      fte: people
        .filter((p) => text(p.type) !== "other")
        .map((p) => text(personName(p.user), p.user_name, p.name))
        .filter(Boolean),
      others: people
        .filter((p) => text(p.type) === "other")
        .map((p) => ({ name: text(p.name), designation: text(p.role, p.designation) })),
    },
    vendor: { vendorName: text(r.vendor_name), subVendorName: text(r.sub_vendor_name) },
    observations: arr(r.observations, r.observations_attributes, r.vi_audit_observations).map(toObservation),
  };
};

// Detail URL per role: the default /vi_audits/:id.json, or a role endpoint queried by id.
export const VI_AUDIT_DETAIL_URLS = {
  default: (auditId: string) => `/vi_audits/${encodeURIComponent(auditId)}.json`,
  spoc: (auditId: string) => `/vi_audits/spoc_audits.json?${new URLSearchParams({ id: auditId }).toString()}`,
  functionalHead: (auditId: string) =>
    `/vi_audits/functional_head_audits.json?${new URLSearchParams({ id: auditId }).toString()}`,
} as const;

// A role endpoint may return the audit itself or a list — pick the audit with this id (or the only one).
const pickAudit = (json: unknown, auditId: string): unknown => {
  const root = obj(json);
  const list = Array.isArray(json)
    ? (json as Raw[])
    : arr(root.vi_audits, root.audits, Array.isArray(root.data) ? root.data : undefined, obj(root.data).vi_audits);
  if (!list.length) return json;
  return list.find((a) => text(a.id) === auditId) ?? (list.length === 1 ? list[0] : json);
};

/**
 * One audit for the detail / observation pages — GET /vi_audits/:id.json by default; pass
 * `detailUrl` (e.g. VI_AUDIT_DETAIL_URLS.functionalHead) to use a role's endpoint instead.
 */
export const useViAuditDetail = (
  auditId: string | undefined,
  detailUrl: (auditId: string) => string = VI_AUDIT_DETAIL_URLS.default,
) => {
  const [audit, setAudit] = useState<ViAuditDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auditId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    (async () => {
      try {
        const response = await fetch(getFullUrl(detailUrl(auditId)), {
          headers: { Authorization: getAuthHeader() },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        setAudit(toAuditDetail(pickAudit(await response.json(), auditId), auditId));
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load audit:", error);
        toast.error("Failed to load audit details");
        setAudit(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
    // detailUrl is one of the stable VI_AUDIT_DETAIL_URLS functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditId]);

  return { audit, loading };
};

/**
 * One observation — GET /vi_audit_observations/:id.json. Its action_plans carry the plan ids the
 * observation view then loads one by one from /vi_audit_action_plans/:id.json.
 */
export const useViObservationDetail = (observationId: string | undefined) => {
  const [observation, setObservation] = useState<ViObservation | null>(null);
  const [loading, setLoading] = useState(Boolean(observationId));

  useEffect(() => {
    if (!observationId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    (async () => {
      try {
        const response = await fetch(getFullUrl(`/vi_audit_observations/${encodeURIComponent(observationId)}.json`), {
          headers: { Authorization: getAuthHeader() },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const root = obj(await response.json());
        const raw = obj(root.vi_audit_observation ?? root.observation ?? root.data ?? root);
        setObservation(toObservation(raw, 0));
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load observation:", error);
        toast.error("Failed to load observation");
        setObservation(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [observationId]);

  return { observation, loading };
};
