import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Smartphone,
  Monitor,
  FileText,
  Presentation,
  PlayCircle
} from "lucide-react";

/**
 * GoPhygital Coworking Product Data
 * ID: 9
 */
const goPhygitalCoworkingData: ProductData = {
  name: "GoPhygital.work (Co-working Space)",
  description: "A unified tenant experience platform designed to bridge the gap between physical workspace operations and digital community engagement.",
  brief: "Built specifically for coworking spaces, it automates friction points like desk booking and visitor entry while fostering a connected community. Empowers operators to monetize space efficiently.",
  userStories: [
    {
      title: "Meeting Room & Hot Desk Booking",
      items: [
        "Real-time availability view for meeting rooms to avoid booking conflicts.",
        "Scan-to-Book QR feature for instant daily Hot Desk security.",
        "Multi-tier membership credit management for correct usage monetization.",
      ],
    },
    {
      title: "Ticket (Helpdesk)",
      items: [
        "Raise support tickets with photo attachments for clear issue communication.",
        "Real-time push notifications for status updates (e.g., 'Resolved').",
        "Admin dashboard for efficient ticket viewing and staff assignment.",
      ],
    },
    {
      title: "Visitor Management",
      items: [
        "Digital pre-invitation/QR entry passes for seamless guest arrival.",
        "Instant check-in notifications for members when guests arrive.",
        "Reception-based QR scanning for secure and efficient check-in.",
      ],
    },
    {
      title: "Mail Room & Community",
      items: [
        "Automatic member notification for arrived packages via label scanning.",
        "Community feed for networking, introductions, and 'Help Needed' requests.",
        "Admin capability to pin critical community announcements.",
      ],
    },
  ],
  industries: "Coworking Space, Business Centers, Managed Offices.",
  usps: [
    "All-in-One Workspace Platform (Spaces, Bookings, Services, Parking).",
    "Real-Time Space Utilization (Live visibility into occupancy).",
    "Seamless Member Experience (Self-service digital access).",
    "Cost & Operations Optimization.",
    "Scalable Multi-Location Management.",
  ],
  includes: [
    "Real-time dashboards, MIS & reports",
    "Mobile app, role-based access & integrations",
    "Alerts & Reminders (Sms, Email, App Notification)",
  ],
  upSelling: ["FM Matrix, Visitor management, Loyalty"],
  integrations: ["CC Avenue, Cisco Meraki, Access Card, My Hq, Zoho Book"],
  decisionMakers: ["Coworking Founders", "Community Managers", "Operations Head"],
  keyPoints: [
    "Operational Efficiency (One platform for everything).",
    "Revenue & Space Optimization (Maximize utilization).",
    "Scalability (Grow multi-location without overhead).",
    "Visibility & Control (Real-time leadership dashboards).",
  ],
  roi: [
    "Higher revenue per sqft through optimized utilization.",
    "Reduced manual overhead in visitor and mail management.",
    "Improved member retention via superior digital experience.",
  ],
  assets: [
    {
      type: "Link",
      title: "Coworking IA/ UX (Figma)",
      url: "https://www.figma.com/design/uRLSIapEv2vE8yYnNoRJ5N/UrbanWrk-White-Labelling?node-id=5615-4995&t=eLxGL5TFnTP6F65C-1",
      icon: <Monitor className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Demo Experience Video",
      url: "#",
      icon: <PlayCircle className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Community Manager Login",
      url: "https://web.gophygital.work",
      id: "abdul.ghaffar@lockated.com",
      pass: "123456",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Member App Preview",
      url: "https://cloud.lockated.com/index.php/s/JxcGLyw74Xcy5fM",
      id: "Abdul.ghaffar@lockated.com",
      pass: "123456",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  owner: "Abdul Ghaffar",
  ownerImage: "/assets/product_owner/abdul_ghaffar.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Target Segment", detail: "Multi-location coworking brands." }
      ],
      today: [
        { dimension: "Key Advantage", state: "Native integration with physical locks and network gateways." }
      ]
    }
  }
};

const GoPhygitalCoworkingPage: React.FC = () => {
  return <BaseProductPage productData={goPhygitalCoworkingData} />;
};

export default GoPhygitalCoworkingPage;
