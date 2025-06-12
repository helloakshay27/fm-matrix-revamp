/* eslint-disable react/prop-types */
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

const TYPE_OPTIONS = [
    { key: "Kanban", icon: <ChartNoAxesColumn size={18} className="rotate-180 text-[#C72030]" />, label: "Kanban" },
    { key: "List", icon: <List size={20} className="text-[#C72030]" />, label: "List" },
    // { key: "Gantt", icon: <ChartNoAxesGantt size={20} className="text-[#C72030]" />, label: "Gantt" },
];

const SPRINT_TYPE_OPTIONS = [
    { key: "List", icon: <List size={20} className="text-[#C72030]" />, label: "List" },
    { key: "Sprint-Gantt", icon: <ChartNoAxesGantt size={20} className="text-[#C72030]" />, label: "Gantt" },
];

const STATUS_OPTIONS = [
    "On Hold",
    "Completed"
];

const TaskActions = ({
    selectedType,
    setSelectedType,
    addType,
    setIsSidebarOpen,
    setFilters,
    filters,
    context
}) => {
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
    const [isAddIssueModalOpen, setIsAddIssueModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("Status");
    const [isProjectFilter, setIsProjectFilter] = useState(false);

    const typeDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

    const filter = useMemo(() =>
        localStorage.getItem("projectFilters") || localStorage.getItem("taskFilters"),
        []
    );

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
    const handleTypeSelect = useCallback((type) => {
        setSelectedType(type);
        setIsTypeOpen(false);
        if (type === "Kanban") setIsSidebarOpen(false);
    }, [setSelectedType, setIsSidebarOpen]);

    const handleStatusSelect = useCallback((status) => {
        setSelectedStatus(status);
        setIsStatusOpen(false);
    }, []);

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
            <div className="relative">
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
                    )  : (
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

    const renderStatusDropdown = () => (
        <div
            className="flex items-center gap-1 cursor-pointer pl-4"
            ref={statusDropdownRef}
        >
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
                        {STATUS_OPTIONS.map((status) => (
                            <li key={status}>
                                <button
                                    className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100"
                                    onClick={() => handleStatusSelect(status)}
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

    return (
        <>
            <div className="flex items-center justify-end mx-6 mt-4 mb-3 text-sm">
                <div className="flex items-center gap-3 divide-x divide-gray-400">
                    {addType !== "Issues" && addType !== "Sprint-Gantt" && addType !== "Sprint-Gantt" && !["Milestone", "templates", "archived"].includes(addType) && renderTypeDropdown()}
                    {addType !== "Issues" && !["Milestone", "Project", "Task", "active_projects", "templates", "archived"].includes(addType) && renderSprintTypeDropdown()}
                    {addType !== "Milestone" && (
                        <div
                            className="flex items-center gap-1 cursor-pointer pl-4"
                            onClick={() =>
                                addType === "Project"
                                    ? setIsProjectFilter(true)
                                    : setIsFilterModalOpen(true)

                            }
                        >
                            <Filter size={18} className={`${filter ? ' text-[#C72030]' : 'text-gray-600'}`} />
                        </div>
                    )}
                    {addType !== "Milestone" && addType !== "Sprint-Gantt" && renderStatusDropdown()}
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
        </>
    );
};

export default TaskActions;
