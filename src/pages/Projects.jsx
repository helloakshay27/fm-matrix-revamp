import { ChartNoAxesGantt, Filter, List, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EditProjectModal from "../components/EditProjectModal";
import { useNavigate } from "react-router-dom";
import AddProjectModal from "../components/AddProjectModal";
import ProjectTable from "../components/Projects/Table";

const tasks = [
    {
        id: 23123,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 23125,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 23925,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 93125,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
]

const Projects = () => {
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("List")
    const [isProjectsOpen, setIsProjectsOpen] = useState(false)
    const [projectStatus, setProjectStatus] = useState("All Projects")
    const [taskStatusMap, setTaskStatusMap] = useState(() => {
        return tasks.reduce((acc, task) => {
            acc[task.id] = "Active"; // Default status
            return acc;
        }, {});
    });

    const [openDropdown, setOpenDropdown] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);
    const [isEdit, setIsEdit] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const menuRef = useRef(null);
    const dropdownRefs = useRef({});

    const navigate = useNavigate();

    const toggleDropdown = (taskId) => {
        setOpenDropdown(openDropdown === taskId ? null : taskId);
    };

    const handleStatusChange = (taskId, status) => {
        setTaskStatusMap((prev) => ({
            ...prev,
            [taskId]: status,
        }));
        setOpenDropdown(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionClick = (action, id) => {
        if (action === "Edit") {
            setIsEdit(true)
        }
        if (action === 'Open') {
            navigate(`${id}`)
        }
        setOpenMenu(null);
    };

    return (
        <div className="">
            <h3 className="text-base mx-4 mt-3 mb-2">Projects</h3>
            <hr className="border border-gray-200" />

            <div className="flex items-center justify-between mx-3 my-3 text-sm">
                <div className="flex items-center gap-3 divide-x divide-gray-400">
                    <div className="cursor-pointer pl-3">
                        <div className="relative">
                            <button
                                className="text-sm flex items-center justify-between gap-2"
                                onClick={() => setIsTypeOpen(!isTypeOpen)}
                            >
                                {selectedType === "List" ? (
                                    <List size={20} className="text-[#E95420]" />
                                ) : (
                                    <ChartNoAxesGantt
                                        size={20}
                                        className="rotate-180 text-[#E95420]"
                                    />
                                )}
                                <span className="text-[#E95420]">{selectedType}</span>
                                <span>&#9662;</span>
                            </button>

                            {isTypeOpen && (
                                <ul className="absolute left-0 mt-2 w-[150px] bg-white border border-gray-300 shadow-xl rounded-md z-10">
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedType("List");
                                                setIsTypeOpen(false);
                                            }}
                                        >
                                            <List size={20} className="text-[#E95420]" /> List
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedType("Gantt");
                                                setIsTypeOpen(false);
                                            }}
                                            disabled
                                        >
                                            <ChartNoAxesGantt size={20} className="text-[#E95420]" />
                                            Gantt
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer pl-3">
                        <Filter size={20} className="text-gray-600" />
                    </div>

                    <div className="cursor-pointer pl-3">
                        <div className="relative">
                            <button
                                className="text-sm flex items-center justify-between gap-2"
                                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                            >
                                <span className="text-[#E95420]">{projectStatus}</span>
                                <span>&#9662;</span>
                            </button>

                            {isProjectsOpen && (
                                <ul className="absolute left-0 mt-2 w-[180px] bg-white border border-gray-300 shadow-xl rounded-md z-10">
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                setProjectStatus("All Projects");
                                                setIsProjectsOpen(false);
                                            }}
                                        >
                                            All Projects
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                setProjectStatus("Completed Projects");
                                                setIsProjectsOpen(false);
                                            }}
                                        >
                                            Completed Projects
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-1 bg-[#E95420] text-white px-4 py-2 rounded-full w-52"
                >
                    <Plus /> New Project
                </button>
            </div>

            <div>
                <ProjectTable />
            </div>


            {
                isEdit && (
                    <EditProjectModal
                        isModalOpen={isEdit}
                        setIsModalOpen={setIsEdit}
                    />
                )
            }

            {
                isModalOpen && (
                    <AddProjectModal
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                    />
                )
            }
        </div>
    )
}

export default Projects