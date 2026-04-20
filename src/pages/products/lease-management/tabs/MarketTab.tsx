// Lease Management - Market Tab Component
import React from "react";
import { targetAudiences } from "../data";
import {
  Target,
  Building2,
  Briefcase,
  MapPin,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
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

const segmentIcons: Record<
  string,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  "Corporate Real Estate Teams at Large Enterprises": Building2,
  "Commercial Real Estate Developers": Briefcase,
  "Retail Chains with Leased Store Locations": MapPin,
  "Co-working Space Operators": Users,
};

export const MarketTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <Target className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
        </div>
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Target Audience Analysis
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Understanding our market segments and their needs
          </p>
        </div>
      </div>

      {/* Market Overview Stats */}
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
            {targetAudiences.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Market Segments
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
            CRE
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Primary Focus
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
            style={{ color: BRAND_COLORS.primary }}
          >
            India
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Primary Market
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
            B2B
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Business Model
          </p>
        </div>
      </div>

      {/* Target Audience Cards */}
      <div className="space-y-6">
        {targetAudiences.map((audience, index) => {
          const IconComponent = segmentIcons[audience.segment] || Building2;
          return (
            <div
              key={index}
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {/* Segment Header */}
              <div
                className="px-5 py-4 flex items-center gap-3"
                style={{ backgroundColor: BRAND_COLORS.background }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                >
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: BRAND_COLORS.primary }}
                  />
                </div>
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {audience.segment}
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    Target Market Segment
                  </p>
                </div>
              </div>

              {/* Segment Content */}
              <div className="p-5 space-y-5">
                {/* Demographics */}
                {audience.demographics && (
                  <div className="flex items-start gap-3">
                    <Users
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: BRAND_COLORS.primary }}
                    />
                    <div>
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        Demographics
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        {audience.demographics}
                      </p>
                    </div>
                  </div>
                )}

                {/* Industry Profile */}
                {audience.industryProfile && (
                  <div className="flex items-start gap-3">
                    <TrendingUp
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: BRAND_COLORS.secondaryGreen }}
                    />
                    <div>
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        Industry Profile
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        {audience.industryProfile}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pain Points */}
                {audience.painPoints && audience.painPoints.length > 0 && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: "#D97706" }}
                    />
                    <div>
                      <h4
                        className="text-sm font-semibold mb-2"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        Pain Points
                      </h4>
                      <ul className="space-y-1">
                        {audience.painPoints.map((point, idx) => (
                          <li
                            key={idx}
                            className="text-sm flex items-start gap-2"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          >
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: "#D97706" }}
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Unsolved Problem */}
                {audience.unsolved && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: "#DC2626" }}
                    />
                    <div>
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        Unsolved Problem
                      </h4>
                      <p
                        className="text-sm p-3 rounded-lg"
                        style={{
                          backgroundColor: "#FEE2E2",
                          color: "#DC2626",
                        }}
                      >
                        {audience.unsolved}
                      </p>
                    </div>
                  </div>
                )}

                {/* Good Enough Alternative */}
                {audience.goodEnough && (
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: BRAND_COLORS.secondaryGreen }}
                    />
                    <div>
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        Current "Good Enough" Solution
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        {audience.goodEnough}
                      </p>
                    </div>
                  </div>
                )}

                {/* Urgency */}
                {audience.urgency && (
                  <div className="flex items-start gap-3">
                    <Clock
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: "#0D9488" }}
                    />
                    <div>
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        Urgency & Trigger
                      </h4>
                      <p
                        className="text-sm p-3 rounded-lg"
                        style={{
                          backgroundColor: BRAND_COLORS.primaryLight,
                          color: BRAND_COLORS.primary,
                          fontStyle: "italic",
                        }}
                      >
                        {audience.urgency}
                      </p>
                    </div>
                  </div>
                )}

                {/* Buyer Title */}
                {audience.buyerTitle && (
                  <div className="flex items-start gap-3">
                    <UserCheck
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: BRAND_COLORS.primary }}
                    />
                    <div>
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        Typical Buyer
                      </h4>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: BRAND_COLORS.primaryLight,
                          color: BRAND_COLORS.primary,
                        }}
                      >
                        {audience.buyerTitle}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Strategy Summary */}
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
          Market Strategy Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: BRAND_COLORS.primary }}
            >
              Primary Focus
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Corporate Real Estate Teams and Commercial Real Estate Developers
              with multiple properties requiring centralized lease tracking and
              compliance management.
            </p>
          </div>
          <div>
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: BRAND_COLORS.primary }}
            >
              Go-to-Market Approach
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Value-based selling focusing on cost savings, compliance
              automation (IND AS 116), and operational efficiency gains for
              lease portfolio management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTab;
