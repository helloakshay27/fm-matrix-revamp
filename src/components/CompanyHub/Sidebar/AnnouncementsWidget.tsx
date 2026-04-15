import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import GlassCard from "../GlassCard";

type AnnouncementItem = {
  title: string;
  description: string;
  href?: string;
};

const AnnouncementsWidget: React.FC = () => {
  const items: AnnouncementItem[] = useMemo(
    () => [
      {
        title: "New Health Insurance Plans",
        description: "Enhanced coverage options now available for all employees.",
      },
      {
        title: "Office Renovation Update",
        description: "Phase 2 construction begins next week. Check the memo for details.",
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <GlassCard className="p-7 !rounded-2xl flex flex-col !bg-white shadow-sm border-gray-50">
      <div className="mb-6 font-black text-[12px] tracking-tight text-gray-900">
        Announcements
      </div>

      <div className="space-y-4">
        {items.map((a, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setActiveIndex(idx)}
              onFocus={() => setActiveIndex(idx)}
              className={`w-full text-left flex items-start gap-3 rounded-2xl border px-5 py-4 transition-colors ${
                isActive
                  ? "bg-[#F3F2EF] border-[#ECEAE4]"
                  : "bg-white border-[#EFEDE7] hover:bg-[#FAF9F7]"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-gray-900 leading-snug">
                  {a.title}
                </div>
                <div className="mt-1 text-[12px] text-gray-600 leading-snug">
                  {a.description}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default AnnouncementsWidget;
