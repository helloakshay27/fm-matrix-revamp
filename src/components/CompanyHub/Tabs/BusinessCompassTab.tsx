import React from "react";
import GlassCard from "../GlassCard";
import { Compass, TrendingUp, Target, Users } from "lucide-react";

const BusinessCompassTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
                <Compass className="w-8 h-8 text-[#E67E5F]" />
                <h2 className="text-2xl font-black text-gray-800">Business Compass</h2>
            </div>
        </div>
    );
};

export default BusinessCompassTab;
