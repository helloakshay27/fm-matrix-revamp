import {
    ChartNoAxesColumn,
    ChartNoAxesGantt,
    Filter,
    List,
    Plus,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import AddTaskModal from "./Task/AddTaskModal";
import TaskFilter from "./Task/TaskFilter";
import AddSprintModal from "./Sprints/AddSprintModal";
import AddMilestoneModal from "../../Milestone/AddMilestoneModal";
import AddProjectTemplate from "./Projects/AddProjectTempelateModal";
import ProjectFilterModal from "./Projects/ProjectFilterModel";
import AddIssueModal from "./Issues/AddIssueModal";
import { filterProjects } from "../../redux/slices/projectSlice";
import { fetchMyTasks, filterTask, fetchTasks } from "../../redux/slices/taskSlice";
import { fetchSpirints } from "../../redux/slices/spirintSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import IssueFilter from "./Issues/Modal/Filter";
import { filterIssue } from "../../redux/slices/IssueSlice";
import Switch from '@mui/joy/Switch';

// Define status options for each addType
const STATUS_OPTIONS_MAP = {
    Project: ["All", "Active", "In Progress", "Completed", "On Hold", "Overdue"],
    Issues: ["All", "Open", "In Progress", "Completed", "On Hold"],
    Task: ["All", "Open", "In Progress", "On Hold", "Completed", "Overdue"],
    "Sprint-Gantt": ["All", "Active", "Completed"],
};

const TYPE_OPTIONS = [
    { key: "Kanban", icon: <ChartNoAxesColumn size={18} className="rotate-180 text-[#C72030]" />, label: "Kanban" },
    { key: "List", icon: <List size={20} className="text-[#C72030]" />, label: "List" },
];

const SPRINT_TYPE_OPTIONS = [
    { key: "List", icon: <List size={20} className="text-[#C72030]" />, label: "List" },
    { key: "Sprint-Gantt", icon: <ChartNoAxesGantt size={20} className="text-[#C72030]" />, label: "Gantt" },
];

const TaskActions = ({
    selectedType,
    setSelectedType,
    addType,
    setIsSidebarOpen,
    setFilters,
    filters,
    context,
}) => {
    const { id, mid } = useParams();
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
    const [isAddIssueModalOpen, setIsAddIssueModalOpen] = useState(false);
    const [isProjectFilter, setIsProjectFilter] = useState(false);
    const [isIssueFilter, setIsIssueFilter] = useState(false);
    const [myTasks, setMyTasks] = useState(false);
    const token = localStorage.getItem("token");
    localStorage.setItem("myTasks", myTasks.toString());

    // Set initial selectedStatus based on addType
    const [selectedStatus, setSelectedStatus] = useState(
        STATUS_OPTIONS_MAP[addType]?.[0] || "All"
    );

    const dispatch = useDispatch();
    const typeDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

    // Reset selectedStatus when addType changes
    useEffect(() => {
        setSelectedStatus(STATUS_OPTIONS_MAP[addType]?.[0] || "All");
    }, [addType]);

    // Auto-refresh logic for Sprint-Gantt on page load/refresh
    useEffect(() => {
        if (addType === "Sprint-Gantt") {
            // Check if there's a saved sprint status
            const savedSprintStatus = localStorage.getItem("sprintStatus");
            if (savedSprintStatus) {
                // Convert saved status back to display format
                const statusLabel = savedSprintStatus.replace("_", " ");
                const capitalizedStatus = statusLabel.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                setSelectedStatus(capitalizedStatus);
                
                // Apply the filter
                const filters = { "q[status_eq]": savedSprintStatus };
                dispatch(fetchSpirints({ token, filters })).unwrap().catch(console.error);
            } else {
                // Default behavior - fetch all sprints
                setSelectedStatus("All");
                dispatch(fetchSpirints({ token })).unwrap().catch(console.error);
            }
        }
    }, [addType, dispatch, token]);

    // Clear localStorage on mount
    useEffect(() => {
        localStorage.removeItem("taskFilters");
        localStorage.removeItem("projectFilters");
        localStorage.removeItem("IssueFilters");
        localStorage.removeItem("projectStatus");
        localStorage.removeItem("issueStatus");
        localStorage.removeItem("taskStatus");
        localStorage.removeItem("sprintStatus");
    }, []);

    const filter = useMemo(
        () =>
            localStorage.getItem("projectFilters") ||
            localStorage.getItem("taskFilters"),
        []
    );

    const handleAllTasks = async (checked) => {
        setMyTasks(checked);
        localStorage.setItem("myTasks", checked.toString());
        try {
            if (checked) {
                await dispatch(fetchMyTasks({ token })).unwrap();
            } else {
                await dispatch(fetchTasks({ token, id: "" })).unwrap();
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    // Handle outside click for dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                typeDropdownRef.current &&
                !typeDropdownRef.current.contains(event.target)
            ) {
                setIsTypeOpen(false);
            }
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(event.target)
            ) {
                setIsStatusOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Memoized handlers
    const handleTypeSelect = useCallback(
        (type) => {
            setSelectedType(type);
            setIsTypeOpen(false);
            if (type === "Kanban" && setIsSidebarOpen) setIsSidebarOpen(false);
        },
        [setSelectedType, setIsSidebarOpen]
    );

    const handleStatusSelect = useCallback(
        ({ status }) => {
            let filters = {};
            const formattedStatus = status.toLowerCase().replace(" ", "_");

            if (addType === "Project") {
                if (status !== "All") {
                    filters["q[status_eq]"] = formattedStatus;
                    localStorage.setItem("projectStatus", formattedStatus);
                } else {
                    localStorage.removeItem("projectStatus");
                }
                dispatch(filterProjects({ token, filters })).unwrap();
            } else if (addType === "Issues") {
                if (status !== "All") {
                    filters["q[status_eq]"] = formattedStatus;
                    localStorage.setItem("issueStatus", formattedStatus);
                } else {
                    localStorage.removeItem("issueStatus");
                }
                dispatch(filterIssue({ token, filter: filters })).unwrap();
            } else if (addType === "Sprint-Gantt") {
                // Handle Sprint-Gantt status filtering
                if (status !== "All") {
                    localStorage.setItem("sprintStatus", formattedStatus);
                    // Filter sprints by status
                    filters["q[status_eq]"] = formattedStatus;
                } else {
                    localStorage.removeItem("sprintStatus");
                }
                // Fetch sprints with the filter
                dispatch(fetchSpirints({ token, filters })).unwrap();
            } else {
                if (status !== "All") {
                    filters["q[status_eq]"] = formattedStatus;
                    localStorage.setItem("taskStatus", formattedStatus);
                } else {
                    localStorage.removeItem("taskStatus");
                }
                if (mid) filters["q[milestone_id_eq]"] = mid;
                dispatch(filterTask({ token, filter: filters })).unwrap();
            }
            setSelectedStatus(status);
            setIsStatusOpen(false);
        },
        [dispatch, addType, mid, token]
    );

    const handleAddClick = useCallback(() => {
        switch (addType) {
            case "Sprint-Gantt":
                setIsSprintModalOpen(true);
                break;
            case "Project":
                setIsAddProjectModalOpen(true);
                break;
            case "Milestone":
                setIsAddMilestoneModalOpen(true);
                break;
            case "Issues":
                setIsAddIssueModalOpen(true);
                break;
            default:
                setIsModalOpen(true);
        }
    }, [addType]);

    // Renderers
    const renderTypeDropdown = () => (
        <div className="cursor-pointer" ref={typeDropdownRef}>
            <div className="relative ml-2">
                <button
                    className="text-sm flex items-center justify-between gap-2"
                    onClick={() => {
                        if (selectedType) setIsTypeOpen((v) => !v);
                    }}
                >
                    {selectedType === "Kanban" ? (
                        <ChartNoAxesColumn size={20} className="rotate-180 text-[#C72030]" />
                    ) : selectedType === "List" ? (
                        <List size={20} className="text-[#C72030]" />
                    ) : (
                        <ChartNoAxesGantt size={20} className="text-[#C72030]" />
                    )}
                    <span className="text-[#C72030]">{selectedType}</span>
                    <span>▾</span>
                </button>
                {isTypeOpen && (
                    <ul className="absolute left-0 mt-2 w-[150px] bg-white border border-gray-300 shadow-xl rounded-md z-10">
                        {TYPE_OPTIONS.map(({ key, icon, label }) => (
                            <li key={key}>
                                <button
                                    className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100 flex items-center gap-2"
                                    onClick={() => handleTypeSelect(key)}
                                >
                                    {icon} {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

    const renderSprintTypeDropdown = () => (
        <div className="cursor-pointer" ref={typeDropdownRef}>
            <div className="relative">
                <button
                    className="text-sm flex items-center justify-between gap-2"
                    onClick={() => {
                        if (addType === "Sprint-Gantt") setIsTypeOpen((v) => !v);
                    }}
                    disabled={addType !== "Sprint-Gantt"}
                    style={addType !== "Sprint-Gantt" ? { cursor: "not-allowed", marginRight: "12px" } : {}}
                >
                    {selectedType === "List" ? (
                        <List size={20} className="text-[#C72030]" />
                    ) : (
                        <ChartNoAxesGantt size={20} className="rotate-180 text-[#C72030]" />
                    )}
                    <span className="text-[#C72030]">{selectedType}</span>
                    {addType === "Sprint-Gantt" && <span>▾</span>}
                </button>
                {isTypeOpen && addType === "Sprint-Gantt" && (
                    <ul className="absolute left-0 mt-2 w-[150px] bg-white border border-gray-300 shadow-xl rounded-md z-10">
                        {SPRINT_TYPE_OPTIONS.map(({ key, icon, label }) => (
                            <li key={key}>
                                <button
                                    className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100 flex items-center gap-2"
                                    onClick={() => handleTypeSelect(key)}
                                >
                                    {icon} {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

    const renderStatusDropdown = () => {
        const statusOptions = STATUS_OPTIONS_MAP[addType] || ["All"];
        return (
            <div className="flex items-center gap-1 cursor-pointer pl-4" ref={statusDropdownRef}>
                <div className="relative">
                    <button
                        className="text-[13px] flex items-center justify-between gap-2"
                        onClick={() => setIsStatusOpen((v) => !v)}
                    >
                        <span className="text-[#C72030]">{selectedStatus}</span>
                        <span>▾</span>
                    </button>
                    {isStatusOpen && (
                        <ul className="absolute left-0 mt-2 w-[150px] bg-white border border-gray-300 shadow-xl rounded-md z-10">
                            {statusOptions.map((status) => (
                                <li key={status}>
                                    <button
                                        className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100"
                                        onClick={() => handleStatusSelect({ status })}
                                    >
                                        {status}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="flex items-center justify-end mx-6 mt-4 mb-3 text-sm">
                <div className="flex items-center gap-3 divide-x divide-gray-400">
                    {addType !== "Issues" &&
                        addType !== "Project" &&
                        addType !== "Milestone" &&
                        addType !== "templates" &&
                        addType !== "archived" &&
                        addType !== "Sprint-Gantt" &&
                        !mid && (
                            <div className="flex justify-center items-center">
                                <label className="mr-2">All task</label>
                                <Switch
                                    className="h-[35px] w-21"
                                    checked={myTasks}
                                    onChange={(e) => handleAllTasks(e.target.checked)}
                                    color="danger"
                                />
                                <label className="ml-2">My Task</label>
                            </div>
                        )}
                    {addType !== "Issues" &&
                        addType !== "Sprint-Gantt" &&
                        !["Milestone", "templates", "archived"].includes(addType) &&
                        renderTypeDropdown()}
                    {addType !== "Issues" &&
                        !["Milestone", "Project", "Task", "active_projects", "templates", "archived"].includes(addType) &&
                        renderSprintTypeDropdown()}
                    {addType !== "Milestone" &&
                        addType !== "templates" &&
                        addType !== "archived" &&
                        addType !== "Sprint-Gantt" && ( // Added Sprint-Gantt exclusion
                            <div
                                className="flex items-center gap-1 cursor-pointer pl-4"
                                onClick={() =>
                                    addType === "Project"
                                        ? setIsProjectFilter(true)
                                        : addType === "Issues"
                                            ? setIsIssueFilter(true)
                                            : setIsFilterModalOpen(true)
                                }
                            >
                                <Filter size={18} className={`${filter ? "text-[#C72030]" : "text-gray-600"}`} />
                            </div>
                        )}
                    {addType !== "Milestone" && addType !== "templates" && addType !== "archived" && renderStatusDropdown()}

                    {addType !== "templates" && addType !== "archived" && (
                        <button
                            onClick={handleAddClick}
                            className="text-[12px] flex items-center justify-center gap-1 bg-red text-white px-3 py-2 w-40"
                        >
                            <Plus size={18} />{" "}
                            {addType === "Sprint-Gantt"
                                ? "Add Sprint"
                                : addType === "Project"
                                    ? "Add Project"
                                    : addType === "Milestone"
                                        ? "Add Milestone"
                                        : addType === "Issues"
                                            ? "Add Issue"
                                            : "Add Task"}
                        </button>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <AddTaskModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    title={"Add Task"}
                    isEdit={false}
                />
            )}

            {isFilterModalOpen && (
                <TaskFilter
                    isModalOpen={isFilterModalOpen}
                    setIsModalOpen={setIsFilterModalOpen}
                />
            )}

            {isSprintModalOpen && (
                <AddSprintModal
                    isSprintModalOpen={isSprintModalOpen}
                    setIsSprintModalOpen={setIsSprintModalOpen}
                />
            )}
            {isProjectFilter && context === "Projects" && (
                <ProjectFilterModal
                    isModalOpen={isProjectFilter}
                    setIsModalOpen={setIsProjectFilter}
                    onApplyFilters={setFilters}
                    filters={filters}
                />
            )}

            {isAddProjectModalOpen && (
                <AddProjectTemplate
                    isModalOpen={isAddProjectModalOpen}
                    setIsModalOpen={setIsAddProjectModalOpen}
                />
            )}

            {isAddProjectModalOpen && (
                <AddProjectTemplate
                    isModalOpen={isAddProjectModalOpen}
                    setIsModalOpen={setIsAddProjectModalOpen}
                />
            )}

            {isAddMilestoneModalOpen && (
                <AddMilestoneModal
                    isModalOpen={isAddMilestoneModalOpen}
                    setIsModalOpen={setIsAddMilestoneModalOpen}
                />
            )}

            {isAddIssueModalOpen && (
                <AddIssueModal
                    isModalOpen={isAddIssueModalOpen}
                    setIsModalOpen={setIsAddIssueModalOpen}
                />
            )}

            {isIssueFilter && (
                <IssueFilter
                    isModalOpen={isIssueFilter}
                    setIsModalOpen={setIsIssueFilter}
                />
            )}
        </>
    );
};

export default TaskActions;