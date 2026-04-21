// Lease Management - Summary Tab Component
import React, { useState } from "react";
import {
  productIdentityLessee,
  productIdentityLessor,
  painPointsLessee,
  painPointsLessor,
  targetUsersLessee,
  targetUsersLessor,
  currentStateLessee,
  currentStateLessor,
  featureSummary,
  featureSummaryLessor,
  investorCase,
  investorCaseLessor,
  productMetadata,
} from "../data";
import {
  Building2,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Briefcase,
  Building,
  ArrowRightLeft,
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

export const SummaryTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");

  const productIdentity =
    perspective === "lessee" ? productIdentityLessee : productIdentityLessor;
  const painPoints =
    perspective === "lessee" ? painPointsLessee : painPointsLessor;
  const targetUsers =
    perspective === "lessee" ? targetUsersLessee : targetUsersLessor;
  const featureSummaryText =
    perspective === "lessee" ? featureSummary : featureSummaryLessor;
  const currentState =
    perspective === "lessee" ? currentStateLessee : currentStateLessor;
  const investorCaseText =
    perspective === "lessee" ? investorCase : investorCaseLessor;

  return (
    <div className="space-y-8">
      {/* Perspective Toggle */}
      <div
        className="flex items-center justify-center gap-4 p-4 rounded-xl"
        style={{ backgroundColor: BRAND_COLORS.background }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: BRAND_COLORS.text }}
        >
          View as:
        </span>
        <div
          className="inline-flex gap-1 p-1 rounded-full border"
          style={{
            backgroundColor: BRAND_COLORS.white,
            borderColor: BRAND_COLORS.cardBorder,
          }}
        >
          <button
            onClick={() => setPerspective("lessee")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor:
                perspective === "lessee" ? BRAND_COLORS.primary : "transparent",
              color:
                perspective === "lessee"
                  ? BRAND_COLORS.white
                  : BRAND_COLORS.textSecondary,
            }}
          >
            <Building className="w-4 h-4 inline mr-2" />
            Lessee (Tenant)
          </button>
          <button
            onClick={() => setPerspective("lessor")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor:
                perspective === "lessor" ? BRAND_COLORS.primary : "transparent",
              color:
                perspective === "lessor"
                  ? BRAND_COLORS.white
                  : BRAND_COLORS.textSecondary,
            }}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Lessor (Owner)
          </button>
        </div>
      </div>

      {/* Product Identity Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: BRAND_COLORS.primaryLight }}
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
            style={{ backgroundColor: `${BRAND_COLORS.warning}30` }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "#D97706" }} />
          </div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            The Problems We Solve
          </h2>
        </div>
        <div className="grid gap-4">
          {painPoints.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border p-5"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              <h3
                className="font-semibold mb-3 flex items-center gap-3"
                style={{ color: BRAND_COLORS.text }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: BRAND_COLORS.primary }}
                >
                  {index + 1}
                </span>
                {item.painPoint}
              </h3>
              <p
                className="text-sm leading-relaxed"
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
            style={{ backgroundColor: `${BRAND_COLORS.secondaryGreen}20` }}
          >
            <Users
              className="w-5 h-5"
              style={{ color: BRAND_COLORS.secondaryGreen }}
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
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Role
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  What They Use It For
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  Their Frustration Today
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  What They Gain
                </th>
              </tr>
            </thead>
            <tbody>
              {targetUsers.map((user, index) => (
                <tr
                  key={index}
                  className="border-t"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  <td
                    className="px-4 py-3 text-sm font-medium"
                    style={{ color: BRAND_COLORS.primary }}
                  >
                    {user.role}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {user.useCase}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    {user.frustration}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: BRAND_COLORS.secondaryGreen }}
                  >
                    {user.benefit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Summary Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: BRAND_COLORS.primaryLight }}
          >
            <CheckCircle
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
            Feature Summary (What Is Built)
          </h2>
        </div>
        <div
          className="rounded-lg border p-5"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.background,
          }}
        >
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: BRAND_COLORS.text }}
          >
            {featureSummaryText}
          </p>
        </div>
      </section>

      {/* Current State Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.secondaryTeal}30` }}
          >
            <Target className="w-5 h-5" style={{ color: "#0D9488" }} />
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
        <div className="grid gap-4 md:grid-cols-2">
          {currentState.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              <h4
                className="text-sm font-semibold mb-2"
                style={{ color: BRAND_COLORS.primary }}
              >
                {item.dimension}
              </h4>
              <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
                {item.state}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Investor Case Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.success}30` }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: "#059669" }} />
          </div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            The Investor & Partner Case
          </h2>
        </div>
        <div
          className="rounded-lg border p-5"
          style={{
            borderColor: BRAND_COLORS.primary,
            backgroundColor: BRAND_COLORS.primaryLight,
          }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: BRAND_COLORS.text }}
          >
            {investorCaseText}
          </p>
        </div>
      </section>
    </div>
  );
};

export default SummaryTab;
