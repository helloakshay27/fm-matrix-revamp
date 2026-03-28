import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Megaphone } from "lucide-react";
import GlassCard from "../GlassCard";

const TownHallsWidget: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          "9c321b4fe31d68572f18cbc082557777f681f283c244fa55";
        const baseUrl =
          localStorage.getItem("baseUrl") || "lockated-api.gophygital.work";
        const res = await axios.get(
          `https://${baseUrl}/pms/admin/events.json?q[event_type_eq]=town_hall&token=${token}`
        );
        setCards(res.data.classifieds || []);
      } catch (err: any) {
        console.error("Fetch Town Halls failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <GlassCard className="p-7 !rounded-2xl flex flex-col !bg-white shadow-sm border-gray-50 h-[260px]">
      <div className="flex items-center gap-2 mb-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
        <Megaphone className="w-4 h-4" /> Town Halls
      </div>
      <div className="flex-1 relative overflow-hidden">
        {loading || cards.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] text-gray-400 italic">
            No scheduled town halls.
          </div>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3500 }}
            pagination={{ clickable: true }}
            className="h-full"
          >
            {cards.map((c, i) => (
              <SwiperSlide key={i} className="pb-8">
                <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-100 flex gap-3 h-full">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={
                        (c.documents && (c.documents[0] as any)?.document) ||
                        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=200"
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-gray-900 line-clamp-1">
                      {c.event_name}
                    </h4>
                    <p className="text-[9px] text-[#E67E5F] font-bold mt-1 uppercase tracking-tighter">
                      {new Date(c.from_time).toLocaleDateString()}
                    </p>
                    <p className="text-[9px] text-gray-500 mt-1 line-clamp-1">
                      {c.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </GlassCard>
  );
};

export default TownHallsWidget;
