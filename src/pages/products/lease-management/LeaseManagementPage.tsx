// Lease Management Page - Isolated implementation with security layer
// This page is completely separate from existing product pages to prevent cross-product interference

import React, { useState, useRef } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductSecurity } from "../useProductSecurity";
import {
  CameraPermissionPending,
  CameraPermissionDenied,
  ModelLoadingScreen,
  SecurityOverlays,
} from "../SecurityOverlays";

// Import tab components
import { SummaryTab } from "./tabs/SummaryTab";
import { FeaturesTab } from "./tabs/FeaturesTab";
import { MarketTab } from "./tabs/MarketTab";
import { PricingTab } from "./tabs/PricingTab";
import { UseCasesTab } from "./tabs/UseCasesTab";
import { RoadmapTab } from "./tabs/RoadmapTab";
import { BusinessPlanTab } from "./tabs/BusinessPlanTab";
import { GTMTab } from "./tabs/GTMTab";
import { MetricsTab } from "./tabs/MetricsTab";
import { SWOTTab } from "./tabs/SWOTTab";
import { EnhancementsTab } from "./tabs/EnhancementsTab";
import { AssetsTab } from "./tabs/AssetsTab";

// Import product metadata
import { productMetadata } from "./data";

// Lockated Brand Colors (from brand guidelines)
const BRAND_COLORS = {
  primary: "#DA7756", // Main Primary
  primaryHover: "rgba(218, 119, 86, 0.85)", // Primary with 15% lightened
  primarySelected: "rgba(218, 119, 86, 0.08)", // Primary with 8% opacity
  background: "#F6F4EE", // Background
  text: "#2C2C2C", // Primary Text
  textSecondary: "#5A5A5A",
  // Secondary colors
  secondaryGreen: "#798C5E",
  secondaryPurple: "#CECBF6",
  secondaryTeal: "#9EC8BA",
  // Tertiary
  informative: "#6B9BCC",
  disabled: "#D3D1C7",
  tags: "#CECBF6",
  danger: "#E49191",
  warning: "#EDC488",
  growth: "rgba(16, 140, 114, 0.3)",
  // Accent
  cardBorder: "#C4B89D",
  cardFilling: "#F6F4EE",
  subtleBorder: "#D5DBDB",
  // Status
  success: "#89F7E7",
  error: "#E7848E",
  exception: "#AAB9C5",
  white: "#FFFFFF",
};

// Tab configuration matching the 12 tabs from the content
const TAB_CONFIG = [
  { key: "summary", label: "Product Summary" },
  { key: "features", label: "Feature List" },
  { key: "market", label: "Market Analysis" },
  { key: "pricing", label: "Features & Pricing" },
  { key: "usecases", label: "Use Cases" },
  { key: "roadmap", label: "Product Roadmap" },
  { key: "business", label: "Business Plan" },
  { key: "gtm", label: "GTM Strategy" },
  { key: "metrics", label: "Metrics" },
  { key: "swot", label: "SWOT Analysis" },
  { key: "enhancements", label: "Enhancements" },
  { key: "assets", label: "Assets" },
] as const;

type TabKey = (typeof TAB_CONFIG)[number]["key"];

export default function LeaseManagementPage() {
  const navigate = useNavigate();
  const security = useProductSecurity();
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Security check states
  if (security.cameraPermission === "pending") {
    return <CameraPermissionPending />;
  }
  if (security.cameraPermission === "denied") {
    return <CameraPermissionDenied />;
  }
  if (security.modelLoading) {
    return <ModelLoadingScreen />;
  }

  const currentTabIndex = TAB_CONFIG.findIndex((t) => t.key === activeTab);

  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TAB_CONFIG[currentTabIndex - 1].key);
    }
  };

  const handleNextTab = () => {
    if (currentTabIndex < TAB_CONFIG.length - 1) {
      setActiveTab(TAB_CONFIG[currentTabIndex + 1].key);
    }
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryTab />;
      case "features":
        return <FeaturesTab />;
      case "market":
        return <MarketTab />;
      case "pricing":
        return <PricingTab />;
      case "usecases":
        return <UseCasesTab />;
      case "roadmap":
        return <RoadmapTab />;
      case "business":
        return <BusinessPlanTab />;
      case "gtm":
        return <GTMTab />;
      case "metrics":
        return <MetricsTab />;
      case "swot":
        return <SWOTTab />;
      case "enhancements":
        return <EnhancementsTab />;
      case "assets":
        return <AssetsTab />;
      default:
        return <SummaryTab />;
    }
  };

  return (
    <div
      className="min-h-screen relative font-poppins"
      style={{
        backgroundColor: BRAND_COLORS.background,
        filter: security.isBlurred ? "blur(20px)" : "none",
        transition: "filter 0.3s ease",
        userSelect: "none",
      }}
    >
      {/* Security Overlays */}
      <SecurityOverlays security={security} />

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b shadow-sm"
        style={{
          backgroundColor: BRAND_COLORS.white,
          borderColor: BRAND_COLORS.cardBorder,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-full border hover:border-[#DA7756]/30 hover:text-[#DA7756]"
              style={{
                color: BRAND_COLORS.text,
                borderColor: BRAND_COLORS.cardBorder,
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Products</span>
              <span className="sm:hidden">Back</span>
            </button>

            {/* Product Title */}
            {/* <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                LM
              </div>
              <div className="hidden sm:block">
                <h1
                  className="text-lg font-semibold"
                  style={{
                    color: BRAND_COLORS.text,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {productMetadata.name}
                </h1>
                <p
                  className="text-xs"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  {productMetadata.industries}
                </p>
              </div>
            </div> */}

            {/* Owner Info */}
            {/* <div className="hidden md:flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: BRAND_COLORS.textSecondary }}
              >
                Product Owner:
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: BRAND_COLORS.text }}
              >
                {productMetadata.owner}
              </span>
            </div> */}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div
        className="sticky top-16 z-40 border-b"
        style={{
          backgroundColor: BRAND_COLORS.white,
          borderColor: BRAND_COLORS.cardBorder,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-2">
            {/* Scroll Left Button */}

            {/* Tabs Container */}
            <div
              ref={tabsContainerRef}
              className="flex-1 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                className="inline-flex gap-1 p-1.5 rounded-full border"
                style={{
                  backgroundColor: BRAND_COLORS.background,
                  borderColor: BRAND_COLORS.cardBorder,
                }}
              >
                {TAB_CONFIG.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300"
                    style={{
                      backgroundColor:
                        activeTab === tab.key
                          ? BRAND_COLORS.primary
                          : "transparent",
                      color:
                        activeTab === tab.key
                          ? BRAND_COLORS.white
                          : BRAND_COLORS.textSecondary,
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: activeTab === tab.key ? 600 : 500,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll Right Button */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Tab Content */}
        <div
          className="rounded-xl border shadow-sm overflow-hidden"
          style={{
            backgroundColor: BRAND_COLORS.white,
            borderColor: BRAND_COLORS.cardBorder,
          }}
        >
          <div className="p-6">{renderTabContent()}</div>
        </div>

        {/* Tab Navigation Footer */}
        {/* <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrevTab}
            disabled={currentTabIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                currentTabIndex === 0
                  ? BRAND_COLORS.disabled
                  : BRAND_COLORS.primary,
              color:
                currentTabIndex === 0
                  ? BRAND_COLORS.textSecondary
                  : BRAND_COLORS.white,
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {TAB_CONFIG.map((tab, index) => (
              <button
                key={tab.key}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-125"
                style={{
                  backgroundColor:
                    index === currentTabIndex
                      ? BRAND_COLORS.primary
                      : BRAND_COLORS.cardBorder,
                }}
                onClick={() => setActiveTab(tab.key)}
                title={tab.label}
              />
            ))}
          </div>

          <button
            onClick={handleNextTab}
            disabled={currentTabIndex === TAB_CONFIG.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                currentTabIndex === TAB_CONFIG.length - 1
                  ? BRAND_COLORS.disabled
                  : BRAND_COLORS.primary,
              color:
                currentTabIndex === TAB_CONFIG.length - 1
                  ? BRAND_COLORS.textSecondary
                  : BRAND_COLORS.white,
            }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div> */}
      </main>
    </div>
  );
}
