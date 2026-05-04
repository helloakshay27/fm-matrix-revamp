import React from "react";
import { ProductData } from "../types";

interface SWOTTabProps {
  productData: ProductData;
}

const SWOTTab: React.FC<SWOTTabProps> = ({ productData }) => {
  const isCpManagement = productData.name === "CP Management";
  const isProcurement = productData.name.toLowerCase().includes("procurement");

  const swotData = productData.extendedContent?.detailedSWOT;
  const isClubSWOT = !!swotData?.isClubSWOT;
  const procurementSections = swotData
    ? [
        { title: "STRENGTHS", label: "Strength", rows: swotData.strengths },
        { title: "WEAKNESSES", label: "Weakness", rows: swotData.weaknesses },
        {
          title: "OPPORTUNITIES",
          label: "Opportunity",
          rows: swotData.opportunities,
        },
        { title: "THREATS", label: "Threat", rows: swotData.threats },
      ]
    : [];

  if (isClubSWOT) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">{productData.name} - SWOT Analysis</h2>
        </div>
        <div className="bg-[#F6F4EE] border border-[#D3D1C7] border-t-0 px-4 py-2 text-sm text-[#DA7756] font-medium italic font-poppins text-center">
          10 items per quadrant | Lockated / GoPhygital.work | India primary market context
        </div>

        <div className="mt-6 border border-[#D3D1C7] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D3D1C7]">
          {/* STRENGTHS */}
          <div className="bg-white">
            <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-bold uppercase tracking-widest text-center font-poppins border-b border-[#D3D1C7]">
              STRENGTHS
            </div>
            <div className="divide-y divide-[#D3D1C7]">
              {swotData.strengths?.map((item: any, i: number) => (
                <div key={i} className={`px-4 py-4 text-[12px] font-poppins ${i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
                  <div className="font-bold text-[#1F2937] mb-1.5 uppercase tracking-wide">S{i + 1}: {item.headline}</div>
                  <div className="text-[#4B5563] leading-relaxed font-medium">{item.explanation}</div>
                </div>
              ))}
            </div>
          </div>
          {/* WEAKNESSES */}
          <div className="bg-white">
            <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-bold uppercase tracking-widest text-center font-poppins border-b border-[#D3D1C7]">
              WEAKNESSES
            </div>
            <div className="divide-y divide-[#D3D1C7]">
              {swotData.weaknesses?.map((item: any, i: number) => (
                <div key={i} className={`px-4 py-4 text-[12px] font-poppins ${i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
                  <div className="font-bold text-[#1F2937] mb-1.5 uppercase tracking-wide">W{i + 1}: {item.headline}</div>
                  <div className="text-[#4B5563] leading-relaxed font-medium">{item.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 border border-[#D3D1C7] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D3D1C7]">
          {/* OPPORTUNITIES */}
          <div className="bg-white">
            <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-bold uppercase tracking-widest text-center font-poppins border-b border-[#D3D1C7]">
              OPPORTUNITIES
            </div>
            <div className="divide-y divide-[#D3D1C7]">
              {swotData.opportunities?.map((item: any, i: number) => (
                <div key={i} className={`px-4 py-4 text-[12px] font-poppins ${i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
                  <div className="font-bold text-[#1F2937] mb-1.5 uppercase tracking-wide">O{i + 1}: {item.headline}</div>
                  <div className="text-[#4B5563] leading-relaxed font-medium">{item.explanation}</div>
                </div>
              ))}
            </div>
          </div>
          {/* THREATS */}
          <div className="bg-white">
            <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-bold uppercase tracking-widest text-center font-poppins border-b border-[#D3D1C7]">
              THREATS
            </div>
            <div className="divide-y divide-[#D3D1C7]">
              {swotData.threats?.map((item: any, i: number) => (
                <div key={i} className={`px-4 py-4 text-[12px] font-poppins ${i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
                  <div className="font-bold text-[#1F2937] mb-1.5 uppercase tracking-wide">T{i + 1}: {item.headline}</div>
                  <div className="text-[#4B5563] leading-relaxed font-medium">{item.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {productData.excelLikeSwot ? (
        <div className="bg-transparent p-3">
          <div className="w-full rounded-md border border-[#C4B89D] bg-white">
            <div className="px-4 pt-4 pb-6">
              <div
                className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]"
              >
                <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">{isCpManagement ? `${productData.name} — SWOT Analysis` : `${productData.name} - SWOT Analysis`}</h2>
              </div>

              {productData.extendedContent?.detailedSWOT ? (
                isProcurement ? (
                  <div className="mt-4 space-y-5">
                    {procurementSections.map((section) => (
                      <div
                        key={section.title}
                        className="border border-[#D3D1C7] bg-white"
                      >
                        <div className="bg-[#DA7756] text-white px-4 py-3 text-[13px] font-semibold uppercase tracking-wide">
                          {section.title}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-[1120px] border-collapse font-poppins text-[12px] leading-relaxed">
                            <colgroup>
                              <col className="w-[64px]" />
                              <col className="w-[280px]" />
                              <col />
                            </colgroup>
                            <thead>
                              <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold uppercase">
                                <th className="border border-[#D3D1C7] px-3 py-2 text-center">
                                  #
                                </th>
                                <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                                  {section.label}
                                </th>
                                <th className="border border-[#D3D1C7] px-3 py-2 text-left">
                                  Explanation
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.rows.map((item, i) => (
                                <tr
                                  key={`${section.title}-${i}`}
                                  className={`align-top ${
                                    i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"
                                  }`}
                                >
                                  <td className="border border-[#E5E7EB] px-3 py-2 text-center font-semibold text-[#DA7756]">
                                    {i + 1}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-[#2C2C2C]">
                                    {item.headline}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium">
                                    {item.explanation}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isCpManagement ? (
                  <div className="mt-3 space-y-0">
                    <div className="bg-white text-center text-[11px] px-4 py-2 border border-[#E5E7EB] text-[#2C2C2C]/60 font-medium font-poppins italic">
                      Grounded in product features, market context, and competitor landscape. Not generic.
                    </div>
                    {/* STRENGTHS | WEAKNESSES */}
                    <div className="border border-[#D3D1C7] mt-3 grid grid-cols-2 divide-x divide-[#D3D1C7]">
                      <div>
                        <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-2.5 text-[13px] font-bold uppercase tracking-widest text-center">
                          STRENGTHS
                        </div>
                        <div className="divide-y divide-[#E5E7EB]">
                          {productData.extendedContent.detailedSWOT.strengths.map((item, i) => (
                            <div key={i} className={`px-4 py-3 text-[12px] font-poppins ${i % 2 === 0 ? 'bg-white' : 'bg-[#F0F5EC]'}`}>
                              <div className="font-semibold text-[#2C2C2C] mb-1">S{i + 1}&nbsp;&nbsp;{item.headline}</div>
                              <div className="text-[#2C2C2C]/70 leading-relaxed font-medium">{item.explanation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-2.5 text-[13px] font-bold uppercase tracking-widest text-center">
                          WEAKNESSES
                        </div>
                        <div className="divide-y divide-[#E5E7EB]">
                          {productData.extendedContent.detailedSWOT.weaknesses.map((item, i) => (
                            <div key={i} className={`px-4 py-3 text-[12px] font-poppins ${i % 2 === 0 ? 'bg-white' : 'bg-[#F6F4EE]'}`}>
                              <div className="font-semibold text-[#2C2C2C] mb-1">W{i + 1}&nbsp;&nbsp;{item.headline}</div>
                              <div className="text-[#2C2C2C]/70 leading-relaxed font-medium">{item.explanation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* OPPORTUNITIES | THREATS */}
                    <div className="border border-[#D3D1C7] mt-6 grid grid-cols-2 divide-x divide-[#D3D1C7]">
                      <div>
                        <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-2.5 text-[13px] font-bold uppercase tracking-widest text-center">
                          OPPORTUNITIES
                        </div>
                        <div className="divide-y divide-[#E5E7EB]">
                          {productData.extendedContent.detailedSWOT.opportunities.map((item, i) => (
                            <div key={i} className={`px-4 py-3 text-[12px] font-poppins ${i % 2 === 0 ? 'bg-white' : 'bg-[#F6F4EE]'}`}>
                              <div className="font-semibold text-[#2C2C2C] mb-1">O{i + 1}&nbsp;&nbsp;{item.headline}</div>
                              <div className="text-[#2C2C2C]/70 leading-relaxed font-medium">{item.explanation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-2.5 text-[13px] font-bold uppercase tracking-widest text-center">
                          THREATS
                        </div>
                        <div className="divide-y divide-[#E5E7EB]">
                          {productData.extendedContent.detailedSWOT.threats.map((item, i) => (
                            <div key={i} className={`px-4 py-3 text-[12px] font-poppins ${i % 2 === 0 ? 'bg-white' : 'bg-[#FEF2F2]'}`}>
                              <div className="font-semibold text-[#2C2C2C] mb-1">T{i + 1}&nbsp;&nbsp;{item.headline}</div>
                              <div className="text-[#2C2C2C]/70 leading-relaxed font-medium">{item.explanation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div className="bg-white border border-[#E5E7EB]">
                      <table className="w-full table-fixed border-collapse font-poppins text-[12px] leading-[1.55]">
                        <thead>
                          <tr className="bg-white text-[#DA7756] border-b border-[#D3D1C7]">
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
                          <tr className="bg-white text-[#DA7756] border-b border-[#D3D1C7] font-semibold uppercase">
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
                                <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756]">
                                  {s ? `S${i + 1}` : ""}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-[#DA7756] break-words">
                                  {s?.headline ?? ""}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {s?.explanation ?? ""}
                                </td>
                                <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756]">
                                  {w ? `W${i + 1}` : ""}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-[#DA7756] break-words">
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
                          <tr className="bg-white text-[#DA7756] border-b border-[#D3D1C7] font-semibold uppercase">
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
                                <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756]">
                                  {o ? `O${i + 1}` : ""}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-[#DA7756] break-words">
                                  {o?.headline ?? ""}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {o?.explanation ?? ""}
                                </td>
                                <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756]">
                                  {t ? `T${i + 1}` : ""}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-2 font-semibold text-[#DA7756] break-words">
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
                )
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
          <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center ">
            <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
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
                  <div className="text-center font-semibold text-[#DA7756] p-3 text-lg tracking-widest border-b border-[#E5E7EB] uppercase font-poppins">
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
