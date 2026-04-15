import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  FileText, 
  Monitor,
  Presentation,
  TrendingUp,
  Settings,
  ShieldCheck
} from "lucide-react";

/**
 * Loyalty Engine Product Data
 * ID: 13
 */
const loyaltyEngineData: ProductData = {
  name: "Loyalty Engine",
  description: "A configurable system designed to automatically apply loyalty rewards, points, or benefits based on predefined business rules, without requiring code changes.",
  brief: "Evaluates user actions like payments, referrals, and bookings using logical operatives to trigger automated rewards and custom business logic.",
  userStories: [
    {
      title: "Core Rule Capabilities",
      items: [
        "Commission calculation based on performance rules.",
        "Incentive eligibility verification for partners and employees.",
        "Lead routing automation based on predefined logic.",
        "Partner tier upgrades triggered by achievement milestones.",
      ],
    },
    {
      title: "Operational Workflows",
      items: [
        "Access control logic for feature gating.",
        "Campaign targeting based on user behavior and segment rules.",
        "Automated approval workflows for internal processes.",
        "Penalty and risk rules for compliance monitoring.",
      ],
    },
  ],
  industries: "CRM, Referral & Loyalty Programs, Sales & Finance.",
  usps: [
    "Automation of Complex Business Logic (No code required).",
    "High Flexibility and Scalability for evolving rules.",
    "Built-in Compliance & Risk Management.",
    "Enhanced Reporting & Real-time Analytics.",
  ],
  includes: [
    "Configurable Rule Engine Core",
    "Real-time Logic Evaluation",
    "Audit Trail & Version Control",
    "Custom Operatives (Equals, Greater than, etc.)",
  ],
  upSelling: ["Loyalty (Wallet) App, CRM Suite"],
  integrations: ["CRM Systems, Store / POS Systems, Referral Portals"],
  decisionMakers: ["Business Heads, Sales Operations, Finance, Legal"],
  keyPoints: [
    "Consistency in decision-making across the platform.",
    "Transparency and auditability of applied rules.",
    "Ability to adapt rules quickly to market changes.",
    "Stakeholder trust through data-driven logic.",
  ],
  roi: [
    "Reduced dependency on developers for rule changes.",
    "Improved accuracy in payouts and rewards (Zero manual errors).",
    "Faster time-to-market for new campaigns.",
  ],
  assets: [
    {
      type: "Link",
      title: "Engine Documentation",
      url: "#",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Rule Builder Dashboard",
      url: "https://rules.lockated.com",
      id: "admin.rules@lockated.com",
      pass: "Logic#Safe@1",
      icon: <Settings className="w-5 h-5" />,
    },
  ],
  owner: "Duhita",
  ownerImage: "/assets/product_owner/duhita.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Backbone", detail: "The logical core of the Loyalty and Referral ecosystem." }
      ],
      today: [
        { dimension: "Key Value", state: "Processes 200,000+ rule evaluations monthly for high-volume CRM programs." }
      ]
    }
  }
};

const LoyaltyEnginePage: React.FC = () => {
  return <BaseProductPage productData={loyaltyEngineData} />;
};

export default LoyaltyEnginePage;
