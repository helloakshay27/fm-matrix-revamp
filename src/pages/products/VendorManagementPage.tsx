import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Video,
  FileText, 
  Monitor,
  UserCheck
} from "lucide-react";

/**
 * Vendor Management Product Data
 * ID: 11
 */
const vendorManagementData: ProductData = {
  name: "Vendor Management",
  description: "End-to-end Vendor Management solution covering the complete vendor lifecycle from onboarding, KYC, empanelment, contract management, and compliance tracking to performance evaluation.",
  brief: "Complete vendor lifecycle management, including onboarding, KYC, empanelment, contract administration, compliance monitoring, performance assessment, and payment processing.",
  userStories: [
    {
      title: "Initiator / Admin Flow",
      items: [
        "Send vendor invitations by capturing GST, PAN, contact details, mobile number, and email.",
        "Track vendor invitation status for efficient follow-ups and escalations.",
        "Initiate Re-KYC requests to ensure vendor data remains current and compliant.",
      ],
    },
    {
      title: "Vendor (Self-Service)",
      items: [
        "Securely start registration via invitation link received on email.",
        "Submit comprehensive form (Bank, MSME, Turnover, Statutory docs) without manual intervention.",
        "Save, edit, and update profile for Re-KYC ensuring active compliance status.",
      ],
    },
    {
      title: "Approver & Validation",
      items: [
        "Review registration details (Bank, MSME, Statutory docs) for compliant onboarding.",
        "Automated validation of GST, PAN, and Bank details to avoid duplicates.",
        "Automated notifications for invitations, approvals, and Re-KYC requests.",
      ],
    },
  ],
  industries: "Real Estate, Corporate Offices, Manufacturing, Telecom, Contractors.",
  usps: [
    "End-to-End Vendor Lifecycle (Onboarding to Payment).",
    "Eliminates dependency on spreadsheets and manual tracking.",
    "Supports role-based, multi-level approvals.",
    "Automated GST/PAN/Bank validation.",
  ],
  includes: [
    "Vendor Onboarding & Master Data",
    "Vendor Performance Management",
    "Vendor Self-Service Portal",
    "Compliance Dashboards",
  ],
  upSelling: ["Loyalty Rule Engine, ERP Integration, Procurement Module"],
  integrations: ["SAP Hana, Salesforce (SFDC), Bank APIs"],
  decisionMakers: ["Procurement Head, CFO, Accounts Payable Team"],
  keyPoints: [
    "Real-Time Vendor Performance Scoring.",
    "Configurable Workflows & Multi-level Approvals.",
    "Built-in Compliance & Re-KYC Management.",
  ],
  roi: [
    "Reduced manual overhead in onboarding.",
    "Improved statutory compliance & audit readiness.",
    "Better vendor selection via performance scoring.",
  ],
  assets: [
    {
      type: "Link",
      title: "Resource Library",
      url: "https://cloud.lockated.com/index.php/apps/files/files/148140?dir=/Lockated%20Product%20Portfolio/Vendor%20Management",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Supademo Walkthrough",
      url: "https://app.supademo.com/showcase/cmb53n9t60158zi0ixtn1flw2?utm_source=link&demo=1&step=1",
      icon: <Video className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Vendor Portal Sandbox",
      url: "https://vendors.lockated.com/users/sign_in",
      id: "demo.vendor@lockated.com",
      pass: "Vendor@Sync2",
      icon: <Globe className="w-5 h-5" />,
    },
  ],
  owner: "Ajay Ghenand",
  ownerImage: "/assets/product_owner/ajay_ghenand.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Core Lifecycle", detail: "Onboarding to Payment" }
      ],
      today: [
        { dimension: "Key Value", state: "Centralized source of truth for 5000+ vendors in our ecosystem." }
      ]
    }
  }
};

const VendorManagementPage: React.FC = () => {
  return <BaseProductPage productData={vendorManagementData} />;
};

export default VendorManagementPage;
