/* eslint-disable react/prop-types */
import {
    ChartNoAxesColumn,
    ChartNoAxesGantt,
    Filter,
    List,
    Plus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AddTaskModal from "./Task/AddTaskModal";
import TaskFilter from "./Task/TaskFilter";
import AddSprintModal from "./Sprints/AddSprintModal";
import AddMilestoneModal from "../../Milestone/AddMilestoneModal";
import AddProjectTemplate from "./Projects/AddProjectTempelateModal";
import ProjectFilterModal from "./Projects/ProjectFilterModel";
import AddIssueModal from "./Issues/AddIssueModal";

const TaskActions = ({ selectedType, setSelectedType, addType, setIsSidebarOpen, setFilters, filters, context }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isFilterModalOpan, setIsFilterModalOpan] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false); // State for Milestone modal
    const [isAddIssueModalOpen, setIsAddIssueModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("Status");
    const [isProjectFilter, setisProjectFilter] = useState(false)

    const typeDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const filter=localStorage.getItem("projectFilters")||localStorage.getItem("taskFilters");

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

    return (
        <>
            <div className="flex items-center justify-end mx-4 my-3 text-sm">
                <div className="flex items-center gap-3 divide-x divide-gray-400">
                    { addType !== "Issues" && (
                    <div className="cursor-pointer" ref={typeDropdownRef}>
                        <div className="relative">
                            <button
                                className="text-sm flex items-center justify-between gap-2"
                                onClick={() => {
                                    // Disable dropdown for Milestone
                                    if (selectedType !== "Gantt") setIsTypeOpen(!isTypeOpen);
                                }}
                                disabled={selectedType === "Gantt"}
                                style={selectedType === "Gantt" ? { cursor: "not-allowed", marginRight: "12px" } : {}}
                            >
                                {selectedType === "Kanban" ? (
                                    <ChartNoAxesColumn
                                        size={20}
                                        className="rotate-180 text-[#C72030]"
                                    />
                                ) : selectedType === "List" ? (
                                    <List size={20} className="text-[#C72030]" />
                                ) : selectedType === "Gantt" ? (
                                    <ChartNoAxesGantt
                                        size={20}
                                        className="rotate-180 text-[#C72030]"
                                    />
                                ) : (
                                    <ChartNoAxesGantt
                                        size={20}
                                        className="text-[#C72030]"
                                    />
                                )}
                                <span className="text-[#C72030]">{selectedType}</span>
                                {/* Hide down arrow if Milestone */}
                                {selectedType !== "Gantt" && <span>▾</span>}
                            </button>

                            {/* Only show dropdown if not Milestone */}
                            {isTypeOpen && selectedType !== "Gantt" && (
                                <ul className="absolute left-0 mt-2 w-[150px] bg-white border border-gray-300 shadow-xl rounded-md z-10">
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedType("Kanban");
                                                setIsTypeOpen(false);
                                                setIsSidebarOpen(false)
                                            }}
                                        >
                                            <ChartNoAxesColumn
                                                size={18}
                                                className="rotate-180 text-[#C72030]"
                                            />{" "}
                                            Kanban
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedType("List");
                                                setIsTypeOpen(false);
                                            }}
                                        >
                                            <List size={20} className="text-[#C72030]" /> List
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100 flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedType("Gantt");
                                                setIsTypeOpen(false);
                                            }}
                                        >
                                            <ChartNoAxesGantt size={20} className="text-[#C72030]" />
                                            Gantt
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                    )}   

                    {addType !== "Milestone" && (
                        <div
                            className="flex items-center gap-1 cursor-pointer pl-4"
                            onClick={() =>
                                addType === "Project"
                                    ? setisProjectFilter(true)
                                    : setIsFilterModalOpan(true)
                            }
                        >
                            <Filter size={18} className={`${filter?'fill-[#C72030] text-[#C72030]':'text-gray-600'}`} />
                        </div>
                    )}


                    {addType !== "Milestone" && (
                        <div
                            className="flex items-center gap-1 cursor-pointer pl-4"
                            ref={statusDropdownRef}
                        >
                            <div className="relative">
                                <button
                                    className="text-[13px] flex items-center justify-between gap-2"
                                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                                >
                                    <span className="text-[#C72030]">{selectedStatus}</span>
                                    <span>▾</span>
                                </button>

                                {isStatusOpen && (
                                    <ul className="absolute left-0 mt-2 w-[150px] bg-white border border-gray-300 shadow-xl rounded-md z-10">
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100"
                                                onClick={() => {
                                                    setSelectedStatus("On Hold");
                                                    setIsStatusOpen(false);
                                                }}
                                            >
                                                On Hold
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100"
                                                onClick={() => {
                                                    setSelectedStatus("Completed");
                                                    setIsStatusOpen(false);
                                                }}
                                            >
                                                Completed
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            addType === "Sprint"
                                ? setIsSprintModalOpen(true)
                                : addType === "Project"
                                    ? setIsAddProjectModalOpen(true)
                                    : addType === "Milestone"
                                        ? setIsAddMilestoneModalOpen(true):
                                    addType === "Issues"?
                                        setIsAddIssueModalOpen(true)
                                        : setIsModalOpen(true);
                        }}
                        className="text-[12px] flex items-center justify-center gap-1 bg-red text-white px-3 py-2 w-40"
                    >
                        <Plus size={18} />{" "}
                        {addType === "Sprint"
                            ? "Add Sprint"
                            : addType === "Project"
                                ? "Add Project"
                                : addType === "Milestone"
                                    ? "Add Milestone"
                                    : addType === "Issues"
                                        ? "Add Issue": 
                                    "Add Task"}
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

            {isFilterModalOpan && (
                <TaskFilter
                    isModalOpen={isFilterModalOpan}
                    setIsModalOpen={setIsFilterModalOpan}
                />
            )}

            {isSprintModalOpen && (
                <AddSprintModal
                    isModalOpen={isSprintModalOpen}
                    setIsModalOpen={setIsSprintModalOpen}
                />
            )}
            {isProjectFilter && context === "Projects" && (
                <ProjectFilterModal
                    isModalOpen={isProjectFilter}
                    setIsModalOpen={setisProjectFilter}
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
