import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { QuickLink } from "../types";

interface ExploreDialogProps {
  isExploreOpen: boolean;
  setIsExploreOpen: (open: boolean) => void;
  quickLinks: QuickLink[];
}

const ExploreDialog: React.FC<ExploreDialogProps> = ({
  isExploreOpen,
  setIsExploreOpen,
  quickLinks,
}) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isExploreOpen} onOpenChange={setIsExploreOpen}>
      <DialogContent className="max-w-4xl p-0 rounded-2xl overflow-hidden bg-white border-none shadow-2xl">
        <div className="p-8 bg-[#f5f0e8]/50 overflow-hidden relative">
          <div className="flex items-center justify-between mb-10 px-4">
            <h3 className="text-xl font-medium text-gray-800">Explore</h3>
            <button
              onClick={() => setIsExploreOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-4 px-2">
            {quickLinks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => {
                  setIsExploreOpen(false);
                  navigate(
                    item.link ||
                      `/${item.name.toLowerCase().replace(/\s+/g, "-")}`
                  );
                }}
              >
                <div className="w-full aspect-square rounded-2xl bg-[#FAF9F6] flex items-center justify-center border border-gray-100/50 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[55%] h-[55%] object-contain"
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Subtle background decoration */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#E67E5F]/5 rounded-full blur-3xl" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExploreDialog;
