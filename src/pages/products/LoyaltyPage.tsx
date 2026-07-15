import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  Globe, 
  Smartphone, 
  FileText, 
  Monitor,
  Presentation
} from "lucide-react";

const loyaltyData: ProductData = {
  name: "Loyalty",
  description: "A customer Lifecycle Management Mobile app being used by Real Estate Developers to manage their Customers across the Entire cycle from Booking to Handover and can be extended until Community Management.",
  brief: "Ensures reduction in follow up on complaints from customers. Dynamic Workflow Management validates checkpoints across functions before final delivery.",
  userStories: [
    {
      title: "1. CRM",
      items: [
        "SSO user registration",
        "Gives a buyer complete details of their purchase across units with the developers",
        "Receive real time Demand notes, construction updates, etc",
        "Smart NCF form acceptance before registration",
        "Registration scheduling",
        "TDS Tutorials",
        "Rule Engine gamification for early collection & handedover",
      ],
    },
    {
      title: "2. Loyalty",
      items: [
        "Referral Sales",
        "Rule Engine gamification for Referral, site visit & booking",
        "Offers for existing customers for new purchase",
        "Redemption Market Place",
      ],
    },
    {
      title: "3. Post Possession",
      items: [
        "Club, Visitor & Helpdesk",
        "Referral & Marketing for new launches",
      ],
    },
  ],
  industries: "Real Estate Developers",
  usps: [
    "Experience of working with 20+ large Real Estate players in the market",
    "Integrated platform across the journey, eliminates the risk of multiple systems",
    "Data security as database is in Companies ownership",
    "Customized Look & feel as per own brand guidelines",
  ],
  includes: ["White Labeled Mobile App", "CMS"],
  upSelling: [
    "Loyalty Rule Engine",
    "Redemption Market Place",
    "Appointments (Handover Scheduling)",
    "Hi Society (Community Management)",
  ],
  integrations: [
    "SFDC (CRM)",
    "SAP (ERP)",
    "Internal Upselling Modules",
    "Website",
    "Payment portals",
  ],
  decisionMakers: ["CRM", "Sales", "Loyalty", "IT"],
  keyPoints: [
    "Customization of Look & Feel",
    "Data security",
    "Partner experience",
    "Referral Journey & Payout",
  ],
  roi: [
    "4 Sales/ year is all you need for the platform to be free",
    "Reduce CP cost by 50%",
    "Reduce support cost by 20%",
  ],
  assets: [
    {
      type: "Link",
      title: "Detailed Feature List",
      url: "https://docs.google.com/spreadsheets/d/1OKiPeGtxJrqmr6Eo6swvSjR0YMdQ3Qc6ASSYBW8Hn2Q/edit?gid=158265630#gid=158265630",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "IA/ UX (Link)",
      url: "https://www.figma.com/proto/OknmpA5Mbtklh2Idf75kXG/Kalpataru?page-id=0%3A1&node-id=2188-1927&viewport=-863%2C5209%2C0.17&t=oGwsVmrtuhylp4Hi-1&scaling=min-zoom&content-scaling=fixed",
      icon: <Monitor className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "One Pager (Link)",
      url: "https://www.canva.com/design/DAGKb5frjWw/lVjVzJpdosLQE3KRY_FDjg/watch?utm_content=DAGKb5frjWw&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha02a3a6ce3",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Live Product CMS Login Credentials",
      url: "https://ui-kalpataru.lockated.com/login",
      id: "demo@lockated.com",
      pass: "123456",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Live Product App Login Credentials",
      url: "App Store / Play Store",
      id: "9987676203",
      pass: "999999 (OTP)",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  owner: "Kshitij Rasal",
  ownerImage: "/assets/product_owner/kshitij_rasal.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "Loyalty" },
        { field: "Description", detail: "A state-of-the-art customer lifecycle management mobile app for real estate developers." },
        { field: "Target Market", detail: "Luxury Developers, Tier 1/2 Real Estate players." },
        { field: "Key Outcome", detail: "90% reduction in manual query handling." }
      ],
      problemSolves: [
        { painPoint: "Client Anxiety", solution: "Live construction updates and demand note transparency." },
        { painPoint: "Slow Referrals", solution: "Gamified reward engine for existing buyers." }
      ],
      whoItIsFor: [
        { role: "C-Level Exec", useCase: "Brand loyalty metrics", frustration: "Opaque buyer sentiment", gain: "Direct line to customer feedback" },
        { role: "Buyer", useCase: "Document tracking", frustration: "Missing payment receipts", gain: "Vault-style document access" }
      ],
      today: [
        { dimension: "Market Reach", state: "Used by 20+ top developers in India including Kalpataru." },
        { dimension: "Key USP", state: "White-labeled app with 100% data sovereignty." }
      ]
    },
    detailedFeatures: [
      { module: "CRM Vault", feature: "Document Repository", subFeatures: "E-receipts, Agreement copies", works: "Automated sync from ERP", userType: "Buyer", usp: true },
      { module: "Rewards", feature: "Referral Engine", subFeatures: "Point system, Marketplace", works: "One-click referral from app", userType: "Loyalty Member", usp: true }
    ],
    detailedMarketAnalysis: {
      marketSize: [
        { segment: "Real Estate SaaS", val2425: "$500M", val26: "$750M", forecast: "$2B by 2030", cagr: "15%", driver: "Digital CX demand", india: "Primary growth engine" }
      ],
      competitors: [
        { name: "PropSpace", hq: "UAE", indiaPrice: "High", globalPrice: "Global", strength: "CRM depth", weakness: "Mobile UX", sovereignty: "Medium" }
      ],
      competitorSummary: "Loyalty stands out by being developer-owned and community-focused rather than just a sales tool."
    },
    detailedPricing: {
      featureComparison: [
        { feature: "White Labeling", snag: "Full", falcon: "Partial", procore: "None", novade: "Partial", status: "AHEAD" }
      ],
      pricingLandscape: [
        { tier: "Standard Loyalty", model: "One-time Setup + AMC", india: "₹10L + 15%", global: "$15k + 20%", target: "Mid-size Developers" }
      ]
    },
    detailedRoadmap: {
      phases: [
        { title: "Phase 1: CX Focus", initiatives: [{ initiative: "Wallet Integration", feature: "Payment Gateway", segment: "Premium Buyers", impact: "Faster collection", timeline: "Q2 2026" }], summary: "Streamline the financial journey for buyers." }
      ],
      innovationLayer: [
        { id: 1, name: "AR Site Visit", category: "AR/VR", description: "Virtual tour of under-construction unit", value: "Higher retention", leapfrog: "Standard Apps", priority: "High Impact" }
      ]
    },
    detailedBusinessPlan: {
      planQuestions: [
        { question: "Competitive edge?", answer: "Complete data ownership and white-labeling.", flag: "Ready", source: "Founder Insight" }
      ],
      founderChecklist: [
        { id: "L-01", item: "Review Play Store policy", verify: "App hosting requirements", status: "DONE" }
      ]
    },
    detailedGTM: {
      targetGroups: [
        { title: "Existing Clients", components: [{ component: "Loyalty Campaign", detail: "Upsell Hi Society module to current base" }], summaryBox: "Leverage existing 20+ installs for cross-sell." }
      ]
    },
    detailedMetrics: {
      clientImpact: [
        { metric: "Referral Sales", baseline: "2%", withSnag: "12%", claim: "6x increase in referral velocity" }
      ],
      businessTargets: [
        { metric: "Churn Rate", definition: "App uninstalls", d30Current: "10%", d30Phase1: "2%", m3Current: "15%", m3Phase1: "5%" }
      ]
    },
    detailedSWOT: {
      strengths: [{ headline: "White Label", explanation: "Developers love putting their own logo on the store." }],
      weaknesses: [{ headline: "ERP Dependencies", explanation: "Data quality depends on the developer's SAP/SFDC accuracy." }],
      opportunities: [{ headline: "Community FinTech", explanation: "Micro-payment ecosystem within the app." }],
      threats: [{ headline: "Platform Giants", explanation: "General CRM players adding specific RE mobile layers." }]
    }
  }
};

const LoyaltyPage: React.FC = () => {
  return <BaseProductPage productData={loyaltyData} />;
};

export default LoyaltyPage;
