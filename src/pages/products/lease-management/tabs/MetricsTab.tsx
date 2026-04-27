import React, { useState } from "react";
import {
  clientMetrics,
  lesseeNorthStarMetric,
  lesseeProductLaunchMetrics,
  lesseeMetricsSummary,
  lessorClientMetrics,
  lessorNorthStarMetric,
  lessorLaunchTracking,
  lessorMetricsSummary,
} from "../data";

const primary = "#DA7756";
const darkBg = "#DA7756";
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

const thStyle: React.CSSProperties = {
  border: `1px solid ${cardBorder}`,
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
  background: darkBg,
  color: "#fff",
  textAlign: "left",
};
const tdStyle = (i: number): React.CSSProperties => ({
  border: `1px solid ${cardBorder}`,
  padding: "8px 12px",
  fontSize: 13,
  background: i % 2 === 0 ? "#fff" : background,
  verticalAlign: "top",
});

const SummaryBox = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      background: "#fff",
      border: `1px solid ${cardBorder}`,
      padding: "12px 16px",
      marginTop: 8,
      fontSize: 13,
      lineHeight: 1.7,
    }}
  >
    <strong style={{ color: primary }}>{label}:</strong> {value}
  </div>
);

export const MetricsTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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

      {perspective === "lessee" ? <LesseeMetrics /> : <LessorMetrics />}
    </div>
  );
};

/* ========== LESSEE ========== */
const LesseeMetrics: React.FC = () => (
  <>
    {/* Section 1 */}
    <SectionTitle>
      SECTION 1 — CLIENT IMPACT METRICS (What to track after go-live — Landing
      page proof points)
    </SectionTitle>
    <div
      style={{
        fontSize: 12,
        color: "#5A5A5A",
        padding: "6px 16px",
        background: "#fff",
        border: `1px solid ${cardBorder}`,
      }}
    >
      These 10 metrics measure real-world business impact created in client
      companies. Track from Day 30 with every client. Use the best results as
      landing page social proof.
    </div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Metric Name</th>
            <th style={thStyle}>What it measures</th>
            <th style={thStyle}>Impact range</th>
            <th style={thStyle}>Feature driving the impact</th>
            <th style={thStyle}>How the impact is caused</th>
            <th style={thStyle}>Example landing page claim</th>
          </tr>
        </thead>
        <tbody>
          {clientMetrics.map((m, i) => (
            <tr key={m.id}>
              <td style={tdStyle(i)}>{m.id}</td>
              <td style={tdStyle(i)}>{m.name}</td>
              <td style={tdStyle(i)}>{m.whatMeasures}</td>
              <td style={tdStyle(i)}>{m.impactRange}</td>
              <td style={tdStyle(i)}>{m.featureDriving}</td>
              <td style={tdStyle(i)}>{m.howCaused}</td>
              <td style={tdStyle(i)}>{m.landingClaim}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Section 2 */}
    <SectionTitle>
      SECTION 2 — PRODUCT LAUNCH TRACKING METRICS (North Star + Top 10)
    </SectionTitle>

    <SubSectionTitle>NORTH STAR METRIC</SubSectionTitle>
    <SummaryBox
      label="North Star Metric Name"
      value={lesseeNorthStarMetric.name}
    />
    <SummaryBox
      label="Why this is the North Star"
      value={lesseeNorthStarMetric.why}
    />

    <SubSectionTitle>Top 10 Launch Tracking Metrics</SubSectionTitle>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Metric</th>
            <th style={thStyle}>What it measures</th>
            <th style={thStyle}>Activation definition</th>
            <th style={thStyle}>30-day — current product</th>
            <th style={thStyle}>30-day — with Phase 1</th>
            <th style={thStyle}>3-month — current product</th>
            <th style={thStyle}>3-month — with Phase 1</th>
            <th style={thStyle}>Why it matters</th>
            <th style={thStyle}>Success signal</th>
            <th style={thStyle}>Uplift reason from Phase 1</th>
          </tr>
        </thead>
        <tbody>
          {lesseeProductLaunchMetrics.map((m, i) => (
            <tr key={m.id}>
              <td style={tdStyle(i)}>{m.id}</td>
              <td style={tdStyle(i)}>{m.metric}</td>
              <td style={tdStyle(i)}>{m.whatMeasures}</td>
              <td style={tdStyle(i)}>{m.activationDefinition}</td>
              <td style={tdStyle(i)}>{m.thirtyDayCurrent}</td>
              <td style={tdStyle(i)}>{m.thirtyDayWithPhase1}</td>
              <td style={tdStyle(i)}>{m.threeMonthCurrent}</td>
              <td style={tdStyle(i)}>{m.threeMonthWithPhase1}</td>
              <td style={tdStyle(i)}>{m.whyItMatters}</td>
              <td style={tdStyle(i)}>{m.successSignal}</td>
              <td style={tdStyle(i)}>{m.upliftFromPhase1}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Metrics Summary */}
    <SectionTitle>
      METRICS SUMMARY — KEY TAKEAWAYS FOR LEADERSHIP REVIEW
    </SectionTitle>
    <SummaryBox
      label="THE NORTH STAR METRIC"
      value={lesseeMetricsSummary.northStar}
    />
    <SummaryBox
      label="THE THREE LEADING INDICATORS OF PLATFORM HEALTH"
      value={lesseeMetricsSummary.threeLeadingIndicators}
    />
    <SummaryBox
      label="THE PHASE 1 INVESTMENT PAYBACK LOGIC"
      value={lesseeMetricsSummary.phase1InvestmentPayback}
    />
  </>
);

/* ========== LESSOR ========== */
const LessorMetrics: React.FC = () => (
  <>
    {/* Section 1 */}
    <SectionTitle>
      SECTION 1 — CLIENT IMPACT METRICS (LESSOR — What to track after go-live)
    </SectionTitle>
    <div
      style={{
        fontSize: 12,
        color: "#5A5A5A",
        padding: "6px 16px",
        background: "#fff",
        border: `1px solid ${cardBorder}`,
      }}
    >
      These 10 metrics measure real-world business impact created in lessor
      client companies. Track from Day 30 with every lessor client. Use the best
      results as landing page social proof for the lessor segment.
    </div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Metric Name</th>
            <th style={thStyle}>What It Measures</th>
            <th style={thStyle}>How to Track in Lockated</th>
            <th style={thStyle}>Baseline (Before)</th>
            <th style={thStyle}>Target (After 90 Days)</th>
            <th style={thStyle}>Landing Page Headline</th>
            <th style={thStyle}>How to Present</th>
            <th style={thStyle}>Portfolio Impact</th>
            <th style={thStyle}>Revenue Impact</th>
            <th style={thStyle}>Client ROI Logic</th>
          </tr>
        </thead>
        <tbody>
          {lessorClientMetrics.map((m, i) => (
            <tr key={m.id}>
              <td style={tdStyle(i)}>{m.id}</td>
              <td style={tdStyle(i)}>{m.name}</td>
              <td style={tdStyle(i)}>{m.whatMeasures}</td>
              <td style={tdStyle(i)}>{m.howToTrack}</td>
              <td style={tdStyle(i)}>{m.baselineBefore}</td>
              <td style={tdStyle(i)}>{m.targetAfter90Days}</td>
              <td style={tdStyle(i)}>{m.landingPageHeadline}</td>
              <td style={tdStyle(i)}>{m.howToPresent}</td>
              <td style={tdStyle(i)}>{m.portfolioImpact}</td>
              <td style={tdStyle(i)}>{m.revenueImpact}</td>
              <td style={tdStyle(i)}>{m.clientROILogic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Lessor North Star */}
    <SubSectionTitle>NORTH STAR METRIC (LESSOR)</SubSectionTitle>
    <SummaryBox label="NORTH STAR METRIC" value={lessorNorthStarMetric.name} />
    <SummaryBox label="Definition" value={lessorNorthStarMetric.definition} />

    {/* Section 2 */}
    <SectionTitle>
      SECTION 2 — PRODUCT LAUNCH TRACKING (LESSOR) — 30-day and 3-month
    </SectionTitle>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Metric</th>
            <th style={thStyle}>Baseline (Pre-Launch)</th>
            <th style={thStyle}>30-Day Target</th>
            <th style={thStyle}>90-Day Target</th>
          </tr>
        </thead>
        <tbody>
          {lessorLaunchTracking.map((m, i) => (
            <tr key={i}>
              <td style={tdStyle(i)}>{m.metric}</td>
              <td style={tdStyle(i)}>{m.baselinePreLaunch}</td>
              <td style={tdStyle(i)}>{m.thirtyDayTarget}</td>
              <td style={tdStyle(i)}>{m.ninetyDayTarget}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Lessor Metrics Summary */}
    <SectionTitle>
      METRICS SUMMARY — KEY TAKEAWAYS FOR LEADERSHIP REVIEW (LESSOR)
    </SectionTitle>
    <SummaryBox
      label="THE NORTH STAR METRIC (LESSOR)"
      value={lessorMetricsSummary.northStar}
    />
    <SummaryBox
      label="THE THREE LEADING INDICATORS OF PLATFORM HEALTH (LESSOR)"
      value={lessorMetricsSummary.threeLeadingIndicators}
    />
    <SummaryBox
      label="THE PHASE 1 INVESTMENT PAYBACK LOGIC (LESSOR)"
      value={lessorMetricsSummary.phase1InvestmentPayback}
    />
  </>
);

export default MetricsTab;
