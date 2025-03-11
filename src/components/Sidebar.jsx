import { ChevronLeft, Settings } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const sidebarRef = useRef(null);

    useGSAP(() => {
        gsap.to(sidebarRef.current, {
            width: isSidebarOpen ? "13rem" : "0px",
            duration: 0.4,
        });
    }, [isSidebarOpen]);

    return (
        <div
            ref={sidebarRef}
            className="w-[13rem] shadow-lg shadow-gray-500/50 overflow-hidden flex flex-col"
        >
            <div className="flex items-center justify-end px-3 py-3">
                <ChevronLeft
                    size={20}
                    className="cursor-pointer"
                    onClick={() => {
                        setIsSidebarOpen(false);
                    }}
                />
            </div>

            <div className="pb-4 flex-1 overflow-y-auto no-scrollbar">
                <div className="ps-4">
                    <ul className="flex flex-col gap-1">
                        <li className="px-3 py-2 text-sm cursor-pointer flex items-center gap-5">
                            <span className="w-4 h-4 bg-gray-300" /> Home
                        </li>
                        <li className="px-3 py-2 text-sm cursor-pointer flex items-center gap-5">
                            <span className="w-4 h-4 bg-gray-300" /> Projects
                        </li>
                        <li className="px-3 py-2 text-sm cursor-pointer flex items-center gap-5">
                            <span className="w-4 h-4 bg-gray-300" /> Calendar
                        </li>
                        <li className="px-3 py-2 text-sm cursor-pointer flex items-center gap-5">
                            <span className="w-4 h-4 bg-gray-300" /> Reports
                        </li>
                    </ul>
                </div>

                <hr className="mx-2 mt-4 my-2 border border-gray-200" />

                <div className="ps-4">
                    <div className="flex items-center justify-between px-3 my-3">
                        <h4 className="font-medium text-sm">Overview</h4>
                        <Settings size={18} className="text-[#E95420] cursor-pointer" />
                    </div>
                    <ul className="flex flex-col gap-1">
                        <li className="px-3 py-2 text-sm cursor-pointer flex items-center gap-5">
                            <span className="w-4 h-4 bg-gray-300" /> Tasks
                        </li>
                        <li className="px-3 py-2 text-sm cursor-pointer flex items-center gap-5">
                            <span className="w-4 h-4 bg-gray-300" /> Issues
                        </li>
                        <li className="px-3 py-2 text-sm cursor-pointer flex items-center gap-5">
                            <span className="w-4 h-4 bg-gray-300" /> Milestones
                        </li>
                        <li className="px-3 py-2 text-sm cursor-pointer flex items-center gap-5">
                            <span className="w-4 h-4 bg-gray-300" /> Timesheet
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
