// Snag360 New - Metrics Tab Component
import React, { useState } from "react";
import { clientMetrics, businessMetrics } from "../data";
import { BarChart3, Users, TrendingUp, Target } from "lucide-react";

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

export const MetricsTab: React.FC = () => {
  const [activeView, setActiveView] = useState<"client" | "business">("client");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
          >
            <BarChart3
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
            Key Metrics & KPIs
          </h2>
        </div>

        {/* View Toggle */}
        <div
          className="flex rounded-lg overflow-hidden border"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <button
            className="px-4 py-2 text-sm font-medium flex items-center gap-2"
            style={{
              backgroundColor:
                activeView === "client"
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.white,
              color:
                activeView === "client"
                  ? BRAND_COLORS.white
                  : BRAND_COLORS.text,
            }}
            onClick={() => setActiveView("client")}
          >
            <Users className="w-4 h-4" />
            Client Metrics
          </button>
          <button
            className="px-4 py-2 text-sm font-medium flex items-center gap-2"
            style={{
              backgroundColor:
                activeView === "business"
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.white,
              color:
                activeView === "business"
                  ? BRAND_COLORS.white
                  : BRAND_COLORS.text,
            }}
            onClick={() => setActiveView("business")}
          >
            <TrendingUp className="w-4 h-4" />
            Business Metrics
          </button>
        </div>
      </div>

      {/* Client Metrics View */}
      {activeView === "client" && (
        <section>
          <div className="grid gap-4">
            {clientMetrics.map((metric, index) => (
              <div
                key={index}
                className="rounded-lg border p-4"
                style={{
                  borderColor: BRAND_COLORS.cardBorder,
                  backgroundColor: BRAND_COLORS.white,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: BRAND_COLORS.primary }}
                      >
                        {index + 1}
                      </div>
                      <h3
                        className="font-semibold"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {metric.metric}
                      </h3>
                    </div>
                    <p
                      className="text-sm mb-3"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {metric.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: BRAND_COLORS.background,
                          color: BRAND_COLORS.textSecondary,
                        }}
                      >
                        Before: {metric.before}
                      </span>
                      <TrendingUp
                        className="w-4 h-4"
                        style={{ color: BRAND_COLORS.success }}
                      />
                      <span
                        className="text-xs px-2 py-1 rounded font-medium"
                        style={{
                          backgroundColor: `${BRAND_COLORS.success}15`,
                          color: BRAND_COLORS.success,
                        }}
                      >
                        After: {metric.after}
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-right p-3 rounded-lg"
                    style={{ backgroundColor: `${BRAND_COLORS.primary}10` }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: BRAND_COLORS.primary }}
                    >
                      {metric.improvement}
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      Improvement
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Business Metrics View */}
      {activeView === "business" && (
        <section>
          <div className="grid gap-4">
            {businessMetrics.map((metric, index) => (
              <div
                key={index}
                className="rounded-lg border p-4"
                style={{
                  borderColor: BRAND_COLORS.cardBorder,
                  backgroundColor: BRAND_COLORS.white,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${BRAND_COLORS.info}15` }}
                      >
                        <Target
                          className="w-4 h-4"
                          style={{ color: BRAND_COLORS.info }}
                        />
                      </div>
                      <h3
                        className="font-semibold"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {metric.metric}
                      </h3>
                    </div>
                    <p
                      className="text-sm mb-3"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {metric.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: `${BRAND_COLORS.success}15`,
                          color: BRAND_COLORS.success,
                        }}
                      >
                        Target: {metric.target}
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: BRAND_COLORS.background,
                          color: BRAND_COLORS.textSecondary,
                        }}
                      >
                        Current: {metric.current}
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: `${BRAND_COLORS.warning}15`,
                          color: BRAND_COLORS.warning,
                        }}
                      >
                        Timeline: {metric.timeline}
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-right p-3 rounded-lg min-w-[80px]"
                    style={{ backgroundColor: `${BRAND_COLORS.info}10` }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: BRAND_COLORS.info }}
                    >
                      {metric.priority}
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      Priority
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
            {clientMetrics.length}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Client KPIs
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.info }}
          >
            {businessMetrics.length}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Business KPIs
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.success }}
          >
            50%+
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Avg. Improvement
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.warning }}
          >
            Tracked
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            All Metrics
          </p>
        </div>
      </div>
    </div>
  );
};
