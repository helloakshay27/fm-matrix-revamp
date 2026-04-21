import React, { useState } from "react";
import { gtmTargetGroups, gtmTargetGroupsLessor } from "../data";

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
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
  background: darkBg,
  color: "#fff",
  textAlign: "left",
};
const td = (i: number): React.CSSProperties => ({
  border: `1px solid ${cardBorder}`,
  padding: "8px 12px",
  fontSize: 13,
  background: i % 2 === 0 ? "#fff" : background,
  verticalAlign: "top",
});

const GTMTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");
  const data =
    perspective === "lessee" ? gtmTargetGroups : gtmTargetGroupsLessor;

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

      {data.map((tg, tgIdx) => (
        <div key={tgIdx} style={{ marginBottom: 40 }}>
          <SectionTitle>{tg.name}</SectionTitle>

          {/* Profile */}
          {tg.profile && (
            <div
              style={{
                background: "#fff",
                border: `1px solid ${cardBorder}`,
                padding: "10px 16px",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              <strong>Profile:</strong> {tg.profile}
            </div>
          )}

          {/* Component 1: Sales Elements */}
          {tg.elements && tg.elements.length > 0 && (
            <>
              <SubSectionTitle>
                Component 1 — Sales Motion Elements
              </SubSectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Sales Element</th>
                    <th style={th}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {tg.elements.map((el, i) => (
                    <tr key={i}>
                      <td style={td(i)}>{el.element}</td>
                      <td style={td(i)}>{el.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Component 2: Marketing Channels */}
          {tg.marketingChannels && tg.marketingChannels.length > 0 && (
            <>
              <SubSectionTitle>
                Component 2 — Marketing Channel Evaluation
              </SubSectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Channel</th>
                    <th style={th}>Relevant?</th>
                    <th style={th}>Execution Approach</th>
                    <th style={th}>Priority</th>
                    <th style={th}>Expected Output</th>
                    <th style={th}>Budget / Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {tg.marketingChannels.map((ch, i) => (
                    <tr key={i}>
                      <td style={td(i)}>{ch.channel}</td>
                      <td style={td(i)}>{ch.relevant}</td>
                      <td style={td(i)}>{ch.executionApproach}</td>
                      <td style={td(i)}>{ch.priorityRank}</td>
                      <td style={td(i)}>{ch.expectedOutput}</td>
                      <td style={td(i)}>{ch.budgetTimeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Component 3: Launch Sequence */}
          {tg.launchSequence && tg.launchSequence.length > 0 && (
            <>
              <SubSectionTitle>
                Component 3 — 90-Day Launch Sequence
              </SubSectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Week / Phase</th>
                    <th style={th}>Sales Action</th>
                    <th style={th}>Marketing Action</th>
                    <th style={th}>Key Product Milestones</th>
                    <th style={th}>Success Metric</th>
                  </tr>
                </thead>
                <tbody>
                  {tg.launchSequence.map((ls, i) => (
                    <tr key={i}>
                      <td style={td(i)}>{ls.week}</td>
                      <td style={td(i)}>{ls.salesAction}</td>
                      <td style={td(i)}>{ls.marketingAction}</td>
                      <td style={td(i)}>{ls.keyProductMilestones}</td>
                      <td style={td(i)}>{ls.successMetric}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Component 4: Partnerships */}
          {tg.partnerships && tg.partnerships.length > 0 && (
            <>
              <SubSectionTitle>
                Component 4 — Partnership Strategy
              </SubSectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Partnership Element</th>
                    <th style={th}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {tg.partnerships.map((p, i) => (
                    <tr key={i}>
                      <td style={td(i)}>{p.element}</td>
                      <td style={td(i)}>{p.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* One-Page Summary */}
          {tg.onePageSummary && Object.keys(tg.onePageSummary).length > 0 && (
            <>
              <SubSectionTitle>One-Page GTM Summary</SubSectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Item</th>
                    <th style={th}>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tg.onePageSummary).map(([key, val], i) => (
                    <tr key={i}>
                      <td style={td(i)}>{key}</td>
                      <td style={td(i)}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* TG Summary */}
          {tg.tgSummary && (
            <div
              style={{
                background: "#fff",
                border: `1px solid ${cardBorder}`,
                padding: "12px 16px",
                fontSize: 13,
                lineHeight: 1.7,
                marginTop: 8,
              }}
            >
              <strong>Summary:</strong> {tg.tgSummary}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { GTMTab };
export default GTMTab;
