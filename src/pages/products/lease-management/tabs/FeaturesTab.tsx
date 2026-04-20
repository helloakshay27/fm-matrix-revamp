// Lease Management - Features Tab Component
import React, { useState } from "react";
import { features } from "../data";
import {
  Boxes,
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  Building,
  Users,
  BarChart3,
  Shield,
  Settings,
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

const moduleIcons: Record<
  string,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  "Lease Contracts": FileText,
  "Rent & Billing": Building,
  "Tenant Management": Users,
  "Reports & Analytics": BarChart3,
  Compliance: Shield,
  Administration: Settings,
  Renewals: Layers,
  Default: Boxes,
};

export const FeaturesTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [showUSPOnly, setShowUSPOnly] = useState(false);

  // Group features by module
  const groupedFeatures = features.reduce(
    (acc, feature) => {
      const module = feature.module || "Other";
      if (!acc[module]) acc[module] = [];
      acc[module].push(feature);
      return acc;
    },
    {} as Record<string, typeof features>
  );

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      feature.feature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.howItWorks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.module?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUSP = showUSPOnly ? feature.isUSP : true;
    return matchesSearch && matchesUSP;
  });

  const filteredGroupedFeatures = Object.entries(groupedFeatures).reduce(
    (acc, [module, moduleFeatures]) => {
      const filtered = moduleFeatures.filter((feature) => {
        const matchesSearch =
          feature.feature.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feature.howItWorks.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUSP = showUSPOnly ? feature.isUSP : true;
        return matchesSearch && matchesUSP;
      });
      if (filtered.length > 0) acc[module] = filtered;
      return acc;
    },
    {} as Record<string, typeof features>
  );

  const toggleModule = (module: string) => {
    setExpandedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  const expandAll = () => {
    setExpandedModules(Object.keys(filteredGroupedFeatures));
  };

  const collapseAll = () => {
    setExpandedModules([]);
  };

  const totalFeatures = filteredFeatures.length;
  const uspCount = filteredFeatures.filter((f) => f.isUSP).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
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
            {totalFeatures}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Total Features
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
            {uspCount}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            USP Features
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
            style={{ color: BRAND_COLORS.text }}
          >
            {Object.keys(filteredGroupedFeatures).length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Modules
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
            {Math.round((uspCount / totalFeatures) * 100)}%
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            USP Ratio
          </p>
        </div>
      </div>

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
              placeholder="Search features..."
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
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowUSPOnly(!showUSPOnly)}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              style={{
                backgroundColor: showUSPOnly
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.white,
                color: showUSPOnly ? BRAND_COLORS.white : BRAND_COLORS.text,
                borderWidth: 1,
                borderColor: BRAND_COLORS.cardBorder,
              }}
            >
              <Star className="w-4 h-4" />
              USP Only
            </button>
            <button
              onClick={expandAll}
              className="px-3 py-2 rounded-lg text-sm border transition-all hover:bg-gray-50"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                color: BRAND_COLORS.textSecondary,
              }}
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-2 rounded-lg text-sm border transition-all hover:bg-gray-50"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                color: BRAND_COLORS.textSecondary,
              }}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Features by Module */}
      <div className="space-y-4">
        {Object.entries(filteredGroupedFeatures).map(
          ([module, moduleFeatures]) => {
            const IconComponent = moduleIcons[module] || moduleIcons["Default"];
            const isExpanded = expandedModules.includes(module);
            const moduleUSPCount = moduleFeatures.filter((f) => f.isUSP).length;

            return (
              <div
                key={module}
                className="rounded-lg border overflow-hidden"
                style={{
                  borderColor: BRAND_COLORS.cardBorder,
                  backgroundColor: BRAND_COLORS.white,
                }}
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  style={{ backgroundColor: BRAND_COLORS.background }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                    >
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: BRAND_COLORS.primary }}
                      />
                    </div>
                    <div className="text-left">
                      <h3
                        className="font-semibold"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {module}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        {moduleFeatures.length} features
                        {moduleUSPCount > 0 && ` • ${moduleUSPCount} USP`}
                      </p>
                    </div>
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
                </button>

                {/* Module Features */}
                {isExpanded && (
                  <div
                    className="border-t"
                    style={{ borderColor: BRAND_COLORS.cardBorder }}
                  >
                    {moduleFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="px-4 py-4 border-b last:border-b-0"
                        style={{ borderColor: BRAND_COLORS.cardBorder }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className="font-medium"
                                style={{ color: BRAND_COLORS.text }}
                              >
                                {feature.feature}
                              </h4>
                              {feature.isUSP && (
                                <span
                                  className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                                  style={{
                                    backgroundColor: BRAND_COLORS.primaryLight,
                                    color: BRAND_COLORS.primary,
                                  }}
                                >
                                  <Star className="w-3 h-3" />
                                  USP
                                </span>
                              )}
                            </div>
                            <p
                              className="text-sm"
                              style={{ color: BRAND_COLORS.textSecondary }}
                            >
                              {feature.howItWorks}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* No Results */}
      {Object.keys(filteredGroupedFeatures).length === 0 && (
        <div
          className="rounded-lg border p-8 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.background,
          }}
        >
          <Boxes
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: BRAND_COLORS.textSecondary }}
          />
          <p className="font-medium" style={{ color: BRAND_COLORS.text }}>
            No features found
          </p>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default FeaturesTab;
