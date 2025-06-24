import { ChevronLeft, ChevronRight, CircleCheckBig, File, FlagTriangleRight, GanttChartSquare, Home, MessageSquareText, Milestone } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { NavLink } from "react-router-dom";

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
            className="sidebar w-[14rem] shadow-lg shadow-gray-500/50 overflow-hidden flex flex-col bg-[#D5DBDB]"
        >
            <div className={`flex items-center ${isSidebarOpen ? "justify-end" : "justify-center"} px-5 py-6`}>
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
                <div>
                    <ul className="flex flex-col">
                        <NavLink to={"/"}>
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <Home size={20} />
                                {isSidebarOpen ? "Home" : ""}
                            </li>
                        </NavLink>
                        <NavLink to="/projects">
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <File size={20} />
                                {isSidebarOpen ? "Projects" : ""}
                            </li>
                        </NavLink>
                        <NavLink to="/issues">
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <MessageSquareText size={20} />
                                {isSidebarOpen ? "Issues" : ""}
                            </li>
                        </NavLink>
                        <NavLink to="/sprint">
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <FlagTriangleRight size={20} />
                                {isSidebarOpen ? "Sprints" : ""}
                            </li>
                        </NavLink>
                        <NavLink to="/reports">
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <GanttChartSquare size={20} />
                                {isSidebarOpen ? "Reports" : ""}
                            </li>
                        </NavLink>
                        <NavLink to="/tasks">
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <CircleCheckBig size={20} />
                                {isSidebarOpen ? "Tasks" : ""}
                            </li>
                        </NavLink>
                        <NavLink to="/channels">
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <GanttChartSquare size={20} />
                                {isSidebarOpen ? "Channels" : ""}
                            </li>
                        </NavLink>
                        <NavLink to="/mom">
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <MessageSquareText size={20} />
                                {isSidebarOpen ? "Minutes of Meeting" : ""}
                            </li>
                        </NavLink>
                        <NavLink to="/documents">
                            <li className={`sidebar-link ${!isSidebarOpen ? "justify-center" : ""}`}>
                                <File size={20} />
                                {isSidebarOpen ? "Documents" : ""}
                            </li>
                        </NavLink>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
