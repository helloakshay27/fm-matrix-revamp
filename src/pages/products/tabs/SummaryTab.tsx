import React, { useMemo } from "react";
import { ProductData } from "../types";
import { buildSummarySheetRows } from "../helpers";

interface SummaryTabProps {
  productData: ProductData;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ productData }) => {
  const summarySheetRows = useMemo(() => buildSummarySheetRows(productData), [productData]);

  if (productData.excelLikeSummary) {
    return (
      <div className="animate-fade-in bg-gray-50">
        <div className="bg-white text-gray-900 border border-[#D3D1C7] p-5 rounded-t-xl mb-0 flex justify-between items-center">
          <h2 className="text-2xl font-semibold font-poppins uppercase tracking-tight">
            {productData.name} - Product Summary
          </h2>
        </div>
        <div className="w-full bg-gray-50" style={{}}>
          <div className="py-4">
            <div className="bg-white text-gray-800 px-4 py-3 font-semibold font-poppins uppercase tracking-tight text-[16px] text-center border-b border-[#D3D1C7]">
              {productData.name} - Product Summary Brief
            </div>
            {productData.extendedContent?.productSummaryNew?.summarySubtitle && (
              <div className="bg-white border-b border-[#D3D1C7] px-4 py-2 text-[12px] leading-[1.5] text-gray-600 italic font-medium font-poppins text-center">
                {productData.extendedContent.productSummaryNew.summarySubtitle}
              </div>
            )}
            <div className="mt-3">
              <div className="w-full">
                <table className="w-full table-fixed border-collapse font-poppins text-[12px] leading-[1.55] bg-gray-50">
                  <thead>
                    <tr className="font-semibold uppercase text-[11px] text-[#2C2C2C]">
                      <th className="border border-[#E5E7EB] bg-white text-gray-800 px-3 py-3 w-[26%] text-left">Field / Section</th>
                      <th className="border border-[#E5E7EB] bg-gray-100 px-3 py-3 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summarySheetRows.map((row, index) => {
                      if (row.kind === "section") {
                        return (
                          <tr key={`section-${index}`}>
                            <td className="border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-gray-800" colSpan={2}>
                              {row.label}
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={`data-${index}`} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} align-top`}>
                          <td className="border border-[#E5E7EB] bg-gray-100 px-3 py-3 font-semibold text-[#2C2C2C] whitespace-pre-line break-words">{row.label}</td>
                          <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">{row.detail}</td>
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

  return (
    <div className="space-y-8 animate-fade-in overflow-x-auto">
      <div className="bg-white text-gray-900 border border-[#D3D1C7] p-6 rounded-t-xl">
        <h2 className="text-2xl font-semibold tracking-tight font-poppins">{productData.name} - Identity</h2>
        <p className="text-[10px] font-medium text-gray-500 tracking-widest mt-1">LOCKATED / GOPHYGITAL | INTERNAL CONFIDENTIAL</p>
      </div>
      <div className="bg-gray-50 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {productData.extendedContent?.productSummaryNew?.identity?.map((r, i) => (
              <tr key={i}>
                <td className="border border-[#E5E7EB] p-4 font-semibold text-[#2C2C2C] w-1/4 bg-gray-100 font-poppins">{r.field}</td>
                <td className="border border-[#E5E7EB] p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white text-gray-900 border border-[#D3D1C7] p-4 font-semibold text-sm rounded-t-xl font-poppins">The Problem It Solves</div>
      <div className="bg-gray-50 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold">
              <th className="border border-[#E5E7EB] p-4 text-left w-1/4 font-poppins">Pain Point</th>
              <th className="border border-[#E5E7EB] p-4 text-left font-poppins">Our Solution</th>
            </tr>
          </thead>
          <tbody>
            {productData.extendedContent?.productSummaryNew?.problemSolves?.map((r, i) => (
              <tr key={i}>
                <td className="border border-[#E5E7EB] p-4 font-semibold text-[#2C2C2C] bg-gray-100 font-poppins">{r.painPoint}</td>
                <td className="border border-[#E5E7EB] p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">{r.solution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white text-gray-900 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">Who It Is For</div>
      <div className="bg-gray-50 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold">
              <th className="border border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">Role</th>
              <th className="border border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">What They Use It For</th>
              <th className="border border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">Key Frustration Today</th>
              <th className="border border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">What They Gain</th>
            </tr>
          </thead>
          <tbody>
            {productData.extendedContent?.productSummaryNew?.whoItIsFor?.map((r, i) => (
              <tr key={i}>
                <td className="border-b border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] bg-gray-100 font-poppins">{r.role}</td>
                <td className="border-b border-[#E5E7EB] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">{r.useCase}</td>
                <td className="border-b border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-medium leading-relaxed italic font-poppins bg-white">{r.frustration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white text-gray-800 px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-gray-200">Feature Summary</div>
      <div className="border border-t-0 border-[#D3D1C7] p-4 text-sm text-[#2C2C2C]/80 bg-gray-50 font-medium leading-relaxed rounded-b-xl font-poppins">
        {productData.extendedContent?.featureSummary || productData.brief}
      </div>

      <div className="bg-white text-gray-800 px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-gray-200">Where We Are Today</div>
      <div className="bg-gray-50 overflow-hidden ">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold">
              <th className="border-b border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">Dimension</th>
              <th className="border-b border-[#E5E7EB] p-3 text-center w-3/4 font-poppins">Current State</th>
            </tr>
          </thead>
          <tbody>
            {productData.extendedContent?.productSummaryNew?.today?.map((r, i) => (
              <tr key={i}>
                <td className="border-b border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] bg-gray-100 font-poppins">{r.dimension}</td>
                <td className="border-b border-[#E5E7EB] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">{r.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTab;
