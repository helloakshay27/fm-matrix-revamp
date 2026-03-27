import React from "react";
import { ChevronRight, FileText, PenTool, Calendar, Clock, AlertCircle } from "lucide-react";

interface TopNavigationProps {
  activeNavMenu: string | null;
  setActiveNavMenu: (menu: string | null) => void;
}

const navMenuOptions: Record<
  string,
  { title: string; description: string; icon: any }[]
> = {
  Create: [
    {
      title: "Create Note",
      description: "Start a new note",
      icon: <FileText className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />,
    },
    {
      title: "Create Form",
      description: "Build a new form",
      icon: <PenTool className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />,
    },
    {
      title: "Create Booking",
      description: "Make your booking",
      icon: <Calendar className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />,
    },
    {
      title: "Create MOM",
      description: "Create MOM",
      icon: <Clock className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />,
    },
    {
      title: "Create Ticket",
      description: "Raise a Ticket",
      icon: (
        <AlertCircle className="w-5 h-5 text-[#E67E5F]" strokeWidth={1.5} />
      ),
    },
  ],
};

const TopNavigation: React.FC<TopNavigationProps> = ({
  activeNavMenu,
  setActiveNavMenu
}) => {
  return (
    <>
      {/* --- TOP NAV BAR --- */}
      <div className="flex items-center justify-between px-8 py-4 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-12 w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900">
              LOCKATED
            </span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            {[
              "Create",
              "Work",
              "Communicate",
              "Documents",
              "Operations",
              "Insight",
            ].map((item) => (
              <div
                key={item}
                onClick={() =>
                  setActiveNavMenu(activeNavMenu === item ? null : item)
                }
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <span
                  className={`text-[13px] font-bold uppercase tracking-wider transition-colors ${activeNavMenu === item
                      ? "text-[#E67E5F]"
                      : "text-gray-600 group-hover:text-gray-900"
                    }`}
                >
                  {item}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${activeNavMenu === item
                      ? "-rotate-90 text-[#E67E5F]"
                      : "rotate-90 text-gray-400"
                    }`}
                />
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* --- NAV MENU DROPDOWN --- */}
      {activeNavMenu && navMenuOptions[activeNavMenu] && (
        <div className="absolute top-[72px] left-0 w-full bg-white border-b border-gray-200 shadow-md z-40 px-8 py-8 animate-in slide-in-from-top-2 fade-in duration-200">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
            {activeNavMenu}
          </h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {navMenuOptions[activeNavMenu].map((option, idx) => (
              <div
                key={idx}
                className="flex flex-shrink-0 items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all cursor-pointer bg-white min-w-[220px]"
              >
                <div className="p-2 bg-orange-50 rounded-lg">
                  {option.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                    {option.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavigation;
