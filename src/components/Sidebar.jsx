import { Bomb, Calendar1, ChevronLeft, ChevronRight, CircleCheckBig, File, Flag, FlagTriangleRight, Globe, Home, Settings, Timer } from "lucide-react";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const sidebarRef = useRef(null);

    useGSAP(() => {
        gsap.to(sidebarRef.current, {
            width: isSidebarOpen ? "14rem" : "6rem",
            duration: 0.4,
        });
    }, [isSidebarOpen]);

    return (
        <div
            ref={sidebarRef}
            className="w-[13rem] shadow-lg shadow-gray-500/50 overflow-hidden flex flex-col"
        >
            <div className={`flex items-center ${isSidebarOpen ? "justify-end" : "justify-center"} px-5 py-8`}>
                {
                    isSidebarOpen ? (
                        <ChevronLeft
                            size={20}
                            className="cursor-pointer"
                            onClick={() => {
                                setIsSidebarOpen(!isSidebarOpen);
                            }}
                        />
                    ) : (
                        <ChevronRight
                            size={20}
                            className="cursor-pointer"
                            onClick={() => {
                                setIsSidebarOpen(!isSidebarOpen);
                            }}
                        />
                    )
                }

            </div>

            <div className="pb-4 flex-1 overflow-y-auto no-scrollbar">
                <div className={`${isSidebarOpen ? "ps-4" : ""}`}>
                    <ul className="flex flex-col gap-1">
                        <Links to="/">
                            <li className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-5 ${isSidebarOpen ? "" : "justify-center"}`}>
                                <Home size={20} /> <span className={`${isSidebarOpen ? "block" : "hidden"}`}>Home</span>
                            </li>
                        </Links>
                        <Links to="/projects">
                            <li className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-5 ${isSidebarOpen ? "" : "justify-center"}`}>
                                <File size={20} /> <span className={`${isSidebarOpen ? "block" : "hidden"}`}>Projects</span>
                            </li>
                        </Links>
                        <Links to="/calender">
                            <li className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-5 ${isSidebarOpen ? "" : "justify-center"}`}>
                                <Calendar1 size={20} /> <span className={`${isSidebarOpen ? "block" : "hidden"}`}>Calendar</span>
                            </li>
                        </Links>
                        <Links to="/reports">
                            <li className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-5 ${isSidebarOpen ? "" : "justify-center"}`}>
                                <Globe size={20} /> <span className={`${isSidebarOpen ? "block" : "hidden"}`}>Reports</span>
                            </li>
                        </Links>
                    </ul>
                </div>

                <hr className="mt-4 my-2 border border-gray-200" />

                <div className={`${isSidebarOpen ? "ps-4" : ""}`}>
                    <div className={`${isSidebarOpen ? "flex" : "hidden"} items-center justify-between px-3 my-3`}>
                        <h4 className="font-medium text-sm">Overview</h4>
                        <Settings size={18} className="text-[#E95420] cursor-pointer" />
                    </div>
                    <ul className="flex flex-col gap-1">
                        <Links to="/task">
                            <li className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-5 ${isSidebarOpen ? "" : "justify-center"}`}>
                                <CircleCheckBig size={20} /> <span className={`${isSidebarOpen ? "block" : "hidden"}`}>Tasks</span>
                            </li>
                        </Links>
                        <Links to="/milestone">
                            <li className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-5 ${isSidebarOpen ? "" : "justify-center"}`}>
                                <FlagTriangleRight size={20} /> <span className={`${isSidebarOpen ? "block" : "hidden"}`}>Milestones</span>
                            </li>
                        </Links>
                        <Links to='/timesheet'>
                            <li className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-5 ${isSidebarOpen ? "" : "justify-center"}`}>
                                <Timer size={20} /> <span className={`${isSidebarOpen ? "block" : "hidden"}`}>Timesheet</span>
                            </li>
                        </Links>
                        <Links to="/sprint">
                            <li className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-5 ${isSidebarOpen ? "" : "justify-center"}`}>
                                <FlagTriangleRight size={20} /> <span className={`${isSidebarOpen ? "block" : "hidden"}`}>Sprints</span>
                            </li>
                        </Links>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Links = ({ to, children }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `${isActive ? "text-[#E95420]" : ""
                }`
            }
        >
            <span>{children}</span>
        </NavLink>
    );
};

export default Sidebar;
