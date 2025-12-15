import React from "react";
import {
    TruckIcon,
    PackageCheck,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";

interface OutboundStatsProps {
    stats: {
        sent: number;
        inTransit: number;
        delivered: number;
        overdue: number;
    };
    onCardClick?: (status: 'sent' | 'in_transit' | 'delivered' | 'overdue') => void;
}

export const OutboundStats: React.FC<OutboundStatsProps> = ({ stats, onCardClick }) => {
    const statData = [
        {
            label: "Sent",
            value: stats.sent,
            status: 'sent' as const,
            icon: <PackageCheck className="w-6 h-6 text-[#C72030]" />,
        },
        {
            label: "In Transit",
            value: stats.inTransit,
            status: 'in_transit' as const,
            icon: <TruckIcon className="w-6 h-6 text-[#C72030]" />,
        },
        {
            label: "Delivered",
            value: stats.delivered,
            status: 'delivered' as const,
            icon: <CheckCircle className="w-6 h-6 text-[#C72030]" />,
        },
        {
            label: "Overdue",
            value: stats.overdue,
            status: 'overdue' as const,
            icon: <AlertTriangle className="w-6 h-6 text-[#C72030]" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
            {statData.map((item, i) => (
                <div
                    key={i}
                    onClick={() => onCardClick?.(item.status)}
                    className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
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
