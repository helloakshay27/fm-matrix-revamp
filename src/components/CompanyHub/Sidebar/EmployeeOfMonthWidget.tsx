import React from "react";
import { Heart, MessageSquare } from "lucide-react";
import GlassCard from "../GlassCard";

interface EmployeeOfMonthWidgetProps {
  currentEmployee: any;
}

const EmployeeOfMonthWidget: React.FC<EmployeeOfMonthWidgetProps> = ({
  currentEmployee,
}) => {
  return (
    <GlassCard className="p-6 sm:p-7 !bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] !border-none !rounded-[24px]">
      <h3 className="text-[17px] font-bold text-[#4A4A4A] mb-8 text-left tracking-tight">
        Employee of the Month
      </h3>
      <div className="flex flex-col items-center">
        <div className="w-[112px] h-[112px] rounded-full p-[4px] border-[3px] border-[#E67E5F] relative mb-5 shadow-[0_8px_20px_-6px_rgba(230,126,95,0.4)] bg-white">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={
                currentEmployee?.profile_image ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=winner`
              }
              className="w-full h-full object-cover"
              alt="Employee"
            />
          </div>
        </div>
        <h4 className="text-[17px] font-bold text-[#3D3D3D] leading-tight mb-1">
          {currentEmployee?.full_name || "Sarah Johnson"}
        </h4>
        <p className="text-[12px] font-bold text-[#8A8A8A] mb-6">
          Product Manager
        </p>

        <div className="w-[95%] h-px bg-[#F0F0F0] mb-5" />

        <div className="flex items-center justify-center gap-6 text-[13px] text-[#8A8A8A] font-medium">
          <div className="flex items-center gap-1.5">
            <Heart
              className="w-[18px] h-[18px] text-[#E67E5F]"
              strokeWidth={2}
            />{" "}
            127
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare
              className="w-[18px] h-[18px] text-[#8A8A8A]"
              strokeWidth={2}
            />{" "}
            34
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default EmployeeOfMonthWidget;
