import React from "react";
import { ProductData } from "../types";

interface GTMTabProps {
  productData: ProductData;
}

const GTMTab: React.FC<GTMTabProps> = ({ productData }) => {
  return (
    <>
      {productData.excelLikeGtm ? (
        <div className="bg-transparent p-3">
          <div
            className="w-full rounded-md border border-[#C4B89D] bg-white"
          >
            <div className="px-4 pt-4 pb-6">
              <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 font-bold font-poppins uppercase tracking-tight text-[14px] text-center">
                {productData.extendedContent?.detailedGTM?.sheet?.title ||
                  "Post Possession — Go-to-market Strategy"}
              </div>

              {productData.extendedContent?.detailedGTM?.sheet
                ?.targetGroups?.length ? (
                <div className="mt-3">
                  {/* Sheet tables */}
                  <div className="w-full space-y-4">
                    {productData.extendedContent.detailedGTM.sheet.targetGroups.map(
                      (tg, tgIdx) => (
                        <div key={tgIdx} className="space-y-3">
                          <div className="bg-white text-gray-800 border-b border-[#D3D1C7] px-4 py-2 text-[13px] font-bold uppercase tracking-wide font-poppins">
                            {tg.title}
                          </div>

                          {tg.sections.map((sec, sIdx) => (
                            <div
                              key={sIdx}
                              className="bg-white border border-[#E5E7EB]"
                            >
                              {sec.columns.length === 0 && sec.rows.length === 0 ? (
                                <div className="px-4 py-2 text-[11px] font-medium text-gray-700 font-poppins italic leading-[1.5] break-words">
                                  {sec.title}
                                </div>
                              ) : (
                              <>
                              <div className="border-b border-[#E5E7EB] bg-white px-3 py-2 text-[11px] font-bold uppercase text-gray-700 font-poppins">
                                {sec.title}
                              </div>
                              <table className="w-full table-fixed border-collapse text-[11px] leading-[1.5] font-poppins">
                                <thead>
                                  {sec.columns.some(c => c !== "") && (
                                  <tr className="bg-white text-[#2C2C2C] font-semibold uppercase border-b border-[#D3D1C7]">
                                    {sec.columns.map((c, i) => (
                                      <th
                                        key={i}
                                        className={`border border-[#E5E7EB] px-3 py-2 text-left ${i === 0 ? "w-[16%]" : "w-[28%]"}`}
                                      >
                                        {c}
                                      </th>
                                    ))}
                                  </tr>
                                  )}
                                </thead>
                                <tbody>
                                  {sec.rows.map((row, rIdx) => (
                                    <tr
                                      key={rIdx}
                                      className={`align-top ${rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                    >
                                      {row.map((cell, cIdx) => (
                                        <td
                                          key={cIdx}
                                          className={`border border-[#E5E7EB] px-3 py-2 text-[#2C2C2C] font-medium break-words whitespace-pre-line align-top ${cIdx === 0 ? "font-semibold" : ""}`}
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              </>
                              )}
                            </div>
                          ))}

                          {(tg.summary || tg.keyAssumptions) && (
                            <div className="bg-white border border-[#E5E7EB]">
                              <div className="px-3 py-2 text-[11px] font-bold uppercase font-poppins">
                                TG Summary
                              </div>
                              <div className="p-3 text-[11px] text-[#2C2C2C] font-medium whitespace-pre-line font-poppins leading-[1.5]">
                                {tg.summary
                                  ? `SUMMARY:\n${tg.summary}\n\n`
                                  : ""}
                                {tg.keyAssumptions
                                  ? `KEY ASSUMPTIONS:\n${tg.keyAssumptions}`
                                  : ""}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>


                </div>
              ) : (
                <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                  GTM Strategy Data Coming Soon
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 rounded-t-xl mb-0 flex justify-between items-center">
            <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
              {productData.name} - GTM Strategy
            </h2>
          </div>
          {productData.extendedContent?.detailedGTM && (
            <div className="space-y-8">
              {productData.extendedContent?.detailedGTM?.targetGroups?.map(
                (group, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="px-4 py-2 font-semibold font-poppins text-sm uppercase italic">
                      {group.title}
                    </div>
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                      <table className="w-full border-collapse text-[10px] bg-white text-center font-poppins">
                        <thead>
                          <tr className="font-semibold uppercase">
                            <th className="border border-[#C4B89D] p-3 w-[25%]">
                              Component
                            </th>
                            <th className="border border-[#C4B89D] p-3 text-left">
                              Strategy/Detail
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.components.map((comp, cIdx) => (
                            <tr
                              key={cIdx}
                              className=""
                            >
                              <td className="border border-[#C4B89D] p-3 font-semibold text-gray-700 uppercase bg-white">
                                {comp.component}
                              </td>
                              <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed italic text-left">
                                {comp.detail}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-white text-gray-800 p-3 text-[10px] font-semibold font-poppins uppercase tracking-tight rounded-b-xl border border-[#D3D1C7] ">
                      <span className="text-yellow-400">SUMMARY:</span>{" "}
                      {group.summaryBox}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {!productData.extendedContent?.detailedGTM && (
            <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
              GTM Strategy Data Coming Soon
            </div>
          )}
        </>
      )}
    </>
  );
};

export default GTMTab;
