import React, { useState } from "react";
import {
  enhancementsLessee,
  enhancementsLessor,
  topEnhancements,
  topEnhancementsLessor,
} from "../data";

const primary = "#DA7756";
const darkBg = "#1e293b";
const cardBorder = "#C4B89D";
const background = "#F6F4EE";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: darkBg,
      color: "#fff",
      padding: "10px 16px",
      fontWeight: 700,
      fontSize: 16,
      marginTop: 28,
      marginBottom: 0,
      borderRadius: "6px 6px 0 0",
    }}
  >
    {children}
  </div>
);

const SubSectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: primary,
      color: "#fff",
      padding: "7px 16px",
      fontWeight: 700,
      fontSize: 14,
      marginTop: 18,
      marginBottom: 0,
    }}
  >
    {children}
  </div>
);

const th: React.CSSProperties = {
  border: `1px solid ${cardBorder}`,
  padding: "8px 10px",
  fontWeight: 700,
  fontSize: 12,
  background: darkBg,
  color: "#fff",
  textAlign: "left",
};
const td = (i: number): React.CSSProperties => ({
  border: `1px solid ${cardBorder}`,
  padding: "8px 10px",
  fontSize: 12,
  background: i % 2 === 0 ? "#fff" : background,
  verticalAlign: "top",
});

export const EnhancementsTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");

  const enhancements =
    perspective === "lessee" ? enhancementsLessee : enhancementsLessor;
  const top5 =
    perspective === "lessee" ? topEnhancements : topEnhancementsLessor;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {(["lessee", "lessor"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPerspective(p)}
            style={{
              padding: "8px 28px",
              borderRadius: 6,
              border: `2px solid ${primary}`,
              background: perspective === p ? primary : "#fff",
              color: perspective === p ? "#fff" : primary,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {p === "lessee" ? "Lessee Perspective" : "Lessor Perspective"}
          </button>
        ))}
      </div>

      <SectionTitle>
        Feature Enhancement Roadmap —{" "}
        {perspective === "lessee" ? "LESSEE" : "LESSOR"} PERSPECTIVE
      </SectionTitle>
      <div
        style={{
          fontSize: 11,
          color: "#5A5A5A",
          padding: "6px 16px",
          background: "#fff",
          border: `1px solid ${cardBorder}`,
        }}
      >
        Each row shows: current behaviour → enhanced behaviour with integration
        type → revenue or relationship impact. At least 5 AI-driven. At least 3
        MCP. High-impact rows highlighted in blue.
        {perspective === "lessor" &&
          " LESSOR perspective — property owner / property management company viewpoint."}
      </div>

      {/* Main Enhancements Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 30 }}>#</th>
              <th style={th}>Module</th>
              <th style={th}>Feature</th>
              <th style={th}>How It Currently Works</th>
              <th style={th}>Enhanced Behaviour</th>
              <th style={th}>Integration Type</th>
              <th style={th}>Impact Level</th>
              <th style={th}>Revenue / Relationship Impact</th>
              <th style={{ ...th, width: 35 }}>AI?</th>
              <th style={{ ...th, width: 40 }}>MCP?</th>
              <th style={th}>Effort</th>
              <th style={th}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {enhancements.map((e, i) => (
              <tr key={e.id}>
                <td style={td(i)}>{e.id}</td>
                <td style={td(i)}>{e.module}</td>
                <td style={td(i)}>{e.feature}</td>
                <td style={td(i)}>{e.currentBehavior}</td>
                <td style={td(i)}>{e.enhancedBehavior}</td>
                <td style={td(i)}>{e.integrationType}</td>
                <td style={td(i)}>{e.impactLevel}</td>
                <td style={td(i)}>{e.revenueImpact}</td>
                <td style={td(i)}>{e.isAI ? "Yes" : "No"}</td>
                <td style={td(i)}>{e.isMCP ? "Yes" : "No"}</td>
                <td style={td(i)}>{e.effort}</td>
                <td style={td(i)}>{e.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top 5 Summary */}
      <SubSectionTitle>
        TOP 5 HIGHEST-IMPACT ENHANCEMENTS — SUMMARY
        {perspective === "lessor" ? " (LESSOR)" : ""}
      </SubSectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 50 }}>Rank</th>
              <th style={th}>Enhancement</th>
              <th style={th}>Why it's the Highest Impact</th>
            </tr>
          </thead>
          <tbody>
            {top5.map((t, i) => (
              <tr key={t.rank}>
                <td style={td(i)}>{t.rank}</td>
                <td style={td(i)}>{t.feature}</td>
                <td style={td(i)}>{t.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancementsTab;
