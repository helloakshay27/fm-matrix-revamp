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

  if (productData.excelLikeBusinessPlan && hasColoredQuestions) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-transparent p-2">
          <div className="w-full bg-transparent">
            <div
              className={`bg-white text-[#2C2C2C] border border-[#D3D1C7] px-4 py-3 uppercase font-poppins ${isCpManagement ? "text-sm font-semibold tracking-wide text-left" : "text-[14px] font-bold tracking-wide"}`}
            >
              {productData.name} - Business Plan
            </div>
            <div className="bg-[#F6F4EE] border border-[#D3D1C7] px-4 py-2 text-sm text-gray-600 font-medium italic font-poppins">
              {hasFounderVoice
                ? "Written in the first person by the founder. Specific, direct answers aligned to the current business plan."
                : "10 investor/partner questions with suggested answers. Flagged items require founder review before external use."}
            </div>

            <div className="mt-3 space-y-4">
              {bpData!.planQuestions.map((q, i) => {
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
                          : "bg-[#1F4E79] text-white";
                return (
                  <div key={i} className="border border-[#D3D1C7] bg-white">
                    <div className={`${headerTone} border-b border-[#D3D1C7] px-4 py-3 text-sm font-semibold tracking-wide font-poppins`}>
                      {q.id}. {q.question}
                    </div>
                    <table className="w-full border-collapse table-fixed text-[10px] leading-[1.5] font-poppins">
                      <thead>
                        <tr className="bg-[#F6F4EE] text-gray-800 font-semibold uppercase text-[9px]">
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
                          <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-semibold whitespace-pre-line break-words">
                            {q.flag}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            {bpData!.founderChecklist &&
              bpData!.founderChecklist.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="bg-white text-[#2C2C2C] border border-[#D3D1C7] px-4 py-3 text-sm font-semibold uppercase tracking-wide font-poppins">
                    Founder Review Checklist - Items requiring personal input
                    before investor/partner use
                  </div>
                  <div className="border border-[#D3D1C7] bg-white">
                    <table className="w-full border-collapse table-fixed text-[10px] leading-[1.5] font-poppins">
                      <thead>
                        <tr className="bg-[#F6F4EE] text-gray-800 font-semibold uppercase text-[9px]">
                          <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[14%]">
                            Q#
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[66%]">
                            What to Verify / Add
                          </th>
                          <th className="border border-[#D3D1C7] px-3 py-2 text-left w-[20%]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bpData!.founderChecklist.map((fc, i) => (
                          <tr
                            key={i}
                            className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                          >
                            <td className="border border-[#D3D1C7] px-3 py-2 font-semibold text-gray-800 whitespace-pre-line break-words">
                              {fc.id}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                              {fc.verify}
                            </td>
                            <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                              {fc.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
              <div className="bg-white text-gray-800 px-4 py-2 font-semibold font-poppins uppercase tracking-tight text-[11px] text-center border border-[#D3D1C7]">
                Post Possession — Business Plan Builder (Pre-filled)
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
                            <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-gray-700 whitespace-pre-line break-words">
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
      <div className="bg-white text-[#2C2C2C] border border-[#D3D1C7] p-4 mb-0 flex justify-between items-center">
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
