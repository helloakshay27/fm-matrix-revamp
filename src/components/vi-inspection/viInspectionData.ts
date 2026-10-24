import type { ColumnConfig } from "@/hooks/useEnhancedTable";

// Inspection records shared by every role's list/detail pages.
// Placeholder data — swap for a live API once the Inspection backend endpoint is available.

export type ViInspectionStatus = "Draft" | "Open" | "Closed" | "Pending By Action Owner" | "Closed By Action Owner";

// Workflow stages remain available for summary cards; only final closure is Closed.
export const getInspectionDisplayStatus = (status: string): "Open" | "Closed" =>
  status.trim().toLowerCase() === "closed" ? "Closed" : "Open";

/** A corrective or preventive plan the SPOC created for a checklist finding. */
export interface ViInspectionPlan {
  id: string;
  description: string;
  actionOwner: string;
  targetDate: string;
}

/** One answered checklist question, as shown on the inspection detail page. */
export interface ViInspectionChecklistResult {
  question: string;
  /** The gap the SPOC plans actions against, e.g. "Safety signages not clearly displayed and visible". */
  finding: string;
  answer: string;
  remarks: string;
  spoc: string;
  functionalHead: string;
  targetDate: string;
  attachments: string[];
  status: string;
  /** Filled once the SPOC has submitted the action plan. */
  correctivePlans: ViInspectionPlan[];
  preventivePlans: ViInspectionPlan[];
}

export interface ViInspectionRecord {
  id: number;
  inspectionId: number;
  status: ViInspectionStatus;
  title: string;
  inspectionLocation: string;
  dateOfInspection: string;
  inspectionType: string;
  circle: string;
  personnelArea: string;
  workLocation: string;
  facilityType: string;
  function: string;
  inspector: { name: string; mailId: string; employer: string };
  spoc: string;
  functionalHead: string;
  targetDate: string;
  checklist: ViInspectionChecklistResult[];
}

// File names only until the API returns real attachment URLs; the detail page shows a tile per file.
const PLACEHOLDER_PHOTOS = ["photo-1.jpg", "photo-2.jpg", "photo-3.jpg"];

type TemplateRecord = Omit<ViInspectionRecord, "id" | "inspectionId" | "status" | "checklist">;

const INSPECTOR = { name: "Sohail Ansari", mailId: "sohail.ansari@mail.com", employer: "Aquil H" };

const TEMPLATE: TemplateRecord[] = [
  {
    title: "Lobby Inspection",
    inspectionLocation: "Birla Centurion Pvt. Ltd., Wing B, Floor 3, Room 203, Common Area",
    dateOfInspection: "23/03/2026",
    inspectionType: "Fire Safety",
    circle: "Birla",
    personnelArea: "Worli",
    workLocation: "Worli",
    facilityType: "Birla",
    function: "",
    inspector: INSPECTOR,
    spoc: "Shahab Mirza",
    functionalHead: "Kshitij Rasal",
    targetDate: "02/09/2026",
  },
  {
    title: "Office Room",
    inspectionLocation: "Birla Centurion Pvt. Ltd., Wing B, Floor 3, Room 203, Common Area",
    dateOfInspection: "02/04/2026",
    inspectionType: "Electrical",
    circle: "Birla",
    personnelArea: "Worli",
    workLocation: "Worli",
    facilityType: "Birla",
    function: "Operations",
    inspector: INSPECTOR,
    spoc: "Veena Kumari",
    functionalHead: "Kshitij Rasal",
    targetDate: "10/09/2026",
  },
  {
    title: "Meeting Room Inspection",
    inspectionLocation: "Tata Projects Pvt. Ltd., Wing A, Floor 1, Reception",
    dateOfInspection: "18/04/2026",
    inspectionType: "Housekeeping",
    circle: "Tata",
    personnelArea: "Andheri",
    workLocation: "Andheri",
    facilityType: "Tata",
    function: "Operations",
    inspector: INSPECTOR,
    spoc: "Shahab Mirza",
    functionalHead: "Kshitij Rasal",
    targetDate: "15/09/2026",
  },
];

const PLAN_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const samplePlans = (prefix: "CA" | "PA"): ViInspectionPlan[] => [
  { id: `${prefix}01`, description: PLAN_TEXT, actionOwner: "Vama Shah", targetDate: "18 Sep 2026" },
];

const sampleChecklist = ({ spoc, functionalHead, targetDate }: TemplateRecord): ViInspectionChecklistResult[] => [
  {
    question: "Are Safety Signages Clearly Displayed And Visible?",
    finding: "Safety signages not clearly displayed and visible",
    answer: "Yes",
    remarks: "",
    spoc,
    functionalHead,
    targetDate,
    attachments: PLACEHOLDER_PHOTOS,
    status: "Pending By SPOC",
    correctivePlans: samplePlans("CA"),
    preventivePlans: samplePlans("PA"),
  },
  {
    question: "Are Incident Reports Documented And Analyzed?",
    finding: "Incident reports not documented and analyzed",
    answer: "No",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    spoc,
    functionalHead,
    targetDate,
    attachments: PLACEHOLDER_PHOTOS,
    status: "Pending By SPOC",
    correctivePlans: samplePlans("CA"),
    preventivePlans: samplePlans("PA"),
  },
];

const STATUS_CYCLE: ViInspectionStatus[] = ["Draft", "Open", "Closed", "Pending By Action Owner", "Closed By Action Owner"];

export const VI_INSPECTION_LIST: ViInspectionRecord[] = Array.from({ length: 12 }, (_, i) => {
  const template = TEMPLATE[i % TEMPLATE.length];
  return {
    ...template,
    id: i + 1,
    inspectionId: 2378 + i,
    status: STATUS_CYCLE[i % STATUS_CYCLE.length],
    checklist: sampleChecklist(template),
  };
});

export const getViInspection = (id: string | undefined): ViInspectionRecord =>
  VI_INSPECTION_LIST.find((inspection) => String(inspection.id) === id) ?? VI_INSPECTION_LIST[0];

/** Status tone classes for the inspection status pill (same palette as incident). */
export const VI_INSPECTION_STATUS_TONE: Record<string, string> = {
  Draft: "bg-[#FBE3D8] text-[#B5502A]",
  Open: "bg-[#DCE8F4] text-[#2F5F8F]",
  Closed: "bg-[#DDEBD3] text-[#4A6B2E]",
  "Pending By SPOC": "bg-[#F5B5A6] text-[#8A2F1B]",
  "Pending By Action Owner": "bg-[#F8E4C7] text-[#8A5A12]",
  "Closed By Action Owner": "bg-[#DDEBD3] text-[#4A6B2E]",
};

/** Dropdown options for inspection type — placeholder until the masters API provides them. */
export const INSPECTION_TYPE_OPTIONS = ["Fire Safety", "Electrical", "Housekeeping", "Emergency Preparedness", "General"];

/** Checklist questions answered in step 2 — placeholder until a checklist master exists. */
export const INSPECTION_CHECKLIST: { id: string; question: string }[] = [
  { id: "q1", question: "Are Safety Signages Clearly Displayed And Visible?" },
  { id: "q2", question: "Are Incident Reports Documented And Analyzed?" },
  { id: "q3", question: "Is There A Protocol For Reporting Incidents?" },
  { id: "q4", question: "How Often Are Drills Conducted For Response?" },
];

export const CHECKLIST_ANSWERS = ["Yes", "No", "NA"] as const;

export const INSPECTION_COLUMNS: ColumnConfig[] = [
  { key: "inspectionId", label: "Inspection ID", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "title", label: "Inspection", sortable: true, defaultVisible: true },
  { key: "inspectionType", label: "Type", sortable: true, defaultVisible: true },
  { key: "inspectionLocation", label: "Inspection Location", sortable: true, defaultVisible: true },
  { key: "dateOfInspection", label: "Date of Inspection", sortable: true, defaultVisible: true },
  { key: "circle", label: "Circle", sortable: true, defaultVisible: true },
  { key: "spoc", label: "SPOC", sortable: true, defaultVisible: true },
  { key: "functionalHead", label: "Functional Head", sortable: true, defaultVisible: true },
];
