// Lease Management - Enhancements Tab Component
import React, { useState } from "react";
import {
  enhancementsLessee,
  enhancementsLessor,
  topEnhancements,
  topEnhancementsLessor,
} from "../data";
import {
  Sparkles,
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
  Server,
  TrendingUp,
  Clock,
  DollarSign,
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

const impactColors: Record<string, { bg: string; text: string }> = {
  High: { bg: `${BRAND_COLORS.success}30`, text: "#059669" },
  Medium: { bg: `${BRAND_COLORS.warning}30`, text: "#D97706" },
  Low: { bg: BRAND_COLORS.background, text: BRAND_COLORS.textSecondary },
};

const effortColors: Record<string, { bg: string; text: string }> = {
  Low: { bg: `${BRAND_COLORS.success}30`, text: "#059669" },
  Medium: { bg: `${BRAND_COLORS.warning}30`, text: "#D97706" },
  High: { bg: "#FEE2E2", text: "#DC2626" },
};

export const EnhancementsTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "ai" | "mcp">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const enhancementsData =
    perspective === "lessee" ? enhancementsLessee : enhancementsLessor;
  const topEnhancementsData =
    perspective === "lessee" ? topEnhancements : topEnhancementsLessor;

  const filteredEnhancements = enhancementsData.filter((item) => {
    const matchesSearch =
      item.feature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.enhancedBehavior.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "ai" && item.isAI) ||
      (filterType === "mcp" && item.isMCP);
    return matchesSearch && matchesFilter;
  });

  const aiCount = enhancementsData.filter((e) => e.isAI).length;
  const mcpCount = enhancementsData.filter((e) => e.isMCP).length;

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
          <Sparkles
            className="w-5 h-5"
            style={{ color: BRAND_COLORS.primary }}
          />
        </div>
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            AI & MCP Enhancements
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            {perspective === "lessee" ? "Lessee" : "Lessor"} perspective -
            Future product improvements and capabilities
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.primary }}
          >
            {enhancementsData.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Total Enhancements
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#8B5CF6" }}>
            {aiCount}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            AI-Powered
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#0D9488" }}>
            {mcpCount}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            MCP Integrations
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.secondaryGreen }}
          >
            {topEnhancementsData.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Top Priority
          </p>
        </div>
      </div>

      {/* Top Enhancements Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
          <h3
            className="text-lg font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Top Priority Enhancements
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topEnhancementsData.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border p-4 transition-all duration-300 hover:shadow-md"
              style={{
                borderColor: BRAND_COLORS.primary,
                backgroundColor: BRAND_COLORS.primaryLight,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: BRAND_COLORS.primary,
                    color: BRAND_COLORS.white,
                  }}
                >
                  #{item.rank}
                </span>
              </div>
              <h4
                className="font-semibold mb-2"
                style={{ color: BRAND_COLORS.text }}
              >
                {item.feature}
              </h4>
              <p
                className="text-sm mb-3"
                style={{ color: BRAND_COLORS.textSecondary }}
              >
                {item.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Search and Filters */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: BRAND_COLORS.cardBorder,
          backgroundColor: BRAND_COLORS.background,
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: BRAND_COLORS.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search enhancements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
                color: BRAND_COLORS.text,
              }}
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All", icon: Zap },
              { value: "ai", label: "AI", icon: Brain },
              { value: "mcp", label: "MCP", icon: Server },
            ].map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() =>
                    setFilterType(filter.value as "all" | "ai" | "mcp")
                  }
                  className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor:
                      filterType === filter.value
                        ? BRAND_COLORS.primary
                        : BRAND_COLORS.white,
                    color:
                      filterType === filter.value
                        ? BRAND_COLORS.white
                        : BRAND_COLORS.text,
                    borderWidth: 1,
                    borderColor: BRAND_COLORS.cardBorder,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhancements List */}
      <div className="space-y-4">
        {filteredEnhancements.map((item) => {
          const isExpanded = expandedId === item.id;
          const impactStyle =
            impactColors[item.impactLevel] || impactColors.Medium;
          const effortStyle = effortColors[item.effort] || effortColors.Medium;

          return (
            <div
              key={item.id}
              className="rounded-xl border overflow-hidden transition-all duration-300"
              style={{
                borderColor: isExpanded
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {/* Enhancement Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full px-5 py-4 flex items-start justify-between transition-colors hover:bg-gray-50"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className="font-semibold"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {item.feature}
                    </h4>
                    {item.isAI && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{ backgroundColor: "#EDE9FE", color: "#8B5CF6" }}
                      >
                        <Brain className="w-3 h-3" />
                        AI
                      </span>
                    )}
                    {item.isMCP && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{
                          backgroundColor: `${BRAND_COLORS.secondaryTeal}30`,
                          color: "#0D9488",
                        }}
                      >
                        <Server className="w-3 h-3" />
                        MCP
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    {item.module}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="hidden md:flex gap-2">
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: impactStyle.bg,
                        color: impactStyle.text,
                      }}
                    >
                      {item.impactLevel} Impact
                    </span>
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: effortStyle.bg,
                        color: effortStyle.text,
                      }}
                    >
                      {item.effort} Effort
                    </span>
                  </div>
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

              {/* Enhancement Details */}
              {isExpanded && (
                <div
                  className="px-5 pb-5 border-t"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h5
                        className="text-sm font-semibold mb-2 flex items-center gap-2"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        <Clock className="w-4 h-4" />
                        Current Behavior
                      </h5>
                      <p
                        className="text-sm"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {item.currentBehavior}
                      </p>
                    </div>
                    <div>
                      <h5
                        className="text-sm font-semibold mb-2 flex items-center gap-2"
                        style={{ color: BRAND_COLORS.secondaryGreen }}
                      >
                        <TrendingUp className="w-4 h-4" />
                        Enhanced Behavior
                      </h5>
                      <p
                        className="text-sm"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {item.enhancedBehavior}
                      </p>
                    </div>
                  </div>
                  <div
                    className="mt-4 pt-4 border-t"
                    style={{ borderColor: BRAND_COLORS.cardBorder }}
                  >
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Server
                          className="w-4 h-4"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          <strong>Integration:</strong> {item.integrationType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign
                          className="w-4 h-4"
                          style={{ color: BRAND_COLORS.primary }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          <strong>Revenue Impact:</strong> {item.revenueImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredEnhancements.length === 0 && (
        <div
          className="rounded-lg border p-8 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.background,
          }}
        >
          <Sparkles
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: BRAND_COLORS.textSecondary }}
          />
          <p className="font-medium" style={{ color: BRAND_COLORS.text }}>
            No enhancements found
          </p>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancementsTab;
