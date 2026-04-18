import React from "react";
import { ProductData } from "../types";

interface RoadmapTabProps {
  productData: ProductData;
}

const RoadmapTab = ({ productData }: RoadmapTabProps) => {
  const structuredRoadmap = productData.extendedContent?.detailedRoadmap?.structuredRoadmap;
  const hasVendorRoadmapGrid =
    structuredRoadmap?.some((section) =>
      section.items.some((item) => item.phaseLabel || item.theme || item.estTimeline || item.revenueImpact)
    ) ?? false;

  return (
    <div className="space-y-12 animate-fade-in">
            {productData.excelLikeRoadmap ? (
              <div className={`${hasVendorRoadmapGrid ? "bg-transparent p-3" : "overflow-x-auto bg-transparent p-3"}`}>
                <div
                  className={`${hasVendorRoadmapGrid ? "w-full rounded-md border border-[#C4B89D] bg-white" : "min-w-[1850px] rounded-md border border-[#C4B89D] bg-white"}`}
                  style={{}}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-white text-gray-900 border border-[#D3D1C7] px-4 py-2 font-semibold font-poppins uppercase tracking-tight text-[11px] text-center">
                      Post Possession — Product Roadmap (Prioritized by Market
                      Gap, Competitive Weakness & Product Goals)
                    </div>

                    {productData.extendedContent?.detailedRoadmap
                      ?.structuredRoadmap?.length ? (
                      (() => {
                        const sections = productData.extendedContent!.detailedRoadmap!.structuredRoadmap!;
                        const hasFeatureName = sections.some((s) => s.items.some((it) => it.featureName));
                        const hasRoadmapGridFields = sections.some((s) =>
                          s.items.some((it) => it.phaseLabel || it.theme || it.estTimeline || it.revenueImpact)
                        );

                        if (hasFeatureName && hasRoadmapGridFields) {
                          return (
                            <div className="mt-3 space-y-4">
                              <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-sm font-semibold uppercase tracking-wide font-poppins">
                                {productData.name} - Product Roadmap
                              </div>
                              <div className="bg-gray-50 border border-[#D3D1C7] px-4 py-2 text-sm text-gray-600 font-medium italic font-poppins">
                                Three-phase roadmap: Stabilize - Scale - Differentiate | 2026-2028
                              </div>

                              {sections.map((section, sIdx) => (
                                <div key={sIdx} className="space-y-0">
                                  <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-sm font-semibold uppercase tracking-wide font-poppins">
                                    {section.timeframe} - {section.headline}
                                  </div>
                                  <div className="border border-[#D3D1C7] border-t-0 bg-white">
                                    <table className="w-full border-collapse table-fixed text-[10px] leading-[1.45] font-poppins">
                                      <thead>
                                        <tr className="bg-gray-100 text-gray-800 font-semibold uppercase text-[9px]">
                                          <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[9%]">Phase</th>
                                          <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[10%]">Theme</th>
                                          <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[15%]">Deliverable</th>
                                          <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[23%]">Detail</th>
                                          <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[13%]">Target Segment</th>
                                          <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[7%]">Priority</th>
                                          <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[8%]">Est. Timeline</th>
                                          <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[15%]">Revenue Impact</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {section.items.map((item, i) => (
                                          <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                            <td className="border border-[#D3D1C7] px-3 py-2 font-semibold text-gray-800 whitespace-pre-line break-words">
                                              {item.phaseLabel || section.timeframe}
                                            </td>
                                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                              {item.theme || section.headline}
                                            </td>
                                            <td className="border border-[#D3D1C7] px-3 py-2 font-semibold text-gray-800 whitespace-pre-line break-words">
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
                                    <div className="bg-gray-50 text-gray-700 border border-[#D3D1C7] border-t-0 px-4 py-2 text-[10px] font-semibold font-poppins">
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
                              <div className="bg-white text-gray-800 border border-[#D3D1C7] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                                {productData.name} , Product Roadmap
                              </div>
                              <div className="bg-transparent border-x border-b border-[#D3D1C7] px-3 py-1 text-[9px] text-gray-600 font-medium italic font-poppins -mt-4">
                                Based on: market gaps · competitor weaknesses · deal loss reasons · segment unlock potential
                              </div>

                              {sections.map((section, sIdx) => (
                                <div key={sIdx} className="mt-2">
                                  {/* Phase header */}
                                  <div className="bg-white text-gray-800 border border-[#D3D1C7] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide font-poppins">
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
                                        <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[12%]">Feature / Initiative</th>
                                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[20%]">What it is</th>
                                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">Why it matters</th>
                                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[16%]">Customer segment it unlocks</th>
                                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[20%]">Deal risk if delayed</th>
                                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-center w-[10%]">Priority</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {section.items.map((item, i) => (
                                          <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                            <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-gray-700 whitespace-pre-line break-words">
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
                                              <span className={
                                                item.dealRisk?.startsWith("CRITICAL") ? "text-[#C72030] font-semibold" :
                                                item.dealRisk?.startsWith("HIGH") ? "text-[#C72030]" :
                                                item.dealRisk?.toUpperCase().startsWith("MEDIUM-HIGH") ? "text-[#D97706]" :
                                                item.dealRisk?.startsWith("MEDIUM") ? "text-[#D97706]" :
                                                "text-[#2C2C2C]/80"
                                              }>
                                                {item.dealRisk}
                                              </span>
                                            </td>
                                            <td className="border border-[#E5E7EB] px-1.5 py-1 text-center font-semibold whitespace-pre-line">
                                              <span className={
                                                item.priority?.includes("P0") ? "text-[#C72030]" :
                                                item.priority?.includes("P1") ? "text-[#D97706]" :
                                                item.priority?.includes("Strategic") ? "text-[#6B21A8]" :
                                                "text-[#2C2C2C]"
                                              }>
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

                        // Existing layout for products without featureName
                        const hasEffort = sections.some((s) => s.items.some((it) => it.effort?.trim()));
                        const hasOwner = sections.some((s) => s.items.some((it) => it.owner?.trim()));
                        return (
                      <div className="mt-3 flex gap-6">
                        {/* Left: Roadmap sheet table */}
                        <div className="w-[1180px] shrink-0 bg-white border border-[#C4B89D]">
                          {(() => {
                            const hasPriority = sections.some((s) =>
                              s.items.some((it) => it.priority || it.impact)
                            );

                            // Default to the screenshot-style table when priority/impact are present
                            if (hasPriority) {
                              let rowNo = 1;
                              return (
                                <table className="w-full border-collapse font-poppins text-[9px] leading-[1.15] table-fixed">
                                  <thead>
                                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                                      <th
                                        className="border border-[#C4B89D] px-2 py-1.5 text-left font-semibold uppercase"
                                        colSpan={4 + (hasEffort ? 1 : 0) + 1 + 1}
                                      >
                                        Post Possession — Product Roadmap
                                      </th>
                                    </tr>
                                    <tr className="bg-white text-[#2C2C2C] font-semibold uppercase border-b border-[#D3D1C7]">
                                      <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[4%]">
                                        #
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[20%]">
                                        Initiative
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[28%]">
                                        Stop losing deals we should be winning
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                        Customer segment unlocked
                                      </th>
                                      {hasEffort && (
                                      <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[12%]">
                                        Effort estimate
                                      </th>
                                      )}
                                      <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[10%]">
                                        Impact
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[8%]">
                                        Priority
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sections.flatMap((section, sIdx) => {
                                      const band =
                                        section.colorContext === "red"
                                          ? {
                                              bar: "bg-[#E49191]",
                                              row: "bg-white",
                                            }
                                          : section.colorContext === "yellow"
                                            ? {
                                                bar: "bg-white text-gray-800 border-b border-[#D3D1C7]",
                                                row: "bg-white",
                                              }
                                            : section.colorContext === "blue"
                                              ? {
                                                  bar: "bg-[#94A3B8]",
                                                  row: "bg-white",
                                                }
                                              : {
                                                  bar: "bg-white text-gray-800 border-b border-[#D3D1C7]",
                                                  row: "bg-white",
                                                };

                                      const headerRow = (
                                        <tr key={`band-${sIdx}`}>
                                          <td className="border border-[#E5E7EB] bg-white px-1 py-1 text-center font-semibold text-[8px] text-[#2C2C2C]/70">
                                            {rowNo++}
                                          </td>
                                          <td
                                            className={`border border-[#E5E7EB] ${band.bar} text-white px-2 py-1 font-semibold uppercase text-[8px] tracking-wide`}
                                            colSpan={3 + (hasEffort ? 1 : 0) + 1 + 1}
                                          >
                                            {section.timeframe} —{" "}
                                            {section.headline}
                                          </td>
                                        </tr>
                                      );

                                      const rows = section.items.map(
                                        (item, iIdx) => {
                                          return (
                                            <tr
                                              key={`r-${sIdx}-${iIdx}`}
                                              className={`align-top ${band.row}`}
                                            >
                                              <td className="border border-[#E5E7EB] bg-white px-1 py-1 text-center font-semibold text-[#2C2C2C]/60">
                                                {rowNo++}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#2C2C2C] break-words`}
                                              >
                                                {item.whatItIs}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words`}
                                              >
                                                {item.whyItMatters}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words`}
                                              >
                                                {item.unlockedSegment}
                                              </td>
                                              {hasEffort && (
                                              <td
                                                className={`border border-[#E5E7EB] px-1 py-1 text-center font-semibold text-[#2C2C2C] whitespace-pre-line`}
                                              >
                                                {item.effort}
                                              </td>
                                              )}
                                              <td
                                                className={`border border-[#E5E7EB] px-1 py-1 text-center font-semibold text-[#2C2C2C]`}
                                              >
                                                {item.impact ?? item.owner}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] px-1 py-1 text-center font-semibold text-[#2C2C2C]`}
                                              >
                                                {item.priority ?? ""}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      );

                                      return [headerRow, ...rows];
                                    })}
                                  </tbody>
                                </table>
                              );
                            }

                            // Fallback to original structured table
                            return (
                              <div className="p-4">
                                <table className="w-full border-collapse font-poppins text-[9px] leading-[1.25] text-left">
                                  <thead>
                                    <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-2 py-2 w-[8%] border-b border-[#D3D1C7]">
                                        Phase / Timeline
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[18%]">
                                        What It Is
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[22%]">
                                        Why It Matters
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[22%]">
                                        Unlocked Segment
                                      </th>
                                      {hasEffort && (
                                      <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[12%] text-center">
                                        Effort
                                      </th>
                                      )}
                                      {hasOwner && (
                                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-2 py-2 w-[10%] text-center border-b border-[#D3D1C7]">
                                        Owner
                                      </th>
                                      )}
                                      <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[8%] text-center">
                                        Theme
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sections.flatMap((section, sIdx) => {
                                      const tone =
                                        section.colorContext === "red"
                                          ? {
                                              bg: "bg-white",
                                              badge:
                                                "bg-[#E49191]/10 text-[#E49191] border-[#E49191]/30",
                                            }
                                          : section.colorContext === "yellow"
                                            ? {
                                                bg: "bg-white",
                                                badge:
                                                  "bg-white text-gray-700 border-[#D3D1C7]",
                                              }
                                            : section.colorContext === "blue"
                                              ? {
                                                  bg: "bg-white",
                                                  badge:
                                                    "bg-[#94A3B8]/10 text-[#64748B] border-[#94A3B8]/30",
                                                }
                                              : {
                                                  bg: "bg-white",
                                                  badge:
                                                    "bg-white text-[#798C5E] border-[#D3D1C7]",
                                                };

                                      return section.items.map((item, iIdx) => (
                                        <tr
                                          key={`${sIdx}-${iIdx}`}
                                          className={`align-top ${tone.bg}`}
                                        >
                                          <td
                                            className={`border border-[#E5E7EB] px-2 py-2 font-semibold text-[#2C2C2C]`}
                                          >
                                            <div className="text-[8px] uppercase">
                                              {section.timeframe}
                                            </div>
                                            <div className="text-[9px] font-semibold">
                                              {section.headline}
                                            </div>
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                                            {item.whatItIs}
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 font-medium text-[#2C2C2C] whitespace-pre-line">
                                            {item.whyItMatters}
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 font-medium text-[#2C2C2C] whitespace-pre-line">
                                            {item.unlockedSegment}
                                          </td>
                                          {hasEffort && (
                                          <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-700 whitespace-pre-line">
                                            {item.effort}
                                          </td>
                                          )}
                                          {hasOwner && (
                                          <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#2C2C2C] whitespace-pre-line">
                                            {item.owner}
                                          </td>
                                          )}
                                          <td className="border border-[#E5E7EB] px-2 py-2 text-center">
                                            <span
                                              className={`inline-block px-2 py-0.5 text-[8px] font-semibold uppercase border ${tone.badge}`}
                                            >
                                              {section.colorContext}
                                            </span>
                                          </td>
                                        </tr>
                                      ));
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Right: blank grid area like the sheet */}

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
              <div className="bg-white text-gray-900 border border-[#D3D1C7] p-6 rounded-t-xl mb-0 flex flex-col justify-start items-start gap-2">
                <h2 className="text-2xl font-semibold font-poppins uppercase tracking-tight">
                  {productData.name} - Strategic Roadmap
                </h2>
                <div className="flex items-center gap-2 bg-white border border-[#D3D1C7] px-3 py-1 rounded text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-700">
                  Future Evolution Matrix | FY 2026-28
                </div>
              </div>
            )}

            {/* 1. Structured Timeline Roadmap */}
            {productData.extendedContent?.detailedRoadmap
              ?.structuredRoadmap && !hasVendorRoadmapGrid && (
              (() => {
                const allSections = productData.extendedContent!.detailedRoadmap!.structuredRoadmap!;
                const hasEffortTL = allSections.some((s) => s.items.some((it) => it.effort?.trim()));
                const hasOwnerTL = allSections.some((s) => s.items.some((it) => it.owner?.trim()));
                return (
              <div className="space-y-8">
                {allSections.map(
                  (section, idx) => {
                    const bgHeader =
                      section.colorContext === "red"
                        ? "bg-[#8B2500] text-white"
                        : section.colorContext === "yellow"
                          ? "bg-[#B8860B] text-white"
                          : section.colorContext === "green"
                            ? "bg-[#2F4F2F] text-white"
                            : "bg-white text-gray-800 border-b border-[#D3D1C7]";
                    const rowTint =
                      section.colorContext === "red"
                        ? "bg-[#FDECEA]"
                        : section.colorContext === "yellow"
                          ? "bg-[#FFF8E7]"
                          : section.colorContext === "green"
                            ? "bg-[#F0F5EE]"
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
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse font-poppins text-[11px] bg-white text-left">
                            <thead>
                              <tr
                                className={`bg-white text-gray-900 font-semibold text-xs uppercase text-left border-b border-[#D3D1C7]`}
                              >
                                <th className="p-3 w-[15%]">
                                  What It Is
                                </th>
                                <th className="p-3 w-[25%]">
                                  Why It Matters
                                </th>
                                <th className="p-3 w-[20%]">
                                  Which Customer Segment It Unlocks
                                </th>
                                {hasEffortTL && (
                                <th className="p-3 w-[22%]">
                                  Effort Estimate
                                </th>
                                )}
                                {hasOwnerTL && (
                                <th className="p-3 w-[10%]">
                                  Owner
                                </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {section.items.map((item, i) => (
                                <tr
                                  key={i}
                                  className={`${rowTint} border-b border-[#E5E7EB] last:border-0`}
                                >
                                  <td className="p-3 text-[#2C2C2C] font-semibold leading-relaxed">
                                    {item.whatItIs}
                                  </td>
                                  <td className="p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                    {item.whyItMatters}
                                  </td>
                                  <td className="p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                    {item.unlockedSegment}
                                  </td>
                                  {hasEffortTL && (
                                  <td className="p-3 text-[#2C2C2C]/70 leading-relaxed">
                                    {item.effort}
                                  </td>
                                  )}
                                  {hasOwnerTL && (
                                  <td className="p-3 text-[#2C2C2C] font-semibold">
                                    {item.owner}
                                  </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            );
              })()
            )}

            {/* 2. Legacy Phases Roadmap */}
            {productData.extendedContent?.detailedRoadmap?.phases && (
              <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                <table className="w-full border-collapse font-poppins text-[10px] bg-white">
                  <thead>
                    <tr className="bg-white text-[#2C2C2C] font-semibold uppercase text-center">
                      <th className="border border-[#E5E7EB] p-3 w-[15%]">
                        Phase
                      </th>
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
                            <tr
                              key={iIdx}
                              className="bg-white"
                            >
                              {iIdx === 0 && (
                                <td
                                  className="border border-[#E5E7EB] p-4 font-semibold text-[#2C2C2C] uppercase bg-white align-top"
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
                              <td className="border border-[#E5E7EB] p-3 text-center font-semibold text-gray-700 bg-white">
                                {item.timeline}
                              </td>
                            </tr>
                          ))}
                          {phase.summary && (
                            <tr className="bg-white text-gray-800 font-semibold tracking-tighter uppercase">
                              <td
                                colSpan={6}
                                className="p-3 text-[9px] border border-[#D3D1C7] bg-white text-gray-800"
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
                <div className="bg-white text-gray-800 border-y border-[#D3D1C7] px-4 py-2 font-semibold font-poppins text-xs uppercase tracking-wider">
                  Full Innovation Roadmap Detail
                </div>
                <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                  <table className="w-full border-collapse font-poppins text-[9px] bg-white">
                    <thead>
                      <tr className="bg-white text-[#2C2C2C] font-semibold uppercase text-center">
                        <th className="border border-[#E5E7EB] p-2 w-[3%]">
                          #
                        </th>
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
                          <tr
                            key={idx}
                            className="bg-white"
                          >
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
                                className={`px-2 py-1 rounded-full font-semibold uppercase text-[7px] ${item.priority === "High Impact" ? "bg-[#E49191]/15 text-[#E49191]" : "bg-white text-[#4B5563]"}`}
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
