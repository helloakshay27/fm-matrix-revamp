// Lease Management - Features Tab Component
import React, { useState } from "react";
import { features, lessorFeatures } from "../data";
import { Star } from "lucide-react";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  darkBg: "#1e293b",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
};

export const FeaturesTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");

  const currentFeatures = perspective === "lessee" ? features : lessorFeatures;

  return (
    <div className="space-y-6">
      {/* Perspective Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setPerspective("lessee")}
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor:
              perspective === "lessee"
                ? BRAND_COLORS.darkBg
                : BRAND_COLORS.white,
            color:
              perspective === "lessee" ? BRAND_COLORS.white : BRAND_COLORS.text,
            border: `1px solid ${BRAND_COLORS.cardBorder}`,
          }}
        >
          Lessee Perspective ({features.length} Features)
        </button>
        <button
          onClick={() => setPerspective("lessor")}
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor:
              perspective === "lessor"
                ? BRAND_COLORS.darkBg
                : BRAND_COLORS.white,
            color:
              perspective === "lessor" ? BRAND_COLORS.white : BRAND_COLORS.text,
            border: `1px solid ${BRAND_COLORS.cardBorder}`,
          }}
        >
          Lessor Perspective ({lessorFeatures.length} Features)
        </button>
      </div>

      {/* Features Table */}
      <div
        className="overflow-x-auto rounded-lg border"
        style={{ borderColor: BRAND_COLORS.cardBorder }}
      >
        <table className="w-full text-sm" style={{ color: BRAND_COLORS.text }}>
          <thead>
            <tr
              style={{
                backgroundColor: BRAND_COLORS.darkBg,
                color: BRAND_COLORS.white,
              }}
            >
              <th className="px-3 py-3 text-left font-semibold w-10">#</th>
              <th className="px-3 py-3 text-left font-semibold w-48">Module</th>
              <th className="px-3 py-3 text-left font-semibold w-48">
                Feature
              </th>
              <th className="px-3 py-3 text-left font-semibold">
                How It Works
              </th>
              <th className="px-3 py-3 text-left font-semibold w-48">
                User Type
              </th>
              <th className="px-3 py-3 text-center font-semibold w-20">
                Is USP
              </th>
            </tr>
          </thead>
          <tbody>
            {currentFeatures.map((feature, index) => (
              <tr
                key={feature.id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? BRAND_COLORS.white
                      : BRAND_COLORS.background,
                  borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                }}
              >
                <td className="px-3 py-3 font-medium">{feature.id}</td>
                <td className="px-3 py-3 font-medium">{feature.module}</td>
                <td className="px-3 py-3 font-medium">{feature.feature}</td>
                <td
                  className="px-3 py-3"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  {feature.howItWorks}
                </td>
                <td
                  className="px-3 py-3"
                  style={{ color: BRAND_COLORS.textSecondary }}
                >
                  {feature.userType}
                </td>
                <td className="px-3 py-3 text-center">
                  {feature.isUSP ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(34,197,94,0.1)",
                        color: "#16a34a",
                      }}
                    >
                      <Star className="w-3 h-3" /> Yes
                    </span>
                  ) : (
                    <span style={{ color: BRAND_COLORS.textSecondary }}>
                      No
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeaturesTab;
