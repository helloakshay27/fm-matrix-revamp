import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Smartphone,
  Monitor,
  UserCheck
} from "lucide-react";

/**
 * GoPhygital Corporate Product Data
 * ID: 8
 */
const goPhygitalData: ProductData = {
  name: "GoPhygital.work (Corporate)",
  description: "A unified digital workplace platform designed to seamlessly bridge physical and digital operations for modern enterprises.",
  brief: "Manage employees, workplace operations, assets, access, safety, and compliance from a single secure ecosystem.",
  userStories: [
    {
      title: "Workplace Operations (Facilities)",
      items: [
        "Digitize assets, maintenance, and facility services for real-time control.",
        "Automated desks and meeting room bookings to optimize space utilization.",
        "Smart parking and visitor management for frictionless entry experiences.",
      ],
    },
    {
      title: "Employee Engagement (Human Resources)",
      items: [
        "Integrated employee directory, communications, and social feed.",
        "Self-service modules for attendance, travel, and benefits management.",
        "Real-time sentiment and peak-hour heatmaps for better resource planning.",
      ],
    },
    {
      title: "Safety & Compliance (Governance)",
      items: [
        "Digital Permit to Work (PTW) and safety audit trails.",
        "Integrated HSW (Health, Safety & Wellbeing) compliance tracking.",
        "Emergency response protocols and real-time personnel accounting.",
      ],
    },
  ],
  industries: "Large Enterprises, IT Technology Firms, Manufacturing, Finance.",
  usps: [
    "Unified Digital Ecosystem (Facility + HR + Security).",
    "Real-time Data Visualization (Site-wise & regional dashboards).",
    "Scalable Multi-Location Hierarchy.",
    "Integrated Health and Safety Framework.",
  ],
  includes: [
    "Real-time dashboards, MIS & reports",
    "Mobile app, role-based access & integrations",
    "Alerts & Reminders (SMS, Email, App Notification)",
  ],
  upSelling: ["GoPhygital Coworking, FM Matrix, MSafe, Incident Management"],
  integrations: [
    "Active Directory (Azure/Okta)",
    "SAP/Oracle ERP",
    "Access Control (ID Cube/HID)",
    "Workday/HRMS",
  ],
  decisionMakers: ["Chief Operating Officer (COO)", "Facility Head", "IT Head", "HR Head"],
  keyPoints: [
    "Operational Efficiency & Cost Control",
    "Enhanced Employee Experience",
    "Risk Mitigation & Compliance Assurance",
    "Data-Driven Growth Planning",
  ],
  roi: [
    "30% reduction in workplace operational costs.",
    "20% improvement in space utilization efficiency.",
    "Significantly lower compliance risk exposure.",
  ],
  assets: [
    {
      type: "Link",
      title: "Web Dashboard",
      url: "https://web.gophygital.work/login",
      icon: <Monitor className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Corporate Admin Access",
      url: "https://web.gophygital.work/login",
      id: "admin@enterprise.com",
      pass: "Corp@2026",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Employee App Login",
      url: "App Store / Play Store",
      id: "Sohail.a@gophygital.work",
      pass: "123456",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  owner: "Sohail Ansari",
  ownerImage: "/assets/product_owner/sohail_ansari.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Type", detail: "Digital Workplace Solution" },
        { field: "Core Value", detail: "Bridging physical workspace with digital agility." }
      ],
      today: [
        { dimension: "Deployment", state: "Live at multiple Tier-1 IT parks and global HQs." }
      ]
    }
  }
};

const GoPhygitalCorporatePage: React.FC = () => {
  return <BaseProductPage productData={goPhygitalData} />;
};

export default GoPhygitalCorporatePage;
