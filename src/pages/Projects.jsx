import { ChartNoAxesGantt, Filter, List, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EditProjectModal from "../components/EditProjectModal";
import { useNavigate } from "react-router-dom";
import AddProjectModal from "../components/AddProjectModal";

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

            <div className="overflow-x-auto bg-white border ml-8 mr-4 no-scrollbar">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                Project Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r w-[20rem]">
                                Tasks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                End Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                Project Owner
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                Project Created On
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tasks.map((task, index) => (
                                <>
                                    <span>
                                        <MoreHorizontal size={15} className="absolute -left-0 mt-3 ms-2 cursor-pointer" onClick={() => setOpenMenu(openMenu === task.id ? null : task.id)} />
                                    </span>
                                    {openMenu === task.id && (
                                        <div
                                            ref={menuRef}
                                            className="absolute left-8 transform -translate-y-1/2 bg-white border shadow-md rounded-md w-36 z-50"
                                        >
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                onClick={() => handleOptionClick("Open", task.id)}
                                            >
                                                Open
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                onClick={() => handleOptionClick("Edit", task.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                                                onClick={() => handleOptionClick("Delete", task.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                    <tr className="border-b border-gray-200 relative">
                                        <td className="px-6 py-2 whitespace-nowrap border-r">
                                            <button className="text-gray-600 hover:text-gray-900">
                                                {task.projectName}
                                            </button>
                                        </td>
                                        <td className="px-6 py-2 relative text-sm text-gray-900 border-r">
                                            {/* Status Button */}
                                            <button
                                                className="flex items-center justify-between px-3 py-1 bg-gray-100 rounded-md text-sm text-[#E95420] w-32"
                                                onClick={() => toggleDropdown(task.id)}
                                            >
                                                {taskStatusMap[task.id]} <span className="ml-1">&#9662;</span>
                                            </button>

                                            {/* Dropdown Menu */}
                                            {openDropdown === task.id && (
                                                <ul
                                                    ref={(el) => (dropdownRefs.current[task.id] = el)}
                                                    className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-32 bg-white border border-gray-300 shadow-lg rounded-md z-10 
                                                ${index > tasks.length - 3 ? "bottom-full mb-1" : "top-full mt-1"}`}
                                                >
                                                    {["Active", "On Hold", "Delayed", "In Testing", "Completed", "Cancelled"].map((status) => (
                                                        <li key={status}>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                                onClick={() => handleStatusChange(task.id, status)}
                                                            >
                                                                {status}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap border-r">
                                            <progress className="w-full" style={{ borderRadius: "10px" }} value={task.task} max="100" />
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 border-r">
                                            {task.startDate}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 border-r">
                                            {task.endDate}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 border-r">
                                            {task.projectOwner}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 border-r">
                                            {task.projectCreatedOn}
                                        </td>
                                    </tr>
                                </>
                            ))
                        }

                    </tbody>
                </table>
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