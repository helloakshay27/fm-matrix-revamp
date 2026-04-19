import React from "react";
import { ProductData } from "../types";

interface EnhancementsTabProps {
  productData: ProductData;
}

const EnhancementsTab: React.FC<EnhancementsTabProps> = ({ productData }) => {
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
        <div className="flex items-center gap-2 bg-white border border-[#D3D1C7] px-3 py-1 rounded text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-700">
          Legacy to AI Transformation | FY 2026-28
        </div>
      </div>

      {/* 1. High-Impact Enhancements Matrix */}
      {displayEnhancements.length > 0 && (
        <div className="space-y-4">
          <div className="border border-[#C4B89D] bg-white rounded-xl p-3">
            <div className="w-full bg-white space-y-3">
              <div className="bg-white text-[#2C2C2C] border border-[#D3D1C7] px-4 py-3 font-bold font-poppins uppercase tracking-tight text-[14px] text-center">
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
                      <tr className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] font-semibold uppercase">
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
                        <th className="border border-[#E5E7EB] bg-white px-3 py-3 w-[22%]">
                          {hasInnovationShape ? "Business Value" : "Target User"}
                        </th>
                        <th className="border border-[#E5E7EB] bg-white px-3 py-3 w-[20%]">
                          Competitor Leapfrogged
                        </th>
                        {hasImpact && (
                          <th className="border border-[#E5E7EB] bg-white px-3 py-3 text-center w-[8%]">
                            {hasInnovationShape ? "Priority" : "Impact"}
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
                          <td className="border border-[#E5E7EB] px-3 py-3 font-semibold text-gray-700 whitespace-pre-line break-words">
                            {item.featureName}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.category}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.description}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {hasInnovationShape
                              ? innovationLayer[idx]?.value
                              : item.targetUser}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.competitorLeapfrogged}
                          </td>
                          {hasImpact && (
                            <td className="border border-[#E5E7EB] px-3 py-3 text-center font-semibold text-gray-700 whitespace-pre-line break-words">
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
                      <tr className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] font-semibold uppercase">
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
                            <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-gray-700 break-words whitespace-pre-line">
                              {item.module}
                            </td>
                          )}
                          <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-gray-700 break-words whitespace-pre-line">
                            {item.featureName}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.currentStatus}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {item.enhancedVersion}
                          </td>
                          <td className="border border-[#E5E7EB] px-3 py-2 text-center text-gray-700 font-semibold whitespace-pre-line break-words">
                            {item.integrationType}
                          </td>
                          {hasEffort && (
                            <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-700">
                              {item.effort}
                            </td>
                          )}
                          {hasImpact && (
                            <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-700">
                              {item.impact}
                            </td>
                          )}
                          {hasPriority && (
                            <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-700">
                              {item.priority}
                            </td>
                          )}
                          {hasOwner && (
                            <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-700 whitespace-pre-line break-words">
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
                <tr className="bg-white text-[#2C2C2C] font-semibold uppercase text-center">
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
              <tr className="bg-white text-gray-800 font-semibold uppercase text-center border-b border-[#D3D1C7]">
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
                    <td className="border border-[#E5E7EB]/50 p-4 font-semibold text-gray-700 bg-white uppercase tracking-tighter">
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
