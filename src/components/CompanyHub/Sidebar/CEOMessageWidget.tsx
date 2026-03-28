import React from "react";
import { Share2 } from "lucide-react";
import GlassCard from "../GlassCard";
import ceoImage from "@/assets/ceo/ceoimage.jpeg";

interface CEOMessageWidgetProps {
  setIsVideoOpen: (open: boolean) => void;
}

const CEOMessageWidget: React.FC<CEOMessageWidgetProps> = ({ setIsVideoOpen }) => {
  return (
    <GlassCard
      className="p-0 overflow-hidden !bg-white shadow-sm !border-gray-100/50 !rounded-2xl group cursor-pointer"
      onClick={() => setIsVideoOpen(true)}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={ceoImage}
          alt="CEO"
          className="w-full h-full object-cover transition-transform transition-duration-[2s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-2xl group-hover:scale-110 transition-transform">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-white text-[11px] font-bold italic tracking-wide group-hover:translate-y-[-4px] transition-transform">
            "Innovation starts with collaboration"
          </p>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-50/50">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Featured: CEO Message
          </span>
          <button className="text-[#E67E5F] transition-transform group-hover:translate-x-1">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default CEOMessageWidget;
