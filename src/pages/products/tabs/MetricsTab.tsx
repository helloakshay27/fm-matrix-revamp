import React from "react";
import { ProductData } from "../types";

interface MetricsTabProps {
  productData: ProductData;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ productData }) => {
  const sheetSections =
    productData.extendedContent?.detailedMetrics?.sheet?.sections ?? [];
  const isCpManagement = productData.name === "CP Management";

  return (
    <>
      {productData.excelLikeMetrics ? (
        <div className="bg-transparent p-3">
          <div className="w-full rounded-md border border-[#C4B89D] bg-white">
            <div className="px-4 pt-4 pb-6">
              <div
                className={`bg-white text-[#2C2C2C] border border-[#D3D1C7] px-4 py-3 font-poppins uppercase ${isCpManagement ? "text-left text-sm font-semibold tracking-wide" : "text-center text-[16px] font-bold tracking-tight"}`}
              >
                {productData.extendedContent?.detailedMetrics?.sheet?.title ||
                  `${productData.name} — Performance Metrics`}
              </div>

              {sheetSections.length ? (
                <div className="mt-4 space-y-4">
                  {sheetSections.map((sec, sIdx) => {
                    const isInfoOnly =
                      sec.columns.length === 0 && sec.rows.length === 0;
                    const hasTitle = sec.title.trim().length > 0;
                    const isSectionHeading = sec.title.startsWith("SECTION ");
                    const isNorthStarHeading = sec.title.startsWith(
                      "★ NORTH STAR METRIC"
                    );
                    const isLegend = sec.title.startsWith("LEGEND:");

                    if (isInfoOnly) {
                      return (
                        <div
                          key={sIdx}
                          className={
                            isSectionHeading || isNorthStarHeading
                              ? "bg-white text-[#2C2C2C] border border-[#D3D1C7] px-4 py-2 text-[11px] font-semibold font-poppins"
                              : isLegend
                                ? "bg-transparent border border-[#D3D1C7] px-4 py-2 text-[10px] leading-[1.5] text-gray-600 italic font-medium font-poppins"
                                : "bg-transparent border border-[#D3D1C7] px-4 py-2 text-[11px] leading-[1.5] text-gray-600 italic font-medium font-poppins"
                          }
                        >
                          {sec.title}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={sIdx}
                        className="bg-white border border-[#E5E7EB]"
                      >
                        {hasTitle && (
                          <div className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] px-4 py-2 text-[13px] font-semibold font-poppins">
                            {sec.title}
                          </div>
                        )}
                        <table className="w-full table-fixed border-collapse text-[12px] leading-[1.55] font-poppins">
                          {sec.columns.some(
                            (column) => column.trim() !== ""
                          ) && (
                            <thead>
                              <tr className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] font-semibold">
                                {sec.columns.map((column, columnIndex) => (
                                  <th
                                    key={columnIndex}
                                    className="border border-[#E5E7EB] px-3 py-2 text-left align-top whitespace-pre-line break-words"
                                  >
                                    {column}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {sec.rows.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                className={`align-top ${rowIndex % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                              >
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className={`border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium align-top whitespace-pre-line break-words ${cellIndex === 0 ? "font-semibold text-[#2C2C2C]/70" : ""}`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              ) : productData.extendedContent?.detailedMetrics ? (
                <div className="space-y-6 p-4">
                  {/* Section 1 */}
                  <div className="rounded-xl border border-[#C4B89D] bg-white overflow-hidden ">
                    <div className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] px-4 py-3 text-sm font-semibold tracking-wide font-poppins">
                      Quantifiable Impact (Efficiency / Savings)
                    </div>
                    <table className="w-full border-collapse text-sm leading-relaxed font-poppins">
                      <thead>
                        <tr className="font-semibold text-[#2C2C2C]">
                          <th className="border-b border-[#E5E7EB] bg-white px-4 py-3 w-[22%] text-left">
                            Metric Domain
                          </th>
                          <th className="border-b border-[#E5E7EB] bg-[#F6F4EE] px-4 py-3 w-[18%] text-center">
                            Baseline (Traditional)
                          </th>
                          <th className="border-b border-[#E5E7EB] bg-[#F6F4EE] px-4 py-3 w-[18%] text-center">
                            Digital Impact (Our System)
                          </th>
                          <th className="border-b border-[#E5E7EB] bg-[#F6F4EE] px-4 py-3 text-left">
                            Primary Claim
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.extendedContent.detailedMetrics.clientImpact?.map(
                          (m, i) => (
                            <tr
                              key={i}
                              className={`${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"} align-top`}
                            >
                              <td className="border-b border-[#E5E7EB] px-4 py-3 font-semibold text-[#2C2C2C] bg-white">
                                {m.metric}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#E49191] font-medium italic">
                                {m.baseline}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#108C72] font-semibold">
                                {m.withSnag}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/80 font-medium whitespace-pre-line italic">
                                {m.claim}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Section 2 */}
                  <div className="rounded-xl border border-[#C4B89D] bg-white overflow-hidden ">
                    <div className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] px-4 py-3 text-sm font-semibold tracking-wide font-poppins">
                      Business Growth Targets (Internal Projection)
                    </div>
                    <table className="w-full border-collapse text-sm leading-relaxed font-poppins">
                      <thead>
                        <tr className="font-semibold text-[#2C2C2C] bg-[#F6F4EE]">
                          <th className="border-b border-[#E5E7EB] px-4 py-3 w-[20%] text-left">
                            Metric
                          </th>
                          <th className="border-b border-[#E5E7EB] px-4 py-3 w-[26%] text-left">
                            Definition
                          </th>
                          <th className="border-b border-[#E5E7EB] px-4 py-3 w-[10%] text-center">
                            D30 Current
                          </th>
                          <th className="border-b border-[#E5E7EB] px-4 py-3 w-[10%] text-center">
                            D30 Phase 1
                          </th>
                          <th className="border-b border-[#E5E7EB] px-4 py-3 w-[10%] text-center">
                            M3 Current
                          </th>
                          <th className="border-b border-[#E5E7EB] px-4 py-3 w-[10%] text-center">
                            M3 Phase 1
                          </th>
                          <th className="border-b border-[#E5E7EB] px-4 py-3 w-[14%] text-left">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.extendedContent.detailedMetrics.businessTargets?.map(
                          (t, i) => (
                            <tr
                              key={i}
                              className={`${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"} align-top`}
                            >
                              <td className="border-b border-[#E5E7EB] px-4 py-3 font-semibold text-[#2C2C2C] bg-white">
                                {t.metric}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/80 font-medium">
                                {t.definition}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#2C2C2C] font-semibold">
                                {t.d30Current}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#2C2C2C]/70 font-semibold bg-white">
                                {t.d30Phase1}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#2C2C2C] font-semibold">
                                {t.m3Current}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#2C2C2C]/70 font-semibold bg-[#F6F4EE]">
                                {t.m3Phase1}
                              </td>
                              <td className="border-b border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/60 font-medium italic">
                                —
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center text-[#D3D1C7] font-semibold text-lg border-2 border-dashed border-[#D3D1C7] rounded-xl m-4 font-poppins">
                  Performance Metrics Data Coming Soon
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white text-[#2C2C2C] border border-[#D3D1C7] p-5 rounded-xl mb-0 flex justify-between items-center">
            <h2 className="text-xl font-semibold tracking-tight font-poppins">
              {productData.name} — Performance Metrics
            </h2>
          </div>
          {productData.extendedContent?.detailedMetrics && (
            <div className="space-y-8 mt-6">
              <div className="space-y-4">
                <div className="bg-white text-[#2C2C2C] border-y border-[#D3D1C7] px-4 py-2 font-semibold font-poppins text-sm uppercase">
                  Quantifiable Impact (Efficiency / Savings)
                </div>
                <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                  <table className="w-full border-collapse font-poppins text-sm leading-relaxed bg-white text-center">
                    <thead>
                      <tr className="bg-[#F6F4EE] font-semibold uppercase text-[#2C2C2C]">
                        <th className="border border-[#E5E7EB] p-3 w-[25%] text-left">
                          Metric Domain
                        </th>
                        <th className="border border-[#E5E7EB] p-3">
                          Baseline (Traditional)
                        </th>
                        <th className="border border-[#D3D1C7] p-3 bg-white text-gray-800 font-semibold">
                          Digital Impact (Our System)
                        </th>
                        <th className="border border-[#E5E7EB] p-3 text-left">
                          Primary Claim
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent?.detailedMetrics?.clientImpact?.map(
                        (metric, i) => (
                          <tr key={i} className="">
                            <td className="border border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] uppercase text-left">
                              {metric.metric}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#E49191] font-medium line-through decoration-[#E49191]/30">
                              {metric.baseline}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#108C72] font-semibold bg-[#F6F4EE]">
                              {metric.withSnag}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-medium leading-tight text-left">
                              {metric.claim}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white text-[#2C2C2C] border-y border-[#D3D1C7] px-4 py-2 font-semibold font-poppins text-sm uppercase">
                  Business Growth Targets (Internal Projection)
                </div>
                <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                  <table className="w-full border-collapse font-poppins text-sm leading-relaxed bg-white text-center">
                    <thead>
                      <tr className="bg-[#F6F4EE] font-semibold uppercase text-[#2C2C2C]">
                        <th className="border border-[#E5E7EB] p-3 text-left">
                          Product Metric
                        </th>
                        <th className="border border-[#E5E7EB] p-3">
                          D30 Current
                        </th>
                        <th className="border border-[#D3D1C7] p-3 font-semibold text-[#2C2C2C]/70 bg-white">
                          D30 Phase 1
                        </th>
                        <th className="border border-[#E5E7EB] p-3">
                          M3 Current
                        </th>
                        <th className="border border-[#D3D1C7] p-3 font-semibold text-[#2C2C2C]/70 bg-white">
                          M3 Phase 1
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent?.detailedMetrics?.businessTargets?.map(
                        (target, i) => (
                          <tr key={i} className="">
                            <td className="border border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] uppercase text-left">
                              {target.metric}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/60 font-medium">
                              {target.d30Current}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-semibold bg-[#F6F4EE]">
                              {target.d30Phase1}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/60 font-medium">
                              {target.m3Current}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-semibold bg-[#F6F4EE]">
                              {target.m3Phase1}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {!productData.extendedContent?.detailedMetrics && (
            <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
              Performance Metrics Data Coming Soon
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MetricsTab;
