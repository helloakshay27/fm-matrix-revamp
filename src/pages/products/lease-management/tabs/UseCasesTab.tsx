// Lease Management - Use Cases Tab Component
import React, { useState } from "react";
import {
  useCases,
  lesseeTeamUseCases,
  lessorIndustryUseCases,
  lessorTeamUseCases,
} from "../data";

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

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="px-4 py-3 font-bold text-white text-sm"
    style={{ backgroundColor: BRAND_COLORS.darkBg }}
  >
    {children}
  </div>
);

export const UseCasesTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");

  return (
    <div className="space-y-6">
      {/* Perspective Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setPerspective("lessee")}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor:
              perspective === "lessee"
                ? BRAND_COLORS.primary
                : BRAND_COLORS.white,
            color:
              perspective === "lessee" ? BRAND_COLORS.white : BRAND_COLORS.text,
            border: `1px solid ${BRAND_COLORS.cardBorder}`,
          }}
        >
          Lessee Perspective
        </button>
        <button
          onClick={() => setPerspective("lessor")}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor:
              perspective === "lessor"
                ? BRAND_COLORS.primary
                : BRAND_COLORS.white,
            color:
              perspective === "lessor" ? BRAND_COLORS.white : BRAND_COLORS.text,
            border: `1px solid ${BRAND_COLORS.cardBorder}`,
          }}
        >
          Lessor Perspective
        </button>
      </div>

      {/* ========== LESSEE VIEW ========== */}
      {perspective === "lessee" && (
        <div className="space-y-6">
          {/* PART 1 - INDUSTRY-LEVEL USE CASES */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: BRAND_COLORS.cardBorder }}
          >
            <SectionTitle>
              PART 1 — INDUSTRY-LEVEL USE CASES (Ranked by relevance)
            </SectionTitle>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm border-collapse"
                style={{ minWidth: 1200 }}
              >
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                    {[
                      "#",
                      "Industry",
                      "How it is relevant (specific features and workflows)",
                      "Ideal Company Profile and current tool",
                      "Urgency",
                      "Primary Buyer (who they sell to)",
                      "Primary Use (daily/transaction)",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-semibold"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {useCases.map((uc, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td
                        className="px-3 py-2 font-semibold text-center"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          width: 40,
                        }}
                      >
                        {uc.rank}
                      </td>
                      <td
                        className="px-3 py-2 font-semibold"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 140,
                        }}
                      >
                        {uc.industry}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 300,
                        }}
                      >
                        {uc.howRelevant}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 200,
                        }}
                      >
                        {uc.idealProfile}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 120,
                        }}
                      >
                        {uc.urgency}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 160,
                        }}
                      >
                        {uc.primaryBuyer}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 160,
                        }}
                      >
                        {uc.primaryUser}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PART 2 - INTERNAL TEAM-LEVEL USE CASES */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: BRAND_COLORS.cardBorder }}
          >
            <SectionTitle>PART 2 — INTERNAL TEAM-LEVEL USE CASES</SectionTitle>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm border-collapse"
                style={{ minWidth: 1100 }}
              >
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                    {[
                      "Team",
                      "How it is relevant (features and processes)",
                      "Specific modules used",
                      "Key benefit for this team",
                      "How they use it day-to-day",
                      "Frequency of use",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-semibold"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lesseeTeamUseCases.map((t, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td
                        className="px-3 py-2 font-semibold"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 140,
                        }}
                      >
                        {t.team}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 250,
                        }}
                      >
                        {t.howRelevant}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 200,
                        }}
                      >
                        {t.specificModules}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 200,
                        }}
                      >
                        {t.keyBenefit}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 200,
                        }}
                      >
                        {t.dayToDay}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 80,
                        }}
                      >
                        {t.frequencyOfUse}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========== LESSOR VIEW ========== */}
      {perspective === "lessor" && (
        <div className="space-y-6">
          {/* PART 1 - INDUSTRY-LEVEL USE CASES (LESSOR) */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: BRAND_COLORS.cardBorder }}
          >
            <SectionTitle>
              PART 1 — INDUSTRY-LEVEL USE CASES (LESSOR) — Ranked by relevance
            </SectionTitle>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm border-collapse"
                style={{ minWidth: 1200 }}
              >
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                    {[
                      "#",
                      "Industry",
                      "How it is relevant for LESSORS (features and workflows)",
                      "Ideal Company Profile",
                      "Decision Maker",
                      "Current Tool Being Replaced",
                      "Estimated Deal Size",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-semibold"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lessorIndustryUseCases.map((uc, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td
                        className="px-3 py-2 font-semibold text-center"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          width: 40,
                        }}
                      >
                        {uc.rank}
                      </td>
                      <td
                        className="px-3 py-2 font-semibold"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 140,
                        }}
                      >
                        {uc.industry}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 300,
                        }}
                      >
                        {uc.howRelevant}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 200,
                        }}
                      >
                        {uc.idealProfile}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 120,
                        }}
                      >
                        {uc.decisionMaker}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 140,
                        }}
                      >
                        {uc.currentToolReplaced}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 120,
                        }}
                      >
                        {uc.estimatedDealSize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PART 2 - INTERNAL TEAM-LEVEL USE CASES (LESSOR) */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: BRAND_COLORS.cardBorder }}
          >
            <SectionTitle>
              PART 2 — INTERNAL TEAM-LEVEL USE CASES (LESSOR)
            </SectionTitle>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm border-collapse"
                style={{ minWidth: 1100 }}
              >
                <thead>
                  <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                    {[
                      "Team / Role",
                      "Primary Use Case",
                      "Key Actions in Platform",
                      "Frequency of Use",
                      "Metrics They Track",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-semibold"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lessorTeamUseCases.map((t, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor:
                          i % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                      }}
                    >
                      <td
                        className="px-3 py-2 font-semibold"
                        style={{
                          color: BRAND_COLORS.text,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 140,
                        }}
                      >
                        {t.teamRole}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 200,
                        }}
                      >
                        {t.primaryUseCase}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 280,
                        }}
                      >
                        {t.keyActions}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 180,
                        }}
                      >
                        {t.frequencyOfUse}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 220,
                        }}
                      >
                        {t.metricsTracked}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UseCasesTab;
