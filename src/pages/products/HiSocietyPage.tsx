import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Smartphone, 
  PlayCircle,
  UserCheck
} from "lucide-react";

const hiSocietyData: ProductData = {
  name: "Hi Society",
  description: "Integrated Residential Property management Solution which manages all aspects of a residential property.",
  brief: "The White Label Residential App is a mobile-based solution designed for residents living in gated communities. It helps manage helpdesk, club, fitout, digital documents, security, and communication.",
  userStories: [
    {
      title: "1. Helpdesk",
      items: [
        "Resident Raises a Complaint",
        "Select Issue Category",
        "Track Complaint Status",
        "Management Views & Assigns Complaints",
        "Analytics for Management",
      ],
    },
    {
      title: "2. Communications",
      items: [
        "Community Announcements",
        "Targeted Communication & Push Notifications",
        "Poll Creation & Voting",
        "Emergency Alerts",
      ],
    },
    {
      title: "3. Visitor & Staff",
      items: [
        "Pre-Registration & Digital Invitation",
        "OTP/QR Code Access",
        "Visitor History & Notification of Arrival",
        "Exit Logging",
      ],
    },
    {
      title: "4. Key Modules",
      items: [
        "Digital Safe, Parking Management, Club Management, Fitout Management, Accounting Management, F&B Management",
      ],
    },
  ],
  industries: "Real Estate Developers, RWAs",
  usps: [
    "Fully Customizable Branding (Logo, Colors, Themes)",
    "End-to-End Community Management (Consolidates multiple tools)",
    "Analytics & Insights for management data-driven decisions",
    "Seamless Payment & Billing Integration",
    "White-Label Advantage",
  ],
  includes: ["White Labeled Mobile App", "Community Management CMS"],
  upSelling: ["Loyalty wallet"],
  integrations: ["SFDC (CRM)", "SAP (ERP)"],
  decisionMakers: ["Developers", "RWA", "IT/Digital Teams"],
  keyPoints: [
    "Customization & Branding",
    "Cost & ROI",
    "Security & Compliance",
    "Resident Engagement",
  ],
  roi: [
    "Operational Efficiency (Automates visitor/maintenance/billing)",
    "Revenue Generation (Monetize facilities, vendor partnerships)",
    "Resident Retention (Convenience, higher satisfaction)",
  ],
  assets: [
    {
      type: "Link",
      title: "Demo Video Link",
      url: "https://rb.gy/iuymv",
      icon: <PlayCircle className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Lockated Web URL Login",
      url: "www.lockated.com/login",
      id: "godrejliving@lockated.com",
      pass: "Godrej@4321",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Godrej Living App Login (Android)",
      url: "https://rb.gy/qq45q",
      id: "godrejliving@lockated.com",
      pass: "Godrej@4321",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  owner: "Deepak Gupta",
  ownerImage: "/assets/product_owner/deepak_gupta.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "Hi Society" },
        { field: "Category", detail: "Community Management Software" }
      ],
      today: [
        { dimension: "Reach", state: "Market leader in white-labeled community apps for top developers." }
      ]
    }
  }
};

const HiSocietyPage: React.FC = () => {
  return <BaseProductPage productData={hiSocietyData} />;
};

export default HiSocietyPage;
