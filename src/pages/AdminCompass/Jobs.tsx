// @ts-nocheck
import { useState, useRef } from "react";
import { toast } from "sonner";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS — Lockated Design System
   ═══════════════════════════════════════════════════ */
const T = {
  font: '"Poppins", system-ui, sans-serif',
  orange: "#DA7756", orangeHover: "#C2643F",
  orangeSoft: "rgba(218,119,86,.08)", orangeHoverSoft: "rgba(218,119,86,.15)",
  ink: "#2C2C2C", inkSoft: "rgba(44,44,44,.68)", inkMuted: "rgba(44,44,44,.48)",
  page: "#FFFFFF", surface: "#F6F4EE", raised: "#FFFFFF", warm: "#FFF8EF",
  borderSoft: "rgba(44,44,44,.08)", borderWarm: "#E8E3D8", divider: "#D5DBDB",
  olive: "#798C5E", lavender: "#CECBF6", sageMint: "#9EC8BA",
  infoBlue: "#6B9BCC", warning: "#EDC488", danger: "#E49191",
  growth: "#108C72", success: "#89F7E7", error: "#E7848E",
  kpiBlue: "#D4E3F0", kpiMint: "#DFEEEA", kpiLav: "#EDECFC",
  kpiPeach: "#F5DAD0", kpiCream: "#F9ECD2",
  aiGrad: "linear-gradient(135deg, #DA7756 0%, #CECBF6 50%, #9EC8BA 100%)",
  aiGlow: "0 0 0 6px rgba(218,119,86,.08), 0 1px 3px rgba(44,44,44,.07), 0 2px 8px rgba(44,44,44,.05)",
  shadow: "0 1px 3px rgba(44,44,44,.07), 0 2px 8px rgba(44,44,44,.05)",
  rxs: 6, rsm: 8, rmd: 12, rlg: 16, rxl: 24,
};

/* ── SVG Icon helper ── */
const I = ({ d, size = 18, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const ico = {
  home: <I d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M9 22V12h6v10" />,
  plan: <I d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
  goals: <I d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z" />,
  people: <I d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75" />,
  layers: <I d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" />,
  doc: <I d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />,
  briefcase: <I d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />,
  globe: <I d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />,
  plus: <I d="M12 5v14 M5 12h14" />,
  chev: <I d="M9 18l6-6-6-6" size={16} />,
  edit: <I d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" size={16} />,
  trash: <I d="M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" size={16} />,
  search: <I d="M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35" size={16} />,
  check: <I d="M20 6L9 17l-5-5" size={16} />,
  x: <I d="M18 6L6 18 M6 6l12 12" size={16} />,
  bell: <I d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0" />,
  settings: <I d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />,
  ai: <I d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l.548.547A3.374 3.374 0 0114.5 21h-5a3.374 3.374 0 01-2.386-5.76l.55-.548z" />,
  bar: <I d="M18 20V10 M12 20V4 M6 20v-6" size={16} />,
  userPlus: <I d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M8.5 11a4 4 0 100-8 4 4 0 000 8z M20 8v6 M23 11h-6" size={16} />,
  arrowLeft: <I d="M19 12H5 M12 19l-7-7 7-7" />,
  eye: <I d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z" size={16} />,
  link: <I d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" size={14} />,
  filter: <I d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" size={16} />,
  power: <I d="M18.36 6.64A9 9 0 1 1 5.63 6.64 M12 2v10" size={16} />,
  userCheck: <I d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M8.5 11a4 4 0 100-8 4 4 0 000 8z M17 11l2 2 4-4" size={16} />,
  clock: <I d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" size={16} />,
  grid: <I d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z" size={16} />,
  listView: <I d="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" size={16} />,
  wrench: <I d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" size={16} />,
  chevDown: <I d="M6 9l6 6 6-6" size={14} />,
  moreVert: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
  calendar: <I d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18" size={16} />,
  db: <I d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z M2 6.5C2 8.98 6.48 11 12 11s10-2.02 10-4.5 M2 12c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5" size={14} />,
};

/* ── Nav & Constants ── */
const NAV = [
  { label: "BUSINESS", items: [
    { key: "dashboard", label: "Dashboard", icon: ico.home },
    { key: "plan", label: "Plan", icon: ico.plan },
    { key: "goals", label: "Goals", icon: ico.goals },
    { key: "meetings", label: "Meetings", icon: ico.people },
  ]},
  { label: "SETUP", items: [
    { key: "organisation", label: "Organisation", icon: ico.layers },
    { key: "members", label: "Members", icon: ico.people },
    { key: "sops", label: "SOPs", icon: ico.doc },
    { key: "jobs", label: "Jobs", icon: ico.briefcase },
  ]},
  { label: "PERSONAL", items: [{ key: "disc", label: "DISC", icon: ico.globe }] },
];
const STEPS = [
  { key: "details", label: "Job Details", num: 1 },
  { key: "description", label: "Description", num: 2 },
  { key: "kra", label: "KRAs", num: 3 },
  { key: "kpi", label: "KPIs", num: 4 },
  { key: "review", label: "Review & Save", num: 5 },
];
const DEPARTMENTS = ["Engineering","Design","Sales","Marketing","Human Resources","Finance","Operations","Product","Customer Success","Legal"];
const EMP_TYPES = ["Full-time","Part-time","Contract","Internship"];
const EXP_LEVELS = ["Entry Level","Mid Level","Senior","Lead","Manager","Director","VP","C-Suite"];
const KPI_UNITS = ["Percentage (%)","Number (#)","Currency (₹)","Rating (1–5)","Days","Hours","Score"];
const TARGET_FREQ = ["Daily","Weekly","Monthly","Quarterly","Yearly"];
const DATA_SOURCES = ["PATM","Business Compass","Helpdesk","Sales CRM","Other Modules"];
const MODULES_BY_SOURCE = {
  "PATM": ["Attendance","Leave Management","Payroll","Shift Scheduling","Overtime Tracking"],
  "Business Compass": ["Revenue Dashboard","Project Tracker","OKRs","Budgeting","Analytics"],
  "Helpdesk": ["Ticket Management","SLA Monitoring","Knowledge Base","Escalation Queue","Reports"],
  "Sales CRM": ["Lead Pipeline","Deal Tracking","Client Management","Quotations","Forecasting"],
  "Other Modules": ["Inventory","Procurement","Facility Management","Compliance","Custom"],
};
const MOCK_MEMBERS = ["Amit V.","Priya S.","Rahul M.","Neha G.","Sanjay K.","Dinesh T.","Shivani Y.","Shahab A."];

/* ── Setup constants ── */
const SETUP_TABS = [{ key: "company", label: "Company Details" }, { key: "departments", label: "Departments" }];
const INDUSTRIES = ["Real Estate","Technology","Healthcare","Finance & Banking","Manufacturing","Retail & E-commerce","Education","Hospitality","Logistics","Media & Entertainment","Agriculture","Energy & Utilities","Consulting","Legal","Other"];
const EMPLOYEE_RANGES = ["1–10","11–50","51–200","201–500","501–1000","1001–5000","5000+"];
const COUNTRIES = ["India","United States","United Kingdom","UAE","Singapore","Canada","Australia","Germany","Other"];
const STATES_INDIA = ["Maharashtra","Delhi","Karnataka","Tamil Nadu","Uttar Pradesh","Gujarat","Rajasthan","Telangana","West Bengal","Other"];
const INITIAL_DEPTS = [
  { id: 1, name: "Engineering", head: "Rahul Mehta", members: 24, color: T.kpiBlue, status: "active" },
  { id: 2, name: "Design", head: "Priya Sharma", members: 8, color: T.kpiLav, status: "active" },
  { id: 3, name: "Sales", head: "Amit Verma", members: 16, color: T.kpiMint, status: "active" },
  { id: 4, name: "Human Resources", head: "Neha Gupta", members: 5, color: T.kpiCream, status: "active" },
];

const SEED_MEMBERS = [
  { id: 1, name: "Rahul Mehta", email: "rahul.mehta@company.com", department: "Engineering", status: "active", isHOD: true },
  { id: 2, name: "Priya Sharma", email: "priya.sharma@company.com", department: "Design", status: "active", isHOD: true },
  { id: 3, name: "Amit Verma", email: "amit.verma@company.com", department: "Sales", status: "active", isHOD: true },
  { id: 4, name: "Neha Gupta", email: "neha.gupta@company.com", department: "Human Resources", status: "active", isHOD: true },
  { id: 5, name: "Sanjay Kumar", email: "sanjay.k@company.com", department: "Engineering", status: "active", isHOD: false },
  { id: 6, name: "Dinesh Thakur", email: "dinesh.t@company.com", department: "Engineering", status: "active", isHOD: false },
  { id: 7, name: "Shivani Yadav", email: "shivani.y@company.com", department: "Design", status: "active", isHOD: false },
  { id: 8, name: "Shahab Anwar", email: "shahab.a@company.com", department: "Design", status: "inactive", isHOD: false },
  { id: 9, name: "Chitra Nair", email: "chitra.n@company.com", department: "Sales", status: "active", isHOD: false },
  { id: 10, name: "Shivam Rao", email: "shivam.r@company.com", department: "Engineering", status: "active", isHOD: false },
  { id: 11, name: "Meera Joshi", email: "meera.j@company.com", department: "Human Resources", status: "active", isHOD: false },
  { id: 12, name: "Kunal Desai", email: "kunal.d@company.com", department: "Sales", status: "inactive", isHOD: false },
];
const COLORS = [T.kpiBlue, T.kpiMint, T.kpiLav, T.kpiPeach, T.kpiCream];

/* ═══════════════════════════════════════════════════
   SEED DATA
   ═══════════════════════════════════════════════════ */
const SEED_JDS = [
  { id: 1, title: "Senior Product Manager", dept: "Product", level: "Senior", type: "Full-time", status: "published", assigned: ["Amit V.", "Priya S."], created: "28 Jun 2026", reportingTo: "VP of Product", location: "Mumbai, Hybrid", salaryMin: "2400000", salaryMax: "3600000", summary: "Lead product strategy and roadmap for B2B SaaS products, driving cross-functional alignment between engineering, design, and business teams to deliver customer-centric solutions.", responsibilities: "• Own product roadmap and prioritisation for the B2B platform\n• Conduct market research and competitive analysis\n• Define success metrics and monitor KPIs\n• Collaborate with engineering and design on sprint planning\n• Present product updates to leadership and stakeholders", qualifications: "• 6+ years in product management, preferably B2B SaaS\n• MBA or equivalent experience\n• Strong analytical and data-driven decision-making skills", skills: "• Jira, Confluence, Figma, SQL\n• Stakeholder management\n• Agile/Scrum methodologies", niceToHave: "• Experience with PropTech or real estate domain\n• Familiarity with design systems" },
  { id: 2, title: "UX Designer", dept: "Design", level: "Mid Level", type: "Full-time", status: "draft", assigned: [], created: "02 Jul 2026", reportingTo: "Design Lead", location: "Mumbai, On-site", salaryMin: "1200000", salaryMax: "1800000", summary: "Design intuitive, accessible user experiences for web and mobile applications, working closely with product and engineering to ship pixel-perfect interfaces.", responsibilities: "• Create wireframes, prototypes, and high-fidelity mockups\n• Conduct usability testing and synthesise findings\n• Maintain and evolve the design system\n• Collaborate with developers during implementation", qualifications: "• 3+ years of UX/UI design experience\n• Strong portfolio demonstrating end-to-end design process\n• Proficiency in Figma", skills: "• Figma, FigJam, Protopie\n• Design systems\n• User research methodologies", niceToHave: "• Experience with React component libraries\n• Motion design skills" },
  { id: 3, title: "Sales Executive", dept: "Sales", level: "Entry Level", type: "Full-time", status: "published", assigned: ["Rahul M.", "Neha G."], created: "05 Jul 2026", reportingTo: "Sales Manager", location: "Delhi NCR", salaryMin: "600000", salaryMax: "900000", summary: "Drive new business acquisition and manage the sales pipeline for real estate technology solutions.", responsibilities: "• Generate leads through outbound prospecting\n• Conduct product demos and presentations\n• Manage deals through the full sales cycle\n• Maintain CRM records and pipeline forecasts", qualifications: "• 0-2 years in B2B sales\n• Graduate in any discipline\n• Excellent communication skills", skills: "• CRM tools (Salesforce/HubSpot)\n• Presentation skills\n• Negotiation", niceToHave: "• Real estate industry exposure\n• Regional language proficiency" },
];
const SEED_KRAS = [
  { id: "k1", jdId: 1, title: "Product Strategy & Roadmap", desc: "Own the product vision and define quarterly roadmaps.", weightage: 35, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
  { id: "k2", jdId: 1, title: "Stakeholder Management", desc: "Maintain alignment across engineering, design, and leadership.", weightage: 30, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
  { id: "k3", jdId: 1, title: "Delivery & Execution", desc: "Ensure features ship on time with quality gates.", weightage: 35, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
  { id: "k4", jdId: 2, title: "Design Quality", desc: "Deliver pixel-perfect, accessible UI per the design system.", weightage: 55, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { id: "k5", jdId: 2, title: "User Research", desc: "Conduct usability tests and synthesise findings.", weightage: 45, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { id: "k6", jdId: 3, title: "Revenue Generation", desc: "Meet quarterly revenue targets through acquisitions.", weightage: 60, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
  { id: "k7", jdId: 3, title: "Pipeline Management", desc: "Maintain a healthy pipeline with accurate forecasting.", weightage: 40, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
];
const SEED_KPIS = [
  { id: "p1", kraId: "k1", jdId: 1, name: "Features shipped per quarter", unit: "Number (#)", weightage: 20, target: "8", freq: "Quarterly", updateType: "automatic", dataSource: "Business Compass", status: "active" },
  { id: "p2", kraId: "k1", jdId: 1, name: "Roadmap adherence rate", unit: "Percentage (%)", weightage: 15, target: "85", freq: "Quarterly", updateType: "manual", dataSource: "", status: "active" },
  { id: "p3", kraId: "k2", jdId: 1, name: "Stakeholder satisfaction", unit: "Rating (1–5)", weightage: 15, target: "4.2", freq: "Quarterly", updateType: "manual", dataSource: "", status: "active" },
  { id: "p4", kraId: "k3", jdId: 1, name: "On-time delivery rate", unit: "Percentage (%)", weightage: 20, target: "90", freq: "Monthly", updateType: "automatic", dataSource: "PATM", status: "active" },
  { id: "p5", kraId: "k3", jdId: 1, name: "Scope creep incidents", unit: "Number (#)", weightage: 10, target: "2", freq: "Quarterly", updateType: "manual", dataSource: "", status: "active" },
  { id: "p6", kraId: "k4", jdId: 2, name: "Design review pass rate", unit: "Percentage (%)", weightage: 30, target: "92", freq: "Monthly", updateType: "manual", dataSource: "", status: "active" },
  { id: "p7", kraId: "k5", jdId: 2, name: "Usability tests conducted", unit: "Number (#)", weightage: 25, target: "2", freq: "Monthly", updateType: "manual", dataSource: "", status: "active" },
  { id: "p8", kraId: "k6", jdId: 3, name: "Revenue closed (₹)", unit: "Currency (₹)", weightage: 35, target: "1500000", freq: "Monthly", updateType: "automatic", dataSource: "Sales CRM", status: "active" },
  { id: "p9", kraId: "k7", jdId: 3, name: "Pipeline value (₹)", unit: "Currency (₹)", weightage: 25, target: "5000000", freq: "Monthly", updateType: "automatic", dataSource: "Sales CRM", status: "active" },
];

/* AI mock generators */
const AI_KRAS = [
  { title: "Operational Excellence", desc: "Ensure smooth execution of responsibilities with adherence to process standards.", weightage: 30, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { title: "Stakeholder Management", desc: "Proactive communication with stakeholders ensuring alignment on deliverables.", weightage: 25, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { title: "Quality & Compliance", desc: "Deliver outputs meeting quality benchmarks and regulatory standards.", weightage: 20, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { title: "Innovation & Improvement", desc: "Identify workflow inefficiencies and propose actionable improvements.", weightage: 15, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { title: "Team Development", desc: "Mentor juniors and foster a collaborative team environment.", weightage: 10, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
];
const genAiKpis = (kraTitle) => {
  const bank = {
    "Operational Excellence": [
      { name: "Task completion rate", unit: "Percentage (%)", weightage: 15, target: "95", freq: "Monthly", updateType: "automatic", dataSource: "PATM" },
      { name: "Average resolution time", unit: "Hours", weightage: 10, target: "24", freq: "Monthly", updateType: "automatic", dataSource: "Helpdesk" },
    ],
    "Stakeholder Management": [
      { name: "Client satisfaction score", unit: "Rating (1–5)", weightage: 15, target: "4.2", freq: "Quarterly", updateType: "manual", dataSource: "" },
      { name: "Stakeholder escalations", unit: "Number (#)", weightage: 10, target: "2", freq: "Monthly", updateType: "automatic", dataSource: "Helpdesk" },
    ],
    "Quality & Compliance": [
      { name: "Defect / rework rate", unit: "Percentage (%)", weightage: 10, target: "5", freq: "Monthly", updateType: "manual", dataSource: "" },
      { name: "Audit compliance score", unit: "Percentage (%)", weightage: 10, target: "90", freq: "Quarterly", updateType: "manual", dataSource: "" },
    ],
    "Innovation & Improvement": [
      { name: "Improvements submitted", unit: "Number (#)", weightage: 10, target: "2", freq: "Quarterly", updateType: "manual", dataSource: "" },
    ],
    "Team Development": [
      { name: "Peer feedback score", unit: "Rating (1–5)", weightage: 10, target: "4.0", freq: "Yearly", updateType: "manual", dataSource: "" },
      { name: "Knowledge sessions", unit: "Number (#)", weightage: 10, target: "1", freq: "Monthly", updateType: "manual", dataSource: "" },
    ],
  };
  return bank[kraTitle] || [{ name: "Target achievement rate", unit: "Percentage (%)", weightage: 10, target: "85", freq: "Quarterly", updateType: "manual", dataSource: "" }];
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function AdminCompass() {
  const [activeNav, setActiveNav] = useState("jobs");
  const [jobTab, setJobTab] = useState("descriptions");
  const [view, setView] = useState("list");
  const [viewingJd, setViewingJd] = useState(null);
  const [step, setStep] = useState(0);
  const [jdMethod, setJdMethod] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [kraAiDone, setKraAiDone] = useState(false);
  const [kpiAiLoading, setKpiAiLoading] = useState(false);
  const [kpiAiDone, setKpiAiDone] = useState(false);
  const [allJds, setAllJds] = useState(SEED_JDS);
  const [allKras, setAllKras] = useState(SEED_KRAS);
  const [allKpis, setAllKpis] = useState(SEED_KPIS);
  const [jdSearch, setJdSearch] = useState("");
  const [kraSearch, setKraSearch] = useState("");
  const [kpiSearch, setKpiSearch] = useState("");
  const [assignModal, setAssignModal] = useState(null);
  const [assignName, setAssignName] = useState("");
  const [expandedKra, setExpandedKra] = useState(null);
  const [showAddKra, setShowAddKra] = useState(false);
  const [showAddKpi, setShowAddKpi] = useState(false);
  const [newKra, setNewKra] = useState({ jdId: "", title: "", desc: "", weightage: "", assignee: "", effectiveFrom: "", effectiveTo: "", status: "active" });
  const [newKpi, setNewKpi] = useState({ jdId: "", kraId: "", name: "", unit: "", weightage: "", assignee: "", target: "", freq: "", updateType: "manual", dataSource: "", module: "", measurementType: "positive" });
  const [kraDeptFilter, setKraDeptFilter] = useState("all");
  const [kraRoleFilter, setKraRoleFilter] = useState("all");
  const [kraMemberFilter, setKraMemberFilter] = useState("all");
  const [kpiDeptFilter, setKpiDeptFilter] = useState("all");
  const [kpiRoleFilter, setKpiRoleFilter] = useState("all");
  const [kpiMemberFilter, setKpiMemberFilter] = useState("all");
  const [kraViewMode, setKraViewMode] = useState("list");
  const [kpiViewMode, setKpiViewMode] = useState("list");
  const [internalTab, setInternalTab] = useState("descriptions");
  const [actionMenuJd, setActionMenuJd] = useState(null);
  const [editingJd, setEditingJd] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", dept: "", reportingTo: "", type: "", level: "", location: "", salaryMin: "", salaryMax: "", summary: "", responsibilities: "", qualifications: "", skills: "", niceToHave: "" });
  const [actionMenuMember, setActionMenuMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [assignKraMemberModal, setAssignKraMemberModal] = useState(null);
  const [assignKraMemberKraId, setAssignKraMemberKraId] = useState("");
  const [assignKpiMemberModal, setAssignKpiMemberModal] = useState(null);
  const [assignKpiMemberKpiId, setAssignKpiMemberKpiId] = useState("");
  const [customUnits, setCustomUnits] = useState([...KPI_UNITS]);
  const [newUnitInput, setNewUnitInput] = useState("");
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, type: "create", entity: "KRA", name: "Product Strategy & Roadmap", user: "Amit V.", timestamp: "2026-06-28 09:14", detail: "Created under Senior Product Manager" },
    { id: 2, type: "create", entity: "KPI", name: "Features shipped per quarter", user: "Amit V.", timestamp: "2026-06-28 09:22", detail: "Linked to Product Strategy & Roadmap" },
    { id: 3, type: "assign", entity: "JD", name: "Senior Product Manager", user: "Priya S.", timestamp: "2026-06-29 11:05", detail: "Assigned to Amit V., Priya S." },
    { id: 4, type: "edit", entity: "KPI", name: "On-time delivery rate", user: "Rahul M.", timestamp: "2026-07-01 14:30", detail: "Target updated from 85% to 90%" },
    { id: 5, type: "activate", entity: "KRA", name: "Design Quality", user: "Priya S.", timestamp: "2026-07-02 10:00", detail: "Status changed to Active" },
    { id: 6, type: "create", entity: "KRA", name: "Revenue Generation", user: "Neha G.", timestamp: "2026-07-05 08:45", detail: "Created under Sales Executive" },
    { id: 7, type: "progress", entity: "KPI", name: "Revenue closed", user: "Rahul M.", timestamp: "2026-07-08 16:20", detail: "Progress updated: ₹9,50,000 / ₹15,00,000" },
    { id: 8, type: "deactivate", entity: "KPI", name: "Scope creep incidents", user: "Sanjay K.", timestamp: "2026-07-10 11:12", detail: "Status changed to Inactive" },
    { id: 9, type: "achievement", entity: "KPI", name: "Design review pass rate", user: "Shivani Y.", timestamp: "2026-07-12 09:55", detail: "Target achieved: 94% (target 92%)" },
    { id: 10, type: "edit", entity: "KRA", name: "Stakeholder Management", user: "Amit V.", timestamp: "2026-07-14 13:40", detail: "Weightage changed from 25% to 30%" },
  ]);
  const [editingKraId, setEditingKraId] = useState(null);
  const [editingKpiId, setEditingKpiId] = useState(null);
  const [editKraForm, setEditKraForm] = useState({});
  const [editKpiForm, setEditKpiForm] = useState({});
  const [assignKraModal, setAssignKraModal] = useState(null);
  const [assignKpiModal, setAssignKpiModal] = useState(null);
  const [assignKraName, setAssignKraName] = useState("");
  const [assignKpiName, setAssignKpiName] = useState("");

  /* ── Setup / Org state ── */
  const [setupTab, setSetupTab] = useState("company");
  const [logoPreview, setLogoPreview] = useState(null);
  const [departments, setDepartments] = useState(INITIAL_DEPTS);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptSearch, setDeptSearch] = useState("");
  const [deptForm, setDeptForm] = useState({ name: "", head: "", members: "", description: "", status: "active" });
  const fileRef = useRef(null);

  /* ── Members state ── */
  const [allMembers, setAllMembers] = useState(SEED_MEMBERS);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberDeptFilter, setMemberDeptFilter] = useState("all");
  const [memberStatusFilter, setMemberStatusFilter] = useState("all");
  const [memberGroupView, setMemberGroupView] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMode, setInviteMode] = useState("single");
  const [inviteRows, setInviteRows] = useState([{ name: "", email: "", department: "" }]);
  const [editingMember, setEditingMember] = useState(null);
  const [editMemberForm, setEditMemberForm] = useState({ name: "", email: "", department: "", isHOD: false });

  /* Stepper form */
  const [jobForm, setJobForm] = useState({ title: "", dept: "", reportingTo: "", type: "", level: "", location: "", salaryMin: "", salaryMax: "", summary: "", responsibilities: "", qualifications: "", skills: "", niceToHave: "" });
  const [formKras, setFormKras] = useState([]);
  const [formKpis, setFormKpis] = useState([]);
  const sf = (k, v) => setJobForm(f => ({ ...f, [k]: v }));

  /* Helpers */
  const jdTitle = (id) => allJds.find(j => j.id === id)?.title || "—";
  const kraName = (id) => allKras.find(k => k.id === id)?.title || "—";
  const kraCountFor = (jdId) => allKras.filter(k => k.jdId === jdId).length;
  const kpiCountFor = (jdId) => allKpis.filter(p => p.jdId === jdId).length;
  const krasForJd = (jdId) => allKras.filter(k => k.jdId === Number(jdId));
  const initials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const showToast = (msg, type = "success") => {
    toast[type](msg);
  };
  const totalKpiWeight = formKpis.reduce((s, k) => s + (Number(k.weightage) || 0), 0);

  /* AI simulation */
  const simulateAiJd = () => {
    setAiLoading(true);
    setTimeout(() => {
      sf("summary", `We are looking for a talented ${jobForm.title || "professional"} to join our ${jobForm.dept || "team"} with ${jobForm.level || "relevant"} experience.`);
      sf("responsibilities", "• Lead end-to-end ownership of assigned workstreams\n• Collaborate cross-functionally with design, engineering, and business\n• Define and track key metrics\n• Conduct regular reviews\n• Present progress reports to leadership");
      sf("qualifications", `• ${jobForm.level === "Senior" || jobForm.level === "Lead" ? "5+" : "2+"}  years of relevant experience\n• Strong analytical abilities\n• Excellent communication skills\n• Relevant degree`);
      sf("skills", "• Proficiency in industry tools\n• Data-driven decision making\n• Stakeholder management");
      sf("niceToHave", "• Agile experience\n• Startup background\n• Domain certifications");
      setAiLoading(false);
      setJdMethod("ai");
    }, 2200);
  };
  const simulateAiKras = () => {
    setAiLoading(true);
    setTimeout(() => {
      setFormKras(AI_KRAS.map((k, i) => ({ ...k, assignee: "", id: Date.now() + i })));
      setAiLoading(false);
      setKraAiDone(true);
    }, 1800);
  };
  const simulateAiKpis = () => {
    setKpiAiLoading(true);
    setTimeout(() => {
      const gen = [];
      formKras.forEach((kra, idx) => {
        genAiKpis(kra.title).forEach(kpi => {
          gen.push({ ...kpi, assignee: "", kraIdx: idx, id: Date.now() + Math.random() * 10000 });
        });
      });
      setFormKpis(gen);
      setKpiAiLoading(false);
      setKpiAiDone(true);
    }, 1800);
  };

  /* Form CRUD */
  const addFormKra = () => setFormKras(k => [...k, { id: Date.now(), title: "", desc: "", weightage: "", assignee: "", effectiveFrom: "", effectiveTo: "", status: "active" }]);
  const updFormKra = (id, f, v) => setFormKras(ks => ks.map(k => k.id === id ? { ...k, [f]: v } : k));
  const remFormKra = (id) => {
    const idx = formKras.findIndex(k => k.id === id);
    setFormKras(ks => ks.filter(k => k.id !== id));
    setFormKpis(ps => ps.filter(p => p.kraIdx !== idx).map(p => ({ ...p, kraIdx: p.kraIdx > idx ? p.kraIdx - 1 : p.kraIdx })));
  };
  const addFormKpi = (kraIdx) => setFormKpis(p => [...p, { id: Date.now() + Math.random() * 1000, kraIdx, name: "", unit: "", weightage: "", assignee: "", target: "", freq: "", updateType: "manual", dataSource: "", module: "", measurementType: "positive" }]);
  const updFormKpi = (id, f, v) => setFormKpis(ps => ps.map(p => p.id === id ? { ...p, [f]: v } : p));
  const remFormKpi = (id) => setFormKpis(ps => ps.filter(p => p.id !== id));

  const canNext = () => {
    if (step === 0) return jobForm.title && jobForm.dept && jobForm.type && jobForm.level;
    if (step === 1) return jobForm.summary && jobForm.responsibilities;
    if (step === 2) return formKras.length > 0 && formKras.every(k => k.title);
    if (step === 3) return formKpis.length > 0 && formKpis.every(k => k.name && k.target);
    return true;
  };

  const saveJd = () => {
    const nid = Date.now();
    const newJd = { id: nid, title: jobForm.title, dept: jobForm.dept, level: jobForm.level, type: jobForm.type, status: "draft", assigned: [], created: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), reportingTo: jobForm.reportingTo, location: jobForm.location, salaryMin: jobForm.salaryMin, salaryMax: jobForm.salaryMax, summary: jobForm.summary, responsibilities: jobForm.responsibilities, qualifications: jobForm.qualifications, skills: jobForm.skills, niceToHave: jobForm.niceToHave };
    const nKras = formKras.map((k, i) => ({ id: `k_${nid}_${i}`, jdId: nid, title: k.title, desc: k.desc, weightage: Number(k.weightage) || 0, assignee: k.assignee, effectiveFrom: k.effectiveFrom, effectiveTo: k.effectiveTo, status: k.status }));
    const nKpis = formKpis.map((p, i) => ({ id: `p_${nid}_${i}`, kraId: nKras[p.kraIdx]?.id || "", jdId: nid, name: p.name, unit: p.unit, weightage: Number(p.weightage) || 0, assignee: p.assignee, target: p.target, freq: p.freq, updateType: p.updateType, dataSource: p.dataSource, module: p.module }));
    setAllJds(j => [newJd, ...j]);
    setAllKras(k => [...k, ...nKras]);
    setAllKpis(p => [...p, ...nKpis]);
    showToast("Job description saved as draft");
    resetCreate();
  };

  const publishJd = (id) => {
    setAllJds(prev => prev.map(j => j.id === id ? { ...j, status: "published" } : j));
    showToast("Job description published successfully");
  };

  const startEditJd = (id) => {
    const jd = allJds.find(j => j.id === id);
    if (!jd) return;
    setEditForm({ title: jd.title || "", dept: jd.dept || "", reportingTo: jd.reportingTo || "", type: jd.type || "", level: jd.level || "", location: jd.location || "", salaryMin: jd.salaryMin || "", salaryMax: jd.salaryMax || "", summary: jd.summary || "", responsibilities: jd.responsibilities || "", qualifications: jd.qualifications || "", skills: jd.skills || "", niceToHave: jd.niceToHave || "" });
    setEditingJd(id);
    setViewingJd(null);
    setView("list");
  };

  const saveEditJd = () => {
    setAllJds(prev => prev.map(j => j.id === editingJd ? { ...j, title: editForm.title, dept: editForm.dept, reportingTo: editForm.reportingTo, type: editForm.type, level: editForm.level, location: editForm.location, salaryMin: editForm.salaryMin, salaryMax: editForm.salaryMax, summary: editForm.summary, responsibilities: editForm.responsibilities, qualifications: editForm.qualifications, skills: editForm.skills, niceToHave: editForm.niceToHave } : j));
    showToast("Job description updated successfully");
    setEditingJd(null);
  };

  const cancelEditJd = () => {
    setEditingJd(null);
  };

  const ef = (k, v) => setEditForm(f => ({ ...f, [k]: v }));

  const resetCreate = () => {
    setView("list"); setStep(0); setJdMethod(null); setKraAiDone(false); setKpiAiDone(false);
    setJobForm({ title: "", dept: "", reportingTo: "", type: "", level: "", location: "", salaryMin: "", salaryMax: "", summary: "", responsibilities: "", qualifications: "", skills: "", niceToHave: "" });
    setFormKras([]); setFormKpis([]);
  };

  const assignUser = () => {
    if (!assignName.trim()) return;
    setAllJds(j => j.map(jd => jd.id === assignModal ? { ...jd, assigned: [...jd.assigned, assignName.trim()] } : jd));
    setAssignName(""); setAssignModal(null); showToast("Member assigned successfully");
  };
  const saveNewKra = () => {
    if (!newKra.jdId || !newKra.title) return;
    setAllKras(ks => [...ks, { id: `k_new_${Date.now()}`, jdId: Number(newKra.jdId), ...newKra }]);
    setNewKra({ jdId: "", title: "", desc: "", weightage: "", assignee: "", effectiveFrom: "", effectiveTo: "", status: "active" });
    setShowAddKra(false); showToast("KRA added successfully");
  };
  const saveNewKpi = () => {
    if (!newKpi.jdId || !newKpi.kraId || !newKpi.name || !newKpi.target) return;
    setAllKpis(ps => [...ps, { id: `p_new_${Date.now()}`, jdId: Number(newKpi.jdId), kraId: newKpi.kraId, name: newKpi.name, unit: newKpi.unit, weightage: Number(newKpi.weightage) || 0, assignee: newKpi.assignee, target: newKpi.target, freq: newKpi.freq, updateType: newKpi.updateType, dataSource: newKpi.dataSource, module: newKpi.module }]);
    setNewKpi({ jdId: "", kraId: "", name: "", unit: "", weightage: "", assignee: "", target: "", freq: "", updateType: "manual", dataSource: "", module: "", measurementType: "positive" });
    setShowAddKpi(false); showToast("KPI added successfully");
  };

  /* ── KRA/KPI edit, toggle, assign handlers ── */
  const addLog = (type, entity, name, detail) => {
    setActivityLogs(l => [{ id: Date.now(), type, entity, name, user: "Kshitij S.", timestamp: new Date().toLocaleString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(",", ""), detail }, ...l]);
  };
  const toggleKraStatus = (id) => {
    const kra = allKras.find(k => k.id === id);
    if (!kra) return;
    const ns = kra.status === "active" ? "inactive" : "active";
    setAllKras(ks => ks.map(k => k.id === id ? { ...k, status: ns } : k));
    addLog(ns === "active" ? "activate" : "deactivate", "KRA", kra.title, `Status changed to ${ns === "active" ? "Active" : "Inactive"}`);
    showToast(`KRA ${ns === "active" ? "activated" : "deactivated"}`);
  };
  const toggleKpiStatus = (id) => {
    const kpi = allKpis.find(p => p.id === id);
    if (!kpi) return;
    const ns = kpi.status === "active" ? "inactive" : "active";
    setAllKpis(ps => ps.map(p => p.id === id ? { ...p, status: ns } : p));
    addLog(ns === "active" ? "activate" : "deactivate", "KPI", kpi.name, `Status changed to ${ns === "active" ? "Active" : "Inactive"}`);
    showToast(`KPI ${ns === "active" ? "activated" : "deactivated"}`);
  };
  const openEditKra = (kra) => { setEditingKraId(kra.id); setEditKraForm({ title: kra.title, desc: kra.desc, weightage: kra.weightage, effectiveFrom: kra.effectiveFrom, effectiveTo: kra.effectiveTo, status: kra.status }); };
  const saveEditKra = () => {
    setAllKras(ks => ks.map(k => k.id === editingKraId ? { ...k, ...editKraForm, weightage: Number(editKraForm.weightage) || 0 } : k));
    addLog("edit", "KRA", editKraForm.title, "KRA details updated");
    setEditingKraId(null); showToast("KRA updated");
  };
  const openEditKpi = (kpi) => { setEditingKpiId(kpi.id); setEditKpiForm({ name: kpi.name, unit: kpi.unit, weightage: kpi.weightage, target: kpi.target, freq: kpi.freq, updateType: kpi.updateType, dataSource: kpi.dataSource || "", module: kpi.module || "" }); };
  const saveEditKpi = () => {
    setAllKpis(ps => ps.map(p => p.id === editingKpiId ? { ...p, ...editKpiForm, weightage: Number(editKpiForm.weightage) || 0 } : p));
    addLog("edit", "KPI", editKpiForm.name, "KPI details updated");
    setEditingKpiId(null); showToast("KPI updated");
  };
  const assignToKra = () => {
    if (!assignKraName.trim()) return;
    addLog("assign", "KRA", allKras.find(k => k.id === assignKraModal)?.title || "", `Assigned to ${assignKraName.trim()}`);
    setAssignKraName(""); setAssignKraModal(null); showToast("Person assigned to KRA");
  };
  const assignToKpi = () => {
    if (!assignKpiName.trim()) return;
    addLog("assign", "KPI", allKpis.find(p => p.id === assignKpiModal)?.name || "", `Assigned to ${assignKpiName.trim()}`);
    setAssignKpiName(""); setAssignKpiModal(null); showToast("Person assigned to KPI");
  };
  const addCustomUnit = () => {
    const trimmed = newUnitInput.trim();
    if (!trimmed || customUnits.includes(trimmed)) return;
    setCustomUnits(u => [...u, trimmed]);
    setNewUnitInput("");
    showToast("Unit added successfully");
  };
  const removeCustomUnit = (unit) => {
    if (KPI_UNITS.includes(unit)) return;
    setCustomUnits(u => u.filter(x => x !== unit));
    showToast("Unit removed");
  };

  /* ── Setup / Org handlers ── */
  const handleLogoUpload = (e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setLogoPreview(ev.target.result); reader.readAsDataURL(file); } };
  const openDeptModal = (dept = null) => {
    if (dept) { setEditingDept(dept.id); setDeptForm({ name: dept.name, head: dept.head, members: String(dept.members), description: dept.description || "", status: dept.status }); }
    else { setEditingDept(null); setDeptForm({ name: "", head: "", members: "", description: "", status: "active" }); }
    setShowDeptModal(true);
  };
  const saveDept = () => {
    if (editingDept) { setDepartments(ds => ds.map(d => d.id === editingDept ? { ...d, ...deptForm, members: Number(deptForm.members) || d.members } : d)); }
    else { setDepartments(ds => [...ds, { id: Date.now(), name: deptForm.name, head: deptForm.head, members: Number(deptForm.members) || 0, color: COLORS[ds.length % COLORS.length], status: deptForm.status, description: deptForm.description }]); }
    setShowDeptModal(false); showToast(editingDept ? "Department updated" : "Department created");
  };
  const deleteDept = (id) => setDepartments(ds => ds.filter(d => d.id !== id));
  const filteredDepts = departments.filter(d => d.name.toLowerCase().includes(deptSearch.toLowerCase()));

  /* ── Members handlers ── */
  const memberDepts = [...new Set(allMembers.map(m => m.department).filter(Boolean))];
  const filteredMembers = allMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    const matchDept = memberDeptFilter === "all" || m.department === memberDeptFilter;
    const matchStatus = memberStatusFilter === "all" || m.status === memberStatusFilter;
    return matchSearch && matchDept && matchStatus;
  });
  const groupedMembers = memberDepts.reduce((acc, dept) => {
    const members = filteredMembers.filter(m => m.department === dept);
    if (members.length > 0) acc[dept] = members;
    return acc;
  }, {});
  const ungrouped = filteredMembers.filter(m => !m.department);

  const openInvite = (mode) => {
    setInviteMode(mode);
    setInviteRows(mode === "bulk" ? [{ name: "", email: "", department: "" }, { name: "", email: "", department: "" }, { name: "", email: "", department: "" }] : [{ name: "", email: "", department: "" }]);
    setShowInviteModal(true);
  };
  const updateInviteRow = (idx, field, val) => setInviteRows(rs => rs.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  const addInviteRow = () => setInviteRows(rs => [...rs, { name: "", email: "", department: "" }]);
  const removeInviteRow = (idx) => setInviteRows(rs => rs.filter((_, i) => i !== idx));
  const sendInvites = () => {
    const valid = inviteRows.filter(r => r.name.trim() && r.email.trim());
    if (valid.length === 0) return;
    const newMembers = valid.map((r, i) => ({ id: Date.now() + i, name: r.name.trim(), email: r.email.trim(), department: r.department || "", status: "active", isHOD: false }));
    setAllMembers(ms => [...ms, ...newMembers]);
    setShowInviteModal(false);
    showToast(`${valid.length} invite${valid.length > 1 ? "s" : ""} sent successfully`);
  };
  const openEditMember = (m) => { setEditingMember(m.id); setEditMemberForm({ name: m.name, email: m.email, department: m.department, isHOD: m.isHOD }); };
  const saveEditMember = () => {
    setAllMembers(ms => ms.map(m => m.id === editingMember ? { ...m, ...editMemberForm } : m));
    setEditingMember(null); showToast("Member updated");
  };
  const toggleMemberStatus = (id) => {
    setAllMembers(ms => ms.map(m => m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m));
    showToast("Member status updated");
  };
  const deleteMember = (id) => {
    setAllMembers(ms => ms.filter(m => m.id !== id));
    setActionMenuMember(null);
    showToast("Member removed");
  };
  const assignKraToMember = () => {
    if (!assignKraMemberKraId || !assignKraMemberModal) return;
    const member = allMembers.find(m => m.id === assignKraMemberModal);
    const kra = allKras.find(k => k.id === assignKraMemberKraId);
    if (member && kra) addLog("assign", "KRA", kra.title, `Assigned to ${member.name}`);
    setAssignKraMemberKraId(""); setAssignKraMemberModal(null); showToast("KRA assigned to member");
  };
  const assignKpiToMember = () => {
    if (!assignKpiMemberKpiId || !assignKpiMemberModal) return;
    const member = allMembers.find(m => m.id === assignKpiMemberModal);
    const kpi = allKpis.find(p => p.id === assignKpiMemberKpiId);
    if (member && kpi) addLog("assign", "KPI", kpi.name, `Assigned to ${member.name}`);
    setAssignKpiMemberKpiId(""); setAssignKpiMemberModal(null); showToast("KPI assigned to member");
  };

  const filteredJds = allJds.filter(j => j.title.toLowerCase().includes(jdSearch.toLowerCase()));
  const jdsByDept = (dept) => allJds.filter(j => j.dept === dept).map(j => j.id);
  const jdsByRole = (role) => allJds.filter(j => j.title === role).map(j => j.id);
  const jdsByMember = (member) => allJds.filter(j => j.assigned.includes(member)).map(j => j.id);
  const uniqueDepts = [...new Set(allJds.map(j => j.dept))];
  const uniqueRoles = [...new Set(allJds.map(j => j.title))];
  const uniqueMembers = [...new Set(allJds.flatMap(j => j.assigned))];

  const applyListFilters = (items, deptF, roleF, memberF, searchVal, searchField) => {
    return items.filter(item => {
      const matchSearch = item[searchField].toLowerCase().includes(searchVal.toLowerCase());
      const matchDept = deptF === "all" || jdsByDept(deptF).includes(item.jdId);
      const matchRole = roleF === "all" || jdsByRole(roleF).includes(item.jdId);
      const matchMember = memberF === "all" || jdsByMember(memberF).includes(item.jdId);
      return matchSearch && matchDept && matchRole && matchMember;
    });
  };
  const filteredKras = applyListFilters(allKras, kraDeptFilter, kraRoleFilter, kraMemberFilter, kraSearch, "title");
  const filteredKpis = applyListFilters(allKpis, kpiDeptFilter, kpiRoleFilter, kpiMemberFilter, kpiSearch, "name");

  /* ══════════════════════════════════════════
     STYLE HELPERS & SUB-COMPONENTS
     ══════════════════════════════════════════ */
  const navStyle = (a) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: T.rsm, cursor: "pointer", transition: "all .16s", background: a ? T.orangeSoft : "transparent", color: a ? T.orange : T.inkSoft, fontWeight: a ? 600 : 500, fontSize: 13.5, border: "none", width: "100%", textAlign: "left", fontFamily: T.font });
  const pill = (a) => ({ padding: "8px 18px", borderRadius: T.rsm, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .16s", fontFamily: T.font, background: a ? T.orange : "transparent", color: a ? "#fff" : T.inkSoft });
  const card = { background: T.surface, borderRadius: T.rlg, border: `1px solid ${T.borderSoft}`, padding: "24px 28px" };
  const g2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 };
  const g3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 18 };
  const fb = { borderColor: T.orange, boxShadow: `0 0 0 4px ${T.orangeSoft}` };
  const iB = { width: "100%", minHeight: 44, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, background: T.raised, color: T.ink, padding: "0 14px", fontSize: 13.5, fontWeight: 500, fontFamily: T.font, outline: "none", transition: "border-color .16s, box-shadow .16s" };
  const sB = { ...iB, appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(44,44,44,.48)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" };
  const tB = { ...iB, minHeight: 88, padding: "12px 14px", resize: "vertical", lineHeight: 1.6 };
  const gBtn = { width: 32, height: 32, borderRadius: T.rsm, border: "none", background: "transparent", cursor: "pointer", color: T.inkMuted, display: "grid", placeItems: "center", transition: "all .16s", padding: 0 };
  const aBtn = { ...gBtn, border: `1px solid ${T.borderSoft}`, background: T.raised };
  const dashedBtn = { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 12, borderRadius: T.rmd, border: `2px dashed ${T.borderWarm}`, background: "transparent", cursor: "pointer", color: T.inkSoft, fontSize: 13, fontWeight: 600, fontFamily: T.font };
  const smBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: T.rsm, border: "none", background: "transparent", cursor: "pointer", color: T.orange, fontSize: 12, fontWeight: 600, fontFamily: T.font };

  const FI = ({ style: sx, ...p }) => { const [fc, sfc] = useState(false); return <input {...p} style={{ ...iB, ...sx, ...(fc ? fb : {}) }} onFocus={(e) => { sfc(true); p.onFocus?.(e); }} onBlur={(e) => { sfc(false); p.onBlur?.(e); }} />; };
  const FS = ({ children, style: sx, ...p }) => { const [fc, sfc] = useState(false); return <select {...p} style={{ ...sB, ...sx, ...(fc ? fb : {}) }} onFocus={() => sfc(true)} onBlur={() => sfc(false)}>{children}</select>; };
  const FT = ({ style: sx, ...p }) => { const [fc, sfc] = useState(false); return <textarea {...p} style={{ ...tB, ...sx, ...(fc ? fb : {}) }} onFocus={() => sfc(true)} onBlur={() => sfc(false)} />; };
  const Fld = ({ label, children, hint, span }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...(span ? { gridColumn: `span ${span}` } : {}) }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: 11, color: T.inkMuted }}>{hint}</span>}
    </div>
  );
  const Btn = ({ primary, children, disabled, ...p }) => (
    <button {...p} disabled={disabled} style={{ minHeight: 42, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 22px", borderRadius: T.rsm, border: primary ? "none" : `1px solid ${T.borderSoft}`, cursor: disabled ? "not-allowed" : "pointer", fontFamily: T.font, background: primary ? (disabled ? T.inkMuted : T.orange) : T.raised, color: primary ? "#fff" : T.inkSoft, fontSize: 13, fontWeight: 600, opacity: disabled ? 0.5 : 1, transition: "all .16s" }}>{children}</button>
  );
  const SH = ({ icon, title, sub }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 2 }}>
        <span style={{ color: T.orange, display: "flex" }}>{icon}</span>{title}
      </div>
      {sub && <p style={{ fontSize: 12.5, color: T.inkMuted, margin: 0 }}>{sub}</p>}
    </div>
  );
  const StatusPill = ({ s: st }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: st === "published" || st === "active" ? "rgba(137,247,231,.2)" : "rgba(237,196,136,.28)", color: st === "published" || st === "active" ? T.growth : "#8B5D1B" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: st === "published" || st === "active" ? T.growth : "#C9A24E" }} />
      {st === "published" ? "Published" : st === "active" ? "Active" : st === "draft" ? "Draft" : "Inactive"}
    </span>
  );
  const FilterSelect = ({ value, onChange, label, options }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40 }}>
      <select style={{ border: "none", outline: "none", background: "transparent", fontSize: 12.5, fontWeight: 500, fontFamily: T.font, color: T.ink, cursor: "pointer" }} value={value} onChange={onChange}>
        <option value="all">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
  const AiBar = ({ text, sub, onClick, label }) => (
    <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, background: T.warm, border: "1px solid rgba(218,119,86,.12)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: T.rmd, background: T.aiGrad, display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>{ico.ai}</div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{text}</div>
          <div style={{ fontSize: 12, color: T.inkSoft }}>{sub}</div>
        </div>
      </div>
      <Btn primary onClick={onClick}>{label}</Btn>
    </div>
  );
  const Loader = ({ text }) => (
    <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, minHeight: 100, marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.aiGrad, display: "grid", placeItems: "center", animation: "pulse 1.5s ease infinite" }}>
        <I d="M12 8a4 4 0 100 8 4 4 0 000-8z" size={14} stroke="#fff" />
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{text}</span>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.8}}`}</style>
    </div>
  );

  /* ══════════════════════════════════════════
     STEPPER
     ══════════════════════════════════════════ */
  const Stepper = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      {STEPS.map((st, i) => {
        const done = i < step, active = i === step;
        return (
          <div key={st.key} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: done ? "pointer" : "default", whiteSpace: "nowrap" }} onClick={() => done && setStep(i)}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, background: done ? T.growth : active ? T.orange : T.surface, color: done || active ? "#fff" : T.inkMuted, border: done || active ? "none" : `1.5px solid ${T.borderWarm}` }}>
                {done ? <I d="M20 6L9 17l-5-5" size={14} stroke="#fff" /> : st.num}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 600, color: active ? T.ink : done ? T.growth : T.inkMuted }}>{st.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, margin: "0 12px", borderRadius: 1, background: done ? T.growth : T.borderSoft }} />}
          </div>
        );
      })}
    </div>
  );

  /* ══════ STEP 0 — JOB DETAILS ══════ */
  const StepDetails = () => (
    <div style={card}>
      <SH icon={ico.briefcase} title="Job Details" sub="Define the role identity — title, department, and employment terms." />
      <div style={g2}>
        <Fld label="Job Title *"><FI placeholder="e.g. Senior Product Manager" value={jobForm.title} onChange={e => sf("title", e.target.value)} /></Fld>
        <Fld label="Department *"><FS value={jobForm.dept} onChange={e => sf("dept", e.target.value)}><option value="">Select department</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</FS></Fld>
      </div>
      <div style={g2}>
        <Fld label="Employment Type *"><FS value={jobForm.type} onChange={e => sf("type", e.target.value)}><option value="">Select type</option>{EMP_TYPES.map(t => <option key={t}>{t}</option>)}</FS></Fld>
        <Fld label="Experience Level *"><FS value={jobForm.level} onChange={e => sf("level", e.target.value)}><option value="">Select level</option>{EXP_LEVELS.map(l => <option key={l}>{l}</option>)}</FS></Fld>
      </div>
      <div style={g2}>
        <Fld label="Reporting To"><FI placeholder="e.g. VP of Product" value={jobForm.reportingTo} onChange={e => sf("reportingTo", e.target.value)} /></Fld>
        <Fld label="Work Location"><FI placeholder="e.g. Mumbai, Hybrid" value={jobForm.location} onChange={e => sf("location", e.target.value)} /></Fld>
      </div>
      <div style={g2}>
        <Fld label="Salary Range — Min (₹)" hint="Optional"><FI type="number" placeholder="e.g. 1200000" value={jobForm.salaryMin} onChange={e => sf("salaryMin", e.target.value)} /></Fld>
        <Fld label="Salary Range — Max (₹)"><FI type="number" placeholder="e.g. 1800000" value={jobForm.salaryMax} onChange={e => sf("salaryMax", e.target.value)} /></Fld>
      </div>
    </div>
  );

  /* ══════ STEP 1 — DESCRIPTION ══════ */
  const StepDesc = () => (
    <div>
      {!jdMethod && !aiLoading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ ...card, cursor: "pointer", position: "relative", overflow: "hidden" }} onClick={() => { jobForm.title ? simulateAiJd() : showToast("Please fill Job Title first", "error"); }} onMouseOver={e => e.currentTarget.style.boxShadow = T.aiGlow} onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: T.aiGrad }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: T.rmd, background: T.aiGrad, display: "grid", placeItems: "center", color: "#fff" }}>{ico.ai}</div>
              <div><div style={{ fontSize: 15, fontWeight: 700 }}>Create with AI</div><div style={{ fontSize: 12, color: T.inkSoft }}>Auto-generate a complete JD</div></div>
            </div>
            <p style={{ fontSize: 12.5, color: T.inkMuted, lineHeight: 1.65, margin: 0 }}>We'll use the job title, department, and level to draft a full description. You can edit everything afterwards.</p>
          </div>
          <div style={{ ...card, cursor: "pointer" }} onClick={() => setJdMethod("manual")} onMouseOver={e => e.currentTarget.style.boxShadow = T.shadow} onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: T.rmd, background: T.surface, display: "grid", placeItems: "center", color: T.orange, border: `1px solid ${T.borderSoft}` }}>{ico.edit}</div>
              <div><div style={{ fontSize: 15, fontWeight: 700 }}>Write Manually</div><div style={{ fontSize: 12, color: T.inkSoft }}>Craft every section yourself</div></div>
            </div>
            <p style={{ fontSize: 12.5, color: T.inkMuted, lineHeight: 1.65, margin: 0 }}>Fill each section in your own words — best when you have a precise brief ready.</p>
          </div>
        </div>
      )}
      {aiLoading && <Loader text="Generating job description…" />}
      {jdMethod && !aiLoading && (
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <SH icon={ico.doc} title="Job Description" sub={jdMethod === "ai" ? "AI-generated draft — review and edit." : "Write the job description for this role."} />
            {jdMethod === "ai" && <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: T.orangeSoft, color: T.orange, fontSize: 11, fontWeight: 700, height: "fit-content" }}>{ico.ai} AI-generated</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Fld label="Role Summary *"><FT placeholder="A concise overview of the role..." value={jobForm.summary} onChange={e => sf("summary", e.target.value)} style={{ minHeight: 80 }} /></Fld>
            <Fld label="Key Responsibilities *"><FT placeholder="• List core responsibilities..." value={jobForm.responsibilities} onChange={e => sf("responsibilities", e.target.value)} style={{ minHeight: 120 }} /></Fld>
            <div style={g2}>
              <Fld label="Required Qualifications"><FT placeholder="• Education, experience..." value={jobForm.qualifications} onChange={e => sf("qualifications", e.target.value)} /></Fld>
              <Fld label="Required Skills"><FT placeholder="• Technical and soft skills..." value={jobForm.skills} onChange={e => sf("skills", e.target.value)} /></Fld>
            </div>
            <Fld label="Nice to Have"><FT placeholder="• Additional desirable qualifications..." value={jobForm.niceToHave} onChange={e => sf("niceToHave", e.target.value)} style={{ minHeight: 70 }} /></Fld>
          </div>
        </div>
      )}
    </div>
  );

  /* ══════ STEP 2 — KRAs ══════ */
  const StepKra = () => (
    <div>
      {!kraAiDone && !aiLoading && <AiBar text="AI can suggest KRAs based on this role" sub="Generated from the job description. You can edit or remove any." onClick={simulateAiKras} label="Generate KRAs" />}
      {aiLoading && <Loader text="Analysing role and generating KRAs…" />}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {formKras.map((kra, i) => (
          <div key={kra.id} style={{ ...card, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", borderRadius: "16px 0 0 16px", background: COLORS[i % 5] }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS[i % 5], display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: T.ink, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={g3}>
                  <Fld label="KRA Name *"><FI placeholder="e.g. Operational Excellence" value={kra.title} onChange={e => updFormKra(kra.id, "title", e.target.value)} /></Fld>
                  <Fld label="KRA Weightage (%)" hint="Distribute 100% across KRAs"><FI type="number" placeholder="e.g. 30" value={kra.weightage} onChange={e => updFormKra(kra.id, "weightage", e.target.value)} /></Fld>
                  <Fld label="Assignee Person">
                    <FS value={kra.assignee || ""} onChange={e => updFormKra(kra.id, "assignee", e.target.value)}>
                      <option value="">Select assignee</option>
                      {allMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </FS>
                  </Fld>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 18 }}>
                  <Fld label="Status">
                    <FS value={kra.status} onChange={e => updFormKra(kra.id, "status", e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </FS>
                  </Fld>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Fld label="KRA Description"><FT placeholder="Describe what this KRA measures and its expected outcomes..." value={kra.desc} onChange={e => updFormKra(kra.id, "desc", e.target.value)} style={{ minHeight: 68 }} /></Fld>
                </div>
                <div style={g2}>
                  <Fld label="Effective From"><FI type="date" value={kra.effectiveFrom} onChange={e => updFormKra(kra.id, "effectiveFrom", e.target.value)} /></Fld>
                  <Fld label="Effective To"><FI type="date" value={kra.effectiveTo} onChange={e => updFormKra(kra.id, "effectiveTo", e.target.value)} /></Fld>
                </div>
              </div>
              <button style={{ ...gBtn, marginTop: 2 }} onClick={() => remFormKra(kra.id)} onMouseOver={e => { e.currentTarget.style.color = T.danger; }} onMouseOut={e => { e.currentTarget.style.color = T.inkMuted; }}>{ico.trash}</button>
            </div>
          </div>
        ))}
      </div>
      <button style={{ ...dashedBtn, marginTop: 14 }} onClick={addFormKra}>{ico.plus} Add KRA Manually</button>
    </div>
  );

  /* ══════ STEP 3 — KPIs ══════ */
  const StepKpi = () => (
    <div>
      {!kpiAiDone && !kpiAiLoading && <AiBar text="AI can suggest KPIs for each KRA" sub="Measurable indicators generated per KRA." onClick={simulateAiKpis} label="Generate KPIs" />}
      {kpiAiLoading && <Loader text="Mapping KPIs to your KRAs…" />}

      {/* KPI Weightage bar */}
      {formKpis.length > 0 && (
        <div style={{ ...card, marginBottom: 16, padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft }}>Total KPI Weightage</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: totalKpiWeight === 100 ? T.growth : totalKpiWeight > 100 ? T.error : T.orange }}>{totalKpiWeight}% / 100%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: T.surface, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(totalKpiWeight, 100)}%`, borderRadius: 3, background: totalKpiWeight === 100 ? T.growth : totalKpiWeight > 100 ? T.error : T.orange, transition: "width .3s" }} />
          </div>
        </div>
      )}

      {formKras.map((kra, kraIdx) => {
        const kraKpis = formKpis.filter(p => p.kraIdx === kraIdx);
        return (
          <div key={kra.id} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: COLORS[kraIdx % 5], display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{kraIdx + 1}</div>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>KRA {kraIdx + 1} <span style={{ fontWeight: 500, color: T.inkSoft }}>({kra.title || "Untitled"})</span></span>
              {kra.weightage && <span style={{ padding: "3px 10px", borderRadius: 999, background: T.orangeSoft, fontSize: 11, fontWeight: 700, color: T.orange, marginLeft: 4 }}>{kra.weightage}% weightage</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 30 }}>
              {kraKpis.map((kpi) => (
                <div key={kpi.id} style={{ ...card, padding: "18px 22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.orange }}>KPI</span>
                    <button style={gBtn} onClick={() => remFormKpi(kpi.id)} onMouseOver={e => { e.currentTarget.style.color = T.danger; }} onMouseOut={e => { e.currentTarget.style.color = T.inkMuted; }}>{ico.trash}</button>
                  </div>
                  <div style={g3}>
                    <Fld label="KPI Name *"><FI placeholder="e.g. Task completion rate" value={kpi.name} onChange={e => updFormKpi(kpi.id, "name", e.target.value)} /></Fld>
                    <Fld label="KPI Unit"><FS value={kpi.unit} onChange={e => updFormKpi(kpi.id, "unit", e.target.value)}><option value="">Select unit</option>{KPI_UNITS.map(u => <option key={u}>{u}</option>)}</FS></Fld>
                    <Fld label="KPI Weightage (%)" hint="Distribute 100% across all KPIs"><FI type="number" placeholder="e.g. 15" value={kpi.weightage} onChange={e => updFormKpi(kpi.id, "weightage", e.target.value)} /></Fld>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 18 }}>
                    <Fld label="Assignee Person">
                      <FS value={kpi.assignee || ""} onChange={e => updFormKpi(kpi.id, "assignee", e.target.value)}>
                        <option value="">Select assignee</option>
                        {allMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </FS>
                    </Fld>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 18 }}>
                    <Fld label="Target Value *"><FI placeholder="e.g. 95" value={kpi.target} onChange={e => updFormKpi(kpi.id, "target", e.target.value)} /></Fld>
                    <Fld label="Target Frequency"><FS value={kpi.freq} onChange={e => updFormKpi(kpi.id, "freq", e.target.value)}><option value="">Select</option>{TARGET_FREQ.map(fr => <option key={fr}>{fr}</option>)}</FS></Fld>
                    <Fld label="Update Type">
                      <FS value={kpi.updateType} onChange={e => updFormKpi(kpi.id, "updateType", e.target.value)}>
                        <option value="manual">Manual Entry</option>
                        <option value="automatic">Automatic</option>
                      </FS>
                    </Fld>
                    <Fld label="Measurement Type" hint={kpi.measurementType === "negative" ? "Missing target deducts points" : "Missing target doesn't deduct"}>
                      <FS value={kpi.measurementType || "positive"} onChange={e => updFormKpi(kpi.id, "measurementType", e.target.value)}>
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                      </FS>
                    </Fld>
                  </div>
                  {kpi.updateType === "automatic" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 4 }}>
                      <Fld label="Data Source">
                        <FS value={kpi.dataSource} onChange={e => { updFormKpi(kpi.id, "dataSource", e.target.value); updFormKpi(kpi.id, "module", ""); }}>
                          <option value="">Select data source</option>
                          {DATA_SOURCES.map(ds => <option key={ds}>{ds}</option>)}
                        </FS>
                      </Fld>
                      {kpi.dataSource && (
                        <Fld label="Module">
                          <FS value={kpi.module} onChange={e => updFormKpi(kpi.id, "module", e.target.value)}>
                            <option value="">Select module</option>
                            {(MODULES_BY_SOURCE[kpi.dataSource] || []).map(m => <option key={m}>{m}</option>)}
                          </FS>
                        </Fld>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button style={{ ...smBtn, alignSelf: "flex-start" }} onClick={() => addFormKpi(kraIdx)}>{ico.plus} Add KPI</button>
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ══════ STEP 4 — REVIEW ══════ */
  const StepReview = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={card}>
        <SH icon={ico.briefcase} title={jobForm.title || "Untitled Role"} sub={`${jobForm.dept} · ${jobForm.level} · ${jobForm.type}`} />
        {jobForm.location && <p style={{ fontSize: 12.5, color: T.inkMuted, margin: "4px 0 0" }}>📍 {jobForm.location}{jobForm.reportingTo ? ` · Reports to ${jobForm.reportingTo}` : ""}</p>}
      </div>
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Role Summary</div>
        <p style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{jobForm.summary}</p>
      </div>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>KRAs & KPIs</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: totalKpiWeight === 100 ? T.growth : T.orange }}>{formKras.length} KRAs · {formKpis.length} KPIs · {totalKpiWeight}% weightage</span>
        </div>
        {formKras.map((kra, i) => (
          <div key={kra.id} style={{ padding: "14px 0", borderTop: i > 0 ? `1px solid ${T.borderSoft}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: COLORS[i % 5], display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{kra.title}</span>
              <StatusPill s={kra.status} />
            </div>
            {kra.effectiveFrom && <p style={{ fontSize: 11, color: T.inkMuted, margin: "2px 0 6px 28px" }}>{ico.calendar} {kra.effectiveFrom} → {kra.effectiveTo}</p>}
            {formKpis.filter(p => p.kraIdx === i).map(kpi => (
              <div key={kpi.id} style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 28, padding: "6px 0", fontSize: 12.5 }}>
                <span style={{ color: T.ink, fontWeight: 600, flex: 1 }}>{kpi.name}</span>
                <span style={{ color: T.inkMuted }}>{kpi.weightage}%</span>
                <span style={{ color: T.inkMuted }}>Target: {kpi.target} {kpi.unit}</span>
                <span style={{ color: T.inkMuted }}>{kpi.freq}</span>
                <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream, color: T.ink }}>{kpi.updateType === "automatic" ? `Auto · ${kpi.dataSource}` : "Manual"}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     ORGANISATION — COMPANY DETAILS
     ══════════════════════════════════════════ */
  const divider = { height: 1, background: T.borderSoft, margin: "0 0 28px" };
  const secTitle = (icon, title, sub) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
        <span style={{ color: T.orange, display: "flex" }}>{icon}</span>{title}
      </div>
      <p style={{ fontSize: 12, color: T.inkMuted, margin: 0 }}>{sub}</p>
    </div>
  );

  const CompanyDetails = () => (
    <div style={card}>
      {secTitle(ico.layers, "Basic Information", "Core identity of your organisation")}
      <div style={g2}>
        <Fld label="Company Name *"><FI placeholder="e.g. Lockated Technologies Pvt. Ltd." /></Fld>
        <Fld label="Company Registration ID"><FI placeholder="e.g. CIN U72200MH2018PTC123456" /></Fld>
      </div>
      <div style={g2}>
        <Fld label="Industry / Sector *"><FS><option value="">Select industry</option>{INDUSTRIES.map(i => <option key={i}>{i}</option>)}</FS></Fld>
        <Fld label="Year of Establishment"><FI type="number" placeholder="e.g. 2018" /></Fld>
      </div>
      <div style={g2}>
        <Fld label="Company Logo">
          <div style={{ width: "100%", minHeight: 100, border: `2px dashed ${T.borderWarm}`, borderRadius: T.rmd, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", background: T.surface, transition: "all .16s" }}
            onClick={() => fileRef.current?.click()}
            onMouseOver={e => { e.currentTarget.style.borderColor = T.orange; e.currentTarget.style.background = T.orangeSoft; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = T.borderWarm; e.currentTarget.style.background = T.surface; }}
          >
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleLogoUpload} />
            {logoPreview ? <img src={logoPreview} alt="Logo" style={{ width: 56, height: 56, borderRadius: T.rmd, objectFit: "contain", border: `1px solid ${T.borderSoft}` }} /> : (
              <>
                <span style={{ color: T.inkMuted }}>{ico.arrowLeft}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}>Upload logo</span>
                <span style={{ fontSize: 11, color: T.inkMuted }}>PNG, JPG, SVG — max 2 MB</span>
              </>
            )}
          </div>
        </Fld>
        <Fld label="Number of Employees *"><FS><option value="">Select range</option>{EMPLOYEE_RANGES.map(r => <option key={r}>{r}</option>)}</FS></Fld>
      </div>
      <div style={{ marginBottom: 18 }}>
        <Fld label="Business Description"><FT placeholder="Briefly describe what your company does, its core offerings, and value proposition..." /></Fld>
      </div>

      <div style={divider} />
      {secTitle(<I d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" />, "Owner / Founder Details", "Primary point of contact for this account")}
      <div style={g2}>
        <Fld label="Full Name *"><FI placeholder="e.g. Rajesh Kumar" /></Fld>
        <Fld label="Designation"><FI placeholder="e.g. CEO & Founder" /></Fld>
      </div>
      <div style={g2}>
        <Fld label="Email Address *"><FI type="email" placeholder="e.g. rajesh@company.com" /></Fld>
        <Fld label="Phone Number *"><FI type="tel" placeholder="e.g. +91 98765 43210" /></Fld>
      </div>

      <div style={divider} />
      {secTitle(ico.doc, "Business Registration", "Statutory and compliance identifiers")}
      <div style={g3}>
        <Fld label="GSTIN"><FI placeholder="e.g. 27AABCU9603R1ZM" /></Fld>
        <Fld label="PAN"><FI placeholder="e.g. AABCU9603R" /></Fld>
        <Fld label="CIN"><FI placeholder="e.g. U72200MH2018PTC" /></Fld>
      </div>
      <div style={g2}>
        <Fld label="Company Website"><FI type="url" placeholder="e.g. https://www.company.com" /></Fld>
        <Fld label="Company Email Domain"><FI placeholder="e.g. @company.com" /></Fld>
      </div>

      <div style={divider} />
      {secTitle(<I d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z" />, "Registered Address", "Primary office location")}
      <div style={g2}>
        <Fld label="Address Line 1 *"><FI placeholder="e.g. 501, Tower A, Business Park" /></Fld>
        <Fld label="Address Line 2"><FI placeholder="e.g. Near Metro Station, Sector 5" /></Fld>
      </div>
      <div style={g2}>
        <Fld label="City *"><FI placeholder="e.g. Mumbai" /></Fld>
        <Fld label="State / Province *"><FS><option value="">Select state</option>{STATES_INDIA.map(st => <option key={st}>{st}</option>)}</FS></Fld>
      </div>
      <div style={g2}>
        <Fld label="Country *"><FS><option value="">Select country</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</FS></Fld>
        <Fld label="PIN / ZIP Code *"><FI placeholder="e.g. 400001" /></Fld>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 24, borderTop: `1px solid ${T.borderSoft}`, marginTop: 8 }}>
        <Btn>Cancel</Btn>
        <Btn primary onClick={() => showToast("Company details saved")}>{ico.check} Save Details</Btn>
      </div>
    </div>
  );

  /* ══════ DEPARTMENTS ══════ */
  const DeptList = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40, width: 260 }}>
          <span style={{ display: "flex", color: T.inkMuted }}>{ico.search}</span>
          <input style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontWeight: 500, fontFamily: T.font, color: T.ink }} placeholder="Search departments..." value={deptSearch} onChange={e => setDeptSearch(e.target.value)} />
        </div>
        <Btn primary onClick={() => openDeptModal()}>{ico.plus} Add Department</Btn>
      </div>
      {filteredDepts.length === 0 ? (
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", textAlign: "center" }}>
          <span style={{ fontSize: 36, marginBottom: 12 }}>🏢</span>
          <p style={{ fontSize: 14, fontWeight: 600, color: T.inkSoft, margin: "0 0 4px" }}>No departments found</p>
          <p style={{ fontSize: 12.5, color: T.inkMuted, margin: "0 0 16px" }}>Create your first department to start organising your team.</p>
          <Btn primary onClick={() => openDeptModal()}>{ico.plus} Add Department</Btn>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {filteredDepts.map((d, i) => (
            <div key={d.id} style={{ ...card, position: "relative", overflow: "hidden" }}
              onMouseOver={e => e.currentTarget.style.boxShadow = T.shadow}
              onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: d.color || COLORS[i % 5], borderRadius: "16px 16px 0 0" }} />
              <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 4 }}>
                <button style={aBtn} onClick={() => openDeptModal(d)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.edit}</button>
                <button style={aBtn} onClick={() => deleteDept(d.id)} onMouseOver={e => { e.currentTarget.style.background = "rgba(228,145,145,.1)"; e.currentTarget.style.color = T.danger; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.trash}</button>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{d.name}</p>
              <div style={{ fontSize: 12, color: T.inkSoft, fontWeight: 500, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{ico.people} {d.head}</span>
                <span>·</span>
                <span>{d.members} members</span>
              </div>
              <StatusPill s={d.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ══════ ORG SECTION (wrapper) ══════ */
  const OrgSection = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Organisation Setup</h1>
        <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4, fontWeight: 400, lineHeight: 1.6 }}>Configure your company profile and team structure to get started.</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: 4, background: T.raised, borderRadius: T.rmd, border: `1px solid ${T.borderSoft}`, width: "fit-content", marginBottom: 28 }}>
        {SETUP_TABS.map(t => <button key={t.key} style={pill(setupTab === t.key)} onClick={() => setSetupTab(t.key)}>{t.label}</button>)}
      </div>
      {setupTab === "company" && <CompanyDetails />}
      {setupTab === "departments" && <DeptList />}
    </div>
  );

  /* ══════════════════════════════════════════
     MEMBERS SECTION
     ══════════════════════════════════════════ */
  const MemberCard = ({ m }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, transition: "box-shadow .16s" }}
      onMouseOver={e => e.currentTarget.style.boxShadow = T.shadow} onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: m.status === "active" ? COLORS[memberDepts.indexOf(m.department) % 5] || T.kpiBlue : T.borderWarm, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, color: T.ink, flexShrink: 0, opacity: m.status === "active" ? 1 : 0.5 }}>{initials(m.name)}</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: m.status === "active" ? T.ink : T.inkMuted }}>{m.name}</span>
            {m.isHOD && <span style={{ padding: "2px 8px", borderRadius: 999, background: T.orangeSoft, color: T.orange, fontSize: 10, fontWeight: 700 }}>HOD</span>}
            <StatusPill s={m.status} />
          </div>
          <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2 }}>{m.email}{m.department ? ` · ${m.department}` : ""}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
        <button style={aBtn} title="Actions" onClick={(e) => { e.stopPropagation(); setActionMenuMember(actionMenuMember === m.id ? null : m.id); }}
          onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
          onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.moreVert}</button>
        {actionMenuMember === m.id && (
          <div style={{ position: "absolute", top: 36, right: 38, background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, boxShadow: "0 6px 24px rgba(44,44,44,.12)", zIndex: 20, minWidth: 170, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <button style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.ink, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }} onMouseOver={e => e.currentTarget.style.background = T.surface} onMouseOut={e => e.currentTarget.style.background = "transparent"} onClick={() => { setActionMenuMember(null); openEditMember(m); }}><span style={{ display: "flex", color: T.inkMuted }}>{ico.edit}</span>Edit</button>
            <button style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.ink, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }} onMouseOver={e => e.currentTarget.style.background = T.surface} onMouseOut={e => e.currentTarget.style.background = "transparent"} onClick={() => { setActionMenuMember(null); setAssignKraMemberModal(m.id); }}><span style={{ display: "flex", color: T.inkMuted }}>{ico.goals}</span>Assign KRA</button>
            <button style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.ink, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }} onMouseOver={e => e.currentTarget.style.background = T.surface} onMouseOut={e => e.currentTarget.style.background = "transparent"} onClick={() => { setActionMenuMember(null); setAssignKpiMemberModal(m.id); }}><span style={{ display: "flex", color: T.inkMuted }}>{ico.bar}</span>Assign KPI</button>
            <div style={{ height: 1, background: T.borderSoft }} />
            <button style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.ink, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }} onMouseOver={e => e.currentTarget.style.background = T.surface} onMouseOut={e => e.currentTarget.style.background = "transparent"} onClick={() => { setActionMenuMember(null); toggleMemberStatus(m.id); }}><span style={{ display: "flex", color: T.inkMuted }}>{ico.power}</span>{m.status === "active" ? "Deactivate" : "Activate"}</button>
            <button style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.danger, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(228,145,145,.06)"} onMouseOut={e => e.currentTarget.style.background = "transparent"} onClick={() => { deleteMember(m.id); }}><span style={{ display: "flex" }}>{ico.trash}</span>Delete</button>
          </div>
        )}
        <button style={aBtn} title="View Profile" onClick={() => setViewingMember(m.id)}
          onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
          onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.eye}</button>
      </div>
    </div>
  );

  /* ══════ MEMBER DETAIL VIEW ══════ */
  const MemberDetail = () => {
    const m = allMembers.find(mb => mb.id === viewingMember);
    if (!m) return null;
    const memberKras = allKras.filter(k => {
      const jdsWithMember = allJds.filter(j => j.assigned.includes(m.name)).map(j => j.id);
      return jdsWithMember.includes(k.jdId);
    });
    const memberKpis = allKpis.filter(p => memberKras.some(k => k.id === p.kraId));
    const memberJds = allJds.filter(j => j.assigned.includes(m.name));

    return (
      <div>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "transparent", cursor: "pointer", color: T.inkMuted, fontSize: 12.5, fontWeight: 600, fontFamily: T.font, marginBottom: 16, padding: 0 }} onClick={() => setViewingMember(null)}>
          {ico.arrowLeft} Back to Members
        </button>

        {/* Profile header */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: m.status === "active" ? COLORS[memberDepts.indexOf(m.department) % 5] || T.kpiBlue : T.borderWarm, display: "grid", placeItems: "center", fontSize: 20, fontWeight: 800, color: T.ink, flexShrink: 0 }}>{initials(m.name)}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{m.name}</h2>
                  {m.isHOD && <span style={{ padding: "3px 10px", borderRadius: 999, background: T.orangeSoft, color: T.orange, fontSize: 11, fontWeight: 700 }}>HOD</span>}
                  <StatusPill s={m.status} />
                </div>
                <p style={{ fontSize: 13, color: T.inkSoft, margin: 0 }}>{m.email}</p>
                <p style={{ fontSize: 12.5, color: T.inkMuted, margin: "4px 0 0" }}>{m.department || "No department assigned"}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Btn onClick={() => openEditMember(m)}>{ico.edit} Edit</Btn>
              <Btn onClick={() => setAssignKraMemberModal(m.id)}>{ico.goals} Assign KRA</Btn>
              <Btn onClick={() => setAssignKpiMemberModal(m.id)}>{ico.bar} Assign KPI</Btn>
              <Btn onClick={() => toggleMemberStatus(m.id)}>{ico.power} {m.status === "active" ? "Deactivate" : "Activate"}</Btn>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Assigned JDs", value: memberJds.length, bg: T.kpiBlue },
            { label: "Linked KRAs", value: memberKras.length, bg: T.kpiMint },
            { label: "Linked KPIs", value: memberKpis.length, bg: T.kpiLav },
          ].map((st, i) => (
            <div key={i} style={{ padding: "16px 20px", borderRadius: T.rlg, background: st.bg }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, marginBottom: 6 }}>{st.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>{st.value}</div>
            </div>
          ))}
        </div>

        {/* Assigned Job Descriptions */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Assigned Job Descriptions</div>
          {memberJds.length === 0 ? (
            <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>No job descriptions assigned to this member yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {memberJds.map(jd => (
                <div key={jd.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: T.rmd, background: T.raised, border: `1px solid ${T.borderSoft}` }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{jd.title}</div>
                    <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 2 }}>{jd.dept} · {jd.level} · {jd.type}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StatusPill s={jd.status} />
                    <span style={{ padding: "3px 10px", borderRadius: 999, background: T.surface, fontSize: 11, fontWeight: 700 }}>{allKras.filter(k => k.jdId === jd.id).length} KRAs</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KRAs & KPIs */}
        <div style={{ ...card }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>KRAs & KPIs</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}>{memberKras.length} KRAs · {memberKpis.length} KPIs</span>
          </div>
          {memberKras.length === 0 ? (
            <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>No KRAs linked to this member yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {memberKras.map((kra, i) => {
                const kraKpis = memberKpis.filter(p => p.kraId === kra.id);
                return (
                  <div key={kra.id} style={{ padding: "18px 20px", borderRadius: T.rmd, background: T.raised, border: `1px solid ${T.borderSoft}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: COLORS[i % 5] }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: COLORS[i % 5], display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{kra.title}</span>
                        <StatusPill s={kra.status} />
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 999, background: T.surface, fontSize: 11, fontWeight: 700 }}>{kra.weightage || 0}%</span>
                    </div>
                    {kra.desc && <p style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.6, margin: "4px 0 10px 30px" }}>{kra.desc}</p>}
                    {kraKpis.length > 0 && (
                      <div style={{ marginLeft: 30, borderTop: `1px solid ${T.borderSoft}`, paddingTop: 10 }}>
                        {kraKpis.map(kpi => (
                          <div key={kpi.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ display: "flex", color: T.orange }}>{ico.bar}</span>
                              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{kpi.name}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
                              <span style={{ fontWeight: 700 }}>{kpi.weightage}%</span>
                              <span style={{ color: T.inkMuted }}>Target: {kpi.target}</span>
                              <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: T.kpiCream }}>{kpi.freq}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const MembersSection = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Members</h1>
        <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4, lineHeight: 1.6 }}>Manage your team — invite members, assign departments, and track active status.</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40, width: 240 }}>
            <span style={{ display: "flex", color: T.inkMuted }}>{ico.search}</span>
            <input style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontWeight: 500, fontFamily: T.font, color: T.ink }} placeholder="Search members..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} />
          </div>
          <FilterSelect value={memberDeptFilter} onChange={e => setMemberDeptFilter(e.target.value)} label="All Departments" options={memberDepts} />
          <FilterSelect value={memberStatusFilter} onChange={e => setMemberStatusFilter(e.target.value)} label="All Status" options={["active", "inactive"]} />
          {/* Group toggle */}
          <button onClick={() => setMemberGroupView(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", background: memberGroupView ? T.orangeSoft : T.raised, border: `1px solid ${memberGroupView ? T.orange : T.borderSoft}`, borderRadius: T.rmd, minHeight: 40, cursor: "pointer", color: memberGroupView ? T.orange : T.inkSoft, fontSize: 12.5, fontWeight: 600, fontFamily: T.font }}>
            {ico.layers} Group by Dept
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: T.orangeSoft, fontSize: 12, fontWeight: 700, color: T.orange }}>{filteredMembers.length} members</div>
          <Btn onClick={() => openInvite("bulk")}>Bulk Invite</Btn>
          <Btn primary onClick={() => openInvite("single")}>{ico.plus} Invite Member</Btn>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { l: "Total Members", v: allMembers.length, bg: T.kpiBlue },
          { l: "Active", v: allMembers.filter(m => m.status === "active").length, bg: T.kpiMint },
          { l: "Inactive", v: allMembers.filter(m => m.status === "inactive").length, bg: T.kpiCream },
          { l: "HODs", v: allMembers.filter(m => m.isHOD).length, bg: T.kpiLav },
        ].map((c, i) => (
          <div key={i} style={{ padding: "16px 20px", borderRadius: T.rlg, background: c.bg }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, marginBottom: 6 }}>{c.l}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.ink }}>{c.v}</div>
          </div>
        ))}
      </div>

      {/* Member list */}
      {filteredMembers.length === 0 ? (
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", textAlign: "center" }}>
          <span style={{ fontSize: 36, marginBottom: 12 }}>👥</span>
          <p style={{ fontSize: 14, fontWeight: 600, color: T.inkSoft, margin: "0 0 4px" }}>No members found</p>
          <p style={{ fontSize: 12.5, color: T.inkMuted, margin: "0 0 16px" }}>Adjust your filters or invite new team members.</p>
        </div>
      ) : memberGroupView ? (
        /* ── Grouped by department ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {Object.entries(groupedMembers).map(([dept, members]) => (
            <div key={dept}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[memberDepts.indexOf(dept) % 5], flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{dept}</span>
                <span style={{ fontSize: 12, color: T.inkMuted, fontWeight: 500 }}>{members.length} member{members.length !== 1 ? "s" : ""}</span>
                <div style={{ flex: 1, height: 1, background: T.borderSoft }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 18 }}>
                {members.map(m => <MemberCard key={m.id} m={m} />)}
              </div>
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.inkMuted, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>Unassigned</span>
                <span style={{ fontSize: 12, color: T.inkMuted }}>{ungrouped.length}</span>
                <div style={{ flex: 1, height: 1, background: T.borderSoft }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 18 }}>
                {ungrouped.map(m => <MemberCard key={m.id} m={m} />)}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── Flat list ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredMembers.map(m => <MemberCard key={m.id} m={m} />)}
        </div>
      )}
    </div>
  );

  /* ══════ JD LIST ══════ */
  const JdList = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40, width: 280 }}>
          <span style={{ display: "flex", color: T.inkMuted }}>{ico.search}</span>
          <input style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontWeight: 500, fontFamily: T.font, color: T.ink }} placeholder="Search job descriptions..." value={jdSearch} onChange={e => setJdSearch(e.target.value)} />
        </div>
        <Btn primary onClick={() => { setView("create"); setStep(0); }}>{ico.plus} Create JD</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 90px 60px 60px 120px 90px 80px", gap: 10, padding: "10px 20px", fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: ".05em" }}>
          <span>Title</span><span>Dept</span><span>Level</span><span>KRAs</span><span>KPIs</span><span>Assigned</span><span>Status</span><span>Actions</span>
        </div>
        {filteredJds.map(jd => (
          <div key={jd.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 90px 60px 60px 120px 90px 80px", gap: 10, padding: "14px 20px", background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: T.rlg, alignItems: "center" }} onMouseOver={e => e.currentTarget.style.boxShadow = T.shadow} onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
            <div><div style={{ fontSize: 13.5, fontWeight: 700 }}>{jd.title}</div><div style={{ fontSize: 11, color: T.inkMuted, marginTop: 2 }}>{jd.type} · {jd.created}</div></div>
            <span style={{ fontSize: 12, color: T.inkSoft }}>{jd.dept}</span>
            <span style={{ fontSize: 12, color: T.inkSoft }}>{jd.level}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{kraCountFor(jd.id)}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{kpiCountFor(jd.id)}</span>
            <div>{jd.assigned.length > 0 ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {jd.assigned.slice(0, 3).map((a, ai) => (
                  <div key={ai} title={a} style={{ width: 28, height: 28, borderRadius: "50%", background: [T.kpiBlue, T.kpiMint, T.kpiLav, T.kpiPeach, T.kpiCream][ai % 5], display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: T.ink, marginLeft: ai > 0 ? -6 : 0, border: `2px solid ${T.surface}`, position: "relative", zIndex: 3 - ai }}>{initials(a)}</div>
                ))}
                {jd.assigned.length > 3 && <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.borderWarm, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: T.inkSoft, marginLeft: -6, border: `2px solid ${T.surface}` }}>+{jd.assigned.length - 3}</div>}
              </div>
            ) : <span style={{ fontSize: 11, color: T.inkMuted }}>Unassigned</span>}</div>
            <StatusPill s={jd.status} />
            <div style={{ display: "flex", gap: 6, alignItems: "center", position: "relative" }}>
              <button style={aBtn} title="Actions" onClick={(e) => { e.stopPropagation(); setActionMenuJd(actionMenuJd === jd.id ? null : jd.id); }} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.moreVert}</button>
              {actionMenuJd === jd.id && (
                <div style={{ position: "absolute", top: 36, right: 38, background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, boxShadow: "0 6px 24px rgba(44,44,44,.12)", zIndex: 20, minWidth: 160, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                  <button style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.ink, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }} onMouseOver={e => e.currentTarget.style.background = T.surface} onMouseOut={e => e.currentTarget.style.background = "transparent"} onClick={() => { setActionMenuJd(null); startEditJd(jd.id); }}><span style={{ display: "flex", color: T.inkMuted }}>{ico.edit}</span>Edit</button>
                  <button style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.ink, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }} onMouseOver={e => e.currentTarget.style.background = T.surface} onMouseOut={e => e.currentTarget.style.background = "transparent"} onClick={() => { setActionMenuJd(null); setAssignModal(jd.id); }}><span style={{ display: "flex", color: T.inkMuted }}>{ico.userPlus}</span>Assign Person</button>
                  {jd.status === "draft" && <><div style={{ height: 1, background: T.borderSoft }} /><button style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.growth, display: "flex", alignItems: "center", gap: 10, transition: "background .12s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(16,140,114,.06)"} onMouseOut={e => e.currentTarget.style.background = "transparent"} onClick={() => { setActionMenuJd(null); publishJd(jd.id); }}><span style={{ display: "flex" }}>{ico.power}</span>Publish</button></>}
                </div>
              )}
              <button style={aBtn} title="View Details" onClick={() => setViewingJd(jd.id)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.eye}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ══════ JD DETAIL VIEW ══════ */
  const JdDetail = () => {
    const jd = allJds.find(j => j.id === viewingJd);
    if (!jd) return null;
    const jdKras = allKras.filter(k => k.jdId === jd.id);
    const jdKpis = allKpis.filter(p => p.jdId === jd.id);
    const totalKraWt = jdKras.reduce((s, k) => s + (k.weightage || 0), 0);
    const totalKpiWt = jdKpis.reduce((s, p) => s + (p.weightage || 0), 0);

    return (
      <div>
        {/* Back button */}
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "transparent", cursor: "pointer", color: T.inkMuted, fontSize: 12.5, fontWeight: 600, fontFamily: T.font, marginBottom: 16, padding: 0 }} onClick={() => setViewingJd(null)}>
          {ico.arrowLeft} Back to Job Descriptions
        </button>

        {/* Header card */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>{jd.title}</h2>
              <p style={{ fontSize: 13, color: T.inkSoft, margin: 0 }}>{jd.dept} · {jd.level} · {jd.type}</p>
              <p style={{ fontSize: 12, color: T.inkMuted, margin: "6px 0 0" }}>Created {jd.created}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StatusPill s={jd.status} />
              {jd.status === "draft" && <Btn primary onClick={() => publishJd(jd.id)}>{ico.power} Publish</Btn>}
              <Btn onClick={() => { startEditJd(jd.id); }}>{ico.edit} Edit</Btn>
              <Btn onClick={() => { setAssignModal(jd.id); }}>{ico.userPlus} Assign Person</Btn>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "KRAs", value: jdKras.length, bg: T.kpiBlue },
            { label: "KPIs", value: jdKpis.length, bg: T.kpiMint },
            { label: "KRA Weightage", value: totalKraWt + "%", bg: T.kpiLav },
            { label: "KPI Weightage", value: totalKpiWt + "%", bg: T.kpiCream },
          ].map((st, i) => (
            <div key={i} style={{ padding: "16px 20px", borderRadius: T.rlg, background: st.bg }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, marginBottom: 6 }}>{st.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>{st.value}</div>
            </div>
          ))}
        </div>

        {/* Assigned members */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Assigned Members</div>
          {jd.assigned.length === 0 ? (
            <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>No members assigned to this role yet.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {jd.assigned.map((name, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: T.rmd, background: T.raised, border: `1px solid ${T.borderSoft}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS[i % 5], display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: T.ink, flexShrink: 0 }}>{initials(name)}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: 11, color: T.inkMuted }}>Team Member</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KRAs & KPIs */}
        <div style={{ ...card }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>KRAs & KPIs</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}>{jdKras.length} KRAs · {jdKpis.length} KPIs</span>
          </div>
          {jdKras.length === 0 ? (
            <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>No KRAs defined for this role yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {jdKras.map((kra, i) => {
                const kraKpis = jdKpis.filter(p => p.kraId === kra.id);
                return (
                  <div key={kra.id} style={{ padding: "18px 20px", borderRadius: T.rmd, background: T.raised, border: `1px solid ${T.borderSoft}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: COLORS[i % 5] }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: COLORS[i % 5], display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{kra.title}</span>
                        <StatusPill s={kra.status} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                        <span style={{ padding: "3px 10px", borderRadius: 999, background: T.surface, fontWeight: 700 }}>{kra.weightage || 0}%</span>
                        {kra.effectiveFrom && <span style={{ color: T.inkMuted }}>{kra.effectiveFrom} → {kra.effectiveTo}</span>}
                      </div>
                    </div>
                    {kra.desc && <p style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.6, margin: "4px 0 12px 30px" }}>{kra.desc}</p>}

                    {kraKpis.length > 0 && (
                      <div style={{ marginLeft: 30, borderTop: `1px solid ${T.borderSoft}`, paddingTop: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 70px 80px 80px 110px", gap: 8, padding: "6px 0", fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: ".04em" }}>
                          <span>KPI</span><span>Wt%</span><span>Target</span><span>Unit</span><span>Freq</span><span>Update</span>
                        </div>
                        {kraKpis.map(kpi => (
                          <div key={kpi.id} style={{ display: "grid", gridTemplateColumns: "1fr 60px 70px 80px 80px 110px", gap: 8, padding: "8px 0", fontSize: 12.5, borderTop: `1px solid ${T.borderSoft}`, alignItems: "center" }}>
                            <span style={{ fontWeight: 600 }}>{kpi.name}</span>
                            <span style={{ fontWeight: 600 }}>{kpi.weightage}%</span>
                            <span style={{ color: T.inkSoft }}>{kpi.target}</span>
                            <span style={{ color: T.inkSoft }}>{kpi.unit}</span>
                            <span style={{ color: T.inkSoft }}>{kpi.freq}</span>
                            <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream }}>{kpi.updateType === "automatic" ? `Auto · ${kpi.dataSource}` : "Manual"}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {kraKpis.length === 0 && <p style={{ fontSize: 12, color: T.inkMuted, margin: "4px 0 0 30px" }}>No KPIs linked.</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ══════ EDIT JD SCREEN ══════ */
  const EditJdScreen = () => {
    const jd = allJds.find(j => j.id === editingJd);
    if (!jd) return null;
    return (
      <div>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "transparent", cursor: "pointer", color: T.inkMuted, fontSize: 12.5, fontWeight: 600, fontFamily: T.font, marginBottom: 16, padding: 0 }} onClick={cancelEditJd}>
          {ico.arrowLeft} Back to Job Descriptions
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Edit Job Description</h2>
            <p style={{ fontSize: 13, color: T.inkSoft, margin: 0 }}>Update the role details and description for <strong>{jd.title}</strong></p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatusPill s={jd.status} />
            {jd.status === "draft" && <Btn primary onClick={() => { saveEditJd(); publishJd(editingJd); }}>{ico.power} Save & Publish</Btn>}
          </div>
        </div>

        {/* Job Details Section */}
        <div style={{ ...card, marginBottom: 16 }}>
          <SH icon={ico.briefcase} title="Job Details" sub="Core identity of the role — title, department, and employment terms." />
          <div style={g2}>
            <Fld label="Job Title *"><FI value={editForm.title} onChange={e => ef("title", e.target.value)} /></Fld>
            <Fld label="Department *"><FS value={editForm.dept} onChange={e => ef("dept", e.target.value)}><option value="">Select department</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</FS></Fld>
          </div>
          <div style={g2}>
            <Fld label="Employment Type *"><FS value={editForm.type} onChange={e => ef("type", e.target.value)}><option value="">Select type</option>{EMP_TYPES.map(t => <option key={t}>{t}</option>)}</FS></Fld>
            <Fld label="Experience Level *"><FS value={editForm.level} onChange={e => ef("level", e.target.value)}><option value="">Select level</option>{EXP_LEVELS.map(l => <option key={l}>{l}</option>)}</FS></Fld>
          </div>
          <div style={g2}>
            <Fld label="Reporting To"><FI value={editForm.reportingTo} onChange={e => ef("reportingTo", e.target.value)} /></Fld>
            <Fld label="Work Location"><FI value={editForm.location} onChange={e => ef("location", e.target.value)} /></Fld>
          </div>
          <div style={g2}>
            <Fld label="Salary Range — Min (₹)"><FI type="number" value={editForm.salaryMin} onChange={e => ef("salaryMin", e.target.value)} /></Fld>
            <Fld label="Salary Range — Max (₹)"><FI type="number" value={editForm.salaryMax} onChange={e => ef("salaryMax", e.target.value)} /></Fld>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ ...card, marginBottom: 16 }}>
          <SH icon={ico.doc} title="Job Description" sub="Role summary, responsibilities, qualifications, and skills." />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Fld label="Role Summary *"><FT value={editForm.summary} onChange={e => ef("summary", e.target.value)} style={{ minHeight: 80 }} /></Fld>
            <Fld label="Key Responsibilities *"><FT value={editForm.responsibilities} onChange={e => ef("responsibilities", e.target.value)} style={{ minHeight: 120 }} /></Fld>
            <div style={g2}>
              <Fld label="Required Qualifications"><FT value={editForm.qualifications} onChange={e => ef("qualifications", e.target.value)} /></Fld>
              <Fld label="Required Skills"><FT value={editForm.skills} onChange={e => ef("skills", e.target.value)} /></Fld>
            </div>
            <Fld label="Nice to Have"><FT value={editForm.niceToHave} onChange={e => ef("niceToHave", e.target.value)} style={{ minHeight: 70 }} /></Fld>
          </div>
        </div>

        {/* KRAs & KPIs Summary (read-only) */}
        <div style={{ ...card, marginBottom: 16 }}>
          <SH icon={ico.goals} title="Linked KRAs & KPIs" sub="These are managed from the KRA and KPI tabs. Shown here for reference." />
          {allKras.filter(k => k.jdId === editingJd).length === 0 ? (
            <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>No KRAs linked to this role yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allKras.filter(k => k.jdId === editingJd).map((kra, i) => {
                const kraKpis = allKpis.filter(p => p.kraId === kra.id);
                return (
                  <div key={kra.id} style={{ padding: "14px 18px", borderRadius: T.rmd, background: T.raised, border: `1px solid ${T.borderSoft}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: COLORS[i % 5] }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: COLORS[i % 5], display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{kra.title}</span>
                        <StatusPill s={kra.status} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
                        <span style={{ padding: "2px 8px", borderRadius: 999, background: T.surface, fontWeight: 700 }}>{kra.weightage || 0}%</span>
                        <span style={{ color: T.inkMuted }}>{kraKpis.length} KPI{kraKpis.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, paddingTop: 20, borderTop: `1px solid ${T.borderSoft}` }}>
          <Btn onClick={cancelEditJd}>Cancel</Btn>
          <Btn primary onClick={saveEditJd}><I d="M20 6L9 17l-5-5" size={14} stroke="#fff" /> Save Changes</Btn>
        </div>
      </div>
    );
  };

  /* ══════ KRA LIST ══════ */

  const KraList = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40, width: 240 }}>
            <span style={{ display: "flex", color: T.inkMuted }}>{ico.search}</span>
            <input style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontWeight: 500, fontFamily: T.font, color: T.ink }} placeholder="Search KRAs..." value={kraSearch} onChange={e => setKraSearch(e.target.value)} />
          </div>
          <FilterSelect value={kraDeptFilter} onChange={e => setKraDeptFilter(e.target.value)} label="All Departments" options={uniqueDepts} />
          <FilterSelect value={kraRoleFilter} onChange={e => setKraRoleFilter(e.target.value)} label="All Roles" options={uniqueRoles} />
          <FilterSelect value={kraMemberFilter} onChange={e => setKraMemberFilter(e.target.value)} label="All Members" options={uniqueMembers} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: T.orangeSoft, fontSize: 12, fontWeight: 700, color: T.orange }}>{filteredKras.length} KRAs</div>
          {/* Card / List View toggle */}
          <div style={{ display: "flex", border: `1px solid ${T.borderSoft}`, borderRadius: T.rsm, overflow: "hidden" }}>
            <button style={{ ...gBtn, width: 36, height: 36, borderRadius: 0, background: kraViewMode === "list" ? T.orangeSoft : T.raised, color: kraViewMode === "list" ? T.orange : T.inkMuted, border: "none" }} title="List View" onClick={() => setKraViewMode("list")}>{ico.listView}</button>
            <button style={{ ...gBtn, width: 36, height: 36, borderRadius: 0, background: kraViewMode === "card" ? T.orangeSoft : T.raised, color: kraViewMode === "card" ? T.orange : T.inkMuted, border: "none", borderLeft: `1px solid ${T.borderSoft}` }} title="Card View" onClick={() => setKraViewMode("card")}>{ico.grid}</button>
          </div>
          <Btn primary onClick={() => setShowAddKra(true)}>{ico.plus} Add KRA</Btn>
        </div>
      </div>

      {/* Card View */}
      {kraViewMode === "card" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {filteredKras.map((kra, i) => {
            const linked = allKpis.filter(p => p.kraId === kra.id);
            return (
              <div key={kra.id} style={{ ...card, position: "relative", overflow: "hidden" }} onMouseOver={e => e.currentTarget.style.boxShadow = T.shadow} onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: COLORS[i % 5] }} />
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: COLORS[i % 5], display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{kra.title}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={aBtn} title="Edit" onClick={() => openEditKra(kra)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.edit}</button>
                    <button style={aBtn} title={kra.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKraStatus(kra.id)} onMouseOver={e => { e.currentTarget.style.background = kra.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kra.status === "active" ? T.danger : T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.power}</button>
                    <button style={aBtn} title="Assign Person" onClick={() => setAssignKraModal(kra.id)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.userPlus}</button>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: T.inkMuted, marginBottom: 8 }}>{jdTitle(kra.jdId)}</div>
                {kra.desc && <p style={{ fontSize: 12, color: T.inkSoft, lineHeight: 1.5, margin: "0 0 10px" }}>{kra.desc}</p>}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 999, background: T.surface, fontSize: 11, fontWeight: 700 }}>{kra.weightage || 0}%</span>
                  <span style={{ fontSize: 11, color: T.inkSoft }}>{linked.length} KPIs</span>
                  <StatusPill s={kra.status} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredKras.map((kra, i) => {
            const linked = allKpis.filter(p => p.kraId === kra.id);
            const isOpen = expandedKra === kra.id;
            return (
              <div key={kra.id} style={{ background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: T.rlg, overflow: "hidden" }} onMouseOver={e => e.currentTarget.style.boxShadow = T.shadow} onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
                <div style={{ display: "grid", gridTemplateColumns: "4px 1fr 70px 130px 100px 80px 120px 36px", alignItems: "center", gap: 12, padding: "14px 16px 14px 0", cursor: "pointer" }} onClick={() => setExpandedKra(isOpen ? null : kra.id)}>
                  <div style={{ width: 4, height: "100%", background: COLORS[i % 5], borderRadius: "16px 0 0 16px", alignSelf: "stretch" }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{kra.title}</div>
                    <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 2 }}>{jdTitle(kra.jdId)} {kra.effectiveFrom && <span>· {kra.effectiveFrom} → {kra.effectiveTo}</span>}</div>
                  </div>
                  <div style={{ padding: "4px 10px", borderRadius: 999, background: T.surface, fontSize: 12, fontWeight: 700, color: T.ink, textAlign: "center" }}>{kra.weightage || 0}%</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ display: "flex", color: T.inkMuted }}>{ico.link}</span><span style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}>{linked.length} KPIs</span></div>
                  <StatusPill s={kra.status} />
                  {/* Actions */}
                  <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button style={aBtn} title="Edit" onClick={() => openEditKra(kra)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.edit}</button>
                    <button style={aBtn} title={kra.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKraStatus(kra.id)} onMouseOver={e => { e.currentTarget.style.background = kra.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kra.status === "active" ? T.danger : T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.power}</button>
                    <button style={aBtn} title="Assign Person" onClick={() => setAssignKraModal(kra.id)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.userPlus}</button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", color: T.inkMuted }}>{ico.chevDown}</div>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 20px 16px", borderTop: `1px solid ${T.borderSoft}` }}>
                    {kra.desc && <p style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.6, margin: "12px 0 14px 4px" }}>{kra.desc}</p>}
                    {linked.length > 0 && linked.map(kpi => (
                      <div key={kpi.id} style={{ display: "grid", gridTemplateColumns: "1fr 70px 80px 90px 90px 100px", gap: 8, padding: "10px 8px", fontSize: 12, borderTop: `1px solid ${T.borderSoft}`, alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>{kpi.name}</span>
                        <span style={{ color: T.inkMuted }}>{kpi.weightage}%</span>
                        <span style={{ color: T.inkMuted }}>T: {kpi.target}</span>
                        <span style={{ color: T.inkMuted }}>{kpi.freq}</span>
                        <span style={{ color: T.inkMuted }}>{kpi.unit}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream }}>{kpi.updateType === "automatic" ? `Auto · ${kpi.dataSource}` : "Manual"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ══════ KPI LIST ══════ */
  const KpiList = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40, width: 240 }}>
            <span style={{ display: "flex", color: T.inkMuted }}>{ico.search}</span>
            <input style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontWeight: 500, fontFamily: T.font, color: T.ink }} placeholder="Search KPIs..." value={kpiSearch} onChange={e => setKpiSearch(e.target.value)} />
          </div>
          <FilterSelect value={kpiDeptFilter} onChange={e => setKpiDeptFilter(e.target.value)} label="All Departments" options={uniqueDepts} />
          <FilterSelect value={kpiRoleFilter} onChange={e => setKpiRoleFilter(e.target.value)} label="All Roles" options={uniqueRoles} />
          <FilterSelect value={kpiMemberFilter} onChange={e => setKpiMemberFilter(e.target.value)} label="All Members" options={uniqueMembers} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: T.orangeSoft, fontSize: 12, fontWeight: 700, color: T.orange }}>{filteredKpis.length} KPIs</div>
          {/* Card / List View toggle */}
          <div style={{ display: "flex", border: `1px solid ${T.borderSoft}`, borderRadius: T.rsm, overflow: "hidden" }}>
            <button style={{ ...gBtn, width: 36, height: 36, borderRadius: 0, background: kpiViewMode === "list" ? T.orangeSoft : T.raised, color: kpiViewMode === "list" ? T.orange : T.inkMuted, border: "none" }} title="List View" onClick={() => setKpiViewMode("list")}>{ico.listView}</button>
            <button style={{ ...gBtn, width: 36, height: 36, borderRadius: 0, background: kpiViewMode === "card" ? T.orangeSoft : T.raised, color: kpiViewMode === "card" ? T.orange : T.inkMuted, border: "none", borderLeft: `1px solid ${T.borderSoft}` }} title="Card View" onClick={() => setKpiViewMode("card")}>{ico.grid}</button>
          </div>
          <Btn primary onClick={() => setShowAddKpi(true)}>{ico.plus} Add KPI</Btn>
        </div>
      </div>

      {/* Card View */}
      {kpiViewMode === "card" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {filteredKpis.map((kpi, i) => (
            <div key={kpi.id} style={{ ...card, position: "relative", overflow: "hidden" }} onMouseOver={e => e.currentTarget.style.boxShadow = T.shadow} onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: COLORS[i % 5] }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, flex: 1 }}>{kpi.name}</span>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button style={aBtn} title="Edit" onClick={() => openEditKpi(kpi)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.edit}</button>
                  <button style={aBtn} title={kpi.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKpiStatus(kpi.id)} onMouseOver={e => { e.currentTarget.style.background = kpi.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kpi.status === "active" ? T.danger : T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.power}</button>
                  <button style={aBtn} title="Assign Person" onClick={() => setAssignKpiModal(kpi.id)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.userPlus}</button>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 4 }}>{jdTitle(kpi.jdId)} · {kraName(kpi.kraId)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ padding: "3px 10px", borderRadius: 999, background: T.surface, fontSize: 11, fontWeight: 700 }}>{kpi.weightage}%</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.ink }}>T: {kpi.target}</span>
                <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: T.kpiLav }}>{kpi.freq}</span>
                <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream }}>{kpi.updateType === "automatic" ? `Auto` : "Manual"}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List / Table View */
        <div style={{ background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: T.rlg, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 50px 60px 70px 90px 100px", gap: 10, padding: "12px 20px", fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: `1px solid ${T.borderSoft}` }}>
            <span>KPI Name</span><span>Job Desc</span><span>Linked KRA</span><span>Wt%</span><span>Target</span><span>Freq</span><span>Update</span><span>Actions</span>
          </div>
          {filteredKpis.map((kpi, i) => (
            <div key={kpi.id} style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 50px 60px 70px 90px 100px", gap: 10, padding: "12px 20px", fontSize: 12.5, borderBottom: i < filteredKpis.length - 1 ? `1px solid ${T.borderSoft}` : "none", alignItems: "center" }} onMouseOver={e => e.currentTarget.style.background = T.warm} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
              <span style={{ fontWeight: 600 }}>{kpi.name}</span>
              <span style={{ color: T.inkSoft, fontSize: 11.5 }}>{jdTitle(kpi.jdId)}</span>
              <span style={{ color: T.inkSoft, fontSize: 11.5 }}>{kraName(kpi.kraId)}</span>
              <span style={{ fontWeight: 600 }}>{kpi.weightage}%</span>
              <span style={{ fontWeight: 600 }}>{kpi.target}</span>
              <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: T.kpiLav }}>{kpi.freq}</span>
              <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream }}>{kpi.updateType === "automatic" ? `Auto · ${kpi.dataSource}` : "Manual"}</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button style={aBtn} title="Edit" onClick={() => openEditKpi(kpi)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.edit}</button>
                <button style={aBtn} title={kpi.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKpiStatus(kpi.id)} onMouseOver={e => { e.currentTarget.style.background = kpi.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kpi.status === "active" ? T.danger : T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.power}</button>
                <button style={aBtn} title="Assign Person" onClick={() => setAssignKpiModal(kpi.id)} onMouseOver={e => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.userPlus}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", fontFamily: T.font, background: T.page, color: T.ink, fontSize: 14, WebkitFontSmoothing: "antialiased" }} onClick={() => { actionMenuJd && setActionMenuJd(null); actionMenuMember && setActionMenuMember(null); }}>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", background: T.page, minWidth: 0 }}>

        <div style={{ flex: 1, padding: "28px 32px 48px" }}>
          {/* ── Organisation Section ── */}
          {activeNav === "organisation" && <OrgSection />}

          {/* ── Members Section ── */}
          {activeNav === "members" && (viewingMember ? <MemberDetail /> : <MembersSection />)}

          {/* ── Jobs Section ── */}
          {activeNav === "jobs" && (
            <>
              {!viewingJd && !editingJd && (
              <div style={{ marginBottom: 24 }}>
                {view === "create" && <button style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "transparent", cursor: "pointer", color: T.inkMuted, fontSize: 12.5, fontWeight: 600, fontFamily: T.font, marginBottom: 8, padding: 0 }} onClick={resetCreate}>{ico.arrowLeft} Back to all JDs</button>}
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{view === "create" ? "Create Job Description" : jobTab === "descriptions" ? "Jobs" : jobTab === "kra" ? "Key Result Areas" : jobTab === "kpi" ? "Key Performance Indicators" : jobTab === "logs" ? "Activity Logs" : "Settings"}</h1>
                <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4, fontWeight: 400, lineHeight: 1.6 }}>{view === "create" ? "Define the role, describe the position, and set measurable outcomes." : jobTab === "descriptions" ? "Manage job descriptions, KRAs, and KPIs for every role." : jobTab === "kra" ? "All KRAs across your organisation. Expand any row to see linked KPIs." : jobTab === "kpi" ? "A consolidated view of every KPI across all roles." : jobTab === "logs" ? "Chronological audit trail of all KRA and KPI activities." : "Configure organisation-wide KPI settings and units."}</p>
              </div>
              )}

              {view === "list" && !viewingJd && !editingJd && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: 4, background: T.raised, borderRadius: T.rmd, border: `1px solid ${T.borderSoft}`, width: "fit-content", marginBottom: 28 }}>
                  {[{ key: "descriptions", label: "Job Descriptions" }, { key: "kra", label: "KRAs" }, { key: "kpi", label: "KPIs" }, { key: "logs", label: "Logs" }, { key: "settings", label: "Settings" }].map(t => <button key={t.key} style={pill(jobTab === t.key)} onClick={() => { setJobTab(t.key); setViewingJd(null); }}>{t.label}</button>)}
                </div>
              )}

              {view === "list" && jobTab === "descriptions" && (editingJd ? <EditJdScreen /> : viewingJd ? <JdDetail /> : <JdList />)}
              {view === "list" && jobTab === "kra" && <KraList />}
              {view === "list" && jobTab === "kpi" && <KpiList />}

              {/* ── Logs Tab ── */}
              {view === "list" && jobTab === "logs" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "flex", color: T.orange }}>{ico.clock}</span>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>Activity Logs</span>
                      <div style={{ padding: "4px 12px", borderRadius: 999, background: T.orangeSoft, fontSize: 11, fontWeight: 700, color: T.orange }}>{activityLogs.length} entries</div>
                    </div>
                  </div>
                  <div style={{ background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: T.rlg, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "130px 70px 110px 1fr 1fr 110px", gap: 10, padding: "12px 20px", fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: `1px solid ${T.borderSoft}` }}>
                      <span>Date & Time</span><span>Action</span><span>Entity</span><span>Name</span><span>Detail</span><span>By</span>
                    </div>
                    {activityLogs.map((log, i) => {
                      const actionColors = { create: T.growth, edit: T.infoBlue, assign: T.lavender, activate: T.growth, deactivate: T.warning, progress: T.orange, achievement: T.success };
                      const actionLabels = { create: "Created", edit: "Edited", assign: "Assigned", activate: "Activated", deactivate: "Deactivated", progress: "Progress", achievement: "Achieved" };
                      return (
                        <div key={log.id} style={{ display: "grid", gridTemplateColumns: "130px 70px 110px 1fr 1fr 110px", gap: 10, padding: "12px 20px", fontSize: 12.5, borderBottom: i < activityLogs.length - 1 ? `1px solid ${T.borderSoft}` : "none", alignItems: "center" }} onMouseOver={e => e.currentTarget.style.background = T.warm} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                          <span style={{ fontSize: 11.5, color: T.inkMuted, fontFamily: "monospace" }}>{log.timestamp}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, background: `${actionColors[log.type] || T.kpiCream}30`, color: actionColors[log.type] || T.ink }}>{actionLabels[log.type] || log.type}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: log.entity === "KRA" ? T.kpiBlue : log.entity === "KPI" ? T.kpiMint : T.kpiLav }}>{log.entity}</span>
                          <span style={{ fontWeight: 600, fontSize: 12 }}>{log.name}</span>
                          <span style={{ color: T.inkSoft, fontSize: 12 }}>{log.detail}</span>
                          <span style={{ fontSize: 12, color: T.inkSoft }}>{log.user}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Settings Tab — KPI Units Configuration ── */}
              {view === "list" && jobTab === "settings" && (
                <div>
                  <div style={{ ...card, maxWidth: 640 }}>
                    <SH icon={ico.wrench} title="KPI Units Configuration" sub="Define organisation-wide units for measuring KPIs. These units will appear in all KPI creation forms." />
                    <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                      <FI placeholder="e.g. Tickets, NPS Score, Tasks" value={newUnitInput} onChange={e => setNewUnitInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustomUnit()} style={{ flex: 1 }} />
                      <Btn primary onClick={addCustomUnit}>{ico.plus} Add Unit</Btn>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {customUnits.map((unit, i) => {
                        const isDefault = KPI_UNITS.includes(unit);
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd }} onMouseOver={e => e.currentTarget.style.boxShadow = T.shadow} onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{unit}</span>
                              {isDefault && <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: T.kpiBlue, color: T.ink }}>Default</span>}
                            </div>
                            {!isDefault && (
                              <button style={aBtn} title="Remove" onClick={() => removeCustomUnit(unit)} onMouseOver={e => { e.currentTarget.style.background = "rgba(228,145,145,.1)"; e.currentTarget.style.color = T.danger; }} onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}>{ico.trash}</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {view === "create" && (
                <>
                  <Stepper />
              {step === 0 && <StepDetails />}
              {step === 1 && <StepDesc />}
              {step === 2 && <StepKra />}
              {step === 3 && <StepKpi />}
              {step === 4 && <StepReview />}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.borderSoft}` }}>
                <div>{step > 0 && <Btn onClick={() => setStep(s => s - 1)}>{ico.arrowLeft} Previous</Btn>}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn onClick={resetCreate}>Cancel</Btn>
                  {step < 4 ? <Btn primary disabled={!canNext()} onClick={() => setStep(s => s + 1)}>Continue <I d="M9 18l6-6-6-6" size={14} stroke="#fff" /></Btn> : <Btn primary onClick={saveJd}><I d="M20 6L9 17l-5-5" size={14} stroke="#fff" /> Save</Btn>}
                </div>
              </div>
            </>
          )}
            </>
          )}

          {/* ── Placeholder screens ── */}
          {!["organisation", "members", "jobs"].includes(activeNav) && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}</h1>
                <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4 }}>This section is coming soon.</p>
              </div>
              <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 20px", textAlign: "center" }}>
                <span style={{ fontSize: 40, marginBottom: 12 }}>{activeNav === "dashboard" ? "📊" : activeNav === "plan" ? "📋" : activeNav === "goals" ? "🎯" : activeNav === "meetings" ? "👥" : activeNav === "members" ? "🧑‍🤝‍🧑" : activeNav === "sops" ? "📄" : "🌐"}</span>
                <p style={{ fontSize: 14, fontWeight: 600, color: T.inkSoft, margin: "0 0 4px" }}>{activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} module</p>
                <p style={{ fontSize: 12.5, color: T.inkMuted, margin: 0 }}>We're building this section. It will be available soon.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Dept Modal ── */}
      {showDeptModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setShowDeptModal(false)}>
          <div style={{ width: 480, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>{editingDept ? "Edit Department" : "Add New Department"}</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>{editingDept ? "Update department details." : "Fill in the details to create a new department."}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Fld label="Department Name *"><FI placeholder="e.g. Product & Design" value={deptForm.name} onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))} /></Fld>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Department Head"><FI placeholder="e.g. Priya Sharma" value={deptForm.head} onChange={e => setDeptForm(f => ({ ...f, head: e.target.value }))} /></Fld>
                <Fld label="Team Size"><FI type="number" placeholder="e.g. 12" value={deptForm.members} onChange={e => setDeptForm(f => ({ ...f, members: e.target.value }))} /></Fld>
              </div>
              <Fld label="Description"><FT placeholder="What does this department handle?" value={deptForm.description} onChange={e => setDeptForm(f => ({ ...f, description: e.target.value }))} style={{ minHeight: 68 }} /></Fld>
              <Fld label="Status"><FS value={deptForm.status} onChange={e => setDeptForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></FS></Fld>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Btn onClick={() => setShowDeptModal(false)}>Cancel</Btn><Btn primary onClick={saveDept}>{editingDept ? "Update" : "Create Department"}</Btn></div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setAssignModal(null)}>
          <div style={{ width: 420, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Assign Member</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>Add a team member for performance tracking.</p>
            <Fld label="Member Name"><FI placeholder="e.g. Priya Sharma" value={assignName} onChange={e => setAssignName(e.target.value)} /></Fld>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}><Btn onClick={() => setAssignModal(null)}>Cancel</Btn><Btn primary onClick={assignUser}>Assign</Btn></div>
          </div>
        </div>
      )}

      {/* Add KRA Modal */}
      {showAddKra && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setShowAddKra(false)}>
          <div style={{ width: 520, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Add New KRA</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>Link a Key Result Area to an existing job description.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Job Description *"><FS value={newKra.jdId} onChange={e => setNewKra(f => ({ ...f, jdId: e.target.value }))}><option value="">Select JD</option>{allJds.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</FS></Fld>
                <Fld label="Status"><FS value={newKra.status} onChange={e => setNewKra(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></FS></Fld>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="KRA Name *"><FI placeholder="e.g. Revenue Generation" value={newKra.title} onChange={e => setNewKra(f => ({ ...f, title: e.target.value }))} /></Fld>
                <Fld label="KRA Weightage (%)"><FI type="number" placeholder="e.g. 30" value={newKra.weightage} onChange={e => setNewKra(f => ({ ...f, weightage: e.target.value }))} /></Fld>
              </div>
              <Fld label="Assignee Person">
                <FS value={newKra.assignee || ""} onChange={e => setNewKra(f => ({ ...f, assignee: e.target.value }))}>
                  <option value="">Select assignee</option>
                  {allMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </FS>
              </Fld>
              <Fld label="Description"><FT placeholder="What does this KRA measure?" value={newKra.desc} onChange={e => setNewKra(f => ({ ...f, desc: e.target.value }))} style={{ minHeight: 68 }} /></Fld>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Effective From"><FI type="date" value={newKra.effectiveFrom} onChange={e => setNewKra(f => ({ ...f, effectiveFrom: e.target.value }))} /></Fld>
                <Fld label="Effective To"><FI type="date" value={newKra.effectiveTo} onChange={e => setNewKra(f => ({ ...f, effectiveTo: e.target.value }))} /></Fld>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Btn onClick={() => setShowAddKra(false)}>Cancel</Btn><Btn primary onClick={saveNewKra}>Submit</Btn></div>
          </div>
        </div>
      )}

      {/* Add KPI Modal */}
      {showAddKpi && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setShowAddKpi(false)}>
          <div style={{ width: 560, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)", maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Add New KPI</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>Define a measurable indicator and link it to a KRA.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Job Description *"><FS value={newKpi.jdId} onChange={e => setNewKpi(f => ({ ...f, jdId: e.target.value, kraId: "" }))}><option value="">Select JD</option>{allJds.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</FS></Fld>
                <Fld label="Linked KRA *"><FS value={newKpi.kraId} onChange={e => setNewKpi(f => ({ ...f, kraId: e.target.value }))}><option value="">Select KRA</option>{krasForJd(newKpi.jdId).map(k => <option key={k.id} value={k.id}>{k.title}</option>)}</FS></Fld>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Fld label="KPI Name *"><FI placeholder="e.g. Revenue closed" value={newKpi.name} onChange={e => setNewKpi(f => ({ ...f, name: e.target.value }))} /></Fld>
                <Fld label="KPI Unit"><FS value={newKpi.unit} onChange={e => setNewKpi(f => ({ ...f, unit: e.target.value }))}><option value="">Select</option>{KPI_UNITS.map(u => <option key={u}>{u}</option>)}</FS></Fld>
                <Fld label="KPI Weightage (%)"><FI type="number" placeholder="e.g. 15" value={newKpi.weightage} onChange={e => setNewKpi(f => ({ ...f, weightage: e.target.value }))} /></Fld>
              </div>
              <Fld label="Assignee Person">
                <FS value={newKpi.assignee || ""} onChange={e => setNewKpi(f => ({ ...f, assignee: e.target.value }))}>
                  <option value="">Select assignee</option>
                  {allMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </FS>
              </Fld>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Target Value *"><FI placeholder="e.g. 95" value={newKpi.target} onChange={e => setNewKpi(f => ({ ...f, target: e.target.value }))} /></Fld>
                <Fld label="Target Frequency"><FS value={newKpi.freq} onChange={e => setNewKpi(f => ({ ...f, freq: e.target.value }))}><option value="">Select</option>{TARGET_FREQ.map(fr => <option key={fr}>{fr}</option>)}</FS></Fld>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Update Type">
                  <FS value={newKpi.updateType} onChange={e => setNewKpi(f => ({ ...f, updateType: e.target.value, dataSource: e.target.value === "manual" ? "" : f.dataSource }))}>
                    <option value="manual">Manual Entry</option>
                    <option value="automatic">Automatic</option>
                  </FS>
                </Fld>
                <Fld label="Measurement Type" hint={newKpi.measurementType === "negative" ? "Missing target deducts points" : "Missing target doesn't deduct"}>
                  <FS value={newKpi.measurementType || "positive"} onChange={e => setNewKpi(f => ({ ...f, measurementType: e.target.value }))}>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                  </FS>
                </Fld>
              </div>
              {newKpi.updateType === "automatic" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Fld label="Data Source">
                    <FS value={newKpi.dataSource} onChange={e => setNewKpi(f => ({ ...f, dataSource: e.target.value, module: "" }))}>
                      <option value="">Select data source</option>
                      {DATA_SOURCES.map(ds => <option key={ds}>{ds}</option>)}
                    </FS>
                  </Fld>
                  {newKpi.dataSource && (
                    <Fld label="Module">
                      <FS value={newKpi.module} onChange={e => setNewKpi(f => ({ ...f, module: e.target.value }))}>
                        <option value="">Select module</option>
                        {(MODULES_BY_SOURCE[newKpi.dataSource] || []).map(m => <option key={m}>{m}</option>)}
                      </FS>
                    </Fld>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Btn onClick={() => setShowAddKpi(false)}>Cancel</Btn><Btn primary onClick={saveNewKpi}>Submit</Btn></div>
          </div>
        </div>
      )}

      {/* ── Invite Member Modal ── */}
      {showInviteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setShowInviteModal(false)}>
          <div style={{ width: 580, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)", maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>{inviteMode === "bulk" ? "Bulk Invite Members" : "Invite Member"}</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>{inviteMode === "bulk" ? "Add multiple team members at once. Fill in their details below." : "Send an invite to a new team member."}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {inviteRows.map((row, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-end", gap: 10, padding: inviteMode === "bulk" ? "14px 16px" : 0, background: inviteMode === "bulk" ? T.surface : "transparent", borderRadius: T.rmd, border: inviteMode === "bulk" ? `1px solid ${T.borderSoft}` : "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, flex: 1 }}>
                    <Fld label="Full Name *"><FI placeholder="e.g. Priya Sharma" value={row.name} onChange={e => updateInviteRow(idx, "name", e.target.value)} /></Fld>
                    <Fld label="Email Address *"><FI type="email" placeholder="e.g. priya@company.com" value={row.email} onChange={e => updateInviteRow(idx, "email", e.target.value)} /></Fld>
                    <Fld label="Department"><FS value={row.department} onChange={e => updateInviteRow(idx, "department", e.target.value)}><option value="">Select (optional)</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</FS></Fld>
                  </div>
                  {inviteMode === "bulk" && inviteRows.length > 1 && (
                    <button style={{ ...gBtn, marginBottom: 6 }} onClick={() => removeInviteRow(idx)} onMouseOver={e => { e.currentTarget.style.color = T.danger; }} onMouseOut={e => { e.currentTarget.style.color = T.inkMuted; }}>{ico.trash}</button>
                  )}
                </div>
              ))}
              {inviteMode === "bulk" && (
                <button style={dashedBtn} onClick={addInviteRow}>{ico.plus} Add Another Member</button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22 }}>
              <span style={{ fontSize: 12, color: T.inkMuted }}>{inviteRows.filter(r => r.name && r.email).length} valid invite{inviteRows.filter(r => r.name && r.email).length !== 1 ? "s" : ""} ready</span>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={() => setShowInviteModal(false)}>Cancel</Btn>
                <Btn primary onClick={sendInvites}>Send Invite{inviteRows.filter(r => r.name && r.email).length > 1 ? "s" : ""}</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Member Modal ── */}
      {editingMember && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setEditingMember(null)}>
          <div style={{ width: 480, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Edit Member</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>Update member details and role assignments.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Full Name *"><FI value={editMemberForm.name} onChange={e => setEditMemberForm(f => ({ ...f, name: e.target.value }))} /></Fld>
                <Fld label="Email Address *"><FI type="email" value={editMemberForm.email} onChange={e => setEditMemberForm(f => ({ ...f, email: e.target.value }))} /></Fld>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Department"><FS value={editMemberForm.department} onChange={e => setEditMemberForm(f => ({ ...f, department: e.target.value }))}><option value="">Select department</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</FS></Fld>
                <Fld label="Mark as HOD">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, padding: "0 14px", border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, background: T.raised, cursor: "pointer" }} onClick={() => setEditMemberForm(f => ({ ...f, isHOD: !f.isHOD }))}>
                    <div style={{ width: 20, height: 20, borderRadius: T.rxs, border: `2px solid ${editMemberForm.isHOD ? T.orange : T.borderWarm}`, background: editMemberForm.isHOD ? T.orange : "transparent", display: "grid", placeItems: "center", transition: "all .16s" }}>
                      {editMemberForm.isHOD && <I d="M20 6L9 17l-5-5" size={12} stroke="#fff" />}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>Head of Department</span>
                  </div>
                </Fld>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Btn onClick={() => setEditingMember(null)}>Cancel</Btn><Btn primary onClick={saveEditMember}>Save Changes</Btn></div>
          </div>
        </div>
      )}

      {/* ── Edit KRA Modal ── */}
      {editingKraId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setEditingKraId(null)}>
          <div style={{ width: 520, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Edit KRA</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>Update the Key Result Area details.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="KRA Name *"><FI value={editKraForm.title || ""} onChange={e => setEditKraForm(f => ({ ...f, title: e.target.value }))} /></Fld>
                <Fld label="KRA Weightage (%)"><FI type="number" value={editKraForm.weightage || ""} onChange={e => setEditKraForm(f => ({ ...f, weightage: e.target.value }))} /></Fld>
              </div>
              <Fld label="Description"><FT value={editKraForm.desc || ""} onChange={e => setEditKraForm(f => ({ ...f, desc: e.target.value }))} style={{ minHeight: 68 }} /></Fld>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Effective From"><FI type="date" value={editKraForm.effectiveFrom || ""} onChange={e => setEditKraForm(f => ({ ...f, effectiveFrom: e.target.value }))} /></Fld>
                <Fld label="Effective To"><FI type="date" value={editKraForm.effectiveTo || ""} onChange={e => setEditKraForm(f => ({ ...f, effectiveTo: e.target.value }))} /></Fld>
              </div>
              <Fld label="Status"><FS value={editKraForm.status || "active"} onChange={e => setEditKraForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></FS></Fld>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Btn onClick={() => setEditingKraId(null)}>Cancel</Btn><Btn primary onClick={saveEditKra}>Save Changes</Btn></div>
          </div>
        </div>
      )}

      {/* ── Edit KPI Modal ── */}
      {editingKpiId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setEditingKpiId(null)}>
          <div style={{ width: 560, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)", maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Edit KPI</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>Update the Key Performance Indicator details.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Fld label="KPI Name *"><FI value={editKpiForm.name || ""} onChange={e => setEditKpiForm(f => ({ ...f, name: e.target.value }))} /></Fld>
                <Fld label="KPI Unit"><FS value={editKpiForm.unit || ""} onChange={e => setEditKpiForm(f => ({ ...f, unit: e.target.value }))}><option value="">Select</option>{customUnits.map(u => <option key={u}>{u}</option>)}</FS></Fld>
                <Fld label="KPI Weightage (%)"><FI type="number" value={editKpiForm.weightage || ""} onChange={e => setEditKpiForm(f => ({ ...f, weightage: e.target.value }))} /></Fld>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fld label="Target Value *"><FI value={editKpiForm.target || ""} onChange={e => setEditKpiForm(f => ({ ...f, target: e.target.value }))} /></Fld>
                <Fld label="Target Frequency"><FS value={editKpiForm.freq || ""} onChange={e => setEditKpiForm(f => ({ ...f, freq: e.target.value }))}><option value="">Select</option>{TARGET_FREQ.map(fr => <option key={fr}>{fr}</option>)}</FS></Fld>
              </div>
              <Fld label="Update Type">
                <FS value={editKpiForm.updateType || "manual"} onChange={e => setEditKpiForm(f => ({ ...f, updateType: e.target.value }))}>
                  <option value="manual">Manual Entry</option>
                  <option value="automatic">Automatic</option>
                </FS>
              </Fld>
              {editKpiForm.updateType === "automatic" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Fld label="Data Source"><FS value={editKpiForm.dataSource || ""} onChange={e => setEditKpiForm(f => ({ ...f, dataSource: e.target.value, module: "" }))}><option value="">Select data source</option>{DATA_SOURCES.map(ds => <option key={ds}>{ds}</option>)}</FS></Fld>
                  {editKpiForm.dataSource && <Fld label="Module"><FS value={editKpiForm.module || ""} onChange={e => setEditKpiForm(f => ({ ...f, module: e.target.value }))}><option value="">Select module</option>{(MODULES_BY_SOURCE[editKpiForm.dataSource] || []).map(m => <option key={m}>{m}</option>)}</FS></Fld>}
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Btn onClick={() => setEditingKpiId(null)}>Cancel</Btn><Btn primary onClick={saveEditKpi}>Save Changes</Btn></div>
          </div>
        </div>
      )}

      {/* ── Assign to KRA Modal ── */}
      {assignKraModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setAssignKraModal(null)}>
          <div style={{ width: 420, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Assign Person to KRA</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>Assign a team member to this Key Result Area.</p>
            <Fld label="Member Name"><FI placeholder="e.g. Priya Sharma" value={assignKraName} onChange={e => setAssignKraName(e.target.value)} /></Fld>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}><Btn onClick={() => setAssignKraModal(null)}>Cancel</Btn><Btn primary onClick={assignToKra}>Assign</Btn></div>
          </div>
        </div>
      )}

      {/* ── Assign to KPI Modal ── */}
      {assignKpiModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => setAssignKpiModal(null)}>
          <div style={{ width: 420, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Assign Person to KPI</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>Assign a team member to this Key Performance Indicator.</p>
            <Fld label="Member Name"><FI placeholder="e.g. Priya Sharma" value={assignKpiName} onChange={e => setAssignKpiName(e.target.value)} /></Fld>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}><Btn onClick={() => setAssignKpiModal(null)}>Cancel</Btn><Btn primary onClick={assignToKpi}>Assign</Btn></div>
          </div>
        </div>
      )}

      {/* ── Assign KRA to Member Modal ── */}
      {assignKraMemberModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => { setAssignKraMemberModal(null); setAssignKraMemberKraId(""); }}>
          <div style={{ width: 440, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Assign KRA to Member</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>Select a KRA to assign to <strong>{allMembers.find(m => m.id === assignKraMemberModal)?.name}</strong>.</p>
            <Fld label="Select KRA"><FS value={assignKraMemberKraId} onChange={e => setAssignKraMemberKraId(e.target.value)}><option value="">Choose a KRA</option>{allKras.filter(k => k.status === "active").map(k => <option key={k.id} value={k.id}>{k.title} ({jdTitle(k.jdId)})</option>)}</FS></Fld>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}><Btn onClick={() => { setAssignKraMemberModal(null); setAssignKraMemberKraId(""); }}>Cancel</Btn><Btn primary disabled={!assignKraMemberKraId} onClick={assignKraToMember}>Assign</Btn></div>
          </div>
        </div>
      )}

      {/* ── Assign KPI to Member Modal ── */}
      {assignKpiMemberModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,44,.32)", display: "grid", placeItems: "center", zIndex: 50, backdropFilter: "blur(2px)" }} onClick={() => { setAssignKpiMemberModal(null); setAssignKpiMemberKpiId(""); }}>
          <div style={{ width: 440, maxWidth: "92vw", background: T.raised, borderRadius: T.rxl, padding: 28, boxShadow: "0 8px 40px rgba(44,44,44,.14)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>Assign KPI to Member</h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>Select a KPI to assign to <strong>{allMembers.find(m => m.id === assignKpiMemberModal)?.name}</strong>.</p>
            <Fld label="Select KPI"><FS value={assignKpiMemberKpiId} onChange={e => setAssignKpiMemberKpiId(e.target.value)}><option value="">Choose a KPI</option>{allKpis.filter(p => p.status === "active").map(p => <option key={p.id} value={p.id}>{p.name} ({jdTitle(p.jdId)})</option>)}</FS></Fld>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}><Btn onClick={() => { setAssignKpiMemberModal(null); setAssignKpiMemberKpiId(""); }}>Cancel</Btn><Btn primary disabled={!assignKpiMemberKpiId} onClick={assignKpiToMember}>Assign</Btn></div>
          </div>
        </div>
      )}</div>
  );
}
