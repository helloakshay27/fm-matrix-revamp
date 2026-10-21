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
const arr = (...values: unknown[]): Raw[] => {
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
const personName = (value: unknown) => {
  const p = obj(value);
  return text(p.full_name, p.name, [text(p.firstname), text(p.lastname)].filter(Boolean).join(" "), p.email);
};

// "pending_by_spoc" -> "Pending By SPOC", "closed" -> "Closed"
const statusLabel = (value: unknown) =>
  text(value)
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => (word.toLowerCase() === "spoc" ? "SPOC" : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");

// Attachments may be URLs, data URLs or { url, file_name / name } objects.
const toAttachment = (value: unknown) => {
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
});

const toObservation = (raw: Raw, index: number): ViObservation => {
  const attachments = arr(raw.attachments, raw.documents).map(toAttachment);
  // Plans come as one action_plans array (action_type: corrective / preventive); older shapes
  // used separate corrective_actions / preventive_actions arrays.
  const plans = arr(raw.action_plans);
  const plansOfType = (type: string) => plans.filter((p) => text(p.action_type).toLowerCase() === type);
  return {
    id: text(raw.id) || String(index + 1),
    title: text(raw.title) || undefined,
    area: text(raw.area) || undefined,
    description: text(raw.observation, raw.description),
    status: (statusLabel(raw.status) || "Pending By SPOC") as ViObservationStatus,
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

/** One audit for the detail / observation pages (GET /vi_audits/:id.json). */
export const useViAuditDetail = (auditId: string | undefined) => {
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
        const response = await fetch(getFullUrl(`/vi_audits/${encodeURIComponent(auditId)}.json`), {
          headers: { Authorization: getAuthHeader() },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        setAudit(toAuditDetail(await response.json(), auditId));
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
  }, [auditId]);

  return { audit, loading };
};
