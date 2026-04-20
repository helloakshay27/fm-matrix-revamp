import React from "react";
import { ProductData } from "../types";

interface SWOTTabProps {
  productData: ProductData;
}

const SWOTTab: React.FC<SWOTTabProps> = ({ productData }) => {
  const isCpManagement = productData.name === "CP Management";

  return (
    <div className="space-y-6 animate-fade-in">
      {productData.excelLikeSwot ? (
        <div className="bg-transparent p-3">
          <div className="w-full rounded-md border border-[#C4B89D] bg-white">
            <div className="px-4 pt-4 pb-6">
              <div
                className={`bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-poppins uppercase ${isCpManagement ? "text-sm font-semibold tracking-wide text-left" : "font-bold tracking-tight text-[16px] text-center"}`}
              >
                {productData.name} - SWOT Analysis
              </div>

              {productData.extendedContent?.detailedSWOT ? (
                <div className="mt-4 space-y-4">
                  <div className="bg-white border border-[#E5E7EB]">
                    <table className="w-full table-fixed border-collapse font-poppins text-[12px] leading-[1.55]">
                      <thead>
                        <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                          <th
                            className="border border-[#D3D1C7] px-3 py-2 text-left font-semibold uppercase"
                            colSpan={6}
                          >
                            SWOT Analysis
                          </th>
                        </tr>
                        <tr className="font-semibold uppercase">
                          <th
                            className="border border-[#D3D1C7] bg-[#798C5E]/15 text-[#798C5E] px-3 py-2 text-left"
                            colSpan={3}
                          >
                            Strengths (Internal / Positive)
                          </th>
                          <th
                            className="border border-[#D3D1C7] bg-[#E49191]/15 text-[#C72030] px-3 py-2 text-left"
                            colSpan={3}
                          >
                            Weaknesses (Internal / Negative)
                          </th>
                        </tr>
                        <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 text-center w-[6%]">
                            ID
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 text-left w-[20%]">
                            Strength
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 text-left w-[24%]">
                            Detail at market
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 text-center w-[6%]">
                            ID
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 text-left w-[20%]">
                            Weakness
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 text-left w-[24%]">
                            Detail at market
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(
                          {
                            length: Math.max(
                              productData.extendedContent.detailedSWOT.strengths
                                .length,
                              productData.extendedContent.detailedSWOT
                                .weaknesses.length
                            ),
                          },
                          (_, i) => i
                        ).map((i) => {
                          const s =
                            productData.extendedContent.detailedSWOT.strengths[
                              i
                            ];
                          const w =
                            productData.extendedContent.detailedSWOT.weaknesses[
                              i
                            ];
                          return (
                            <tr
                              key={`sw-${i}`}
                              className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                            >
                              <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-600">
                                {s ? `S${i + 1}` : ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-gray-700 break-words">
                                {s?.headline ?? ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                {s?.explanation ?? ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-600">
                                {w ? `W${i + 1}` : ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-gray-700 break-words">
                                {w?.headline ?? ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                {w?.explanation ?? ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <table className="w-full table-fixed border-collapse font-poppins text-[12px] leading-[1.55] mt-4">
                      <thead>
                        <tr className="font-semibold uppercase">
                          <th
                            className="border border-[#D3D1C7] bg-[#DA7756]/10 text-[#DA7756] px-3 py-2 text-left"
                            colSpan={3}
                          >
                            Opportunities (External / Positive)
                          </th>
                          <th
                            className="border border-[#D3D1C7] bg-[#EDC488]/20 text-[#B8860B] px-3 py-2 text-left"
                            colSpan={3}
                          >
                            Threats (External / Negative)
                          </th>
                        </tr>
                        <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 text-center w-[6%]">
                            ID
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 text-left w-[20%]">
                            Opportunity
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 text-left w-[24%]">
                            Detail & how to
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-2 py-2 text-center w-[6%]">
                            ID
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 text-left w-[20%]">
                            Threat
                          </th>
                          <th className="border border-[#E5E7EB] bg-white px-3 py-2 text-left w-[24%]">
                            Detail & mitigation
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(
                          {
                            length: Math.max(
                              productData.extendedContent.detailedSWOT
                                .opportunities.length,
                              productData.extendedContent.detailedSWOT.threats
                                .length
                            ),
                          },
                          (_, i) => i
                        ).map((i) => {
                          const o =
                            productData.extendedContent.detailedSWOT
                              .opportunities[i];
                          const t =
                            productData.extendedContent.detailedSWOT.threats[i];
                          return (
                            <tr
                              key={`ot-${i}`}
                              className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                            >
                              <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-600">
                                {o ? `O${i + 1}` : ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-gray-700 break-words">
                                {o?.headline ?? ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                {o?.explanation ?? ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-gray-600">
                                {t ? `T${i + 1}` : ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-gray-700 break-words">
                                {t?.headline ?? ""}
                              </td>
                              <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                {t?.explanation ?? ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                  SWOT Analysis Data Coming Soon
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12  p-4 bg-white border border-[#C4B89D] rounded-xl">
          <div className="bg-white text-gray-900 border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center ">
            <h2 className="text-2xl font-semibold font-poppins uppercase tracking-tight">
              Strategic SWOT Analysis Matrix
            </h2>
          </div>
          {productData.extendedContent?.detailedSWOT && (
            <div className="border border-[#C4B89D] rounded-b-xl overflow-hidden bg-white">
              <div className="bg-white text-center text-[11px] p-2 border-b border-[#E5E7EB] text-[#2C2C2C]/70 font-medium font-poppins">
                Grounded in product features, market context, and competitor
                landscape. Not generic.
              </div>

              <div className="flex flex-col md:flex-row border-b border-[#E5E7EB]">
                <div className="w-full md:w-1/2 flex flex-col bg-white border-b md:border-b-0 md:border-r border-[#E5E7EB]">
                  <div className="text-center font-semibold text-[#798C5E] p-3 text-lg tracking-widest border-b border-[#E5E7EB] uppercase font-poppins">
                    STRENGTHS
                  </div>
                  <div className="p-4 space-y-6">
                    {productData.extendedContent.detailedSWOT.strengths.map(
                      (item, i) => (
                        <div key={i} className="text-[11px] font-poppins">
                          <span className="font-semibold text-[#2C2C2C] block mb-1">
                            S{i + 1} {item.headline}
                          </span>
                          <p className="text-[#2C2C2C]/70 leading-relaxed font-medium">
                            {item.explanation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col bg-white">
                  <div className="text-center font-semibold text-gray-700 p-3 text-lg tracking-widest border-b border-[#E5E7EB] uppercase font-poppins">
                    WEAKNESSES
                  </div>
                  <div className="p-4 space-y-6">
                    {productData.extendedContent.detailedSWOT.weaknesses.map(
                      (item, i) => (
                        <div key={i} className="text-[11px] font-poppins">
                          <span className="font-semibold text-[#2C2C2C] block mb-1">
                            W{i + 1} {item.headline}
                          </span>
                          <p className="text-[#2C2C2C]/70 leading-relaxed font-medium">
                            {item.explanation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 flex flex-col bg-white border-b md:border-b-0 md:border-r border-[#E5E7EB]">
                  <div className="text-center font-semibold text-[#4B5563] p-3 text-lg tracking-widest border-b border-[#E5E7EB] uppercase font-poppins">
                    OPPORTUNITIES
                  </div>
                  <div className="p-4 space-y-6">
                    {productData.extendedContent.detailedSWOT.opportunities.map(
                      (item, i) => (
                        <div key={i} className="text-[11px] font-poppins">
                          <span className="font-semibold text-[#2C2C2C] block mb-1">
                            O{i + 1} {item.headline}
                          </span>
                          <p className="text-[#2C2C2C]/70 leading-relaxed font-medium">
                            {item.explanation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col bg-white">
                  <div className="text-center font-semibold text-[#E49191] p-3 text-lg tracking-widest border-b border-[#E5E7EB] uppercase font-poppins">
                    THREATS
                  </div>
                  <div className="p-4 space-y-6">
                    {productData.extendedContent.detailedSWOT.threats.map(
                      (item, i) => (
                        <div key={i} className="text-[11px] font-poppins">
                          <span className="font-semibold text-[#2C2C2C] block mb-1">
                            T{i + 1} {item.headline}
                          </span>
                          <p className="text-[#2C2C2C]/70 leading-relaxed font-medium">
                            {item.explanation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {!productData.extendedContent?.detailedSWOT && (
            <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
              SWOT Analysis Data Coming Soon
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SWOTTab;
