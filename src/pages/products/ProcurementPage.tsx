import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  FileText, 
  Monitor,
  Presentation,
  PlayCircle,
  TrendingUp,
  Briefcase
} from "lucide-react";

const procurementDetailedFeatures: ProductData["extendedContent"]["detailedFeatures"] = [
  {
    module: "Engineering / BOQ",
    feature: "* BOQ Management",
    subFeatures: "BOQ Create/Edit/Detail",
    description:
      "Create and maintain bills of quantity for items and works at project level.",
    works:
      "Engineers upload BOQ from design software or create manually. Each BOQ line has item code, description, unit, quantity, and rate. BOQ serves as the procurement baseline for MOR validation.",
    userType: "Project Engineer",
    usp: true,
  },
  {
    module: "Engineering / BOQ",
    feature: "* BOQ Management",
    subFeatures: "BOQ Bulk Upload",
    description: "Upload BOQ records in bulk from Excel templates.",
    works:
      "Standardized Excel template validates data before import. Bulk upload supports thousands of BOQ lines with error reporting and partial import support.",
    userType: "Project Engineer",
    usp: true,
  },
  {
    module: "Engineering / BOQ",
    feature: "* BOQ Management",
    subFeatures: "BOQ Amendment",
    description:
      "Amend existing BOQ entries with version tracking and approval.",
    works:
      "Amendment workflow captures reason, approver, and creates audit version. Original BOQ preserved for comparison. Changes trigger re-validation of open MORs against revised BOQ.",
    userType: "Project Manager",
    usp: false,
  },
  {
    module: "Engineering / BOQ",
    feature: "Rate Management",
    subFeatures: "Rate Create/Edit/Detail/Revision",
    description:
      "Maintain and revise item and work rates used in procurement and budgeting.",
    works:
      "Rate cards linked to materials and vendors. Revision history with effective date tracking. Historical rates displayed during MOR and RFQ for intelligent benchmarking.",
    userType: "Procurement Manager",
    usp: false,
  },
  {
    module: "Engineering / BOQ",
    feature: "* Budget Management",
    subFeatures: "Budget Create/Edit/Detail/List",
    description: "Create and manage project or material budgets.",
    works:
      "Budgets created at project, sub-project, or category level. Budget templates for standard project types. Budget linked to BOQ for engineering-driven baseline.",
    userType: "Finance Manager",
    usp: true,
  },
  {
    module: "Engineering / BOQ",
    feature: "* Budget Management",
    subFeatures: "Budget Comparison",
    description:
      "Compare budget against planned or actual procurement values.",
    works:
      "Dashboard shows budget vs actual with variance percentage. MOR values compared against budget at item and category level. Enables procurement to identify overspent areas before commitment.",
    userType: "Project Manager",
    usp: true,
  },
  {
    module: "Engineering / BOQ",
    feature: "* Budget Management",
    subFeatures: "Budget Validation",
    description:
      "Validate MOR and procurement values against available budget in real time.",
    works:
      "Real-time budget check runs at MOR creation. System blocks or escalates requests that exceed allocated budget. Finance can configure tolerance limits for each project and category.",
    userType: "Finance Manager",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* MOR Management",
    subFeatures: "MOR Create/List/Detail",
    description:
      "Create and manage Material Order Requests and indents for materials and services.",
    works:
      "Users raise MORs specifying material, quantity, delivery date, and project. MOR list shows status, pending approvals, and conversion to RFQ or PO. Detail view shows full lifecycle.",
    userType: "Site Engineer",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* MOR Management",
    subFeatures: "Detailed MOR Creation",
    description:
      "Capture material or service requirement with specs, UOM, qty, delivery schedule, and justification.",
    works:
      "Rich form captures technical specifications, preferred brand, delivery location, priority, and cost center. Mandatory fields enforced based on project configuration.",
    userType: "Site Engineer",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* MOR Management",
    subFeatures: "BOQ Item Selection",
    description:
      "Raise indent by selecting materials from BOQ master for validated procurement.",
    works:
      "Typeahead search on BOQ items. Selected items auto-populate UOM, specifications, and budget head. Ensures procurement is within approved scope.",
    userType: "Site Engineer",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* MOR Management",
    subFeatures: "Stock Visibility",
    description:
      "Show real-time stock visibility during MOR creation to avoid over-ordering.",
    works:
      "Live stock levels displayed while creating MOR. System suggests auto order quantity based on available stock across all stores. Prevents duplicate procurement.",
    userType: "Site Engineer",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* MOR Management",
    subFeatures: "Auto Order Quantity",
    description:
      "System-calculated order quantity based on Required Qty minus Available Stock.",
    works:
      "Net requirement auto-calculated by subtracting available stock from requested quantity. Users can override with justification. Reduces inventory accumulation.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* MOR Management",
    subFeatures: "Delivery Schedule Calculation",
    description:
      "Auto-calculate delivery schedule based on material lead time.",
    works:
      "Lead times maintained per material and vendor. System calculates expected delivery based on MOR date plus lead time. Procurement team uses this for schedule planning.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* MOR Management",
    subFeatures: "Bulk Operations",
    description:
      "Excel upload, copy MOR, and QR scan-based entry for high-volume demand creation.",
    works:
      "Bulk MOR via Excel template with row-level validation. Copy existing MOR for repeat orders. QR-based scan auto-fills material details from tag or label.",
    userType: "Site Engineer",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* MOR Management",
    subFeatures: "Approval/Return/Reject/Rework",
    description:
      "Review, approve, reject, or return requests with remarks and audit logging.",
    works:
      "Multi-level approval with configurable matrix. Approvers see full request details, budget status, and stock availability. Return and rework routes back to requester with comments.",
    userType: "Approving Authority",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* Workflow Control",
    subFeatures: "Approval Matrix",
    description:
      "Route MORs through configurable multi-level approval flows based on value, category, and project.",
    works:
      "Approval matrix based on value, category, project, or custom rules. Supports parallel and sequential flows. Auto-escalation on TAT breach with configurable reminders.",
    userType: "System Admin",
    usp: true,
  },
  {
    module: "Procurement / Demand Management",
    feature: "* Workflow Control",
    subFeatures: "Approval History/Audit Trail",
    description:
      "Track who approved, rejected, edited, or returned the request with timestamps.",
    works:
      "Complete audit trail with timestamp, user, action, and remarks. Immutable record for compliance. Available in MOR detail view and downloadable as PDF.",
    userType: "All Users",
    usp: true,
  },
  {
    module: "Internal Fulfilment",
    feature: "* Inventory Control",
    subFeatures: "Dead Stock Discovery",
    description:
      "Identify unused inventory across organization to reduce working capital locked in idle stock.",
    works:
      "System analyzes stock movement history and flags items with zero consumption over configurable period. Reports sorted by value show highest-priority dead stock for action.",
    userType: "Store Manager",
    usp: true,
  },
  {
    module: "Tendering",
    feature: "* RFQ Management",
    subFeatures: "RFQ Create/List/Detail",
    description:
      "Create and manage request-for-quotation events against approved requirements.",
    works:
      "RFQ generated from approved MORs. System suggests vendors based on category and history. RFQ captures scope, item list, evaluation criteria, and submission deadline.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Tendering",
    feature: "* RFQ Management",
    subFeatures: "Corrigendum Handling",
    description:
      "Modify RFQ after release with version control and vendor notification.",
    works:
      "Changes to published RFQ captured as corrigendum with version number. All invited vendors notified automatically. Submission deadline extended when corrigendum issued.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Tendering",
    feature: "* RFQ Management",
    subFeatures: "Bid Submission",
    description:
      "Allow vendors to submit quotations and bids through the vendor portal.",
    works:
      "Vendor portal for bid submission. Supports attachments, terms acceptance, and line-wise pricing. Vendor can save draft and submit before deadline.",
    userType: "Vendor",
    usp: true,
  },
  {
    module: "Tendering",
    feature: "* Bid Analytics",
    subFeatures: "Rate Standardization",
    description:
      "Normalize units, taxes, freight, and charges into comparable values for fair evaluation.",
    works:
      "System standardizes all bids to common UOM and applies tax normalization. Freight and insurance added per configured rules. Final comparable rate used for ranking.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Tendering",
    feature: "* Bid Analytics",
    subFeatures: "Landed Cost Calculation",
    description:
      "Auto-compute true cost including logistics, taxes, and other charges.",
    works:
      "Landed cost includes base price, freight, insurance, taxes, and other charges. Each component configurable per item or vendor. Total landed cost used as final evaluation price.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Tendering",
    feature: "* Bid Analytics",
    subFeatures: "Technical vs Commercial Split",
    description:
      "Evaluate bids in separate technical and commercial layers for comprehensive assessment.",
    works:
      "Two-envelope system where technical scores submitted before commercial bids are opened. Only technically qualified vendors advance to commercial comparison. Prevents price bias in technical evaluation.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Tendering",
    feature: "* Bid Analytics",
    subFeatures: "Non-L1 Justification Capture",
    description:
      "Record mandatory reasons for selecting other than L1 vendor with approval.",
    works:
      "System blocks PO creation if non-L1 vendor selected without justification. Buyer captures reason code and narrative. Finance or CPO approval required. Captured in audit trail.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Tendering",
    feature: "* Bid Analytics",
    subFeatures: "Reverse Auction",
    description:
      "Real-time dynamic price discovery with live bidding and automatic time extension.",
    works:
      "Live auction dashboard with bid history. Vendors see their rank without seeing competitor prices. Auto-time extension when bid placed in last 5 minutes. Price floor configurable.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Purchase Order",
    feature: "PO Management",
    subFeatures: "PO Domestic Create/Details",
    description:
      "Create domestic purchase orders and view their complete details.",
    works:
      "One-click PO generation from winning bid. Auto-populates vendor, items, rates, taxes, and delivery terms. PO detail shows all linked documents - MOR, RFQ, GRN, and invoices.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Purchase Order",
    feature: "PO Management",
    subFeatures: "PO Versioning",
    description:
      "Maintain version history for all PO changes for audit and dispute resolution.",
    works:
      "Each PO change creates a new version with timestamp and author. Version history accessible from PO detail. Original version preserved. Helps in vendor dispute resolution.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Purchase Order",
    feature: "PO Management",
    subFeatures: "PO Acceptance",
    description:
      "Capture vendor digital acceptance of purchase orders for binding confirmation.",
    works:
      "Vendor receives PO via portal and email. Digital acceptance captured with timestamp. PO becomes binding contract upon acceptance. Non-acceptance escalates to procurement team.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Security",
    feature: "* Gate Management",
    subFeatures: "Security Gate Pass List/Create/Details",
    description:
      "Create and manage gate passes for material movement authorization.",
    works:
      "Gate pass created by authorized personnel before material can exit premises. Pass captures material, quantity, destination, and validity. QR code generated for scanning at gate.",
    userType: "Security Personnel",
    usp: true,
  },
  {
    module: "Security",
    feature: "* Gate Management",
    subFeatures: "Material In Notification to Store",
    description:
      "Notify store teams when materials enter the site for timely GRN processing.",
    works:
      "Automatic notification sent to store keeper when gate entry is created for incoming material. Includes PO reference, material details, and expected quantity. Reduces GRN delay.",
    userType: "Security Personnel",
    usp: true,
  },
  {
    module: "Stores",
    feature: "* Inward Process",
    subFeatures: "Store GRN List/Create/Details",
    description:
      "Create goods received notes after verification of received items against PO.",
    works:
      "GRN against PO with quantity, quality, and photo verification. System matches received quantity with PO balance. GRN creates stock entry and triggers billing workflow.",
    userType: "Store Keeper",
    usp: true,
  },
  {
    module: "Stores",
    feature: "* Inward Process",
    subFeatures: "Store Material QC List/QC/Details",
    description:
      "Perform quality inspection on received materials and capture results.",
    works:
      "QC checklist based on material type. Pass, fail, or conditional acceptance with remarks. Photo evidence attached. Rejection slip auto-generated for failed materials.",
    userType: "QC Inspector",
    usp: true,
  },
  {
    module: "Stores",
    feature: "* Stock Control",
    subFeatures: "Stock Register Summary/Details",
    description:
      "Maintain live stock balances and movement history across all stores.",
    works:
      "Real-time stock visibility across all stores. FIFO/LIFO costing maintained. Movement history includes issue, return, transfer, and adjustment with user and document reference.",
    userType: "Store Manager",
    usp: true,
  },
  {
    module: "Stores",
    feature: "Inventory Control",
    subFeatures: "RFID/QR Tracking",
    description:
      "Track material lifecycle using RFID tags and QR scan-based identifiers.",
    works:
      "RFID tags for high-value items, QR codes for bulk materials. Mobile scanner app reads tags at each touchpoint. Full chain of custody from GRN to final issue to consumption.",
    userType: "Store Keeper",
    usp: true,
  },
  {
    module: "Billing & Payment",
    feature: "Bill Processing",
    subFeatures: "Bill Verification List/Verification/Details",
    description:
      "Verify bills against received documents and transactions before booking.",
    works:
      "Verification team checks invoice against GRN quantity and quality status. Deviations flagged for resolution. Vendor bill verified only when all conditions met.",
    userType: "Accounts Payable",
    usp: true,
  },
  {
    module: "Billing & Payment",
    feature: "Invoice Controls",
    subFeatures: "3-Way Matching",
    description:
      "Validate PO vs GRN vs Invoice for automated discrepancy detection.",
    works:
      "Automated 3-way match with configurable tolerance. PO price, GRN quantity, and invoice amount compared. Mismatches flagged and blocked from payment until resolved.",
    userType: "Accounts Payable",
    usp: true,
  },
  {
    module: "Billing & Payment",
    feature: "* Advance Management",
    subFeatures: "PO Advance List/Create/Approval/Details",
    description:
      "Create and approve PO advances for vendor mobilization and procurement.",
    works:
      "Advance percentage configurable by vendor category. Approval required from finance. Advance note created after PO acceptance. Advance amount tracked per PO.",
    userType: "Finance Manager",
    usp: true,
  },
  {
    module: "Billing & Payment",
    feature: "* Payment Processing",
    subFeatures: "Bill Payment List/Bill Payment/Details",
    description:
      "Manage bill payment processing and payment status for all vendor liabilities.",
    works:
      "Payment queue with priority and due date. Batch payment processing for efficiency. Payment execution via bank transfer, RTGS, NEFT, or cheque. Status tracking post-payment.",
    userType: "Treasury",
    usp: true,
  },
  {
    module: "Audit, Control & Intelligence",
    feature: "* Traceability",
    subFeatures: "End-to-End Traceability",
    description:
      "Complete MOR to RFQ to PO to GRN to Invoice mapping for full procurement lifecycle.",
    works:
      "Single view shows complete procurement chain for any demand. Click-through from invoice to source MOR with all intermediate documents. Supports legal, audit, and management review.",
    userType: "Auditor",
    usp: true,
  },
  {
    module: "Audit, Control & Intelligence",
    feature: "* Traceability",
    subFeatures: "Action Logs",
    description:
      "Track all user and system actions across the platform with immutable timestamps.",
    works:
      "Every create, update, delete, and approval logged with user ID, timestamp, action type, and changed values. Log cannot be edited. Available for audit team review at any time.",
    userType: "Auditor",
    usp: true,
  },
  {
    module: "Audit, Control & Intelligence",
    feature: "Analytics",
    subFeatures: "Spend Analysis",
    description:
      "Vendor-wise and category-wise spend analysis for strategic sourcing intelligence.",
    works:
      "Spend dashboard shows vendor contribution, category breakdown, and project-wise spend. Trend comparison across periods. Identifies concentration risk and savings opportunity.",
    userType: "Procurement Head",
    usp: false,
  },
  {
    module: "Master Setup",
    feature: "* Organization Setup",
    subFeatures: "Organization/Company",
    description:
      "Maintain organization and company structure for procurement routing, approvals, and controls.",
    works:
      "Admin defines company hierarchy in settings. System uses this to route approvals, segment reports, and enforce access controls across all procurement transactions.",
    userType: "System Admin",
    usp: true,
  },
  {
    module: "Master Setup",
    feature: "* Project Structure",
    subFeatures: "Project/Sub-Project/Wing/Floor",
    description:
      "Define the project hierarchy used across procurement, stores, approvals, and billing.",
    works:
      "Project managers create hierarchical structures using a tree-based setup. All MORs, POs, GRNs, and bills are tagged to these nodes for traceability and budget tracking.",
    userType: "Project Manager",
    usp: true,
  },
  {
    module: "Master Setup",
    feature: "* User Administration",
    subFeatures: "User/Group/Role/Department/Designation",
    description:
      "Configure users and permission structures for workflow access and governance.",
    works:
      "Role-based access control with granular permissions. Users are assigned to departments and roles that determine what modules, actions, and data they can access.",
    userType: "System Admin",
    usp: true,
  },
  {
    module: "Master Setup",
    feature: "* Material Masters",
    subFeatures: "Material Type/Sub-Type/Material Brand/Material",
    description:
      "Create and manage standardized material masters used in MOR, RFQ, PO, GRN, and stock.",
    works:
      "Central material library with specifications, brand options, and approved supplier list. Users select from master to ensure standardization and prevent duplicate entries.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Reporting & Control",
    feature: "* Dashboards",
    subFeatures: "Procurement/Vendor/Stock/Payment Dashboards",
    description:
      "Provide status visibility across the complete procurement flow in real time.",
    works:
      "Role-specific dashboards show pending approvals, open POs, stock levels, and payment status. Drill-down to transaction detail. Configurable widget layout per user preference.",
    userType: "All Users",
    usp: true,
  },
  {
    module: "Reporting & Control",
    feature: "* Audit",
    subFeatures: "Audit Trail/History",
    description:
      "Record all actions for compliance, accountability, and regulatory reporting.",
    works:
      "Immutable audit log accessible to compliance team. Filterable by module, user, date, and action type. Export for external audit use. Tamper-proof with hash verification.",
    userType: "Auditor",
    usp: true,
  },
  {
    module: "Reporting & Control",
    feature: "* Alerts",
    subFeatures: "Email/WhatsApp/SMS Alerts",
    description:
      "Send alerts on approvals, bids, receipts, QC, bills, and payments via multiple channels.",
    works:
      "Configurable alert rules per event type. Alerts include transaction summary and direct portal link. WhatsApp Business API, SMTP email, and SMS gateway supported. Delivery confirmation tracked.",
    userType: "All Users",
    usp: true,
  },
  {
    module: "Integrations",
    feature: "* Vendor",
    subFeatures: "Vendor Onboarding and Master Management",
    description:
      "Centralized vendor master setup with invitation, registration, approval, compliance validation, re-KYC, and profile maintenance.",
    works:
      "Vendor invited via email with registration link. Self-registration form captures GST, PAN, bank details, and compliance documents. Admin reviews and approves. Re-KYC triggered annually or on compliance expiry.",
    userType: "Procurement Manager",
    usp: true,
  },
  {
    module: "Integrations",
    feature: "* Vendor",
    subFeatures: "Vendor Engagement and Transaction Management",
    description:
      "End-to-end vendor interaction covering quotations, bids, revised bids, PO acceptance, invoice upload, payment tracking, and performance feedback.",
    works:
      "Vendor portal provides single window for all interactions. Vendors submit bids, acknowledge POs, upload invoices, and track payment status. Performance feedback collected post-delivery for scoring.",
    userType: "Vendor",
    usp: true,
  },
];

const procurementMarketSizeRows = [
  ["Global Procurement Software Market", "USD 10.06 Billion", "USD 11.14 Billion", "USD 21.29 Billion"],
  ["Global P2P Software Market", "USD 9.42 Billion", "USD 10.30 Billion", "USD 18.50 Billion"],
  ["India Procurement Software Market", "USD 0.85 Billion", "USD 0.98 Billion", "USD 2.10 Billion"],
  ["Global CAGR (2025-2033)", "10.0%", "-", "-"],
  ["India CAGR (2025-2030)", "15.2%", "-", "-"],
  ["Enterprise Adoption Rate - India", "Less than 15%", "18%", "35%"],
];

const procurementCompetitorRows = [
  ["1", "SAP Ariba", "Germany", "Large Enterprises, MNCs", "Global supplier network with 5M+ vendors; Deep ERP integration; Joule AI assistant for procurement insights", "High implementation cost (INR 1-3 Cr); Complex setup requiring certified consultants; 12-18 month deployment", "INR 15,000-45,000 per user/month", "USD 150-500 per user/month", "Tata Steel, Reliance Industries, Infosys", "High"],
  ["2", "Coupa", "USA", "Data-driven Enterprises", "Navi multi-agent AI; Real-time spend intelligence; No-code AI agent setup; Strong analytics", "Premium pricing excludes SMBs; Limited India-specific compliance features; Requires data maturity", "INR 20,000-50,000 per user/month", "USD 200-600 per user/month", "Nestle India, Unilever, Wipro", "High"],
  ["3", "Oracle Procurement Cloud", "USA", "Large Enterprises", "Unified cloud ERP; AI-based invoice matching; Supplier scorecards; Global scalability", "Expensive licensing (USD 500-625/user/month); Complex for mid-market; Long implementation cycles", "INR 40,000-55,000 per user/month", "USD 500-625 per user/month", "L&T, Bajaj Auto, ONGC", "High"],
  ["4", "Zycus", "India", "Audit-heavy Enterprises", "Indian-origin with global presence; Merlin AI suite; Microsoft Teams integration; Leader in Gartner MQ 2026", "Enterprise-only focus; Higher learning curve; Premium pricing for full suite", "INR 8,000-25,000 per user/month", "USD 100-300 per user/month", "HDFC Bank, Mahindra, ITC", "High"],
  ["5", "GEP SMART", "USA", "Direct and Indirect Spend", "Unified S2P platform; AI-powered scalability; Strong contract management; Good India presence", "Complex for smaller organizations; Requires significant change management; Higher total cost", "INR 12,000-35,000 per user/month", "USD 150-400 per user/month", "Asian Paints, Godrej, HCL", "Medium"],
  ["6", "Jaggaer", "USA", "Manufacturing, Education", "AI-driven insights; Strong supplier relationship management; Strategic sourcing tools; UK government approved", "Limited India localization; Complex pricing structure; Less known in India market", "INR 10,000-30,000 per user/month", "USD 120-350 per user/month", "Maruti Suzuki, Apollo Hospitals", "Medium"],
  ["7", "TCS iON Procurement", "India", "Government, PSUs", "Tata brand trust; Pre-built compliance templates; Strong public sector presence; Local support", "Less suitable for private sector; Limited innovation pace; Dated user interface", "INR 5,000-15,000 per user/month", "USD 60-180 per user/month", "NTPC, BHEL, State Governments", "Medium"],
  ["8", "Moglix/Cognilix", "India", "Manufacturing, MRO", "B2B marketplace integration; AI procurement platform; Strong supply chain expertise; Funded unicorn", "Focus on indirect/MRO spend; Less customizable workflows; Platform dependency", "INR 3,000-12,000 per user/month", "USD 40-150 per user/month", "Jindal Steel, Vedanta, Hindalco", "Medium"],
  ["9", "TYASuite", "India", "SMEs, Growing Enterprises", "Affordable pricing; GST-compliant; Automated 3-way matching; Quick deployment (4-6 weeks)", "Limited enterprise features; Smaller vendor ecosystem; Basic reporting capabilities", "INR 800-3,000 per user/month", "USD 10-40 per user/month", "SME Manufacturing Clusters", "Low"],
  ["10", "Kissflow Procurement", "India", "Fast-moving SMBs", "No-code platform; Rapid deployment (days); Clean mobile interface; Low learning curve", "Limited sourcing depth; Basic analytics; Not suitable for complex procurement", "INR 1,500-5,000 per user/month", "USD 20-60 per user/month", "D2C Brands, Startups", "Low"],
];

const procurementIndustryRows = [
  ["1", "Real Estate and Construction (Real Estate Development)", "USD 850 Billion", "12%", "BOQ management, material tracking, vendor compliance, milestone billing"],
  ["2", "Manufacturing", "USD 420 Billion", "22%", "MRO procurement, supplier quality, inventory optimization, production planning"],
  ["3", "Infrastructure and EPC (EPEC)", "USD 180 Billion", "18%", "Project-based procurement, equipment tracking, subcontractor management"],
  ["4", "Government and PSUs (Tenants)", "USD 150 Billion", "25%", "GeM compliance, tender management, audit trails, transparency"],
  ["5", "Logistics and Warehousing", "USD 95 Billion", "15%", "Fleet procurement, spare parts, vendor SLAs, cost optimization"],
  ["6", "Healthcare and Pharma", "USD 85 Billion", "20%", "Regulatory compliance, cold chain, vendor qualification, batch tracking"],
  ["7", "Retail and FMCG (Retail Chain)", "USD 75 Billion", "28%", "Supplier diversity, demand forecasting, seasonal procurement, private labels"],
  ["8", "Energy and Utilities (EPEC)", "USD 65 Billion", "16%", "Capital equipment, maintenance contracts, safety compliance, asset lifecycle"],
  ["9", "IT /ITES", "USD 55 Billion", "35%", "Software licensing, hardware refresh, vendor consolidation, SaaS management"],
  ["10", "Education", "USD 25 Billion", "8%", "Annual procurement, lab equipment, furniture, uniform and stationery"],
];

const procurementStructuredRoadmap = [
  {
    timeframe: "PHASE 1: FOUNDATION (Q2 2026 - Q4 2026)",
    headline: "Foundation",
    colorContext: "red",
    phaseDescription:
      "Three-phase development plan with feature releases, market segments, and projected revenue impact",
    summary:
      "PHASE 1 SUMMARY: 10 features | Segments: SMBs, Mid-Market, Manufacturing, Healthcare | Estimated Revenue Impact: INR 7-10 Cr ARR",
    items: [
      {
        featureName: "Mobile App Launch",
        theme: "MOR Management",
        whatItIs:
          "Full-featured mobile app for MOR creation, approvals, and tracking with offline sync capability",
        unlockedSegment: "Site Engineers, Field Teams",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 2-3 Cr ARR",
        estTimeline: "In Development",
      },
      {
        featureName: "Advanced Spend Analytics",
        theme: "Intelligence",
        whatItIs:
          "AI-powered spend categorization, trend analysis, and savings opportunity identification dashboard",
        unlockedSegment: "Procurement Heads, CFOs",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 1.5-2 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Vendor Rating Automation",
        theme: "Vendor Portal",
        whatItIs:
          "Auto-calculated vendor scores based on delivery, quality, and compliance metrics",
        unlockedSegment: "All Segments",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 50-80 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "WhatsApp Integration",
        theme: "Notifications",
        whatItIs:
          "Approval notifications and status updates via WhatsApp Business API",
        unlockedSegment: "SMBs, Field Teams",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 30-50 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "GST Return Filing Support",
        theme: "Billing",
        whatItIs:
          "Auto-generation of GSTR-2A reconciliation reports from invoice data",
        unlockedSegment: "Finance Teams",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 80 L-1 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Multi-Currency Support",
        theme: "PO Management",
        whatItIs:
          "Support for USD, EUR, GBP with real-time exchange rate integration",
        unlockedSegment: "Exporters, MNCs",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 60-80 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Tally Integration",
        theme: "Billing",
        whatItIs:
          "Two-way sync with Tally ERP for voucher posting and ledger reconciliation",
        unlockedSegment: "SMBs, Mid-Market",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 1-1.5 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Contract Templates Library",
        theme: "Service Contract",
        whatItIs:
          "Pre-built contract templates for common procurement scenarios with clause bank",
        unlockedSegment: "Legal, Procurement",
        effort: "",
        owner: "",
        priority: "Low",
        revenueImpact: "INR 20-30 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Bulk PO Amendment",
        theme: "PO Management",
        whatItIs:
          "Process multiple PO amendments in single workflow for rate revisions",
        unlockedSegment: "Manufacturing",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 25-40 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Enhanced QC Checklists",
        theme: "Stores",
        whatItIs:
          "Configurable quality inspection checklists with photo capture and defect categorization",
        unlockedSegment: "Manufacturing, Healthcare",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 40-60 L ARR",
        estTimeline: "Planned",
      },
    ],
  },
  {
    timeframe: "PHASE 2: INTELLIGENCE (Q1 2027 - Q3 2027)",
    headline: "Intelligence",
    colorContext: "yellow",
    summary:
      "PHASE 2 SUMMARY: 10 features | Segments: Enterprise, EPC, Infrastructure, MNCs | Estimated Revenue Impact: INR 8-12 Cr ARR",
    items: [
      {
        featureName: "AI Demand Forecasting",
        theme: "Intelligence",
        whatItIs:
          "Machine learning model predicting material requirements based on historical patterns and project schedules",
        unlockedSegment: "Manufacturing, Construction",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 2-3 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Predictive Vendor Risk",
        theme: "Intelligence",
        whatItIs:
          "Early warning system for vendor financial health, compliance risks, and delivery issues",
        unlockedSegment: "Enterprise, EPC",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 1.5-2 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Natural Language Search",
        theme: "Reporting",
        whatItIs:
          "Query procurement data using conversational language instead of filters",
        unlockedSegment: "All Segments",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 50-80 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Automated Contract Renewal",
        theme: "Service Contract",
        whatItIs:
          "Auto-generate renewal reminders and draft contracts based on expiring agreements",
        unlockedSegment: "IT, Facilities",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 40-60 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Supplier Collaboration Hub",
        theme: "Vendor Portal",
        whatItIs:
          "Real-time collaboration workspace for RFQ discussions, clarifications, and document sharing",
        unlockedSegment: "EPC, Infrastructure",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 1-1.5 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Budget Reforecasting",
        theme: "Budget Management",
        whatItIs:
          "Rolling budget updates based on actual spend patterns and project progress",
        unlockedSegment: "Real Estate, Infrastructure",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 60-80 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Offline-First Mobile",
        theme: "MOR Management",
        whatItIs:
          "Full functionality without internet with automatic sync when connectivity restored",
        unlockedSegment: "Remote Sites, Tier-2/3",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 80 L-1 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Invoice OCR Processing",
        theme: "Billing",
        whatItIs:
          "Automatic data extraction from scanned invoices using AI-powered OCR",
        unlockedSegment: "All Segments",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 1-1.5 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Power BI Connector",
        theme: "Reporting",
        whatItIs:
          "Native integration with Power BI for advanced visualization and custom dashboards",
        unlockedSegment: "Enterprise",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 40-60 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Sustainability Tracking",
        theme: "Intelligence",
        whatItIs:
          "Track carbon footprint and sustainability metrics for procurement decisions",
        unlockedSegment: "MNCs, ESG-focused",
        effort: "",
        owner: "",
        priority: "Low",
        revenueImpact: "INR 30-50 L ARR",
        estTimeline: "Planned",
      },
    ],
  },
  {
    timeframe: "PHASE 3: SCALE (Q4 2027 - Q2 2028)",
    headline: "Scale",
    colorContext: "green",
    summary:
      "PHASE 3 SUMMARY: 10 features | Segments: Government, Global Markets, System Integrators | Estimated Revenue Impact: INR 16-25 Cr ARR",
    items: [
      {
        featureName: "Multi-Language Interface",
        theme: "Core Platform",
        whatItIs:
          "Support for Hindi, Tamil, Telugu, Marathi, Gujarati, and Bengali languages",
        unlockedSegment: "Tier-2/3 Markets, PSUs",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 2-3 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "White-Label Solution",
        theme: "Core Platform",
        whatItIs: "Customizable branding for large enterprises and channel partners",
        unlockedSegment: "System Integrators",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 3-5 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Marketplace Integration",
        theme: "Vendor Portal",
        whatItIs:
          "Connect with B2B marketplaces like IndiaMART, TradeIndia for vendor discovery",
        unlockedSegment: "SMBs, Procurement",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 1-1.5 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "GeM Portal Integration",
        theme: "Strategic Sourcing",
        whatItIs:
          "Direct integration with Government e-Marketplace for PSU procurement",
        unlockedSegment: "Government, PSUs",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 2-3 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Blockchain Audit Trail",
        theme: "Audit",
        whatItIs:
          "Immutable blockchain-based transaction recording for enhanced compliance",
        unlockedSegment: "Regulated Industries",
        effort: "",
        owner: "",
        priority: "Low",
        revenueImpact: "INR 50-80 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "AR-Assisted Inventory",
        theme: "Stores",
        whatItIs:
          "Augmented reality for warehouse navigation and material identification",
        unlockedSegment: "Large Warehouses",
        effort: "",
        owner: "",
        priority: "Low",
        revenueImpact: "INR 30-50 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Voice-Enabled Operations",
        theme: "MOR Management",
        whatItIs:
          "Voice commands for MOR creation and approval actions using regional languages",
        unlockedSegment: "Field Workers",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 40-60 L ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Advanced API Platform",
        theme: "Core Platform",
        whatItIs:
          "Public API marketplace with pre-built connectors for 50+ enterprise systems",
        unlockedSegment: "Enterprise, SI Partners",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 1.5-2 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Autonomous Procurement",
        theme: "Intelligence",
        whatItIs:
          "AI agents executing routine procurement decisions within defined parameters",
        unlockedSegment: "High-Volume Procurement",
        effort: "",
        owner: "",
        priority: "Medium",
        revenueImpact: "INR 2-3 Cr ARR",
        estTimeline: "Planned",
      },
      {
        featureName: "Global Compliance Engine",
        theme: "Core Platform",
        whatItIs:
          "Tax and regulatory compliance for Singapore, UAE, US, UK markets",
        unlockedSegment: "Global Expansion",
        effort: "",
        owner: "",
        priority: "High",
        revenueImpact: "INR 3-5 Cr ARR",
        estTimeline: "Planned",
      },
    ],
  },
  {
    timeframe:
      "PHASE 0 (P0): UPCOMING FEATURES - INTERNAL FULFILMENT / MTO AND SERVICE CONTRACT / WORK ORDER",
    headline: "Upcoming (P0)",
    colorContext: "blue",
    summary:
      "PHASE 0 SUMMARY: 28 features | Modules: Internal Fulfilment/MTO and Service Contract/Work Order | Status: Upcoming - Scheduled before P1 release",
    items: [
      {
        featureName: "MTO Pending Approval List/Approval/Details",
        theme: "Internal Fulfilment / MTO",
        whatItIs:
          "Approve or process material transfer orders between sites, sub-projects, or companies.",
        unlockedSegment: "All Construction and Multi-Site Projects",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "Cross Project Transfer",
        theme: "Internal Fulfilment / MTO",
        whatItIs:
          "Transfer material across projects, sites, or companies with full traceability and inter-company settlement.",
        unlockedSegment: "EPC, Infrastructure, Real Estate",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "Create PO for MTO",
        theme: "Internal Fulfilment / MTO",
        whatItIs:
          "Create purchase orders for material transfer requirements where inter-company procurement is needed.",
        unlockedSegment: "Manufacturing, EPC",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "Inter-Company Transfer",
        theme: "Internal Fulfilment / MTO",
        whatItIs:
          "Support company-to-company material movement with settlement and accounting entries.",
        unlockedSegment: "Groups, Holding Companies",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "Sale Invoice for Company Transfer",
        theme: "Internal Fulfilment / MTO",
        whatItIs:
          "Create sale invoice for inter-company stock movement to maintain GST compliance.",
        unlockedSegment: "All Segments with Group Companies",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "Partial Fulfilment Logic",
        theme: "Internal Fulfilment / MTO",
        whatItIs:
          "Combine stock issue and procurement to satisfy demand when available stock covers only partial requirement.",
        unlockedSegment: "Manufacturing, Construction",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "Multi-MTO Handling",
        theme: "Internal Fulfilment / MTO",
        whatItIs:
          "Create multiple transfer orders against a single demand for split supply scenarios.",
        unlockedSegment: "EPC, Infrastructure",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Creation/List/Detail/Edit",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Create and maintain service indent records for service-based procurement requirements.",
        unlockedSegment: "Real Estate, Construction, EPC",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Type of Contract",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Classify the type of service contract - lump sum, rate-based, or item-rate for correct billing treatment.",
        unlockedSegment: "EPC, Infrastructure",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Status of WorkFront/SI Status of Work",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Track workfront progress and work execution status for service contracts in real time.",
        unlockedSegment: "Construction, Real Estate",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Work Category Multi Selection",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Select multiple work categories for a single service indent to cover composite scope.",
        unlockedSegment: "EPC, Construction",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Create BOQ for Services (Activity)",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Build BOQ lines for service activity-based work within the service indent.",
        unlockedSegment: "Real Estate, Infrastructure",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Scope of Work",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Capture detailed scope definition for service orders with measurable deliverables.",
        unlockedSegment: "All Service Procurement Segments",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Special Condition for Contract",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Store special contractual conditions specific to service contracts such as penalty clauses and bonus terms.",
        unlockedSegment: "EPC, Large Contractors",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Retention Detail Page",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Maintain retention terms including percentage, release conditions, and DLP period for service contracts.",
        unlockedSegment: "EPC, Infrastructure, Real Estate",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Other Details Page",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Capture other contract-specific details including insurance, safety, and statutory requirements.",
        unlockedSegment: "Construction, EPC",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Contractor/Consultant Detail Page",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Maintain contractor or consultant details including license, insurance, and compliance documents.",
        unlockedSegment: "All Service Procurement Segments",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI EMD Cheque/BG Details",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Capture earnest money deposit, cheque, and bank guarantee details for service contracts.",
        unlockedSegment: "Government, EPC, Infrastructure",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Discount Type",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Configure discount type and applicable discount percentage for service contracts.",
        unlockedSegment: "All Service Procurement Segments",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI WO Currency Type",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Capture currency type for work orders to support multi-currency service contracts.",
        unlockedSegment: "MNCs, Cross-Border Projects",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Work Order Type",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Define work order type for classification and appropriate billing treatment.",
        unlockedSegment: "All Service Procurement Segments",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Budget Setup",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Link service indent with budget setup for financial control and approval routing.",
        unlockedSegment: "Real Estate, EPC",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI BOQ",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Manage BOQ lines for service indent with quantity, rate, and activity-based billing.",
        unlockedSegment: "Construction, Infrastructure",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Variation",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Manage variations to service scope or quantity with approval and cost impact capture.",
        unlockedSegment: "EPC, Real Estate",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Amendment",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Amend service indent records for scope, quantity, or rate changes with version control.",
        unlockedSegment: "All Service Procurement Segments",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "SI Approval Management",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Approve service indent records through configurable multi-level approval workflow.",
        unlockedSegment: "EPC, Infrastructure, Real Estate",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "WO Creation/Edit/Details/Amendment",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Create and manage work orders with scope, rates, milestones, and contractual terms.",
        unlockedSegment: "Construction, EPC, Infrastructure",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
      {
        featureName: "WO Approval Management",
        theme: "Service Contract / Work Order",
        whatItIs:
          "Route work orders through approval workflow with value-based escalation.",
        unlockedSegment: "All Service Procurement Segments",
        effort: "",
        owner: "",
        priority: "P0",
        estTimeline: "Upcoming",
      },
    ],
  },
] as NonNullable<ProductData["extendedContent"]["detailedRoadmap"]>["structuredRoadmap"];

const procurementBusinessPlanQuestions: NonNullable<
  ProductData["extendedContent"]["detailedBusinessPlan"]
>["planQuestions"] = [
  {
    id: "Q1",
    question: "Q1: WHAT PROBLEM ARE YOU SOLVING AND FOR WHOM?",
    answer:
      "We solve the 25-35% cost overrun problem in procurement for organizations in real estate, construction, manufacturing, EPC, infrastructure, and logistics - industries where procurement is complex, multi-site, and involves thousands of vendor interactions. Our platform digitizes the complete procure-to-pay lifecycle across 14 modules: from Material Order Requests with real-time stock visibility and auto-trigger replenishment, through RFQ and reverse auctioning, landed cost comparison and L1/L2/L3 ranking, to PO management, gate entry tracking, GRN and QC inspection, 3-way invoice matching, and payment processing with GST/e-invoicing compliance. The platform uniquely integrates BOQ-linked procurement validation, ensuring every purchase is within approved engineering scope and budget. Manual processes cause 60+ day procurement cycles, duplicate vendor payments, unauthorized material substitution, and zero visibility into whether materials on site match what was ordered. We eliminate all of these simultaneously.",
    source:
      "Product Summary Tab (Problem Statement, Target Users); Market Analysis Tab (India Market Size, Adoption Rate)",
    flag: "Ready to use as-is",
  },
  {
    id: "Q2",
    question: "Q2: WHAT IS YOUR UNIQUE VALUE PROPOSITION?",
    answer:
      "We are the only India-built procure-to-pay platform with native GST/TDS/e-invoicing compliance, BOQ-linked procurement validation (every MOR checked against engineering bill of quantities before approval), Auto-trigger MOR (stock reorder automation without manual intervention), Gate Management with material-in notification to stores, RFID/QR material lifecycle tracking from warehouse to site, Non-L1 justification capture for governance, Dead stock discovery and tagging to reduce idle inventory, Reverse auction with proxy bidding for price discovery, and Landed cost calculation ensuring true cost comparison across vendors. P0 roadmap adds Internal Fulfilment/MTO for cross-project material transfers and Service Contract/Work Order module for complete service procurement governance. Compared to SAP Ariba at INR 15,000-45,000/user/month, we deliver superior India-specific functionality at INR 2,500-15,000/user/month with 4-6 week deployment versus 12-18 months.",
    source:
      "Feature List Tab (USP Features); Features and Pricing Tab (AHEAD differentiators); Market Analysis Tab (Competitor Pricing)",
    flag: "Ready to use as-is",
  },
  {
    id: "Q3",
    question: "Q3: HOW BIG IS YOUR MARKET?",
    answer:
      "The global procurement software market is USD 10.06 billion in 2025, growing to USD 21.29 billion by 2033 at 10% CAGR. India specifically represents USD 850 million in 2025, growing at 15.2% CAGR to reach USD 2.1 billion by 2030. Our primary target - Real Estate and Construction sector alone is USD 850 billion in India with only 12% procurement software adoption. Manufacturing (USD 420B, 22% adoption) and Infrastructure/EPC (USD 180B, 18% adoption) are secondary targets.",
    source:
      "Market Analysis Tab (Section 1: Market Size, Section 3: Target Industries)",
    flag: "Ready to use as-is",
  },
  {
    id: "Q4",
    question: "Q4: WHO ARE YOUR COMPETITORS AND HOW DO YOU DIFFERENTIATE?",
    answer:
      "Global leaders include SAP Ariba (INR 15,000-45,000/user/month), Coupa (INR 20,000-50,000/user/month), and Oracle (INR 40,000-55,000/user/month) - all priced out of reach for mid-market India. Indian players like Zycus focus on enterprise-only, while TYASuite and Kissflow lack depth for construction. We differentiate through 6 AHEAD features: native GST/TDS engine, BOQ-linked procurement, auto-trigger MOR, RFID/QR tracking, construction project hierarchy, and budget validation. We price at INR 2,500-15,000/user/month for the underserved mid-market.",
    source:
      "Market Analysis Tab (Competitor Analysis); Features and Pricing Tab (Feature Comparison Matrix, Pricing Landscape)",
    flag: "Ready to use as-is",
  },
  {
    id: "Q5",
    question: "Q5: WHAT IS YOUR GO-TO-MARKET STRATEGY?",
    answer:
      "Three-segment approach: (1) Real Estate Developers - partner with architect and MEP consultants who specify our BOQ module during project design, (2) Manufacturing Plants - land-and-expand through MRO procurement pain point with auto-replenishment, then expand to direct materials, (3) EPC Contractors - target project management offices with multi-site visibility pitch. Key channels include industry association partnerships (CREDAI, CII), digital marketing to procurement professionals on LinkedIn, and channel partnerships with construction ERP vendors like Realx and NYGGS.",
    source:
      "GTM Strategy Tab (to be detailed); Use Cases Tab (Industry workflows); Market Analysis Tab (Target Industries)",
    flag:
      "Requires founder input - validate partnership feasibility with CREDAI and specific SI partners",
  },
  {
    id: "Q6",
    question: "Q6: WHAT IS YOUR REVENUE MODEL AND PRICING?",
    answer:
      "SaaS subscription model with three tiers: Starter (INR 2,500-4,000/user/month for SMBs up to 25 users), Professional (INR 4,000-8,000/user/month for mid-market 25-100 users), Enterprise (INR 8,000-15,000/user/month for 100+ users). Implementation services charged separately at INR 5-15 lakhs depending on complexity. Target unit economics: CAC of INR 50,000-80,000, LTV of INR 3-5 lakhs, LTV/CAC ratio of 4-6x. Annual contracts preferred for predictability.",
    source: "Features and Pricing Tab (Section 3: Pricing Landscape)",
    flag:
      "Requires founder input - confirm actual CAC/LTV data from existing customers",
  },
  {
    id: "Q7",
    question: "Q7: WHAT IS YOUR PRODUCT ROADMAP?",
    answer:
      "P0 Upcoming (before Q2 2026): Internal Fulfilment/MTO module (cross-project transfer, inter-company material movement, sale invoice for transfers, partial fulfilment logic, multi-MTO handling) and Service Contract/Work Order module (SI creation, scope of work, retention, BOQ for services, WO creation/approval, contractor details, EMD and BG capture). Phase 1 (Q2 2026 - Q4 2026): Mobile App Launch (full MOR and approval workflows on mobile), Advanced Spend Analytics (AI-powered categorization and savings tracking), GST Return Filing Support (GSTR-2A reconciliation), Tally Integration (two-way sync for voucher posting), WhatsApp Integration (approval workflows via WhatsApp Business API), Vendor Rating Automation (auto-scored based on delivery, quality, and responsiveness). Phase 2 (Q1 2027 - Q3 2027): AI Demand Forecasting, Predictive Vendor Risk, Offline-First Mobile for remote sites, Invoice OCR Processing, Supplier Collaboration Hub. Phase 3 (Q4 2027 - Q2 2028): Multi-Language Interface (Hindi, Tamil, Telugu, Marathi), GeM Portal Integration, Marketplace Integration (IndiaMART, TradeIndia), Advanced API Platform, Global Compliance Engine.",
    source: "Product Roadmap Tab (Phase 1, 2, 3 details and summary rows)",
    flag: "Ready to use as-is",
  },
  {
    id: "Q8",
    question: "Q8: WHAT TRACTION DO YOU HAVE?",
    answer:
      "Platform operational with 13 core modules covering Master Setup, Engineering/BOQ, Demand Management, Strategic Sourcing, Purchase Orders, Service Contracts, Vendor Portal, Stores, Billing and Payment, Audit, Control and Intelligence, and Reporting. 82 features live including 15 USP differentiators. Mobile app in beta. Target markets validated: Real Estate, Construction, Manufacturing, Infrastructure, EPC, Logistics, Government. Revenue model proven with early adopters in [sector].",
    source:
      "Product Summary Tab (Where We Are Today); Feature List Tab (82 features across modules)",
    flag:
      "Requires founder input - add specific customer names, MRR/ARR numbers, user counts, retention rates",
  },
  {
    id: "Q9",
    question: "Q9: WHAT ARE YOUR KEY METRICS AND TARGETS?",
    answer:
      "Product metrics: 80% feature adoption within 90 days, NPS above 40, support ticket resolution under 4 hours, churn rate below 5% annually. Business metrics: 30-day activation rate of 70%, paid conversion rate of 25% from trial, customer expansion rate of 15% annually. Phase 1 targets: 50+ paying customers, INR 7-10 Cr ARR, 3 strategic partnerships. Impact metrics: 40% procurement cycle reduction, 20% cost savings through competitive bidding, 100% audit compliance.",
    source: "Metrics Tab (to be detailed); Features and Pricing Tab (Value Propositions)",
    flag:
      "Requires founder input - validate current baseline metrics and confirm targets are achievable",
  },
  {
    id: "Q10",
    question: "Q10: WHAT IS YOUR ASK AND USE OF FUNDS?",
    answer:
      "Seeking [amount] in [round type] funding. Use of funds: 40% Product Development (AI features, mobile app, integrations), 30% Sales and Marketing (team expansion, channel partnerships, demand generation), 20% Customer Success (implementation team, support infrastructure), 10% Operations (compliance, legal, infrastructure). Key milestones: Launch Phase 1 features by Q4 2026, achieve 50+ paying customers, establish 3 SI partnerships, generate INR 7-10 Cr ARR.",
    source: "Product Roadmap Tab (Phase 1 features); Market Analysis Tab (Market opportunity)",
    flag:
      "Requires founder input - specify funding amount, round type, and detailed use of funds allocation",
  },
];

const procurementBusinessPlanChecklist: NonNullable<
  ProductData["extendedContent"]["detailedBusinessPlan"]
>["checklist"] = [
  {
    reference: "☐",
    action:
      "Q5: Validate CREDAI partnership feasibility and identify specific system integrator partners",
  },
  {
    reference: "☐",
    action:
      "Q6: Confirm actual CAC and LTV data from existing customers; validate pricing assumptions",
  },
  {
    reference: "☐",
    action:
      "Q8: Add specific customer names, current MRR/ARR, active user count, and retention rate",
  },
  {
    reference: "☐",
    action:
      "Q9: Establish current baseline metrics and confirm 30/90-day targets are achievable",
  },
  {
    reference: "☐",
    action:
      "Q10: Finalize funding ask amount, round type, and detailed allocation percentages",
  },
  {
    reference: "☐",
    action:
      "General: Review all answers for accuracy before investor/partner meetings",
  },
];

const procurementGtmSheet: NonNullable<
  ProductData["extendedContent"]["detailedGTM"]
>["sheet"] = {
  title: "GO-TO-MARKET STRATEGY",
  targetGroups: [
    {
      title: "",
      sections: [
        {
          title:
            "Three target group approach with tailored sales motions, channel strategies, and 90-day launch playbooks",
          columns: [],
          rows: [],
        },
      ],
    },
    {
      title: "TARGET GROUP 1: REAL ESTATE DEVELOPERS AND CONSTRUCTION COMPANIES",
      sections: [
        {
          title: "SALES MOTION",
          columns: ["Component", "Details"],
          rows: [
            [
              "Target Profile",
              "Real estate developers with 3+ active projects, annual procurement spend above INR 50 Cr, currently using Excel or basic ERP without procurement module",
            ],
            [
              "Entry Point",
              "BOQ-linked procurement pain point - demonstrate how material leakage, unauthorized substitution, and duplicate orders are eliminated through BOQ validation, Auto Trigger MOR, Gate Management with material-in notification, and GRN-linked 3-way invoice matching. P0 roadmap Service Contract/Work Order module also highly relevant for retention and WO governance.",
            ],
            [
              "Decision Makers",
              "VP Projects, Head of Procurement, CFO - requires multi-stakeholder buy-in due to cross-functional impact",
            ],
            [
              "Sales Cycle",
              "60-90 days typical; POC on single project before enterprise rollout; land with Professional tier, expand to Enterprise",
            ],
            [
              "Pricing Strategy",
              "Professional tier at INR 5,000-7,000/user/month; bundle implementation at INR 8-12 lakhs for first project",
            ],
          ],
        },
        {
          title: "MARKETING CHANNELS",
          columns: ["Component", "Details"],
          rows: [
            [
              "Primary Channels",
              "CREDAI and NAREDCO events and publications; LinkedIn targeting procurement and project heads; Construction industry webinars",
            ],
            [
              "Content Strategy",
              "Case studies on BOQ leakage prevention; ROI calculators showing cost savings; Whitepapers on construction procurement digitization",
            ],
            [
              "Lead Generation",
              "Free BOQ audit tool; Construction procurement maturity assessment; Live demo at industry trade shows (REI Expo, ACETECH)",
            ],
          ],
        },
        {
          title: "90-DAY LAUNCH SEQUENCE",
          columns: ["Component", "Details"],
          rows: [
            [
              "Days 1-30",
              "Onboard 3 design consultants as referral partners; Launch BOQ audit tool; Attend CREDAI regional event; Generate 50 qualified leads",
            ],
            [
              "Days 31-60",
              "Convert 10 leads to POC; Complete 3 POC implementations; Publish 2 customer testimonials; Build case study with metrics",
            ],
            [
              "Days 61-90",
              "Close 5 paying customers; Achieve INR 15-20 L MRR; Expand one POC to full enterprise; Establish 1 SI partnership",
            ],
          ],
        },
      ],
      summary:
        "TG1 SUMMARY: Consultant-led referral motion targeting BOQ leakage pain. Key assumption: Design consultants will recommend during project planning. Success metric: 30% of leads from partner referrals within 90 days.",
    },
    {
      title: "TARGET GROUP 2: MANUFACTURING AND PROCESS INDUSTRIES",
      sections: [
        {
          title: "SALES MOTION",
          columns: ["Component", "Details"],
          rows: [
            [
              "Target Profile",
              "Manufacturing plants with 100+ SKUs, annual MRO spend above INR 10 Cr, experiencing stockouts or emergency purchases above 20% of orders",
            ],
            [
              "Entry Point",
              "Auto-replenishment pain point - show how threshold-based Auto Trigger MOR eliminates stockouts and emergency purchases. P0 Internal Fulfilment/MTO module for inter-plant material transfers. Dead Stock Discovery reduces working capital locked in idle inventory. RFID/QR tracking ensures material accountability from GRN to consumption.",
            ],
            [
              "Decision Makers",
              "Plant Head, Procurement Manager, Supply Chain Director - operational efficiency pitch resonates strongly",
            ],
            [
              "Sales Cycle",
              "45-60 days; faster decision due to clear ROI; start with MRO procurement, expand to direct materials",
            ],
            [
              "Pricing Strategy",
              "Starter tier at INR 3,000-4,000/user/month for single plant; volume discounts for multi-plant deployments",
            ],
          ],
        },
        {
          title: "MARKETING CHANNELS",
          columns: ["Component", "Details"],
          rows: [
            [
              "Primary Channels",
              "CII and FICCI manufacturing forums; Industry-specific publications (Autocar Professional, Indian Foundry Journal); Plant manager LinkedIn groups",
            ],
            [
              "Content Strategy",
              "Stock optimization calculators; Emergency purchase cost analysis templates; Vendor performance benchmarking reports",
            ],
            [
              "Lead Generation",
              "Free inventory health check; MRO spend analysis tool; Webinars on procurement automation for Industry 4.0",
            ],
          ],
        },
        {
          title: "90-DAY LAUNCH SEQUENCE",
          columns: ["Component", "Details"],
          rows: [
            [
              "Days 1-30",
              "Partner with 2 industrial automation integrators; Launch inventory health check tool; Target 3 industrial clusters (Pune, Chennai, Ahmedabad)",
            ],
            [
              "Days 31-60",
              "Convert 15 leads to trial; Complete 5 single-plant implementations; Document 30% reduction in emergency purchases",
            ],
            [
              "Days 61-90",
              "Close 8 paying customers; Achieve INR 10-15 L MRR; Expand 2 customers to multi-plant; Publish manufacturing case study",
            ],
          ],
        },
      ],
      summary:
        "TG2 SUMMARY: Land-and-expand motion starting with MRO pain point. Key assumption: Single plant success leads to multi-plant expansion. Success metric: 40% of customers expand to additional plants within 6 months.",
    },
    {
      title: "TARGET GROUP 3: EPC CONTRACTORS AND INFRASTRUCTURE PROJECTS",
      sections: [
        {
          title: "SALES MOTION",
          columns: ["Component", "Details"],
          rows: [
            [
              "Target Profile",
              "EPC contractors with 5+ concurrent projects, project values above INR 100 Cr each, multi-site coordination challenges",
            ],
            [
              "Entry Point",
              "Multi-site visibility pain point - demonstrate real-time procurement tracking across geographically distributed projects",
            ],
            [
              "Decision Makers",
              "PMO Head, Chief Procurement Officer, Project Directors - enterprise-level decision requiring board approval",
            ],
            [
              "Sales Cycle",
              "90-120 days; longer cycle due to enterprise scale; POC on flagship project before company-wide rollout",
            ],
            [
              "Pricing Strategy",
              "Enterprise tier at INR 10,000-15,000/user/month; custom implementation at INR 15-25 lakhs; project-based licensing option",
            ],
          ],
        },
        {
          title: "MARKETING CHANNELS",
          columns: ["Component", "Details"],
          rows: [
            [
              "Primary Channels",
              "EPC industry conferences (IPTC, India Energy Week); Infrastructure association partnerships; PMO and procurement executive forums",
            ],
            [
              "Content Strategy",
              "Multi-site procurement governance frameworks; Subcontractor management best practices; Milestone-based payment optimization guides",
            ],
            [
              "Lead Generation",
              "Free procurement maturity assessment for PMOs; Infrastructure project benchmarking reports; Executive roundtables",
            ],
          ],
        },
        {
          title: "90-DAY LAUNCH SEQUENCE",
          columns: ["Component", "Details"],
          rows: [
            [
              "Days 1-30",
              "Identify 10 target accounts with active mega-projects; Secure speaking slot at industry conference; Approach 2 construction ERP vendors for partnership",
            ],
            [
              "Days 31-60",
              "Conduct executive workshops with 5 prospects; Start 2 POC implementations; Establish partnership with NYGGS or Realx ERP",
            ],
            [
              "Days 61-90",
              "Close 2 enterprise deals; Achieve INR 25-30 L MRR; Complete integration with partner ERP; Create reference customer for sector",
            ],
          ],
        },
      ],
      summary:
        "TG3 SUMMARY: Enterprise sales motion targeting PMO for multi-site visibility. Key assumption: Flagship project success leads to company-wide mandate. Success metric: Average deal size above INR 50 L ACV with 2+ year contracts.",
    },
    {
      title: "CROSS-SEGMENT PARTNERSHIP STRATEGY",
      sections: [
        {
          title: "CROSS-SEGMENT PARTNERSHIP STRATEGY",
          columns: [
            "Partner Type",
            "Target Partners",
            "Value Exchange",
            "Target Agreements",
          ],
          rows: [
            [
              "Design and Architecture Consultants",
              "Top 20 MEP consultants, architectural firms with BOQ capabilities",
              "We provide BOQ module integration; they refer clients during project design phase",
              "5 active referral partners generating 30% of TG1 leads",
            ],
            [
              "Construction ERP Vendors",
              "Realx ERP, NYGGS, Buildup ERP, Xpedeon",
              "Procurement module complement to their project management; joint implementation",
              "2 integration partnerships with co-selling arrangement",
            ],
            [
              "System Integrators",
              "Infosys BPM, Wipro Digital, Tech Mahindra",
              "They implement for large enterprises; we provide domain expertise and platform",
              "1 SI partnership for government and PSU segment",
            ],
            [
              "Industry Associations",
              "CREDAI, CII, FICCI, NAREDCO",
              "Knowledge partner for events and publications; access to member network",
              "Knowledge partner status with 2 associations",
            ],
            [
              "B2B Marketplaces",
              "IndiaMART, Moglix Business, TradeIndia",
              "Vendor discovery integration; marketplace transaction support",
              "API integration with 1 marketplace for vendor sourcing",
            ],
          ],
        },
        {
          title:
            "GTM EXECUTION PRIORITY: Launch TG2 (Manufacturing) first for faster sales cycles and clear ROI. Use TG2 success stories to build credibility for TG1 (Real Estate) and TG3 (EPC). Target combined INR 50-65 L MRR within first 90 days across all segments.",
          columns: [],
          rows: [],
        },
      ],
    },
  ],
};

const procurementMetricsSheet: NonNullable<
  ProductData["extendedContent"]["detailedMetrics"]
>["sheet"] = {
  title: "METRICS AND KPIs",
  sections: [
    {
      title:
        "Client impact metrics for marketing and product performance metrics with phased targets",
      columns: [],
      rows: [],
    },
    {
      title:
        "SECTION 1: CLIENT IMPACT METRICS (FOR LANDING PAGE AND MARKETING)",
      columns: [
        "Metric",
        "Target Value",
        "Measurement Method",
        "Landing Page Claim",
        "Proof Source",
      ],
      rows: [
        [
          "Procurement Cycle Time Reduction",
          "40%",
          "Compare average days from MOR to PO before vs after implementation",
          "Cut your procurement cycle by 40%",
          "Time-stamp analysis of 500+ MORs across 10 pilot customers",
        ],
        [
          "Cost Savings Through Competitive Bidding",
          "20%",
          "Compare L1 price vs last purchase price for same items",
          "Save 20% through AI-powered vendor ranking",
          "Bid comparison analytics from reverse auction module",
        ],
        [
          "Emergency Purchase Reduction",
          "45%",
          "Count priority-flagged MORs as percentage of total before vs after",
          "Reduce emergency purchases by 45%",
          "Auto-trigger MOR adoption correlation study",
        ],
        [
          "Invoice Processing Time",
          "80% faster",
          "Measure hours from invoice receipt to payment approval",
          "Process invoices 80% faster with 3-way matching",
          "Finance workflow timestamp analysis",
        ],
        [
          "Audit Compliance Rate",
          "100%",
          "Percentage of transactions with complete approval trail",
          "Achieve 100% audit compliance automatically",
          "Audit trail completeness verification",
        ],
        [
          "Material Leakage Prevention",
          "Zero non-BOQ",
          "Non-BOQ procurement as percentage of total spend",
          "Eliminate material leakage with BOQ validation",
          "BOQ compliance reporting module",
        ],
        [
          "Vendor Onboarding Time",
          "70% reduction",
          "Days from vendor registration to first PO",
          "Onboard vendors 70% faster",
          "Vendor portal registration-to-PO tracking",
        ],
        [
          "Budget Overrun Prevention",
          "Zero exceeded",
          "Percentage of MORs blocked for budget violation",
          "Stop budget overruns before they happen",
          "Budget validation enforcement logs",
        ],
        [
          "Stock Visibility Accuracy",
          "99.5%",
          "Physical stock vs system stock variance percentage",
          "Real-time stock accuracy above 99%",
          "Quarterly physical verification audits",
        ],
        [
          "Approval Turnaround Time",
          "4 hours average",
          "Time from submission to final approval",
          "Get approvals in under 4 hours",
          "Workflow timestamp analysis",
        ],
      ],
    },
    {
      title: "SECTION 2: PRODUCT METRICS (INTERNAL TRACKING)",
      columns: [
        "Metric",
        "Definition",
        "30-Day (Current)",
        "30-Day (Phase 1)",
        "3-Month (Current)",
        "3-Month (Phase 1)",
      ],
      rows: [
        [
          "Signups",
          "New account registrations (trial + paid)",
          "150",
          "250",
          "400",
          "700",
        ],
        [
          "Activated Users",
          "Users who complete first MOR creation within 7 days of signup. Activation defined as: user creates at least 1 MOR with BOQ Item Selection, receives approval via Approval Matrix, and either creates an RFQ or sees stock visibility data - confirming end-to-end workflow use.",
          "45% of signups",
          "55% of signups",
          "50% of signups",
          "60% of signups",
        ],
        [
          "Paid Conversions",
          "Trial users converting to paid within 30 days",
          "18%",
          "25%",
          "20%",
          "28%",
        ],
        [
          "Feature Adoption Rate",
          "Percentage of users using 5+ modules within 90 days",
          "35%",
          "50%",
          "45%",
          "65%",
        ],
        [
          "NPS Score",
          "Net Promoter Score from in-app surveys",
          "32",
          "42",
          "38",
          "48",
        ],
        [
          "Support Ticket Volume",
          "Tickets per 100 active users per month",
          "25",
          "18",
          "22",
          "15",
        ],
        [
          "Churn Rate",
          "Monthly customer churn (logo basis)",
          "4%",
          "3%",
          "3.5%",
          "2.5%",
        ],
        [
          "Procurement Velocity",
          "North Star - Average MORs processed through complete lifecycle (MOR to PO) per active user per month. Full lifecycle means: MOR created, approved, RFQ or direct PO created, GRN received, invoice matched. This validates the platform is being used as a workflow tool, not just for data entry.",
          "12",
          "18",
          "15",
          "22",
        ],
        [
          "Mobile Adoption",
          "Percentage of MORs created via mobile app",
          "15%",
          "35%",
          "25%",
          "45%",
        ],
        [
          "Integration Usage",
          "Percentage of customers using Tally/ERP integration",
          "20%",
          "40%",
          "30%",
          "55%",
        ],
      ],
    },
    {
      title: "SECTION 3: BUSINESS METRICS (GROWTH TRACKING)",
      columns: [
        "Metric",
        "Current Baseline",
        "90-Day Target",
        "180-Day Target",
        "12-Month Target",
      ],
      rows: [
        ["Monthly Recurring Revenue (MRR)", "INR 5 L", "INR 50 L", "INR 1.2 Cr", "INR 4 Cr"],
        ["Annual Recurring Revenue (ARR)", "INR 60 L", "INR 6 Cr", "INR 14.4 Cr", "INR 48 Cr"],
        ["Paying Customers", "8", "25", "60", "150"],
        ["Average Contract Value (ACV)", "INR 7.5 L", "INR 12 L", "INR 15 L", "INR 20 L"],
        ["Customer Acquisition Cost (CAC)", "INR 80,000", "INR 65,000", "INR 55,000", "INR 45,000"],
        ["Customer Lifetime Value (LTV)", "INR 3 L", "INR 4 L", "INR 5 L", "INR 7 L"],
        ["LTV/CAC Ratio", "3.75x", "6.15x", "9.1x", "15.5x"],
        ["Net Revenue Retention", "95%", "105%", "115%", "125%"],
        ["Sales Pipeline Value", "INR 50 L", "INR 2 Cr", "INR 5 Cr", "INR 15 Cr"],
        ["Partnership Revenue Share", "0%", "10%", "20%", "30%"],
      ],
    },
  ],
};

const procurementSwot: NonNullable<
  ProductData["extendedContent"]["detailedSWOT"]
> = {
  strengths: [
    {
      headline: "Native India Compliance",
      explanation:
        "Built-in GST, TDS, and e-invoicing support eliminates need for expensive localization unlike SAP or Oracle",
    },
    {
      headline: "BOQ-Linked Procurement",
      explanation:
        "Unique construction-grade feature that validates every MOR against project BOQ, preventing material leakage",
    },
    {
      headline: "Auto-Trigger MOR",
      explanation:
        "Threshold-based automatic replenishment eliminates stockouts and reduces emergency purchases by 45%",
    },
    {
      headline: "RFID/QR Material Tracking",
      explanation:
        "End-to-end material lifecycle tracking from warehouse to site, a feature competitors lack natively",
    },
    {
      headline: "Competitive Pricing",
      explanation:
        "INR 2,500-15,000/user/month vs INR 15,000-55,000 for global players, targeting underserved mid-market",
    },
    {
      headline: "Construction Project Hierarchy",
      explanation:
        "INR 2,500-15,000/user/month versus INR 15,000-55,000 for global platforms, with superior India-specific functionality including GST/TDS compliance, BOQ integration, Gate Management, and service contract modules that global tools require expensive customization to deliver.",
    },
    {
      headline: "AI-Powered Bid Analytics",
      explanation:
        "L1/L2/L3 ranking with landed cost calculation for objective vendor selection",
    },
    {
      headline: "Comprehensive Module Coverage",
      explanation:
        "14 integrated modules covering entire P2P lifecycle from MOR demand creation through tendering, purchase order management, gate management, GRN and QC, inventory control, billing and payment, audit and control, plus P0 roadmap for MTO and service contract modules.",
    },
    {
      headline: "Mobile-First Design",
      explanation:
        "Full MOR creation and approval workflows on mobile for field teams and site engineers",
    },
    {
      headline: "Quick Implementation",
      explanation:
        "4-6 week deployment vs 12-18 months for enterprise solutions like SAP Ariba",
    },
  ],
  weaknesses: [
    {
      headline: "Limited AI Maturity",
      explanation:
        "Predictive analytics and AI spend intelligence lag behind Coupa Navi and Zycus Merlin capabilities",
    },
    {
      headline: "No Multi-Language Support",
      explanation:
        "Currently English-only interface limits adoption in regional markets and Tier-2/3 cities",
    },
    {
      headline: "Offline Mode Absent",
      explanation:
        "No offline-first mobile capability for remote construction sites with poor connectivity",
    },
    {
      headline: "Brand Recognition",
      explanation:
        "New entrant competing against established players with 20+ years of market presence",
    },
    {
      headline: "Limited Integration Ecosystem",
      explanation:
        "Fewer pre-built connectors compared to SAP or Oracle ecosystem today. Tally integration in Phase 1 roadmap. Power BI connector and 50+ API connectors in Phase 3. Currently requires custom integration for finance platforms other than Tally.",
    },
    {
      headline: "Small Customer Base",
      explanation:
        "Early-stage traction limits reference customers and case studies for enterprise sales",
    },
    {
      headline: "No Global Compliance",
      explanation:
        "India-focused compliance engine not ready for international expansion (UAE, US, UK)",
    },
    {
      headline: "Basic Analytics",
      explanation:
        "Dashboard and reporting capabilities behind enterprise BI expectations",
    },
    {
      headline: "Single Geography Focus",
      explanation:
        "No local support or data centers outside India currently",
    },
    {
      headline: "Limited SI Partnerships",
      explanation:
        "No established relationships with major system integrators for enterprise deals",
    },
  ],
  opportunities: [
    {
      headline: "Low Enterprise Adoption",
      explanation:
        "Less than 15% of Indian enterprises use procurement software, massive greenfield opportunity",
    },
    {
      headline: "Infrastructure Push",
      explanation:
        "INR 10 lakh crore government infrastructure spend (PM Gati Shakti) driving digitization",
    },
    {
      headline: "Construction Tech Boom",
      explanation:
        "Real estate sector recovering with focus on operational efficiency and cost control",
    },
    {
      headline: "GST Compliance Mandate",
      explanation:
        "E-invoicing requirements pushing companies toward integrated procurement solutions",
    },
    {
      headline: "Remote Work Acceleration",
      explanation:
        "Post-pandemic distributed teams need cloud-based procurement with mobile access",
    },
    {
      headline: "GeM Integration Potential",
      explanation:
        "Government e-Marketplace integration (Phase 3 roadmap) can unlock INR 3+ lakh crore PSU procurement market. Internal Fulfilment/MTO module (P0) addresses government and PSU multi-site transfer requirements, positioning for GeM and defense procurement opportunities.",
    },
    {
      headline: "AI Wave in Procurement",
      explanation:
        "80% of CPOs planning GenAI adoption, positioning for AI-native procurement platform",
    },
    {
      headline: "Mid-Market Gap",
      explanation:
        "No dominant player in INR 50 Cr - 500 Cr revenue segment, underserved by expensive enterprise tools",
    },
    {
      headline: "SI Partnership Opportunity",
      explanation:
        "System integrators seeking India-focused procurement solutions to complement ERP implementations",
    },
    {
      headline: "Regional Language Demand",
      explanation:
        "First mover advantage for Hindi, Tamil, Telugu language support in procurement software",
    },
  ],
  threats: [
    {
      headline: "SAP/Oracle Price Cuts",
      explanation:
        "Global giants may reduce India pricing to defend market share against local competitors",
    },
    {
      headline: "Zycus Expansion",
      explanation:
        "Indian enterprise leader expanding into mid-market with localized offerings",
    },
    {
      headline: "Moglix/Cognilix Growth",
      explanation:
        "Well-funded unicorns expanding from marketplace to full procurement platform",
    },
    {
      headline: "ERP Vendor Bundling",
      explanation:
        "Tally, Zoho, Oracle NetSuite may bundle procurement modules at marginal cost",
    },
    {
      headline: "Economic Slowdown",
      explanation:
        "Construction and infrastructure spending cuts during economic downturns delay purchases",
    },
    {
      headline: "Talent Competition",
      explanation:
        "Difficulty hiring experienced procurement domain experts and enterprise sales talent",
    },
    {
      headline: "Data Security Concerns",
      explanation:
        "Enterprise customers may hesitate with cloud solutions due to data sovereignty fears",
    },
    {
      headline: "Regulatory Changes",
      explanation:
        "GST/TDS rule changes require continuous compliance updates and engineering investment",
    },
    {
      headline: "Customer Concentration Risk",
      explanation:
        "Early-stage dependence on few large customers creates revenue volatility",
    },
    {
      headline: "Technology Obsolescence",
      explanation:
        "Rapid AI advancement may require continuous re-platforming to stay competitive",
    },
  ],
};

const procurementMarketTable = (
  <div className="space-y-6">
    <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
      <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
        Market Analysis - Procurement Software
      </h2>
      <p className="mt-2 text-[12px] text-[#2C2C2C]/60 font-medium italic">
        Competitive landscape analysis with 10 key players, pricing benchmarks,
        and market opportunity assessment for India and Global markets
      </p>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Section 1: Market Size and Growth
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] leading-relaxed">
        <thead>
          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
            {["Metric", "2025", "2026", "2030 Projected"].map((header) => (
              <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {procurementMarketSizeRows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Section 2: Competitor Analysis (10 Key Players)
      </div>
      <div className="overflow-x-auto">
        <table className="w-[1600px] border-collapse text-[12px] leading-relaxed">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
              {["Rank", "Competitor", "HQ", "Target Market", "Key Strengths", "Key Weaknesses", "Pricing India (INR)", "Pricing Global (USD)", "Notable Clients", "Threat Level"].map((header) => (
                <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {procurementCompetitorRows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Section 3: Target Industries (Ranked by Market Opportunity)
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] leading-relaxed">
        <thead>
          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
            {["Rank", "Industry", "Market Size (India)", "Adoption Rate", "Key Procurement Needs"].map((header) => (
              <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {procurementIndustryRows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="border border-[#D3D1C7] bg-[#F6F4EE] p-4 text-[13px] font-semibold text-[#2C2C2C] leading-relaxed">
      Competitor Summary: Market dominated by global players (SAP, Coupa,
      Oracle) in enterprise segment. India-origin players (Zycus, TCS, Moglix)
      gaining ground. Gap exists for mid-market India-focused solution with
      native GST/TDS compliance and construction-grade features.
    </div>
  </div>
);

const procurementFeatureComparisonRows = [
  ["BOQ-Linked Procurement", "Native BOQ integration with MOR validation", "Manual mapping required", "Not available", "Partial via customization", "Limited", "Basic", "AHEAD"],
  ["GST/TDS Compliance", "Pre-built India tax engine with auto-calculation", "Via partner add-on", "Basic GST only", "Via localization pack", "Native support", "Native support", "AHEAD"],
  ["E-Invoice Integration", "Direct GST portal integration", "Via partner", "Not available", "Via add-on", "Available", "Available", "AT PAR"],
  ["Real-time Stock Visibility", "Live stock during MOR creation", "Separate module", "Available", "Available", "Available", "Basic", "AT PAR"],
  ["Auto-Trigger MOR", "Threshold-based auto-generation", "Not available", "Partial", "Not available", "Not available", "Not available", "AHEAD"],
  ["Reverse Auction", "Real-time bidding with auto-extension", "Available", "Available", "Available", "Available", "Not available", "AT PAR"],
  ["L1/L2/L3 Auto Ranking", "AI-powered with landed cost", "Basic ranking", "AI ranking", "Basic", "AI ranking", "Manual", "AT PAR"],
  ["3-Way Matching", "Automated PO-GRN-Invoice match", "Available", "Available", "Available", "Available", "Available", "AT PAR"],
  ["RFID/QR Tracking", "Native material lifecycle tracking", "Via partner", "Not available", "Partial", "Not available", "Not available", "AHEAD"],
  ["Vendor Self-Registration", "Public portal with GST auto-verify", "Available", "Available", "Available", "Available", "Basic", "AT PAR"],
  ["Mobile MOR Creation", "Full mobile workflow", "Available", "Available", "Available", "Limited", "Basic", "AT PAR"],
  ["Multi-level Approval Matrix", "Configurable with escalation", "Available", "Available", "Available", "Available", "Available", "AT PAR"],
  ["Spend Analytics Dashboard", "Real-time with drill-down", "Advanced", "Advanced", "Advanced", "Advanced", "Basic", "GAP"],
  ["AI Spend Prediction", "Phase 2 Enhancement", "Joule AI", "Navi AI", "AI suite", "Merlin AI", "Not available", "GAP"],
  ["Multi-Language Support", "Planned for Phase 3", "45+ languages", "30+ languages", "40+ languages", "12 languages", "Hindi/English", "GAP"],
  ["Offline Mobile Mode", "Planned for Phase 2", "Limited", "Not available", "Not available", "Not available", "Not available", "GAP"],
  ["Construction Project Hierarchy", "Native project/wing/floor support", "Custom config required", "Not available", "Custom config", "Limited", "Basic", "AHEAD"],
  ["Budget Validation on MOR", "Real-time block on exceed", "Available", "Available", "Available", "Available", "Alert only", "AT PAR"],
  ["Audit Trail", "Immutable transaction log", "Available", "Available", "Available", "Available", "Available", "AT PAR"],
  ["Report Builder", "List/Detail/Summary reports plus custom export", "Advanced", "Advanced", "Advanced", "Advanced", "Basic", "AT PAR"],
];

const procurementCompetitivePositionRows = [
  ["AHEAD (Differentiated)", "8 features", "BOQ-linked procurement with MOR validation, native GST/TDS/e-invoicing compliance, Auto-trigger MOR with threshold-based replenishment, Gate Management with material-in notification, RFID/QR tracking with full material lifecycle, Non-L1 justification capture with audit, Reverse auction with proxy bidding, Dead stock discovery and tagging"],
  ["AT PAR (Competitive)", "12 features", "Matching enterprise players on core P2P features - reverse auction, 3-way matching, approval workflows, vendor portal"],
  ["GAP (Development Needed)", "3 features", "AI demand forecasting (Phase 2), multi-language support (Phase 3), advanced BI analytics (Phase 2)"],
];

const procurementPricingLandscapeRows = [
  ["Starter", "SMBs (up to 25 users)", "INR 2,500 - 4,000", "USD 30 - 50", "Core P2P workflow, basic reporting, email support, 5 GB storage"],
  ["Professional", "Mid-Market (25-100 users)", "INR 4,000 - 8,000", "USD 50 - 100", "Full P2P suite, BOQ module, reverse auction, phone support, 50 GB storage"],
  ["Enterprise", "Large Organizations (100+ users)", "INR 8,000 - 15,000", "USD 100 - 180", "All modules, API access, dedicated CSM, SLA guarantee, unlimited storage"],
  ["Custom", "Complex Requirements", "Custom pricing", "Custom pricing", "On-premise option, custom integrations, white-labeling, 24/7 support"],
];

const procurementValuePropositionRows = [
  ["Real Estate Developers", "40% reduction in procurement cycle time", "Complete BOQ-to-payment traceability", "Native construction project hierarchy eliminates manual tracking"],
  ["EPC Contractors", "Zero budget overruns with real-time validation", "RFID/QR material tracking across sites", "Automated GRN with photo verification reduces disputes by 60%"],
  ["Manufacturing Plants", "20% cost savings through competitive bidding", "Auto-trigger MOR prevents stockouts", "Threshold-based reordering reduces emergency purchases by 45%"],
  ["Government/PSUs", "100% audit compliance with immutable logs", "GeM-ready procurement workflows", "Complete transaction trail for CAG audit requirements"],
  ["Infrastructure Projects", "Single platform for multi-site material and service procurement with gate management", "Milestone-based payment release with retention tracking and work order management", "Cross-project material transfer and inter-company settlement (P0 roadmap)"],
];

const procurementPricingTable = (
  <div className="space-y-6">
    <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
      <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
        Features and Pricing Comparison
      </h2>
      <p className="mt-2 text-[12px] text-[#2C2C2C]/60 font-medium italic">
        Feature-by-feature competitive analysis with pricing benchmarks and
        strategic positioning
      </p>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Section 1: Feature Comparison Matrix
      </div>
      <div className="overflow-x-auto">
        <table className="w-[1400px] border-collapse text-[12px] leading-relaxed">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
              {["Feature Category", "Our Product", "SAP Ariba", "Coupa", "Oracle", "Zycus", "TYASuite", "Status"].map((header) => (
                <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {procurementFeatureComparisonRows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Section 2: Competitive Position Summary
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] leading-relaxed">
        <thead>
          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
            {["Position", "Count", "Analysis"].map((header) => (
              <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {procurementCompetitivePositionRows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Section 3: Pricing Landscape
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] leading-relaxed">
        <thead>
          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
            {["Pricing Tier", "Target Segment", "Price Range (INR/user/month)", "Price Range (USD/user/month)", "Included Features"].map((header) => (
              <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {procurementPricingLandscapeRows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Section 4: Value Propositions by Segment
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] leading-relaxed">
        <thead>
          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
            {["Segment", "Primary Value", "Secondary Value", "Proof Point"].map((header) => (
              <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {procurementValuePropositionRows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top">
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

const procurementIndustryUseCaseRows = [
  ["1", "Real Estate and Construction (Real Estate Development)", "BOQ-driven procurement for residential and commercial projects", "BOQ Management links material requirements to project phases. MOR Creation validates against BOQ quantities. Budget Validation blocks over-budget requests. RFID/QR Tracking monitors material movement from warehouse to floor.", "1. Engineer uploads BOQ from design software using BOQ Bulk Upload. 2. Site raises MOR selecting BOQ items with Auto Order Quantity calculation against live stock. 3. MOR routes through Approval Matrix with Budget Validation check at each level. 4. Procurement creates RFQ, invites vendors via Vendor Invitation, conducts Reverse Auction for price discovery. 5. Rate Standardization and Landed Cost Calculation compare bids. 6. Non-L1 Justification Capture required if preferred vendor is not L1. 7. PO Domestic created with PO Notification to vendor via WhatsApp and email. 8. Gate Entry created on truck arrival, Material In Notification sent to store. 9. GRN created with QC Inspection. Rejection Slip for failed materials. 10. 3-Way Matching validates PO vs GRN vs Invoice. Bill Booking Approval Flow executed. Payment released.", "40% faster procurement cycle; Zero non-BOQ leakage; Complete material traceability per floor/wing"],
  ["2", "Manufacturing", "MRO and production material procurement with auto-replenishment", "Auto-Trigger MOR creates replenishment requests at threshold. Stock Visibility shows real-time inventory during requisition. L1/L2/L3 Ranking identifies optimal vendor. 3-Way Matching automates invoice processing for high-volume transactions.", "1. Reorder level configured per material via Material Masters. 2. Auto Trigger MOR creates draft when stock falls below threshold - no manual intervention. 3. System shows Stock Visibility, Auto Order Quantity calculated. 4. MOR approved through multi-level Approval Matrix with Budget-Exceed Alerts. 5. RFQ created with vendor list from Vendor Targeting based on category and history. 6. Bid Analytics with L1/L2/L3 Auto Ranking selects best vendor. 7. PO created using Rate Carry Forward from RFQ. Vendor Acknowledgement tracked. 8. GRN created, Batch Tracking for lot-wise quality traceability. 9. 3-Way Matching with Partial Billing for phased deliveries. Vendor Ageing tracked.", "20% cost reduction through competitive bidding; Zero stockouts; 80% reduction in emergency purchases"],
  ["3", "Infrastructure and EPC (EPEC)", "Multi-site project procurement with subcontractor management", "Project Structure supports hierarchical site organization. Milestone Tracking links payment to deliverables. Contract Management handles subcontractor work orders. Material Mapping restricts procurement to project-authorized items.", "1. Project manager defines site hierarchy. 2. Each site raises independent MORs. 3. Central procurement consolidates demand. 4. Bulk RFQ negotiates volume discounts. 5. Site-wise PO delivery scheduled. 6. Milestone completion triggers retention release. 7. Consolidated spend analytics by project.", "15% savings through demand aggregation; Real-time multi-site visibility; Milestone-linked payment accuracy"],
  ["4", "Government and PSUs (Tenants)", "Transparent procurement with complete audit compliance", "Audit Trail provides immutable transaction logs. Approval Matrix enforces multi-level authorization. Vendor Registration validates against government databases. Budget Validation ensures allocation compliance. Report Builder generates audit-ready documentation.", "1. Department raises indent within allocated budget. 2. Multi-level approval with digital signatures. 3. Open tender with bid submission deadline. 4. Automated bid comparison with L1 ranking. 5. Rate contract or PO issued. 6. GRN with photo verification. 7. Payment with TDS deduction and audit log.", "100% CAG audit compliance; Zero manual intervention in vendor selection; Complete transparency"],
  ["5", "Logistics and Warehousing", "Fleet maintenance and warehouse equipment procurement", "Work Category classifies maintenance vs capital procurement. Vendor Performance Scoring rates suppliers on delivery and quality. Stock Control manages spare parts inventory. Service Contract handles AMC and maintenance agreements.", "1. Maintenance team raises work order for fleet repair. 2. Linked MOR for required spare parts. 3. Stock check identifies available vs to-order items. 4. PO for unavailable parts with priority flag. 5. Vendor delivers to service location. 6. Work order closed with cost allocation. 7. Vendor rated on response time and quality.", "25% reduction in vehicle downtime; Optimized spare parts inventory; Vendor SLA tracking"],
  ["6", "Healthcare and Pharma", "Regulated procurement with batch tracking and cold chain compliance", "Material QC captures quality inspection results. Dynamic Fields supports batch number and expiry tracking. Vendor Registration validates drug license and certifications. Stock Register maintains FIFO for expiry management.", "1. Pharmacy raises MOR for medicines with batch requirements. 2. Procurement sources from licensed vendors only. 3. RFQ includes cold chain requirements. 4. GRN captures batch, expiry, storage conditions. 5. QC inspection for random samples. 6. Stock updated with batch-wise tracking. 7. Near-expiry alerts trigger consumption or return.", "100% batch traceability; Zero expired stock usage; Regulatory compliance documentation"],
  ["7", "Retail and FMCG (Retail Chain)", "Seasonal procurement and private label sourcing", "Rate Management supports time-bound promotional pricing. Bulk Operations enables high-volume PO processing. Vendor Portal allows supplier collaboration on forecasts. Spend Analytics identifies category optimization opportunities.", "1. Category manager forecasts seasonal demand. 2. Bulk MOR upload for promotional inventory. 3. RFQ with volume-based pricing tiers. 4. Vendor confirms capacity and delivery schedule. 5. Staggered POs for warehouse capacity. 6. GRN with quality sampling. 7. Vendor scorecard updated post-season.", "15% better terms through volume aggregation; On-time seasonal availability; Private label cost optimization"],
  ["8", "Energy and Utilities (EPEC)", "Capital equipment and maintenance contract management", "BOQ Management supports CAPEX project planning. Contract Management handles long-term AMC agreements. Retention Management tracks performance guarantees. Budget Allocation segments CAPEX and OPEX spending.", "1. Project team defines equipment specifications. 2. Technical evaluation criteria weighted in RFQ. 3. Two-envelope bidding (technical + commercial). 4. L1 among technically qualified vendors. 5. Contract with milestone-based payment. 6. Installation acceptance with GRN. 7. Warranty tracking and AMC conversion.", "Structured CAPEX governance; Performance-linked payments; Asset lifecycle documentation"],
  ["9", "IT /ITES", "Software licensing and hardware refresh procurement", "Vendor Masters maintains technology partner relationships. Dynamic Fields captures license metrics (users, cores). Advance Management handles annual subscription prepayments. Data Export integrates with IT asset management systems.", "1. IT raises MOR for license renewal with user count. 2. Vendor portal receives requirement. 3. Quote comparison with multi-year discounting. 4. PO with auto-renewal terms. 5. Invoice matched against delivery confirmation. 6. License keys logged in asset system. 7. Usage tracked against purchased quantity.", "10% savings through multi-year deals; Zero license compliance issues; Automated renewal tracking"],
  ["10", "Education", "Annual procurement for academic operations", "Budget Management supports academic year allocation. Approval Matrix reflects administrative hierarchy. Pre-built Reports generate utilization statements. Stock Control manages lab consumables and stationery.", "1. Department submits annual requirement to central procurement. 2. Budget allocation per department approved. 3. Consolidated tender for common items. 4. Rate contracts for recurring purchases. 5. Department-wise delivery tracking. 6. Quarterly utilization reports. 7. Year-end reconciliation and rollover.", "Centralized volume benefits; Department-level accountability; Transparent fund utilization"],
];

const procurementInternalUseCaseRows = [
  ["Procurement Team", "Source vendors, negotiate contracts, manage purchase orders", "RFQ Management with Reverse Auction, L1/L2/L3 Auto Ranking, Landed Cost Calculation, Non-L1 Justification Capture, PO Domestic Create/Details, PO Short Close, Rate Carry Forward", "Review pending MORs, create RFQs, evaluate bids, generate POs, track deliveries, update vendor ratings", "50% faster sourcing cycle; 20% cost savings through competitive bidding; Data-driven vendor selection"],
  ["Site/Project Team", "Raise material requirements, track deliveries, confirm receipt", "MOR Create/List/Detail, BOQ Item Selection, Stock Visibility, Auto Order Quantity, Delivery Schedule Calculation, Priority Handling, Bulk Operations, Historical Intelligence", "Identify material needs, raise MORs with specs, track PO status, coordinate delivery, confirm GRN", "Zero material stockouts; On-time project delivery; Real-time requirement visibility"],
  ["Finance Team", "Process payments, manage budgets, ensure compliance", "3-Way Matching, Budget Validation, Advance Management, Bill Booking Approval Flow, GST Handling, E-Invoicing, Payment Voucher/Reconciliation, Vendor Ageing, TDS Calculation", "Validate invoices, process matched payments, manage vendor advances, reconcile TDS, generate reports", "90% reduction in invoice processing time; Zero payment errors; Automated compliance"],
  ["Stores/Warehouse Team", "Receive materials, manage inventory, issue to projects", "Store GRN List/Create/Details, Store Material QC, Store Material Rejection Slip, Stock Register Summary, Material Issue, Material Return, RFID/QR Tracking, Dead Stock Discovery", "Receive deliveries, conduct QC inspection, update stock, process issue requests, manage transfers", "Real-time stock accuracy; Zero pilferage through tracking; Optimized inventory levels"],
  ["Quality Control Team", "Inspect received materials, approve or reject based on standards", "Store Material QC, Dynamic Fields, Approval Workflow, Audit Trail", "Review pending QC items, conduct inspections, capture results, approve or trigger rejection workflow", "100% quality compliance; Documented inspection history; Reduced material disputes"],
  ["Vendor/Supplier", "Respond to RFQs, acknowledge POs, submit invoices", "Vendor Portal, Quotation Submission, Order Acknowledgment, Invoice Submission", "View active RFQs, submit competitive quotes, acknowledge orders, upload delivery documents, track payments", "Single window for all transactions; Transparent payment status; Faster dispute resolution"],
  ["Management/Leadership", "Monitor spend, approve high-value transactions, review performance", "Spend Analytics Dashboard, Approval Matrix, Savings Tracking, Report Builder", "Review spend dashboards, approve escalated requests, analyze vendor performance, track savings", "Real-time spend visibility; Strategic sourcing insights; Governance and control"],
  ["Audit/Compliance Team", "Review transactions, verify compliance, generate audit reports", "Audit Trail, Complete Transaction History, Policy Enforcement, Data Export", "Access transaction logs, verify approval chains, check policy compliance, export audit documentation", "100% audit readiness; Immutable evidence trail; Regulatory compliance assurance"],
];

const procurementUseCasesTable = (
  <div className="space-y-6">
    <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
      <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
        Use Cases by Industry and Team
      </h2>
      <p className="mt-2 text-[12px] text-[#2C2C2C]/60 font-medium italic">
        Detailed application scenarios across 10 target industries and internal
        organizational teams
      </p>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Part 1: Industry Use Cases (10 Industries)
      </div>
      <div className="overflow-x-auto">
        <table className="w-[1800px] border-collapse text-[12px] leading-relaxed">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
              {["Rank", "Industry", "Primary Use Case", "How Relevant Features Apply", "Workflow Example", "Expected Outcome"].map((header) => (
                <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {procurementIndustryUseCaseRows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="border border-[#D3D1C7] bg-white">
      <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
        Part 2: Internal Team Use Cases
      </div>
      <div className="overflow-x-auto">
        <table className="w-[1500px] border-collapse text-[12px] leading-relaxed">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
              {["Team", "Role in Procurement", "Key Features Used", "Daily Workflow", "Value Delivered"].map((header) => (
                <th key={header} className="border border-[#D3D1C7] p-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {procurementInternalUseCaseRows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const procurementEnhancementRoadmap: NonNullable<
  ProductData["extendedContent"]["detailedRoadmap"]
>["enhancementRoadmap"] = [
  {
    rowId: "1",
    featureName: "GPT-Powered Contract Analysis",
    category: "AI/LLM",
    description:
      "Natural language parsing of vendor contracts, service work orders, and retention agreements to extract key clauses, payment terms, penalty conditions, and expiry dates. Flags non-standard clauses and suggests corrections. Particularly valuable for Service Contract/Work Order module (P0) where SI special conditions and EMD/BG terms require review.",
    competitorLeapfrogged: "Coupa, SAP Ariba - basic contract management",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "2",
    featureName: "Conversational Procurement Assistant",
    category: "AI/LLM",
    description:
      "Chat interface for raising MORs, checking PO status, querying spend data using natural language queries",
    competitorLeapfrogged: "Zycus Merlin - limited to search",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "3",
    featureName: "AI Vendor Recommendation Engine",
    category: "AI/LLM",
    description:
      "Machine learning model suggesting optimal vendors based on historical performance, pricing trends, and capacity",
    competitorLeapfrogged: "Manual vendor selection in most tools",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "4",
    featureName: "Intelligent Spend Anomaly Detection",
    category: "AI/LLM",
    description:
      "Real-time flagging of unusual spending patterns, potential fraud, and policy violations using behavioral AI",
    competitorLeapfrogged: "Coupa Navi - requires extensive training",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "5",
    featureName: "Automated RFQ Generation from Requirements",
    category: "AI/LLM",
    description:
      "LLM generates complete RFQ documents from brief requirement descriptions including specs and terms",
    competitorLeapfrogged: "Manual RFQ creation everywhere",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "6",
    featureName: "Predictive Supplier Risk Scoring",
    category: "AI/LLM",
    description:
      "AI model predicting vendor default, delivery delays, or quality issues before they occur",
    competitorLeapfrogged: "GEP SMART - reactive risk management",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "7",
    featureName: "Voice-Enabled Regional Language MOR",
    category: "AI/LLM",
    description:
      "Create MORs using voice commands in Hindi, Tamil, Telugu, Marathi for field workers without typing",
    competitorLeapfrogged: "No competitor offers this",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "8",
    featureName: "SAP/Oracle Bi-Directional Sync",
    category: "MCP",
    description:
      "Real-time two-way sync with SAP S/4HANA and Oracle ERP for seamless enterprise integration",
    competitorLeapfrogged: "Most tools require manual export/import",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "9",
    featureName: "Tally Prime Deep Integration",
    category: "MCP",
    description:
      "Automatic voucher posting, ledger reconciliation, and GST filing support directly from procurement data",
    competitorLeapfrogged: "TYASuite - basic Tally export",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "10",
    featureName: "WhatsApp Business Workflow Automation",
    category: "MCP",
    description:
      "Complete approval workflows, GRN confirmation, and payment status via WhatsApp without app login",
    competitorLeapfrogged: "Basic notifications only",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "11",
    featureName: "GeM Portal Direct Integration",
    category: "MCP",
    description:
      "Automated bid submission, order acknowledgment, and invoice processing on Government e-Marketplace",
    competitorLeapfrogged: "No competitor has direct GeM API",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "12",
    featureName: "IoT Sensor Stock Monitoring",
    category: "MCP",
    description:
      "Real-time stock levels from warehouse IoT sensors triggering Auto Trigger MOR without manual reorder point configuration. Integration with Gate Management for automated vehicle and challan detection. Smart bin scales trigger replenishment directly. Eliminates human dependency in inventory monitoring.",
    competitorLeapfrogged: "Manual stock counting everywhere",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "13",
    featureName: "Blockchain-Based Supplier Verification",
    category: "Compliance",
    description:
      "Immutable vendor credential verification and transaction recording for regulated industries",
    competitorLeapfrogged: "No competitor offers blockchain",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Low",
  },
  {
    rowId: "14",
    featureName: "Dynamic Pricing Intelligence",
    category: "Analytics",
    description:
      "Real-time market price benchmarking with alerts when vendor quotes exceed fair market value",
    competitorLeapfrogged: "Static rate card comparison",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "15",
    featureName: "Augmented Reality Warehouse Navigation",
    category: "Innovation",
    description:
      "AR glasses for warehouse staff showing optimal picking routes and material locations",
    competitorLeapfrogged: "No competitor in this space",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Low",
  },
  {
    rowId: "16",
    featureName: "Carbon Footprint Tracking per PO",
    category: "ESG",
    description:
      "Calculate and report environmental impact of procurement decisions for sustainability reporting",
    competitorLeapfrogged: "Basic ESG reports only",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "17",
    featureName: "Supplier Diversity Analytics",
    category: "Compliance",
    description:
      "Track and report on procurement from MSMEs, women-owned, and minority businesses",
    competitorLeapfrogged: "Manual tracking in spreadsheets",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "18",
    featureName: "Digital Twin for Inventory",
    category: "Innovation",
    description:
      "Virtual representation of warehouse inventory for simulation and optimization scenarios",
    competitorLeapfrogged: "No competitor offers this",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Low",
  },
  {
    rowId: "19",
    featureName: "Crowdsourced Vendor Ratings",
    category: "Community",
    description:
      "Industry-wide vendor ratings aggregated from multiple buyer organizations anonymously",
    competitorLeapfrogged: "Internal ratings only",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "20",
    featureName: "Autonomous Procurement Agents",
    category: "AI/LLM",
    description:
      "AI agents executing routine procurement decisions within defined parameters without human intervention",
    competitorLeapfrogged: "All competitors require human approval",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "21",
    featureName: "Multi-Entity Consolidation",
    category: "Enterprise",
    description:
      "Centralized procurement for holding companies with entity-wise compliance and reporting",
    competitorLeapfrogged: "Complex setup in competitors",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "22",
    featureName: "Franchise/Dealer Procurement Portal",
    category: "Distribution",
    description:
      "Self-service portal for franchise networks to procure from approved central catalogs",
    competitorLeapfrogged: "Custom development required",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "23",
    featureName: "API Marketplace for Integrations",
    category: "Platform",
    description:
      "Public API with pre-built connectors and developer documentation for custom integrations",
    competitorLeapfrogged: "Limited API access in most tools",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
  {
    rowId: "24",
    featureName: "White-Label Procurement SaaS",
    category: "Channel",
    description:
      "Fully brandable solution for system integrators and large enterprises to resell",
    competitorLeapfrogged: "No competitor offers white-label",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "High",
  },
  {
    rowId: "25",
    featureName: "Cross-Border Procurement Module",
    category: "Global",
    description:
      "Multi-currency, customs documentation, and international shipping integration for imports",
    competitorLeapfrogged: "Separate tools required currently",
    currentStatus: "",
    enhancedVersion: "",
    integrationType: "",
    impact: "Medium",
  },
];

const procurementTop5Enhancements: NonNullable<
  ProductData["extendedContent"]["detailedRoadmap"]
>["top5Impact"] = [
  {
    rank: "1",
    name: "Conversational Procurement Assistant",
    logic:
      "Democratizes procurement software for non-technical users; enables adoption in Tier-2/3 markets without training",
    leapfrog:
      "Leapfrogs Zycus Merlin and Coupa Navi with regional language support and deeper workflow integration",
  },
  {
    rank: "2",
    name: "GPT-Powered Contract Analysis",
    logic:
      "Reduces legal review bottleneck by 80%; auto-extracts risks from vendor contracts in seconds vs days",
    leapfrog:
      "Leapfrogs SAP Ariba Contracts which requires manual clause tagging and expert review",
  },
  {
    rank: "3",
    name: "Autonomous Procurement Agents",
    logic:
      "First-mover in agentic AI for procurement; handles 60% of routine decisions without human delay",
    leapfrog:
      "Leapfrogs all competitors who require human approval for every transaction",
  },
  {
    rank: "4",
    name: "Dynamic Pricing Intelligence",
    logic:
      "Real-time market rate validation prevents overpayment; estimated 8-12% additional savings",
    leapfrog:
      "Leapfrogs GEP SMART and Oracle which use historical averages vs live market data",
  },
  {
    rank: "5",
    name: "Voice-Enabled Regional Language MOR",
    logic:
      "Unlocks rural construction sites and manufacturing plants where workers are not comfortable with English interfaces",
    leapfrog:
      "No competitor addresses regional language procurement; unique market opportunity",
  },
];

/**
 * Procurement/Contracts Product Data
 * ID: 12
 */
const procurementData: ProductData = {
  name: "Procurement/ Contracts/ Tendering",
  description: "AI-powered end-to-end procure-to-pay platform digitizing procurement lifecycle from demand to payment.",
  brief: "End-to-end procure-to-pay platform for real estate, construction, manufacturing, infrastructure, EPC, logistics and government projects.",
  excelLikeFeatures: true,
  excelLikeMarket: true,
  excelLikeGtm: true,
  excelLikeMetrics: true,
  excelLikeSwot: true,
  userStories: [
    {
      title: "Site Operations (Indents & Raising)",
      items: [
        "Site Engineer: Create material indents with specifications, quantity, and timelines accurately.",
        "Approver: Visibility of indent details and justifications for informed approval decisions.",
        "Audit trails and history maintained for full accountability and compliance.",
      ],
    },
    {
      title: "MOR & Procurement (Bidding & Conversion)",
      items: [
        "Create RFQs against approved indents to invite competitive vendor quotations.",
        "Side-by-side comparison of vendor bids for data-driven procurement decisions.",
        "Recommend winning vendors and convert RFQs into Purchase Orders seamlessly.",
      ],
    },
    {
      title: "Vendor Engagement",
      items: [
        "Receive RFQ notifications and submit quotations with terms and conditions digitally.",
        "Accept or reject POs digitally for clear, documented order confirmation.",
        "Real-time visibility of delivery schedules and quantities for accurate supply.",
      ],
    },
    {
      title: "Inventory & Warehouse",
      items: [
        "Security: Create gate entries against POs to trace authorized material movement.",
        "Store: Create GRN against PO and gate entry to accurately record received materials.",
        "Automatic stock updates after GRN for real-time accurate inventory levels.",
      ],
    },
  ],
  industries: "Real Estate Developer, Manufacturing Plants, Construction Contractors.",
  usps: [
    "End-To-End Process Integration (Indent to Payment).",
    "Real-Time Visibility & Reporting across all stages.",
    "Improved Operational Efficiency & Transparency.",
    "Reduces dependency on individuals through automated workflows.",
  ],
  includes: [
    "Indent / Purchase Requisition Management",
    "RFQ / Tender Management",
    "Procurement / Purchase Management",
    "Inventory & Warehouse Management",
  ],
  upSelling: ["Vendor Management, Loyalty Rule Engine, Maintenance Module"],
  integrations: ["SAP, Salesforce (SFDC), Internal Inventory Systems"],
  decisionMakers: ["Procurement Head, Contractors, Real estate developers"],
  keyPoints: [
    "Direct cost savings via automated bid comparison.",
    "Reduced turnaround time for procurement cycles.",
    "Minimal data entry errors via seamless conversion (Indent -> RFQ -> PO).",
  ],
  roi: [
    "15% direct material cost reduction through transparent bidding.",
    "50% reduction in source-to-pay cycle time.",
    "100% audit compliance for all procurement decisions.",
  ],
  assets: [
    {
      type: "Link",
      title: "Procurement Portfolio",
      url: "https://cloud.lockated.com/index.php/apps/files/files/148141?dir=/Lockated%20Product%20Portfolio/Procurement%20or%20Contracts",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Procurement Portal Login",
      url: "https://procurement.lockated.com/",
      id: "demo.buyer@lockated.com",
      pass: "Procure#2026",
      icon: <Globe className="w-5 h-5" />,
    },
  ],
  owner: "Mangal Sahu",
  ownerImage: "/assets/product_owner/mangal_sahu.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "Procurement Management ERP" },
        {
          field: "One-Line Description",
          detail:
            "AI-powered end-to-end procure-to-pay platform digitizing procurement lifecycle from demand to payment",
        },
        {
          field: "Category",
          detail:
            "Enterprise Resource Planning - Procurement and Supply Chain Management",
        },
        {
          field: "Core Mission",
          detail:
            "Remove manual dependencies, improve transparency, reduce procurement cycle time by 40%, strengthen compliance, and provide complete traceability",
        },
        { field: "Geography", detail: "India - Primary, Global - Secondary" },
        {
          field: "Target Sectors",
          detail:
            "Real Estate, Construction, Manufacturing, Infrastructure, EPC, Logistics, Government",
        },
      ],
      problemSolves: [
        {
          painPoint: "Core Pain Point",
          solution:
            "Manual procurement processes cause 25-35% cost overruns, 60+ day payment cycles, and zero visibility into spend patterns",
        },
        {
          painPoint: "Data Sovereignty Gap",
          solution:
            "Indian enterprises lack locally compliant P2P solutions with GST, TDS, e-invoicing integration built natively",
        },
        {
          painPoint: "Switching Cost Trap",
          solution:
            "Legacy ERP vendors lock organizations with expensive customizations averaging INR 50-80 lakhs annually",
        },
        {
          painPoint: "Compliance Risk",
          solution:
            "Manual approval workflows create audit gaps exposing organizations to fraud and regulatory penalties",
        },
      ],
      whoItIsFor: [
        {
          role: "Procurement Manager",
          useCase:
            "Manage vendor sourcing, RFQ creation, bid comparison, PO generation",
          frustration:
            "Manual bid comparison takes 3-5 days, no real-time stock visibility",
          gain:
            "80% faster bid evaluation with AI-powered L1/L2/L3 ranking, live stock alerts",
        },
        {
          role: "Site/Project Manager",
          useCase:
            "Raise material indents, track delivery schedules, manage GRN",
          frustration:
            "Paper-based MORs get lost, no visibility on material arrival dates",
          gain:
            "Mobile MOR creation, QR-based tracking, auto-delivery schedule calculation",
        },
        {
          role: "Finance Controller",
          useCase:
            "Process invoices, manage advances, track payments, ensure compliance",
          frustration:
            "3-way matching done manually in spreadsheets, TDS calculations error-prone",
          gain:
            "Automated 3-way matching, GST-compliant billing, one-click TDS computation",
        },
      ],
      featureSummary: {
        modules: [
          {
            module: "Integrated Modules",
            description:
              "14 integrated modules covering: Master Setup (org, project, material, vendor masters), Engineering/BOQ (BOQ, rates, budget management), Procurement/Demand Management (MOR creation, approval workflows, stock visibility, auto-trigger), Internal Fulfilment (dead stock, ROPO mapping), Tendering (RFQ, auction, bid analytics with landed cost and reverse auction), Purchase Order (domestic, import, ROPO POs with full lifecycle), Security/Gate Management (gate pass, entry/exit, material-in notification), Stores (GRN, QC, stock control, RFID/QR tracking, dead stock discovery), Billing and Payment (3-way matching, bill booking, advance management, GST/e-invoicing), Audit Control and Intelligence (end-to-end traceability, action logs, spend analytics), Reporting and Control (dashboards, alerts, TAT monitoring), Integrations/Vendor Portal (vendor onboarding, quotation, PO acceptance, invoice submission). Upcoming P0 modules: Internal Fulfilment/MTO (cross-project transfers, inter-company material movement) and Service Contract/Work Order (SI creation, WO management, retention, BOQ for services).",
            isUSP: true,
          },
        ],
      },
      today: [
        {
          dimension: "Product Status",
          state:
            "Platform ready with 13 core modules; mobile apps in beta; AI bid analytics operational",
        },
        {
          dimension: "What Is Missing",
          state:
            "Advanced predictive analytics, multi-language support, offline-first mobile capability",
        },
        {
          dimension: "Competitive Moat",
          state:
            "Only India-built P2P with native GST/TDS compliance, BOQ-linked procurement, and construction-grade material tracking",
        },
        {
          dimension: "Key Markets",
          state:
            "Real estate developers, EPC contractors, manufacturing plants, government PSUs, infrastructure projects",
        },
        {
          dimension: "Revenue Model",
          state:
            "SaaS subscription (per user/month) plus implementation services; enterprise custom pricing available",
        },
        {
          dimension: "Investor Case",
          state:
            "USD 10.06B global market (2025) growing at 10% CAGR; India procurement software market underpenetrated with less than 15% enterprise adoption",
        },
      ],
    },
    rawMarketTable: procurementMarketTable,
    rawUseCasesTable: procurementUseCasesTable,
    detailedBusinessPlan: {
      isClubBusinessPlan: true,
      planQuestions: procurementBusinessPlanQuestions,
      checklist: procurementBusinessPlanChecklist,
    },
    detailedGTM: {
      targetGroups: [],
      sheet: procurementGtmSheet,
    },
    detailedMetrics: {
      clientImpact: [],
      businessTargets: [],
      sheet: procurementMetricsSheet,
    },
    detailedSWOT: procurementSwot,
    detailedRoadmap: {
      roadmapTableVariant: "html",
      structuredRoadmap: procurementStructuredRoadmap,
      enhancementRoadmap: procurementEnhancementRoadmap,
      top5Impact: procurementTop5Enhancements,
    },
    rawPricingSections: {
      title: "Features and Pricing Comparison",
      subtitle:
        "Feature-by-feature competitive analysis with pricing benchmarks and strategic positioning",
      sections: [
        {
          title: "Section 1: Feature Comparison Matrix",
          columns: [
            "Feature Category",
            "Our Product",
            "SAP Ariba",
            "Coupa",
            "Oracle",
            "Zycus",
            "TYASuite",
            "Status",
          ],
          rows: procurementFeatureComparisonRows,
        },
        {
          title: "Section 2: Competitive Position Summary",
          columns: ["Position", "Count", "Analysis"],
          rows: procurementCompetitivePositionRows,
        },
        {
          title: "Section 3: Pricing Landscape",
          columns: [
            "Pricing Tier",
            "Target Segment",
            "Price Range (INR/user/month)",
            "Price Range (USD/user/month)",
            "Included Features",
          ],
          rows: procurementPricingLandscapeRows,
        },
        {
          title: "Section 4: Value Propositions by Segment",
          columns: ["Segment", "Primary Value", "Secondary Value", "Proof Point"],
          rows: procurementValuePropositionRows,
        },
      ],
    },
    detailedFeatures: procurementDetailedFeatures,
  }
};

const ProcurementPage: React.FC = () => {
  return <BaseProductPage productData={procurementData} tabsVariant="snag360" />;
};

export default ProcurementPage;
