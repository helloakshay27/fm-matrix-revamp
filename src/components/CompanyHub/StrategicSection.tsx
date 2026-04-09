import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import GlassCard from "./GlassCard";
import { fetchGoals, fetchKRAs, Goal, KRAEvaluation } from "../../services/goalsService";
import { Loader2 } from "lucide-react";

interface StrategicSectionProps {
  welcomeText: string;
  visionText: string;
  missionText: string;
}

const StrategicSection: React.FC<StrategicSectionProps> = ({
  welcomeText,
  visionText,
  missionText,
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [kras, setKras] = useState<KRAEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStrategicData = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const email = user?.email || "dhananjay.bhoyar@lockated.com";

        const [goalsData, krasData] = await Promise.all([
          fetchGoals().catch(() => ({ dashboard: null, goals: [] })),
          fetchKRAs(email).catch(() => [])
        ]);

        setGoals(goalsData?.goals || []);
        setKras(krasData || []);
      } catch (error) {
        console.error("Failed to load strategic data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStrategicData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[140px]">
      <GlassCard className="col-span-1 lg:col-span-6 h-full overflow-hidden !bg-white shadow-sm !border-none flex flex-col transition-all duration-500 group">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            renderBullet: (_, className) =>
              `<span class="${className} custom-bullet"></span>`,
          }}
          className="h-full purpose-swiper w-full flex-1"
        >
          {[
            { title: "PURPOSE", text: welcomeText },
            { title: "VISION", text: visionText },
            { title: "MISSION", text: missionText },
          ].map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="p-6 h-full flex flex-col relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#E67E5F] uppercase">
                    {slide.title}
                  </span>
                  <div className="text-[#E67E5F]">
                    <svg
                      width="20"
                      height="15"
                      viewBox="0 0 24 18"
                      fill="currentColor"
                      className="opacity-30 transition-opacity"
                    >
                      <path d="M0 18h8l3-8V0H0v10h4l-4 8zm13 0h8l3-8V0H13v10h4l-4 8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-[13px] text-gray-700 leading-relaxed font-semibold max-w-[98%] mt-1">
                  {slide.text}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <style>{`
          .purpose-swiper .swiper-pagination { bottom: 12px !important; text-align: center; width: 100%; display: flex; justify-content: center; align-items: center; gap: 6px; }
          .purpose-swiper .custom-bullet { 
            width: 5px; height: 5px; background: #E5E7EB; opacity: 1; border-radius: 50%; display: inline-block; transition: all 0.3s;
          }
          .purpose-swiper .swiper-pagination-bullet-active { 
            width: 16px; border-radius: 10px; background: #5D56C1; 
          }
        `}</style>
      </GlassCard>

      <GlassCard className="col-span-1 lg:col-span-3 p-5 !bg-white shadow-sm !border-none h-[140px] flex flex-col transition-all duration-500 overflow-hidden">
        <div className="flex items-center justify-between mb-3 flex-shrink-0 px-1">
          <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
            Goals
          </h3>
          <button className="text-[10px] text-[#DA7756] font-bold tracking-tight">
            View All
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-none px-1 pb-1">
          {isLoading ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            </div>
          ) : goals.length === 0 ? (
            <p className="text-[10px] text-gray-400 font-medium">No active goals</p>
          ) : (
            <ul className="space-y-3">
              {goals.slice(0, 3).map((goal, i) => (
                <li
                  key={goal.id || i}
                  className="flex items-start gap-2.5 text-[10px] font-bold text-gray-500 leading-tight"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  {goal.title || "Untitled Goal"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </GlassCard>

      <GlassCard className="col-span-1 lg:col-span-3 p-5 !bg-white shadow-sm !border-none h-[140px] flex flex-col transition-all duration-500 overflow-hidden">
        <div className="flex items-center justify-between mb-3 flex-shrink-0 px-1">
          <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
            KRAs
          </h3>
          <button className="text-[10px] text-[#DA7756] font-bold tracking-tight">
            View All
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-none px-1 pb-1">
          {isLoading ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            </div>
          ) : kras.length === 0 ? (
            <p className="text-[10px] text-gray-400 font-medium">No active KRAs</p>
          ) : (
            <ul className="space-y-3">
              {kras.slice(0, 3).map((kra, i) => (
                <li
                  key={kra.id || i}
                  className="flex items-start gap-2.5 text-[10px] font-bold text-gray-500 leading-tight"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  KRA Evaluation: {kra.total_score || 0}% ({kra.category || "N/A"})
                </li>
              ))}
            </ul>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default StrategicSection;
