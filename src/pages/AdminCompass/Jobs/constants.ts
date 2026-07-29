// @ts-nocheck
export const T = {
  font: '"Poppins", system-ui, sans-serif',
  orange: "#DA7756",
  orangeHover: "#C2643F",
  orangeSoft: "rgba(218,119,86,.08)",
  orangeHoverSoft: "rgba(218,119,86,.15)",
  ink: "#2C2C2C",
  inkSoft: "rgba(44,44,44,.68)",
  inkMuted: "rgba(44,44,44,.48)",
  page: "#FFFFFF",
  surface: "#F6F4EE",
  raised: "#FFFFFF",
  warm: "#FFF8EF",
  borderSoft: "rgba(44,44,44,.08)",
  borderWarm: "#E8E3D8",
  divider: "#D5DBDB",
  olive: "#798C5E",
  lavender: "#CECBF6",
  sageMint: "#9EC8BA",
  infoBlue: "#6B9BCC",
  warning: "#EDC488",
  danger: "#E49191",
  growth: "#108C72",
  success: "#89F7E7",
  error: "#E7848E",
  kpiBlue: "#D4E3F0",
  kpiMint: "#DFEEEA",
  kpiLav: "#EDECFC",
  kpiPeach: "#F5DAD0",
  kpiCream: "#F9ECD2",
  aiGrad: "linear-gradient(135deg, #DA7756 0%, #CECBF6 50%, #9EC8BA 100%)",
  aiGlow:
    "0 0 0 6px rgba(218,119,86,.08), 0 1px 3px rgba(44,44,44,.07), 0 2px 8px rgba(44,44,44,.05)",
  shadow: "0 1px 3px rgba(44,44,44,.07), 0 2px 8px rgba(44,44,44,.05)",
  rxs: 6,
  rsm: 8,
  rmd: 12,
  rlg: 16,
  rxl: 24,
};

export const NAV = [
  { label: "BUSINESS", items: [
    { key: "dashboard", label: "Dashboard", icon: null },
    { key: "plan", label: "Plan", icon: null },
    { key: "goals", label: "Goals", icon: null },
    { key: "meetings", label: "Meetings", icon: null },
  ]},
  { label: "SETUP", items: [
    { key: "organisation", label: "Organisation", icon: null },
    { key: "members", label: "Members", icon: null },
    { key: "sops", label: "SOPs", icon: null },
    { key: "jobs", label: "Jobs", icon: null },
  ]},
  { label: "PERSONAL", items: [
    { key: "disc", label: "DISC", icon: null },
  ]},
];

export const STEPS = [
  { key: "details", label: "Job Details", num: 1 },
  { key: "description", label: "Description", num: 2 },
  { key: "kra", label: "KRAs", num: 3 },
  { key: "kpi", label: "KPIs", num: 4 },
  { key: "review", label: "Review & Save", num: 5 },
];

export const DEPARTMENTS = [
  "Engineering", "Design", "Sales", "Marketing", "Human Resources",
  "Finance", "Operations", "Product", "Customer Success", "Legal",
];

export const EMP_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export const EXP_LEVELS = [
  "Entry Level", "Mid Level", "Senior", "Lead", "Manager", "Director", "VP", "C-Suite",
];

export const KPI_UNITS = [
  "Percentage (%)", "Number (#)", "Currency (₹)", "Rating (1–5)", "Days", "Hours", "Score",
];

export const TARGET_FREQ = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

export const DATA_SOURCES = [
  "PATM", "Business Compass", "Helpdesk", "Sales CRM", "Other Modules",
];

export const MODULES_BY_SOURCE = {
  PATM: ["Attendance", "Leave Management", "Payroll", "Shift Scheduling", "Overtime Tracking"],
  "Business Compass": ["Revenue Dashboard", "Project Tracker", "OKRs", "Budgeting", "Analytics"],
  Helpdesk: ["Ticket Management", "SLA Monitoring", "Knowledge Base", "Escalation Queue", "Reports"],
  "Sales CRM": ["Lead Pipeline", "Deal Tracking", "Client Management", "Quotations", "Forecasting"],
  "Other Modules": ["Inventory", "Procurement", "Facility Management", "Compliance", "Custom"],
};

export const MOCK_MEMBERS = ["Amit V.", "Priya S.", "Rahul M.", "Neha G.", "Sanjay K.", "Dinesh T.", "Shivani Y.", "Shahab A."];

export const SETUP_TABS = [
  { key: "company", label: "Company Details" },
  { key: "departments", label: "Departments" },
];

export const INDUSTRIES = [
  "Real Estate", "Technology", "Healthcare", "Finance & Banking", "Manufacturing",
  "Retail & E-commerce", "Education", "Hospitality", "Logistics", "Media & Entertainment",
  "Agriculture", "Energy & Utilities", "Consulting", "Legal", "Other",
];

export const EMPLOYEE_RANGES = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1001–5000", "5000+"];

export const COUNTRIES = ["India", "United States", "United Kingdom", "UAE", "Singapore", "Canada", "Australia", "Germany", "Other"];

export const STATES_INDIA = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh",
  "Gujarat", "Rajasthan", "Telangana", "West Bengal", "Other",
];

export const INITIAL_DEPTS = [
  { id: 1, name: "Engineering", head: "Rahul Mehta", members: 24, color: T.kpiBlue, status: "active" },
  { id: 2, name: "Design", head: "Priya Sharma", members: 8, color: T.kpiLav, status: "active" },
  { id: 3, name: "Sales", head: "Amit Verma", members: 16, color: T.kpiMint, status: "active" },
  { id: 4, name: "Human Resources", head: "Neha Gupta", members: 5, color: T.kpiCream, status: "active" },
];

export const SEED_MEMBERS = [
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

export const COLORS = [T.kpiBlue, T.kpiMint, T.kpiLav, T.kpiPeach, T.kpiCream];

export const SEED_JDS = [
  {
    id: 1, title: "Senior Product Manager", dept: "Product", level: "Senior", type: "Full-time",
    status: "published", assigned: ["Amit V.", "Priya S."], created: "28 Jun 2026",
    reportingTo: "VP of Product", location: "Mumbai, Hybrid", salaryMin: "2400000", salaryMax: "3600000",
    summary: "Lead product strategy and roadmap for B2B SaaS products, driving cross-functional alignment between engineering, design, and business teams to deliver customer-centric solutions.",
    responsibilities: "• Own product roadmap and prioritisation for the B2B platform\n• Conduct market research and competitive analysis\n• Define success metrics and monitor KPIs\n• Collaborate with engineering and design on sprint planning\n• Present product updates to leadership and stakeholders",
    qualifications: "• 6+ years in product management, preferably B2B SaaS\n• MBA or equivalent experience\n• Strong analytical and data-driven decision-making skills",
    skills: "• Jira, Confluence, Figma, SQL\n• Stakeholder management\n• Agile/Scrum methodologies",
    niceToHave: "• Experience with PropTech or real estate domain\n• Familiarity with design systems",
  },
  {
    id: 2, title: "UX Designer", dept: "Design", level: "Mid Level", type: "Full-time",
    status: "draft", assigned: [], created: "02 Jul 2026",
    reportingTo: "Design Lead", location: "Mumbai, On-site", salaryMin: "1200000", salaryMax: "1800000",
    summary: "Design intuitive, accessible user experiences for web and mobile applications, working closely with product and engineering to ship pixel-perfect interfaces.",
    responsibilities: "• Create wireframes, prototypes, and high-fidelity mockups\n• Conduct usability testing and synthesise findings\n• Maintain and evolve the design system\n• Collaborate with developers during implementation",
    qualifications: "• 3+ years of UX/UI design experience\n• Strong portfolio demonstrating end-to-end design process\n• Proficiency in Figma",
    skills: "• Figma, FigJam, Protopie\n• Design systems\n• User research methodologies",
    niceToHave: "• Experience with React component libraries\n• Motion design skills",
  },
  {
    id: 3, title: "Sales Executive", dept: "Sales", level: "Entry Level", type: "Full-time",
    status: "published", assigned: ["Rahul M.", "Neha G."], created: "05 Jul 2026",
    reportingTo: "Sales Manager", location: "Delhi NCR", salaryMin: "600000", salaryMax: "900000",
    summary: "Drive new business acquisition and manage the sales pipeline for real estate technology solutions.",
    responsibilities: "• Generate leads through outbound prospecting\n• Conduct product demos and presentations\n• Manage deals through the full sales cycle\n• Maintain CRM records and pipeline forecasts",
    qualifications: "• 0-2 years in B2B sales\n• Graduate in any discipline\n• Excellent communication skills",
    skills: "• CRM tools (Salesforce/HubSpot)\n• Presentation skills\n• Negotiation",
    niceToHave: "• Real estate industry exposure\n• Regional language proficiency",
  },
];

export const SEED_KRAS = [
  { id: "k1", jdId: 1, title: "Product Strategy & Roadmap", desc: "Own the product vision and define quarterly roadmaps.", weightage: 35, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
  { id: "k2", jdId: 1, title: "Stakeholder Management", desc: "Maintain alignment across engineering, design, and leadership.", weightage: 30, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
  { id: "k3", jdId: 1, title: "Delivery & Execution", desc: "Ensure features ship on time with quality gates.", weightage: 35, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
  { id: "k4", jdId: 2, title: "Design Quality", desc: "Deliver pixel-perfect, accessible UI per the design system.", weightage: 55, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { id: "k5", jdId: 2, title: "User Research", desc: "Conduct usability tests and synthesise findings.", weightage: 45, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { id: "k6", jdId: 3, title: "Revenue Generation", desc: "Meet quarterly revenue targets through acquisitions.", weightage: 60, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
  { id: "k7", jdId: 3, title: "Pipeline Management", desc: "Maintain a healthy pipeline with accurate forecasting.", weightage: 40, effectiveFrom: "2026-04-01", effectiveTo: "2027-03-31", status: "active" },
];

export const SEED_KPIS = [
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

export const AI_KRAS = [
  { title: "Operational Excellence", desc: "Ensure smooth execution of responsibilities with adherence to process standards.", weightage: 30, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { title: "Stakeholder Management", desc: "Proactive communication with stakeholders ensuring alignment on deliverables.", weightage: 25, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { title: "Quality & Compliance", desc: "Deliver outputs meeting quality benchmarks and regulatory standards.", weightage: 20, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { title: "Innovation & Improvement", desc: "Identify workflow inefficiencies and propose actionable improvements.", weightage: 15, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
  { title: "Team Development", desc: "Mentor juniors and foster a collaborative team environment.", weightage: 10, effectiveFrom: "2026-07-01", effectiveTo: "2027-06-30", status: "active" },
];

export const genAiKpis = (kraTitle) => {
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
  return bank[kraTitle] || [
    { name: "Target achievement rate", unit: "Percentage (%)", weightage: 10, target: "85", freq: "Quarterly", updateType: "manual", dataSource: "" },
  ];
};

export const DIVIDER = { height: 1, background: T.borderSoft, margin: "0 0 28px" };
