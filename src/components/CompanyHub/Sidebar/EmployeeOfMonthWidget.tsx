import React from "react";
import { Sparkle } from "lucide-react";
import GlassCard from "../GlassCard";

interface EmployeeOfMonthWidgetProps {
  currentEmployee: any;
}

const EmployeeOfMonthWidget: React.FC<EmployeeOfMonthWidgetProps> = ({
  currentEmployee,
}) => {
  const imageUrl =
    currentEmployee?.profile_image || currentEmployee?.profileImage || "";
  const employeeName =
    currentEmployee?.full_name ||
    currentEmployee?.userName ||
    currentEmployee?.name ||
    "Winner";
  const role = currentEmployee?.role || "Employee";
  const month = currentEmployee?.month || "";
  const points = Array.isArray(currentEmployee?.points)
    ? currentEmployee.points.filter(Boolean)
    : [];

  return (
    <GlassCard className="p-6 sm:p-7 !bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] !border-none !rounded-[24px]">
      <div className="flex items-start justify-between gap-3 mb-8">
        <h3 className="text-[17px] font-bold text-[#4A4A4A] text-left tracking-tight">
          Employee of the Month
        </h3>
        {month && (
          <span className="shrink-0 rounded-full bg-[#F9EEE9] px-3 py-1 text-[11px] font-bold text-[#E67E5F]">
            {month}
          </span>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="w-[112px] h-[112px] rounded-full p-[4px] border-[3px] border-[#E67E5F] relative mb-5 shadow-[0_8px_20px_-6px_rgba(230,126,95,0.4)] bg-white">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={
                imageUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(employeeName)}`
              }
              className="w-full h-full object-cover"
              alt="Employee"
            />
          </div>
        </div>
        <h4 className="text-[17px] font-bold text-[#3D3D3D] leading-tight mb-1">
          {employeeName}
        </h4>
        <p className="text-[12px] font-bold text-[#8A8A8A] mb-6">
          {role}
        </p>

        <div className="w-[95%] h-px bg-[#F0F0F0] mb-5" />

        {points.length > 0 && (
          <div className="w-full space-y-2 text-left">
            {points.slice(0, 3).map((point: string, index: number) => (
              <div
                key={`${point}-${index}`}
                className="flex items-start gap-2 text-[12px] font-medium leading-snug text-[#6F6F6F]"
              >
                <Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E67E5F]" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default EmployeeOfMonthWidget;
