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
import { filterProjects } from "../../redux/slices/projectSlice";
import { fetchMyTasks, filterTask ,fetchTasks} from "../../redux/slices/taskSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import IssueFilter from "./Issues/Modal/Filter";
import { filterIssue } from "../../redux/slices/IssueSlice";
import Switch from '@mui/joy/Switch';
import { use } from "react";
import { set } from "react-hook-form";
import { all } from "axios";



const TYPE_OPTIONS = [
    { key: "Kanban", icon: <ChartNoAxesColumn size={18} className="rotate-180 text-[#C72030]" />, label: "Kanban" },
    { key: "List", icon: <List size={20} className="text-[#C72030]" />, label: "List" },
];

const SPRINT_TYPE_OPTIONS = [
    { key: "List", icon: <List size={20} className="text-[#C72030]" />, label: "List" },
    { key: "Sprint-Gantt", icon: <ChartNoAxesGantt size={20} className="text-[#C72030]" />, label: "Gantt" },
];

const STATUS_OPTIONS = [
    "All",
    "On Hold",
    "Completed",
    "In Progress",
    "Overdue"
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
    const { id, mid } = useParams();
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
    const [isAddIssueModalOpen, setIsAddIssueModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);
    const [isProjectFilter, setIsProjectFilter] = useState(false);
    const [isIssueFilter, setIsIssueFilter] = useState(false);
    const [myTasks, setMyTasks] = useState(false);
    const token = localStorage.getItem("token");
    localStorage.setItem("myTasks", myTasks.toString());

    const typeDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const dispatch = useDispatch();

    const filter = useMemo(() =>
        localStorage.getItem("projectFilters") || localStorage.getItem("taskFilters"),
        []
    );

    const handleAllTasks = async(checked) => {
    console.log(checked);
    setMyTasks(checked);
    localStorage.setItem("myTasks", checked.toString());
    if(checked){
     await  dispatch(fetchMyTasks({token: localStorage.getItem("token")})).unwrap();
    }else{
      await dispatch(fetchTasks({ token: localStorage.getItem("token") ,id:""})).unwrap();
    }
}

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

    const handleStatusSelect = useCallback(({ status }) => {
        let filters = {};
        const formattedStatus = status.toLowerCase().replace(" ", "_");

        if (addType === "Project") {
            if (status !== "All") {
                filters["q[status_eq]"] = formattedStatus;
            }
            dispatch(filterProjects({ token, filters: filters })).unwrap();

        } else if(addType === "Issues") {
            console.log(formattedStatus);
            if (status !== "All") {
                filters["q[status_eq]"] = formattedStatus;
            }
            dispatch(filterIssue({ token, filters })).unwrap();

        }else{
            if (status !== "All") {
                filters["q[status_eq]"] = formattedStatus;
            }
            if(mid)
            filters["q[milestone_id_eq]"] = mid;
            dispatch(filterTask({ token, filter: filters })).unwrap(); 

        }
        setSelectedStatus(status);
        setIsStatusOpen(false);
    }, [dispatch, addType]);

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

    return (
        <>
            <div className="flex items-center justify-end mx-6 mt-4 mb-3 text-sm">
                <div className="flex items-center gap-3 divide-x divide-gray-400">
                    {addType != "Issues" && addType != "Project" && addType != "Milestone" && addType != "templates" && addType != "archived" && addType != "Sprint-Gantt"  && (
                        <div className="flex justify-center items-center">
                            <label className="mr-2">All task</label>
                            <Switch
                             className={`
                                "h-[35px] w-21"
                                `
                             }
                             checked={myTasks}
                             onChange={(e) => {
                                const checked = e.target.checked;
                                console.log(checked);
                                handleAllTasks(checked);}}
                             color="danger"
                            />
                        <label className="ml-2 " >My Task</label>
                        </div>
                    )}
                    {addType !== "Issues" && addType !== "Sprint-Gantt" && addType !== "Sprint-Gantt" && !["Milestone", "templates", "archived"].includes(addType) && renderTypeDropdown()}
                    {addType !== "Issues" && !["Milestone", "Project", "Task", "active_projects", "templates", "archived"].includes(addType) && renderSprintTypeDropdown()}
                    {addType !== "Milestone" && addType !== "templates" && addType !== "archived" && (
                        <div
                            className="flex items-center gap-1 cursor-pointer pl-4"
                            onClick={() =>
                                addType === "Project"
                                    ? setIsProjectFilter(true):
                                    addType==="Issues"?
                                    setIsIssueFilter(true)
                                    : setIsFilterModalOpen(true)

                            }
                        >
                            <Filter size={18} className={`${filter ? ' text-[#C72030]' : 'text-gray-600'}`} />
                        </div>
                    )}
                    {addType !== "Milestone" && addType !== "Sprint-Gantt" && addType !== "templates" && addType !== "archived" && renderStatusDropdown()}

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
