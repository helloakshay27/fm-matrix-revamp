import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  ShieldCheck, 
  AlertTriangle, 
  HardHat 
} from "lucide-react";

const hseData: ProductData = {
  name: "HSE (Safety & Environment)",
  description: "A professional Health, Safety, and Environment monitoring app for high-risk work environments like construction and industrial sites.",
  brief: "Enforce safety protocols, monitor PPE compliance, report near-miss incidents, and manage digital permits to work (PTW) to ensure a zero-accident site.",
  userStories: [
    {
      title: "Safety Inspector",
      items: [
        "Conduct daily site safety walks using digital checklists.",
        "Raise instant violations with geo-tagged photo evidence.",
        "Monitor contractor safety scores in real-time.",
      ],
    },
    {
      title: "Site Supervisor",
      items: [
        "Apply for high-risk work permits (Hot work, Height work) digitally.",
        "Ensure all workers are briefed on safety protocols via digital sign-off.",
        "Receive instant alerts for safety violations in their zone.",
      ],
    },
  ],
  industries: "Construction, Manufacturing, Logistics",
  usps: [
    "Integrated with HR systems for training verification.",
    "Real-time safety heatmap for large sites.",
    "Automated statutory reporting for compliance.",
  ],
  includes: ["Mobile App", "Compliance Dashboard", "Incident Tracker"],
  upSelling: ["FM Matrix, QC App"],
  integrations: ["Bio-metric attendance, HRMS"],
  decisionMakers: ["EHS Manager, Operations Head"],
  keyPoints: [
    "Zero Accident Vision",
    "Digital Permit Control",
    "Contractor Accountability",
  ],
  roi: [
    "Significant reduction in insurance premiums and legal liabilities.",
  ],
  assets: [],
  credentials: [
    {
      title: "HSE Admin",
      url: "#",
      id: "safety@admin.com",
      pass: "123456",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ],
  owner: "Sagar Singh",
  ownerImage: "/assets/product_owner/sagar_singh.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product", detail: "HSE Safety App" },
        { field: "Focus", detail: "Life-critical safety monitoring." }
      ],
      today: [
        { dimension: "Status", state: "Deployed across 10+ mega-construction projects." }
      ]
    }
  }
};

const HSEAppPage: React.FC = () => {
  return <BaseProductPage productData={hseData} />;
};

export default HSEAppPage;
