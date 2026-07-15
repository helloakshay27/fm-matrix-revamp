import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Calendar, 
  Clock, 
  UserCheck 
} from "lucide-react";

const appointmentsData: ProductData = {
  name: "Appointments (Scheduling)",
  description: "A specialized app for managing high-volume handover and maintenance appointments in the real estate sector.",
  brief: "Eliminate queues and manual scheduling. Provide buyers with a self-service portal to book handover slots, ensuring a premium delivery experience.",
  userStories: [
    {
      title: "Handover Manager",
      items: [
        "Manage slot availability across multiple towers.",
        "Auto-assign engineers for each booked slot.",
        "Track appointment completion and customer feedback.",
      ],
    },
    {
      title: "Home Buyer",
      items: [
        "View available slots for their specific unit.",
        "Book or reschedule appointments from the mobile app.",
        "Receive automated reminders and pre-requisite checklists.",
      ],
    },
  ],
  industries: "Real Estate Developers, Facility Management",
  usps: [
    "Integrated with Snag 360 and Loyalty App.",
    "Real-time slot balancing to prevent site crowding.",
    "Automated documentation prep for each appointment.",
  ],
  includes: ["Booking Portal", "Admin Control Desk"],
  upSelling: ["Loyalty App, HSE App"],
  integrations: ["Loyalty CMS, SAP"],
  decisionMakers: ["CRM Head, Project Head"],
  keyPoints: [
    "Reduced Customer Wait Time",
    "Improved Staff Utilization",
    "Digital Audit Trail of Handover",
  ],
  roi: [
    "30% reduction in staff idle time during handover phases.",
  ],
  assets: [],
  credentials: [
    {
      title: "Demo Portal",
      url: "#",
      id: "admin@appointments.com",
      pass: "123456",
      icon: <Calendar className="w-5 h-5" />,
    },
  ],
  owner: "Sagar Singh",
  ownerImage: "/assets/product_owner/sagar_singh.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product", detail: "Appointments" },
        { field: "Primary Goal", detail: "Zero-friction appointment scheduling for large scale sites." }
      ],
      today: [
        { dimension: "Current Status", state: "Live as a module within the Loyalty ecosystem." }
      ]
    }
  }
};

const AppointmentsPage: React.FC = () => {
  return <BaseProductPage productData={appointmentsData} />;
};

export default AppointmentsPage;
