import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Smartphone,
  Presentation,
  FileText, 
  Monitor,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

/**
 * MSafe Product Data
 * ID: 14
 */
const mSafeData: ProductData = {
  name: "MSafe",
  description: "MSafe is a Health, Safety & Wellbeing (HSW) compliance module in the Vi My Workspace app that helps users stay compliant with workplace safety requirements.",
  brief: "Enables stakeholders to monitor HSW Compliances, perform Key Risk Compliance checks (KRCC), and record engagement tours to ensure safety and prevent accidents.",
  userStories: [
    {
      title: "Compliance & Risk Management",
      items: [
        "Line Managers: Perform Key Risk Compliance checks (KRCC) for @risk population.",
        "Stakeholders: Monitor various HSW Compliances of their team members.",
        "Safety Teams: Ensure mandatory training records and Mode of Transport changes are tracked.",
      ],
    },
    {
      title: "Leadership Engagement",
      items: [
        "Senior Management: Record HSW engagement and observations during premises tours.",
        "Leadership: Drive safety culture through visible engagement and compliance health visibility.",
      ],
    },
    {
      title: "On-ground Safety",
      items: [
        "Personnel: Prevent accidents during high-risk tasks through systematic safety policies.",
        "Workforce: Receive real-time alerts for pending or failed compliance actions.",
      ],
    },
  ],
  industries: "Manufacturing, Construction, Oil & Gas, Mining, Logistics, Healthcare, FMCG.",
  usps: [
    "Centralized HSW Compliance Control (Track KRCC, tours, and trainings).",
    "Proactive Risk & Incident Prevention (Identify non-compliance early).",
    "Role-Based Safety Accountability.",
    "Leadership-Driven Safety Culture.",
    "Mobile-first on-ground execution.",
  ],
  includes: [
    "HSW compliance status visibility",
    "Real-time alerts for pending actions",
    "Access control based on compliance status",
    "Mandatory policy acknowledgement",
  ],
  upSelling: ["MSafe + PTW, MSafe + Incident, MSafe + Snag 360"],
  integrations: [
    "Sap Hana, ID Cube, Salesforce, Active Directory/SSO, XOXO, 1 Kosmos, Kaleyra, Gupshup",
  ],
  decisionMakers: ["HSW / EHS Head, Operations Head, IT Team, Senior Management"],
  keyPoints: [
    "Criticality of HSW Compliance for @risk workforce.",
    "Regulatory & Audit Assurance with digital traceability.",
    "Operational Efficiency through automated safety workflows.",
    "Leadership Visibility & Governance across locations.",
  ],
  roi: [
    "Reduced incidents & downtime caused by accidents.",
    "Lower penalties, legal exposure, and insurance costs.",
    "Faster compliance audits via digital records.",
  ],
  assets: [
    {
      type: "Link",
      title: "Feature Matrix",
      url: "https://docs.google.com/spreadsheets/d/1DAMXI3uMsHGcbDcY6w-BiW1blEnECXNpwnrgKWkuh2g/edit?usp=sharing",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "HSW Deck",
      url: "https://docs.google.com/presentation/d/1czao4bZz-62VCGOXiWLk2HSF-y7OleEY/edit?usp=drive_link&ouid=110368399620616741760&rtpof=true&sd=true",
      icon: <Presentation className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Corporate HSW Dashboard",
      url: "https://web.gophygital.work/login",
      id: "Vodafone@lockated.com",
      pass: "123456",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Mobile App Login",
      url: "App Store / Play Store",
      id: "testuser@vodafoneidea.com",
      pass: "123456",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  owner: "Sohail Ansari",
  ownerImage: "/assets/product_owner/sohail_ansari.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Safety Pillar", detail: "The governance layer for workforce risk management." }
      ],
      today: [
        { dimension: "Key Indicator", state: "Monitoring 10,000+ field technicians for real-time safety compliance." }
      ]
    }
  }
};

const MSafePage: React.FC = () => {
  return <BaseProductPage productData={mSafeData} />;
};

export default MSafePage;
