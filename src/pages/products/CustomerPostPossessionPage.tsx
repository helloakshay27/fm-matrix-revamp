import React from "react";
import BaseProductPage from "./BaseProductPage";
import PostPossessionSummaryTab from "./PostPossessionSummaryTab";
import PostPossessionFeaturesTab from "./PostPossessionFeaturesTab";
import PostPossessionUseCasesTab from "./PostPossessionUseCasesTab";
import PostPossessionMarketAnalysisTab from "./PostPossessionMarketAnalysisTab";
import PostPossessionPricingTab from "./PostPossessionPricingTab";
import PostPossessionSWOTTab from "./PostPossessionSWOTTab";
import PostPossessionRoadmapTab from "./PostPossessionRoadmapTab";
import PostPossessionEnhancementsTab from "./PostPossessionEnhancementsTab";
import PostPossessionMetricsTab from "./PostPossessionMetricsTab";
import PostPossessionBusinessPlanTab from "./PostPossessionBusinessPlanTab";
import PostPossessionGTMTab from "./PostPossessionGTMTab";
import { ProductData } from "./types";
import { Globe, Smartphone, FileText, Monitor } from "lucide-react";

export const customerPostPossessionData: ProductData = {
  name: "Customer Post Possession",
  description:
    "A comprehensive post-handover ecosystem covering safety, community living, and facility management with 130+ features and a specialized white-label + data-sovereign architecture.",
  brief:
    "Post Possession is an enterprise-grade resident engagement and facility management platform designed for mid-to-large residential developers in India and the GCC. It enables developers to stay connected with their homebuyers long after the keys are handed over, turning a cost-heavy period into a value-driven relationship channel through a developer-branded, white-labeled mobile app.",

  // Tab configuration
  tabOrder: [
    "summary",
    "features",
    "market",
    "pricing",
    "usecases",
    "roadmap",
    "business",
    "gtm",
    "metrics",
    "swot",
    "enhancements",
    "assets",
  ],

  industries: "Real Estate Developers",
  usps: [
    "White-Label + Data Sovereignty: App carries YOUR brand; data stays on YOUR server.",
    "Integrated Lifecycle: Connects daily living to developer commercial goals.",
    "Enterprise FM Depth: Matching standalone tool capability at community pricing.",
    "Proven at Scale: Live with Godrej, Piramal, and Panchshil for 5+ years.",
  ],
  includes: ["White Labeled Mobile App", "Admin Console", "Guard App", "Facilities Management Suite"],
  upSelling: ["AI FM Copilot", "Developer Revenue Intelligence", "International Market Expansion"],
  integrations: ["Building Access Systems (ANPR/Boom Barrier)", "Smart Meters", "Payment Gateways", "Tally / SAP ERP"],
  decisionMakers: ["COO", "VP - CRM / Customer Experience", "VP - Facility Management", "MD"],
  keyPoints: ["Resident Retention", "Facility Optimization", "Data Privacy", "Brand Loyalty"],
  roi: ["50% reduction in channel partner costs", "20% reduction in support overhead", "Higher resident NPS"],
  assets: [
    {
      type: "Link",
      title: "Product Deck",
      url: "#",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Architecture Overview",
      url: "#",
      icon: <Monitor className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Admin Staging",
      url: "https://staging.lockated.com",
      id: "admin@lockated.com",
      pass: "Admin2024!",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Resident App Demo",
      url: "App Store / Play Store",
      id: "9876543210",
      pass: "OTP",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  owner: "Kshitij Rasal",
  ownerImage: "/assets/product_owner/kshitij_rasal.jpeg",
};

const CustomerPostPossessionPage: React.FC = () => {
  return (
    <BaseProductPage
      productData={customerPostPossessionData}
      tabsVariant="snag360"
      customTabContent={{
        summary: <PostPossessionSummaryTab />,
        features: <PostPossessionFeaturesTab />,
        usecases: <PostPossessionUseCasesTab productData={customerPostPossessionData} />,
        market: <PostPossessionMarketAnalysisTab productData={customerPostPossessionData} />,
        pricing: <PostPossessionPricingTab productData={customerPostPossessionData} />,
        swot: <PostPossessionSWOTTab productData={customerPostPossessionData} />,
        roadmap: <PostPossessionRoadmapTab productData={customerPostPossessionData} />,
        enhancements: <PostPossessionEnhancementsTab productData={customerPostPossessionData} />,
        metrics: <PostPossessionMetricsTab productData={customerPostPossessionData} />,
        business: <PostPossessionBusinessPlanTab productData={customerPostPossessionData} />,
        gtm: <PostPossessionGTMTab productData={customerPostPossessionData} />,
      }}
    />
  );
};

export default CustomerPostPossessionPage;
