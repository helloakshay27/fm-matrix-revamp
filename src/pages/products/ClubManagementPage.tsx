import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Dumbbell, 
  Users, 
  CreditCard 
} from "lucide-react";

const clubData: ProductData = {
  name: "Club Management",
  description: "A comprehensive digital solution for managing residential and commercial clubhouses, gyms, and shared amenities.",
  brief: "Manage memberships, booking for squash/tennis courts, gym access control, and cafe billings in one unified system integrated with the residents app.",
  userStories: [
    {
      title: "Club Manager",
      items: [
        "Manage member tiers and subscription renewals.",
        "Monitor facility usage and peak hours via heatmaps.",
        "Automated billing for guests and event bookings.",
      ],
    },
    {
      title: "Resident Member",
      items: [
        "Pre-book amenities to avoid crowding.",
        "Pay membership dues via the integrated wallet.",
        "Check live gym occupancy before visiting.",
      ],
    },
  ],
  industries: "Residential Societies, Corporate Parks, Gym Chains",
  usps: [
    "Seamless integration with resident mobile apps.",
    "Hardware-level access control (Biometric/QR/RFID).",
    "Comprehensive inventory management for club cafes.",
  ],
  includes: ["Admin Dashboard", "Member App Module", "POS Integration"],
  upSelling: ["Hi Society, Loyalty"],
  integrations: ["Payment Gateways, Access Control Hardware"],
  decisionMakers: ["Society Manager, HR Admin"],
  keyPoints: [
    "Improved Amenities ROI",
    "Reduced Pilferage at Club Cafes",
    "Enhanced Member Satisfaction",
  ],
  roi: [
    "Recover membership dues 40% faster with automated reminders.",
  ],
  assets: [],
  credentials: [
    {
      title: "Club Admin",
      url: "#",
      id: "club@admin.com",
      pass: "123456",
      icon: <Dumbbell className="w-5 h-5" />,
    },
  ],
  owner: "Abdul Ghaffar",
  ownerImage: "/assets/product_owner/abdul_ghaffar.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product", detail: "Club Management" },
        { field: "Target", detail: "High-end residential societies and corporate clubs." }
      ],
      today: [
        { dimension: "Status", state: "Available as an add-on for Hi Society and FM Matrix." }
      ]
    }
  }
};

const ClubManagementPage: React.FC = () => {
  return <BaseProductPage productData={clubData} />;
};

export default ClubManagementPage;
