import React from "react";
import { ProductData } from "../types";

interface RoadmapTabProps {
  productData: ProductData;
}

const RoadmapTab = ({ productData }: RoadmapTabProps) => {
  const structuredRoadmap =
    productData.extendedContent?.detailedRoadmap?.structuredRoadmap;
  const roadmapTableVariant =
    productData.extendedContent?.detailedRoadmap?.roadmapTableVariant;
  const hasVendorRoadmapGrid =
    structuredRoadmap?.some((section) =>
      section.items.some(
        (item) =>
          item.phaseLabel ||
          item.theme ||
          item.estTimeline ||
          item.revenueImpact
      )
    ) ?? false;
  const detailedRoadmap = productData.extendedContent?.detailedRoadmap;
  const isClubRoadmap = !!detailedRoadmap?.isClubRoadmap;
  const hasFeatureNameTop = structuredRoadmap?.some((section) => section.items.some((item) => item.featureName?.trim())) ?? false;

  return (
    <div className="space-y-12 animate-fade-in">
      {roadmapTableVariant === "html" && structuredRoadmap?.length ? (
        <div className="bg-transparent p-3">
          <div className="w-full rounded-md border border-[#C4B89D] bg-white">
            <div className="px-4 pt-4 pb-6">
              <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
                <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
                  {productData.name} — Product Roadmap
                </h2>
              </div>

              <div className="mt-6 space-y-6">
                {structuredRoadmap.map((section, sIdx) => {
                  const showRevenueImpact = section.items.some((it) => (it.revenueImpact ?? "").trim());

                  return (
                    <div key={sIdx} className="space-y-0">
                      <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 text-[13px] font-semibold uppercase tracking-wide font-poppins">
                        {section.timeframe}
                      </div>
                      <div className="border border-[#D3D1C7] border-t-0 bg-white">
                        <table className="w-full border-collapse table-fixed text-[13px] leading-relaxed font-poppins">
                          <thead>
                            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-[12px]">
                              <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[17%]">Feature</th>
                              <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[14%]">Module</th>
                              <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[33%]">Description</th>
                              <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[9%]">Priority</th>
                              <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[17%]">Target Segment</th>
                              {showRevenueImpact && (
                                <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[12%]">Revenue Impact</th>
                              )}
                              <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[10%]">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.items.map((item, i) => (
                              <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                                <td className="border border-[#E5E7EB] px-4 py-3 font-semibold text-[#2C2C2C] whitespace-pre-line break-words">{item.featureName}</td>
                                <td className="border border-[#E5E7EB] px-4 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{item.theme}</td>
                                <td className="border border-[#E5E7EB] px-4 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{item.whatItIs}</td>
                                <td className="border border-[#E5E7EB] px-4 py-3 font-semibold whitespace-pre-line break-words">{item.priority}</td>
                                <td className="border border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/85 font-medium whitespace-pre-line break-words">{item.unlockedSegment}</td>
                                {showRevenueImpact && (
                                  <td className="border border-[#E5E7EB] px-4 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{item.revenueImpact}</td>
                                )}
                                <td className="border border-[#E5E7EB] px-4 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{item.estTimeline}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {section.summary && (
                        <div className="bg-[#DA7756] text-white border border-[#D3D1C7] border-t-0 px-4 py-3 text-[12px] font-semibold leading-relaxed font-poppins">
                          {section.summary}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : isClubRoadmap ? (
        <div className="bg-transparent p-3">
          <div className="w-full rounded-md border border-[#C4B89D] bg-white">
            <div className="px-4 pt-4 pb-6">
              <div className="bg-[#DA7756] text-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
                <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">{productData.name} - Product Roadmap</h2>
              </div>
              <div className="bg-[#F6F4EE] border border-[#D3D1C7] border-t-0 px-4 py-2 text-[12px] text-gray-600 font-medium italic font-poppins text-center">
                3 Phases | Phase 1: Foundation Launch | Phase 2: Growth Features | Phase 3: AI and Enterprise Moat
              </div>
              <div className="mt-6 space-y-6">
                {detailedRoadmap.phases?.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-0">
                    <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 text-[13px] font-semibold uppercase tracking-wide font-poppins">
                      {(section as unknown as { phaseTitle?: string }).phaseTitle}
                    </div>
                    <div className="border border-[#D3D1C7] border-t-0 bg-white">
                      <table className="w-full border-collapse table-fixed text-[13px] leading-relaxed font-poppins">
                        <thead>
                          <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-[12px]">
                            <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[20%]">Feature / Initiative</th>
                            <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[35%]">Description and Rationale</th>
                            <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[20%]">Target Segment Unlocked</th>
                            <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[10%]">Priority</th>
                            <th className="border border-[#E5E7EB] px-4 py-3 text-left w-[15%]">Est. Timeline</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(section as unknown as { items: Array<{ feature: string; description: string; segment: string; priority?: string; timeline: string }> }).items.map((item, i) => (
                            <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}>
                              <td className="border border-[#E5E7EB] px-4 py-3 font-semibold text-[#2C2C2C] whitespace-pre-line break-words">{item.feature}</td>
                              <td className="border border-[#E5E7EB] px-4 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{item.description}</td>
                              <td className="border border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/85 font-medium whitespace-pre-line break-words">{item.segment}</td>
                              <td className="border border-[#E5E7EB] px-4 py-3 font-semibold whitespace-pre-line break-words">
                                <span className={
                                  item.priority?.startsWith("Critical") ? "text-[#C72030]" :
                                    item.priority?.startsWith("High") ? "text-[#D97706]" : "text-[#798C5E]"
                                }>{item.priority}</span>
                              </td>
                              <td className="border border-[#E5E7EB] px-4 py-3 text-[#2C2C2C] font-semibold whitespace-pre-line break-words">{item.timeline}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {section.summary && (
                      <div className="bg-[#DA7756] text-white border border-[#D3D1C7] border-t-0 px-4 py-3 text-[12px] font-semibold leading-relaxed font-poppins">
                        {section.summary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : productData.excelLikeRoadmap ? (
        <div
          className={`${(hasVendorRoadmapGrid || !hasFeatureNameTop) ? "bg-transparent p-3" : "overflow-x-auto bg-transparent p-3"}`}
        >
          <div
            className={`${(hasVendorRoadmapGrid || !hasFeatureNameTop) ? "w-full rounded-md border border-[#C4B89D] bg-white" : "min-w-[1850px] rounded-md border border-[#C4B89D] bg-white"}`}
            style={{}}
          >
            <div className="px-4 pt-4 pb-6">
              <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
                <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">{productData.name} — Product Roadmap</h2>
              </div>

              {productData.extendedContent?.detailedRoadmap?.structuredRoadmap
                ?.length ? (
                (() => {
                  const sections =
                    productData.extendedContent!.detailedRoadmap!
                      .structuredRoadmap!;
                  const hasFeatureName = sections.some((s) =>
                    s.items.some((it) => it.featureName)
                  );
                  const hasRoadmapGridFields = sections.some((s) =>
                    s.items.some(
                      (it) =>
                        it.phaseLabel ||
                        it.theme ||
                        it.estTimeline ||
                        it.revenueImpact
                    )
                  );

                  if (hasFeatureName && hasRoadmapGridFields) {
                    return (
                      <div className="mt-3 space-y-4">
                        <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 text-sm font-semibold uppercase tracking-wide font-poppins">
                          {productData.name} - Product Roadmap
                        </div>
                        <div className="bg-[#F6F4EE] border border-[#D3D1C7] px-4 py-2 text-sm text-gray-600 font-medium italic font-poppins">
                          Three-phase roadmap: Stabilize - Scale - Differentiate
                          | 2026-2028
                        </div>

                        {sections.map((section, sIdx) => (
                          <div key={sIdx} className="space-y-0">
                            <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-4 py-3 text-sm font-semibold uppercase tracking-wide font-poppins">
                              {section.timeframe} - {section.headline}
                            </div>
                            <div className="border border-[#D3D1C7] border-t-0 bg-white">
                              <table className="w-full border-collapse table-fixed text-[10px] leading-[1.45] font-poppins">
                                <thead>
                                  <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-[9px]">
                                    <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[9%]">
                                      Phase
                                    </th>
                                    <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[10%]">
                                      Theme
                                    </th>
                                    <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[15%]">
                                      Deliverable
                                    </th>
                                    <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[23%]">
                                      Detail
                                    </th>
                                    <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[13%]">
                                      Target Segment
                                    </th>
                                    <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[7%]">
                                      Priority
                                    </th>
                                    <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[8%]">
                                      Est. Timeline
                                    </th>
                                    <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[15%]">
                                      Revenue Impact
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {section.items.map((item, i) => (
                                    <tr
                                      key={i}
                                      className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                                    >
                                      <td className="border border-[#D3D1C7] px-3 py-2 font-semibold text-[#DA7756] whitespace-pre-line break-words">
                                        {item.phaseLabel || section.timeframe}
                                      </td>
                                      <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {item.theme || section.headline}
                                      </td>
                                      <td className="border border-[#D3D1C7] px-3 py-2 font-semibold text-[#DA7756] whitespace-pre-line break-words">
                                        {item.featureName}
                                      </td>
                                      <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {item.whatItIs}
                                      </td>
                                      <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/85 font-medium whitespace-pre-line break-words">
                                        {item.unlockedSegment}
                                      </td>
                                      <td className="border border-[#D3D1C7] px-3 py-2 font-semibold whitespace-pre-line break-words">
                                        {item.priority}
                                      </td>
                                      <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {item.estTimeline}
                                      </td>
                                      <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {item.revenueImpact}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {section.summary && (
                              <div className="bg-[#F6F4EE] text-[#DA7756] border border-[#D3D1C7] border-t-0 px-4 py-2 text-[10px] font-semibold font-poppins">
                                {section.summary}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (hasFeatureName) {
                    return (
                      <div className="mt-3 space-y-4">
                        {/* Main Title */}
                        <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                          {productData.name} , Product Roadmap
                        </div>
                        <div className="bg-transparent border-x border-b border-[#D3D1C7] px-3 py-1 text-[9px] text-gray-600 font-medium italic font-poppins -mt-4">
                          Based on: market gaps · competitor weaknesses · deal
                          loss reasons · segment unlock potential
                        </div>

                        {sections.map((section, sIdx) => (
                          <div key={sIdx} className="mt-2">
                            {/* Phase header */}
                            <div className="bg-[#DA7756] text-white border border-[#D3D1C7] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                              {section.timeframe} , {section.headline}
                            </div>
                            {section.phaseDescription && (
                              <div className="bg-transparent border-x border-b border-[#D3D1C7] px-3 py-1 text-[9px] text-gray-600 font-medium italic font-poppins">
                                {section.phaseDescription}
                              </div>
                            )}

                            {/* Table */}
                            <div className="bg-transparent border border-[#E5E7EB] mt-1">
                              <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                                <thead>
                                  <tr className="bg-[#DA7756] text-white border-b border-[#D3D1C7] font-semibold uppercase">
                                    <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[12%]">
                                      Feature / Initiative
                                    </th>
                                    <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[20%]">
                                      What it is
                                    </th>
                                    <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                                      Why it matters
                                    </th>
                                    <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[16%]">
                                      Customer segment it unlocks
                                    </th>
                                    <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[20%]">
                                      Deal risk if delayed
                                    </th>
                                    <th className="border border-[#E5E7EB] px-1.5 py-1 text-center w-[10%]">
                                      Priority
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {section.items.map((item, i) => (
                                    <tr
                                      key={i}
                                      className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                                    >
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#DA7756] whitespace-pre-line break-words">
                                        {item.featureName}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {item.whatItIs}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {item.whyItMatters}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                                        {item.unlockedSegment}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 font-medium whitespace-pre-line break-words">
                                        <span
                                          className={
                                            item.dealRisk?.startsWith(
                                              "CRITICAL"
                                            )
                                              ? "text-[#C72030] font-semibold"
                                              : item.dealRisk?.startsWith(
                                                "HIGH"
                                              )
                                                ? "text-[#C72030]"
                                                : item.dealRisk
                                                  ?.toUpperCase()
                                                  .startsWith("MEDIUM-HIGH")
                                                  ? "text-[#D97706]"
                                                  : item.dealRisk?.startsWith(
                                                    "MEDIUM"
                                                  )
                                                    ? "text-[#D97706]"
                                                    : "text-[#2C2C2C]/80"
                                          }
                                        >
                                          {item.dealRisk}
                                        </span>
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-center font-semibold whitespace-pre-line">
                                        <span
                                          className={
                                            item.priority?.includes("P0")
                                              ? "text-[#C72030]"
                                              : item.priority?.includes("P1")
                                                ? "text-[#D97706]"
                                                : item.priority?.includes(
                                                  "Strategic"
                                                )
                                                  ? "text-[#6B21A8]"
                                                  : "text-[#2C2C2C]"
                                          }
                                        >
                                          {item.priority}
                                        </span>
                                      </td>
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

                  // Responsive blue layout for products without featureName
                  const hasEffort = sections.some((s) =>
                    s.items.some((it) => it.effort?.trim())
                  );
                  return (
                    <div className="mt-4 space-y-6">
                      {sections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-0">
                          <div className="bg-[#DA7756] text-white border border-[#C4B89D] px-4 py-3 text-[13px] font-semibold uppercase tracking-wide font-poppins">
                            {section.timeframe} — {section.headline}
                          </div>
                          <div className="border border-[#C4B89D] border-t-0 bg-white">
                            <table className="w-full border-collapse table-fixed text-[13px] leading-relaxed font-poppins">
                              <thead>
                                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-[12px]">
                                  <th className="border border-[#C4B89D]/50 px-3 py-3 text-left w-[20%]">Initiative</th>
                                  <th className="border border-[#C4B89D]/50 px-3 py-3 text-left w-[32%]">Why It Matters</th>
                                  <th className="border border-[#C4B89D]/50 px-3 py-3 text-left w-[18%]">Customer Segment Unlocked</th>
                                  {hasEffort && (
                                    <th className="border border-[#C4B89D]/50 px-3 py-3 text-center w-[10%]">Effort</th>
                                  )}
                                  <th className="border border-[#C4B89D]/50 px-3 py-3 text-center w-[10%]">Impact</th>
                                  <th className="border border-[#C4B89D]/50 px-3 py-3 text-center w-[10%]">Priority</th>
                                </tr>
                              </thead>
                              <tbody>
                                {section.items.map((item, i) => (
                                  <tr
                                    key={i}
                                    className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                                  >
                                    <td className="border border-[#C4B89D]/50 px-3 py-3 font-semibold text-[#2C2C2C] whitespace-pre-line break-words">{item.whatItIs}</td>
                                    <td className="border border-[#C4B89D]/50 px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{item.whyItMatters}</td>
                                    <td className="border border-[#C4B89D]/50 px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{item.unlockedSegment}</td>
                                    {hasEffort && (
                                      <td className="border border-[#C4B89D]/50 px-3 py-3 text-center font-semibold text-[#2C2C2C]">{item.effort}</td>
                                    )}
                                    <td className="border border-[#C4B89D]/50 px-3 py-3 text-center font-semibold text-[#2C2C2C]">{item.impact ?? item.owner}</td>
                                    <td className="border border-[#C4B89D]/50 px-3 py-3 text-center font-semibold whitespace-pre-line">
                                      <span className={
                                        item.priority?.includes("P0") ? "text-[#C72030]" :
                                          item.priority?.includes("P1") ? "text-[#D97706]" :
                                            "text-[#2C2C2C]"
                                      }>{item.priority ?? ""}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : (
                <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                  Product Roadmap Data Coming Soon
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
          <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
            {productData.name} - Strategic Roadmap
          </h2>
          <div className="flex items-center gap-2 bg-white border border-[#D3D1C7] px-3 py-1 rounded text-[10px] font-semibold tracking-[0.2em] uppercase text-[#DA7756]">
            Future Evolution Matrix | FY 2026-28
          </div>
        </div>
      )}

      {/* 1. Structured Timeline Roadmap */}
      {productData.extendedContent?.detailedRoadmap?.structuredRoadmap &&
        !hasVendorRoadmapGrid && !productData.excelLikeRoadmap &&
        (() => {
          const allSections =
            productData.extendedContent!.detailedRoadmap!.structuredRoadmap!;
          const hasFeatureNameTL = allSections.some((s) =>
            s.items.some((it) => it.featureName?.trim())
          );
          const hasSuccessMetricTL = allSections.some((s) =>
            s.items.some((it) => it.successMetric?.trim())
          );
          const hasEffortTL = allSections.some((s) =>
            s.items.some((it) => it.effort?.trim())
          );
          const hasPriorityTL = allSections.some((s) =>
            s.items.some((it) => it.priority?.trim())
          );
          const hasOwnerTL = allSections.some((s) =>
            s.items.some((it) => it.owner?.trim())
          );
          return (
            <div className="space-y-8">
              {allSections.map((section, idx) => {
                const bgHeader =
                  section.colorContext === "red"
                    ? "bg-[#DA7756] text-white"
                    : section.colorContext === "yellow"
                      ? "bg-[#798C5E] text-white"
                      : section.colorContext === "green"
                        ? "bg-[#6B9BCC] text-white"
                        : "bg-white text-[#2C2C2C] border-b border-[#D3D1C7]";
                const rowTint =
                  section.colorContext === "red"
                    ? "bg-[#DA7756]/5"
                    : section.colorContext === "yellow"
                      ? "bg-[#798C5E]/5"
                      : section.colorContext === "green"
                        ? "bg-[#6B9BCC]/5"
                        : "bg-white";
                const textHeader = "";
                return (
                  <div
                    key={idx}
                    className="border border-[#C4B89D]  overflow-hidden rounded-md"
                  >
                    <div
                      className={`${bgHeader} ${textHeader} px-4 py-2 font-semibold font-poppins text-sm uppercase tracking-wider border-b border-[#D3D1C7]`}
                    >
                      {section.timeframe} — {section.headline}
                    </div>
                    {section.phaseDescription && (
                      <div className="bg-[#F6F4EE] px-4 py-2 text-[11px] text-[#DA7756] font-medium italic font-poppins border-b border-[#D3D1C7]">
                        {section.phaseDescription}
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse font-poppins text-[11px] bg-white text-left">
                        <thead>
                          <tr
                            className={`bg-white text-gray-900 font-semibold text-xs uppercase text-left border-b border-[#D3D1C7]`}
                          >
                            {hasFeatureNameTL && (
                              <th className="p-3 w-[16%]">Initiative</th>
                            )}
                            <th className="p-3 w-[15%]">What It Is</th>
                            <th className="p-3 w-[25%]">Why It Matters</th>
                            <th className="p-3 w-[20%]">
                              Which Customer Segment It Unlocks
                            </th>
                            {hasSuccessMetricTL && (
                              <th className="p-3 w-[18%]">Success Metric</th>
                            )}
                            {hasEffortTL && (
                              <th className="p-3 w-[10%]">Effort Estimate</th>
                            )}
                            {hasPriorityTL && (
                              <th className="p-3 w-[8%]">Priority</th>
                            )}
                            {hasOwnerTL && (
                              <th className="p-3 w-[10%]">Owner</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {section.items.map((item, i) => (
                            <tr
                              key={i}
                              className={`${rowTint} border-b border-[#E5E7EB] last:border-0`}
                            >
                              {hasFeatureNameTL && (
                                <td className="p-3 text-[#2C2C2C] font-semibold leading-relaxed whitespace-pre-line break-words">
                                  {item.featureName}
                                </td>
                              )}
                              <td className="p-3 text-[#2C2C2C] font-semibold leading-relaxed whitespace-pre-line break-words">
                                {item.whatItIs}
                              </td>
                              <td className="p-3 text-[#2C2C2C]/80 font-medium leading-relaxed whitespace-pre-line break-words">
                                {item.whyItMatters}
                              </td>
                              <td className="p-3 text-[#2C2C2C]/80 font-medium leading-relaxed whitespace-pre-line break-words">
                                {item.unlockedSegment}
                              </td>
                              {hasSuccessMetricTL && (
                                <td className="p-3 text-[#2C2C2C]/80 font-medium leading-relaxed whitespace-pre-line break-words">
                                  {item.successMetric}
                                </td>
                              )}
                              {hasEffortTL && (
                                <td className="p-3 text-[#2C2C2C]/70 leading-relaxed whitespace-pre-line break-words">
                                  {item.effort}
                                </td>
                              )}
                              {hasPriorityTL && (
                                <td className="p-3 font-semibold whitespace-pre-line break-words">
                                  <span
                                    className={
                                      item.priority?.includes("P0")
                                        ? "text-[#C72030]"
                                        : item.priority?.includes("P1")
                                          ? "text-[#D97706]"
                                          : item.priority?.includes("P2")
                                            ? "text-[#B45309]"
                                            : "text-[#2C2C2C]"
                                    }
                                  >
                                    {item.priority}
                                  </span>
                                </td>
                              )}
                              {hasOwnerTL && (
                                <td className="p-3 text-[#2C2C2C] font-semibold whitespace-pre-line break-words">
                                  {item.owner}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {section.summary && (
                      <div className="bg-[#F6F4EE] px-4 py-2 text-[11px] text-[#DA7756] font-medium italic font-poppins border-t border-[#D3D1C7]">
                        {section.summary}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

      {/* 2. Legacy Phases Roadmap */}
      {productData.extendedContent?.detailedRoadmap?.phases && (
        <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
          <table className="w-full border-collapse font-poppins text-[10px] bg-white">
            <thead>
              <tr className="bg-white text-[#2C2C2C] font-semibold uppercase text-center">
                <th className="border border-[#E5E7EB] p-3 w-[15%]">Phase</th>
                <th className="border border-[#E5E7EB] p-3 w-[15%] text-left">
                  Initiative
                </th>
                <th className="border border-[#E5E7EB] p-3 w-[25%] text-left">
                  Feature / Capability
                </th>
                <th className="border border-[#E5E7EB] p-3 w-[15%] text-left">
                  Target Segment Unlocked
                </th>
                <th className="border border-[#E5E7EB] p-3 w-[20%] text-left">
                  Business Impact
                </th>
                <th className="border border-[#E5E7EB] p-3 w-[10%]">
                  Est. Timeline
                </th>
              </tr>
            </thead>
            <tbody>
              {productData.extendedContent?.detailedRoadmap?.phases?.map(
                (phase, pIdx) => (
                  <React.Fragment key={pIdx}>
                    {phase.initiatives.map((item, iIdx) => (
                      <tr key={iIdx} className="bg-white">
                        {iIdx === 0 && (
                          <td
                            className="border border-[#D3D1C7] p-4 font-semibold text-[#DA7756] uppercase bg-[#DA7756]/5 align-top"
                            rowSpan={phase.initiatives.length}
                          >
                            {phase.title}
                          </td>
                        )}
                        <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C] font-semibold uppercase">
                          {item.initiative}
                        </td>
                        <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-medium leading-relaxed">
                          {item.feature || "-"}
                        </td>
                        <td className="border border-[#E5E7EB] p-3 text-[#4B5563] font-semibold tracking-tight">
                          {item.segment || "-"}
                        </td>
                        <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C] font-semibold leading-tight">
                          {item.impact}
                        </td>
                        <td className="border border-[#E5E7EB] p-3 text-center font-semibold text-[#DA7756] bg-white">
                          {item.timeline}
                        </td>
                      </tr>
                    ))}
                    {phase.summary && (
                      <tr className="bg-[#DA7756] text-white font-semibold tracking-tighter uppercase">
                        <td
                          colSpan={6}
                          className="p-3 text-[9px] border border-[#D3D1C7] bg-[#DA7756] text-white"
                        >
                          {phase.summary}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Innovation Layer Detail */}
      {productData.extendedContent?.detailedRoadmap?.innovationLayer && (
        <div className="space-y-4">
          <div className="bg-[#DA7756] text-white border-y border-[#D3D1C7] px-4 py-2 font-semibold font-poppins text-xs uppercase tracking-wider">
            Full Innovation Roadmap Detail
          </div>
          <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
            <table className="w-full border-collapse font-poppins text-[9px] bg-white">
              <thead>
                <tr className="bg-white text-[#2C2C2C] font-semibold uppercase text-center">
                  <th className="border border-[#E5E7EB] p-2 w-[3%]">#</th>
                  <th className="border border-[#E5E7EB] p-2 w-[15%] text-left">
                    Enhancement Name
                  </th>
                  <th className="border border-[#E5E7EB] p-2 w-[10%] text-left">
                    Category
                  </th>
                  <th className="border border-[#E5E7EB] p-2 w-[25%] text-left">
                    Description
                  </th>
                  <th className="border border-[#E5E7EB] p-2 w-[25%] text-left">
                    Business Value
                  </th>
                  <th className="border border-[#E5E7EB] p-2 w-[12%] text-left">
                    Competitor Leapfrogged
                  </th>
                  <th className="border border-[#E5E7EB] p-2 w-[10%]">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {productData.extendedContent.detailedRoadmap.innovationLayer.map(
                  (item, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="border border-[#E5E7EB] p-2 font-semibold text-[#2C2C2C] text-center bg-white">
                        {item.id}
                      </td>
                      <td className="border border-[#E5E7EB] p-2 text-[#2C2C2C] font-semibold uppercase">
                        {item.name}
                      </td>
                      <td className="border border-[#E5E7EB] p-2 text-[#2C2C2C]/60 font-semibold uppercase tracking-tighter">
                        {item.category}
                      </td>
                      <td className="border border-[#E5E7EB] p-2 text-[#2C2C2C]/70 font-medium leading-tight">
                        {item.description}
                      </td>
                      <td className="border border-[#E5E7EB] p-2 text-[#2C2C2C] font-semibold leading-tight">
                        {item.value}
                      </td>
                      <td className="border border-[#E5E7EB] p-2 text-[#4B5563] font-semibold uppercase tracking-tighter">
                        {item.leapfrog}
                      </td>
                      <td className="border border-[#E5E7EB] p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full font-semibold uppercase text-[7px] ${item.priority === "High Impact" ? "bg-[#DA7756]/15 text-[#DA7756]" : "bg-[#F6F4EE] text-[#798C5E]"}`}
                        >
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!productData.extendedContent?.detailedRoadmap && (
        <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
          Product Roadmap Data Coming Soon
        </div>
      )}
    </div>
  );
};

export default RoadmapTab;
