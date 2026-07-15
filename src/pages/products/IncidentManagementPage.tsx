import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Smartphone,
  Presentation,
  FileText, 
  Monitor,
  AlertTriangle,
  ClipboardList
} from "lucide-react";

/**
 * Incident Management Product Data
 * ID: 15
 */
const incidentManagementData: ProductData = {
  name: "Incident Management",
  description: "The Incident Management product is a structured, end-to-end solution designed to help organizations effectively identify, report, investigate, and resolve incidents across facilities and operations.",
  brief: "Enables timely incident reporting with detailed context followed by systematic investigation, root cause analysis, and Corrective and Preventive Action (CAPA) tracking.",
  userStories: [
    {
      title: "Incident Reporting & Tracking",
      items: [
        "Reporting: Simple form for any employee to report incidents immediately with photos and context.",
        "Visibility: Track real-time status of reported incidents to ensure actions are taken.",
        "Supervisor View: Dashboard to prioritize critical cases and maintain a clear incident timeline.",
      ],
    },
    {
      title: "Investigation & Action Stage",
      items: [
        "Investigation: Review Injury/Property damage details and record findings for root cause analysis.",
        "Collaboration: Assign cross-functional committees for review and compliance requirements.",
        "CAPA: Define corrective actions to resolve immediate issues and preventive actions to avoid recurrence.",
      ],
    },
    {
      title: "Governance & Review",
      items: [
        "Closure: Senior management review and approval/rejection of closure after proper verification.",
        "Monitoring: Schedule follow-up tasks to verify compliance with defined CAPA protocols.",
        "Audit: Assess long-term safety improvements by linking task outcomes back to original incidents.",
      ],
    },
  ],
  industries: "Construction, Oil & Gas, Manufacturing, Real Estate, Mining, Healthcare.",
  usps: [
    "Schedule functionality for future audit of CAPA (Verification tasks).",
    "Integrated Corrective & Preventive Actions (Full lifecycle).",
    "Specialized Body Charts for injury tracking.",
    "Built-in Loss Time Injury Reporting (LTIR).",
  ],
  includes: [
    "Incident reporting forms with multimedia support",
    "Systematic investigation & Root Cause Analysis portal",
    "Corrective & Preventive Action (CAPA) tracking",
    "Injury body charts & LTIR dashboards",
  ],
  upSelling: ["Operational Audit, HSE, PTW, Asset & Maintenance packages."],
  integrations: [
    "IVR Systems, Permit to Work (PTW), Asset & Maintenance, SMS/Email/App Notifications.",
  ],
  decisionMakers: ["EHS Head/Director, Operation Director, Safety Officer"],
  keyPoints: [
    "Risk Reduction & Regulatory Compliance.",
    "Incident Reporting Accessibility for non-technical users.",
    "Management Visibility, Accountability & Control.",
    "Audit Readiness & Legal Defensibility.",
  ],
  roi: [
    "Lower downtime & operational losses.",
    "Reduced incident-related costs & penalties.",
    "Improved audit scores and compliance ratings.",
  ],
  assets: [
    {
      type: "Link",
      title: "Incident Workflow",
      url: "#",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Safety Command Center",
      url: "https://fm-matrix.lockated.com",
      id: "abdul.ghaffar@lockated.com",
      pass: "123456",
      icon: <Globe className="w-5 h-5" />,
    },
  ],
  owner: "Shahab Anwar",
  ownerImage: "/assets/product_owner/shahab_anwar.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Safety Lifecycle", detail: "Report -> Investigate -> Resolve -> Prevent" }
      ],
      today: [
        { dimension: "Key Capability", state: "Native mobile reporting with offline support for remote industrial sites." }
      ]
    }
  }
};

const IncidentManagementPage: React.FC = () => {
  return <BaseProductPage productData={incidentManagementData} />;
};

export default IncidentManagementPage;
