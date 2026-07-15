// Snag360 New - Market Tab Component
import React from "react";
import { marketStats, targetIndustries, competitors } from "../data";
import { Globe, TrendingUp, Building2, Users, Target, Zap } from "lucide-react";

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

export const MarketTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
        >
          <Globe className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
        </div>
        <h2
          className="text-xl font-semibold"
          style={{
            color: BRAND_COLORS.text,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Market Analysis
        </h2>
      </div>

      {/* Market Stats Grid */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: BRAND_COLORS.text }}
        >
          Market Size & Growth
        </h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            className="rounded-lg border p-4 text-center"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.primary }}
            >
              {marketStats.globalMarket}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Global CQMS Market
            </p>
          </div>
          <div
            className="rounded-lg border p-4 text-center"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.success }}
            >
              {marketStats.globalCAGR}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Global CAGR
            </p>
          </div>
          <div
            className="rounded-lg border p-4 text-center"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.primary }}
            >
              {marketStats.indiaMarket}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              India CQMS Market
            </p>
          </div>
          <div
            className="rounded-lg border p-4 text-center"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.success }}
            >
              {marketStats.asiaPacificCAGR}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              APAC CAGR (Fastest)
            </p>
          </div>
          <div
            className="rounded-lg border p-4 text-center"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.info }}
            >
              {marketStats.indiaConstructionMarket}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              India Construction
            </p>
          </div>
          <div
            className="rounded-lg border p-4 text-center"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.success }}
            >
              {marketStats.indiaConstructionCAGR}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              India CAGR
            </p>
          </div>
        </div>
      </section>

      {/* Target Industries */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.success}15` }}
          >
            <Building2
              className="w-5 h-5"
              style={{ color: BRAND_COLORS.success }}
            />
          </div>
          <h3
            className="text-lg font-semibold"
            style={{ color: BRAND_COLORS.text }}
          >
            Target Industries
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {targetIndustries.map((industry, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: BRAND_COLORS.primary }}
                >
                  {index + 1}
                </div>
                <div>
                  <h4
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {industry.industry}
                  </h4>
                  <p
                    className="text-sm mt-1"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    {industry.description}
                  </p>
                  <div
                    className="mt-2 p-2 rounded text-xs"
                    style={{
                      backgroundColor: `${BRAND_COLORS.success}10`,
                      color: BRAND_COLORS.success,
                    }}
                  >
                    <strong>Opportunity:</strong> {industry.opportunity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor Analysis */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.warning}15` }}
          >
            <Target
              className="w-5 h-5"
              style={{ color: BRAND_COLORS.warning }}
            />
          </div>
          <h3
            className="text-lg font-semibold"
            style={{ color: BRAND_COLORS.text }}
          >
            Competitor Analysis
          </h3>
        </div>
        <div
          className="rounded-lg border overflow-x-auto"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Competitor
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Category
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Coverage
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.success }}
                >
                  Key Strength
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: "#E53935" }}
                >
                  Key Weakness
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  Snag 360 Advantage
                </th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor, index) => (
                <tr
                  key={index}
                  className="border-t"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="font-semibold"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {competitor.name}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    {competitor.category}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    {competitor.coverage}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${BRAND_COLORS.success}10`,
                        color: BRAND_COLORS.success,
                      }}
                    >
                      {competitor.keyStrength}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: "#FFEBEE",
                        color: "#E53935",
                      }}
                    >
                      {competitor.keyWeakness}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{
                        backgroundColor: `${BRAND_COLORS.primary}15`,
                        color: BRAND_COLORS.primary,
                      }}
                    >
                      {competitor.snag360Advantage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
