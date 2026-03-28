import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Activity } from "lucide-react";
import GlassCard from "../GlassCard";
import { UpcomingEvent } from "../types";

const UpcomingEventsWidget: React.FC = () => {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl =
          localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const res = await axios.get(
          `https://${baseUrl}/pms/admin/events/upcoming_events.json?token=9c321b4fe31d68572f18cbc082557777f681f283c244fa55`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents(res.data.upcoming || []);
      } catch (err: any) {
        console.error("Fetch Events failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <GlassCard className="p-7 !rounded-2xl flex flex-col !bg-white shadow-sm border-gray-50 h-[480px]">
      <div className="flex items-center gap-2 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
        <Calendar className="w-4 h-4" /> Upcoming Events
      </div>
      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Activity className="w-6 h-6 animate-spin text-gray-200" />
          </div>
        ) : (
          <div className="h-full overflow-y-auto space-y-4 pr-2 scrollbar-none animate-scroll-vertical">
            {(events.length > 0 ? [...events, ...events] : []).map((ev, i) => (
              <div
                key={i}
                className="flex gap-4 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/50"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <img
                    src={
                      ev.image_url ||
                      `https://images.unsplash.com/photo-1511578314322-379afb476865?w=200`
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <p className="text-[9px] text-[#E67E5F] font-black mb-1 uppercase tracking-widest">
                    {ev.event_date || "Upcoming"}
                  </p>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight mb-1">
                    {ev.title || ev.event_name}
                  </h4>
                  <div className="flex items-center gap-1 text-[8px] text-gray-400 font-bold uppercase">
                    <MapPin className="w-3 h-3" />{" "}
                    <span className="truncate">{ev.location || "Office"}</span>
                  </div>
                </div>
              </div>
            ))}
            <style>{`
              .scrollbar-none::-webkit-scrollbar { display: none !important; }
              .scrollbar-none { -ms-overflow-style: none !important; scrollbar-width: none !important; }
              @keyframes scroll-vertical { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
              .animate-scroll-vertical { animation: scroll-vertical 30s linear infinite; }
              .animate-scroll-vertical:hover { animation-play-state: paused; }
            `}</style>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default UpcomingEventsWidget;
