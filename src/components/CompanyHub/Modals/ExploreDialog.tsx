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
      <DialogContent className="max-w-4xl p-0 rounded-[2.5rem] overflow-hidden bg-white border-none shadow-2xl">
        <div className="p-10 bg-gradient-to-br from-white to-[#FAF9F6] overflow-hidden relative">
          <div className="flex items-center justify-between mb-12 px-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Explore</h3>
              <p className="text-sm text-gray-400 mt-1">Quickly access essential company resources</p>
            </div>
            <button
              onClick={() => setIsExploreOpen(false)}
              className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-6 px-2">
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
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:shadow-[0_12px_24px_rgba(218,119,86,0.12)] group-hover:border-[#DA7756]/20 transition-all duration-500 group-hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#DA7756]/0 to-[#DA7756]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-[13px] font-semibold text-gray-600 text-center leading-tight group-hover:text-[#DA7756] transition-colors duration-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Subtle background decoration */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#DA7756]/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-gray-200/10 rounded-full blur-3xl opacity-50" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExploreDialog;
