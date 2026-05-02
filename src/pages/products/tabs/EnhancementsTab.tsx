import React from "react";
import { ProductData } from "../types";

interface EnhancementsTabProps {
  productData: ProductData;
}

const EnhancementsTab: React.FC<EnhancementsTabProps> = ({ productData }) => {
  const isClubEnhancement = !!productData.extendedContent?.detailedEnhancementRoadmap?.isClubEnhancement;
  const clubEnhancements = productData.extendedContent?.detailedEnhancementRoadmap;
  const isProcurement = productData.name.toLowerCase().includes("procurement");

  if (isClubEnhancement && clubEnhancements) {
    return (
      <div className="space-y-6 animate-fade-in mb-8">
        <div className="bg-white w-full overflow-x-auto border border-[#E5E7EB] shadow-sm hide-scrollbar">
          <table className="w-full table-fixed border-collapse text-[11pt] text-[#000000] font-poppins min-w-[1024px]">
            <tbody>
              {/* Table 1 Header */}
              <tr>
                <td className="bg-[#DA7756] text-white font-bold text-[13pt] px-3 py-2 text-left" colSpan={5}>
                  CLUB MANAGEMENT - ENHANCEMENT ROADMAP (Future State Innovations)
                </td>
              </tr>
              <tr>
                <td className="bg-[#F6F4EE] text-[#4B5563] italic text-[10pt] px-3 py-1.5 text-left border-b border-[#D3D1C7]" colSpan={5}>
                  Minimum 25 innovations | 7+ AI/LLM/NLP | 3+ MCP/Cross-Platform | 5 new enhancements for F&B, Channel, Accounting, Loyalty, and Asset modules | High-impact rows highlighted | No overlap with Product Roadmap Tab
                </td>
              </tr>

              {/* Table 1 Column Headers */}
              <tr>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-r border-[#D3D1C7] w-[18%]">
                  Enhancement
                </td>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-r border-[#D3D1C7] w-[12%]">
                  Type
                </td>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-r border-[#D3D1C7] w-[45%]">
                  Description and Value
                </td>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-r border-[#D3D1C7] w-[15%]">
                  Segment Benefited
                </td>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-[#D3D1C7] w-[10%]">
                  Impact Level
                </td>
              </tr>

              {/* Table 1 Body */}
              {clubEnhancements.innovations.map((item, idx) => {
                const isHighImpact = item.impact?.toUpperCase() === "HIGH";
                const rowClass = isHighImpact
                  ? "bg-[#F9FAFB] text-[#1F2937] font-bold text-[10pt]"
                  : "bg-white text-[#4B5563] text-[10pt]";
                return (
                  <tr key={`innov-${idx}`} className="align-top">
                    <td className={`${rowClass} px-3 py-3 border-b border-r border-[#D3D1C7] whitespace-pre-wrap`}>{item.enhancement}</td>
                    <td className={`${rowClass} px-3 py-3 border-b border-r border-[#D3D1C7] whitespace-pre-wrap`}>{item.type}</td>
                    <td className={`${isHighImpact ? 'bg-[#F9FAFB]' : 'bg-white'} text-[#4B5563] font-medium text-[10pt] px-3 py-3 border-b border-r border-[#D3D1C7] whitespace-pre-wrap`}>{item.description}</td>
                    <td className={`${rowClass} px-3 py-3 border-b border-r border-[#D3D1C7] whitespace-pre-wrap`}>{item.segment}</td>
                    <td className={`${rowClass} px-3 py-3 border-b border-[#D3D1C7] whitespace-pre-wrap`}>{item.impact}</td>
                  </tr>
                );
              })}

              {/* Spacing */}
              <tr>
                <td colSpan={5} className="h-6 bg-white border-none"></td>
              </tr>

              {/* Table 2 Header */}
              <tr>
                <td className="bg-[#DA7756] text-white font-bold text-[11pt] px-3 py-2 text-left" colSpan={5}>
                  TOP 5 HIGHEST-IMPACT ENHANCEMENTS SUMMARY
                </td>
              </tr>

              {/* Table 2 Column Headers */}
              <tr>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-r border-[#D3D1C7]">
                  Enhancement
                </td>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-r border-[#D3D1C7]">
                  Type
                </td>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-r border-[#D3D1C7]">
                  Why It Matters Most
                </td>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-r border-[#D3D1C7]">
                  Which Competitor It Leapfrogs
                </td>
                <td className="bg-[#F6F4EE] text-[#DA7756] font-bold uppercase tracking-wide text-[11pt] px-3 py-3 text-center border-b border-[#D3D1C7]">
                  Timeline Estimate
                </td>
              </tr>

              {/* Table 2 Body */}
              {clubEnhancements.top5.map((item, idx) => {
                return (
                  <tr key={`top-${idx}`} className="align-top">
                    <td className="bg-white text-[#4B5563] font-medium text-[10pt] px-3 py-3 border-b border-r border-[#D3D1C7] whitespace-pre-wrap">{item.enhancement}</td>
                    <td className="bg-white text-[#4B5563] font-medium text-[10pt] px-3 py-3 border-b border-r border-[#D3D1C7] whitespace-pre-wrap">{item.type}</td>
                    <td className="bg-white text-[#4B5563] font-medium text-[10pt] px-3 py-3 border-b border-r border-[#D3D1C7] whitespace-pre-wrap">{item.whyItMatters}</td>
                    <td className="bg-white text-[#4B5563] font-medium text-[10pt] px-3 py-3 border-b border-r border-[#D3D1C7] whitespace-pre-wrap">{item.competitor}</td>
                    <td className="bg-white text-[#4B5563] font-medium text-[10pt] px-3 py-3 border-b border-[#D3D1C7] whitespace-pre-wrap">{item.timeline}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const innovationLayer =
    productData.extendedContent?.detailedRoadmap?.innovationLayer ?? [];
  const enhancementRoadmap =
    productData.extendedContent?.detailedRoadmap?.enhancementRoadmap ?? [];
  const top5Impact =
    productData.extendedContent?.detailedRoadmap?.top5Impact ?? [];
  const displayEnhancements =
    enhancementRoadmap.length > 0
      ? enhancementRoadmap
      : innovationLayer.map((item) => ({
        rowId: `${item.id}`,
        featureName: item.name,
        category: item.category,
        description: item.description,
        competitorLeapfrogged: item.leapfrog,
        impact: item.priority,
        currentStatus: "",
        enhancedVersion: "",
        integrationType: "",
      }));
  const hasModule = enhancementRoadmap.some((item) => item.module?.trim());
  const hasInnovationShape = innovationLayer.length > 0;
  const hasRowId = displayEnhancements.some((item) => item.rowId?.trim());
  const hasEffort = enhancementRoadmap.some((item) => item.effort?.trim());
  const hasImpact = displayEnhancements.some((item) => item.impact?.trim());
  const hasOutcome = enhancementRoadmap.some((item) => item.outcome?.trim());
  const hasPriority = enhancementRoadmap.some((item) => item.priority?.trim());
  const hasOwner = enhancementRoadmap.some((item) => item.owner?.trim());
  const hasVendorEnhancementShape = displayEnhancements.some(
    (item) =>
      item.category?.trim() ||
      item.description?.trim() ||
      item.targetUser?.trim() ||
      item.competitorLeapfrogged?.trim()
  );
  const hasTop5Rank = top5Impact.some(
    (item) => item.rank !== undefined && `${item.rank}`.trim() !== ""
  );

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-6 rounded-t-xl mb-0 flex flex-col justify-start items-start gap-2">
        <h2 className="text-2xl font-semibold font-poppins uppercase tracking-tight">
          {productData.name} - Enhancement Matrix
        </h2>
        <div className="flex items-center gap-2 bg-white border border-[#D3D1C7] px-3 py-1 rounded text-[10px] font-semibold tracking-[0.2em] uppercase text-[#DA7756]">
          Legacy to AI Transformation | FY 2026-28
        </div>
      </div>

      {/* 1. High-Impact Enhancements Matrix */}
      {displayEnhancements.length > 0 && (
        <div className="space-y-4">
          <div className="border border-[#C4B89D] bg-white rounded-xl p-3">
            <div className="w-full bg-white space-y-3">
              <div className="text-white bg-[#DA7756] border border-[#D3D1C7] px-4 py-3 font-bold font-poppins uppercase  text-[14px] text-center">
                {productData.name} - Future Enhancement Roadmap
              </div>
              <div className="bg-transparent border border-[#D3D1C7] px-4 py-2 text-[11px] leading-[1.5] text-gray-600 italic font-medium font-poppins text-center">
                {hasInnovationShape
                  ? "Future-state innovations only. Minimum 5 AI/LLM features. Minimum 3 MCP/automation features. High-impact rows highlighted."
                  : hasVendorEnhancementShape
                    ? "25+ future enhancements. AI/ML and MCP/automation innovations highlighted. Not duplicating product roadmap items."
                    : "Each row shows: current behaviour to enhanced behaviour with integration type"}
              </div>
              <div className="bg-white border border-[#E5E7EB]">
                {hasVendorEnhancementShape ? (
                  <table className="w-full table-fixed border-collapse font-poppins text-[12px] leading-[1.55] text-left">
                    <thead>
                      <tr className="bg-[#F6F4EE] text-[#DA7756] border-b border-[#D3D1C7] font-semibold uppercase">
                        {hasRowId && (
                          <th className="border border-[#E5E7EB] bg-white px-2 py-3 text-center w-[5%]">
                            #
                          </th>
                        )}
                        <th className="border border-[#E5E7EB] bg-white px-3 py-3 w-[18%]">
                          Enhancement Name
                        </th>
                        <th className="border border-[#E5E7EB] bg-white px-3 py-3 w-[10%]">
                          Category
                        </th>
                        <th className="border border-[#E5E7EB] bg-white px-3 py-3 w-[40%]">
                          Description
                        </th>
                        {!isProcurement && (
                          <th className="border border-[#E5E7EB] bg-white px-3 py-3 w-[22%]">
                            {hasInnovationShape ? "Business Value" : "Target User"}
                          </th>
                        )}
                        <th className="border border-[#E5E7EB] bg-white px-3 py-3 w-[20%]">
                          {isProcurement ? "Competitive Leapfrog" : "Competitor Leapfrogged"}
                        </th>
                        {hasImpact && (
                          <th className="border border-[#E5E7EB] bg-white px-3 py-3 text-center w-[8%]">
                            {isProcurement
                              ? "Impact Level"
                              : hasInnovationShape
                                ? "Priority"
                                : "Impact"}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {displayEnhancements.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`align-top ${idx % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                        >
                          {hasRowId && (
                            <td className="border border-[#E5E7EB] px-2 py-3 font-semibold text-center text-gray-600 break-words">
                              {item.rowId ?? idx + 1}
                            </td>
                          )}
                          <td className="border border-[#E5E7EB] px-3 py-3 font-semibold text-[#DA7756] whitespace-pre-line break-words">
                            {item.featureName}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.category}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.description}
                          </td>
                          {!isProcurement && (
                            <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                              {hasInnovationShape
                                ? innovationLayer[idx]?.value
                                : item.targetUser}
                            </td>
                          )}
                          <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.competitorLeapfrogged}
                          </td>
                          {hasImpact && (
                            <td className="border border-[#E5E7EB] px-3 py-3 text-center font-semibold text-[#DA7756] whitespace-pre-line break-words">
                              {item.impact}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full border-collapse font-poppins text-[11px] leading-[1.5] text-left">
                    <thead>
                      <tr className="bg-[#F6F4EE] text-[#DA7756] border-b border-[#D3D1C7] font-semibold uppercase">
                        {hasRowId && (
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 text-center w-[5%]">
                            #
                          </th>
                        )}
                        {hasModule && (
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 w-[14%]">
                            Module
                          </th>
                        )}
                        <th className="border border-[#E5E7EB] bg-white px-3 py-2 w-[16%]">
                          Feature
                        </th>
                        <th className="border border-[#E5E7EB] bg-white px-3 py-2 w-[24%]">
                          How It Currently Works
                        </th>
                        <th className="border border-[#E5E7EB] bg-white px-3 py-2 w-[30%]">
                          Enhanced Version
                        </th>
                        <th className="border border-[#E5E7EB] bg-white px-3 py-2 w-[16%] text-center">
                          Integration Type
                        </th>
                        {hasEffort && (
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[7%] text-center">
                            Effort
                          </th>
                        )}
                        {hasImpact && (
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[7%] text-center">
                            Impact
                          </th>
                        )}
                        {hasOutcome && (
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 w-[20%] text-left">
                            Revenue / Relationship Outcome
                          </th>
                        )}
                        {hasPriority && (
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[7%] text-center">
                            Priority
                          </th>
                        )}
                        {hasOwner && (
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 w-[10%] text-center">
                            Owner
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {enhancementRoadmap.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`align-top ${idx % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                        >
                          {hasRowId && (
                            <td className="border border-[#E5E7EB] px-2 py-2 font-semibold text-center text-gray-600">
                              {item.rowId ?? idx + 1}
                            </td>
                          )}
                          {hasModule && (
                            <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-[#DA7756] break-words whitespace-pre-line">
                              {item.module}
                            </td>
                          )}
                          <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-[#DA7756] break-words whitespace-pre-line">
                            {item.featureName}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.currentStatus}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.enhancedVersion}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-2 text-center text-[#DA7756] font-semibold whitespace-pre-line break-words">
                            {item.integrationType}
                          </td>
                          {hasEffort && (
                            <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756]">
                              {item.effort}
                            </td>
                          )}
                          {hasImpact && (
                            <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756]">
                              {item.impact}
                            </td>
                          )}
                          {hasOutcome && (
                            <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                              {item.outcome}
                            </td>
                          )}
                          {hasPriority && (
                            <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756]">
                              {item.priority}
                            </td>
                          )}
                          {hasOwner && (
                            <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756] whitespace-pre-line break-words">
                              {item.owner}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top 5 Summary */}
      {top5Impact.length > 0 && (
        <div className="space-y-4">
          <div className="bg-white text-[#2C2C2C] border-y border-[#D3D1C7] px-4 py-2 font-semibold font-poppins text-xs uppercase tracking-wider">
            Top 5 Highest-Impact Enhancements Summary
          </div>
          <div className="border border-[#C4B89D] rounded-xl bg-white">
            <table className="w-full table-fixed border-collapse font-poppins text-[12px] leading-[1.55] bg-white">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase text-center">
                  {hasTop5Rank && (
                    <th className="border border-[#E5E7EB] p-3 w-[7%]">Rank</th>
                  )}
                  <th className="border border-[#E5E7EB] p-2 w-[25%] text-left">
                    Enhancement
                  </th>
                  <th className="border border-[#E5E7EB] p-2 w-[45%] text-left">
                    Why It Matters Most
                  </th>
                  <th className="border border-[#E5E7EB] p-2 w-[25%] text-left">
                    Competitor It Leapfrogs
                  </th>
                </tr>
              </thead>
              <tbody>
                {top5Impact.map((item, idx) => (
                  <tr key={idx} className="bg-white">
                    {hasTop5Rank && (
                      <td className="border border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] text-center bg-white">
                        {item.rank}
                      </td>
                    )}
                    <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C] font-semibold break-words whitespace-pre-line">
                      {item.name}
                    </td>
                    <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed break-words whitespace-pre-line">
                      {item.logic}
                    </td>
                    <td className="border border-[#E5E7EB] p-3 text-[#4B5563] font-medium break-words whitespace-pre-line">
                      {item.leapfrog}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Strategic Enhancements (Alternative Format) */}
      {productData.extendedContent?.detailedEnhancements && (
        <div className="border border-[#C4B89D] rounded-xl bg-white">
          <table className="w-full border-collapse font-poppins text-[11px] leading-[1.5] bg-white text-center">
            <thead>
              <tr className="bg-white text-[#DA7756] font-semibold uppercase text-center border-b border-[#D3D1C7]">
                <th className="border border-[#E5E7EB]/50 p-4 w-[12%]">
                  Timeline
                </th>
                <th className="border border-[#E5E7EB]/50 p-4 w-[18%]">
                  Strategic Focus
                </th>
                <th className="border border-[#E5E7EB]/50 p-4 w-[40%] text-left">
                  Key Features / Innovation
                </th>
                <th className="border border-[#E5E7EB]/50 p-4 w-[15%]">
                  Business Logic
                </th>
                <th className="border border-[#E5E7EB]/50 p-4 w-[15%]">
                  Core Benefit
                </th>
              </tr>
            </thead>
            <tbody>
              {productData.extendedContent?.detailedEnhancements?.roadmap?.map(
                (row, i) => (
                  <tr
                    key={i}
                    className="bg-white border-b border-[#E5E7EB] last:border-0"
                  >
                    <td className="border border-[#E5E7EB]/50 p-4 font-semibold text-[#DA7756] bg-white uppercase tracking-tighter">
                      {row.period}
                    </td>
                    <td className="border border-[#E5E7EB]/50 p-4 text-[#2C2C2C] font-semibold uppercase text-[9px] leading-tight">
                      {row.focus}
                    </td>
                    <td className="border border-[#E5E7EB]/50 p-4 text-[#2C2C2C]/70 font-semibold leading-relaxed text-left">
                      <div className="bg-white p-3 rounded-lg border-l-4 border-[#4B5563]  font-medium">
                        {row.features}
                      </div>
                    </td>
                    <td className="border border-[#E5E7EB]/50 p-4 text-[#2C2C2C]/60 font-semibold uppercase text-[8px] leading-tight bg-white">
                      {row.logic}
                    </td>
                    <td className="border border-[#E5E7EB]/50 p-4 text-[#798C5E] font-semibold uppercase text-[9px] tracking-tight">
                      {row.risk}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
};

export default EnhancementsTab;
