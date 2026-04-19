// Lease Management - Pricing Tab Component
import React, { useState } from "react";
import { featureComparisons, pricingTiers } from "../data";
import {
  DollarSign,
  Check,
  X,
  Star,
  Minus,
  Building2,
  Users,
  Shield,
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

const tierIcons: Record<
  string,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  Starter: Building2,
  Professional: Users,
  Enterprise: Shield,
};

export const PricingTab: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const renderValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check
          className="w-5 h-5 mx-auto"
          style={{ color: BRAND_COLORS.secondaryGreen }}
        />
      ) : (
        <X className="w-5 h-5 mx-auto" style={{ color: "#DC2626" }} />
      );
    }
    if (value === "—" || value === "-") {
      return (
        <Minus
          className="w-4 h-4 mx-auto"
          style={{ color: BRAND_COLORS.textSecondary }}
        />
      );
    }
    return (
      <span className="text-sm" style={{ color: BRAND_COLORS.text }}>
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <DollarSign
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
            Pricing & Feature Comparison
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Compare plans and choose what's right for your business
          </p>
        </div>
      </div>

      {/* Pricing Tiers Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {pricingTiers.map((tier, index) => {
          const IconComponent = tierIcons[tier.name] || Building2;
          const isPopular = tier.name === "Professional";

          return (
            <div
              key={index}
              className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                selectedTier === tier.name ? "ring-2 ring-[#DA7756]" : ""
              }`}
              style={{
                borderColor: isPopular
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div
                  className="px-4 py-2 text-center text-sm font-medium"
                  style={{
                    backgroundColor: BRAND_COLORS.primary,
                    color: BRAND_COLORS.white,
                  }}
                >
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}

              {/* Tier Header */}
              <div
                className="p-6 text-center border-b"
                style={{ borderColor: BRAND_COLORS.cardBorder }}
              >
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                >
                  <IconComponent
                    className="w-6 h-6"
                    style={{ color: BRAND_COLORS.primary }}
                  />
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  {tier.name}
                </h3>
                <div className="mt-3">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: BRAND_COLORS.primary }}
                  >
                    {tier.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    {" "}
                    {tier.billing || tier.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm">
                      <Check
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: BRAND_COLORS.secondaryGreen }}
                      />
                      <span style={{ color: BRAND_COLORS.text }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedTier(tier.name)}
                  className="w-full mt-6 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isPopular
                      ? BRAND_COLORS.primary
                      : "transparent",
                    color: isPopular
                      ? BRAND_COLORS.white
                      : BRAND_COLORS.primary,
                    borderWidth: 1,
                    borderColor: BRAND_COLORS.primary,
                  }}
                >
                  {isPopular ? "Get Started" : "Select Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-12">
        <h3
          className="text-lg font-semibold mb-4"
          style={{
            color: BRAND_COLORS.text,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Market Feature Comparison
        </h3>
        <div
          className="rounded-lg border overflow-hidden overflow-x-auto"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Feature Area
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  Market Standard
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  Our Product
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {featureComparisons.map((comparison, index) => (
                <tr
                  key={index}
                  className="border-t"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-medium"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {comparison.area || comparison.feature}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {comparison.marketStandard || "-"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {comparison.ourProduct || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          comparison.status === "AHEAD"
                            ? `${BRAND_COLORS.success}40`
                            : comparison.status === "GAP"
                              ? "#FEE2E2"
                              : `${BRAND_COLORS.warning}40`,
                        color:
                          comparison.status === "AHEAD"
                            ? "#059669"
                            : comparison.status === "GAP"
                              ? "#DC2626"
                              : "#D97706",
                      }}
                    >
                      {comparison.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Sales CTA */}
      <div
        className="rounded-xl border p-6 text-center"
        style={{
          borderColor: BRAND_COLORS.primary,
          backgroundColor: BRAND_COLORS.primaryLight,
        }}
      >
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: BRAND_COLORS.text }}
        >
          Need a Custom Solution?
        </h3>
        <p
          className="text-sm mb-4"
          style={{ color: BRAND_COLORS.textSecondary }}
        >
          Contact our sales team for enterprise pricing and custom
          configurations
        </p>
        <button
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: BRAND_COLORS.primary,
            color: BRAND_COLORS.white,
          }}
        >
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default PricingTab;
