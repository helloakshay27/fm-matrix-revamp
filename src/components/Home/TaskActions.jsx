import {
    ChartNoAxesColumn,
    ChartNoAxesGantt,
    Filter,
    List,
    Plus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AddTaskModal from "./Task/AddTaskModal";
import TaskFilterModal from "./Task/TaskFilterModal";
import AddSprintModal from "./Sprints/AddSprintModal";
import AddMilestoneModal from "../../Milestone/AddMilestoneModal";
import AddProjectTemplate from "./Projects/AddProjectTempelateModal";

const TaskActions = ({ selectedType, setSelectedType, addType, setIsSidebarOpen }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isFilterModalOpan, setIsFilterModalOpan] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false); // State for Milestone modal
    const [selectedStatus, setSelectedStatus] = useState("Status");

    const typeDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

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
                    <div className="cursor-pointer" ref={typeDropdownRef}>
                        <div className="relative">
                            <button
                                className="text-sm flex items-center justify-between gap-2"
                                onClick={() => setIsTypeOpen(!isTypeOpen)}
                            >
                                {selectedType === "Kanban" ? (
                                    <ChartNoAxesColumn
                                        size={20}
                                        className="rotate-180 text-[#C72030]"
                                    />
                                ) : selectedType === "List" ? (
                                    <List size={20} className="text-[#C72030]" />
                                ) : selectedType === "Milestone" ? (
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
                                <span>▾</span>
                            </button>

                            {isTypeOpen && (
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
                    <div
                        className="flex items-center gap-1 cursor-pointer pl-4"
                        onClick={() => addType !== "Sprint" && setIsFilterModalOpan(true)}
                    >
                        <Filter size={18} className="text-gray-600" />
                    </div>
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
                    <button
                        onClick={() => {
                            addType === "Sprint"
                                ? setIsSprintModalOpen(true)
                                : addType === "Project"
                                    ? setIsAddProjectModalOpen(true)
                                    : addType === "Milestone"
                                        ? setIsAddMilestoneModalOpen(true)
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

            {isFilterModalOpan && (
                <TaskFilterModal
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
        </>
    );
};

export default TaskActions;
