// Lease Management - Pricing Tab Component (Features and Pricing)
import React, { useState } from "react";
import {
  featureComparisons,
  lesseeCompetitiveSummary,
  standardPricingModels,
  typicalPriceRanges,
  competitorFeaturePlans,
  recommendedPricingLessee,
  lesseePositioning,
  lesseeValuePropositions,
  lessorFeatureComparisons,
  lessorCompetitiveSummary,
  lessorPricingModels,
  recommendedPricingLessor,
  lessorPositioning,
  lessorValuePropositions,
} from "../data";
import { Building2, Home } from "lucide-react";

const BRAND_COLORS = {
  primary: "#DA7756",
  primaryLight: "rgba(218, 119, 86, 0.1)",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
  darkBg: "#DA7756",
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold text-white"
    style={{
      backgroundColor:
        status === "AHEAD"
          ? "#059669"
          : status === "GAP"
            ? "#DC2626"
            : "#D97706",
    }}
  >
    {status}
  </span>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="px-4 py-3 rounded-t-lg font-semibold text-sm"
    style={{
      backgroundColor: BRAND_COLORS.darkBg,
      color: "#fff",
      fontFamily: "Poppins, sans-serif",
    }}
  >
    {children}
  </div>
);

const SubSectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="px-3 py-2 rounded-t-lg text-xs font-bold text-white"
    style={{ backgroundColor: BRAND_COLORS.primary }}
  >
    {children}
  </div>
);

type Perspective = "lessee" | "lessor";

export const PricingTab: React.FC = () => {
  const [perspective, setPerspective] = useState<Perspective>("lessee");

  // ===================== LESSEE =====================
  const renderLessee = () => (
    <div className="space-y-10">
      {/* SECTION 1 */}
      <div>
        <SectionTitle>
          SECTION 1 - CURRENT FEATURES VS MARKET STANDARD
        </SectionTitle>
        <div
          className="rounded-b-lg border border-t-0 overflow-x-auto"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white w-[14%]">
                  Feature Area
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[20%]">
                  Market Standard (what most products offer)
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[22%]">
                  Our Product - What we offer
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-white w-[8%]">
                  Status
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[22%]">
                  Why it matters to target revenue / strategy
                </th>
              </tr>
            </thead>
            <tbody>
              {featureComparisons.map((c, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{
                    borderColor: BRAND_COLORS.cardBorder,
                    backgroundColor:
                      i % 2 === 0
                        ? BRAND_COLORS.white
                        : BRAND_COLORS.background,
                  }}
                >
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {c.area || c.feature}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {c.marketStandard || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {c.ourProduct || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {c.status && <StatusBadge status={c.status} />}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {c.whyMatters || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY - COMPETITIVE POSITION */}
      <div>
        <SectionTitle>
          SUMMARY - COMPETITIVE POSITION AND PRICING MODEL IMPACT
        </SectionTitle>
        <div
          className="rounded-b-lg border border-t-0 overflow-x-auto"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white w-[20%]">
                  Category
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[45%]">
                  Detail
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[35%]">
                  Implication
                </th>
              </tr>
            </thead>
            <tbody>
              {lesseeCompetitiveSummary.map((item, i) => {
                const isAhead = item.category.includes("AHEAD");
                const isGap = item.category.includes("GAP");
                const color = isAhead
                  ? "#059669"
                  : isGap
                    ? "#DC2626"
                    : "#D97706";
                return (
                  <tr
                    key={i}
                    className="border-t"
                    style={{ borderColor: BRAND_COLORS.cardBorder }}
                  >
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-bold" style={{ color }}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-xs"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {item.detail}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-xs"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        {item.implication}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2 - PRICING LANDSCAPE */}
      <div>
        <SectionTitle>
          SECTION 2 - PRICING LANDSCAPE AND RECOMMENDED PRICING
        </SectionTitle>
        <div className="space-y-6 mt-4">
          {/* 2A */}
          <div>
            <SubSectionTitle>
              2A - STANDARD PRICING MODELS IN THIS CATEGORY
            </SubSectionTitle>
            <div
              className="rounded-b-lg border border-t-0"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              {standardPricingModels.map((m, i) => (
                <div
                  key={i}
                  className="px-4 py-3 border-b last:border-b-0"
                  style={{
                    borderColor: BRAND_COLORS.cardBorder,
                    backgroundColor:
                      i % 2 === 0
                        ? BRAND_COLORS.white
                        : BRAND_COLORS.background,
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: BRAND_COLORS.primary }}
                  >
                    {m.question}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {m.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2B */}
          <div>
            <SubSectionTitle>
              2B - TYPICAL PRICE RANGES (INDIA vs GLOBAL)
            </SubSectionTitle>
            <div
              className="rounded-b-lg border border-t-0 overflow-x-auto"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white">
                      Tier
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      India - Per User/Month (Annual billing)
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      India - Who is this tier for?
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      Global - Per User/Month (Annual billing)
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      Global - Who is this tier for?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typicalPriceRanges.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t"
                      style={{
                        borderColor: BRAND_COLORS.cardBorder,
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: BRAND_COLORS.primary }}
                        >
                          {r.tier}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {r.indiaPrice}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {r.indiaWho}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {r.globalPrice}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {r.globalWho}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2C */}
          <div>
            <SubSectionTitle>
              2C - HOW COMPETITORS CATEGORISE FEATURES ACROSS PLANS
            </SubSectionTitle>
            <div
              className="rounded-b-lg border border-t-0 overflow-x-auto"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white">
                      Feature
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/90">
                      Free / Starter
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/90">
                      Professional / Growth
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-white/90">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competitorFeaturePlans.map((f, i) => (
                    <tr
                      key={i}
                      className="border-t"
                      style={{
                        borderColor: BRAND_COLORS.cardBorder,
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td className="px-3 py-2">
                        <span
                          className="text-xs font-medium"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {f.feature}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`text-xs ${f.freeStarter === "Not available" ? "text-red-400" : ""}`}
                          style={{
                            color:
                              f.freeStarter === "Not available"
                                ? undefined
                                : BRAND_COLORS.text,
                          }}
                        >
                          {f.freeStarter}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`text-xs ${f.professionalGrowth === "Not available" ? "text-red-400" : ""}`}
                          style={{
                            color:
                              f.professionalGrowth === "Not available"
                                ? undefined
                                : BRAND_COLORS.text,
                          }}
                        >
                          {f.professionalGrowth}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {f.enterprise}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2D */}
          <div>
            <SubSectionTitle>
              2D - RECOMMENDED PRICING: NOW / 6 MONTHS / 18 MONTHS
            </SubSectionTitle>
            <div
              className="rounded-b-lg border border-t-0 overflow-x-auto"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white">
                      Pricing Stage
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      India - Entry Tier
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      India - Mid Market
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      Global - Entry Tier
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      Global - Mid Market
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recommendedPricingLessee.map((p, i) => (
                    <tr
                      key={i}
                      className="border-t"
                      style={{
                        borderColor: BRAND_COLORS.cardBorder,
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: BRAND_COLORS.primary }}
                        >
                          {p.pricingStage}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {p.indiaEntryTier}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {p.indiaMidMarket}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {p.globalEntryTier}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {p.globalMidMarket}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {p.notes}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div>
        <SectionTitle>SECTION 3 - HOW TO POSITION OURSELVES</SectionTitle>
        <div
          className="rounded-b-lg border border-t-0"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          {lesseePositioning.map((p, i) => (
            <div
              key={i}
              className="px-4 py-3 border-b last:border-b-0"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor:
                  i % 2 === 0 ? BRAND_COLORS.white : BRAND_COLORS.background,
              }}
            >
              <p
                className="text-xs font-bold mb-1"
                style={{ color: BRAND_COLORS.primary }}
              >
                {p.label}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: BRAND_COLORS.text }}
              >
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 */}
      <div>
        <SectionTitle>
          SECTION 4 - VALUE PROPOSITIONS AND SUGGESTED IMPROVEMENTS
        </SectionTitle>
        <div
          className="rounded-b-lg border border-t-0 overflow-x-auto"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white w-[18%]">
                  Value Proposition (Current)
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[15%]">
                  Who it resonates with
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[22%]">
                  What is weak about it
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[35%]">
                  Improved Value Proposition (sharper, outcome-led, specific)
                </th>
              </tr>
            </thead>
            <tbody>
              {lesseeValuePropositions.map((v, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{
                    borderColor: BRAND_COLORS.cardBorder,
                    backgroundColor:
                      i % 2 === 0
                        ? BRAND_COLORS.white
                        : BRAND_COLORS.background,
                  }}
                >
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {v.currentValue}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {v.whoResonates}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {v.whatsWeak}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {v.improvedValue}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ===================== LESSOR =====================
  const renderLessor = () => (
    <div className="space-y-10">
      {/* SECTION 1 */}
      <div>
        <SectionTitle>
          SECTION 1 — CURRENT FEATURES VS MARKET STANDARD (LESSOR)
        </SectionTitle>
        <div
          className="rounded-b-lg border border-t-0 overflow-x-auto"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white w-[18%]">
                  Feature Area
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[28%]">
                  Market Standard (what most lessor products offer)
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[28%]">
                  Our Product — What we offer
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-white w-[8%]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {lessorFeatureComparisons.map((c, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{
                    borderColor: BRAND_COLORS.cardBorder,
                    backgroundColor:
                      i % 2 === 0
                        ? BRAND_COLORS.white
                        : BRAND_COLORS.background,
                  }}
                >
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {c.area}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {c.marketStandard}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {c.ourProduct}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY */}
      <div>
        <SectionTitle>
          SUMMARY — COMPETITIVE POSITION AND PRICING MODEL IMPACT (LESSOR)
        </SectionTitle>
        <div
          className="rounded-b-lg border border-t-0"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          {lessorCompetitiveSummary.map((item, i) => {
            const isAhead = item.category.includes("AHEAD");
            const isGap = item.category.includes("GAP");
            const color = isAhead ? "#059669" : isGap ? "#DC2626" : "#D97706";
            return (
              <div
                key={i}
                className="px-4 py-3 border-b last:border-b-0"
                style={{
                  borderColor: BRAND_COLORS.cardBorder,
                  backgroundColor:
                    i % 2 === 0 ? BRAND_COLORS.white : BRAND_COLORS.background,
                }}
              >
                <p className="text-xs font-bold mb-1" style={{ color }}>
                  {item.category}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: BRAND_COLORS.text }}
                >
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 */}
      <div>
        <SectionTitle>
          SECTION 2 — PRICING LANDSCAPE AND RECOMMENDED PRICING (LESSOR)
        </SectionTitle>
        <div className="space-y-6 mt-4">
          {/* 2A */}
          <div>
            <SubSectionTitle>
              2A — STANDARD PRICING MODELS IN THE LESSOR PROPERTY MANAGEMENT
              CATEGORY
            </SubSectionTitle>
            <div
              className="rounded-b-lg border border-t-0 overflow-x-auto"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white">
                      Pricing Model
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      How It Works
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      Who Uses It
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      India Applicability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessorPricingModels.map((m, i) => (
                    <tr
                      key={i}
                      className="border-t"
                      style={{
                        borderColor: BRAND_COLORS.cardBorder,
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: BRAND_COLORS.primary }}
                        >
                          {m.model}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {m.howItWorks}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {m.whoUsesIt}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {m.indiaApplicability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2D */}
          <div>
            <SubSectionTitle>
              2D — RECOMMENDED PRICING (NOW / 6 MONTHS / 18 MONTHS) — LESSOR
            </SubSectionTitle>
            <div
              className="rounded-b-lg border border-t-0 overflow-x-auto"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white">
                      Segment
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      Now
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      6 Months
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90">
                      18 Months
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recommendedPricingLessor.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t"
                      style={{
                        borderColor: BRAND_COLORS.cardBorder,
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: BRAND_COLORS.primary }}
                        >
                          {r.segment}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {r.now}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {r.sixMonths}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-xs"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {r.eighteenMonths}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div>
        <SectionTitle>
          SECTION 3 — HOW TO POSITION OURSELVES (LESSOR)
        </SectionTitle>
        <div
          className="rounded-b-lg border border-t-0"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          {lessorPositioning.map((p, i) => (
            <div
              key={i}
              className="px-4 py-3 border-b last:border-b-0"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor:
                  i % 2 === 0 ? BRAND_COLORS.white : BRAND_COLORS.background,
              }}
            >
              <p
                className="text-xs font-bold mb-1"
                style={{ color: BRAND_COLORS.primary }}
              >
                {p.level}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: BRAND_COLORS.text }}
              >
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 */}
      <div>
        <SectionTitle>
          SECTION 4 — VALUE PROPOSITIONS AND SUGGESTED IMPROVEMENTS (LESSOR)
        </SectionTitle>
        <div
          className="rounded-b-lg border border-t-0 overflow-x-auto"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.primary }}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white w-[18%]">
                  Title
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[40%]">
                  Current State / What to Say
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white/90 w-[42%]">
                  Improved Value / What to Build
                </th>
              </tr>
            </thead>
            <tbody>
              {lessorValuePropositions.map((v, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{
                    borderColor: BRAND_COLORS.cardBorder,
                    backgroundColor:
                      i % 2 === 0
                        ? BRAND_COLORS.white
                        : BRAND_COLORS.background,
                  }}
                >
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: BRAND_COLORS.primary }}
                    >
                      {v.title}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {v.currentState}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {v.improvedValue}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Perspective Toggle */}
      <div
        className="flex gap-2 p-1 rounded-xl"
        style={{ backgroundColor: BRAND_COLORS.background }}
      >
        <button
          onClick={() => setPerspective("lessee")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor:
              perspective === "lessee" ? BRAND_COLORS.darkBg : "transparent",
            color:
              perspective === "lessee" ? "#fff" : BRAND_COLORS.textSecondary,
          }}
        >
          <Building2 className="w-4 h-4" /> LESSEE PERSPECTIVE
        </button>
        <button
          onClick={() => setPerspective("lessor")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor:
              perspective === "lessor" ? BRAND_COLORS.darkBg : "transparent",
            color:
              perspective === "lessor" ? "#fff" : BRAND_COLORS.textSecondary,
          }}
        >
          <Home className="w-4 h-4" /> LESSOR PERSPECTIVE
        </button>
      </div>

      {/* Content */}
      {perspective === "lessee" ? renderLessee() : renderLessor()}
    </div>
  );
};

export default PricingTab;
