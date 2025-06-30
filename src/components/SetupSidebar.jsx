import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SetupSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(true);
    const [isProjectSubMenuOpen, setIsProjectSubMenuOpen] = useState(false);
    const [isIssuesSubMenuOpen, setIsIssuesSubMenuOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleUsersSubMenu = () => {
        setIsUsersSubMenuOpen((prev) => !prev);
        setIsProjectSubMenuOpen(false);
        setIsIssuesSubMenuOpen(false);
    };

    const toggleProjectSubMenu = () => {
        setIsProjectSubMenuOpen((prev) => !prev);
        setIsUsersSubMenuOpen(false);
        setIsIssuesSubMenuOpen(false);
    };

    const toggleIssuesSubMenu = () => {
        setIsIssuesSubMenuOpen((prev) => !prev);
        setIsProjectSubMenuOpen(false);
        setIsUsersSubMenuOpen(false);
    };

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
            <div
                className={`flex items-center ${isSidebarOpen ? "justify-end" : "justify-center"} px-5 py-6`}
            >
                {isSidebarOpen ? (
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
                )}
            </div>

            <div className="pb-4 flex-1 overflow-y-auto no-scrollbar">
                <div>
                    <ul className="flex flex-col">
                        <li
                            className={`sidebar-link cursor-pointer ${!isSidebarOpen ? "justify-center" : ""} ${isUsersSubMenuOpen ? "bg-[#c72030] text-white" : ""
                                }`}
                            onClick={toggleUsersSubMenu}
                        >
                            <Home size={20} />
                            {isSidebarOpen ? "Manage Users" : ""}
                        </li>

                        {isSidebarOpen && isUsersSubMenuOpen && (
                            <>
                                <li className="text-[14px] ms-[60px] mb-4 mt-2">
                                    <NavLink
                                        to="/setup/roles"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Roles
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/matrix"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Escalation Matrix
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/internal-users"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Internal Users
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/external-users"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        External Users
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/project-teams"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Project Teams
                                    </NavLink>
                                </li>
                            </>
                        )}

                        <li
                            className={`sidebar-link cursor-pointer ${!isSidebarOpen ? "justify-center" : ""} ${isProjectSubMenuOpen ? "bg-[#c72030] text-white" : ""
                                }`}
                            onClick={toggleProjectSubMenu}
                        >
                            <Home size={20} />
                            {isSidebarOpen ? "Project Master" : ""}
                        </li>

                        {isSidebarOpen && isProjectSubMenuOpen && (
                            <>
                                <li className="text-[14px] ms-[60px] mb-4 mt-2">
                                    <NavLink
                                        to="/setup/organizations"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Organizations
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4 ">
                                    <NavLink
                                        to="/setup/company"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Company
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/country"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Country
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/region"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Region
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/zone"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Zone
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/types"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Types
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/tags"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Tags
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/status"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Status
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/project-group"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Project Group
                                    </NavLink>
                                </li>
                                <li className="text-[14px] ms-[60px] mb-4">
                                    <NavLink
                                        to="/setup/project-template"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Project Template
                                    </NavLink>
                                </li>
                            </>
                        )}

                        <li
                            className={`sidebar-link cursor-pointer ${!isSidebarOpen ? "justify-center" : ""} ${isIssuesSubMenuOpen ? "bg-[#c72030] text-white" : ""
                                }`}
                            onClick={toggleIssuesSubMenu}
                        >
                            <Home size={20} />
                            {isSidebarOpen ? "Issue Master" : ""}
                        </li>

                        {isSidebarOpen && isIssuesSubMenuOpen && (
                            <>
                                <li className="text-[14px] ms-[60px] mb-4 mt-2">
                                    <NavLink
                                        to="/setup/issues/types"
                                        className={({ isActive }) =>
                                            `${isActive ? "text-red font-bold" : "text-gray-700"}`
                                        }
                                    >
                                        Types
                                    </NavLink>
                                </li>

                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SetupSidebar;