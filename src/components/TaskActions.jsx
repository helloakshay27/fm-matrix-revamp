import {
    ArrowLeftToLine,
    ChartNoAxesColumn,
    ChartNoAxesGantt,
    Filter,
    List,
    Plus,
    Search,
} from "lucide-react";
import { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import TaskFilterModal from "./TaskFilterModal";
import AddSprintModal from "./AddSprintModal";

const TaskActions = ({ selectedType, setSelectedType, addType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isFilterModalOpan, setIsFilterModalOpan] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("Status");

    return (
        <>
            <div className="flex items-center justify-between mx-3 my-3 text-sm">
                <div className="flex items-center gap-3 divide-x divide-gray-400">
                    <div className="flex items-center gap-1 cursor-pointer">
                        <div className="relative">
                            <button
                                className="text-sm flex items-center justify-between gap-2"
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                            >
                                <span className="text-[#E95420]">{selectedStatus}</span>
                                <span>&#9662;</span>
                            </button>

                            {isStatusOpen && (
                                <ul className="absolute left-0 mt-2 w-[150px] bg-white border border-gray-300 shadow-xl rounded-md z-10">
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
                    <div className="cursor-pointer pl-3">
                        <div className="relative">
                            <button
                                className="text-sm flex items-center justify-between gap-2"
                                onClick={() => setIsTypeOpen(!isTypeOpen)}
                            >
                                {selectedType === "Kanban" ? (
                                    <ChartNoAxesColumn
                                        size={20}
                                        className="rotate-180 text-[#E95420]"
                                    />
                                ) : selectedType === "List" ? (
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
                                                setSelectedType("Kanban");
                                                setIsTypeOpen(false);
                                            }}
                                        >
                                            <ChartNoAxesColumn
                                                size={20}
                                                className="rotate-180 text-[#E95420]"
                                            />{" "}
                                            Kanban
                                        </button>
                                    </li>
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
                        <Search size={20} className="text-gray-600" />
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer pl-3" onClick={() => addType !== "Sprint" && setIsFilterModalOpan(true)}>
                        <Filter size={20} className="text-gray-600" />
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer pl-3">
                        <ArrowLeftToLine size={20} className={`text-[#E95420]`} />
                    </div>
                </div>
                <button
                    onClick={() => {
                        addType === "Sprint" ? setIsSprintModalOpen(true) : setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1 bg-[#E95420] text-white px-4 py-2 rounded-full w-52"
                >
                    <Plus /> Add Task
                </button>
            </div>

            {isModalOpen && (
                <AddTaskModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            )}

            {
                isFilterModalOpan && (
                    <TaskFilterModal
                        isModalOpen={isFilterModalOpan}
                        setIsModalOpen={setIsFilterModalOpan}
                    />
                )
            }

            {
                isSprintModalOpen && (
                    <AddSprintModal
                        isModalOpen={isSprintModalOpen}
                        setIsModalOpen={setIsSprintModalOpen}
                    />
                )
            }
        </>
    );
};

export default TaskActions;
