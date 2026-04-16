import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import GlassCard from "../GlassCard";

type AnnouncementItem = {
  id?: string | number;
  title: string;
  description: string;
  href?: string;
};

type CompanyHubAnnouncement = {
  id?: number;
  extra_field_id?: number;
  field_name?: string;
  field_value?: string;
  displayDescription?: string;
  isActive?: boolean;
};

interface AnnouncementsWidgetProps {
  announcements?: CompanyHubAnnouncement[];
}

const AnnouncementsWidget: React.FC<AnnouncementsWidgetProps> = ({
  announcements,
}) => {
  const items: AnnouncementItem[] = useMemo(() => {
    const mapped = (announcements || [])
      .filter((a) => a?.isActive !== false)
      .map((a) => ({
        id: a.id ?? a.extra_field_id,
        title: a.field_name || "Announcement",
        description: a.displayDescription || a.field_value || "",
      }))
      .filter((a) => a.title.trim() || a.description.trim());

    return mapped.slice(0, 2);
  }, [announcements]);

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <GlassCard className="p-7 !rounded-2xl flex flex-col !bg-white shadow-sm border-gray-50">
      <div className="mb-6 font-black text-[12px] tracking-tight text-gray-900">
        Announcements
      </div>

      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((a, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={a.id ?? idx}
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
              </button>
            );
          })
        ) : (
          <div className="w-full rounded-2xl border border-[#EFEDE7] px-5 py-4 bg-white text-[12px] text-gray-400 italic">
            No announcements found
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default AnnouncementsWidget;
