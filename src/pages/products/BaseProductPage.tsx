import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import {
  ArrowLeft,
  Monitor,
  FileText,
  Video,
  PlayCircle,
  Globe,
  Smartphone,
  Presentation,
  Camera,
  ShieldAlert,
  Lock,
  ChevronLeft,
  ChevronRight,
  Settings,
  CreditCard,
  TrendingUp,
  User,
  UserCheck,
  MapPin,
  Target,
  List,
  BarChart3,
  DollarSign,
  Briefcase,
  Map,
  Building2,
  Megaphone,
  LineChart,
  Compass,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

export interface ProductData {
  name: string;
  description: string;
  brief: string;
  excelLikeSummary?: boolean;
  excelLikeFeatures?: boolean;
  excelLikeUseCases?: boolean;
  excelLikeMarket?: boolean;
  excelLikePricing?: boolean;
  excelLikeSwot?: boolean;
  excelLikeRoadmap?: boolean;
  excelLikeBusinessPlan?: boolean;
  excelLikeGtm?: boolean;
  excelLikeMetrics?: boolean;
  excelLikePostPossession?: boolean;
  excelFeatureRowStart?: number;
  userStories: {
    title: string;
    items: string[];
  }[];
  industries: string;
  usps: string[];
  includes: string[];
  upSelling: string[];
  integrations: string[];
  decisionMakers: string[];
  keyPoints: string[];
  roi: string[];
  assets: {
    type: string;
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
  credentials: {
    title: string;
    url: string;
    id: string;
    pass: string;
    icon: React.ReactNode;
  }[];
  owner: string;
  ownerImage: string;
  extendedContent: {
    featureSummary?: string;
    productSummaryNew: {
      identity: { field: string; detail: string }[];
      problemSolves: { painPoint: string; solution: string }[];
      whoItIsFor: { role: string; useCase: string; frustration: string; gain: string }[];
      today: { dimension: string; state: string }[];
    };
    detailedFeatures: {
      module: string;
      feature: string;
      subFeatures: string;
      works: string;
      userType: string;
      usp: boolean;
    }[];
    detailedMarketAnalysis?: {
      marketMatrixSubtitle?: string;
      marketMatrixRows?: {
        segment: string;
        whoToday: string;
        subsector: string;
        budget: string;
        purchasePattern: string;
        incumbents: string;
        readiness: string;
        trigger: string;
        payoff: string;
        risk: string;
        entryWedge: string;
        opportunity: string;
      }[];
      marketSize?: { segment: string; val2425: string; val26: string; forecast: string; cagr: string; driver: string; india: string }[];
      topIndustries?: { rank: string; industry: string; buyReason: string; scale: string; decisionMaker: string; dealSize: string }[];
      competitors?: { name: string; hq: string; indiaPrice: string; globalPrice: string; strength: string; weakness: string; sovereignty: string; segment: string }[];
      competitorSummary?: string;
      targetAudience?: { segment: string; demographics: string; industry: string; painPoints: string; notSolved: string; goodEnough: string }[];
      competitorMapping?: { name: string; targetCustomer: string; pricing: string; discovery: string; strongestFeatures: string; weakness: string; marketGaps: string; threats: string }[];
    };
    detailedPricing?: {
      pricingMatrixSubtitle?: string;
      pricingFeatureRows?: {
        capability: string;
        currentState: string;
        marketNeed: string;
        impact: string;
        status: string;
        recommendation: string;
      }[];
      pricingSummaryRows?: {
        label: string;
        detail: string;
        tone: "green" | "yellow" | "red";
      }[];
      pricingCurrentRows?: {
        label: string;
        detail: string;
      }[];
      pricingPositioningRows?: {
        question: string;
        answer: string;
        note: string;
      }[];
      pricingImprovementRows?: {
        currentProp: string;
        suggestedFix: string;
        improvedFraming: string;
        whyItWins: string;
      }[];
      featureComparison?: { feature: string; snag: string; falcon: string; procore: string; novade: string; snagR: string; safety: string; status: string }[];
      featuresVsMarket?: { featureArea: string; marketStandard: string; ourProduct: string; summary: string; status: string }[];
      pricingLandscape?: { tier: string; model: string; india: string; global: string; included: string; target: string }[];
      currentPricingMarket?: { category: string; description: string }[];
      positioningStatement?: string;
      positioning?: { category: string; description: string }[];
      valueProps?: { role: string; prop: string; outcome: string; feature: string }[];
      valuePropositions?: { currentProp: string; segment: string; weakness: string; sharpened: string }[];
      featureSummary?: { ahead: string; atPar: string; gaps: string };
    };
    detailedUseCases?: {
      industryUseCases: {
        rank: string;
        industry: string;
        features: string;
        useCase: string;
        profile: string;
        currentTool: string;
        outcome?: string;
      }[];
      internalTeamUseCases: { team: string; features: string; process: string; benefit: string; frequency: string }[];
    };
    detailedRoadmap?: {
      phases?: { title: string; initiatives: { initiative: string; feature: string; segment: string; impact: string; timeline: string }[]; summary: string }[];
      top5Impact?: { rank: string | number; name: string; logic: string; leapfrog: string }[];
      innovationLayer?: { id: string | number; name: string; category: string; description: string; value: string; leapfrog: string; priority: string }[];
      structuredRoadmap?: {
        timeframe: string;
        headline: string;
        colorContext: "red" | "yellow" | "green" | "blue";
        items: {
          whatItIs: string;
          whyItMatters: string;
          unlockedSegment: string;
          effort: string;
          owner: string;
          impact?: string;
          priority?: string;
        }[];
      }[];
      enhancementRoadmap?: { featureName: string; currentStatus: string; enhancedVersion: string; integrationType: string; effort: string; impact: string; priority: string; owner: string }[];
    };
    detailedBusinessPlan?: {
      planQuestions: { question: string; answer: string; flag: string }[];
    };
    detailedGTM?: {
      targetGroups: { title: string; components: { component: string; detail: string }[]; summaryBox: string }[];
      sheet?: {
        title: string;
        targetGroups: {
          title: string;
          sections: {
            title: string;
            columns: string[];
            rows: string[][];
          }[];
          summary?: string;
          keyAssumptions?: string;
        }[];
      };
    };
    detailedMetrics?: {
      clientImpact: { metric: string; baseline: string; withSnag: string; claim: string }[];
      businessTargets: { metric: string; definition: string; d30Current: string; d30Phase1: string; m3Current: string; m3Phase1: string }[];
      sheet?: {
        title: string;
        sections: {
          title: string;
          columns: string[];
          rows: string[][];
          tone?: "blue" | "red";
        }[];
      };
    };
    detailedPostPossession?: {
      title?: string;
      sections: {
        title: string;
        tone: "blue" | "green" | "red";
        columns: string[];
        rows: string[][];
      }[];
    };
    detailedSWOT?: {
      strengths: { headline: string; explanation: string }[];
      weaknesses: { headline: string; explanation: string }[];
      opportunities: { headline: string; explanation: string }[];
      threats: { headline: string; explanation: string }[];
    };
    detailedEnhancements?: {
      roadmap: { period: string; focus: string; features: string; logic: string; risk: string }[];
    };
  };
}

interface BaseProductPageProps {
  productData: ProductData;
  backPath?: string;
  tabsVariant?: "scroll" | "wrap" | "snag360";
}

const BaseProductPage: React.FC<BaseProductPageProps> = ({
  productData,
  backPath = "/products",
  tabsVariant = "scroll",
}) => {
  const navigate = useNavigate();
  const snagTabsScrollRef = useRef<HTMLDivElement | null>(null);
  const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending");
  const [isBlurred, setIsBlurred] = useState(false);
  const [showBlackout, setShowBlackout] = useState(false);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const excelFeatureCols = ["A", "B", "C", "D", "E", "F"];
  const excelFeatureRowStart = productData.excelFeatureRowStart ?? 1;
  const getTagPillClasses = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t.includes("core")) return "border-[#1D4ED8] text-[#1D4ED8] bg-[#DBEAFE]";
    if (t.includes("today")) return "border-[#0E7490] text-[#0E7490] bg-[#CFFAFE]";
    if (t.includes("economics")) return "border-[#6D28D9] text-[#6D28D9] bg-[#EDE9FE]";
    if (t.includes("module")) return "border-[#15803D] text-[#15803D] bg-[#DCFCE7]";
    if (t.includes("usp")) return "border-[#BE185D] text-[#BE185D] bg-[#FCE7F3]";
    return "border-[#94A3B8] text-[#334155] bg-[#F1F5F9]";
  };
  const moduleIndexMap = React.useMemo(() => {
    const map = new globalThis.Map<string, number>();
    let currentIndex = 1;
    productData.extendedContent?.detailedFeatures?.forEach((item) => {
      const key = item.module.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, currentIndex);
        currentIndex += 1;
      }
    });
    return map;
  }, [productData.extendedContent?.detailedFeatures]);

  const getDisplayModule = (moduleName: string) => {
    if (/^\d+[.)\s-]/.test(moduleName.trim())) {
      return moduleName;
    }
    const index = moduleIndexMap.get(moduleName.trim().toLowerCase());
    return index ? `${index}. ${moduleName}` : moduleName;
  };
  const getModuleTone = (moduleName: string) => {
    const name = moduleName.toLowerCase();
    if (name.includes("crm") || name.includes("support")) return "bg-[#DBEAFE] text-[#1D4ED8]";
    if (name.includes("activit")) return "bg-[#DFF6FB] text-[#0E7490]";
    if (name.includes("discover") || name.includes("search")) return "bg-[#E0F2FE] text-[#0369A1]";
    if (name.includes("engag") || name.includes("brand") || name.includes("media")) return "bg-[#DCFCE7] text-[#15803D]";
    if (name.includes("service") || name.includes("value")) return "bg-[#EDE9FE] text-[#6D28D9]";
    if (name.includes("loyal")) return "bg-[#FCE7F3] text-[#BE185D]";
    return "bg-[#E2E8F0] text-[#1E3A8A]";
  };
  const summarySheetRows = React.useMemo(() => {
    const rows: { kind: "section" | "data"; label: string; detail: string; tag?: string }[] = [];

    rows.push({ kind: "section", label: "POST SALES - PRODUCT SUMMARY", detail: "", tag: "" });

    productData.extendedContent?.productSummaryNew?.identity?.forEach((item) => {
      rows.push({ kind: "data", label: item.field, detail: item.detail, tag: "Core" });
    });

    rows.push({ kind: "section", label: "WE'RE IN IT TODAY", detail: "", tag: "" });
    productData.extendedContent?.productSummaryNew?.today?.forEach((item) => {
      rows.push({ kind: "data", label: item.dimension, detail: item.state, tag: "Today" });
    });

    rows.push({ kind: "section", label: "THE REFERRAL ECONOMICS", detail: "", tag: "" });
    productData.extendedContent?.productSummaryNew?.problemSolves?.forEach((item) => {
      rows.push({ kind: "data", label: item.painPoint, detail: item.solution, tag: "Economics" });
    });

    rows.push({ kind: "section", label: "FEATURE SUMMARY BY MODULE", detail: "", tag: "" });
    productData.userStories?.forEach((story) => {
      rows.push({ kind: "data", label: story.title, detail: story.items.join(" | "), tag: "Module" });
    });

    rows.push({ kind: "section", label: "KEY USP - WHAT MAKES THIS PRODUCT HARD TO IGNORE", detail: "", tag: "" });
    productData.usps?.forEach((usp) => {
      rows.push({ kind: "data", label: "USP", detail: usp, tag: "USP" });
    });

    return rows;
  }, [productData]);

  useEffect(() => {
    const requestCameraAndModel = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraPermission("denied");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraPermission("granted");

        try {
          await tf.ready();
          const loadedModel = await cocoSsd.load();
          setModel(loadedModel);
        } catch (err) {
          console.error("AI Model failed to load:", err);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraPermission("denied");
      }
    };

    requestCameraAndModel();
    // Intentionally run once on mount.
  }, []);

  useEffect(() => {
    let detectionInterval: number | undefined;
    if (model && cameraPermission === "granted") {
      detectionInterval = window.setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const predictions = await model.detect(videoRef.current, 12, 0.15);
          const personPresent = predictions.some((p) => p.class === "person" && p.score > 0.4);
          const deviceDetected = predictions.some((p) =>
            ["cell phone", "camera", "laptop", "tv", "monitor"].includes(p.class) && p.score > 0.25
          );
          if (!personPresent || deviceDetected) {
            setIsBlurred(true);
            setShowBlackout(true);
          } else {
            setIsBlurred(false);
            setShowBlackout(false);
          }
        }
      }, 800);
    }
    return () => {
      if (detectionInterval) window.clearInterval(detectionInterval);
    };
  }, [model, cameraPermission]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "p") || (e.metaKey && e.key === "p") || e.key === "PrintScreen") {
        e.preventDefault();
        alert("Screenshots prohibited.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen bg-white pb-20 select-none ${isBlurred ? "blur-3xl" : ""}`}>
      <video ref={videoRef} autoPlay playsInline muted className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" />

      {showBlackout && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white text-center p-10">
          <ShieldAlert className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
          <h1 className="text-4xl font-black mb-4 uppercase">Security Violation</h1>
          <p className="text-xl">Screen capture is prohibited. Attempt logged.</p>
        </div>
      )}

      {/* Header */}
      <div className="relative mb-8 flex flex-col items-center bg-white pt-8">
        <div className="w-full max-w-7xl px-6 lg:px-10 mb-6">
          <button onClick={() => navigate(backPath)} className="flex items-center gap-2 text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition-all font-bold uppercase text-xs">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="text-center w-full max-w-7xl px-6 lg:px-10">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full mb-4 tracking-[0.2em] uppercase border border-blue-100">
            {productData.industries}
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter uppercase lg:text-5xl">{productData.name}</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-3xl mx-auto italic opacity-80">{productData.description}</p>
        </div>
      </div>

      <div className="max-w-7xl px-6 lg:px-10 mx-auto">
        <Tabs defaultValue="summary" className="w-full">
          {tabsVariant === "snag360" ? (
            <div className="relative mb-8">
              {/* Edge fades (hint more tabs exist) */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent z-10" />

              {/* Scroll controls */}
              <button
                type="button"
                onClick={() => snagTabsScrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50"
                aria-label="Scroll tabs left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => snagTabsScrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50"
                aria-label="Scroll tabs right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div ref={snagTabsScrollRef} className="overflow-x-auto no-scrollbar">
                <TabsList className="w-max flex flex-nowrap h-auto gap-1 px-12">
                  {[
                    { id: "summary", icon: <Target className="w-4 h-4 mr-1" />, label: "1. Product Summary" },
                    { id: "features", icon: <List className="w-4 h-4 mr-1" />, label: "2. Features" },
                    { id: "usecases", icon: <Briefcase className="w-4 h-4 mr-1" />, label: "3. User Cases" },
                    { id: "market", icon: <BarChart3 className="w-4 h-4 mr-1" />, label: "4. Market Analysis" },
                    { id: "pricing", icon: <DollarSign className="w-4 h-4 mr-1" />, label: "5. Features & Pricing" },
                    ...(productData.excelLikePostPossession || productData.extendedContent?.detailedPostPossession
                      ? [{ id: "post-possession", icon: <Presentation className="w-4 h-4 mr-1" />, label: "Customer Post Possession" }]
                      : []),
                    { id: "swot", icon: <Compass className="w-4 h-4 mr-1" />, label: "6. SWOT Analysis" },
                    { id: "roadmap", icon: <Map className="w-4 h-4 mr-1" />, label: "7. Product Roadmap" },
                    { id: "enhancements", icon: <Rocket className="w-4 h-4 mr-1" />, label: "8. Enhancement Roadmap" },
                    { id: "business", icon: <Building2 className="w-4 h-4 mr-1" />, label: "9. Business Plan Builder" },
                    { id: "gtm", icon: <Megaphone className="w-4 h-4 mr-1" />, label: "10. GTM Strategy" },
                    { id: "metrics", icon: <LineChart className="w-4 h-4 mr-1" />, label: "11. Metrics" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex-none min-w-[170px] justify-center data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          ) : (
            <TabsList
              className={
                tabsVariant === "wrap"
                  ? "w-full mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto gap-1"
                  : "w-full mb-8 flex overflow-x-auto no-scrollbar h-auto gap-0 bg-transparent justify-start border-b border-gray-100 p-0 overflow-y-hidden"
              }
            >
            {(tabsVariant === "wrap"
              ? [
                  { id: "summary", icon: <Target className="w-4 h-4 mr-1" />, label: "Product Summary" },
                  { id: "features", icon: <List className="w-4 h-4 mr-1" />, label: "Feature List" },
                  { id: "market", icon: <BarChart3 className="w-4 h-4 mr-1" />, label: "Market Analysis" },
                  { id: "pricing", icon: <DollarSign className="w-4 h-4 mr-1" />, label: "Features & Pricing" },
                  { id: "usecases", icon: <Briefcase className="w-4 h-4 mr-1" />, label: "Use Cases" },
                  { id: "roadmap", icon: <Map className="w-4 h-4 mr-1" />, label: "Product Roadmap" },
                  { id: "business", icon: <Building2 className="w-4 h-4 mr-1" />, label: "Business Plan" },
                  { id: "gtm", icon: <Megaphone className="w-4 h-4 mr-1" />, label: "GTM Strategy" },
                  { id: "metrics", icon: <LineChart className="w-4 h-4 mr-1" />, label: "Metrics" },
                  { id: "swot", icon: <Compass className="w-4 h-4 mr-1" />, label: "SWOT Analysis" },
                  { id: "enhancements", icon: <Rocket className="w-4 h-4 mr-1" />, label: "Enhancement Roadmap" },
                  { id: "assets", icon: <CreditCard className="w-4 h-4 mr-1" />, label: "Assets & Credentials" },
                ]
              : [
                  { id: "summary", icon: <Target className="w-4 h-4" />, label: "Summary" },
                  { id: "features", icon: <List className="w-4 h-4" />, label: "Features" },
                  { id: "market", icon: <BarChart3 className="w-4 h-4" />, label: "Market" },
                  { id: "pricing", icon: <DollarSign className="w-4 h-4" />, label: "Pricing" },
                  { id: "usecases", icon: <Briefcase className="w-4 h-4" />, label: "Use Cases" },
                  { id: "roadmap", icon: <Map className="w-4 h-4" />, label: "Roadmap" },
                  { id: "enhancements", icon: <Rocket className="w-4 h-4" />, label: "Enhancements" },
                  { id: "business", icon: <Building2 className="w-4 h-4" />, label: "Business Plan" },
                  { id: "gtm", icon: <Megaphone className="w-4 h-4" />, label: "GTM Strategy" },
                  { id: "metrics", icon: <LineChart className="w-4 h-4" />, label: "Metrics" },
                  { id: "swot", icon: <Compass className="w-4 h-4" />, label: "SWOT" },
                  { id: "assets", icon: <CreditCard className="w-4 h-4" />, label: "Assets" },
                ]
            ).map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={
                  tabsVariant === "wrap"
                    ? "w-full justify-start data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
                    : "data-[state=active]:bg-[#EDEAE3] bg-white border-x border-t border-gray-100 data-[state=active]:text-[#C72030] text-gray-700 text-[9px] font-black uppercase tracking-tight py-3 px-4 shadow-sm h-12 flex-shrink-0 min-w-[110px] rounded-none border-b-0 whitespace-nowrap"
                }
              >
                {tab.icon}
                <span className={tabsVariant === "wrap" ? "" : "ml-2"}>{tab.label}</span>
              </TabsTrigger>
            ))}
            </TabsList>
          )}

          {/* 1. Summary */}
          <TabsContent value="summary" className="space-y-6">
            {productData.excelLikeSummary ? (
              <div className="animate-fade-in overflow-x-auto rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-xl">
                <div
                  className="min-w-[1600px] rounded-md border border-[#CBD5E1] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 py-4">
                    <div className="bg-[#1f365d] text-white px-4 py-2 font-black uppercase tracking-tight text-[11px] text-center border border-[#173563]">
                      Post Sales - Product Summary
                    </div>

                    {/* Sheet-style: narrow table on left + blank grid area on right */}
                    <div className="mt-3 flex gap-6">
                      <div className="w-[720px] shrink-0">
                        <table className="w-full border-collapse text-[9px] leading-[1.25] bg-white">
                          <thead>
                            <tr className="font-black uppercase text-[8px] text-[#0f172a]">
                              <th className="border border-[#c4cad4] bg-[#e9edf5] px-2 py-2 w-[38%] text-left">
                                Field / Section
                              </th>
                              <th className="border border-[#c4cad4] bg-[#f8fafc] px-2 py-2 text-left">
                                Details
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {summarySheetRows.map((row, index) => {
                              if (row.kind === "section") {
                                return (
                                  <tr key={`section-${index}`}>
                                    <td
                                      className="border border-[#173563] bg-[#1F365D] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white"
                                      colSpan={2}
                                    >
                                      {row.label}
                                    </td>
                                  </tr>
                                );
                              }

                              return (
                                <tr
                                  key={`data-${index}`}
                                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"} hover:bg-[#f5f8ff] transition-colors align-top`}
                                >
                                  <td className="border border-[#CBD5E1] bg-[#f6f8fc] px-2 py-2 font-bold text-[#1E3A5F] whitespace-pre-line">
                                    {row.label}
                                  </td>
                                  <td className="border border-[#CBD5E1] bg-white px-2 py-2 text-[#0f172a] font-medium whitespace-pre-line">
                                    {row.detail}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Blank grid area (like the sheet) */}
                      <div
                        className="flex-1 min-w-[760px] rounded-sm border border-[#CBD5E1] bg-white"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
                          backgroundSize: "34px 24px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in overflow-x-auto">
                <div className="bg-[#20457C] text-white p-6 rounded-t-xl">
                  <h2 className="text-2xl font-black uppercase tracking-tight">{productData.name} - Identity</h2>
                  <p className="text-[10px] font-bold opacity-70 tracking-widest mt-1">LOCKATED / GOPHYGITAL | INTERNAL CONFIDENTIAL</p>
                </div>
                <table className="w-full border-collapse border border-gray-200 text-xs bg-white">
                  <tbody>
                    {productData.extendedContent?.productSummaryNew?.identity?.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-4 font-black text-[#20457C] w-1/4 uppercase tracking-tighter bg-gray-50/50">{r.field}</td>
                        <td className="border border-gray-200 p-4 text-gray-700 font-medium leading-relaxed">{r.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bg-[#1A335E] text-white p-4 font-bold text-sm uppercase">The Problem It Solves</div>
                <table className="w-full border-collapse border border-gray-200 text-xs bg-white">
                  <thead>
                    <tr className="bg-[#4169E1] text-white font-black uppercase">
                      <th className="border border-gray-200 p-4 text-left w-1/4">Pain Point</th>
                      <th className="border border-gray-200 p-4 text-left">Our Solution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent?.productSummaryNew?.problemSolves?.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-4 font-black text-[#20457C] uppercase tracking-tighter bg-gray-50/50">{r.painPoint}</td>
                        <td className="border border-gray-200 p-4 text-gray-700 font-medium leading-relaxed">{r.solution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase">Who It Is For</div>
                <table className="w-full border-collapse border border-gray-200 text-xs bg-white">
                  <thead>
                    <tr className="bg-[#4169E1] text-white font-black uppercase">
                      <th className="border border-gray-200 p-3 text-center w-1/4">Role</th>
                      <th className="border border-gray-200 p-3 text-center w-1/4">What They Use It For</th>
                      <th className="border border-gray-200 p-3 text-center w-1/4">Key Frustration Today</th>
                      <th className="border border-gray-200 p-3 text-center w-1/4">What They Gain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent?.productSummaryNew?.whoItIsFor?.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50 text-[10px]">
                        <td className="border border-gray-200 p-3 font-black text-[#20457C] uppercase bg-gray-50/30">{r.role}</td>
                        <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed">{r.useCase}</td>
                        <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed italic">{r.frustration}</td>
                        <td className="border border-gray-200 p-3 text-gray-700 font-bold leading-relaxed">{r.gain}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase">Feature Summary</div>
                <div className="border border-gray-200 p-4 text-[10px] text-gray-700 bg-white font-medium leading-relaxed">
                  {productData.extendedContent?.featureSummary || productData.brief}
                </div>

                <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase">Where We Are Today</div>
                <table className="w-full border-collapse border border-gray-200 text-xs bg-white">
                  <thead>
                    <tr className="bg-[#4169E1] text-white font-black uppercase">
                      <th className="border border-gray-200 p-3 text-center w-1/4">Dimension</th>
                      <th className="border border-gray-200 p-3 text-center w-3/4">Current State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent?.productSummaryNew?.today?.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50 text-[10px]">
                        <td className="border border-gray-200 p-3 font-black text-[#20457C] uppercase bg-gray-50/30">{r.dimension}</td>
                        <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed">{r.state}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Post Possession (Excel-style full table) */}
          <TabsContent value="post-possession" className="space-y-6 animate-fade-in">
            {productData.excelLikePostPossession ? (
              <div className="overflow-x-auto rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-xl">
                <div
                  className="min-w-[1400px] rounded-md border border-[#CBD5E1] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="mx-auto w-full max-w-[1200px] pt-4 pb-6">
                    <div className="bg-[#1f365d] text-white px-4 py-2 font-black uppercase tracking-tight text-[11px] text-center border border-[#173563]">
                      {productData.extendedContent?.detailedPostPossession?.title || "Post Possession - Full Table"}
                    </div>

                    {productData.extendedContent?.detailedPostPossession?.sections?.length ? (
                      <div className="space-y-6 p-4">
                        {productData.extendedContent.detailedPostPossession.sections.map((section, sIdx) => {
                          const tone =
                            section.tone === "green"
                              ? { bar: "bg-[#1E5631]", head: "bg-[#e7f5e6]" }
                              : section.tone === "red"
                                ? { bar: "bg-[#B91C1C]", head: "bg-[#fdecec]" }
                                : { bar: "bg-[#1f365d]", head: "bg-[#e9edf5]" };

                          return (
                            <div key={sIdx} className="border border-[#c4cad4] bg-white">
                              <div className={`border border-[#173563] ${tone.bar} px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white`}>
                                {section.title}
                              </div>
                              <table className="w-full border-collapse text-[9px] leading-[1.25] text-left">
                                <thead>
                                  <tr className="font-black uppercase text-[8px] text-[#0f172a]">
                                    {section.columns.map((c, cIdx) => (
                                      <th key={cIdx} className={`border border-[#c4cad4] ${tone.head} px-2 py-2`}>
                                        {c}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {section.rows.map((row, rIdx) => (
                                    <tr
                                      key={rIdx}
                                      className={`${rIdx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"} align-top hover:bg-[#f5f8ff] transition-colors`}
                                    >
                                      {row.map((cell, cellIdx) => (
                                        <td key={cellIdx} className="border border-[#c4cad4] px-2 py-2 whitespace-pre-line">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-10 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[2rem] m-4">
                        Post Possession Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                Post Possession UI Coming Soon
              </div>
            )}
          </TabsContent>



          {/* 2. Features */}
          <TabsContent value="features" className="space-y-6">
            <div className="bg-[#1A335E] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">{productData.name} - Feature List</h2>
            </div>
            <div className="bg-[#F0F4F8] p-3 border-x border-gray-200">
              <p className="text-[10px] text-gray-500 font-bold italic leading-relaxed">
                {productData.excelLikeFeatures
                  ? "Feature list shown in spreadsheet layout with module bands and USP markers."
                  : "All features from product brief. USP rows highlighted in blue. Star (*) denotes unique competitive advantage."}
              </p>
            </div>

            {productData.excelLikeFeatures ? (
              <div
                className="overflow-x-auto border border-[#c8ced8] bg-[#f8fafc] p-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                  backgroundSize: "34px 24px",
                }}
              >
                <div className="min-w-[1700px] bg-transparent">
                  <div className="bg-[#1d355f] text-white border border-[#9ca3af] px-3 py-2 text-[10px] font-black uppercase tracking-wide">
                    Feature Summary by Module — What’s in the platform
                  </div>

                  <div className="mt-2 flex gap-6">
                    {/* Left: sheet table */}
                    <div className="w-[980px] shrink-0 bg-white border border-[#c4cad4]">
                      <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                        <thead>
                          <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                            <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[6%]">#</th>
                            <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">Module</th>
                            <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">Feature</th>
                            <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[22%]">Sub Feature</th>
                            <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[28%]">Description</th>
                            <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[5%]">User</th>
                            <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[3%]">USP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const items = productData.extendedContent?.detailedFeatures ?? [];
                            type Group = { moduleKey: string; moduleLabel: string; items: typeof items };
                            const groups: Group[] = [];

                            items.forEach((it) => {
                              const key = it.module.trim().toLowerCase();
                              const last = groups[groups.length - 1];
                              if (!last || last.moduleKey !== key) {
                                groups.push({
                                  moduleKey: key,
                                  moduleLabel: getDisplayModule(it.module),
                                  items: [it],
                                });
                              } else {
                                last.items.push(it);
                              }
                            });

                            let globalRowIdx = 0;
                            return groups.map((g) =>
                              g.items.map((f, localIdx) => {
                                const i = globalRowIdx++;
                                const zebra = i % 2 === 0 ? "bg-white" : "bg-[#eef4ff]";
                                const showModuleCell = localIdx === 0;
                                const rowSpan = g.items.length;

                                return (
                                  <tr key={`${g.moduleKey}-${localIdx}-${f.feature}`} className={`${zebra} hover:bg-[#f8fbff] align-top`}>
                                    <td className="border border-[#c4cad4] px-1 py-1 text-center font-bold text-[#6b7280]">
                                      {excelFeatureRowStart + i}
                                    </td>

                                    {showModuleCell && (
                                      <td
                                        rowSpan={rowSpan}
                                        className={`border border-[#c4cad4] px-1.5 py-1 font-black align-top ${getModuleTone(f.module)}`}
                                      >
                                        {g.moduleLabel}
                                      </td>
                                    )}

                                    <td className="border border-[#c4cad4] px-1.5 py-1 font-semibold text-[#0f172a] break-words">
                                      {f.feature}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {f.subFeatures}
                                    </td>
                                    <td
                                      className={`border border-[#c4cad4] px-1.5 py-1 whitespace-pre-line break-words ${
                                        f.usp ? "text-[#1d4ed8] font-semibold" : "text-[#374151]"
                                      }`}
                                    >
                                      {f.works || ""}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1 py-1 text-center font-black uppercase text-[8px] text-[#334155]">
                                      {f.userType}
                                    </td>
                                    <td
                                      className={`border border-[#c4cad4] px-1 py-1 text-center font-black uppercase text-[8px] ${
                                        f.usp ? "bg-[#d8f4de] text-[#166534]" : "bg-white text-[#94a3b8]"
                                      }`}
                                    >
                                      {f.usp ? "YES" : "-"}
                                    </td>
                                  </tr>
                                );
                              })
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Right: blank grid area (like the sheet) */}
                    <div
                      className="flex-1 min-w-[620px] rounded-sm border border-[#CBD5E1] bg-white"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
                        backgroundSize: "34px 24px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-b-xl shadow-lg">
                <table className="w-full border-collapse text-[10px] bg-white">
                  <thead>
                    <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                      <th className="border border-gray-200 p-3 w-[15%]">Module</th>
                      <th className="border border-gray-200 p-3 w-[15%]">Feature</th>
                      <th className="border border-gray-200 p-3 w-[25%]">Sub-Features</th>
                      <th className="border border-gray-200 p-3 w-[25%]">How It Currently Works</th>
                      <th className="border border-gray-200 p-3 w-[10%]">User Type</th>
                      <th className="border border-gray-200 p-3 w-[10%]">USP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent?.detailedFeatures?.map((f, i) => (
                      <tr key={i} className={`hover:bg-gray-100 transition-colors ${f.usp ? "bg-blue-50/50 font-semibold" : ""}`}>
                        <td className="border border-gray-200 p-3 font-black text-[#1A335E] uppercase bg-gray-50/30">{f.module}</td>
                        <td className="border border-gray-200 p-3 text-gray-800 font-bold">{f.feature}</td>
                        <td className="border border-gray-200 p-3 text-gray-600 leading-relaxed font-medium">{f.subFeatures}</td>
                        <td className="border border-gray-200 p-3 text-gray-700 leading-relaxed italic">{f.works}</td>
                        <td className="border border-gray-200 p-3 text-gray-500 font-black text-center uppercase tracking-tighter">{f.userType}</td>
                        <td className="border border-gray-200 p-3 text-center">
                          {f.usp && (
                            <div className="flex items-center justify-center gap-1 text-[#4169E1] font-black">
                              <span>* USP</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          {/* 3. Market */}
          <TabsContent value="market" className="space-y-8">
            <div className="bg-[#1A335E] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">{productData.name} - Market Analysis</h2>
            </div>
            {productData.excelLikeMarket && productData.extendedContent?.detailedMarketAnalysis?.marketMatrixRows ? (
              <div
                className="overflow-x-auto border border-[#c8ced8] bg-[#f8fafc] p-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                  backgroundSize: "34px 24px",
                }}
              >
                <table className="w-[1280px] border-collapse bg-white text-[9px] leading-[1.2]">
                  <thead>
                    <tr className="bg-[#1d355f] text-white">
                      <th className="border border-[#9ca3af] px-2 py-1.5 text-center font-black" colSpan={12}>
                        Post Sales - Market Analysis
                      </th>
                    </tr>
                    <tr className="bg-[#2b4a77] text-white/90">
                      <th className="border border-[#9ca3af] px-2 py-1 text-left text-[8px] font-semibold" colSpan={12}>
                        {productData.extendedContent.detailedMarketAnalysis.marketMatrixSubtitle ||
                          "Behavior / price sensitivity / trust barrier / incumbent intensity / strategic fit"}
                      </th>
                    </tr>
                    <tr className="bg-[#1f365d] text-white">
                      <th className="border border-[#9ca3af] px-1.5 py-1 text-left font-black uppercase" colSpan={12}>
                        Section 1: Target Audience | Who we sell to, what pains them, and what shifts them to us
                      </th>
                    </tr>
                    <tr className="font-black uppercase text-[8px] text-[#183153]">
                      <th className="border border-[#b8c0cc] bg-[#d8deea] px-1.5 py-1 text-left">Who Is This Today</th>
                      <th className="border border-[#b8c0cc] bg-[#e2e8f5] px-1.5 py-1 text-left">Who We Sell To</th>
                      <th className="border border-[#b8c0cc] bg-[#e8ecf7] px-1.5 py-1 text-left">Sub-Sector</th>
                      <th className="border border-[#b8c0cc] bg-[#f3e8d0] px-1.5 py-1 text-left">What Budget They Have</th>
                      <th className="border border-[#b8c0cc] bg-[#e4f0db] px-1.5 py-1 text-left">How They Buy</th>
                      <th className="border border-[#b8c0cc] bg-[#f2e7f7] px-1.5 py-1 text-left">Who They Use Today</th>
                      <th className="border border-[#b8c0cc] bg-[#fdecc8] px-1.5 py-1 text-left">How Ready They Are</th>
                      <th className="border border-[#b8c0cc] bg-[#fce8d6] px-1.5 py-1 text-left">What Makes Them Switch</th>
                      <th className="border border-[#b8c0cc] bg-[#fff5cc] px-1.5 py-1 text-left">What Win Looks Like</th>
                      <th className="border border-[#b8c0cc] bg-[#f1f5f9] px-1.5 py-1 text-left">Big Risk</th>
                      <th className="border border-[#b8c0cc] bg-[#e9edf5] px-1.5 py-1 text-left">Entry Wedge</th>
                      <th className="border border-[#b8c0cc] bg-[#eef2ff] px-1.5 py-1 text-left">Opportunity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent.detailedMarketAnalysis.marketMatrixRows.map((r, i) => (
                      <tr key={i} className="hover:bg-[#f8fbff] align-top">
                        <td className="border border-[#c4cad4] bg-[#edf2fa] px-1.5 py-1 font-bold text-[#1f365d]">{r.segment}</td>
                        <td className="border border-[#c4cad4] bg-[#f3f7fd] px-1.5 py-1 text-[#1f2937]">{r.whoToday}</td>
                        <td className="border border-[#c4cad4] bg-[#f7f9fe] px-1.5 py-1 text-[#374151]">{r.subsector}</td>
                        <td className="border border-[#c4cad4] bg-[#fbf4e4] px-1.5 py-1 text-[#374151]">{r.budget}</td>
                        <td className="border border-[#c4cad4] bg-[#eff8e8] px-1.5 py-1 text-[#374151]">{r.purchasePattern}</td>
                        <td className="border border-[#c4cad4] bg-[#f8f0fb] px-1.5 py-1 text-[#374151]">{r.incumbents}</td>
                        <td className="border border-[#c4cad4] bg-[#fff6df] px-1.5 py-1 text-[#374151]">{r.readiness}</td>
                        <td className="border border-[#c4cad4] bg-[#fff0e6] px-1.5 py-1 text-[#374151]">{r.trigger}</td>
                        <td className="border border-[#c4cad4] bg-[#fff8db] px-1.5 py-1 font-semibold text-[#1e3a8a]">{r.payoff}</td>
                        <td className="border border-[#c4cad4] bg-[#f8fafc] px-1.5 py-1 text-[#374151]">{r.risk}</td>
                        <td className="border border-[#c4cad4] bg-[#f1f5ff] px-1.5 py-1 text-[#374151]">{r.entryWedge}</td>
                        <td className="border border-[#c4cad4] bg-[#eef2ff] px-1.5 py-1 font-semibold text-[#0f766e]">{r.opportunity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : productData.excelLikeMarket &&
              productData.extendedContent?.detailedMarketAnalysis &&
              (productData.extendedContent.detailedMarketAnalysis.targetAudience?.length ||
                productData.extendedContent.detailedMarketAnalysis.competitorMapping?.length) ? (
              <div
                className="overflow-x-auto border border-[#c8ced8] bg-[#f8fafc] p-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                  backgroundSize: "34px 24px",
                }}
              >
                <div className="min-w-[1850px] bg-transparent">
                  <div className="bg-[#1d355f] text-white border border-[#9ca3af] px-3 py-2 text-[10px] font-black uppercase tracking-wide">
                    Post Possession — Market Analysis
                  </div>

                  <div className="mt-2 flex gap-6">
                    <div className="w-[1120px] shrink-0 space-y-4">
                      {!!productData.extendedContent.detailedMarketAnalysis.targetAudience?.length && (
                        <>
                          <div className="bg-[#1f365d] text-white border border-[#173563] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide">
                            Part A — Customer segments and buying context
                          </div>
                          <div className="bg-white border border-[#c4cad4]">
                            <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                              <thead>
                                <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">Segment</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[16%]">Decision maker</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[22%]">Pain points</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[22%]">What happens if not solved</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[22%]">Good enough today</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.extendedContent.detailedMarketAnalysis.targetAudience!.map((t, i) => (
                                  <tr
                                    key={i}
                                    className={`${i % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"} hover:bg-[#f8fbff] align-top`}
                                  >
                                    <td className="border border-[#c4cad4] px-1.5 py-1 font-black text-[#1f365d] break-words">
                                      {t.segment}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-semibold break-words">
                                      {t.industry}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#334155] font-medium whitespace-pre-line break-words">
                                      {t.painPoints}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {t.notSolved}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#334155] font-medium whitespace-pre-line break-words">
                                      {t.goodEnough}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {!!productData.extendedContent.detailedMarketAnalysis.competitorMapping?.length && (
                        <>
                          <div className="bg-[#1f365d] text-white border border-[#173563] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide">
                            Part B — Competitor mapping
                          </div>
                          <div className="bg-white border border-[#c4cad4]">
                            <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                              <thead>
                                <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[14%]">Competitor</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[14%]">Target customer</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[12%]">Pricing</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[14%]">Discovery</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">Strongest features</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[14%]">Weakness</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[14%]">Market gaps</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.extendedContent.detailedMarketAnalysis.competitorMapping!.map((c, i) => (
                                  <tr
                                    key={i}
                                    className={`${i % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"} hover:bg-[#f8fbff] align-top`}
                                  >
                                    <td className="border border-[#c4cad4] px-1.5 py-1 font-black text-[#1f365d] break-words">
                                      {c.name}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {c.targetCustomer}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#334155] font-medium whitespace-pre-line break-words">
                                      {c.pricing}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {c.discovery}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#166534] font-semibold whitespace-pre-line break-words">
                                      {c.strongestFeatures}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#b91c1c] font-semibold whitespace-pre-line break-words">
                                      {c.weakness}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#1d4ed8] font-semibold whitespace-pre-line break-words">
                                      {c.marketGaps}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      className="flex-1 min-w-[650px] rounded-sm border border-[#CBD5E1] bg-white"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
                        backgroundSize: "34px 24px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : productData.extendedContent?.detailedMarketAnalysis ? (
              <>
                <div className="bg-[#DCE6F2] p-2 border-x border-gray-200">
                   <p className="text-[10px] text-[#1A335E] font-bold italic">India Primary | Global Secondary | Data as of Q1 2026 | All pricing verified from public sources</p>
                </div>

                {productData.extendedContent?.detailedMarketAnalysis?.targetAudience && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase">PART A — TARGET AUDIENCE (India and GCC Only)</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase">
                            <th className="border border-gray-200 p-3 w-[15%]">Audience Segment</th>
                            <th className="border border-gray-200 p-3 w-[20%]">Demographics</th>
                            <th className="border border-gray-200 p-3 w-[15%]">Industry</th>
                            <th className="border border-gray-200 p-3 w-[20%]">Pain Points (3 per segment)</th>
                            <th className="border border-gray-200 p-3 w-[15%]">What Happens If NOT Solved</th>
                            <th className="border border-gray-200 p-3 w-[15%]">What 'Good Enough' Looks Like Today</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedMarketAnalysis.targetAudience.map((t, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 p-3 font-black text-[#1A335E]">{t.segment}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed">{t.demographics}</td>
                              <td className="border border-gray-200 p-3 text-gray-800 font-bold">{t.industry}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 leading-relaxed italic">{t.painPoints}</td>
                              <td className="border border-gray-200 p-3 text-[#C72030] font-medium leading-relaxed">{t.notSolved}</td>
                              <td className="border border-gray-200 p-3 text-gray-500 font-medium">{t.goodEnough}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedMarketAnalysis?.competitorMapping && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase">PART B — COMPETITOR MAPPING (India and GCC)</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase">
                            <th className="border border-gray-200 p-3">Competitor Name / Type</th>
                            <th className="border border-gray-200 p-3">Primary Target Customer</th>
                            <th className="border border-gray-200 p-3">Pricing Model & Price</th>
                            <th className="border border-gray-200 p-3">How Buyers Discover Them</th>
                            <th className="border border-gray-200 p-3">Strongest Features & USPs</th>
                            <th className="border border-gray-200 p-3">Weaknesses</th>
                            <th className="border border-gray-200 p-3">Market Gaps & How We Exploit</th>
                            <th className="border border-gray-200 p-3">Their Innovations That Threaten Us</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedMarketAnalysis.competitorMapping.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 p-3 font-black text-[#1A335E] bg-yellow-50">{c.name}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed bg-yellow-50">{c.targetCustomer}</td>
                              <td className="border border-gray-200 p-3 text-gray-800 italic bg-yellow-50">{c.pricing}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 leading-relaxed bg-yellow-50">{c.discovery}</td>
                              <td className="border border-gray-200 p-3 text-green-700 font-bold leading-relaxed bg-yellow-50">{c.strongestFeatures}</td>
                              <td className="border border-gray-200 p-3 text-red-700 font-bold leading-relaxed bg-yellow-50">{c.weakness}</td>
                              <td className="border border-gray-200 p-3 text-blue-700 font-bold leading-relaxed bg-yellow-50">{c.marketGaps}</td>
                              <td className="border border-gray-200 p-3 text-purple-700 font-medium italic bg-yellow-50">{c.threats}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Legacy schema fallbacks */}
                {productData.extendedContent?.detailedMarketAnalysis?.marketSize && !productData.extendedContent?.detailedMarketAnalysis?.targetAudience && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase">Market Size and Growth</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-center">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase">
                            <th className="border border-gray-200 p-3 w-[15%]">Segment</th>
                            <th className="border border-gray-200 p-3 w-[10%] text-center">2024/25 Val</th>
                            <th className="border border-gray-200 p-3 w-[10%] text-center">2026 Val</th>
                            <th className="border border-gray-200 p-3 w-[15%] text-center">Forecast</th>
                            <th className="border border-gray-200 p-3 w-[8%] text-center">CAGR</th>
                            <th className="border border-gray-200 p-3 w-[20%] text-left">Key Driver</th>
                            <th className="border border-gray-200 p-3 w-[22%] text-left">India Relevance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedMarketAnalysis.marketSize.map((m, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 p-3 font-black text-[#1A335E] uppercase bg-gray-50/30">{m.segment}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 font-medium">{m.val2425}</td>
                              <td className="border border-gray-200 p-3 text-gray-900 font-bold">{m.val26}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 font-medium italic">{m.forecast}</td>
                              <td className="border border-gray-200 p-3 text-center font-black text-blue-600">{m.cagr}</td>
                              <td className="border border-gray-200 p-3 text-gray-600 leading-relaxed font-medium text-left">{m.driver}</td>
                              <td className="border border-gray-200 p-3 text-blue-800 leading-relaxed font-bold text-left">{m.india}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedMarketAnalysis?.competitors && !productData.extendedContent?.detailedMarketAnalysis?.competitorMapping && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase">Competitor Analysis - Top 10</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[9px] bg-white">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                            <th className="border border-gray-200 p-3">Competitor</th>
                            <th className="border border-gray-200 p-3">HQ / Focus</th>
                            <th className="border border-gray-200 p-3">India Pricing</th>
                            <th className="border border-gray-200 p-3">Global Pricing</th>
                            <th className="border border-gray-200 p-3 text-left">Key Strength</th>
                            <th className="border border-gray-200 p-3 text-left">Key Weakness</th>
                            <th className="border border-gray-200 p-3">Sovereignty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedMarketAnalysis.competitors.map((comp, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 p-2 text-gray-900 font-black">{comp.name}</td>
                              <td className="border border-gray-200 p-2 text-gray-600 font-medium text-center">{comp.hq}</td>
                              <td className="border border-gray-200 p-2 text-blue-600 font-bold text-center">{comp.indiaPrice}</td>
                              <td className="border border-gray-200 p-2 text-gray-700 font-medium text-center italic">{comp.globalPrice}</td>
                              <td className="border border-gray-200 p-2 text-green-700 font-bold leading-tight">{comp.strength}</td>
                              <td className="border border-gray-200 p-2 text-red-700 font-bold leading-tight">{comp.weakness}</td>
                              <td className="border border-gray-200 p-2 text-center font-black uppercase text-[8px]">{comp.sovereignty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {productData.extendedContent.detailedMarketAnalysis.competitorSummary && (
                      <div className="bg-[#1A335E] text-white p-3 text-[10px] font-bold uppercase tracking-tight rounded-b-xl">
                        <span className="text-yellow-400">SUMMARY:</span> {productData.extendedContent.detailedMarketAnalysis.competitorSummary}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
               <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                  Market Analysis Data Coming Soon
               </div>
            )}
          </TabsContent>

          {/* 4. Pricing */}
          <TabsContent value="pricing" className="space-y-10">
            <div className="bg-[#1A335E] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">{productData.name} - Pricing Landscape</h2>
            </div>
            {productData.excelLikePricing && productData.extendedContent?.detailedPricing ? (
              <div
                className="overflow-x-auto border border-[#c8ced8] bg-[#f8fafc] p-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                  backgroundSize: "34px 24px",
                }}
              >
                <div className="min-w-[1850px] bg-transparent">
                  <div className="mt-2 flex gap-6">
                    <div className="w-[1180px] shrink-0 space-y-3">
                      <table className="w-full border-collapse bg-white text-[9px] leading-[1.2]">
                    <thead>
                      <tr className="bg-[#1d355f] text-white">
                        <th className="border border-[#9ca3af] px-2 py-1.5 text-center font-black" colSpan={6}>
                          Post Sales - Features & Pricing
                        </th>
                      </tr>
                      <tr className="bg-[#2b4a77] text-white/90">
                        <th className="border border-[#9ca3af] px-2 py-1 text-left text-[8px] font-semibold" colSpan={6}>
                          {productData.extendedContent.detailedPricing.pricingMatrixSubtitle ||
                            "Section 1 compares current feature depth vs market expectations and highlights where positioning is strongest or vulnerable."}
                        </th>
                      </tr>
                      <tr className="bg-[#1f365d] text-white">
                        <th className="border border-[#9ca3af] px-1.5 py-1 text-left font-black uppercase" colSpan={6}>
                          Section 1: Current features vs market standard | Where we are strong, where we are weak
                        </th>
                      </tr>
                      <tr className="font-black uppercase text-[8px] text-[#183153]">
                        <th className="border border-[#b8c0cc] bg-[#e9edf5] px-1.5 py-1 text-left w-[18%]">Feature / Capability</th>
                        <th className="border border-[#b8c0cc] bg-[#eef2ff] px-1.5 py-1 text-left w-[18%]">Current State</th>
                        <th className="border border-[#b8c0cc] bg-[#eff8e8] px-1.5 py-1 text-left w-[18%]">What Market Expects</th>
                        <th className="border border-[#b8c0cc] bg-[#fff8db] px-1.5 py-1 text-left w-[18%]">How This Helps / Hurts Us</th>
                        <th className="border border-[#b8c0cc] bg-[#eef2ff] px-1.5 py-1 text-center w-[8%]">Status</th>
                        <th className="border border-[#b8c0cc] bg-[#fff0e6] px-1.5 py-1 text-left w-[20%]">Recommended Move</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent.detailedPricing.pricingFeatureRows?.map((row, index) => {
                        const tone = row.status.toUpperCase();
                        const statusClass =
                          tone.includes("AHEAD") || tone.includes("STRONG")
                            ? "bg-[#d8f4de] text-[#166534]"
                            : tone.includes("PAR") || tone.includes("OK")
                              ? "bg-[#fef3c7] text-[#92400e]"
                              : "bg-[#fde2ec] text-[#be123c]";

                        return (
                          <tr key={index} className="align-top hover:bg-[#f8fbff]">
                            <td className="border border-[#c4cad4] bg-[#f8fafc] px-1.5 py-1 font-bold text-[#1f365d]">{row.capability}</td>
                            <td className="border border-[#c4cad4] bg-white px-1.5 py-1 text-[#374151]">{row.currentState}</td>
                            <td className="border border-[#c4cad4] bg-[#f0fdf4] px-1.5 py-1 text-[#374151]">{row.marketNeed}</td>
                            <td className="border border-[#c4cad4] bg-[#fffbea] px-1.5 py-1 text-[#374151]">{row.impact}</td>
                            <td className={`border border-[#c4cad4] px-1 py-1 text-center font-black uppercase ${statusClass}`}>{row.status}</td>
                            <td className="border border-[#c4cad4] bg-[#fff7ed] px-1.5 py-1 text-[#7c2d12]">{row.recommendation}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {!!productData.extendedContent.detailedPricing.pricingSummaryRows?.length && (
                    <table className="w-full border-collapse bg-white text-[9px] leading-[1.2]">
                      <tbody>
                        {productData.extendedContent.detailedPricing.pricingSummaryRows.map((row, index) => {
                          const toneClass =
                            row.tone === "green"
                              ? "bg-[#ecfdf5] text-[#166534]"
                              : row.tone === "yellow"
                                ? "bg-[#fef3c7] text-[#92400e]"
                                : "bg-[#fef2f2] text-[#b91c1c]";
                          return (
                            <tr key={index}>
                              <td className={`w-[26%] border border-[#c4cad4] px-2 py-1 font-black uppercase ${toneClass}`}>{row.label}</td>
                              <td className={`border border-[#c4cad4] px-2 py-1 ${toneClass}`}>{row.detail}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  <table className="w-full border-collapse bg-white text-[9px] leading-[1.2]">
                    <thead>
                      <tr className="bg-[#1f365d] text-white">
                        <th className="border border-[#9ca3af] px-1.5 py-1 text-left font-black uppercase" colSpan={2}>
                          Section 2: Current pricing and plans | What we charge and how it lands
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent.detailedPricing.pricingCurrentRows?.map((row, index) => (
                        <tr key={index}>
                          <td className="w-[24%] border border-[#c4cad4] bg-[#eef2ff] px-2 py-1 font-bold text-[#1f365d]">{row.label}</td>
                          <td className="border border-[#c4cad4] bg-white px-2 py-1 text-[#374151]">{row.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <table className="w-full border-collapse bg-white text-[9px] leading-[1.2]">
                    <thead>
                      <tr className="bg-[#1f365d] text-white">
                        <th className="border border-[#9ca3af] px-1.5 py-1 text-left font-black uppercase" colSpan={3}>
                          Section 3: Positioning | Why this offer is hard to ignore
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent.detailedPricing.pricingPositioningRows?.map((row, index) => (
                        <tr key={index} className="align-top">
                          <td className="w-[22%] border border-[#c4cad4] bg-[#f8fafc] px-2 py-1 font-bold text-[#1f365d]">{row.question}</td>
                          <td className="border border-[#c4cad4] bg-white px-2 py-1 text-[#374151]">{row.answer}</td>
                          <td className="w-[22%] border border-[#c4cad4] bg-[#fff7ed] px-2 py-1 text-[#9a3412]">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <table className="w-full border-collapse bg-white text-[9px] leading-[1.2]">
                    <thead>
                      <tr className="bg-[#1f365d] text-white">
                        <th className="border border-[#9ca3af] px-1.5 py-1 text-left font-black uppercase" colSpan={4}>
                          Section 4: Value proposition and suggested improvements
                        </th>
                      </tr>
                      <tr className="font-black uppercase text-[8px] text-[#183153]">
                        <th className="border border-[#b8c0cc] bg-[#e9edf5] px-1.5 py-1 text-left w-[25%]">Current Prop</th>
                        <th className="border border-[#b8c0cc] bg-[#eef2ff] px-1.5 py-1 text-left w-[22%]">Suggested Fix</th>
                        <th className="border border-[#b8c0cc] bg-[#eff8e8] px-1.5 py-1 text-left w-[28%]">Improved Framing</th>
                        <th className="border border-[#b8c0cc] bg-[#fff8db] px-1.5 py-1 text-left w-[25%]">Why It Matters</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent.detailedPricing.pricingImprovementRows?.map((row, index) => (
                        <tr key={index} className="align-top">
                          <td className="border border-[#c4cad4] bg-[#f8fafc] px-2 py-1 text-[#1f365d] font-bold">{row.currentProp}</td>
                          <td className="border border-[#c4cad4] bg-[#eef2ff] px-2 py-1 text-[#1e3a8a]">{row.suggestedFix}</td>
                          <td className="border border-[#c4cad4] bg-[#f0fdf4] px-2 py-1 text-[#166534]">{row.improvedFraming}</td>
                          <td className="border border-[#c4cad4] bg-[#fffbea] px-2 py-1 text-[#7c2d12]">{row.whyItWins}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    </div>

                    {/* Right: blank grid area like the sheet */}
                    <div
                      className="flex-1 min-w-[650px] rounded-sm border border-[#CBD5E1] bg-white"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
                        backgroundSize: "34px 24px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : productData.extendedContent?.detailedPricing ? (
              <>
                <div className="bg-[#DCE6F2] p-2 border-x border-gray-200">
                   <p className="text-[10px] text-[#1A335E] font-bold italic uppercase tracking-tighter">AHEAD = Leader | AT PAR = Equal | GAP = Lagging | Q1 2026 data</p>
                </div>

                {productData.extendedContent?.detailedPricing?.featuresVsMarket && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">PART A — CURRENT FEATURES VS MARKET STANDARD</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                            <th className="border border-gray-200 p-3 w-[15%] text-left">Feature Area</th>
                            <th className="border border-gray-200 p-3 w-[25%] text-left">Market Standard (What Most Products Offer)</th>
                            <th className="border border-gray-200 p-3 w-[25%] text-left bg-blue-900/10 text-blue-900 font-black">Our Product (Have / Roadmap / Gap)</th>
                            <th className="border border-gray-200 p-3 w-[25%] text-left">Summary: Where Ahead / At Par / Gap That Will Cost Deals</th>
                            <th className="border border-gray-200 p-3 w-[10%]">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.featuresVsMarket.map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 p-3 font-bold text-[#1A335E] leading-relaxed">{f.featureArea}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 leading-relaxed font-medium">{f.marketStandard}</td>
                              <td className="border border-gray-200 p-3 text-blue-900 font-medium leading-relaxed bg-blue-50/30 whitespace-pre-line">{f.ourProduct}</td>
                              <td className="border border-gray-200 p-3 text-gray-800 leading-relaxed font-medium">{f.summary}</td>
                              <td className="border border-gray-200 p-3 text-center">
                                <span className={`px-2 py-1.5 rounded-sm font-black text-[9px] uppercase tracking-tighter block text-white shadow-sm
                                  ${f.status === 'AHEAD' || f.status === 'SIGNIFICANTLY AHEAD' ? 'bg-[#4CAF50]' : f.status.includes('AT PAR') ? 'bg-[#FFC107] text-black' : 'bg-[#D32F2F]'}`}>
                                  {f.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedPricing?.featureSummary && (
                  <div className="space-y-4">
                     <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase text-left">
                            <th className="border border-gray-200 p-3 w-[20%]">Summary</th>
                            <th className="border border-gray-200 p-3 w-[80%]"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border border-gray-200 p-3 font-black text-[#1A335E] bg-green-50 uppercase">WHERE WE ARE AHEAD OF MARKET</td>
                            <td className="border border-gray-200 p-3 text-green-900 font-medium leading-relaxed bg-green-50">{productData.extendedContent.detailedPricing.featureSummary.ahead}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border border-gray-200 p-3 font-black text-[#1A335E] bg-gray-100 uppercase">WHERE WE ARE AT PAR</td>
                            <td className="border border-gray-200 p-3 text-gray-800 font-medium leading-relaxed bg-gray-100">{productData.extendedContent.detailedPricing.featureSummary.atPar}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border border-gray-200 p-3 font-black text-[#1A335E] bg-red-50 uppercase">GAPS THAT WILL COST US DEALS</td>
                            <td className="border border-gray-200 p-3 text-red-900 font-medium leading-relaxed bg-red-50">{productData.extendedContent.detailedPricing.featureSummary.gaps}</td>
                          </tr>
                        </tbody>
                      </table>
                     </div>
                  </div>
                )}

                {/* Legacy fallback */}
                {productData.extendedContent?.detailedPricing?.featureComparison && !productData.extendedContent?.detailedPricing?.featuresVsMarket && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">Feature Comparison vs Top Competitors</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-center">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                            <th className="border border-gray-200 p-3 text-left">Capability</th>
                            <th className="border border-gray-200 p-3 bg-blue-900/10 text-blue-900 font-black uppercase">Our Product</th>
                            <th className="border border-gray-200 p-3 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.featureComparison.map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 p-3 font-bold text-[#1A335E] text-left uppercase">{f.feature}</td>
                              <td className="border border-gray-200 p-3 text-blue-900 font-black italic bg-blue-50/30 uppercase">{f.snag}</td>
                              <td className="border border-gray-200 p-3">
                                <span className={`px-3 py-1.5 rounded-sm font-black text-[9px] uppercase tracking-tighter block text-white shadow-sm
                                  ${f.status === 'AHEAD' || f.status === 'Leader' ? 'bg-[#4CAF50]' : f.status === 'AT PAR' || f.status === 'Equal' ? 'bg-[#FFC107] text-black' : 'bg-[#D32F2F]'}`}>
                                  {f.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedPricing?.currentPricingMarket && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">PART B — CURRENT PRICING MARKET</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left">
                        <tbody>
                          {productData.extendedContent.detailedPricing.currentPricingMarket.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                              <td className="p-4 font-black text-[#1A335E] bg-[#F8FAFC] w-[30%] border-r border-gray-100">{p.category}</td>
                              <td className="p-4 text-gray-800 leading-relaxed font-medium bg-white w-[70%] whitespace-pre-line">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedPricing?.positioning && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">PART C — POSITIONING</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left">
                        <tbody>
                          {productData.extendedContent.detailedPricing.positioning.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                              <td className="p-4 font-black text-[#1A335E] bg-[#F8FAFC] w-[30%] border-r border-gray-100">{p.category}</td>
                              <td className="p-4 text-gray-800 leading-relaxed font-medium bg-white w-[70%] whitespace-pre-line">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedPricing?.valuePropositions && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">PART D — VALUE PROPOSITIONS & IMPROVEMENTS</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                            <th className="border border-gray-200 p-3 w-[25%] text-left">Current Value Proposition</th>
                            <th className="border border-gray-200 p-3 w-[20%] text-left">Segment It Addresses</th>
                            <th className="border border-gray-200 p-3 w-[25%] text-left">Weakness in Current Framing</th>
                            <th className="border border-gray-200 p-3 w-[30%] text-left">Sharpened or Expanded Version</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.valuePropositions.map((v, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 p-3 font-bold text-[#1A335E] leading-relaxed">{v.currentProp}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 leading-relaxed font-medium">{v.segment}</td>
                              <td className="border border-gray-200 p-3 text-red-800 font-medium leading-relaxed bg-red-50/50">{v.weakness}</td>
                              <td className="border border-gray-200 p-3 text-[#2E7D32] font-medium leading-relaxed bg-green-50/30 whitespace-pre-line">{v.sharpened}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Legacy fallback */}
                {productData.extendedContent?.detailedPricing?.pricingLandscape && !productData.extendedContent?.detailedPricing?.currentPricingMarket && (
                  <div className="space-y-4">
                    <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">Pricing & Target Segments</div>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                            <th className="border border-gray-200 p-3">Tier</th>
                            <th className="border border-gray-200 p-3 text-left">Pricing Model</th>
                            <th className="border border-gray-200 p-3">India Price</th>
                            <th className="border border-gray-200 p-3">Global Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.pricingLandscape.map((p, i) => (
                            <tr key={i} className={`hover:bg-gray-50 transition-colors ${p.tier.includes('Our') ? 'bg-blue-50/30' : ''}`}>
                              <td className="border border-gray-200 p-3 font-black text-[#1A335E] uppercase">{p.tier}</td>
                              <td className="border border-gray-200 p-3 text-gray-600 font-medium leading-relaxed italic">{p.model}</td>
                              <td className="border border-gray-200 p-3 text-blue-700 font-black text-center">{p.india}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 font-bold text-center italic">{p.global}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
               <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                  Pricing and Plans Data Coming Soon
               </div>
            )}
          </TabsContent>

          {/* 5. Use Cases */}
          <TabsContent value="usecases" className="space-y-10">
            <div className="bg-[#1A335E] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">{productData.name} - Use Cases</h2>
            </div>
            {productData.extendedContent?.detailedUseCases && (
              <div className="space-y-8">
                {productData.excelLikeUseCases ? (
                  <div
                    className="overflow-x-auto border border-[#c8ced8] bg-[#f8fafc] p-2"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                      backgroundSize: "34px 24px",
                    }}
                  >
                    <div className="min-w-[1700px] bg-transparent">
                      <div className="bg-[#1d355f] text-white border border-[#9ca3af] px-3 py-2 text-[10px] font-black uppercase tracking-wide">
                        Post Possession — Use Cases
                      </div>

                      <div className="mt-2 flex gap-6">
                        <div className="w-[1080px] shrink-0 space-y-4">
                          {/* PART A */}
                          <div className="bg-[#1f365d] text-white border border-[#173563] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide">
                            Part A — Industry level use cases
                          </div>
                          <div className="bg-white border border-[#c4cad4]">
                            <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                              <thead>
                                <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                                  <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[6%]">#</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">Target Segment</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[22%]">Use Case</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">How they do it today</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[20%]">How we solve it</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[16%]">How to sell</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.extendedContent.detailedUseCases.industryUseCases?.map((u, i) => (
                                  <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"} hover:bg-[#f8fbff] align-top`}>
                                    <td className="border border-[#c4cad4] px-1 py-1 text-center font-bold text-[#6b7280]">
                                      {u.rank}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 font-black text-[#1f365d] break-words">
                                      {u.industry}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-semibold whitespace-pre-line break-words">
                                      {u.useCase}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#334155] font-medium whitespace-pre-line break-words">
                                      {u.currentTool}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {u.features}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {u.profile}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* PART B */}
                          <div className="bg-[#1f365d] text-white border border-[#173563] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide">
                            Part B — Internal team use cases
                          </div>
                          <div className="bg-white border border-[#c4cad4]">
                            <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                              <thead>
                                <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">Team</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[22%]">Relevant features</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[34%]">How they use it day-to-day</th>
                                  <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">Benefit</th>
                                  <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[8%]">Freq</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.extendedContent.detailedUseCases.internalTeamUseCases?.map((t, i) => (
                                  <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"} hover:bg-[#f8fbff] align-top`}>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 font-black text-[#1f365d] uppercase break-words">
                                      {t.team}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {t.features}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {t.process}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1.5 py-1 text-[#334155] font-medium whitespace-pre-line break-words">
                                      {t.benefit}
                                    </td>
                                    <td className="border border-[#c4cad4] px-1 py-1 text-center font-black uppercase text-[8px] text-[#334155]">
                                      {t.frequency}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Right: blank grid area */}
                        <div
                          className="flex-1 min-w-[560px] rounded-sm border border-[#CBD5E1] bg-white"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
                            backgroundSize: "34px 24px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">PART A — INDUSTRY LEVEL USE CASES (Ranked)</div>
                      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[10px] bg-white text-left">
                          <thead>
                            <tr className="bg-[#4169E1] text-white font-black uppercase">
                              <th className="border border-gray-200 p-3 w-[15%]">Industry (Ranked)</th>
                              <th className="border border-gray-200 p-3 w-[20%]">Relevant Features & Teams</th>
                              <th className="border border-gray-200 p-3 w-[30%]">How They Use It</th>
                              <th className="border border-gray-200 p-3 w-[20%]">Ideal Company Profile</th>
                              <th className="border border-gray-200 p-3 w-[15%]">Current Tool Used</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent.detailedUseCases.industryUseCases?.map((u, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="border border-gray-200 p-3 font-black text-[#1A335E]">{u.rank}. {u.industry}</td>
                                <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed">{u.features}</td>
                                <td className="border border-gray-200 p-3 text-gray-800 leading-relaxed">{u.useCase}</td>
                                <td className="border border-gray-200 p-3 text-gray-600 font-medium italic">{u.profile}</td>
                                <td className="border border-gray-200 p-3 text-gray-500 font-medium">{u.currentTool}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">PART B — INTERNAL TEAMS: HOW EACH TEAM USES IT</div>
                      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[10px] bg-white text-left">
                          <thead>
                            <tr className="bg-[#4169E1] text-white font-black uppercase">
                              <th className="border border-gray-200 p-3 w-[15%]">Team Name</th>
                              <th className="border border-gray-200 p-3 w-[20%]">Relevant Features & Processes</th>
                              <th className="border border-gray-200 p-3 w-[35%]">How They Use It Day-to-Day</th>
                              <th className="border border-gray-200 p-3 w-[20%]">Primary Benefit to This Team</th>
                              <th className="border border-gray-200 p-3 w-[10%]">Frequency of Use</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent.detailedUseCases.internalTeamUseCases?.map((t, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="border border-gray-200 p-3 font-black text-[#1A335E] uppercase bg-gray-50/50">{t.team}</td>
                                <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed">{t.features}</td>
                                <td className="border border-gray-200 p-3 text-gray-800 leading-relaxed">{t.process}</td>
                                <td className="border border-gray-200 p-3 text-gray-600 font-medium italic">{t.benefit}</td>
                                <td className="border border-gray-200 p-3 text-gray-500 font-bold text-center">{t.frequency}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {!productData.extendedContent?.detailedUseCases && (
               <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                  Use Cases Data Coming Soon
               </div>
            )}
          </TabsContent>
          {/* 8. GTM Strategy */}
          <TabsContent value="gtm" className="space-y-10">
            {productData.excelLikeGtm ? (
              <div className="overflow-x-auto rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#CBD5E1] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#1f365d] text-white px-4 py-2 font-black uppercase tracking-tight text-[11px] text-center border border-[#173563]">
                      {productData.extendedContent?.detailedGTM?.sheet?.title || "Post Possession — Go-to-market Strategy"}
                    </div>

                    {productData.extendedContent?.detailedGTM?.sheet?.targetGroups?.length ? (
                      <div className="mt-3 flex gap-6">
                        {/* Left: sheet tables */}
                        <div className="w-[1180px] shrink-0 space-y-4">
                          {productData.extendedContent.detailedGTM.sheet.targetGroups.map((tg, tgIdx) => (
                            <div key={tgIdx} className="space-y-3">
                              <div className="border border-[#173563] bg-[#1f365d] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
                                {tg.title}
                              </div>

                              {tg.sections.map((sec, sIdx) => (
                                <div key={sIdx} className="bg-white border border-[#c4cad4]">
                                  <div className="border-b border-[#c4cad4] bg-[#e9edf5] px-3 py-1.5 text-[9px] font-black uppercase text-[#1f365d]">
                                    {sec.title}
                                  </div>
                                  <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                                    <thead>
                                      <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                                        {sec.columns.map((c, i) => (
                                          <th key={i} className="border border-[#b8c0cc] px-1.5 py-1 text-left">
                                            {c}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sec.rows.map((row, rIdx) => (
                                        <tr
                                          key={rIdx}
                                          className={`${rIdx % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"} hover:bg-[#f8fbff] align-top`}
                                        >
                                          {row.map((cell, cIdx) => (
                                            <td
                                              key={cIdx}
                                              className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words"
                                            >
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ))}

                              {(tg.summary || tg.keyAssumptions) && (
                                <div className="bg-white border border-[#c4cad4]">
                                  <div className="bg-[#1f365d] text-white px-3 py-1.5 text-[9px] font-black uppercase">
                                    TG Summary
                                  </div>
                                  <div className="p-3 text-[9px] text-[#0f172a] font-medium whitespace-pre-line">
                                    {tg.summary ? `SUMMARY:\n${tg.summary}\n\n` : ""}
                                    {tg.keyAssumptions ? `KEY ASSUMPTIONS:\n${tg.keyAssumptions}` : ""}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Right: blank grid area */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#CBD5E1] bg-white" />
                      </div>
                    ) : (
                      <div className="p-10 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[2rem] m-4">
                        GTM Strategy Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#1A335E] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase tracking-tight">{productData.name} - GTM Strategy</h2>
                </div>
                {productData.extendedContent?.detailedGTM && (
                  <div className="space-y-8">
                    {productData.extendedContent?.detailedGTM?.targetGroups?.map((group, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">{group.title}</div>
                        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                          <table className="w-full border-collapse text-[10px] bg-white text-center">
                            <thead>
                              <tr className="bg-[#4169E1] text-white font-black uppercase">
                                <th className="border border-gray-200 p-3 w-[25%]">Component</th>
                                <th className="border border-gray-200 p-3 text-left">Strategy/Detail</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.components.map((comp, cIdx) => (
                                <tr key={cIdx} className="hover:bg-gray-50 transition-colors">
                                  <td className="border border-gray-200 p-3 font-black text-[#1A335E] uppercase bg-gray-50/30">{comp.component}</td>
                                  <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed italic text-left">{comp.detail}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="bg-[#1A335E] text-white p-3 text-[10px] font-bold uppercase tracking-tight rounded-b-xl border border-t-0 border-gray-200 shadow-sm">
                          <span className="text-yellow-400">SUMMARY:</span> {group.summaryBox}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!productData.extendedContent?.detailedGTM && (
                  <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                    GTM Strategy Data Coming Soon
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* 9. Metrics */}
          <TabsContent value="metrics" className="space-y-10">
            {productData.excelLikeMetrics ? (
              <div className="overflow-x-auto rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#CBD5E1] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#1f365d] text-white px-4 py-2 font-black uppercase tracking-tight text-[11px] text-center border border-[#173563]">
                      {productData.extendedContent?.detailedMetrics?.sheet?.title || "Post Possession — Metrics"}
                    </div>

                    {productData.extendedContent?.detailedMetrics?.sheet?.sections?.length ? (
                      <div className="mt-3 flex gap-6">
                        {/* Left: sheet tables */}
                        <div className="w-[1180px] shrink-0 space-y-4">
                          {productData.extendedContent.detailedMetrics.sheet.sections.map((sec, sIdx) => {
                            const bar =
                              sec.tone === "red"
                                ? "bg-[#b91c1c]"
                                : "bg-[#1f365d]";
                            return (
                              <div key={sIdx} className="bg-white border border-[#c4cad4]">
                                <div className={`border border-[#173563] ${bar} px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white`}>
                                  {sec.title}
                                </div>
                                <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                                  <thead>
                                    <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                                      {sec.columns.map((c, i) => (
                                        <th key={i} className="border border-[#b8c0cc] px-1.5 py-1 text-left">
                                          {c}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sec.rows.map((row, rIdx) => (
                                      <tr
                                        key={rIdx}
                                        className={`${rIdx % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"} hover:bg-[#f8fbff] align-top`}
                                      >
                                        {row.map((cell, cIdx) => (
                                          <td
                                            key={cIdx}
                                            className="border border-[#c4cad4] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words"
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })}
                        </div>

                        {/* Right: blank grid */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#CBD5E1] bg-white" />
                      </div>
                    ) : productData.extendedContent?.detailedMetrics ? (
                      <div className="space-y-6 p-4">
                        {/* Section 1 */}
                        <div className="border border-[#c4cad4] bg-white">
                          <div className="border border-[#173563] bg-[#1f365d] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
                            Section 1 — Quantifiable Impact (Client / Efficiency / Savings)
                          </div>
                          <table className="w-full border-collapse text-[9px] leading-[1.25]">
                            <thead>
                              <tr className="font-black uppercase text-[8px] text-[#0f172a]">
                                <th className="border border-[#c4cad4] bg-[#e9edf5] px-2 py-2 w-[22%] text-left">Metric</th>
                                <th className="border border-[#c4cad4] bg-[#f3f4f6] px-2 py-2 w-[18%] text-center">Baseline</th>
                                <th className="border border-[#c4cad4] bg-[#eef2ff] px-2 py-2 w-[18%] text-center">With Product</th>
                                <th className="border border-[#c4cad4] bg-[#f8fafc] px-2 py-2 text-left">Claim</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productData.extendedContent.detailedMetrics.clientImpact?.map((m, i) => (
                                <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"} align-top hover:bg-[#f5f8ff] transition-colors`}>
                                  <td className="border border-[#c4cad4] px-2 py-2 font-black text-[#1f365d]">{m.metric}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-center text-[#b91c1c] font-bold">{m.baseline}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-center text-[#166534] font-black bg-[#ecfdf5]">{m.withSnag}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-[#0f172a] font-medium whitespace-pre-line">{m.claim}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Section 2 */}
                        <div className="border border-[#c4cad4] bg-white">
                          <div className="border border-[#173563] bg-[#1f365d] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
                            Section 2 — Business Targets (Internal Projections)
                          </div>
                          <table className="w-full border-collapse text-[9px] leading-[1.25]">
                            <thead>
                              <tr className="font-black uppercase text-[8px] text-[#0f172a]">
                                <th className="border border-[#c4cad4] bg-[#e9edf5] px-2 py-2 w-[20%] text-left">Metric</th>
                                <th className="border border-[#c4cad4] bg-[#f8fafc] px-2 py-2 w-[26%] text-left">Definition</th>
                                <th className="border border-[#c4cad4] bg-[#f3f4f6] px-2 py-2 w-[10%] text-center">D30 Current</th>
                                <th className="border border-[#c4cad4] bg-[#eef2ff] px-2 py-2 w-[10%] text-center">D30 Phase 1</th>
                                <th className="border border-[#c4cad4] bg-[#f3f4f6] px-2 py-2 w-[10%] text-center">M3 Current</th>
                                <th className="border border-[#c4cad4] bg-[#eef2ff] px-2 py-2 w-[10%] text-center">M3 Phase 1</th>
                                <th className="border border-[#c4cad4] bg-[#fff7ed] px-2 py-2 w-[14%] text-left">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productData.extendedContent.detailedMetrics.businessTargets?.map((t, i) => (
                                <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"} align-top hover:bg-[#f5f8ff] transition-colors`}>
                                  <td className="border border-[#c4cad4] px-2 py-2 font-black text-[#1f365d]">{t.metric}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-[#0f172a] font-medium">{t.definition}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-center text-[#334155] font-bold">{t.d30Current}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-center text-[#C72030] font-black bg-[#fff1f2]">{t.d30Phase1}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-center text-[#334155] font-bold">{t.m3Current}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-center text-[#C72030] font-black bg-[#fff1f2]">{t.m3Phase1}</td>
                                  <td className="border border-[#c4cad4] px-2 py-2 text-[#7c2d12] font-medium italic">—</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="p-10 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[2rem] m-4">
                        Performance Metrics Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#1A335E] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase tracking-tight">{productData.name} - Performance Metrics</h2>
                </div>
                {productData.extendedContent?.detailedMetrics && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic underline decoration-wavy underline-offset-4">Quantifiable Impact (Efficiency / Savings)</div>
                      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[10px] bg-white text-center">
                          <thead>
                            <tr className="bg-[#4169E1] text-white font-black uppercase">
                              <th className="border border-gray-200 p-3 w-[25%] text-left">Metric Domain</th>
                              <th className="border border-gray-200 p-3">Baseline (Traditional)</th>
                              <th className="border border-gray-200 p-3 bg-blue-50 text-blue-900 font-black">Digital Impact (Our System)</th>
                              <th className="border border-gray-200 p-3 text-left italic">Primary Claim</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent?.detailedMetrics?.clientImpact?.map((metric, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="border border-gray-200 p-3 font-black text-[#1A335E] uppercase text-left">{metric.metric}</td>
                                <td className="border border-gray-200 p-3 text-red-500 font-bold italic line-through decoration-red-500/30">{metric.baseline}</td>
                                <td className="border border-gray-200 p-3 text-green-600 font-black bg-green-50/20">{metric.withSnag}</td>
                                <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-tight text-left italic">{metric.claim}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-sm uppercase italic">Business Growth Targets (Internal Projection)</div>
                      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[10px] bg-white text-center">
                          <thead>
                            <tr className="bg-[#4169E1] text-white font-black uppercase">
                              <th className="border border-gray-200 p-3 text-left">Product Metric</th>
                              <th className="border border-gray-200 p-3">D30 Current</th>
                              <th className="border border-gray-200 p-3 font-black text-[#C72030] bg-[#C72030]/5">D30 Phase 1</th>
                              <th className="border border-gray-200 p-3">M3 Current</th>
                              <th className="border border-gray-200 p-3 font-black text-[#C72030] bg-[#C72030]/5">M3 Phase 1</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent?.detailedMetrics?.businessTargets?.map((target, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="border border-gray-200 p-3 font-black text-[#1A335E] uppercase text-left">{target.metric}</td>
                                <td className="border border-gray-200 p-3 text-gray-500 font-medium">{target.d30Current}</td>
                                <td className="border border-gray-200 p-3 text-[#C72030] font-black italic bg-[#C72030]/5">{target.d30Phase1}</td>
                                <td className="border border-gray-200 p-3 text-gray-500 font-medium">{target.m3Current}</td>
                                <td className="border border-gray-200 p-3 text-[#C72030] font-black italic bg-[#C72030]/5">{target.m3Phase1}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {!productData.extendedContent?.detailedMetrics && (
                  <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                    Performance Metrics Data Coming Soon
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* 10. SWOT Analysis */}
          <TabsContent value="swot" className="space-y-6 animate-fade-in">
            {productData.excelLikeSwot ? (
              <div className="overflow-x-auto rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#CBD5E1] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#1f365d] text-white px-4 py-2 font-black uppercase tracking-tight text-[11px] text-center border border-[#173563]">
                      Post Sales - SWOT Analysis
                    </div>

                    {productData.extendedContent?.detailedSWOT ? (
                      <div
                        className="mt-3 flex gap-6"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)",
                          backgroundSize: "34px 24px",
                        }}
                      >
                        {/* Left: SWOT sheet (matches screenshot layout) */}
                        <div className="w-[980px] shrink-0 bg-white border border-[#c4cad4]">
                          <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                            <thead>
                              <tr className="bg-[#1f365d] text-white">
                                <th className="border border-[#9ca3af] px-2 py-1.5 text-left font-black uppercase" colSpan={6}>
                                  Post Possession — SWOT Analysis
                                </th>
                              </tr>
                              <tr className="font-black uppercase text-[8px] text-[#183153]">
                                <th className="border border-[#b8c0cc] bg-[#E9F3D8] px-2 py-1 text-left" colSpan={3}>
                                  Strengths (Internal / Positive)
                                </th>
                                <th className="border border-[#b8c0cc] bg-[#FAE5CC] px-2 py-1 text-left" colSpan={3}>
                                  Weaknesses (Internal / Negative)
                                </th>
                              </tr>
                              <tr className="font-black uppercase text-[8px] text-[#0f172a]">
                                <th className="border border-[#c4cad4] bg-[#F1F5F9] px-1 py-1 text-center w-[6%]">ID</th>
                                <th className="border border-[#c4cad4] bg-[#E9F3D8] px-1.5 py-1 text-left w-[20%]">Strength</th>
                                <th className="border border-[#c4cad4] bg-[#E9F3D8] px-1.5 py-1 text-left w-[24%]">Detail at market</th>
                                <th className="border border-[#c4cad4] bg-[#F1F5F9] px-1 py-1 text-center w-[6%]">ID</th>
                                <th className="border border-[#c4cad4] bg-[#FAE5CC] px-1.5 py-1 text-left w-[20%]">Weakness</th>
                                <th className="border border-[#c4cad4] bg-[#FAE5CC] px-1.5 py-1 text-left w-[24%]">Detail at market</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from(
                                {
                                  length: Math.max(
                                    productData.extendedContent.detailedSWOT.strengths.length,
                                    productData.extendedContent.detailedSWOT.weaknesses.length
                                  ),
                                },
                                (_, i) => i
                              ).map((i) => {
                                const s = productData.extendedContent.detailedSWOT.strengths[i];
                                const w = productData.extendedContent.detailedSWOT.weaknesses[i];
                                const zebra = i % 2 === 0 ? "bg-white" : "bg-[#fafafa]";
                                return (
                                  <tr key={`sw-${i}`} className={`align-top ${zebra} hover:bg-[#f8fbff] transition-colors`}>
                                    <td className="border border-[#c4cad4] bg-[#F8FAFC] px-1 py-1 text-center font-black text-[8px] text-[#334155]">
                                      {s ? `S${i + 1}` : ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#E9F3D8] px-1.5 py-1 font-black text-[#0f172a] break-words">
                                      {s?.headline ?? ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#E9F3D8] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {s?.explanation ?? ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#F8FAFC] px-1 py-1 text-center font-black text-[8px] text-[#334155]">
                                      {w ? `W${i + 1}` : ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#FAE5CC] px-1.5 py-1 font-black text-[#0f172a] break-words">
                                      {w?.headline ?? ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#FAE5CC] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {w?.explanation ?? ""}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed mt-3">
                            <thead>
                              <tr className="font-black uppercase text-[8px] text-[#183153]">
                                <th className="border border-[#b8c0cc] bg-[#DFEDFA] px-2 py-1 text-left" colSpan={3}>
                                  Opportunities (External / Positive)
                                </th>
                                <th className="border border-[#b8c0cc] bg-[#FFF3C5] px-2 py-1 text-left" colSpan={3}>
                                  Threats (External / Negative)
                                </th>
                              </tr>
                              <tr className="font-black uppercase text-[8px] text-[#0f172a]">
                                <th className="border border-[#c4cad4] bg-[#F1F5F9] px-1 py-1 text-center w-[6%]">ID</th>
                                <th className="border border-[#c4cad4] bg-[#DFEDFA] px-1.5 py-1 text-left w-[20%]">Opportunity</th>
                                <th className="border border-[#c4cad4] bg-[#DFEDFA] px-1.5 py-1 text-left w-[24%]">Detail & how to</th>
                                <th className="border border-[#c4cad4] bg-[#F1F5F9] px-1 py-1 text-center w-[6%]">ID</th>
                                <th className="border border-[#c4cad4] bg-[#FFF3C5] px-1.5 py-1 text-left w-[20%]">Threat</th>
                                <th className="border border-[#c4cad4] bg-[#FFF3C5] px-1.5 py-1 text-left w-[24%]">Detail & mitigation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from(
                                {
                                  length: Math.max(
                                    productData.extendedContent.detailedSWOT.opportunities.length,
                                    productData.extendedContent.detailedSWOT.threats.length
                                  ),
                                },
                                (_, i) => i
                              ).map((i) => {
                                const o = productData.extendedContent.detailedSWOT.opportunities[i];
                                const t = productData.extendedContent.detailedSWOT.threats[i];
                                const zebra = i % 2 === 0 ? "bg-white" : "bg-[#fafafa]";
                                return (
                                  <tr key={`ot-${i}`} className={`align-top ${zebra} hover:bg-[#f8fbff] transition-colors`}>
                                    <td className="border border-[#c4cad4] bg-[#F8FAFC] px-1 py-1 text-center font-black text-[8px] text-[#334155]">
                                      {o ? `O${i + 1}` : ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#DFEDFA] px-1.5 py-1 font-black text-[#0f172a] break-words">
                                      {o?.headline ?? ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#DFEDFA] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {o?.explanation ?? ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#F8FAFC] px-1 py-1 text-center font-black text-[8px] text-[#334155]">
                                      {t ? `T${i + 1}` : ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#FFF3C5] px-1.5 py-1 font-black text-[#0f172a] break-words">
                                      {t?.headline ?? ""}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#FFF3C5] px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {t?.explanation ?? ""}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Right: blank grid area like the sheet */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#CBD5E1] bg-white" />
                      </div>
                    ) : (
                      <div className="p-10 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[2rem] m-4">
                        SWOT Analysis Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 shadow-2xl p-4 bg-white border border-gray-100 rounded-xl">
                <div className="bg-[#1A335E] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center shadow-md">
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">Strategic SWOT Analysis Matrix</h2>
                </div>
                {productData.extendedContent?.detailedSWOT && (
                  <div className="border border-gray-300 rounded-b-xl overflow-hidden bg-white">
                    <div className="bg-[#E7F0FC] text-center text-[11px] italic p-2 border-b border-gray-300 text-gray-700 font-medium">
                      Grounded in product features, market context, and competitor landscape. Not generic.
                    </div>

                    <div className="flex flex-col md:flex-row border-b border-gray-300">
                      <div className="w-full md:w-1/2 flex flex-col bg-[#E9F3D8] border-b md:border-b-0 md:border-r border-gray-300">
                        <div className="text-center font-black text-[#5C8930] p-3 text-lg tracking-widest border-b border-white/50 uppercase">STRENGTHS</div>
                        <div className="p-4 space-y-6">
                          {productData.extendedContent.detailedSWOT.strengths.map((item, i) => (
                            <div key={i} className="text-[11px]">
                              <span className="font-bold text-black block mb-1">S{i + 1} {item.headline}</span>
                              <p className="text-gray-800 leading-relaxed font-medium">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col bg-[#FAE5CC]">
                        <div className="text-center font-black text-[#A65B20] p-3 text-lg tracking-widest border-b border-white/50 uppercase">WEAKNESSES</div>
                        <div className="p-4 space-y-6">
                          {productData.extendedContent.detailedSWOT.weaknesses.map((item, i) => (
                            <div key={i} className="text-[11px]">
                              <span className="font-bold text-black block mb-1">W{i + 1} {item.headline}</span>
                              <p className="text-gray-800 leading-relaxed font-medium">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/2 flex flex-col bg-[#DFEDFA] border-b md:border-b-0 md:border-r border-gray-300">
                        <div className="text-center font-black text-[#4076B0] p-3 text-lg tracking-widest border-b border-white/50 uppercase">OPPORTUNITIES</div>
                        <div className="p-4 space-y-6">
                          {productData.extendedContent.detailedSWOT.opportunities.map((item, i) => (
                            <div key={i} className="text-[11px]">
                              <span className="font-bold text-black block mb-1">O{i + 1} {item.headline}</span>
                              <p className="text-gray-800 leading-relaxed font-medium">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col bg-[#FFF3C5]">
                        <div className="text-center font-black text-[#A08821] p-3 text-lg tracking-widest border-b border-white/50 uppercase">THREATS</div>
                        <div className="p-4 space-y-6">
                          {productData.extendedContent.detailedSWOT.threats.map((item, i) => (
                            <div key={i} className="text-[11px]">
                              <span className="font-bold text-black block mb-1">T{i + 1} {item.headline}</span>
                              <p className="text-gray-800 leading-relaxed font-medium">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!productData.extendedContent?.detailedSWOT && (
                  <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                    SWOT Analysis Data Coming Soon
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* 6. Roadmap */}
          <TabsContent value="roadmap" className="space-y-12 animate-fade-in">
            {productData.excelLikeRoadmap ? (
              <div className="overflow-x-auto rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#CBD5E1] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#1f365d] text-white px-4 py-2 font-black uppercase tracking-tight text-[11px] text-center border border-[#173563]">
                      Post Possession — Product Roadmap (Prioritized by Market Gap, Competitive Weakness & Product Goals)
                    </div>

                    {productData.extendedContent?.detailedRoadmap?.structuredRoadmap?.length ? (
                      <div className="mt-3 flex gap-6">
                        {/* Left: Roadmap sheet table */}
                        <div className="w-[1180px] shrink-0 bg-white border border-[#c4cad4]">
                          {(() => {
                            const sections = productData.extendedContent!.detailedRoadmap!.structuredRoadmap!;
                            const hasPriority = sections.some((s) => s.items.some((it) => it.priority || it.impact));

                            // Default to the screenshot-style table when priority/impact are present
                            if (hasPriority) {
                              let rowNo = 1;
                              return (
                                <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                                  <thead>
                                    <tr className="bg-[#1f365d] text-white">
                                      <th className="border border-[#9ca3af] px-2 py-1.5 text-left font-black uppercase" colSpan={7}>
                                        Post Possession — Product Roadmap
                                      </th>
                                    </tr>
                                    <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                                      <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[4%]">#</th>
                                      <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[20%]">Initiative</th>
                                      <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[28%]">Stop losing deals we should be winning</th>
                                      <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[18%]">Customer segment unlocked</th>
                                      <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[12%]">Effort estimate</th>
                                      <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[10%]">Impact</th>
                                      <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[8%]">Priority</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sections.flatMap((section, sIdx) => {
                                      const band =
                                        section.colorContext === "red"
                                          ? { bar: "bg-[#7f1d1d]", row: "bg-[#FCE6E6]" }
                                          : section.colorContext === "yellow"
                                            ? { bar: "bg-[#c2410c]", row: "bg-[#FFF1D6]" }
                                            : section.colorContext === "blue"
                                              ? { bar: "bg-[#1d4ed8]", row: "bg-[#DBEAFE]" }
                                              : { bar: "bg-[#1E5631]", row: "bg-[#EBF3E8]" };

                                      const headerRow = (
                                        <tr key={`band-${sIdx}`}>
                                          <td className="border border-[#c4cad4] bg-[#F8FAFC] px-1 py-1 text-center font-black text-[8px] text-[#334155]">
                                            {rowNo++}
                                          </td>
                                          <td className={`border border-[#c4cad4] ${band.bar} text-white px-2 py-1 font-black uppercase text-[8px] tracking-wide`} colSpan={6}>
                                            {section.timeframe} — {section.headline}
                                          </td>
                                        </tr>
                                      );

                                      const rows = section.items.map((item, iIdx) => {
                                        const zebra = iIdx % 2 === 0 ? "bg-white" : "bg-[#fafafa]";
                                        return (
                                          <tr key={`r-${sIdx}-${iIdx}`} className={`align-top hover:bg-[#f8fbff] transition-colors ${zebra}`}>
                                            <td className="border border-[#c4cad4] bg-[#F8FAFC] px-1 py-1 text-center font-bold text-[#6b7280]">
                                              {rowNo++}
                                            </td>
                                            <td className={`border border-[#c4cad4] ${band.row} px-1.5 py-1 font-black text-[#0f172a] break-words`}>
                                              {item.whatItIs}
                                            </td>
                                            <td className={`border border-[#c4cad4] ${band.row} px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words`}>
                                              {item.whyItMatters}
                                            </td>
                                            <td className={`border border-[#c4cad4] ${band.row} px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words`}>
                                              {item.unlockedSegment}
                                            </td>
                                            <td className={`border border-[#c4cad4] ${band.row} px-1 py-1 text-center font-bold text-[#0f172a] whitespace-pre-line`}>
                                              {item.effort}
                                            </td>
                                            <td className={`border border-[#c4cad4] ${band.row} px-1 py-1 text-center font-black text-[#0f172a]`}>
                                              {item.impact ?? item.owner}
                                            </td>
                                            <td className={`border border-[#c4cad4] ${band.row} px-1 py-1 text-center font-black text-[#0f172a]`}>
                                              {item.priority ?? ""}
                                            </td>
                                          </tr>
                                        );
                                      });

                                      return [headerRow, ...rows];
                                    })}
                                  </tbody>
                                </table>
                              );
                            }

                            // Fallback to original structured table
                            return (
                              <div className="p-4">
                                <table className="w-full border-collapse text-[9px] leading-[1.25] text-left">
                                  <thead>
                                    <tr className="font-black uppercase text-[8px] text-[#0f172a]">
                                      <th className="border border-[#c4cad4] bg-[#e9edf5] px-2 py-2 w-[8%]">Phase / Timeline</th>
                                      <th className="border border-[#c4cad4] bg-[#f3f4f6] px-2 py-2 w-[18%]">What It Is</th>
                                      <th className="border border-[#c4cad4] bg-[#eef2ff] px-2 py-2 w-[22%]">Why It Matters</th>
                                      <th className="border border-[#c4cad4] bg-[#f8fafc] px-2 py-2 w-[22%]">Unlocked Segment</th>
                                      <th className="border border-[#c4cad4] bg-[#fff7ed] px-2 py-2 w-[12%] text-center">Effort</th>
                                      <th className="border border-[#c4cad4] bg-[#fefce8] px-2 py-2 w-[10%] text-center">Owner</th>
                                      <th className="border border-[#c4cad4] bg-[#f8fafc] px-2 py-2 w-[8%] text-center">Theme</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sections.flatMap((section, sIdx) => {
                                      const tone =
                                        section.colorContext === "red"
                                          ? { bg: "bg-[#FCE6E6]", badge: "bg-red-50 text-red-700 border-red-200" }
                                          : section.colorContext === "yellow"
                                            ? { bg: "bg-[#FFF7D6]", badge: "bg-yellow-50 text-yellow-800 border-yellow-200" }
                                            : section.colorContext === "blue"
                                              ? { bg: "bg-[#DBEAFE]", badge: "bg-blue-50 text-blue-700 border-blue-200" }
                                              : { bg: "bg-[#EBF3E8]", badge: "bg-green-50 text-green-800 border-green-200" };

                                      return section.items.map((item, iIdx) => (
                                        <tr
                                          key={`${sIdx}-${iIdx}`}
                                          className={`align-top hover:bg-[#f5f8ff] transition-colors ${iIdx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}
                                        >
                                          <td className={`border border-[#c4cad4] px-2 py-2 font-black text-[#1f365d] ${tone.bg}`}>
                                            <div className="text-[8px] uppercase">{section.timeframe}</div>
                                            <div className="text-[9px] font-black">{section.headline}</div>
                                          </td>
                                          <td className="border border-[#c4cad4] px-2 py-2 font-semibold text-[#0f172a] whitespace-pre-line">
                                            {item.whatItIs}
                                          </td>
                                          <td className="border border-[#c4cad4] px-2 py-2 font-medium text-[#111827] whitespace-pre-line">
                                            {item.whyItMatters}
                                          </td>
                                          <td className="border border-[#c4cad4] px-2 py-2 font-medium text-[#0f172a] whitespace-pre-line">
                                            {item.unlockedSegment}
                                          </td>
                                          <td className="border border-[#c4cad4] px-2 py-2 text-center font-black text-[#92400e] whitespace-pre-line">
                                            {item.effort}
                                          </td>
                                          <td className="border border-[#c4cad4] px-2 py-2 text-center font-bold text-[#0f172a] whitespace-pre-line">
                                            {item.owner}
                                          </td>
                                          <td className="border border-[#c4cad4] px-2 py-2 text-center">
                                            <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase border ${tone.badge}`}>
                                              {section.colorContext}
                                            </span>
                                          </td>
                                        </tr>
                                      ));
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Right: blank grid area like the sheet */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#CBD5E1] bg-white" />
                      </div>
                    ) : (
                      <div className="p-10 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[2rem] m-4">
                        Product Roadmap Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#1A335E] text-white p-6 rounded-t-xl mb-0 flex flex-col justify-start items-start gap-2 shadow-inner border border-white/10">
                <h2 className="text-2xl font-black uppercase tracking-tight italic underline decoration-blue-400/50 underline-offset-8">{productData.name} - Strategic Roadmap</h2>
                <div className="flex items-center gap-2 bg-blue-400/20 px-3 py-1 rounded text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200">
                  Future Evolution Matrix | FY 2026-28
                </div>
              </div>
            )}

             {/* 1. Structured Timeline Roadmap */}
             {productData.extendedContent?.detailedRoadmap?.structuredRoadmap && (
                <div className="space-y-8">
                   {productData.extendedContent.detailedRoadmap.structuredRoadmap.map((section, idx) => {
                      const bgHeader = section.colorContext === 'red' ? 'bg-[#CC0000]' : section.colorContext === 'yellow' ? 'bg-[#B09A0A]' : 'bg-[#1E5631]';
                      const bgRow = section.colorContext === 'red' ? 'bg-[#FCE6E6]' : section.colorContext === 'yellow' ? 'bg-[#FFF7D6]' : 'bg-[#EBF3E8]';
                      const textHeader = 'text-white';
                      return (
                         <div key={idx} className="border border-gray-300 shadow-xl overflow-hidden rounded-md">
                            <div className={`${bgHeader} ${textHeader} px-4 py-2 font-black text-sm uppercase tracking-wider`}>
                               {section.timeframe} — {section.headline}
                            </div>
                            <div className="overflow-x-auto">
                               <table className="w-full border-collapse text-[11px] bg-white text-left">
                                  <thead>
                                     <tr className={`${bgHeader} ${textHeader} font-bold text-xs uppercase text-left`}>
                                        <th className="border-t border-b border-white/30 p-3 w-[15%]">What It Is</th>
                                        <th className="border-t border-b border-white/30 p-3 w-[25%]">Why It Matters</th>
                                        <th className="border-t border-b border-white/30 p-3 w-[25%]">Which Customer Segment It Unlocks</th>
                                        <th className="border-t border-b border-white/30 p-3 w-[20%]">Effort Estimate</th>
                                        <th className="border-t border-b border-white/30 p-3 w-[15%]">Owner</th>
                                     </tr>
                                  </thead>
                                  <tbody>
                                     {section.items.map((item, i) => (
                                        <tr key={i} className={`${bgRow} border-b border-black/10 last:border-0 hover:brightness-95 transition-all`}>
                                           <td className="p-3 text-gray-900 font-bold leading-relaxed">{item.whatItIs}</td>
                                           <td className="p-3 text-gray-800 font-medium leading-relaxed">{item.whyItMatters}</td>
                                           <td className="p-3 text-gray-800 font-medium leading-relaxed">{item.unlockedSegment}</td>
                                           <td className="p-3 text-gray-700 leading-relaxed italic">{item.effort}</td>
                                           <td className="p-3 text-gray-900 font-bold">{item.owner}</td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>
                         </div>
                      );
                   })}
                </div>
             )}

             {/* 2. Legacy Phases Roadmap */}
             {productData.extendedContent?.detailedRoadmap?.phases && (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                   <table className="w-full border-collapse text-[10px] bg-white">
                      <thead>
                        <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                          <th className="border border-gray-200 p-3 w-[15%]">Phase</th>
                          <th className="border border-gray-200 p-3 w-[15%] text-left">Initiative</th>
                          <th className="border border-gray-200 p-3 w-[25%] text-left">Feature / Capability</th>
                          <th className="border border-gray-200 p-3 w-[15%] text-left">Target Segment Unlocked</th>
                          <th className="border border-gray-200 p-3 w-[20%] text-left">Business Impact</th>
                          <th className="border border-gray-200 p-3 w-[10%]">Est. Timeline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.extendedContent?.detailedRoadmap?.phases?.map((phase, pIdx) => (
                          <React.Fragment key={pIdx}>
                            {phase.initiatives.map((item, iIdx) => (
                              <tr key={iIdx} className="hover:bg-gray-100 transition-colors">
                                {iIdx === 0 && (
                                  <td className="border border-gray-200 p-4 font-black text-[#1A335E] uppercase bg-gray-50/50 align-top" rowSpan={phase.initiatives.length}>
                                    {phase.title}
                                  </td>
                                )}
                                <td className="border border-gray-200 p-3 text-gray-900 font-bold uppercase">{item.initiative}</td>
                                <td className="border border-gray-200 p-3 text-gray-600 font-medium leading-relaxed italic">{item.feature || '-'}</td>
                                <td className="border border-gray-200 p-3 text-blue-800 font-black tracking-tight">{item.segment || '-'}</td>
                                <td className="border border-gray-200 p-3 text-gray-900 font-black leading-tight italic">{item.impact}</td>
                                <td className="border border-gray-200 p-3 text-center font-black text-[#C72030] bg-gray-50/20">{item.timeline}</td>
                              </tr>
                            ))}
                            {phase.summary && (
                              <tr className="bg-[#1A335E] text-white font-black italic tracking-tighter uppercase">
                                <td colSpan={6} className="p-3 text-[9px] border border-[#1A335E]">
                                  {phase.summary}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                   </table>
                </div>
             )}

             {/* 3. Innovation Layer Detail */}
             {productData.extendedContent?.detailedRoadmap?.innovationLayer && (
                <div className="space-y-4">
                   <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-xs uppercase italic tracking-wider">Full Innovation Roadmap Detail</div>
                   <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[9px] bg-white">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                            <th className="border border-gray-200 p-2 w-[3%]">#</th>
                            <th className="border border-gray-200 p-2 w-[15%] text-left">Enhancement Name</th>
                            <th className="border border-gray-200 p-2 w-[10%] text-left">Category</th>
                            <th className="border border-gray-200 p-2 w-[25%] text-left">Description</th>
                            <th className="border border-gray-200 p-2 w-[25%] text-left">Business Value</th>
                            <th className="border border-gray-200 p-2 w-[12%] text-left">Competitor Leapfrogged</th>
                            <th className="border border-gray-200 p-2 w-[10%]">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedRoadmap.innovationLayer.map((item, idx) => (
                            <tr key={idx} className={`hover:bg-gray-50 transition-colors ${item.priority === 'High Impact' ? 'bg-blue-50/20' : ''}`}>
                              <td className="border border-gray-200 p-2 font-black text-[#1A335E] text-center bg-gray-50/30">{item.id}</td>
                              <td className="border border-gray-200 p-2 text-gray-900 font-black uppercase">{item.name}</td>
                              <td className="border border-gray-200 p-2 text-gray-500 font-bold italic uppercase tracking-tighter">{item.category}</td>
                              <td className="border border-gray-200 p-2 text-gray-700 font-medium leading-tight">{item.description}</td>
                              <td className="border border-gray-200 p-2 text-gray-900 font-bold leading-tight">{item.value}</td>
                              <td className="border border-gray-200 p-2 text-blue-800 font-extrabold uppercase tracking-tighter">{item.leapfrog}</td>
                              <td className="border border-gray-200 p-2 text-center">
                                 <span className={`px-2 py-1 rounded-full font-black uppercase text-[7px] ${item.priority === 'High Impact' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                   {item.priority}
                                 </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
             )}

             {/* Empty State */}
             {!productData.extendedContent?.detailedRoadmap && (
                <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                   Product Roadmap Data Coming Soon
                </div>
             )}
          </TabsContent>

          {/* 11. Enhancement Matrix */}
          <TabsContent value="enhancements" className="space-y-12 animate-fade-in">
             <div className="bg-[#1A335E] text-white p-6 rounded-t-xl mb-0 flex flex-col justify-start items-start gap-2 shadow-inner border border-white/10">
                <h2 className="text-2xl font-black uppercase tracking-tight italic underline decoration-blue-400/50 underline-offset-8">{productData.name} - Enhancement Matrix</h2>
                <div className="flex items-center gap-2 bg-blue-400/20 px-3 py-1 rounded text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200">
                   Legacy to AI Transformation | FY 2026-28
                </div>
             </div>

             {/* 1. High-Impact Enhancements Matrix */}
             {productData.extendedContent?.detailedRoadmap?.enhancementRoadmap && (
                <div className="space-y-4">
                   <div
                     className="overflow-x-auto border border-[#c8ced8] bg-[#f8fafc] p-2 rounded-xl shadow-lg"
                     style={{
                       backgroundImage:
                         "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                       backgroundSize: "34px 24px",
                     }}
                   >
                     <div className="min-w-[1850px] bg-transparent">
                       <div className="mt-2 flex gap-6">
                         <div className="w-[1180px] shrink-0 bg-white border border-[#c4cad4]">
                           <div className="bg-[#1f365d] text-white px-4 py-2 font-black uppercase tracking-tight text-[11px] text-center border-b border-[#173563]">
                             Post Possession — Enhancement Roadmap (Features, Status, Tech, Effort, Impact, Priority, Owner)
                           </div>
                           <table className="w-full border-collapse text-[9px] leading-[1.15] text-left table-fixed">
                         <thead>
                           <tr className="font-black uppercase text-[8px] text-[#0f172a]">
                             <th className="border border-[#c4cad4] bg-[#e9edf5] px-1 py-1 w-[4%] text-center">#</th>
                             <th className="border border-[#c4cad4] bg-[#e9edf5] px-1.5 py-1 w-[16%]">Feature name</th>
                             <th className="border border-[#c4cad4] bg-[#f3f4f6] px-1.5 py-1 w-[18%]">What it’s currently like</th>
                             <th className="border border-[#c4cad4] bg-[#eef2ff] px-1.5 py-1 w-[22%]">Enhanced version</th>
                             <th className="border border-[#c4cad4] bg-[#f8fafc] px-1 py-1 w-[10%] text-center">Integration type</th>
                             <th className="border border-[#c4cad4] bg-[#fefce8] px-1 py-1 w-[7%] text-center">Effort</th>
                             <th className="border border-[#c4cad4] bg-[#fff7ed] px-1 py-1 w-[7%] text-center">Impact</th>
                             <th className="border border-[#c4cad4] bg-[#eef2ff] px-1 py-1 w-[6%] text-center">Priority</th>
                             <th className="border border-[#c4cad4] bg-[#f8fafc] px-1 py-1 w-[10%] text-center">Owner</th>
                           </tr>
                         </thead>
                         <tbody>
                           {productData.extendedContent.detailedRoadmap.enhancementRoadmap.map((item, idx) => (
                             <tr
                               key={idx}
                               className={`${idx % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"} align-top hover:bg-[#f5f8ff] transition-colors`}
                             >
                               <td className="border border-[#c4cad4] px-1 py-1 font-black text-center text-[#1f365d]">
                                 {idx + 1}
                               </td>
                               <td className="border border-[#c4cad4] px-1.5 py-1 font-black text-[#1f365d] break-words">
                                 {item.featureName}
                               </td>
                               <td className="border border-[#c4cad4] px-1.5 py-1 text-[#111827] font-medium whitespace-pre-line break-words">
                                 {item.currentStatus}
                               </td>
                               <td className="border border-[#c4cad4] px-1.5 py-1 text-[#111827] font-semibold whitespace-pre-line break-words">
                                 {item.enhancedVersion}
                               </td>
                               <td className="border border-[#c4cad4] px-1 py-1 text-center text-[#334155] font-bold text-[8px] uppercase whitespace-pre-line break-words">
                                 {item.integrationType}
                               </td>
                               <td className="border border-[#c4cad4] px-1 py-1 text-center font-black text-[#92400e]">
                                 {item.effort}
                               </td>
                               <td className="border border-[#c4cad4] px-1 py-1 text-center font-black text-[#7c2d12]">
                                 {item.impact}
                               </td>
                               <td className="border border-[#c4cad4] px-1 py-1 text-center font-black text-[#0f172a]">
                                 {item.priority}
                               </td>
                               <td className="border border-[#c4cad4] px-1 py-1 text-center font-bold text-[#0f172a] whitespace-pre-line break-words">
                                 {item.owner}
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                         </div>

                         <div className="flex-1 min-w-[650px] rounded-sm border border-[#CBD5E1] bg-white" />
                       </div>
                     </div>
                   </div>
                </div>
             )}

             {/* 2. Top 5 Summary */}
             {productData.extendedContent?.detailedRoadmap?.top5Impact && (
                <div className="space-y-4">
                   <div className="bg-[#1A335E] text-white px-4 py-2 font-bold text-xs uppercase italic tracking-wider">Top 5 Highest-Impact Enhancements Summary</div>
                   <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white">
                        <thead>
                          <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                            <th className="border border-gray-200 p-2 w-[5%]">Rank</th>
                            <th className="border border-gray-200 p-2 w-[25%] text-left">Enhancement</th>
                            <th className="border border-gray-200 p-2 w-[45%] text-left">Why It Matters Most</th>
                            <th className="border border-gray-200 p-2 w-[25%] text-left">Competitor It Leapfrogs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedRoadmap.top5Impact.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 p-3 font-black text-[#1A335E] text-center bg-gray-50/30">{item.rank}</td>
                              <td className="border border-gray-200 p-3 text-gray-900 font-black uppercase">{item.name}</td>
                              <td className="border border-gray-200 p-3 text-gray-700 font-bold leading-relaxed">{item.logic}</td>
                              <td className="border border-gray-200 p-3 text-blue-800 font-black uppercase tracking-tighter">{item.leapfrog}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
             )}

             {/* 3. Strategic Enhancements (Alternative Format) */}
             {productData.extendedContent?.detailedEnhancements && (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-2xl">
                   <table className="w-full border-collapse text-[10px] bg-white text-center">
                     <thead>
                       <tr className="bg-[#1A335E] text-white font-black uppercase text-center border-b border-white/10">
                         <th className="border border-gray-200/50 p-4 w-[12%] italic">Timeline</th>
                         <th className="border border-gray-200/50 p-4 w-[18%]">Strategic Focus</th>
                         <th className="border border-gray-200/50 p-4 w-[40%] text-left">Key Features / Innovation</th>
                         <th className="border border-gray-200/50 p-4 w-[15%]">Business Logic</th>
                         <th className="border border-gray-200/50 p-4 w-[15%]">Core Benefit</th>
                       </tr>
                     </thead>
                     <tbody>
                       {productData.extendedContent?.detailedEnhancements?.roadmap?.map((row, i) => (
                         <tr key={i} className="hover:bg-blue-50/30 transition-all border-b border-gray-100 last:border-0">
                           <td className="border border-gray-200/50 p-4 font-black text-[#C72030] bg-gray-50/50 uppercase tracking-tighter">{row.period}</td>
                           <td className="border border-gray-200/50 p-4 text-[#1A335E] font-black uppercase text-[9px] leading-tight">{row.focus}</td>
                           <td className="border border-gray-200/50 p-4 text-gray-700 font-semibold leading-relaxed text-left">
                              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400 shadow-sm font-medium italic">
                                 {row.features}
                              </div>
                           </td>
                           <td className="border border-gray-200/50 p-4 text-gray-600 font-bold uppercase text-[8px] leading-tight italic bg-gray-50/30">{row.logic}</td>
                           <td className="border border-gray-200/50 p-4 text-green-700 font-black uppercase text-[9px] tracking-tight">{row.risk}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             )}

             {/* Empty State */}
             {!productData.extendedContent?.detailedRoadmap?.enhancementRoadmap && !productData.extendedContent?.detailedEnhancements && (
                <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                   Enhancement Matrix Data Coming Soon
                </div>
             )}
          </TabsContent>

          {/* 7. Business Plan */}
          <TabsContent value="business" className="space-y-10">
            {productData.excelLikeBusinessPlan ? (
              <div className="overflow-x-auto rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#CBD5E1] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#1f365d] text-white px-4 py-2 font-black uppercase tracking-tight text-[11px] text-center border border-[#173563]">
                      Post Possession — Business Plan Builder (Pre-filled)
                    </div>

                    {productData.extendedContent?.detailedBusinessPlan?.planQuestions?.length ? (
                      <div className="mt-3 flex gap-6">
                        {/* Left: sheet table */}
                        <div className="w-[1180px] shrink-0 bg-white border border-[#c4cad4]">
                          <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed">
                            <thead>
                              <tr className="bg-[#dbe8f7] text-[#183153] font-black uppercase">
                                <th className="border border-[#b8c0cc] px-1 py-1 text-center w-[5%]">#</th>
                                <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[23%]">Business plan question</th>
                                <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[46%]">Suggested answer</th>
                                <th className="border border-[#b8c0cc] px-1 py-1 text-left w-[12%]">Sources</th>
                                <th className="border border-[#b8c0cc] px-1.5 py-1 text-left w-[14%]">Founder review</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productData.extendedContent.detailedBusinessPlan.planQuestions.map((q, i) => {
                                const statusTone = q.flag?.toLowerCase().includes("ready")
                                  ? "bg-green-50 text-green-800 border-green-200"
                                  : "bg-yellow-50 text-yellow-900 border-yellow-200";

                                const toneBg =
                                  i % 5 === 0
                                    ? "bg-[#E9F3D8]"
                                    : i % 5 === 1
                                      ? "bg-[#FAE5CC]"
                                      : i % 5 === 2
                                        ? "bg-[#DFEDFA]"
                                        : i % 5 === 3
                                          ? "bg-[#EDE9FE]"
                                          : "bg-[#FFF3C5]";

                                return (
                                  <tr key={i} className="align-top hover:bg-[#f8fbff] transition-colors">
                                    <td className="border border-[#c4cad4] bg-[#F8FAFC] px-1 py-1 text-center font-bold text-[#6b7280]">
                                      {i + 1}
                                    </td>
                                    <td className={`border border-[#c4cad4] ${toneBg} px-1.5 py-1 font-black text-[#0f172a] whitespace-pre-line break-words`}>
                                      {q.question}
                                      {q.flag ? (
                                        <div className="mt-1">
                                          <span className={`inline-block px-1.5 py-0.5 text-[8px] font-black uppercase border ${statusTone}`}>
                                            {q.flag}
                                          </span>
                                        </div>
                                      ) : null}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-white px-1.5 py-1 text-[#0f172a] font-medium whitespace-pre-line break-words">
                                      {q.answer}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-white px-1.5 py-1 text-[#334155] font-medium whitespace-pre-line break-words">
                                      {"-"}
                                    </td>
                                    <td className="border border-[#c4cad4] bg-[#f0fdf4] px-1.5 py-1 text-[#166534] font-medium whitespace-pre-line break-words">
                                      {"-"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Right: blank grid */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#CBD5E1] bg-white" />
                      </div>
                    ) : (
                      <div className="p-10 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[2rem] m-4">
                        Business Plan Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#1A335E] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase tracking-tight">{productData.name} - Business Plan</h2>
                </div>
                {productData.extendedContent?.detailedBusinessPlan && (
                  <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
                    <table className="w-full border-collapse text-[10px] bg-white">
                      <thead>
                        <tr className="bg-[#4169E1] text-white font-black uppercase text-center">
                          <th className="border border-gray-200 p-3 w-[25%] text-left">Question</th>
                          <th className="border border-gray-200 p-3 w-[60%] text-left">Suggested Answer</th>
                          <th className="border border-gray-200 p-3 w-[15%]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.extendedContent?.detailedBusinessPlan?.planQuestions?.map((q, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="border border-gray-200 p-3 text-gray-900 font-black uppercase leading-tight">{q.question}</td>
                            <td className="border border-gray-200 p-3 text-gray-700 font-medium leading-relaxed">{q.answer}</td>
                            <td className="border border-gray-200 p-3 text-center">
                              <span className={`px-2 py-1 rounded-sm font-black text-[8px] uppercase tracking-tighter block text-center shadow-sm
                                ${q.flag.includes('Ready') ? 'bg-[#4CAF50] text-white' : 'bg-[#FFC107] text-black'}`}>
                                {q.flag}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {!productData.extendedContent?.detailedBusinessPlan && (
                  <div className="p-20 text-center text-gray-400 font-black uppercase text-xl border-4 border-dashed rounded-[3rem]">
                    Business Plan Data Coming Soon
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="assets" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productData.assets.map((asset, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all bg-white cursor-pointer group" onClick={() => asset.url !== "#" && window.open(asset.url, "_blank")}>
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-blue-500 transition-colors">{asset.icon}</div>
                  <span className="text-xs font-black text-gray-700 uppercase tracking-tight group-hover:text-blue-600 group-hover:underline transition-all">{asset.title}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden mt-10">
              <div className="bg-[#F6F4EE] p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    <UserCheck className="w-7 h-7 text-[#C72030]" />
                  </div>
                  <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tighter">Login Credentials</h3>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                  <Lock className="w-3 h-3" /> Secure Access
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50">
                {productData.credentials.map((cred, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 border-b pb-2">{cred.title}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-blue-500 hover:underline cursor-pointer" onClick={() => cred.url !== "#" && window.open(cred.url, "_blank")}>
                        <Globe className="w-3 h-3" /> {cred.url}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                        <span>ID: {cred.id}</span>
                        <span>PASS: {cred.pass}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Section */}
            <div className="mt-16 flex flex-col md:flex-row items-center gap-10 bg-[#1A335E] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-20 opacity-5">
                  <User className="w-64 h-64" />
               </div>
               <div className="w-48 h-56 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl relative z-10 flex-shrink-0">
                  <img src={productData.ownerImage} alt={productData.owner} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
               </div>
               <div className="relative z-10 text-center md:text-left">
                  <h3 className="text-5xl font-black tracking-tighter uppercase mb-2">{productData.owner}</h3>
                  <p className="text-blue-400 font-black uppercase tracking-[0.2em] text-sm mb-6 underline decoration-wavy underline-offset-8">Product Champion</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                     <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/10 tracking-widest">Industry Expert</span>
                     <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/10 tracking-widest">Domain Specialist</span>
                  </div>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BaseProductPage;
