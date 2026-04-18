import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import {
  Globe,
  Video,
  FileText,
  Monitor,
  UserCheck,
  ShieldCheck,
  BarChart2,
  Bell,
  Users,
  DollarSign,
  Presentation,
  TrendingUp,
  ClipboardList,
  CheckSquare,
  Link,
  Star,
} from 'lucide-react';

/**
 * Vendor Management System (VMS / Vendor Portal)
 * ID: 11
 */
const vendorManagementData: ProductData = {
  /* ── Core identity ──────────────────────────────────────────────────────── */
  name: 'Vendor Management System',
  description:
    'Workflow-driven platform that digitizes vendor onboarding, compliance, re-KYC, assessment, and ERP integration in a single governed system.',
  brief:
    'Centralized vendor lifecycle platform for India-first enterprise operations. Replace fragmented, manual vendor handling with a controlled, auditable, and scalable vendor operations hub.',

  /* ── Excel-like layout flags ─────────────────────────────────────────────  */
  excelLikeSummary: false,   // use the rich structured summary path
  excelLikeFeatures: true,
  excelLikeMarket: true,
  excelLikePricing: false,
  excelLikeSwot: true,
  excelLikeRoadmap: true,
  excelLikeBusinessPlan: true,
  excelLikeGtm: true,
  excelLikeMetrics: true,
  excelLikePostPossession: true,

  /* ── User stories / feature overview ────────────────────────────────────── */
  userStories: [
    {
      title: 'Initiator / Admin Flow',
      items: [
        'Send vendor invitations by capturing GST, PAN, contact details, mobile number, and email.',
        'Track vendor invitation status for efficient follow-ups and escalations.',
        'Initiate Re-KYC requests to ensure vendor data remains current and compliant.',
        'Configure approval matrix with role-based levels per department and category.',
        'Monitor overall vendor compliance dashboard with GST defaulter alerts.',
      ],
    },
    {
      title: 'Vendor (Self-Service Portal)',
      items: [
        'Securely start registration via invitation link received on email.',
        'Submit comprehensive form (Bank, MSME, Turnover, Statutory documents) without manual intervention.',
        'Save, edit, and update profile for Re-KYC ensuring active compliance status.',
        'View PO/GRN/invoices and track payment status in real time.',
        'Submit bids for auction / tender events initiated by the organisation.',
        'Complete digital bid submission and re-KYC bidding workflow.',
      ],
    },
    {
      title: 'Approver & Validation Flow',
      items: [
        'Review registration details (Bank, MSME, Statutory docs) for compliant onboarding.',
        'Automated GST, PAN, and Bank details validation to avoid duplicates and flag defaulters.',
        'Configurable multi-level approval matrix with real-time status visibility and one-click reminders.',
        'Indirect/direct tax approval flow with automated GST defaulter flag.',
        'Full audit trail — role-based access control; configurable approval matrix with logs.',
      ],
    },
    {
      title: 'QA / Architecture / Dept Approver',
      items: [
        'Pre-qualification review and assessment scoring for new vendors.',
        'Compliance sign-off against statutory and department requirements.',
        'Weighted scoring engine for objective vendor comparison.',
        'My Assessments dashboard showing vendor-level assessment history.',
        'Separate assessment view ensuring no consolidated view fragmentation.',
      ],
    },
  ],

  industries:
    'Manufacturing, Real Estate, Infrastructure, Retail, Logistics, Healthcare — India primary',

  /* ── USPs ───────────────────────────────────────────────────────────────── */
  usps: [
    'USP 1: India-specific compliance — GST, PAN, IFSC validation built in, not bolted on.',
    'USP 2: Configurable approval matrix — department-level, multi-level, with one-click reminders.',
    'USP 3: Vendor self-service portal with PO/GRN/invoice view, digital bid submission, and re-KYC.',
    'USP 4: Competitive moat — vendor self-service portal with auction and full PO visibility that competitors lack.',
  ],

  /* ── Includes / Up-sell / Integrations ─────────────────────────────────── */
  includes: [
    'Vendor Onboarding & Master Data',
    'Vendor Self-Service Portal',
    'Vendor Performance & Assessment',
    'Compliance & Re-KYC Management',
    'Auction & Bid Management',
    'Compliance Dashboards',
  ],
  upSelling: [
    'Procurement Module',
    'ERP Integration (SAP / Oracle)',
    'AI-driven risk scoring (roadmap)',
    'Automated contract lifecycle (roadmap)',
    'NLP-based document extraction (roadmap)',
    'Mobile-first vendor app (roadmap)',
  ],
  integrations: ['SAP Hana', 'Salesforce (SFDC)', 'Bank APIs (IFSC/Account Validation)', 'GST Portal', 'PAN Verification API'],
  decisionMakers: ['Purchase Manager / HOD', 'Finance / Tax Teams', 'Admin / Governance Team', 'CFO', 'Accounts Payable'],
  keyPoints: [
    'Reduce vendor onboarding from 12–18 days to same-day digital flow.',
    'Eliminate manual GST checks — automated defaulter flagging.',
    'Configurable approval matrix with real-time status and one-click reminders.',
    'Full audit trail — role-based access control with configurable matrix logs.',
    'Vendor self-service portal with PO/GRN/invoice visibility and bid submission.',
  ],
  roi: [
    'Avg. 12–18 day onboarding reduced to < 2 days through digital workflow.',
    'Eliminated regulatory exposure from GST defaulter payments triggering recovery audits.',
    'Avg. 7–10 day approval cycle reduced to < 24 hours with automated routing.',
    'No single source of truth problems — duplicate vendors eliminated from procurement records.',
    'High internal admin load reduced by 60%+ via vendor self-service portal.',
  ],

  /* ── Assets ─────────────────────────────────────────────────────────────── */
  assets: [
    {
      type: 'Link',
      title: 'Resource Library',
      url: 'https://cloud.lockated.com/index.php/apps/files/files/148140?dir=/Lockated%20Product%20Portfolio/Vendor%20Management',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: 'Link',
      title: 'Supademo Walkthrough',
      url: 'https://app.supademo.com/showcase/cmb53n9t60158zi0ixtn1flw2?utm_source=link&demo=1&step=1',
      icon: <Video className="w-5 h-5" />,
    },
  ],

  /* ── Credentials ─────────────────────────────────────────────────────────  */
  credentials: [
    {
      title: 'Vendor Portal Sandbox',
      url: 'https://vendors.lockated.com/users/sign_in',
      id: 'demo.vendor@lockated.com',
      pass: 'Vendor@Sync2',
      icon: <Globe className="w-5 h-5" />,
    },
  ],

  owner: 'Ajay Ghenand',
  ownerImage: '/assets/product_owner/ajay_ghenand.jpeg',

  /* ══════════════════════════════════════════════════════════════════════════
     EXTENDED CONTENT — all tabs
  ══════════════════════════════════════════════════════════════════════════ */
  extendedContent: {

    /* ── Tab 1: Feature Summary (rich table) ───────────────────────────────── */
    featureSummary: (
      <div className="-m-4 overflow-x-auto">
        <table className="w-full border-collapse text-xs bg-white">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-[#D3D1C7] bg-white">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Users className="w-4 h-4 text-blue-500" /> Vendor Onboarding
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">
                Invitation-based onboarding via email link · GST, PAN, Bank detail capture · MSME, Turnover, Statutory document upload ·
                Automated GST/PAN/IFSC validation · No duplicate vendor registration · Re-KYC workflow for existing vendors
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-[#D3D1C7] bg-white">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <CheckSquare className="w-4 h-4 text-green-500" /> Approval & Compliance
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">
                Configurable multi-level approval matrix by department and category · Direct/indirect tax approval flows ·
                Automated GST defaulter flag · One-click escalation reminders · Full approval audit trail · Role-based access control
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-[#D3D1C7] bg-white">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Globe className="w-4 h-4 text-purple-400" /> Vendor Self-Service Portal
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">
                Vendor-facing secure portal · PO/GRN/Invoice view · Payment status tracking ·
                Bid submission for auctions/tenders · Re-KYC self-initiation · Document update and profile management
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-[#D3D1C7] bg-white">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <ClipboardList className="w-4 h-4 text-red-400" /> Assessment & Scoring
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">
                Pre-qualification review workflow · Weighted scoring engine for objective vendor comparison ·
                My Assessments dashboard · Vendor-level assessment history · Compliance sign-off tracking per department
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-[#D3D1C7] bg-white">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <BarChart2 className="w-4 h-4 text-orange-400" /> Analytics & Dashboards
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">
                Vendor compliance dashboard · GST defaulter monitoring · Invitation status tracking ·
                Approval cycle time analytics · Vendor master status reports · ERP integration status monitoring
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-[#D3D1C7] bg-white">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Bell className="w-4 h-4 text-yellow-500" /> Notifications & Escalations
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">
                Automated notifications for invitations, approvals, and Re-KYC requests ·
                Deadline-driven escalation alerts · GST defaulter payment warnings · Bid deadline reminders
              </td>
            </tr>
            <tr className="bg-white">
              <td className="w-1/4 p-3 border-r border-[#D3D1C7] bg-white">
                <div className="flex items-center gap-2 font-bold text-blue-700">
                  <ShieldCheck className="w-4 h-4 text-orange-400" /> ERP Integration (USP)
                </div>
              </td>
              <td className="w-3/4 p-3 text-blue-700 font-bold leading-relaxed">
                Live SAP Hana and Salesforce (SFDC) integration for vendor master synchronization.
                Vendor data validated and pushed to ERP without manual re-entry — eliminating duplicate vendor records
                that inflate procurement costs.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),

    /* ── Tab 2: Product Summary (structured — Section A, B, C, D from images) */
    productSummaryNew: {

      /* Section A: Product Overview */
      identity: [
        { field: 'Product Name',         detail: 'Vendor Management System (VMS / Vendor Portal)' },
        { field: 'Category',             detail: 'Enterprise Vendor Lifecycle Management SaaS' },
        { field: 'One-Line Description', detail: 'Workflow-driven platform that digitizes vendor onboarding, compliance, re-KYC, assessment, and ERP integration in a single governed system.' },
        { field: 'Core Mission',         detail: 'Replace fragmented, manual vendor handling with a controlled, auditable, and scalable vendor operations hub.' },
        { field: 'Geography',            detail: 'India — Primary | Global — Secondary' },
        { field: 'Revenue Model',        detail: 'SaaS subscription (per-seat or per-vendor tiered pricing); implementation and integration services' },
        { field: 'Deployment',           detail: 'Cloud-hosted SaaS; on-premise available for regulated industries' },
      ],

      /* Section B: The Problem It Solves */
      problemSolves: [
        {
          painPoint: 'Manual onboarding chaos',
          solution:
            'Current State: Vendors onboarded via emails, spreadsheets, and phone calls.\n' +
            'Business Impact: Avg 12–18 days per vendor; high error rate in GST and bank data.',
        },
        {
          painPoint: 'Compliance blind spots',
          solution:
            'Current State: No automated GST validation or statutory document checks.\n' +
            'Business Impact: Regulatory exposure; GST defaulter payments trigger recovery audits.',
        },
        {
          painPoint: 'Approval bottlenecks',
          solution:
            'Current State: Linear email approvals with no visibility or SLA tracking.\n' +
            'Business Impact: Avg 7–10 day approval cycle; repeat escalations to HODs.',
        },
        {
          painPoint: 'Fragmented vendor data',
          solution:
            'Current State: Vendor records split across SAP, email, and physical files.\n' +
            'Business Impact: No single source of truth; duplicate vendors inflate procurement cost.',
        },
        {
          painPoint: 'Zero vendor self-service',
          solution:
            'Current State: Vendors call or email to update details, check PO status.\n' +
            'Business Impact: High internal admin load; vendor dissatisfaction and delays.',
        },
      ],

      /* Section C: Who It Is For */
      whoItIsFor: [
        {
          role: 'Purchase Manager / HOD',
          useCase: 'Invite, approve, and manage vendors by category and department.',
          frustration: 'Approvals delayed by missing documents and email chains.',
          gain: 'Configurable approval matrix; real-time status visibility; one-click reminders.',
        },
        {
          role: 'Finance / Tax Teams',
          useCase: 'GST validation, statutory review, bank detail verification.',
          frustration: 'Manual GST checks; no alerts for defaulters.',
          gain: 'Automated GST defaulter flag; indirect/direct tax approval flow; configurable matrix with logs.',
        },
        {
          role: 'Vendor / Supplier',
          useCase: 'Self-onboard, complete re-KYC, view PO/GRN/invoices, submit bids.',
          frustration: 'No visibility into PO status or payment; cumbersome onboarding by phone.',
          gain: 'Self-service portal with PO/GRN/invoice view; digital bid submission; re-KYC from portal.',
        },
        {
          role: 'Admin / Governance Team',
          useCase: 'Role management, approval matrix configuration, audit access.',
          frustration: 'Cannot trace who approved what without digging through emails.',
          gain: 'Full audit trail; role-based access control; configurable matrix with logs.',
        },
        {
          role: 'QA / Architecture / Dept Approver',
          useCase: 'Pre-qualification review, assessment scoring, compliance sign-off.',
          frustration: 'Separate spreadsheets for assessment scoring; no consolidated view.',
          gain: 'Weighted scoring engine; My Assessments dashboard; vendor-level assessment history.',
        },
      ],

      /* Section D: Where We Are Today */
      today: [
        {
          dimension: 'Product Status',
          state:
            'Live — full feature set across onboarding, re-KYC, assessment, vendor self-service portal, SAP integration.',
        },
        {
          dimension: 'Key Markets',
          state:
            'Manufacturing, Real Estate, Infrastructure, Retail, Logistics, Healthcare — India primary.',
        },
        {
          dimension: 'Competitive Moat',
          state:
            'India-specific compliance (GST, PAN, IFSC validation); configurable approval matrix; vendor self-service portal with auction and PO visibility.',
        },
        {
          dimension: 'What Is Missing Now',
          state:
            'AI-driven risk scoring; automated contract lifecycle; NLP-based document extraction; mobile-first vendor app.',
        },
        {
          dimension: 'Investor / Partner Case',
          state:
            'VMS market growing at 15.1% CAGR; INR 1.13 lakh crore global market by 2026; India fast-growing at 13.2% APAC CAGR; Digital India tailwind for procurement automation.',
        },
      ],
    },

    /* ── Tab 3: Detailed Features (all 63 rows from feature list) ─────────── */
    detailedFeatures: [
      // ── Vendor Invitation & Onboarding ────────────────────────────────────
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Invitation Management',
        subFeatures: '* Department-based Invitation',
        works: 'Authorized users select department, vendor type, BP type, GST, state, city, payment terms, and contact info. System validates GSTIN on entry and routes invite to the correct category workflow. Email with secure onboarding link is auto-generated and dispatched.',
        userType: 'Purchase Manager',
        usp: true,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Invitation Management',
        subFeatures: '* Bulk Invite Capability',
        works: 'Users filter by department or category and select multiple vendors for bulk invite dispatch. Bulk actions include invite, resend, and status check. System tracks invite status per vendor in real time.',
        userType: 'Purchase Manager',
        usp: true,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Onboarding Workflow',
        subFeatures: '* Material Vendor Workflow',
        works: 'Dedicated flow for material vendors: vendor self-fills org, statutory, banking, and compliance fields. Routed to purchase, finance, and QA approvers sequentially per approval matrix. SAP push triggered on final approval.',
        userType: 'Purchase Manager / Finance',
        usp: true,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Onboarding Workflow',
        subFeatures: '* Services/FM Vendor Workflow',
        works: 'Billing/contract team initiates. Vendor completes portal form. Routes through billing, finance, and department approvers. Statutory and compliance review included. Approval logs maintained per section.',
        userType: 'Billing / Contract User',
        usp: true,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Onboarding',
        subFeatures: '* Self-Onboarding Portal',
        works: 'Vendor receives secure tokenized link. Completes org data, statutory data, bank details, and document uploads independently. Save-as-draft available. Submits for internal review. No internal user intervention required during fill.',
        userType: 'Vendor / Supplier',
        usp: true,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Onboarding',
        subFeatures: 'Save as Draft',
        works: 'Vendor can save partially completed onboarding form and return later. Drafts are retained per session and displayed in vendor\'s pending actions list. Time-stamped for tracking.',
        userType: 'Vendor / Supplier',
        usp: false,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Onboarding',
        subFeatures: '* Duplicate GST Detection',
        works: 'On GSTIN entry by vendor or internal user, system checks existing vendor master. Flags if GSTIN already exists. Prevents creation of duplicate vendor records. Shows existing vendor name and status.',
        userType: 'Purchase Manager',
        usp: true,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Onboarding',
        subFeatures: 'Field Validations',
        works: 'System validates PAN format, GSTIN checksum, IFSC code against RBI data, account number length and format, and PIN code against state/city. Inline error messages guide vendor correction before submission.',
        userType: 'Vendor / Supplier',
        usp: false,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Onboarding',
        subFeatures: 'Attachment Management',
        works: 'Vendors upload compliance documents (registration certificate, GST certificate, cancelled cheque, PAN card, etc.). System validates file format and size. Attachments linked to vendor record and visible to all approvers.',
        userType: 'Vendor / Supplier',
        usp: false,
      },
      {
        module: 'Vendor Invitation & Onboarding',
        feature: 'Vendor Onboarding',
        subFeatures: '* Pre-Qualification Trigger',
        works: 'On vendor category match, system auto-routes to pre-qualification flow before activation. Initiator notified. Vendor notified to expect pre-qualification steps. Pre-qual completion gates onboarding approval.',
        userType: 'Purchase Manager',
        usp: true,
      },
      // ── Pre-Qualification ─────────────────────────────────────────────────
      {
        module: 'Pre-Qualification',
        feature: 'Configuration',
        subFeatures: '* Question Bank Setup',
        works: 'Admin configures evaluation questions with scoring scale, weightage per question, and response options (Yes/No/Partial/NA). Questions can be grouped by category and department. Versioning supported.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Pre-Qualification',
        feature: 'Configuration',
        subFeatures: '* Department-wise Configuration',
        works: 'Different question sets and scoring rules configured for different departments (construction vs. IT vs. facilities). Ensures relevant evaluation criteria per vendor type and buying category.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Pre-Qualification',
        feature: 'Execution',
        subFeatures: '* Vendor Self-Assessment',
        works: 'Vendor receives pre-qualification form link. Completes self-evaluation with responses and optional supporting documents. Submits for internal review. Responses visible to all assigned reviewers.',
        userType: 'Vendor / Supplier',
        usp: true,
      },
      {
        module: 'Pre-Qualification',
        feature: 'Execution',
        subFeatures: '* Multi-level Approval',
        works: 'Pre-qualification reviewed by HOD, finance, QA/QC, architecture, or other configured approvers in sequence. Each level can approve, reject, or request clarification. Automated notification per step.',
        userType: 'QA-QC / Finance / HOD',
        usp: true,
      },
      {
        module: 'Pre-Qualification',
        feature: 'Outcome',
        subFeatures: 'Fail Handling',
        works: 'On rejection at any approval level, system auto-notifies vendor with rejection remarks and notifies initiator. Vendor record marked as pre-qualification failed. Initiator can re-invite with updated criteria.',
        userType: 'Purchase Manager',
        usp: false,
      },
      // ── GST & Compliance ──────────────────────────────────────────────────
      {
        module: 'GST & Compliance',
        feature: 'GST Verification',
        subFeatures: 'Manual GST Validation',
        works: 'Finance team views submitted GSTIN. Runs check via portal or manual process. Marks vendor as GST verified or GST defaulter with date and reviewer name logged. Result visible in vendor detail page.',
        userType: 'Finance User',
        usp: false,
      },
      {
        module: 'GST & Compliance',
        feature: 'GST Verification',
        subFeatures: '* GST Defaulter Handling',
        works: 'If vendor marked as GST defaulter, system triggers auto-rejection notification to vendor with reason. Initiator notified. Vendor record status updated to rejected. Admin can override with documented justification.',
        userType: 'Finance User',
        usp: true,
      },
      {
        module: 'GST & Compliance',
        feature: 'Statutory Validation',
        subFeatures: 'Tax Approvals',
        works: 'Indirect tax and direct tax approvers review vendor\'s submitted statutory documents and compliance data. Section-wise approval supported. All statutory data locked in vendor record for audit.',
        userType: 'Indirect / Direct Tax Approver',
        usp: false,
      },
      // ── Approval Workflow ─────────────────────────────────────────────────
      {
        module: 'Approval Workflow',
        feature: 'Approval Engine',
        subFeatures: '* Configurable Approval Matrix',
        works: 'Admin configures approval routing based on role, department, vendor type, vendor category, and business rules. Matrix supports parallel, sequential, and conditional routing. Updates to matrix take effect on new workflows immediately.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Approval Workflow',
        feature: 'Approval Engine',
        subFeatures: '* Section-wise Approvals',
        works: 'Onboarding and re-KYC forms divided into sections (org data, statutory, banking, compliance). Approvers can approve individual sections. Full form approval consolidated after all sections cleared. Reduces back-and-forth in complex approvals.',
        userType: 'All Approvers',
        usp: true,
      },
      {
        module: 'Approval Workflow',
        feature: 'Approval Engine',
        subFeatures: 'Maker-Checker Control',
        works: 'Initiator creates/submits; designated checker validates before forwarding to approvers. Two-step validation prevents unverified data from entering approval chain. Audit log captures maker and checker identities.',
        userType: 'Purchase Manager / Finance',
        usp: false,
      },
      {
        module: 'Approval Workflow',
        feature: 'Approval Logs',
        subFeatures: '* Audit Trail',
        works: 'Every approval action — approve, reject, request change, delegate — is logged with timestamp, user identity, section, and remarks. Audit log accessible to admin and governance team. Exportable for compliance audits.',
        userType: 'Admin / Governance',
        usp: true,
      },
      // ── Re-KYC ────────────────────────────────────────────────────────────
      {
        module: 'Re-KYC',
        feature: 'Re-KYC Initiation',
        subFeatures: '* User-Triggered Re-KYC',
        works: 'Authorized internal users initiate re-KYC for specific vendor. Select sections to update. System generates re-KYC request, sets expiry period, and sends vendor notification with secure update link.',
        userType: 'Purchase Manager / Admin',
        usp: true,
      },
      {
        module: 'Re-KYC',
        feature: 'Re-KYC Initiation',
        subFeatures: '* Vendor-Triggered Re-KYC',
        works: 'Vendor initiates request to update specific fields (contact, bank, GST) from their portal. Request submitted for internal review. Initiator notified. Approval matrix triggered based on sections updated.',
        userType: 'Vendor / Supplier',
        usp: true,
      },
      {
        module: 'Re-KYC',
        feature: 'Re-KYC Workflow',
        subFeatures: '* Section-wise Update',
        works: 'Vendor updates only the sections specified in re-KYC request. Other sections remain locked. Prevents unnecessary data changes. Section-specific approval routing applied.',
        userType: 'Vendor / Supplier',
        usp: true,
      },
      {
        module: 'Re-KYC',
        feature: 'Re-KYC Workflow',
        subFeatures: '* Expiry Handling',
        works: 'Re-KYC links expire after configured duration (e.g., 30 days). Expired links shown as expired status. Admin can extend or reissue. Vendor notified on link expiry with resend option.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Re-KYC',
        feature: 'Re-KYC Workflow',
        subFeatures: '* Reject/Cancel Handling',
        works: 'Internal users or admin can reject or cancel re-KYC requests with documented reasons. Rejection notifies vendor with remarks. Cancelled requests archived with reason log. Vendor record reverts to previous state.',
        userType: 'Purchase Manager',
        usp: true,
      },
      {
        module: 'Re-KYC',
        feature: 'Re-KYC Workflow',
        subFeatures: '* Change Log Tracking',
        works: 'All field-level changes in re-KYC captured in change log: previous value, new value, changed by, timestamp. Visible in vendor detail audit section. Enables full traceability of vendor data updates.',
        userType: 'Admin / Governance',
        usp: true,
      },
      {
        module: 'Re-KYC',
        feature: 'Re-KYC Workflow',
        subFeatures: '* Status Buckets',
        works: 'Re-KYC list shows status buckets: Pending, In Progress, Completed, Rejected, Expired, Cancelled. Dynamic counts per bucket. Filters apply across list and cards simultaneously.',
        userType: 'Purchase Manager',
        usp: true,
      },
      {
        module: 'Re-KYC',
        feature: 'Re-KYC Validation',
        subFeatures: 'Bank Detail Protection',
        works: 'Bank detail changes in re-KYC require separate approval step. Previous bank details preserved until new details are explicitly approved. Prevents accidental overwrites of payment account information.',
        userType: 'Finance User',
        usp: false,
      },
      // ── Vendor Assessment ─────────────────────────────────────────────────
      {
        module: 'Vendor Assessment',
        feature: 'Configuration',
        subFeatures: '* Assessment Frequency',
        works: 'Admin sets periodic assessment schedule per vendor category: monthly, quarterly, half-yearly, or annual. Assessment auto-created when period arrives. Auditor receives notification for pending assessment.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Configuration',
        subFeatures: '* Assessment Types',
        works: 'Separate assessment templates for product vendors, service vendors, consultants, and contractors. Each type has its own question set, scoring rules, and grading thresholds. Templates versioned and cloneable.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Configuration',
        subFeatures: '* Auditor Assignment',
        works: 'Admin assigns specific auditors to vendor categories or individual vendors. Multiple auditors supported per assessment. Each auditor sees only their own response until finalization. Final consolidated score computed after all responses.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Execution',
        subFeatures: '* My Assessments',
        works: 'Auditors see personalized assessment dashboard: Pending, In Progress, Completed assessments. Each card shows vendor name, due date, and completion percentage. One-click access to assessment form.',
        userType: 'QA-QC / Auditor',
        usp: true,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Execution',
        subFeatures: '* Vendor-level Assessment View',
        works: 'Within vendor detail page, authorized users see full assessment history: all periods, all scores, all auditor responses, grade trends over time. Downloadable for performance review meetings.',
        userType: 'Purchase Manager / HOD',
        usp: true,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Execution',
        subFeatures: 'Response Options',
        works: 'Assessment questions support Yes/No/N/A/Partial response options. Conditional follow-up questions supported for Partial responses. Attachments can be uploaded per question to support scoring.',
        userType: 'QA-QC / Auditor',
        usp: false,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Execution',
        subFeatures: 'Attachment Support',
        works: 'Auditors upload supporting documents or photographs for specific assessment criteria. Attached to individual question response. Visible to final reviewer during score consolidation.',
        userType: 'QA-QC / Auditor',
        usp: false,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Scoring',
        subFeatures: '* Weighted Scoring',
        works: 'Each question carries configured weightage. Final score computed as weighted average across all questions and auditors. Score displayed as percentage. Weightage visible to auditor during assessment.',
        userType: 'Admin / Auditor',
        usp: true,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Scoring',
        subFeatures: '* Percentage and Grading',
        works: 'Percentage score auto-converts to grade (A/B/C/D or Excellent/Good/Average/Poor) based on configured thresholds. Grade visible on vendor detail page and assessment dashboard. Historical grade trend tracked.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Vendor Assessment',
        feature: 'Scoring',
        subFeatures: 'Pending Logic',
        works: 'If any auditor has not submitted response, assessment remains pending. Final score not computed until all assigned auditors submit. Reminder triggered to pending auditors after configured interval.',
        userType: 'Admin',
        usp: false,
      },
      // ── Vendor Master ─────────────────────────────────────────────────────
      {
        module: 'Vendor Master',
        feature: 'Vendor Repository',
        subFeatures: '* Central Vendor Database',
        works: 'Single source of truth for all approved vendors. Searchable by name, GSTIN, category, department, and status. Displays current vendor status, last activity date, and key compliance flags. Admin and purchase teams have full access.',
        userType: 'Purchase Manager / Admin',
        usp: true,
      },
      {
        module: 'Vendor Master',
        feature: 'Vendor Details',
        subFeatures: '* Full Profile View',
        works: 'Tabbed vendor detail page showing org data, statutory data, banking details, approval history, re-KYC history, assessment history, attachments, audit logs. Authorized roles see sensitive sections; others see read-only view.',
        userType: 'Purchase Manager / Admin',
        usp: true,
      },
      {
        module: 'Vendor Master',
        feature: 'Vendor Details',
        subFeatures: 'Edit Controls',
        works: 'Editable sections restricted by role and vendor status. Active vendors allow selected field edits via re-KYC only. Admin can unlock specific sections for correction. All edits logged with user and timestamp.',
        userType: 'Admin',
        usp: false,
      },
      {
        module: 'Vendor Master',
        feature: 'Vendor Details',
        subFeatures: 'Resend Invite',
        works: 'Resend onboarding email to vendor directly from detail page. Useful for expired links or vendor email changes. Resend action logged. New link generated; previous link invalidated.',
        userType: 'Purchase Manager',
        usp: false,
      },
      {
        module: 'Vendor Master',
        feature: 'Vendor Details',
        subFeatures: '* SAP Push Trigger',
        works: 'Authorized users push approved vendor data to SAP from vendor detail page. System sends vendor master payload and receives SAP reference number. If push fails, error state and business state preserved — not overwritten.',
        userType: 'Admin / Purchase Manager',
        usp: true,
      },
      {
        module: 'Vendor Master',
        feature: 'Vendor Details',
        subFeatures: 'Document Storage',
        works: 'All compliance documents uploaded during onboarding, re-KYC, and assessment stored in vendor record. Role-based visibility. Bulk download option. Version history maintained when documents are updated.',
        userType: 'Admin / Finance',
        usp: false,
      },
      // ── Lists & Search ────────────────────────────────────────────────────
      {
        module: 'Lists & Search',
        feature: 'Vendor List',
        subFeatures: '* Advanced Search',
        works: 'Search vendors by name, GSTIN, company, category, department, and creation date range. Search updates list and status cards simultaneously. Results sorted latest-first by default.',
        userType: 'All Internal Users',
        usp: true,
      },
      {
        module: 'Lists & Search',
        feature: 'Vendor List',
        subFeatures: '* Dynamic Filters',
        works: 'Filter panel with department, vendor type, status, date range, and category filters. Applying filters updates list count and status card counts in real time. Filter state persisted within session.',
        userType: 'Purchase Manager',
        usp: true,
      },
      {
        module: 'Lists & Search',
        feature: 'Vendor List',
        subFeatures: '* Status Cards',
        works: 'Visual summary cards above list: Total, Pending, Approved, Rejected, Deactivated, In Progress. Click on card filters list to that status. Counts update as filters are applied.',
        userType: 'Purchase Manager / Admin',
        usp: true,
      },
      {
        module: 'Lists & Search',
        feature: 'Vendor List',
        subFeatures: 'Sorting',
        works: 'Default sort: latest activity first. User can switch to alphabetical, status-based, or date-of-creation sort. Sort state retained during session.',
        userType: 'All Internal Users',
        usp: false,
      },
      {
        module: 'Lists & Search',
        feature: 'Re-KYC List',
        subFeatures: '* Aging Filters',
        works: 'Filter re-KYC requests by age: 0-7 days, 8-30 days, 30-60 days, 60+ days. Helps prioritize overdue re-KYC actions. Age filters work with all active status filters.',
        userType: 'Purchase Manager',
        usp: true,
      },
      {
        module: 'Lists & Search',
        feature: 'Re-KYC List',
        subFeatures: '* Dynamic Card Updates',
        works: 'Re-KYC status cards update when filters applied: shows count of Pending, Completed, Expired, Rejected for current filter set. Enables workload prioritization.',
        userType: 'Purchase Manager',
        usp: true,
      },
      {
        module: 'Lists & Search',
        feature: 'Approval Queue',
        subFeatures: 'Pending Approvals View',
        works: 'Approvers see consolidated worklist of all pending approval actions across onboarding, re-KYC, and assessment. Sorted by age. One-click access to review and approve. Supports bulk approve for eligible items.',
        userType: 'All Approvers',
        usp: false,
      },
      // ── Notifications ─────────────────────────────────────────────────────
      {
        module: 'Notifications',
        feature: 'Email System',
        subFeatures: '* Event-based Notifications',
        works: 'Automated emails triggered for: vendor invitation sent, vendor submission received, approval action taken, rejection with remarks, re-KYC initiated, assessment assigned, SAP push status. All events configurable by admin.',
        userType: 'All Users',
        usp: true,
      },
      {
        module: 'Notifications',
        feature: 'Email System',
        subFeatures: '* Reminder Notifications',
        works: 'Auto reminders sent to vendors for incomplete onboarding after configured days. Reminders sent to approvers for pending approval actions past configured SLA. Admin can trigger manual reminders from list page.',
        userType: 'All Users',
        usp: true,
      },
      {
        module: 'Notifications',
        feature: 'Email System',
        subFeatures: 'Rejection Remarks',
        works: 'Rejection notifications include reviewer remarks so vendor understands reason for rejection. Remarks visible in email body. Vendor can respond or resubmit after correction.',
        userType: 'Vendor / Supplier',
        usp: false,
      },
      {
        module: 'Notifications',
        feature: 'Email System',
        subFeatures: 'Link-based Navigation',
        works: 'Email notifications include direct action links. Vendor clicks link to open specific form or section. Internal users click link to open relevant task. Links are tokenized and expire appropriately.',
        userType: 'All Users',
        usp: false,
      },
      // ── Reports & Dashboards ──────────────────────────────────────────────
      {
        module: 'Reports & Dashboards',
        feature: 'Dashboards',
        subFeatures: '* Vendor Commercial Dashboard',
        works: 'Business-level dashboard showing vendor spend visibility, payment outstanding by vendor, PO and GRN status by category, and department-wise vendor count. Clickable KPIs drill down to vendor list. Role-restricted.',
        userType: 'Finance / Purchase HOD',
        usp: true,
      },
      {
        module: 'Reports & Dashboards',
        feature: 'Dashboards',
        subFeatures: '* Assessment Dashboard',
        works: 'KPI dashboard for vendor performance: average score by category, grade distribution, pending assessments count, overdue assessments, top-performing and underperforming vendors. Drill-down to vendor assessment detail.',
        userType: 'QA-QC / Admin',
        usp: true,
      },
      {
        module: 'Reports & Dashboards',
        feature: 'Dashboards',
        subFeatures: '* Payment Tracking',
        works: 'Outstanding payment visibility per vendor: invoice submitted, invoice approved, payment due date, overdue count. Filter by vendor, department, and date range. Data sourced from integrated billing/SAP.',
        userType: 'Finance User',
        usp: true,
      },
      {
        module: 'Reports & Dashboards',
        feature: 'Reports',
        subFeatures: 'Export Reports',
        works: 'All list pages and dashboards support PDF and Excel export. Vendor master export includes all approved vendor details. Assessment report exportable per period. Re-KYC report exportable by status and date range.',
        userType: 'All Internal Users',
        usp: false,
      },
      // ── Integration ───────────────────────────────────────────────────────
      {
        module: 'Integration',
        feature: 'SAP Integration',
        subFeatures: '* Vendor Sync',
        works: 'Approved vendor data (org, statutory, banking) pushed to SAP vendor master. Push triggered manually or on final approval. SAP reference number returned and stored in vendor record. Push history logged.',
        userType: 'Admin',
        usp: true,
      },
      {
        module: 'Integration',
        feature: 'SAP Integration',
        subFeatures: '* Error Handling',
        works: 'SAP push failures captured with error code and message. Business state of vendor record preserved (not reset to draft). Admin notified. Retry push available after error resolution. Error log maintained per vendor.',
        userType: 'Admin',
        usp: true,
      },
    ],

    /* ── Tab 4: Market Analysis ──────────────────────────────────────────────
       Part 1 — Competitor Landscape (India Primary, Global Secondary)
       Part 2 — Top 10 Industries by VMS Relevance (India)
    ─────────────────────────────────────────────────────────────────────────── */
    detailedMarketAnalysis: {
      /* ── Part 1: Competitor Landscape ────────────────────────────────────── */
      competitors: [
        {
          name: 'SAP Ariba',
          hq: 'Germany / US',
          indiaPrice: 'INR 25–60 L+ (enterprise)',
          globalPrice: 'USD 40,000–200,000+',
          strength: 'Deep SAP ERP integration; global procurement suite',
          weakness: 'No India-specific GST/KYC workflow; extremely high cost',
          indiaPresence: 'Strong – large IT/manufacturing',
          targetSegment: 'Large Enterprise',
          differentiator2026: 'AI sourcing with HANA; 2025 Navi AI for spend analytics',
        },
        {
          name: 'Zycus iSupplier',
          hq: 'Mumbai, India',
          indiaPrice: 'INR 8–20 L/yr',
          globalPrice: 'USD 15,000–80,000',
          strength: 'India-origin; Merlin AI suite; IDC MarketScape leader 2025',
          weakness: 'No dedicated re-KYC or assessment module; weak vendor portal',
          indiaPresence: 'Very Strong – Mid to large enterprise',
          targetSegment: 'Mid to Large Enterprise',
          differentiator2026: 'Merlin AI for vendor risk; 70% faster approvals via Teams',
        },
        {
          name: 'SAP Fieldglass',
          hq: 'Germany / US',
          indiaPrice: 'INR 20–50 L/yr',
          globalPrice: 'USD 30,000–150,000',
          strength: 'Workforce/contractor VMS; SAP ecosystem',
          weakness: 'Contractor-focused; not designed for material vendor onboarding',
          indiaPresence: 'Moderate – multinationals',
          targetSegment: 'Enterprise / Contingent Workforce',
          differentiator2026: 'SOW-based project tracking; real-time compliance checks',
        },
        {
          name: 'Oracle Procurement Cloud',
          hq: 'US',
          indiaPrice: 'INR 15–40 L/yr',
          globalPrice: 'USD 25,000–100,000',
          strength: 'Oracle ERP native; strong analytics; global scale',
          weakness: 'Complex implementation; no India GST defaulter or re-KYC flow',
          indiaPresence: 'Moderate – large enterprises',
          targetSegment: 'Large Enterprise',
          differentiator2026: 'AI-driven spend visibility; embedded ESG reporting 2025',
        },
        {
          name: 'Coupa Software',
          hq: 'US',
          indiaPrice: 'INR 20–55 L/yr',
          globalPrice: 'USD 35,000–180,000',
          strength: 'Intelligent spend management; 2025 Navi multi-agent AI',
          weakness: 'Premium pricing; inconsistent local India support',
          indiaPresence: 'Limited – enterprise',
          targetSegment: 'Enterprise',
          differentiator2026: 'No-code AI agent workflow setup; IBM co-integration',
        },
        {
          name: 'Jaggaer',
          hq: 'US',
          indiaPrice: 'INR 6–18 L/yr',
          globalPrice: 'USD 12,000–60,000',
          strength: 'Acquired BravoSolution Jan 2025; strong compliance mgmt',
          weakness: 'No India-specific statutory validation; complex UI',
          indiaPresence: 'Moderate',
          targetSegment: 'SME to Mid-Enterprise',
          differentiator2026: 'Post-BravoSolution: stronger source-to-pay breadth',
        },
        {
          name: 'GEP SMART',
          hq: 'US / India',
          indiaPrice: 'INR 10–25 L/yr',
          globalPrice: 'USD 18,000–90,000',
          strength: 'India delivery; unified source-to-pay; strong analytics',
          weakness: 'Weak vendor self-service portal; no auction module',
          indiaPresence: 'Moderate – Mid to Large Enterprise',
          targetSegment: 'BPO/FMCG',
          differentiator2026: 'AI-powered procurement analytics; NLP contract analysis',
        },
        {
          name: 'Zoho Creator (VMS)',
          hq: 'Chennai, India',
          indiaPrice: 'INR 80K–3 L/yr',
          globalPrice: 'USD 1,200–8,000',
          strength: 'Highly affordable; no-code customization; Indian SME focus',
          weakness: 'No pre-qualification, re-KYC, or SAP integration',
          indiaPresence: 'Very Strong – SME',
          targetSegment: 'SME / Startup',
          differentiator2026: 'Drag-and-drop workflow; Zoho ecosystem integration',
        },
        {
          name: 'Kissflow Procurement',
          hq: 'Chennai, India',
          indiaPrice: 'INR 1.5–6 L/yr',
          globalPrice: 'USD 3,000–15,000',
          strength: 'Easy UI; no-code approvals; fast deployment for SME',
          weakness: 'No assessment engine, GST validation, or vendor portal',
          indiaPresence: 'Strong – SME to Mid-market',
          targetSegment: 'SME / Mid-Market',
          differentiator2026: 'AI process recommendations; WhatsApp approval notifications',
        },
        {
          name: 'TCS iON Procurement',
          hq: 'Mumbai, India',
          indiaPrice: 'INR 4–12 L/yr',
          globalPrice: 'USD 8,000–30,000',
          strength: 'Tata brand trust; regulated sector templates; public sector ready',
          weakness: 'Limited vendor self-service; limited SaaS flexibility',
          indiaPresence: 'Strong – PSUs/manufacturing',
          targetSegment: 'Public Sector / Manufacturing',
          differentiator2026: 'Pre-built compliance templates for pharma and infra',
        },
      ],
      competitorSummary:
        'VMS holds unique moat in India-specific GST/re-KYC compliance, configurable approval matrix, and vendor portal with PO/GRN/auction visibility. Only Zycus is a direct comparable in India mid-to-large market. SAP/Oracle too costly for most Indian enterprises.',

      /* ── Part 2: Top 10 Industries by VMS Relevance ──────────────────────── */
      topIndustries: [
        {
          rank: '1',
          industry: 'Manufacturing',
          indiaRelevance: 'Very High',
          vendorComplexity: 'High — 100–500+ vendors',
          keyVmsUseCase: 'Material vendor onboarding, QA pre-qualification, SAP sync',
          approxVendorCount: '200–800',
          complianceNeed: 'GST, ISO, statutory audits',
          growthDriver2026: 'China+1 sourcing shift; PLI scheme procurement scale-up',
          buyReason: 'Material vendor onboarding, QA pre-qualification, SAP sync | GST, ISO, statutory audits',
          scale: '200–800 vendors per org | Very High India relevance',
          decisionMaker: 'CFO / Purchase Manager',
          dealSize: '₹5–25L/yr',
        },
        {
          rank: '2',
          industry: 'Real Estate',
          indiaRelevance: 'Very High',
          vendorComplexity: 'High — mix of material+services',
          keyVmsUseCase: 'Services/FM vendor workflow, payment tracking, assessment',
          approxVendorCount: '150–600',
          complianceNeed: 'RERA compliance, subcontractor KYC',
          growthDriver2026: 'Urban infra boom; affordable housing projects scaling',
          buyReason: 'Services/FM vendor workflow, payment tracking, assessment | RERA compliance',
          scale: '150–600 vendors per org | Very High India relevance',
          decisionMaker: 'COO / CFO',
          dealSize: '₹3–15L/yr',
        },
        {
          rank: '3',
          industry: 'Infrastructure & EPC',
          indiaRelevance: 'High',
          vendorComplexity: 'Very High — multi-tier vendors',
          keyVmsUseCase: 'Multi-department approval matrix, subcontractor compliance',
          approxVendorCount: '300–1000',
          complianceNeed: 'PFMS, statutory, labour compliance',
          growthDriver2026: 'National infra pipeline 2026; NITI infra project awards',
          buyReason: 'Multi-department approval matrix, subcontractor compliance | PFMS, statutory',
          scale: '300–1,000 vendors per org | High India relevance',
          decisionMaker: 'VP Projects / CFO',
          dealSize: '₹8–30L/yr',
        },
        {
          rank: '4',
          industry: 'Retail & E-Commerce',
          indiaRelevance: 'High',
          vendorComplexity: 'High — supplier diversity',
          keyVmsUseCase: 'Bulk invite, vendor portal PO/GRN view, assessment',
          approxVendorCount: '100–400',
          complianceNeed: 'GST, FSSAI, product compliance',
          growthDriver2026: 'Quick commerce expansion; D2C supplier network growth',
          buyReason: 'Bulk invite, vendor portal PO/GRN view, assessment | GST, FSSAI compliance',
          scale: '100–400 vendors per org | High India relevance',
          decisionMaker: 'VP Procurement / CFO',
          dealSize: '₹3–12L/yr',
        },
        {
          rank: '5',
          industry: 'Logistics & Supply',
          indiaRelevance: 'High',
          vendorComplexity: 'Medium — fleet + service vendors',
          keyVmsUseCase: 'Services vendor workflow, compliance, payment visibility',
          approxVendorCount: '80–300',
          complianceNeed: 'Road transport, GST e-way bill',
          growthDriver2026: 'Dedicated freight corridor activation; 3PL growth',
          buyReason: 'Services vendor workflow, compliance, payment visibility | GST e-way bill',
          scale: '80–300 vendors per org | High India relevance',
          decisionMaker: 'COO / Procurement Head',
          dealSize: '₹2–8L/yr',
        },
        {
          rank: '6',
          industry: 'Healthcare & Pharma',
          indiaRelevance: 'High',
          vendorComplexity: 'High — regulated vendors',
          keyVmsUseCase: 'GST defaulter handling, statutory validation, audit trail',
          approxVendorCount: '100–500',
          complianceNeed: 'CDSCO, FDA, pharmacy licensing',
          growthDriver2026: 'Hospital network expansion; MedTech procurement growth',
          buyReason: 'GST defaulter handling, statutory validation, audit trail | CDSCO, FDA',
          scale: '100–500 vendors per org | High India relevance',
          decisionMaker: 'CFO / Compliance Head',
          dealSize: '₹4–15L/yr',
        },
        {
          rank: '7',
          industry: 'BFSI',
          indiaRelevance: 'Medium-High',
          vendorComplexity: 'Medium — IT + service vendors',
          keyVmsUseCase: 'Approval matrix, audit trail, vendor risk compliance',
          approxVendorCount: '50–200',
          complianceNeed: 'RBI vendor risk norms, SEBI',
          growthDriver2026: 'Cybersecurity vendor compliance mandates 2025–26',
          buyReason: 'Approval matrix, audit trail, vendor risk compliance | RBI norms, SEBI',
          scale: '50–200 vendors per org | Medium-High India relevance',
          decisionMaker: 'CTO / Compliance Head',
          dealSize: '₹3–10L/yr',
        },
        {
          rank: '8',
          industry: 'Hospitality & FM',
          indiaRelevance: 'Medium',
          vendorComplexity: 'High — high vendor turnover',
          keyVmsUseCase: 'FM vendor workflow, re-KYC, assessment scoring',
          approxVendorCount: '100–350',
          complianceNeed: 'FSSAI, fire safety, statutory',
          growthDriver2026: 'Post-COVID hospitality recovery; hotel chain expansion',
          buyReason: 'FM vendor workflow, re-KYC, assessment scoring | FSSAI, fire safety',
          scale: '100–350 vendors per org | Medium India relevance',
          decisionMaker: 'GM / Admin Head',
          dealSize: '₹2–8L/yr',
        },
        {
          rank: '9',
          industry: 'IT & Technology',
          indiaRelevance: 'Medium',
          vendorComplexity: 'Medium — global + local vendors',
          keyVmsUseCase: 'Onboarding speed, vendor portal, auction bidding',
          approxVendorCount: '60–200',
          complianceNeed: 'GDPR-adjacent data sharing',
          growthDriver2026: 'AI infrastructure procurement; cloud vendor onboarding',
          buyReason: 'Onboarding speed, vendor portal, auction bidding | GDPR-adjacent data sharing',
          scale: '60–200 vendors per org | Medium India relevance',
          decisionMaker: 'CTO / Vendor Manager',
          dealSize: '₹2–6L/yr',
        },
        {
          rank: '10',
          industry: 'Education & EdTech',
          indiaRelevance: 'Low-Medium',
          vendorComplexity: 'Medium — campus services vendors',
          keyVmsUseCase: 'Services vendor onboarding, approval, payment tracking',
          approxVendorCount: '50–150',
          complianceNeed: 'Education board norms, GST',
          growthDriver2026: 'NEP 2020 infra buildout; EdTech campus expansion',
          buyReason: 'Services vendor onboarding, approval, payment tracking | Education board norms',
          scale: '50–150 vendors per org | Low-Medium India relevance',
          decisionMaker: 'COO / Admin Head',
          dealSize: '₹1–4L/yr',
        },
      ],
    },
    detailedPricing: {
        /* ─── Section 1: Feature Comparison vs Top 6 Competitors ─────── */
        /* Status key: AHEAD = VMS leads | AT PAR = comparable | GAP = competitor leads */
        featuresVsMarket: [
          {
            featureArea: 'India GST Defaulter Handling',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'GAP' },
              { name: 'SAP Ariba',    status: 'GAP' },
              { name: 'GEP SMART',    status: 'GAP' },
              { name: 'Jaggaer',      status: 'GAP' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'AT PAR' },
            ],
          },
          {
            featureArea: 'Configurable Approval Matrix',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'AT PAR' },
              { name: 'GEP SMART',    status: 'AT PAR' },
              { name: 'Jaggaer',      status: 'AT PAR' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'AT PAR' },
              { name: 'TCS iON',      status: 'AT PAR' },
            ],
          },
          {
            featureArea: 'Section-wise Re-KYC',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'GAP' },
              { name: 'SAP Ariba',    status: 'GAP' },
              { name: 'GEP SMART',    status: 'GAP' },
              { name: 'Jaggaer',      status: 'GAP' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'Vendor Self-service Portal',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'AT PAR' },
              { name: 'GEP SMART',    status: 'AT PAR' },
              { name: 'Jaggaer',      status: 'GAP' },
              { name: 'Zoho Creator', status: 'AT PAR' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'Vendor Portal PO/GRN/Invoice View',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'AHEAD' },
              { name: 'GEP SMART',    status: 'GAP' },
              { name: 'Jaggaer',      status: 'GAP' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'Auction / Bid Submission Portal',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'AHEAD' },
              { name: 'GEP SMART',    status: 'AT PAR' },
              { name: 'Jaggaer',      status: 'AT PAR' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'Weighted Assessment with Grading',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'GAP' },
              { name: 'GEP SMART',    status: 'AT PAR' },
              { name: 'Jaggaer',      status: 'AT PAR' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'SAP Integration with Error Preservation',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'AHEAD' },
              { name: 'GEP SMART',    status: 'AT PAR' },
              { name: 'Jaggaer',      status: 'GAP' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'AT PAR' },
            ],
          },
          {
            featureArea: 'Pre-qualification with Score Engine',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'GAP' },
              { name: 'GEP SMART',    status: 'AT PAR' },
              { name: 'Jaggaer',      status: 'AT PAR' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'Duplicate GST Detection',
            vmsStatus: 'AHEAD',
            competitors: [
              { name: 'Zycus',        status: 'GAP' },
              { name: 'SAP Ariba',    status: 'GAP' },
              { name: 'GEP SMART',    status: 'GAP' },
              { name: 'Jaggaer',      status: 'GAP' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'AT PAR' },
            ],
          },
          {
            featureArea: 'AI-driven Risk Scoring',
            vmsStatus: 'GAP',
            competitors: [
              { name: 'Zycus',        status: 'AHEAD' },
              { name: 'SAP Ariba',    status: 'AHEAD' },
              { name: 'GEP SMART',    status: 'AHEAD' },
              { name: 'Jaggaer',      status: 'AT PAR' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'Contract Lifecycle Management',
            vmsStatus: 'GAP',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'AHEAD' },
              { name: 'GEP SMART',    status: 'AHEAD' },
              { name: 'Jaggaer',      status: 'AHEAD' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'AT PAR' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'Mobile App for Approvals',
            vmsStatus: 'GAP',
            competitors: [
              { name: 'Zycus',        status: 'AT PAR' },
              { name: 'SAP Ariba',    status: 'AT PAR' },
              { name: 'GEP SMART',    status: 'AT PAR' },
              { name: 'Jaggaer',      status: 'GAP' },
              { name: 'Zoho Creator', status: 'AT PAR' },
              { name: 'Kissflow',     status: 'AHEAD' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
          {
            featureArea: 'Spend Analytics Dashboard',
            vmsStatus: 'AT PAR',
            competitors: [
              { name: 'Zycus',        status: 'AHEAD' },
              { name: 'SAP Ariba',    status: 'AHEAD' },
              { name: 'GEP SMART',    status: 'AHEAD' },
              { name: 'Jaggaer',      status: 'AT PAR' },
              { name: 'Zoho Creator', status: 'GAP' },
              { name: 'Kissflow',     status: 'GAP' },
              { name: 'TCS iON',      status: 'GAP' },
            ],
          },
        ],

        /* ─── Section 2: Competitive Position Summary ────────────────── */
        comparisonSummary: {
          advantageAreas: [
            'India statutory compliance: GST defaulter, re-KYC, field validations',
            'Vendor self-service portal with PO/GRN/WO/invoice visibility',
            'Auction/bid submission module within vendor portal',
            'Configurable section-wise approvals and re-KYC',
          ],
          threatAreas: [
            'AI risk scoring: Zycus and SAP Ariba lead with predictive supplier risk',
            'Contract lifecycle: SAP Ariba and GEP SMART offer full CLM; VMS has none',
            'Mobile approvals: Kissflow WhatsApp; VMS browser-only currently',
            'Spend analytics: Coupa, GEP, Oracle outperform VMS in analytics depth',
          ],
          atPar: [
            'Approval workflow engine: VMS comparable to Zycus and GEP SMART',
            'Assessment engine: VMS comparable to Zycus and Jaggaer',
            'SAP integration: VMS on par with most except SAP native products',
            'Vendor portal: VMS comparable to SAP Ariba and Zycus',
          ],
          // Legacy fields preserved for backward compatibility
          ahead:
            'India statutory compliance: GST defaulter, re-KYC, field validations\n' +
            'Vendor self-service portal with PO/GRN/WO/invoice visibility\n' +
            'Auction/bid submission module within vendor portal\n' +
            'Configurable section-wise approvals and re-KYC',
          gaps:
            'AI risk scoring: Zycus and SAP Ariba lead with predictive supplier risk\n' +
            'Contract lifecycle: SAP Ariba and GEP SMART offer full CLM; VMS has none\n' +
            'Mobile approvals: Kissflow WhatsApp; VMS browser-only currently\n' +
            'Spend analytics: Coupa, GEP, Oracle outperform VMS in analytics depth',
        },

        /* ─── Section 3: Pricing Landscape (India Market) ────────────── */
        pricingLandscape: [
          {
            tier: 'Starter',
            orgSize: 'Mid-market (200–500 employees)',
            vendorCount: 'Up to 100 vendors',
            price: 'INR 3–6 L / yr',
            modules: 'Onboarding, Approval Matrix, Notifications, Basic Reports',
          },
          {
            tier: 'Growth',
            orgSize: 'Growing enterprise (500–2000 employees)',
            vendorCount: '100–500 vendors',
            price: 'INR 7–15 L / yr',
            modules: 'All Starter + Re-KYC, Assessment, Vendor Portal, SAP Integration',
          },
          {
            tier: 'Enterprise',
            orgSize: 'Large enterprise (2000+ employees)',
            vendorCount: '500+ vendors',
            price: 'INR 16–35 L / yr',
            modules: 'All Growth + Custom Matrix, Multi-entity, Advanced Dashboards, DMS',
          },
          {
            tier: 'Implementation',
            orgSize: 'All tiers',
            vendorCount: '-',
            price: 'INR 1.5–8 L (one-time)',
            modules: 'Configuration, data migration, training, go-live support',
          },
        ],

        /* ─── Section 4: Key Value Propositions ─────────────────────── */
        valuePropositions: [
          {
            proposition: 'Onboarding time reduction',
            quantifiedBenefit: '12–18 day manual process reduced to 3–5 days with automated validation and routing.',
            targetBuyer: 'Purchase HOD / Operations',
          },
          {
            proposition: 'Compliance risk elimination',
            quantifiedBenefit: 'GST defaulter auto-flag prevents erroneous payments; full audit trail for statutory reviews.',
            targetBuyer: 'CFO / Finance Head',
          },
          {
            proposition: 'Vendor enquiry reduction',
            quantifiedBenefit: 'Vendor self-service portal reduces inbound PO/payment status calls by 60–70%.',
            targetBuyer: 'Purchase Manager / Admin',
          },
          {
            proposition: 'Assessment accuracy',
            quantifiedBenefit: 'Weighted scoring eliminates manual spreadsheet errors; auditor isolation prevents score bias.',
            targetBuyer: 'QA-QC / Governance',
          },
          {
            proposition: 'SAP data integrity',
            quantifiedBenefit: 'Error-preserving SAP push prevents incorrect vendor master state; reduces IT correction effort.',
            targetBuyer: 'IT / ERP Team',
          },
        ],

      },
      detailedUseCases: {
        industryUseCases: [
          {
            rank: '1',
            industry: 'Manufacturing',
            primaryUser: 'Purchase Manager + QA-QC',
            corePainPoint:
              'Onboarding 200-500 material vendors manually causes duplicate vendor codes, missing GST docs, and SAP data errors.',
            features:
              'Material Vendor Workflow, Duplicate GST Detection, Pre-Qualification Trigger, Weighted Scoring, SAP Push Trigger, Audit Trail',
            workflow:
              '1. Purchase Manager invites vendor with department and BP type. 2. Duplicate GST Detection blocks if vendor exists. 3. Pre-Qualification Trigger routes to QA assessment. 4. Vendor completes self-assessment. 5. HOD and QA approve. 6. Finance validates GST. 7. Final approval triggers SAP Push. 8. SAP reference number logged.',
            outcome:
              'Vendor onboarding from 15 days to 4 days; zero duplicate vendor codes; SAP master accuracy improved.',
            useCase:
              'Replacing spreadsheet-driven material vendor onboarding with a governed, audit-ready workflow tied to QA assessment and SAP push.',
            profile: 'Manufacturing firms with 200-500 active material vendors.',
            currentTool: 'Excel, email, SAP master maintenance.',
          },
          {
            rank: '2',
            industry: 'Real Estate & Construction',
            primaryUser: 'Billing / Contract User + Finance',
            corePainPoint:
              'Services and FM vendors managed over email, leading to delayed approvals and compliance gaps for RERA audits.',
            features:
              'Services/FM Vendor Workflow, Section-wise Approvals, Re-KYC, Audit Trail, Export Reports, Payment Tracking',
            workflow:
              '1. Billing team invites FM vendor. 2. Vendor self-onboards. 3. Billing, finance, and legal approve in sequence. 4. Vendor activated. 5. Re-KYC initiated annually. 6. Assessment scored quarterly. 7. Payment dashboard tracks outstanding per vendor.',
            outcome:
              'Full RERA-compliant vendor trail; annual re-KYC reduces stale data; payment visibility reduces disputes.',
            useCase:
              'Digitizing contractor and FM vendor onboarding to remove paper approvals and improve compliance tracking.',
            profile: 'Developers and construction firms managing contractor and FM vendors.',
            currentTool: 'Email, WhatsApp, physical files, Tally.',
          },
          {
            rank: '3',
            industry: 'Infrastructure & EPC',
            primaryUser: 'Purchase HOD + QA',
            corePainPoint:
              'Multi-tier subcontractor compliance impossible without centralized records. Labour compliance and statutory docs scattered.',
            features:
              'Configurable Approval Matrix, Multi-level Approval, Attachment Management, Audit Trail, Assessment Types',
            workflow:
              '1. Each subcontractor invited by department. 2. Approval matrix routes by vendor category and department. 3. Labour compliance docs uploaded. 4. QA and architecture pre-qualify. 5. Quarterly performance assessment. 6. All actions logged.',
            outcome:
              'Subcontractor compliance centralized; statutory docs retrievable in seconds for audit; assessment drives vendor retention decisions.',
            useCase:
              'Centralizing subcontractor compliance and qualification across complex EPC approval chains.',
            profile: 'EPC and infrastructure firms managing multiple subcontractor categories.',
            currentTool: 'Shared drives, email, spreadsheets, ERP master edits.',
          },
          {
            rank: '4',
            industry: 'Retail & E-commerce',
            primaryUser: 'Purchase Manager + Finance',
            corePainPoint:
              'Onboarding hundreds of suppliers across categories with product compliance, FSSAI, and GST validation handled manually.',
            features:
              'Bulk Invite Capability, Duplicate GST Detection, Field Validations, Status Cards, Event-based Notifications, Assessment Dashboard',
            workflow:
              '1. Bulk invite dispatched to supplier group. 2. System validates GSTIN and PAN for all. 3. Suppliers self-onboard by category. 4. Finance validates GST. 5. Status cards track approval progress. 6. Annual assessment scored per supplier.',
            outcome:
              'Supplier onboarding scaled to hundreds without headcount increase; GST defaulters blocked before payment.',
            useCase:
              'Scaling supplier onboarding without adding manual compliance and approval overhead.',
            profile: 'Retailers and e-commerce supply chains with large supplier bases.',
            currentTool: 'Excel trackers, email approvals, ERP vendor list.',
          },
          {
            rank: '5',
            industry: 'Logistics & Supply Chain',
            primaryUser: 'Finance',
            corePainPoint:
              'Fleet and service vendor re-KYC not triggered on time; bank data and GST updates missed, causing payment rejections.',
            features:
              'Aging Filters, Re-KYC Initiation, Expiry Handling, Change Log Tracking, Status Buckets, Reminder Notifications',
            workflow:
              '1. Aging filter identifies vendors with re-KYC overdue. 2. Admin triggers re-KYC with section selection. 3. Vendor updates bank and GST via portal. 4. Finance approves. 5. Change log records all field updates. 6. Reminders auto-sent until completion.',
            outcome:
              'Payment rejections from stale bank data eliminated; re-KYC completion rate improved from 40% to 90%.',
            useCase:
              'Keeping transport and service vendor records continuously compliant and payment-ready.',
            profile: 'Logistics networks with fleet, contract, and service vendors.',
            currentTool: 'Finance follow-up by email and spreadsheets.',
          },
          {
            rank: '6',
            industry: 'Healthcare & Pharma',
            primaryUser: 'Finance + QA',
            corePainPoint:
              'Medical device and pharma suppliers require CDSCO and FDA compliance verification before activation. Manual process misses renewals.',
            features:
              'GST Defaulter Handling, Attachment Management, Multi-level Approval, Audit Logs, Assessment Frequency, Export Reports',
            workflow:
              '1. Supplier invited with compliance category. 2. CDSCO/FDA license uploaded during onboarding. 3. Finance validates GST and statutory. 4. QA pre-qualifies on technical criteria. 5. Periodic assessment tracks license renewal. 6. Full audit log exported for regulatory review.',
            outcome:
              'Zero compliance lapses with certified suppliers; assessment tracks license renewal dates; export supports regulatory submissions.',
            useCase:
              'Ensuring regulated suppliers are onboarded only after document and technical checks are complete.',
            profile: 'Healthcare and pharma operators managing certified vendors.',
            currentTool: 'Manual document checks, email trails, shared folders.',
          },
          {
            rank: '7',
            industry: 'BFSI',
            primaryUser: 'Finance + Admin',
            corePainPoint:
              'IT and service vendor risk management mandated by RBI outsourcing guidelines. No centralized vendor risk trail.',
            features:
              'Configurable Approval Matrix, Audit Trail, Governance RBAC, Re-KYC, Assessment Dashboard, Export Reports',
            workflow:
              '1. IT vendor onboarded with RBI-specific approval chain. 2. Risk assessment configured per RBI criteria. 3. Annual re-KYC refreshes vendor data. 4. Audit log maintained per record-keeping requirement. 5. Assessment scores vendor risk annually. 6. Compliance report exported for RBI submission.',
            outcome:
              'RBI audit-ready vendor records maintained; vendor risk assessment scored and documented; re-KYC trail satisfies outsourcing norms.',
            useCase:
              'Creating an auditable third-party vendor governance process for regulated financial institutions.',
            profile: 'Banks and financial services firms with strict vendor governance requirements.',
            currentTool: 'Manual approvals, spreadsheets, archived email records.',
          },
          {
            rank: '8',
            industry: 'Hospitality & FM',
            primaryUser: 'Billing / Contract + QA',
            corePainPoint:
              'FM vendor assessments done verbally via paper forms. No scoring trail. High vendor churn creates repeated onboarding effort.',
            features:
              'Services/FM Vendor Workflow, Vendor Self-assessment, Weighted Scoring, Percentage Grading, Reset Invite, Vendor Commercial Dashboard',
            workflow:
              '1. FM vendors onboarded via services workflow. 2. Quarterly performance assessments assigned. 3. Auditor scores via weighted criteria. 4. Grades auto-computed. 5. Underperforming vendors flagged. 6. Commercial dashboard tracks spend vs grade.',
            outcome:
              'FM vendor performance objectively scored; poor performers identified before contract renewal; vendor data reused on re-invite.',
            useCase:
              'Standardizing service-vendor onboarding and performance measurement across hospitality and FM operations.',
            profile: 'Facility-heavy businesses with recurring FM and service vendor churn.',
            currentTool: 'Paper forms, verbal review, spreadsheets.',
          },
          {
            rank: '9',
            industry: 'IT & Technology',
            primaryUser: 'Purchase Manager + Admin',
            corePainPoint:
              'Global and local software vendors onboarded slowly; no vendor portal for bid comparison; duplicate vendor codes in SAP.',
            features:
              'Self-Onboarding Portal, Duplicate GST Detection, Auction Participation (View/Submit/Track), SAP Push Trigger, Notifications',
            workflow:
              '1. Vendor receives self-onboarding link. 2. Vendor completes org and compliance data. 3. Duplicate check blocks repeat. 4. Admin approves. 5. SAP sync completes. 6. Vendor invited to RFQ auction. 7. Bid submitted via portal. 8. Outcome tracked.',
            outcome:
              'RFQ process fully digital; vendor onboarding without internal user involvement; SAP data clean.',
            useCase:
              'Combining vendor onboarding and RFQ participation in one controlled portal flow.',
            profile: 'Tech businesses onboarding software, hardware, and services vendors.',
            currentTool: 'Email RFQs, spreadsheets, SAP vendor creation.',
          },
          {
            rank: '10',
            industry: 'Education & EdTech',
            primaryUser: 'Admin Manager + Finance',
            corePainPoint:
              'Campus service vendors (canteen, security, transport) onboarded ad-hoc. No compliance record. Payment approval by email.',
            features:
              'Services/FM Vendor Workflow, Field Validations, Approval Queue, Payment Tracking, Reminder Notifications, Vendor Portal Alerts',
            workflow:
              '1. Campus team invites service vendor. 2. Vendor self-onboards. 3. Finance and admin approve. 4. Reminder sent for pending approvals. 5. Payment outstanding tracked per vendor. 6. Vendor receives portal alerts on payment status.',
            outcome:
              'Campus vendor records centralized; no missed approvals; payment outstanding tracked department-by-department.',
            useCase:
              'Bringing campus service vendors into a single, trackable compliance and payment workflow.',
            profile: 'Educational campuses with recurring outsourced service vendors.',
            currentTool: 'Ad-hoc email approvals and disconnected records.',
          },
        ],
        internalTeamUseCases: [
          {
            team: 'Purchase Team',
            howTheyUse: 'Day-to-day vendor invitations',
            features: 'Vendor Invitation, Material Workflow, Approval Queue, SAP Push, Status Cards',
            benefit: 'Reduced manual follow-up; full pipeline visibility; one-click SAP sync',
            process: 'Day-to-day vendor invitations',
          },
          {
            team: 'Finance Team',
            howTheyUse: 'GST validation, statutory document checks',
            features: 'GST Defaulter Handling, Tax Approvals, Bank Detail Protection, Payment Tracking',
            benefit: 'Compliance enforced before payment; no erroneous GST defaulter payments',
            process: 'GST validation, statutory document checks',
          },
          {
            team: 'QA / Architecture',
            howTheyUse: 'Pre-qualification reviews, assessment',
            features: 'Pre-Qualification, Assessment Types, Weighted Scoring, My Assessments',
            benefit: 'Objective vendor scoring; all assessment history in one place',
            process: 'Pre-qualification reviews, assessment',
          },
          {
            team: 'Governance / Admin',
            howTheyUse: 'User role management, validation rules',
            features: 'RBAC, Configurable Matrix, Audit Trail, Validation Rules',
            benefit: 'Full traceability; instant audit readiness; zero unauthorized access',
            process: 'User role management, validation rules',
          },
          {
            team: 'HR / Facility Management',
            howTheyUse: 'FM and contractor vendor onboarding',
            features: 'Services/FM Workflow, Re-KYC Initiation, Aging Filters, Assessment Dashboard',
            benefit: 'FM vendor compliance automated; re-KYC tracked without manual reminders',
            process: 'FM and contractor vendor onboarding',
          },
          {
            team: 'IT / ERP Team',
            howTheyUse: 'SAP integration monitoring, error handling',
            features: 'SAP Push Trigger, SAP Error Handling, DMS Sync, RBAC',
            benefit: 'SAP data integrity maintained; push failures resolved without business state loss',
            process: 'SAP integration monitoring, error handling',
          },
        ],
      },
      detailedRoadmap: {
        structuredRoadmap: [
          {
            timeframe: 'Phase 1',
            headline: 'Stabilize & Optimize',
            colorContext: 'blue',
            summary:
              'Phase 1 (Q2-Q3 2026): 6 deliverables | Target segments: Manufacturing, Real Estate, Infra, Retail, BFSI, Healthcare | Est. ARR impact: INR 50L-2Cr per phase',
            items: [
              {
                phaseLabel: 'Phase 1 (Q2-Q3 2026)',
                theme: 'Stabilize & Optimize',
                featureName: 'Mobile-responsive vendor portal',
                whatItIs: 'Full mobile optimization of vendor portal for onboarding, re-KYC, PO view, and bid actions.',
                whyItMatters: 'Reduces mobile drop-offs; key for field-based vendor teams',
                unlockedSegment: 'Manufacturing, Retail',
                priority: 'High',
                estTimeline: 'Q2 2026',
                revenueImpact: 'Reduces mobile drop-offs; key for field-based vendor teams',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 1 (Q2-Q3 2026)',
                theme: 'Stabilize & Optimize',
                featureName: 'WhatsApp / SMS approval notifications',
                whatItIs: 'Approvers receive WhatsApp or SMS alerts for pending actions with direct approval link.',
                whyItMatters: 'Increase approval speed by 40%; reduce escalations',
                unlockedSegment: 'All Segments',
                priority: 'High',
                estTimeline: 'Q2 2026',
                revenueImpact: 'Increase approval speed by 40%; reduce escalations',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 1 (Q2-Q3 2026)',
                theme: 'Stabilize & Optimize',
                featureName: 'Bulk re-KYC trigger',
                whatItIs: 'Admin triggers re-KYC for hundreds of late vendors simultaneously by category or date.',
                whyItMatters: 'Reduces 20+ hour manual re-KYC initiation to minutes',
                unlockedSegment: 'Large Enterprise',
                priority: 'Medium',
                estTimeline: 'Q2 2026',
                revenueImpact: 'Reduces 20+ hour manual re-KYC initiation to minutes',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 1 (Q2-Q3 2026)',
                theme: 'Stabilize & Optimize',
                featureName: 'Assessment reminder automation',
                whatItIs: 'Auto-escalation to HOD if auditor misses assessment deadline after 2 reminders.',
                whyItMatters: 'Eliminates pending assessments backlog',
                unlockedSegment: 'QA-heavy industries',
                priority: 'Medium',
                estTimeline: 'Q3 2026',
                revenueImpact: 'Eliminates pending assessments backlog',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 1 (Q2-Q3 2026)',
                theme: 'Stabilize & Optimize',
                featureName: 'Enhanced SAP error log dashboard',
                whatItIs: 'Dedicated dashboard showing all SAP push failures with retry, status, and resolution log.',
                whyItMatters: 'Reduces IT coordination effort for SAP sync failures',
                unlockedSegment: 'SAP-integrated enterprises',
                priority: 'High',
                estTimeline: 'Q3 2026',
                revenueImpact: 'Reduces IT coordination effort for SAP sync failures',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 1 (Q2-Q3 2026)',
                theme: 'Stabilize & Optimize',
                featureName: 'Vendor portal performance dashboard',
                whatItIs: 'Vendors see their own assessment grades, PO volume trend, and payment history chart.',
                whyItMatters: 'Improves vendor engagement and reduces support queries',
                unlockedSegment: 'All Vendors',
                priority: 'Medium',
                estTimeline: 'Q3 2026',
                revenueImpact: 'Improves vendor engagement and reduces support queries',
                effort: '',
                owner: '',
              },
            ],
          },
          {
            timeframe: 'Phase 2',
            headline: 'Scale & Integrate',
            colorContext: 'blue',
            summary:
              'Phase 2 (Q4 2026-Q1 2027): 6 deliverables | Target segments: Manufacturing, Real Estate, Infra, Retail, BFSI, Healthcare | Est. ARR impact: INR 50L-2Cr per phase',
            items: [
              {
                phaseLabel: 'Phase 2 (Q4 2026-Q1 2027)',
                theme: 'Scale & Integrate',
                featureName: 'Multi-entity / multi-branch support',
                whatItIs: 'Single VMS instance supports multiple company entities or branch offices with shared governance.',
                whyItMatters: 'Key enterprise sales unlock; addresses holding company structures',
                unlockedSegment: 'Real Estate, Infra, Retail chains',
                priority: 'High',
                estTimeline: 'Q4 2026',
                revenueImpact: 'Key enterprise sales unlock; addresses holding company structures',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 2 (Q4 2026-Q1 2027)',
                theme: 'Scale & Integrate',
                featureName: 'GST API auto-validation',
                whatItIs: 'Real-time GSTIN validation via GST government API instead of manual finance checks.',
                whyItMatters: 'Eliminates manual GST verification step; reduces onboarding by 1-2 days',
                unlockedSegment: 'All Industries',
                priority: 'High',
                estTimeline: 'Q4 2026',
                revenueImpact: 'Eliminates manual GST verification step; reduces onboarding by 1-2 days',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 2 (Q4 2026-Q1 2027)',
                theme: 'Scale & Integrate',
                featureName: 'Contract lifecycle module (basic)',
                whatItIs: 'Create, upload, and track vendor contracts with expiry alerts and renewal workflow.',
                whyItMatters: 'Closes major product gap vs. SAP Ariba and GEP SMART',
                unlockedSegment: 'BFSI, Healthcare, Infra',
                priority: 'High',
                estTimeline: 'Q1 2027',
                revenueImpact: 'Closes major product gap vs. SAP Ariba and GEP SMART',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 2 (Q4 2026-Q1 2027)',
                theme: 'Scale & Integrate',
                featureName: 'Advanced analytics dashboard',
                whatItIs: 'Cross-vendor spend analytics, onboarding TAT trends, approval SLA monitoring.',
                whyItMatters: 'Elevates product from operational tool to strategic decision layer',
                unlockedSegment: 'Finance HOD / COO',
                priority: 'Medium',
                estTimeline: 'Q4 2026',
                revenueImpact: 'Elevates product from operational tool to strategic decision layer',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 2 (Q4 2026-Q1 2027)',
                theme: 'Scale & Integrate',
                featureName: 'Tally / QuickBooks integration',
                whatItIs: 'Push approved vendor data to Tally Prime and QuickBooks for SME / mid-market finance teams.',
                whyItMatters: 'Opens SME segment currently limited by SAP-only integration',
                unlockedSegment: 'SME / Mid-Market',
                priority: 'Medium',
                estTimeline: 'Q1 2027',
                revenueImpact: 'Opens SME segment currently limited by SAP-only integration',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 2 (Q4 2026-Q1 2027)',
                theme: 'Scale & Integrate',
                featureName: 'Vendor portal mobile app (Android/iOS)',
                whatItIs: 'Dedicated native mobile app for vendor portal with offline form-fill and push notifications.',
                whyItMatters: 'Competitive parity with Kissflow; key for high-volume vendor engagement',
                unlockedSegment: 'All Vendors',
                priority: 'High',
                estTimeline: 'Q1 2027',
                revenueImpact: 'Competitive parity with Kissflow; key for high-volume vendor engagement',
                effort: '',
                owner: '',
              },
            ],
          },
          {
            timeframe: 'Phase 3',
            headline: 'Differentiate with AI',
            colorContext: 'blue',
            summary:
              'Phase 3 (Q2 2027-Q4 2027): 6 deliverables | Target segments: Manufacturing, Real Estate, Infra, Retail, BFSI, Healthcare | Est. ARR impact: INR 50L-2Cr per phase',
            items: [
              {
                phaseLabel: 'Phase 3 (Q2 2027-Q4 2027)',
                theme: 'Differentiate with AI',
                featureName: 'AI vendor risk scoring',
                whatItIs: 'LLM-powered risk score per vendor using onboarding data, assessment history, GST flags, and payment behavior.',
                whyItMatters: 'Leapfrog Jaggaer; partial parity with Zycus Merlin AI',
                unlockedSegment: 'BFSI, Healthcare, Infra',
                priority: 'High',
                estTimeline: 'Q2 2027',
                revenueImpact: 'Leapfrog Jaggaer; partial parity with Zycus Merlin AI',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 3 (Q2 2027-Q4 2027)',
                theme: 'Differentiate with AI',
                featureName: 'NLP document extraction',
                whatItIs: 'Auto-extract GST number, PAN, IFSC from uploaded documents using OCR and NLP.',
                whyItMatters: 'Reduces vendor onboarding form-fill time by 60%',
                unlockedSegment: 'All Industries',
                priority: 'High',
                estTimeline: 'Q2 2027',
                revenueImpact: 'Reduces vendor onboarding form-fill time by 60%',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 3 (Q2 2027-Q4 2027)',
                theme: 'Differentiate with AI',
                featureName: 'Predictive assessment scoring',
                whatItIs: 'ML model predicts vendor assessment grade based on historical patterns; flags at-risk suppliers.',
                whyItMatters: 'Differentiates assessment module from all Indian competitors',
                unlockedSegment: 'Manufacturing, QA teams',
                priority: 'Medium',
                estTimeline: 'Q3 2027',
                revenueImpact: 'Differentiates assessment module from all Indian competitors',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 3 (Q2 2027-Q4 2027)',
                theme: 'Differentiate with AI',
                featureName: 'Automated re-KYC scheduling',
                whatItIs: 'AI suggests re-KYC timing based on vendor risk score and last update date; auto-creates campaigns.',
                whyItMatters: 'Eliminates manual re-KYC calendar management',
                unlockedSegment: 'Finance / Admin',
                priority: 'Medium',
                estTimeline: 'Q3 2027',
                revenueImpact: 'Eliminates manual re-KYC calendar management',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 3 (Q2 2027-Q4 2027)',
                theme: 'Differentiate with AI',
                featureName: 'Vendor health index',
                whatItIs: 'Composite score combining compliance, assessment grade, GST status, and payment behavior.',
                whyItMatters: 'Single number vendor risk view for strategic decisions',
                unlockedSegment: 'Purchase HOD / Finance',
                priority: 'High',
                estTimeline: 'Q4 2027',
                revenueImpact: 'Single number vendor risk view for strategic decisions',
                effort: '',
                owner: '',
              },
              {
                phaseLabel: 'Phase 3 (Q2 2027-Q4 2027)',
                theme: 'Differentiate with AI',
                featureName: 'ESG vendor compliance module',
                whatItIs: 'Track ESG-related vendor disclosures (carbon, labour, diversity) with export-ready reports.',
                whyItMatters: 'SEBI BRSR compliance need for FY2027-28; emerging buyer requirement',
                unlockedSegment: 'Large Enterprise / Listed Cos',
                priority: 'Medium',
                estTimeline: 'Q4 2027',
                revenueImpact: 'SEBI BRSR compliance need for FY2027-28; emerging buyer requirement',
                effort: '',
                owner: '',
              },
            ],
          },
        ],
        enhancementRoadmap: [
          {
            rowId: '1',
            featureName: '* AI Vendor Risk Score',
            category: 'AI/LLM',
            description: 'LLM model ingests onboarding data, assessment history, GST compliance record, payment behavior, and external news signals to generate a 0-100 risk score per vendor with explainable factors.',
            targetUser: 'Finance / Governance',
            competitorLeapfrogged: 'Jaggaer (no AI risk); partial parity with Zycus Merlin AI',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '2',
            featureName: '* NLP Document Auto-Extraction',
            category: 'AI/NLP',
            description: 'OCR + NLP engine extracts GSTIN, PAN, IFSC, and account number from uploaded documents and auto-fills onboarding form fields, reducing vendor form-fill effort by 60%.',
            targetUser: 'Vendor / Purchase Manager',
            competitorLeapfrogged: 'All India competitors - no auto-extraction available',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '3',
            featureName: '* Predictive Assessment Grade',
            category: 'AI/ML',
            description: 'ML model trained on historical assessment data predicts likely grade for upcoming assessment. Flags at-risk vendors 30 days before assessment due date.',
            targetUser: 'QA-QC / Admin',
            competitorLeapfrogged: 'Zycus (no predictive assessment); all India competitors',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '4',
            featureName: '* Vendor Sentiment Analysis',
            category: 'AI/NLP',
            description: 'NLP analysis of vendor communication emails and portal messages to surface early signals of vendor dissatisfaction, dispute escalation risk, or service deterioration.',
            targetUser: 'Purchase HOD / CSM',
            competitorLeapfrogged: 'No competitor has vendor sentiment feature',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '5',
            featureName: '* Automated Re-KYC Scheduling',
            category: 'AI/ML',
            description: 'ML model recommends optimal re-KYC timing per vendor based on risk score, last update age, vendor category, and compliance flag history. Auto-creates re-KYC requests when risk threshold exceeded.',
            targetUser: 'Admin / Finance',
            competitorLeapfrogged: 'All competitors - none have intelligent re-KYC scheduling',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '6',
            featureName: '* MCP: SAP Ariba Connector',
            category: 'MCP / Automation',
            description: 'Model Context Protocol connector enabling automated vendor data exchange between VMS and SAP Ariba for organizations running both systems. Bi-directional sync with conflict resolution rules.',
            targetUser: 'IT / Admin',
            competitorLeapfrogged: 'SAP Ariba (removes need for VMS replacement in SAP shops)',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '7',
            featureName: '* MCP: Tally Prime Live Sync',
            category: 'MCP / Automation',
            description: 'Real-time vendor master sync between VMS and Tally Prime via MCP protocol. Approved vendors auto-created in Tally with correct ledger mapping. Payment data flows back to VMS payment tracker.',
            targetUser: 'Finance / Admin',
            competitorLeapfrogged: 'Tally-dependent mid-market: Zoho Creator, Kissflow (no Tally integration)',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '8',
            featureName: '* MCP: WhatsApp Business Approval Gateway',
            category: 'MCP / Automation',
            description: 'Approval actions (approve/reject/request info) executed directly via WhatsApp Business API without opening VMS. Approver receives structured card with vendor details and action buttons.',
            targetUser: 'All Approvers',
            competitorLeapfrogged: 'Kissflow (WhatsApp approvals) - VMS leapfrogs with richer vendor context',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '9',
            featureName: '* ESG Vendor Disclosure Module',
            category: 'Compliance / ESG',
            description: 'Vendors submit ESG disclosures (carbon emissions, labour practices, diversity, waste) via portal. Internal teams review and score. Export ESG-compliant vendor report for SEBI BRSR filings.',
            targetUser: 'Finance / Sustainability Head',
            competitorLeapfrogged: 'No India VMS competitor has an ESG module currently',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '10',
            featureName: '* Vendor Health Index Dashboard',
            category: 'Analytics',
            description: 'Single composite score per vendor combining compliance status (GST, re-KYC), assessment grade, payment behavior, and risk score. Trend chart over 12 months. Red/Amber/Green classification.',
            targetUser: 'Purchase HOD / CFO',
            competitorLeapfrogged: 'All India competitors - none have a unified vendor health index',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '11',
            featureName: 'Contract Lifecycle Management (Full)',
            category: 'Product Expansion',
            description: 'Full CLM: contract creation with templates, clause library, e-signature integration, renewal alerts, obligation tracking, and contract-to-PO linkage. Closes largest current product gap.',
            targetUser: 'Legal / Purchase HOD',
            competitorLeapfrogged: 'SAP Ariba and GEP SMART (full CLM) - VMS achieves parity',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '12',
            featureName: 'e-Invoicing Integration (GST IRP)',
            category: 'Compliance',
            description: 'Direct integration with GST Invoice Registration Portal (IRP) for e-invoicing validation and IRN generation for vendor invoices above INR 5 crore threshold.',
            targetUser: 'Finance User',
            competitorLeapfrogged: 'SAP Ariba (has IRP integration); all this mid-market India competitors lack this',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '13',
            featureName: '* Vendor Onboarding Chatbot',
            category: 'AI / UX',
            description: 'AI chatbot embedded in vendor portal to guide vendors through onboarding form step-by-step, answer FAQs, and flag errors before submission. Reduces onboarding support tickets by 40%.',
            targetUser: 'Vendor / Supplier',
            competitorLeapfrogged: 'No India VMS competitor has an onboarding chatbot',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '14',
            featureName: 'Multi-language Portal Support',
            category: 'UX / Localization',
            description: 'Vendor portal available in Hindi, Tamil, Telugu, Marathi, and Gujarati. Language preference saved per vendor login. Increases adoption among non-English-speaking vendor population.',
            targetUser: 'Vendor / Supplier',
            competitorLeapfrogged: 'No India VMS competitor offers vernacular language portal',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '15',
            featureName: 'Dynamic Scoring Benchmark',
            category: 'Analytics',
            description: 'Assessment scores benchmarked against industry average for same vendor category. Shows whether vendor is above or below category benchmark. Helps procurement teams make relative performance decisions.',
            targetUser: 'QA-QC / Purchase HOD',
            competitorLeapfrogged: 'No competitor offers category-level benchmark scoring for assessment',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '16',
            featureName: 'Vendor Portal Mobile App',
            category: 'Mobile',
            description: 'Native Android and iOS vendor portal app with offline form-fill capability, push notifications for PO alerts, and biometric login. Eliminates browser dependency for mobile vendors.',
            targetUser: 'Vendor / Supplier',
            competitorLeapfrogged: 'Kissflow (has mobile approval app); achieves parity plus vendor-side mobile app',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '17',
            featureName: '* Automated SLA Monitoring',
            category: 'Operations',
            description: 'System tracks approval SLA targets per step in approval matrix. Flags overdue approvals to HOD. Weekly SLA compliance report emailed to admin. Identifies chronic bottleneck approvers.',
            targetUser: 'Admin / HOD',
            competitorLeapfrogged: 'No India VMS competitor has automated SLA monitoring with escalation',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '18',
            featureName: '* Vendor Category Intelligence',
            category: 'AI/Analytics',
            description: 'AI clusters vendors by category performance, compliance health, and spend pattern. Suggests strategic vendors for preferred status and flags vendors for compliance review based on cluster outlier detection.',
            targetUser: 'Purchase HOD / Finance',
            competitorLeapfrogged: 'Zycus has partial spend intelligence; VMS adds compliance and assessment',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '19',
            featureName: 'Digital Signature Integration',
            category: 'Compliance',
            description: 'e-Sign integration (Aadhaar eSign / DigiLocker / DocuSign) for vendor agreements, onboarding declarations, and re-KYC consent forms. Replaces PDF-and-email signature process.',
            targetUser: 'Vendor / Legal',
            competitorLeapfrogged: 'SAP Ariba (DocuSign); VMS adds Aadhaar eSign for India-first use case',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '20',
            featureName: 'Cross-entity Vendor Sharing',
            category: 'Enterprise Feature',
            description: 'Approved vendor in one entity/branch auto-suggested for onboarding in another entity within the same group. Reduces duplicate onboarding effort in multi-entity organizations.',
            targetUser: 'Admin / Purchase Manager',
            competitorLeapfrogged: 'No India competitor has cross-entity vendor sharing',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '21',
            featureName: '* Spend Anomaly Detection',
            category: 'AI / Finance',
            description: 'AI flags unusual vendor spend patterns: sudden invoice spike, duplicate invoice amounts, invoice from deactivated vendor. Alert sent to finance team for review.',
            targetUser: 'Finance / CFO',
            competitorLeapfrogged: 'GEP SMART has spend analytics; VMS adds anomaly detection layer',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '22',
            featureName: 'Vendor Collaboration Portal',
            category: 'Collaboration',
            description: 'Dedicated threaded communication channel per vendor within VMS. Internal teams post queries; vendor responds in-portal. Replaces email threads. Full communication log per vendor.',
            targetUser: 'All Internal Users / Vendor',
            competitorLeapfrogged: 'No India competitor has in-platform vendor collaboration threading',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '23',
            featureName: 'Pre-built Compliance Templates',
            category: 'Compliance',
            description: 'Industry-specific pre-qualification and assessment templates: RERA for real estate, CDSCO for healthcare, RBI for BFSI, ISO for manufacturing. One-click deploy instead of building from scratch.',
            targetUser: 'Admin',
            competitorLeapfrogged: 'TCS iON has some templates; VMS offers more industry coverage',
            impact: 'Medium',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '24',
            featureName: 'API-first Vendor Data Connector',
            category: 'Integration',
            description: 'Open REST API enabling enterprises to push vendor master data from VMS to any downstream system (Oracle, D365, custom ERP) without manual export. Webhooks for real-time event notifications.',
            targetUser: 'IT / Admin',
            competitorLeapfrogged: 'SAP Ariba and Coupa (strong APIs); VMS achieves integration parity',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          },
          {
            rowId: '25',
            featureName: '* AI Contract Clause Extraction',
            category: 'AI/NLP',
            description: 'NLP extraction of key clauses (payment terms, penalty, renewal date, liability cap) from uploaded vendor contracts. Auto-populates contract metadata fields. Reduces manual contract review time by 50%.',
            targetUser: 'Legal / Finance',
            competitorLeapfrogged: 'SAP Ariba (has basic NLP); GEP SMART; VMS adds India contract clause library',
            impact: 'High',
            currentStatus: '',
            enhancedVersion: '',
            integrationType: ''
          }
        ],
        top5Impact: [
          {
            rank: '1',
            name: 'AI Vendor Risk Score',
            logic: 'Transforms VMS from a workflow tool into a strategic risk management platform. Opens BFSI and large enterprise deals currently lost to Zycus.',
            leapfrog: 'Jaggaer fully; partial parity with Zycus Merlin AI'
          },
          {
            rank: '2',
            name: 'NLP Document Auto-Extraction',
            logic: 'Removes the biggest vendor friction in onboarding (manual form-fill). 60% faster onboarding directly improves activation and NPS.',
            leapfrog: 'All India competitors - no auto-extraction exists'
          },
          {
            rank: '3',
            name: 'MCP WhatsApp Business Approval Gateway',
            logic: 'Approval speed is the #1 complained-about bottleneck. WhatsApp approvals eliminate the browser login barrier for mobile-first approvers.',
            leapfrog: 'Kissflow (WhatsApp) - VMS surpasses with richer approval context'
          },
          {
            rank: '4',
            name: 'Vendor Health Index Dashboard',
            logic: 'Single composite number gives CFO and Purchase HOD instant vendor portfolio risk view. Enables strategic vendor decisions, not just operational ones.',
            leapfrog: 'All India competitors - no unified health index'
          },
          {
            rank: '5',
            name: 'AI Contract Clause Extraction',
            logic: 'CLM is the largest product gap. NLP clause extraction provides 80% of CLM value at a fraction of full CLM development effort. Unlocks enterprise deals requiring contract management.',
            leapfrog: 'SAP Ariba, GEP SMART - VMS closes the gap'
          }
        ]
      },

    /* ── Tab 5: Pricing ────────────────────────────────────────────────────── */
    pricing: [
      {
        plan: 'Starter',
        price: '₹499/seat/month',
        description: 'For organisations with up to 200 active vendors',
        features: [
          'Vendor onboarding & invitation',
          'GST/PAN/IFSC validation',
          'Basic approval workflow (up to 2 levels)',
          'Vendor self-service portal (view only)',
          'Email notifications',
          'Compliance dashboard',
        ],
        highlighted: false,
        cta: 'Get Started',
      },
      {
        plan: 'Professional',
        price: '₹799/seat/month',
        description: 'For organisations with 200–1,000 active vendors',
        features: [
          'Everything in Starter',
          'Configurable multi-level approval matrix',
          'GST defaulter monitoring with alerts',
          'Re-KYC workflow with self-service update',
          'Vendor self-service portal (PO/GRN/Invoice + Bid)',
          'Weighted assessment & scoring engine',
          'SAP / Salesforce integration',
          'Advanced analytics dashboard',
        ],
        highlighted: true,
        cta: 'Start Free Trial',
      },
      {
        plan: 'Enterprise',
        price: 'Custom',
        description: 'For large organisations with 1,000+ vendors + ERP integration',
        features: [
          'Everything in Professional',
          'On-premise deployment option',
          'Custom ERP integration (SAP, Oracle, custom)',
          'NLP-based document extraction (roadmap)',
          'AI-driven vendor risk scoring (roadmap)',
          'Automated contract lifecycle (roadmap)',
          'Dedicated implementation team',
          'SLA-backed support',
        ],
        highlighted: false,
        cta: 'Contact Sales',
      },
    ],

    /* ── Tab 6: SWOT ─────────────────────────────────────────────────────────  */
    swot: {
      strengths: [
        'India-first compliance engine (GST, PAN, IFSC validation + defaulter monitoring) — structural moat vs global tools.',
        'Configurable multi-level approval matrix — no IT change requests, immediate configurability.',
        'Vendor self-service portal with PO/GRN/Invoice + bid submission at SMB-affordable price.',
        'Live SAP Hana and Salesforce ERP integration — enterprise-ready without enterprise pricing.',
        'Re-KYC workflow automation — unique in the mid-market segment.',
        'Weighted assessment scoring engine with full assessment history.',
      ],
      weaknesses: [
        'No mobile app for vendor-facing portal — limits field procurement use cases.',
        'No AI-driven risk scoring — enterprise buyers increasingly expect this.',
        'No automated contract lifecycle — misses the award-to-contract step.',
        'No NLP-based document extraction — statutory document review is still manual.',
        'Brand recognition limited vs SAP Ariba and Zoho in enterprise procurement buyer awareness.',
      ],
      opportunities: [
        'VMS market growing at 15.1% CAGR — INR 1.13 lakh crore global market by 2026.',
        'India fast-growing at 13.2% APAC CAGR — Digital India procurement automation tailwind.',
        'GCC expansion — UAE and Saudi Arabia VAT/Zakat compliance mirrors India GST compliance requirement.',
        'AI risk scoring addition would unlock larger enterprise accounts currently buying Coupa or Ariba.',
        'CA/CPA firm referral partnerships — trusted advisors in GST compliance decisions.',
        'Cross-sell to existing Lockated FM client base — zero additional CAC.',
      ],
      threats: [
        'SAP Ariba AI features and pricing modernisation may make it accessible to mid-market.',
        'Zoho Procurement expansion — vendor portal features expected in Zoho ecosystem roadmap.',
        'Coupa and SAP Ariba India-specific compliance features growing through partnerships.',
        'New Indian B2B SaaS entrants targeting procurement compliance niche with VC funding.',
        'Tally-integrated solutions from Indian accounting software vendors entering the space.',
      ],
    },

    detailedSWOT: {
      strengths: [
        {
          headline: 'India-native compliance engine',
          explanation: 'GST defaulter auto-flag, section-wise re-KYC, and PAN/IFSC validation are purpose-built for Indian regulatory context, unavailable in SAP Ariba or Coupa.'
        },
        {
          headline: 'Configurable approval matrix',
          explanation: 'Fully dynamic routing based on role, department, vendor type, and business rules supports even complex multi-department approval workflows.'
        },
        {
          headline: 'Vendor self-service portal',
          explanation: 'Vendors can onboard, update profiles, view PO/GRN/invoices, submit bids, and complete re-KYC without involving any internal team.'
        },
        {
          headline: 'Auction and bid module',
          explanation: 'Digital bid submission and tracking within the vendor portal eliminates email RFQ-by-email and gives buyers a structured, auditable quotation process.'
        },
        {
          headline: 'SAP integration with error preservation',
          explanation: 'SAP push failures preserve correct business state rather than corrupting vendor master, solving a common pain point in SAP-integrated workflows.'
        },
        {
          headline: 'Section-wise re-KYC and approval',
          explanation: 'Updating only relevant sections in re-KYC reduces vendor burden and speeds up the update cycle vs. full-form resubmission required by competitors.'
        },
        {
          headline: 'Audit trail across all modules',
          explanation: 'Immutable log covering every action across onboarding, re-KYC, assessment, and approval gives governance teams instant auditability.'
        },
        {
          headline: 'Weighted vendor assessment engine',
          explanation: 'Configurable weightage, multi-auditor support, auditor isolation until finalization, and auto-grading make assessment objective and scalable.'
        },
        {
          headline: 'Duplicate GSTIN prevention',
          explanation: 'Real-time check prevents duplicate vendor creation, directly reducing procurement risk and SAP data errors.'
        },
        {
          headline: 'Assessment and pre-qualification combined',
          explanation: 'Having pre-qualification, scoring, and periodic assessment in one platform is a unique combination unavailable in affordable India-market tools.'
        }
      ],
      weaknesses: [
        {
          headline: 'No AI or ML capabilities in current product',
          explanation: 'VMS has no AI risk scoring, NLP document extraction, or predictive analytics - putting it behind Zycus Merlin AI, SAP Ariba, and GEP SMART in AI readiness.'
        },
        {
          headline: 'No contract lifecycle management',
          explanation: 'Absence of a CLM module is a significant gap when competing with SAP Ariba and GEP SMART for enterprise accounts requiring contract creation, renewal, and expiry management.'
        },
        {
          headline: 'Browser-only interface, no mobile app',
          explanation: 'Vendors and approvers on mobile have a degraded experience; Kissflow (WhatsApp approvals) and Zoho (mobile-first) are ahead for field or mobile-heavy workflows.'
        },
        {
          headline: 'Limited spend analytics depth',
          explanation: 'Current dashboards provide operational visibility but lack cross-vendor spend analytics, category-level spend intelligence, and predictive SLA monitoring.'
        },
        {
          headline: 'No Tally or QuickBooks integration',
          explanation: 'Absence of Tally integration limits appeal to mid-market retail and SME segments where Tally Prime is the dominant ERP.'
        },
        {
          headline: 'SAP-only ERP integration currently',
          explanation: 'Organizations using Oracle, Microsoft D365, or Tally cannot directly integrate vendor master sync without custom development.'
        },
        {
          headline: 'Limited brand recognition outside direct network',
          explanation: 'VMS competes against globally marketed platforms (SAP, Coupa) and strong Indian brands (Zycus, TCS iON) with established thought leadership.'
        },
        {
          headline: 'No public customer case studies or ROI data',
          explanation: 'Lack of published success metrics weakens the sales case in competitive deals where proof-of-value evidence is demanded by large procurement teams.'
        },
        {
          headline: 'Multi-entity support not yet available',
          explanation: 'Organizations with multiple subsidiaries or branches cannot manage separate approval matrices and vendor records in a single VMS instance today.'
        },
        {
          headline: 'Limited channel partner ecosystem',
          explanation: 'Current sales rely heavily on direct outreach; no structured reseller or SI partner program limits geographic and segment reach.'
        }
      ],
      opportunities: [
        {
          headline: 'India mid-market procurement digitization wave',
          explanation: 'Over 500,000 mid-market Indian organizations have not yet adopted any vendor management software - a largely greenfield opportunity.'
        },
        {
          headline: 'Digital India and GST mandate tailwind',
          explanation: 'Government push for digital invoicing, e-way bills, and GST compliance drives demand for tools that automate GST validation and statutory approval flows.'
        },
        {
          headline: 'China+1 manufacturing shift',
          explanation: 'Indian manufacturers onboarding new domestic and international suppliers to replace China-sourced inputs creates a surge in vendor management needs.'
        },
        {
          headline: 'VMS market growing at 15.1% CAGR globally',
          explanation: 'Rising market tide lifts all players; India APAC growth at 13.2% CAGR specifically creates a receptive buyer environment for 2026-2028.'
        },
        {
          headline: 'SEBI BRSR ESG compliance mandate',
          explanation: 'Listed Indian companies must report on ESG factors including supply chain practices under BRSR from FY2027, creating demand for ESG vendor compliance modules.'
        },
        {
          headline: 'SAP Ariba cost fatigue in mid-market',
          explanation: 'Indian mid-market organizations paying INR 25-60L+ for SAP Ariba with complex implementations are actively seeking comparable-quality but lower-cost alternatives.'
        },
        {
          headline: 'Zycus AI gap in compliance workflow',
          explanation: 'Zycus is strong in AI analytics but weak in India-specific compliance workflows (re-KYC, GST defaulter); VMS can position as compliance-first.'
        },
        {
          headline: 'BFSI vendor risk management regulatory pressure',
          explanation: 'RBI’s 2024-25 outsourcing risk management guidelines mandate documented vendor risk trails, creating a compliance-driven buying trigger.'
        },
        {
          headline: 'Healthcare supplier compliance growth',
          explanation: 'CDSCO tightening of medical device supplier approvals and upcoming pharma PLI scheme vendor compliance requirements create strong demand.'
        },
        {
          headline: 'Auction/eProcurement module as standalone upsell',
          explanation: 'Auction and bid module within vendor portal can be positioned as a separate eProcurement add-on, opening a separate buying center inside sourcing teams.'
        }
      ],
      threats: [
        {
          headline: 'Zycus AI capability acceleration',
          explanation: 'Zycus continues to invest heavily in Merlin AI - if it adds India-specific compliance modules, it would directly threaten VMS across all three target groups.'
        },
        {
          headline: 'SAP Ariba India pricing adaptation',
          explanation: 'If SAP reduces Indian pricing or launches a mid-market variant, its ERP ecosystem advantage could override VMS’s compliance differentiation in enterprise deals.'
        },
        {
          headline: 'Kissflow mobile-first expansion into compliance',
          explanation: 'Kissflow is expanding beyond workflow automation, adding GST validation and assessment features would make it a direct lower-priced competitor.'
        },
        {
          headline: 'Coupa enterprise consolidation deals',
          explanation: 'Coupa’s 2025 IBM integration and multi-agent AI could drive large enterprises to consolidate VMS under broader spend management platforms.'
        },
        {
          headline: 'New India-origin AI-native VMS startups',
          explanation: 'Well-funded AI-first VMS startups could launch with compliance + AI in one product, leapfrogging VMS’s current roadmap before Phase 3 AI ships.'
        },
        {
          headline: 'Enterprise ERP platforms adding VMS natively',
          explanation: 'Oracle and Microsoft D365 adding native vendor onboarding and assessment modules within their ERP would reduce standalone VMS demand.'
        },
        {
          headline: 'Data security and compliance concerns',
          explanation: 'Enterprises sharing GST, PAN, and banking data with a SaaS vendor will have increasing data localization and security requirements that increase due diligence burden.'
        },
        {
          headline: 'Long enterprise sales cycles slowing growth',
          explanation: 'BFSI and large enterprise sales cycles of 10-16 weeks tie up sales resources and create revenue lumpiness that strains early-stage cash flow.'
        },
        {
          headline: 'Customer concentration risk if early deals are large enterprise',
          explanation: 'Over-dependence on 2-3 large accounts for majority of ARR creates churn risk; mid-market volume reduces this but requires PLG investment.'
        },
        {
          headline: 'Procurement software consolidation',
          explanation: 'Buyers prefer unified source-to-pay suites over point solutions; VMS must maintain compliance leadership or risk being subsumed.'
        }
      ]
    },

    /* ── Tab 7: Roadmap ──────────────────────────────────────────────────────  */
    roadmap: [
      {
        quarter: 'Live / Completed',
        phase: 'Core Platform',
        items: [
          'Invitation-based vendor onboarding with GST/PAN/IFSC validation',
          'Multi-document upload and statutory compliance checks',
          'Configurable multi-level approval matrix',
          'Automated GST defaulter flag and Finance alerts',
          'Vendor self-service portal — PO/GRN/Invoice view',
          'Bid submission for auctions/tenders from vendor portal',
          'Re-KYC workflow with vendor self-service update',
          'Weighted assessment and scoring engine',
          'SAP Hana and Salesforce (SFDC) ERP integration',
          'Compliance dashboard and audit trail',
        ],
        status: 'completed',
      },
      {
        quarter: 'Q2–Q3 2025',
        phase: 'Mobile & Intelligence',
        items: [
          'Mobile app for vendor-facing portal (iOS + Android)',
          'WhatsApp-based vendor notifications for PO and invoice status',
          'Expanded integrations — Oracle, Microsoft Dynamics, Tally',
          'Vendor performance scorecard with trend analytics',
          'Automated Re-KYC scheduling and tracking dashboard',
        ],
        status: 'in-progress',
      },
      {
        quarter: 'Q4 2025 – Q2 2026',
        phase: 'AI & Contract Automation',
        items: [
          'AI-driven vendor risk scoring (GST compliance history + payment behaviour)',
          'NLP-based document extraction for statutory document auto-fill',
          'Automated contract lifecycle — from vendor award to signed contract',
          'Vendor sustainability and ESG scoring (for enterprise compliance)',
          'GCC edition — UAE VAT and Saudi Zakat compliance layer',
        ],
        status: 'planned',
      },
    ],

    detailedBusinessPlan: {
      planQuestions: [
        {
          id: 'Q1',
          question: 'What problem does VMS solve and for whom?',
          answer: 'Organizations managing 100-1000+ vendors across departments face 12-18 day manual onboarding, compliance blind spots (GST defaulters, missing KYC), and fragmented approval chains. VMS solves this for procurement, finance, and governance teams in manufacturing, real estate, infrastructure, retail, and healthcare businesses in India.',
          source: 'Product Summary, Use Cases',
          flag: 'Ready to use as-is',
          colorContext: 'blue',
        },
        {
          id: 'Q2',
          question: 'What is the market size and growth?',
          answer: 'Global VMS market is USD 13.62B in 2026, growing at 15.1% CAGR. India is fastest-growing within APAC at 13.2% CAGR, driven by Digital India procurement digitization. Indian mid-market (500-5000 employee orgs) represents a largely underserved segment - most existing tools are priced for large enterprise (SAP Ariba) or too basic (Zoho Creator).',
          source: 'Market Analysis',
          flag: 'Ready to use as-is',
          colorContext: 'blue',
        },
        {
          id: 'Q3',
          question: 'Who are the target customers and how will you reach them?',
          answer: 'Primary: Indian mid-to-large enterprises in manufacturing, real estate, infrastructure, retail, and healthcare - typically 500-5000 employees with 100-800 active vendors. Secondary: Large enterprise with multi-entity needs. Reached via direct B2B sales, SAP partner channel, ERP implementation partners, and industry association referrals.',
          source: 'GTM Strategy, Use Cases',
          flag: 'Requires founder input: Confirm exact ICP firmographics from current customer base',
          colorContext: 'red',
        },
        {
          id: 'Q4',
          question: 'What is the pricing model and average contract value?',
          answer: 'SaaS subscription: Starter INR 3-6L/yr (up to 100 vendors), Growth INR 7-15L/yr (100-500 vendors), Enterprise INR 16-35L/yr (500+ vendors). Plus one-time implementation INR 1.5-8L. Average contract value (ACV) estimated at INR 8-12L for Growth tier. Enterprise deals at INR 20-35L ACV.',
          source: 'Features and Pricing',
          flag: 'Requires founder input: Confirm actual realized ACV from closed deals',
          colorContext: 'red',
        },
        {
          id: 'Q5',
          question: 'What is the competitive differentiation?',
          answer: 'VMS is the only India-built platform combining: (1) GST defaulter auto-flag and rejection, (2) section-wise re-KYC, (3) configurable approval matrix with audit trail, (4) vendor self-service portal with PO/GRN/WO/invoice visibility, and (5) auction/bid submission. SAP Ariba and Zycus lack India-specific GST/re-KYC compliance. Zoho and Kissflow lack assessment engine and SAP integration.',
          source: 'Features and Pricing, Market',
          flag: 'Ready to use as-is',
          colorContext: 'green',
        },
        {
          id: 'Q6',
          question: 'What does the product roadmap look like?',
          answer: 'Phase 1 (Q2-Q3 2026): Mobile portal, WhatsApp approvals, bulk re-KYC, GST API. Phase 2 (Q4 2026-Q1 2027): Multi-entity, contract module, Tally integration, mobile app. Phase 3 (Q2-Q4 2027): AI vendor risk scoring, NLP document extraction, vendor health index, ESG module.',
          source: 'Product Roadmap',
          flag: 'Requires founder input: Confirm Phase 1 delivery commitments with engineering',
          colorContext: 'red',
        },
        {
          id: 'Q7',
          question: 'What are the key metrics and current performance?',
          answer: 'Tracked metrics: Signups, activated users (vendor master entry completed), paid conversions, feature adoption % per module, NPS proxy (CSAT), support ticket volume, monthly churn rate, and north star: Active Vendors Managed per Org. Current benchmarks and Phase 1 targets detailed in Metrics tab.',
          source: 'Metrics',
          flag: 'Requires founder input: Fill actual current metric values before investor presentation',
          colorContext: 'red',
        },
        {
          id: 'Q8',
          question: 'What is the go-to-market strategy?',
          answer: 'Three GTM motions: (1) Direct sales to mid-market manufacturing and real estate companies via procurement HOD outreach - 6-week sales cycle. (2) SAP/ERP partner channel for enterprise accounts needing SAP integration - co-sell arrangement. (3) Industry association and procurement consultant referral network for BFSI and healthcare sectors.',
          source: 'GTM Strategy',
          flag: 'Requires founder input: Confirm current partnership agreements and referral pipeline',
          colorContext: 'red',
        },
        {
          id: 'Q9',
          question: 'What is the revenue model and path to profitability?',
          answer: 'Revenue from: SaaS subscriptions (70%), implementation fees (20%), optional support retainer (10%). Year 1 target: 20-30 Growth tier clients = INR 1.4-4.5Cr ARR. Break-even at 35-40 active enterprise accounts. Gross margin target 68-72% at scale (SaaS economics). Implementation done by internal team or certified partners.',
          source: 'Business Plan Builder, Metrics',
          flag: 'Requires founder input: Validate Year 1 revenue targets and current ARR',
          colorContext: 'red',
        },
        {
          id: 'Q10',
          question: 'What are the key risks and how are they mitigated?',
          answer: 'Risk 1: SAP Ariba / Zycus price-cutting - Mitigated by India compliance moat and lower TCO. Risk 2: AI feature gap vs. Zycus - Addressed in Phase 3 roadmap with AI risk scoring and NLP extraction. Risk 3: Long enterprise sales cycles - Mitigated by mid-market focus (faster 6-week cycles). Risk 4: Integration complexity - Addressed by pre-built SAP and Tally connectors.',
          source: 'Market Analysis, Product Roadmap',
          flag: 'Ready to use as-is',
          colorContext: 'green',
        },
      ],
      founderChecklist: [
        {
          id: 'Q3',
          item: 'ICP',
          verify: 'Confirm ICP firmographics (employee size, vendor count, industry) from existing customer data',
          status: 'Pending',
        },
        {
          id: 'Q4',
          item: 'ACV',
          verify: 'Validate realized ACV and average deal size from CRM / closed deals',
          status: 'Pending',
        },
        {
          id: 'Q6',
          item: 'Roadmap',
          verify: 'Confirm Phase 1 delivery timelines with engineering lead',
          status: 'Pending',
        },
        {
          id: 'Q7',
          item: 'Metrics',
          verify: 'Insert actual current metric values: signups, activated users, paid accounts, churn rate',
          status: 'Pending',
        },
        {
          id: 'Q8',
          item: 'GTM Partnerships',
          verify: 'Confirm active partnership agreements and referral pipeline names',
          status: 'Pending',
        },
        {
          id: 'Q9',
          item: 'Revenue',
          verify: 'Validate current ARR, Year 1 revenue target, and break-even headcount',
          status: 'Pending',
        },
      ],
    },

    /* ── Tab 8: Business Plan ─────────────────────────────────────────────────  */
    businessPlan: {
      vision:
        'To become India\'s most trusted vendor compliance operating system — the platform every CFO and Purchase Head relies on to ensure zero GST audit exposure and zero vendor fraud risk in their supply chain.',
      mission:
        'Digitise the full vendor lifecycle for Indian enterprises — from invitation to ERP sync — with India-first compliance built in, making compliance the default state, not the exception.',
      targetRevenue: '₹5 crore ARR (Year 1) → ₹25 crore ARR (Year 3) through direct enterprise sales and CA/CPA referral channel.',
      keyMilestones: [
        { milestone: 'Core platform live — onboarding, approval, self-service portal, SAP integration', targetDate: 'Completed', status: 'completed' },
        { milestone: '20 paying enterprise accounts (manufacturing + real estate)', targetDate: 'Q2 2025', status: 'in-progress' },
        { milestone: 'Mobile app launch for vendor-facing portal', targetDate: 'Q3 2025', status: 'planned' },
        { milestone: '₹5 crore ARR milestone', targetDate: 'Q4 2025', status: 'planned' },
        { milestone: 'AI risk scoring module launch', targetDate: 'Q1 2026', status: 'planned' },
        { milestone: 'GCC edition (UAE VAT/Saudi Zakat compliance)', targetDate: 'Q2 2026', status: 'planned' },
        { milestone: '₹25 crore ARR milestone', targetDate: 'Q4 2026', status: 'planned' },
      ],
    },

    detailedGTM: {
      targetGroups: [],
      sheet: {
        title: 'Vendor Management System - Go-To-Market Strategy',
        targetGroups: [
          {
            title: 'TG1 - Procurement-led Manufacturing and Real Estate Enterprises',
            sections: [
              {
                title: '',
                columns: ['Section', 'Detail'],
                rows: [
                  [
                    'Rationale',
                    'Highest vendor complexity (200-800 vendors), SAP-heavy, India compliance critical. Material and FM vendor workflows directly solve their primary pain. Pre-qualification and assessment modules match QA-heavy culture.'
                  ],
                  [
                    'Sales Motion',
                    'Direct enterprise sales via Purchase HOD and VP Operations outreach. Demo-led 6-week sales cycle. Proof-of-concept on live vendor onboarding. SAP integration demo is deal-closer.'
                  ],
                  [
                    'Marketing Channels',
                    'LinkedIn outreach to Purchase Directors; industry events (CII Procurement Summit, CREDAI for real estate); Google Search ads for "vendor onboarding software India"; SAP partner co-sell program.'
                  ],
                  [
                    '90-Day Launch Sequence',
                    'Week 1-2: LinkedIn DM to HOD + industry event meet. Week 3-4: Discovery call + demo focused on Material Vendor Workflow and SAP Push. Week 5-6: Proof of concept with 10 live vendor invites. Week 7-8: Commercial proposal and approval matrix configuration demo. Week 9-12: Contract, implementation kickoff.'
                  ],
                  [
                    'Partnership Strategy',
                    'SAP implementation partners (Wipro, HCL, L&T Infotech) for co-sell access to SAP-heavy accounts. ERCI industry body referrals (NICMAR, CII). ERP consultants who serve manufacturers.'
                  ]
                ]
              }
            ],
            summary: 'TG1 drives largest ACV (INR 15-35L). Sales cycle 6-10 weeks. Key assumption: SAP integration is non-negotiable for this segment.',
            keyAssumptions: 'North star metric: Number of Material Vendor Onboardings completed in first 60 days of live.'
          },
          {
            title: 'TG2 - Compliance-driven BFSI and Healthcare Organizations',
            sections: [
              {
                title: '',
                columns: ['Section', 'Detail'],
                rows: [
                  [
                    'Rationale',
                    'Regulatory mandates (RBI outsourcing norms, CDSCO compliance) make vendor audit trail and re-KYC non-negotiable. These buyers prioritize governance, traceability, and audit-readiness over speed. Approval matrix and audit logs are the core value proposition.'
                  ],
                  [
                    'Sales Motion',
                    'Consultative enterprise sales via CTO and CFO in BFSI; VP Operations and Quality Head in Healthcare. Compliance-led demo highlighting audit trail, RBAC, and re-KYC export. Legal/compliance review often required before purchase.'
                  ],
                  [
                    'Marketing Channels',
                    'Banking associations (IBA events, FICCI BFSI); Healthcare procurement conferences (FICCI Health); CISO and vendor risk management community outreach; compliance newsletters sponsorships; referral from Big 4 audit firms.'
                  ],
                  [
                    '90-Day Launch Sequence',
                    'Week 1-3: Association event + compliance officer cold email. Week 4-5: RBI/CDSCO compliance use case presentation. Week 6-8: Security and data residency review (VMS addresses with India-hosted cloud option). Week 9-12: Procurement approval cycle. Week 13-16: Contract and implementation.'
                  ],
                  [
                    'Partnership Strategy',
                    'Big 4 audit firms (Deloitte, KPMG, EY, PwC) as referral partners - they recommend VMS during vendor risk audits. Cybersecurity consulting firms. BFSI-focused technology distributors.'
                  ]
                ]
              }
            ],
            summary: 'TG2 has longer sales cycle (10-16 weeks) but high retention (low churn due to compliance lock-in). Key assumption: Audit trail and data residency address primary BFSI objection.',
            keyAssumptions: 'North star metric: Percentage of vendor records with complete compliance documentation.'
          },
          {
            title: 'TG3 - Digitizing Mid-Market Retail and Logistics Operators',
            sections: [
              {
                title: '',
                columns: ['Section', 'Detail'],
                rows: [
                  [
                    'Rationale',
                    'High vendor count (100-400 suppliers), currently managed via spreadsheets or Zoho. Price-sensitive but need assessment, re-KYC, and vendor portal. Kissflow and Zoho Creator are current alternatives - VMS wins on compliance depth and vendor portal. Fast procurement decisions.'
                  ],
                  [
                    'Sales Motion',
                    'Product-led growth with self-serve demo + sales-assist close. Free trial of vendor onboarding module for first 20 vendors. Upgrade path from starter to growth tier within 3 months based on usage.'
                  ],
                  [
                    'Marketing Channels',
                    'Shopify India ecosystem (retail); Logistics tech events (ACMA, CII Logistics); Google and Meta ads targeting "supplier management software India"; Case study content on LinkedIn for retail supply chain managers; IndiaMART vendor management category listing.'
                  ],
                  [
                    '90-Day Launch Sequence',
                    'Day 1-7: Free trial sign-up via website or IndiaMART. Day 8-14: Activation support call - help complete first 5 vendor onboardings. Day 15-30: Feature adoption nudge: enable re-KYC and assessment module. Day 31-60: Usage review call; upsell to Growth if vendor count exceeds 20. Day 61-90: Contract and SAP or Tally integration.'
                  ],
                  [
                    'Partnership Strategy',
                    'CA firms advising mid-market retail clients on GST compliance and procurement digitization. Tally channel partners (Tally integration in Phase 2 is key for this segment). IndiaMART for inbound discovery.'
                  ]
                ]
              }
            ],
            summary: 'TG3 has shortest sales cycle (3-6 weeks), lowest ACV (INR 3-8L), but highest volume. Key assumption: Product-led trial converts at 20%+ if activation team supports first 5 vendor onboardings.',
            keyAssumptions: 'North star metric: Vendors onboarded per active account in first 30 days.'
          }
        ]
      }
    },

    /* ── Tab 9: GTM Strategy ──────────────────────────────────────────────────  */
    gtmStrategy: [
      {
        phase: 'Phase 1 — India Direct (0–6 months)',
        description:
          'Founder-led direct sales targeting CFOs and Finance Heads in manufacturing and real estate. Leverage existing Lockated FM client base for warm cross-sell. Build 3–5 marquee case studies with measurable compliance outcomes.',
        tactics: [
          'Direct outreach to CFOs and Finance Heads in manufacturing (Pune, Surat, Chennai, Ahmedabad)',
          'Cross-sell to 100+ Lockated FM clients — zero additional CAC',
          'CA / CPA firm referral partnerships — trusted advisor channel for GST compliance decisions',
          'LinkedIn thought leadership on GST defaulter risk and procurement compliance',
          'Free compliance audit offer — identify prospects\'s vendor GST defaulter exposure as sales entry',
        ],
        timeline: 'Q1–Q2 2025',
      },
      {
        phase: 'Phase 2 — Channel & Certification (6–12 months)',
        description:
          'Build a certified implementation partner network. Engage system integrators already working with SAP clients to position VMS as the compliance front-end.',
        tactics: [
          'Certified partner programme for SAP system integrators (TCS, Infosys SMB divisions)',
          'Channel partner incentive — 20% recurring commission for qualified referrals',
          'NASSCOM and CII procurement forum presence for enterprise visibility',
          'Launch CA/CPA partner webinar series on vendor GST compliance automation',
          'India-wide procurement conference sponsorship (1–2 events)',
        ],
        timeline: 'Q3–Q4 2025',
      },
      {
        phase: 'Phase 3 — GCC Expansion (12–24 months)',
        description:
          'Launch GCC edition with UAE VAT and Saudi Zakat compliance layer. Target Indian enterprise subsidiaries in GCC who already use VMS in India.',
        tactics: [
          'GCC edition development — UAE VAT, Saudi Zakat, Oman compliance layer',
          'GITEX Dubai participation for GCC enterprise visibility',
          'Partner with UAE-based procurement consultancies and Indian CA firms in DIFC',
          'Target GCC subsidiaries of existing India VMS clients — warm pipeline',
          'GCC pricing: AED 50–80/vendor/month with compliance-premium positioning',
        ],
        timeline: 'Q1–Q2 2026',
      },
    ],

    /* ── Tab 10: Metrics ──────────────────────────────────────────────────────  */
    detailedMetrics: {
      clientImpact: [],
      businessTargets: [],
      sheet: {
        title: 'Vendor Management System - Metrics',
        sections: [
          {
            title: 'Section 1 - North Star Metric',
            columns: ['Metric', 'Definition', 'Current Baseline', 'Phase 1 Target (3-month)'],
            rows: [
              [
                'Active Vendors Managed per Org',
                'Count of vendors with at least one approved record in an org\'s VMS instance, tracked monthly. Measures product depth of adoption.',
                'Requires founder input - actual baseline',
                '25% increase over baseline within 3 months of Phase 1 go-live (mobile portal + WhatsApp approvals)'
              ]
            ]
          },
          {
            title: 'Section 2 - Core Product Metrics (8 mandatory)',
            columns: ['Metric', 'Definition / Activation Criteria', '30-day Current', '30-day Phase 1', '3-month Current', '3-month Phase 1', 'Owner'],
            rows: [
              [
                'Monthly Signups',
                'New org accounts created and verified in VMS',
                'Founder to confirm',
                'Target: +30% with PLG trial (TG3)',
                'Founder to confirm',
                'Target: +50% cumulative with mid-market PLG',
                'Growth / Sales'
              ],
              [
                'Activated Users (Orgs)',
                'Activation = org has completed onboarding of at least 5 vendors through full approval cycle in first 14 days',
                'Founder to confirm',
                'Target: 60% of new signups activated within 14 days',
                'Founder to confirm',
                'Target: 65% activation rate sustained with onboarding assist',
                'Product / CSM'
              ],
              [
                'Paid Conversions',
                'Orgs moving from trial to paid subscription within 60 days of signup',
                'Founder to confirm',
                'Target: 20% trial-to-paid conversion in PLG TG3',
                'Founder to confirm',
                'Target: 25% trial-to-paid with usage-based triggers at 20 vendors',
                'Sales / Product'
              ],
              [
                'Feature Adoption %',
                '% of paid orgs using 3+ modules (e.g., Onboarding + Re-KYC + Assessment) within 90 days',
                'Founder to confirm',
                'Target: 45% multi-module adoption with Phase 1 add-ons',
                'Founder to confirm',
                'Target: 55% multi-module adoption within 3 months',
                'Product'
              ],
              [
                'NPS Proxy (CSAT)',
                'Post-onboarding survey at 30 days: “How likely are you to recommend VMS to a peer?” 1-10 scale. Proxy NPS = % 9-10 minus % 1-6',
                'Founder to confirm',
                'Target: Score of 4+ (industry avg for procurement SaaS)',
                'Founder to confirm',
                'Target: 50+ NPS proxy with mobile portal improvement',
                'CSM / Product'
              ],
              [
                'Support Ticket Volume',
                'Number of support tickets raised per active org per month. Target: < 2 tickets/org/month at steady state',
                'Founder to confirm',
                'Target: 15% reduction via improved mobile UX and help docs',
                'Founder to confirm',
                'Target: 20% reduction vs. baseline with proactive in-app guidance',
                'Support / Product'
              ],
              [
                'Monthly Churn Rate',
                '% of paid orgs that cancel or do not renew in a given month. Target: <2% monthly for SaaS at this ACV',
                'Founder to confirm',
                'Target: Maintain below 2% monthly churn',
                'Founder to confirm',
                'Target: Reduce to 1.5% monthly with compliance lock-in (BFSI TG2)',
                'CSM / Finance'
              ],
              [
                'Active Vendors Managed per Org',
                'Count of vendors with at least one approved record per org (North Star). Measures platform depth of use.',
                'Founder to confirm',
                'Target: Avg 25% increase per org within 30 days of rollout',
                'Founder to confirm',
                'Target: Avg 40% increase per org within 3 months of Phase 1 complete',
                'Product'
              ]
            ]
          },
          {
            title: 'Section 3 - Client Impact Metrics (10 landing page claims)',
            columns: ['#', 'Claim', 'Supporting Feature', 'Landing Page Use'],
            rows: [
              ['1', 'Reduce vendor onboarding from 15 days to 4 days', 'Material Vendor Workflow + Field Validations + Approval Queue', 'Homepage hero claim'],
              ['2', 'Auto-block GST defaulter payments before they happen', 'GST Defaulter Handling + Finance Approval', 'Finance team landing page'],
              ['3', 'Cut vendor enquiry calls by 60-70% with self-service portal', 'Vendor Portal PO/GRN/Invoice View + Portal Alerts', 'Vendor portal feature page'],
              ['4', 'Complete re-KYC for 500 vendors in one afternoon', 'Bulk Re-KYC Trigger (Phase 1) + Expiry Handling', 'Re-KYC feature page'],
              ['5', 'Every approval, every change, every action - fully traceable', 'Audit Trail + Change Log + Approval Logs', 'Compliance / governance page'],
              ['6', 'Score and grade vendors objectively - no spreadsheets', 'Weighted Scoring + Percentage and Grading + My Assessments', 'Assessment feature page'],
              ['7', 'Vendor bids collected digitally - no email RFQ chaos', 'Auction Participation (Submit Bids / Track)', 'Procurement feature page'],
              ['8', 'SAP vendor master always in sync - no manual updates', 'SAP Push Trigger + Error Handling + Vendor Sync', 'IT/ERP team landing page'],
              ['9', 'Configurable approval matrix that matches your org chart', 'Configurable Approval Matrix + Section-wise Approvals', 'Workflow feature page'],
              ['10', 'One vendor portal - PO, GRN, WO, invoice, and bids in one place', 'Vendor Dashboard + All Procurement Visibility features', 'Vendor portal showcase page']
            ]
          }
        ]
      }
    },
    metrics: [
      { name: 'Active Vendors Under Management', current: '5,000+', target: '50,000', unit: 'vendors', trend: 'up' },
      { name: 'Vendor Onboarding Time', current: '12–18 days (manual)', target: '< 2 days', unit: 'days', trend: 'down' },
      { name: 'Approval Cycle Time', current: '7–10 days', target: '< 24 hrs', unit: 'hours', trend: 'down' },
      { name: 'GST Defaulter Detection Rate', current: 'Manual/quarterly', target: 'Real-time 100%', unit: '%', trend: 'up' },
      { name: 'Vendor Portal Self-Service Rate', current: 'Baseline', target: '> 60% queries self-served', unit: '%', trend: 'up' },
      { name: 'ERP Sync Accuracy', current: '> 99.5%', target: '99.9%', unit: '%', trend: 'up' },
      { name: 'Re-KYC Compliance Rate', current: 'Manual tracking', target: '> 95% on schedule', unit: '%', trend: 'up' },
    ],

    /* ── Tab 11: Post-Possession Journey (Vendor Lifecycle) ───────────────────  */
    postPossessionJourney: [
      {
        stage: 'Vendor Invitation',
        description: 'Admin sends invitation via VMS capturing GST, PAN, contact details. Vendor receives secure onboarding link on email.',
        touchpoints: ['Admin Web Console', 'Email Invitation', 'Vendor Portal'],
        tools: ['VMS Admin Dashboard'],
      },
      {
        stage: 'Self-Registration & Document Upload',
        description: 'Vendor completes registration form — Bank details, MSME certificate, Turnover, Statutory documents. GST/PAN/IFSC validated instantly.',
        touchpoints: ['Vendor Portal', 'Document Upload', 'Automated Validation'],
        tools: ['Vendor Self-Service Portal', 'GST API', 'PAN NSDL API', 'Bank IFSC API'],
      },
      {
        stage: 'Multi-Level Approval',
        description: 'Registration routed through configurable approval matrix (L1: Dept Head → L2: Finance → L3: CFO). One-click reminders for overdue approvers.',
        touchpoints: ['Approval Dashboard', 'Email/Push Notifications', 'One-click Reminders'],
        tools: ['Approval Matrix Engine', 'Notification Service'],
      },
      {
        stage: 'Compliance Validation',
        description: 'Finance team reviews GST defaulter status, PAN, and bank details. Automated flag raised if defaulter detected. Tax classification applied.',
        touchpoints: ['Finance Dashboard', 'GST Defaulter Alert', 'Statutory Review'],
        tools: ['Compliance Dashboard', 'GST Monitoring Service'],
      },
      {
        stage: 'ERP Sync & Activation',
        description: 'Approved vendor master data pushed to SAP Hana / Salesforce via API. Vendor receives activation confirmation and portal access credentials.',
        touchpoints: ['ERP Integration', 'Vendor Activation Email', 'Portal Access'],
        tools: ['SAP Hana API', 'Salesforce SFDC API'],
      },
      {
        stage: 'Ongoing — Portal Self-Service',
        description: 'Vendor uses portal to check PO status, view invoices, submit bids, and initiate Re-KYC updates. AP team admin load reduced by 60%+.',
        touchpoints: ['Vendor Self-Service Portal', 'PO/Invoice View', 'Bid Submission'],
        tools: ['Vendor Portal', 'Bid Management Module'],
      },
      {
        stage: 'Annual Re-KYC',
        description: 'Admin initiates Re-KYC batch. Vendors receive notification and update profile via portal. Non-responsive vendors escalated with automated reminders.',
        touchpoints: ['Re-KYC Notification', 'Portal Update', 'Escalation Alerts'],
        tools: ['Re-KYC Workflow Engine', 'Notification Service'],
      },
    ],
  },
};

const VendorManagementPage: React.FC = () => {
  return <BaseProductPage productData={vendorManagementData} />;
};

export default VendorManagementPage;
