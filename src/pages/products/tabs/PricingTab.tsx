import React from "react";
import { ProductData } from "../types";

interface PricingTabProps {
  productData: ProductData;
}

type PricingDetails = NonNullable<
  NonNullable<ProductData["extendedContent"]>["detailedPricing"]
>;

/* ── Badge helper ─────────────────────────────────────────────────────────── */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = (status || "").toUpperCase().trim();
  const cls = s.includes("AHEAD")
    ? "bg-[#798C5E] text-white"
    : s.includes("AT PAR") || s.includes("ATPAR")
      ? "bg-[#DA7756]/15 text-[#DA7756]"
      : s.includes("GAP")
        ? "bg-[#E49191]/15 text-[#C72030] border border-[#E49191]/30"
        : "bg-[#F6F4EE] text-[#2C2C2C]/60";
  return (
    <span
      className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-tight block text-center rounded-sm ${cls}`}
    >
      {status}
    </span>
  );
};

const PricingTab: React.FC<PricingTabProps> = ({ productData }) => {
  if (productData.extendedContent?.rawPricingTable) {
    return <div className="w-full mt-4">{productData.extendedContent.rawPricingTable}</div>;
  }

  const rawPricingSections = productData.extendedContent?.rawPricingSections;
  if (rawPricingSections) {
    return (
      <div className="space-y-6 mt-4">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
            {rawPricingSections.title}
          </h2>
          {rawPricingSections.subtitle && (
            <p className="mt-2 text-[12px] text-[#2C2C2C]/60 font-medium italic">
              {rawPricingSections.subtitle}
            </p>
          )}
        </div>

        {rawPricingSections.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border border-[#D3D1C7] bg-white">
            <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
              {section.title}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] table-fixed border-collapse text-[13px] leading-relaxed">
                <thead>
                  <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
                    {section.columns.map((header) => (
                      <th
                        key={header}
                        className="border border-[#D3D1C7] p-3 text-left"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words align-top"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const dp = productData.extendedContent?.detailedPricing as
    | PricingDetails
    | undefined;
  const hasRichFeatureBenchmark =
    !!dp?.featuresVsMarket?.some(
      (row) => row.liveStatus || row.whereWeStand || row.dealImpact
    );
  const hasRichValueProps =
    !!dp?.valuePropositions?.some(
      (row) => row.communicatesToday || row.proofPoint || row.rank
    );
  const snagFeatureRows = dp?.snagFeatureComparison || dp?.featureComparison;
  const snagPricingRows = dp?.pricingLandscapeRows || dp?.pricingLandscape;
  const snagValueRows = dp?.valuePropositions || dp?.valueProps;

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
          {productData.name} — Competitive Feature Comparison &amp; Pricing
        </h2>
      </div>

      {/* ── EXCEL LAYOUT (excelLikePricing = true) ──────────────────────── */}
      {productData.excelLikePricing && dp ? (
        <div className="w-full border border-[#E5E7EB] bg-transparent p-2">
          <div className="w-full bg-transparent">
            <div className="mt-2 flex gap-6">
              <div className="w-full space-y-3">
                {/* Section 1 header */}
                <table className="w-full border-collapse bg-transparent text-sm leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-[#DA7756] text-white border-b border-[#D3D1C7]">
                      <th
                        className="border border-[#D3D1C7] px-2 py-1.5 text-center font-semibold"
                        colSpan={5}
                      >
                        Post Sales - Features &amp; Pricing
                      </th>
                    </tr>
                    <tr className="bg-[#DA7756] text-white border-b border-[#D3D1C7]">
                      <th
                        className="border border-[#D3D1C7] px-2 py-1 text-left text-[8px] font-semibold"
                        colSpan={5}
                      >
                        {dp.pricingMatrixSubtitle ||
                          "Section 1 compares current feature depth vs market expectations and highlights where positioning is strongest or vulnerable."}
                      </th>
                    </tr>
                    <tr className="bg-[#DA7756] text-white border-b border-[#D3D1C7]">
                      <th
                        className="border border-[#D3D1C7] px-1.5 py-1 text-left font-semibold uppercase"
                        colSpan={5}
                      >
                        Section 1: Current features vs market standard | Where
                        we are strong, where we are weak
                      </th>
                    </tr>
                    <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[20%]">
                        Feature / Capability
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[20%]">
                        Current State
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[20%]">
                        What Market Expects
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[20%]">
                        How This Helps / Hurts Us
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[20%]">
                        Recommended Move
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.pricingFeatureRows?.map((row, index: number) => {
                      return (
                        <tr
                          key={index}
                          className="align-top border-b border-[#E5E7EB]"
                        >
                          <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 font-bold text-[#2C2C2C]">
                            {row.capability}
                          </td>
                          <td className="border border-[#E5E7EB] bg-transparent px-1.5 py-1 text-[#2C2C2C]/80">
                            {row.currentState}
                          </td>
                          <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/80">
                            {row.marketNeed}
                          </td>
                          <td className="border border-[#E5E7EB] bg-transparent px-1.5 py-1 text-[#2C2C2C]/80">
                            {row.impact}
                          </td>
                          <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/70">
                            {row.recommendation}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* pricingSummaryRows */}
                {!!dp.pricingSummaryRows?.length && (
                  <table className="w-full border-collapse bg-transparent text-sm leading-[1.2] font-poppins">
                    <tbody>
                      {dp.pricingSummaryRows.map((row, index: number) => {
                        const bgClass =
                          row.tone === "green"
                            ? "bg-[#F6F4EE] text-[#DA7756]"
                            : row.tone === "yellow"
                              ? "bg-white text-gray-600"
                              : "bg-[#F6F4EE] text-gray-500";
                        return (
                          <tr key={index}>
                            <td
                              className={`w-[26%] border border-[#E5E7EB] px-2 py-1 font-semibold uppercase ${bgClass}`}
                            >
                              {row.label}
                            </td>
                            <td
                              className={`border border-[#E5E7EB] px-2 py-1 ${bgClass}`}
                            >
                              {row.detail}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {/* Section 2: pricing current rows */}
                <table className="w-full border-collapse bg-transparent text-sm leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-[#DA7756] text-white border-b border-[#D3D1C7]">
                      <th
                        className="border border-[#D3D1C7] px-1.5 py-1 text-left font-semibold uppercase"
                        colSpan={2}
                      >
                        Section 2: Current pricing and plans | What we charge
                        and how it lands
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.pricingCurrentRows?.map((row, index: number) => (
                      <tr key={index}>
                        <td className="w-[24%] border border-[#E5E7EB] px-2 py-1 font-bold text-[#2C2C2C]">
                          {row.label}
                        </td>
                        <td className="border border-[#E5E7EB] bg-transparent px-2 py-1 text-[#2C2C2C]/80">
                          {row.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Section 3: positioning rows */}
                <table className="w-full border-collapse bg-transparent text-sm leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-[#DA7756] text-white border-b border-[#D3D1C7]">
                      <th
                        className="border border-[#D3D1C7] px-1.5 py-1 text-left font-semibold uppercase"
                        colSpan={3}
                      >
                        Section 3: Positioning | Why this offer is hard to
                        ignore
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.pricingPositioningRows?.map((row, index: number) => (
                      <tr key={index} className="align-top">
                        <td className="w-[22%] border border-[#E5E7EB] bg-white px-2 py-1 font-bold text-[#2C2C2C]">
                          {row.question}
                        </td>
                        <td className="border border-[#E5E7EB] bg-transparent px-2 py-1 text-[#2C2C2C]/80">
                          {row.answer}
                        </td>
                        <td className="w-[22%] border border-[#E5E7EB] px-2 py-1 text-[#2C2C2C]/70">
                          {row.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Section 4: improvement rows */}
                <table className="w-full border-collapse bg-transparent text-sm leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-[#DA7756] text-white border-b border-[#D3D1C7]">
                      <th
                        className="border border-[#D3D1C7] px-1.5 py-1 text-left font-semibold uppercase"
                        colSpan={4}
                      >
                        Section 4: Value proposition and suggested improvements
                      </th>
                    </tr>
                    <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[25%]">
                        Current Prop
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[22%]">
                        Suggested Fix
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[28%]">
                        Improved Framing
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#DA7756] text-white px-1.5 py-1 text-left w-[25%]">
                        Why It Matters
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.pricingImprovementRows?.map((row, index: number) => (
                      <tr key={index} className="align-top">
                        <td className="border border-[#E5E7EB] bg-white px-2 py-1 text-[#2C2C2C] font-bold">
                          {row.currentProp}
                        </td>
                        <td className="border border-[#E5E7EB] px-2 py-1 text-[#4B5563]">
                          {row.suggestedFix}
                        </td>
                        <td className="border border-[#E5E7EB] px-2 py-1 text-[#798C5E]">
                          {row.improvedFraming}
                        </td>
                        <td className="border border-[#E5E7EB] bg-transparent px-2 py-1 text-[#2C2C2C]/70">
                          {row.whyItWins}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : dp?.isClubPricing ? (
        /* ── CLUB MANAGEMENT LAYOUT ───────────────────────────────────────────── */
        <>
          {/* Legend bar */}
          <div className="bg-[#F6F4EE] border border-[#D3D1C7] px-4 py-2 mt-2">
            <p className="text-[11px] text-[#DA7756] font-semibold italic uppercase tracking-tighter font-poppins">
              <span className="text-[#A1A1AA]">AHEAD = Lockated leads</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="text-[#A1A1AA]">AT PAR = Equal capability</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="text-[#A1A1AA]">GAP = Competitor leads</span>
            </p>
          </div>

          {/* Section 1: Feature Comparison Matrix */}
          {dp.clubFeatureComparison && dp.clubFeatureComparison.length > 0 && (
            <div className="mt-4">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-[13px] uppercase tracking-wide font-poppins">
                Section 1: Feature Comparison Matrix
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[13px] bg-transparent font-poppins leading-[1.45] table-fixed">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase border-b border-[#D3D1C7] text-center">
                      <th className="border border-[#C4B89D] px-3 py-3 w-[25%] text-left">Feature Area</th>
                      <th className="border border-[#C4B89D] px-3 py-3">Lockated</th>
                      <th className="border border-[#C4B89D] px-3 py-3">Shawman</th>
                      <th className="border border-[#C4B89D] px-3 py-3">MINDBODY</th>
                      <th className="border border-[#C4B89D] px-3 py-3">Glofox</th>
                      <th className="border border-[#C4B89D] px-3 py-3">Omnify</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.clubFeatureComparison.map((f: any, i: number) => {
                      const getStatusBg = (val: string) => {
                        const tone = (val || "").toUpperCase();
                        if (tone.includes("AHEAD")) return "bg-[#798C5E] text-white";
                        if (tone.includes("GAP")) return "bg-[#C72030] text-white";
                        if (tone.includes("AT PAR")) return "bg-[#F4E6C8] text-[#D97706]";
                        return "";
                      };
                      return (
                        <tr key={i} className={`align-middle border-b border-[#D3D1C7] ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                          <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#2C2C2C] break-words whitespace-pre-line text-left">{f.feature}</td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-center align-middle">
                            <div className={`px-2 py-1.5 font-bold text-[10px] uppercase rounded-sm inline-block ${getStatusBg(f.lockated)}`}>
                              {f.lockated}
                            </div>
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-center align-middle">
                            <div className={`px-2 py-1.5 font-bold text-[10px] uppercase rounded-sm inline-block ${getStatusBg(f.shawman)}`}>
                              {f.shawman}
                            </div>
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-center align-middle">
                            <div className={`px-2 py-1.5 font-bold text-[10px] uppercase rounded-sm inline-block ${getStatusBg(f.mindbody)}`}>
                              {f.mindbody}
                            </div>
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-center align-middle">
                            <div className={`px-2 py-1.5 font-bold text-[10px] uppercase rounded-sm inline-block ${getStatusBg(f.glofox)}`}>
                              {f.glofox}
                            </div>
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-center align-middle">
                            <div className={`px-2 py-1.5 font-bold text-[10px] uppercase rounded-sm inline-block ${getStatusBg(f.omnify)}`}>
                              {f.omnify}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {dp.priceCompetitiveness && (
                      <tr className="bg-white border-b border-[#D3D1C7]">
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#2C2C2C] text-left">Price Competitiveness</td>
                        <td colSpan={5} className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium leading-relaxed text-left whitespace-pre-line">
                          {dp.priceCompetitiveness}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 2: Pricing Landscape (India Market) */}
          {dp.clubPricingLandscapeRows && dp.clubPricingLandscapeRows.length > 0 && (
            <div className="mt-6">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-[13px] uppercase tracking-wide font-poppins">
                Section 2A: Pricing Landscape - India Market
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[13px] bg-transparent font-poppins leading-[1.45] table-fixed">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase border-b border-[#D3D1C7] text-left">
                      <th className="border border-[#C4B89D] px-3 py-3 w-[16%]">Competitor</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[15%]">Entry Price<br />(INR/mo)</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[15%]">Mid-Market<br />(INR/mo)</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[15%]">Enterprise<br />(INR/mo)</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[22%]">Pricing Model</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[17%]">India Market Presence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.clubPricingLandscapeRows.map((r: any, i: number) => (
                      <tr key={i} className={`align-top border-b border-[#D3D1C7] ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#2C2C2C] break-words whitespace-pre-line">{r.competitor}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-semibold whitespace-pre-line italic text-center">{r.entryPrice}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-semibold whitespace-pre-line italic text-center">{r.midPrice}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-semibold whitespace-pre-line italic text-center">{r.enterprisePrice}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{r.model}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium whitespace-pre-line break-words">{r.segment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 3: Lockated Positioning */}
          {dp.clubPositioning && dp.clubPositioning.length > 0 && (
            <div className="mt-6">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-[13px] uppercase tracking-wide font-poppins">
                Section 3: Lockated Positioning
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[13px] bg-transparent font-poppins leading-[1.45] table-fixed">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase border-b border-[#D3D1C7] text-left">
                      <th className="border border-[#C4B89D] px-3 py-3 w-[25%]">Positioning Dimension</th>
                      <th className="border border-[#C4B89D] px-3 py-3">Statement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.clubPositioning.map((r: any, i: number) => (
                      <tr key={i} className={`align-top border-b border-[#D3D1C7] ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#2C2C2C] break-words whitespace-pre-line">{r.dimension}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium break-words whitespace-pre-line leading-relaxed">{r.statement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Value Propositions by Buyer Persona */}
          {dp.valuePropositions && dp.valuePropositions.length > 0 && (
            <div className="mt-6 mb-8">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-[13px] uppercase tracking-wide font-poppins">
                Section 4: Key Value Propositions By Buyer Persona
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[13px] bg-transparent font-poppins leading-[1.45] table-fixed">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase border-b border-[#D3D1C7] text-left">
                      <th className="border border-[#C4B89D] px-3 py-3 w-[15%]">Persona</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[20%]">Top Value Proposition</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[18%]">Proof Point / Feature</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[17%]">vs. Competitor</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[17%]">Business Impact</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[13%]">Objection Handler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.valuePropositions.map((r: any, i: number) => (
                      <tr key={i} className={`align-top border-b border-[#D3D1C7] ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#2C2C2C] break-words whitespace-pre-line">{r.role}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-semibold break-words whitespace-pre-line leading-relaxed">{r.prop}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#798C5E] font-bold break-words whitespace-pre-line leading-relaxed">{r.feature}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#C72030] font-medium break-words whitespace-pre-line leading-relaxed">{r.weakness}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium italic break-words whitespace-pre-line leading-relaxed">{r.outcome}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#A1A1AA] font-bold text-[11px] uppercase tracking-wide break-words whitespace-pre-line leading-relaxed">{r.objection}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (dp?.isSnagPricing || (dp?.featureComparison && dp?.featureComparison[0]?.snag !== undefined)) ? (
        /* ── SNAG 360 LAYOUT ───────────────────────────────────────────── */
        <>
          {/* Legend bar */}
          <div className="bg-[#F6F4EE] border border-[#D3D1C7] px-4 py-2 mt-2">
            <p className="text-[11px] text-[#DA7756] font-semibold italic uppercase tracking-tighter font-poppins">
              <span className="text-[#A1A1AA]">AHEAD = Snag 360 leads</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="text-[#A1A1AA]">AT PAR = Equal capability</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="text-[#A1A1AA]">GAP = Competitor leads</span>
            </p>
          </div>

          {/* Section 1: Feature Comparison vs Top Competitors */}
          {snagFeatureRows && snagFeatureRows.length > 0 && (
            <div className="mt-4">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-[13px] uppercase tracking-wide font-poppins">
                Section 1: Feature Comparison vs Top Competitors
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[13px] bg-transparent font-poppins leading-[1.45] table-fixed">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase border-b border-[#D3D1C7] text-center">
                      <th className="border border-[#C4B89D] px-3 py-3 w-[22%] text-left">Feature / Capability</th>
                      <th className="border border-[#C4B89D] px-3 py-3">Snag 360</th>
                      <th className="border border-[#C4B89D] px-3 py-3">FalconBrick</th>
                      <th className="border border-[#C4B89D] px-3 py-3">Procore</th>
                      <th className="border border-[#C4B89D] px-3 py-3">Novade</th>
                      <th className="border border-[#C4B89D] px-3 py-3">SnagR</th>
                      <th className="border border-[#C4B89D] px-3 py-3">SafetyCulture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snagFeatureRows.map((f, i: number) => {
                      return (
                        <tr key={i} className={`align-middle border-b border-[#D3D1C7] ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                          <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#2C2C2C] break-words whitespace-pre-line">{f.feature}</td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line">{"snag360" in f ? (f.snag360 || f.snag) : f.snag}</td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium">{"falconBrick" in f ? (f.falconBrick || f.falcon) : f.falcon}</td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium whitespace-pre-line">{f.procore}</td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium">{f.novade}</td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium">{f.snagR}</td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium">{"safetyCulture" in f ? (f.safetyCulture || f.safety) : f.safety}</td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 2: Pricing Landscape (India and Global) */}
          {snagPricingRows && snagPricingRows.length > 0 && (
            <div className="mt-6">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-[13px] uppercase tracking-wide font-poppins">
                Section 2: Pricing Landscape (India and Global)
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[13px] bg-transparent font-poppins leading-[1.45] table-fixed">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase border-b border-[#D3D1C7] text-left">
                      <th className="border border-[#C4B89D] px-3 py-3 w-[15%]">Tier</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[15%]">Pricing Model</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[15%]">India Price Range<br />(INR/user/mo)</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[15%]">Global Price<br />(USD/user/mo)</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[22%]">What's Included</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[18%]">Target Segment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snagPricingRows.map((r, i: number) => (
                      <tr key={i} className={`align-top border-b border-[#D3D1C7] ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#2C2C2C] break-words whitespace-pre-line">{r.tier}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line">{r.model}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#798C5E] font-semibold whitespace-pre-line italic text-center">{r.indiaPrice || r.india}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium whitespace-pre-line italic text-center">{r.globalPrice || r.global}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{r.included}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#4B5563] font-medium whitespace-pre-line break-words">{r.segment || r.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 3: Competitive Positioning Statement */}
          {dp.competitivePositioningStatement && (
            <div className="mt-6">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-[13px] uppercase tracking-wide font-poppins">
                Section 3: Competitive Positioning Statement
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white px-4 py-4 font-medium text-[13px] text-[#2C2C2C] leading-relaxed font-poppins whitespace-pre-line">
                {dp.competitivePositioningStatement}
              </div>
            </div>
          )}

          {/* Section 4: Value Propositions by Buyer Role */}
          {snagValueRows && snagValueRows.length > 0 && (
            <div className="mt-6 mb-8">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-[13px] uppercase tracking-wide font-poppins">
                Section 4: Value Propositions by Buyer Role
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[13px] bg-transparent font-poppins leading-[1.45] table-fixed">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase border-b border-[#D3D1C7] text-left">
                      <th className="border border-[#C4B89D] px-3 py-3 w-[18%]">Buyer Role</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[36%]">Primary Value Proposition</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[22%]">Quantified Outcome</th>
                      <th className="border border-[#C4B89D] px-3 py-3 w-[24%]">Key Feature Driving This</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snagValueRows.map((r, i: number) => (
                      <tr key={i} className={`align-top border-b border-[#D3D1C7] ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#2C2C2C] break-words whitespace-pre-line">{r.role || ""}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-semibold break-words whitespace-pre-line leading-relaxed">{r.prop || ""}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#C72030] font-medium break-words whitespace-pre-line leading-relaxed italic">{r.outcome || ""}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#798C5E] font-bold break-words whitespace-pre-line leading-relaxed">{r.feature || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : dp ? (
        /* ── STANDARD LAYOUT (VendorManagement & similar) ──────────────── */
        <>
          {/* Legend bar */}
          <div className="bg-[#F6F4EE] border border-[#D3D1C7] px-4 py-2 mt-2">
            <p className="text-[10px] text-gray-600 font-semibold italic uppercase tracking-tighter font-poppins">
              Status:&nbsp;<span className="text-[#DA7756]">AHEAD</span> = VMS
              leads&nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="text-[#2C2C2C]/70">AT PAR</span> =
              comparable&nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="text-gray-500">GAP</span> = competitor leads
            </p>
          </div>

          {/* ── Section 1: Feature Comparison vs Top Competitors ──────────── */}
          {dp.featuresVsMarket &&
            dp.featuresVsMarket.length > 0 &&
            (() => {
              // Detect per-competitor format (has .competitors array per row)
              const isPerCompetitor =
                dp.featuresVsMarket[0]?.competitors != null;

              if (isPerCompetitor) {
                // Collect ordered competitor names from first row
                const competitorNames: string[] =
                  dp.featuresVsMarket[0].competitors?.map((c) => c.name) ?? [];

                return (
                  <div className="mt-4">
                    <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                      Section 1 — Feature Comparison vs Top{" "}
                      {competitorNames.length} Competitors
                    </div>
                    <div className="border border-[#D3D1C7] border-t-0 bg-white">
                      <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.35] table-fixed">
                        <thead>
                          <tr className="bg-[#DA7756] text-white font-semibold uppercase text-sm border-b border-[#D3D1C7]">
                            <th className="border border-[#D3D1C7] px-2 py-2 text-left w-[20%]">
                              Feature Area
                            </th>
                            <th className="border border-[#D3D1C7] px-2 py-2 text-center w-[10%]">
                              VMS
                            </th>
                            {competitorNames.map((name) => (
                              <th
                                key={name}
                                className="border border-[#D3D1C7] px-2 py-2 text-center"
                              >
                                {name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dp.featuresVsMarket.map((f, i: number) => (
                            <tr
                              key={i}
                              className={`align-middle ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                            >
                              <td className="border border-[#D3D1C7] px-2 py-2 font-bold text-[#2C2C2C] text-[10px] break-words whitespace-pre-line">
                                {f.featureArea}
                              </td>
                              <td className="border border-[#D3D1C7] px-2 py-2 text-center">
                                <StatusBadge status={f.vmsStatus || "AHEAD"} />
                              </td>
                              {(f.competitors ?? []).map((c) => (
                                <td
                                  key={c.name}
                                  className="border border-[#D3D1C7] px-2 py-2 text-center"
                                >
                                  <StatusBadge status={c.status} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              if (hasRichFeatureBenchmark) {
                return (
                  <div className="mt-4">
                    <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                      Part A — Current Features vs Market Standard
                    </div>
                    <div className="border border-[#D3D1C7] border-t-0 bg-white">
                      <table className="w-full border-collapse text-[10px] bg-transparent text-left font-poppins leading-[1.4] table-fixed">
                        <thead>
                          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-sm">
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[16%] text-left">
                              Feature Area
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[22%] text-left">
                              Market Standard
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[22%] text-left">
                              Our Product
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[18%] text-center">
                              Where We Stand
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                              Deal Impact
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dp.featuresVsMarket.map((f, i: number) => {
                            return (
                              <tr
                                key={i}
                                className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                              >
                                <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#2C2C2C] whitespace-pre-line break-words">
                                  {f.featureArea}
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/80 font-medium leading-snug whitespace-pre-line break-words">
                                  {f.marketStandard}
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-[#4B5563] font-medium leading-snug whitespace-pre-line break-words">
                                  {f.ourProduct}
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-center align-middle">
                                  <StatusBadge status={f.whereWeStand || f.status} />
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium leading-snug whitespace-pre-line break-words">
                                  {f.dealImpact || f.summary}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              // Fallback: legacy format (featureArea | marketStandard | ourProduct | status | summary)
              return (
                <div className="mt-4">
                  <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                    Part A — Feature Comparison vs Market Standard
                  </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent text-left font-poppins leading-[1.4]">
                      <thead>
                        <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[16%] text-left">
                            Feature Area
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[25%] text-left">
                            Market Standard (What Most Products Offer)
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[25%] text-left">
                            Our Product (Have / Roadmap / Gap)
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                            Summary: Where Ahead / At Par / Gap That Will Cost Deals
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dp.featuresVsMarket.map((f, i: number) => (
                          <tr
                            key={i}
                            className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                          >
                            <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#2C2C2C]">
                              {f.featureArea}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/80 font-medium leading-snug">
                              {f.marketStandard}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#4B5563] font-medium leading-snug">
                              {f.ourProduct}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium leading-snug italic">
                              {f.summary}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

          {!!dp.pricingSummaryRows?.length && (
            <div className="mt-4 border border-[#D3D1C7] bg-white">
              <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                <tbody>
                  {dp.pricingSummaryRows.map((row, i: number) => {
                    const rowClass =
                      row.tone === "green"
                        ? "bg-[#D8EEDB] text-[#2F855A]"
                        : row.tone === "yellow"
                          ? "bg-[#D9E8F4] text-[#2563EB]"
                          : "bg-[#F6D7D5] text-[#C72030]";
                    return (
                      <tr key={i} className={i > 0 ? "border-t border-[#D3D1C7]" : ""}>
                        <td className={`w-[24%] border-r border-[#D3D1C7] px-3 py-2 font-bold uppercase whitespace-pre-line ${rowClass}`}>
                          {row.label}
                        </td>
                        <td className={`px-3 py-2 font-medium leading-relaxed whitespace-pre-line ${rowClass}`}>
                          {row.detail}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Section 2: Competitive Position Summary ───────────────────── */}
          {dp.comparisonSummary &&
            (() => {
              const cs = dp.comparisonSummary;
              // New two-column format: { advantageAreas: string[], threatAreas: string[] }
              const isNewFormat = Array.isArray(cs.advantageAreas);

              if (isNewFormat) {
                const maxRows = Math.max(
                  (cs.advantageAreas || []).length,
                  (cs.threatAreas || []).length,
                  (cs.atPar || []).length
                );
                return (
                  <div className="mt-6">
                    <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                      Section 2 — Competitive Position Summary
                    </div>
                    <div className="border border-[#D3D1C7] border-t-0 bg-white">
                      <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.5]">
                        <thead>
                          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-sm">
                            <th className="border border-[#D3D1C7] px-4 py-2 w-[33%] text-left">
                              VMS Advantage Areas
                            </th>
                            <th className="border border-[#D3D1C7] px-4 py-2 w-[33%] text-left">
                              Competitor Threat Areas
                            </th>
                            <th className="border border-[#D3D1C7] px-4 py-2 w-[34%] text-left">
                              Comparable Areas
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: maxRows }).map((_, i) => (
                            <tr
                              key={i}
                              className={
                                i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"
                              }
                            >
                              <td className="border border-[#D3D1C7] px-4 py-2 text-[#DA7756] align-top font-medium leading-relaxed">
                                {cs.advantageAreas?.[i] || ""}
                              </td>
                              <td className="border border-[#D3D1C7] px-4 py-2 text-[#2C2C2C]/70 align-top font-medium leading-relaxed">
                                {cs.threatAreas?.[i] || ""}
                              </td>
                              <td className="border border-[#D3D1C7] px-4 py-2 text-[#2C2C2C]/70 align-top font-medium leading-relaxed">
                                {cs.atPar?.[i] || ""}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              // Legacy format: { ahead, atPar, gaps } strings
              return (
                <div className="mt-6">
                  <div className="bg-[#F6F4EE] text-[#2C2C2C] border border-[#D3D1C7] px-4 py-3 font-bold text-sm uppercase tracking-wider font-poppins">
                    Part B — Summary
                  </div>
                  <div className="border border-[#D3D1C7] border-t-0">
                    <table className="w-full border-collapse text-[12px] bg-transparent font-poppins leading-[1.6] table-fixed">
                      <tbody>
                        {cs.ahead && (
                          <tr className="align-top">
                            <td className="border border-[#D3D1C7] px-4 py-4 font-bold uppercase text-[#2C2C2C] bg-[#E2EFDA] w-[22%] whitespace-pre-line">
                              Where We Are Ahead of Market
                            </td>
                            <td className="border border-[#D3D1C7] px-4 py-4 text-[#2C2C2C] font-medium bg-[#F0F7EC] whitespace-pre-line leading-relaxed">
                              {cs.ahead}
                            </td>
                          </tr>
                        )}
                        {cs.atPar && (
                          <tr className="align-top">
                            <td className="border border-[#D3D1C7] px-4 py-4 font-bold uppercase text-[#2C2C2C] bg-[#E2EFDA] w-[22%] whitespace-pre-line">
                              Where We Are at Par
                            </td>
                            <td className="border border-[#D3D1C7] px-4 py-4 text-[#2C2C2C] font-medium bg-[#F0F7EC] whitespace-pre-line leading-relaxed">
                              {cs.atPar}
                            </td>
                          </tr>
                        )}
                        {cs.gaps && (
                          <tr className="align-top">
                            <td className="border border-[#D3D1C7] px-4 py-4 font-bold uppercase text-[#C72030] bg-[#FCE4E4] w-[22%] whitespace-pre-line">
                              Gaps That Will Cost Us Deals
                            </td>
                            <td className="border border-[#D3D1C7] px-4 py-4 text-[#2C2C2C] font-medium bg-[#FEF2F2] whitespace-pre-line leading-relaxed">
                              {cs.gaps}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

          {/* ── Section 3: Pricing / Market ───────────────────────────────── */}
          {dp.currentPricingMarket && dp.currentPricingMarket.length > 0 ? (
            <div className="mt-6">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                Part B — Current Pricing Market
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-sm">
                      <th className="border border-[#D3D1C7] px-3 py-2 w-[24%] text-left">
                        Category
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.currentPricingMarket.map((row, i: number) => (
                      <tr
                        key={i}
                        className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                      >
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#DA7756] whitespace-pre-line break-words align-top">
                          {row.category}
                        </td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#374151] font-medium leading-relaxed whitespace-pre-line break-words">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            dp.pricingLandscape &&
            dp.pricingLandscape.length > 0 &&
            (() => {
              // New detailed format: { tier, orgSize, vendorCount, price, modules }
              const isNewFormat = dp.pricingLandscape[0]?.orgSize != null;

              if (isNewFormat) {
                return (
                  <div className="mt-6">
                    <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                      Section 3 — Pricing Landscape (India Market)
                    </div>
                    <div className="border border-[#D3D1C7] border-t-0 bg-white">
                      <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                        <thead>
                          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-sm">
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[10%] text-left">
                              Tier
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[18%] text-left">
                              Typical Org Size
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[14%] text-left">
                              Vendor Count
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[20%] text-left">
                              Recommended Annual Price (INR)
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                              Modules Included
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dp.pricingLandscape.map((p, i: number) => (
                            <tr
                              key={i}
                              className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                            >
                              <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#DA7756] uppercase">
                                {p.tier}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium">
                                {p.orgSize}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium">
                                {p.vendorCount}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-semibold">
                                {p.price}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium leading-relaxed">
                                {p.modules}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              // Legacy: { tier, model } fallback
              return (
                <div className="mt-6">
                  <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                    Section 3 — Pricing Landscape (India Market)
                  </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                      <thead>
                        <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[12%] text-left">
                            Tier
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                            Pricing Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dp.pricingLandscape.map((p, i: number) => (
                          <tr
                            key={i}
                            className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                          >
                            <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#DA7756] uppercase align-top">
                              {p.tier}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-3 text-[#374151] font-medium leading-relaxed">
                              {p.model}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()
          )}

          {/* ── Section 4: Positioning ────────────────────────────────────── */}
          {dp.positioning && dp.positioning.length > 0 && (
            <div className="mt-6">
              <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                Part C — Positioning
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-sm">
                      <th className="border border-[#D3D1C7] px-3 py-2 w-[28%] text-left">
                        Positioning Category
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                        Detail
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.positioning.map((row, i: number) => (
                      <tr
                        key={i}
                        className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                      >
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#DA7756] whitespace-pre-line break-words align-top">
                          {row.category}
                        </td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#374151] font-medium leading-relaxed whitespace-pre-line break-words">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Section 5: Key Value Propositions ─────────────────────────── */}
          {dp.valuePropositions &&
            dp.valuePropositions.length > 0 &&
            (() => {
              // New format: { proposition, quantifiedBenefit, targetBuyer }
              const isNewFormat = dp.valuePropositions[0]?.proposition != null;

              if (hasRichValueProps) {
                return (
                  <div className="mt-6 mb-6">
                    <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                      Part D — Value Propositions & Improvements
                    </div>
                    <div className="border border-[#D3D1C7] border-t-0 bg-white">
                      <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.4] table-fixed">
                        <thead>
                          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-sm">
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[25%] text-left">
                              Current Value Proposition
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[20%] text-left">
                              Segment it Addresses
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[25%] text-left">
                              Weakness in Current Framing
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[30%] text-left">
                              Sharpened or Expanded Version
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dp.valuePropositions.map((v, i: number) => (
                            <tr
                              key={i}
                              className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                            >
                              <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#2C2C2C] whitespace-pre-line break-words">
                                {v.currentProp}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-gray-700 font-medium leading-snug whitespace-pre-line break-words">
                                {v.communicatesToday || ""}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/70 font-medium leading-snug whitespace-pre-line break-words">
                                {v.weakness}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-[#DA7756] font-semibold leading-snug whitespace-pre-line break-words">
                                {v.sharpened}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              if (isNewFormat) {
                return (
                  <div className="mt-6 mb-6">
                    <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                      Part D — Value Propositions & Improvements
                    </div>
                    <div className="border border-[#D3D1C7] border-t-0 bg-white">
                      <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.4]">
                        <thead>
                          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-sm">
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[22%] text-left">
                              Value Proposition
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                              Quantified Benefit
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 w-[22%] text-left">
                              Target Buyer
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dp.valuePropositions.map((v, i: number) => (
                            <tr
                              key={i}
                              className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                            >
                              <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#2C2C2C]">
                                {v.proposition}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-[#DA7756] font-medium leading-snug">
                                {v.quantifiedBenefit}
                              </td>
                              <td className="border border-[#D3D1C7] px-3 py-2 text-gray-600 font-semibold">
                                {v.targetBuyer}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              // Legacy: { currentProp, segment, weakness, sharpened }
              return (
                <div className="mt-6 mb-6">
                  <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                    Part D — Value Propositions & Improvements
                  </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.4]">
                      <thead>
                        <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[20%] text-left">
                            Value Proposition
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[18%] text-left">
                            Target Buyer
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[22%] text-left">
                            Weakness In Current Framing
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                            Sharpened Or Expanded Version
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dp.valuePropositions.map((v, i: number) => (
                          <tr
                            key={i}
                            className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                          >
                            <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#2C2C2C] whitespace-pre-line break-words">
                              {v.currentProp}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-gray-600 font-semibold whitespace-pre-line break-words">
                              {v.segment}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/70 font-medium leading-snug whitespace-pre-line break-words">
                              {v.weakness}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#DA7756] font-semibold leading-snug whitespace-pre-line break-words">
                              {v.sharpened}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
        </>
      ) : null}
    </>
  );
};

export default PricingTab;
