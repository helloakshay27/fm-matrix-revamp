import React, { useState, useEffect, useRef } from "react";
import { useProductSecurity } from "./useProductSecurity";
import { SecurityOverlays } from "./SecurityOverlays";
import {
  ArrowLeft,
  Monitor,
  FileText,
  Video,
  PlayCircle,
  Globe,
  Smartphone,
  Presentation,
  Camera,
  ShieldAlert,
  Lock,
  ChevronLeft,
  ChevronRight,
  Settings,
  CreditCard,
  TrendingUp,
  User,
  UserCheck,
  MapPin,
  Target,
  List,
  BarChart3,
  DollarSign,
  Briefcase,
  Map,
  Building2,
  Megaphone,
  LineChart,
  Compass,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

// --- DATA ---
const productData = {
  name: "Snag 360",
  excelLikeFeatures: true,
  excelLikeRoadmap: false,
  excelLikeBusinessPlan: true,
  excelLikeSwot: true,
  excelLikePricing: true,
  tabOrder: [
    "summary",
    "features",
    "market",
    "pricing",
    "usecases",
    "roadmap",
    "business",
    "gtm",
    "metrics",
    "swot",
    "enhancements",
    "assets",
  ] as (
    | "summary"
    | "features"
    | "usecases"
    | "market"
    | "pricing"
    | "swot"
    | "roadmap"
    | "enhancements"
    | "metrics"
    | "business"
    | "gtm"
    | "assets"
  )[],
  description:
    "Mobile-first quality inspection and snagging platform that digitizes defect detection, multi-stage checklist workflows, and pre-handover quality control for real estate and construction projects.",
  brief:
    "Ensures reduction in follow up on complaints from customers. Dynamic Workflow Management validates checkpoints across functions before final delivery.",
  userStories: [
    {
      title: "Roles",
      items: [
        "Inspector: Raises and closes Snags",
        "Reviewer: Repair work on Snags",
        "Repairer: Verifying work (Supervisor)",
        "Management: Oversees activity and quality",
      ],
    },
  ],
  industries: "Real Estate Developer, FM Company",
  usps: [
    "1. Photo Annotation + Multistage Configuration",
    "2. Real Time Dashboard and Stage Tracking",
    "3. Helps Save Time & Improve Productivity",
  ],
  includes: ["Standard QC Solution"],
  upSelling: ["Cleaning, Appointment, HOTO, Hi-Society, FM Matrix"],
  integrations: ["SFDC, SAP"],
  decisionMakers: ["Project Head, Quality Head, FM Head"],
  keyPoints: [
    "1. Real Time Visibility & Progress Tracking",
    "2. Time Saved & Enhanced Productivity",
    "3. Transparency & Accountability",
  ],
  roi: [
    "Strong ROI by reducing rework, inspection effort, and handover delays.",
  ],
  assets: [
    {
      type: "Link",
      title: "Snag 360 Master Sales Deck",
      url: "#",
      icon: <Presentation className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Product Features Walkthrough Video",
      url: "#",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Enterprise Implementation Brochure",
      url: "#",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Retail Case Study - Tier 1 Developer",
      url: "#",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Developer Admin Dashboard",
      url: "https://snag360.lockated.com/admin",
      id: "admin@builder.com",
      pass: "Dev@2026",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Site Inspector Mobile Access",
      url: "https://snag360.lockated.com/app",
      id: "inspector.karan@site.com",
      pass: "SiteSync#1",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      title: "Reviewer / Supervisor Portal",
      url: "https://snag360.lockated.com/reviewer",
      id: "sup.singh@qa.com",
      pass: "QCVerify!99",
      icon: <UserCheck className="w-5 h-5" />,
    },
  ],
  owner: "Sagar Singh",
  ownerImage: "/assets/product_owner/sagar_singh.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
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
      ],
      problemSolves: [
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
          painPoint:
            "Switching Cost Trap: Generic PM Tools Are Bloated for QC Teams",
          solution:
            "Procore and Autodesk ACC require months of onboarding, large IT teams, and custom configurations. QC and site inspection teams need a focused, mobile-first tool. Snag 360 is purpose-built for quality inspection roles without the overhead of a full construction ERP.",
        },
        {
          painPoint:
            "Missed Defects at Handover Create Customer Complaints and RERA Penalties",
          solution:
            "Under India's RERA, developers are liable for structural defects up to 5 years post-handover. Without a systematic pre-handover snagging process, complaints and legal exposure increase. Snag 360's stage-gate validation ensures no unit is handed over until all quality checkpoints are cleared.",
        },
      ],
      whoItIsFor: [
        {
          role: "Project Quality Head / QC Manager",
          useCase:
            "Configure inspection stages, assign inspectors, monitor real-time snag dashboards, generate DPR reports for management.",
          frustration:
            "No consolidated view of open snags across multiple towers or projects. Daily status is assembled manually from WhatsApp messages and Excel.",
          gain: "Live dashboard showing all open/closed snags by stage, tower, and inspector. One-click DPR generation. Zero manual data aggregation.",
        },
        {
          role: "Site Inspector / Field Engineer",
          useCase:
            "Raise snags via mobile app with annotated photos, assign to repair teams, close verified snags. Log ad-hoc defects outside checklist.",
          frustration:
            "Paper checklists are lost, photos shared on WhatsApp lack context, and follow-up on open snags is chased verbally with no audit trail.",
          gain: "Mobile snag logging in under 30 seconds with annotated photo evidence. Clear assignment and deadline per snag. Personal productivity tracked automatically.",
        },
        {
          role: "Project Head / Management / FM Head",
          useCase:
            "Monitor project-level quality score, stage gate progress, handover readiness, and compliance with internal quality benchmarks.",
          frustration:
            "No real-time visibility into project quality health. Defects discovered during customer walkthroughs cause brand damage and RERA exposure.",
          gain: "Executive dashboard with stage-wise completion rates, quality scores, and automated alerts for overdue snags. Handover sign-off backed by digital audit trail.",
        },
      ],
      featureSummary:
        "Snag 360 delivers end-to-end mobile quality inspection across 8 core modules: Quality Inspection and Snagging (raise, assign, track, close snags; ad-hoc defect logging), Checklist Configuration (multi-stage project setup, multi-level checkpoints, positive and negative scoring), Photo Documentation (annotated image capture, visual evidence), Workflow Management (dynamic stage-gate engine), Dashboard and Tracking (real-time live dashboard, DPR), Quality and Compliance Monitoring (safety and activity tracking), Handover Management (pre-handover QC, FM transition support), and Productivity Tools (automation, full digitization). Enterprise integrations with Salesforce and SAP are available. Upsell services include Cleaning, Appointment, HOTO, Hi-Society, and FM Matrix modules.",
      today: [
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
      ],
    },
    productSummary: {
      vision:
        "To be the leading quality control solution for real estate, ensuring zero-defect property handovers worldwide.",
      mission:
        "Empower real estate developers and FM companies with digital tools to track, manage, and resolve construction defects efficiently.",
      targetMarket:
        "Real Estate Developers, Facility Management Companies, Construction Contractors, Property Management Firms",
      valueProposition:
        "End-to-end digital snagging solution that reduces rework costs by 40%, accelerates handover timelines, and ensures customer satisfaction through transparent defect management.",
      competitiveAdvantage: [
        "Mobile-first design with offline capability",
        "Photo annotation with AI-powered defect detection",
        "Multi-stage workflow configuration",
        "Real-time dashboards and analytics",
        "Seamless integration with CRM and ERP systems",
      ],
    },
    featureList: [
      {
        category: "Defect Management",
        features: [
          "Photo annotation with markup tools",
          "Voice-to-text defect description",
          "Defect categorization and tagging",
          "Severity level assignment",
          "Location-based defect mapping",
        ],
      },
      {
        category: "Workflow Management",
        features: [
          "Configurable multi-stage workflows",
          "Role-based task assignment",
          "Auto-escalation rules",
          "SLA tracking and alerts",
          "Approval hierarchies",
        ],
      },
      {
        category: "Reporting & Analytics",
        features: [
          "Real-time dashboard",
          "Defect trend analysis",
          "Contractor performance reports",
          "Handover readiness score",
          "Export to PDF/Excel",
        ],
      },
      {
        category: "Mobile App Features",
        features: [
          "Offline mode with sync",
          "Push notifications",
          "QR code scanning",
          "GPS location tracking",
          "Camera integration with filters",
        ],
      },
    ],
    detailedFeatures: [
      {
        module: "Quality Inspection / Snagging",
        feature: "Snag Creation and Management",
        subFeatures:
          "Raise snags, assign to reviewer, set priority and due date, track resolution status, close snags with sign-off.",
        works:
          "Inspector opens mobile app, selects project and unit, creates a new snag entry with description, severity, and due date. Assigns to repair reviewer. Supervisor receives notification, marks repair done. Inspector verifies and closes. All steps timestamped and logged.",
        userType: "Inspector, Reviewer, Supervisor",
        usp: false,
      },
      {
        module: "Quality Inspection / Snagging",
        feature: "* Ad-hoc Snag Logging",
        subFeatures:
          "Capture defects discovered outside predefined checklist. Free-form snag entry with photo, description, location tag, and priority.",
        works:
          "Inspector identifies a defect not covered by the standard checklist. Opens ad-hoc logging mode, takes annotated photo, enters free-form description, assigns location within the unit or common area, sets severity. Snag enters the same workflow as checklist-based snags. This prevents missed defects that fall outside template scope.",
        userType: "Inspector",
        usp: true,
      },
      {
        module: "Quality Inspection / Snagging",
        feature: "Multi-role Snag Workflow",
        subFeatures:
          "Four-role system: Inspector (raise and close), Reviewer (execute repair), Supervisor (verify quality of repair), Management (oversight dashboard).",
        works:
          "Roles are configured per project at setup. Each role receives only the actions and views relevant to their function. Inspector cannot verify their own raised snags. Supervisor cannot close without reviewer completing repair. Management sees aggregate metrics across all active snags without editing access.",
        userType: "Inspector, Reviewer, Supervisor, Management",
        usp: false,
      },
      {
        module: "Checklist and Configuration",
        feature: "* Multi-stage Configuration",
        subFeatures:
          "Configure multiple project stages such as Structure, Finishing, MEP, Pre-handover. Each stage has its own checkpoint set and workflow.",
        works:
          "Admin or quality head sets up project stages in the web portal before field inspection begins. Each stage is named, sequenced, and linked to specific units or zones. Inspectors in the field only see stages and checkpoints assigned to their current work scope. Stage completion unlocks the next stage gate, enforcing sequential quality progression.",
        userType: "Quality Head, Project Admin",
        usp: true,
      },
      {
        module: "Checklist and Configuration",
        feature: "* Multi-level Checkpoints",
        subFeatures:
          "Multiple check levels within each stage. Example: Stage = Plastering; Level 1 = Surface Flatness; Level 2 = Corner Finish; Level 3 = Paint Readiness.",
        works:
          "Within each configured stage, the admin defines checkpoint levels in hierarchical order. Inspectors complete Level 1 before Level 2 becomes accessible. Each checkpoint can carry a positive or negative score weight. Reports show completion by level, enabling granular quality tracking beyond pass/fail outcomes.",
        userType: "Quality Head, Inspector",
        usp: true,
      },
      {
        module: "Checklist and Configuration",
        feature: "Checklist-based Inspection",
        subFeatures:
          "Predefined quality checklists matched to project type. Checklists cover civil, MEP, finishing, and safety categories.",
        works:
          "Before inspection begins, checklists are selected from a master template library or custom-configured for the project. Inspector opens checklist on mobile, goes room by room, marks each item as pass or fail, attaches photo evidence where required, and submits. Completed checklists are stored with timestamp and inspector ID.",
        userType: "Inspector",
        usp: false,
      },
      {
        module: "Checklist and Configuration",
        feature: "* Positive/Negative Marking",
        subFeatures:
          "Scoring mechanism where passed checkpoints earn positive marks and failed items apply negative marks. Final quality score is calculated per unit, per stage, and per project.",
        works:
          "Admin assigns a positive weight to passing checks and a negative weight to failures during checklist configuration. When inspector completes a stage, the system calculates a net quality score. Units below a configurable score threshold are flagged for re-inspection before progressing. Management dashboard shows quality scores by unit, floor, and tower.",
        userType: "Quality Head, Inspector, Management",
        usp: true,
      },
      {
        module: "Photo and Documentation",
        feature: "* Photo Annotation",
        subFeatures:
          "Attach photos directly to snags with in-app annotation tools: arrows, text labels, circle markers, dimension indicators.",
        works:
          "Inspector captures photo using mobile camera within the app. Annotation toolbar appears: add arrows to point to defect, text to describe issue, circle to highlight area, and ruler to indicate approximate scale. Annotated photo is saved as a separate file linked to the snag record. Reviewer sees the annotated photo when executing repair, eliminating ambiguity about defect location.",
        userType: "Inspector",
        usp: true,
      },
      {
        module: "Photo and Documentation",
        feature: "Evidence Capture",
        subFeatures:
          "Visual proof for defects and compliance. Before and after photos linked to each snag record.",
        works:
          "Every snag record supports multiple photos: one at defect discovery and one or more at repair stages. Photos are tagged with timestamp, GPS coordinates, and user ID. Evidence package for each snag can be exported to PDF for client or regulatory submission. Useful for RERA compliance documentation and customer handover packets.",
        userType: "Inspector, Reviewer, Supervisor",
        usp: false,
      },
      {
        module: "Workflow Management",
        feature: "* Dynamic Workflow Engine",
        subFeatures:
          "Validates checkpoint completion before allowing progression to next stage. Prevents stage bypass and enforces sequential quality gates.",
        works:
          "The engine monitors checkpoint completion percentages in real time. When an inspector attempts to mark a stage complete, the engine checks if all mandatory checkpoints at current level are cleared. If pending items exist, progression is blocked and a summary of outstanding items is shown. Configurable thresholds allow a quality score minimum before gate opens. Audit log captures every gate event.",
        userType: "Quality Head, Supervisor, Project Admin",
        usp: true,
      },
      {
        module: "Workflow Management",
        feature: "Stage Gate Validation",
        subFeatures:
          "Ensures all required checks are complete before project stage handover to next team or client.",
        works:
          "At each stage transition, the system validates that all mandatory checkpoints are marked, all open snags are closed or formally accepted, and quality score meets minimum threshold. Validation result is logged with approver ID and timestamp. Failed validation sends automated alerts to supervisor and quality head. Only authorized supervisors can force-approve exceptions with mandatory comments.",
        userType: "Supervisor, Quality Head, Project Head",
        usp: false,
      },
      {
        module: "Dashboard and Tracking",
        feature: "* Real-time Dashboard",
        subFeatures:
          "Live tracking of all open and closed snags by project, stage, unit, inspector, and severity. Configurable KPI tiles and heat maps.",
        works:
          "Management and quality heads access a web-based dashboard that refreshes in real time. KPI tiles show total open snags, overdue snags, average closure time, and stage completion percentages. Heat maps highlight problem floors or towers. Inspector-level performance metrics show snags raised, closed, and average time to close. Exportable to PDF for weekly review meetings.",
        userType: "Management, Quality Head, Project Head",
        usp: true,
      },
      {
        module: "Dashboard and Tracking",
        feature: "Progress Tracking",
        subFeatures:
          "Monitor inspection progress by stage, unit, and inspector. Track checklist completion rates and snag resolution velocity.",
        works:
          "Progress tracking view shows a grid of all project units with color-coded completion status per stage. Green = all clear, Yellow = in progress, Red = snags open or checkpoint failed. Supervisor can drill into any unit to see detailed snag list and checklist status. Inspection velocity reports show how many snags are raised and closed per day, helping optimize team deployment.",
        userType: "Supervisor, Quality Head, Project Head",
        usp: false,
      },
      {
        module: "Dashboard and Tracking",
        feature: "DPR and Reporting",
        subFeatures:
          "Daily progress reports auto-generated from inspection data. Reports include snags raised, closed, open, inspection coverage, and stage status.",
        works:
          "DPR is generated automatically at end of day based on all inspection activity recorded. Report includes: snags opened and closed that day, cumulative open count, inspector activity log, checklist completion by stage, and any overdue snags. DPR is sent via email to configured recipients and stored in project record. Can be exported to PDF or Excel for client or internal reporting.",
        userType: "Quality Head, Project Head, Management",
        usp: false,
      },
      {
        module: "Quality and Compliance Monitoring",
        feature: "Quality Monitoring",
        subFeatures:
          "Track construction quality metrics across all active projects. Quality scores aggregated by unit, floor, tower, and project.",
        works:
          "Aggregate quality scores are calculated from checklist completion and snag data for every unit in the project. Quality monitoring view lets quality heads compare scores across towers or compare current project against historical project benchmarks. Alerts trigger when quality score drops below threshold. Trend charts show quality score improvement over time as repairs are completed.",
        userType: "Quality Head, Management",
        usp: false,
      },
      {
        module: "Quality and Compliance Monitoring",
        feature: "Safety Compliance Tracking",
        subFeatures:
          "Monitor safety-related checkpoints and incidents during construction. Track PPE compliance, scaffolding checks, and safety audits.",
        works:
          "Safety checkpoints are configured as a specific checklist category. Safety officer or inspector completes safety checks alongside quality checks. Any safety non-compliance raises a priority snag flagged as safety-critical. Safety dashboard shows open safety snags separately from quality snags. Exportable safety compliance report supports regulatory audits.",
        userType: "Safety Officer, Supervisor",
        usp: false,
      },
      {
        module: "Quality and Compliance Monitoring",
        feature: "Activity Tracking",
        subFeatures:
          "Track on-site work activities by team, date, zone, and type. Activity log linked to inspection records for accountability.",
        works:
          "All app actions by inspectors and reviewers are logged with timestamp, user ID, and location (GPS if enabled). Activity feed shows what each team member did and when. Supervisors can verify that inspection rounds were completed as scheduled. Activity data feeds into the DPR and weekly project reports automatically.",
        userType: "Supervisor, Quality Head",
        usp: false,
      },
      {
        module: "Handover Management",
        feature: "Pre-handover Inspection",
        subFeatures:
          "Final quality check workflow before unit handover to FM team or end customer. Separate pre-handover checklist and snag list.",
        works:
          "A dedicated pre-handover inspection stage is configured in the workflow. Inspector does a final walkthrough of each unit using the pre-handover checklist. Any new snags raised must be closed before handover clearance is granted. Handover clearance is a digital sign-off by supervisor with all supporting evidence archived. Customer walkthrough can be documented with customer acknowledgment captured on app.",
        userType: "Inspector, Supervisor, FM Head, Customer",
        usp: false,
      },
      {
        module: "Handover Management",
        feature: "FM Handover Support",
        subFeatures:
          "Transition to facility management. Handover documentation package including inspection records, snag history, and compliance certificates.",
        works:
          "At project handover to FM, the system compiles a full handover package: all completed checklists, snag history per unit, quality scores, pre-handover sign-offs, and compliance documentation. FM team receives a digital asset record for each unit. Integration with FM Matrix module (upsell) allows seamless transition of snag history into ongoing maintenance records.",
        userType: "FM Head, Project Head, Management",
        usp: false,
      },
      {
        module: "Productivity Tools",
        feature: "* Time-saving Automation",
        subFeatures:
          "Automated DPR generation, automated snag assignment routing, automated overdue alerts, and stage gate validation without manual intervention.",
        works:
          "Automation triggers run on schedule and on event. DPR is auto-generated at 6 PM daily. Overdue snag alerts fire at configurable intervals. Snag routing to reviewer is automatic based on unit ownership mapping configured at project setup. Stage gate validation runs automatically when inspector submits stage completion. Reduces manual coordination effort by an estimated 3-5 hours per day per project.",
        userType: "Quality Head, Supervisor, Project Admin",
        usp: true,
      },
      {
        module: "Productivity Tools",
        feature: "* Digital Inspection Process",
        subFeatures:
          "End-to-end digitization from checklist configuration to snag closure to handover sign-off. No paper required at any stage.",
        works:
          "Complete inspection lifecycle is managed within the app and web portal. Checklists configured in web portal appear instantly on inspector mobile app. Photos taken in field upload immediately to server. Snag records update in real time on management dashboard. Handover documentation compiled from digital records. Eliminates paper-based snag lists, manual photo filing, and manual report preparation entirely.",
        userType: "All roles",
        usp: true,
      },
      {
        module: "Integration",
        feature: "Enterprise Integrations",
        subFeatures:
          "Salesforce CRM integration for linking snag data to customer records. SAP integration for syncing project data with ERP.",
        works:
          "SFDC integration allows snag status and handover records to sync with customer CRM records in Salesforce, enabling sales and customer service teams to track unit readiness against customer delivery commitments. SAP integration syncs project milestones and quality gate completions with the client's ERP system for billing, procurement, and resource planning alignment.",
        userType: "IT Team, Project Head, Management",
        usp: false,
      },
      {
        module: "Additional Services",
        feature: "Extended Services - Cleaning Module",
        subFeatures:
          "Track and schedule cleaning activities for each unit pre-handover.",
        works:
          "Cleaning tasks are assigned to housekeeping teams per unit. Completion is logged with photo evidence. Linked to pre-handover checklist so unit is marked handover-ready only after cleaning sign-off.",
        userType: "FM Head, Housekeeping Supervisor",
        usp: false,
      },
      {
        module: "Additional Services",
        feature: "Extended Services - HOTO",
        subFeatures:
          "Handover Takeover module for structured unit transfer documentation.",
        works:
          "Structured digital HOTO process captures condition of unit at takeover, links to snag history, records keys and documents issued, and generates signed HOTO certificate.",
        userType: "FM Head, Customer Service",
        usp: false,
      },
      {
        module: "Additional Services",
        feature: "Extended Services - Hi-Society",
        subFeatures: "Resident community management post-handover.",
        works:
          "Connects residents, management, and FM team for complaint management, visitor management, amenity booking, and community communications after project handover.",
        userType: "FM Head, Residents",
        usp: false,
      },
      {
        module: "Additional Services",
        feature: "Extended Services - FM Matrix",
        subFeatures:
          "Facility management operations module for ongoing asset maintenance post-handover.",
        works:
          "Integrates snag and handover history into FM work order management, preventive maintenance scheduling, vendor management, and asset lifecycle tracking.",
        userType: "FM Head, Maintenance Team",
        usp: false,
      },
    ],
    marketAnalysis: {
      marketSize:
        "$2.5 Billion (Global Construction Quality Management Software Market)",
      growthRate: "12.5% CAGR (2024-2030)",
      segments: [
        {
          segment: "Real Estate Developers",
          details: [
            "Large developers with 500+ units annually",
            "Mid-size developers with 100-500 units",
            "Boutique developers focusing on premium properties",
          ],
        },
        {
          segment: "Facility Management",
          details: [
            "Corporate FM companies",
            "Residential property managers",
            "Commercial building operators",
          ],
        },
        {
          segment: "Construction Contractors",
          details: [
            "General contractors",
            "Specialty subcontractors",
            "MEP contractors",
          ],
        },
      ],
      competitors: [
        "PlanGrid (Autodesk)",
        "Fieldwire",
        "Procore",
        "BIM 360",
        "Buildertrend",
      ],
      trends: [
        "Increased adoption of mobile-first solutions",
        "AI and ML for defect prediction",
        "Integration with BIM models",
        "Sustainability and green building compliance",
        "Remote inspection capabilities post-pandemic",
      ],
    },
    detailedMarketAnalysis: {
      marketSize: [
        {
          segment: "Global Construction Quality Management",
          val2425: "USD 1.2 Bn (2024)",
          val26: "USD 1.36 Bn (est.)",
          forecast: "USD 3.8 Bn by 2033",
          cagr: "13.7%",
          driver:
            "Digitization of QC workflows, RERA-type regulations globally, BIM adoption",
          india:
            "India among fastest-growing APAC markets; RERA mandates quality documentation",
        },
        {
          segment: "Global Inspection Management Software",
          val2425: "USD 9.2 Bn (2024)",
          val26: "USD 10.4 Bn (est.)",
          forecast: "USD 18.86 Bn by 2030",
          cagr: "13.2%",
          driver:
            "Mobile and cloud-based inspection platforms; AI-driven audit automation",
          india:
            "Large enterprise real estate and EPC firms in India adopting rapidly",
        },
        {
          segment: "Global Construction Management Software",
          val2425: "USD 10.64 Bn (2025)",
          val26: "USD 11.58 Bn (2026)",
          forecast: "USD 17.72 Bn by 2031",
          cagr: "8.88%",
          driver:
            "Cloud-first contractors, labor shortages, remote collaboration tools",
          india:
            "India construction software market at USD 0.28 Bn; fastest-growing APAC at 10.98% CAGR",
        },
        {
          segment: "India Construction Market (Total)",
          val2425: "USD 0.74 Tn (2025)",
          val26: "USD 0.79 Tn (2026)",
          forecast: "USD 1.10 Tn by 2031",
          cagr: "6.87%",
          driver:
            "Infrastructure spend: USD 133.3 Bn budget 2025-26; FDI up 15% YoY",
          india:
            "Residential (44.68% share) + EPC + Infrastructure = primary buyer segments for Snag 360",
        },
        {
          segment: "Global Quality Management Software (Broad)",
          val2425: "USD 12.26 Bn (2025)",
          val26: "USD 13.7 Bn (est.)",
          forecast: "USD 28.82 Bn by 2033",
          cagr: "11.5%",
          driver:
            "Regulatory compliance, ISO requirements, cloud QMS adoption by enterprises",
          india:
            "On-premise QMS demand highest in India due to data sovereignty preference",
        },
        {
          segment: "India Testing, Inspection and Certification (TIC)",
          val2425: "USD 7.9 Bn (2025)",
          val26: "USD 8.2 Bn (est.)",
          forecast: "USD 10.9 Bn by 2034",
          cagr: "3.63%",
          driver:
            "Make in India, FSSAI, regulatory reforms across construction and manufacturing",
          india:
            "Construction TIC sub-segment directly addressable by Snag 360",
        },
        {
          segment: "Asia Pacific CQMS - Fastest Growing Region",
          val2425: "N/A (2024 base)",
          val26: "Growing",
          forecast: "16.2% CAGR through 2033",
          cagr: "16.2%",
          driver:
            "Rapid urbanization, infrastructure mega-projects, labor shortages",
          india:
            "India and Southeast Asia primary expansion markets for Snag 360 global rollout",
        },
      ],
      topIndustries: [
        {
          rank: 1,
          industry: "Residential Real Estate Development",
          buyReason:
            "RERA mandates quality delivery; pre-handover snagging required for compliance; customer complaint reduction",
          scale:
            "Top 8 developers delivered 200,000+ units in FY25; 10,000+ active real estate projects nationally",
          decisionMaker: "VP Projects / Quality Head",
          dealSize: "INR 12-25 Lakh",
        },
        {
          rank: 2,
          industry: "EPC Contractors and Infrastructure Firms (EPCE)",
          buyReason:
            "Large multi-site projects require structured QC; government contracts demand audit trails; stage-wise inspection mandatory",
          scale:
            "India EPC market at USD 120+ Bn; L&T, Tata Projects, Megha Engineering among top buyers",
          decisionMaker: "Quality Head / Project Director",
          dealSize: "INR 20-50 Lakh",
        },
        {
          rank: 3,
          industry: "Commercial Real Estate (Office, Retail, Hospitality)",
          buyReason:
            "Pre-occupancy snagging for corporate clients; Grade A office quality standards; FM handover documentation",
          scale:
            "India Grade A office supply at 700+ Mn sq ft; 50+ Mn sq ft added per year",
          decisionMaker: "Project Manager / FM Head",
          dealSize: "INR 10-20 Lakh",
        },
        {
          rank: 4,
          industry: "Industrial and Warehousing Construction (Warehousing)",
          buyReason:
            "Quality checks for fit-out, MEP, safety compliance before occupancy; lease agreement quality clauses",
          scale:
            "Warehousing sector growing at 15%+ CAGR; 100+ Mn sq ft new supply in FY25",
          decisionMaker: "Project Engineer / Quality Manager",
          dealSize: "INR 8-18 Lakh",
        },
        {
          rank: 5,
          industry: "Facility Management",
          buyReason:
            "Post-handover snag tracking; maintenance request management; asset condition documentation at takeover",
          scale:
            "India FM market at INR 70,000 Cr+ and growing; top FM companies: JLL, CBRE, Sodexo, BVG",
          decisionMaker: "FM Head / Operations Director",
          dealSize: "INR 6-15 Lakh",
        },
        {
          rank: 6,
          industry:
            "Government and Public Infrastructure (PWD, NHAI, Metro) (EPCE)",
          buyReason:
            "Mandatory quality audits for public works; third-party inspection documentation; anti-corruption audit trail",
          scale:
            "NHAI awards 8,500+ km highways annually; metro rail projects in 30+ cities",
          decisionMaker: "Project Director / Chief Quality Officer",
          dealSize: "INR 25-60 Lakh",
        },
        {
          rank: 7,
          industry: "Healthcare and Education Facility Construction (EPCE)",
          buyReason:
            "High compliance standards; infection control QC; zero-defect medical-grade finishing requirements",
          scale:
            "India healthcare infrastructure investment: USD 50 Bn+ through 2030; 1,200+ hospital projects",
          decisionMaker: "Project Head / Hospital Operations",
          dealSize: "INR 10-22 Lakh",
        },
        {
          rank: 8,
          industry: "Data Center and Technology Campus Construction (IT/ITES)",
          buyReason:
            "Precision QC for raised floors, cooling, electrical; clean room standards; strict commissioning protocols",
          scale:
            "India data center capacity to triple by 2027; USD 10 Bn+ investment pipeline",
          decisionMaker: "Construction Manager / Technical Director",
          dealSize: "INR 15-35 Lakh",
        },
        {
          rank: 9,
          industry:
            "Affordable Housing (PMAY, State Housing Schemes) (Residential Real Estate)",
          buyReason:
            "Volume delivery with standardized quality benchmarks; government audit compliance; digital handover required",
          scale:
            "PMAY: 30 Mn houses target; state housing boards active across 28 states",
          decisionMaker: "State Authority / PMC Quality Team",
          dealSize: "INR 5-12 Lakh",
        },
        {
          rank: 10,
          industry: "Special Economic Zones and Industrial Parks (IT Parks)",
          buyReason:
            "Multi-building phased delivery; tenant-specific finishing quality; pre-occupancy punch list",
          scale:
            "India SEZ land allotment growing; 400+ operational SEZs; new DPIIT industrial park push",
          decisionMaker: "Park Manager / Asset Manager",
          dealSize: "INR 10-20 Lakh",
        },
      ],
      competitors: [
        {
          name: "Procore",
          hq: "USA / Global",
          indiaPrice: "INR 8,000-15,000 (custom enterprise)",
          globalPrice: "USD 99+ (custom)",
          strength:
            "Comprehensive construction PM; huge ecosystem; deep integrations",
          weakness:
            "Bloated for pure QC teams; no India-specific compliance; high implementation cost; data on Procore cloud",
          sovereignty: "No - Procore servers",
          segment: "Large contractors, global developers",
        },
        {
          name: "Autodesk Construction Cloud (ACC)",
          hq: "USA / Global",
          indiaPrice: "INR 6,500-12,000 per user",
          globalPrice: "USD 85+ per user",
          strength:
            "BIM integration; industry standard; strong reporting suite",
          weakness:
            "Complex onboarding; not mobile-first for snagging; no data sovereignty; expensive per seat",
          sovereignty: "No - Autodesk cloud",
          segment: "Architects, large GCs, global projects",
        },
        {
          name: "FalconBrick",
          hq: "India / India-first",
          indiaPrice: "INR 1,500-4,000 per user",
          globalPrice: "Not priced globally",
          strength:
            "India-built; understands local real estate workflow; RERA aligned",
          weakness:
            "No ad-hoc snag logging; limited stage-gate configuration; limited export/integration options",
          sovereignty: "No - FalconBrick cloud",
          segment: "Residential real estate developers",
        },
        {
          name: "Novade",
          hq: "Singapore / SE Asia",
          indiaPrice: "INR 3,500-7,000 per user",
          globalPrice: "USD 50+ per user (enterprise custom)",
          strength:
            "Strong mobile app; offline support; modular quality and safety",
          weakness:
            "Expensive for Indian SME segment; complex setup; data not on client servers",
          sovereignty: "No - Novade cloud",
          segment: "Large EPC contractors, SE Asia and Middle East",
        },
        {
          name: "SnagR",
          hq: "UK / Global",
          indiaPrice: "INR 1,400-3,200 per user",
          globalPrice: "USD 19-39 per user (Pro)",
          strength:
            "Purpose-built snagging; mobile-first; good photo annotation",
          weakness:
            "Global focus, not India-specific; limited checklist configuration depth; no data sovereignty",
          sovereignty: "No - SnagR cloud",
          segment: "SME Construction firms, UK and Europe",
        },
        {
          name: "SafetyCulture (iAuditor)",
          hq: "Australia / Global",
          indiaPrice: "INR 2,500-5,000 per user",
          globalPrice: "USD 24+ per user",
          strength:
            "Largest template library; safety and quality combined; easy to use",
          weakness:
            "Not purpose-built for real estate snagging; limited stage gate; no handover management",
          sovereignty: "No - SafetyCulture cloud",
          segment: "Safety teams, field audits across industries",
        },
        {
          name: "Fieldwire",
          hq: "USA / Global",
          indiaPrice: "INR 2,800-4,300 per user",
          globalPrice: "USD 39-59 per user",
          strength:
            "Hyperlinked floor plans; strong field task management; good mobile UX",
          weakness:
            "Not snagging-specific; no positive/negative scoring; no data sovereignty",
          sovereignty: "No - Fieldwire cloud",
          segment: "Mid-large GCs, US-centric",
        },
        {
          name: "Snapdit",
          hq: "UK / Global",
          indiaPrice: "INR 1,200-2,800 per user",
          globalPrice: "USD 15-30 per user",
          strength: "Simple punch list tool; photo signatures; easy onboarding",
          weakness:
            "Limited workflow depth; no enterprise integrations; no multi-stage configuration",
          sovereignty: "No - Snapdit cloud",
          segment: "Small construction firms, punch list focused",
        },
        {
          name: "NYGGS Construction ERP",
          hq: "India / India",
          indiaPrice: "INR 1,000-3,000 per user",
          globalPrice: "Not priced globally",
          strength: "Affordable India-built ERP; broad construction modules",
          weakness:
            "Not snagging-specific; quality module is basic; no photo annotation or ad-hoc logging",
          sovereignty: "No - NYGGS cloud",
          segment: "SME contractors, India tier-2 cities",
        },
        {
          name: "GoCanvas",
          hq: "USA / Global",
          indiaPrice: "INR 2,000-4,500 per user",
          globalPrice: "USD 25-45 per user",
          strength:
            "Mobile forms builder; flexible inspection templates; offline capable",
          weakness:
            "Generic forms tool; not construction-specific; no workflow engine or stage gates",
          sovereignty: "No - GoCanvas cloud",
          segment: "Field inspection teams, multi-industry",
        },
      ],
      competitorSummary:
        "Snag 360 is the ONLY India-built snagging platform offering on-premise data sovereignty + ad-hoc snag logging + multi-stage multi-level configurable checklists + positive/negative scoring. FalconBrick is nearest India competitor but lacks 4 of 8 USP features. Procore and ACC are over-engineered for pure QC use cases and priced 3-5x above Snag 360 target positioning.",
    },
    detailedPricing: {
      isSnagPricing: true,
      snagFeatureComparison: [
        {
          feature: "On-premise / client-side data storage",
          snag360: "Yes - core architecture",
          falconBrick: "No",
          procore: "No",
          novade: "No",
          snagR: "No",
          safetyCulture: "No",
          status: "AHEAD",
        },
        {
          feature: "Ad-hoc snag logging outside checklist",
          snag360: "Yes - USP feature",
          falconBrick: "No",
          procore: "Partial",
          novade: "No",
          snagR: "Yes",
          safetyCulture: "No",
          status: "AHEAD",
        },
        {
          feature: "Multi-stage project configuration",
          snag360: "Yes - unlimited stages",
          falconBrick: "Yes",
          procore: "Yes",
          novade: "Yes",
          snagR: "Limited",
          safetyCulture: "No",
          status: "AT PAR",
        },
        {
          feature: "Multi-level checkpoints per stage",
          snag360: "Yes - USP feature",
          falconBrick: "No",
          procore: "Yes",
          novade: "Yes",
          snagR: "No",
          safetyCulture: "No",
          status: "AHEAD",
        },
        {
          feature: "Positive / negative scoring engine",
          snag360: "Yes - USP feature",
          falconBrick: "No",
          procore: "No",
          novade: "No",
          snagR: "No",
          safetyCulture: "No",
          status: "AHEAD",
        },
        {
          feature: "Photo annotation (in-app)",
          snag360: "Yes - arrows, text, circles",
          falconBrick: "No",
          procore: "Yes",
          novade: "Yes",
          snagR: "Yes",
          safetyCulture: "Yes",
          status: "AT PAR",
        },
        {
          feature: "Dynamic workflow engine (stage gates)",
          snag360: "Yes - USP feature",
          falconBrick: "Partial",
          procore: "Yes",
          novade: "Yes",
          snagR: "No",
          safetyCulture: "No",
          status: "AT PAR",
        },
        {
          feature: "Real-time live dashboard",
          snag360: "Yes - USP feature",
          falconBrick: "Yes",
          procore: "Yes",
          novade: "Yes",
          snagR: "Limited",
          safetyCulture: "Yes",
          status: "AT PAR",
        },
        {
          feature: "DPR auto-generation",
          snag360: "Yes",
          falconBrick: "Yes",
          procore: "No",
          novade: "Yes",
          snagR: "No",
          safetyCulture: "No",
          status: "AHEAD",
        },
        {
          feature: "FM handover support module",
          snag360: "Yes",
          falconBrick: "No",
          procore: "No",
          novade: "Yes",
          snagR: "No",
          safetyCulture: "No",
          status: "AHEAD",
        },
        {
          feature: "Pre-handover inspection workflow",
          snag360: "Yes",
          falconBrick: "Yes",
          procore: "Yes",
          novade: "Yes",
          snagR: "No",
          safetyCulture: "No",
          status: "AT PAR",
        },
        {
          feature: "Enterprise integrations (SAP, SFDC)",
          snag360: "Yes",
          falconBrick: "No",
          procore: "Yes",
          novade: "Yes",
          snagR: "No",
          safetyCulture: "No",
          status: "AT PAR",
        },
        {
          feature: "Offline mobile functionality",
          snag360: "Partial",
          falconBrick: "Partial",
          procore: "Yes",
          novade: "Yes",
          snagR: "Yes",
          safetyCulture: "Yes",
          status: "GAP",
        },
        {
          feature: "BIM floor plan integration",
          snag360: "No",
          falconBrick: "No",
          procore: "Yes",
          novade: "Yes",
          snagR: "No",
          safetyCulture: "No",
          status: "GAP",
        },
        {
          feature: "AI defect detection from photos",
          snag360: "No",
          falconBrick: "No",
          procore: "Yes (Procore Insights)",
          novade: "Partial",
          snagR: "No",
          safetyCulture: "No",
          status: "GAP",
        },
        {
          feature: "Multilingual support (Hindi, regional)",
          snag360: "No",
          falconBrick: "No",
          procore: "No",
          novade: "Yes",
          snagR: "No",
          safetyCulture: "No",
          status: "AT PAR",
        },
        {
          feature: "India RERA compliance features",
          snag360: "Partial",
          falconBrick: "Yes",
          procore: "No",
          novade: "No",
          snagR: "No",
          safetyCulture: "No",
          status: "AT PAR",
        },
      ],
      pricingLandscapeRows: [
        {
          tier: "Snag 360 - Starter",
          model: "Per user per month (annual billing)",
          indiaPrice: "INR 600-1,200",
          globalPrice: "USD 8-15",
          included:
            "Up to 3 projects, basic checklist, snag management, standard dashboard",
          segment: "Boutique developers, small EPC firms, pilot projects",
        },
        {
          tier: "Snag 360 - Professional",
          model: "Per user per month (annual billing)",
          indiaPrice: "INR 1,500-2,500",
          globalPrice: "USD 18-30",
          included:
            "Unlimited projects, multi-stage config, ad-hoc logging, photo annotation, DPR, real-time dashboard",
          segment: "Mid-size real estate developers, EPC contractors",
        },
        {
          tier: "Snag 360 - Enterprise",
          model: "Custom annual contract",
          indiaPrice: "INR 3,000-6,000+",
          globalPrice: "USD 35-70+",
          included:
            "All features + SAP/SFDC integrations, on-premise deployment, SLA support, custom reporting, upsell",
          segment:
            "Large developers (top 100), government EPC, FM organizations",
        },
        {
          tier: "FalconBrick (benchmark)",
          model: "Per user per month",
          indiaPrice: "INR 1,500-4,000",
          globalPrice: "Not available globally",
          included:
            "Construction management + basic QC; limited snagging depth",
          segment: "Residential real estate India",
        },
        {
          tier: "Procore (benchmark)",
          model: "Annual contract per user",
          indiaPrice: "INR 8,000-15,000",
          globalPrice: "USD 99+ (custom)",
          included:
            "Full construction PM + snagging; deep integrations; complex setup",
          segment: "Large GCs, global real estate",
        },
        {
          tier: "SnagR (benchmark)",
          model: "Per user per month",
          indiaPrice: "INR 1,400-3,200",
          globalPrice: "USD 19-39",
          included:
            "Purpose-built snagging; mobile-first; no workflow engine depth",
          segment: "SME construction, UK/Europe focus",
        },
        {
          tier: "SafetyCulture (benchmark)",
          model: "Per user per month",
          indiaPrice: "INR 2,500-5,000",
          globalPrice: "USD 24+",
          included:
            "Safety and quality audits; template library; not snagging-specific",
          segment: "Safety teams, multi-industry",
        },
      ],
      competitivePositioningStatement:
        "Snag 360 occupies the PRECISION COMPLIANCE quadrant: purpose-built snagging depth at mid-market price, with on-premise data sovereignty that no other competitor offers. Against FalconBrick: Snag 360 wins on workflow sophistication and data control. Against Procore/ACC: Snag 360 wins on price, simplicity, and deployment speed. Against SnagR/SafetyCulture: Snag 360 wins on India-market fit, data sovereignty, and handover management depth. No other product in the market simultaneously delivers all four USPs: on-premise storage + ad-hoc logging + multi-level scoring + dynamic stage gates.",
      valueProps: [
        {
          role: "Quality Head / VP Projects",
          prop: "Eliminate project handover delays caused by untracked snags and failed quality gates",
          outcome:
            "30-40% reduction in snag backlog at handover; 2-3 week faster final completion",
          feature: "Dynamic Workflow Engine + Real-time Dashboard",
        },
        {
          role: "Site Inspector",
          prop: "Replace paper checklists and WhatsApp photos with structured, evidence-backed digital logging",
          outcome:
            "3-5 hours saved per day per site team; zero lost snag records",
          feature: "Ad-hoc Snag Logging + Photo Annotation",
        },
        {
          role: "Project Head / MD",
          prop: "Real-time visibility into quality health across all projects without manual reporting",
          outcome:
            "Zero surprise defect discoveries at customer walkthrough; RERA complaint risk reduced",
          feature: "Real-time Dashboard + Stage Gate Validation",
        },
        {
          role: "IT / CIO",
          prop: "Deploy quality management software with all data on company-owned servers - no third-party cloud exposure",
          outcome:
            "Full data sovereignty; passes internal security audit; no vendor lock-in on data",
          feature: "On-premise architecture + SAP/SFDC integration",
        },
        {
          role: "FM Head",
          prop: "Receive fully documented digital handover package with full snag history and quality scores per unit",
          outcome:
            "FM onboarding time reduced by 50%; maintenance team has complete unit history from day one",
          feature: "FM Handover Support + HOTO Module",
        },
      ],
    },
    featuresAndPricing: {
      overview:
        "Flexible pricing models designed to scale with your project needs, from single projects to enterprise deployments.",
      tiers: [
        {
          tier: "Starter",
          price: "₹25,000/project",
          features: [
            "Up to 100 units",
            "Basic defect management",
            "Standard reports",
            "Email support",
            "3 user licenses",
          ],
        },
        {
          tier: "Professional",
          price: "₹75,000/project",
          features: [
            "Up to 500 units",
            "Advanced workflow configuration",
            "Custom dashboards",
            "Priority support",
            "10 user licenses",
            "API access",
          ],
        },
        {
          tier: "Enterprise",
          price: "Custom Pricing",
          features: [
            "Unlimited units",
            "White-label option",
            "Dedicated account manager",
            "Custom integrations",
            "Unlimited users",
            "SLA guarantees",
            "On-premise deployment option",
          ],
        },
      ],
      addOns: [
        "Additional user licenses - ₹2,000/user/month",
        "Custom report builder - ₹15,000 one-time",
        "API integration support - ₹25,000",
        "Training sessions - ₹10,000/session",
        "Dedicated support - ₹20,000/month",
      ],
    },
    detailedUseCases: {
      industryUseCases: [
        {
          rank: 1,
          industry: "Residential Real Estate Development",
          useCase:
            "RERA-compliant pre-handover inspection for apartment units before customer possession",
          workflow:
            "1. Quality Head configures pre-handover stage and checklist in web portal. 2. Inspector does room-by-room walkthrough using mobile app, marking each checkpoint pass/fail. 3. Any fail raises a snag with annotated photo, assigned to repair team. 4. Repair team marks fix complete; supervisor verifies on-site. 5. Stage gate validates all snags closed before handover clearance. 6. Digital handover certificate generated with full audit trail.",
          features:
            "Multi-stage Configuration, Stage Gate Validation, Photo Annotation, FM Handover Support, Real-time Dashboard",
          outcome:
            "Zero snag backlog at customer walkthrough; RERA complaint rate reduced; handover documentation ready in one click",
        },
        {
          rank: 2,
          industry: "EPC Contractors and Infrastructure Firms (EPCE)",
          useCase:
            "Multi-site quality monitoring across highway, bridge, or large infrastructure project stages",
          workflow:
            "1. Project Director configures stages: Earthwork, Foundation, Structure, MEP, Finishing. 2. Multiple inspector teams assigned per zone. 3. Each team logs snags and completes checklists daily from field via mobile app. 4. Supervisors review dashboard for open snags across all zones. 5. DPR auto-generated at day-end and emailed to client PMC. 6. Stage gates ensure no zone advances to next phase without clearing current stage.",
          features:
            "Multi-stage Configuration, Multi-level Checkpoints, Dynamic Workflow Engine, DPR and Reporting, Real-time Dashboard",
          outcome:
            "Structured quality audit trail for client and government submission; reduced rework; stage-by-stage delivery proof",
        },
        {
          rank: 3,
          industry: "Commercial Real Estate (Office, Retail, Hospitality)",
          useCase:
            "Pre-occupancy snagging for Grade A corporate office or retail fit-out before tenant handover",
          workflow:
            "1. Project Manager sets up office fit-out stages: MEP rough-in, Ceiling, Flooring, Partitions, AV-IT, Final Clean. 2. Inspector logs snags per zone with severity tags (critical, major, minor). 3. Positive/negative scoring tracks quality score per zone against tenant SLA minimum. 4. FM Head reviews FM Handover Support package before tenant walkthrough. 5. Any critical open snags block handover clearance automatically.",
          features:
            "Positive/Negative Marking, Ad-hoc Snag Logging, Stage Gate Validation, FM Handover Support",
          outcome:
            "Tenant handover on time; zero critical snags at occupancy; SLA compliance documented",
        },
        {
          rank: 4,
          industry: "Industrial and Warehousing Construction (Warehousing)",
          useCase:
            "MEP and civil quality inspection for large-format logistics park units before occupancy",
          workflow:
            "1. Quality Manager configures warehouse-specific checklist: civil slab, dock levelers, fire suppression, electrical, CCTV, HVAC. 2. Inspector completes checklist per bay and raises snags for non-conformances. 3. Ad-hoc snag logging captures defects like cracked panels or alignment issues not in checklist. 4. Snags assigned to relevant trade contractor for repair. 5. Pre-handover inspection stage confirms all bays are defect-free before tenant possession.",
          features:
            "Checklist-based Inspection, Ad-hoc Snag Logging, Multi-role Snag Workflow, Pre-handover Inspection",
          outcome:
            "Zero tenant complaints at possession; warranty claims data available from day one; trade contractor accountability tracked",
        },
        {
          rank: 5,
          industry: "Facility Management",
          useCase:
            "Post-handover snag tracking and asset condition documentation for FM takeover",
          workflow:
            "1. FM team completes HOTO walkthrough of all units using Snag 360 HOTO module. 2. Any post-handover defects raised as snags and assigned to developer for warranty resolution. 3. FM team documents all asset conditions with photos at takeover. 4. FM Matrix module tracks ongoing maintenance tickets linked to original snag history. 5. Reporting shows open warranty claims by category for monthly developer review.",
          features:
            "FM Handover Support, HOTO Module, FM Matrix, Photo Annotation, DPR and Reporting",
          outcome:
            "Clean asset records from day one of FM operations; warranty recovery tracked; dispute resolution backed by evidence",
        },
        {
          rank: 6,
          industry: "Government and Public Infrastructure (EPCE)",
          useCase:
            "Third-party quality audit documentation for PWD or NHAI project inspections",
          workflow:
            "1. PMC inspector team configured with read-only access for third-party audit role. 2. Inspectors log snags independently from site team with same platform. 3. Supervisor and PMC can compare site team findings vs third-party findings. 4. Stage gates require PMC sign-off before government billing milestone is triggered. 5. Audit trail exportable as evidence for government review and payment certification.",
          features:
            "Multi-role Snag Workflow, Stage Gate Validation, Dynamic Workflow Engine, Evidence Capture, DPR and Reporting",
          outcome:
            "Payment milestone certification backed by digital quality evidence; third-party audit integrated into workflow; dispute-proof audit trail",
        },
        {
          rank: 7,
          industry: "Healthcare and Education Facility Construction (EPCE)",
          useCase:
            "Infection control and finish quality inspection for hospital or university construction before commissioning",
          workflow:
            "1. Project Manager sets up commissioning stages specific to healthcare: Civil, MEP, Medical Gas, Clean Room, Infection Control, Final Walkthrough. 2. Inspectors complete specialized checklists with zero-tolerance thresholds on infection control points. 3. Positive/negative scoring flags any unit below minimum score for re-inspection. 4. Safety compliance tracking monitors fire safety and emergency system checkpoints. 5. Full commissioning evidence package generated for hospital operations team.",
          features:
            "Multi-stage Configuration, Positive/Negative Marking, Safety Compliance Tracking, Multi-level Checkpoints",
          outcome:
            "Hospital commissioning sign-off backed by complete inspection evidence; zero infection control non-conformances at opening",
        },
        {
          rank: 8,
          industry: "Data Center and Technology Campus Construction (IT/ITES)",
          useCase:
            "Precision commissioning inspection for raised floor, cooling, power, and cable management before go-live",
          workflow:
            "1. Technical project manager configures data center-specific stages: Civil, Power Infrastructure, Cooling, Raised Floor, Cabling, UPS, Fire Suppression, Testing. 2. Inspectors complete multi-level checkpoints per rack zone. 3. Any deviation from tolerance spec raises a critical snag with annotated photo. 4. Stage gate requires 100% checkpoint pass rate (no threshold tolerance) before proceeding. 5. SAP integration syncs commissioning milestones with client ERP for billing.",
          features:
            "Multi-level Checkpoints, Dynamic Workflow Engine, Stage Gate Validation, Enterprise Integrations (SAP), Photo Annotation",
          outcome:
            "Data center go-live with zero mechanical or electrical non-conformances; audit trail meets international TIA-942 standards",
        },
        {
          rank: 9,
          industry: "Affordable Housing (PMAY, State Housing Schemes)",
          useCase:
            "Bulk unit inspection and government compliance documentation for state housing authority delivery",
          workflow:
            "1. State PMC configures standardized inspection checklist across all units (500+ units per project). 2. Inspector teams work in parallel across buildings using mobile app offline-capable mode. 3. Daily inspection progress uploaded and consolidated in real-time dashboard. 4. DPR submitted to state authority as compliance evidence for payment tranche release. 5. Handover package generated per unit for resident possession record.",
          features:
            "Checklist-based Inspection, DPR and Reporting, Real-time Dashboard, Pre-handover Inspection, Time-saving Automation",
          outcome:
            "Government compliance documentation delivered on schedule; payment tranche released without audit disputes; 500+ unit inspection managed with 5-person quality team",
        },
        {
          rank: 10,
          industry: "SEZs and Industrial Parks (SEZ/ IT Parks)",
          useCase:
            "Multi-building phased delivery inspection with tenant-specific punch lists before lease commencement",
          workflow:
            "1. Park developer configures tenant-specific finish checklist per unit (office, manufacturing, cold storage). 2. Inspectors complete checklists per unit with tenant rep present during final walkthrough. 3. Tenant can raise their own punch list items via a shared link (reviewer access only). 4. All tenant punch list items tracked to closure before lease commencement certificate issued. 5. FM handover documentation generated per building.",
          features:
            "Multi-stage Configuration, Ad-hoc Snag Logging, Multi-role Snag Workflow, FM Handover Support, Real-time Dashboard",
          outcome:
            "Lease commencement without post-possession disputes; tenant satisfaction score improved; legal liability reduced with documented sign-off",
        },
      ],
      internalTeamUseCases: [
        {
          team: "Quality Control / QC Team",
          usage:
            "Primary daily users: configure checklists, conduct inspections, log snags, close defects, generate DPRs. Snag 360 is their primary work tool on-site.",
          problem:
            "Paper checklists, WhatsApp photo sharing, manual Excel snag registers, verbal follow-up with repair teams",
          features:
            "Checklist-based Inspection, Ad-hoc Snag Logging, Photo Annotation, Multi-role Snag Workflow",
          gain: "3-5 hours saved daily per team; 100% snag traceability; real-time closure without manual follow-up",
        },
        {
          team: "Site Engineering / Project Execution Team",
          usage:
            "Receive assigned snags for repair, mark completion, attach repair evidence photos, get re-verification from supervisor.",
          problem:
            "WhatsApp messages for defect assignment, no digital proof of repair, verbal sign-off from supervisors",
          features:
            "Multi-role Snag Workflow, Photo Annotation, Evidence Capture",
          gain: "Faster repair cycle; repair team accountability; no dispute on whether repair was done",
        },
        {
          team: "Project Management Office (PMO)",
          usage:
            "Monitor overall quality health via dashboard, generate weekly and monthly quality reports, track stage gate progress across portfolio.",
          problem:
            "Manual collection of Excel reports from site teams, weekly calls to check status, reactive management",
          features:
            "Real-time Dashboard, Progress Tracking, DPR and Reporting, Stage Gate Validation",
          gain: "Weekly status reporting automated; portfolio-level quality score visible in real time; proactive intervention possible",
        },
        {
          team: "Facility Management Team",
          usage:
            "Use HOTO and FM Handover Support modules to receive and document asset condition at project handover. Raise post-handover warranty snags.",
          problem:
            "Paper-based takeover checklist, photos stored on personal phones, no link between construction snags and FM records",
          features:
            "FM Handover Support, HOTO Module, FM Matrix, Evidence Capture",
          gain: "FM onboarding 50% faster; complete digital asset history from day one; warranty claim evidence available instantly",
        },
        {
          team: "Customer Service / CRM Team",
          usage:
            "Access handover documentation and snag history per unit to resolve customer complaints post-possession. SFDC integration links snag data to customer records.",
          problem:
            "Customer complaints handled without construction data context; manual lookup of snag history per unit",
          features:
            "Enterprise Integrations (SFDC), Pre-handover Inspection, Evidence Capture",
          gain: "Customer complaint resolution time reduced; complaint context available instantly from CRM; RERA response time improved",
        },
        {
          team: "IT / Technology Team",
          usage:
            "Deploy Snag 360 on client-owned server infrastructure, manage user access, integrate with SAP ERP, configure SSO for enterprise users.",
          problem:
            "Multiple point tools with cloud-hosted data; security compliance gaps; no single source of truth for QC data",
          features:
            "Enterprise Integrations (SAP, SFDC), On-premise deployment architecture",
          gain: "Data sovereignty compliance achieved; single secure deployment; IT audit passed without data residency concerns",
        },
        {
          team: "Top Management / CXO",
          usage:
            "Review executive dashboard for portfolio-level quality score, handover readiness, and compliance risk. No operational intervention needed.",
          problem:
            "Reliance on manual MD presentations for quality status; surprised by snag discoveries at customer walkthroughs",
          features:
            "Real-time Dashboard, DPR and Reporting, Stage Gate Validation",
          gain: "Zero surprise defect escalations; board-level quality reporting available on demand; RERA risk quantified and managed",
        },
      ],
    },

    detailedBusinessPlan: {
      planQuestions: [
        {
          id: "Q1",
          question: "What problem does Snag 360 solve and for whom?",
          answer:
            "We solve the defect management and pre-handover quality control problem for real estate developers and EPC contractors in India. Today, site QC teams manage snag lists on paper, WhatsApp, and Excel. This causes lost records, unassigned defects, and missed handover deadlines. Under India's RERA, developers are liable for construction defects for up to 5 years. We eliminate this risk by giving site inspectors a mobile-first platform to raise, assign, track, and close defects in real time - with photo evidence, stage-gate controls, and a full audit trail. Our primary buyers are quality heads and project heads at India's top 200 real estate developers and EPC firms.",
          source: "Tab 1, Tab 5",
          flag: "Ready to use as-is",
        },
        {
          id: "Q2",
          question: "What is the total addressable market and our beachhead?",
          answer:
            "The global Construction Quality Management Software market is valued at USD 1.2 billion in 2024 and projected to reach USD 3.8 billion by 2033 at 13.7% CAGR, with Asia Pacific growing fastest at 16.2%. India's construction market stands at USD 0.79 trillion in 2026 and is forecast to reach USD 1.10 trillion by 2031. Our India TAM for snagging and quality inspection software covers the top 500 real estate developers, 200+ large EPC contractors, and state housing authorities - approximately 2,000+ potential enterprise accounts at INR 5-25 Lakh per account annually. Our beachhead is mid-size residential real estate developers with 3-10 active projects in Maharashtra, Karnataka, and Telangana, where RERA enforcement is strongest.",
          source: "Tab 3",
          flag: "Requires founder input: Validate current active account count and pipeline by state",
        },
        {
          id: "Q3",
          question: "Who are our top competitors and how do we win?",
          answer:
            "Our top 3 competitors are FalconBrick (India), Procore (USA), and SnagR (UK). FalconBrick is our nearest India competitor but lacks ad-hoc snag logging, positive/negative scoring, and multi-level checkpoints. Procore and Autodesk ACC are comprehensive construction PM platforms - overpriced and over-engineered for pure quality inspection use cases, and they store all client data on their own servers. We win on four dimensions no single competitor matches: on-premise data sovereignty, ad-hoc defect logging, multi-level configurable scoring, and India-specific RERA workflow. Our price is 3-5x below Procore and 30-40% below FalconBrick at equivalent feature depth.",
          source: "Tab 3, Tab 4",
          flag: "Ready to use as-is",
        },
        {
          id: "Q4",
          question: "What is our pricing model and revenue structure?",
          answer:
            "We price on a SaaS subscription model with three tiers. Starter at INR 600-1,200 per user per month for teams with up to 3 projects. Professional at INR 1,500-2,500 per user per month with unlimited projects and all core USP features. Enterprise at INR 3,000-6,000+ per user per month with on-premise deployment, SAP/SFDC integrations, and custom SLA. A typical mid-size developer with 50 inspectors on Professional plan generates INR 9-15 Lakh ARR. Upsell modules - HOTO, FM Matrix, Cleaning, Hi-Society - add 15-30% to base contract value. Enterprise SAP integration is a custom pricing add-on.",
          source: "Tab 4",
          flag: "Requires founder input: Confirm current active ACV range from existing customer contracts",
        },
        {
          id: "Q5",
          question:
            "What are our top 3 target industries and what use case do we sell?",
          answer:
            "Our top three target industries are: (1) Residential Real Estate Development - RERA-compliant pre-handover inspection; (2) EPC Contractors and Infrastructure - multi-site quality monitoring with stage-gate control; and (3) Commercial Real Estate - pre-occupancy snagging for Grade A offices and retail. In residential real estate, we position around RERA compliance and zero customer complaints at handover. In EPC, we position around government audit documentation and payment milestone certification. In commercial real estate, we position around tenant SLA compliance and FM handover quality.",
          source: "Tab 5, Tab 3",
          flag: "Ready to use as-is",
        },
        {
          id: "Q6",
          question: "What is our go-to-market motion in the first 90 days?",
          answer:
            "Our 90-day GTM focuses on three actions. First, we activate 5 reference pilot deployments at mid-size Mumbai and Bengaluru residential developers through direct outreach by the founding team. Pilots are free for 60 days with a paid conversion target. Second, we run LinkedIn content targeting quality heads and VP Projects at India's top 100 developers - content topics: RERA compliance, snag management best practices, paper vs digital inspection productivity. Third, we partner with 2-3 PMC firms as channel partners who embed Snag 360 in their site quality service offering, creating a referral pipeline. Target: 10 paid accounts by day 90, INR 50-80 Lakh ARR by month 6.",
          source: "Tab 8",
          flag: "Requires founder input: Confirm which pilot accounts are targeted; confirm PMC partnership conversations underway",
        },
        {
          id: "Q7",
          question: "What is our primary competitive moat?",
          answer:
            "Our moat is built on three layers. Layer 1 is data sovereignty - we store all client data on the client's own servers, not on Lockated infrastructure. This is a technically unique architecture in our category and passes enterprise and government IT security audits that block our competitors. Layer 2 is workflow depth - our combination of multi-level checkpoints, positive/negative scoring, and dynamic stage-gate engine creates configuration richness that generic snagging tools cannot replicate without a complete rebuild. Layer 3 is India-market embeddedness - RERA compliance reports, Hindi language support (roadmap Q2 2026), and state housing authority formats create localization barriers for global competitors.",
          source: "Tab 1, Tab 4, Tab 6",
          flag: "Ready to use as-is",
        },
        {
          id: "Q8",
          question: "What are the 3 biggest risks and how do we mitigate them?",
          answer:
            "Risk 1: FalconBrick accelerates product development and closes feature gap. Mitigation: We accelerate AI photo detection and BIM integration (Phase 2) to widen the gap before FalconBrick can respond. Risk 2: Procore or Autodesk launches a low-cost India-specific snagging SKU. Mitigation: Data sovereignty architecture cannot be replicated by cloud-native competitors without rebuilding their infrastructure. This is a structural moat, not a feature race. Risk 3: Enterprise IT procurement cycles are too slow for our cash flow plan. Mitigation: We target mid-market accounts (INR 5-15 Lakh ACV) with a 30-day pilot to paid conversion model, reducing reliance on 6-12 month enterprise procurement cycles.",
          source: "Tab 10, Tab 3",
          flag: "Requires founder input: Validate current enterprise sales cycle length from existing deals",
        },
        {
          id: "Q9",
          question: "What does success look like at 12 and 36 months?",
          answer:
            "At 12 months: 50 paying accounts, INR 3-5 Cr ARR, Net Revenue Retention above 110%, average contract value INR 8-12 Lakh. At least 3 logo accounts from top 50 India real estate developers. Phase 1 roadmap (offline mode, Hindi UI, RERA report pack) fully shipped. At 36 months: 200+ paying accounts, INR 18-25 Cr ARR, Southeast Asia and UK launched with 20+ global accounts, BIM integration live, AI photo detection shipped. Strategic partnership with 1 major India real estate ERP vendor for OEM licensing. Government RERA API pilot live with 1 state authority.",
          source: "Tab 9, Tab 6",
          flag: "Requires founder input: Validate 12-month revenue target against current sales pipeline",
        },
        {
          id: "Q10",
          question: "What is the investor and partner case?",
          answer:
            "For investors: Snag 360 operates in a USD 3.8 billion global market growing at 13.7% CAGR with no India-first, data-sovereign competitor at scale. India's construction boom (USD 0.79 Tn, 6.87% CAGR to 2031) combined with RERA enforcement creates a mandatory market for quality documentation software. We have product-market fit in residential real estate and a clear roadmap to EPC, commercial, and government segments. Our on-premise architecture creates customer stickiness (high switching cost) and passes IT security requirements that block all cloud-native competitors from India's government and BFSI-adjacent construction market. For partners: System integrators and PMC firms benefit from embedding Snag 360 in their service delivery, reducing quality reporting labor cost by 3-5 hours per site per day while offering clients a digital quality guarantee.",
          source: "Tab 1, Tab 3",
          flag: "Requires founder input: Add current customer testimonials and specific ROI data from reference accounts to strengthen investor narrative",
        },
      ],
      founderChecklist: [
        {
          id: "Q2",
          item: "Current active account count and pipeline by state",
          verify:
            "Pull from CRM: how many paying accounts today, which states, what ARR per state",
          status: "Pending",
        },
        {
          id: "Q4",
          item: "Current active ACV range from existing customer contracts",
          verify:
            "Pull from finance: current annual contract values by tier; average per account",
          status: "Pending",
        },
        {
          id: "Q6",
          item: "Target pilot account names and PMC partnership conversations",
          verify:
            "Name the 5 pilot targets; confirm which PMC conversations are active; set 90-day milestones",
          status: "Pending",
        },
        {
          id: "Q8",
          item: "Current enterprise sales cycle length from existing deals",
          verify:
            "Pull average time from first contact to signed contract from 3 most recent enterprise deals",
          status: "Pending",
        },
        {
          id: "Q9",
          item: "12-month ARR target validation against current pipeline",
          verify:
            "Review current pipeline value; confirm 12-month target is achievable with 50% conversion assumption",
          status: "Pending",
        },
        {
          id: "Q10",
          item: "Customer testimonials and specific ROI data from reference accounts",
          verify:
            "Collect: % rework reduction, hours saved per week, snag closure time improvement from 3 live accounts",
          status: "Pending",
        },
      ],
    },
    detailedGTM: {
      targetGroups: [
        {
          id: "TG1",
          title: "TG1: RERA-Obligated Residential Real Estate Developers",
          components: [
            {
              component: "Why This TG",
              detail:
                "Snag 360's strongest product-market fit is with residential real estate developers who are legally required under RERA to deliver defect-free units and maintain quality documentation for 5 years post-handover. RERA enforcement has created a hard compliance driver - making quality management software a legal necessity, not a discretionary purchase. This TG has the highest urgency and lowest education requirement.",
            },
            {
              component: "Sales Motion",
              detail:
                "Direct outreach by founding team to VP Projects and Quality Heads at India's top 200 residential developers. Pilot-to-paid model: 60-day free pilot for 1 project, conversion on full account. Target account list: top 50 developers by units delivered in FY25 (DLF, Godrej Properties, Sobha, Prestige, Brigade, Mahindra Lifespaces, Lodha, Oberoi, Puravankara, Birla Estates). Decision maker: Quality Head + Project Head. Economic buyer: VP Projects or COO.",
            },
            {
              component: "Marketing Channels",
              detail:
                "LinkedIn content targeting Quality Heads and VP Projects (not generic construction content). Topics: RERA snag documentation requirements, pre-handover inspection checklists, cost of rework per unit. WhatsApp broadcast to CREDAI Maharashtra and CREDAI Karnataka member developers. Webinar partnership with CREDAI on RERA quality compliance best practices. Case study production with 2 reference accounts after pilot.",
            },
            {
              component: "90-Day Launch Sequence",
              detail:
                "Days 1-30: Identify and outreach 50 target accounts. Secure 5 pilot agreements. Deploy pilots with dedicated onboarding. Days 31-60: Complete pilot onboarding; begin 60-day pilot period; collect usage data and ROI metrics. Days 61-90: Convert pilots to paid; use metrics to build case study; launch LinkedIn content series; present at 1 CREDAI event.",
            },
            {
              component: "Partnership Strategy",
              detail:
                "CREDAI (Confederation of Real Estate Developers Associations) - industry body with 12,000+ member developers. RERA consultancy firms who advise developers on compliance. PropTech integration partners like NoBroker Works and NestAway who interact with same buyer base.",
            },
          ],
          summaryBox:
            "TG SUMMARY BOX: TG1 is Snag 360's fastest path to first 20 paying accounts. The RERA compliance obligation removes the 'why do I need this' objection entirely. The founding team sells direct to the top 200 developers with a pilot-led motion. Key assumption: at least 10 of 50 outreached accounts agree to a 60-day pilot. The metric that tells us it is working: pilot-to-paid conversion rate above 60% within 90 days of pilot start.",
        },
        {
          id: "TG2",
          title:
            "TG2: EPC Contractors and Infrastructure PMCs Requiring Government Audit Documentation",
          components: [
            {
              component: "Why This TG",
              detail:
                "EPC contractors working on government infrastructure (NHAI highways, metro rail, state PWD, PMAY housing) face mandatory quality audit documentation as a condition for payment milestone certification. Paper-based QC is increasingly rejected in government audits. This TG has high deal value (INR 20-50 Lakh per account) and long retention (multi-project cycles). The on-premise data sovereignty architecture is critical for this TG as government contracts often prohibit third-party cloud storage of project data.",
            },
            {
              component: "Sales Motion",
              detail:
                "Direct enterprise sales to Quality Directors and Project Directors at top 20 EPC contractors (L&T, Tata Projects, Megha Engineering, NCC, KEC, Ahluwalia Contracts, J Kumar, Dilip Buildcon). Average 3-6 month sales cycle. Pilot on 1 active site before full account commitment. SAP integration demonstration is key for larger EPC firms. On-premise deployment architecture presented as a security and compliance feature, not a technical limitation.",
            },
            {
              component: "Marketing Channels",
              detail:
                "Speaking slots and booth at CII Construction Summit and NBO (National Buildings Organisation) events. Technical white paper: 'Data Sovereignty in Government Construction: Why Cloud is Not an Option'. LinkedIn content targeting Quality Directors and Project Directors. Direct email campaign through PMC (Project Management Consulting) network - RITES, TCIL, STUP, IL&FS Engineering are influential referrers.",
            },
            {
              component: "90-Day Launch Sequence",
              detail:
                "Days 1-30: Map top 20 EPC account decision makers via LinkedIn and PMC network introductions. Schedule 10 discovery calls. Days 31-60: Present on-premise architecture and SAP integration to IT and Quality teams at 5 priority accounts. Begin 1 site pilot at most responsive account. Days 61-90: Generate pilot ROI report showing inspection hours saved and audit documentation quality improvement. Begin 2 additional pilots. Submit 1 full enterprise proposal.",
            },
            {
              component: "Partnership Strategy",
              detail:
                "PMC firms (RITES, STUP, Jacobs, Mott MacDonald India) as channel partners who specify Snag 360 as quality management platform on government project bids. SAP Implementation Partners (Deloitte India, TCS, Wipro SAP practice) as integration referral partners. NIC (National Informatics Centre) for government digital quality initiative alignment.",
            },
          ],
          summaryBox:
            "TG SUMMARY BOX: TG2 is Snag 360's highest ACV opportunity in India. Government EPC accounts have 5-7 year project lifecycles and expand by adding new projects on the same platform. The on-premise architecture is the single strongest competitive advantage in this segment - no competitor can match it for government IT compliance. Key assumption: at least 1 of the top 10 EPC firms signs an enterprise deal within 6 months. The metric that tells us it is working: average deal size above INR 20 Lakh within 3 signed EPC accounts.",
        },
        {
          id: "TG3",
          title:
            "TG3: Global Residential Developers and Housebuilders in UK and Southeast Asia",
          components: [
            {
              component: "Why This TG",
              detail:
                "UK has a statutory snagging requirement under the Building Safety Act 2022 and NHBC Buildmark warranty scheme, creating the same RERA-equivalent compliance driver as India. Singapore's Building and Construction Authority (BCA) mandates quality assurance documentation on all residential projects. Both markets have mid-size housebuilders underserved by expensive global tools. Snag 360's mobile-first, data-sovereign, and audit-trail-strong platform maps directly to these regulatory drivers. This TG is Phase 2 (Q4 2026 onwards) after India base is established.",
            },
            {
              component: "Sales Motion",
              detail:
                "UK: Partner with 2-3 established construction software resellers (e.g. Eque2, Rapport3) who serve UK housebuilders. Position as a compliant, affordable SnagR alternative with deeper workflow configuration. Singapore: Direct sales to top 15 Singapore residential developers via founding team visit and Construction Industry Development Board (CIDB) network introduction. Pricing in GBP and SGD respectively. Local compliance templates for NHBC UK and BCA Singapore configured pre-launch.",
            },
            {
              component: "Marketing Channels",
              detail:
                "UK: Trade publication content in PBC Today and Ground Engineering targeting site managers and quality surveyors. LinkedIn targeting HM Building Safety Regulator compliance content. Singapore: Partnership with BCA to co-produce digital quality assurance guidance for developers. Webinar with Singapore Contractors Association (SCAL) on digital QC adoption.",
            },
            {
              component: "90-Day Launch Sequence",
              detail:
                "Days 1-30 (Q4 2026): Finalize UK and Singapore compliance template sets. Identify 3 reseller partners in UK. Begin introductory calls with 5 Singapore developers. Days 31-60: Sign at least 1 reseller agreement in UK. Deliver 1 webinar in Singapore with SCAL. Begin 2 pilot conversations in each market. Days 61-90: Convert 1 pilot to paid in each market. Publish first global case study in English for both markets.",
            },
            {
              component: "Partnership Strategy",
              detail:
                "UK: Eque2, Rapport3, Reapit (construction software resellers). NHBC (warranty and quality assurance body for UK housebuilders). Singapore: BCA (Building and Construction Authority). SCAL (Singapore Contractors Association Ltd). Malaysia: CIDB Malaysia for market entry facilitation.",
            },
          ],
          summaryBox:
            "TG SUMMARY BOX: TG3 is Snag 360's global revenue diversification play. UK snagging is a legally mandated process with thousands of active housebuilders and an established but fragmented software market dominated by SnagR (expensive) and paper. Singapore is a high-compliance, high-margin market with 30+ active residential developers. Key assumption: UK reseller channel can deliver 5 paying accounts within 6 months of engagement. The metric that tells us it is working: at least 5 paying global accounts within 9 months of international launch, with average ACV above USD 20,000.",
        },
      ],
    },
    detailedMetrics: {
      clientImpact: [
        {
          metric: "Daily inspection hours per site team",
          baseline:
            "6-8 hours (manual checklist, photo filing, WhatsApp coordination)",
          withSnag: "2-3 hours (mobile app, auto-routing, auto-reporting)",
          claim: "Cut inspection effort by 60%",
        },
        {
          metric: "Snag discovery to assignment time",
          baseline:
            "4-24 hours (verbal instruction, WhatsApp, physical handover)",
          withSnag: "Under 5 minutes (auto-assignment on snag creation)",
          claim: "Snag assigned in under 5 minutes",
        },
        {
          metric: "Open snag visibility for management",
          baseline: "Updated once per week via manual Excel from site team",
          withSnag: "Real-time, accessible from any device",
          claim: "Real-time project quality health - always on",
        },
        {
          metric: "DPR preparation time per day",
          baseline: "60-90 minutes manual consolidation from multiple sources",
          withSnag: "0 minutes - auto-generated at 6 PM daily",
          claim: "Zero-minute daily progress reports",
        },
        {
          metric: "Snag closure rate at handover (% units defect-free)",
          baseline: "60-75% at initial customer walkthrough (industry average)",
          withSnag: "90-98% with stage-gate validation",
          claim: "Deliver 95%+ defect-free units at handover",
        },
        {
          metric: "Rework cost per project (% of project cost)",
          baseline: "5-15% industry average due to missed or repeated defects",
          withSnag: "Estimated 2-5% with structured snag tracking and scoring",
          claim: "Reduce rework cost by up to 60%",
        },
        {
          metric: "Inspector onboarding time",
          baseline: "3-5 days for paper process training",
          withSnag: "2-4 hours for mobile app onboarding",
          claim: "Field team ready in one day",
        },
        {
          metric: "Handover documentation preparation time",
          baseline: "3-5 days manual compilation of photos, reports, sign-offs",
          withSnag: "Under 30 minutes - auto-compiled from platform records",
          claim: "Handover pack generated in 30 minutes",
        },
        {
          metric: "RERA complaint risk exposure",
          baseline:
            "High - no structured evidence of quality process at handover",
          withSnag:
            "Low - digital audit trail and signed pre-handover certificate",
          claim:
            "RERA complaint risk reduced with verifiable quality audit trail",
        },
        {
          metric: "Customer walkthrough satisfaction rate",
          baseline:
            "Industry average: 40-60% customers raise snags at walkthrough",
          withSnag:
            "Target: under 10% of customers raise new snags at walkthrough",
          claim: "10% or fewer customer complaints at possession walkthrough",
        },
      ],
      businessTargets: [
        {
          metric: "New Account Signups (Paid)",
          definition: "Account completes onboarding and deploys first project",
          d30Current: "3-5 new paid accounts/month",
          d30Phase1:
            "5-8 new paid accounts/month (offline mode reduces EPC objection)",
          m3Current: "8-15 paid accounts/month",
          m3Phase1: "15-25 paid accounts/month",
        },
        {
          metric: "Activated Users",
          definition:
            "Activation = inspector raises 10+ snags and closes 5+ snags in first 14 days",
          d30Current: "60% activation rate among licensed inspectors",
          d30Phase1: "70% (better onboarding flow)",
          m3Current: "65% cumulative activation",
          m3Phase1: "75% cumulative activation",
        },
        {
          metric: "Paid Conversion from Pilot",
          definition: "Pilot account converts to paid plan within 90 days",
          d30Current: "50% pilot-to-paid conversion",
          d30Phase1: "60% (RERA report pack adds compliance urgency)",
          m3Current: "55% cumulative conversion",
          m3Phase1: "65% cumulative conversion",
        },
        {
          metric: "Feature Adoption: Ad-hoc Snag Logging",
          definition:
            "% of active users logging at least 1 ad-hoc snag per week",
          d30Current: "40% of active users using ad-hoc logging weekly",
          d30Phase1: "45%",
          m3Current: "50%",
          m3Phase1: "60%",
        },
        {
          metric: "Feature Adoption: Real-time Dashboard",
          definition:
            "% of Quality Heads logging into dashboard 3+ times per week",
          d30Current: "55% of QH users active on dashboard 3x/week",
          d30Phase1: "60%",
          m3Current: "65%",
          m3Phase1: "70%",
        },
        {
          metric: "NPS Proxy (CSAT after 60 days)",
          definition:
            "Survey sent at 60-day mark: How likely are you to recommend Snag 360?",
          d30Current: "NPS 40+",
          d30Phase1: "NPS 45+ (with improved Hindi UI roadmap)",
          m3Current: "NPS 45+",
          m3Phase1: "NPS 50+",
        },
        {
          metric: "Support Ticket Volume per Account",
          definition: "Number of support tickets raised per account per month",
          d30Current: "8-12 tickets/account/month (new platform)",
          d30Phase1: "5-8 (better onboarding reduces setup tickets)",
          m3Current: "4-6 tickets/account/month",
          m3Phase1: "3-5 tickets/account/month",
        },
        {
          metric: "Monthly Churn Rate",
          definition: "% of paying accounts that cancel in a given month",
          d30Current: "3-5% monthly churn (early stage)",
          d30Phase1: "2-3% (better product completeness reduces churn drivers)",
          m3Current: "2-4% monthly churn",
          m3Phase1: "1.5-2.5% monthly churn",
        },
        {
          metric: "North Star Metric: Snags Resolved Per Active Project",
          definition:
            "Total snags closed / total active projects on platform in period",
          d30Current: "80+ snags resolved per active project per month",
          d30Phase1: "100+ (offline mode enables higher field coverage)",
          m3Current: "100+ snags resolved/project/month",
          m3Phase1: "130+ snags resolved/project/month",
        },
        {
          metric: "ARR Growth Rate (Month-on-Month)",
          definition: "Monthly ARR increase as percentage of prior month ARR",
          d30Current: "15-20% MoM ARR growth",
          d30Phase1: "20-25% MoM (Phase 1 unlocks EPC and PMAY)",
          m3Current: "12-18% MoM cumulative ARR growth",
          m3Phase1: "18-25% MoM cumulative ARR growth",
        },
      ],
    },
    detailedSWOT: {
      strengths: [
        {
          headline: "On-premise data sovereignty architecture",
          explanation:
            "Unique in the snagging software category; passes government and enterprise IT security audits that block all cloud-native competitors.",
        },
        {
          headline: "Ad-hoc snag logging outside checklist",
          explanation:
            "Captures defects that fall outside template scope - a critical capability that FalconBrick, Novade, and SnagR do not offer.",
        },
        {
          headline: "Multi-level checkpoint configuration",
          explanation:
            "Enables granular, stage-by-stage quality scoring that generic inspection tools cannot replicate without full rebuild.",
        },
        {
          headline: "Positive/Negative scoring engine",
          explanation:
            "Quantifies quality performance per unit, floor, and project - no other India snagging platform offers this scoring mechanism.",
        },
        {
          headline: "Dynamic stage-gate workflow engine",
          explanation:
            "Prevents inspection bypass and enforces sequential quality gates; builds compliance audit trail automatically.",
        },
        {
          headline: "Mobile-first design for site inspectors",
          explanation:
            "Designed for inspectors in field conditions - fast snag creation, photo annotation, and offline-capable workflows.",
        },
        {
          headline: "Integrated FM handover and HOTO module",
          explanation:
            "Seamless transition from construction QC to FM operations within one platform; reduces post-handover dispute risk.",
        },
        {
          headline: "India-market product fit (RERA alignment)",
          explanation:
            "Built with understanding of RERA compliance requirements, Indian construction workflows, and local developer expectations.",
        },
        {
          headline: "SAP and Salesforce enterprise integrations",
          explanation:
            "Bridges quality data to enterprise ERP and CRM systems; critical for large developer and EPC accounts.",
        },
        {
          headline: "Part of broader Lockated platform ecosystem",
          explanation:
            "Cross-sell and upsell opportunities via Lockated workspace management suite; existing client relationships provide warm entry.",
        },
      ],
      weaknesses: [
        {
          headline: "No offline mobile functionality (Q2 2026 roadmap)",
          explanation:
            "Major adoption barrier for EPC contractors working on sites with poor internet connectivity - blocks 30%+ of target market.",
        },
        {
          headline: "No BIM floor plan integration",
          explanation:
            "Cannot pin snags to floor plans; Procore and Autodesk ACC have this capability and use it as a key differentiator for large accounts.",
        },
        {
          headline: "No AI defect detection from photos",
          explanation:
            "Procore Insights and Novade offer AI-assisted quality analysis; absence limits premium pricing justification vs these competitors.",
        },
        {
          headline: "English-only app interface",
          explanation:
            "Hindi and regional language support absent; limits inspector adoption in non-metro markets and state housing authority projects.",
        },
        {
          headline: "Limited brand awareness vs global competitors",
          explanation:
            "Procore, Autodesk, and SafetyCulture have large marketing budgets and established market presence in India.",
        },
        {
          headline: "No native Android offline sync (partial limitation)",
          explanation:
            "Partial offline capability creates unreliability concerns in IT evaluations for EPC and government sector accounts.",
        },
        {
          headline: "Small sales team for enterprise sales cycle",
          explanation:
            "Enterprise EPC accounts require 3-6 month sales cycles with technical demonstrations; under-resourced today.",
        },
        {
          headline: "Limited published case studies and ROI data",
          explanation:
            "Competitor tools have extensive G2, Capterra, and analyst-published case studies; Snag 360 has limited public social proof.",
        },
        {
          headline: "Upsell modules (HOTO, FM Matrix) not deeply integrated",
          explanation:
            "Extended services modules are functional but not deeply integrated with core snag workflow, creating friction for FM buyers.",
        },
        {
          headline: "No contractor marketplace or performance rating",
          explanation:
            "Cannot provide contractor accountability data across projects; Procore and ConstructConnect offer vendor performance tools.",
        },
      ],
      opportunities: [
        {
          headline: "RERA enforcement intensifying across all Indian states",
          explanation:
            "Maharashtra, Karnataka, and Telangana driving mandatory quality documentation; expanding to tier-2 states creates new demand waves.",
        },
        {
          headline: "India construction market growing at 6.87% CAGR to 2031",
          explanation:
            "USD 1.10 trillion market by 2031 with 200,000+ residential units delivered annually creates massive inspection volume.",
        },
        {
          headline: "Government digital transformation push (PM Gati Shakti)",
          explanation:
            "Government mandating digital project monitoring on infrastructure projects creates a captive demand pool for Snag 360's audit documentation.",
        },
        {
          headline: "UK Building Safety Act 2022 compliance requirement",
          explanation:
            "UK's statutory snagging mandate creates a regulatory pull market for Snag 360 in UK housebuilding - 200,000 new homes per year.",
        },
        {
          headline: "Asia Pacific CQMS growing at 16.2% CAGR",
          explanation:
            "Singapore, Malaysia, Vietnam, and Indonesia construction digitalization creates international expansion runway.",
        },
        {
          headline: "AI and photo analysis integration opportunity (Phase 2)",
          explanation:
            "Adding AI defect detection from photos creates a feature leap that leapfrogs FalconBrick and SnagR simultaneously.",
        },
        {
          headline:
            "BIM adoption accelerating in India commercial construction",
          explanation:
            "BIM mandate for government projects above INR 100 Cr creates floor plan integration demand that Snag 360 can capture with Phase 2 roadmap.",
        },
        {
          headline: "Data center and hyperscale construction boom in India",
          explanation:
            "USD 10 Bn+ data center investment pipeline by 2027 creates demand for precision commissioning inspection software.",
        },
        {
          headline: "PMAY 30 million housing target drives volume inspection",
          explanation:
            "Government affordable housing delivery requires bulk unit inspection tools at accessible pricing; Snag 360 Professional fits.",
        },
        {
          headline: "OEM licensing to construction ERP vendors",
          explanation:
            "Partnering with NYGGS, StrategicERP, or Highrise as white-label quality module creates platform revenue channel without direct sales cost.",
        },
      ],
      threats: [
        {
          headline: "FalconBrick accelerates product development",
          explanation:
            "FalconBrick is well-funded and actively expanding; may add ad-hoc logging and scoring within 12-18 months.",
        },
        {
          headline: "Procore launches India-specific low-cost SKU",
          explanation:
            "An India Essentials SKU at INR 2,000/user from Procore would threaten mid-market position.",
        },
        {
          headline: "Autodesk Construction Cloud expands India sales team",
          explanation:
            "If they launch an aggressive India sales motion, they could win commercial real estate accounts before Snag 360 builds BIM.",
        },
        {
          headline:
            "SafetyCulture (iAuditor) adds construction snagging module",
          explanation:
            "SafetyCulture has 100,000+ global users; adding stage-gate snagging would create a credible hybrid competitor.",
        },
        {
          headline: "Enterprise sales cycle length threatens cash flow",
          explanation:
            "EPC and government accounts have 3-6 month procurement cycles; cash flow pressure if mid-market pipeline does not close fast.",
        },
        {
          headline:
            "India developer consolidation reduces addressable account count",
          explanation:
            "Top 10 developers acquiring smaller ones could reduce the number of independent accounts over time.",
        },
        {
          headline: "Data sovereignty architecture limits cloud scalability",
          explanation:
            "On-premise deployment creates higher support cost per customer; requires more professional services investment as volumes scale.",
        },
        {
          headline: "Global players undercutting on price in India",
          explanation:
            "Global SaaS tools can offer aggressive India pricing to gain market share; price war risk if they prioritize India.",
        },
        {
          headline: "Offline mode gap enables competitor wins in EPC",
          explanation:
            "Every month without offline mode is a month FalconBrick can win EPC accounts that Snag 360 cannot currently serve.",
        },
        {
          headline: "RERA regulatory changes could alter compliance",
          explanation:
            "If RERA quality documentation standards are revised or digitization mandates are weakened, the compliance urgency would weaken.",
        },
      ],
    },
    detailedRoadmap: {
      phases: [
        {
          title: "Phase 1: Consolidate Core (Q2-Q3 2026)",
          summary:
            "PHASE 1 SUMMARY: 5 initiatives | Segments unlocked: Government EPC, PMAY, Tier-2 developers | Est. revenue impact: INR 2-4 Cr incremental ARR | Key unlock: Offline mode removes single biggest adoption barrier in EPC sector",
          initiatives: [
            {
              initiative: "Offline Mobile Inspection",
              feature:
                "Full offline mode with sync - inspectors can complete checklists and raise snags without internet. Auto-sync on reconnect.",
              segment:
                "Government EPC, infrastructure sites with poor connectivity",
              impact:
                "Removes #1 objection from EPC and rural project buyers; unlocks government sector",
              timeline: "Q2 2026",
            },
            {
              initiative: "Hindi and Regional Language UI",
              feature:
                "App available in Hindi, Tamil, Telugu, Kannada, Marathi. Checklists configurable in local languages.",
              segment:
                "Affordable housing, state government, tier-2 city developers",
              impact:
                "Addresses PMAY and state housing board requirements; dramatically lowers inspector onboarding time",
              timeline: "Q2 2026",
            },
            {
              initiative: "RERA Compliance Report Pack",
              feature:
                "Auto-generated RERA-format quality and handover reports that match state-specific RERA submission templates.",
              segment: "All India residential real estate developers",
              impact:
                "Direct compliance value; converts legal/regulatory obligation into product ROI",
              timeline: "Q3 2026",
            },
            {
              initiative: "Snag Aging and Escalation Engine",
              feature:
                "Automatic escalation alerts when snags breach SLA. Multi-level escalation to supervisor, then project head, then MD.",
              segment: "All segments - enterprise priority",
              impact:
                "Reduces average snag closure time; creates accountability without manual follow-up",
              timeline: "Q3 2026",
            },
            {
              initiative: "Inspector Performance Analytics",
              feature:
                "Individual inspector productivity reports: snags raised, closed, re-opened, time-to-close, quality score per inspector.",
              segment: "EPC, real estate - HR and project teams",
              impact:
                "Enables performance management for site QC teams; upsell conversation for enterprise accounts",
              timeline: "Q3 2026",
            },
          ],
        },
        {
          title: "Phase 2: Differentiate and Scale (Q4 2026 - Q2 2027)",
          summary:
            "PHASE 2 SUMMARY: 5 initiatives | Segments unlocked: Commercial real estate, data centers, hospitals, enterprise EPC | Est. revenue impact: INR 6-12 Cr incremental ARR | Key unlock: AI detection and BIM integration close competitive gap with Procore and ACC",
          initiatives: [
            {
              initiative: "AI Photo Defect Detection",
              feature:
                "ML model analyses inspector photos and auto-suggests defect category, severity, and checklist item match. Reduces manual data entry per snag.",
              segment:
                "Mid to large real estate developers and EPC contractors",
              impact:
                "Leapfrogs SnagR and FalconBrick; moves Snag 360 into AI-enabled CQMS category",
              timeline: "Q4 2026",
            },
            {
              initiative: "BIM Floor Plan Integration",
              feature:
                "2D floor plan upload and snag pinning. Inspectors tap on floor plan to create geolocated snags. Heat maps show defect density by zone.",
              segment:
                "Commercial real estate, data centers, hospital construction",
              impact:
                "Directly competes with Procore and Autodesk ACC floor plan features; wins large commercial accounts",
              timeline: "Q1 2027",
            },
            {
              initiative: "Predictive Rework Analytics",
              feature:
                "Analyzes historical snag patterns to predict which project areas, contractor teams, or stages are likely to have repeat defects.",
              segment:
                "Enterprise real estate developers with 5+ active projects",
              impact:
                "Creates early warning system; reduces rework cost; strong upsell for enterprise plan",
              timeline: "Q1 2027",
            },
            {
              initiative: "Third-Party Inspector / Client Walkthrough Mode",
              feature:
                "External access mode for clients, customers, or auditors to conduct their own walkthrough and raise snags directly in the platform.",
              segment: "Real estate developers, government project owners",
              impact:
                "Customer walkthrough digitized end-to-end; eliminates paper snag lists at possession; reduces dispute cycle",
              timeline: "Q2 2027",
            },
            {
              initiative: "API and Webhook Layer for ERP Integration",
              feature:
                "Open API and pre-built webhooks for Oracle, Microsoft Dynamics, and other ERPs beyond SAP. Enables custom system integrations.",
              segment: "Enterprise EPC and large developers with non-SAP ERP",
              impact:
                "Removes integration barrier for 30% of enterprise accounts currently using non-SAP ERP",
              timeline: "Q2 2027",
            },
          ],
        },
        {
          title: "Phase 3: Platform and Ecosystem (Q3 2027 - Q4 2028)",
          summary:
            "PHASE 3 SUMMARY: 5 initiatives | Segments unlocked: Global markets, IoT-driven smart buildings, government digital infrastructure | Est. revenue impact: INR 20-40 Cr incremental ARR by 2028 | Key unlock: OEM licensing and RERA API create platform revenue and regulatory moat",
          initiatives: [
            {
              initiative: "White-label / OEM Licensing",
              feature:
                "License Snag 360 engine to large real estate ERP vendors (Salesforce-Veeva, Oracle, NYGGS) as white-label quality module.",
              segment: "ERP vendors seeking QC module; system integrators",
              impact:
                "Opens B2B2C revenue channel; platform revenue without direct sales cost; global market entry via ERP partners",
              timeline: "Q3 2027",
            },
            {
              initiative: "Southeast Asia and UK Market Launch",
              feature:
                "Localized versions for Singapore, Malaysia, UK. Local compliance templates (BCA Singapore, NHBC UK). Pricing in SGD, MYR, GBP.",
              segment:
                "Regional construction firms, global real estate developers",
              impact:
                "Geographic diversification; UK snagging market is regulatory-mandated with 10,000+ active housebuilders",
              timeline: "Q4 2027",
            },
            {
              initiative: "Digital Twin and IoT Sensor Integration",
              feature:
                "Link snag data with IoT sensors: temperature, humidity, structural vibration. Automated snag raised when sensor threshold breached.",
              segment: "Data centers, pharmaceutical plants, smart buildings",
              impact:
                "Moves Snag 360 from reactive inspection to proactive quality monitoring; enters IoT-driven smart building market",
              timeline: "Q1 2028",
            },
            {
              initiative: "Contractor Marketplace and Rating Engine",
              feature:
                "Repair contractors rated on snag closure speed, re-open rate, and quality score. Developers can browse contractor performance across projects.",
              segment: "Real estate developers using multiple subcontractors",
              impact:
                "Creates ecosystem lock-in; network effect; upsell for enterprise clients managing large contractor networks",
              timeline: "Q2 2028",
            },
            {
              initiative: "Government Compliance API",
              feature:
                "Direct API integration with state RERA portals and NHAI for automated submission of quality compliance documentation.",
              segment: "RERA-registered developers, NHAI project contractors",
              impact:
                "Becomes infrastructure for compliance submission; switch cost becomes extremely high; regulatory moat",
              timeline: "Q4 2028",
            },
          ],
        },
      ],
      innovationLayer: [
        {
          id: 1,
          name: "AI-Powered Defect Classification from Photos",
          category: "AI / LLM",
          description:
            "LLM-based image analysis model that automatically classifies defect type, severity, and likely root cause from inspector photos. Suggests checklist item match and repair action.",
          value:
            "Eliminates manual defect categorization; speeds up snag creation by 70%; enables predictive defect pattern analysis across projects.",
          leapfrog: "Procore Insights, Autodesk AI",
          priority: "High Impact",
        },
        {
          id: 2,
          name: "Predictive Snag Recurrence Engine",
          category: "AI / Predictive Analytics",
          description:
            "ML model trained on historical snag data identifies which contractor teams, project stages, and unit types are likely to generate repeat defects. Issues early alerts 2-3 stages before problem zones.",
          value:
            "Reduces rework by targeting quality attention where recurrence probability is highest; justifies premium enterprise pricing.",
          leapfrog: "No competitor has this for India residential context",
          priority: "High Impact",
        },
        {
          id: 3,
          name: "Natural Language Snag Search and Query",
          category: "AI / NLP",
          description:
            "Inspectors can search all snags using plain language: 'show me all plastering defects in Tower B raised last week'. AI interprets query and returns filtered results without manual filter navigation.",
          value:
            "Reduces time spent on dashboard navigation; makes platform accessible for less tech-savvy inspectors; reduces support tickets.",
          leapfrog: "SnagR, SafetyCulture",
          priority: "Medium Impact",
        },
        {
          id: 4,
          name: "AI-Generated DPR Narrative Summary",
          category: "AI / LLM",
          description:
            "LLM automatically writes a plain-English narrative summary of the day's inspection activity, including notable trends, overdue risk alerts, and project health commentary, appended to the auto-generated DPR.",
          value:
            "Transforms raw DPR data into actionable management communication; reduces quality head's daily reporting effort to zero.",
          leapfrog: "No competitor offers narrative DPR summaries",
          priority: "High Impact",
        },
        {
          id: 5,
          name: "AI Voice-to-Snag Logging",
          category: "AI / LLM",
          description:
            "Inspector speaks a snag description out loud into the mobile app. AI transcribes, classifies, assigns severity, and creates a structured snag record automatically. Supports Hindi and English.",
          value:
            "Eliminates typing for field inspectors; particularly valuable for inspectors with low digital literacy; supports hands-free inspection workflow.",
          leapfrog: "FalconBrick, SnagR",
          priority: "High Impact",
        },
        {
          id: 6,
          name: "MCP Integration: AutoSync with SAP Project Management",
          category: "MCP / Cross-Platform Automation",
          description:
            "Model Context Protocol server that continuously syncs Snag 360 stage gate completions with SAP PS (Project System) milestone events. Eliminates manual ERP data entry for project progress billing.",
          value:
            "Removes a key manual integration pain point for enterprise EPC accounts; strengthens SAP integration story for Tata Projects, L&T, NCC accounts.",
          leapfrog: "No snagging tool has native MCP-SAP sync",
          priority: "High Impact",
        },
        {
          id: 7,
          name: "MCP Integration: Salesforce Customer Handover Sync",
          category: "MCP / Cross-Platform Automation",
          description:
            "MCP server that pushes pre-handover inspection sign-off and unit quality score directly into Salesforce CRM opportunity and customer records. Triggers handover workflow in SFDC automatically.",
          value:
            "Closes the loop between construction quality and customer delivery CRM; enables customer service team to access quality history from CRM without switching tools.",
          leapfrog:
            "Procore SFDC integration is manual sync; MCP makes it real-time",
          priority: "High Impact",
        },
        {
          id: 8,
          name: "MCP Integration: WhatsApp Snag Notifications",
          category: "MCP / Cross-Platform Automation",
          description:
            "MCP server that sends snag assignment, overdue alert, and closure notifications via WhatsApp Business API. Inspectors and reviewers receive actionable messages on WhatsApp with deep links back to app.",
          value:
            "Meets India field team where they already are (WhatsApp); dramatically improves response rate on snag assignments without requiring app adoption for non-primary users.",
          leapfrog: "No competitor has WhatsApp-native snag notification",
          priority: "High Impact",
        },
        {
          id: 9,
          name: "BIM Floor Plan Snag Pinning",
          category: "Core Feature Enhancement",
          description:
            "2D floor plan and BIM model upload for each project unit. Inspectors tap on floor plan to create location-accurate snags. Heat maps show defect density by room, floor, and zone.",
          value:
            "Closes the single largest feature gap vs Procore and Autodesk ACC; enables premium enterprise positioning for commercial and data center construction.",
          leapfrog: "Procore, Autodesk Construction Cloud",
          priority: "High Impact",
        },
        {
          id: 10,
          name: "Contractor Performance Rating and Marketplace",
          category: "Platform / Ecosystem",
          description:
            "Each repair contractor is rated on snag closure speed, re-open rate, first-fix rate, and quality score across all projects they work on. Developers can view contractor scorecards before awarding repair work.",
          value:
            "Creates network effect and platform lock-in; generates switching cost for developer accounts; enables future marketplace monetization.",
          leapfrog: "ConstructConnect, Procore Vendor Management",
          priority: "High Impact",
        },
        {
          id: 11,
          name: "IoT Sensor Triggered Auto-Snag",
          category: "IoT / Automation",
          description:
            "Integration with building IoT sensors (temperature, humidity, air quality, structural vibration). When sensor reading breaches configured threshold, snag is auto-raised and assigned to relevant contractor.",
          value:
            "Moves Snag 360 from reactive inspection to proactive quality monitoring; enters smart building and data center construction market.",
          leapfrog: "No snagging tool offers IoT-triggered snags",
          priority: "High Impact",
        },
        {
          id: 12,
          name: "Digital Twin QC Dashboard",
          category: "Advanced Analytics",
          description:
            "3D digital twin view of the project building with snag heat map overlay. Management can rotate the building model and see defect concentrations by floor, zone, and stage visually.",
          value:
            "Premium enterprise capability; qualifies Snag 360 for mega-project tenders alongside Autodesk and Bentley; strong demo conversion driver.",
          leapfrog: "Autodesk Construction Cloud, Bentley iTwin",
          priority: "High Impact",
        },
        {
          id: 13,
          name: "AI Checklist Auto-Generation from Project Specs",
          category: "AI / LLM",
          description:
            "Upload project specification documents (PDF or Word). LLM analyzes specs and automatically generates a customized inspection checklist with checkpoints derived from spec requirements.",
          value:
            "Eliminates manual checklist creation for each new project; reduces quality head setup time from days to minutes; enables self-service onboarding.",
          leapfrog: "No competitor offers spec-to-checklist AI",
          priority: "High Impact",
        },
        {
          id: 14,
          name: "Customer Walkthrough Portal (Self-Service Snag Raising)",
          category: "Product Extension",
          description:
            "Buyers and tenants access a branded portal to conduct their own pre-possession walkthrough and raise snags directly in the platform. Snags auto-route to developer quality team for response.",
          value:
            "Digitizes the customer possession experience; eliminates paper punch lists at customer handover; creates digital evidence of customer acknowledgment.",
          leapfrog:
            "SnagR has basic version; Snag 360 version adds scoring and routing",
          priority: "Medium Impact",
        },
        {
          id: 15,
          name: "Blockchain Audit Trail for Snag Records",
          category: "Compliance / Security",
          description:
            "All snag creation, modification, and closure events are hashed and written to a permissioned blockchain ledger. Provides tamper-proof audit trail for RERA disputes and government contract verification.",
          value:
            "Creates an immutable compliance record; strongest possible evidence for RERA dispute resolution; government and high-value commercial accounts pay premium for this.",
          leapfrog: "No competitor offers blockchain snag audit trail",
          priority: "High Impact",
        },
        {
          id: 16,
          name: "Automated Warranty Claim Management",
          category: "Product Extension",
          description:
            "Post-handover snags raised by residents or FM teams are automatically classified as warranty claims and routed to the original contractor with SLA tracking and escalation.",
          value:
            "Extends platform revenue into the post-handover lifecycle; FM and developer accounts both benefit; creates multi-year customer LTV.",
          leapfrog: "FalconBrick, Novade do not have warranty claim module",
          priority: "Medium Impact",
        },
        {
          id: 17,
          name: "AI-Powered Quality Risk Scoring at Project Inception",
          category: "AI / Predictive Analytics",
          description:
            "At project setup, AI model analyzes project type, contractor history, timeline, and scope to generate a predicted quality risk score. Alerts quality head to high-risk zones before inspection begins.",
          value:
            "Enables proactive quality resource allocation; risk scoring becomes a sales differentiator for enterprise accounts; creates unique pre-inspection value.",
          leapfrog: "No competitor has pre-project quality risk AI",
          priority: "Medium Impact",
        },
        {
          id: 18,
          name: "Snag 360 Public API for Third-Party Integration Ecosystem",
          category: "Platform / Ecosystem",
          description:
            "Fully documented RESTful API with OAuth2 enabling any third-party to build integrations with Snag 360. SDK available for Python and JavaScript. Integration marketplace listing.",
          value:
            "Attracts PMC firms, ERP vendors, and FM software to build integrations; creates ecosystem lock-in; potential white-label revenue from integration partners.",
          leapfrog:
            "Procore has 500+ marketplace integrations; Snag 360 API enables catch-up",
          priority: "Medium Impact",
        },
        {
          id: 19,
          name: "Multi-Project Benchmarking Dashboard",
          category: "Analytics",
          description:
            "Quality heads compare quality scores, snag rates, closure times, and inspector productivity across all active projects simultaneously. Peer benchmarking against anonymized industry averages.",
          value:
            "High-value analytics feature for enterprise accounts managing 10+ projects; creates data asset that becomes more valuable with more accounts on platform.",
          leapfrog:
            "Novade has basic multi-project view; Snag 360 benchmarking is more granular",
          priority: "Medium Impact",
        },
        {
          id: 20,
          name: "Snag 360 Mobile App for Subcontractors (Reviewer-Only Lite)",
          category: "Product Extension",
          description:
            "Free lightweight mobile app for subcontractor repair teams. They receive snag assignments, view annotated photos, mark repair complete, and upload repair evidence. No checklist or dashboard access.",
          value:
            "Extends platform reach to subcontractor ecosystem without seat licensing cost; improves repair cycle closure rate; creates data on contractor performance automatically.",
          leapfrog:
            "SnagR has basic contractor access; Snag 360 version is more structured and evidence-driven",
          priority: "Medium Impact",
        },
      ],
      top5Impact: [
        {
          rank: 1,
          name: "AI-Powered Defect Classification from Photos",
          logic:
            "Eliminates manual defect categorization; enables predictive QC; moves Snag 360 into AI-native CQMS category; justifies premium",
          leapfrog: "Procore Insights, Autodesk AI",
        },
        {
          rank: 2,
          name: "BIM Floor Plan Snag Pinning",
          logic:
            "Closes single largest feature gap vs Procore and ACC; required for large commercial real estate and data center accounts; enables visual",
          leapfrog: "Procore, Autodesk Construction Cloud",
        },
        {
          rank: 3,
          name: "MCP Integration: AutoSync with SAP",
          logic:
            "Removes last remaining manual integration pain point for EPC enterprise accounts; makes Snag 360 the only snagging tool with",
          leapfrog: "No snagging tool has this",
        },
        {
          rank: 4,
          name: "MCP Integration: WhatsApp Snag Notifications",
          logic:
            "Meets India field team on their primary communication channel; dramatically improves snag response rate without requiring full",
          leapfrog: "No competitor has WhatsApp-native notifications",
        },
        {
          rank: 5,
          name: "AI Voice-to-Snag Logging (Hindi + English)",
          logic:
            "Removes typing barrier for field inspectors; enables hands-free inspection; opens government and affordable housing markets where",
          leapfrog: "FalconBrick, SnagR",
        },
      ],
    },
  },
};

import Snag360UseCasesTab from "./tabs/Snag360UseCasesTab";

// Tab Labels for Snag 360
const snagTabLabels: Record<string, string> = {
  summary: "Product Summary",
  features: "Feature List",
  usecases: "Use Cases",
  market: "Market Analysis",
  pricing: "Features and Pricing",
  swot: "SWOT Analysis",
  roadmap: "Product Roadmap",
  enhancements: "Enhancement Roadmap",
  metrics: "Metrics",
  business: "Business Plan Builder",
  gtm: "GTM Strategy",
  assets: "Assets",
};

// ============== SNAG 360 CUSTOM TABS ==============

// Summary Tab for Snag 360
const Snag360SummaryTab: React.FC = () => {
  const identity =
    productData.extendedContent?.productSummaryNew?.identity || [];
  const problemSolves =
    productData.extendedContent?.productSummaryNew?.problemSolves || [];
  const whoItIsFor =
    productData.extendedContent?.productSummaryNew?.whoItIsFor || [];
  const featureSummary =
    productData.extendedContent?.productSummaryNew?.featureSummary || "";
  const today = productData.extendedContent?.productSummaryNew?.today || [];

  return (
    <div className="space-y-8 animate-fade-in overflow-x-auto">
      {/* Identity Section */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-2xl font-semibold tracking-tight font-poppins">
          {productData.name} - Product Identity
        </h2>
        <p className="text-[10px] font-medium text-[#2C2C2C]/40 tracking-widest mt-1">
          LOCKATED / GOPHYGITAL.WORK | MOBILE-FIRST QUALITY INSPECTION &
          SNAGGING PLATFORM | INDIA PRIMARY, GLOBAL SECONDARY
        </p>
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-4 text-center w-1/4 font-poppins">
                Field
              </th>
              <th className="border border-[#C4B89D]/50 p-4 text-center font-poppins">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {identity.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-4 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.field}
                </td>
                <td className="border border-[#C4B89D]/50 p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Problem Solves Section */}
      <div className="bg-[#DA7756] text-white border border-[#C4B89D] p-4 font-semibold text-sm rounded-t-xl font-poppins">
        The Problem It Solves
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-4 text-center w-1/3 font-poppins">
                Pain Point
              </th>
              <th className="border border-[#C4B89D]/50 p-4 text-center font-poppins">
                How Snag 360 Solves It
              </th>
            </tr>
          </thead>
          <tbody>
            {problemSolves.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-4 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.painPoint}
                </td>
                <td className="border border-[#C4B89D]/50 p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.solution}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Who It Is For Section */}
      <div className="bg-[#DA7756] text-white border border-[#C4B89D] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">
        Who It Is For
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/5 font-poppins">
                Role
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                What They Use It For
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                Key Frustration Today
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                What They Gain
              </th>
            </tr>
          </thead>
          <tbody>
            {whoItIsFor.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.role}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.useCase}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/70 font-medium leading-relaxed italic font-poppins bg-white">
                  {r.frustration}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.gain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature Summary Section */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D]">
        Feature Summary
      </div>
      <div className="border border-t-0 border-[#C4B89D]/50 p-4 text-sm text-[#2C2C2C]/80 bg-white font-medium leading-relaxed rounded-b-xl font-poppins">
        {featureSummary}
      </div>

      {/* Where We Are Today Section */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D]">
        Where We Are Today
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                Dimension
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-3/4 font-poppins">
                Current State
              </th>
            </tr>
          </thead>
          <tbody>
            {today.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.dimension}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Features Tab for Snag 360
const Snag360FeaturesTab: React.FC = () => {
  const features = productData.extendedContent?.detailedFeatures || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - Feature List
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        All features from product brief. USP rows highlighted in blue. Star
        denotes unique competitive advantage.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                Module
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                Feature
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                Sub-Features
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                How It Currently Works
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                User Type
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                USP
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr
                key={i}
                className={
                  f.usp
                    ? "bg-[#DA7756]/10"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C] font-medium">
                  {f.module}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-3 ${f.usp ? "font-semibold text-[#DA7756]" : "text-[#2C2C2C]"}`}
                >
                  {f.feature}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80">
                  {f.subFeatures}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80">
                  {f.works}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80">
                  {f.userType}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-center font-semibold text-[#DA7756]">
                  {f.usp ? "* USP" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Market Tab for Snag 360
const Snag360MarketTab: React.FC = () => {
  const marketSize =
    productData.extendedContent?.detailedMarketAnalysis?.marketSize || [];
  const topIndustries =
    productData.extendedContent?.detailedMarketAnalysis?.topIndustries || [];
  const competitors =
    productData.extendedContent?.detailedMarketAnalysis?.competitors || [];
  const competitorSummary =
    productData.extendedContent?.detailedMarketAnalysis?.competitorSummary ||
    "";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Market Size Section */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - Market Analysis
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Market Size and Growth | Section 2: Top 10 Industries |
        Section 3: 10 Key Competitors
      </p>

      {/* Market Size Table */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Section 1: Market Size and Growth Drivers
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Segment
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                2024-25 Value
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                2026 Value
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Forecast
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                CAGR
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Primary Driver
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                India Relevance
              </th>
            </tr>
          </thead>
          <tbody>
            {marketSize.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {m.segment}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-right">
                  {m.val2425}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-right">
                  {m.val26}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-right">
                  {m.forecast}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-center">
                  {m.cagr}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {m.driver}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {m.india}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Industries Table */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 2: Top 10 Industries for Snag 360
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Rank
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Industry
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Why They Buy
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Scale / Evidence
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Decision Maker
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Deal Size (Annual)
              </th>
            </tr>
          </thead>
          <tbody>
            {topIndustries.map((ind, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                  {ind.rank}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {ind.industry}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {ind.buyReason}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {ind.scale}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {ind.decisionMaker}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-right">
                  {ind.dealSize}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitors Table */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 3: 10 Key Competitors
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Competitor
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                HQ / Market
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                India Price
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Global Price
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Key Strength
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Key Weakness
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Data Sovereignty
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Target Segment
              </th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {c.name}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {c.hq}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {c.indiaPrice}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {c.globalPrice}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {c.strength}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {c.weakness}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center text-[#2C2C2C]/80">
                  {c.sovereignty}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {c.segment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitor Summary */}
      <div className="bg-[#DA7756]/10 border border-[#C4B89D]/50 p-4 text-sm text-[#2C2C2C] font-medium leading-relaxed font-poppins mt-4">
        <strong>Competitive Summary:</strong> {competitorSummary}
      </div>
    </div>
  );
};

// Pricing Tab for Snag 360
const Snag360PricingTab: React.FC = () => {
  const pricing = productData.extendedContent?.detailedPricing;
  const featureComparison = pricing?.snagFeatureComparison || [];
  const pricingLandscape = pricing?.pricingLandscapeRows || [];
  const valueProps = pricing?.valueProps || [];
  const positioningStatement = pricing?.competitivePositioningStatement || "";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - Features and Pricing
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Feature Comparison vs Competitors | Section 2: Pricing Tiers
        | Section 3: Value Proposition by Role
      </p>

      {/* Feature Comparison Table */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Section 1: Feature Comparison vs Key Competitors
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Feature
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center bg-[#DA7756] text-white">
                Snag 360
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                FalconBrick
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Procore
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Novade
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                SnagR
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                SafetyCulture
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {featureComparison.map((f, i) => (
              <tr
                key={i}
                className={
                  f.status === "AHEAD"
                    ? "bg-[#e2efda]"
                    : f.status === "GAP"
                      ? "bg-[#fce4d6]"
                      : i % 2 === 0
                        ? "bg-white"
                        : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {f.feature}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C] font-medium bg-[#DA7756]/10">
                  {f.snag360}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {f.falconBrick}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {f.procore}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {f.novade}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {f.snagR}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {f.safetyCulture}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 text-center font-semibold ${f.status === "AHEAD" ? "text-green-600" : f.status === "GAP" ? "text-red-600" : "text-[#2C2C2C]"}`}
                >
                  {f.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing Landscape Table */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 2: Pricing Landscape
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Tier / Product
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Model
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                India Price
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Global Price
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                What's Included
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Target Segment
              </th>
            </tr>
          </thead>
          <tbody>
            {pricingLandscape.map((p, i) => (
              <tr
                key={i}
                className={
                  p.tier.includes("Snag 360")
                    ? "bg-[#DA7756]/10"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td
                  className={`border border-[#C4B89D]/50 p-2 ${p.tier.includes("Snag 360") ? "font-semibold text-[#DA7756]" : "text-[#2C2C2C]"}`}
                >
                  {p.tier}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {p.model}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {p.indiaPrice}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {p.globalPrice}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {p.included}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {p.segment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Positioning Statement */}
      <div className="bg-[#DA7756]/10 border border-[#C4B89D]/50 p-4 text-sm text-[#2C2C2C] font-medium leading-relaxed font-poppins mt-4">
        <strong>Competitive Positioning:</strong> {positioningStatement}
      </div>

      {/* Value Props Table */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 3: Value Proposition by Role
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Buyer Role
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Value Proposition Statement
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Measurable Outcome
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Key Feature
              </th>
            </tr>
          </thead>
          <tbody>
            {valueProps.map((v, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {v.role}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {v.prop}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {v.outcome}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {v.feature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Roadmap Tab for Snag 360
const Snag360RoadmapTab: React.FC = () => {
  const phases = productData.extendedContent?.detailedRoadmap?.phases || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - Product Roadmap
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        3 phases | 15 initiatives | First phase focused on core stability and
        market expansion readiness
      </p>

      {phases.map((phase, phaseIdx) => (
        <div key={phaseIdx} className="space-y-4">
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
            {phase.title}
          </div>
          <div className="bg-[#DA7756]/10 border border-[#C4B89D]/50 p-3 text-[11px] text-[#2C2C2C] font-medium leading-relaxed font-poppins italic">
            {phase.summary}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-poppins">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Initiative
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Feature Description
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Segment Unlocked
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Business Impact
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Timeline
                  </th>
                </tr>
              </thead>
              <tbody>
                {phase.initiatives.map((init, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                  >
                    <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                      {init.initiative}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                      {init.feature}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                      {init.segment}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                      {init.impact}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#DA7756]">
                      {init.timeline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

// Business Plan Tab for Snag 360
const Snag360BusinessPlanTab: React.FC = () => {
  const planQuestions =
    productData.extendedContent?.detailedBusinessPlan?.planQuestions || [];
  const founderChecklist =
    productData.extendedContent?.detailedBusinessPlan?.founderChecklist || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - Business Plan Builder
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        10 investor-ready Q&A blocks + Founder checklist for data validation
      </p>

      {/* Q&A Table */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Investor Q&A Framework
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[5%]">
                #
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                Question
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[55%]">
                Answer
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[10%]">
                Source
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[10%]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {planQuestions.map((q, i) => (
              <tr
                key={i}
                className={
                  q.flag?.includes("Requires founder")
                    ? "bg-[#fff2cc]"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                  {q.id}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {q.question}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 leading-relaxed">
                  {q.answer}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/60 text-center">
                  {q.source}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 text-center text-[10px] ${q.flag?.includes("Ready") ? "text-green-600" : "text-orange-600"}`}
                >
                  {q.flag}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Founder Checklist */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Founder Checklist - Data to Validate
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Linked Q
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Item to Verify
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                How to Verify
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {founderChecklist.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                  {c.id}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {c.item}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {c.verify}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-orange-600">
                  {c.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// GTM Tab for Snag 360
const Snag360GTMTab: React.FC = () => {
  const targetGroups =
    productData.extendedContent?.detailedGTM?.targetGroups || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - GTM Strategy
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        3 Target Groups | Each with: Why, Sales Motion, Marketing Channels,
        90-Day Sequence, Partnership Strategy, Summary Box
      </p>

      {targetGroups.map((tg, tgIdx) => (
        <div key={tgIdx} className="space-y-4 mb-8">
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
            {tg.title}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-poppins">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                    Component
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[80%]">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {tg.components.map((comp, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                  >
                    <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                      {comp.component}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 leading-relaxed">
                      {comp.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-[#DA7756]/10 border border-[#C4B89D]/50 p-4 text-[11px] text-[#2C2C2C] font-medium leading-relaxed font-poppins">
            <strong>TG Summary:</strong> {tg.summaryBox}
          </div>
        </div>
      ))}
    </div>
  );
};

// Metrics Tab for Snag 360
const Snag360MetricsTab: React.FC = () => {
  const clientImpact =
    productData.extendedContent?.detailedMetrics?.clientImpact || [];
  const businessTargets =
    productData.extendedContent?.detailedMetrics?.businessTargets || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - Key Metrics and Targets
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Client Impact Metrics for Landing Page | Section 2: Product
        and Business Metrics with 4-column targets
      </p>

      {/* Client Impact Metrics */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Section 1: Client Impact Metrics (for Landing Page and Sales Deck)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">#</th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Metric
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Current Baseline (Manual / Paper)
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                With Snag 360
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Landing Page Claim
              </th>
            </tr>
          </thead>
          <tbody>
            {clientImpact.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                  {i + 1}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {m.metric}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {m.baseline}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {m.withSnag}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#DA7756] font-semibold">
                  {m.claim}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Business Targets */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 2: Product and Business Metrics with Targets
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Metric
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Activation Definition
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                30-Day Current Product
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                30-Day with Phase 1
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                3-Month Current Product
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                3-Month with Phase 1
              </th>
            </tr>
          </thead>
          <tbody>
            {businessTargets.map((t, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {t.metric}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {t.definition}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {t.d30Current}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {t.d30Phase1}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {t.m3Current}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {t.m3Phase1}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SWOT Tab for Snag 360
const Snag360SWOTTab: React.FC = () => {
  const swot = productData.extendedContent?.detailedSWOT;
  const strengths = swot?.strengths || [];
  const weaknesses = swot?.weaknesses || [];
  const opportunities = swot?.opportunities || [];
  const threats = swot?.threats || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - SWOT Analysis
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        10 items per quadrant. Bold headline + one-sentence explanation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-center font-poppins">
            STRENGTHS
          </div>
          <div className="border border-[#C4B89D]/50">
            {strengths.map((s, i) => (
              <div
                key={i}
                className="bg-[#e2efda] border-b border-[#C4B89D]/50 p-3 text-[11px] font-poppins"
              >
                <strong>
                  {i + 1}. {s.headline}:
                </strong>{" "}
                {s.explanation}
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-center font-poppins">
            WEAKNESSES
          </div>
          <div className="border border-[#C4B89D]/50">
            {weaknesses.map((w, i) => (
              <div
                key={i}
                className="bg-[#fce4d6] border-b border-[#C4B89D]/50 p-3 text-[11px] font-poppins"
              >
                <strong>
                  {i + 1}. {w.headline}:
                </strong>{" "}
                {w.explanation}
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-center font-poppins">
            OPPORTUNITIES
          </div>
          <div className="border border-[#C4B89D]/50">
            {opportunities.map((o, i) => (
              <div
                key={i}
                className="bg-[#DA7756]/10 border-b border-[#C4B89D]/50 p-3 text-[11px] font-poppins"
              >
                <strong>
                  {i + 1}. {o.headline}:
                </strong>{" "}
                {o.explanation}
              </div>
            ))}
          </div>
        </div>

        {/* Threats */}
        <div>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-center font-poppins">
            THREATS
          </div>
          <div className="border border-[#C4B89D]/50">
            {threats.map((t, i) => (
              <div
                key={i}
                className="bg-[#fff2cc] border-b border-[#C4B89D]/50 p-3 text-[11px] font-poppins"
              >
                <strong>
                  {i + 1}. {t.headline}:
                </strong>{" "}
                {t.explanation}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhancements Tab for Snag 360
const Snag360EnhancementsTab: React.FC = () => {
  const innovationLayer =
    productData.extendedContent?.detailedRoadmap?.innovationLayer || [];
  const top5Impact =
    productData.extendedContent?.detailedRoadmap?.top5Impact || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - Future Enhancement Roadmap (Innovation Layer)
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Future-state innovations only. Minimum 5 AI/LLM features. Minimum 3
        MCP/automation features. High-impact rows highlighted.
      </p>

      {/* Innovation Layer Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">#</th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Enhancement Name
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Category
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Description
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Business Value
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Competitor Leapfrogged
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Priority
              </th>
            </tr>
          </thead>
          <tbody>
            {innovationLayer.map((item, i) => (
              <tr
                key={i}
                className={
                  item.priority === "High Impact"
                    ? "bg-[#DA7756]/10"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td
                  className={`border border-[#C4B89D]/50 p-2 text-center ${item.priority === "High Impact" ? "font-semibold" : ""}`}
                >
                  {item.id}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 ${item.priority === "High Impact" ? "font-semibold text-[#DA7756]" : "text-[#2C2C2C]"}`}
                >
                  {item.name}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 ${item.priority === "High Impact" ? "font-semibold" : ""}`}
                >
                  {item.category}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 ${item.priority === "High Impact" ? "font-semibold" : ""}`}
                >
                  {item.description}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 ${item.priority === "High Impact" ? "font-semibold" : ""}`}
                >
                  {item.value}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 ${item.priority === "High Impact" ? "font-semibold" : ""}`}
                >
                  {item.leapfrog}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 text-center ${item.priority === "High Impact" ? "font-semibold text-[#DA7756]" : ""}`}
                >
                  {item.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top 5 Impact Summary */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Top 5 Highest-Impact Enhancements Summary
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Rank
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Enhancement
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Why It Matters Most
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Competitor It Leapfrogs
              </th>
            </tr>
          </thead>
          <tbody>
            {top5Impact.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                  {item.rank}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {item.name}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {item.logic}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {item.leapfrog}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Assets Tab for Snag 360
const Snag360AssetsTab: React.FC = () => {
  const assets = productData.assets || [];
  const credentials = productData.credentials || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          SNAG 360 - Assets & Credentials
        </h2>
      </div>

      {/* Assets Section */}
      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Sales & Marketing Assets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((asset, i) => (
            <a
              key={i}
              href={asset.url}
              className="flex items-center gap-3 p-4 bg-[#F6F4EE] rounded-lg border border-[#C4B89D] hover:border-[#DA7756] hover:bg-[#DA7756]/5 transition-all"
            >
              <div className="p-2 bg-[#DA7756]/10 rounded-lg text-[#DA7756]">
                {asset.icon}
              </div>
              <div>
                <p className="font-medium text-[#2C2C2C] font-poppins">
                  {asset.title}
                </p>
                <p className="text-xs text-[#2C2C2C]/60 font-poppins">
                  {asset.type}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Credentials Section */}
      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Demo Credentials
        </h3>
        <div className="space-y-4">
          {credentials.map((cred, i) => (
            <div
              key={i}
              className="p-4 bg-[#F6F4EE] rounded-lg border border-[#C4B89D]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#DA7756]/10 rounded-lg text-[#DA7756]">
                  {cred.icon}
                </div>
                <p className="font-semibold text-[#2C2C2C] font-poppins">
                  {cred.title}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-[#2C2C2C]/60 font-poppins">URL: </span>
                  <a
                    href={cred.url}
                    className="text-[#DA7756] hover:underline font-poppins"
                  >
                    {cred.url}
                  </a>
                </div>
                <div>
                  <span className="text-[#2C2C2C]/60 font-poppins">ID: </span>
                  <span className="text-[#2C2C2C] font-medium font-poppins">
                    {cred.id}
                  </span>
                </div>
                <div>
                  <span className="text-[#2C2C2C]/60 font-poppins">
                    Password:{" "}
                  </span>
                  <span className="text-[#2C2C2C] font-medium font-poppins">
                    {cred.pass}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Owner */}
      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Product Owner
        </h3>
        <div className="flex items-center gap-4">
          {productData.ownerImage && (
            <img
              src={productData.ownerImage}
              alt={productData.owner}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#DA7756]"
            />
          )}
          <div>
            <p className="font-semibold text-[#2C2C2C] font-poppins">
              {productData.owner}
            </p>
            <p className="text-sm text-[#2C2C2C]/60 font-poppins">
              Product Owner - {productData.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== MAIN SNAG 360 PAGE COMPONENT ==============
const Snag360Page: React.FC = () => {
  const navigate = useNavigate();
  const security = useProductSecurity();
  const snagTabsScrollRef = useRef<HTMLDivElement>(null);

  // Extract use cases data for custom component
  const industryUseCases =
    productData.extendedContent?.detailedUseCases?.industryUseCases || [];
  const internalTeamUseCases =
    productData.extendedContent?.detailedUseCases?.internalTeamUseCases || [];

  const tabOrder = productData.tabOrder;

  return (
    <div
      className="min-h-screen bg-[#F6F4EE] pb-20 select-none font-poppins transition-all duration-300"
      style={{
        filter: security.isBlurred ? "blur(20px)" : "none",
        transition: "filter 0.3s ease",
      }}
    >
      {/* Security Overlays */}
      <SecurityOverlays security={security} />

      {/* Header */}
      <div className="relative mb-4 flex flex-col items-center bg-[#F6F4EE] pt-4">
        <div className="w-full max-w-7xl px-6 lg:px-10 mb-4">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-[#2C2C2C] border border-[#C4B89D]/50 px-3 py-1.5 rounded-full hover:bg-[#DA7756]/8 hover:border-[#DA7756]/30 hover:text-[#DA7756] transition-all font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="text-center w-full max-w-7xl px-6 lg:px-10">
          <div className="inline-block px-4 py-1.5 bg-[#DA7756]/10 text-[#DA7756] text-[10px] font-semibold rounded-full mb-3 tracking-[0.15em] uppercase border border-[#DA7756]/20">
            {productData.industries}
          </div>
          <h1 className="text-4xl font-semibold text-[#2C2C2C] mb-4 tracking-tight lg:text-5xl font-poppins">
            {productData.name}
          </h1>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed max-w-3xl mx-auto font-poppins">
            {productData.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-6 lg:px-10 mx-auto">
        <Tabs defaultValue="summary" className="w-full">
          <div
            ref={snagTabsScrollRef}
            className="overflow-x-auto no-scrollbar mb-8"
          >
            <div className="flex justify-start pb-2 px-1">
              <TabsList className="inline-flex gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-full p-1.5 h-auto items-center justify-start">
                {tabOrder.map((tabId) => (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-nowrap flex-shrink-0 bg-transparent"
                  >
                    {snagTabLabels[tabId]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6 animate-fade-in">
            <Snag360SummaryTab />
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6 animate-fade-in">
            <Snag360FeaturesTab />
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6 animate-fade-in">
            <Snag360MarketTab />
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6 animate-fade-in">
            <Snag360PricingTab />
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="usecases" className="space-y-6 animate-fade-in">
            <Snag360UseCasesTab
              industryUseCases={industryUseCases}
              internalTeamUseCases={internalTeamUseCases}
              productName={productData.name}
            />
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-12 animate-fade-in">
            <Snag360RoadmapTab />
          </TabsContent>

          {/* Business Plan Tab */}
          <TabsContent value="business" className="space-y-10">
            <Snag360BusinessPlanTab />
          </TabsContent>

          {/* GTM Tab */}
          <TabsContent value="gtm" className="space-y-6 animate-fade-in">
            <Snag360GTMTab />
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6 animate-fade-in">
            <Snag360MetricsTab />
          </TabsContent>

          {/* SWOT Tab */}
          <TabsContent value="swot" className="space-y-6 animate-fade-in">
            <Snag360SWOTTab />
          </TabsContent>

          {/* Enhancements Tab */}
          <TabsContent
            value="enhancements"
            className="space-y-12 animate-fade-in"
          >
            <Snag360EnhancementsTab />
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-8">
            <Snag360AssetsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Snag360Page;
