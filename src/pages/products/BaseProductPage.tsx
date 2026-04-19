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

const BaseProductPage: React.FC<BaseProductPageProps> = ({
  productData,
  backPath = "/products",
  tabsVariant = "scroll",
}) => {
  const navigate = useNavigate();
  const snagTabsScrollRef = useRef<HTMLDivElement>(null);
  const security = useProductSecurity();

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
                  {[
                    { id: "summary", label: "Product Summary" },
                    { id: "features", label: "Feature List" },
                    { id: "market", label: "Market Analysis" },
                    { id: "pricing", label: "Features and Pricing" },
                    { id: "usecases", label: "Use Cases" },
                    { id: "roadmap", label: "Product Roadmap" },
                    { id: "business", label: "Business Plan Builder" },
                    { id: "gtm", label: "GTM Strategy" },
                    { id: "metrics", label: "Metrics" },
                    { id: "swot", label: "SWOT Analysis" },
                    { id: "enhancements", label: "Enhancement Roadmap" },
                    { id: "assets", label: "Assets" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-nowrap flex-shrink-0 bg-transparent"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar mb-8">
              <div className="flex justify-start pb-2 px-1">
                <TabsList className="inline-flex gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-full p-1.5  h-auto items-center justify-start">
                  {[
                    { id: "summary", label: "Product Summary" },
                    { id: "features", label: "Features" },
                    { id: "market", label: "Market Analysis" },
                    { id: "pricing", label: "Pricing" },
                    { id: "usecases", label: "Use Cases" },
                    { id: "roadmap", label: "Roadmap" },
                    { id: "business", label: "Business Plan" },
                    { id: "gtm", label: "GTM Strategy" },
                    { id: "metrics", label: "Metrics" },
                    { id: "swot", label: "SWOT" },
                    { id: "enhancements", label: "Enhancements" },
                    { id: "assets", label: "Assets" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-nowrap flex-shrink-0 bg-transparent"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          )}

          <TabsContent value="summary" className="space-y-6">
            <SummaryTab productData={productData} />
          </TabsContent>
          <TabsContent value="post-possession" className="space-y-6">
            <PostPossessionTab productData={productData} />
          </TabsContent>
          <TabsContent value="features" className="space-y-6">
            <FeaturesTab productData={productData} />
          </TabsContent>
          <TabsContent value="market" className="space-y-6 animate-fade-in">
            <MarketTab productData={productData} />
          </TabsContent>
          <TabsContent value="pricing" className="space-y-6 animate-fade-in">
            <PricingTab productData={productData} />
          </TabsContent>
          <TabsContent value="usecases" className="space-y-6 animate-fade-in">
            <UseCasesTab productData={productData} />
          </TabsContent>
          <TabsContent value="gtm" className="space-y-6 animate-fade-in">
            <GTMTab productData={productData} />
          </TabsContent>
          <TabsContent value="metrics" className="space-y-6 animate-fade-in">
            <MetricsTab productData={productData} />
          </TabsContent>
          <TabsContent value="swot" className="space-y-6 animate-fade-in">
            <SWOTTab productData={productData} />
          </TabsContent>
          <TabsContent value="roadmap" className="space-y-12 animate-fade-in">
            <RoadmapTab productData={productData} />
          </TabsContent>
          <TabsContent
            value="enhancements"
            className="space-y-12 animate-fade-in"
          >
            <EnhancementsTab productData={productData} />
          </TabsContent>
          <TabsContent value="business" className="space-y-10">
            <BusinessPlanTab productData={productData} />
          </TabsContent>
          <TabsContent value="assets" className="space-y-8">
            <AssetsTab productData={productData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BaseProductPage;
