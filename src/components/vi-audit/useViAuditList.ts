import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import type { ViAuditListRecord } from "./viAuditListData";

// List endpoints per role (all paginated with page / per_page).
export const VI_AUDIT_LIST_ENDPOINTS = {
  auditor: "/vi_audits.json",
  spoc: "/vi_audits/spoc_audits.json",
  actionOwner: "/vi_audits/action_owner_audits.json",
  functionalHead: "/vi_audits/functional_head_audits.json",
} as const;
export const VI_AUDIT_LIST_PER_PAGE = 20;

type Raw = Record<string, unknown>;

const obj = (value: unknown): Raw => (value && typeof value === "object" ? (value as Raw) : {});
const text = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
};
const num = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "number") return value;
    if (Array.isArray(value)) return value.length;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  }
  return 0;
};
const capitalize = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ") : "");

// Accepts the audits array at the root or under data / vi_audits / audits (or data.vi_audits).
const extractRows = (json: unknown): Raw[] => {
  if (Array.isArray(json)) return json as Raw[];
  const root = obj(json);
  for (const key of ["vi_audits", "audits", "data"]) {
    if (Array.isArray(root[key])) return root[key] as Raw[];
  }
  const data = obj(root.data);
  for (const key of ["vi_audits", "audits", "records"]) {
    if (Array.isArray(data[key])) return data[key] as Raw[];
  }
  return [];
};

// Observations in one workflow stage (workflow_status_key), e.g. "pending_by_spoc".
const countWorkflow = (observations: Raw[], key: string) =>
  observations.filter((o) => text(o.workflow_status_key) === key).length;

// Distinct non-empty values of one field across an audit's observations, comma-joined.
const fromObservations = (observations: Raw[], pick: (o: Raw) => string) =>
  [...new Set(observations.map(pick).filter(Boolean))].join(", ");

// Maps one API audit onto the list-table record (unknown fields fall back to empty).
// Vendor / category / sub category now live on each observation; older responses had them on the audit.
const toListRecord = (r: Raw, index: number): ViAuditListRecord => {
  const createdBy = obj(r.created_by ?? r.auditor ?? r.user);
  const cluster = obj(r.cluster);
  const circle = obj(r.circle);
  const category = obj(r.category);
  const subCategory = obj(r.sub_category);
  const observations = Array.isArray(r.observations) ? (r.observations as Raw[]) : [];
  return {
    id: num(r.id) || index + 1,
    status: capitalize(text(r.status, r.audit_status)) as ViAuditListRecord["status"],
    requestorName: text(r.auditor_name, createdBy.full_name, createdBy.name, r.created_by_name),
    mailId: text(r.auditor_email, createdBy.email, r.created_by_email),
    designation: text(r.auditor_designation, createdBy.designation, r.designation),
    auditType: capitalize(text(r.audit_type)) as ViAuditListRecord["auditType"],
    auditId: (text(r.audit_no, r.audit_code, r.audit_number, r.audit_id) || num(r.id)) as unknown as number,
    dateOfAudit: text(r.audit_date, r.date_of_audit),
    auditLocation: text(r.audit_location, obj(r.work_location).work_location_name, r.work_location_name),
    vendorName: text(r.vendor_name) || fromObservations(observations, (o) => text(o.vendor_name)),
    observationCategory:
      text(category.name, r.category_name) ||
      fromObservations(observations, (o) => text(o.category_name, obj(o.category).name, o.category_other)),
    observationSubCategory:
      text(subCategory.name, r.sub_category_name) ||
      fromObservations(observations, (o) => text(o.sub_category_name, obj(o.sub_category).name, o.sub_category_other)),
    spoc: text(r.spoc_name, obj(r.spoc).name) || fromObservations(observations, (o) => text(obj(o.spoc).name)),
    auditCircle: text(cluster.cluster_name, r.cluster_name),
    auditZone: text(circle.name, r.circle_name),
    observations: num(r.observations_count, r.observations),
    // Per-audit workflow counts: from the API when sent, else counted from the nested
    // observations' workflow_status_key (SPOC / FH / Action Owner lists nest them).
    pendingActionPlanBySpoc: num(r.pending_action_plan_by_spoc_count) || countWorkflow(observations, "pending_by_spoc"),
    actionPendingByOwner: num(r.action_pending_by_owner_count) || countWorkflow(observations, "pending_by_action_owner"),
    actionTakenByOwner: num(r.action_taken_by_owner_count) || countWorkflow(observations, "closed_by_action_owner"),
  };
};

export interface ViAuditListPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

/**
 * Paginated audit list for a role list page (e.g. GET /vi_audits.json?page=&per_page=).
 * `filters` are extra query params (e.g. q[status_eq]) from the page's filter dialog.
 */
export const useViAuditList = (
  page: number,
  endpoint: string = VI_AUDIT_LIST_ENDPOINTS.auditor,
  filters: Record<string, string> = {},
) => {
  // Stable key so a new (but equal) filters object doesn't refetch.
  const filtersKey = JSON.stringify(filters);
  const [audits, setAudits] = useState<ViAuditListRecord[]>([]);
  const [pagination, setPagination] = useState<ViAuditListPagination>({
    currentPage: page,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    (async () => {
      try {
        const params = new URLSearchParams({
          ...(JSON.parse(filtersKey) as Record<string, string>),
          page: String(page),
          per_page: String(VI_AUDIT_LIST_PER_PAGE),
        });
        const response = await fetch(getFullUrl(`${endpoint}?${params.toString()}`), {
          headers: { Authorization: getAuthHeader() },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const json = await response.json();
        const rows = extractRows(json).map(toListRecord);
        const meta = obj(obj(json).pagination ?? obj(json).meta ?? obj(obj(json).data).pagination);
        const totalCount = num(meta.total_count, meta.total, rows.length);
        setAudits(rows);
        setPagination({
          currentPage: num(meta.current_page, meta.page) || page,
          totalPages: Math.max(1, num(meta.total_pages, Math.ceil(totalCount / VI_AUDIT_LIST_PER_PAGE))),
          totalCount,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load audits:", error);
        toast.error("Failed to load audits");
        setAudits([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [page, endpoint, filtersKey]);

  return { audits, pagination, loading };
};
