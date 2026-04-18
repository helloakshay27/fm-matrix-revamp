import React from "react";
import { ProductData } from "../types";

interface UseCasesTabProps {
  productData: ProductData;
}

const UseCasesTab: React.FC<UseCasesTabProps> = ({ productData }) => {
  const detailedUseCases = productData.extendedContent?.detailedUseCases;
  const hasDetailedIndustryLayout =
    detailedUseCases?.industryUseCases?.some(
      (item) => item.corePainPoint || item.workflow || item.outcome
    ) ?? false;
  const hasDetailedInternalLayout =
    detailedUseCases?.internalTeamUseCases?.some(
      (item) => item.howTheyUse || item.process || item.features || item.benefit
    ) ?? false;
  const hasCpIndustrySheet =
    detailedUseCases?.industryUseCases?.some(
      (item) => item.companyProfile || item.currentTool
    ) ?? false;
  const hasCpInternalSheet =
    detailedUseCases?.internalTeamUseCases?.some(
      (item) => item.relevantFeatures || item.frequency
    ) ?? false;

  return (
    <>
            <div className="bg-white text-gray-900 border border-[#D3D1C7] p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
                {productData.name} - Use Cases
              </h2>
            </div>
            {detailedUseCases && (
              <div className="space-y-8">
                {hasCpIndustrySheet ? (
                  <div className="space-y-4">
                    <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-[16px] font-semibold uppercase tracking-wide font-poppins text-center">
                      {productData.name} - Use Cases
                    </div>
                    <div className="bg-white border border-[#D3D1C7] px-4 py-2 text-[12px] text-gray-600 font-medium italic font-poppins text-center">
                      Part A: 10 most relevant industries ranked by relevance | Part B: Internal teams
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-[13px] font-semibold uppercase tracking-wide font-poppins">
                        Part A - Industry Level Use Cases (Ranked: Most to Least Relevant)
                      </div>
                      <div className="border border-[#D3D1C7] bg-white">
                        <table className="w-full table-fixed border-collapse text-[12px] leading-[1.55] font-poppins">
                          <thead>
                            <tr className="bg-gray-100 text-gray-800 font-semibold uppercase">
                              <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[18%]">Industry (Ranked)</th>
                              <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[20%]">Relevant Features & Teams</th>
                              <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[25%]">How They Use It</th>
                              <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[22%]">Ideal Company Profile</th>
                              <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[15%]">Current Tool Used</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailedUseCases?.industryUseCases?.map((u, i) => (
                              <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                <td className="border border-[#E5E7EB] px-3 py-3 font-semibold text-gray-800 whitespace-pre-line break-words">
                                  {u.rank}. {u.industry}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {u.features}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {u.useCase}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {u.companyProfile || u.profile}
                                </td>
                                <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {u.currentTool}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {hasCpInternalSheet && (
                      <div className="space-y-3">
                        <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-[13px] font-semibold uppercase tracking-wide font-poppins">
                          Part B - Internal Teams: How Each Team Uses {productData.name} in Daily Work
                        </div>
                        <div className="border border-[#D3D1C7] bg-white">
                          <table className="w-full table-fixed border-collapse text-[12px] leading-[1.55] font-poppins">
                            <thead>
                              <tr className="bg-gray-100 text-gray-800 font-semibold uppercase">
                                <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[16%]">Team Name</th>
                                <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[20%]">Relevant Features & Processes</th>
                                <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[28%]">How They Use It Day-to-Day</th>
                                <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[26%]">Primary Benefit to This Team</th>
                                <th className="border border-[#E5E7EB] px-3 py-3 text-left w-[10%]">Frequency of Use</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailedUseCases?.internalTeamUseCases?.map((t, i) => (
                                <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                  <td className="border border-[#E5E7EB] px-3 py-3 font-semibold text-gray-800 whitespace-pre-line break-words">
                                    {t.team}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                    {t.relevantFeatures || t.features}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                    {t.howTheyUse || t.process}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                    {t.benefit}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                    {t.frequency}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : hasDetailedIndustryLayout ? (
                  <div className="space-y-4">
                    <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-sm font-semibold uppercase tracking-wide font-poppins">
                      {productData.name} - Use Cases by Industry and Internal Team
                    </div>
                    <div className="bg-gray-50 border border-[#D3D1C7] px-4 py-2 text-sm text-gray-600 font-medium italic font-poppins">
                      10 industries from Market Analysis + key internal team use cases
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-sm font-semibold uppercase tracking-wide font-poppins">
                        Part 1 - Industry Use Cases
                      </div>
                      <div className="border border-[#D3D1C7] bg-white">
                        <table className="w-full border-collapse table-fixed text-[10px] leading-[1.45] font-poppins">
                          <thead>
                            <tr className="bg-[#5E88BD] text-white font-semibold">
                              <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[9%]">Industry</th>
                              <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[8%]">Primary User</th>
                              <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[18%]">Core Pain Point</th>
                              <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[16%]">VMS Features Used</th>
                              <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[32%]">Workflow Step-by-Step</th>
                              <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[17%]">Business Outcome</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailedUseCases.industryUseCases?.map((u, i) => (
                              <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                <td className="border border-[#D3D1C7] px-3 py-2 font-semibold text-gray-800 whitespace-pre-line break-words">
                                  {u.industry}
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-gray-700 font-medium whitespace-pre-line break-words">
                                  {u.primaryUser}
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {u.corePainPoint || u.useCase}
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {u.features}
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/85 font-medium whitespace-pre-line break-words">
                                  {u.workflow || u.useCase}
                                </td>
                                <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                  {u.outcome}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {hasDetailedInternalLayout && (
                      <div className="space-y-3">
                        <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-sm font-semibold uppercase tracking-wide font-poppins">
                          Part 2 - Internal Team Use Cases
                        </div>
                        <div className="border border-[#D3D1C7] bg-white">
                          <table className="w-full border-collapse table-fixed text-[10px] leading-[1.45] font-poppins">
                            <thead>
                              <tr className="bg-[#5E88BD] text-white font-semibold">
                                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[12%]">Internal Team</th>
                                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[24%]">How They Use VMS</th>
                                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[24%]">Key Features</th>
                                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[40%]">Benefit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailedUseCases.internalTeamUseCases?.map((t, i) => (
                                <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                  <td className="border border-[#D3D1C7] px-3 py-2 font-semibold text-gray-800 whitespace-pre-line break-words">
                                    {t.team}
                                  </td>
                                  <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                    {t.howTheyUse || t.process}
                                  </td>
                                  <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C]/85 font-medium whitespace-pre-line break-words">
                                    {t.features}
                                  </td>
                                  <td className="border border-[#D3D1C7] px-3 py-2 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                    {t.benefit}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : productData.excelLikeUseCases ? (
                  <div
                    className="overflow-x-auto border border-[#D3D1C7] bg-transparent p-2"
                    style={{}}
                  >
                    <div className="min-w-[1700px] bg-transparent">
                      {/* Section Header */}
                      <div className="bg-white text-gray-800 border border-[#D3D1C7] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                        {productData.name} - Use Cases
                      </div>
                      <div className="bg-transparent border-x border-[#D3D1C7] px-3 py-1 text-[10px] text-gray-600 font-medium italic font-poppins">
                        Part 1: Industry-level use cases &nbsp;&nbsp;|&nbsp;&nbsp; Part 2: Internal team-level use cases
                      </div>

                      <div className="mt-2 space-y-4">
                        {/* PART 1 Header */}
                        <div className="bg-white text-gray-800 border border-[#D3D1C7] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                          Part 1 — Industry-Level Use Cases (Ranked by relevance)
                        </div>

                        <div className="bg-transparent border border-[#E5E7EB]">
                          <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                            <thead>
                              <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                                <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[3%]">
                                  #
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[10%]">
                                  Industry
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                                  Relevant features, processes and teams
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[17%]">
                                  Ideal Company Profile & current tool they use
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[15%]">
                                  Urgency
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[15%]">
                                  Primary Buyer (what they're measured on)
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                  Primary User (daily frustration)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailedUseCases.industryUseCases?.map(
                                (u, i) => (
                                  <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                    <td className="border border-[#E5E7EB] px-1 py-1 text-center font-bold text-[#2C2C2C]/60">
                                      {u.rank}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-gray-700 whitespace-pre-line break-words">
                                      {u.industry}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {u.features}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                                      {u.profile}{u.currentTool ? `\nCurrently using: ${u.currentTool}` : ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold whitespace-pre-line break-words">
                                      <span className={`${u.urgency?.startsWith("HIGH") ? "text-[#C72030]" : u.urgency?.startsWith("MEDIUM") ? "text-[#D97706]" : "text-[#2C2C2C]/70"}`}>
                                        {u.urgency}
                                      </span>
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {u.primaryBuyer}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                                      {u.primaryUser}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* PART 2 Header */}
                        <div className="bg-white text-gray-800 border border-[#D3D1C7] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                          Part 2 — Internal Team-Level Use Cases
                        </div>

                        <div className="bg-transparent border border-[#E5E7EB]">
                          <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                            <thead>
                              <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[12%]">
                                  Team
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[40%]">
                                  Relevant features they use and processes they run
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                                  Specific modules used
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[26%]">
                                  Key benefit for this team
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailedUseCases.internalTeamUseCases?.map(
                                (t, i) => (
                                  <tr key={i} className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-gray-700 uppercase whitespace-pre-line break-words">
                                      {t.team}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {t.features}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                                      {t.modules}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {t.benefit}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="px-4 py-2 font-semibold font-poppins text-sm uppercase italic">
                        PART A — INDUSTRY LEVEL USE CASES (Ranked)
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                        <table className="w-full border-collapse text-[10px] bg-transparent text-left font-poppins">
                          <thead>
                            <tr className="font-semibold uppercase">
                              <th className="border border-[#C4B89D] p-3 w-[15%]">
                                Industry (Ranked)
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%]">
                                Relevant Features & Teams
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[30%]">
                                How They Use It
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%]">
                                Ideal Company Profile
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[15%]">
                                Current Tool Used
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailedUseCases.industryUseCases?.map(
                              (u, i) => (
                                <tr
                                  key={i}
                                  className=""
                                >
                                  <td className="border border-[#C4B89D] p-3 font-semibold text-gray-700">
                                    {u.rank}. {u.industry}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                    {u.features}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] leading-relaxed">
                                    {u.useCase}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/70 font-medium italic">
                                    {u.profile}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/60 font-medium">
                                    {u.currentTool}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="px-4 py-2 font-semibold font-poppins text-sm uppercase italic">
                        PART B — INTERNAL TEAMS: HOW EACH TEAM USES IT
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                        <table className="w-full border-collapse text-[10px] bg-transparent text-left font-poppins">
                          <thead>
                            <tr className="font-semibold uppercase">
                              <th className="border border-[#C4B89D] p-3 w-[15%]">
                                Team Name
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%]">
                                Relevant Features & Processes
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[35%]">
                                How They Use It Day-to-Day
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%]">
                                Primary Benefit to This Team
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[10%]">
                                Frequency of Use
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailedUseCases.internalTeamUseCases?.map(
                              (t, i) => (
                                <tr
                                  key={i}
                                  className=""
                                >
                                  <td className="border border-[#C4B89D] p-3 font-semibold text-gray-700 uppercase">
                                    {t.team}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                    {t.features}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] leading-relaxed">
                                    {t.process}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/70 font-medium italic">
                                    {t.benefit}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/60 font-bold text-center">
                                    {t.frequency}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {!detailedUseCases && (
              <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                Use Cases Data Coming Soon
              </div>
            )}
    </>
  );
};

export default UseCasesTab;
