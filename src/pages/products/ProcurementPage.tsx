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

/**
 * Procurement/Contracts Product Data
 * ID: 12
 */
const procurementData: ProductData = {
  name: "Procurement/Contracts",
  description: "Complete management of the procurement and contract lifecycle, including vendor onboarding, RFQ, bid comparison, negotiation, PO issuance, and inventory tracking.",
  brief: "Enables seamless management of vendors, tenders, contracts, work orders, and material procurement, ensuring cost control, compliance, and transparency across projects.",
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
        { field: "Value Proposition", detail: "Source-to-Pay digital transformation." }
      ],
      today: [
        { dimension: "Key Advantage", state: "Eliminates manual re-entry and provides absolute budget visibility." }
      ]
    }
  }
};

const ProcurementPage: React.FC = () => {
  return <BaseProductPage productData={procurementData} />;
};

export default ProcurementPage;
