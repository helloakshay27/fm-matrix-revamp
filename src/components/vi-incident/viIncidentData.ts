import type { ColumnConfig } from "@/hooks/useEnhancedTable";

// Incident records shared by every role's list/detail pages.
// Placeholder data — swap for a live API once the Incident backend endpoint is available.

export type ViIncidentStatus = "Draft" | "Open" | "Closed" | "Pending By SPOC" | "Pending By Action Owner" | "Closed By Action Owner";

export interface ViIncidentInjury {
  age: string;
  personType: string;
  vendor: string;
  subVendor: string;
  natureOfInjury: string;
  bodyPart: string;
  daysAwayFromWork: string;
  restrictedWorkDays: string;
}

export interface ViIncidentRecord {
  id: number;
  incidentId: number;
  status: ViIncidentStatus;
  reporter: { name: string; mailId: string; employer: string };
  dateOfReport: string;
  timeOfReport: string;
  dateOfIncident: string;
  timeOfIncident: string;
  circle: string;
  personnelArea: string;
  workLocation: string;
  facilityType: string;
  incidentLocation: string;
  function: string;
  classification: string;
  category: string;
  subCategory: string;
  incident: string;
  spoc: string;
  functionalHead: string;
  attachments: string[];
  injuries: ViIncidentInjury[];
}

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const TEMPLATE: Omit<ViIncidentRecord, "id" | "incidentId" | "status">[] = [
  {
    reporter: { name: "Sohail Ansari", mailId: "sohail.ansari@mail.com", employer: "Aquil H" },
    dateOfReport: "23/03/2026",
    timeOfReport: "01:39 PM",
    dateOfIncident: "23/03/2026",
    timeOfIncident: "01:20 PM",
    circle: "Birla",
    personnelArea: "Worli",
    workLocation: "Worli",
    facilityType: "Birla",
    incidentLocation: "Birla Centurion Pvt. Ltd., Wing B, Floor 3, Room 203, Common Area",
    function: "",
    classification: "Non-Compliance",
    category: "Fire Safety",
    subCategory: "",
    incident: LOREM,
    spoc: "Shahab Mirza",
    functionalHead: "Kshitij Rasal",
    attachments: [],
    injuries: [
      {
        age: "28",
        personType: "FTE",
        vendor: "Popatlal & Sons",
        subVendor: "",
        natureOfInjury: "Fracture",
        bodyPart: "Hand",
        daysAwayFromWork: "5",
        restrictedWorkDays: "2",
      },
    ],
  },
  {
    reporter: { name: "Sohail Ansari", mailId: "sohail.ansari@mail.com", employer: "Aquil H" },
    dateOfReport: "18/04/2026",
    timeOfReport: "10:05 AM",
    dateOfIncident: "18/04/2026",
    timeOfIncident: "09:40 AM",
    circle: "Tata",
    personnelArea: "Andheri",
    workLocation: "Andheri",
    facilityType: "Tata",
    incidentLocation: "Tata Projects Pvt. Ltd., Wing A, Floor 1, Reception",
    function: "Operations",
    classification: "Near Miss",
    category: "Electrical",
    subCategory: "Wiring",
    incident: LOREM,
    spoc: "Veena Kumari",
    functionalHead: "Kshitij Rasal",
    attachments: [],
    injuries: [],
  },
];

const STATUS_CYCLE: ViIncidentStatus[] = ["Draft", "Pending By SPOC", "Closed", "Open", "Pending By Action Owner", "Closed By Action Owner"];

export const VI_INCIDENT_LIST: ViIncidentRecord[] = Array.from({ length: 12 }, (_, i) => ({
  ...TEMPLATE[i % TEMPLATE.length],
  id: i + 1,
  incidentId: 23 + i,
  status: STATUS_CYCLE[i % STATUS_CYCLE.length],
}));

export const getViIncident = (id: string | undefined): ViIncidentRecord =>
  VI_INCIDENT_LIST.find((incident) => String(incident.id) === id) ?? VI_INCIDENT_LIST[0];

/** Status tone classes for the incident status pill. */
export const VI_INCIDENT_STATUS_TONE: Record<string, string> = {
  Draft: "bg-[#FBE3D8] text-[#B5502A]",
  Open: "bg-[#DCE8F4] text-[#2F5F8F]",
  Closed: "bg-[#DDEBD3] text-[#4A6B2E]",
  "Pending By SPOC": "bg-[#F5B5A6] text-[#8A2F1B]",
  "Pending By Action Owner": "bg-[#F8E4C7] text-[#8A5A12]",
  "Closed By Action Owner": "bg-[#DDEBD3] text-[#4A6B2E]",
};

/** Dropdown options for the injury section — placeholders until the masters API provides them. */
export const PERSON_IMPACTED_OPTIONS = ["FTE", "Non-FTE", "Vendor", "Visitor"];
export const INJURY_TYPE_OPTIONS = ["Fracture", "Cut / Laceration", "Burn", "Sprain / Strain", "Bruise", "Other"];
export const BODY_PART_OPTIONS = ["Head", "Eye", "Hand", "Arm", "Back", "Leg", "Foot", "Other"];

export const INCIDENT_COLUMNS: ColumnConfig[] = [
  { key: "incidentId", label: "Incident ID", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "classification", label: "Classification", sortable: true, defaultVisible: true },
  { key: "category", label: "Category", sortable: true, defaultVisible: true },
  { key: "incidentLocation", label: "Incident Location", sortable: true, defaultVisible: true },
  { key: "dateOfIncident", label: "Date of Incident", sortable: true, defaultVisible: true },
  { key: "timeOfIncident", label: "Time of Incident", sortable: true, defaultVisible: true },
  { key: "circle", label: "Circle", sortable: true, defaultVisible: true },
  { key: "spoc", label: "SPOC", sortable: true, defaultVisible: true },
  { key: "functionalHead", label: "Functional Head", sortable: true, defaultVisible: true },
];

/** Root-cause checklists on the SPOC's action plan form (Investigation Required). */
export const ROOT_CAUSE_GROUPS: { key: string; title: string; options: string[] }[] = [
  {
    key: "substandardAct",
    title: "Substandard Act",
    options: ["Not Following SOP", "Improper PPE Usage", "Unsafe Behaviour", "Unauthorised Operations"],
  },
  {
    key: "substandardCondition",
    title: "Substandard Condition",
    options: ["Poor Housekeeping", "Faulty Equipment", "Unsafe Environment", "Inadequate Guarding"],
  },
  { key: "personalFactor", title: "Personal Factor", options: ["Lack Of Knowledge", "Fatigue", "Negligence"] },
  { key: "jobFactor", title: "Job Factor", options: ["Poor Supervision", "Lack Of Training", "Work Pressure"] },
];

/** A corrective/preventive plan the SPOC created for one root cause, plus what the action owner did about it. */
export interface ViIncidentActionPlan {
  id: string;
  /** Root cause the plan addresses, e.g. "Not Following SOP". */
  cause: string;
  /** Checklist path shown under "Checklist Item". */
  checklistPath: string;
  corrective: string;
  preventive: string;
  actionOwner: string;
  targetDate: string;
  /** Filled once the action owner has submitted their action taken. */
  taken?: {
    corrective: string;
    preventive: string;
    closureDate: string;
    attachments: string[];
  };
}

const PLAN_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/** Placeholder action plans for an incident — swap for the live API once it exists. */
export const getViIncidentActionPlans = (incident: ViIncidentRecord): ViIncidentActionPlan[] => {
  const closed = incident.status === "Closed By Action Owner";
  return ["Not Following SOP", "Improper PPE Usage"].map((cause, index) => ({
    id: `CA0${index + 1}`,
    cause,
    checklistPath: `Substandard Act/${cause}`,
    corrective: PLAN_TEXT,
    preventive: PLAN_TEXT,
    actionOwner: "Vama Shah",
    targetDate: "18 Sep 2026",
    taken: closed
      ? {
          corrective: PLAN_TEXT,
          preventive: PLAN_TEXT,
          closureDate: "18 Sep 2026",
          attachments: ["photo-1.jpg", "photo-2.jpg", "photo-3.jpg"],
        }
      : undefined,
  }));
};
