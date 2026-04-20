import React from "react";
import BaseProductPage, { ProductData } from "./BaseProductPage";
import { FileText, BarChart2, Bell, ShieldCheck, Monitor, Presentation, TrendingUp, Users, DollarSign } from "lucide-react";

const customerAppPreSalesData: ProductData = {
  name: "Customer App Pre Sales",
  description: "A white-labelled buyer app for project discovery, walkthroughs, unit selection, and booking.",
  brief: "Enable self-service buyer discovery, unit selection, and booking — reducing broker dependency and capturing pre-booking buyer behaviour.",
  excelLikeSummary: true, excelLikeFeatures: true, excelLikeMarket: true, excelLikePricing: false,
  excelLikeSwot: true, excelLikeRoadmap: true, excelLikeBusinessPlan: true, excelLikeGtm: true,
  excelLikeMetrics: true, excelLikePostPossession: true,
  userStories: [
    { title: "[ To be filled ]", items: ["[ To be filled ]"] },
    { title: "[ To be filled ]", items: ["[ To be filled ]"] },
  ],
  industries: "Real Estate Development, Residential, Commercial Real Estate, Mixed-use Real Estate",
  usps: ["[ To be filled ]", "[ To be filled ]", "[ To be filled ]"],
  includes: ["[ To be filled ]"],
  upSelling: ["[ To be filled ]"],
  integrations: ["[ To be filled ]"],
  decisionMakers: ["[ To be filled ]"],
  keyPoints: ["[ To be filled ]"],
  roi: ["[ To be filled ]"],
  assets: [{ type: "Link", title: "Product Deck", url: "#", icon: <Presentation className="w-5 h-5" /> }],
  credentials: [{ title: "Demo", url: "#", id: "demo@lockated.com", pass: "Demo#2024", icon: <Monitor className="w-5 h-5" /> }],
  owner: "Komal and Ubaid", ownerImage: "",
  extendedContent: {
    featureSummary: (
      <div className="-m-4 overflow-x-auto"><table className="w-full border-collapse text-xs bg-white"><tbody>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><FileText className="w-4 h-4 text-blue-500" /> [ To be filled ]</div></td><td className="p-3 text-gray-700 font-medium">[ To be filled ]</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><BarChart2 className="w-4 h-4 text-green-500" /> [ To be filled ]</div></td><td className="p-3 text-gray-700 font-medium">[ To be filled ]</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><Bell className="w-4 h-4 text-orange-400" /> [ To be filled ]</div></td><td className="p-3 text-gray-700 font-medium">[ To be filled ]</td></tr>
        <tr><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-blue-700"><ShieldCheck className="w-4 h-4 text-orange-400" /> Key USP</div></td><td className="p-3 text-blue-700 font-bold">[ To be filled ]</td></tr>
      </tbody></table></div>
    ),
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "Customer App Pre Sales" },
        { field: "One-line Description", detail: "[ To be filled ]" },
        { field: "Category", detail: "[ To be filled ]" },
        { field: "Current Modules (Live)", detail: "[ To be filled ]" },
        { field: "Product Owner", detail: "Komal and Ubaid" },
      ],
      problemSolves: [{ painPoint: "Core Pain Point", solution: "[ To be filled ]" }],
      whoItIsFor: [{ role: "[ Role ]", useCase: "[ To be filled ]", frustration: "[ To be filled ]", gain: "[ To be filled ]" }],
      today: [
        { dimension: "Single Most Defensible Position", state: "[ To be filled ]" },
        { dimension: "Target Markets", state: "Real Estate Development, Residential, Commercial Real Estate, Mixed-use Real Estate" },
      ],
    },
    detailedFeatures: [
      { module: "[ Module ]", feature: "[ Feature ]", subFeatures: "", works: "[ To be filled ]", userType: "All", usp: false },
      { module: "[ Module ]", feature: "[ Feature ]", subFeatures: "", works: "[ To be filled ]", userType: "All", usp: true },
    ],
    detailedMarketAnalysis: {
      targetAudience: [{ segment: "[ To be filled ]", demographics: "[ To be filled ]", industry: "[ To be filled ]", painPoints: "[ To be filled ]", notSolved: "[ To be filled ]", goodEnough: "[ To be filled ]", urgency: "HIGH", primaryBuyer: "[ To be filled ]" }],
      companyPainPoints: [{ companyType: "[ To be filled ]", pain1: "[ To be filled ]", pain2: "[ To be filled ]", pain3: "[ To be filled ]", costRisk: "[ To be filled ]" }],
      competitorMapping: [{ name: "[ To be filled ]", targetCustomer: "", pricing: "", discovery: "", strongestFeatures: "", weakness: "", marketGaps: "", threats: "" }],
      detailedPricing: {
        pricingMatrixSubtitle: "[ To be filled ]",
        pricingFeatureRows: [{ capability: "[ To be filled ]", currentState: "", marketNeed: "", impact: "", status: "AHEAD", recommendation: "" }],
        pricingSummaryRows: [{ label: "[ To be filled ]", detail: "", tone: "green" }],
        pricingCurrentRows: [{ label: "India Price", detail: "[ To be filled ]" }],
        pricingPositioningRows: [{ question: "[ To be filled ]", answer: "", note: "" }],
        pricingImprovementRows: [{ currentProp: "", suggestedFix: "", improvedFraming: "", whyItWins: "" }],
        featuresVsMarket: [{ featureArea: "[ To be filled ]", marketStandard: "", ourProduct: "", status: "AHEAD", summary: "" }],
        comparisonSummary: { ahead: "[ To be filled ]", atPar: "[ To be filled ]", gaps: "[ To be filled ]" },
        pricingLandscape: [{ tier: "[ To be filled ]", model: "", india: "", global: "", included: "", target: "" }],
        positioning: [{ category: "Key Position", description: "[ To be filled ]" }],
        valuePropositions: [{ currentProp: "[ To be filled ]", segment: "", weakness: "", sharpened: "" }],
      },
      detailedUseCases: { industryUseCases: [{ rank: "1", industry: "[ To be filled ]", features: "[ To be filled ]", useCase: "[ To be filled ]", urgency: "HIGH", primaryBuyer: "[ To be filled ]", primaryUser: "[ To be filled ]", profile: "[ To be filled ]", currentTool: "[ To be filled ]" }] },
    },
    pricing: [
      { plan: "Starter", price: "[ To be filled ]", description: "[ To be filled ]", features: ["[ To be filled ]"], highlighted: false, cta: "Get Started" },
      { plan: "Pro", price: "[ To be filled ]", description: "[ To be filled ]", features: ["Everything in Starter", "[ To be filled ]"], highlighted: true, cta: "Start Trial" },
      { plan: "Enterprise", price: "Custom", description: "[ To be filled ]", features: ["Everything in Pro", "Custom integrations", "Dedicated support"], highlighted: false, cta: "Contact Sales" },
    ],
    swot: { strengths: ["[ To be filled ]"], weaknesses: ["[ To be filled ]"], opportunities: ["[ To be filled ]"], threats: ["[ To be filled ]"] },
    roadmap: [
      { quarter: "Q1 2025", phase: "Foundation", items: ["[ To be filled ]"], status: "completed" },
      { quarter: "Q3 2025", phase: "Expansion", items: ["[ To be filled ]"], status: "planned" },
    ],
    businessPlan: {
      vision: "[ To be filled ]", mission: "[ To be filled ]", targetRevenue: "[ To be filled ]",
      keyMilestones: [{ milestone: "[ To be filled ]", targetDate: "Q2 2025", status: "planned" }],
    },
    gtmStrategy: [{ phase: "Phase 1", description: "[ To be filled ]", tactics: ["[ To be filled ]"], timeline: "Q1 2025" }],
    metrics: [{ name: "[ KPI ]", current: "[ To be filled ]", target: "[ To be filled ]", unit: "units", trend: "up" }],
    postPossessionJourney: [{ stage: "[ Stage ]", description: "[ To be filled ]", touchpoints: ["[ To be filled ]"], tools: ["[ Tool ]"] }],
  },
};

const CustomerAppPreSalesPage: React.FC = () => <BaseProductPage productData={customerAppPreSalesData} />;
export default CustomerAppPreSalesPage;