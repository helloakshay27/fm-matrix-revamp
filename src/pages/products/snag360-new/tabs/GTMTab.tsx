// Snag360 New - GTM (Go-To-Market) Tab Component
import React, { useState } from "react";
import { gtmTargetGroups } from "../data";
import {
  Target,
  Users,
  Megaphone,
  TrendingUp,
  ChevronRight,
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

export const GTMTab: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<number>(0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
        >
          <Megaphone
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
          Go-To-Market Strategy
        </h2>
      </div>

      {/* Target Group Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {gtmTargetGroups.map((group, index) => (
          <button
            key={index}
            className="p-4 rounded-lg border text-left transition-all"
            style={{
              borderColor:
                activeGroup === index
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
              backgroundColor:
                activeGroup === index
                  ? `${BRAND_COLORS.primary}10`
                  : BRAND_COLORS.white,
            }}
            onClick={() => setActiveGroup(index)}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor:
                    activeGroup === index
                      ? BRAND_COLORS.primary
                      : BRAND_COLORS.background,
                }}
              >
                <Users
                  className="w-5 h-5"
                  style={{
                    color:
                      activeGroup === index
                        ? BRAND_COLORS.white
                        : BRAND_COLORS.primary,
                  }}
                />
              </div>
              <div>
                <h3
                  className="font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  {group.segment}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  {group.characteristics}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Group Details */}
      {gtmTargetGroups[activeGroup] && (
        <div
          className="rounded-lg border p-6"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <div className="mb-6">
            <h3
              className="text-lg font-semibold"
              style={{ color: BRAND_COLORS.text }}
            >
              {gtmTargetGroups[activeGroup].segment}
            </h3>
            <p
              className="text-sm mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              {gtmTargetGroups[activeGroup].characteristics}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pain Points */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4" style={{ color: "#E53935" }} />
                <h4
                  className="text-sm font-semibold uppercase"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Pain Points
                </h4>
              </div>
              <div className="space-y-2">
                {gtmTargetGroups[activeGroup].painPoints.map((pain, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded"
                    style={{ backgroundColor: "#FFEBEE" }}
                  >
                    <ChevronRight
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: "#E53935" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {pain}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Messaging */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Megaphone
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.info }}
                />
                <h4
                  className="text-sm font-semibold uppercase"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Key Messaging
                </h4>
              </div>
              <div className="space-y-2">
                {gtmTargetGroups[activeGroup].messaging.map((msg, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded"
                    style={{ backgroundColor: `${BRAND_COLORS.info}10` }}
                  >
                    <ChevronRight
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: BRAND_COLORS.info }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.success }}
                />
                <h4
                  className="text-sm font-semibold uppercase"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Channels
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {gtmTargetGroups[activeGroup].channels.map((channel, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${BRAND_COLORS.success}15`,
                      color: BRAND_COLORS.success,
                    }}
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.warning }}
                />
                <h4
                  className="text-sm font-semibold uppercase"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Success Metrics
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {gtmTargetGroups[activeGroup].successMetrics.map(
                  (metric, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: `${BRAND_COLORS.warning}15`,
                        color: BRAND_COLORS.warning,
                      }}
                    >
                      {metric}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GTM Summary */}
      <div
        className="rounded-lg p-6"
        style={{ backgroundColor: BRAND_COLORS.background }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: BRAND_COLORS.text }}
        >
          GTM Strategy Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {gtmTargetGroups.map((group, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              <h4
                className="font-semibold mb-2"
                style={{ color: BRAND_COLORS.text }}
              >
                {group.segment}
              </h4>
              <div className="space-y-2 text-sm">
                <p style={{ color: BRAND_COLORS.textSecondary }}>
                  <strong>Focus:</strong> {group.characteristics}
                </p>
                <p style={{ color: BRAND_COLORS.textSecondary }}>
                  <strong>Primary Channels:</strong>{" "}
                  {group.channels.slice(0, 2).join(", ")}
                </p>
                <p style={{ color: BRAND_COLORS.textSecondary }}>
                  <strong>Key Metric:</strong> {group.successMetrics[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
