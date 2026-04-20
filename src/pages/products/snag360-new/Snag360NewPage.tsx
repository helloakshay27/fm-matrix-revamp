// Snag360 New Page - Isolated implementation with security layer
// This page is completely separate from the existing Snag360Page to prevent cross-product interference

import React, { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756", // Primary Orange
  primaryDark: "#c4684a",
  background: "#F6F4EE", // Background Cream
  backgroundDark: "#EDE9DF",
  text: "#2C2C2C", // Primary Text
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#E53935",
};

// Tab configuration
const TAB_CONFIG = [
  { key: "summary", label: "Summary" },
  { key: "features", label: "Features" },
  { key: "market", label: "Market" },
  { key: "pricing", label: "Pricing" },
  { key: "usecases", label: "Use Cases" },
  { key: "roadmap", label: "Roadmap" },
  { key: "business", label: "Business Plan" },
  { key: "gtm", label: "GTM Strategy" },
  { key: "metrics", label: "Metrics" },
  { key: "swot", label: "SWOT" },
  { key: "enhancements", label: "Enhancements" },
  { key: "assets", label: "Assets" },
] as const;

type TabKey = (typeof TAB_CONFIG)[number]["key"];

export default function Snag360NewPage() {
  const navigate = useNavigate();
  const security = useProductSecurity();
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [tabScrollPosition, setTabScrollPosition] = useState(0);

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

  const scrollTabsLeft = () => {
    setTabScrollPosition((prev) => Math.max(0, prev - 200));
  };

  const scrollTabsRight = () => {
    setTabScrollPosition((prev) => prev + 200);
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
      className="min-h-screen relative"
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
        className="sticky top-0 z-50 border-b"
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
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: BRAND_COLORS.text }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </button>

            {/* Product Title */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                S
              </div>
              <div>
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
            </div>

            {/* Owner Info */}
            <div className="flex items-center gap-2">
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
            </div>
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
          <div className="flex items-center">
            {/* Scroll Left Button */}
            <button
              onClick={scrollTabsLeft}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Tabs */}
            <div className="flex-1 overflow-hidden">
              <div
                className="flex gap-1 transition-transform duration-300 py-2"
                style={{ transform: `translateX(-${tabScrollPosition}px)` }}
              >
                {TAB_CONFIG.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all"
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
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={scrollTabsRight}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Content */}
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: BRAND_COLORS.white,
            borderColor: BRAND_COLORS.cardBorder,
          }}
        >
          {renderTabContent()}
        </div>

        {/* Tab Navigation Footer */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrevTab}
            disabled={currentTabIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                currentTabIndex === 0
                  ? BRAND_COLORS.backgroundDark
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

          <div className="flex items-center gap-2">
            {TAB_CONFIG.map((tab, index) => (
              <div
                key={tab.key}
                className="w-2 h-2 rounded-full transition-all cursor-pointer"
                style={{
                  backgroundColor:
                    index === currentTabIndex
                      ? BRAND_COLORS.primary
                      : BRAND_COLORS.cardBorder,
                }}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>

          <button
            onClick={handleNextTab}
            disabled={currentTabIndex === TAB_CONFIG.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                currentTabIndex === TAB_CONFIG.length - 1
                  ? BRAND_COLORS.backgroundDark
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
        </div>
      </main>
    </div>
  );
}
