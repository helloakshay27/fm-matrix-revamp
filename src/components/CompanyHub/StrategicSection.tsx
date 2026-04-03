import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import GlassCard from "./GlassCard";

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

      <GlassCard className="col-span-1 lg:col-span-3 p-5 !bg-white shadow-sm !border-none h-full flex flex-col transition-all duration-500">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
            Goals
          </h3>
          <button className="text-[10px] text-[#E67E5F] font-bold tracking-tight">
            View All
          </button>
        </div>
        <ul className="space-y-2 flex-1 px-1">
          {[
            "Increase revenue by 40% through strategic partnerships",
            "Launch three innovative product lines by Q4",
            "Achieve 95% customer satisfaction rate",
          ].map((goal, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-[10px] font-bold text-gray-500 leading-tight"
            >
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
              {goal}
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard className="col-span-1 lg:col-span-3 p-5 !bg-white shadow-sm !border-none h-full flex flex-col transition-all duration-500">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
            KRAs
          </h3>
          <button className="text-[10px] text-[#E67E5F] font-bold tracking-tight">
            View All
          </button>
        </div>
        <ul className="space-y-2 flex-1 px-1">
          {[
            "Maintain operational efficiency above 90% across all departments",
            "Maintain operational efficiency above 80% across all departments",
            "Maintain operational efficiency above 80% across all departments",
          ].map((kra, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-[10px] font-bold text-gray-500 leading-tight"
            >
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
              {kra}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
};

export default StrategicSection;
