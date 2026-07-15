import React from "react";
import { ProductData } from "../types";

interface BusinessPlanTabProps {
  productData: ProductData;
}

const BusinessPlanTab: React.FC<BusinessPlanTabProps> = ({ productData }) => {
  const bpData = productData.extendedContent?.detailedBusinessPlan;
  const isCpManagement = productData.name === "CP Management";
  const hasColoredQuestions = bpData?.planQuestions?.some(
    (q) => q.colorContext
  );
  const hasFounderVoice = bpData?.planQuestions?.some(
    (q) => q.source?.toLowerCase().includes("founder")
  );

  const isClubBusinessPlan = !!bpData?.isClubBusinessPlan;

  if (isClubBusinessPlan) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
          <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">{productData.name} - Business Plan Builder</h2>
        </div>
        <div className="bg-[#F6F4EE] border border-[#D3D1C7] border-t-0 px-4 py-2 text-sm text-gray-600 font-medium italic font-poppins">
          10 Investor / Partner Questions | Each with suggested first-person answer, data source, and founder review flag
        </div>

        <div className="mt-6 space-y-6">
          {bpData.planQuestions?.map((q: any, i: number) => (
            <div key={i} className="border border-[#D3D1C7] bg-white">
              <div className="bg-[#DA7756] text-white border-b border-[#D3D1C7] px-4 py-3 text-[13px] font-bold tracking-wide font-poppins">
                {q.question}
              </div>
              <table className="w-full border-collapse table-fixed text-[11px] leading-relaxed font-poppins">
                <thead>
                  <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[10px]">
                    <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[60%]">
                      Suggested Answer
                    </th>
                    <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[20%]">
                      Source Tab
                    </th>
                    <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[20%]">
                      Founder Review Flag
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-top bg-white">
                    <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                      {q.answer}
                    </td>
                    <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                      {q.source || "-"}
                    </td>
                    <td className="border border-[#D3D1C7] px-3 py-3 text-[#DA7756] font-semibold whitespace-pre-line break-words bg-[#DA7756]/5">
                      {q.flag}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}

          {bpData.checklist?.length > 0 && (
            <div className="mt-8 border border-[#D3D1C7] bg-white">
              <div className="bg-[#DA7756] text-white border-b border-[#D3D1C7] px-4 py-3 text-[13px] font-bold tracking-wide font-poppins text-center">
                FOUNDER REVIEW CHECKLIST - Items requiring personal input before investor or partner use
              </div>
              <table className="w-full border-collapse text-[11px] leading-relaxed font-poppins">
                <thead>
                  <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[10px]">
                    <th className="border border-[#D3D1C7] px-4 py-2 text-left w-[30%]">Question Reference</th>
                    <th className="border border-[#D3D1C7] px-4 py-2 text-left w-[70%]">What to verify or complete</th>
                  </tr>
                </thead>
                <tbody>
                  {bpData.checklist.map((item: any, idx: number) => (
                    <tr key={idx} className="align-top bg-white border-b border-[#D3D1C7]">
                      <td className="border-r border-[#D3D1C7] px-4 py-2 font-bold text-[#DA7756]">{item.reference}</td>
                      <td className="px-4 py-2 text-[#2C2C2C]">{item.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (productData.excelLikeBusinessPlan && hasColoredQuestions) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-transparent p-2">
          <div className="w-full bg-transparent">
            <div
              className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center"
            >
              <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">{productData.name} - Business Plan</h2>
            </div>
            <div className="bg-[#F6F4EE] border border-[#D3D1C7] px-4 py-2 text-sm text-gray-600 font-medium italic font-poppins">
              {hasFounderVoice
                ? "Written in the first person by the founder. Specific, direct answers aligned to the current business plan."
                : "10 investor/partner questions with suggested answers. Flagged items require founder review before external use."}
            </div>

            <div className="mt-3 space-y-8">
              {/* If we have perspectives (Lessee/Lessor), group them. Otherwise render flat list. */}
              {productData.name === "Lease Management" ? (
                ["Lessee", "Lessor"].map((perspective) => (
                  <div key={perspective} className="space-y-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest font-poppins">
                      {perspective} Perspective
                    </div>
                    {bpData!.planQuestions.filter(q => q.id?.includes(perspective)).map((q, i) => {
                      const headerTone = q.colorContext === "red" ? "bg-[#A52A1A] text-white" :
                        q.colorContext === "green" ? "bg-[#0F5B2A] text-white" :
                          q.colorContext === "yellow" ? "bg-[#B79000] text-white" :
                            q.colorContext === "orange" ? "bg-[#D97706] text-white" :
                              q.colorContext === "purple" ? "bg-[#6B2D84] text-white" :
                                q.colorContext === "teal" ? "bg-[#006B5E] text-white" : "bg-[#DA7756] text-white";
                      return (
                        <div key={i} className="border border-[#D3D1C7] bg-white">
                          <div className={`${headerTone} border-b border-[#D3D1C7] px-4 py-2.5 text-[13px] font-bold tracking-wide font-poppins`}>
                            {q.id}. {q.question}
                          </div>
                          <table className="w-full border-collapse table-fixed text-[10px] leading-[1.5] font-poppins">
                            <thead>
                              <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-semibold uppercase text-[9px]">
                                <th className="border border-[#D3D1C7] px-3 py-1.5 text-left w-[58%]">Suggested Answer</th>
                                <th className="border border-[#D3D1C7] px-3 py-1.5 text-left w-[22%]">Source Reference</th>
                                <th className="border border-[#D3D1C7] px-3 py-1.5 text-left w-[20%]">Review Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="align-top bg-white">
                                <td className="border border-[#D3D1C7] px-3 py-2.5 text-[#2C2C2C] font-medium whitespace-pre-line break-words leading-relaxed">{q.answer}</td>
                                <td className="border border-[#D3D1C7] px-3 py-2.5 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words italic">{q.source || "-"}</td>
                                <td className="border border-[#D3D1C7] px-3 py-2.5 text-[#DA7756] font-bold whitespace-pre-line break-words">{q.flag}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                bpData!.planQuestions.map((q, i) => {
                  const headerTone =
                    q.colorContext === "red"
                      ? "bg-[#A52A1A] text-white"
                      : q.colorContext === "green"
                        ? "bg-[#0F5B2A] text-white"
                        : q.colorContext === "yellow"
                          ? "bg-[#B79000] text-white"
                          : q.colorContext === "orange"
                            ? "bg-[#D97706] text-white"
                            : q.colorContext === "purple"
                              ? "bg-[#6B2D84] text-white"
                              : q.colorContext === "teal"
                                ? "bg-[#006B5E] text-white"
                                : "bg-[#DA7756] text-white";
                  return (
                    <div key={i} className="border border-[#D3D1C7] bg-white">
                      <div className={`${headerTone} border-b border-[#D3D1C7] px-4 py-3 text-sm font-semibold tracking-wide font-poppins`}>
                        {q.id}. {q.question}
                      </div>
                      <table className="w-full border-collapse table-fixed text-[10px] leading-[1.5] font-poppins">
                        <thead>
                          <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-semibold uppercase text-[9px]">
                            <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[58%]">
                              {hasFounderVoice ? "Founder's Answer" : "Suggested Answer"}
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[22%]">
                              Context / Prompt
                            </th>
                            <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[20%]">
                              Review Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="align-top bg-white">
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                              {q.answer}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                              {q.source || "-"}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#DA7756] font-semibold whitespace-pre-line break-words">
                              {q.flag}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })
              )}

              {/* Founder Review Checklist section */}
              {bpData?.founderChecklist && (
                <div className="mt-8 border border-[#D3D1C7] bg-white">
                  <div className="bg-[#DA7756] text-white border-b border-[#D3D1C7] px-4 py-3 text-[13px] font-bold tracking-wide font-poppins uppercase text-center">
                    Founder Review Checklist
                  </div>
                  <table className="w-full border-collapse text-[10px] font-poppins leading-relaxed">
                    <thead>
                      <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[9px]">
                        <th className="border border-[#D3D1C7] px-4 py-2 text-left w-[10%]">Ref</th>
                        <th className="border border-[#D3D1C7] px-4 py-2 text-left w-[40%]">Checklist Item</th>
                        <th className="border border-[#D3D1C7] px-4 py-2 text-left w-[40%]">Verification Required</th>
                        <th className="border border-[#D3D1C7] px-4 py-2 text-center w-[10%]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bpData.founderChecklist.map((item: any, idx: number) => (
                        <tr key={idx} className="align-top bg-white border-b border-[#D3D1C7] last:border-0 hover:bg-[#DA7756]/5">
                          <td className="border-r border-[#D3D1C7] px-4 py-2.5 font-bold text-[#DA7756]">{item.id}</td>
                          <td className="border-r border-[#D3D1C7] px-4 py-2.5 font-semibold text-[#2C2C2C]">{item.item}</td>
                          <td className="border-r border-[#D3D1C7] px-4 py-2.5 text-[#2C2C2C]/70 italic">{item.verify}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="inline-block px-1.5 py-0.5 bg-[#DA7756]/10 text-[#DA7756] border border-[#DA7756]/20 text-[8px] font-bold uppercase rounded-sm">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    );
  }

  if (productData.excelLikeBusinessPlan) {
    return (
      <div className="space-y-10">
        <div className="overflow-x-auto bg-white p-3">
          <div className="min-w-[1850px] rounded-md border border-[#C4B89D] bg-white">
            <div className="px-4 pt-4 pb-6">
              <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
                <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">Post Possession — Business Plan Builder (Pre-filled)</h2>
              </div>

              {bpData?.planQuestions?.length ? (
                <div className="mt-3">
                  <div className="bg-white border border-[#E5E7EB]">
                    <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                      <thead>
                        <tr className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] font-semibold uppercase">
                          <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[5%]">
                            #
                          </th>
                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[25%]">
                            Business plan question
                          </th>
                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[50%]">
                            Suggested answer
                          </th>
                          <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[20%]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bpData.planQuestions.map((q, i) => (
                          <tr
                            key={i}
                            className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                          >
                            <td className="border border-[#E5E7EB] px-1 py-1 text-center font-bold text-[#2C2C2C]/60">
                              {i + 1}
                            </td>
                            <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#DA7756] whitespace-pre-line break-words">
                              {q.question}
                            </td>
                            <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                              {q.answer}
                            </td>
                            <td className="border border-[#E5E7EB] px-1.5 py-1 text-center">
                              <span
                                className={`inline-block px-1.5 py-0.5 text-[8px] font-semibold uppercase border ${q.flag?.toLowerCase().includes("ready") ? "bg-green-50 text-green-800 border-green-200" : "bg-yellow-50 text-yellow-900 border-yellow-200"}`}
                              >
                                {q.flag}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                  Business Plan Data Coming Soon
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
        <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
          {productData.name} - Business Plan
        </h2>
      </div>
      {bpData ? (
        <div className="overflow-x-auto border border-[#E5E7EB]">
          <table className="w-full border-collapse text-[10px] bg-transparent font-poppins">
            <thead>
              <tr className="bg-white text-[#2C2C2C] border-b border-[#D3D1C7] font-semibold uppercase text-center">
                <th className="border border-[#E5E7EB] p-3 w-[25%] text-left">
                  Question
                </th>
                <th className="border border-[#E5E7EB] p-3 w-[60%] text-left">
                  Suggested Answer
                </th>
                <th className="border border-[#E5E7EB] p-3 w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {bpData.planQuestions?.map((q, i) => (
                <tr
                  key={i}
                  className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                >
                  <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C] font-semibold uppercase leading-tight">
                    {q.question}
                  </td>
                  <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                    {q.answer}
                  </td>
                  <td className="border border-[#E5E7EB] p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-sm font-semibold text-[8px] uppercase tracking-tighter block text-center ${q.flag.includes("Ready") ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-900"}`}
                    >
                      {q.flag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
          Business Plan Data Coming Soon
        </div>
      )}
    </div>
  );
};

export default BusinessPlanTab;
