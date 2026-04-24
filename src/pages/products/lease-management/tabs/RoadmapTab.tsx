// Lease Management - Roadmap Tab Component
import React, { useState } from "react";
import { roadmapLessee, roadmapLessor } from "../data";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  darkBg: "#DA7756",
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

const PhaseHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="px-4 py-2 font-semibold text-white text-sm"
    style={{ backgroundColor: "#DA7756" }}
  >
    {children}
  </div>
);

const PhaseDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="px-4 py-2 text-sm italic"
    style={{
      backgroundColor: "#F6F4EE",
      color: "#5A5A5A",
      borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
    }}
  >
    {children}
  </div>
);

const priorityColor = (p?: string) => {
  if (p === "P1") return { bg: "#FEE2E2", text: "#DC2626" };
  if (p === "P2") return { bg: "#FEF3C7", text: "#D97706" };
  return { bg: "#D1FAE5", text: "#059669" };
};

const columnHeaders = [
  "Feature / Initiative",
  "What it is",
  "Why it matters",
  "Customer segment it unlocks",
  "Deal risk if delayed",
  "Priority",
  "Market Signal",
];

export const RoadmapTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");

  const roadmapData = perspective === "lessee" ? roadmapLessee : roadmapLessor;

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

      {/* Title */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: BRAND_COLORS.cardBorder }}
      >
        <SectionTitle>
          Product Roadmap — {perspective === "lessee" ? "LESSEE" : "LESSOR"}{" "}
          PERSPECTIVE
        </SectionTitle>
        <div
          className="px-4 py-2 text-sm"
          style={{
            color: BRAND_COLORS.textSecondary,
            backgroundColor: BRAND_COLORS.background,
          }}
        >
          Purpose: Prioritised feature roadmap grounded in market gaps,
          competitive weaknesses, and deal-loss analysis.
        </div>
      </div>

      {/* Phases */}
      {roadmapData.map((phase, phaseIndex) => (
        <div
          key={phaseIndex}
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <PhaseHeader>
            {phase.phase.toUpperCase()} — {phase.timeline.toUpperCase()}
            {phase.focus ? ` — ${phase.focus}` : ""}
          </PhaseHeader>
          <PhaseDescription>
            {phaseIndex === 0 &&
              "These features and fixes are needed right now. Each one is actively costing us deals in current pipeline."}
            {phaseIndex === 1 &&
              "These features open new buyer segments and increase ACV from existing clients."}
            {phaseIndex === 2 &&
              "These capabilities become structural advantages that are hard to copy and defend market leadership."}
          </PhaseDescription>

          <div className="overflow-x-auto">
            <table
              className="w-full text-sm border-collapse"
              style={{ minWidth: 1300 }}
            >
              <thead>
                <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                  {columnHeaders.map((h) => (
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
                {phase.items.map((item, i) => {
                  const pc = priorityColor(item.priority);
                  return (
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
                          minWidth: 160,
                        }}
                      >
                        {item.feature || item.item}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 220,
                        }}
                      >
                        {item.description}
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
                        {item.whyMatters}
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
                        {item.segmentUnlocked}
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
                        {item.dealRisk}
                      </td>
                      <td
                        className="px-3 py-2 text-center"
                        style={{
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 60,
                        }}
                      >
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: pc.bg,
                            color: pc.text,
                          }}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{
                          color: BRAND_COLORS.textSecondary,
                          borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                          minWidth: 200,
                        }}
                      >
                        {item.marketSignal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Phase summary row */}
          <div
            className="px-4 py-2 text-xs font-semibold"
            style={{
              backgroundColor: "#DA7756",
              color: BRAND_COLORS.white,
            }}
          >
            END OF {phase.phase.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapTab;
