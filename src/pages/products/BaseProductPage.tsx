import React, { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ProductData } from "./types";
import { useProductSecurity } from "./useProductSecurity";
import {
  CameraPermissionPending,
  CameraPermissionDenied,
  ModelLoadingScreen,
  SecurityOverlays,
} from "./SecurityOverlays";
import SummaryTab from "./tabs/SummaryTab";
import PostPossessionTab from "./tabs/PostPossessionTab";
import FeaturesTab from "./tabs/FeaturesTab";
import MarketTab from "./tabs/MarketTab";
import PricingTab from "./tabs/PricingTab";
import UseCasesTab from "./tabs/UseCasesTab";
import GTMTab from "./tabs/GTMTab";
import MetricsTab from "./tabs/MetricsTab";
import SWOTTab from "./tabs/SWOTTab";
import RoadmapTab from "./tabs/RoadmapTab";
import EnhancementsTab from "./tabs/EnhancementsTab";
import BusinessPlanTab from "./tabs/BusinessPlanTab";
import AssetsTab from "./tabs/AssetsTab";

export type { ProductData };

interface BaseProductPageProps {
  productData: ProductData;
  backPath?: string;
  tabsVariant?: "scroll" | "wrap" | "snag360";
}

type TabId =
  | "summary"
  | "features"
  | "usecases"
  | "market"
  | "pricing"
  | "swot"
  | "roadmap"
  | "enhancements"
  | "metrics"
  | "business"
  | "gtm"
  | "assets";

const BaseProductPage: React.FC<BaseProductPageProps> = ({
  productData,
  backPath = "/products",
  tabsVariant = "scroll",
}) => {
  const navigate = useNavigate();
  const snagTabsScrollRef = useRef<HTMLDivElement>(null);
  const security = useProductSecurity();
  const defaultTabOrder: TabId[] = [
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
  ];
  const tabOrder =
    productData.tabOrder && productData.tabOrder.length > 0
      ? productData.tabOrder
      : defaultTabOrder;
  const standardTabLabels: Record<TabId, string> = {
    summary: "Product Summary",
    features: "Features",
    usecases: "Use Cases",
    market: "Market Analysis",
    pricing: "Pricing",
    swot: "SWOT",
    roadmap: "Roadmap",
    enhancements: "Enhancements",
    metrics: "Metrics",
    business: "Business Plan",
    gtm: "GTM Strategy",
    assets: "Assets",
  };
  const snagTabLabels: Record<TabId, string> = {
    summary: "Product Summary",
    features: "Feature List",
    usecases: "Use Cases",
    market: "Market Analysis",
    pricing: "Features and Pricing",
    swot: "SWOT Analysis",
    roadmap: "Product Roadmap",
    enhancements: "Enhancement Roadmap",
    metrics: "Metrics",
    business: "Business Plan Builder",
    gtm: "GTM Strategy",
    assets: "Assets",
  };
  const tabLabels =
    tabsVariant === "snag360" ? snagTabLabels : standardTabLabels;
  const tabContentMap: Record<TabId, React.ReactNode> = {
    summary: <SummaryTab productData={productData} />,
    features: <FeaturesTab productData={productData} />,
    usecases: <UseCasesTab productData={productData} />,
    market: <MarketTab productData={productData} />,
    pricing: <PricingTab productData={productData} />,
    swot: <SWOTTab productData={productData} />,
    roadmap: <RoadmapTab productData={productData} />,
    enhancements: <EnhancementsTab productData={productData} />,
    metrics: <MetricsTab productData={productData} />,
    business: <BusinessPlanTab productData={productData} />,
    gtm: <GTMTab productData={productData} />,
    assets: <AssetsTab productData={productData} />,
  };

  // Camera permission gate — must grant before seeing content
  if (security.cameraPermission === "pending") {
    return <CameraPermissionPending />;
  }
  if (security.cameraPermission === "denied") {
    return <CameraPermissionDenied />;
  }
  if (security.modelLoading) {
    return <ModelLoadingScreen />;
  }

  return (
    <div
      className={`min-h-screen bg-[#F6F4EE] pb-20 select-none font-poppins transition-all duration-300 ${security.showBlankScreen ? "blur-3xl brightness-50 pointer-events-none" : ""}`}
    >
      <SecurityOverlays security={security} />

      {/* Header */}
      <div className="relative mb-4 flex flex-col items-center bg-[#F6F4EE] pt-4">
        <div className="w-full max-w-7xl px-6 lg:px-10 mb-4">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-[#2C2C2C] border border-[#C4B89D]/50 px-3 py-1.5 rounded-full hover:bg-[#DA7756]/8 hover:border-[#DA7756]/30 hover:text-[#DA7756] transition-all font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="text-center w-full max-w-7xl px-6 lg:px-10">
          <div className="inline-block px-4 py-1.5 bg-[#DA7756]/10 text-[#DA7756] text-[10px] font-semibold rounded-full mb-3 tracking-[0.15em] uppercase border border-[#DA7756]/20">
            {productData.industries}
          </div>
          <h1 className="text-4xl font-semibold text-[#2C2C2C] mb-4 tracking-tight lg:text-5xl font-poppins">
            {productData.name}
          </h1>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed max-w-3xl mx-auto font-poppins">
            {productData.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-6 lg:px-10 mx-auto">
        <Tabs defaultValue="summary" className="w-full">
          {tabsVariant === "snag360" ? (
            <div
              ref={snagTabsScrollRef}
              className="overflow-x-auto no-scrollbar mb-8"
            >
              <div className="flex justify-start pb-2 px-1">
                <TabsList className="inline-flex gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-full p-1.5  h-auto items-center justify-start">
                  {tabOrder.map((tabId) => (
                    <TabsTrigger
                      key={tabId}
                      value={tabId}
                      className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-nowrap flex-shrink-0 bg-transparent"
                    >
                      {tabLabels[tabId]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar mb-8">
              <div className="flex justify-start pb-2 px-1">
                <TabsList className="inline-flex gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-full p-1.5  h-auto items-center justify-start">
                  {tabOrder.map((tabId) => (
                    <TabsTrigger
                      key={tabId}
                      value={tabId}
                      className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-nowrap flex-shrink-0 bg-transparent"
                    >
                      {tabLabels[tabId]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          )}

          {tabOrder.map((tabId) => {
            const className =
              tabId === "roadmap" || tabId === "enhancements"
                ? "space-y-12 animate-fade-in"
                : tabId === "business"
                  ? "space-y-10"
                  : tabId === "assets"
                    ? "space-y-8"
                    : tabId === "summary" || tabId === "features"
                      ? "space-y-6"
                      : "space-y-6 animate-fade-in";

            return (
              <TabsContent key={tabId} value={tabId} className={className}>
                {tabContentMap[tabId]}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default BaseProductPage;
