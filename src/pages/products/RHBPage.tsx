import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  PlayCircle,
  FileText, 
  Monitor,
  Presentation,
  Video
} from "lucide-react";

const rhbData: ProductData = {
  name: "RHB (Rajasthan Housing Board Monitoring)",
  description: "Sajag helps the entire RHB team to track the progress of all their projects in Rajasthan at the click of a button.",
  brief: "Periodically monitor project progress, quality, and financials across multiple locations. Provides a mobile-based real-time tool for updates and reporting.",
  userStories: [
    {
      title: "Tracking Points",
      items: [
        "Completion Time & Financials",
        "QC Reports & Inspections",
        "Hindrances & ATR Status",
        "Periodic Project Progress Monitoring",
      ],
    },
    {
      title: "Submission Types",
      items: [
        "QC Proforma, RE Inspection, TPI Proforma, Financial Proforma, Image Uploads",
      ],
    },
  ],
  industries: "Government Entities",
  usps: [
    "Real Time Visibility & Progress Tracking",
    "Time Saved & Enhanced Productivity",
    "Ease of Adoption",
  ],
  includes: ["Standard Monitoring System"],
  upSelling: ["Snag 360, Community App"],
  integrations: ["N.A"],
  decisionMakers: ["Housing Commissioner, Chief Engineer"],
  keyPoints: [
    "Transparency & Accountability",
    "Real Time Visibility",
    "Documented Progress",
  ],
  roi: [
    "Documented progress and smooth operation leading to cost-effectiveness.",
  ],
  assets: [
    {
       type: "Link",
       title: "Presentation",
       url: "#",
       icon: <Presentation className="w-5 h-5" />,
    }
  ],
  credentials: [
    {
      title: "WEB Login",
      url: "#",
      id: "7303434567",
      pass: "11111 (OTP)",
      icon: <Globe className="w-5 h-5" />,
    },
  ],
  owner: "Sagar Singh",
  ownerImage: "/assets/product_owner/sagar_singh.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "RHB Sajag" },
        { field: "Target", detail: "Government Infrastructure Monitoring" },
        { field: "Scale", detail: "50+ cities across Rajasthan." },
        { field: "Unique Tech", detail: "Satellite-integrated geotagging for project verification." }
      ],
      problemSolves: [
        { painPoint: "Reporting Lag", solution: "Real-time field updates from engineers to Commissioner." },
        { painPoint: "Quality Disputes", solution: "Mandatory photo audits with time-stamps." }
      ],
      whoItIsFor: [
        { role: "Housing Commissioner", useCase: "State-wide Monitoring", frustration: "Delayed paper reports", gain: "Live dashboard of all construction phases" },
        { role: "Executive Engineer", useCase: "Field Verification", frustration: "Lack of proof of work", gain: "Instant digital submission of QC proformas" }
      ],
      today: [
        { dimension: "Reach", state: "Live monitor for all RHB projects across Rajasthan." },
        { dimension: "Impact", state: "Directly monitored by top state-level officials." }
      ]
    },
    detailedFeatures: [
      { module: "Monitoring", feature: "Financial Proforma", subFeatures: "Billing sync, Budget tracking", works: "Engineers enter spend vs budget", userType: "Finance Head", usp: true },
      { module: "Quality", feature: "QC Proforma", subFeatures: "Material tests, Site photos", works: "Sync site photos from remote locations", userType: "Site Engineer", usp: true }
    ],
    detailedMarketAnalysis: {
      marketSize: [
        { segment: "Gov-Tech India", val2425: "$2B", val26: "$3B", forecast: "$10B by 2030", cagr: "25%", driver: "Smart City Mission", india: "Primary driver of infrastructure digitization" }
      ],
      competitors: [
        { name: "NIC Portals", hq: "India", indiaPrice: "Low", globalPrice: "NA", strength: "Gov adoption", weakness: "Mobile UX", sovereignty: "Total" }
      ],
      competitorSummary: "RHB Sajag is a specialized layer that sits above general Government portals to provide specific construction monitoring depth."
    },
    detailedPricing: {
      featureComparison: [
        { feature: "Geotagging", snag: "Satellite-verified", falcon: "GPS-only", procore: "GPS-only", novade: "GPS-only", status: "AHEAD" }
      ],
      pricingLandscape: [
        { tier: "State-Wide License", model: "Per License / Per Year", india: "Custom Gov Quote", global: "NA", target: "State Housing Boards" }
      ]
    },
    detailedRoadmap: {
      phases: [
        { title: "Phase 1: Transparency", initiatives: [{ initiative: "Citizen Portal", feature: "Public view of progress", segment: "Allotment holders", impact: "Zero corruption", timeline: "Q4 2026" }], summary: "Focus on bringing public accountability to Gov projects." }
      ],
      innovationLayer: [
        { id: 1, name: "Drone Audit Sync", category: "Automation", description: "Auto-sync drone footage with proforma", value: "100% accurate remote monitoring", leapfrog: "Manual reports", priority: "High Impact" }
      ]
    },
    detailedBusinessPlan: {
      planQuestions: [
        { question: "Gov USP?", answer: "Sovereign data storage with local security compliance.", flag: "Ready", source: "Policy Doc" }
      ],
      founderChecklist: [
        { id: "RHB-01", item: "Verify Server hosting location", verify: "Must be in Rajasthan State Data Center", status: "DONE" }
      ]
    },
    detailedGTM: {
      targetGroups: [
        { title: "Other States", components: [{ component: "Inter-state Expo", detail: "Demo to UP/MP Housing Boards" }], summaryBox: "Rajasthan success is the blueprint for multi-state rollout." }
      ]
    },
    detailedMetrics: {
      clientImpact: [
        { metric: "Project Delay", baseline: "12 Months Avg", withSnag: "2 Months Avg", claim: "83% reduction in infrastructure delivery delays" }
      ],
      businessTargets: [
        { metric: "State Adoption", definition: "New state-wide boards", d30Current: "1", d30Phase1: "5", m3Current: "0%", m3Phase1: "100%" }
      ]
    },
    detailedSWOT: {
      strengths: [{ headline: "Gov Credibility", explanation: "Once approved by RHB, it's easier to sell to other Govt bodies." }],
      weaknesses: [{ headline: "Customization", explanation: "Gov projects have highly varying proformas." }],
      opportunities: [{ headline: "Citizen Payments", explanation: "Integrating installment payments for house allotments." }],
      threats: [{ headline: "NIC Competition", explanation: "Government's internal IT arm building similar portals." }]
    }
  }
};

const RHBPage: React.FC = () => {
  return <BaseProductPage productData={rhbData} />;
};

export default RHBPage;
