import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Presentation,
  UserCheck
} from "lucide-react";

const qcData: ProductData = {
  name: "QC (Quality Control)",
  description: "A QC App is a mobile-based quality control solution designed for the real estate and construction industry to ensure defect-free execution.",
  brief: "Enables stage-wise inspections, standardized checklists, real-time issue tracking, and compliance monitoring to ensure construction work meets specifications.",
  userStories: [
    {
      title: "Process Workflow",
      items: [
        "Initiator: Initiating the work",
        "Inspector: Raising and closing Snags",
        "Reviewer: Repair work",
        "Repairer: Verifying work",
        "Management: Overseeing construction quality",
      ],
    },
  ],
  industries: "Real Estate Developer, Contractor",
  usps: [
    "Digital QC & Snagging in One Unified Platform",
    "Configure Checklist & Stage Wise Work Flow",
    "Real Time Issue Tracking & Closure Monitoring",
  ],
  includes: ["Standard QC Package"],
  upSelling: ["Unit Snagging, Common Area, Cleaning, Appointment, HOTO"],
  integrations: ["SFDC, SAP"],
  decisionMakers: ["Developer, Contractor"],
  keyPoints: [
    "Real Time Visibility & Progress Tracking",
    "Ease of Adoption & Practical Utility",
    "Transparency & Collaboration",
  ],
  roi: ["Strong ROI by reducing rework and inspection effort."],
  assets: [
    {
      type: "Link",
      title: "Presentation",
      url: "#",
      icon: <Presentation className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Web Login",
      url: "#",
      id: "qc@admin.com",
      pass: "123456",
      icon: <Globe className="w-5 h-5" />,
    },
  ],
  owner: "Sagar Singh",
  ownerImage: "/assets/product_owner/sagar_singh.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "QC App" },
        { field: "Description", detail: "Professional-grade construction quality control and audit system." },
        { field: "Target Market", detail: "Contractors, PMC firms, Developer In-house QC teams." },
        { field: "Tech Highlight", detail: "Offline-first mobile Sync with high-res photo audits." }
      ],
      problemSolves: [
        { painPoint: "Inconsistent Standards", solution: "Standardized digital checklists across projects." },
        { painPoint: "Rework Costs", solution: "Early detection of defects before finishing stages." }
      ],
      whoItIsFor: [
        { role: "Site Engineer", useCase: "Conducting Inspections", frustration: "Paper-based checklists getting lost", gain: "Instant digital sign-off and photo proof" },
        { role: "Project Head", useCase: "Quality Audits", frustration: "Lack of visibility on site quality", gain: "Heatmap of defects by floor/wing" }
      ],
      today: [
        { dimension: "Status", state: "Core quality control engine within the Snag 360 ecosystem." },
        { dimension: "Reach", state: "Trusted by 500+ site engineers daily." }
      ]
    },
    detailedFeatures: [
      { module: "Inspections", feature: "Stage-wise Checklists", subFeatures: "Pass/Fail logic, Mandatory photos", works: "System forces photo capture for fails", userType: "Inspector", usp: true },
      { module: "Workflows", feature: "Correction Loop", subFeatures: "Auto-reassign, Timeline tracking", works: "Failed items auto-alert the contractor", userType: "Contractor", usp: false }
    ],
    detailedMarketAnalysis: {
      marketSize: [
        { segment: "ConTech Quality IT", val2425: "$1B", val26: "$1.5B", forecast: "$4B by 2030", cagr: "18%", driver: "Government housing standards", india: "RERA compliance mandate" }
      ],
      competitors: [
        { name: "PlanGrid", hq: "USA", indiaPrice: "Luxury", globalPrice: "Global", strength: "Drawing sync", weakness: "Checklist depth", sovereignty: "Low" }
      ],
      competitorSummary: "PlanGrid is great for drawings, but QC App is superior for deep, granular field inspection workflows in the Indian context."
    },
    detailedPricing: {
      featureComparison: [
        { feature: "Offline Support", snag: "Full", falcon: "Partial", procore: "Full", novade: "Full", status: "AT PAR" }
      ],
      pricingLandscape: [
        { tier: "Project QC", model: "Per Project / Per Month", india: "₹15k - ₹25k", global: "$300 - $500", target: "Commercial Projects" }
      ]
    },
    detailedRoadmap: {
      phases: [
        { title: "Phase 1: Compliance", initiatives: [{ initiative: "Digital Signatures", feature: "Third-party audit proof", segment: "PMC firms", impact: "Legal compliance", timeline: "Q2 2026" }], summary: "Focus on making digital audits legally binding." }
      ],
      innovationLayer: [
        { id: 1, name: "Computer Vision Audits", category: "AI/ML", description: "Auto-detect cracks/voids from photos", value: "99% detection accuracy", leapfrog: "All", priority: "High Impact" }
      ]
    },
    detailedBusinessPlan: {
      planQuestions: [
        { question: "Retention strategy?", answer: "Deep integration with contractor payments (No QC = No Payment).", flag: "Ready", source: "Ops Manual" }
      ],
      founderChecklist: [
        { id: "QC-01", item: "Review ASTM standard sets", verify: "Checklist library accuracy", status: "DONE" }
      ]
    },
    detailedGTM: {
      targetGroups: [
        { title: "Contractors", components: [{ component: "Efficiency Sales", detail: "Focus on 'Right First Time' to save labor costs" }], summaryBox: "Contractors are the largest untapped market for QC tools." }
      ]
    },
    detailedMetrics: {
      clientImpact: [
        { metric: "Defect Density", baseline: "12 per unit", withSnag: "2 per unit", claim: "83% reduction in handover defects" }
      ],
      businessTargets: [
        { metric: "Checklist Completion", definition: "Mandatory audits done", d30Current: "40%", d30Phase1: "95%", m3Current: "50%", m3Phase1: "100%" }
      ]
    },
    detailedSWOT: {
      strengths: [{ headline: "Granular Depth", explanation: "Checklists can go down to specific tile types." }],
      weaknesses: [{ headline: "Battery Drain", explanation: "Heavy photo usage impacts mobile devices." }],
      opportunities: [{ headline: "Material Testing", explanation: "Integrating Lab reports directly into QC app." }],
      threats: [{ headline: "Internal Excel", explanation: "Old-school site engineers resisting digital migration." }]
    }
  }
};

const QCPage: React.FC = () => {
  return <BaseProductPage productData={qcData} />;
};

export default QCPage;
