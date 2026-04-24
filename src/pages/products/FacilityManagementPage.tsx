import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Zap,
  DollarSign,
  Lock,
  Users,
  BarChart3,
  Briefcase,
  Presentation,
  Monitor,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import FMMatrixUseCasesTab from "./tabs/FMMatrixUseCasesTab";
import FMMatrixSWOTTab from "./tabs/FMMatrixSWOTTab";
import FMMatrixRoadmapTab from "./tabs/FMMatrixRoadmapTab";

// --- FM MATRIX DATA ---
const productData = {
  name: "FM Matrix",
  tabOrder: [
    "summary",
    "features",
    "market",
    "pricing",
    "usecases",
    "swot",
    "roadmap",
    "business",
    "gtm",
    "metrics",
    "assets",
  ] as const,
  description:
    "Enterprise Facilities Management platform that unifies maintenance, utilities, finance, security, CRM, visitor management, space, and people operations into one intelligent platform.",
  brief:
    "The only facilities management tool an organization ever needs. Unify multi-site FM operations and reporting into one platform — eliminating the 5-12 disconnected tools most organisations rely on.",
  industries:
    "Commercial Real Estate, IT Park, Manufacturing, Hospitals, Co-working, Retail Chain, Malls, Education, Hospitality",
  owner: "Abdul and Anjali",
  ownerImage: "",
  assets: [
    {
      type: "Link",
      title: "Product Deck",
      url: "#",
      icon: <Presentation className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Demo Portal",
      url: "#",
      id: "demo@fmmatrix.com",
      pass: "Demo#2024",
      icon: <Monitor className="w-5 h-5" />,
    },
  ],
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "FM Matrix" },
        {
          field: "Tagline",
          detail:
            "The only facilities management tool an organisation ever needs.",
        },
        {
          field: "Category",
          detail:
            "Enterprise Facilities Management (FM) Platform — SaaS / web + mobile",
        },
        {
          field: "Core Purpose",
          detail:
            "Unify maintenance, utilities, finance, security, CRM, visitor management, space, and people ops into a single platform — replacing fragmented tools and manual workflows across multi-site portfolios.",
        },
        {
          field: "Geography",
          detail:
            "India (live — 75+ locations) and GCC/Oman (live — initial deployments). Global expansion ready.",
        },
        {
          field: "Product Status (Apr 2026)",
          detail:
            "Live and deployed across 75+ locations in India and Oman. Core FM platform with 12 categories, 50+ modules in production. Mobile app deployed for technicians, security, and visitors.",
        },
      ],
      problemSolves: [
        {
          painPoint: "Fragmentation: 5-12 disconnected tools",
          solution:
            "Most organizations run separate systems for ticketing, asset registers, billing spreadsheets, visitor logs, and energy dashboards. Data never integrates. FM Matrix consolidates all functions into one platform with unified data, single user experience, and unified reporting.",
        },
        {
          painPoint: "Zero real-time facility visibility",
          solution:
            "Leadership has no consolidated view of facility health, compliance status, or cost trends across multi-site portfolios. Reporting is manual and weekly. FM Matrix provides real-time executive dashboards across all sites with instant alerts for critical maintenance, compliance gaps, and cost overruns.",
        },
        {
          painPoint: "Manual compliance tracking creates liability",
          solution:
            "Regulatory checklists, PTW (Permit to Work), AMC renewals, and safety audits are tracked in spreadsheets and emails. This creates compliance risk and audit failures. FM Matrix digitizes compliance workflows with mandatory checklists, audit trails, and regulatory reporting.",
        },
        {
          painPoint: "Tenant experience fragmented and outdated",
          solution:
            "Residents and tenants interact via paper passes, phone calls, and WhatsApp for requests. No digital engagement channel. FM Matrix provides tenants with digital gate passes, work order tracking, amenity booking, and QR-based services (food ordering, parking, space booking).",
        },
      ],
      whoItIsFor: [
        {
          role: "Head of Facilities / FM Director",
          useCase:
            "Configure maintenance workflows, monitor real-time facility health dashboard, manage vendor SLAs, track compliance and safety protocols across all sites.",
          frustration:
            "Manual consolidation of data from 8-10 fragmented systems. Daily time spent chasing status updates from technicians, vendors, and accounting.",
          gain: "Single unified dashboard showing all facility data; real-time alerts for critical issues; zero manual data compilation; vendor SLA tracking automated.",
        },
        {
          role: "VP Real Estate / CRE Investor",
          useCase:
            "Monitor property-level operating metrics (maintenance cost, compliance score, tenant satisfaction) across portfolio. Make investment decisions based on real facility data.",
          frustration:
            "Quarterly reports assembled from multiple systems; no real-time facility health visibility; unable to compare performance across properties.",
          gain: "Real-time property performance dashboard; instant comparison of maintenance cost and quality across portfolio; predictive alerts for major capex needs.",
        },
        {
          role: "Site Maintenance Technician",
          useCase:
            "Receive work orders via mobile app, log completion with photos, track asset maintenance history, report issues to supervisor.",
          frustration:
            "Paper work orders, email, or WhatsApp messages; no historical context on equipment issues; manual time tracking; report writing done on paper.",
          gain: "Mobile app for work order assignment and completion logging; asset history and preventive maintenance reminders available on device; time auto-tracked.",
        },
        {
          role: "Security Manager / Safety Officer",
          useCase:
            "Configure and execute safety compliance protocols (PTW, incident management, patrolling), manage visitor access and parking, track safety incidents with photo evidence.",
          frustration:
            "Manual compliance checklists, paper-based visitor logs, WhatsApp incident reporting, no standardized safety protocols across sites.",
          gain: "Digital PTW workflow with structured approvals, digital visitor portal with pre-registration, incident management with IVR alerting, patrol QR checkpoint tracking.",
        },
        {
          role: "Finance Controller",
          useCase:
            "Monitor maintenance and utility spend, track PO/WO approvals, vendor performance, CAM billing automation for multi-tenant properties.",
          frustration:
            "Maintenance and utility data comes from different sources; manual vendor billing reconciliation; no cost trend analysis by category or asset.",
          gain: "Unified cost tracking across maintenance, utilities, and vendor spend; automated CAM billing; drill-down cost analysis by vendor, asset, and site.",
        },
      ],
      featureSummary:
        "FM Matrix delivers end-to-end facilities management across 12 core categories: Maintenance (helpdesk, asset lifecycle, EBOM, soft services, compliance, cost approval, inventory, vendor audit), Utility (energy meters, water management, waste, STP), Finance (CAM billing, PO/WO management, vendor management), CRM (customer master, tenancy tracking), Visitor & Gate (gate management with face scan, pre-registration, patrolling), Projects (fitout management), Experience (events, survey, business directory), Property Management (room booking, space management, parking, attendance), Security (gate pass, visitor registry, vehicle tracking), VAS (F&B, parking, OSR, space booking, loyalty marketplace), Marketplace (app store for extensions), and Safety (PTW, incident management, MSafe).",
      today: [
        {
          dimension: "Deployments",
          state:
            "Live across 75+ locations in India and Oman. Core FM platform with 12 categories, 50+ modules in production.",
        },
        {
          dimension: "Modules Shipped",
          state:
            "12 product categories, 50+ modules covering Maintenance, Utility, Finance, CRM, Visitor & Gate, Projects, Experience, Property Management, Security, VAS, Marketplace, and Safety.",
        },
        {
          dimension: "Mobile",
          state:
            "Field-facing mobile app in use by technicians, security staff, and visitors at all 75+ locations.",
        },
        {
          dimension: "Integrations",
          state:
            "Marketplace with installable extensions: Lease Management, Loyalty Rule Engine, Cloud Telephony, Accounting.",
        },
        {
          dimension: "Competitive Moat",
          state:
            "All-in-one depth (12 categories vs competitors' 2-3), India-first design with 75+ site deployment experience, tenant experience features (QR ordering, loyalty), AI-ready architecture, compliance built-in (PTW, MSafe, Compliance Tracker).",
        },
        {
          dimension: "Key Markets",
          state:
            "India: Commercial real estate operators, IT/SEZ parks, hospitals, co-working, manufacturing campuses, educational institutions. GCC: Oman (live), targeting Saudi Arabia and UAE.",
        },
      ],
    },
    detailedFeatures: [
      // MAINTENANCE - Helpdesk
      { isCategory: true, categoryName: "MAINTENANCE" },
      {
        featureName: "Helpdesk — Ticket Logging & Tracking",
        description:
          "Central point for logging, tracking, and resolving maintenance and service requests with automated notifications.",
        isUSP: "No",
        module: "Maintenance / Helpdesk",
        userType: "Facility Manager, Technician, Tenant",
        status: "Live",
        priority: "P1",
        notes: "Core entry point for all reactive maintenance work.",
      },
      {
        featureName: "Helpdesk — 5-Level Escalation",
        description:
          "Tickets auto-escalate through five defined levels if not resolved within TAT, ensuring no request goes unresolved.",
        isUSP: "Yes",
        module: "Maintenance / Helpdesk",
        userType: "Facility Manager, FM Head",
        status: "Live",
        priority: "P1",
        notes: "Differentiator: most FM tools cap at 2–3 levels.",
      },
      {
        featureName: "Helpdesk — Auto Workflow Assignment",
        description:
          "Automatically routes tickets to the right technician or vendor based on category, location, and availability rules.",
        isUSP: "Yes",
        module: "Maintenance / Helpdesk",
        userType: "System / Admin",
        status: "Live",
        priority: "P1",
        notes: "Eliminates manual dispatch; reduces resolution time.",
      },
      {
        featureName: "Helpdesk — Cost Approval Mechanism",
        description:
          "Approval workflow triggered when a ticket requires spend above a defined threshold, routed through the right authority.",
        isUSP: "Yes",
        module: "Maintenance / Helpdesk",
        userType: "Finance, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "Connects maintenance ops to financial governance.",
      },
      {
        featureName: "Helpdesk — TAT-Based Reporting",
        description:
          "Reports track whether tickets are resolved within agreed turnaround times, surfacing SLA breaches and team performance.",
        isUSP: "No",
        module: "Maintenance / Helpdesk",
        userType: "FM Head, CXO",
        status: "Live",
        priority: "P1",
        notes: "Key for SLA contract compliance reporting.",
      },
      {
        featureName: "Helpdesk — Vendor Assignment",
        description:
          "Assigns maintenance tasks directly to third-party vendors with tracking of work order acceptance and completion.",
        isUSP: "No",
        module: "Maintenance / Helpdesk",
        userType: "FM Manager, Vendor",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // MAINTENANCE - Asset
      {
        featureName: "Asset Tagging & Registration",
        description:
          "Register and tag all assets with unique IDs, linking them to locations, categories, and responsible teams.",
        isUSP: "No",
        module: "Maintenance / Asset",
        userType: "Facility Manager",
        status: "Live",
        priority: "P1",
        notes: "Foundation for all asset lifecycle tracking.",
      },
      {
        featureName: "Asset Warranty & Alert Management",
        description:
          "Stores warranty and guarantee details and automatically alerts teams when warranties are nearing expiry.",
        isUSP: "Yes",
        module: "Maintenance / Asset",
        userType: "Facility Manager, Procurement",
        status: "Live",
        priority: "P2",
        notes: "Prevents costly out-of-warranty repairs from going unnoticed.",
      },
      {
        featureName: "Asset Categorisation",
        description:
          "Group assets by type, criticality, location, or department for filtered reporting and maintenance planning.",
        isUSP: "No",
        module: "Maintenance / Asset",
        userType: "Facility Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Asset Information Management",
        description:
          "Attaches manuals, invoices, service history, and documentation to each asset record.",
        isUSP: "No",
        module: "Maintenance / Asset",
        userType: "Facility Manager, Technician",
        status: "Live",
        priority: "P2",
        notes: "Eliminates paper files and email chains for asset docs.",
      },
      {
        featureName: "Cost of Ownership Tracking",
        description:
          "Aggregates repair costs, downtime, and maintenance spend per asset to calculate total cost of ownership.",
        isUSP: "Yes",
        module: "Maintenance / Asset",
        userType: "Finance, FM Head",
        status: "Live",
        priority: "P1",
        notes: "Directly supports repair-vs-replace decisions.",
      },
      {
        featureName: "Associated Assets Linking",
        description:
          "Links related equipment (e.g., HVAC unit + ducts + thermostat) for dependency-aware maintenance planning.",
        isUSP: "Yes",
        module: "Maintenance / Asset",
        userType: "Facility Manager, Technician",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "EBOM (Engineering Bill of Materials)",
        description:
          "Manages asset components and spare parts lists to ensure smooth maintenance and replacement sourcing.",
        isUSP: "Yes",
        module: "Maintenance / Asset",
        userType: "Maintenance Engineer",
        status: "Live",
        priority: "P1",
        notes: "Critical for complex mechanical/electrical assets.",
      },

      // MAINTENANCE - Soft Services
      {
        featureName: "Soft Services — Task Assignment & Scheduling",
        description:
          "Automates scheduling and assignment of housekeeping, landscaping, pest control, and similar soft services.",
        isUSP: "No",
        module: "Maintenance / Soft Services",
        userType: "FM Manager, Housekeeping Staff",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Soft Services — Location Tagging",
        description:
          "Tags and configures specific locations for each soft service activity, ensuring coverage and accountability.",
        isUSP: "No",
        module: "Maintenance / Soft Services",
        userType: "FM Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Soft Services — Automated Alerts",
        description:
          "Sends alerts when tasks are due, overdue, or not completed as scheduled.",
        isUSP: "No",
        module: "Maintenance / Soft Services",
        userType: "FM Manager, Supervisor",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Soft Services — Checklist Maintenance",
        description:
          "Digital checklists for each soft service task, ensuring SOPs are followed and documented.",
        isUSP: "No",
        module: "Maintenance / Soft Services",
        userType: "Housekeeping Staff, Supervisor",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // MAINTENANCE - Preparedness Checklist
      {
        featureName: "Preparedness Checklist — Configuration",
        description:
          "Predefined emergency readiness checklists for fire drills, evacuations, and disaster preparedness.",
        isUSP: "No",
        module: "Maintenance / Preparedness Checklist",
        userType: "Safety Officer, FM Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Preparedness Checklist — Auto Task Assignment",
        description:
          "Automatically assigns checklist tasks to responsible team members when a drill or event is triggered.",
        isUSP: "No",
        module: "Maintenance / Preparedness Checklist",
        userType: "Safety Officer",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Preparedness Checklist — Task Review",
        description:
          "Supervisors can review, comment on, and approve completed checklist tasks.",
        isUSP: "No",
        module: "Maintenance / Preparedness Checklist",
        userType: "Safety Officer, FM Head",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Preparedness Checklist — Negative Task Reporting",
        description:
          "Flags and reports tasks that were not completed or failed compliance criteria, for immediate corrective action.",
        isUSP: "Yes",
        module: "Maintenance / Preparedness Checklist",
        userType: "Safety Officer, Auditor",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // MAINTENANCE - Digital Checklist
      {
        featureName: "Digital Checklist — PPM/AMC Configuration",
        description:
          "Configures Planned Preventive Maintenance and AMC checklists that run on defined schedules.",
        isUSP: "Yes",
        module: "Maintenance / Digital Checklist",
        userType: "FM Manager, Technician",
        status: "Live",
        priority: "P1",
        notes: "Core for proactive FM — not just reactive ticketing.",
      },
      {
        featureName: "Digital Checklist — Task Management & Assignment",
        description:
          "Assigns checklist tasks to staff, tracks status, and enables review and approval workflows.",
        isUSP: "No",
        module: "Maintenance / Digital Checklist",
        userType: "FM Manager, Technician",
        status: "Live",
        priority: "P1",
        notes: "",
      },

      // MAINTENANCE - Compliance Tracker
      {
        featureName: "Compliance Tracker — Renewal Alerts",
        description:
          "Monitors licenses, certifications, and statutory compliances; triggers alerts well before renewal deadlines.",
        isUSP: "Yes",
        module: "Maintenance / Compliance Tracker",
        userType: "FM Head, Admin, Vendor",
        status: "Live",
        priority: "P1",
        notes:
          "Prevents lapse of statutory certificates — a major liability risk.",
      },
      {
        featureName: "Compliance Tracker — Email Trigger to AMC Vendors",
        description:
          "Automatically emails AMC vendors when their service or certification is due for renewal.",
        isUSP: "Yes",
        module: "Maintenance / Compliance Tracker",
        userType: "Admin, Vendor",
        status: "Live",
        priority: "P2",
        notes: "Removes manual follow-up entirely.",
      },

      // MAINTENANCE - Cost Approval
      {
        featureName: "Cost Approval System — R&M Spend Tracking",
        description:
          "Tracks all repair and maintenance costs against budget, with approval at configurable thresholds.",
        isUSP: "Yes",
        module: "Maintenance / Cost Approval",
        userType: "Finance, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Cost Approval System — Role-Based Approval Hierarchy",
        description:
          "Multi-level approval routing based on user role and cost amount, ensuring the right authority approves each spend.",
        isUSP: "Yes",
        module: "Maintenance / Cost Approval",
        userType: "Finance, FM Head, CXO",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Cost Approval System — Real-Time Response & Reports",
        description:
          "Approvers act in real time via app/email; reports show approved, rejected, and pending items with trends.",
        isUSP: "No",
        module: "Maintenance / Cost Approval",
        userType: "Finance, FM Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // MAINTENANCE - Inventory
      {
        featureName: "Inventory — Spares & Consumable Tracking",
        description:
          "Tracks stock levels of spare parts and consumables across stores with real-time visibility.",
        isUSP: "No",
        module: "Maintenance / Inventory",
        userType: "Stores Manager, Technician",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Inventory — GRN/GDN Tracking",
        description:
          "Logs Goods Received Notes and Goods Dispatch Notes for complete stock movement audit trail.",
        isUSP: "No",
        module: "Maintenance / Inventory",
        userType: "Stores Manager, Finance",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Inventory — Insufficient Stock Alerts",
        description:
          "Automated alerts when stock falls below minimum threshold, triggering reorder workflows.",
        isUSP: "Yes",
        module: "Maintenance / Inventory",
        userType: "Stores Manager, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "Prevents operational stoppages due to missing parts.",
      },
      {
        featureName: "Inventory — Consumption Reports",
        description:
          "Detailed reports on inventory consumption patterns, enabling better procurement planning.",
        isUSP: "No",
        module: "Maintenance / Inventory",
        userType: "FM Head, Finance",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // MAINTENANCE - Green Inventory
      {
        featureName: "Green Inventory Management",
        description:
          "Tracks eco-friendly and sustainable resources separately, monitors consumption, and reports on waste reduction and recycling metrics.",
        isUSP: "Yes",
        module: "Maintenance / Green Inventory",
        userType: "Sustainability Officer, FM Manager",
        status: "Live",
        priority: "P2",
        notes: "Unique in FM space — addresses ESG reporting needs.",
      },

      // MAINTENANCE - Operational Audit
      {
        featureName: "Operational Audit — Digital Checklists & Findings",
        description:
          "Structured digital audits with predefined checklists, evidence attachment, and corrective action assignment.",
        isUSP: "Yes",
        module: "Maintenance / Operational Audit",
        userType: "Auditor, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Operational Audit — Auto Escalation & Reporting",
        description:
          "Unresolved audit findings trigger escalations; reports surface compliance trends and recurring gaps.",
        isUSP: "Yes",
        module: "Maintenance / Operational Audit",
        userType: "FM Head, Compliance Team",
        status: "Live",
        priority: "P1",
        notes: "",
      },

      // MAINTENANCE - Vendor Audit
      {
        featureName: "Vendor Audit",
        description:
          "Structured digital assessments of vendor compliance and performance using pre-defined checklists with auto-escalation of non-compliance.",
        isUSP: "Yes",
        module: "Maintenance / Vendor Audit",
        userType: "FM Manager, Procurement",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // MAINTENANCE - Design Insights
      {
        featureName: "Design Insights Module",
        description:
          "Enables community users to submit design change suggestions (layout, safety, operations) with category tagging, review workflows, and progress tracking.",
        isUSP: "Yes",
        module: "Maintenance / Design Insights",
        userType: "Tenant, FM Manager",
        status: "Live",
        priority: "P3",
        notes:
          "Rare in FM platforms — drives tenant engagement beyond ticketing.",
      },

      // MAINTENANCE - Miles
      {
        featureName: "Miles — Travel Reimbursement Tracking",
        description:
          "Records and tracks work-related travel distance for field employees; auto-generates reports for manager approval.",
        isUSP: "Yes",
        module: "Maintenance / Miles",
        userType: "Field Technician, HR, Manager",
        status: "Live",
        priority: "P3",
        notes: "",
      },

      // UTILITY
      { isCategory: true, categoryName: "UTILITY" },
      {
        featureName: "Energy Meter Monitoring",
        description:
          "Tracks electricity consumption, identifies usage anomalies, and triggers alerts for unexpected spikes or wastage.",
        isUSP: "No",
        module: "Utility / Energy Meters",
        userType: "Facility Manager, Sustainability Officer",
        status: "Live",
        priority: "P1",
        notes: "",
      },

      // UTILITY - Water
      {
        featureName: "Water Management",
        description:
          "Monitors water consumption in real time, detects leaks, and reports on zone-level usage.",
        isUSP: "Yes",
        module: "Utility / Water Management",
        userType: "Facility Manager",
        status: "Live",
        priority: "P1",
        notes:
          "Leak detection is a high-value differentiator in water-scarce GCC markets.",
      },

      // UTILITY - Waste
      {
        featureName: "Waste Management — Logging & Categorisation",
        description:
          "Logs daily waste generation by type (organic, recyclable, hazardous), records disposal methods, and tracks recycled vs. total waste.",
        isUSP: "Yes",
        module: "Utility / Waste Management",
        userType: "FM Manager, Sustainability Officer",
        status: "Live",
        priority: "P2",
        notes: "Supports ESG reporting and regulatory compliance.",
      },
      {
        featureName: "Waste Management — Recycling Vendor Assignment",
        description:
          "Allows users to assign recycled waste batches to specific vendors, creating a complete waste-to-vendor audit trail.",
        isUSP: "Yes",
        module: "Utility / Waste Management",
        userType: "FM Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // UTILITY - STP
      {
        featureName: "STP Operations Management",
        description:
          "Manages and monitors Sewage Treatment Plant operations with maintenance scheduling and regulatory compliance alerts.",
        isUSP: "No",
        module: "Utility / STP",
        userType: "Facility Manager, Engineer",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // FINANCE
      { isCategory: true, categoryName: "FINANCE" },
      {
        featureName: "CAM Billing Automation",
        description:
          "Auto-calculates Common Area Maintenance charges based on tenant occupancy and billing rules, generates invoices and tracks payments.",
        isUSP: "Yes",
        module: "Finance / CAM Billing",
        userType: "Finance Controller, Property Manager",
        status: "Live",
        priority: "P1",
        notes:
          "High-value for commercial RE operators who currently do this in Excel.",
      },
      {
        featureName: "PO/WO — Digital Procurement & Work Orders",
        description:
          "Digitises purchase orders and vendor work orders with multi-level approval routing and status tracking.",
        isUSP: "Yes",
        module: "Finance / PO/WO",
        userType: "Finance, FM Manager, Vendor",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Vendor Management — Contracts & Performance",
        description:
          "Maintains vendor contract repository, tracks SLA performance, and enables ratings for vendor evaluation.",
        isUSP: "Yes",
        module: "Finance / Vendor Management",
        userType: "FM Manager, Procurement",
        status: "Live",
        priority: "P1",
        notes: "",
      },

      // CRM
      { isCategory: true, categoryName: "CRM" },
      {
        featureName: "Customer Master — Tenancy & Parking Lease",
        description:
          "Centralised customer database covering tenancy details, lease periods, parking allocations, and contact information.",
        isUSP: "No",
        module: "CRM / Customer Master",
        userType: "Property Manager, Finance",
        status: "Live",
        priority: "P1",
        notes: "",
      },

      // VISITOR & GATE MANAGEMENT
      { isCategory: true, categoryName: "VISITOR & GATE MANAGEMENT" },
      {
        featureName: "Gate Management — Automated Access Control",
        description:
          "Controls entry/exit at gate points with face-scan for pre-approved staff and automated security logs.",
        isUSP: "Yes",
        module: "Visitor & Gate / Gate Management",
        userType: "Security Staff, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Visitor Pre-Registration & Digital Passes",
        description:
          "Guests pre-register online and receive digital entry passes; check-in is contactless and logged.",
        isUSP: "Yes",
        module: "Visitor & Gate / Visitor",
        userType: "Security, Tenant, Guest",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Patrolling — QR Checkpoint Verification",
        description:
          "Security guards scan QR codes at defined patrol checkpoints; missed scans trigger supervisor alerts.",
        isUSP: "Yes",
        module: "Visitor & Gate / Patrolling",
        userType: "Security Guard, Security Head",
        status: "Live",
        priority: "P1",
        notes:
          "Accountability and auditability built in — not just a route tracker.",
      },
      {
        featureName: "Patrolling — Patrol Reports",
        description:
          "Detailed reports on patrol coverage, missed checkpoints, incident trends, and guard efficiency.",
        isUSP: "No",
        module: "Visitor & Gate / Patrolling",
        userType: "Security Head, FM Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Staff Management — Scheduling & Attendance",
        description:
          "Manages staff shift rosters, attendance, and role-based access; auto-generates schedules based on demand.",
        isUSP: "No",
        module: "Visitor & Gate / Staff Management",
        userType: "HR, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },

      // PROJECTS
      { isCategory: true, categoryName: "PROJECTS" },
      {
        featureName: "Fitout Management",
        description:
          "Manages tenant fit-out requests, tracks multi-stage approvals, and ensures compliance with building standards throughout the project.",
        isUSP: "No",
        module: "Projects / Fitout",
        userType: "Property Manager, Tenant, Contractor",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // EXPERIENCE
      { isCategory: true, categoryName: "EXPERIENCE" },
      {
        featureName: "Events & Broadcast — Mass Communication",
        description:
          "Send facility-wide announcements, alerts, and event notifications to tenants, staff, and vendors via app and email.",
        isUSP: "No",
        module: "Experience / Events & Broadcast",
        userType: "FM Manager, Admin, Tenant",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Digital Safe — Document Repository",
        description:
          "Securely stores and organises critical facility documents (contracts, blueprints, compliance reports) with easy retrieval.",
        isUSP: "No",
        module: "Experience / Digital Safe",
        userType: "FM Head, Legal, Finance",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Survey Module — Tenant & Staff Feedback",
        description:
          "Create and distribute customisable surveys; automated notifications drive response rates; real-time analytics surface insights.",
        isUSP: "Yes",
        module: "Experience / Survey",
        userType: "FM Manager, HR, Tenant",
        status: "Live",
        priority: "P2",
        notes:
          "Closes the loop between occupant feedback and service improvement.",
      },
      {
        featureName: "Business Directory",
        description:
          "Centralised directory of vendors, service providers, and businesses with search, filter, contact info, and ratings.",
        isUSP: "No",
        module: "Experience / Business Directory",
        userType: "FM Manager, Tenant",
        status: "Live",
        priority: "P3",
        notes: "",
      },
      {
        featureName: "Minutes of Meeting (MoM)",
        description:
          "Records meeting discussions, decisions, and action items; assigns follow-up tasks with deadlines and automated reminders.",
        isUSP: "No",
        module: "Experience / MoM",
        userType: "FM Manager, Project Team",
        status: "Live",
        priority: "P3",
        notes: "",
      },
      {
        featureName: "Task Management",
        description:
          "Centralised task assignment and tracking with priority settings, deadlines, escalations, and real-time analytics on completion.",
        isUSP: "No",
        module: "Experience / Task Management",
        userType: "FM Manager, Technician, All Teams",
        status: "Live",
        priority: "P1",
        notes: "",
      },

      // PROPERTY MANAGEMENT
      { isCategory: true, categoryName: "PROPERTY MANAGEMENT" },
      {
        featureName: "Facility Management — Room Booking",
        description:
          "Intuitive room and amenity booking system with availability calendar, conflict prevention, and QR-based food ordering.",
        isUSP: "Yes",
        module: "Property Mgmt / Facility Management",
        userType: "Employee, Tenant, FM Manager",
        status: "Live",
        priority: "P1",
        notes:
          "QR food ordering in meeting rooms is a standout differentiator.",
      },
      {
        featureName: "Space Management — Hot Desking & Booking",
        description:
          "Allows employees or admins to manage desk/seat allocation, with approval workflows for hybrid workspace management.",
        isUSP: "Yes",
        module: "Property Mgmt / Space Management",
        userType: "HR, Employee, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "High demand post-pandemic with hybrid work models.",
      },
      {
        featureName: "Mailroom Management — Package Tracking",
        description:
          "Logs incoming and outgoing mail, notifies recipients in real time, and requires delivery code verification for secure collection.",
        isUSP: "Yes",
        module: "Property Mgmt / Mailroom Management",
        userType: "Admin, Employee, Courier",
        status: "Live",
        priority: "P2",
        notes:
          "Delivery code verification prevents unauthorised package pickup.",
      },
      {
        featureName: "Parking Management — Allocation & Monitoring",
        description:
          "Allocates parking slots by vehicle type (2W/4W/EV), manages lease dates, and tracks free vs. paid parking in real time.",
        isUSP: "No",
        module: "Property Mgmt / Parking Management",
        userType: "Property Manager, Tenant, Security",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Attendance Management — Facial Recognition & Geo-Tag",
        description:
          "Tracks employee attendance via facial recognition and geo-tagged check-ins; generates detailed date-wise attendance logs.",
        isUSP: "Yes",
        module: "Property Mgmt / Attendance Management",
        userType: "HR, FM Manager, Employee",
        status: "Live",
        priority: "P1",
        notes: "Eliminates buddy punching and manual registers.",
      },

      // SECURITY
      { isCategory: true, categoryName: "SECURITY" },
      {
        featureName: "Gate Pass — Inward (Material Entry)",
        description:
          "Records all inbound goods entering the facility: visitor details, transport mode, gate number, invoice info, and item details.",
        isUSP: "No",
        module: "Security / Gate Pass",
        userType: "Security Staff, Stores Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Gate Pass — Outward (Material Exit)",
        description:
          "Logs outbound materials with returnable/non-returnable status, expected return dates, and item-level details.",
        isUSP: "Yes",
        module: "Security / Gate Pass",
        userType: "Security Staff, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "Returnable tracking is critical for asset loss prevention.",
      },
      {
        featureName: "Security Visitor Registry",
        description:
          "Captures visitor name, mobile, host, purpose, and location; supports mobile-number-based quick check-in for repeat visitors.",
        isUSP: "No",
        module: "Security / Visitor",
        userType: "Security Staff",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Staff Registry — Identity & Access Records",
        description:
          "Maintains structured profiles of facility staff and vendor personnel with department, staff ID, validity period, and supporting documents.",
        isUSP: "No",
        module: "Security / Staff",
        userType: "Security Head, HR, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Vehicle Tracking — Registered Vehicles",
        description:
          "Manages pre-registered vehicles with assigned parking slots, categories, sticker numbers, and full in/out movement history.",
        isUSP: "No",
        module: "Security / Vehicle",
        userType: "Security Staff, Parking Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Vehicle Tracking — Guest Vehicles",
        description:
          "Enables security to log entry and clearance of guest and occupant vehicles by searching on vehicle number.",
        isUSP: "No",
        module: "Security / Vehicle",
        userType: "Security Staff",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Security Patrol Route Management",
        description:
          "Defines scheduled patrol routes with named patrols, checkpoints, validity periods, grace times, checklists, and assignees.",
        isUSP: "Yes",
        module: "Security / Patrolling",
        userType: "Security Head, FM Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },

      // VALUE ADDED SERVICES
      { isCategory: true, categoryName: "VALUE ADDED SERVICES" },
      {
        featureName: "F&B — Food & Beverage Order Tracking",
        description:
          "Tracks F&B orders placed within the facility with analytics dashboard showing total orders, peak times, and popular outlets.",
        isUSP: "Yes",
        module: "VAS / F&B",
        userType: "Occupant, FM Manager, Outlet Owner",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "VAS Parking Dashboard",
        description:
          "Real-time dashboard showing parking slot availability; allocates 2W and 4W slots to clients across buildings and floors.",
        isUSP: "No",
        module: "VAS / Parking",
        userType: "Property Manager, Tenant",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "OSR — On-Site Request Management",
        description:
          "Tenants raise on-site service requests (pest control, deep cleaning, civil work); FM tracks schedules, payments, and generates invoices.",
        isUSP: "Yes",
        module: "VAS / OSR",
        userType: "Tenant, FM Manager, Finance",
        status: "Live",
        priority: "P2",
        notes: "Monetisable service layer on top of base FM operations.",
      },
      {
        featureName: "VAS Space Management — Bookings",
        description:
          "View and manage all employee seat bookings by date, shift, and seat type from the VAS tenant portal.",
        isUSP: "No",
        module: "VAS / Space Management",
        userType: "Tenant, HR, FM Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "VAS Space Management — Seat Requests & Approval",
        description:
          "Review and action seat allocation approval requests, tracking pending, approved, and rejected status.",
        isUSP: "No",
        module: "VAS / Space Management",
        userType: "HR, FM Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Facility Booking — Calendar & List View",
        description:
          "Enables reservation of facility spaces and amenities via calendar or list view, supporting direct booking and request-based slots.",
        isUSP: "No",
        module: "VAS / Booking",
        userType: "Tenant, Employee, FM Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Redemption Marketplace — Loyalty Programme",
        description:
          "Loyalty tiers (Bronze, Silver, Gold) where users earn and redeem points across hotels, F&B, and entertainment categories.",
        isUSP: "Yes",
        module: "VAS / Redemption Marketplace",
        userType: "Occupant, Tenant, Property Manager",
        status: "Live",
        priority: "P2",
        notes:
          "No other FM platform offers an integrated tenant loyalty programme.",
      },

      // MARKETPLACE
      { isCategory: true, categoryName: "MARKETPLACE" },
      {
        featureName: "Marketplace — App Catalogue & Installation",
        description:
          "In-platform app store to browse, filter, and install third-party extension applications directly into FM Matrix.",
        isUSP: "Yes",
        module: "Marketplace / All",
        userType: "FM Admin, IT Manager",
        status: "Live",
        priority: "P2",
        notes:
          "Platform model creates ecosystem moat and revenue share potential.",
      },
      {
        featureName: "Marketplace Extension — Lease Management",
        description:
          "Installable extension for comprehensive lease portfolio management: finance + operational data, end-to-end contract tracking.",
        isUSP: "Yes",
        module: "Marketplace / Extensions",
        userType: "Property Manager, Finance",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Marketplace Extension — Loyalty Rule Engine",
        description:
          "Configures rule-based loyalty programs with point rewards, personalized campaigns, and CRM-integrated customer engagement.",
        isUSP: "Yes",
        module: "Marketplace / Extensions",
        userType: "Marketing, Property Manager",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Marketplace Extension — Cloud Telephony",
        description:
          "Enterprise-grade cloud voice services with intelligent call routing and real-time call analytics, embedded in FM workflows.",
        isUSP: "Yes",
        module: "Marketplace / Extensions",
        userType: "FM Manager, Security, CX Team",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "Marketplace Extension — Accounting",
        description:
          "Full financial management: automated invoicing, expense tracking, multi-currency support, and real-time financial reporting.",
        isUSP: "Yes",
        module: "Marketplace / Extensions",
        userType: "Finance Controller, CFO",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "Marketplace — Installed Apps Management",
        description:
          "Consolidated view of all active marketplace apps with installation dates and one-click management.",
        isUSP: "No",
        module: "Marketplace / Installed",
        userType: "FM Admin, IT Manager",
        status: "Live",
        priority: "P3",
        notes: "",
      },
      {
        featureName: "Marketplace — Version Updates & Notifications",
        description:
          "Notifies users of available extension updates; supports one-click or bulk updates to keep extensions current.",
        isUSP: "No",
        module: "Marketplace / Updates",
        userType: "FM Admin, IT Manager",
        status: "Live",
        priority: "P3",
        notes: "",
      },

      // SAFETY
      { isCategory: true, categoryName: "SAFETY" },
      {
        featureName: "PTW — Permit to Work",
        description:
          "Issues, tracks, and closes work permits for high-risk tasks with structured multi-level approval and safety check completion requirements.",
        isUSP: "Yes",
        module: "Safety / PTW",
        userType: "Safety Officer, Contractor, FM Head",
        status: "Live",
        priority: "P1",
        notes:
          "Required by law for high-risk work in most regulated industries.",
      },
      {
        featureName: "Incident Management — Real-Time Logging & Escalation",
        description:
          "Logs incidents in real time, categorises by severity, auto-assigns response teams, and escalates via app notifications and IVR calls.",
        isUSP: "Yes",
        module: "Safety / Incident Management",
        userType: "All Staff, Safety Officer, FM Head",
        status: "Live",
        priority: "P1",
        notes:
          "IVR call escalation is a standout differentiator in the safety space.",
      },
      {
        featureName: "Incident Management — Analytics & Prevention",
        description:
          "Post-resolution reports identify incident trends, root causes, and preventive recommendations.",
        isUSP: "Yes",
        module: "Safety / Incident Management",
        userType: "FM Head, Safety Officer, CXO",
        status: "Live",
        priority: "P2",
        notes: "",
      },
      {
        featureName: "MSafe — KRCC (Key Risk Compliance Checks)",
        description:
          "Mandatory safety compliance checks for all FTEs before their first day; external FTEs require Line Manager approval.",
        isUSP: "Yes",
        module: "Safety / MSafe",
        userType: "HR, Line Manager, Safety Officer",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "MSafe — Training Module",
        description:
          "Tracks safety training completion for internal and external FTEs with visibility into compliance status.",
        isUSP: "No",
        module: "Safety / MSafe",
        userType: "HR, Line Manager, Trainer",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "MSafe — Line Manager Connect (LMC)",
        description:
          "Direct communication channel between safety system and line managers for FTE safety approvals and escalations.",
        isUSP: "Yes",
        module: "Safety / MSafe",
        userType: "Line Manager, HR, Safety Officer",
        status: "Live",
        priority: "P2",
        notes: "",
      },

      // PLATFORM & SETUP
      { isCategory: true, categoryName: "PLATFORM & SETUP" },
      {
        featureName: "Central Dashboard",
        description:
          "Real-time facility performance dashboard displaying open maintenance requests, energy trends, visitor logs, and key metrics across modules.",
        isUSP: "Yes",
        module: "Platform / Dashboard",
        userType: "FM Head, CXO, All Managers",
        status: "Live",
        priority: "P1",
        notes: "Single pane of glass across the entire FM stack.",
      },
      {
        featureName: "Account & Site Hierarchy Setup",
        description:
          "Configures company details, multi-site structure, and nested location hierarchy (building, wing, floor, room) for the entire organisation.",
        isUSP: "No",
        module: "Platform / Setup",
        userType: "FM Admin, IT Manager",
        status: "Live",
        priority: "P1",
        notes: "",
      },
      {
        featureName: "User & Role-Based Access Control (RBAC)",
        description:
          "Assigns roles, sets permissions, and manages user access based on responsibilities across teams and sites.",
        isUSP: "Yes",
        module: "Platform / Setup",
        userType: "FM Admin, IT Manager",
        status: "Live",
        priority: "P1",
        notes: "RBAC at this depth supports enterprise multi-site governance.",
      },
      {
        featureName: "Approval Flow Configuration",
        description:
          "Defines and customises multi-level approval workflows for any process (cost, procurement, access) based on amount, urgency, or department.",
        isUSP: "Yes",
        module: "Platform / Setup",
        userType: "FM Admin, Finance Head",
        status: "Live",
        priority: "P1",
        notes: "",
      },
    ],
    usps: [
      {
        headline: "All-in-one depth",
        description:
          "Not just a helpdesk or CMMS — covers the full FM stack including VAS, safety, security, and a marketplace. Reduces vendor count from 10+ to 1.",
      },
      {
        headline: "India-first design",
        description:
          "Built ground-up for Indian facility operations (multi-zone, multi-site, multi-tenant) with on-ground deployment experience at 75+ sites.",
      },
      {
        headline: "Tenant experience",
        description:
          "QR-based food ordering, loyalty rewards, digital gate passes, and survey tools that go beyond pure B2B FM into occupant delight.",
      },
      {
        headline: "AI-ready architecture",
        description:
          "Marketplace extension model enables rapid AI and third-party integrations without core platform rework.",
      },
      {
        headline: "Compliance built-in",
        description:
          "PTW, MSafe, Compliance Tracker, and audit modules address the regulatory requirements that competitors treat as add-ons.",
      },
    ],
    marketAnalysis: [
      {
        segment: "Large Corporate Campus Occupiers (India)",
        demographics:
          "Enterprise HQ, GCC offices, MNC India operations. 500–10,000 employees. Tier 1 cities: Bengaluru, Mumbai, Hyderabad, Pune, Chennai, Delhi NCR.",
        industries:
          "IT/ITES, Banking, Pharma, FMCG (IT/ITES / BFSI / Pharma / FMCG)",
        painPoints:
          "1. Industry: FM is still treated as a cost centre with no performance data — boards can't see ROI on FM spend. 2. Company: Maintenance complaints go to email and WhatsApp — no SLA, no accountability, no audit trail. 3. Company: Compliance certificates (fire NOC, lift inspections) are tracked in Excel and lapse without warning.",
        ifNotSolved:
          "1. FM cost remains unoptimised, eating into operational margins. 2. A lapsed compliance certificate triggers regulatory action or insurance voiding during an incident. 3. Tenant/employee dissatisfaction drives real estate decisions — companies relocate to better-managed buildings.",
        todayState:
          "ServiceNow or Freshdesk for ticketing, Excel for compliance tracking, WhatsApp groups for FM coordination. 'Good enough' = issues get resolved within a week, not necessarily within SLA.",
      },
      {
        segment: "Commercial RE Developers & Operators (India)",
        demographics:
          "Real estate developers managing office/retail/mixed-use assets. Portfolio: 5–50+ buildings. Primarily Tier 1 cities. Professionally managed with in-house or outsourced FM.",
        industries: "Commercial Real Estate, SEZ, IT Parks",
        painPoints:
          "1. Industry: CAM billing disputes with tenants are chronic — manual calculations lead to errors and relationship damage. 2. Company: No unified view of compliance, asset health, and tenant SLAs across a multi-building portfolio. 3. Company: Vendor performance is managed by relationship, not by data — non-compliant vendors stay because there is no audit trail.",
        ifNotSolved:
          "1. CAM disputes escalate to legal and threaten tenancy renewals. 2. A single compliance failure at one building triggers liability across the portfolio. 3. Poor vendor quality reduces tenant satisfaction, increases attrition, and reduces lease renewal rates.",
        todayState:
          "Excel for CAM billing, Zoho Desk or email for complaints, paper vendor contracts. 'Good enough' = invoices go out on time and tenants don't escalate formally.",
      },
      {
        segment: "IFM (Integrated FM) Service Companies (India)",
        demographics:
          "Companies providing FM services to enterprise clients: ISS, BVG, OCS, CBRE, JLL FM arms. 500–50,000 deployed workforce across India.",
        industries: "Facility Management Services (B2B)",
        painPoints:
          "1. Industry: IFM companies win contracts on price but lose renewals on SLA performance — they lack real-time data to prove compliance. 2. Company: Deploying and tracking a distributed workforce across multiple client sites without a unified platform creates massive inefficiency. 3. Company: Billing clients accurately for variable FM services (soft, hard, security) requires data they don't have in real time.",
        ifNotSolved:
          "1. SLA breaches trigger penalty clauses and contract termination — each % point of SLA miss is a direct revenue hit. 2. Workforce idle time and missed deployments inflate cost and reduce margins. 3. Under-billing or over-billing clients erodes trust and invites audits.",
        todayState:
          "Combination of internal ERP, spreadsheets for workforce scheduling, WhatsApp for field comms. 'Good enough' = monthly client reports don't show obvious gaps.",
      },
      {
        segment: "Healthcare Facility Operators (India)",
        demographics:
          "Private hospital chains and multi-specialty hospitals. 100–2,000+ beds. Pan-India chains or standalone regional hospitals. NABH accredited or pursuing accreditation.",
        industries: "Healthcare / Hospital Facilities",
        painPoints:
          "1. Industry: NABH and JCI accreditation require documented evidence of PPM, safety protocols, and corrective actions — manual systems fail audit. 2. Company: Biomedical equipment downtime is directly linked to clinical outcomes; unplanned failures are both costly and dangerous. 3. Company: Housekeeping and infection control SLAs are difficult to monitor and document across large hospital campuses.",
        ifNotSolved:
          "1. Accreditation failure results in loss of empanelment with insurance companies — a direct revenue threat. 2. A critical medical device failure due to missed PPM creates clinical liability and brand damage. 3. Hospital-acquired infections traced to housekeeping lapses trigger regulatory scrutiny.",
        todayState:
          "Manual AMC registers, Excel checklists, paper housekeeping logs. 'Good enough' = pass the next NABH audit without a major non-conformance.",
      },
      {
        segment: "Manufacturing & Industrial Campuses (India)",
        demographics:
          "Factories, plants, and industrial campuses. 200–5,000+ employees. Located in industrial belts: Pune, Chennai, Ahmedabad, NCR, Bengaluru. Regulated industries: auto, pharma, chemicals, FMCG.",
        industries:
          "Manufacturing, Auto, Pharma, Chemicals (Manufacturing / Automobiles / Pharma / Chemicals)",
        painPoints:
          "1. Industry: Regulatory bodies (Factory Inspectorates, PESO, PCB) conduct surprise audits — " +
          "non-compliance with safety and environmental norms results in shut-down orders. 2. Company: " +
          "Unplanned equipment downtime costs INR 10–50L per hour in lost production — missed PPM is the " +
          "primary cause. 3. Company: Contractor management on-site without digital PTW creates safety " +
          "incidents and insurance liability.",
        ifNotSolved:
          "1. A single shut-down order costs more than 5 years of FM software investment. 2. Each " +
          "unplanned stoppage erodes OEE and cascades into supply chain penalties. 3. A contractor safety " +
          "incident without PTW documentation voids insurance and triggers criminal liability.",
        todayState:
          "SAP PM (for large plants), paper PTW forms, manual KRCC registers, Excel for asset tracking. " +
          "'Good enough' = pass the annual Factory Inspector audit and avoid major breakdowns.",
      },
      {
        segment: "GCC Commercial RE & Free Zones (GCC)",
        demographics:
          "Developers and operators of commercial real estate, free zones, and business parks in UAE, " +
          "Saudi Arabia, Oman, Qatar. Portfolio: 5–100+ buildings. Government-linked or private " +
          "developers.",
        industries:
          "Commercial Real Estate, Free Zones, GCC (Commercial Real Estate / SEZ)",
        painPoints:
          "1. Industry: GCC Vision 2030 / UAE Net Zero mandates require documented energy, water, and " +
          "waste metrics — most operators cannot produce this data today. 2. Company: High tenant churn " +
          "in GCC free zones is driven partly by poor FM responsiveness — operators lack real-time " +
          "visibility into complaint resolution. 3. Company: Compliance with Civil Defence, DEWA, and " +
          "local authority requirements involves dozens of certificates tracked manually.",
        ifNotSolved:
          "1. Failure to meet ESG reporting requirements risks regulatory fines and loss of " +
          "government-linked tenants who have sustainability commitments. 2. Each major tenant loss in " +
          "a GCC free zone costs AED 500K+ in leasing commission and fit-out incentives. 3. A lapsed " +
          "Civil Defence certificate invalidates occupancy permits.",
        todayState:
          "Archibus or Planon for large operators; Excel and email for mid-market. 'Good enough' = " +
          "meet the minimum compliance requirements and respond to escalations within 24 hours.",
      },
      {
        segment: "Hospitality & Hotel Groups (GCC)",
        demographics:
          "International hotel chains and serviced apartment operators in GCC. 50–500 keys per " +
          "property. UAE, Saudi Arabia, Qatar, Bahrain. 4-star and above.",
        industries: "Hospitality, Hotels, Serviced Apartments",
        painPoints:
          "1. Industry: TripAdvisor and Google review scores directly correlate with maintenance " +
          "responsiveness — poor FM is public and immediately visible. 2. Company: Engineering teams at " +
          "GCC hotels manage complex MEP infrastructure without CMMS, leading to reactive maintenance " +
          "culture. 3. Company: Energy and water costs are 15–25% of hotel operating expenses in GCC " +
          "— no smart monitoring means no optimisation.",
        ifNotSolved:
          "1. A single viral review about a maintenance failure costs 50+ booking cancellations. 2. " +
          "Unplanned MEP failures during peak occupancy trigger guest relocations, comps, and brand " +
          "damage. 3. Every 10% reduction in energy waste saves AED 200K–1M annually per property.",
        todayState:
          "PMS-linked work order modules (Opera, Mews), basic CMMS for engineering. 'Good enough' = " +
          "engineering logs no open work orders during audit week.",
      },
    ],
    competitors: [
      {
        name: "FixMyBuilding / Facilio (India-origin SaaS)",
        targetCustomer:
          "Mid to large commercial RE operators and IFM companies in India and GCC. 50,000+ sq ft portfolios.",
        pricing:
          "SaaS subscription. INR 8–20 per sq ft per year (India). AED 12–28 per sq ft/year (GCC). Module-based pricing.",
        discovery:
          "Direct sales to property companies; industry events (CII, CREDAI); digital marketing targeting FM professionals.",
        strengths:
          "Strong IoT integration for real-time building data. Clean UI/UX. GCC market presence. Predictive maintenance signals.",
        weaknesses:
          "Weak on tenant experience (VAS, loyalty, F&B). Limited safety module depth (no MSafe equivalent). CAM billing is basic. No integrated marketplace/app store.",
        gaps: "Our VAS and tenant loyalty programme addresses occupant experience they ignore. Our CAM billing automation wins finance teams. Safety modules (PTW + MSafe) address regulated industries they underserve.",
        threats:
          "Predictive maintenance AI using IoT sensor data. If they add this at scale before us, it becomes a significant moat in asset-heavy industries.",
      },
      {
        name: "Archibus / Eptura (Global, installed in GCC)",
        targetCustomer:
          "Large enterprises, government, and healthcare in GCC and India enterprise. 500,000+ sq ft managed spaces.",
        pricing:
          "Perpetual licence + annual maintenance. USD 50,000–500,000+ for enterprise deployment. Implementation-heavy.",
        discovery:
          "Global system integrators (Deloitte, Accenture, IBM) who bundle FM as part of digital transformation engagements. Not direct to market.",
        strengths:
          "Deep space management and CAFM capability. IWMS (Integrated Workplace Management) breadth. Government pedigree in GCC.",
        weaknesses:
          "Extremely expensive and slow to deploy (12–18 months). Requires dedicated IT team. No mobile-first experience. No tenant loyalty or VAS. Not suited to Indian mid-market.",
        gaps: "We are 10x faster to deploy and 80% cheaper. Win every deal where the buyer needs results in 3 months, not 18. Target mid-market that Archibus ignores entirely.",
        threats:
          "Partnerships with Microsoft 365 and Copilot AI for workplace analytics. Enterprise buyers may perceive this as lower-risk due to Microsoft relationship.",
      },
      {
        name: "Planon (Global, GCC presence)",
        targetCustomer:
          "Large corporate real estate and FM companies. GCC focus: ADNOC, government entities, international banks.",
        pricing:
          "SaaS or on-premise. USD 80,000–300,000+/year for enterprise. Module pricing on top.",
        discovery:
          "Global partnerships with RE consultants (JLL, CBRE) who recommend Planon during transformation projects.",
        strengths:
          "Extremely deep lease management and real estate portfolio capability. Strong compliance and audit trails. Enterprise integrations with SAP/Oracle.",
        weaknesses:
          "Very high cost of ownership. Complex to configure. No India market focus. Minimal tenant experience features. No safety-specific modules (PTW, MSafe).",
        gaps: "Our Lease Management marketplace extension competes directly at a fraction of the cost. Our safety modules address the gap they leave entirely. Win every India deal by default — they do not actively sell here.",
        threats:
          "Planon's AI-assisted lease abstraction and scenario modelling is genuinely advanced. If they push into India mid-market with a partner strategy, they could shift enterprise conversations.",
      },
      {
        name: "CAFM Explorer / Concept Evolution (UK-origin, GCC-present)",
        targetCustomer:
          "Mid-market FM companies and IFM service providers in GCC. Typically 10–100 person FM operations.",
        pricing: "SaaS. GCC pricing: AED 200–600/user/month. Module bundles.",
        discovery:
          "Trade publications, FM expos (FM Expo Dubai), word-of-mouth among GCC FM community.",
        strengths:
          "Solid helpdesk, PPM, and asset management core. Known brand in GCC FM community. Reasonable price point for mid-market.",
        weaknesses:
          "No tenant experience layer (VAS, loyalty, surveys). Limited financial features (no CAM billing). Outdated UI by modern standards. No India presence. No marketplace model.",
        gaps: "Our superior UX, CAM billing automation, and tenant VAS features win every competitive deal where the buyer also manages tenant relationships. Our India footprint gives us referenceable customers they cannot match.",
        threats:
          "None significant — this competitor is not investing in AI or platform innovation at the pace that would threaten us.",
      },
      {
        name: "BuildingMinds / Infogrid (ESG-focused, GCC opportunity)",
        targetCustomer:
          "Large RE investors and developers focused on ESG reporting in GCC and Europe. Sovereign wealth fund-backed RE portfolios.",
        pricing:
          "SaaS. USD 20,000–100,000+/year. Typically packaged as ESG-as-a-service.",
        discovery:
          "Sustainability consultants, ESG advisory firms, direct outreach to RE investment funds targeting Net Zero compliance.",
        strengths:
          "Best-in-class IoT sensor integration and automated ESG reporting (GHG emissions, energy intensity, water usage). Strong investor reporting dashboards.",
        weaknesses:
          "Narrow focus on ESG — not a full FM platform. No helpdesk, no asset management, no tenant engagement. Requires separate FM tool alongside it.",
        gaps: "Our integrated approach lets ESG teams and FM teams work from one platform, eliminating manual data hand-offs. We can generate ESG reports as a byproduct of operational FM data.",
        threats:
          "If they expand to full FM stack capabilities, they inherit an audience of ESG-conscious large investors which is a valuable segment we are only now targeting.",
      },
    ],
    detailedUseCases: {
      industryUseCases: [
        {
          rank: 1,
          industry: "Commercial Real Estate & IT Parks (IT parks)",
          features:
            "Helpdesk, Asset, CAM Billing, Visitor & Gate, Parking, Space Mgmt, Compliance Tracker, PTW, Vendor Mgmt, Operational Audit, Tenant Survey, Events & Broadcast, Lease Mgmt (Marketplace). Teams: FM, Finance, Security, Property Mgmt.",
          workflow:
            "Property managers run multi-tenant billing via CAM module. FM teams log and resolve tenant complaints via Helpdesk. Security uses Gate Mgmt and Visitor modules daily. Finance auto-generates CAM invoices monthly. Compliance team tracks AMC renewals and PTW for contractor work.",
          profileNeeded:
            "50,000–500,000 sq ft+, India Tier 1/2 cities or GCC, 3+ years operational, 20+ tenant companies, managed by a professional FM or RE company.",
          currentTool:
            "Excel for CAM billing, Maximo or ServiceNow for tickets, paper visitor registers, WhatsApp for vendor coordination.",
          urgency:
            "High — CAM billing errors and compliance lapses directly cost money and create legal risk.",
          buyer:
            "Head of Property Management — measured on occupancy rate, tenant retention, and operating cost per sq ft.",
          endUser:
            "Facility Manager — spends 2–3 hours/day manually tracking complaints, chasing vendors, and reconciling billing disputes.",
        },
        {
          rank: 2,
          industry:
            "Manufacturing & Industrial Campuses (Industrial & Logistic Parks)",
          features:
            "Asset (EBOM, Cost of Ownership), PPM Digital Checklist, Inventory, PTW, Incident Management, MSafe (KRCC/Training), Operational Audit, Vendor Audit, STP, Waste Management, Compliance Tracker. Teams: Engineering, EHS, Procurement, Security.",
          workflow:
            "Plant engineers use EBOM and associated asset tracking for critical machinery. EHS teams run PTW workflows for every contractor activity. MSafe ensures all workers complete KRCC before site entry. Incident Management logs near-misses and equipment failures in real time.",
          profileNeeded:
            "500+ employees, manufacturing plant 10 acres+, India industrial belt or GCC free zone, regulated industry (auto, pharma, FMCG, chemicals).",
          currentTool:
            "SAP PM module (expensive, hard to use), paper-based PTW, manual KRCC spreadsheets.",
          urgency:
            "High — regulatory fines, safety incidents, and unplanned downtime have direct P&L impact.",
          buyer:
            "Plant Head / VP Operations — measured on OEE (Overall Equipment Effectiveness), safety incident rate, and audit scores.",
          endUser:
            "Plant Maintenance Engineer — frustrated by unplanned breakdowns from missed PPM schedules and no visibility into spare parts availability.",
        },
        {
          rank: 3,
          industry: "Hospitals & Healthcare Facilities",
          features:
            "Helpdesk, Asset, Digital Checklist (PPM/AMC), Compliance Tracker, PTW, Incident Management, Visitor, Gate Management, Inventory, Soft Services. Teams: FM, Clinical Engineering, Security, Housekeeping.",
          workflow:
            "Biomedical teams track medical equipment warranties and AMC schedules. FM manages housekeeping SLAs for infection control via Soft Services checklists. Visitor management controls patient ward access. Incident module logs adverse events and near-misses for NABH/JCI compliance.",
          profileNeeded:
            "50-bed+ hospitals, multi-specialty or super-specialty, India private healthcare chains or GCC hospital groups, NABH/JCI accredited or pursuing accreditation.",
          currentTool:
            "Standalone CMMS (e.g. AMC tracker in Excel), paper visitor logs, manual housekeeping checklists.",
          urgency:
            "High — accreditation audits, infection control failures, and equipment downtime have patient safety and revenue consequences.",
          buyer:
            "GM / COO (Facility) — measured on NABH scores, equipment uptime, and Joint Commission audit readiness.",
          endUser:
            "Biomedical Engineer — manually tracks 200+ equipment AMC dates in spreadsheets and misses renewal deadlines.",
        },
        {
          rank: 4,
          industry: "Co-Working & Flexible Office Operators",
          features:
            "Space Management, Facility Booking, Visitor, Events & Broadcast, Survey, Business Directory, F&B (VAS), Parking, Redemption Marketplace, OSR, Helpdesk. Teams: Community, Operations, Sales, Member Experience.",
          workflow:
            "Community managers use Space Management for hot-desk and cabin bookings. Members raise issues via Helpdesk. Events & Broadcast sends community-wide announcements. F&B QR ordering enhances the member experience. Survey module captures NPS and satisfaction data. Loyalty tiers retain frequent users.",
          profileNeeded:
            "500–5,000 desks, 2+ locations, India Tier 1 cities or GCC hubs, 3+ years operating, brand-conscious with member experience as differentiator.",
          currentTool:
            "OfficeRnD, Nexudus, or spreadsheets for bookings; WhatsApp for member comms; no integrated loyalty programme.",
          urgency:
            "High — member churn is expensive; operators need tools that directly improve experience scores and reduce manual ops work.",
          buyer:
            "Head of Operations / CEO — measured on desk utilisation, member NPS, and revenue per sq ft.",
          endUser:
            "Community Manager — manually handles booking conflicts, member complaints, and event logistics across 3+ tools.",
        },
        {
          rank: 5,
          industry: "Airports & Transit Hubs (Facility Management)",
          features:
            "Helpdesk, Asset, Digital Checklist, Incident Management, PTW, Compliance Tracker, Patrolling, Gate Management, Visitor, Operational Audit, Energy Meters, Waste Management. Teams: Terminal Ops, Engineering, Security, Retail FM.",
          workflow:
            "Terminal engineers use PPM checklists for critical infrastructure. Patrolling module ensures airside and landside security accountability. Incident management logs operational disruptions with instant escalation. Energy module tracks consumption across terminals. Compliance tracks regulatory certificates from DGCA and fire authorities.",
          profileNeeded:
            "Domestic or international airport, transit hub, or metro rail facility; government-owned or private concession; India or GCC; 3M+ annual passengers.",
          currentTool:
            "Customised SAP or IBM Maximo deployments; often fragmented across terminal zones.",
          urgency:
            "Medium — operations are critical but procurement cycles are long; pain is high but decisions are slow.",
          buyer:
            "GM Airport Operations / COO — measured on OTP (on-time performance), passenger satisfaction index, and audit compliance scores.",
          endUser:
            "Terminal Maintenance Engineer — drowning in paper-based PTW forms and has no real-time view of pending compliance renewals.",
        },
        {
          rank: 6,
          industry: "Retail Chains & Shopping Malls (Mall)",
          features:
            "Helpdesk, Soft Services, Asset, Digital Checklist, Compliance Tracker, Visitor, Parking, Events & Broadcast, Survey, Energy Meters, Waste Management, CAM Billing. Teams: Mall Ops, FM, Tenant Relations, Security.",
          workflow:
            "Mall FM teams use Soft Services to manage daily housekeeping across zones. Helpdesk handles retailer complaints with TAT tracking. CAM billing automates retailer charge allocation. Energy module monitors zone-level consumption. Events & Broadcast coordinates mall-wide promotions.",
          profileNeeded:
            "Mall with 50+ retail units, 200,000+ sq ft GLA, India metro or GCC, professionally managed, 5M+ footfall annually.",
          currentTool:
            "Excel for CAM, basic ticketing tools, paper-based cleaning schedules.",
          urgency:
            "Medium — pain is real but urgency depends on whether FM is in-house or outsourced to an IFM company.",
          buyer:
            "Mall Director / VP Real Estate — measured on footfall, retailer satisfaction score, and operating cost per sq ft.",
          endUser:
            "Mall FM Manager — reconciles CAM charges manually every month and deals with retailer complaints about housekeeping quality.",
        },
        {
          rank: 7,
          industry: "Educational Institutions (Universities & Large Schools)",
          features:
            "Helpdesk, Asset, Space Management, Digital Checklist, Compliance Tracker, Visitor, Patrolling, Staff Management, Survey, Events & Broadcast, Attendance Management. Teams: Estate Office, Security, Admin, HR.",
          workflow:
            "Estate teams use Helpdesk for campus maintenance requests from students and faculty. Space Management handles classroom and lab bookings. Patrolling module covers large campus perimeters. Attendance Management tracks non-teaching staff. Compliance Tracker manages NAAC/accreditation-related certificates.",
          profileNeeded:
            "University with 5,000+ students or 20-acre+ campus; large K-12 school chain; India or GCC; privately managed or trust-run.",
          currentTool:
            "Separate tools for ticketing, booking, attendance; largely manual with Excel.",
          urgency:
            "Medium — adoption is driven by cost pressure and accreditation requirements rather than acute operational pain.",
          buyer:
            "Registrar / VP Administration — measured on accreditation scores, campus satisfaction, and administrative cost.",
          endUser:
            "Estate Manager — handles student complaints via email, manually schedules maintenance, and has no audit trail.",
        },
        {
          rank: 8,
          industry: "Hospitality (Hotels & Serviced Apartments)",
          features:
            "Helpdesk, Asset, Soft Services, Digital Checklist, Compliance Tracker, Visitor, Incident Management, Inventory, Energy Meters, Water Management, Survey. Teams: Engineering, Housekeeping, Front Office, F&B.",
          workflow:
            "Engineering teams schedule PPM for HVAC, lifts, and generators using Digital Checklist. Housekeeping uses Soft Services for room turnaround tracking. Guest complaints route through Helpdesk with TAT SLAs. Energy and Water modules track sustainability KPIs. Survey captures in-stay guest satisfaction.",
          profileNeeded:
            "Hotel with 100+ keys or branded serviced apartment operator; India or GCC; 3-star and above; chain or independent managed property.",
          currentTool:
            "Property management systems (PMS) with limited FM integration; separate CMMS for engineering.",
          urgency:
            "Medium — strong pain exists but hotels often run proprietary or legacy tools; RFP cycles are slow.",
          buyer:
            "Director of Engineering / GM — measured on preventive maintenance compliance, guest satisfaction scores (GSS), and energy cost per key.",
          endUser:
            "Chief Engineer — manually tracks 100+ equipment AMC schedules, often discovers expired certificates during surprise inspections.",
        },
        {
          rank: 9,
          industry: "Integrated Facility Management (IFM) Companies",
          features:
            "Full platform — all modules. Teams: Account Delivery, Operations, Finance, HR, SLA Reporting.",
          workflow:
            "IFM companies deploy FM Matrix as their operating system across client sites. Account managers track SLA compliance per client using TAT-based reporting. Finance auto-bills clients via CAM and PO/WO modules. MSafe ensures all deployed staff complete safety inductions. Vendor Audit evaluates sub-contractor performance.",
          profileNeeded:
            "IFM company managing 10+ client sites; India-based with pan-India or GCC operations; 500+ deployed workforce; B2B contract-driven business model.",
          currentTool:
            "Internal proprietary tools, or fragmented CMMS + billing + HR tools with no integration.",
          urgency:
            "High — IFM companies bill on SLA performance; every missed ticket or compliance gap is a financial and reputational risk.",
          buyer:
            "COO / Head of Operations — measured on SLA adherence across clients, workforce deployment efficiency, and contract renewal rate.",
          endUser:
            "Site FM Manager — manages 5+ client accounts using WhatsApp and spreadsheets, with no unified view of open issues.",
        },
        {
          rank: 10,
          industry: "Government & PSU Facilities (Facility Management)",
          features:
            "Helpdesk, Asset, Digital Checklist, Compliance Tracker, PTW, Incident Management, Patrolling, Visitor, Gate Management, Operational Audit, Inventory. Teams: PWD/CPWD teams, Security, Engineering.",
          workflow:
            "Government facility teams use Helpdesk for citizen or employee complaint routing. Asset module tracks government-owned equipment with depreciation. PTW ensures contractor safety compliance. Patrolling covers large government campuses. Audit module documents inspection findings for CAG or internal audit.",
          profileNeeded:
            "Central or state government ministry, PSU headquarters, defence cantonment, or large government hospital; India; 10,000+ sq ft managed space.",
          currentTool:
            "Manual registers, Excel-based asset lists, paper PTW forms, no centralised FM tool.",
          urgency:
            "Low-Medium — pain is high but procurement is slow, and decision-making is by committee with tender processes.",
          buyer:
            "Chief Estate Officer / Administrative Officer — measured on budget utilisation, audit compliance, and asset lifecycle.",
          endUser:
            "Junior Engineer (JE) — manages maintenance complaints via phone calls and paper registers with no digital audit trail.",
        },
      ],
      internalTeamUseCases: [
        {
          team: "Facility Management Team",
          features:
            "Helpdesk, Digital Checklist, Asset, Soft Services, Compliance Tracker, Operational Audit, Vendor Audit, Cost Approval, Inventory",
          usage:
            "Starts the day reviewing the Helpdesk dashboard for open tickets. Assigns new tickets to technicians or vendors. Reviews PPM checklists due today. Checks compliance renewals due this month. Logs soft service task completions. Runs weekly operational audit.",
          benefit:
            "Single view of all reactive and proactive maintenance activities. Eliminates manual dispatch and chasing. Ensures nothing falls through the cracks.",
          frequency: "Multiple times daily",
        },
        {
          team: "Maintenance & Engineering Team",
          features:
            "Helpdesk (ticket execution), Asset (EBOM, associated assets), Digital Checklist (PPM), Inventory (spares), Miles (travel)",
          usage:
            "Receives ticket assignments with location and priority via app notification. Checks EBOM for required spare parts before going to site. Updates ticket status on mobile. Completes digital PPM checklist on-site. Raises inventory consumption against the job.",
          benefit:
            "Eliminates paper job cards. Reduces time hunting for asset manuals and spares. Creates a clean work history per asset.",
          frequency: "Daily, throughout shift",
        },
        {
          team: "Finance & Billing Team",
          features:
            "CAM Billing, PO/WO, Cost Approval System, Vendor Management, Marketplace / Accounting extension",
          usage:
            "Generates monthly CAM invoices from the billing module. Reviews and approves POs/WOs raised by FM team. Tracks R&M spend against budget via cost approval reports. Reconciles vendor invoices against approved work orders. Uses Accounting extension for full bookkeeping.",
          benefit:
            "Replaces manual Excel-based CAM calculations. Creates an auditable procurement trail. Reduces month-end billing cycle from days to hours.",
          frequency: "Daily for approvals; weekly for billing cycles",
        },
        {
          team: "Security Team",
          features:
            "Gate Management, Visitor, Patrolling, Staff registry, Vehicle tracking (Registered + Guest), Gate Pass (Inward/Outward), Incident Management",
          usage:
            "Guards log visitor arrivals and departures via the Visitor module. Processes material in/out via Gate Pass. Scans QR checkpoints during patrol rounds. Logs security incidents in real time. Checks vehicle registrations against the Vehicle module.",
          benefit:
            "Complete digital audit trail for all entry/exit events. Patrol accountability eliminates missed rounds going undetected. Incident logs replace paper registers.",
          frequency: "Continuous, every shift",
        },
        {
          team: "HR & People Team",
          features:
            "Staff Management, Attendance Management (facial recognition), MSafe (KRCC, Training, LMC), Miles",
          usage:
            "Reviews daily attendance reports with precise in/out timestamps. Monitors MSafe KRCC compliance for all new joiners and external FTEs. Approves or rejects travel reimbursement claims from Miles. Manages shift rosters for FM and security staff.",
          benefit:
            "Eliminates buddy punching and manual attendance registers. Ensures all workers are safety-cleared before deployment. Reduces payroll errors from manual timekeeping.",
          frequency: "Daily for attendance; as-needed for onboarding/MSafe",
        },
        {
          team: "Safety & EHS Team",
          features:
            "PTW, Incident Management (logging, escalation, analytics), MSafe, Preparedness Checklist, Compliance Tracker",
          usage:
            "Issues PTW permits for all high-risk contractor activities. Monitors open incidents and escalation status in real time. Runs KRCC checks via MSafe before any external FTE starts work. Conducts preparedness drills using digital checklists. Tracks safety certifications and renewal dates.",
          benefit:
            "Structured, auditable safety processes replace paper-based systems. IVR escalation ensures incidents are never missed. PTW compliance reduces liability exposure.",
          frequency: "Daily during active work; weekly for audits",
        },
        {
          team: "Property & Asset Management Team",
          features:
            "Parking Management, Space Management, Mailroom, Facility Booking, Customer Master (CRM), Fitout, Lease Management (Marketplace)",
          usage:
            "Manages tenant parking allocations and lease periods via Parking module. Processes desk/cabin booking requests from tenants. Tracks incoming mail and packages via Mailroom. Manages tenant fitout approval workflows. Pulls tenancy and lease data from Customer Master.",
          benefit:
            "Digitises the entire tenant interaction layer. Reduces conflicts over space and parking. Creates a complete tenancy record in one place.",
          frequency: "Daily for space and parking; weekly for leasing",
        },
        {
          team: "Tenant / Occupant Community",
          features:
            "Helpdesk (raising requests), Visitor (pre-registering guests), Events & Broadcast (announcements), Survey (feedback), F&B (QR ordering), Redemption Marketplace, Space Management, Facility Booking",
          usage:
            "Raises service requests via mobile app or web. Pre-registers visitors for the next day. Scans QR code to order food in the meeting room. Responds to satisfaction surveys. Redeems loyalty points for rewards.",
          benefit:
            "Transforms tenant experience from reactive and manual to digital and responsive. Creates brand stickiness through the loyalty programme.",
          frequency: "Daily (power users) to weekly (light users)",
        },
        {
          team: "IT & Platform Admin Team",
          features:
            "RBAC setup, Approval Flow configuration, Marketplace (install/update extensions), Dashboard, Account & Site hierarchy setup",
          usage:
            "Configures user roles and permissions when new staff join. Sets up approval workflows for new processes. Installs and updates Marketplace extensions. Monitors platform health via dashboard. Manages multi-site location hierarchy.",
          benefit:
            "Self-serve platform administration reduces dependency on vendor support. RBAC ensures data security and access governance.",
          frequency:
            "As-needed for configuration; daily for support escalations",
        },
        {
          team: "Sustainability / ESG Team",
          features:
            "Green Inventory, Waste Management, Energy Meters, Water Management, STP",
          usage:
            "Tracks green inventory consumption and reports on sustainable product usage. Logs daily waste generation by type and monitors recycled vs. total waste. Reviews energy and water consumption trends. Monitors STP operations for regulatory compliance. Exports data for ESG reporting.",
          benefit:
            "Provides structured data for ESG disclosures and sustainability audits. Replaces manual data collection from site teams via WhatsApp or email.",
          frequency: "Weekly for reporting; monthly for audits",
        },
        {
          team: "Procurement & Vendor Team",
          features:
            "PO/WO, Vendor Management, Vendor Audit, Compliance Tracker (vendor certificates), Inventory",
          usage:
            "Raises and tracks purchase orders for materials and services. Reviews vendor performance ratings and SLA compliance. Conducts structured vendor audits using digital checklists. Tracks vendor AMC and insurance certificate renewals. Manages stock levels and triggers reorders.",
          benefit:
            "End-to-end digital procurement trail. Vendor audit findings auto-escalate, reducing follow-up time. Certificate renewals never missed.",
          frequency: "Daily for PO approvals; weekly for vendor reviews",
        },
      ],
    },
    swot: {
      strengths: [
        {
          headline:
            "Broadest module coverage in the India/GCC mid-market FM segment",
          explanation:
            "12 categories, 50+ modules in a single platform, including safety, VAS, and marketplace that competitors lack entirely.",
        },
        {
          headline: "Live and proven at 75+ locations across India and Oman",
          explanation:
            "Not a startup with zero deployments. Each site is a referenceable case study and a validation signal for risk-averse buyers.",
        },
        {
          headline: "CAM billing automation built natively",
          explanation:
            "No FM competitor in the mid-market addresses the finance team's core FM problem. This is a deal-winning capability that is extremely hard to replicate quickly.",
        },
        {
          headline: "Tenant experience layer (VAS)",
          explanation:
            "Loyalty programme, QR food ordering, facility booking, and surveys in a single FM platform is category-defining and creates stickiness beyond the FM buyer.",
        },
        {
          headline:
            "Safety module depth (PTW, MSafe, Incident Management with IVR escalation)",
          explanation:
            "Positions the platform for regulated industries (manufacturing, healthcare, construction) where safety compliance is non-negotiable.",
        },
        {
          headline: "Marketplace/app store model creates an ecosystem moat",
          explanation:
            "Competitors are closed systems. FM Matrix can grow its platform surface area without rebuilding the core product.",
        },
        {
          headline: "India-first design knowledge",
          explanation:
            "Deep understanding of local regulatory requirements, billing norms, and FM operational models that Western platforms cannot replicate without years of in-market experience.",
        },
        {
          headline: "Multi-site, multi-tenant, multi-zone architecture",
          explanation:
            "Supports enterprise portfolio management — not just single-site deployment.",
        },
      ],
      weaknesses: [
        {
          headline: "No predictive AI or machine learning",
          explanation:
            "The platform is reactive, not predictive. Facilio and IBM Maximo are investing heavily here. Without it, large enterprise accounts will prefer forward-looking competitors.",
        },
        {
          headline: "No native IoT or sensor integration",
          explanation:
            "Energy and Water modules rely on manual data entry, limiting the real-time monitoring value proposition. Competitors with BMS/IoT integration have a structural edge in asset-heavy deployments.",
        },
        {
          headline:
            "No BIM (Building Information Modelling) or digital twin capability",
          explanation:
            "Required for government and large commercial RE accounts in GCC, particularly in Saudi Arabia and UAE mega-projects.",
        },
        {
          headline: "Limited brand awareness outside current customer base",
          explanation:
            "75 sites is strong validation but insufficient for enterprise-level sales cycles in India's Tier 1 RE market or GCC free zones. No thought leadership presence yet.",
        },
        {
          headline: "Mobile app experience needs differentiation",
          explanation:
            "Functional parity with competitors but no standout features (offline mode, AI assistance) that create a clear field-use advantage for technicians and security staff.",
        },
        {
          headline: "GCC sales motion is nascent",
          explanation:
            "Oman is a foothold, not a beachhead. UAE and Saudi require dedicated in-country sales resources, local entity, and reference customers to unlock enterprise accounts.",
        },
        {
          headline: "No dedicated ESG reporting output",
          explanation:
            "Green Inventory, Waste, and Energy data exists in the platform but is not yet packaged into a downloadable ESG report, limiting appeal to sustainability officers and CFOs.",
        },
        {
          headline: "Onboarding and implementation documentation may not scale",
          explanation:
            "As deployments increase toward 200+ sites, implementation consistency and time-to-value need standardised playbooks.",
        },
      ],
      opportunities: [
        {
          headline: "India commercial RE boom",
          explanation:
            "120+ million sq ft of Grade A office supply in pipeline across Bengaluru, Hyderabad, Mumbai, Pune. Every new building needs FM software from day one. First-mover advantage in new developments is critical.",
        },
        {
          headline: "GCC Vision 2030 / UAE Net Zero 2050",
          explanation:
            "Government-mandated ESG reporting and sustainability targets are creating urgent demand for platforms that track energy, water, waste, and compliance. FM Matrix's Utility modules are a direct fit.",
        },
        {
          headline: "IFM company consolidation",
          explanation:
            "Large IFM players are looking for a single operating platform across 50–200+ client sites. A single IFM win can deploy FM Matrix to dozens of end clients simultaneously.",
        },
        {
          headline: "Post-pandemic hybrid work",
          explanation:
            "Space management and hot-desking demand is structural and growing. Every enterprise with a hybrid workforce needs a booking and utilisation tool. FM Matrix is positioned in the right category.",
        },
        {
          headline: "Regulatory tightening in India",
          explanation:
            "RERA, NABH accreditation cycles, Factory Inspector audits, and PCB compliance requirements are increasing documentation demands. Digital compliance tracking becomes a necessity, not a nice-to-have.",
        },
        {
          headline: "AI integration opportunity",
          explanation:
            "Adding predictive maintenance, anomaly detection, and AI-assisted ticket routing on top of the existing data set (75+ sites, thousands of tickets) is a 6–18 month product build that can leap-frog current competitors.",
        },
        {
          headline: "Marketplace revenue model",
          explanation:
            "As the app store grows, FM Matrix becomes a platform business with recurring revenue from extension installs and usage, not just a SaaS subscription. Potential for third-party developer ecosystem.",
        },
        {
          headline: "Hospitality sector recovery in GCC",
          explanation:
            "UAE and Saudi hotel and serviced apartment pipeline is among the world's largest. Engineering teams in these properties are underserved by current FM tools and are actively looking for modern alternatives.",
        },
      ],
      threats: [
        {
          headline: "Facilio's IoT + AI roadmap",
          explanation:
            "They are the most funded and technically advanced direct competitor in India and GCC. If they add CAM billing and deepen tenant VAS before we add IoT and AI, the competitive gap narrows significantly.",
        },
        {
          headline: "Archibus/Planon partner strategy in GCC",
          explanation:
            "If either platform activates a local system integrator network in Saudi Arabia or UAE, they can sweep enterprise accounts before we have a GCC sales presence. Their government relationships are a structural advantage.",
        },
        {
          headline: "Microsoft + Copilot entering facilities management",
          explanation:
            "Microsoft 365 + Teams + Copilot AI is already in every enterprise. If Microsoft packages FM features into its workplace suite, IT buyers may choose convenience over a dedicated FM platform.",
        },
        {
          headline: "Price compression in India mid-market",
          explanation:
            "Local tools and IFM companies building internal platforms will commoditise the mid-market over the next 24–36 months. Competing on price in this segment is a race to the bottom.",
        },
        {
          headline: "Customer concentration risk",
          explanation:
            "75 deployments in a narrow geography means a single large customer defection or a regional economic slowdown (e.g. India commercial RE correction) has outsized revenue impact.",
        },
        {
          headline: "Talent risk in product and engineering",
          explanation:
            "Building IoT, AI, and BIM capabilities simultaneously requires specialised talent that is expensive and scarce. Competitors with larger engineering teams can out-build faster.",
        },
        {
          headline: "GCC data sovereignty requirements",
          explanation:
            "UAE, Saudi Arabia, and Qatar have strict data residency regulations. Without in-country cloud hosting, enterprise GCC deals will stall at procurement stage. This is a near-term infrastructure requirement.",
        },
        {
          headline: "Slow enterprise sales cycles",
          explanation:
            "Commercial RE and manufacturing buyers have 6–18 month procurement cycles. A cash flow squeeze during a long sales pipeline could constrain the product roadmap investment needed to close competitive gaps.",
        },
      ],
    },
    roadmap: {
      phases: [
        {
          title:
            "Immediate (0–3 Months) — Stop losing deals we should be winning",
          summary:
            "IMMEDIATE SUMMARY: 8 initiatives | Critical blockers | Est. revenue impact: INR 1-2 Cr incremental ARR | Key unlock: ESG reporting and offline mobile removes adoption barriers holding us back from GCC and field-heavy segments",
          initiatives: [
            {
              initiative: "ESG / Sustainability Report Export",
              feature:
                "Package existing Energy, Water, Waste, and Green Inventory data into a single downloadable ESG report (PDF/Excel). No new data collection required — just a reporting layer on existing modules.",
              segment:
                "GCC commercial RE operators under Vision 2030/UAE Net Zero mandates. Indian corporates with ESG disclosure obligations.",
              impact:
                "Directly unlocks GCC and ESG-focused segments; high win probability in sustainability-conscious deals",
              timeline: "Q2 2026",
              owner: "Product + Frontend",
              priority: "P0",
            },
            {
              initiative: "AI-Assisted Ticket Routing & Priority Scoring",
              feature:
                "Use historical ticket data to auto-suggest the best assignee and flag high-priority issues before they escalate. Immediate operational lift without full AI infrastructure build.",
              segment:
                "IFM companies managing multi-site deployments. Commercial RE operators with high ticket volumes. Any buyer comparing us to Facilio.",
              impact:
                "Moves us into 'smart FM' category; competitive parity with Facilio's AI messaging",
              timeline: "Q2 2026",
              owner: "Product + Data/ML",
              priority: "P0",
            },
            {
              initiative: "Mobile App Offline Mode",
              feature:
                "Field technicians in basements and remote zones frequently lose connectivity. Without offline mode, checklists and ticket updates fail silently and data is lost.",
              segment:
                "Manufacturing campuses, hospitals, large commercial buildings with signal-dead zones. Any buyer whose technicians work in areas with poor connectivity.",
              impact:
                "Removes #2 objection from field-heavy deployments; unlocks manufacturing and healthcare segments",
              timeline: "Q2-Q3 2026",
              owner: "Mobile Engineering",
              priority: "P0",
            },
            {
              initiative: "ROI Calculator — Embeddable Sales Tool",
              feature:
                "Build a simple, shareable ROI calculator that quantifies CAM billing hours saved, compliance fines avoided, vendor SLA penalties prevented, and ticket resolution time improvement.",
              segment:
                "Every buyer segment. Particularly finance controllers and COOs who approve FM software budgets. Directly shortens the enterprise sales cycle.",
              impact:
                "Shortens enterprise sales cycle; enables finance stakeholder engagement at proposal stage",
              timeline: "Q2 2026",
              owner: "Product + Sales",
              priority: "P0",
            },
            {
              initiative: "Competitor Displacement Kit — Facilio Battlecard",
              feature:
                "A structured, internally available battlecard for every Facilio competitive deal: their gaps (no CAM, no VAS, no MSafe), our proof points, and the exact questions to ask in discovery that surface those gaps.",
              segment:
                "Any deal where Facilio is on the shortlist. India Tier 1 commercial RE and GCC mid-market are the primary theatres.",
              impact:
                "Equips sales team to win head-to-head Facilio deals; raises win rate in competitive situations",
              timeline: "Q2 2026",
              owner: "Sales + Product Marketing",
              priority: "P0",
            },
            {
              initiative: "WhatsApp / SMS Notification Integration for Tickets",
              feature:
                "India and GCC FM staff overwhelmingly use WhatsApp for operational comms. Integrating ticket alerts and escalation notifications via WhatsApp Business API will dramatically improve response rates.",
              segment:
                "IFM companies with large field workforces. Manufacturing and healthcare where technicians are not desk-bound. Any buyer whose team currently coordinates on WhatsApp anyway.",
              impact:
                "Dramatically improves technician response rates; reduces missed SLAs in WhatsApp-native markets",
              timeline: "Q2-Q3 2026",
              owner: "Backend + Integrations",
              priority: "P1",
            },
            {
              initiative: "Configurable SLA Dashboard — Per Client / Per Site",
              feature:
                "IFM companies need to show clients a live SLA compliance dashboard, not a monthly report. Currently SLA data exists but is not surfaced as a real-time, per-client, shareable view. This is a deal-blocker in enterprise IFM conversations.",
              segment:
                "IFM service companies managing 10+ client sites. Commercial RE operators tracking tenant SLAs. Any buyer for whom SLA proof is part of their contract obligation.",
              impact:
                "Mandatory for IFM enterprise deals; directly enables contract compliance reporting",
              timeline: "Q3 2026",
              owner: "Product + Frontend",
              priority: "P1",
            },
            {
              initiative: "GCC Data Residency — UAE In-Country Cloud Option",
              feature:
                "UAE and Saudi Arabia require data to be hosted in-country for government and financial sector accounts. Without a UAE-hosted deployment option, these deals stall or are blocked at procurement.",
              segment:
                "UAE government entities, free zone operators, financial services tenants in GCC. Prerequisite for any GCC enterprise deal above AED 200K/year.",
              impact:
                "Removes procurement blocker for all GCC enterprise and government deals; infrastructure compliance requirement",
              timeline: "Q3 2026",
              owner: "Infrastructure + Legal",
              priority: "P0",
            },
          ],
        },
        {
          title:
            "Short-Term (3–6 Months) — Expand addressable market and move up-market",
          summary:
            "SHORT-TERM SUMMARY: 7 initiatives | Market expansion | Est. revenue impact: INR 4-8 Cr incremental ARR | Key unlock: IoT integration and predictive maintenance leap-frog Facilio and unlock asset-heavy manufacturing and hospital segments",
          initiatives: [
            {
              initiative: "IoT / BMS Integration Layer — Energy & Water",
              feature:
                "Build a standardised integration layer for Building Management Systems (BMS) and IoT sensors (Modbus, BACnet, MQTT protocols). Allow real-time energy, water, and temperature data to flow into the Utility modules without manual entry.",
              segment:
                "Commercial RE developers with smart building infrastructure. GCC operators with DEWA smart metering requirements. Manufacturing campuses with existing BMS/SCADA systems.",
              impact:
                "Unlocks ESG automation narrative; creates structural advantage in smart building segment",
              timeline: "Q3-Q4 2026",
              owner: "Engineering + Partnerships",
              priority: "P0",
            },
            {
              initiative:
                "Predictive Maintenance — Anomaly Detection (Phase 1)",
              feature:
                "Use historical asset failure data and PPM completion rates to flag assets at elevated risk of breakdown before failure occurs. Start with rule-based anomaly detection and evolve to ML over 12 months.",
              segment:
                "Manufacturing campuses where unplanned downtime costs INR 10L+/hour. Hospitals where equipment failure has clinical consequences. Any large commercial building with critical MEP infrastructure.",
              impact:
                "Competes directly with Facilio's core differentiator; unlocks asset-heavy manufacturing and healthcare segments",
              timeline: "Q4 2026",
              owner: "Data/ML + Engineering",
              priority: "P0",
            },
            {
              initiative:
                "Saudi Arabia / UAE Direct Sales Entity & Referenceable Customers",
              feature:
                "Establish legal entity or partnership structure in UAE (Dubai or Abu Dhabi) with at least 2 referenceable GCC customer wins. Without a UAE address and local case studies, GCC enterprise procurement processes will not proceed.",
              segment:
                "UAE and Saudi commercial RE developers, free zone operators, hospitality groups. Prerequisite for all GCC deals above AED 100K/year.",
              impact:
                "Essential market entry infrastructure; enables GCC enterprise sales to proceed beyond pilot discussions",
              timeline: "Q3-Q4 2026",
              owner: "Leadership + Sales",
              priority: "P0",
            },
            {
              initiative: "Advanced Analytics & Custom Report Builder",
              feature:
                "Allow FM Heads and COOs to build, save, and schedule custom reports across any module — without exporting to Excel. Include cross-module insights and scheduled email delivery.",
              segment:
                "Enterprise and IFM buyers who present monthly FM performance reviews to leadership. Any buyer whose current workaround is exporting CSVs and building reports in Excel.",
              impact:
                "Enterprise feature expected by C-suite; enables business intelligence narrative",
              timeline: "Q3-Q4 2026",
              owner: "Product + Frontend",
              priority: "P1",
            },
            {
              initiative: "Tenant Mobile App — White-Label Option",
              feature:
                "Allow commercial RE operators and co-working spaces to deploy a white-labelled version of the tenant-facing FM Matrix app under their own brand. Covers: service requests, facility booking, F&B ordering, and loyalty.",
              segment:
                "Commercial RE developers with flagship properties. Co-working operators building brand identity. Hospitality groups with branded guest experience requirements.",
              impact:
                "Increases perceived value for property operators competing for premium tenants; premium upsell opportunity",
              timeline: "Q4 2026 - Q1 2027",
              owner: "Mobile Engineering + Product",
              priority: "P1",
            },
            {
              initiative:
                "Lease Management — Deep Integration with CAM Billing",
              feature:
                "Deeply integrate Lease Management with CAM Billing so lease terms, escalation clauses, and renewal milestones automatically trigger billing adjustments. Eliminate the manual reconciliation step between lease records and CAM invoices.",
              segment:
                "Commercial RE developers managing 20+ tenants per building. Property management companies running complex multi-lease portfolios. Any buyer evaluating Planon or Archibus for lease + billing capability.",
              impact:
                "Competitive parity with Planon/Archibus; enables enterprise lease + billing narrative",
              timeline: "Q4 2026",
              owner: "Engineering + Product",
              priority: "P1",
            },
            {
              initiative:
                "Marketplace Extension — ERP Integration Connector (SAP / Oracle)",
              feature:
                "Build a pre-configured integration connector between FM Matrix (PO/WO, Asset, Inventory, CAM Billing) and SAP/Oracle ERP systems. Without it, FM Matrix data lives in a silo and finance teams reject adoption.",
              segment:
                "Manufacturing enterprises running SAP. Large commercial RE developers with Oracle Financials. Any enterprise account where the CFO controls software approval.",
              impact:
                "Mandatory for enterprise manufacturing deals; removes CFO-level integration objection",
              timeline: "Q4 2026 - Q2 2027",
              owner: "Engineering + Partnerships",
              priority: "P0",
            },
          ],
        },
        {
          title:
            "Medium-Term (6–18 Months) — Capabilities that become our long-term competitive moat",
          summary:
            "MEDIUM-TERM SUMMARY: 7 initiatives | Competitive moat building | Est. revenue impact: INR 12-25 Cr incremental ARR | Key unlock: FM Copilot and Digital Twin become category-defining differentiators that competitors cannot replicate without fundamental platform rebuild",
          initiatives: [
            {
              initiative: "FM Copilot — Conversational AI Assistant",
              feature:
                "An AI assistant embedded across FM Matrix that allows FM managers, COOs, and security heads to query their facility data in natural language. Converts dashboards from passive displays to active intelligence tools.",
              segment:
                "FM Heads and COOs at enterprise accounts who are data-rich but insight-poor. IFM companies presenting client performance reviews. Any buyer who currently exports data to Excel to answer management questions.",
              impact:
                "Category-defining differentiator; converts FM from reactive tool to proactive intelligence platform",
              timeline: "Q2-Q4 2027",
              owner: "AI/ML + Product + Engineering",
              priority: "P0",
            },
            {
              initiative: "Digital Twin — 2D Floor Plan Asset Overlay",
              feature:
                "Allow facility managers to view a 2D floor plan of their building with assets, ticket locations, and sensor readings overlaid on the map. Start with 2D (not BIM) to keep build cost manageable. Enables spatial FM — not just list-based management.",
              segment:
                "GCC government and sovereign RE portfolios. Large Indian corporate campuses (100,000+ sq ft). Any account where Archibus or Planon is being evaluated for space visualisation capability.",
              impact:
                "Competitive parity with Archibus; enables spatial FM narrative for government and large enterprise accounts",
              timeline: "Q2-Q4 2027",
              owner: "Engineering + Product + UX",
              priority: "P1",
            },
            {
              initiative:
                "Predictive Maintenance — Full ML Model with IoT Feedback Loop",
              feature:
                "Evolve Phase 1 anomaly detection into a full predictive maintenance model: asset health scoring, failure probability by asset class, recommended maintenance actions, and automated PPM schedule adjustment based on actual usage data from IoT sensors.",
              segment:
                "Manufacturing campuses, hospitals, airport and transit hub operators, large commercial RE portfolios with critical MEP infrastructure. Directly competes with Facilio's core differentiator.",
              impact:
                "Becomes core competitive differentiator against Facilio and IBM Maximo; unlocks enterprise asset-heavy deals",
              timeline: "Q2-Q4 2027",
              owner: "Data/ML + Engineering",
              priority: "P0",
            },
            {
              initiative: "Third-Party Developer Marketplace — Open API & SDK",
              feature:
                "Open the FM Matrix Marketplace to third-party developers with a published API, SDK, and developer documentation. Allow external developers to build and publish extensions for revenue share. Creates a self-expanding ecosystem.",
              segment:
                "Technology partners (HR software, access control systems, SCADA vendors, proptech apps) who want to integrate with FM Matrix's user base. Long-term: transforms FM Matrix from a product into a platform.",
              impact:
                "Becomes platform business model; creates network effects that competitors cannot replicate",
              timeline: "Q3 2027",
              owner: "Engineering + Product + Business Development",
              priority: "P1",
            },
            {
              initiative:
                "Automated ESG Compliance Reporting — Regulator-Ready Output",
              feature:
                "Build regulator-ready ESG report outputs mapped to specific frameworks: GRI Standards, TCFD, UAE Net Zero 2050, India BEE (Bureau of Energy Efficiency) compliance. Allow facility operators to auto-generate and submit compliance reports directly from FM Matrix data.",
              segment:
                "GCC government-linked RE operators with mandatory ESG disclosure requirements. Indian listed companies under SEBI BRSR (Business Responsibility and Sustainability Reporting) mandate. Sustainability officers across all segments.",
              impact:
                "Directly addresses regulatory compliance; enables ESG-as-a-service business model",
              timeline: "Q2-Q3 2027",
              owner: "Product + Compliance Team + Partnerships",
              priority: "P1",
            },
            {
              initiative:
                "Space Utilisation Intelligence — Occupancy Analytics",
              feature:
                "Use badge access data, desk booking patterns, and (optionally) IoT occupancy sensors to generate real-time space utilisation reports: peak hours, underutilised zones, cost per occupied desk, and recommended space consolidation actions.",
              segment:
                "Large corporate campuses managing hybrid workforce (500+ employees). Commercial RE developers optimising lettable area. Co-working operators pricing desks and cabins dynamically.",
              impact:
                "Directly addresses the post-pandemic space management question every enterprise is asking",
              timeline: "Q3-Q4 2027",
              owner: "Product + Data + Engineering",
              priority: "P0",
            },
            {
              initiative: "Multi-Currency, Multi-Entity Financial Layer",
              feature:
                "Allow organisations operating across India and GCC (or multiple GCC countries) to manage billing, POs, and CAM calculations in multiple currencies within a single FM Matrix account. Includes entity-level financial separation and consolidated group-level reporting.",
              segment:
                "IFM companies with India + GCC operations. Large RE conglomerates with pan-India and GCC portfolios. Any multinational managing facilities across jurisdictions.",
              impact:
                "Mandatory for multinational portfolio management; removes geographic segmentation constraint",
              timeline: "Q3-Q4 2027",
              owner: "Engineering + Finance + Product",
              priority: "P1",
            },
            {
              initiative:
                "Facial Recognition — Upgraded to Liveness Detection & Anti-Spoofing",
              feature:
                "The current attendance and gate management facial recognition system needs liveness detection (anti-spoofing) to meet enterprise security standards and GCC regulatory requirements. Without it, the system is vulnerable to photo-based bypass and will not pass enterprise security audits.",
              segment:
                "Large corporate campuses, manufacturing plants, GCC government facilities, and any account with a serious physical security requirement. Prerequisite for enterprise security contracts.",
              impact:
                "Medium — 8–12 weeks. Upgrade facial recognition model with liveness detection. Evaluate third-party biometrics SDK (e.g. iProov, Daon).",
              timeline: "Q3-Q4 2027",
              owner: "Engineering + Security + Vendor",
              priority: "P1",
            },
          ],
        },
      ],
    },
    detailedBusinessPlan: {
      planQuestions: [
        {
          id: "Q1",
          question: "What problem does FM Matrix solve and for whom?",
          answer:
            "FM Matrix solves the fragmentation problem for enterprises and IFM companies managing multi-site facilities. Today, organisations run 5-12 disconnected tools for maintenance, billing, security, utilities, compliance, and tenant engagement. This creates data silos, manual workarounds, and poor visibility. FM Matrix consolidates all functions into one platform with unified data, real-time dashboards, and integrated workflows. Our primary buyers are FM Heads, COOs, and CFOs at commercial real estate operators, manufacturing campuses, hospitals, IFM companies, and IT parks who manage 10+ locations and demand end-to-end facility visibility.",
          source: "Tab 1, Tab 2",
          flag: "Ready to use as-is",
        },
        {
          id: "Q2",
          question: "What is the total addressable market and our beachhead?",
          answer:
            "The global Facilities Management software market is USD 12.5 billion in 2024, growing at 11.2% CAGR to reach USD 27.8 billion by 2032. India's commercial real estate market is USD 450+ billion with 2+ billion sq ft of operational space. Our TAM covers 10,000+ enterprises and IFM companies managing 10+ buildings across India and GCC. Our beachhead is large commercial real estate operators (75+ locations) and Tier 1 IFM companies in India's metro markets where we have 3+ reference accounts and strong PMC partnerships.",
          source: "Tab 3",
          flag: "Requires founder input: Validate current installed base by segment and geography",
        },
        {
          id: "Q3",
          question: "Who are our top competitors and how do we win?",
          answer:
            "Our main competitors are Facilio (India, focus on predictive maintenance), IBM Maximo (global, complex enterprise), SAP Facilities Management (global, ERP-embedded), and Archibus (global, strong in government). Facilio is the strongest India competitor but lacks integrated CAM billing, visitor management, and VAS modules. We win on completeness (12 core categories in one platform), India GTM advantage, faster implementation (weeks vs months), and 40-50% lower TCO vs enterprise competitors. Our API-first architecture enables faster partner integrations.",
          source: "Tab 3, Tab 4",
          flag: "Ready to use as-is",
        },
        {
          id: "Q4",
          question: "What is our pricing model and revenue structure?",
          answer:
            "We price on per-location SaaS: INR 3-8 Lakh per location per year depending on site size (50K-500K sq ft), number of users, and module adoption. A typical 10-location deployment generates INR 40-80 Lakh ARR. Upsell modules (AI Route Optimization, Predictive Maintenance Phase 2, ESG Reporting) add 20-35% to base contract. Enterprise implementations (multi-currency, ERP integration, dedicated support) command 50% premium pricing. Target enterprise accounts: INR 1-5 Cr ARR.",
          source: "Tab 4",
          flag: "Requires founder input: Confirm current ACV by segment and upsell attachment rates",
        },
        {
          id: "Q5",
          question:
            "What are our top 3 target segments and what use case do we sell?",
          answer:
            "Segment 1: Large Commercial Real Estate (Grade A office, retail, mixed-use) — we position around cost control (CAM billing automation) and tenant experience (gate passes, facility booking). Segment 2: Manufacturing & Logistics — we position around maintenance compliance, safety (MSafe, PTW), and asset lifecycle management. Segment 3: IFM Service Companies managing 10+ client sites — we position around standardisation, multi-client management, and SLA reporting. Each segment has distinct buyer persona: FM Head (Segment 1), Operations Manager (Segment 2), COO (Segment 3).",
          source: "Tab 5, Tab 3",
          flag: "Ready to use as-is",
        },
        {
          id: "Q6",
          question: "What is our go-to-market motion in the first 90 days?",
          answer:
            "Our 90-day GTM focuses on three actions. First, we deploy 3 reference accounts from top 20 real estate operators and 1 large IFM company with dedicated success management. These accounts generate case studies for CAM billing ROI, compliance efficiency, and technician productivity. Second, we run LinkedIn content targeting FM Heads and COOs in commercial real estate and manufacturing (topics: CAM billing best practices, multi-site compliance, technician productivity). Third, we engage 2-3 PMC firms as channel partners who embed FM Matrix in their FM advisory and outsourced operations offerings. Target: 15-20 pipeline meetings by day 90, 5-8 new deployments by month 6.",
          source: "Tab 8",
          flag: "Requires founder input: Confirm which reference accounts are actively deploying and PMC partnership conversations",
        },
        {
          id: "Q7",
          question: "What is our primary competitive moat?",
          answer:
            "Our moat is built on three layers. Layer 1: Completeness — we are the only platform covering 12 core FM categories (maintenance, utilities, finance, security, CRM, visitor management, space, events, VAS, safety, marketplace, property management). Competitors focus on 2-3 categories and cannot replicate our breadth without a 3-year rebuild. Layer 2: India-first design — our CAM billing templates, RERA compliance exports, Hindu/regional language support (roadmap Q2 2026), and PMC partnership ecosystem are not replicable by global competitors. Layer 3: Low switching cost architecture — we connect to existing systems (access control, IoT sensors, ERP) via API, not replacement, making adoption non-disruptive.",
          source: "Tab 1, Tab 4, Tab 6",
          flag: "Ready to use as-is",
        },
        {
          id: "Q8",
          question: "What are the 3 biggest risks and how do we mitigate them?",
          answer:
            "Risk 1: Facilio accelerates predictive maintenance and price cuts. Mitigation: We ship predictive maintenance Phase 1 (rule-based) in Q4 2026 and compete on completeness, not just AI. Our multi-category integration is a structural advantage Facilio cannot copy quickly. Risk 2: Enterprise implementations become bottlenecked on change management and training. Mitigation: We invest in pre-packaged configuration templates for top 5 building archetypes (offices, malls, IT parks, manufacturing, hospitals) to reduce customisation time from 12 weeks to 4 weeks. Risk 3: GCC market requires local data residency and compliance certifications we do not have. Mitigation: We partner with a GCC systems integrator and establish UAE entity in Q4 2026 for local compliance and support.",
          source: "Tab 10, Tab 3",
          flag: "Requires founder input: Validate current implementation timeline from last 3 deployments",
        },
        {
          id: "Q9",
          question: "What does success look like at 12 and 36 months?",
          answer:
            "At 12 months: 40 paying accounts, INR 4-6 Cr ARR, Net Revenue Retention above 115%, average contract value INR 12-15 Lakh. At least 5 reference customers from top 50 India developers and Tier 1 IFM companies. Predictive Maintenance Phase 1 and GCC data residency live. At 36 months: 150+ paying accounts, INR 20-30 Cr ARR, GCC market with 30+ accounts generating INR 3-5 Cr ARR, AI-driven digital twin capability shipped, 50+ third-party marketplace extensions available, strategic partnerships with 2-3 global FM platform vendors.",
          source: "Tab 9, Tab 6",
          flag: "Requires founder input: Validate 12-month ARR target against current sales pipeline and deployment capacity",
        },
        {
          id: "Q10",
          question: "What is the investor and partner case?",
          answer:
            "For investors: FM Matrix addresses a USD 27.8 billion global market (11% CAGR) with zero integrated competitors in India. India's commercial real estate is growing at 7-10% annually with no unified FM software at scale. Our 75+ live locations prove product-market fit. Enterprise contracts (INR 50L-3Cr) have 95%+ gross margins and 120% NRR. Our competitive moat (completeness + India-first design + API integration) creates defensibility that 5-year-to-build competitors cannot match. For partners: PMC firms, system integrators, and IFM companies benefit from embedding FM Matrix in their service delivery, reducing implementation labor cost by 40-60% and improving SLA attainment. API partnerships (access control, IoT, ERP vendors) unlock white-label or co-sell opportunities.",
          source: "Tab 1, Tab 3",
          flag: "Requires founder input: Collect 2-3 customer testimonials and specific ROI metrics from top reference accounts",
        },
      ],
      founderChecklist: [
        {
          id: "Q2",
          item: "Current installed base by segment and geography",
          verify:
            "Pull from CRM: count of active accounts by segment (RE, IFM, Manufacturing, Healthcare); by geography (India metros, GCC, other)",
          status: "Pending",
        },
        {
          id: "Q4",
          item: "Current ACV by segment and upsell attachment rates",
          verify:
            "Pull from finance: average contract value by segment; % of accounts with upsells; attach rate by module (CAM, MSafe, ESG, etc)",
          status: "Pending",
        },
        {
          id: "Q6",
          item: "Reference account status and PMC partnership pipeline",
          verify:
            "Name the 3 reference accounts; confirm deployment timeline; list 2-3 PMC firms in active discussion; set 90-day milestones",
          status: "Pending",
        },
        {
          id: "Q8",
          item: "Implementation timeline validation from recent deployments",
          verify:
            "Pull 3 most recent deployments: measure effort from contract to go-live; identify bottlenecks; validate 4-week optimized timeline is achievable",
          status: "Pending",
        },
        {
          id: "Q9",
          item: "Current sales pipeline and deployment capacity",
          verify:
            "Count qualified leads in each stage; project 12-month close rate; validate deployment team can support INR 4-6 Cr ARR target",
          status: "Pending",
        },
        {
          id: "Q10",
          item: "Customer testimonials and ROI metrics from reference accounts",
          verify:
            "Collect: cost savings (CAM hours saved, rework reduction), operational metrics (SLA improvement %, ticket resolution time), and quote-ready testimonials from 3 live accounts",
          status: "Pending",
        },
      ],
    },
    detailedGTM: {
      intro:
        "Three target groups. Four GTM components each: Sales Motion · Marketing Channels · 90-Day Launch Sequence · Partnership Strategy. TG Summary at close of each section.",
      targetGroups: [
        {
          id: "TG1",
          title:
            "TARGET GROUP 1 — Commercial Real Estate Developers & IT Park Operators (India)",
          profile:
            "Professionally managed Grade-A commercial parks, SEZs, and mixed-use developments. Portfolio 50,000–2M+ sq ft, 5–100 buildings, 20–500+ tenants. Primary buyers: Head of Property Management / VP Facilities / COO. Primary pain: CAM billing disputes, compliance lapses, tenant SLA failures, vendor accountability. Deal size: INR 10–50L/year.",
          salesMotion: {
            headers: [
              "Component",
              "Detail",
              "Owner",
              "Timeline",
              "Success Metric",
            ],
            rows: [
              [
                "ICP Definition",
                "Target the top 50 commercial RE developers and IT park operators in India by portfolio size. Priority geographies: Bengaluru, Hyderabad, Pune, Mumbai, Chennai, NCR. Minimum qualifying criteria: 3+ buildings, 50,000+ sq ft managed, professional FM team in place.",
                "Sales Lead",
                "Ongoing — refresh quarterly",
                "50 named accounts in CRM by Day 30",
              ],
              [
                "Outbound Sequence — C-Suite",
                "6-touch outbound to Head of Property Management / VP Facilities: Day 1 LinkedIn connect with personalised note referencing their portfolio; Day 3 email with a 1-page ROI brief specific to commercial RE; Day 7 follow-up email with a relevant case study (IT park, CAM billing outcome); Day 14 phone call; Day 21 WhatsApp message with a 90-second video walkthrough; Day 28 final email. No cold decks — every touchpoint leads with an outcome.",
                "AE + SDR",
                "Always-on",
                "30% reply rate; 15% demo conversion from outbound",
              ],
              [
                "Discovery Framework",
                "Every first call follows SPIN structure: Situation (how many buildings, current tools, team size), Problem (biggest FM pain this quarter — billing, compliance, or tenant complaints?), Implication (what does that cost you monthly in wasted time, disputes, or attrition?), Need-payoff (if you could close a CAM dispute in 2 hours instead of 2 weeks, what would that mean for your team?). Objective: get to a quantified pain statement before the demo.",
                "AE",
                "First call",
                "80% of demos preceded by a quantified pain statement",
              ],
              [
                "Demo Structure",
                "30-minute demo, three acts. Act 1 (10 min): Live CAM billing walkthrough — show a monthly invoice being auto-generated from tenant occupancy data. This wins the finance team. Act 2 (10 min): Helpdesk live ticket raise, auto-assign, TAT escalation demo — wins the FM team. Act 3 (10 min): Compliance Tracker renewal alert and vendor email trigger — wins the legal/admin team. Close with: 'Which of these three problems would you like to solve first?'",
                "AE + SE",
                "Every demo",
                "50% demo-to-proposal conversion",
              ],
              [
                "Proposal & Commercial",
                "Standard proposal: 3-tier structure. Tier 1 (Core): Maintenance + Utility + Security modules, per sq ft pricing. Tier 2 (Operations): + Finance (CAM Billing) + Property Management. Tier 3 (Full Stack): + Safety + VAS + Marketplace. Present all three tiers in every proposal — anchoring on Tier 3 makes Tier 2 feel like the sensible choice. Include implementation timeline (14 days first site), reference contacts, and a 90-day success guarantee.",
                "AE + Finance",
                "Post-demo",
                "Average deal size ≥ INR 18L/year",
              ],
              [
                "Negotiation & Close",
                "Primary discount lever: multi-year contract (10% for 2-year, 15% for 3-year) — not module removal. Secondary lever: phased rollout (first 3 sites at a lower rate, full portfolio rate from site 4). Never discount below INR 8/sq ft/year. If the deal stalls, offer a 30-day paid pilot on 2 sites with a credit toward the annual contract on conversion.",
                "AE + Sales Lead",
                "Deal stage 4–5",
                "≥ 70% close rate on proposals submitted",
              ],
              [
                "Post-Sale Handoff",
                "On contract signature: AE introduces CSM within 24 hours. CSM schedules onboarding kickoff within 48 hours. Implementation begins within 7 days. AE remains copied on all communications for first 60 days. At day 60, AE returns for an expansion conversation — which additional modules or sites are ready to add?",
                "AE + CSM",
                "Post-signature",
                "First site live within 14 days of contract signing",
              ],
            ],
          },
          marketingChannels: {
            headers: [
              "Channel",
              "Execution Detail",
              "Budget Allocation",
              "Frequency / Cadence",
              "KPI",
            ],
            rows: [
              [
                "Industry Events — CREDAI & CII FM Summit",
                "Attend CREDAI National Convention, CII National FM Summit, and NAREDCO events as a sponsor or speaker. Target: 1 speaking slot per quarter on a topic like 'How Grade-A parks are cutting CAM disputes by 80%' — a peer-education talk that is a product demo in disguise. Booth at every event with a live demo kiosk running the CAM billing module.",
                "INR 8–12L/year for events, travel, booth",
                "2–3 events/quarter",
                "15–20 qualified meetings per event; 3–5 pipeline opportunities per event",
              ],
              [
                "LinkedIn Thought Leadership",
                "Publish 2 posts per week from the FM Matrix company page and the founder's personal profile. Content mix: 40% customer outcome stories (anonymised data — 'An IT park in Pune reduced CAM disputes by 83%'), 30% FM industry insight (compliance trends, energy benchmarks), 30% product updates. Target: FM Heads, Property Directors, COOs at RE companies. Use LinkedIn Sales Navigator for targeted outreach to ICP connections who engage with content.",
                "INR 1.5–2L/month (content creation + LinkedIn ads targeting FM Heads at RE companies)",
                "Daily posts; weekly sponsored content",
                "500 new ICP followers/month; 20 inbound demo requests/month from LinkedIn",
              ],
              [
                "SEO — FM Pain-Point Content",
                "Build a content cluster around high-intent search terms: 'CAM billing software India', 'facilities management compliance tracker', 'helpdesk software for commercial real estate', 'PTW software India'. Publish 4 long-form articles per month (1,500+ words). Each article ends with a specific CTA: '→ See how FM Matrix handles [topic] — book a 20-minute demo.' Target: 5,000 organic visits/month within 6 months.",
                "INR 80K–1.2L/month (content writer + SEO tool)",
                "4 articles/month; keyword review quarterly",
                "5,000 organic visits/month by month 6; 50+ inbound leads/month from SEO",
              ],
              [
                "Customer Case Study Programme",
                "Publish one detailed case study per month from the existing 75-site base. Format: 800-word narrative with 3 quantified outcomes, a customer quote, and a before/after data table. Distribute: website, LinkedIn, email to sales prospects, and leave-behind in every proposal. Priority verticals for first 6 studies: IT park CAM billing, IFM SLA compliance, hospital PPM, manufacturing safety, co-working NPS, SEZ multi-site.",
                "INR 30–50K per case study (design + copywriting)",
                "1 per month minimum",
                "Every proposal includes a relevant industry case study; case studies cited in ≥ 60% of closed deals",
              ],
              [
                "Email Nurture — ICP Database",
                "Build a database of 2,000+ FM Heads and Property Directors at target accounts (LinkedIn + events + paid list). Monthly email newsletter: FM Matrix Briefing — 3 FM industry data points, 1 customer story, 1 product update, 1 CTA. Separate drip sequence for demo no-shows and post-demo stalled deals: 5-touch, outcome-focused, no feature lists.",
                "INR 40–60K/month (email tool + content)",
                "Monthly newsletter; weekly drip to warm leads",
                "30% open rate; 5% click-to-demo rate; 20 re-engaged stalled deals/month",
              ],
              [
                "Google Ads — Competitor & Problem Keywords",
                "Run PPC campaigns on competitor brand terms (Facilio alternative, FixMyBuilding alternative) and high-intent problem terms (CAM billing software, FM compliance tracker, helpdesk for commercial buildings). Landing page per campaign: headline matches the search term, above-the-fold demo CTA, single customer stat, no feature list.",
                "INR 1.5–2.5L/month",
                "Always-on; review weekly",
                "CPL ≤ INR 3,000; 40+ qualified leads/month from paid",
              ],
              [
                "Reference Customer Programme",
                "Identify 10 'champion' customers from the existing base willing to take reference calls for new prospects. Compensate with: 1 month free subscription or a Marketplace extension credit. Build a reference matching system: new prospect in hospitality → connected to existing hospitality customer. Track reference-to-close conversion as a separate pipeline metric.",
                "INR 0 cash (module credits); 20 hrs/month CSM time",
                "Ongoing",
                "Reference call arranged within 48 hours of request; reference-assisted deals close 40% faster",
              ],
            ],
          },
          launchSequence: {
            headers: [
              "Phase",
              "Days",
              "Actions & Milestones",
              "Owner",
              "Exit Criteria",
            ],
            rows: [
              [
                "Foundation",
                "Days 1–15",
                "Build ICP target list of 50 named accounts. Load into CRM with firmographic data. Assign 2 AEs to TG1. Finalise TG1 demo script (CAM billing as Act 1). Record a 90-second CAM billing demo video for LinkedIn and outbound. Launch LinkedIn thought leadership: first 3 posts published. Brief existing RE customers on reference programme — secure 5 reference commitments. Set up Google Ads campaigns on competitor and problem keywords.",
                "Sales Lead + Marketing",
                "50 accounts in CRM; demo script finalised; 5 reference customers confirmed; ads live",
              ],
              [
                "Outreach & Pipeline Build",
                "Days 16–45",
                "Begin 6-touch outbound sequence to all 50 target accounts simultaneously. Host first virtual FM roundtable (invite 20 FM Heads from target accounts — topic: 'State of Commercial FM in India 2025'). Not a product demo — a peer conversation. FM Matrix moderates and follows up with all attendees. Target: 15 demos booked from outbound + roundtable. Submit first speaking proposal to CREDAI or CII FM Summit. Publish first customer case study (IT park, CAM billing outcome).",
                "AEs + Marketing",
                "15 demos booked; 1 case study published; roundtable with 15+ attendees",
              ],
              [
                "Demo & Proposal Conversion",
                "Days 46–70",
                "Run all 15 demos using the 3-act structure. Follow every demo with a proposal within 48 hours. Begin reference calls for deals at proposal stage. Identify 3 deals most likely to close in 90 days — assign Sales Lead to support. Run a 30-day paid pilot offer for deals that stall on proof. Attend first industry event if scheduled. Launch SEO content cluster — first 4 articles published.",
                "AEs + Sales Lead + CSM",
                "8–10 proposals submitted; 3 pilot agreements signed",
              ],
              [
                "Close & Activate",
                "Days 71–90",
                "Close 3–5 new TG1 accounts. Begin onboarding immediately — CSM kickoff within 48 hours of signature for each new account. Capture initial activation metrics (tickets logged, PPM checklists completed, compliance items tracked). Book a 30-day check-in call with all new accounts to collect early outcome data for the next case study. Brief the pipeline on Q2 targets — new outbound sequence begins for remaining 35 accounts.",
                "AEs + CSM + Marketing",
                "3–5 new logos signed; all new sites live within 14 days; 1 new case study in pipeline",
              ],
            ],
          },
          partnershipStrategy: {
            headers: [
              "Partner Type",
              "Target Partners",
              "Value Exchange",
              "Activation Plan",
              "Revenue Potential",
            ],
            rows: [
              [
                "Real Estate Consultants & Project Managers",
                "JLL India, CBRE India, Cushman & Wakefield India, Knight Frank India — their RE consulting and property management arms work directly with developers setting up new commercial parks.",
                "FM Matrix gets introductions to new projects at the fit-out stage — the best moment to sell. Partners get a platform their clients will use, improving their own service delivery. Revenue share: 10–15% of first-year contract value for referred accounts.",
                "Identify the Head of FM / Property & Asset Management at each consultancy. Invite to a private product walkthrough. Propose a co-branded case study after the first joint deal. Formalise with a channel agreement within 60 days.",
                "5–8 introductions/quarter per active partner. Each introduction has a 30–40% close rate. 3 active partners = 6–10 new logos/quarter.",
              ],
              [
                "Property Technology (PropTech) Platforms",
                "NoBroker for Business, Square Yards, and commercial listing platforms that serve the same developer audience. They have the relationships; we have the operations software.",
                "FM Matrix listed as a recommended FM platform on their business/developer product pages. Co-marketing: joint webinars, featured in their newsletters to developer clients. No revenue share — pure co-marketing to a shared audience.",
                "Approach product partnerships team at each platform. Propose a content collaboration first (joint webinar on 'FM as a tenant retention tool'). Convert to a referral arrangement after demonstrating lead quality.",
                "50–100 new ICP introductions/quarter from PropTech platform newsletters and events.",
              ],
              [
                "MEP & Building Services Contractors",
                "Voltas, Blue Star, Hitachi (HVAC), Johnson Controls, Schindler/KONE (lifts) — these companies service the very assets that FM Matrix tracks. They are in every commercial building.",
                "FM Matrix becomes the digital record for their service activities. They become a channel: when a developer asks their HVAC contractor 'how do I track maintenance?', the contractor recommends FM Matrix. Revenue share: 8% of first-year contract for referred accounts.",
                "Identify the Service Head and Key Accounts Manager at the top 10 MEP contractors in India. Present FM Matrix as a tool that makes their own service delivery easier to track and report. Pilot with 1–2 contractors who service existing FM Matrix clients.",
                "Long sales cycle (3–6 months to formalise) but high volume — top MEP contractors each service 50–200 buildings. 2 active MEP partners = 15–25 new logos/year.",
              ],
              [
                "FM Matrix Customer Referral Network",
                "Existing 75 deployed sites — the most underutilised sales asset we have. FM Heads at IT parks and commercial RE companies talk to each other at industry events, through professional networks (IWFM India, BIFM), and informally.",
                "Formal referral programme: any existing customer who introduces a new paying account receives 1 month free subscription or a Marketplace extension credit. Recognition: 'FM Matrix Champion' badge on their account profile and a LinkedIn callout.",
                "Email all existing customers with the referral programme details in Month 1. Follow up with a personal call from the CSM to identify 2–3 peers they could introduce. Track referrals as a separate pipeline source in CRM.",
                "If 20% of existing 75 sites make 1 referral each = 15 warm introductions/year with a 50%+ close rate = 7–8 new logos from zero incremental sales cost.",
              ],
            ],
          },
          summary: [
            {
              label: "Why This TG Wins First",
              value:
                "The pain is acute, quantified, and recurs monthly (CAM billing, compliance, vendor SLAs). Budget exists — RE developers already spend INR 5–20L/year on fragmented tools. Decision cycle is 4–8 weeks for mid-market. And every closed logo in this segment becomes a reference that accelerates the next deal. This is the TG that funds the rest of the GTM.",
            },
            {
              label: "The One Move That Changes Everything",
              value:
                "One marquee logo — a recognised Grade-A developer (Embassy, DLF, RMZ, Prestige, Godrej Properties) — using FM Matrix publicly. Everything else in this TG's GTM becomes easier: events invite you to speak, competitors have to respond, and every mid-market developer in the country takes your call.",
            },
            {
              label: "Biggest Risk",
              value:
                "Long internal approval cycles at large RE companies. A deal that should take 6 weeks takes 6 months because procurement, legal, and IT all need sign-off. Mitigation: always have a champion inside the account who is measured on the outcome we solve (SLA, billing, compliance). If the champion is not the buyer, qualify out early.",
            },
            {
              label: "90-Day Revenue Target",
              value:
                "3–5 new TG1 logos. Average contract INR 18–22L/year. Revenue from TG1 in 90 days: INR 54–110L in new ARR committed.",
            },
            {
              label: "Key Metrics to Track",
              value:
                "Named accounts in CRM → Demos booked → Proposals submitted → Pilots signed → Logos closed → Sites activated within 14 days → NPS at 60 days → Expansion conversation booked at 90 days.",
            },
          ],
        },
        {
          id: "TG2",
          title:
            "TARGET GROUP 2 — Integrated Facility Management (IFM) Service Companies (India)",
          profile:
            "B2B FM service companies managing 10–200+ client sites across India. They deploy staff (housekeeping, security, maintenance, soft services) and manage FM operations on behalf of enterprise clients. Companies: BVG, ISS, OCS, Quess FM, SIS, Sodexo India, Compass Group, CBRE FM arm. Primary buyer: COO / Head of Operations / VP Client Delivery. Pain: no unified platform across client sites, SLA proof for contract renewals, workforce deployment efficiency, client billing accuracy. Deal size: INR 25–80L/year (company-wide licence).",
          salesMotion: {
            headers: [
              "Component",
              "Detail",
              "Owner",
              "Timeline",
              "Success Metric",
            ],
            rows: [
              [
                "ICP & Account Prioritisation",
                "Target 20 IFM companies managing 10+ client sites in India. Tier 1 (immediate): companies with 50+ sites and in-house tech teams — they understand the problem and have budget authority. Tier 2 (90 days): companies with 10–50 sites who are losing contract renewals due to SLA reporting gaps. Exclude very small operators (<10 sites) — not yet at the pain threshold.",
                "Sales Lead",
                "Month 1",
                "20 named IFM accounts in CRM; tiered and assigned",
              ],
              [
                "Executive-Level Entry",
                "IFM deals are won at the COO or VP Operations level — not the middle manager. Every outbound touchpoint must reach the C-suite. Entry approach: connect via industry mutual introductions (IWFM India, BIFM events, LinkedIn). First meeting positioning: not 'buy our software' but 'we want to understand how you manage SLA reporting across your client base today — we're building something specifically for IFM operating models.'",
                "Sales Lead + AE",
                "Weeks 1–3 of outreach",
                "C-suite meeting secured at ≥ 40% of targeted IFM companies",
              ],
              [
                "IFM-Specific Value Proposition",
                "The IFM pitch has four outcomes: (1) SLA compliance proof — real-time TAT data you can show clients at monthly reviews instead of manually compiled reports; (2) workforce deployment visibility — who is where, doing what, at every client site, in real time; (3) billing accuracy — consumption reports, GRN/GDN tracking, and vendor POs that map directly to client invoices without manual reconciliation; (4) contract renewal leverage — when a client asks 'prove your SLA was 95% last quarter,' you pull it up in 30 seconds.",
                "AE + Sales Lead",
                "Discovery & demo",
                "80% of IFM prospects identify at least 2 of the 4 outcomes as their top pain",
              ],
              [
                "Pilot as the Entry Strategy",
                "IFM companies are risk-averse — they manage other people's buildings and any tool failure is a client-facing problem. Lead with a structured paid pilot: deploy FM Matrix on 5 client sites for 60 days at a fixed fee (INR 2–3L). At day 60, present a side-by-side SLA comparison report: manual process vs. FM Matrix. If SLA compliance improved and reporting time dropped, the conversion to full contract is near-automatic.",
                "AE + CSM",
                "Post-discovery",
                "60% pilot-to-full-contract conversion rate",
              ],
              [
                "Contract Structure — Per-Seat + Per-Site",
                "Two structures to offer: (a) Per-site licence: INR 8–12L/year per 10 client sites managed — scales with their business growth. (b) Per-seat (deployed workforce) + per-site: INR 500–800/deployed worker/month + INR 50K/site/year. Always present both and let the COO choose. Build in a growth clause: rate holds for 2 years regardless of how many sites they add — this accelerates their internal rollout.",
                "AE + Finance",
                "Proposal stage",
                "Average IFM contract value ≥ INR 35L/year",
              ],
              [
                "Post-Sale: Deployment at Scale",
                "IFM deals involve deploying FM Matrix to 20–50 client sites simultaneously. Create a dedicated IFM onboarding playbook: site template configuration (one site configured, replicated across all client sites in 48 hours), staff training programme (2-hour onboarding session for site FMs, 30-minute field staff WhatsApp onboarding), and a monthly client SLA report template auto-generated from FM Matrix data.",
                "CSM + Implementation",
                "Post-signature",
                "All contracted sites live within 30 days; monthly SLA reports generated from Day 1",
              ],
            ],
          },
          marketingChannels: {
            headers: [
              "Channel",
              "Execution Detail",
              "Budget Allocation",
              "Frequency / Cadence",
              "KPI",
            ],
            rows: [
              [
                "IWFM India & BIFM Events",
                "IFM companies are highly concentrated in their professional associations — IWFM India and BIFM member events. Attend every chapter meeting, submit a speaker application for the annual conference (topic: 'How technology is changing the SLA conversation with clients'). Host an invite-only dinner for COOs and Heads of Operations from the top 15 IFM companies at the annual conference — 20 people, one FM Matrix case study, one structured roundtable discussion.",
                "INR 3–5L/year for events + hospitality",
                "Quarterly chapter events; annual conference",
                "10 C-suite relationships built per year; 5 pipeline opportunities from events",
              ],
              [
                "LinkedIn — IFM-Specific Content",
                "Separate content track for IFM audience on LinkedIn. Weekly posts targeting: FM Operations Heads, COOs at service companies, Head of Account Delivery. Content focus: SLA reporting best practices, workforce deployment efficiency, client retention strategies for FM companies. Tone: peer-to-peer, not vendor-to-buyer. Run LinkedIn InMail campaigns to COOs at the 20 target IFM companies — 3-message sequence, each message leads with a different outcome.",
                "INR 1–1.5L/month (content + InMail)",
                "2 posts/week; InMail campaign monthly",
                "15 IFM C-suite connections per month; 5 meeting requests from InMail per quarter",
              ],
              [
                "IFM Industry Report — Annual Publication",
                "Commission a 'State of IFM Operations in India' annual report — 20 pages, data from FM Matrix deployments (anonymised), industry benchmarks, SLA compliance trends, workforce deployment efficiency stats. Distribute to every IFM company in India digitally, and as a physical copy to the top 50 at industry events. Position FM Matrix as the thought leader who understands the IFM operating model from the inside.",
                "INR 2–3L/year (research + design + print)",
                "Annual publication; quarterly data updates on website",
                "500 downloads in first month; 20 warm inbound leads from IFM companies per year",
              ],
              [
                "Webinar Series — 'The IFM Operating System'",
                "Quarterly virtual webinar specifically for IFM operations teams. Topics: Q1 — 'Eliminating SLA disputes with real-time data'; Q2 — 'How to deploy FM software across 50 client sites in 30 days'; Q3 — 'The numbers: how IFM companies are cutting workforce deployment cost by 20%'; Q4 — 'Winning contract renewals with FM data'. Each webinar features 1 FM Matrix IFM customer as a speaker. Gated registration captures IFM company details for follow-up.",
                "INR 50K per webinar (production + promotion)",
                "Quarterly",
                "100+ registrations per webinar; 20 warm leads per webinar; 5 demos booked per webinar",
              ],
              [
                "Direct Mail — Physical ROI Pack",
                "Send a physical 'IFM ROI Pack' to the COO of every Tier 1 IFM company. Contents: a personalised 1-page letter from the FM Matrix founder; a laminated one-page case study with 3 quantified outcomes from a comparable IFM deployment; a QR code linking to a personalised video walkthrough; and a business card with a direct calendar link. Physical mail cuts through the digital noise in a segment where COOs are flooded with vendor emails.",
                "INR 1.5–2K per pack; INR 30–40K total for 20 packs",
                "One-time blast + quarterly new contact refresh",
                "30% response rate; 6–8 meetings booked from physical mail campaign",
              ],
            ],
          },
          launchSequence: {
            headers: [
              "Phase",
              "Days",
              "Actions & Milestones",
              "Owner",
              "Exit Criteria",
            ],
            rows: [
              [
                "Intelligence & Positioning",
                "Days 1–20",
                "Map all 20 target IFM companies: org chart (identify COO, VP Operations, Head of Technology), current tools, contract renewal calendar. Build IFM-specific demo environment: pre-load a mock multi-site IFM setup with 5 client sites, different SLA configurations per client, and a monthly SLA report pre-generated. This is not a generic demo — it mirrors exactly how an IFM company uses the product. Finalise IFM pricing structure. Write the IFM-specific ROI one-pager.",
                "Sales Lead + SE + Marketing",
                "20 IFM accounts mapped; IFM demo environment live; ROI one-pager complete",
              ],
              [
                "C-Suite Outreach & First Meetings",
                "Days 21–45",
                "Begin C-suite outreach sequence to all 20 targets simultaneously. Use mutual introductions from IWFM India network where available — warm introductions convert at 3x the rate of cold outbound. Target: 8 first meetings booked. Host the IFM COO dinner (if an industry event falls in this window) or a standalone virtual roundtable. Send physical ROI packs to all Tier 1 targets. Publish first IFM-specific LinkedIn content series: 3 posts in 10 days on SLA reporting.",
                "Sales Lead + Marketing",
                "8 first meetings booked; physical ROI packs sent to all 20 targets",
              ],
              [
                "Discovery, Demo & Pilot Agreements",
                "Days 46–70",
                "Run discovery sessions with all 8 first-meeting accounts. Use the IFM-specific value proposition framework. Follow every discovery with a demo using the IFM demo environment. Focus on the monthly SLA report — show how it is auto-generated in 30 seconds. Propose a 60-day paid pilot to the 3–4 most qualified accounts. Pilot fee: INR 2.5L (credited toward annual contract on conversion). First quarterly webinar launched — targeting 100+ registrations from IFM community.",
                "AEs + Sales Lead + Marketing",
                "3–4 pilot agreements signed; 100+ webinar registrations; 4 additional meetings from webinar follow-up",
              ],
              [
                "Pilot Execution & Full Contract Conversion",
                "Days 71–90",
                "Pilots are live on 5 client sites each. CSM conducts weekly check-ins with each pilot account. At day 60 of pilot (approximately day 80 of the 90-day sequence), present the outcome report: SLA compliance before vs. during pilot, reporting time before vs. during pilot, any compliance gaps caught. Target: 2–3 pilot accounts convert to full contract. Begin contract negotiations. Pipeline: 5+ additional IFM accounts in active qualification.",
                "CSM + AEs + Sales Lead",
                "2–3 pilot-to-full-contract conversions; full contract value ≥ INR 30L/account; 5 additional accounts in active qualification",
              ],
            ],
          },
          partnershipStrategy: {
            headers: [
              "Partner Type",
              "Target Partners",
              "Value Exchange",
              "Activation Plan",
              "Revenue Potential",
            ],
            rows: [
              [
                "IFM Companies as Channel Partners (White-Label or Co-Brand)",
                "Top 5 IFM companies by site count: BVG, ISS, Quess FM, SIS, Sodexo India. The play: IFM company deploys FM Matrix as their proprietary FM operating platform — branded as 'BVG Operations Platform powered by FM Matrix' or similar. They sell the platform to their clients as a value-add; FM Matrix receives a per-site licence fee.",
                "IFM company gets a technology differentiator in their sales pitch ('we come with a digital FM platform — our competitors don't'). FM Matrix gets multi-site deployments without direct sales effort at each client site. Revenue share: INR 4–6L/year per 10 client sites deployed through the IFM partner.",
                "Identify 2 IFM companies willing to pilot the co-brand model. Start with one willing to deploy FM Matrix on 20 client sites. Build a white-label configuration layer (customisable branding, logo, colour scheme) — a 4-week engineering effort. Sign a formal channel agreement with minimum annual deployment commitments.",
                "1 active IFM channel partner = 20–50 client site deployments/year = INR 8–25L/year additional ARR per partner with near-zero incremental sales cost.",
              ],
              [
                "HR & Workforce Management SaaS Platforms",
                "Darwinbox, Keka, greytHR — HR platforms used by IFM companies to manage their deployed workforce. Attendance data from FM Matrix (facial recognition, geo-tagged check-ins) and shift rosters from Staff Management module are highly valuable inputs to payroll and workforce analytics.",
                "Build a bidirectional data integration: attendance and hours from FM Matrix flow into the HR platform's payroll module. FM Matrix gets listed as a 'partner integration' in the HR platform's marketplace — putting FM Matrix in front of every IFM company using that HR tool. No revenue share — pure ecosystem play that increases FM Matrix stickiness.",
                "Approach Darwinbox and Keka partnership teams. Propose a joint webinar: 'How IFM companies are connecting FM operations to payroll accuracy.' Build the integration (4–6 weeks engineering). Get listed in their integration marketplace within 90 days.",
                "Each HR platform integration listing generates 5–10 warm inbound leads from IFM companies per quarter — leads that are already sold on the problem.",
              ],
              [
                "Security Manpower Agencies",
                "G4S India, Securitas India, SIS (Security and Intelligence Services) — companies that deploy thousands of security staff across facilities. Patrolling, staff management, and incident management modules in FM Matrix directly serve their operational needs.",
                "Security agencies get a digital operations platform for their deployed guards at no additional cost (included in the site licence). In return, they recommend FM Matrix when their enterprise clients ask about FM software. Revenue share: 8% of first-year contract for accounts introduced by the security agency.",
                "Identify the Operations Director at the top 5 security agencies. Demonstrate the Patrolling and Gate Management modules — show how missed patrol alerts and QR checkpoint data protect the agency from SLA disputes with their own clients. Propose a joint pilot at 3 sites.",
                "Security agencies serve 50–200 enterprise clients each. Even a 5% conversion rate from introductions = 5–10 new logos per active security agency partner.",
              ],
            ],
          },
          summary: [
            {
              label: "Why This TG Has the Highest Revenue Multiplier",
              value:
                "One IFM company deal is worth 20–50 direct client deals in revenue terms — and it deploys to those sites with a fraction of the implementation effort because the IFM company manages the rollout. The IFM channel is how FM Matrix scales to 500+ sites without scaling the sales team proportionally.",
            },
            {
              label: "The One Move That Changes Everything",
              value:
                "One mid-size IFM company (20–50 client sites) publicly deploying FM Matrix as their operating platform and talking about it at an industry event. This signals to every other IFM company that technology is now a competitive differentiator in their bids — and that FM Matrix is the tool their competitors are using.",
            },
            {
              label: "Biggest Risk",
              value:
                "IFM companies are notoriously slow to adopt new technology — their margins are thin and any operational disruption is a client-facing risk. The pilot model directly addresses this: low commitment, fast proof, clear exit. But the pilot must be managed obsessively. A failed pilot in this TG spreads faster than a successful one.",
            },
            {
              label: "90-Day Revenue Target",
              value:
                "2–3 full IFM contracts converted from pilots. Average contract INR 35–45L/year. New ARR from TG2 in 90 days: INR 70–135L committed. Plus 3–4 active pilots that convert in month 4–5.",
            },
            {
              label: "Key Metrics to Track",
              value:
                "C-suite meetings booked → Discovery sessions → Pilots signed → Pilot activation rate (sites live/sites contracted) → Pilot-to-contract conversion → Average sites per IFM contract → Monthly SLA reports generated per account (usage depth signal).",
            },
          ],
        },
        {
          id: "TG3",
          title:
            "TARGET GROUP 3 — GCC Commercial Real Estate & Free Zone Operators (UAE, Saudi Arabia, Oman)",
          profile:
            "Developers and operators of Grade-A commercial RE, free zones, mixed-use developments, and business parks across UAE, Saudi Arabia, and Oman. Portfolio: 5–100+ buildings, government-linked or private. Regulatory environment: Civil Defence UAE, DEWA smart metering, Saudi Vision 2030 ESG mandates, Oman regulatory framework. Primary buyers: Head of Asset Management / FM Director / COO. Pain: ESG reporting gaps, tenant SLA failures, compliance with local authority requirements, no digital FM platform that understands GCC context. Deal size: AED 150K–800K/year (INR 35L–2Cr).",
          salesMotion: {
            headers: [
              "Component",
              "Detail",
              "Owner",
              "Timeline",
              "Success Metric",
            ],
            rows: [
              [
                "GCC Entry Market Selection",
                "Phase 1 (Year 1): UAE (Dubai, Abu Dhabi) as primary market. Oman as secondary, leveraging existing deployments for references. Phase 2 (Year 2): Saudi Arabia (Riyadh, NEOM corridor). Phase 3 (Year 3): Qatar, Bahrain, Kuwait. The sequencing is deliberate: UAE has the most mature FM software market in GCC, the most international buyer profiles, and the best channel partner ecosystem. Start here. Win here. Use UAE references to open Saudi.",
                "Sales Lead + GCC Country Manager",
                "Month 1 strategy lock",
                "UAE named account list of 30 companies; Oman reference cases documented",
              ],
              [
                "GCC Country Manager — Non-Negotiable Hire",
                "Do not run GCC enterprise sales from India. Hire a GCC Country Manager (Dubai-based) with 5+ years of B2B SaaS or FM solutions sales in UAE. This person must have relationships at: TECOM Group, DIFC, Emaar Properties, Aldar Properties, DWTC, and 3–5 free zone operators. Relationship capital in GCC enterprise cannot be bought with a good pitch — it comes from years of in-market presence. Budget: AED 250–350K all-in total compensation.",
                "CEO / Hiring",
                "Hire by Day 45",
                "GCC Country Manager in seat; first 10 accounts targeted by Day 60",
              ],
              [
                "GCC Discovery — Three Different Entry Questions",
                "GCC buyers are not moved by the same pain points as Indian buyers. Three questions that open GCC conversations: (1) 'How are you preparing your ESG report for your government or investor reporting this year — what data are you pulling and from where?' (2) 'When Civil Defence conducts an inspection, how quickly can you pull your compliance certificate registry?' (3) 'What does tenant churn cost you in a free zone, and what are you doing at the FM level to reduce it?'",
                "GCC Country Manager + Sales Lead",
                "First meetings",
                "80% of GCC prospects identify ESG reporting or compliance readiness as a top-3 pain",
              ],
              [
                "GCC Demo — Localised for Regulatory Context",
                "Build a GCC-specific demo environment: UAE building hierarchy (Building → Tower → Floor → Unit), DEWA compliance certificate tracker, Civil Defence NOC renewal alerts, Arabic language toggle (even if partial), AED currency billing in CAM module. The ESG reporting export should be the Act 1 of every GCC demo — not maintenance tickets. The GCC buyer's burning question is 'how do I prove to my government, my board, or my investors that this building is compliant and sustainable?' Lead with that answer.",
                "SE + GCC Country Manager",
                "Before first GCC demo",
                "GCC demo environment live; 50% demo-to-proposal conversion",
              ],
              [
                "GCC Procurement Navigation",
                "GCC enterprise procurement is formal and slow: RFP → vendor shortlist → technical evaluation → commercial negotiation → legal review → payment. Build a GCC-specific procurement readiness pack: ISO 27001 compliance documentation, data residency confirmation (UAE cloud hosting), Arabic language capability roadmap, reference list of Oman deployments. Submit this pack at the RFP stage, not the proposal stage. Payment terms: require 50% upfront on contract signature — GCC payment cycles can run 60–120 days.",
                "GCC Country Manager + Legal + Finance",
                "Pre-RFP",
                "Procurement readiness pack complete; all GCC contracts include 50% upfront clause",
              ],
              [
                "GCC Enterprise Pricing",
                "GCC pricing: AED 22–38/sq ft/year depending on module tier and portfolio size. Always quote in AED. Three tiers: Core FM (AED 22–26), Full Stack (AED 28–32), Enterprise with ESG reporting + Safety (AED 34–38). Implementation fee: AED 35,000–75,000 per deployment (non-negotiable — covers UAE data residency setup, localised configuration, and on-site training). Multi-year incentive: 10% discount on Year 2 and 3 if paid upfront.",
                "GCC Country Manager + Finance",
                "Proposal stage",
                "Average GCC deal AED ≥ 250K/year; implementation fee collected on all deals",
              ],
            ],
          },
          marketingChannels: {
            headers: [
              "Channel",
              "Execution Detail",
              "Budget Allocation",
              "Frequency / Cadence",
              "KPI",
            ],
            rows: [
              [
                "FM Expo Dubai & MEFMA Events",
                "FM Expo Dubai is the defining event for the GCC FM industry — every major operator, consultancy, and software vendor exhibits here. Take a booth. Run live demos every hour. Host a hosted buyer programme: invite 15 pre-qualified FM Directors to a private 60-minute session at the booth — not a demo, a working session where they map their FM pain against FM Matrix modules. MEFMA events are critical for relationship-building — attend every chapter meeting and apply for a speaking slot.",
                "AED 80–120K for FM Expo (booth, setup, hospitality, travel)",
                "FM Expo annual; MEFMA quarterly events",
                "50 qualified meetings at FM Expo; 10 pipeline opportunities; 3 speaking slot applications/year",
              ],
              [
                "LinkedIn GCC — Arabic & English Bilingual Content",
                "Run a separate GCC-focused LinkedIn content track targeting UAE and Saudi FM Directors, Asset Managers, and COOs at RE companies. Content in English (primary) with Arabic captions on key posts. Topics: UAE Net Zero 2050 compliance requirements for buildings, Civil Defence NOC management, ESG reporting benchmarks for GCC Grade-A offices, Vision 2030 smart building mandate. Use LinkedIn Campaign Manager to geo-target UAE and Saudi — exclude India-based audiences.",
                "AED 8–12K/month (content + GCC-targeted paid promotion)",
                "3 posts/week; monthly paid campaign",
                "200 new GCC ICP followers/month; 5 inbound demo requests/month from GCC LinkedIn",
              ],
              [
                "GCC Proptech & RE Industry Press",
                "Get FM Matrix covered in: Arabian Business, Gulf Business, Construction Week Gulf, Facilities Management Middle East (FMME Magazine), and PropertiCom. Target: 2 editorial features per quarter. Angle: 'Indian FM tech company that has deployed in Oman now expanding to UAE — here's what they built that no Western platform offers.' The India-origin-plus-proven-in-GCC angle is genuinely newsworthy in a market dominated by Western enterprise software.",
                "AED 0 for editorial (earned media); AED 15–25K for sponsored content in FMME Magazine quarterly",
                "2 editorial pitches/month; 1 sponsored piece/quarter",
                "4 editorial mentions per quarter; 500+ article reads per piece; 10 warm inbound leads per quarter from press",
              ],
              [
                "GCC ESG Webinar Series — Regulatory Compliance Focus",
                "Monthly 45-minute webinar specifically for GCC RE operators on ESG compliance. Topics: 'How to prepare your TCFD report from your building operations data', 'UAE Net Zero 2050 — what your FM platform needs to track', 'Civil Defence compliance automation for multi-building portfolios'. Invite 1 GCC industry expert or consultant as co-presenter to add credibility. Gated registration in English and Arabic. Follow up every registrant with a personalised outreach within 24 hours.",
                "AED 5–8K per webinar (production + promotion)",
                "Monthly",
                "80+ GCC registrations per webinar; 15 warm leads per webinar; 5 demos booked per webinar",
              ],
              [
                "GCC RE Developer Associations — RERA & ULI",
                "Build relationships with RERA (Real Estate Regulatory Authority UAE), ULI (Urban Land Institute) GCC chapter, and the Saudi Real Estate General Authority. These bodies regularly organise developer roundtables where FM software is not typically discussed — which creates an opening. Position FM Matrix as the technology layer that helps developers meet the regulatory standards these bodies enforce.",
                "AED 20–30K/year membership + event fees",
                "Quarterly events; annual conference",
                "3 speaking or panel appearances/year; 10 warm introductions to developer members/year",
              ],
            ],
          },
          launchSequence: {
            headers: [
              "Phase",
              "Days",
              "Actions & Milestones",
              "Owner",
              "Exit Criteria",
            ],
            rows: [
              [
                "GCC Market Readiness",
                "Days 1–20",
                "Complete UAE cloud hosting setup (AWS/Azure UAE region) — this is a blocker for all enterprise GCC deals. Hire or contract the GCC Country Manager. Build GCC demo environment (AED pricing, UAE building hierarchy, Civil Defence certificate tracker, ESG report export). Compile Oman reference cases into GCC-specific case study format (PDF in English + Arabic summary). Identify 30 target GCC accounts: UAE (20) and Saudi (10 for outreach only — deals in Year 2). Apply for FM Expo Dubai booth and speaker slots. Submit 2 press pitches to Arabian Business and FMME Magazine.",
                "CEO + Engineering + GCC Hire",
                "UAE cloud live; GCC demo ready; GCC Country Manager contracted; 30 accounts mapped",
              ],
              [
                "First Market Entry & Meetings",
                "Days 21–50",
                "GCC Country Manager begins relationship-building in UAE: attend 2 MEFMA events, schedule meetings at TECOM Group, Aldar Properties, DIFC, and 3 free zone operators. Cold outreach to remaining 15 UAE targets. Host first GCC ESG webinar — promote via LinkedIn GCC targeting and MEFMA network. Target: 10 first meetings booked in UAE. Brief Oman clients on reference programme — confirm 3 Oman reference contacts willing to speak to UAE prospects.",
                "GCC Country Manager + Marketing",
                "10 first meetings booked; 3 Oman reference contacts confirmed; GCC ESG webinar with 80+ registrations",
              ],
              [
                "Discovery, Demo & Proposal Pipeline",
                "Days 51–75",
                "Run discovery sessions with all 10 UAE first-meeting accounts. Prioritise the ESG reporting and compliance pain in every discovery. Demo using GCC environment — lead with ESG export, then compliance tracker, then helpdesk. Submit proposals to 5 most qualified accounts within 48 hours of demo. Attend FM Expo Dubai (if within this window) or a MEFMA event for 10 additional warm meetings. First press article published (Arabian Business or FMME). Begin Saudi outreach — introductory emails only in this phase; meetings in Q2.",
                "GCC Country Manager + AEs + Marketing",
                "5 proposals submitted; 10 additional meetings from FM Expo/MEFMA; first press article live",
              ],
              [
                "First GCC Logos & Reference Building",
                "Days 76–90",
                "Close 2–3 first GCC accounts. Begin onboarding immediately. These first UAE accounts are more than revenue — they are the reference stories that unlock the next 20 accounts. Assign the highest-quality CSM to GCC accounts (GCC clients have zero tolerance for implementation delays). At 30 days post-go-live, capture outcome data: compliance gaps caught, energy consumption visibility, ESG data automated. Prepare a GCC-specific case study for press release. Begin Saudi Arabia account mapping for Q2 launch.",
                "GCC Country Manager + CSM + Marketing",
                "2–3 GCC accounts signed; all live within 21 days; GCC case study drafted; Saudi account list ready",
              ],
            ],
          },
          partnershipStrategy: {
            headers: [
              "Partner Type",
              "Target Partners",
              "Value Exchange",
              "Activation Plan",
              "Revenue Potential",
            ],
            rows: [
              [
                "GCC FM & RE Consultancies",
                "CBRE GCC, JLL GCC, Cushman & Wakefield GCC, Savills Middle East — all of whom provide FM consulting, asset management, and property management services to GCC RE developers. They are trusted advisors to the exact buyer profile we are targeting.",
                "FM Matrix is recommended as the FM platform of choice for new developer mandates and FM transformation projects the consultancy is running. Partners benefit from offering a modern, proven FM platform that makes their service delivery more data-driven. Revenue share: 12–15% of first-year contract for referred accounts.",
                "GCC Country Manager schedules introductory meetings with the Head of FM/Asset Management at each GCC consultancy. Propose a co-marketing arrangement: FM Matrix provides FM tech expertise; consultancy provides RE sector credibility. Formalise with a channel agreement within 90 days of first meeting.",
                "Each active GCC consultancy partner introduces 3–6 qualified opportunities/year. At a 40% close rate and average AED 300K deal: 1 active partner = AED 360K–720K new ARR/year.",
              ],
              [
                "GCC System Integrators (SI)",
                "G42 (Abu Dhabi), Injazat, Almajal, SAIT (Saudi Advanced Industries Technology) — IT and digital transformation system integrators who implement enterprise software for GCC government and semi-government entities. They run the procurement relationships that FM Matrix cannot access directly.",
                "FM Matrix provides the FM platform that SIs propose as part of digital transformation projects for their government and RE clients. SI gets a technology partner with a proven deployment track record (75+ sites) and GCC references. FM Matrix gets access to government and sovereign RE accounts that require SI-led procurement.",
                "Identify the partnership or alliances manager at 3 target GCC SIs. Present FM Matrix's technical architecture, API capability, and deployment track record. Provide a sandbox environment for the SI's technical team to evaluate. Target: 1 SI partnership agreement signed within 90 days. Co-bid on 1 government FM digitisation project within 6 months.",
                "1 government FM project through a GCC SI partner = AED 800K–2.5M contract. Even 1 SI-introduced government deal per year transforms the GCC revenue line.",
              ],
              [
                "UAE Free Zone Authorities",
                "TECOM Group (Dubai Internet City, Dubai Media City, Dubai Knowledge Park), DIFC, ADGM (Abu Dhabi Global Market), RAKEZ — free zone authorities that manage the FM of their own zones AND influence the FM decisions of the 5,000–50,000 companies that operate within their zones.",
                "FM Matrix becomes the recommended FM platform for businesses operating within the free zone. Free zone authority gets a modern FM tool for their own operations. Tenant companies in the free zone see FM Matrix as the authority-endorsed solution. This is a platform distribution play — not just a single account win.",
                "GCC Country Manager approaches the Head of Operations or FM Director at TECOM, DIFC, and ADGM. Offer to deploy FM Matrix for the free zone's own facilities at a significantly reduced rate — treating it as a strategic investment, not a commercial deal. Once deployed for the authority, begin marketing to the tenant base through the authority's internal communication channels.",
                "TECOM manages 10 business parks with 75,000+ businesses as tenants. Even a 0.5% conversion of TECOM tenants to FM Matrix = 375 new accounts. The authority relationship is the highest-leverage distribution play in the GCC.",
              ],
              [
                "ESG & Sustainability Consultancies",
                "Sustainability consultancies operating in GCC: Sustainalytics, EY Sustainability, Deloitte ESG practice, WSP (environmental consulting). These firms are being hired by RE developers to prepare ESG reports and achieve green building certifications (LEED, BREEAM, Estidama). They need a data source.",
                "FM Matrix's Utility modules (Energy, Water, Waste, Green Inventory) and ESG report export become the data infrastructure that ESG consultancies use to build their client reports. FM Matrix is recommended to every ESG consulting client who needs an FM platform that can produce structured ESG data automatically.",
                "Approach the Managing Director of the GCC ESG practice at EY, Deloitte, or WSP. Demonstrate how FM Matrix data maps to GRI Standards and TCFD framework outputs. Propose a white-label or co-branded ESG report output — 'FM Matrix ESG Data powered by [Consultancy Name]'.",
                "Each active ESG consultancy partnership generates 4–8 qualified FM Matrix introductions per year. ESG-motivated buyers have strong budget authority and shorter decision cycles — they are solving a board-level reporting problem.",
              ],
            ],
          },
          summary: [
            {
              label: "Why This TG Is the Growth Engine at 18–36 Months",
              value:
                "GCC deal sizes are 3–5x India deal sizes. The regulatory tailwind (Vision 2030, UAE Net Zero, ESG mandates) is creating urgency that India does not yet have at the same intensity. And once we have 5–10 GCC reference accounts, every GCC enterprise deal becomes dramatically easier to close — because GCC buyers talk to each other at every industry event.",
            },
            {
              label: "The One Move That Changes Everything",
              value:
                "A TECOM Group or Aldar Properties deployment — a name that every GCC RE developer and free zone operator knows. This single logo signals that FM Matrix is not an 'Indian startup trying GCC' but an enterprise-grade platform trusted by the GCC's most recognised property operators.",
            },
            {
              label: "Biggest Risk",
              value:
                "GCC procurement timelines are long (6–18 months for government-adjacent accounts) and payment terms are slow. Cash flow risk is real if the GCC pipeline is large but slow to convert. Mitigation: require 50% upfront on all GCC contracts; keep India revenue as the base and GCC as the upside. Do not over-hire in GCC before first 3 logos are signed.",
            },
            {
              label: "90-Day Revenue Target",
              value:
                "2–3 GCC accounts signed. Average AED 250–300K/year. GCC ARR committed in 90 days: AED 500K–900K (INR 1.2–2.2 Cr). These are foundational logos — the revenue target is secondary to the reference value they create.",
            },
            {
              label: "Key Metrics to Track",
              value:
                "UAE accounts in CRM → First meetings booked (GCC Country Manager) → Demos run → Proposals submitted → Procurement stage reached → Contracts signed → Days to go-live (target ≤ 21) → ESG reports generated per account → GCC NPS at 60 days → Saudi pipeline meetings booked.",
            },
          ],
        },
      ],
      masterSummary: [
        {
          label: "Combined 90-Day New ARR Target",
          value:
            "TG1 (Commercial RE India): INR 54–110L  +  TG2 (IFM India): INR 70–135L  +  TG3 (GCC): INR 120–220L. Total new ARR committed in 90 days: INR 2.4–4.6 Cr across all three TGs.",
        },
        {
          label: "Headcount Required to Execute",
          value:
            "Sales: 2 dedicated AEs for TG1, 1 Sales Lead for TG2 (C-suite relationship role), 1 GCC Country Manager for TG3. CSM: 2 CSMs (one India-focused, one GCC-focused). Marketing: 1 content/demand gen manager. SE (Sales Engineer): 1 shared across TG1 and TG2. Total GTM headcount: 8 people.",
        },
        {
          label: "Budget Required (90-Day GTM Investment)",
          value:
            "Events (India + GCC): INR 15–20L. Digital marketing (LinkedIn, SEO, PPC): INR 6–9L/month = INR 18–27L over 90 days. Content & case studies: INR 5–8L. GCC Country Manager (90-day cost): INR 6–8L. Infrastructure (UAE cloud): INR 3–4L. Total: INR 47–67L in GTM investment to generate INR 2.4–4.6 Cr new ARR — a 4–7x return in the first 90 days.",
        },
        {
          label: "The Single GTM Principle Across All Three TGs",
          value:
            "Every sales and marketing motion in this GTM is built on one idea: proof beats pitch. A customer story beats a feature slide. An outcome number beats a module list. A reference call beats a demo video. The most important GTM investment we can make is turning our existing 75 deployed sites into 75 proof points — one for every industry, every geography, every buyer persona. The GTM plan above describes the channels and sequences. The fuel is referenceable outcomes. Invest in case studies as aggressively as you invest in sales headcount.",
        },
      ],
    },
    detailedMetrics: {
      partATitle: "PART A — 10 CLIENT IMPACT METRICS",
      partASubtitle:
        "What to track at the client's end after go-live — and what to display on the landing page",
      clientImpact: [
        {
          metric: "Maintenance Ticket Resolution Time",
          whatItMeasures:
            "Average time from ticket creation to closure — the core SLA measure for any FM operation.",
          baseline: "3–7 days (manual dispatch, WhatsApp coordination)",
          impactRange: "Reduced to 1–2 days (40–70% improvement)",
          featureDrives:
            "Helpdesk — Auto Workflow Assignment, 5-Level Escalation, TAT-Based Reporting",
          howCaused:
            "Auto-assignment eliminates the manual dispatch lag. TAT tracking creates accountability at every level. 5-level escalation ensures no ticket stagnates beyond defined thresholds. Together, these remove the 2–4 days of dead time between ticket creation and first action.",
          landingPage:
            "Resolution time dropped from 5 days to 1.5 days (+70%) at a 10-building IT park in Pune within 60 days of go-live.",
        },
        {
          metric: "Compliance Certificate Lapse Rate",
          whatItMeasures:
            "Percentage of statutory certificates (fire NOC, lift inspection, AMC) that expire without renewal — a direct legal liability measure.",
          baseline:
            "15–30% lapse rate (manual Excel tracking, missed reminders)",
          impactRange: "Reduced to 0–2% (85–100% improvement)",
          featureDrives:
            "Compliance Tracker — Renewal Alerts, Email Trigger to AMC Vendors",
          howCaused:
            "Automated multi-channel alerts to FM team, admin, and vendors at configurable lead times eliminate the manual calendar-chasing. The email trigger to AMC vendors removes the dependency on the FM team to chase renewals. Certificate status is visible in real time — not discovered at audit.",
          landingPage:
            "Compliance lapse rate fell from 22% to 0% across 8 sites within the first quarter, preventing 3 potential regulatory notices.",
        },
        {
          metric: "CAM Billing Cycle Time",
          whatItMeasures:
            "Days taken to generate, validate, and send monthly CAM invoices to tenants — a finance efficiency and cash flow metric.",
          baseline:
            "10–15 days (manual Excel calculation, manual invoice creation)",
          impactRange: "Reduced to 1–3 days (70–90% improvement)",
          featureDrives: "CAM Billing Automation, Customer Master (CRM)",
          howCaused:
            "CAM charges are auto-calculated from configured billing rules and live occupancy data in Customer Master. Invoice generation is one click. Elimination of manual calculation removes the 7–12 days of reconciliation and error correction that make up the current cycle. Finance teams go from billing spreadsheet to sent invoice in hours.",
          landingPage:
            "CAM billing cycle reduced from 12 days to 2 days (+83%) at a 50-tenant commercial complex, reducing DSO by 10 days.",
        },
        {
          metric: "Unplanned Asset Downtime (Hours per Month)",
          whatItMeasures:
            "Total hours per month that critical assets (HVAC, lifts, generators) are non-operational due to unplanned failures — a productivity and tenant satisfaction metric.",
          baseline:
            "40–80 hours/month/building (reactive maintenance culture, no PPM discipline)",
          impactRange: "Reduced to 10–25 hours/month (50–75% improvement)",
          featureDrives:
            "Digital Checklist (PPM/AMC), Asset — EBOM & Cost of Ownership, Inventory — Insufficient Stock Alerts",
          howCaused:
            "PPM checklists ensure preventive maintenance runs on schedule and is documented. EBOM and inventory alerts ensure the right spares are in stock before a job — eliminating the 'waiting for parts' downtime that extends reactive repairs. Cost of Ownership data flags assets approaching end-of-life before they fail catastrophically.",
          landingPage:
            "Unplanned HVAC downtime fell from 65 hours/month to 18 hours/month (-72%) at a 200,000 sq ft corporate campus after 90 days of PPM discipline.",
        },
        {
          metric: "Vendor SLA Compliance Rate",
          whatItMeasures:
            "Percentage of vendor work orders completed within the agreed service level — a procurement performance and contract value metric.",
          baseline:
            "55–70% SLA compliance (no real-time tracking, verbal follow-ups)",
          impactRange:
            "Improved to 82–95% (20–40 percentage point improvement)",
          featureDrives:
            "Vendor Management — SLA Tracking & Ratings, Vendor Audit, PO/WO with Multi-Level Approval",
          howCaused:
            "Digital work orders create a clear contractual record with timestamps. Vendor performance ratings create accountability and healthy competition between vendors. Vendor audit findings auto-escalate non-compliance, removing the 'soft conversation' culture that allows chronic underperformance. Vendors who know they are rated perform differently.",
          landingPage:
            "Vendor SLA compliance rose from 62% to 91% (+47%) across a portfolio of 12 managed sites after implementing Vendor Management and Audit modules.",
        },
        {
          metric: "FM Operational Cost per Sq Ft (Monthly)",
          whatItMeasures:
            "Total FM operating expenditure divided by managed area — the single number a CFO or Head of FM uses to benchmark operational efficiency.",
          baseline:
            "INR 18–28/sq ft/month (high manual labour cost, reactive spend, over-stocked inventory)",
          impactRange:
            "Reduced to INR 14–22/sq ft/month (15–25% cost reduction)",
          featureDrives:
            "Cost Approval System, Inventory Management, Asset — Cost of Ownership, PO/WO, Soft Services Scheduling",
          howCaused:
            "Cost Approval prevents unauthorised R&M spend and builds a budget-vs-actual view for every expense. Inventory demand management reduces over-purchasing and wastage. PPM reduces expensive emergency repair callouts. Soft Services scheduling optimises housekeeping staff deployment. Together, these create a data-driven FM budget that replaces gut-feel spending.",
          landingPage:
            "FM operating cost fell from INR 24/sq ft/month to INR 18/sq ft/month (-25%) at a 300,000 sq ft SEZ campus within 6 months, saving INR 1.8 Cr annually.",
        },
        {
          metric: "Tenant / Occupant Satisfaction Score (NPS or CSAT)",
          whatItMeasures:
            "Net Promoter Score or Customer Satisfaction Score collected from tenants and occupants — the leading indicator of lease renewal and tenant retention.",
          baseline:
            "NPS: +10 to +25 / CSAT: 55–65% (slow complaint resolution, no communication, no amenity access)",
          impactRange:
            "NPS: +40 to +60 / CSAT: 78–90% (30–60 point NPS improvement)",
          featureDrives:
            "Survey Module, Helpdesk (TAT), Events & Broadcast, VAS (F&B, Facility Booking, Loyalty), Space Management",
          howCaused:
            "Faster ticket resolution (measured by TAT reports) directly improves the most common complaint: 'no one responds.' Events & Broadcast keeps tenants informed. F&B, facility booking, and loyalty rewards create positive touchpoints beyond complaint management. Survey module closes the loop — tenants feel heard when their feedback is acted upon.",
          landingPage:
            "Tenant NPS increased from +18 to +52 (+189%) at a co-working operator with 800 members within 3 months of activating VAS and Survey modules.",
        },
        {
          metric: "Safety Incident Rate (per 100 workers per month)",
          whatItMeasures:
            "Number of reportable safety incidents per 100 workers per month — a regulatory compliance, insurance, and human welfare metric.",
          baseline:
            "1.5–3.5 incidents/100 workers/month (manual PTW, no KRCC enforcement, paper incident logs)",
          impactRange:
            "Reduced to 0.3–0.8 incidents/100 workers/month (70–85% improvement)",
          featureDrives:
            "PTW — Permit to Work, MSafe (KRCC, Training, LMC), Incident Management, Preparedness Checklist",
          howCaused:
            "PTW ensures no high-risk task begins without documented safety controls and approval — eliminating the 'we'll start and sort paperwork later' culture. KRCC ensures every worker is safety-qualified before their first day. Incident Management captures near-misses (not just incidents) creating a leading-indicator view that enables intervention before accidents occur.",
          landingPage:
            "Reportable safety incidents fell from 2.8 to 0.4 per 100 workers/month (-86%) at a pharmaceutical manufacturing campus within 4 months of implementing PTW and MSafe.",
        },
        {
          metric: "Space Utilisation Rate",
          whatItMeasures:
            "Percentage of bookable desks, meeting rooms, and shared spaces that are actually occupied during working hours — a real estate cost optimisation metric.",
          baseline:
            "35–50% average utilisation (no booking data, ghost bookings, no visibility)",
          impactRange:
            "Improved to 65–85% (30–70% relative improvement in utilisation visibility and optimisation)",
          featureDrives:
            "Space Management — Hot Desking, Facility Booking, VAS Space Management",
          howCaused:
            "Booking data makes utilisation visible for the first time — you cannot optimise what you cannot see. Ghost bookings (reserved but unused) are surfaced and cancelled, freeing space. Approval workflows for seat allocation reduce hoarding behaviour. Over time, utilisation data enables real estate consolidation decisions — the highest-value outcome for a CFO evaluating hybrid workspace costs.",
          landingPage:
            "Meeting room utilisation rose from 41% to 79% (+93%) at a 1,200-seat corporate campus within 60 days, enabling the client to defer a planned expansion of 3 meeting rooms worth INR 45L.",
        },
        {
          metric: "Energy & Water Cost Reduction (Monthly)",
          whatItMeasures:
            "Month-on-month reduction in utility spend driven by consumption monitoring, leak detection, and anomaly alerts — a direct P&L impact metric.",
          baseline:
            "0% reduction (no monitoring, manual meter reads, no anomaly detection)",
          impactRange:
            "8–20% reduction in energy/water bills (INR 2–15L/month depending on facility size)",
          featureDrives:
            "Energy Meters Monitoring, Water Management — Leak Detection, Waste Management, STP Operations",
          howCaused:
            "Anomaly alerts on energy consumption identify HVAC systems running inefficiently or equipment left on after hours — issues that are invisible without monitoring. Water leak detection prevents slow leaks that add up to hundreds of thousands of litres monthly. Waste tracking enables recycling vendor revenue, partially offsetting disposal costs. Each module converts invisible waste into visible savings.",
          landingPage:
            "Energy costs reduced by 14% (INR 4.2L/month) at a 150,000 sq ft manufacturing campus within 3 months of activating the Energy Meter and anomaly alert modules.",
        },
      ],
      partBTitle: "PART B — NORTH STAR METRIC + TOP 10 LAUNCH METRICS",
      partBSubtitle: "First 30 Days and First 3 Months",
      northStar: {
        metric:
          "Number of Active Sites Running Core FM Workflows (Helpdesk + PPM + Compliance) Daily",
        definition:
          "A site is 'active' when it logs at least 3 tickets OR completes at least 1 PPM checklist OR reviews 1 compliance item within the last 7 days. Everything else — revenue, retention, NPS — follows from this.",
        why: "Revenue is a lagging indicator. NPS is a lagging indicator. Active daily workflow usage is the leading indicator that a site will renew, expand, and refer. If sites are live but not using core workflows, every other metric is at risk. Track this weekly. Build every onboarding and CSM motion around moving new sites to active status within 14 days of go-live.",
      },
      launchMetrics: [
        {
          metric: "Active Sites (North Star)",
          whatItMeasures:
            "Sites running Helpdesk + PPM + Compliance workflows at least 3x/week — confirms operational embedding, not just installation.",
          category: "Adoption",
          d30Current:
            "60% of new go-lives active within 14 days (Target: 6 of 10 new sites)",
          m3Current:
            "85% of all deployed sites active (Target: 64 of 75 existing + new sites)",
          d30Phase1:
            "70% active within 10 days (AI onboarding wizard reduces setup time from 3 days to 4 hrs)",
          m3Phase1:
            "92% active sustained (WhatsApp notifications + AI routing increase daily engagement by ~30%)",
        },
        {
          metric: "Time-to-First-Value (TTFV)",
          whatItMeasures:
            "Days from contract signing to the moment the client logs their first resolved ticket and completed PPM checklist — the speed of demonstrated ROI.",
          category: "Onboarding",
          d30Current: "TTFV under 14 days for 70% of new sites",
          m3Current: "TTFV under 10 days for 80% of new sites",
          d30Phase1:
            "TTFV under 7 days for 80% of new sites (AI setup wizard + bulk import from CSV)",
          m3Phase1: "TTFV under 5 days for 90% of new sites",
        },
        {
          metric: "Monthly Recurring Revenue (MRR)",
          whatItMeasures:
            "Total contracted monthly revenue across all active sites — the primary revenue health metric.",
          category: "Revenue",
          d30Current:
            "INR 35–50L MRR from existing 75 sites + 5–8 new sites closed in month 1",
          m3Current: "INR 60–85L MRR (75 base + 15–20 new sites, 0% churn)",
          d30Phase1:
            "INR 40–55L MRR (AI features justify 10–15% price uplift on new deals)",
          m3Phase1:
            "INR 75–100L MRR (Broader addressable market from IoT + offline mode unlocking manufacturing/hospital deals)",
        },
        {
          metric: "Net Revenue Retention (NRR)",
          whatItMeasures:
            "MRR at end of period ÷ MRR at start, including expansions and churn — measures whether existing customers are growing or shrinking in value.",
          category: "Retention",
          d30Current:
            "NRR ≥ 100% (No churned sites in month 1; at least 2 expansion deals from existing customers)",
          m3Current:
            "NRR ≥ 108–115% (5–8% expansion from module upsells + 0–1 churn)",
          d30Phase1:
            "NRR ≥ 102% (Phase 1 features reduce churn risk but expansion takes time to land)",
          m3Phase1:
            "NRR ≥ 115–125% (AI features + ESG reporting create clear upsell motion; marketplace extensions drive expansion revenue)",
        },
        {
          metric: "Customer Acquisition Cost (CAC)",
          whatItMeasures:
            "Total sales and marketing spend ÷ number of new customers acquired — measures go-to-market efficiency.",
          category: "Growth Efficiency",
          d30Current:
            "CAC: INR 2.5–4L per site (Direct enterprise sales, 2–4 week cycle for mid-market)",
          m3Current:
            "CAC: INR 2–3.5L per site (Reference customers reduce sales cycle; word-of-mouth begins)",
          d30Phase1:
            "CAC: INR 2.5–4L per site (No significant GTM change in 30 days from Phase 1 roadmap)",
          m3Phase1:
            "CAC: INR 1.5–2.5L per site (ROI calculator + competitive battlecard shorten cycle by 20–30%)",
        },
        {
          metric: "LTV:CAC Ratio",
          whatItMeasures:
            "Lifetime Value of a customer ÷ CAC — measures whether the unit economics of acquisition are healthy. Target ≥ 3x.",
          category: "Unit Economics",
          d30Current:
            "LTV:CAC ≥ 3.5x (Avg contract INR 12L/year × 4-year avg retention = INR 48L LTV vs INR 3L CAC)",
          m3Current:
            "LTV:CAC ≥ 4.5x (Improved retention and expansion improve LTV; CAC falls with referrals)",
          d30Phase1:
            "LTV:CAC ≥ 4x (AI features improve retention, slightly raising LTV)",
          m3Phase1:
            "LTV:CAC ≥ 6–8x (Marketplace revenue + higher ASP from enterprise features raise LTV significantly)",
        },
        {
          metric: "Activation Rate",
          whatItMeasures:
            "Percentage of newly onboarded sites that complete the full activation checklist within 14 days (setup complete, 10+ tickets logged, first PPM checklist completed, first compliance item tracked).",
          category: "Onboarding",
          d30Current:
            "Activation rate ≥ 65% (With current manual onboarding process and CSM support)",
          m3Current:
            "Activation rate ≥ 75% (Improved onboarding playbook and reference documentation)",
          d30Phase1:
            "Activation rate ≥ 78% (AI setup wizard reduces configuration friction significantly)",
          m3Phase1:
            "Activation rate ≥ 90% (WhatsApp notifications ensure field staff engage with platform from day 1)",
        },
        {
          metric: "Churn Rate (Monthly)",
          whatItMeasures:
            "Percentage of active sites that cancel or go non-responsive in a given month — the single most important retention signal in the first 90 days.",
          category: "Retention",
          d30Current:
            "Monthly churn ≤ 1% (Target: 0 churned sites in month 1; most churn risk is 90+ days post go-live)",
          m3Current:
            "Monthly churn ≤ 1.5% (Some early adopters who were mis-sold or under-onboarded will surface by month 3)",
          d30Phase1:
            "Monthly churn ≤ 0.8% (Faster activation reduces the 'never really started' churn category)",
          m3Phase1:
            "Monthly churn ≤ 0.5% (Offline mode + AI routing solve the two biggest early churn drivers: field staff not using mobile app)",
        },
        {
          metric: "Daily Active Users per Site (DAU/Site)",
          whatItMeasures:
            "Average number of unique users logging in and taking an action in FM Matrix per day per deployed site — measures depth of adoption, not just breadth.",
          category: "Engagement",
          d30Current:
            "DAU/Site ≥ 8 users/day (Helpdesk assignee, FM manager, security staff as minimum active users)",
          m3Current:
            "DAU/Site ≥ 15 users/day (Finance team, housekeeping supervisors, and tenants beginning to engage)",
          d30Phase1:
            "DAU/Site ≥ 10 users/day (WhatsApp integration makes it accessible to field staff who won't open an app)",
          m3Phase1:
            "DAU/Site ≥ 22 users/day (Tenant-facing VAS features + WhatsApp-native flows bring occupants into daily usage)",
        },
        {
          metric: "Net Promoter Score (Customer NPS)",
          whatItMeasures:
            "Likelihood of FM Head or Property Manager to recommend FM Matrix to a peer — the leading indicator of organic pipeline and reference customer availability.",
          category: "Customer Health",
          d30Current:
            "NPS ≥ +35 (Surveyed at end of month 1 from sites that have completed activation)",
          m3Current: "NPS ≥ +50 (Surveyed at 90 days from all active sites)",
          d30Phase1:
            "NPS ≥ +40 (Faster activation and AI routing improvements create a better first impression)",
          m3Phase1:
            "NPS ≥ +60 (ESG reporting, ROI calculator, and AI insights give customers something tangible to show their leadership — the biggest driver of promoter behaviour)",
        },
        {
          metric: "Marketplace Extension Attach Rate",
          whatItMeasures:
            "Percentage of active sites that have installed at least one Marketplace extension (Lease Management, Accounting, Cloud Telephony, Loyalty Rule Engine) — measures platform stickiness beyond core FM.",
          category: "Expansion Revenue",
          d30Current:
            "Attach rate ≥ 15% (Target: 10–12 of 75 sites have at least one extension active by end of month 1)",
          m3Current:
            "Attach rate ≥ 30% (Target: 25–30 sites, driven by active CSM upsell motion)",
          d30Phase1:
            "Attach rate ≥ 18% (AI app recommendation in marketplace surfaces relevant extensions to right users)",
          m3Phase1:
            "Attach rate ≥ 45% (AI app recommendations + SAP connector drive significantly higher extension adoption among enterprise accounts)",
        },
      ],
    },
  },
};

// Tab Labels
const tabLabels: Record<string, string> = {
  summary: "Product Summary",
  features: "Features",
  market: "Market Analysis",
  pricing: "Features & Pricing",
  usecases: "Use Cases",
  swot: "SWOT",
  roadmap: "Roadmap",
  business: "Business Plan",
  gtm: "GTM Strategy",
  metrics: "Metrics",
  assets: "Assets",
};

// Summary Tab
const FMSummaryTab: React.FC = () => {
  const identity = productData.extendedContent.productSummaryNew.identity;
  const problemSolves =
    productData.extendedContent.productSummaryNew.problemSolves;
  const whoItIsFor = productData.extendedContent.productSummaryNew.whoItIsFor;
  const today = productData.extendedContent.productSummaryNew.today;
  const usps = productData.extendedContent.usps;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Identity Section */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-2xl font-semibold tracking-tight font-poppins">
          {productData.name} - Product Identity
        </h2>
        <p className="text-[10px] font-medium text-[#2C2C2C]/40 tracking-widest mt-1">
          LOCKATED / GOPHYGITAL.WORK | ENTERPRISE FACILITIES MANAGEMENT PLATFORM
          | INDIA PRIMARY, GCC SECONDARY
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

      {/* Problem Solves */}
      <div className="bg-[#DA7756] text-white border border-[#C4B89D] p-4 font-semibold text-sm rounded-t-xl font-poppins">
        The Problems It Solves
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-4 text-center w-1/3 font-poppins">
                Pain Point
              </th>
              <th className="border border-[#C4B89D]/50 p-4 text-center font-poppins">
                How FM Matrix Solves It
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

      {/* Who It Is For */}
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
                Use Case
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

      {/* USPs */}
      <div className="bg-[#DA7756] text-white border border-[#C4B89D] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">
        Key USPs
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usps.map((usp, i) => (
          <div
            key={i}
            className="bg-white border border-[#C4B89D] p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-[#DA7756] text-sm mb-2 font-poppins">
              {usp.headline}
            </h3>
            <p className="text-[#2C2C2C]/80 text-xs leading-relaxed font-poppins">
              {usp.description}
            </p>
          </div>
        ))}
      </div>

      {/* Where We Are Today */}
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

// Features Tab
const FMFeaturesTab: React.FC = () => {
  const features = productData.extendedContent.detailedFeatures;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          FM MATRIX — FULL FEATURE LIST
        </h2>
      </div>
      <p className="text-[11px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        All features from product brief. Blue rows = USP features. Feature Name
        with "Yes" in USP column indicates unique competitive advantage.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Feature Name
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Description
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                USP?
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Module / Category
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                User Type
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Status
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Priority
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => {
              // Render category header row
              if (f.isCategory) {
                return (
                  <tr key={i} className="bg-[#DA7756]">
                    <td
                      colSpan={8}
                      className="border border-[#C4B89D]/50 p-3 text-white font-bold text-[11px]"
                    >
                      {f.categoryName}
                    </td>
                  </tr>
                );
              }
              // Render feature row
              return (
                <tr
                  key={i}
                  className={
                    f.isUSP === "Yes"
                      ? "bg-[#DA7756]/10"
                      : i % 2 === 0
                        ? "bg-white"
                        : "bg-[#F6F4EE]"
                  }
                >
                  <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C] font-medium whitespace-nowrap">
                    {f.featureName}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                    {f.description}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                    {f.isUSP}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-nowrap">
                    {f.module}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                    {f.userType}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                    {f.status}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                    {f.priority}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                    {f.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Market Analysis Tab
const FMMarketAnalysisTab: React.FC = () => {
  const marketData = productData.extendedContent.marketAnalysis;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          FM MATRIX — MARKET ANALYSIS
        </h2>
      </div>
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Part A: Target Audience (India and GCC)
      </div>
      <p className="text-[11px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Five key customer segments with documented pain points, current state
        solutions, and implications of non-adoption.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap min-w-[100px]">
                Audience Segment
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[150px]">
                Demographics
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[120px]">
                Industries
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[180px]">
                Pain Points
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[180px]">
                If NOT Solved
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[150px]">
                Today's Solution
              </th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[#e2efda]" : "bg-white"}>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C] font-medium whitespace-nowrap">
                  {m.segment}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {m.demographics}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {m.industries}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {m.painPoints}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {m.ifNotSolved}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {m.todayState}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part B: Competitor Mapping */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Part B: Competitor Mapping (India and GCC)
      </div>
      <p className="text-[11px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Key competitors with pricing, features, weaknesses, market gaps we
        exploit, and innovations that threaten us.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Competitor
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Primary Target
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Pricing
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                How Buyers Discover
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Strengths & USPs
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Weaknesses
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Market Gaps We Exploit
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Their Threats to Us
              </th>
            </tr>
          </thead>
          <tbody>
            {productData.extendedContent.competitors.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[#fce4d6]" : "bg-white"}>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C] font-medium whitespace-nowrap">
                  {c.name}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {c.targetCustomer}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {c.pricing}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {c.discovery}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {c.strengths}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {c.weaknesses}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {c.gaps}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {c.threats}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Features & Pricing Tab
const FMFeaturesAndPricingTab: React.FC = () => {
  const featureComparison = [
    {
      feature: "Helpdesk / Ticketing",
      market:
        "Basic ticket logging, assignment, status tracking, email notifications. 2–3 escalation levels max.",
      ours: "5-level escalation, auto workflow assignment, cost approval integration, TAT-based SLA reporting, vendor assignment.",
      status: "Ahead",
      summary:
        "Our escalation depth and cost approval linkage are genuine differentiators. No competitor matches the 5-level structure.",
    },
    {
      feature: "Asset Management",
      market: "Asset register, basic maintenance history, warranty tracking.",
      ours: "Full lifecycle management with EBOM, associated assets, cost of ownership, warranty alerts, manuals/invoices attached.",
      status: "Ahead",
      summary:
        "EBOM and cost of ownership analysis are enterprise-grade features most mid-market FM tools don't offer.",
    },
    {
      feature: "Planned Preventive Maintenance (PPM)",
      market: "Scheduled task creation, basic checklists, calendar views.",
      ours: "PPM/AMC-configured digital checklists, auto task assignment, review workflows, negative task reporting.",
      status: "Ahead",
      summary:
        "Negative task reporting and AMC-specific configuration go beyond the standard checklist model.",
    },
    {
      feature: "Compliance & Regulatory Tracking",
      market: "Basic reminder system for certificate renewals. Manual uploads.",
      ours: "Automated alerts to FM, admin and vendors; email triggers to AMC vendors; multi-certificate tracking.",
      status: "Ahead",
      summary:
        "Automated vendor email triggers remove the manual follow-up step that competitors leave in the user's hands.",
    },
    {
      feature: "Inventory Management",
      market: "Stock tracking, reorder alerts, basic reports.",
      ours: "Spares and consumables tracking, GRN/GDN audit trail, insufficient stock alerts, consumption reports. Plus: Green Inventory as a separate ESG-focused module.",
      status: "Ahead",
      summary:
        "Green Inventory is a unique differentiator as ESG reporting becomes mandatory in India and GCC.",
    },
    {
      feature: "Safety — PTW (Permit to Work)",
      market:
        "Few competitors include PTW. Those that do offer basic digital forms.",
      ours: "Full PTW workflow: issue, track, close with multi-level approval and mandatory safety check completion before work begins.",
      status: "Ahead",
      summary:
        "PTW is legally required in manufacturing, construction, and healthcare. Competitors don't go this deep.",
    },
    {
      feature: "Incident Management",
      market: "Incident logging, basic categorisation, email notification.",
      ours: "Real-time logging with severity tiers, auto-assignment, IVR call escalation, trend analytics and prevention reporting.",
      status: "Ahead",
      summary:
        "IVR call escalation is unique — critical for high-severity incidents in manufacturing and healthcare where email is too slow.",
    },
    {
      feature: "Visitor & Gate Management",
      market: "Digital visitor log, pre-registration, basic pass printing.",
      ours: "Face-scan entry, digital passes, QR patrol checkpoints, patrolling with missed checkpoint alerts, vehicle tracking (registered + guest), gate pass inward/outward with returnable tracking.",
      status: "Ahead",
      summary:
        "The combination of visitor, patrol, vehicle, and gate pass in one module set is more comprehensive than any competitor in the mid-market.",
    },
    {
      feature: "Space Management / Desk Booking",
      market: "Desk booking calendar, availability view, basic approval.",
      ours: "Admin roster creation OR employee self-booking, approval workflows, access control integration, hot-desk optimisation.",
      status: "At Par",
      summary:
        "Functional parity with most modern competitors. Differentiate on UX and integration with the broader FM platform.",
    },
    {
      feature: "CAM Billing",
      market:
        "Most FM platforms do NOT include billing. It is typically handled by separate accounting software.",
      ours: "Auto-calculation of CAM charges by occupancy, invoice generation, payment tracking — fully integrated in the FM platform.",
      status: "Ahead",
      summary:
        "This is a significant gap in the market. Finance teams currently use Excel. Our built-in CAM module eliminates a tool from the stack.",
    },
    {
      feature: "PO / Work Order Management",
      market: "Basic PO creation, single-level approval, vendor notification.",
      ours: "Multi-level approval routing, digital PO/WO lifecycle, vendor assignment and tracking, integration with cost approval system.",
      status: "Ahead",
      summary:
        "Multi-level approval with cost-tier routing is enterprise-grade and closes a key gap for regulated industries.",
    },
    {
      feature: "Vendor Management",
      market: "Vendor contact directory, basic contract storage.",
      ours: "Contract repository, SLA performance tracking, performance ratings, vendor audit module (separate from operational audit).",
      status: "Ahead",
      summary:
        "Vendor audit as a distinct module — not just a rating — creates an auditable compliance trail that procurement teams value.",
    },
    {
      feature: "Tenant / Occupant Experience (VAS)",
      market:
        "Rare in core FM tools. Usually requires a separate proptech app.",
      ours: "F&B ordering (QR-based), facility booking, loyalty redemption marketplace (Bronze/Silver/Gold), OSR, space booking — all integrated.",
      status: "Significantly Ahead",
      summary:
        "No FM competitor in India or GCC mid-market offers an integrated loyalty programme and QR food ordering. This is a category-defining feature.",
    },
    {
      feature: "Energy & Utility Monitoring",
      market: "Energy meter reading, basic dashboards, manual data entry.",
      ours: "Energy meters, water management with leak detection, waste categorisation (organic/recyclable/hazardous), STP management, green inventory — all under one Utility category.",
      status: "Ahead",
      summary:
        "Waste management and STP as native modules are rare. Most tools require third-party IoT platforms for this.",
    },
    {
      feature: "Safety — MSafe / Worker Compliance",
      market:
        "Not available in most FM platforms. HR or EHS tools handle this separately.",
      ours: "KRCC pre-start compliance, Training module, Line Manager Connect — purpose-built for FTE safety onboarding in complex sites.",
      status: "Significantly Ahead",
      summary:
        "A dedicated worker safety onboarding module inside an FM platform is unique. Directly addresses regulatory requirements in manufacturing and healthcare.",
    },
    {
      feature: "Marketplace / App Extensions",
      market:
        "No FM competitor in India/GCC mid-market offers a true marketplace model.",
      ours: "In-platform app store with installable extensions: Lease Management, Loyalty Rule Engine, Cloud Telephony, Accounting.",
      status: "Significantly Ahead",
      summary:
        "Platform model creates an ecosystem moat and enables revenue share. Competitors are closed systems.",
    },
    {
      feature: "Mobile Application",
      market: "Mobile apps are standard. Quality varies widely.",
      ours: "Field-facing mobile app for technicians, security, visitors, and FM managers. QR scanning, ticket updates, checklist completion, patrol check-ins.",
      status: "At Par",
      summary:
        "Parity with modern competitors. Opportunity to differentiate on offline mode and AI-assisted features.",
    },
    {
      feature: "AI / Predictive Analytics",
      market:
        "Leading competitors (Facilio, IBM Maximo) are investing in predictive maintenance AI using IoT sensor data.",
      ours: "Not yet live. Dashboard analytics are reactive, not predictive. No AI-assisted ticket routing or anomaly detection.",
      status: "Gap",
      summary:
        "This is the most significant gap. Must be addressed in the 6–18 month roadmap to defend against Facilio and BuildingMinds.",
    },
    {
      feature: "IoT / Sensor Integration",
      market:
        "Facilio and BuildingMinds offer native IoT integration for real-time building data streams.",
      ours: "Not natively integrated. Utility modules rely on manual data entry or basic meter reads.",
      status: "Gap",
      summary:
        "Without IoT, energy and water modules are limited to manual inputs. Critical to close for GCC enterprise deals.",
    },
    {
      feature: "BIM / Digital Twin",
      market:
        "Archibus, Planon, and enterprise IWMS platforms offer CAD/BIM integration for space and asset visualisation.",
      ours: "Not available.",
      status: "Gap",
      summary:
        "Not an immediate deal-blocker for mid-market, but required for large enterprise and government accounts in GCC.",
    },
  ];

  const pricingTiers = [
    {
      segment: "Standard Pricing Models in FM SaaS",
      india:
        "Per sq ft/year, per user/month, or per site/month. Module bundles common. Free tier rare.",
      gcc: "Per sq ft/year or per user/month. Often bundled with implementation. Annual contracts standard.",
      notes:
        "India buyers prefer per sq ft or flat site fee. GCC buyers accept per user but expect enterprise contract terms.",
      recommendation:
        "Adopt per sq ft/year as primary metric — aligns with how buyers budget FM costs and enables easy comparison.",
    },
    {
      segment: "India Price Range — Entry (1–5 sites, <50,000 sq ft)",
      india:
        "INR 3–6 per sq ft/year for basic helpdesk + asset tools (e.g. FixMyBuilding, local tools).",
      gcc: "N/A — entry segment in India does not apply to GCC.",
      notes:
        "Indian entry market is price-sensitive. Win on breadth — more modules for same price.",
      recommendation:
        "INR 4–5 per sq ft/year for core FM bundle (Maintenance + Utility + Security). Upsell VAS and Finance.",
    },
    {
      segment: "India Price Range — Mid (5–20 sites, 50K–500K sq ft)",
      india:
        "INR 6–12 per sq ft/year for mid-tier FM platforms with asset, compliance, and visitor modules.",
      gcc: "N/A",
      notes:
        "Mid-market is the primary sweet spot today. Don't discount below INR 7 — it anchors future enterprise negotiations.",
      recommendation:
        "INR 8–10 per sq ft/year for full FM stack excluding Marketplace extensions. Extensions priced separately.",
    },
    {
      segment: "India Price Range — Enterprise (20+ sites, 500K+ sq ft)",
      india:
        "INR 12–22 per sq ft/year for enterprise platforms with full module depth (Facilio top end, Archibus excluded).",
      gcc: "N/A",
      notes:
        "Enterprise deals require named account sales. Include professional services in contract — not free.",
      recommendation:
        "INR 14–18 per sq ft/year for full platform + priority support + onboarding. Negotiate multi-year to lock in accounts.",
    },
    {
      segment: "GCC Price Range — Entry (1–3 properties)",
      india: "N/A",
      gcc: "AED 10–18 per sq ft/year. USD 300–800/user/month for basic tools.",
      notes:
        "GCC entry market expects professional implementation support even for small deployments.",
      recommendation:
        "AED 14–16 per sq ft/year for core bundle. Implementation fee separate (AED 25,000–50,000 per site).",
    },
    {
      segment: "GCC Price Range — Mid (3–15 properties)",
      india: "N/A",
      gcc: "AED 18–30 per sq ft/year. USD 600–1,200/user/month for mid-tier.",
      notes:
        "GCC mid-market is the fastest growth segment — RE and hospitality operators scaling portfolios post-Vision 2030.",
      recommendation:
        "AED 22–26 per sq ft/year for full stack. Annual contract with quarterly reviews. ESG reporting add-on priced separately.",
    },
    {
      segment: "GCC Price Range — Enterprise (15+ properties, government)",
      india: "N/A",
      gcc: "AED 28–50+ per sq ft/year. Enterprise contracts USD 200,000–1,000,000+/year (Archibus/Planon territory).",
      notes:
        "Government and sovereign fund-backed RE in GCC will pay premium for proven compliance and audit capability.",
      recommendation:
        "Position at AED 30–38 per sq ft/year vs Archibus/Planon. Win on speed of deployment and total cost of ownership.",
    },
    {
      segment: "How Competitors Tier Features",
      india:
        "Basic: Helpdesk + Asset. Mid: + Compliance + Visitor + Inventory. Enterprise: + Finance, Safety, VAS.",
      gcc: "Same pattern. IoT and AI features reserved for top tier or sold as add-ons.",
      notes:
        "Competitors gate safety and finance modules at higher tiers — this creates an opportunity to bundle them in mid-tier and win deals.",
      recommendation:
        "Include PTW and Compliance Tracker in mid-tier. These are pain points, not luxury features. Upsell VAS and Marketplace as premium.",
    },
    {
      segment: "What to Charge — Now",
      india: "India: INR 8–10/sq ft/yr. GCC: AED 20–24/sq ft/yr.",
      gcc: "As above.",
      notes:
        "Current deployments validate the platform. Price for mid-market expansion, not for discounted land-and-expand.",
      recommendation:
        "Do not discount below floor prices. Offer extended implementation support instead of price cuts.",
    },
    {
      segment: "What to Charge — At 6 Months",
      india:
        "India: INR 10–12/sq ft/yr with AI-assisted features launching. GCC: AED 24–28/sq ft/yr.",
      gcc: "As above.",
      notes:
        "Once predictive maintenance or AI ticket routing launches, re-price upward and grandfather existing customers at a lower rate.",
      recommendation:
        "Create a clear upgrade path. AI features justify a 15–20% price increase — communicate the roadmap to existing customers now.",
    },
    {
      segment: "What to Charge — At 18 Months",
      india:
        "India: INR 14–18/sq ft/yr for full AI + IoT platform. GCC: AED 30–38/sq ft/yr.",
      gcc: "As above.",
      notes:
        "At 18 months, FM Matrix should compete directly with Facilio and Archibus on price AND features in enterprise segment.",
      recommendation:
        "Bundle IoT integration, predictive maintenance, and ESG reporting into an Enterprise tier. Protect mid-tier pricing.",
    },
    {
      segment: "One Pricing Risk to Watch",
      india:
        "Race to the bottom in India mid-market — local tools and IFM companies building internal tools will compress margins. Do not compete on price; compete on breadth and outcomes.",
      gcc: "GCC payment cycles are slow (60–90 day terms common). Ensure contracts include penalties for late payment and require upfront annual payment where possible.",
      notes:
        "Both markets have the same root risk: buyers treating FM software as a commodity. Differentiate by selling outcomes (cost saved, compliance maintained, incidents prevented) not features.",
      recommendation:
        "Build a clear ROI calculator. Quantify: CAM billing time saved, compliance fines avoided, vendor penalties prevented. Price to outcomes, not to feature count.",
    },
  ];

  const positioningDimensions = [
    {
      title: "Our Single Most Defensible Position Right Now",
      detail:
        "The only FM platform built ground-up for India and GCC mid-market that unifies maintenance, safety, tenant experience, and finance — deployed and live across 75+ locations. No competitor is this broad, this affordable, and this proven in this geography.",
    },
    {
      title: "Customer Segments to Prioritise This Year — #1",
      detail:
        "Commercial RE Developers and IT Park operators in India (Bengaluru, Mumbai, Hyderabad, Pune). They have the budget, the scale, and the most acute pain across billing, compliance, and tenant experience. Win 5–10 marquee logos here and the rest of the market follows.",
    },
    {
      title: "Customer Segments to Prioritise This Year — #2",
      detail:
        "IFM Service Companies managing 10+ client sites in India. They need a single operating platform across clients. Once deployed, switching cost is extremely high — these become sticky, multi-year accounts.",
    },
    {
      title: "Customer Segments to Prioritise This Year — #3",
      detail:
        "GCC Commercial RE and Free Zone operators (UAE and Saudi). Post-Vision 2030 construction boom + ESG mandate + talent war for tenant retention makes them ideal buyers. Oman footprint gives us a referenceable GCC case study.",
    },
    {
      title: "The One Competitor to Displace Most Aggressively",
      detail:
        "Facilio (India and GCC). They are the most direct competitor in geography and positioning. Their weakness: no CAM billing, no tenant loyalty programme, no MSafe/PTW depth. Our playbook: lead with VAS + billing + safety in every competitive deal. Make them defend what they don't have.",
    },
    {
      title: "What to Stop Doing or Saying That Dilutes Our Position",
      detail:
        "Stop leading with the feature list. It overwhelms buyers and invites comparison on features we haven't built yet (IoT, AI). Start leading with outcomes: 'We cut CAM billing disputes by X%, reduced compliance lapses to zero at 75+ sites.' Stop calling it 'an all-in-one tool' — buyers don't believe all-in-one claims. Say: 'The platform your FM, finance, and security teams will actually use.'",
    },
    {
      title: "Recommended GTM Motion for Year 1",
      detail:
        "Direct enterprise sales in India (named accounts: top 20 commercial RE developers, top 10 IFM companies). Channel partnerships in GCC (CBRE, JLL GCC FM arms, local SI partners). Events: CREDAI, CII FM Summit, FM Expo Dubai for brand. PLG is premature — FM buyers don't self-serve for platforms this complex. Invest in 2–3 reference case studies and use them in every sales conversation.",
    },
  ];

  const valuePropositions = [
    {
      value: "One platform for all FM needs — replace 10 tools with one.",
      resonance:
        "Resonates strongly with FM Heads and COOs tired of managing multiple vendor contracts and data silos.",
      suggestion:
        "Quantify it: 'Replace an average of 8 tools. Our customers report saving INR X per year in software licensing alone.' Build a tool-consolidation calculator for the sales team.",
    },
    {
      value:
        "Deployed and live across 75+ locations — not a pilot, a proven platform.",
      resonance:
        "High trust signal for risk-averse buyers. Works especially well in regulated industries and with GCC enterprise buyers.",
      suggestion:
        "Build a reference architecture document for each industry vertical. Let prospects speak to a customer in their exact segment. Turn 75 into 100 as fast as possible — each new site adds credibility.",
    },
    {
      value:
        "Built for India and GCC — not a Western tool retrofitted for Asia.",
      resonance:
        "Strong resonance with Indian FM professionals who have been burned by expensive, complex Western platforms that don't map to local regulatory requirements.",
      suggestion:
        "Name specific regulations you handle that Western tools don't: Form 7 under Factories Act, NABH documentation requirements, Civil Defence UAE compliance. Make this explicit in every pitch.",
    },
    {
      value: "CAM billing automation — end the spreadsheet and the disputes.",
      resonance:
        "Directly solves a painful, recurring finance problem that competitors don't address. Immediate ROI is visible.",
      suggestion:
        "Develop a one-page ROI case study: 'Property X reduced CAM billing cycle from 12 days to 2 days and eliminated 100% of disputes.' Promote this as a standalone landing page for finance buyers.",
    },
    {
      value:
        "Tenant experience built in — loyalty, F&B, bookings, surveys in one place.",
      resonance:
        "Differentiated strongly from pure FM tools. Resonates with co-working operators and commercial RE developers competing for tenants.",
      suggestion:
        "Expand the loyalty programme narrative: 'Tenant loyalty reduces churn. Each 1% reduction in tenant attrition saves INR X in leasing costs.' Pilot a case study with a co-working operator.",
    },
    {
      value:
        "Safety first — PTW, MSafe, and Incident Management built into the platform.",
      resonance:
        "Resonates deeply with manufacturing, healthcare, and any regulated industry where safety compliance is audited externally.",
      suggestion:
        "Create a safety compliance bundle and brand it separately (e.g. 'FM Matrix SafeOps'). Market it directly to EHS Officers and Plant Heads — a different buyer persona than the FM Head.",
    },
    {
      value: "Marketplace model — extend the platform without switching tools.",
      resonance:
        "Early-stage resonance. Most buyers don't fully understand the value until they need an extension.",
      suggestion:
        "Shift the narrative from 'app store' to 'future-proof investment': 'As your needs grow, FM Matrix grows with you. Add Accounting, Lease Management, or Cloud Telephony without buying a new system.' Show the roadmap of coming extensions.",
    },
    {
      value:
        "ESG-ready — Green Inventory, Waste Management, Energy, and Water in one platform.",
      resonance:
        "Growing resonance as ESG reporting becomes mandatory in GCC and increasingly expected in India.",
      suggestion:
        "Build a dedicated ESG reporting output from the platform — a single downloadable report covering energy intensity, water consumption, waste recycled, and green inventory usage. Market this directly to sustainability officers and CFOs signing off on ESG disclosures.",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          FM MATRIX - FEATURES & PRICING
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Feature Comparison vs Market Standard | Section 2: Pricing
        Tiers by Segment
      </p>

      {/* Part A: Feature Comparison */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Part A: Current Features vs Market Standard
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Feature Area
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Market Standard
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Our Product
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Status vs Market
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Summary
              </th>
            </tr>
          </thead>
          <tbody>
            {featureComparison.map((f, i) => (
              <tr
                key={i}
                className={
                  f.status === "Ahead"
                    ? "bg-[#e2efda]"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#C4B89D]/50 p-2 font-medium text-[#2C2C2C] whitespace-nowrap">
                  {f.feature}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {f.market}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                  {f.ours}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-green-600 whitespace-nowrap">
                  {f.status}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {f.summary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part B: Pricing Landscape */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Part B: Current Pricing Market & Recommendations
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Customer Segment
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                India Pricing
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                GCC Pricing
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Market Notes
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Our Recommendation
              </th>
            </tr>
          </thead>
          <tbody>
            {pricingTiers.map((p, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-medium text-[#2C2C2C]">
                  {p.segment}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {p.india}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {p.gcc}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {p.notes}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {p.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part C: Positioning */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Part C: Positioning Strategy
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Positioning Dimension
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {positioningDimensions.map((pos, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-medium text-[#2C2C2C] whitespace-nowrap">
                  {pos.title}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {pos.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part D: Value Propositions */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Part D: Value Propositions & Improvements
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center whitespace-nowrap">
                Current Value Proposition
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                How It Resonates Today
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Concrete Suggestion to Sharpen or Expand It
              </th>
            </tr>
          </thead>
          <tbody>
            {valuePropositions.map((vp, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-medium text-[#2C2C2C] whitespace-nowrap">
                  {vp.value}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {vp.resonance}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 text-xs">
                  {vp.suggestion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// FM Matrix Business Plan Tab Component
const FMMatrixBusinessPlanTab: React.FC = () => {
  const planQuestions =
    productData.extendedContent?.detailedBusinessPlan?.planQuestions || [];
  const founderChecklist =
    productData.extendedContent?.detailedBusinessPlan?.founderChecklist || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          FM MATRIX - Business Plan Builder
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// GTM Tab for FM Matrix
const FMMatrixGTMTab: React.FC = () => {
  const gtmData = productData.extendedContent?.detailedGTM;
  const targetGroups = gtmData?.targetGroups || [];
  const masterSummary = gtmData?.masterSummary || [];

  const sectionLabels = [
    "SALES MOTION",
    "MARKETING CHANNELS",
    "90-DAY LAUNCH SEQUENCE",
    "PARTNERSHIP STRATEGY",
  ];

  const getSectionData = (tg: (typeof targetGroups)[0], sectionIdx: number) => {
    const sections = [
      tg.salesMotion,
      tg.marketingChannels,
      tg.launchSequence,
      tg.partnershipStrategy,
    ];
    return sections[sectionIdx];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          FM MATRIX — Go-To-Market Strategy
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        3 Target Groups | Each with: Sales Motion · Marketing Channels · 90-Day
        Launch Sequence · Partnership Strategy · TG Summary
      </p>

      {targetGroups.map((tg, tgIdx) => (
        <div key={tgIdx} className="space-y-4 mb-10">
          {/* TG Header */}
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
            {tg.title}
          </div>

          {/* Profile */}
          <div className="bg-[#DA7756]/10 border border-[#C4B89D]/50 px-4 py-3 text-[11px] font-poppins text-[#2C2C2C] leading-relaxed">
            <strong>Profile:</strong> {tg.profile}
          </div>

          {/* 4 Sections */}
          {sectionLabels.map((label, sIdx) => {
            const section = getSectionData(tg, sIdx);
            return (
              <div key={sIdx}>
                <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-2 font-semibold text-[11px] font-poppins">
                  {tgIdx + 1}.{sIdx + 1} &nbsp; {label}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[11px] font-poppins">
                    <thead>
                      <tr className="bg-[#F6F4EE]/70 text-[#DA7756] font-semibold">
                        {section.headers.map((h: string, i: number) => (
                          <th
                            key={i}
                            className="border border-[#C4B89D]/50 p-2 text-left align-top whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row: string[], i: number) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                        >
                          {row.map((cell: string, j: number) => (
                            <td
                              key={j}
                              className={`border border-[#C4B89D]/50 p-2 align-top leading-relaxed ${
                                j === 0
                                  ? "font-semibold text-[#2C2C2C] min-w-[120px]"
                                  : "text-[#2C2C2C]/80"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* TG Summary */}
          <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold text-[11px] font-poppins">
            TG SUMMARY
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-poppins">
              <tbody>
                {tg.summary.map(
                  (s: { label: string; value: string }, i: number) => (
                    <tr
                      key={i}
                      className={
                        i % 2 === 0 ? "bg-[#DA7756]/10" : "bg-[#FAF9F6]"
                      }
                    >
                      <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#DA7756] w-[22%] align-top">
                        {s.label}
                      </td>
                      <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 leading-relaxed align-top">
                        {s.value}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Cross-TG Master Summary */}
      <div className="bg-[#5c3317] text-white px-4 py-3 font-semibold text-sm font-poppins mt-4">
        CROSS-TG GTM MASTER SUMMARY — 90-Day Combined Targets
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <tbody>
            {masterSummary.map(
              (s: { label: string; value: string }, i: number) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-[#fdf3ec]" : "bg-white"}
                >
                  <td className="border border-[#e0c4b0] p-2 font-semibold text-[#5c3317] w-[22%] align-top">
                    {s.label}
                  </td>
                  <td className="border border-[#e0c4b0] p-2 text-[#2C2C2C]/80 leading-relaxed align-top">
                    {s.value}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Metrics Tab for FM Matrix
const FMMatrixMetricsTab: React.FC = () => {
  const metrics = productData.extendedContent?.detailedMetrics;
  const clientImpact = metrics?.clientImpact || [];
  const northStar = metrics?.northStar;
  const launchMetrics = metrics?.launchMetrics || [];

  const categoryColor: Record<string, string> = {
    Adoption: "bg-[#e2efda] text-[#375623]",
    Onboarding: "bg-[#DA7756]/10 text-[#DA7756]",
    Revenue: "bg-[#fce4d6] text-[#7b2c0d]",
    Retention: "bg-[#fff2cc] text-[#7d5a00]",
    "Growth Efficiency": "bg-[#ededed] text-[#404040]",
    "Unit Economics": "bg-[#f4ccff] text-[#5a006e]",
    Engagement: "bg-[#daeef3] text-[#1a5c6b]",
    "Customer Health": "bg-[#ffd7d7] text-[#7b0000]",
    "Expansion Revenue": "bg-[#e8f5e9] text-[#1b5e20]",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          FM MATRIX — Metrics & Impact Tracker
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Part A: 10 Client Impact Metrics (landing page proof points) | Part B:
        North Star Metric + 10 Launch Metrics with 30-day and 3-month targets
      </p>

      {/* PART A */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
        {metrics?.partATitle} — {metrics?.partASubtitle}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[3%]">
                #
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[12%]">
                Metric Name
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[10%]">
                What It Measures
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[12%]">
                Baseline (Before FM Matrix)
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[12%]">
                Impact Range (After FM Matrix)
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[13%]">
                Feature That Drives It
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[18%]">
                How the Impact Is Caused
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[20%]">
                Landing Page Proof Point
              </th>
            </tr>
          </thead>
          <tbody>
            {clientImpact.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                  {i + 1}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] align-top">
                  {m.metric}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 align-top leading-relaxed">
                  {m.whatItMeasures}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 align-top leading-relaxed">
                  {m.baseline}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#1f5c2e] font-semibold align-top leading-relaxed">
                  {m.impactRange}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#DA7756] align-top leading-relaxed">
                  {m.featureDrives}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 align-top leading-relaxed">
                  {m.howCaused}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#DA7756] font-semibold align-top leading-relaxed">
                  {m.landingPage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PART B — North Star */}
      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-6">
        {metrics?.partBTitle} — {metrics?.partBSubtitle}
      </div>

      {northStar && (
        <div className="border border-[#C4B89D]/50 rounded overflow-hidden">
          <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-2 font-semibold text-[12px] font-poppins">
            ⭐ NORTH STAR METRIC: {northStar.metric}
          </div>
          <div className="bg-[#DA7756]/10 px-4 py-3 text-[11px] font-poppins text-[#2C2C2C] leading-relaxed">
            <strong>Definition:</strong> {northStar.definition}
          </div>
          <div className="bg-[#FAF9F6] px-4 py-3 text-[11px] font-poppins text-[#2C2C2C]/80 leading-relaxed">
            <strong>Why this is the North Star:</strong> {northStar.why}
          </div>
        </div>
      )}

      {/* Launch Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[14%]">
                Metric
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[14%]">
                What It Measures
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[8%]">
                Category
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[16%]">
                30-Day Target (Current Launch)
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[16%]">
                3-Month Target (Current Launch)
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[16%]">
                30-Day Target (Post Phase 1)
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-left w-[16%]">
                3-Month Target (Post Phase 1)
              </th>
            </tr>
          </thead>
          <tbody>
            {launchMetrics.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] align-top">
                  {m.metric}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 align-top leading-relaxed">
                  {m.whatItMeasures}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center align-top">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${categoryColor[m.category] || "bg-[#eee] text-[#333]"}`}
                  >
                    {m.category}
                  </span>
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 align-top leading-relaxed">
                  {m.d30Current}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 align-top leading-relaxed">
                  {m.m3Current}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#1f5c2e] align-top leading-relaxed">
                  {m.d30Phase1}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#1f5c2e] align-top leading-relaxed">
                  {m.m3Phase1}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FacilityManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#F6F4EE] pb-20 select-none font-poppins transition-all duration-300">
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
            ref={tabsScrollRef}
            className="overflow-x-auto no-scrollbar mb-8"
          >
            <div className="flex justify-start pb-2 px-1">
              <TabsList className="inline-flex gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-full p-1.5 h-auto items-center justify-start">
                {productData.tabOrder.map((tabId) => (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-nowrap flex-shrink-0 bg-transparent"
                  >
                    {tabLabels[tabId]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6 animate-fade-in">
            <FMSummaryTab />
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6 animate-fade-in">
            <FMFeaturesTab />
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="market" className="space-y-6 animate-fade-in">
            <FMMarketAnalysisTab />
          </TabsContent>

          {/* Features & Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6 animate-fade-in">
            <FMFeaturesAndPricingTab />
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="usecases" className="space-y-6 animate-fade-in">
            <FMMatrixUseCasesTab
              industryUseCases={
                productData.extendedContent.detailedUseCases.industryUseCases
              }
              internalTeamUseCases={
                productData.extendedContent.detailedUseCases
                  .internalTeamUseCases
              }
              productName="FM Matrix"
            />
          </TabsContent>

          {/* SWOT Tab */}
          <TabsContent value="swot" className="space-y-6 animate-fade-in">
            <FMMatrixSWOTTab
              swotData={productData.extendedContent.swot}
              productName="FM Matrix"
            />
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6 animate-fade-in">
            <FMMatrixRoadmapTab
              roadmapData={productData.extendedContent.roadmap}
              productName="FM Matrix"
            />
          </TabsContent>

          {/* Business Plan Tab */}
          <TabsContent value="business" className="space-y-10">
            <FMMatrixBusinessPlanTab />
          </TabsContent>

          {/* GTM Tab */}
          <TabsContent value="gtm" className="space-y-6 animate-fade-in">
            <FMMatrixGTMTab />
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6 animate-fade-in">
            <FMMatrixMetricsTab />
          </TabsContent>

          {/* Placeholder Tabs */}
          {["assets"].map((tab) => (
            <TabsContent
              key={tab}
              value={tab}
              className="space-y-6 animate-fade-in"
            >
              <div className="bg-white border border-[#C4B89D] p-8 rounded-lg text-center">
                <p className="text-[#2C2C2C]/60 font-poppins">
                  {tabLabels[tab]} content coming soon
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default FacilityManagementPage;
