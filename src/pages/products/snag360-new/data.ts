// Snag360 New Page Data - All product data extracted from HTML files
import {
  ProductIdentity,
  PainPoint,
  TargetUser,
  CurrentState,
  Feature,
  MarketIndustry,
  Competitor,
  PricingTier,
  CompetitivePositioning,
  BuyerValueProp,
  UseCase,
  RoadmapPhase,
  BusinessPlanQuestion,
  GTMTargetGroup,
  ClientMetric,
  BusinessMetric,
  SWOTItem,
  Enhancement,
  Asset,
  Credential,
  MarketStats,
} from "./types";

// ============================================
// TAB 1: PRODUCT SUMMARY DATA
// ============================================
export const productIdentity: ProductIdentity[] = [
  { field: "Product Name", detail: "Snag 360" },
  {
    field: "One-Line Description",
    detail:
      "Mobile-first quality inspection and snagging platform that digitizes defect detection, multi-stage checklist workflows, and pre-handover quality control for real estate and construction projects.",
  },
  {
    field: "Category",
    detail:
      "Construction Quality Management Software (CQMS) / Snagging & Punch List Software",
  },
  {
    field: "Core Mission",
    detail:
      "Eliminate rework, inspection delays, and zero-defect failures in construction projects by replacing paper-based snagging with a structured, role-based digital workflow accessible on any mobile device.",
  },
  {
    field: "Geography",
    detail:
      "India - Primary | Global - Secondary (Southeast Asia, Middle East, UK)",
  },
  {
    field: "Data Sovereignty",
    detail:
      "All client project data stored exclusively on client-owned servers - zero data on Lockated infrastructure. Critical differentiator for enterprise real estate and government-linked EPC buyers.",
  },
  {
    field: "Revenue Model",
    detail:
      "SaaS subscription - per project or per user per month. Upsell modules: Cleaning, HOTO, FM Matrix, Hi-Society. Enterprise: SAP/SFDC integration add-on.",
  },
  {
    field: "Product Status (Apr 2026)",
    detail:
      "Live and deployed. Mobile app available on Android and iOS. Active clients in residential real estate and EPC segments in India.",
  },
];

export const painPoints: PainPoint[] = [
  {
    painPoint: "Core Pain: Paper-Based Snagging Causes Rework and Delays",
    solution:
      "Construction teams still use physical snag lists, WhatsApp photos, and Excel sheets. Lost data, unclear ownership, and no audit trail lead to rework rates of 5-15% of project cost. Snag 360 provides structured digital logging, role-based assignment, and real-time closure tracking.",
  },
  {
    painPoint:
      "Data Sovereignty Gap: Competitors Store Client Data on Their Own Servers",
    solution:
      "Procore, Autodesk ACC, and Novade all store client project data on their own cloud infrastructure. For large Indian real estate developers and government EPC contractors, this is a compliance and security liability. Snag 360 solves this with on-premise client-side data storage - a unique, bankable differentiator.",
  },
  {
    painPoint: "Switching Cost Trap: Generic PM Tools Are Bloated for QC Teams",
    solution:
      "Procore and Autodesk ACC require months of onboarding, large IT teams, and custom configurations. QC and site inspection teams need a focused, mobile-first tool. Snag 360 is purpose-built for quality inspection roles without the overhead of a full construction ERP.",
  },
  {
    painPoint:
      "Missed Defects at Handover Create Customer Complaints and RERA Penalties",
    solution:
      "Under India's RERA, developers are liable for structural defects up to 5 years post-handover. Without a systematic pre-handover snagging process, complaints and legal exposure increase. Snag 360's stage-gate validation ensures no unit is handed over until all quality checkpoints are cleared.",
  },
];

export const targetUsers: TargetUser[] = [
  {
    role: "Project Quality Head / QC Manager",
    useCase:
      "Configure inspection stages, assign inspectors, monitor real-time snag dashboards, generate DPR reports for management.",
    frustration:
      "No consolidated view of open snags across multiple towers or projects. Daily status is assembled manually from WhatsApp messages and Excel.",
    benefit:
      "Live dashboard showing all open/closed snags by stage, tower, and inspector. One-click DPR generation. Zero manual data aggregation.",
  },
  {
    role: "Site Inspector / Field Engineer",
    useCase:
      "Raise snags via mobile app with annotated photos, assign to repair teams, close verified snags. Log ad-hoc defects outside checklist.",
    frustration:
      "Paper checklists are lost, photos shared on WhatsApp lack context, and follow-up on open snags is chased verbally with no audit trail.",
    benefit:
      "Mobile snag logging in under 30 seconds with annotated photo evidence. Clear assignment and deadline per snag. Personal productivity tracked automatically.",
  },
  {
    role: "Project Head / Management / FM Head",
    useCase:
      "Monitor project-level quality score, stage gate progress, handover readiness, and compliance with internal quality benchmarks.",
    frustration:
      "No real-time visibility into project quality health. Defects discovered during customer walkthroughs cause brand damage and RERA exposure.",
    benefit:
      "Executive dashboard with stage-wise completion rates, quality scores, and automated alerts for overdue snags. Handover sign-off backed by digital audit trail.",
  },
];

export const currentState: CurrentState[] = [
  {
    dimension: "Product Status",
    state:
      "Live on Android and iOS. Deployed across residential real estate and EPC clients in India. Active project implementations in Maharashtra, Karnataka, and Telangana.",
  },
  {
    dimension: "What Is Missing Right Now",
    state:
      "AI-assisted defect detection from photos, predictive snag recurrence analytics, BIM floor plan integration, and multilingual app support for Hindi and regional languages.",
  },
  {
    dimension: "Competitive Moat Today",
    state:
      "On-premise data sovereignty (unique in segment), ad-hoc snag logging outside checklists, multi-stage multi-level configurable workflows, and positive/negative scoring engine. No direct Indian competitor offers all four simultaneously.",
  },
  {
    dimension: "Key Markets",
    state:
      "India: Residential real estate developers (tier-1 and tier-2 cities), EPC contractors, infrastructure PMCs. Global: Southeast Asia (Singapore, Malaysia), UK (snagging regulations mandate QC documentation).",
  },
  {
    dimension: "Revenue Model",
    state:
      "Monthly or annual SaaS subscription. Per-user or per-project pricing. Upsell modules billed as add-ons. Enterprise integrations on custom pricing.",
  },
  {
    dimension: "Investor and Partner Case",
    state:
      "India's construction market reaches USD 0.79 trillion in 2026 growing at 6.87% CAGR. The global CQMS market hits USD 3.8 billion by 2033 at 13.7% CAGR. Asia Pacific is the fastest-growing region at 16.2% CAGR. Snag 360 is the only India-built snagging platform with data sovereignty, creating a regulatory-compliant alternative to Procore and Autodesk ACC for India's top 500 real estate developers and government EPC contractors.",
  },
];

export const featureSummary =
  "Snag 360 delivers end-to-end mobile quality inspection across 8 core modules: Quality Inspection and Snagging (raise, assign, track, close snags; ad-hoc defect logging), Checklist Configuration (multi-stage project setup, multi-level checkpoints, positive and negative scoring), Photo Documentation (annotated image capture, visual evidence), Workflow Management (dynamic stage-gate engine), Dashboard and Tracking (real-time live dashboard, DPR), Quality and Compliance Monitoring (safety and activity tracking), Handover Management (pre-handover QC, FM transition support), and Productivity Tools (automation, full digitization). Enterprise integrations with Salesforce and SAP are available. Upsell services include Cleaning, Appointment, HOTO, Hi-Society, and FM Matrix modules.";

// ============================================
// TAB 2: FEATURES DATA
// ============================================
export const features: Feature[] = [
  {
    module: "Quality Inspection / Snagging",
    feature: "Snag Creation and Management",
    subFeatures:
      "Raise snags, assign to reviewer, set priority and due date, track resolution status, close snags with sign-off.",
    howItWorks:
      "Inspector opens mobile app, selects project and unit, creates a new snag entry with description, severity, and due date. Assigns to repair reviewer. Supervisor receives notification, marks repair done. Inspector verifies and closes. All steps timestamped and logged.",
    userType: "Inspector, Reviewer, Supervisor",
    isUSP: false,
  },
  {
    module: "Quality Inspection / Snagging",
    feature: "* Ad-hoc Snag Logging",
    subFeatures:
      "Capture defects discovered outside predefined checklist. Free-form snag entry with photo, description, location tag, and priority.",
    howItWorks:
      "Inspector identifies a defect not covered by the standard checklist. Opens ad-hoc logging mode, takes annotated photo, enters free-form description, assigns location within the unit or common area, sets severity. Snag enters the same workflow as checklist-based snags. This prevents missed defects that fall outside template scope.",
    userType: "Inspector",
    isUSP: true,
  },
  {
    module: "Quality Inspection / Snagging",
    feature: "Multi-role Snag Workflow",
    subFeatures:
      "Four-role system: Inspector (raise and close), Reviewer (execute repair), Supervisor (verify quality of repair), Management (oversight dashboard).",
    howItWorks:
      "Roles are configured per project at setup. Each role receives only the actions and views relevant to their function. Inspector cannot verify their own raised snags. Supervisor cannot close without reviewer completing repair. Management sees aggregate metrics across all active snags without editing access.",
    userType: "Inspector, Reviewer, Supervisor, Management",
    isUSP: false,
  },
  {
    module: "Checklist and Configuration",
    feature: "* Multi-stage Configuration",
    subFeatures:
      "Configure multiple project stages such as Structure, Finishing, MEP, Pre-handover. Each stage has its own checkpoint set and workflow.",
    howItWorks:
      "Admin or quality head sets up project stages in the web portal before field inspection begins. Each stage is named, sequenced, and linked to specific units or zones. Inspectors in the field only see stages and checkpoints assigned to their current work scope. Stage completion unlocks the next stage gate, enforcing sequential quality progression.",
    userType: "Quality Head, Project Admin",
    isUSP: true,
  },
  {
    module: "Checklist and Configuration",
    feature: "* Multi-level Checkpoints",
    subFeatures:
      "Multiple check levels within each stage. Example: Stage = Plastering; Level 1 = Surface Flatness; Level 2 = Corner Finish; Level 3 = Paint Readiness.",
    howItWorks:
      "Within each configured stage, the admin defines checkpoint levels in hierarchical order. Inspectors complete Level 1 before Level 2 becomes accessible. Each checkpoint can carry a positive or negative score weight. Reports show completion by level, enabling granular quality tracking beyond pass/fail outcomes.",
    userType: "Quality Head, Inspector",
    isUSP: true,
  },
  {
    module: "Checklist and Configuration",
    feature: "Checklist-based Inspection",
    subFeatures:
      "Predefined quality checklists matched to project type. Checklists cover civil, MEP, finishing, and safety categories.",
    howItWorks:
      "Before inspection begins, checklists are selected from a master template library or custom-configured for the project. Inspector opens checklist on mobile, goes room by room, marks each item as pass or fail, attaches photo evidence where required, and submits. Completed checklists are stored with timestamp and inspector ID.",
    userType: "Inspector",
    isUSP: false,
  },
  {
    module: "Checklist and Configuration",
    feature: "* Positive/Negative Marking",
    subFeatures:
      "Scoring mechanism where passed checkpoints earn positive marks and failed items apply negative marks. Final quality score is calculated per unit, per stage, and per project.",
    howItWorks:
      "Admin assigns a positive weight to passing checks and a negative weight to failures during checklist configuration. When inspector completes a stage, the system calculates a net quality score. Units below a configurable score threshold are flagged for re-inspection before progressing. Management dashboard shows quality scores by unit, floor, and tower.",
    userType: "Quality Head, Inspector, Management",
    isUSP: true,
  },
  {
    module: "Photo and Documentation",
    feature: "* Photo Annotation",
    subFeatures:
      "Attach photos directly to snags with in-app annotation tools: arrows, text labels, circle markers, dimension indicators.",
    howItWorks:
      "Inspector captures photo using mobile camera within the app. Annotation toolbar appears: add arrows to point to defect, text to describe issue, circle to highlight area, and ruler to indicate approximate scale. Annotated photo is saved as a separate file linked to the snag record. Reviewer sees the annotated photo when executing repair, eliminating ambiguity about defect location.",
    userType: "Inspector",
    isUSP: true,
  },
  {
    module: "Photo and Documentation",
    feature: "Evidence Capture",
    subFeatures:
      "Visual proof for defects and compliance. Before and after photos linked to each snag record.",
    howItWorks:
      "Every snag record supports multiple photos: one at defect discovery and one or more at repair stages. Photos are tagged with timestamp, GPS coordinates, and user ID. Evidence package for each snag can be exported to PDF for client or regulatory submission. Useful for RERA compliance documentation and customer handover packets.",
    userType: "Inspector, Reviewer, Supervisor",
    isUSP: false,
  },
  {
    module: "Workflow Management",
    feature: "* Dynamic Workflow Engine",
    subFeatures:
      "Validates checkpoint completion before allowing progression to next stage. Prevents stage bypass and enforces sequential quality gates.",
    howItWorks:
      "The engine monitors checkpoint completion percentages in real time. When an inspector attempts to mark a stage complete, the engine checks if all mandatory checkpoints at current level are cleared. If pending items exist, progression is blocked and a summary of outstanding items is shown. Configurable thresholds allow a quality score minimum before gate opens. Audit log captures every gate event.",
    userType: "Quality Head, Supervisor, Project Admin",
    isUSP: true,
  },
  {
    module: "Workflow Management",
    feature: "Stage Gate Validation",
    subFeatures:
      "Ensures all required checks are complete before project stage handover to next team or client.",
    howItWorks:
      "At each stage transition, the system validates that all mandatory checkpoints are marked, all open snags are closed or formally accepted, and quality score meets minimum threshold. Validation result is logged with approver ID and timestamp. Failed validation sends automated alerts to supervisor and quality head. Only authorized supervisors can force-approve exceptions with mandatory comments.",
    userType: "Supervisor, Quality Head, Project Head",
    isUSP: false,
  },
  {
    module: "Dashboard and Tracking",
    feature: "* Real-time Dashboard",
    subFeatures:
      "Live tracking of all open and closed snags by project, stage, unit, inspector, and severity. Configurable KPI tiles and heat maps.",
    howItWorks:
      "Management and quality heads access a web-based dashboard that refreshes in real time. KPI tiles show total open snags, overdue snags, average closure time, and stage completion percentages. Heat maps highlight problem floors or towers. Inspector-level performance metrics show snags raised, closed, and average time to close. Exportable to PDF for weekly review meetings.",
    userType: "Management, Quality Head, Project Head",
    isUSP: true,
  },
  {
    module: "Dashboard and Tracking",
    feature: "Progress Tracking",
    subFeatures:
      "Monitor inspection progress by stage, unit, and inspector. Track checklist completion rates and snag resolution velocity.",
    howItWorks:
      "Progress tracking view shows a grid of all project units with color-coded completion status per stage. Green = all clear, Yellow = in progress, Red = snags open or checkpoint failed. Supervisor can drill into any unit to see detailed snag list and checklist status. Inspection velocity reports show how many snags are raised and closed per day, helping optimize team deployment.",
    userType: "Supervisor, Quality Head, Project Head",
    isUSP: false,
  },
  {
    module: "Dashboard and Tracking",
    feature: "DPR and Reporting",
    subFeatures:
      "Daily progress reports auto-generated from inspection data. Reports include snags raised, closed, open, inspection coverage, and stage status.",
    howItWorks:
      "DPR is generated automatically at end of day based on all inspection activity recorded. Report includes: snags opened and closed that day, cumulative open count, inspector activity log, checklist completion by stage, and any overdue snags. DPR is sent via email to configured recipients and stored in project record. Can be exported to PDF or Excel for client or internal reporting.",
    userType: "Quality Head, Project Head, Management",
    isUSP: false,
  },
  {
    module: "Quality and Compliance Monitoring",
    feature: "Quality Monitoring",
    subFeatures:
      "Track construction quality metrics across all active projects. Quality scores aggregated by unit, floor, tower, and project.",
    howItWorks:
      "Aggregate quality scores are calculated from checklist completion and snag data for every unit in the project. Quality monitoring view lets quality heads compare scores across towers or compare current project against historical project benchmarks. Alerts trigger when quality score drops below threshold. Trend charts show quality score improvement over time as repairs are completed.",
    userType: "Quality Head, Management",
    isUSP: false,
  },
  {
    module: "Quality and Compliance Monitoring",
    feature: "Safety Compliance Tracking",
    subFeatures:
      "Monitor safety-related checkpoints and incidents during construction. Track PPE compliance, scaffolding checks, and safety audits.",
    howItWorks:
      "Safety checkpoints are configured as a specific checklist category. Safety officer or inspector completes safety checks alongside quality checks. Any safety non-compliance raises a priority snag flagged as safety-critical. Safety dashboard shows open safety snags separately from quality snags. Exportable safety compliance report supports regulatory audits.",
    userType: "Safety Officer, Supervisor",
    isUSP: false,
  },
  {
    module: "Quality and Compliance Monitoring",
    feature: "Activity Tracking",
    subFeatures:
      "Track on-site work activities by team, date, zone, and type. Activity log linked to inspection records for accountability.",
    howItWorks:
      "All app actions by inspectors and reviewers are logged with timestamp, user ID, and location (GPS if enabled). Activity feed shows what each team member did and when. Supervisors can verify that inspection rounds were completed as scheduled. Activity data feeds into the DPR and weekly project reports automatically.",
    userType: "Supervisor, Quality Head",
    isUSP: false,
  },
  {
    module: "Handover Management",
    feature: "Pre-handover Inspection",
    subFeatures:
      "Final quality check workflow before unit handover to FM team or end customer. Separate pre-handover checklist and snag list.",
    howItWorks:
      "A dedicated pre-handover inspection stage is configured in the workflow. Inspector does a final walkthrough of each unit using the pre-handover checklist. Any new snags raised must be closed before handover clearance is granted. Handover clearance is a digital sign-off by supervisor with all supporting evidence archived. Customer walkthrough can be documented with customer acknowledgment captured on app.",
    userType: "Inspector, Supervisor, FM Head, Customer",
    isUSP: false,
  },
  {
    module: "Handover Management",
    feature: "FM Handover Support",
    subFeatures:
      "Transition to facility management. Handover documentation package including inspection records, snag history, and compliance certificates.",
    howItWorks:
      "At project handover to FM, the system compiles a full handover package: all completed checklists, snag history per unit, quality scores, pre-handover sign-offs, and compliance documentation. FM team receives a digital asset record for each unit. Integration with FM Matrix module (upsell) allows seamless transition of snag history into ongoing maintenance records.",
    userType: "FM Head, Project Head, Management",
    isUSP: false,
  },
  {
    module: "Productivity Tools",
    feature: "* Time-saving Automation",
    subFeatures:
      "Automated DPR generation, automated snag assignment routing, automated overdue alerts, and stage gate validation without manual intervention.",
    howItWorks:
      "Automation triggers run on schedule and on event. DPR is auto-generated at 6 PM daily. Overdue snag alerts fire at configurable intervals. Snag routing to reviewer is automatic based on unit ownership mapping configured at project setup. Stage gate validation runs automatically when inspector submits stage completion. Reduces manual coordination effort by an estimated 3-5 hours per day per project.",
    userType: "Quality Head, Supervisor, Project Admin",
    isUSP: true,
  },
  {
    module: "Productivity Tools",
    feature: "* Digital Inspection Process",
    subFeatures:
      "End-to-end digitization from checklist configuration to snag closure to handover sign-off. No paper required at any stage.",
    howItWorks:
      "Complete inspection lifecycle is managed within the app and web portal. Checklists configured in web portal appear instantly on inspector mobile app. Photos taken in field upload immediately to server. Snag records update in real time on management dashboard. Handover documentation compiled from digital records. Eliminates paper-based snag lists, manual photo filing, and manual report preparation entirely.",
    userType: "All roles",
    isUSP: true,
  },
  {
    module: "Integration",
    feature: "Enterprise Integrations",
    subFeatures:
      "Salesforce CRM integration for linking snag data to customer records. SAP integration for syncing project data with ERP.",
    howItWorks:
      "SFDC integration allows snag status and handover records to sync with customer CRM records in Salesforce, enabling sales and customer service teams to track unit readiness against customer delivery commitments. SAP integration syncs project milestones and quality gate completions with the client's ERP system for billing, procurement, and resource planning alignment.",
    userType: "IT Team, Project Head, Management",
    isUSP: false,
  },
  {
    module: "Additional Services",
    feature: "Extended Services - Cleaning Module",
    subFeatures:
      "Track and schedule cleaning activities for each unit pre-handover.",
    howItWorks:
      "Cleaning tasks are assigned to housekeeping teams per unit. Completion is logged with photo evidence. Linked to pre-handover checklist so unit is marked handover-ready only after cleaning sign-off.",
    userType: "FM Head, Housekeeping Supervisor",
    isUSP: false,
  },
  {
    module: "Additional Services",
    feature: "Extended Services - HOTO",
    subFeatures:
      "Handover Takeover module for structured unit transfer documentation.",
    howItWorks:
      "Structured digital HOTO process captures condition of unit at takeover, links to snag history, records keys and documents issued, and generates signed HOTO certificate.",
    userType: "FM Head, Customer Service",
    isUSP: false,
  },
  {
    module: "Additional Services",
    feature: "Extended Services - Hi-Society",
    subFeatures: "Resident community management post-handover.",
    howItWorks:
      "Connects residents, management, and FM team for complaint management, visitor management, amenity booking, and community communications after project handover.",
    userType: "FM Head, Residents",
    isUSP: false,
  },
  {
    module: "Additional Services",
    feature: "Extended Services - FM Matrix",
    subFeatures:
      "Facility management operations module for ongoing asset maintenance post-handover.",
    howItWorks:
      "Integrates snag and handover history into FM work order management, preventive maintenance scheduling, vendor management, and asset lifecycle tracking.",
    userType: "FM Head, Maintenance Team",
    isUSP: false,
  },
];

// ============================================
// TAB 3: MARKET ANALYSIS DATA
// ============================================
export const marketStats = {
  globalMarket: "$3.8B by 2033",
  globalCAGR: "13.7%",
  indiaMarket: "$1.2B by 2028",
  indiaCAGR: "16.2%",
  asiaPacificCAGR: "16.2%",
  indiaConstructionMarket: "$0.79T in 2026",
  indiaConstructionCAGR: "6.87%",
};

export const targetIndustries: MarketIndustry[] = [
  {
    industry: "Residential Real Estate",
    description:
      "Tier-1 and tier-2 city developers delivering 100+ units per project",
    opportunity:
      "RERA compliance mandate creates urgent need for quality documentation",
  },
  {
    industry: "Commercial Real Estate",
    description: "Office towers, retail malls, mixed-use developments",
    opportunity:
      "Higher quality standards and tenant expectations drive premium positioning",
  },
  {
    industry: "EPC Contractors",
    description:
      "Infrastructure builders working on government and private projects",
    opportunity:
      "Government audit documentation requirements for milestone payments",
  },
  {
    industry: "Data Centers",
    description: "Hyperscale and enterprise data center construction projects",
    opportunity:
      "Precision commissioning requirements and high-stakes quality control",
  },
  {
    industry: "Healthcare Infrastructure",
    description: "Hospital and clinic construction projects",
    opportunity:
      "Regulatory compliance for healthcare facility construction standards",
  },
  {
    industry: "Industrial & Manufacturing",
    description: "Factory and warehouse construction",
    opportunity: "Quality control for specialized industrial requirements",
  },
  {
    industry: "Hospitality",
    description: "Hotel and resort construction projects",
    opportunity: "Brand standard compliance and pre-opening quality checks",
  },
  {
    industry: "Education Infrastructure",
    description: "School and university campus development",
    opportunity: "Safety compliance and government tender documentation",
  },
  {
    industry: "Government & Public Works",
    description: "PMAY housing, metro rail, highways, smart city projects",
    opportunity:
      "Data sovereignty requirement and government IT compliance standards",
  },
  {
    industry: "Retail & Fit-out",
    description: "Store fit-outs and retail space construction",
    opportunity: "Brand compliance and rapid handover timelines",
  },
];

export const competitors: Competitor[] = [
  {
    name: "Procore",
    category: "Global Construction ERP",
    coverage: "Full construction lifecycle",
    keyStrength: "500+ integrations, enterprise scale, US market leader",
    keyWeakness:
      "Expensive ($300-500/user), cloud-only, no data sovereignty option",
    snag360Advantage:
      "On-premise architecture, India pricing, focused snagging depth",
  },
  {
    name: "Autodesk Construction Cloud",
    category: "Global Construction ERP",
    coverage: "Full construction lifecycle with BIM",
    keyStrength: "BIM integration, design-to-construction continuity",
    keyWeakness:
      "Complex implementation, expensive, no India-specific compliance",
    snag360Advantage:
      "Simpler deployment, RERA compliance focus, data sovereignty",
  },
  {
    name: "FalconBrick",
    category: "India Snagging",
    coverage: "Construction QC focus",
    keyStrength:
      "Strong India presence, established customer base in residential",
    keyWeakness: "No ad-hoc snag logging, limited workflow configuration",
    snag360Advantage:
      "Ad-hoc logging, multi-level checkpoints, scoring engine, data sovereignty",
  },
  {
    name: "SnagR",
    category: "UK Snagging",
    coverage: "Residential snagging UK market",
    keyStrength: "UK market leader, NHBC compliance integration",
    keyWeakness: "Limited India presence, no multi-level checkpoint system",
    snag360Advantage:
      "India RERA compliance, multi-stage workflows, competitive pricing",
  },
  {
    name: "SafetyCulture (iAuditor)",
    category: "General Inspection",
    coverage: "Cross-industry inspection platform",
    keyStrength: "100,000+ global users, extensive template library",
    keyWeakness:
      "Generic inspection tool, not construction-specific, no stage gates",
    snag360Advantage:
      "Purpose-built for construction QC, stage-gate enforcement, handover workflows",
  },
  {
    name: "Novade",
    category: "APAC Construction",
    coverage: "Southeast Asia construction management",
    keyStrength: "Strong Singapore/Malaysia presence, multi-project view",
    keyWeakness: "Cloud-only, limited India market focus",
    snag360Advantage:
      "Data sovereignty, India RERA compliance, competitive India pricing",
  },
];

// ============================================
// TAB 4: PRICING DATA
// ============================================
export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    target: "Small developers, single project teams",
    price: "₹600-1,200",
    billing: "per user/month",
    features: [
      "Snag creation and management",
      "Basic checklist templates",
      "Photo documentation",
      "Mobile app access",
      "Email support",
      "Up to 3 projects",
    ],
    bestFor: "Small teams getting started with digital quality management",
    recommended: false,
  },
  {
    name: "Professional",
    target: "Mid-size developers, multiple project teams",
    price: "₹1,500-2,500",
    billing: "per user/month",
    features: [
      "All Starter features",
      "Ad-hoc snag logging",
      "Multi-stage configuration",
      "Multi-level checkpoints",
      "Positive/negative scoring",
      "Real-time dashboard",
      "DPR automation",
      "Stage gate validation",
      "Unlimited projects",
      "Priority support",
    ],
    bestFor:
      "Growing developers managing multiple projects with quality-first approach",
    recommended: true,
  },
  {
    name: "Enterprise",
    target: "Large developers, EPC contractors, government projects",
    price: "₹3,000-6,000+",
    billing: "per user/month",
    features: [
      "All Professional features",
      "On-premise deployment option",
      "SAP/Salesforce integration",
      "Custom workflow configuration",
      "White-label option",
      "Dedicated success manager",
      "Custom compliance reports (RERA, government)",
      "API access",
      "SLA guarantees",
      "Training and onboarding",
    ],
    bestFor:
      "Enterprise accounts with data sovereignty and integration requirements",
    recommended: false,
  },
];

export const competitivePositioning: CompetitivePositioning[] = [
  {
    factor: "Data Sovereignty",
    snag360: "On-premise option",
    enterpriseERP: "Cloud-only",
    pointSolutions: "Cloud-only",
  },
  {
    factor: "Pricing (per user/month)",
    snag360: "₹600-6,000",
    enterpriseERP: "$300-500",
    pointSolutions: "$50-150",
  },
  {
    factor: "Implementation Time",
    snag360: "1-2 weeks",
    enterpriseERP: "3-6 months",
    pointSolutions: "1-2 weeks",
  },
  {
    factor: "Snagging Depth",
    snag360: "Purpose-built",
    enterpriseERP: "Generic module",
    pointSolutions: "Basic features",
  },
  {
    factor: "India Compliance",
    snag360: "RERA-ready",
    enterpriseERP: "Custom config needed",
    pointSolutions: "Not available",
  },
  {
    factor: "Stage Gate Workflow",
    snag360: "Dynamic engine",
    enterpriseERP: "Manual setup",
    pointSolutions: "Not available",
  },
];

export const buyerValueProps: BuyerValueProp[] = [
  {
    buyer: "Quality Head / VP Projects",
    valueProps: [
      "Eliminate project handover delays caused by untracked snags",
      "30-40% reduction in snag backlog at handover",
      "2-3 week faster final completion",
      "Real-time visibility across all projects",
    ],
  },
  {
    buyer: "Site Inspector / Field Engineer",
    valueProps: [
      "Replace paper checklists with structured digital logging",
      "3-5 hours saved per day per site team",
      "Zero lost snag records",
      "Mobile-first workflow with offline support",
    ],
  },
  {
    buyer: "IT / CIO",
    valueProps: [
      "Deploy with all data on company-owned servers",
      "Full data sovereignty - no third-party cloud exposure",
      "Passes internal security audits",
      "No vendor lock-in on data",
    ],
  },
];

// ============================================
// TAB 5: USE CASES DATA
// ============================================
export const useCases: UseCase[] = [
  {
    industry: "Residential Real Estate",
    scenario: "RERA Compliant Handover",
    challenge:
      "Paper-based inspection causing lost data and delayed handovers with RERA compliance risk",
    solution:
      "Configure 4 inspection stages with dynamic workflow engine preventing progression until all checkpoints cleared",
    outcome:
      "95%+ defect-free units at handover, 2-week faster completion, zero RERA complaints",
    impact: "High Impact",
    keyFeatures: [
      "Stage Gate Validation",
      "Real-time Dashboard",
      "Auto DPR Generation",
      "RERA Compliance Pack",
    ],
  },
  {
    industry: "EPC Infrastructure",
    scenario: "Government Audit Documentation",
    challenge:
      "Missing audit-ready quality documentation for milestone payment certification",
    solution:
      "Project stages mapped to government milestones with GPS-tagged photo evidence and complete audit trail",
    outcome:
      "100% audit compliance, faster milestone certification, zero payment delays",
    impact: "High Impact",
    keyFeatures: [
      "Stage Gate Validation",
      "GPS Photo Evidence",
      "Audit Trail",
      "On-premise Deployment",
    ],
  },
  {
    industry: "Data Center Construction",
    scenario: "Precision Commissioning",
    challenge:
      "Zero-defect tolerance requirement for hyperscale data center commissioning",
    solution:
      "Multi-level checkpoints with positive/negative scoring and IoT sensor integration",
    outcome: "Zero commissioning failures, 60% faster punch list closure",
    impact: "High Impact",
    keyFeatures: [
      "Multi-level Checkpoints",
      "Positive/Negative Scoring",
      "IoT Integration",
      "BIM Floor Plan",
    ],
  },
  {
    industry: "Affordable Housing",
    scenario: "PMAY Volume Inspection",
    challenge:
      "Efficient bulk inspection needed for 10,000+ units across multiple sites",
    solution:
      "Standardized checklist templates with multi-project dashboard and offline mode support",
    outcome:
      "50% reduction in inspection time per unit, 100% government audit pass rate",
    impact: "High Impact",
    keyFeatures: [
      "Multi-project Dashboard",
      "Offline Mode",
      "Hindi Language Support",
      "Govt Compliance Reports",
    ],
  },
  {
    industry: "Commercial Real Estate",
    scenario: "Tenant Handover",
    challenge:
      "Systematic quality control needed for tenant fit-out with brand compliance",
    solution:
      "Tenant-specific checklists with stage gate preventing possession until all snags closed",
    outcome: "Zero tenant complaints at handover, faster revenue recognition",
    impact: "Medium Impact",
    keyFeatures: [
      "Custom Checklists",
      "Stage Gate Validation",
      "FM Handover Support",
      "Quality Certificates",
    ],
  },
  {
    industry: "Hospital Construction",
    scenario: "Regulatory Compliance",
    challenge:
      "Healthcare facility construction standards and safety regulation compliance",
    solution:
      "Specialized checklists for infection control, electrical safety, fire systems with audit trail",
    outcome:
      "Regulatory approval on first submission, zero safety compliance gaps",
    impact: "High Impact",
    keyFeatures: [
      "Safety Compliance Tracking",
      "Photo Evidence",
      "Audit Trail",
      "Pre-handover Inspection",
    ],
  },
  {
    industry: "Hotel Construction",
    scenario: "Brand Standard Compliance",
    challenge:
      "Quality control alignment with Marriott brand standards for pre-opening inspection",
    solution:
      "Brand-specific checklist templates with quality scores tracking brand compliance",
    outcome:
      "Brand approval on first inspection, faster franchise milestone completion",
    impact: "Medium Impact",
    keyFeatures: [
      "Brand Checklists",
      "Quality Scores",
      "Photo Evidence",
      "Real-time Dashboard",
    ],
  },
  {
    industry: "Metro Rail",
    scenario: "Infrastructure Quality Audit",
    challenge:
      "Quality documentation for safety certification and government audit compliance",
    solution:
      "Safety-critical checkpoints with priority escalation and GPS-tagged evidence",
    outcome:
      "Zero safety audit failures, faster commissioning approval, 100% audit pass rate",
    impact: "High Impact",
    keyFeatures: [
      "Stage Gate Validation",
      "GPS Photo Evidence",
      "On-premise Deployment",
      "Govt Audit Format",
    ],
  },
  {
    industry: "Retail Fit-out",
    scenario: "Rapid Handover",
    challenge:
      "Fast quality control needed for 50 store fit-outs with brand compliance",
    solution:
      "Standardized brand checklist with multi-project dashboard and contractor tracking",
    outcome:
      "50% faster store opening, 100% brand compliance, contractor accountability",
    impact: "Medium Impact",
    keyFeatures: [
      "Multi-project Dashboard",
      "Contractor Performance",
      "Stage Gate",
      "Automated Certification",
    ],
  },
  {
    industry: "Industrial Manufacturing",
    scenario: "Factory Handover",
    challenge:
      "Quality documentation for machinery installation and safety compliance",
    solution:
      "Specialized checklists with multi-level commissioning checkpoints and vendor sign-off",
    outcome:
      "Zero commissioning delays, 100% safety compliance, on-schedule production start",
    impact: "High Impact",
    keyFeatures: [
      "Multi-level Checkpoints",
      "Safety Tracking",
      "Vendor Sign-off",
      "Quality Certificates",
    ],
  },
];

// ============================================
// TAB 6: ROADMAP DATA
// ============================================
export const roadmapPhases: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    timeline: "Q2-Q3 2026",
    focus: "Core Feature Completion & Market Expansion",
    status: "In Progress",
    deliverables: [
      "Offline Mode for Field Inspectors",
      "RERA Compliance Report Pack",
      "Hindi Language App Interface",
      "Enhanced Onboarding Flow",
      "Batch Snag Upload",
    ],
  },
  {
    phase: "Phase 2",
    timeline: "Q4 2026 - Q2 2027",
    focus: "AI Integration & Enterprise Features",
    status: "Planned",
    deliverables: [
      "AI Photo Defect Classification",
      "BIM Floor Plan Integration",
      "Multi-project Benchmarking Dashboard",
      "Inspector Productivity Reports",
      "WhatsApp Notifications Integration",
    ],
  },
  {
    phase: "Phase 3",
    timeline: "Q3 2027 - 2028",
    focus: "Advanced Analytics & Enterprise Integration",
    status: "Planned",
    deliverables: [
      "AI Voice-to-Snag Logging",
      "SAP Project System Sync (MCP)",
      "Salesforce Customer Handover Sync (MCP)",
      "Digital Twin QC Dashboard",
      "Blockchain Audit Trail",
    ],
  },
];

// ============================================
// TAB 7: BUSINESS PLAN DATA
// ============================================
export const businessPlanQuestions: BusinessPlanQuestion[] = [
  {
    question: "What is the problem we are solving and for whom?",
    answer:
      "Construction quality teams in India still operate on paper checklists, WhatsApp photos, and Excel trackers. This creates lost data, unclear accountability, and rework rates of 5-15% of project cost. Our customers are quality heads, site inspectors, and project managers at real estate developers, EPC contractors, and facility management firms. The problem is acute for any company subject to RERA or government audit documentation requirements, where the cost of poor quality tracking is not just rework but regulatory liability.",
    category: "Problem & Solution",
  },
  {
    question: "What is the current state of our traction?",
    answer:
      "Live and deployed across residential real estate and EPC clients in India. Active project implementations in Maharashtra, Karnataka, and Telangana. Mobile app available on Android and iOS. Current revenue and account count require founder input for precision.",
    category: "Traction",
  },
  {
    question: "What is our addressable market size and growth rate?",
    answer:
      "The global Construction Quality Management Software (CQMS) market reaches USD 3.8 billion by 2033 at 13.7% CAGR. Asia Pacific is the fastest-growing region at 16.2% CAGR. India's construction market is USD 0.79 trillion in 2026, growing at 6.87% CAGR to USD 1.10 trillion by 2031. The India snagging software opportunity is estimated at USD 1.2 billion within 5 years, driven by RERA enforcement, government infrastructure digitization mandates, and the rise of data center and commercial construction.",
    category: "Market Size",
  },
  {
    question: "What is our pricing model and revenue per customer?",
    answer:
      "SaaS subscription with per-user or per-project pricing. Starter tier at INR 600-1,200/user/month for small developers. Professional tier at INR 1,500-2,500/user/month with full feature set. Enterprise tier at INR 3,000-6,000+/user/month with on-premise deployment. Average contract value for Professional accounts is INR 5-8 Lakh annually. Enterprise accounts range INR 15-50 Lakh annually.",
    category: "Revenue Model",
  },
  {
    question: "Who are our competitors and why will we win?",
    answer:
      "Direct competitors include FalconBrick (India snagging), SnagR (UK snagging), Novade (APAC construction), and SafetyCulture iAuditor. Global ERPs like Procore and Autodesk ACC are indirect competitors. Our moat: (1) On-premise data sovereignty - the only snagging platform that stores client data on their own servers. (2) India-market fit - RERA compliance, Hindi language, INR pricing. (3) Workflow depth - multi-level checkpoints, positive/negative scoring, dynamic stage gates.",
    category: "Competition",
  },
  {
    question:
      "What are the 3 key actions we need to execute in the first 90 days?",
    answer:
      "First, activate 5 reference pilot deployments at mid-size Mumbai and Bengaluru residential developers. Second, run LinkedIn content targeting quality heads and VP Projects at India's top 100 developers. Third, partner with 2-3 PMC firms as channel partners who embed Snag 360 in their site quality service offering. Target: 10 paid accounts by day 90, INR 50-80 Lakh ARR by month 6.",
    category: "Go-To-Market",
  },
  {
    question: "What is our primary competitive moat?",
    answer:
      "Our moat is built on three layers. Layer 1: Data sovereignty - we store all client data on the client's own servers. Layer 2: Workflow depth - multi-level checkpoints, positive/negative scoring, and dynamic stage-gate engine. Layer 3: India-market embeddedness - RERA compliance reports, Hindi language support, and state housing authority formats create localization barriers for global competitors.",
    category: "Competitive Advantage",
  },
  {
    question: "What are the 3 biggest risks and how do we mitigate them?",
    answer:
      "Risk 1: FalconBrick accelerates product development. Mitigation: Accelerate AI photo detection and BIM integration. Risk 2: Procore or Autodesk launches low-cost India-specific snagging SKU. Mitigation: Data sovereignty architecture cannot be replicated by cloud-native competitors. Risk 3: Enterprise IT procurement cycles are too slow. Mitigation: Target mid-market accounts with 30-day pilot to paid conversion model.",
    category: "Risk Management",
  },
  {
    question: "What does success look like at 12 and 36 months?",
    answer:
      "At 12 months: 50 paying accounts, INR 3-5 Cr ARR, NRR above 110%, ACV INR 8-12 Lakh. At least 3 logos from top 50 India real estate developers. At 36 months: 200+ paying accounts, INR 18-25 Cr ARR, Southeast Asia and UK launched, BIM integration live, AI photo detection shipped.",
    category: "Success Metrics",
  },
  {
    question: "What is the investor and partner case?",
    answer:
      "For investors: Snag 360 operates in a USD 3.8 billion global market with no India-first, data-sovereign competitor at scale. India's construction boom combined with RERA enforcement creates mandatory market. Our on-premise architecture creates customer stickiness and passes IT security requirements that block all cloud-native competitors. For partners: System integrators and PMC firms benefit from embedding Snag 360, reducing quality reporting labor cost by 3-5 hours per site per day.",
    category: "Investment Case",
  },
];

// ============================================
// TAB 8: GTM STRATEGY DATA
// ============================================
export const gtmTargetGroups: GTMTargetGroup[] = [
  {
    segment: "Residential Real Estate Developers",
    characteristics:
      "RERA-obligated developers needing quality documentation for 5 years post-handover",
    painPoints: [
      "RERA compliance documentation requirements",
      "Pre-handover inspection chaos",
      "Paper-based snag tracking",
      "Rework costs 5-15% of project",
    ],
    messaging: [
      "Eliminate RERA compliance risk with digital audit trail",
      "95%+ defect-free units at handover",
      "Zero-minute daily progress reports",
      "Cut inspection effort by 60%",
    ],
    channels: [
      "LinkedIn",
      "CREDAI Events",
      "WhatsApp Broadcast",
      "Case Studies",
    ],
    successMetrics: [
      "60% pilot-to-paid conversion",
      "20 paid accounts in 90 days",
      "INR 50-80L ARR in 6 months",
    ],
  },
  {
    segment: "EPC & Infrastructure Contractors",
    characteristics:
      "Government project contractors requiring audit documentation for milestone payments",
    painPoints: [
      "Government audit documentation requirements",
      "Data sovereignty compliance",
      "Multi-site quality coordination",
      "SAP integration needs",
    ],
    messaging: [
      "On-premise architecture passes government IT audits",
      "100% audit compliance, zero payment delays",
      "SAP Project System integration available",
      "Multi-project benchmarking dashboard",
    ],
    channels: ["CII Summit", "PMC Network", "White Papers", "Direct Sales"],
    successMetrics: [
      "INR 20-50L deal size",
      "1 top-10 EPC within 6 months",
      "5-7 year customer lifecycle",
    ],
  },
  {
    segment: "Global Markets (UK & Southeast Asia)",
    characteristics:
      "UK Building Safety Act compliance and Singapore BCA quality requirements",
    painPoints: [
      "Building Safety Act 2022 compliance (UK)",
      "NHBC Buildmark warranty requirements",
      "BCA quality documentation (Singapore)",
      "Expensive global tool alternatives",
    ],
    messaging: [
      "Affordable SnagR alternative with deeper workflow",
      "Pre-configured NHBC UK and BCA Singapore templates",
      "Data sovereignty for regulated markets",
      "Mobile-first for field teams",
    ],
    channels: [
      "UK Resellers",
      "BCA Partnership",
      "Trade Publications",
      "SCAL Webinars",
    ],
    successMetrics: [
      "5 paying accounts in 9 months",
      "USD 20K+ average ACV",
      "2+ reseller agreements",
    ],
  },
];

// ============================================
// TAB 9: METRICS DATA
// ============================================
export const clientMetrics: ClientMetric[] = [
  {
    metric: "Daily Inspection Hours",
    description: "Daily inspection hours per site team",
    before: "6-8 hours (manual checklist, photo filing, WhatsApp coordination)",
    after: "2-3 hours (mobile app, auto-routing, auto-reporting)",
    improvement: "60% reduction in inspection effort",
  },
  {
    metric: "Snag Assignment Time",
    description: "Time from snag discovery to assignment",
    before: "4-24 hours (verbal instruction, WhatsApp, physical handover)",
    after: "Under 5 minutes (auto-assignment on snag creation)",
    improvement: "Snag assigned in under 5 minutes",
  },
  {
    metric: "Snag Visibility",
    description: "Open snag visibility for management",
    before: "Updated once per week via manual Excel from site team",
    after: "Real-time, accessible from any device",
    improvement: "Real-time project quality health - always on",
  },
  {
    metric: "DPR Preparation",
    description: "Daily Progress Report preparation time per day",
    before: "60-90 minutes manual consolidation from multiple sources",
    after: "0 minutes - auto-generated at 6 PM daily",
    improvement: "Zero-minute daily progress reports",
  },
  {
    metric: "Defect-Free Handover",
    description: "Snag closure rate at handover (% units defect-free)",
    before: "60-75% at initial customer walkthrough (industry average)",
    after: "90-98% with stage-gate validation",
    improvement: "95%+ defect-free units at handover",
  },
  {
    metric: "Rework Cost",
    description: "Rework cost per project (% of project cost)",
    before: "5-15% industry average due to missed or repeated defects",
    after: "Estimated 2-5% with structured snag tracking and scoring",
    improvement: "Up to 60% reduction in rework cost",
  },
  {
    metric: "Inspector Onboarding",
    description: "Inspector onboarding time",
    before: "3-5 days for paper process training",
    after: "2-4 hours for mobile app onboarding",
    improvement: "Field team ready in one day",
  },
  {
    metric: "Handover Documentation",
    description: "Handover documentation preparation time",
    before: "3-5 days manual compilation of photos, reports, sign-offs",
    after: "Under 30 minutes - auto-compiled from platform records",
    improvement: "Handover pack generated in 30 minutes",
  },
  {
    metric: "RERA Compliance",
    description: "RERA complaint risk exposure",
    before: "High - no structured evidence of quality process at handover",
    after: "Low - digital audit trail and signed pre-handover certificate",
    improvement: "RERA complaint risk reduced with verifiable audit trail",
  },
  {
    metric: "Customer Satisfaction",
    description: "Customer walkthrough satisfaction rate",
    before: "Industry average: 40-60% customers raise snags at walkthrough",
    after: "Target: under 10% of customers raise new snags at walkthrough",
    improvement: "10% or fewer customer complaints at possession walkthrough",
  },
];

export const businessMetrics: BusinessMetric[] = [
  {
    metric: "New Account Signups",
    description: "Account completes onboarding and deploys first project",
    target: "15-25 new paid accounts/month",
    current: "3-5 new paid accounts/month",
    timeline: "Phase 1: 30 days",
    priority: "High",
  },
  {
    metric: "Activated Users",
    description:
      "Activation = inspector raises 10+ snags and closes 5+ snags in first 14 days",
    target: "75% cumulative activation",
    current: "60% activation rate among licensed inspectors",
    timeline: "3 months",
    priority: "High",
  },
  {
    metric: "Pilot Conversion Rate",
    description: "Pilot account converts to paid plan within 90 days",
    target: "65% cumulative conversion",
    current: "50% pilot-to-paid conversion",
    timeline: "Phase 1: 3 months",
    priority: "High",
  },
  {
    metric: "Ad-hoc Snag Adoption",
    description: "% of active users logging at least 1 ad-hoc snag per week",
    target: "60% of active users",
    current: "40% of active users using ad-hoc logging weekly",
    timeline: "Phase 1: 3 months",
    priority: "Medium",
  },
  {
    metric: "Dashboard Engagement",
    description: "% of Quality Heads logging into dashboard 3+ times per week",
    target: "70% of QH users active on dashboard 3x/week",
    current: "55% of QH users active on dashboard 3x/week",
    timeline: "3 months",
    priority: "Medium",
  },
  {
    metric: "Customer Satisfaction (NPS)",
    description:
      "Survey sent at 60-day mark: How likely are you to recommend Snag 360?",
    target: "NPS 50+",
    current: "NPS 40+",
    timeline: "Phase 1: 3 months",
    priority: "High",
  },
  {
    metric: "Support Ticket Volume",
    description: "Number of support tickets raised per account per month",
    target: "3-5 tickets/account/month",
    current: "8-12 tickets/account/month (new platform)",
    timeline: "Phase 1: 3 months",
    priority: "Medium",
  },
  {
    metric: "Monthly Churn Rate",
    description: "% of paying accounts that cancel in a given month",
    target: "1.5-2.5% monthly churn",
    current: "3-5% monthly churn (early stage)",
    timeline: "Phase 1: 3 months",
    priority: "High",
  },
  {
    metric: "Snags Resolved (North Star)",
    description:
      "Total snags closed / total active projects on platform in period",
    target: "130+ snags resolved/project/month",
    current: "80+ snags resolved per active project per month",
    timeline: "Phase 1: 3 months",
    priority: "High",
  },
  {
    metric: "ARR Growth Rate",
    description: "Monthly ARR increase as percentage of prior month ARR",
    target: "18-22% MoM cumulative ARR growth",
    current: "15-20% MoM ARR growth",
    timeline: "Phase 1: 3 months",
    priority: "High",
  },
];

// ============================================
// TAB 10: SWOT DATA
// ============================================
export const swotStrengths: SWOTItem[] = [
  {
    item: "On-premise Data Sovereignty",
    description:
      "Only India snagging platform with this: Client project data stored on their own servers, passing enterprise and government IT audits that block cloud-only competitors.",
  },
  {
    item: "Ad-hoc Snag Logging",
    description:
      "Captures unexpected defects missed by rigid checklist-only tools like FalconBrick; improves defect coverage by 20-30%.",
  },
  {
    item: "Multi-level Checkpoint Configuration",
    description:
      "Granular quality scoring at sub-stage level (e.g., plastering > flatness > paint readiness) - no competitor offers equivalent depth.",
  },
  {
    item: "Positive/Negative Scoring Engine",
    description:
      "Quality score calculation per unit, floor, tower enables objective quality comparisons and contractor performance tracking.",
  },
  {
    item: "Dynamic Stage-gate Workflow Engine",
    description:
      "Prevents stage progression until quality score and checkpoint completion thresholds are met - enforces quality discipline.",
  },
  {
    item: "Real-time Dashboard",
    description:
      "Configurable KPI tiles with live snag tracking by project, stage, unit, inspector, severity without manual report preparation.",
  },
  {
    item: "Full Handover Documentation Workflow",
    description:
      "Pre-handover inspection, FM handover package, and extended services (HOTO, Cleaning, Hi-Society) cover full unit lifecycle within one platform; reduces post-handover dispute risk.",
  },
  {
    item: "India-market Product Fit (RERA Alignment)",
    description:
      "Built with understanding of RERA compliance requirements, Indian construction workflows, and local developer expectations.",
  },
  {
    item: "SAP and Salesforce Enterprise Integrations",
    description:
      "Bridges quality data to enterprise ERP and CRM systems; critical for large developer and EPC accounts.",
  },
  {
    item: "Lockated Platform Ecosystem",
    description:
      "Cross-sell and upsell opportunities via Lockated workspace management suite; existing client relationships provide warm entry.",
  },
];

export const swotWeaknesses: SWOTItem[] = [
  {
    item: "No Offline Mode",
    description:
      "Field inspectors in low-connectivity sites (infrastructure, rural) cannot log snags without internet; blocks EPC and PMAY market entry.",
  },
  {
    item: "No BIM or Floor Plan Integration",
    description:
      "Cannot pin snags to 2D/3D floor plan; Procore and Autodesk ACC have this; limits premium commercial and data center positioning.",
  },
  {
    item: "No AI-based Defect Detection",
    description:
      "Manual defect categorization required; competitors investing in AI photo analysis for auto-classification.",
  },
  {
    item: "No Multilingual (Hindi) Support",
    description:
      "Field inspectors with low English literacy must rely on supervisors; limits scale in government and affordable housing.",
  },
  {
    item: "No Predictive Analytics",
    description:
      "Cannot proactively identify high-risk areas or contractors before snags occur; Procore Insights has this.",
  },
  {
    item: "Single-tenant On-premise Model",
    description:
      "Each new enterprise account requires dedicated deployment effort vs SaaS multi-tenant efficiency.",
  },
  {
    item: "Small Sales Team",
    description:
      "Enterprise EPC accounts require 3-6 month sales cycles with technical demonstrations; under-resourced today.",
  },
  {
    item: "Limited Case Studies",
    description:
      "Competitor tools have extensive G2, Capterra, and analyst-published case studies; Snag 360 has limited public social proof.",
  },
  {
    item: "Upsell Modules Not Deeply Integrated",
    description:
      "Extended services modules (HOTO, FM Matrix) are functional but not deeply integrated with core snag workflow, creating friction for FM buyers.",
  },
  {
    item: "No Contractor Marketplace",
    description:
      "Cannot provide contractor accountability data across projects; Procore and ConstructConnect offer vendor performance tools.",
  },
];

export const swotOpportunities: SWOTItem[] = [
  {
    item: "RERA Enforcement Intensifying",
    description:
      "Maharashtra, Karnataka, and Telangana driving mandatory quality documentation; expanding to tier-2 states creates new demand waves.",
  },
  {
    item: "India Construction Market Growth",
    description:
      "Growing at 6.87% CAGR to 2031: USD 1.10 trillion market by 2031 with 200,000+ residential units delivered annually creates massive inspection volume.",
  },
  {
    item: "Government Digital Transformation",
    description:
      "PM Gati Shakti mandating digital project monitoring on infrastructure projects creates a captive demand pool for Snag 360's audit documentation.",
  },
  {
    item: "UK Building Safety Act 2022",
    description:
      "UK's statutory snagging mandate creates a regulatory pull market for Snag 360 in UK housebuilding - 200,000 new homes per year.",
  },
  {
    item: "Asia Pacific CQMS Growth",
    description:
      "Growing at 16.2% CAGR - fastest globally: Singapore, Malaysia, Vietnam, and Indonesia construction digitalization creates international expansion runway.",
  },
  {
    item: "AI Integration Opportunity",
    description:
      "Adding AI defect detection from photos creates a feature leap that leapfrogs FalconBrick and SnagR simultaneously.",
  },
  {
    item: "BIM Adoption in India",
    description:
      "BIM mandate for government projects above INR 100 Cr creates floor plan integration demand that Snag 360 can capture with Phase 2 roadmap.",
  },
  {
    item: "Data Center Construction Boom",
    description:
      "USD 10 Bn+ data center investment pipeline by 2027 creates demand for precision commissioning inspection software.",
  },
  {
    item: "PMAY Housing Target",
    description:
      "30 million housing target drives volume inspection; Government affordable housing delivery requires bulk unit inspection tools at accessible pricing.",
  },
  {
    item: "OEM Licensing Potential",
    description:
      "Partnering with NYGGS, StrategicERP, or Highrise as white-label quality module creates platform revenue channel without direct sales cost.",
  },
];

export const swotThreats: SWOTItem[] = [
  {
    item: "FalconBrick Product Development",
    description:
      "FalconBrick is well-funded and actively expanding; may add ad-hoc logging and scoring within 12-18 months.",
  },
  {
    item: "Procore India Entry",
    description:
      "Procore has a pattern of entering new markets with simplified entry-level products; an India Essentials SKU at INR 2,000/user would threaten mid-market.",
  },
  {
    item: "Autodesk ACC India Expansion",
    description:
      "ACC has BIM integration advantage; if they launch an aggressive India sales motion, they could win commercial real estate accounts before Snag 360 builds BIM.",
  },
  {
    item: "SafetyCulture Competition",
    description:
      "SafetyCulture (iAuditor) has 100,000+ global users and strong brand; adding stage-gate snagging to their platform would create a credible hybrid competitor.",
  },
  {
    item: "Enterprise Sales Cycle",
    description:
      "EPC and government accounts have 3-6 month procurement cycles; cash flow pressure if mid-market pipeline does not close fast enough to bridge.",
  },
  {
    item: "Developer Consolidation",
    description:
      "Top 10 developers are acquiring smaller ones; market consolidation could reduce the number of independent accounts over time.",
  },
  {
    item: "Data Sovereignty Scalability",
    description:
      "On-premise deployment creates higher support and deployment cost per customer; as volumes scale, this model requires more professional services investment.",
  },
  {
    item: "Global Price Competition",
    description:
      "Global SaaS tools (SnagR, GoCanvas) can offer aggressive India pricing to gain market share; price war risk if they prioritize India growth.",
  },
  {
    item: "Offline Mode Gap",
    description:
      "Every month without offline mode is a month FalconBrick can win EPC accounts that Snag 360 cannot currently serve.",
  },
  {
    item: "RERA Regulatory Changes",
    description:
      "If RERA simplifies documentation requirements or enforcement weakens, the compliance-driven urgency for Snag 360 adoption decreases.",
  },
];

// ============================================
// TAB 11: ENHANCEMENT ROADMAP DATA
// ============================================
export const enhancements: Enhancement[] = [
  {
    title: "AI-Powered Defect Classification from Photos",
    category: "AI / LLM",
    description:
      "LLM-based image analysis model that automatically classifies defect type, severity, and likely root cause from inspector photos. Suggests checklist item match and repair action.",
    priority: "High",
    timeline: "Phase 2",
    benefit:
      "Eliminates manual defect categorization; speeds up snag creation by 70%; enables predictive defect pattern analysis across projects.",
  },
  {
    title: "Predictive Snag Recurrence Engine",
    category: "AI / Predictive Analytics",
    description:
      "ML model trained on historical snag data identifies which contractor teams, project stages, and unit types are likely to generate repeat defects. Issues early alerts 2-3 stages before problem zones.",
    priority: "High",
    timeline: "Phase 2",
    benefit:
      "Reduces rework by targeting quality attention where recurrence probability is highest; justifies premium enterprise pricing.",
  },
  {
    title: "Natural Language Snag Search and Query",
    category: "AI / NLP",
    description:
      "Inspectors can search all snags using plain language: 'show me all plastering defects in Tower B raised last week'. AI interprets query and returns filtered results without manual filter navigation.",
    priority: "Medium",
    timeline: "Phase 2",
    benefit:
      "Reduces time spent on dashboard navigation; makes platform accessible for less tech-savvy inspectors; reduces support tickets.",
  },
  {
    title: "AI-Generated DPR Narrative Summary",
    category: "AI / LLM",
    description:
      "LLM automatically writes a plain-English narrative summary of the day's inspection activity, including notable trends, overdue risk alerts, and project health commentary, appended to the auto-generated DPR.",
    priority: "High",
    timeline: "Phase 2",
    benefit:
      "Transforms raw DPR data into actionable management communication; reduces quality head's daily reporting effort to zero.",
  },
  {
    title: "AI Voice-to-Snag Logging",
    category: "AI / LLM",
    description:
      "Inspector speaks a snag description out loud into the mobile app. AI transcribes, classifies, assigns severity, and creates a structured snag record automatically. Supports Hindi and English.",
    priority: "High",
    timeline: "Phase 2",
    benefit:
      "Eliminates typing for field inspectors; particularly valuable for inspectors with low digital literacy; supports hands-free inspection workflow.",
  },
  {
    title: "MCP Integration: AutoSync with SAP Project Management",
    category: "MCP / Cross-Platform Automation",
    description:
      "Model Context Protocol server that continuously syncs Snag 360 stage gate completions with SAP PS (Project System) milestone events. Eliminates manual ERP data entry for project progress billing.",
    priority: "High",
    timeline: "Phase 1",
    benefit:
      "Removes a key manual integration pain point for enterprise EPC accounts; strengthens SAP integration story for Tata Projects, L&T, NCC accounts.",
  },
  {
    title: "MCP Integration: Salesforce Customer Handover Sync",
    category: "MCP / Cross-Platform Automation",
    description:
      "MCP server that pushes pre-handover inspection sign-off and unit quality score directly into Salesforce CRM opportunity and customer records. Triggers handover workflow in SFDC automatically.",
    priority: "High",
    timeline: "Phase 1",
    benefit:
      "Closes the loop between construction quality and customer delivery CRM; enables customer service team to access quality history from CRM without switching tools.",
  },
  {
    title: "MCP Integration: WhatsApp Snag Notifications",
    category: "MCP / Cross-Platform Automation",
    description:
      "MCP server that sends snag assignment, overdue alert, and closure notifications via WhatsApp Business API. Inspectors and reviewers receive actionable messages on WhatsApp with deep links back to app.",
    priority: "High",
    timeline: "Phase 1",
    benefit:
      "Meets India field team where they already are (WhatsApp); dramatically improves response rate on snag assignments without requiring app adoption for non-primary users.",
  },
  {
    title: "BIM Floor Plan Snag Pinning",
    category: "Core Feature Enhancement",
    description:
      "2D floor plan and BIM model upload for each project unit. Inspectors tap on floor plan to create location-accurate snags. Heat maps show defect density by room, floor, and zone.",
    priority: "High",
    timeline: "Phase 2",
    benefit:
      "Closes the single largest feature gap vs Procore and Autodesk ACC; enables premium enterprise positioning for commercial and data center construction.",
  },
  {
    title: "Contractor Performance Rating and Marketplace",
    category: "Platform / Ecosystem",
    description:
      "Each repair contractor is rated on snag closure speed, re-open rate, first-fix rate, and quality score across all projects they work on. Developers can view contractor scorecards before awarding repair work.",
    priority: "High",
    timeline: "Phase 2",
    benefit:
      "Creates network effect and platform lock-in; generates switching cost for developer accounts; enables future marketplace monetization.",
  },
  {
    title: "IoT Sensor Triggered Auto-Snag",
    category: "IoT / Automation",
    description:
      "Integration with building IoT sensors (temperature, humidity, air quality, structural vibration). When sensor reading breaches configured threshold, snag is auto-raised and assigned to relevant contractor.",
    priority: "High",
    timeline: "Phase 3",
    benefit:
      "Moves Snag 360 from reactive inspection to proactive quality monitoring; enters smart building and data center construction market.",
  },
  {
    title: "Digital Twin QC Dashboard",
    category: "Advanced Analytics",
    description:
      "3D digital twin view of the project building with snag heat map overlay. Management can rotate the building model and see defect concentrations by floor, zone, and stage visually.",
    priority: "High",
    timeline: "Phase 3",
    benefit:
      "Premium enterprise capability; qualifies Snag 360 for mega-project tenders alongside Autodesk and Bentley; strong demo conversion driver.",
  },
  {
    title: "AI Checklist Auto-Generation from Project Specs",
    category: "AI / LLM",
    description:
      "Upload project specification documents (PDF or Word). LLM analyzes specs and automatically generates a customized inspection checklist with checkpoints derived from spec requirements.",
    priority: "High",
    timeline: "Phase 2",
    benefit:
      "Eliminates manual checklist creation for each new project; reduces quality head setup time from days to minutes; enables self-service onboarding.",
  },
  {
    title: "Customer Walkthrough Portal (Self-Service Snag Raising)",
    category: "Product Extension",
    description:
      "Buyers and tenants access a branded portal to conduct their own pre-possession walkthrough and raise snags directly in the platform. Snags auto-route to developer quality team for response.",
    priority: "Medium",
    timeline: "Phase 2",
    benefit:
      "Digitizes the customer possession experience; eliminates paper punch lists at customer handover; creates digital evidence of customer acknowledgment.",
  },
  {
    title: "Blockchain Audit Trail for Snag Records",
    category: "Compliance / Security",
    description:
      "All snag creation, modification, and closure events are hashed and written to a permissioned blockchain ledger. Provides tamper-proof audit trail for RERA disputes and government contract verification.",
    priority: "High",
    timeline: "Phase 3",
    benefit:
      "Creates an immutable compliance record; strongest possible evidence for RERA dispute resolution; government and high-value commercial accounts pay premium for this.",
  },
  {
    title: "Automated Warranty Claim Management",
    category: "Product Extension",
    description:
      "Post-handover snags raised by residents or FM teams are automatically classified as warranty claims and routed to the original contractor with SLA tracking and escalation.",
    priority: "Medium",
    timeline: "Phase 2",
    benefit:
      "Extends platform revenue into the post-handover lifecycle; FM and developer accounts both benefit; creates multi-year customer LTV.",
  },
  {
    title: "API Marketplace for Third-Party Integrations",
    category: "Platform / Ecosystem",
    description:
      "Open API documentation and developer portal enabling third-party integrations: accounting systems, project management tools, BI dashboards, custom compliance report generators.",
    priority: "Medium",
    timeline: "Phase 2",
    benefit:
      "Removes integration barrier for enterprise accounts with existing tech stacks; enables partner-driven integrations without Snag 360 development effort.",
  },
  {
    title: "Multi-Project Benchmarking Dashboard",
    category: "Analytics",
    description:
      "Quality heads compare quality scores, snag rates, closure times, and inspector productivity across all active projects simultaneously. Peer benchmarking against anonymized industry averages.",
    priority: "Medium",
    timeline: "Phase 2",
    benefit:
      "High-value analytics feature for enterprise accounts managing 10+ projects; creates data asset that becomes more valuable with more accounts on platform.",
  },
  {
    title: "Snag 360 Mobile App for Subcontractors",
    category: "Product Extension",
    description:
      "Free lightweight mobile app for subcontractor repair teams. They receive snag assignments, view annotated photos, mark repair complete, and upload repair evidence. No checklist or dashboard access.",
    priority: "Medium",
    timeline: "Phase 1",
    benefit:
      "Extends platform reach to subcontractor ecosystem without seat licensing cost; improves repair cycle closure rate; creates data on contractor performance automatically.",
  },
  {
    title: "Government Compliance Report Templates Library",
    category: "Compliance",
    description:
      "Pre-built report templates for state-specific RERA submissions, PMAY documentation, NHAI quality audit formats, and smart city compliance requirements. One-click export in required formats.",
    priority: "High",
    timeline: "Phase 1",
    benefit:
      "Reduces compliance documentation effort by 80%; creates immediate value for government-facing accounts; differentiates from tools built for US/UK compliance only.",
  },
];

// ============================================
// TAB 12: ASSETS DATA
// ============================================
export const assets: Asset[] = [
  {
    name: "Snag 360 Master Sales Deck",
    type: "Presentation",
    url: "#",
    description: "Comprehensive sales presentation for enterprise prospects",
  },
  {
    name: "Product Features Walkthrough Video",
    type: "Video",
    url: "#",
    description: "5-minute overview of key features and workflows",
  },
  {
    name: "Enterprise Implementation Brochure",
    type: "Brochure",
    url: "#",
    description: "Detailed implementation guide for IT teams",
  },
  {
    name: "Retail Case Study - Tier 1 Developer",
    type: "Case Study",
    url: "#",
    description: "ROI and implementation results from pilot deployment",
  },
  {
    name: "Data Sovereignty in Construction: Why It Matters",
    type: "White Paper",
    url: "#",
    description: "Technical white paper on on-premise architecture benefits",
  },
  {
    name: "RERA Compliance Checklist Template",
    type: "Checklist",
    url: "#",
    description: "Sample checklist for RERA-compliant quality inspection",
  },
];

export const credentials: Credential[] = [
  {
    environment: "Production",
    role: "Developer Admin",
    username: "admin@builder.com",
    password: "Dev@2026",
  },
  {
    environment: "Production",
    role: "Site Inspector",
    username: "inspector.karan@site.com",
    password: "SiteSync#1",
  },
  {
    environment: "Production",
    role: "Reviewer / Supervisor",
    username: "sup.singh@qa.com",
    password: "QCVerify!99",
  },
];

// Product metadata
export const productMetadata = {
  name: "Snag 360",
  owner: "Sagar Singh",
  ownerImage: "/assets/product_owner/sagar_singh.jpeg",
  brief:
    "Mobile-first quality inspection and snagging platform that digitizes defect detection, multi-stage checklist workflows, and pre-handover quality control for real estate and construction projects.",
  industries: "Real Estate Developer, FM Company, EPC Contractor",
  usps: [
    "On-premise data sovereignty",
    "Ad-hoc snag logging",
    "Multi-level checkpoints",
    "Positive/negative scoring",
    "Dynamic stage-gate workflow",
    "Real-time dashboard",
  ],
  integrations: ["Salesforce CRM", "SAP ERP"],
  upSelling: ["Cleaning", "HOTO", "FM Matrix", "Hi-Society"],
};
