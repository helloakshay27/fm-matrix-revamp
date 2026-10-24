import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import type { ViActiveUserOption } from "./useViActiveUsers";
import { isViAuditType, type ViAuditType } from "./AuditTypeSelectModal";
import { arr, obj, personName, text, toAttachment } from "./useViAuditDetail";
import { OTHER_OPTION_VALUE } from "./viAuditApi";

export interface ViAuditDraftObservation {
  /** Server id — sent back so the PUT updates the observation instead of adding one. */
  id: string;
  observation: string;
  spoc: ViActiveUserOption | null;
  functionalHead: ViActiveUserOption | null;
  /** Names of attachments already saved on the server (read-only in the form). */
  existingAttachments: string[];
  /** Per-observation classification / people / vendor (falls back to the audit-level values). */
  classification: string;
  category: string;
  subCategory: string;
  /** Free text saved for "Others" (classification_other / category_other / sub_category_other). */
  classificationOther: string;
  categoryOther: string;
  subCategoryOther: string;
  fteUsers: ViActiveUserOption[];
  otherPeople: { name: string; designation: string }[];
  vendorName: string;
  subVendorName: string;
}

/** An audit from GET /vi_audits/:id.json, shaped as the Add Audit form's values (ids, not names). */
export interface ViAuditDraft {
  id: string;
  isDraft: boolean;
  auditType: ViAuditType | null;
  basic: {
    dateOfAudit: string;
    circle: string;
    personnelArea: string;
    workLocation: string;
    facilityType: string;
    location: string;
    function: string;
  };
  classification: { classification: string; category: string; subCategory: string };
  fteUsers: ViActiveUserOption[];
  otherPeople: { name: string; designation: string }[];
  vendor: { vendorName: string; subVendorName: string };
  observations: ViAuditDraftObservation[];
}

type Raw = Record<string, unknown>;

// Master id from `<key>_id`, or from the nested `<key>` object.
const masterId = (r: Raw, key: string) => text(r[`${key}_id`], obj(r[key]).id);

// A person as a picker option: id from `<key>_id` / the nested object, name from the nested object.
const toUserOption = (r: Raw, key: string): ViActiveUserOption | null => {
  const person = obj(r[key]);
  const id = text(r[`${key}_id`], person.id);
  if (!id) return null;
  const name = text(personName(person), r[`${key}_name`]) || `User ${id}`;
  return { id, name, email: text(person.email) || undefined };
};

// A classification field of an observation: its master id, "Others" when only the *_other text
// is saved, else the audit-level id (older drafts kept these on the audit).
const classificationField = (o: Raw, audit: Raw, key: string) => {
  const id = masterId(o, key);
  const other = text(o[`${key}_other`]);
  return {
    value: id || (other ? OTHER_OPTION_VALUE : masterId(audit, key)),
    other: id ? "" : other,
  };
};

// People interacted with, split into FTE users and others.
const toPeople = (people: Raw[]) => ({
  fteUsers: people
    .filter((p) => text(p.type) !== "other")
    .map((p) => toUserOption(p, "user"))
    .filter((u): u is ViActiveUserOption => u !== null),
  otherPeople: people
    .filter((p) => text(p.type) === "other")
    .map((p) => ({ name: text(p.name), designation: text(p.role, p.designation) })),
});

const toDraft = (json: unknown, fallbackId: string): ViAuditDraft => {
  const root = obj(json);
  const r = obj(root.vi_audit ?? root.audit ?? root.data ?? root);
  const auditType = text(r.audit_type).toLowerCase();
  const people = arr(r.people_interacted_with, r.people);

  return {
    id: text(r.id) || fallbackId,
    isDraft: text(r.status, r.audit_status).toLowerCase() === "draft",
    auditType: isViAuditType(auditType) ? auditType : null,
    basic: {
      dateOfAudit: text(r.audit_date, r.date_of_audit).slice(0, 10),
      circle: masterId(r, "cluster"),
      personnelArea: masterId(r, "circle"),
      workLocation: masterId(r, "work_location"),
      facilityType: masterId(r, "visit_business_area"),
      location: text(r.audit_location),
      function: masterId(r, "department"),
    },
    classification: {
      classification: masterId(r, "classification"),
      category: masterId(r, "category"),
      subCategory: masterId(r, "sub_category"),
    },
    ...toPeople(people),
    vendor: { vendorName: text(r.vendor_name), subVendorName: text(r.sub_vendor_name) },
    observations: arr(r.observations, r.observations_attributes, r.vi_audit_observations).map((o) => {
      // Saved per observation when the API sends it; otherwise the audit-level values.
      const ownPeople = arr(o.people_interacted_with, o.people);
      return {
        id: text(o.id),
        observation: text(o.observation, o.description),
        spoc: toUserOption(o, "spoc"),
        functionalHead: toUserOption(o, "functional_head"),
        existingAttachments: arr(o.attachments, o.documents).map((a) => toAttachment(a).name),
        ...(() => {
          const c = classificationField(o, r, "classification");
          const cat = classificationField(o, r, "category");
          const sub = classificationField(o, r, "sub_category");
          return {
            classification: c.value,
            classificationOther: c.other,
            category: cat.value,
            categoryOther: cat.other,
            subCategory: sub.value,
            subCategoryOther: sub.other,
          };
        })(),
        ...toPeople(ownPeople.length ? ownPeople : people),
        vendorName: text(o.vendor_name, r.vendor_name),
        subVendorName: text(o.sub_vendor_name, r.sub_vendor_name),
      };
    }),
  };
};

/** Loads an audit for editing (GET /vi_audits/:id.json). Does nothing without an id. */
export const useViAuditDraft = (auditId: string | undefined) => {
  const [draft, setDraft] = useState<ViAuditDraft | null>(null);
  const [loading, setLoading] = useState(Boolean(auditId));

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
        setDraft(toDraft(await response.json(), auditId));
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load audit for editing:", error);
        toast.error("Failed to load audit");
        setDraft(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [auditId]);

  return { draft, loading };
};
