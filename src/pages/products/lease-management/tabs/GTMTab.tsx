// Lease Management - GTM (Go-to-Market) Tab Component
import React, { useState } from "react";
import { gtmTargetGroups } from "../data";
import {
  Rocket,
  Target,
  ChevronDown,
  ChevronUp,
  Users,
  Building2,
  Briefcase,
  ShoppingBag,
  Warehouse,
  Landmark,
  FileText,
  CheckCircle2,
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

const targetGroupIcons: Record<
  string,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  "Retail Chains (100+ Stores)": ShoppingBag,
  "BFSI Enterprises (50+ Branches)": Building2,
  "Property Management Companies": Briefcase,
  "Industrial and Logistics Companies": Warehouse,
  "Government and PSUs": Landmark,
  Default: Users,
};

export const GTMTab: React.FC = () => {
  const [expandedGroup, setExpandedGroup] = useState<number | null>(0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <Rocket className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
        </div>
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Go-to-Market Strategy
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Target groups and sales approach
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
            {gtmTargetGroups.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Target Groups
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
            Direct
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Sales Model
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
            B2B
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Focus
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
            India
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Primary Market
          </p>
        </div>
      </div>

      {/* Target Groups Accordion */}
      <div className="space-y-4">
        {gtmTargetGroups.map((group, index) => {
          const groupName = group.name || group.targetGroup || "Target Group";
          const IconComponent =
            targetGroupIcons[groupName] || targetGroupIcons["Default"];
          const isExpanded = expandedGroup === index;

          return (
            <div
              key={index}
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: isExpanded
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {/* Group Header */}
              <button
                onClick={() => setExpandedGroup(isExpanded ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between transition-colors hover:bg-gray-50"
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
                      {groupName}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {group.elements
                        ? `${group.elements.length} sales elements`
                        : "Target Audience Segment"}
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

              {/* Group Content - New structure for elements */}
              {isExpanded && group.elements && (
                <div
                  className="p-5 border-t space-y-4"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  {group.elements.map((elem, elemIndex) => (
                    <div key={elemIndex} className="flex items-start gap-3">
                      <div
                        className="p-1.5 rounded-lg mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                      >
                        <FileText
                          className="w-4 h-4"
                          style={{ color: BRAND_COLORS.primary }}
                        />
                      </div>
                      <div>
                        <h4
                          className="text-sm font-semibold mb-1"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {elem.element}
                        </h4>
                        <p
                          className="text-sm"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {elem.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback for old data structure */}
              {isExpanded &&
                !group.elements &&
                (group.painPoint || group.messaging) && (
                  <div
                    className="p-5 border-t space-y-5"
                    style={{ borderColor: BRAND_COLORS.cardBorder }}
                  >
                    {group.painPoint && (
                      <div className="flex items-start gap-3">
                        <div
                          className="p-1.5 rounded-lg mt-0.5"
                          style={{
                            backgroundColor: `${BRAND_COLORS.warning}30`,
                          }}
                        >
                          <Target
                            className="w-4 h-4"
                            style={{ color: "#D97706" }}
                          />
                        </div>
                        <div>
                          <h4
                            className="text-sm font-semibold mb-1"
                            style={{ color: BRAND_COLORS.text }}
                          >
                            Pain Point
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          >
                            {group.painPoint}
                          </p>
                        </div>
                      </div>
                    )}
                    {group.messaging && (
                      <div className="flex items-start gap-3">
                        <div
                          className="p-1.5 rounded-lg mt-0.5"
                          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                        >
                          <Rocket
                            className="w-4 h-4"
                            style={{ color: BRAND_COLORS.primary }}
                          />
                        </div>
                        <div>
                          <h4
                            className="text-sm font-semibold mb-1"
                            style={{ color: BRAND_COLORS.text }}
                          >
                            Key Messaging
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          >
                            {group.messaging}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* GTM Strategy Summary */}
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
          <Rocket className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
          GTM Execution Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: BRAND_COLORS.primary }}
            >
              Key Channels
            </h4>
            <ul className="space-y-2">
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: BRAND_COLORS.text }}
              >
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.secondaryGreen }}
                />
                Direct Enterprise Sales
              </li>
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: BRAND_COLORS.text }}
              >
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.secondaryGreen }}
                />
                Industry Events & Conferences
              </li>
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: BRAND_COLORS.text }}
              >
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.secondaryGreen }}
                />
                Content Marketing & Webinars
              </li>
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: BRAND_COLORS.text }}
              >
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.secondaryGreen }}
                />
                Partner Referral Program
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: BRAND_COLORS.primary }}
            >
              Success Metrics
            </h4>
            <ul className="space-y-2">
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: BRAND_COLORS.text }}
              >
                <Target
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.primary }}
                />
                Qualified Lead Generation
              </li>
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: BRAND_COLORS.text }}
              >
                <Target
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.primary }}
                />
                Demo-to-Trial Conversion
              </li>
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: BRAND_COLORS.text }}
              >
                <Target
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.primary }}
                />
                Sales Cycle Duration
              </li>
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: BRAND_COLORS.text }}
              >
                <Target
                  className="w-4 h-4"
                  style={{ color: BRAND_COLORS.primary }}
                />
                Customer Acquisition Cost
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GTMTab;
