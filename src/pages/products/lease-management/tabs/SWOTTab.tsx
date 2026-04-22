import React, { useState } from "react";
import { swotAnalysisLessee, swotAnalysisLessor } from "../data";

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

const QuadrantTable = ({
  title,
  items,
}: {
  title: string;
  items: { item: string; description: string }[];
}) => (
  <>
    <SubSectionTitle>{title}</SubSectionTitle>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ ...th, width: 40 }}>#</th>
          <th style={{ ...th, width: "25%" }}>Item</th>
          <th style={th}>Description</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td style={td(i)}>{i + 1}</td>
            <td style={td(i)}>{item.item}</td>
            <td style={td(i)}>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

export const SWOTTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");
  const data =
    perspective === "lessee" ? swotAnalysisLessee : swotAnalysisLessor;

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

      <SectionTitle>
        SWOT Analysis (10 per quadrant) —{" "}
        {perspective === "lessee" ? "LESSEE" : "LESSOR"} PERSPECTIVE
      </SectionTitle>

      <QuadrantTable title="STRENGTHS" items={data.strengths} />
      <QuadrantTable title="WEAKNESSES" items={data.weaknesses} />
      <QuadrantTable title="OPPORTUNITIES" items={data.opportunities} />
      <QuadrantTable title="THREATS" items={data.threats} />
    </div>
  );
};

export default SWOTTab;
