// Snag360 New - Summary Tab Component
import React from "react";
import {
  productIdentity,
  painPoints,
  targetUsers,
  currentState,
  featureSummary,
  productMetadata,
} from "../data";
import {
  Building2,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Shield,
  Smartphone,
} from "lucide-react";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  primaryLight: "#e8957a",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
  success: "#4CAF50",
  warning: "#FFC107",
};

export const SummaryTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Product Identity Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
          >
            <Building2
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
            Product Identity
          </h2>
        </div>
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text, width: "200px" }}
                >
                  Field
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {productIdentity.map((item, index) => (
                <tr
                  key={index}
                  className="border-t"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  <td
                    className="px-4 py-3 text-sm font-medium"
                    style={{ color: BRAND_COLORS.primary }}
                  >
                    {item.field}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pain Points Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.warning}15` }}
          >
            <AlertTriangle
              className="w-5 h-5"
              style={{ color: BRAND_COLORS.warning }}
            />
          </div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Problems We Solve
          </h2>
        </div>
        <div className="grid gap-4">
          {painPoints.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              <h3
                className="font-semibold mb-2 flex items-center gap-2"
                style={{ color: BRAND_COLORS.text }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: BRAND_COLORS.primary }}
                >
                  {index + 1}
                </span>
                {item.painPoint}
              </h3>
              <p
                className="text-sm"
                style={{ color: BRAND_COLORS.textSecondary }}
              >
                {item.solution}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Users Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
          >
            <Users
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
            Who It's For
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {targetUsers.map((user, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              <h3
                className="font-semibold mb-3 pb-2 border-b"
                style={{
                  color: BRAND_COLORS.primary,
                  borderColor: BRAND_COLORS.cardBorder,
                }}
              >
                {user.role}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span
                    className="font-medium block mb-1"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    Use Case:
                  </span>
                  <p style={{ color: BRAND_COLORS.textSecondary }}>
                    {user.useCase}
                  </p>
                </div>
                <div>
                  <span
                    className="font-medium block mb-1"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    Current Frustration:
                  </span>
                  <p className="bg-red-50 p-2 rounded text-red-700 text-xs">
                    {user.frustration}
                  </p>
                </div>
                <div>
                  <span
                    className="font-medium block mb-1"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    What They Gain:
                  </span>
                  <p className="bg-green-50 p-2 rounded text-green-700 text-xs">
                    {user.benefit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Summary Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.success}15` }}
          >
            <CheckCircle
              className="w-5 h-5"
              style={{ color: BRAND_COLORS.success }}
            />
          </div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Feature Summary
          </h2>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.background,
          }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: BRAND_COLORS.text }}
          >
            {featureSummary}
          </p>
        </div>
      </section>

      {/* USPs Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
          >
            <Shield
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
            Unique Selling Points
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {productMetadata.usps.map((usp, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border"
              style={{
                borderColor: BRAND_COLORS.primary,
                backgroundColor: `${BRAND_COLORS.primary}08`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              >
                {index + 1}
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: BRAND_COLORS.text }}
              >
                {usp}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Current State Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
          >
            <TrendingUp
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
            Where We Are Today
          </h2>
        </div>
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text, width: "200px" }}
                >
                  Dimension
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Current State
                </th>
              </tr>
            </thead>
            <tbody>
              {currentState.map((item, index) => (
                <tr
                  key={index}
                  className="border-t"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  <td
                    className="px-4 py-3 text-sm font-medium align-top"
                    style={{ color: BRAND_COLORS.primary }}
                  >
                    {item.dimension}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.state}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Integrations */}
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <h3
              className="font-semibold mb-3 flex items-center gap-2"
              style={{ color: BRAND_COLORS.text }}
            >
              <Smartphone
                className="w-4 h-4"
                style={{ color: BRAND_COLORS.primary }}
              />
              Integrations
            </h3>
            <div className="flex flex-wrap gap-2">
              {productMetadata.integrations.map((integration, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${BRAND_COLORS.primary}15`,
                    color: BRAND_COLORS.primary,
                  }}
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>

          {/* Upsell Modules */}
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <h3
              className="font-semibold mb-3 flex items-center gap-2"
              style={{ color: BRAND_COLORS.text }}
            >
              <TrendingUp
                className="w-4 h-4"
                style={{ color: BRAND_COLORS.success }}
              />
              Upsell Modules
            </h3>
            <div className="flex flex-wrap gap-2">
              {productMetadata.upSelling.map((module, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${BRAND_COLORS.success}15`,
                    color: BRAND_COLORS.success,
                  }}
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
