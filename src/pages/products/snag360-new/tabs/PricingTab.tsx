// Snag360 New - Pricing Tab Component
import React from "react";
import { pricingTiers, competitivePositioning, buyerValueProps } from "../data";
import { DollarSign, Check, Star, TrendingUp, Shield } from "lucide-react";

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

export const PricingTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
        >
          <DollarSign
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
          Pricing & Plans
        </h2>
      </div>

      {/* Pricing Tiers */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: BRAND_COLORS.text }}
        >
          Pricing Tiers
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-lg border p-6 relative ${
                tier.recommended ? "ring-2 transform md:-translate-y-2" : ""
              }`}
              style={{
                borderColor: tier.recommended
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
                ...(tier.recommended
                  ? { boxShadow: `0 0 0 2px ${BRAND_COLORS.primary}` }
                  : {}),
              }}
            >
              {tier.recommended && (
                <div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: BRAND_COLORS.primary }}
                >
                  <Star className="w-3 h-3 inline mr-1" />
                  Recommended
                </div>
              )}
              <div className="text-center mb-4">
                <h4
                  className="text-lg font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  {tier.name}
                </h4>
                <p
                  className="text-sm mt-1"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  {tier.target}
                </p>
              </div>
              <div className="text-center mb-4">
                <div
                  className="text-3xl font-bold"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  {tier.price}
                </div>
                <p
                  className="text-xs"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  {tier.billing}
                </p>
              </div>
              <div className="space-y-2 mb-4">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: BRAND_COLORS.success }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="p-3 rounded-lg text-xs"
                style={{
                  backgroundColor: BRAND_COLORS.background,
                }}
              >
                <strong style={{ color: BRAND_COLORS.text }}>Best for:</strong>
                <p
                  className="mt-1"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  {tier.bestFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitive Positioning */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.success}15` }}
          >
            <TrendingUp
              className="w-5 h-5"
              style={{ color: BRAND_COLORS.success }}
            />
          </div>
          <h3
            className="text-lg font-semibold"
            style={{ color: BRAND_COLORS.text }}
          >
            Competitive Positioning
          </h3>
        </div>
        <div
          className="rounded-lg border overflow-x-auto"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Factor
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-semibold"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  Snag 360
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-semibold"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  Enterprise ERP
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-semibold"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  Point Solutions
                </th>
              </tr>
            </thead>
            <tbody>
              {competitivePositioning.map((item, index) => (
                <tr
                  key={index}
                  className="border-t"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.factor}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="text-sm px-2 py-1 rounded font-medium"
                      style={{
                        backgroundColor: `${BRAND_COLORS.primary}15`,
                        color: BRAND_COLORS.primary,
                      }}
                    >
                      {item.snag360}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="text-sm"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {item.enterpriseERP}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="text-sm"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {item.pointSolutions}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Buyer Value Props */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.info}15` }}
          >
            <Shield className="w-5 h-5" style={{ color: BRAND_COLORS.info }} />
          </div>
          <h3
            className="text-lg font-semibold"
            style={{ color: BRAND_COLORS.text }}
          >
            Value Propositions by Buyer
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {buyerValueProps.map((buyer, index) => (
            <div
              key={index}
              className="rounded-lg border p-5"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              <h4
                className="font-semibold mb-3 pb-2 border-b"
                style={{
                  color: BRAND_COLORS.text,
                  borderColor: BRAND_COLORS.cardBorder,
                }}
              >
                {buyer.buyer}
              </h4>
              <ul className="space-y-2">
                {buyer.valueProps.map((prop, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: BRAND_COLORS.primary }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {prop}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Note */}
      <div
        className="rounded-lg p-4 border"
        style={{
          backgroundColor: `${BRAND_COLORS.warning}10`,
          borderColor: BRAND_COLORS.warning,
        }}
      >
        <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
          <strong>Note:</strong> Pricing may vary based on project scope,
          customization requirements, and volume licensing. Contact sales for
          enterprise quotes and multi-project discounts.
        </p>
      </div>
    </div>
  );
};
