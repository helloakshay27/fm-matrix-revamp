import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Smartphone, 
  Presentation, 
  FileText, 
  Monitor,
  UserCheck
} from "lucide-react";

const fmMatrixData: ProductData = {
  name: "FM Matrix",
  description: "FM Matrix is a unified Facility Management platform that digitizes and manages Maintenance, Security, Safety, Procurement, and community operations in one system.",
  brief: "Unified platform providing real-time visibility, automated workflows, MIS dashboards, and seamless integrations to improve operational efficiency, compliance, and customer experience.",
  userStories: [
    {
      title: "Facility Manager (Operations Control)",
      items: [
        "Manage assets, maintenance, tickets, and vendors from a single platform.",
        "Real-time dashboards and MIS to track performance, compliance, and costs.",
        "Preventive maintenance schedules and AMC tracking to reduce breakdowns.",
      ],
    },
    {
      title: "Operations Head / Admin (Governance)",
      items: [
        "Configurable workflows for tasks, tickets, audits, and PTW (Permit to Work).",
        "Visual layouts (parking, spaces, assets) for quick and intuitive monitoring.",
        "Vendor performance and SLA tracking to maintain service quality.",
      ],
    },
    {
      title: "Technician / Supervisor (Field Execution)",
      items: [
        "Mobile checklists and task assignments for efficient on-site execution.",
        "Real-time verification of tasks, audits, and incidents for compliance.",
        "Offline capability to ensure work is not disrupted in low-network areas.",
      ],
    },
    {
      title: "Finance & Procurement",
      items: [
        "End-to-end visibility from PR to PO, GRN, invoice, and budgeting.",
        "Inventory and vendor data linked to maintenance for optimized purchasing.",
        "Site-wise and cost center-wise expense tracking for budget enforcement.",
      ],
    },
    {
      title: "Safety & Compliance Officer",
      items: [
        "Digital PTW, incident reporting, and safety checklists.",
        "Audit trails and document repositories for statutory and internal audits.",
        "Emergency preparedness checklists for effective incident response.",
      ],
    },
    {
      title: "CXO / Management (Strategic Oversight)",
      items: [
        "Single dashboard showing operational, financial, and compliance health.",
        "Data-driven insights and trends for planning improvements and investments.",
        "Scalable and standardized processes for enterprise-wide rollout.",
      ],
    },
  ],
  industries: "Facility Management",
  usps: [
    "Unified FM + Business Operations Platform (All-in-one system).",
    "Industry-Aware & Module-Based Architecture (Highly adaptable).",
    "End-to-End Operational & Financial Control (Request to Invoice).",
    "Visual, Data-Driven Execution (Floor layouts & color tagging).",
    "Field-to-Management Connectivity (Mobile-first for all roles).",
  ],
  includes: [
    "Real-time dashboards, MIS & reports",
    "Mobile app, role-based access & integrations",
    "Alerts & Reminders (SMS, Email, App Notification)",
  ],
  upSelling: [
    "Snag 360, Visitor Management, Cloud Telephony, HOTO, Gophygital, Loyalty, WhiteLabel, Lease Management",
  ],
  integrations: [
    "Sap Hana, ID Cube, Salesforce, Active Directory/SSO, XOXO, MyHQ, Gupsup, CCavenue, Immense, Kalera",
  ],
  decisionMakers: ["Admin, Procurement, IT, Management"],
  keyPoints: [
    "Single View of Enterprise Operations",
    "Measurable Cost Reduction & ROI (OPEX optimization)",
    "Risk & Compliance Assurance (Built-in PTW & Audit trails)",
    "Scalability & Lower Total Cost of Ownership (TCO)",
    "Future-Ready Digital Foundation",
  ],
  roi: [
    "Commercial: Operational optimization, extended asset life, improved productivity, tenant-wise visibility.",
  ],
  assets: [
    {
      type: "Link",
      title: "One Pager (Link)",
      url: "https://www.canva.com/design/DAFfC-Ym8_I/m5L4YI8A2B6zQJm0t1o_9A/watch?utm_content=DAFfC-Ym8_I&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha02a3a6ce3",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "IA/ UX (Link)",
      url: "https://www.figma.com/design/o0KITKNatLLU6Djpbyh7ui/FM-Matrix?node-id=14349-6945&t=78Pnp8TGwFNAzNPR-1",
      icon: <Monitor className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Product Video",
      url: "https://www.figma.com/proto/o0KITKNatLLU6Djpbyh7ui/FM-Matrix?node-id=18262-10144&t=78Pnp8TGwFNAzNPR-1",
      icon: <Presentation className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Web Login",
      url: "https://fm.lockated.com/",
      id: "admin@lockated.com",
      pass: "123456",
      icon: <Globe className="w-5 h-5" />,
    },
    {
       title: "Mobile App Access",
       url: "Play Store / App Store",
       id: "9988776655",
       pass: "1234",
       icon: <Smartphone className="w-5 h-5" />
    }
  ],
  owner: "Abdul Ghaffar",
  ownerImage: "/assets/product_owner/abdul_ghaffar.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "FM Matrix" },
        { field: "One-Line Description", detail: "Comprehensive digital workplace and facilities management platform for modern enterprises." },
        { field: "Target Market", detail: "Commercial RE, Corporate Offices, Data Centers, Logistics." },
        { field: "Core Tech Stack", detail: "React, Node.js, AWS, TensorFlow (Security), SAP Integration." },
        { field: "Typical Implementation", detail: "4-8 weeks depending on site complexity." }
      ],
      problemSolves: [
        { painPoint: "Fragmented Data", solution: "Unified dashboard for Maintenance, Safety, and Finance." },
        { painPoint: "High OPEX", solution: "Predictive maintenance reduces energy and repair costs." },
        { painPoint: "Compliance Risks", solution: "Auto-generated audit trails and digital PTW." }
      ],
      whoItIsFor: [
        { role: "Facility Manager", useCase: "Asset lifecycle tracking", frustration: "Manual logs", gain: "100% digital compliance" },
        { role: "Procurement", useCase: "Inventory optimization", frustration: "Stockouts/Overstock", gain: "Just-in-time purchasing" },
        { role: "CXO", useCase: "Strategic planning", frustration: "Decision lag", gain: "Real-time cost visibility" }
      ],
      today: [
        { dimension: "Current Status", state: "Live and deployed at 50+ enterprise sites across India." },
        { dimension: "Key Strength", state: "Deep integration with SAP and high-security biometric systems." },
        { dimension: "Growth Target", state: "500 sites by FY2028." }
      ]
    },
    detailedFeatures: [
      { module: "Asset Management", feature: "Digital Asset Register", subFeatures: "QR Tagging, Lifecycle Tracking, Depreciation", works: "Scan QR to view history", userType: "Technician", usp: true },
      { module: "Maintenance", feature: "PPM Scheduling", subFeatures: "Auto-alerts, Spare parts linking", works: "Calendar-based scheduling", userType: "FM", usp: false },
      { module: "Safety", feature: "Digital PTW", subFeatures: "E-signatures, Exclusion zones", works: "Mobile permit approval", userType: "Safety Officer", usp: true }
    ],
    detailedMarketAnalysis: {
      marketSize: [
        { segment: "Global IFM Market", val2425: "$1.2T", val26: "$1.4T", forecast: "$1.8T by 2030", cagr: "8.2%", driver: "Sustainability/ESG", india: "Fastest growing region" }
      ],
      competitors: [
        { name: "IBM TRIRIGA", hq: "USA", indiaPrice: "High-end", globalPrice: "Global", strength: "Enterprise scale", weakness: "Complexity", sovereignty: "Partial" },
        { name: "Facilio", hq: "India/Global", indiaPrice: "Premium", globalPrice: "Global", strength: "Modern UI/IoT", weakness: "Finance depth", sovereignty: "High" }
      ],
      competitorSummary: "FM Matrix bridges the gap between pure-play CMMS and enterprise ERP, offering better financial control than Facilio and faster deployment than TRIRIGA."
    },
    detailedPricing: {
      featureComparison: [
        { feature: "SAP Integration", snag: "Deep Native", falcon: "Partial", procore: "Plugin", novade: "API", status: "AHEAD" },
        { feature: "Digital PTW", snag: "Integrated", falcon: "Basic", procore: "Module", novade: "Advanced", status: "AT PAR" }
      ],
      pricingLandscape: [
        { tier: "FM Matrix Enterprise", model: "Per Site / Per Year", india: "₹5L - ₹15L", global: "$10k - $30k", target: "Commercial IT Parks" }
      ]
    },
    detailedRoadmap: {
      phases: [
        { title: "Phase 1: Foundation", initiatives: [{ initiative: "IoT Integration", feature: "Live Meter Reading", segment: "Smart Buildings", impact: "Energy saving", timeline: "Q3 2026" }], summary: "Establish live data connectivity across all critical assets." }
      ],
      top5Impact: [
        { rank: 1, name: "Eco-Module", logic: "ESG Compliance integration", leapfrog: "Facilio" }
      ],
      innovationLayer: [
        { id: 1, name: "AI Anomaly Detection", category: "AI/ML", description: "Predict asset failure before it happens", value: "30% reduction in breakdowns", leapfrog: "All", priority: "High Impact" }
      ]
    },
    detailedBusinessPlan: {
      planQuestions: [
        { question: "What is the core value proposition?", answer: "Zero-loss facility operations through unified digital control.", flag: "Ready", source: "Strategy Doc" },
        { question: "How do we scale?", answer: "White-labeling for FM agencies (CBRE, JLL).", flag: "In Review", source: "Roadmap" }
      ],
      founderChecklist: [
        { id: "BP-01", item: "Review CBRE Partnership", verify: "Contract terms", status: "PENDING" }
      ]
    },
    detailedGTM: {
      targetGroups: [
        { title: "Corporate Clients", components: [{ component: "Sales Motion", detail: "Direct enterprise sales focusing on OPEX reduction" }], summaryBox: "Primary focus for high-margin enterprise accounts." }
      ]
    },
    detailedMetrics: {
      clientImpact: [
        { metric: "Maintenance Turnaround", baseline: "48 Hours", withSnag: "4 Hours", claim: "90% improvement in SLA compliance" }
      ],
      businessTargets: [
        { metric: "ARR Growth", definition: "Annual Recurring Revenue", d30Current: "$1M", d30Phase1: "$2.5M", m3Current: "15%", m3Phase1: "40%" }
      ]
    },
    detailedSWOT: {
      strengths: [{ headline: "Deep SAP Integration", explanation: "Native connectors for financial reconciliation." }],
      weaknesses: [{ headline: "Mobile UI Complexity", explanation: "Rich feature set can be overwhelming for field staff." }],
      opportunities: [{ headline: "ESG Reporting", explanation: "Carbon footprint tracking requirements are rising." }],
      threats: [{ headline: "Low-Cost CMMS", explanation: "Basic competitors undercutting on price for single-site clients." }]
    }
  }
};

const FMMatrixPage: React.FC = () => {
  return <BaseProductPage productData={fmMatrixData} />;
};

export default FMMatrixPage;
