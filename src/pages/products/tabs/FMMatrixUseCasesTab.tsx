import React from "react";

interface IndustryUseCase {
    rank: number;
    industry: string;
    features: string;
    workflow: string;
    profileNeeded: string;
    currentTool: string;
    urgency: string;
    buyer: string;
    endUser: string;
}

interface InternalTeamUseCase {
    team: string;
    features: string;
    usage: string;
    benefit: string;
    frequency: string;
}

interface FMMatrixUseCasesTabProps {
    industryUseCases: IndustryUseCase[];
    internalTeamUseCases: InternalTeamUseCase[];
    productName?: string;
}

const FMMatrixUseCasesTab: React.FC<FMMatrixUseCasesTabProps> = ({
    industryUseCases,
    internalTeamUseCases,
    productName = "FM Matrix",
}) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
                <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
                    {productName} - Use Cases
                </h2>
            </div>

            {/* Title Section */}
            <div className="space-y-2">
                <div className="bg-[#1F3A5F] text-white border border-[#B8CCE4] px-4 py-3 text-[13pt] font-bold font-poppins">
                    FM MATRIX - Use Cases by Industry and Internal Team
                </div>
                <div className="bg-[#D9E1F2] text-[#1A1A2E] border border-transparent px-4 py-2 text-[10pt] italic font-poppins">
                    Part 1: Industry Use Cases (10 Most Relevant Industries) | Part 2:
                    Internal Team Use Cases
                </div>
            </div>

            {/* Part 1: Industry Use Cases */}
            <div className="space-y-3">
                <div className="bg-[#1F3A5F] text-white border border-[#B8CCE4] px-4 py-3 text-[12pt] font-bold font-poppins">
                    Part 1: Industry Use Cases (10 Most Relevant Industries Ranked by Relevance)
                </div>

                <div className="border border-[#B8CCE4] bg-white overflow-x-auto">
                    <table className="w-full border-collapse text-[9pt] font-poppins min-w-[1400px]">
                        <thead>
                            <tr className="bg-[#4F81BD]">
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[3%]">
                                    Rank
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[13%]">
                                    Industry
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[15%]">
                                    Relevant Features & Teams
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[20%]">
                                    How They Use It
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[14%]">
                                    Ideal Company Profile
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[10%]">
                                    Current Tool
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[8%]">
                                    Urgency
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[10%]">
                                    Primary Buyer
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[15%]">
                                    Primary User Frustration
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {industryUseCases.map((useCase, index) => (
                                <tr
                                    key={index}
                                    className="align-top bg-white hover:bg-[#F6F4EE]"
                                >
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] text-center font-semibold">
                                        {useCase.rank}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] font-bold">
                                        {useCase.industry}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {useCase.features}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {useCase.workflow}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {useCase.profileNeeded}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {useCase.currentTool}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] text-center">
                                        {useCase.urgency}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {useCase.buyer}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {useCase.endUser}
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
                    Part 2: How Each Team Uses FM Matrix Daily
                </div>

                <div className="border border-[#B8CCE4] bg-white overflow-x-auto">
                    <table className="w-full border-collapse text-[9pt] font-poppins min-w-[1200px]">
                        <thead>
                            <tr className="bg-[#4F81BD]">
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[15%]">
                                    Team Name
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[15%]">
                                    Relevant Features & Processes
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[23%]">
                                    How They Use It Day-to-Day
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[22%]">
                                    Primary Benefit
                                </th>
                                <th className="border border-[#B8CCE4] px-2 py-2 text-center text-white font-bold text-[10pt] w-[15%]">
                                    Frequency of Use
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {internalTeamUseCases.map((teamCase, index) => (
                                <tr
                                    key={index}
                                    className="align-top bg-white hover:bg-[#F6F4EE]"
                                >
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] font-bold">
                                        {teamCase.team}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {teamCase.features}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {teamCase.usage}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] whitespace-normal">
                                        {teamCase.benefit}
                                    </td>
                                    <td className="border border-[#B8CCE4] px-2 py-2 text-[#1A1A2E] text-center">
                                        {teamCase.frequency}
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

export default FMMatrixUseCasesTab;
