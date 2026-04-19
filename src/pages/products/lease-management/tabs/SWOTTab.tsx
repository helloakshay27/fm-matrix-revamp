// Lease Management - SWOT Tab Component
import React, { useState } from "react";
import { swotAnalysisLessee, swotAnalysisLessor } from "../data";
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Zap,
  ChevronDown,
  ChevronUp,
  Building,
  Briefcase,
} from "lucide-react";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  primaryLight: "rgba(218, 119, 86, 0.1)",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
  success: "#89F7E7",
  warning: "#EDC488",
  secondaryGreen: "#798C5E",
  secondaryTeal: "#9EC8BA",
};

const swotConfig = {
  strengths: {
    title: "Strengths",
    icon: Shield,
    bgColor: `${BRAND_COLORS.success}20`,
    borderColor: "#059669",
    iconColor: "#059669",
    description: "Internal capabilities that give us an advantage",
  },
  weaknesses: {
    title: "Weaknesses",
    icon: AlertTriangle,
    bgColor: "#FEE2E2",
    borderColor: "#DC2626",
    iconColor: "#DC2626",
    description: "Internal limitations that need to be addressed",
  },
  opportunities: {
    title: "Opportunities",
    icon: TrendingUp,
    bgColor: BRAND_COLORS.primaryLight,
    borderColor: BRAND_COLORS.primary,
    iconColor: BRAND_COLORS.primary,
    description: "External factors we can leverage for growth",
  },
  threats: {
    title: "Threats",
    icon: Zap,
    bgColor: `${BRAND_COLORS.warning}30`,
    borderColor: "#D97706",
    iconColor: "#D97706",
    description: "External factors that could impact success",
  },
};

export const SWOTTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>(
    "strengths"
  );

  const swotData =
    perspective === "lessee" ? swotAnalysisLessee : swotAnalysisLessor;

  const renderQuadrant = (
    type: "strengths" | "weaknesses" | "opportunities" | "threats",
    items: typeof swotData.strengths
  ) => {
    const config = swotConfig[type];
    const Icon = config.icon;
    const isExpanded = expandedQuadrant === type;

    return (
      <div
        className="rounded-xl border overflow-hidden transition-all duration-300"
        style={{
          borderColor: isExpanded
            ? config.borderColor
            : BRAND_COLORS.cardBorder,
          backgroundColor: BRAND_COLORS.white,
        }}
      >
        {/* Quadrant Header */}
        <button
          onClick={() => setExpandedQuadrant(isExpanded ? null : type)}
          className="w-full px-5 py-4 flex items-center justify-between transition-colors"
          style={{ backgroundColor: config.bgColor }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: BRAND_COLORS.white }}
            >
              <Icon className="w-5 h-5" style={{ color: config.iconColor }} />
            </div>
            <div className="text-left">
              <h3
                className="font-semibold"
                style={{ color: BRAND_COLORS.text }}
              >
                {config.title}
              </h3>
              <p
                className="text-xs"
                style={{ color: BRAND_COLORS.textSecondary }}
              >
                {items.length} items • {config.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: BRAND_COLORS.white,
                color: config.iconColor,
              }}
            >
              {items.length}
            </span>
            {isExpanded ? (
              <ChevronUp
                className="w-5 h-5"
                style={{ color: BRAND_COLORS.textSecondary }}
              />
            ) : (
              <ChevronDown
                className="w-5 h-5"
                style={{ color: BRAND_COLORS.textSecondary }}
              />
            )}
          </div>
        </button>

        {/* Quadrant Items */}
        {isExpanded && (
          <div
            className="border-t divide-y"
            style={{ borderColor: BRAND_COLORS.cardBorder }}
          >
            {items.map((item, index) => (
              <div key={index} className="px-5 py-4 flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: config.bgColor,
                    color: config.iconColor,
                  }}
                >
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h4
                    className="font-medium mb-1"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.item}
                  </h4>
                  {item.description && (
                    <p
                      className="text-sm"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Perspective Toggle */}
      <div
        className="flex items-center justify-center gap-4 p-4 rounded-xl"
        style={{ backgroundColor: BRAND_COLORS.background }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: BRAND_COLORS.text }}
        >
          View as:
        </span>
        <div
          className="inline-flex gap-1 p-1 rounded-full border"
          style={{
            backgroundColor: BRAND_COLORS.white,
            borderColor: BRAND_COLORS.cardBorder,
          }}
        >
          <button
            onClick={() => setPerspective("lessee")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor:
                perspective === "lessee" ? BRAND_COLORS.primary : "transparent",
              color:
                perspective === "lessee"
                  ? BRAND_COLORS.white
                  : BRAND_COLORS.textSecondary,
            }}
          >
            <Building className="w-4 h-4 inline mr-2" />
            Lessee (Tenant)
          </button>
          <button
            onClick={() => setPerspective("lessor")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor:
                perspective === "lessor" ? BRAND_COLORS.primary : "transparent",
              color:
                perspective === "lessor"
                  ? BRAND_COLORS.white
                  : BRAND_COLORS.textSecondary,
            }}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Lessor (Owner)
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <Shield className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
        </div>
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            SWOT Analysis
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            {perspective === "lessee" ? "Lessee" : "Lessor"} perspective
            strategic analysis
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: "#059669",
            backgroundColor: `${BRAND_COLORS.success}20`,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#059669" }}>
            {swotData.strengths.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Strengths
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: "#DC2626",
            backgroundColor: "#FEE2E2",
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#DC2626" }}>
            {swotData.weaknesses.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Weaknesses
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.primary,
            backgroundColor: BRAND_COLORS.primaryLight,
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.primary }}
          >
            {swotData.opportunities.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Opportunities
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: "#D97706",
            backgroundColor: `${BRAND_COLORS.warning}30`,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#D97706" }}>
            {swotData.threats.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Threats
          </p>
        </div>
      </div>

      {/* SWOT Quadrants */}
      <div className="space-y-4">
        {renderQuadrant("strengths", swotData.strengths)}
        {renderQuadrant("weaknesses", swotData.weaknesses)}
        {renderQuadrant("opportunities", swotData.opportunities)}
        {renderQuadrant("threats", swotData.threats)}
      </div>

      {/* Strategic Summary */}
      <div
        className="rounded-xl border p-6"
        style={{
          borderColor: BRAND_COLORS.primary,
          backgroundColor: BRAND_COLORS.primaryLight,
        }}
      >
        <h3
          className="font-semibold mb-4 flex items-center gap-2"
          style={{ color: BRAND_COLORS.text }}
        >
          <Shield className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
          Strategic Priorities
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#059669" }}
            >
              Leverage Strengths for Opportunities
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Use our compliance automation and India-first approach to capture
              the growing corporate real estate market seeking digital
              transformation.
            </p>
          </div>
          <div>
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#DC2626" }}
            >
              Address Weaknesses & Mitigate Threats
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Accelerate product development and build strategic partnerships to
              compete effectively against established players.
            </p>
          </div>
        </div>
      </div>

      {/* Expand All Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setExpandedQuadrant(null)}
          className="px-4 py-2 rounded-lg text-sm border transition-all hover:bg-gray-50"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            color: BRAND_COLORS.textSecondary,
          }}
        >
          Collapse All
        </button>
      </div>
    </div>
  );
};

export default SWOTTab;
