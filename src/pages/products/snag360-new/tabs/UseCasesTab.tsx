// Snag360 New - Use Cases Tab Component
import React, { useState } from "react";
import { useCases } from "../data";
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
  success: "#4CAF50",
  warning: "#FFC107",
  info: "#2196F3",
};

export const UseCasesTab: React.FC = () => {
  const [expandedCase, setExpandedCase] = useState<number | null>(0);
  const [filterIndustry, setFilterIndustry] = useState<string>("all");

  // Get unique industries
  const industries = ["all", ...new Set(useCases.map((uc) => uc.industry))];

  const filteredUseCases =
    filterIndustry === "all"
      ? useCases
      : useCases.filter((uc) => uc.industry === filterIndustry);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
          >
            <Briefcase
              className="w-5 h-5"
              style={{ color: BRAND_COLORS.primary }}
            />
          </div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Use Cases & Industry Applications
          </h2>
        </div>

        {/* Industry Filter */}
        <select
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            color: BRAND_COLORS.text,
          }}
        >
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry === "all" ? "All Industries" : industry}
            </option>
          ))}
        </select>
      </div>

      {/* Use Cases List */}
      <div className="space-y-4">
        {filteredUseCases.map((useCase, index) => (
          <div
            key={index}
            className="rounded-lg border overflow-hidden"
            style={{
              borderColor:
                expandedCase === index
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            {/* Use Case Header */}
            <button
              className="w-full p-4 flex items-center justify-between text-left"
              onClick={() =>
                setExpandedCase(expandedCase === index ? null : index)
              }
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
                >
                  <Building2
                    className="w-5 h-5"
                    style={{ color: BRAND_COLORS.primary }}
                  />
                </div>
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {useCase.scenario}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: BRAND_COLORS.background,
                        color: BRAND_COLORS.textSecondary,
                      }}
                    >
                      {useCase.industry}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${BRAND_COLORS.success}15`,
                        color: BRAND_COLORS.success,
                      }}
                    >
                      {useCase.impact}
                    </span>
                  </div>
                </div>
              </div>
              {expandedCase === index ? (
                <ChevronUp
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: BRAND_COLORS.primary }}
                />
              ) : (
                <ChevronDown
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: BRAND_COLORS.textSecondary }}
                />
              )}
            </button>

            {/* Expanded Content */}
            {expandedCase === index && (
              <div
                className="px-4 pb-4 border-t"
                style={{ borderColor: BRAND_COLORS.cardBorder }}
              >
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {/* Challenge */}
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#FFEBEE" }}
                  >
                    <h4
                      className="text-xs font-semibold uppercase mb-2"
                      style={{ color: "#E53935" }}
                    >
                      Challenge
                    </h4>
                    <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
                      {useCase.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${BRAND_COLORS.info}10` }}
                  >
                    <h4
                      className="text-xs font-semibold uppercase mb-2"
                      style={{ color: BRAND_COLORS.info }}
                    >
                      Solution
                    </h4>
                    <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
                      {useCase.solution}
                    </p>
                  </div>

                  {/* Outcome */}
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${BRAND_COLORS.success}10` }}
                  >
                    <h4
                      className="text-xs font-semibold uppercase mb-2"
                      style={{ color: BRAND_COLORS.success }}
                    >
                      Outcome
                    </h4>
                    <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
                      {useCase.outcome}
                    </p>
                  </div>
                </div>

                {/* Key Features Used */}
                <div className="mt-4">
                  <h4
                    className="text-xs font-semibold uppercase mb-2"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    Key Features Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.keyFeatures.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: `${BRAND_COLORS.primary}10`,
                          color: BRAND_COLORS.primary,
                        }}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg"
        style={{ backgroundColor: BRAND_COLORS.background }}
      >
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.primary }}
          >
            {useCases.length}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Total Use Cases
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.success }}
          >
            {industries.length - 1}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Industries
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.info }}
          >
            100%
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Success Rate
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.warning }}
          >
            High
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Impact Level
          </p>
        </div>
      </div>
    </div>
  );
};
