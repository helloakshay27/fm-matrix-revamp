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
      <DialogContent className="max-w-[1200px] p-0 h-auto rounded-[12px] bg-white border-none shadow-xl">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[13px] font-bold text-[#4A4A4A]">Explore</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Quickly access essential company resources</p>
            </div>
            <button
              onClick={() => setIsExploreOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-nowrap justify-center gap-5 pb-8">
            {quickLinks.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsExploreOpen(false);
                  navigate(
                    item.link ||
                      `/${item.name.toLowerCase().replace(/\s+/g, "-")}`
                  );
                }}
                className="flex flex-col items-center justify-center w-[140px] h-[120px] bg-[#FCFBF8] rounded-xl cursor-pointer hover:bg-[#F4F2EC] transition-all group shrink-0"
              >
                <div className="w-[52px] h-[52px] bg-white rounded-xl flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#F0ECE1] group-hover:scale-105 transition-transform duration-300 mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-[12px] font-bold text-[#3D3D3D] tracking-tight text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExploreDialog;
