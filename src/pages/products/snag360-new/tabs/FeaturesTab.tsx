// Snag360 New - Features Tab Component
import React, { useState } from "react";
import { features } from "../data";
import {
  Settings,
  Star,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  primaryLight: "#e8957a",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
  success: "#4CAF50",
  warning: "#FFC107",
  usp: "#2196F3",
};

// Group features by module
const getModuleGroups = () => {
  const groups: Record<string, typeof features> = {};
  features.forEach((feature) => {
    if (!groups[feature.module]) {
      groups[feature.module] = [];
    }
    groups[feature.module].push(feature);
  });
  return groups;
};

export const FeaturesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUSPOnly, setShowUSPOnly] = useState(false);
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [expandedFeatures, setExpandedFeatures] = useState<
    Record<string, boolean>
  >({});

  const moduleGroups = getModuleGroups();
  const modules = Object.keys(moduleGroups);

  // Filter features based on search and USP filter
  const filterFeatures = (featureList: typeof features) => {
    return featureList.filter((feature) => {
      const matchesSearch =
        searchTerm === "" ||
        feature.feature.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.subFeatures.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.howItWorks.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUSP = !showUSPOnly || feature.isUSP;
      return matchesSearch && matchesUSP;
    });
  };

  const toggleModule = (module: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const toggleFeature = (featureKey: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [featureKey]: !prev[featureKey],
    }));
  };

  const uspCount = features.filter((f) => f.isUSP).length;
  const totalCount = features.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
          >
            <Settings
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
              Feature List
            </h2>
            <p
              className="text-sm"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              {totalCount} features across {modules.length} modules •{" "}
              <span style={{ color: BRAND_COLORS.usp }}>{uspCount} USPs</span>
            </p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex gap-3">
          <div
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${BRAND_COLORS.usp}15`,
              color: BRAND_COLORS.usp,
            }}
          >
            <Star className="w-3 h-3 inline mr-1" />
            {uspCount} USP Features
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: BRAND_COLORS.textSecondary }}
          />
          <input
            type="text"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              color: BRAND_COLORS.text,
            }}
          />
        </div>
        <button
          onClick={() => setShowUSPOnly(!showUSPOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
          style={{
            backgroundColor: showUSPOnly
              ? BRAND_COLORS.usp
              : BRAND_COLORS.background,
            color: showUSPOnly
              ? BRAND_COLORS.white
              : BRAND_COLORS.textSecondary,
            border: `1px solid ${showUSPOnly ? BRAND_COLORS.usp : BRAND_COLORS.cardBorder}`,
          }}
        >
          <Star className="w-4 h-4" />
          USP Only
        </button>
      </div>

      {/* Feature Modules */}
      <div className="space-y-4">
        {modules.map((module) => {
          const moduleFeatures = filterFeatures(moduleGroups[module]);
          if (moduleFeatures.length === 0) return null;

          const isExpanded = expandedModules[module] !== false; // Default to expanded
          const uspInModule = moduleFeatures.filter((f) => f.isUSP).length;

          return (
            <div
              key={module}
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: BRAND_COLORS.background }}
              >
                <div className="flex items-center gap-3">
                  <h3
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {module}
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: BRAND_COLORS.white,
                      color: BRAND_COLORS.textSecondary,
                    }}
                  >
                    {moduleFeatures.length} features
                  </span>
                  {uspInModule > 0 && (
                    <span
                      className="px-2 py-0.5 rounded text-xs flex items-center gap-1"
                      style={{
                        backgroundColor: `${BRAND_COLORS.usp}15`,
                        color: BRAND_COLORS.usp,
                      }}
                    >
                      <Star className="w-3 h-3" />
                      {uspInModule} USP
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp
                    className="w-4 h-4"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  />
                ) : (
                  <ChevronDown
                    className="w-4 h-4"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  />
                )}
              </button>

              {/* Module Features */}
              {isExpanded && (
                <div
                  className="divide-y"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  {moduleFeatures.map((feature, idx) => {
                    const featureKey = `${module}-${idx}`;
                    const isFeatureExpanded = expandedFeatures[featureKey];

                    return (
                      <div
                        key={idx}
                        className="p-4"
                        style={{
                          backgroundColor: feature.isUSP
                            ? `${BRAND_COLORS.usp}05`
                            : BRAND_COLORS.white,
                        }}
                      >
                        {/* Feature Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {feature.isUSP && (
                                <Star
                                  className="w-4 h-4 fill-current"
                                  style={{ color: BRAND_COLORS.usp }}
                                />
                              )}
                              <h4
                                className="font-medium"
                                style={{
                                  color: feature.isUSP
                                    ? BRAND_COLORS.usp
                                    : BRAND_COLORS.text,
                                }}
                              >
                                {feature.feature.replace("* ", "")}
                              </h4>
                            </div>
                            <p
                              className="text-sm"
                              style={{ color: BRAND_COLORS.textSecondary }}
                            >
                              {feature.subFeatures}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleFeature(featureKey)}
                            className="ml-4 px-3 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: BRAND_COLORS.background,
                              color: BRAND_COLORS.textSecondary,
                            }}
                          >
                            {isFeatureExpanded ? "Less" : "More"}
                          </button>
                        </div>

                        {/* Expanded Details */}
                        {isFeatureExpanded && (
                          <div
                            className="mt-4 pt-4 border-t space-y-3"
                            style={{ borderColor: BRAND_COLORS.cardBorder }}
                          >
                            <div>
                              <span
                                className="text-xs font-semibold uppercase tracking-wide"
                                style={{ color: BRAND_COLORS.primary }}
                              >
                                How It Works
                              </span>
                              <p
                                className="mt-1 text-sm leading-relaxed"
                                style={{ color: BRAND_COLORS.text }}
                              >
                                {feature.howItWorks}
                              </p>
                            </div>
                            <div>
                              <span
                                className="text-xs font-semibold uppercase tracking-wide"
                                style={{ color: BRAND_COLORS.primary }}
                              >
                                User Type
                              </span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {feature.userType.split(", ").map((user, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded text-xs"
                                    style={{
                                      backgroundColor: `${BRAND_COLORS.primary}15`,
                                      color: BRAND_COLORS.primary,
                                    }}
                                  >
                                    {user}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {modules.every(
        (module) => filterFeatures(moduleGroups[module]).length === 0
      ) && (
        <div
          className="text-center py-12 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.background }}
        >
          <p style={{ color: BRAND_COLORS.textSecondary }}>
            No features match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};
