import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChartNoAxesGantt, Filter, List, MoreHorizontal, Plus } from "lucide-react";

const ProjectList = ({ tasks, setIsEdit }) => {
    const dropdownRefs = useRef({});
    const menuRef = useRef(null);

    const [openMenu, setOpenMenu] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [taskStatusMap, setTaskStatusMap] = useState(() => {
        return tasks.reduce((acc, task) => {
            acc[task.id] = "Active";
            return acc;
        }, {});
    });

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
    )
}

export default ProjectList