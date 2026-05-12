import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  ArrowLeft,
  X,
  ExternalLink,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { EmployeeHeader } from "@/components/EmployeeHeader";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  slug: string;
  company: string;
  businessSPOC1: string;
  businessSPOC2: string;
  productDescription: string;
  purpose: string;
  industries: string;
  problemSolved: string;
  demoLink?: string;
  type?: string;
  isActive: boolean;
}

const productData: Product[] = [
  {
    id: "1",
    name: "Snag 360",
    slug: "snag-360",
    company: "Lockated",
    businessSPOC1: "Siddharth",
    businessSPOC2: "Sagar",
    productDescription:
      "Snag 360 is a mobile-first snagging and quality inspection platform for structured defect tracking and pre-handover QC.",
    purpose:
      "Eliminate construction rework and defects through structured mobile QC workflows.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Mixed-use Real Estate, EPCE, Industrial & Logistic Parks, Warehousing, SEZ, Data Centers, IT Park, Hospitals, Health Care, Education, Facility Management, Manufacturing",
    problemSolved:
      "Paper checklists, WhatsApp photos, and Excel snag lists drive 5-15% rework costs, no audit trail, and RERA liability exposure at handover.",
    demoLink: "https://demo.snag360.com",
    type: "Facility Management",
    isActive: true,
  },
  {
    id: "2",
    name: "CP Management",
    slug: "cp-management",
    company: "Lockated",
    businessSPOC1: "Komal",
    businessSPOC2: "Komal",
    productDescription:
      "CP Management is a channel partner operations platform for onboarding, brokerage tracking, commissions, and rewards.",
    purpose:
      "Manage and incentivise channel partners to improve sales velocity and loyalty.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Mixed-use Real Estate, Hospitality, Co-working, Offices, Asset Management, Co-living",
    problemSolved:
      "Developers manage CP onboarding, brokerage tracking, and payments in disconnected tools, causing CP disengagement, commission disputes, and broker loss to competitors.",
    demoLink: "https://demo.cpmanagement.com",
    type: "CRM",
    isActive: true,
  },
  {
    id: "3",
    name: "GoPhygital.work (Corporate) / ZUWOS*",
    slug: "gophygital-corporate",
    company: "GoPhygital",
    businessSPOC1: "Sadanand",
    businessSPOC2: "Gayatri",
    productDescription:
      "GoPhygital.work (Corporate) / ZUWOS is a unified workplace platform for facilities, access, booking, parking, cafeteria, and analytics.",
    purpose:
      "Unify workplace and facility operations into a single platform on client-owned infrastructure.",
    industries:
      "Offices, Commercial Real Estate, IT Park, Co-working, Manufacturing, BFSI, IT/ITES, Banking, Education, Hospitals, Health Care, Retail Chain, FMCG, Facility Management, Property Management, Pharma, Industrial & Logistic Parks, SEZ",
    problemSolved:
      "Organisations use 6-12 disconnected workplace tools, creating data silos, compliance risk, and no unified view of space, people, or facility health.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "4",
    name: "GoPhygital.work (Tenants Building)*",
    slug: "gophygital-tenants",
    company: "GoPhygital",
    businessSPOC1: "Anjali",
    businessSPOC2: "Ubaid",
    productDescription:
      "GoPhygital.work (Tenants Building) is a white-labelled tenant app for building services, access, bookings, and community engagement.",
    purpose:
      "Provide occupants a seamless digital interface for daily building interactions.",
    industries:
      "Commercial Real Estate, Offices, IT Park, Co-working, Tenants, Retail, Malls, Hospitals, BFSI, IT/ITES, Retail Chain, SEZ, Warehousing",
    problemSolved:
      "Commercial tenants lack a single digital channel for building interactions, relying on WhatsApp, phone calls, and paper registers that cause delays, errors, and poor experience.",
    type: "Customer Portal",
    isActive: true,
  },
  {
    id: "5",
    name: "Project & Task Manager",
    slug: "task-manager",
    company: "Lockated",
    businessSPOC1: "Gayatri",
    businessSPOC2: "Deepak Yadav",
    productDescription:
      "Project & Task Manager (PATM) is a data-sovereign platform for project collaboration, documents, tasks, and sprint execution.",
    purpose:
      "Consolidate project management, communication, documents, and MOMs into one platform.",
    industries:
      "IT/ITES, Real Estate Development, EPCE, Professional Services, Manufacturing, BFSI, Banking, Co-working, Offices, Education, Hospitals, Health Care, Retail Chain, Pharma, Chemicals, Industrial & Logistic Parks, Facility Management",
    problemSolved:
      "Organisations run projects across 4-6 disconnected tools, each storing company data on vendor infrastructure, creating context-switching, data fragmentation, and IP leakage risk.",
    type: "Facility Management",
    isActive: true,
  },
  {
    id: "6",
    name: "Vendor Management",
    slug: "vendor-management",
    company: "Lockated",
    businessSPOC1: "Saba",
    businessSPOC2: "Dinesh",
    productDescription:
      "Vendor Management System (VMS) is a vendor lifecycle platform for onboarding, compliance, performance, procurement, and ERP linkage.",
    purpose:
      "Digitise and control the full vendor lifecycle from onboarding to compliance and integration.",
    industries:
      "Manufacturing, Real Estate Development, EPCE, Retail Chain, E-Commerce, Industrial & Logistic Parks, Warehousing, Hospitals, Health Care, Pharma, BFSI, Banking, Hospitality, Facility Management, IT/ITES, Education, Chemicals, Commercial Real Estate",
    problemSolved:
      "Vendor onboarding happens through emails and spreadsheets, causing 12-18 day delays, GST blind spots, duplicate records, no self-service, and higher procurement and regulatory risk.",
    type: "Vendor Portal",
    isActive: true,
  },
  {
    id: "7",
    name: "Procurement/ Contracts/ Tendering",
    slug: "procurement",
    company: "Lockated",
    businessSPOC1: "Saba",
    businessSPOC2: "Dinesh",
    productDescription:
      "Procurement, Contracts & Tendering is a procure-to-pay platform for RFQs, bids, POs, GRNs, inventory, and payments.",
    purpose:
      "Govern end-to-end procurement and tendering with compliance and audit trails.",
    industries:
      "Manufacturing, Real Estate Development, EPCE, Retail Chain, Industrial & Logistic Parks, Hospitals, Health Care, BFSI, Hospitality, Facility Management, IT/ITES, Education, Pharma, Chemicals, Commercial Real Estate, SEZ, Data Centers",
    problemSolved:
      "Procurement runs on emails, Excel comparatives, and manual approvals, creating compliance risk, weak vendor accountability, and no audit trail for contract terms.",
    type: "Vendor Portal",
    isActive: true,
  },
  {
    id: "8",
    name: "Loyalty Management & Cold Wallet",
    slug: "loyalty-engine",
    company: "Lockated",
    businessSPOC1: "Vinayak",
    businessSPOC2: "Komal",
    productDescription:
      "Loyalty Management & Cold Wallet is a configurable rewards platform for loyalty rules, wallet control, and redemptions.",
    purpose:
      "Enable no-code design and automation of flexible customer loyalty programmes.",
    industries:
      "Real Estate Development, Residential, BFSI, Banking, Automobiles, Hospitality, Clubs, Retail Chain, Malls, E-Commerce, Health Care, Hospitals, Education, Telecom, FMCG, Professional Services, IT/ITES, F&B",
    problemSolved:
      "Loyalty programmes in complex industries rely on spreadsheets or rigid CRM modules, with no flexible rule engine, idle points, no escrow controls, and batch-blast marketing instead of event-triggered rewards.",
    type: "Loyalty",
    isActive: true,
  },
  {
    id: "9",
    name: "Incident Management*",
    slug: "incident-management",
    company: "GoPhygital",
    businessSPOC1: "Abdul",
    businessSPOC2: "Vinayak",
    productDescription:
      "Incident Management is an end-to-end incident resolution platform for reporting, RCA, CAPA, escalation, and closure.",
    purpose:
      "Capture, investigate, and resolve incidents with full auditability and compliance.",
    industries:
      "Offices, Manufacturing, EPCE, Hospitals, Health Care, Facility Management, Commercial Real Estate, IT Park, Industrial & Logistic Parks, Data Centers, Pharma, Chemicals, SEZ, Warehousing",
    problemSolved:
      "Incidents are reported informally via WhatsApp and phone, with no investigation framework, SLA tracking, or corrective action management, causing repeat safety events, compliance failures, rising LTIR, and weak audit readiness.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "10",
    name: "HSE App (Piramal Safety)*",
    slug: "hse-app",
    company: "Lockated",
    businessSPOC1: "Siddharth",
    businessSPOC2: "Vinayak",
    productDescription:
      "The HSE App is a mobile HSE platform for safety observations, incidents, PTW, audits, and contractor checks.",
    purpose:
      "Manage end-to-end workplace safety operations with real-time visibility and control.",
    industries:
      "Manufacturing, EPCE, Industrial & Logistic Parks, Warehousing, Pharma, Chemicals, Hospitals, Data Centers, SEZ",
    problemSolved:
      "Industrial operations rely on paper safety registers, phone-based reporting, and manual compliance tracking, causing near-miss under-reporting, contractor safety gaps, audit failures.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "11",
    name: "PTW (Permit to Work)*",
    slug: "ptw",
    company: "GoPhygital",
    businessSPOC1: "Abdul",
    businessSPOC2: "Vinayak",
    productDescription:
      "The Permit to Work (PTW) platform is a digital permit system for approvals, field execution, compliance, and closure.",
    purpose:
      "Control high-risk work through structured permits, approvals, and compliance tracking.",
    industries:
      "Manufacturing, EPCE, Industrial & Logistic Parks, Facility Management, Data Centers, IT Park, Pharma, Chemicals, Warehousing, SEZ",
    problemSolved:
      "Paper permit workflows let high-risk work proceed with bypassed approvals, undocumented risk assessments, and no field-level compliance tracking, making regulatory proof and safety auditing difficult.",
    type: "Facility Management",
    isActive: true,
  },
  {
    id: "12",
    name: "Parking*",
    slug: "parking",
    company: "GoPhygital",
    businessSPOC1: "Ubaid",
    businessSPOC2: "Abdul",
    productDescription:
      "The Parking Management platform is a parking operations platform for booking, allocation, entry tracking, and utilisation.",
    purpose:
      "Optimise parking allocation, booking, and utilisation across workplaces.",
    industries:
      "Commercial Real Estate, Offices, Retail, Malls, Hospitals, IT Park, Co-working, Residential, Mixed-use Real Estate, Hospitality, SEZ, Industrial & Logistic Parks, Data Centers",
    problemSolved:
      "Parking facilities use manual registers, uncontrolled entry, phone-based slot requests, and unreconciled revenue, causing congestion, overbooking, lost revenue, poor experience, and lack of data on demand.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "13",
    name: "Club Management",
    slug: "club-management",
    company: "Lockated",
    businessSPOC1: "Saba",
    businessSPOC2: "Deepak Yadav",
    productDescription:
      "Club Management by Lockated is a club operations platform for memberships, bookings, billing, POS, inventory, and loyalty.",
    purpose:
      "Manage all club operations—memberships, bookings, F&B, and finances—in one system.",
    industries:
      "Clubs, Hospitality, Residential, Education, Community Management, Co-living, Offices, F&B, Mixed-use Real Estate",
    problemSolved:
      "Over 70% of premium Tier-1 clubs still use manual bookings and renewals, global platforms store member data offshore in DPDPA-sensitive ways, and no Indian competitor offers co-player matching, community features, or AI analytics.",
    type: "CRM",
    isActive: true,
  },
  {
    id: "14",
    name: "Facility Management",
    slug: "facility-management",
    company: "GoPhygital",
    businessSPOC1: "Abdul & Anjali",
    businessSPOC2: "Ubaid",
    productDescription:
      "FM Matrix is an enterprise FM platform for maintenance, utilities, security, space, finance, and people operations.",
    purpose:
      "Unify multi-site facility management operations and reporting into one platform.",
    industries:
      "Commercial Real Estate, IT Park, Manufacturing, Hospitals, Co-working, Retail Chain, Malls, Education, Hospitality, Facility Management, Industrial & Logistic Parks, SEZ, Data Centers, Warehousing, Offices, Health Care, Pharma, Chemicals, EPCE, Residential",
    problemSolved:
      "Most organisations run 5-12 disconnected FM tools with no integration, creating blind spots on facility health, missed compliance deadlines, and fragmented tenant experience.",
    type: "Facility Management",
    isActive: true,
  },
  {
    id: "15",
    name: "Customer App Pre Sales*",
    slug: "customer-app-pre-sales",
    company: "Lockated",
    businessSPOC1: "Komal",
    businessSPOC2: "Ubaid",
    productDescription:
      "Customer App Pre Sales is a white-labelled buyer app for project discovery, walkthroughs, unit selection, and booking.",
    purpose:
      "Enable self-service buyer discovery, selection, and booking for real estate projects.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Mixed-use Real Estate",
    problemSolved:
      "Developers rely on broker-mediated and in-person sales with no direct digital buyer channel, losing leads, increasing broker dependency, and lacking pre-booking buyer behaviour data.",
    type: "Pre - Sales",
    isActive: false,
  },
  {
    id: "16",
    name: "Customer App Post Sales",
    slug: "customer-app-post-sales",
    company: "Lockated",
    businessSPOC1: "Komal",
    businessSPOC2: "Ubaid",
    productDescription:
      "Customer App Post Sales is a referral and loyalty platform that turns buyers into advocates.",
    purpose:
      "Convert homebuyers into referral-driven sales channels through loyalty and engagement.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Mixed-use Real Estate, Hospitality",
    problemSolved:
      "After booking, developers lose contact with buyers, leaving satisfied homebuyers idle with no referral system, no loyalty programme, and no way to capture home loan commission revenue.",
    type: "Post - Sales",
    isActive: true,
  },
  {
    id: "17",
    name: "Customer App Post Possession",
    slug: "customer-app-post-possession",
    company: "Lockated",
    businessSPOC1: "Deepak Gupta",
    businessSPOC2: "Dinesh",
    productDescription:
      "Customer App Post Possession is a resident app for community services, gate management, bookings, billing, and engagement.",
    purpose:
      "Provide residents and developers a unified post-handover community and operations platform.",
    industries:
      "Residential, Community Management, Mixed-use Real Estate, Co-living, Property Management",
    problemSolved:
      "After handover, developers lose contact with buyers while facility teams juggle 6-10 disconnected tools, unauthorised vendor apps expose community data, and satisfied residents are never formally captured for referrals.",
    type: "Customer Portal",
    isActive: true,
  },
  {
    id: "18",
    name: "Lease Management",
    slug: "lease-management",
    company: "Lockated",
    businessSPOC1: "Deepak Yadav",
    businessSPOC2: "Deepak Gupta",
    productDescription:
      "Lease Management is a lease administration platform for rent, compliance, AMC, utilities, maintenance, and reporting.",
    purpose:
      "Centralise lease management, financial tracking, and compliance across properties.",
    industries:
      "Commercial Real Estate, Retail Chain, Malls, IT Park, SEZ, Industrial & Logistic Parks, Warehousing, Hospitals, Health Care, Education, Hospitality, F&B, Co-working, Co-living, BFSI, Banking, Manufacturing, Chemicals, Property Management, Asset Management, Landlords, Tenants, Offices, Residential",
    problemSolved:
      "Large organisations managing 50-500+ leased properties run on Excel and email, missing rent escalations, paying incorrect CAM charges, failing compliance audits, and lacking real-time lease liability visibility.",
    type: "Facility Management",
    isActive: true,
  },
  {
    id: "19",
    name: "Life Compass *",
    slug: "life-compass",
    company: "GoPhygital",
    businessSPOC1: "Gayatri",
    businessSPOC2: "Deepak Yadav",
    productDescription:
      "Life Compass is a personal productivity app for goals, habits, tasks, journaling, and wellbeing.",
    purpose:
      "Align daily habits, tasks, and goals to drive productivity and personal wellbeing.",
    industries:
      "Professional Services, Education, Offices, Co-working, IT/ITES, Hospitals, BFSI, Banking, Retail Chain",
    problemSolved:
      "Individuals manage goals, habits, and personal development across scattered apps and notebooks, leading to inconsistent follow-through, untracked progress, burnout risk, and a gap between intention and execution.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "20",
    name: "Business Compass *",
    slug: "business-compass",
    company: "GoPhygital",
    businessSPOC1: "Gayatri",
    businessSPOC2: "Deepak Yadav",
    productDescription:
      "Business Compass is a strategy execution platform for OKRs, KPIs, reviews, and performance tracking.",
    purpose:
      "Cascade and track business goals and KPIs with real-time performance visibility.",
    industries:
      "Commercial Real Estate, Offices, Real Estate Development, Manufacturing, BFSI, IT/ITES, Retail Chain, Hospitality, Education, Co-working",
    problemSolved:
      "Business strategy lives in offline decks and spreadsheets disconnected from execution, causing team misalignment, missed review cycles, no real-time goal visibility, and no chance to course-correct before targets are missed.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "21",
    name: "Gate Management (Smart Secure & QuikGate) *",
    slug: "gate-management",
    company: "Lockated",
    businessSPOC1: "Deepak Gupta",
    businessSPOC2: "Ubaid",
    productDescription:
      "Gate Management (Smart Secure & QuikGate) is a digital access platform for visitors, vehicles, contractors, and materials.",
    purpose:
      "Digitise and control access for visitors, vehicles, contractors, and materials.",
    industries:
      "Residential, Commercial Real Estate, Offices, IT Park, Industrial & Logistic Parks, Warehousing, Manufacturing, Hospitals, Malls, Co-working, SEZ, Data Centers, Community Management",
    problemSolved:
      "Gate operations depend on physical registers, WhatsApp visitor approvals, and manual vehicle verification, creating unauthorised access risk, no real-time visibility, compliance audit gaps, and no traceable digital incident record.",
    type: "Visitor Management",
    isActive: true,
  },
  {
    id: "22",
    name: "Surveys",
    slug: "surveys",
    company: "GoPhygital",
    businessSPOC1: "Abdul",
    businessSPOC2: "Dinesh",
    productDescription:
      "Surveys is a configurable feedback platform for questionnaires, distribution, analytics, and sentiment tracking.",
    purpose:
      "Collect and analyse structured feedback to drive data-led improvements.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Manufacturing, BFSI, IT/ITES, Hospitality, Education, Health Care, Hospitals, Retail Chain, Facility Management, Professional Services, Co-working, Clubs",
    problemSolved:
      "Feedback is collected through untracked email surveys, WhatsApp polls, and physical forms, resulting in low response rates, unstructured data, no sentiment analysis, no trend tracking, and no actionable insight.",
    type: "Facility Management",
    isActive: true,
  },
  {
    id: "23",
    name: "LMS & Sales CRM",
    slug: "lms-sales-crm",
    company: "Lockated",
    businessSPOC1: "Sagar",
    businessSPOC2: "Sakshi",
    productDescription:
      "LMS & Sales CRM is a lead-to-training platform for pipeline management, follow-ups, content, and performance tracking.",
    purpose:
      "Enable sales teams with integrated training, content, and pipeline management tools.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Mixed-use Real Estate, Hospitality, Co-working, Clubs, Offices",
    problemSolved:
      "Real estate sales teams use separate training and CRM tools, so knowledge gaps in product features and project updates lead to lost sales and inconsistent buyer pitches.",
    type: "CRM",
    isActive: false,
  },
  {
    id: "24",
    name: "Support CRM *",
    slug: "support-crm",
    company: "Lockated",
    businessSPOC1: "Sagar",
    businessSPOC2: "Sakshi",
    productDescription:
      "Support CRM is a ticketing platform for customer support, SLAs, escalations, and resolution tracking.",
    purpose:
      "Manage customer support with structured ticketing, SLAs, and resolution tracking.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Facility Management, Property Management, Hospitality, IT/ITES, BFSI, Education, Retail Chain, Clubs, Health Care",
    problemSolved:
      "Customer queries arrive via WhatsApp, email, and phone without unified tracking, causing missed SLAs, duplicate tickets, repeat follow-ups, and no visibility into backlog, resolution quality, or team performance.",
    type: "CRM",
    isActive: false,
  },
  {
    id: "25",
    name: "Real Estate CRM*",
    slug: "real-estate-crm",
    company: "Lockated",
    businessSPOC1: "Sagar",
    businessSPOC2: "Sakshi",
    productDescription:
      "Real Estate CRM is a real estate sales ERP for leads, quotations, bookings, payments, and compliance.",
    purpose:
      "Manage the full real estate sales and buyer lifecycle from lead to possession.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Mixed-use Real Estate, Hospitality, Asset Management, Co-working, Offices",
    problemSolved:
      "Generic CRMs are not built for real estate, lacking unit inventory, RERA fields, brokerage tracking, and payment milestone workflows, forcing Excel workarounds.",
    type: "CRM",
    isActive: false,
  },
  {
    id: "26",
    name: "MSafe *",
    slug: "msafe",
    company: "GoPhygital",
    businessSPOC1: "Vinayak",
    businessSPOC2: "Deepak Gupta",
    productDescription:
      "MSafe is a health and safety compliance platform for risk checks, training, observations, and access control.",
    purpose:
      "Monitor and enforce health, safety, and wellbeing compliance across workforces.",
    industries:
      "Manufacturing, EPCE, Industrial & Logistic Parks, Pharma, Chemicals, Data Centers, Warehousing, Hospitals, Facility Management, SEZ",
    problemSolved:
      "HSW compliance is tracked through paper registers and email follow-ups across distributed teams, creating gaps in at-risk monitoring, missed training, no leadership visibility on safety tours, and weak audit readiness.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "27",
    name: "Appointments *",
    slug: "appointments",
    company: "Lockated",
    businessSPOC1: "Deepak Gupta",
    businessSPOC2: "Sakshi",
    productDescription:
      "Appointments is a scheduling platform for availability, booking, calendar coordination, and MOM generation.",
    purpose:
      "Automate scheduling, calendar coordination, and meeting accountability with MOMs.",
    industries:
      "Hospitals, Health Care, Offices, Co-working, Professional Services, Education, BFSI, Clubs, Hospitality, Real Estate Development",
    problemSolved:
      "Appointments are managed through phone calls, WhatsApp, and manual calendars, causing scheduling conflicts, high no-show rates, poor resource use, and undocumented, unassigned meeting outcomes.",
    type: "CRM",
    isActive: false,
  },
  {
    id: "28",
    name: "Accounting *",
    slug: "accounting",
    company: "Lockated",
    businessSPOC1: "Saba",
    businessSPOC2: "Deepak Yadav",
    productDescription:
      "Accounting is a financial management platform for GL, AP/AR, invoicing, compliance, budgeting, and reporting.",
    purpose:
      "Manage end-to-end financial operations with compliance and real-time reporting.",
    industries:
      "Real Estate Development, Residential, Commercial Real Estate, Clubs, Facility Management, Property Management, Manufacturing, BFSI, IT/ITES, Hospitality, Retail Chain, Education, Co-working, Offices",
    problemSolved:
      "Financial operations are split across disconnected invoicing, payroll, and ledger tools, causing delayed month-end close, reconciliation errors, missed GST/TDS deadlines, and no real-time cash flow or receivables visibility.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "29",
    name: "MOM with Phone Mic *",
    slug: "mom-phone-mic",
    company: "Lockated",
    businessSPOC1: "Sadanand",
    businessSPOC2: "",
    productDescription:
      "MOM with Phone Mic is an AI meeting notes tool that records, transcribes, and links action items to tasks.",
    purpose:
      "Automate meeting transcription, action tracking, and task-linked follow-ups.",
    industries:
      "Real Estate Development, EPCE, Manufacturing, IT/ITES, BFSI, Professional Services, Offices, Co-working, Education, Hospitals, Facility Management, Retail Chain",
    problemSolved:
      "Meeting minutes are written manually, shared informally over WhatsApp, and never tracked, causing forgotten action items, undocumented decisions, and no accountability for commitments across internal, contractor, or client meetings.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "30",
    name: "HRMS *",
    slug: "hrms",
    company: "GoPhygital",
    businessSPOC1: "",
    businessSPOC2: "",
    productDescription:
      "HRMS is a workforce management platform for attendance, payroll, leave, appraisals, and ESS.",
    purpose:
      "Manage the complete employee lifecycle with integrated HR operations and analytics.",
    industries:
      "Manufacturing, Real Estate Development, Commercial Real Estate, IT/ITES, BFSI, Hospitality, Retail Chain, Education, Hospitals, Facility Management, Co-working, Offices, Pharma, Clubs, FMCG",
    problemSolved:
      "HR operations are spread across attendance devices, Excel payroll sheets, email leave approvals, and manual appraisals, creating statutory risk, payroll errors, delayed close, and no unified workforce view.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "31",
    name: "ESG *",
    slug: "esg",
    company: "GoPhygital",
    businessSPOC1: "",
    businessSPOC2: "",
    productDescription:
      "ESG is a sustainability reporting platform for data capture, KPI tracking, and disclosure compliance.",
    purpose:
      "Digitise ESG tracking and reporting for regulatory and investor compliance.",
    industries:
      "Manufacturing, EPCE, Real Estate Development, Commercial Real Estate, Industrial & Logistic Parks, BFSI, IT/ITES, Pharma, Chemicals, Hospitals, SEZ, Data Centers, Warehousing",
    problemSolved:
      "ESG data is manually assembled from 10+ teams in Excel, creating inconsistent metrics, unverifiable claims, delayed disclosures, and no way to show measurable year-on-year progress in reviews.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "32",
    name: "Mailing *",
    slug: "mailing",
    company: "GoPhygital",
    businessSPOC1: "",
    businessSPOC2: "",
    productDescription:
      "Mailing is a communication platform for campaigns, notifications, OTPs, alerts, and delivery analytics.",
    purpose:
      "Manage campaigns, notifications, and alerts with segmentation and analytics.",
    industries:
      "All Industries — Real Estate Development, Commercial Real Estate, Manufacturing, BFSI, IT/ITES, Hospitality, Retail Chain, Education, Hospitals, Facility Management, Professional Services, Clubs, Co-working",
    problemSolved:
      "Organisations manage communication through separate tools for marketing emails, system notifications, and operational alerts, causing inconsistent messaging, no unified delivery tracking, manual campaign execution, and no visibility into sender reputation or cost.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "33",
    name: "Microsoft Office Alternative *",
    slug: "office-alternative",
    company: "GoPhygital",
    businessSPOC1: "",
    businessSPOC2: "",
    productDescription:
      "Microsoft Office Alternative is a data-sovereign productivity suite for docs, sheets, slides, and co-authoring.",
    purpose:
      "Provide a full productivity suite for documents, collaboration, and team workflows.",
    industries:
      "All Industries — Real Estate Development, Commercial Real Estate, Manufacturing, BFSI, IT/ITES, Hospitality, Education, Hospitals, Retail Chain, Facility Management, Professional Services, EPCE",
    problemSolved:
      "Organisations using Microsoft 365 or Google Workspace store documents and correspondence on foreign cloud servers, creating data sovereignty risk, subscription dependency, and compliance exposure under DPDPA or residency laws.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "34",
    name: "Budgeting (WBS) *",
    slug: "budgeting-wbs",
    company: "Lockated",
    businessSPOC1: "",
    businessSPOC2: "",
    productDescription:
      "Budgeting (WBS) is a project budgeting platform for WBS-level cost tracking, variance, and control.",
    purpose:
      "Track and control project budgets at WBS level with real-time variance insights.",
    industries:
      "EPCE, Real Estate Development, Manufacturing, Commercial Real Estate, Industrial & Logistic Parks, Data Centers, IT Park, Facility Management, SEZ",
    problemSolved:
      "Project budgets are built in Excel WBS files disconnected from procurement and accounting, causing cost overruns to surface late, manual variance calculations, and no early warning when costs near or exceed limits.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "35",
    name: "Liquidtext *",
    slug: "liquidtext",
    company: "Lockated",
    businessSPOC1: "",
    businessSPOC2: "",
    productDescription:
      "LiquidText is a multi-document analysis platform for annotation, cross-referencing, and insight synthesis.",
    purpose:
      "Analyse and synthesise insights across multiple documents in a unified workspace.",
    industries:
      "Professional Services, BFSI, Banking, Education, Real Estate Development, IT/ITES, Hospitals, Offices, Co-working",
    problemSolved:
      "Professionals handling multiple complex documents must read sequentially without cross-document insight, slowing synthesis, missing connections, and reducing knowledge extraction efficiency.",
    type: "Facility Management",
    isActive: false,
  },
  {
    id: "36",
    name: "Vi Miles *",
    slug: "vi-miles",
    company: "GoPhygital",
    businessSPOC1: "Vinayak",
    businessSPOC2: "",
    productDescription:
      "Vi Miles is a multi-partner loyalty platform for earning and redeeming miles across categories.",
    purpose:
      "Enable a multi-partner rewards ecosystem for retention and cross-category engagement.",
    industries:
      "Hospitality, Telecom, BFSI, Clubs, Automobiles, Retail Chain, FMCG, E-Commerce, F&B, Education",
    problemSolved:
      "Single-brand loyalty programmes have low redemption and engagement because points are siloed, so customers disengage when they cannot redeem across the services they actually use.",
    type: "Loyalty",
    isActive: false,
  },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    []
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("active");

  // Extract unique product types from data
  const uniqueProductTypes = React.useMemo(() => {
    const types = productData
      .map((p) => p.type)
      .filter((type): type is string => !!type);
    return Array.from(new Set(types)).sort();
  }, []);

  // Extract unique industries from data
  const uniqueIndustries = React.useMemo(() => {
    const allIndustries = productData
      .flatMap((p) => p.industries.split(",").map((i) => i.trim()))
      .filter(Boolean);
    return Array.from(new Set(allIndustries)).sort();
  }, []);

  const columns: ColumnConfig[] = [
    {
      key: "name",
      label: "product",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "company",
      label: "company",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },

    {
      key: "businessSPOC1",
      label: "business SPOC1",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "businessSPOC2",
      label: "business SPOC2",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "productDescription",
      label: "Product Description",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "purpose",
      label: "Purpose",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "industries",
      label: "Industries",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "problemSolved",
      label: "Problem it solved",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "isActive",
      label: "status",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "demoLink",
      label: "Demo Link",
      sortable: false,
      draggable: true,
      defaultVisible: true,
    },
  ];

  const renderCell = (product: Product, columnKey: string) => {
    switch (columnKey) {
      case "isActive":
        return (
          <div className="flex items-center justify-center">
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                product.isActive
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-gray-100 text-gray-600 border border-gray-300"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      case "industries":
        return (
          <div className="flex flex-wrap gap-1.5">
            {product.industries &&
              product.industries.split(",").map((ind, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200 whitespace-nowrap"
                  title={ind.trim()}
                >
                  {ind.trim()}
                </span>
              ))}
          </div>
        );
      case "productDescription":
      case "problemSolved":
        return (
          <div className="text-xs text-gray-700 leading-relaxed font-normal whitespace-normal">
            {product[columnKey as keyof Product]}
          </div>
        );
      case "purpose":
        return (
          <div className="text-xs text-gray-600 leading-relaxed font-normal whitespace-normal">
            {product.purpose}
          </div>
        );
      case "demoLink":
        return product.demoLink ? (
          <a
            href={product.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
          >
            View Demo <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-gray-400 font-normal italic">N/A</span>
        );
      case "company":
        return (
          <span className="text-xs font-semibold text-gray-900">
            {product.company}
          </span>
        );
      case "businessSPOC1":
        return product.businessSPOC1 ? (
          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            {product.businessSPOC1}
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        );
      case "businessSPOC2":
        return product.businessSPOC2 ? (
          <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
            {product.businessSPOC2}
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        );
      case "name": {
        const displayName = product.name.replace(/\s*\*\s*$/, "");
        return (
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            className="text-blue-600 font-bold hover:underline text-left text-xs leading-relaxed"
          >
            {displayName}
          </button>
        );
      }
      default:
        return (
          <span className="text-xs text-gray-900">
            {product[columnKey as keyof Product] as string}
          </span>
        );
    }
  };

  const renderActions = (product: Product) => (
    <div className="flex items-center justify-center">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all"
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const filteredProducts = productData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.industries.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      selectedProductTypes.length === 0 ||
      (product.type && selectedProductTypes.includes(product.type));

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      selectedIndustries.some((industry) =>
        product.industries.toLowerCase().includes(industry.toLowerCase())
      );

    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "active" && product.isActive) ||
      (selectedStatus === "inactive" && !product.isActive);

    return matchesSearch && matchesType && matchesIndustry && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans">
      <style>{`
        /* Standard Header Override */
        [data-radix-scroll-area-viewport] thead tr th,
        .bg-\\[\\#f6f4ee\\] {
          background-color: #113262 !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.025em !important;
          border-bottom: 2px solid #081d3a !important;
          padding: 14px 12px !important;
        }
        /* Fix sorting icons */
        [data-radix-scroll-area-viewport] thead tr th svg {
          color: #FFFFFF !important;
        }
        /* Table content tweaks */
        td {
          vertical-align: top !important;
          padding: 14px 12px !important;
          border-right: 1px solid #e5e7eb !important;
          white-space: normal !important;
          word-wrap: break-word !important;
          font-size: 12px !important;
          line-height: 1.6 !important;
        }
        th, [data-radix-scroll-area-viewport] thead tr th {
          white-space: normal !important;
          word-wrap: break-word !important;
        }
        /* Column width controls */
        td:nth-child(1) { min-width: 80px !important; max-width: 250px !important; } /* Product */
        td:nth-child(2) { min-width: 250px !important; max-width: 300px !important; } /* Company */
        td:nth-child(3) { min-width: 140px !important; max-width: 180px !important; text-align: center !important; } /* Status */
        td:nth-child(4) { min-width: 140px !important; max-width: 150px !important; } /* SPOC1 */
        td:nth-child(5) { min-width: 130px !important; max-width: 150px !important; } /* SPOC2 */
        td:nth-child(6) { min-width: 250px !important; max-width: 300px !important; } /* Description */
        td:nth-child(7) { min-width: 280px !important; max-width: 280px !important; } /* Purpose */
        td:nth-child(8) { min-width: 250px !important; max-width: 400px !important; } /* Industries */
        td:nth-child(9) { min-width: 250px !important; max-width: 300px !important; } /* Problem Solved */
        td:nth-child(10) { min-width: 110px !important; max-width: 120px !important; } /* Demo Link */
        /* Header width controls */
        th:nth-child(1) { min-width: 80px !important; max-width: 200px !important; }
        th:nth-child(2) { min-width: 250px !important; max-width: 300px !important; }
        th:nth-child(3) { min-width: 90px !important; max-width: 90px !important; text-align: center !important; }
        th:nth-child(4) { min-width: 130px !important; max-width: 150px !important; }
        th:nth-child(5) { min-width: 130px !important; max-width: 150px !important; }
        th:nth-child(6) { min-width: 250px !important; max-width: 300px !important; }
        th:nth-child(7) { min-width: 250px !important; max-width: 300px !important; }
        th:nth-child(8) { min-width: 280px !important; max-width: 400px !important; }
        th:nth-child(9) { min-width: 200px !important; max-width: 250px !important; }
        th:nth-child(10) { min-width: 200px !important; max-width: 320px !important; }
        /* Sharp Edges - No Rounding */
        * {
          border-radius: 0 !important;
        }
        .filter-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1em;
        }
        /* Row hover effect */
        tbody tr:hover {
          background-color: #f9fafb !important;
        }
        /* Actions column */
        td:last-child {
          min-width: 80px !important;
          text-align: center !important;
          border-right: none !important;
        }
      `}</style>
      <EmployeeHeader />
      <div className="max-w-[1700px] mx-auto px-6 lg:px-10 pt-20 pb-10 text-[#333333]">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/employee/company-hub")}
            className="group flex items-center gap-2 text-gray-500 transition-all"
          >
            <div className="p-1.5 group-hover:bg-blue-50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Back</span>
          </button>
        </div>

        {/* Header Section - Centered */}
        <div className="text-center mb-8 py-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Lockated Products
          </h1>
          <p className="text-gray-600 text-base leading-relaxed font-medium max-w-3xl mx-auto">
            A comprehensive suite of smart proptech solutions designed to
            digitize and streamline real estate operations. Our ecosystem brings
            intelligent automation to modern communities and commercial spaces.
          </p>
        </div>

        {/* Table Container */}
        <div className=" shadow-sm overflow-x-auto w-full">
          {/* Smart Filter Summary */}

          <EnhancedTable
            data={filteredProducts}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="products-table-v8"
            enableSearch={false}
            hideTableSearch={true}
            hideTableExport={true}
            hideColumnsButton={false}
            leftActions={
              <div className="flex items-center gap-3 flex-wrap">
                {/* Status Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-9 px-3 bg-white border border-[#D3D1C7] text-xs font-medium text-gray-700 focus:ring-1 focus:ring-[#DA7756] outline-none transition-all filter-select appearance-none pr-8"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Product Type - Multi Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                    Product Type
                    {selectedProductTypes.length > 0 && (
                      <span className="ml-2 text-[#DA7756]">
                        ({selectedProductTypes.length} selected)
                      </span>
                    )}
                  </label>
                  <select
                    multiple
                    value={selectedProductTypes}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setSelectedProductTypes(values);
                    }}
                    className="h-9 px-3 bg-white border border-[#D3D1C7] text-xs font-medium text-gray-700 focus:ring-1 focus:ring-[#DA7756] outline-none transition-all min-w-[200px]"
                    size={1}
                  >
                    {uniqueProductTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Industry Type - Multi Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                    Industry Type
                    {selectedIndustries.length > 0 && (
                      <span className="ml-2 text-[#DA7756]">
                        ({selectedIndustries.length} selected)
                      </span>
                    )}
                  </label>
                  <select
                    multiple
                    value={selectedIndustries}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setSelectedIndustries(values);
                    }}
                    className="h-9 px-3 bg-white border border-[#D3D1C7] text-xs font-medium text-gray-700 focus:ring-1 focus:ring-[#DA7756] outline-none transition-all min-w-[200px]"
                    size={1}
                  >
                    {uniqueIndustries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(selectedProductTypes.length > 0 ||
                  selectedIndustries.length > 0 ||
                  selectedStatus !== "active") && (
                  <button
                    onClick={() => {
                      setSelectedProductTypes([]);
                      setSelectedIndustries([]);
                      setSelectedStatus("active");
                      setSearchTerm("");
                    }}
                    className="self-end h-9 px-4 bg-[#DA7756] text-white text-xs font-bold uppercase tracking-wide hover:bg-[#c86645] transition-all shadow-sm flex items-center gap-2"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                )}
              </div>
            }
            rightActions={
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 h-8 w-56 bg-white border border-[#D3D1C7] text-xs font-medium text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-[#DA7756] outline-none transition-all"
                />
              </div>
            }
            emptyMessage="No products found matching your active filters."
            className="products-table"
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
