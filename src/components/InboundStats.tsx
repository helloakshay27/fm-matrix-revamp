import React from "react";
import {
    Package,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";

interface InboundStatsProps {
    stats: {
        receives: number;
        collected: number;
        overdue: number;
    };
}

export const InboundStats: React.FC<InboundStatsProps> = ({ stats }) => {
    const statData = [
        {
            label: "Receives",
            value: stats.receives,
            icon: <Package className="w-6 h-6 text-[#C72030]" />,
        },
        {
            label: "Collected",
            value: stats.collected,
            icon: <CheckCircle className="w-6 h-6 text-[#C72030]" />,
        },
        {
            label: "Overdue",
            value: stats.overdue,
            icon: <AlertTriangle className="w-6 h-6 text-[#C72030]" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
            {statData.map((item, i) => (
                <div
                    key={i}
                    className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4"
                >
                    <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                        {item.icon}
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-[#1A1A1A]">
                            {item.value}
                        </div>
                        <div className="text-sm font-medium text-[#1A1A1A]">
                            {item.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
