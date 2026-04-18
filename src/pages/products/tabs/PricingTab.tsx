import React from "react";
import { ProductData } from "../types";

interface PricingTabProps {
  productData: ProductData;
}

/* ── Badge helper ─────────────────────────────────────────────────────────── */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = (status || "").toUpperCase().trim();
  const cls = s.includes("AHEAD")
    ? "bg-gray-700 text-white"
    : s.includes("AT PAR") || s.includes("ATPAR")
    ? "bg-gray-300 text-gray-900"
    : s.includes("GAP")
    ? "bg-gray-100 text-gray-700 border border-[#D3D1C7]"
    : "bg-gray-200 text-gray-700";
  return (
    <span
      className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-tight block text-center rounded-sm ${cls}`}
    >
      {status}
    </span>
  );
};

const PricingTab: React.FC<PricingTabProps> = ({ productData }) => {
  const dp = productData.extendedContent?.detailedPricing;

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-white text-gray-900 border border-[#D3D1C7] p-4 rounded-t-xl mb-0 flex justify-between items-center">
        <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
          {productData.name} — Competitive Feature Comparison &amp; Pricing
        </h2>
      </div>

      {/* ── EXCEL LAYOUT (excelLikePricing = true) ──────────────────────── */}
      {productData.excelLikePricing && dp ? (
        <div className="overflow-x-auto border border-[#E5E7EB] bg-transparent p-2">
          <div className="min-w-[1850px] bg-transparent">
            <div className="mt-2 flex gap-6">
              <div className="w-[1180px] shrink-0 space-y-3">

                {/* Section 1 header */}
                <table className="w-full border-collapse bg-transparent text-[9px] leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                      <th className="border border-gray-300 px-2 py-1.5 text-center font-semibold" colSpan={6}>
                        Post Sales - Features &amp; Pricing
                      </th>
                    </tr>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                      <th className="border border-gray-300 px-2 py-1 text-left text-[8px] font-semibold" colSpan={6}>
                        {dp.pricingMatrixSubtitle ||
                          "Section 1 compares current feature depth vs market expectations and highlights where positioning is strongest or vulnerable."}
                      </th>
                    </tr>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                      <th className="border border-gray-300 px-1.5 py-1 text-left font-semibold uppercase" colSpan={6}>
                        Section 1: Current features vs market standard | Where we are strong, where we are weak
                      </th>
                    </tr>
                    <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[18%]">Feature / Capability</th>
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[18%]">Current State</th>
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[18%]">What Market Expects</th>
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[18%]">How This Helps / Hurts Us</th>
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-center w-[8%]">Status</th>
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[20%]">Recommended Move</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.pricingFeatureRows?.map((row, index: number) => {
                      const tone = row.status.toUpperCase();
                      const statusBg =
                        tone.includes("AHEAD") || tone.includes("STRONG")
                          ? "bg-gray-700 text-white"
                          : tone.includes("PAR") || tone.includes("OK")
                          ? "bg-gray-300 text-gray-800"
                          : "bg-gray-100 text-gray-500 border border-[#D3D1C7]";
                      return (
                        <tr key={index} className="align-top border-b border-[#E5E7EB]">
                          <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 font-bold text-[#2C2C2C]">{row.capability}</td>
                          <td className="border border-[#E5E7EB] bg-transparent px-1.5 py-1 text-[#2C2C2C]/80">{row.currentState}</td>
                          <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/80">{row.marketNeed}</td>
                          <td className="border border-[#E5E7EB] bg-transparent px-1.5 py-1 text-[#2C2C2C]/80">{row.impact}</td>
                          <td className="border border-[#E5E7EB] px-1 py-1 text-center">
                            <span className={`px-1.5 py-1 font-semibold uppercase text-[8px] tracking-tight block rounded-sm ${statusBg}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="border border-[#E5E7EB] px-1.5 py-1 text-gray-700">{row.recommendation}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* pricingSummaryRows */}
                {!!dp.pricingSummaryRows?.length && (
                  <table className="w-full border-collapse bg-transparent text-[9px] leading-[1.2] font-poppins">
                    <tbody>
                      {dp.pricingSummaryRows.map((row, index: number) => {
                        const bgClass =
                          row.tone === "green"
                            ? "bg-gray-100 text-gray-800"
                            : row.tone === "yellow"
                            ? "bg-white text-gray-600"
                            : "bg-gray-50 text-gray-500";
                        return (
                          <tr key={index}>
                            <td className={`w-[26%] border border-[#E5E7EB] px-2 py-1 font-semibold uppercase ${bgClass}`}>{row.label}</td>
                            <td className={`border border-[#E5E7EB] px-2 py-1 ${bgClass}`}>{row.detail}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {/* Section 2: pricing current rows */}
                <table className="w-full border-collapse bg-transparent text-[9px] leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                      <th className="border border-gray-300 px-1.5 py-1 text-left font-semibold uppercase" colSpan={2}>
                        Section 2: Current pricing and plans | What we charge and how it lands
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.pricingCurrentRows?.map((row, index: number) => (
                      <tr key={index}>
                        <td className="w-[24%] border border-[#E5E7EB] px-2 py-1 font-bold text-[#2C2C2C]">{row.label}</td>
                        <td className="border border-[#E5E7EB] bg-transparent px-2 py-1 text-[#2C2C2C]/80">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Section 3: positioning rows */}
                <table className="w-full border-collapse bg-transparent text-[9px] leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                      <th className="border border-gray-300 px-1.5 py-1 text-left font-semibold uppercase" colSpan={3}>
                        Section 3: Positioning | Why this offer is hard to ignore
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.pricingPositioningRows?.map((row, index: number) => (
                      <tr key={index} className="align-top">
                        <td className="w-[22%] border border-[#E5E7EB] bg-white px-2 py-1 font-bold text-[#2C2C2C]">{row.question}</td>
                        <td className="border border-[#E5E7EB] bg-transparent px-2 py-1 text-[#2C2C2C]/80">{row.answer}</td>
                        <td className="w-[22%] border border-[#E5E7EB] px-2 py-1 text-gray-700">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Section 4: improvement rows */}
                <table className="w-full border-collapse bg-transparent text-[9px] leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                      <th className="border border-gray-300 px-1.5 py-1 text-left font-semibold uppercase" colSpan={4}>
                        Section 4: Value proposition and suggested improvements
                      </th>
                    </tr>
                    <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[25%]">Current Prop</th>
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[22%]">Suggested Fix</th>
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[28%]">Improved Framing</th>
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left w-[25%]">Why It Matters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.pricingImprovementRows?.map((row, index: number) => (
                      <tr key={index} className="align-top">
                        <td className="border border-[#E5E7EB] bg-white px-2 py-1 text-[#2C2C2C] font-bold">{row.currentProp}</td>
                        <td className="border border-[#E5E7EB] px-2 py-1 text-[#4B5563]">{row.suggestedFix}</td>
                        <td className="border border-[#E5E7EB] px-2 py-1 text-[#798C5E]">{row.improvedFraming}</td>
                        <td className="border border-[#E5E7EB] bg-transparent px-2 py-1 text-gray-700">{row.whyItWins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>

      ) : dp ? (
        /* ── STANDARD LAYOUT (VendorManagement & similar) ──────────────── */
        <>
          {/* Legend bar */}
          <div className="bg-gray-50 border border-[#D3D1C7] px-4 py-2 mt-2">
            <p className="text-[10px] text-gray-600 font-semibold italic uppercase tracking-tighter font-poppins">
              Status:&nbsp;<span className="text-gray-800">AHEAD</span> = VMS leads&nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="text-gray-700">AT PAR</span> = comparable&nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="text-gray-500">GAP</span> = competitor leads
            </p>
          </div>

          {/* ── Section 1: Feature Comparison vs Top Competitors ──────────── */}
          {dp.featuresVsMarket && dp.featuresVsMarket.length > 0 && (() => {
            // Detect per-competitor format (has .competitors array per row)
            const isPerCompetitor = dp.featuresVsMarket[0]?.competitors != null;

            if (isPerCompetitor) {
              // Collect ordered competitor names from first row
              const competitorNames: string[] =
                dp.featuresVsMarket[0].competitors?.map((c) => c.name) ?? [];

              return (
                <div className="mt-4">
                  <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                    Section 1 — Feature Comparison vs Top {competitorNames.length} Competitors
                  </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.35] table-fixed">
                      <thead>
                        <tr className="bg-white text-gray-800 font-semibold uppercase text-[9px] border-b border-[#D3D1C7]">
                          <th className="border border-[#D3D1C7] px-2 py-2 text-left w-[20%]">Feature Area</th>
                          <th className="border border-[#D3D1C7] px-2 py-2 text-center w-[10%]">VMS</th>
                          {competitorNames.map((name) => (
                            <th key={name} className="border border-[#D3D1C7] px-2 py-2 text-center">
                              {name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dp.featuresVsMarket.map((f, i: number) => (
                          <tr key={i} className={`align-middle ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                            <td className="border border-[#D3D1C7] px-2 py-2 font-bold text-[#2C2C2C] text-[10px] break-words whitespace-pre-line">
                              {f.featureArea}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-center">
                              <StatusBadge status={f.vmsStatus || "AHEAD"} />
                            </td>
                            {(f.competitors ?? []).map((c) => (
                              <td key={c.name} className="border border-[#D3D1C7] px-2 py-2 text-center">
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

            // Fallback: legacy format (featureArea | marketStandard | ourProduct | status | summary)
            return (
              <div className="mt-4">
                <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                  Section 1 — Feature Comparison vs Top Competitors
                </div>
                <div className="border border-[#D3D1C7] border-t-0 bg-white">
                  <table className="w-full border-collapse text-[10px] bg-transparent text-left font-poppins leading-[1.4]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 font-semibold uppercase">
                        <th className="border border-[#D3D1C7] px-3 py-2 w-[16%] text-left">Feature Area</th>
                        <th className="border border-[#D3D1C7] px-3 py-2 w-[25%] text-left">Competitor Landscape</th>
                        <th className="border border-[#D3D1C7] px-3 py-2 w-[25%] text-left">Our Product (VMS)</th>
                        <th className="border border-[#D3D1C7] px-3 py-2 w-[8%] text-center">Status</th>
                        <th className="border border-[#D3D1C7] px-3 py-2 text-left">Sales Insight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dp.featuresVsMarket.map((f, i: number) => (
                        <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                          <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#2C2C2C]">{f.featureArea}</td>
                          <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/80 font-medium leading-snug">{f.marketStandard}</td>
                          <td className="border border-[#D3D1C7] px-3 py-2 text-[#4B5563] font-medium leading-snug">{f.ourProduct}</td>
                          <td className="border border-[#D3D1C7] px-3 py-2 text-center">
                            <StatusBadge status={f.status} />
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium leading-snug italic">{f.summary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ── Section 2: Competitive Position Summary ───────────────────── */}
          {dp.comparisonSummary && (() => {
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
                  <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                    Section 2 — Competitive Position Summary
                  </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.5]">
                      <thead>
                        <tr className="bg-gray-100 text-gray-800 font-semibold uppercase text-[9px]">
                          <th className="border border-[#D3D1C7] px-4 py-2 w-[33%] text-left">VMS Advantage Areas</th>
                          <th className="border border-[#D3D1C7] px-4 py-2 w-[33%] text-left">Competitor Threat Areas</th>
                          <th className="border border-[#D3D1C7] px-4 py-2 w-[34%] text-left">Comparable Areas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: maxRows }).map((_, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-[#D3D1C7] px-4 py-2 text-gray-800 align-top font-medium leading-relaxed">
                              {cs.advantageAreas?.[i] || ""}
                            </td>
                            <td className="border border-[#D3D1C7] px-4 py-2 text-gray-700 align-top font-medium leading-relaxed">
                              {cs.threatAreas?.[i] || ""}
                            </td>
                            <td className="border border-[#D3D1C7] px-4 py-2 text-gray-700 align-top font-medium leading-relaxed">
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
                <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                  Section 2 — Competitive Position Summary
                </div>
                <div className="border border-[#D3D1C7] border-t-0 bg-white">
                  <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.5]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 font-semibold uppercase text-[9px]">
                        <th className="border border-[#D3D1C7] px-4 py-2 w-[40%] text-left">VMS Advantage Areas</th>
                        <th className="border border-[#D3D1C7] px-4 py-2 text-left">Competitor Threat Areas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border border-[#D3D1C7] px-4 py-3 text-gray-800 whitespace-pre-line align-top font-medium leading-relaxed">
                          {cs.ahead}
                        </td>
                        <td className="border border-[#D3D1C7] px-4 py-3 text-gray-700 whitespace-pre-line align-top font-medium leading-relaxed">
                          {cs.gaps}
                        </td>
                      </tr>
                      {cs.atPar && (
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="border border-[#D3D1C7] px-4 py-2 text-gray-600 font-semibold uppercase text-[8px]">
                            AT PAR (comparable)
                          </td>
                        </tr>
                      )}
                      {cs.atPar && (
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="border border-[#D3D1C7] px-4 py-3 text-gray-600 whitespace-pre-line font-medium leading-relaxed">
                            {cs.atPar}
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
              <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                Part B — Current Pricing Market
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 font-semibold uppercase text-[9px]">
                      <th className="border border-[#D3D1C7] px-3 py-2 w-[24%] text-left">Category</th>
                      <th className="border border-[#D3D1C7] px-3 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.currentPricingMarket.map((row, i: number) => (
                      <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-gray-800 whitespace-pre-line break-words align-top">{row.category}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#374151] font-medium leading-relaxed whitespace-pre-line break-words">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : dp.pricingLandscape && dp.pricingLandscape.length > 0 && (() => {
            // New detailed format: { tier, orgSize, vendorCount, price, modules }
            const isNewFormat = dp.pricingLandscape[0]?.orgSize != null;

            if (isNewFormat) {
              return (
                <div className="mt-6">
                  <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                    Section 3 — Pricing Landscape (India Market)
                  </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                      <thead>
                        <tr className="bg-gray-100 text-gray-800 font-semibold uppercase text-[9px]">
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[10%] text-left">Tier</th>
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[18%] text-left">Typical Org Size</th>
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[14%] text-left">Vendor Count</th>
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[20%] text-left">Recommended Annual Price (INR)</th>
                          <th className="border border-[#D3D1C7] px-3 py-2 text-left">Modules Included</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dp.pricingLandscape.map((p, i: number) => (
                          <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                            <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-gray-800 uppercase">{p.tier}</td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium">{p.orgSize}</td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium">{p.vendorCount}</td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-semibold">{p.price}</td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#374151] font-medium leading-relaxed">{p.modules}</td>
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
                <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                  Section 3 — Pricing Landscape (India Market)
                </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 font-semibold uppercase">
                        <th className="border border-[#D3D1C7] px-3 py-2 w-[12%] text-left">Tier</th>
                        <th className="border border-[#D3D1C7] px-3 py-2 text-left">Pricing Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dp.pricingLandscape.map((p, i: number) => (
                        <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                          <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-gray-800 uppercase align-top">{p.tier}</td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#374151] font-medium leading-relaxed">{p.model}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ── Section 4: Positioning ────────────────────────────────────── */}
          {dp.positioning && dp.positioning.length > 0 && (
            <div className="mt-6">
              <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                Part C — Positioning
              </div>
              <div className="border border-[#D3D1C7] border-t-0 bg-white">
                <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.45]">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 font-semibold uppercase text-[9px]">
                      <th className="border border-[#D3D1C7] px-3 py-2 w-[28%] text-left">Positioning Category</th>
                      <th className="border border-[#D3D1C7] px-3 py-2 text-left">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dp.positioning.map((row, i: number) => (
                      <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="border border-[#D3D1C7] px-3 py-3 font-bold text-gray-800 whitespace-pre-line break-words align-top">{row.category}</td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#374151] font-medium leading-relaxed whitespace-pre-line break-words">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Section 5: Key Value Propositions ─────────────────────────── */}
          {dp.valuePropositions && dp.valuePropositions.length > 0 && (() => {
            // New format: { proposition, quantifiedBenefit, targetBuyer }
            const isNewFormat = dp.valuePropositions[0]?.proposition != null;

            if (isNewFormat) {
              return (
                <div className="mt-6 mb-6">
                  <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                    Part D — Value Propositions & Improvements
                  </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.4]">
                      <thead>
                        <tr className="bg-gray-100 text-gray-800 font-semibold uppercase text-[9px]">
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[22%] text-left">Value Proposition</th>
                          <th className="border border-[#D3D1C7] px-3 py-2 text-left">Quantified Benefit</th>
                          <th className="border border-[#D3D1C7] px-3 py-2 w-[22%] text-left">Target Buyer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dp.valuePropositions.map((v, i: number) => (
                          <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                            <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#2C2C2C]">{v.proposition}</td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-gray-800 font-medium leading-snug">{v.quantifiedBenefit}</td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-gray-600 font-semibold">{v.targetBuyer}</td>
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
                  <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                    Part D — Value Propositions & Improvements
                </div>
                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                    <table className="w-full border-collapse text-[10px] bg-transparent font-poppins leading-[1.4]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 font-semibold uppercase">
                        <th className="border border-[#D3D1C7] px-3 py-2 w-[20%] text-left">Value Proposition</th>
                        <th className="border border-[#D3D1C7] px-3 py-2 w-[18%] text-left">Target Buyer</th>
                        <th className="border border-[#D3D1C7] px-3 py-2 w-[22%] text-left">Weakness In Current Framing</th>
                        <th className="border border-[#D3D1C7] px-3 py-2 text-left">Sharpened Or Expanded Version</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dp.valuePropositions.map((v, i: number) => (
                        <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                          <td className="border border-[#D3D1C7] px-3 py-2 font-bold text-[#2C2C2C] whitespace-pre-line break-words">{v.currentProp}</td>
                          <td className="border border-[#D3D1C7] px-3 py-2 text-gray-600 font-semibold whitespace-pre-line break-words">{v.segment}</td>
                          <td className="border border-[#D3D1C7] px-3 py-2 text-gray-700 font-medium leading-snug whitespace-pre-line break-words">{v.weakness}</td>
                          <td className="border border-[#D3D1C7] px-3 py-2 text-gray-800 font-semibold leading-snug whitespace-pre-line break-words">{v.sharpened}</td>
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
