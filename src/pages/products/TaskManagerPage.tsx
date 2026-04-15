import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  FileText, 
  Monitor,
  Presentation,
  PlayCircle,
  TrendingUp
} from "lucide-react";

/**
 * Project and Task Manager Product Data
 * ID: 10
 */
const taskManagerData: ProductData = {
  name: "Project and Task Manager",
  description: "An end-to-end work management solution designed to help teams plan, track, and execute projects efficiently. Centralizes tasks, timelines, ownership, and progress tracking.",
  brief: "A centralized platform enabling transparency, accountability, and faster delivery across teams by managing work efficiently from planning to execution.",
  userStories: [
    {
      title: "Project Management & Delivery",
      items: [
        "Create projects with tasks, milestones, and deadlines for easy progress tracking.",
        "High-level dashboards and reports for stakeholders to monitor delivery without micro-managing.",
        "Real-time visibility into task status and blockers for team leads to take corrective action early.",
      ],
    },
    {
      title: "Team Productivity",
      items: [
        "Personalized task views for team members to manage daily work and priorities efficiently.",
        "Collaboration through comments, mentions, and file attachments on specific tasks.",
        "Progress updates (To Do / In Progress / Done) for transparent team coordination.",
      ],
    },
    {
      title: "Administration & Security",
      items: [
        "Manage users, roles, and permissions to maintain data security and operational control.",
        "Detailed activity logs and audit trails for accountability across the project lifecycle.",
      ],
    },
  ],
  industries: "All (Generic Work Management)",
  usps: [
    "Simple, intuitive UI with minimal learning curve.",
    "Real-time visibility across projects and teams.",
    "Highly configurable workflows without heavy customization.",
    "Scales from small teams to enterprise use cases.",
    "Cost-effective compared to heavyweight PM tools.",
  ],
  includes: [
    "Project & task creation",
    "Task assignment, priorities, and due dates",
    "Status tracking, comments, and mentions",
    "Activity logs and audit trail",
    "Role-based access control",
  ],
  upSelling: [
    "Advanced analytics, Workflow automation, Mobile app access, AI prioritization.",
  ],
  integrations: [
    "Google/Outlook Calendar, Jira, GitHub/GitLab, Zoom/Meet, HRMS & Accounting tools.",
  ],
  decisionMakers: ["Head of Engineering/Operations, PMOs, Founders, CFO, COO"],
  keyPoints: [
    "Ease of use & Fast onboarding.",
    "Visibility & control over delivery timelines.",
    "Team productivity improvement through transparency.",
    "Reduced dependency on spreadsheets.",
  ],
  roi: [
    "Reduced project delays & improved on-time delivery.",
    "Higher team productivity & lower coordination overhead.",
    "Faster, data-driven decision-making.",
  ],
  assets: [
    {
      type: "Link",
      title: "Platform Overview",
      url: "#",
      icon: <Presentation className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Internal Sandbox Access",
      url: "https://tasks.lockated.com",
      id: "demo.pm@lockated.com",
      pass: "Task#Master",
      icon: <Monitor className="w-5 h-5" />,
    },
  ],
  owner: "Sadanand Gupta",
  ownerImage: "/assets/product_owner/sadanand_gupta.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Core Focus", detail: "Execution Transparency" }
      ],
      today: [
        { dimension: "Utility", state: "Primary work management tool for Lockated internal development cycles." }
      ]
    }
  }
};

const TaskManagerPage: React.FC = () => {
  return <BaseProductPage productData={taskManagerData} />;
};

export default TaskManagerPage;
