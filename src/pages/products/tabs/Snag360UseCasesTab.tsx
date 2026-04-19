import React from "react";

interface IndustryUseCase {
  rank: number;
  industry: string;
  useCase: string;
  workflow: string;
  features: string;
  outcome: string;
}

interface InternalTeamUseCase {
  team: string;
  usage: string;
  problem: string;
  features: string;
  gain: string;
}

interface Snag360UseCasesTabProps {
  industryUseCases: IndustryUseCase[];
  internalTeamUseCases: InternalTeamUseCase[];
  productName?: string;
}

const Snag360UseCasesTab: React.FC<Snag360UseCasesTabProps> = ({
  industryUseCases,
  internalTeamUseCases,
  productName = "Snag 360",
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white text-gray-900 border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
        <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
          {productName} - Use Cases
        </h2>
      </div>

      {/* Title Section */}
      <div className="space-y-2">
        <div className="bg-[#1F3A5F] text-white border border-[#B8CCE4] px-4 py-3 text-[13pt] font-bold font-poppins">
          SNAG 360 - Use Cases by Industry and Internal Team
        </div>
        <div className="bg-[#D9E1F2] text-[#1A1A2E] border border-transparent px-4 py-2 text-[10pt] italic font-poppins">
          Part 1: Industry Use Cases (same 10 from Market Analysis) | Part 2:
          Internal Team Use Cases
        </div>
      </div>

      {/* Part 1: Industry Use Cases */}
      <div className="space-y-3">
        <div className="bg-[#1F3A5F] text-white border border-[#B8CCE4] px-4 py-3 text-[12pt] font-bold font-poppins">
          Part 1: Industry Use Cases
        </div>

        <div className="border border-[#B8CCE4] bg-white overflow-x-auto">
          <table className="w-full border-collapse text-[10pt] font-poppins min-w-[1200px]">
            <thead>
              <tr className="bg-[#4F81BD]">
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[5%]">
                  Rank
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[12%]">
                  Industry
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[15%]">
                  Specific Use Case
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[30%]">
                  Workflow (Step-by-Step)
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[18%]">
                  Features Used
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[20%]">
                  Key Outcome
                </th>
              </tr>
            </thead>
            <tbody>
              {industryUseCases.map((useCase, index) => (
                <tr
                  key={index}
                  className="align-top bg-white hover:bg-[#F6F4EE]"
                >
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E] text-center">
                    {useCase.rank}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E] font-bold">
                    {useCase.industry}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E]">
                    {useCase.useCase}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E] whitespace-pre-line">
                    {useCase.workflow}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E]">
                    {useCase.features}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E]">
                    {useCase.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Internal Team Use Cases */}
      <div className="space-y-3">
        <div className="bg-[#1F3A5F] text-white border border-[#B8CCE4] px-4 py-3 text-[12pt] font-bold font-poppins">
          Part 2: Use Cases by Internal Team
        </div>

        <div className="border border-[#B8CCE4] bg-white overflow-x-auto">
          <table className="w-full border-collapse text-[10pt] font-poppins min-w-[1000px]">
            <thead>
              <tr className="bg-[#4F81BD]">
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[12%]">
                  Team
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[25%]">
                  How They Use Snag 360
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[23%]">
                  Problem It Replaces
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[18%]">
                  Key Features Used
                </th>
                <th className="border border-[#B8CCE4] px-3 py-3 text-center text-white font-bold text-[11pt] w-[22%]">
                  Productivity Gain
                </th>
              </tr>
            </thead>
            <tbody>
              {internalTeamUseCases.map((teamCase, index) => (
                <tr
                  key={index}
                  className="align-top bg-white hover:bg-[#F6F4EE]"
                >
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E] font-bold">
                    {teamCase.team}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E]">
                    {teamCase.usage}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E]">
                    {teamCase.problem}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E]">
                    {teamCase.features}
                  </td>
                  <td className="border border-[#B8CCE4] px-3 py-2 text-[#1A1A2E]">
                    {teamCase.gain}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Snag360UseCasesTab;
