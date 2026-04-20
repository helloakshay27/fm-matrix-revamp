import React, { useMemo, useState } from "react";
import { ProductData } from "../types";
import { buildSummarySheetRows } from "../helpers";

interface SummaryTabProps {
  productData: ProductData;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ productData }) => {
  const [activePerspective, setActivePerspective] = useState(0);

  const hasPerspectives = !!productData.extendedContent?.productSummaryNew?.perspectives?.length;

  const summarySheetRows = useMemo(
    () => buildSummarySheetRows(productData, hasPerspectives ? activePerspective : -1),
    [productData, hasPerspectives, activePerspective]
  );

  if (productData.extendedContent?.rawSummaryTable) {
    return (
      <div className="animate-fade-in text-[#1a1a2e]">
        {productData.extendedContent.rawSummaryTable}
      </div>
    );
  }

  if (productData.excelLikeSummary) {
    return (
      <div className="animate-fade-in bg-[#F6F4EE]">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-5 rounded-t-xl mb-0 flex justify-between items-center">
          <h2 className="text-2xl font-semibold font-poppins uppercase tracking-tight">
            {productData.name} - Product Summary
          </h2>
        </div>
        <div className="w-full bg-[#F6F4EE]">
          <div className="py-4">
            {hasPerspectives && (
              <div className="flex justify-center gap-4 mb-4 px-4">
                {productData.extendedContent?.productSummaryNew?.perspectives?.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePerspective(idx)}
                    className={`px-6 py-2 rounded-full font-semibold font-poppins text-sm uppercase tracking-wide transition-all ${
                      activePerspective === idx
                        ? "bg-[#DA7756] text-white shadow-md"
                        : "bg-white text-[#2C2C2C] border border-[#D3D1C7] hover:bg-[#F6F4EE]"
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}
            <div className="bg-white text-[#2C2C2C] px-4 py-3 font-semibold font-poppins uppercase tracking-tight text-[16px] text-center border-b border-[#D3D1C7]">
              {hasPerspectives ? productData.extendedContent?.productSummaryNew?.perspectives?.[activePerspective]?.title : productData.name} - Product Summary Brief
            </div>
            {(!hasPerspectives && productData.extendedContent?.productSummaryNew?.summarySubtitle) && (
              <div className="bg-white border-b border-[#D3D1C7] px-4 py-2 text-[12px] leading-[1.5] text-[#2C2C2C]/60 italic font-medium font-poppins text-center">
                {productData.extendedContent.productSummaryNew.summarySubtitle}
              </div>
            )}
            <div className="mt-3">
              <div className="w-full">
                <table className="w-full table-fixed border-collapse font-poppins text-[12px] leading-[1.55] bg-[#F6F4EE]">
                  <thead>
                    <tr className="font-semibold uppercase text-[11px] text-[#2C2C2C]">
                      <th className="border border-[#D3D1C7] bg-white text-[#2C2C2C] px-3 py-3 w-[26%] text-left">
                        Field / Section
                      </th>
                      <th className="border border-[#D3D1C7] bg-[#F6F4EE] px-3 py-3 text-left">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summarySheetRows.map((row, index) => {
                      if (row.kind === "section") {
                        return (
                          <tr key={`section-${index}`}>
                            <td
                              className="border border-[#D3D1C7] bg-[#DA7756]/8 px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-[#DA7756]"
                              colSpan={2}
                            >
                              {row.label}
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr
                          key={`data-${index}`}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"} align-top`}
                        >
                          <td className="border border-[#D3D1C7] bg-[#F6F4EE] px-3 py-3 font-semibold text-[#2C2C2C] whitespace-pre-line break-words">
                            {row.label}
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {row.detail}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSummaryData = hasPerspectives 
    ? productData.extendedContent?.productSummaryNew?.perspectives?.[activePerspective] 
    : productData.extendedContent?.productSummaryNew;
  const currentSummaryTitle = hasPerspectives
    ? productData.extendedContent?.productSummaryNew?.perspectives?.[activePerspective]?.title
    : productData.name;
  const currentFeatureSummary = hasPerspectives
    ? productData.extendedContent?.productSummaryNew?.perspectives?.[activePerspective]?.featureSummary
    : undefined;

  return (
    <div className="space-y-8 animate-fade-in overflow-x-auto">
      {hasPerspectives && (
        <div className="flex justify-center gap-4 mb-2 px-4 py-4 bg-[#F6F4EE]">
          {productData.extendedContent?.productSummaryNew?.perspectives?.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActivePerspective(idx)}
              className={`px-6 py-2 rounded-full font-semibold font-poppins text-sm uppercase tracking-wide transition-all ${
                activePerspective === idx
                  ? "bg-[#DA7756] text-white shadow-md"
                  : "bg-white text-[#2C2C2C] border border-[#D3D1C7] hover:bg-[#F6F4EE]"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-2xl font-semibold tracking-tight font-poppins">
          {currentSummaryTitle} - Identity
        </h2>
        <p className="text-[10px] font-medium text-[#2C2C2C]/40 tracking-widest mt-1">
          LOCKATED / GOPHYGITAL | INTERNAL CONFIDENTIAL
        </p>
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {currentSummaryData?.identity?.map(
              (r, i) => (
                <tr key={i}>
                  <td className="border border-[#D3D1C7] p-4 font-semibold text-[#2C2C2C] w-1/4 bg-[#F6F4EE] font-poppins">
                    {r.field}
                  </td>
                  <td className="border border-[#D3D1C7] p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                    {r.detail}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-4 font-semibold text-sm rounded-t-xl font-poppins border-l-4 border-l-[#DA7756]">
        The Problem It Solves
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] font-semibold">
              <th className="border border-[#D3D1C7] p-4 text-left w-1/4 font-poppins">
                Pain Point
              </th>
              <th className="border border-[#D3D1C7] p-4 text-left font-poppins">
                Our Solution
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSummaryData?.problemSolves?.map(
              (r, i) => (
                <tr key={i}>
                  <td className="border border-[#D3D1C7] p-4 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                    {r.painPoint}
                  </td>
                  <td className="border border-[#D3D1C7] p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                    {r.solution}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border-l-4 border-l-[#DA7756]">
        Who It Is For
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] font-semibold">
              <th className="border border-[#D3D1C7] p-3 text-center w-1/4 font-poppins">
                Role
              </th>
              <th className="border border-[#D3D1C7] p-3 text-center w-1/4 font-poppins">
                What They Use It For
              </th>
              <th className="border border-[#D3D1C7] p-3 text-center w-1/4 font-poppins">
                Key Frustration Today
              </th>
              <th className="border border-[#D3D1C7] p-3 text-center w-1/4 font-poppins">
                What They Gain
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSummaryData?.whoItIsFor?.map(
              (r, i) => (
                <tr key={i}>
                  <td className="border-b border-[#D3D1C7] p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                    {r.role}
                  </td>
                  <td className="border-b border-[#D3D1C7] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                    {r.useCase}
                  </td>
                  <td className="border-b border-[#D3D1C7] p-3 text-[#2C2C2C]/70 font-medium leading-relaxed italic font-poppins bg-white">
                    {r.frustration}
                  </td>
                  <td className="border-b border-[#D3D1C7] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                    {r.gain}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white text-[#2C2C2C] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D] border-l-4 border-l-[#DA7756]">
        Feature Summary
      </div>
      <div className="border border-t-0 border-[#D3D1C7] p-4 text-sm text-[#2C2C2C]/80 bg-[#F6F4EE] font-medium leading-relaxed rounded-b-xl font-poppins">
        {currentFeatureSummary || productData.extendedContent?.featureSummary || productData.brief}
      </div>

      <div className="bg-white text-[#2C2C2C] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D] border-l-4 border-l-[#DA7756]">
        Where We Are Today
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] font-semibold">
              <th className="border-b border-[#D3D1C7] p-3 text-center w-1/4 font-poppins">
                Dimension
              </th>
              <th className="border-b border-[#D3D1C7] p-3 text-center w-3/4 font-poppins">
                Current State
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSummaryData?.today?.map(
              (r, i) => (
                <tr key={i}>
                  <td className="border-b border-[#D3D1C7] p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                    {r.dimension}
                  </td>
                  <td className="border-b border-[#D3D1C7] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                    {r.state}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTab;
