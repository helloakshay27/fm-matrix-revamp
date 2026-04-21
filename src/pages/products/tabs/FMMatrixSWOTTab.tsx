import React from "react";

interface SWOTItem {
    headline: string;
    explanation: string;
}

interface SWOTItems {
    strengths: SWOTItem[];
    weaknesses: SWOTItem[];
    opportunities: SWOTItem[];
    threats: SWOTItem[];
}

interface FMMatrixSWOTTabProps {
    swotData: SWOTItems;
    productName?: string;
}

const FMMatrixSWOTTab: React.FC<FMMatrixSWOTTabProps> = ({
    swotData,
    productName = "FM Matrix",
}) => {
    const strengths = swotData.strengths || [];
    const weaknesses = swotData.weaknesses || [];
    const opportunities = swotData.opportunities || [];
    const threats = swotData.threats || [];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
                <h2 className="text-xl font-semibold font-poppins">
                    {productName.toUpperCase()} - SWOT Analysis
                </h2>
            </div>
            <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
                8 items per quadrant. Bold headline + one-sentence explanation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div>
                    <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-3 font-semibold text-center font-poppins">
                        STRENGTHS
                    </div>
                    <div className="border border-[#C4B89D]/50">
                        {strengths.map((s, i) => (
                            <div
                                key={i}
                                className="bg-[#e2efda] border-b border-[#C4B89D]/50 p-3 text-[11px] font-poppins"
                            >
                                <strong>
                                    {i + 1}. {s.headline}:
                                </strong>{" "}
                                {s.explanation}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weaknesses */}
                <div>
                    <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-3 font-semibold text-center font-poppins">
                        WEAKNESSES
                    </div>
                    <div className="border border-[#C4B89D]/50">
                        {weaknesses.map((w, i) => (
                            <div
                                key={i}
                                className="bg-[#fce4d6] border-b border-[#C4B89D]/50 p-3 text-[11px] font-poppins"
                            >
                                <strong>
                                    {i + 1}. {w.headline}:
                                </strong>{" "}
                                {w.explanation}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Opportunities */}
                <div>
                    <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-3 font-semibold text-center font-poppins">
                        OPPORTUNITIES
                    </div>
                    <div className="border border-[#C4B89D]/50">
                        {opportunities.map((o, i) => (
                            <div
                                key={i}
                                className="bg-[#deeaf1] border-b border-[#C4B89D]/50 p-3 text-[11px] font-poppins"
                            >
                                <strong>
                                    {i + 1}. {o.headline}:
                                </strong>{" "}
                                {o.explanation}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Threats */}
                <div>
                    <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-3 font-semibold text-center font-poppins">
                        THREATS
                    </div>
                    <div className="border border-[#C4B89D]/50">
                        {threats.map((t, i) => (
                            <div
                                key={i}
                                className="bg-[#fff2cc] border-b border-[#C4B89D]/50 p-3 text-[11px] font-poppins"
                            >
                                <strong>
                                    {i + 1}. {t.headline}:
                                </strong>{" "}
                                {t.explanation}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FMMatrixSWOTTab;
