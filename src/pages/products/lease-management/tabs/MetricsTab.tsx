// Lease Management - Metrics Tab Component
import React, { useState } from "react";
import { clientMetrics } from "../data";
import {
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
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

export const MetricsTab: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <BarChart3
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
            Client Success Metrics
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Key performance indicators and measurable outcomes
          </p>
        </div>
      </div>

      {/* Overview Stats */}
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
            {clientMetrics.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Total Metrics
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
            Measurable
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Impact Tracking
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
            Client
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Success Focus
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
            ROI
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Driven
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {clientMetrics.map((metric) => {
          const isExpanded = expandedCard === metric.id;
          const metricName = metric.name || metric.metric || "Metric";

          return (
            <div
              key={metric.id}
              className="rounded-xl border overflow-hidden transition-all duration-300"
              style={{
                borderColor: isExpanded
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {/* Card Header */}
              <div
                className="px-5 py-4 cursor-pointer"
                onClick={() => toggleCard(metric.id)}
                style={{ backgroundColor: BRAND_COLORS.background }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                    >
                      <BarChart3
                        className="w-5 h-5"
                        style={{ color: BRAND_COLORS.primary }}
                      />
                    </div>
                    <div>
                      <h4
                        className="font-semibold"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {metricName}
                      </h4>
                      {metric.impactRange && (
                        <p
                          className="text-sm mt-1 font-medium"
                          style={{ color: BRAND_COLORS.primary }}
                        >
                          {metric.impactRange}
                        </p>
                      )}
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
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div
                  className="px-5 py-4 border-t space-y-4"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  {/* What Measures */}
                  {metric.whatMeasures && (
                    <div className="flex items-start gap-3">
                      <Target
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: BRAND_COLORS.primary }}
                      />
                      <div>
                        <h5
                          className="text-xs font-semibold mb-1"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          What It Measures
                        </h5>
                        <p
                          className="text-sm"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {metric.whatMeasures}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Feature Driving */}
                  {metric.featureDriving && (
                    <div className="flex items-start gap-3">
                      <Zap
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: BRAND_COLORS.secondaryGreen }}
                      />
                      <div>
                        <h5
                          className="text-xs font-semibold mb-1"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          Features Driving This Metric
                        </h5>
                        <p
                          className="text-sm"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {metric.featureDriving}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* How Caused */}
                  {metric.howCaused && (
                    <div className="flex items-start gap-3">
                      <TrendingUp
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: "#0D9488" }}
                      />
                      <div>
                        <h5
                          className="text-xs font-semibold mb-1"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          How It's Achieved
                        </h5>
                        <p
                          className="text-sm"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {metric.howCaused}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Landing Claim */}
                  {metric.landingClaim && (
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: BRAND_COLORS.primary }}
                        />
                        <div>
                          <h5
                            className="text-xs font-semibold mb-1"
                            style={{ color: BRAND_COLORS.text }}
                          >
                            Client Success Claim
                          </h5>
                          <p
                            className="text-sm italic"
                            style={{ color: BRAND_COLORS.primary }}
                          >
                            "{metric.landingClaim}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Metrics Summary */}
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
          <Target className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
          ROI Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <p
              className="text-3xl font-bold"
              style={{ color: BRAND_COLORS.primary }}
            >
              40%
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Avg. Time Savings
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-3xl font-bold"
              style={{ color: BRAND_COLORS.secondaryGreen }}
            >
              30%
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Cost Reduction
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: "#0D9488" }}>
              95%
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Compliance Rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsTab;
