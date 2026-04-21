import React from "react";

interface RoadmapInitiative {
    initiative: string;
    feature: string;
    segment: string;
    impact: string;
    timeline: string;
    owner: string;
    priority: string;
}

interface RoadmapPhase {
    title: string;
    summary: string;
    initiatives: RoadmapInitiative[];
}

interface RoadmapData {
    phases: RoadmapPhase[];
}

interface FMMatrixRoadmapTabProps {
    roadmapData: RoadmapData;
    productName?: string;
}

const FMMatrixRoadmapTab: React.FC<FMMatrixRoadmapTabProps> = ({
    roadmapData,
    productName = "FM Matrix",
}) => {
    const phases = roadmapData.phases || [];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
                <h2 className="text-xl font-semibold font-poppins">
                    {productName.toUpperCase()} - Product Roadmap
                </h2>
            </div>
            <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
                3 phases | 22 initiatives | Strategic focus: immediate deal-blockers,
                market expansion, and competitive moat building
            </p>

            {phases.map((phase, phaseIdx) => (
                <div key={phaseIdx} className="space-y-4">
                    <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
                        {phase.title}
                    </div>
                    <div className="bg-[#d9e1f2] border border-[#b8cce4] p-3 text-[11px] text-[#2C2C2C] font-medium leading-relaxed font-poppins italic">
                        {phase.summary}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-[11px] font-poppins">
                            <thead>
                                <tr className="bg-[#4f81bd] text-white font-semibold">
                                    <th className="border border-[#b8cce4] p-2 text-center">
                                        Initiative
                                    </th>
                                    <th className="border border-[#b8cce4] p-2 text-center">
                                        What It Is
                                    </th>
                                    <th className="border border-[#b8cce4] p-2 text-center">
                                        Customer Segment Unlocked
                                    </th>
                                    <th className="border border-[#b8cce4] p-2 text-center">
                                        Effort
                                    </th>
                                    <th className="border border-[#b8cce4] p-2 text-center">
                                        Owner
                                    </th>
                                    <th className="border border-[#b8cce4] p-2 text-center">
                                        Priority
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {phase.initiatives.map((init, i) => (
                                    <tr
                                        key={i}
                                        className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                                    >
                                        <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                                            {init.initiative}
                                        </td>
                                        <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                                            {init.feature}
                                        </td>
                                        <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                                            {init.segment}
                                        </td>
                                        <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                                            {init.impact}
                                        </td>
                                        <td className="border border-[#b8cce4] p-2 text-center text-[#2C2C2C]/80 text-[10px]">
                                            {init.owner}
                                        </td>
                                        <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#DA7756]">
                                            {init.priority}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FMMatrixRoadmapTab;
