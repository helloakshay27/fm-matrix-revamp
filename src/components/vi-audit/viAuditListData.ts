import type { ColumnConfig } from "@/hooks/useEnhancedTable";

// Audit list records shared by every role's list page.
// Placeholder data — swap for a live API once the Audit backend endpoint is available.

export type ViAuditListStatus = "Open" | "Completed" | "Draft";

export interface ViAuditListRecord {
  id: number;
  status: ViAuditListStatus;
  requestorName: string;
  mailId: string;
  designation: string;
  auditType: "Corporate" | "Circle";
  auditId: number;
  dateOfAudit: string;
  auditLocation: string;
  vendorName: string;
  observationCategory: string;
  observationSubCategory: string;
  spoc: string;
  auditCircle: string;
  auditZone: string;
  /** Circle (masters.circles) — "Personnel Area" on the audit form. */
  personnelArea?: string;
  /** Visit business area — "Type of Facility". */
  facilityType?: string;
  /** Department — "Function". */
  function?: string;
  observations: number;
  pendingActionPlanBySpoc: number;
  actionPendingByOwner: number;
  actionTakenByOwner: number;
}

const AUDIT_TEMPLATE: Omit<ViAuditListRecord, "id">[] = [
  {
    status: "Open",
    requestorName: "Anis Kotwal",
    mailId: "aniskotwal99@gmail.com",
    designation: "Safety Head",
    auditType: "Corporate",
    auditId: 23,
    dateOfAudit: "01/06/2026",
    auditLocation: "Birla Centurion Pvt. Ltd.",
    vendorName: "Jethalal & Sons Pvt. Ltd.",
    observationCategory: "Electronic",
    observationSubCategory: "HVAC",
    spoc: "Arun Mohan",
    auditCircle: "Birla",
    auditZone: "Worli",
    observations: 8,
    pendingActionPlanBySpoc: 3,
    actionPendingByOwner: 2,
    actionTakenByOwner: 3,
  },
  {
    status: "Completed",
    requestorName: "Priyanshi Doshi",
    mailId: "priyanshidoshi99@gmail.com",
    designation: "Safety Head",
    auditType: "Circle",
    auditId: 23,
    dateOfAudit: "18/04/2025",
    auditLocation: "Birla Centurion Pvt. Ltd.",
    vendorName: "Popatlal Pvt. Ltd.",
    observationCategory: "Electronic",
    observationSubCategory: "Wiring",
    spoc: "Veena Kumari",
    auditCircle: "Birla",
    auditZone: "Churchgate",
    observations: 5,
    pendingActionPlanBySpoc: 0,
    actionPendingByOwner: 0,
    actionTakenByOwner: 5,
  },
  {
    status: "Draft",
    requestorName: "John Doe",
    mailId: "johndoe@example.com",
    designation: "Site Engineer",
    auditType: "Corporate",
    auditId: 35,
    dateOfAudit: "15/03/2026",
    auditLocation: "Tata Projects Pvt. Ltd.",
    vendorName: "Reliance Industries Ltd.",
    observationCategory: "Mechanical",
    observationSubCategory: "Plumbing",
    spoc: "Vikram Singh",
    auditCircle: "Tata",
    auditZone: "Andheri",
    observations: 0,
    pendingActionPlanBySpoc: 0,
    actionPendingByOwner: 0,
    actionTakenByOwner: 0,
  },
  {
    status: "Open",
    requestorName: "Meera Patil",
    mailId: "meera.patil@infraco.in",
    designation: "QA Manager",
    auditType: "Circle",
    auditId: 42,
    dateOfAudit: "22/07/2026",
    auditLocation: "Adani Realty Pvt. Ltd.",
    vendorName: "Mahindra Infra Ltd.",
    observationCategory: "Civil",
    observationSubCategory: "Scaffolding",
    spoc: "Kiran Joshi",
    auditCircle: "Adani",
    auditZone: "Bandra",
    observations: 12,
    pendingActionPlanBySpoc: 4,
    actionPendingByOwner: 5,
    actionTakenByOwner: 3,
  },
];

export const VI_AUDIT_LIST: ViAuditListRecord[] = Array.from({ length: 12 }, (_, i) => ({
  ...AUDIT_TEMPLATE[i % AUDIT_TEMPLATE.length],
  id: i + 1,
}));

/** Total of a numeric field across the audit list (for the stats cards). */
export const sumAuditList = (key: keyof ViAuditListRecord, records = VI_AUDIT_LIST) =>
  records.reduce((total, record) => total + (Number(record[key]) || 0), 0);

/** Audit-card fields (ID, Status, Audit Type, Location) — the list columns in the role designs. */
export const AUDIT_CARD_COLUMNS: ColumnConfig[] = [
  { key: "auditId", label: "Audit ID", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "auditType", label: "Audit Type", sortable: true, defaultVisible: true },
  { key: "auditLocation", label: "Work Location", sortable: true, defaultVisible: true },
];

/** Audit-card fields followed by the full audit detail (Auditor list). */
export const AUDIT_FULL_COLUMNS: ColumnConfig[] = [
  ...AUDIT_CARD_COLUMNS,
  { key: "requestorName", label: "Requestor Name", sortable: true, defaultVisible: true },
  { key: "mailId", label: "Mail ID", sortable: true, defaultVisible: true },
  { key: "designation", label: "Designation", sortable: true, defaultVisible: true },
  { key: "dateOfAudit", label: "Date of Audit", sortable: true, defaultVisible: true },
  { key: "vendorName", label: "Vendor Name", sortable: true, defaultVisible: true },
  { key: "observationCategory", label: "Observation Category", sortable: true, defaultVisible: true },
  { key: "observationSubCategory", label: "Observation Sub-Category", sortable: true, defaultVisible: true },
  { key: "spoc", label: "SPOC", sortable: true, defaultVisible: true },
  { key: "auditCircle", label: "Audit Circle", sortable: true, defaultVisible: true },
  { key: "auditZone", label: "Audit Zone", sortable: true, defaultVisible: true },
  { key: "personnelArea", label: "Personnel Area", sortable: true, defaultVisible: true },
  { key: "facilityType", label: "Type of Facility", sortable: true, defaultVisible: true },
  { key: "function", label: "Function", sortable: true, defaultVisible: true },
];
