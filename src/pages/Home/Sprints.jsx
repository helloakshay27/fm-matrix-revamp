import { useState } from "react";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import TaskActions from "../../components/Home/TaskActions";
import SprintBoardSection from "../../components/Home/Sprints/SprintBoardSection";
import SprintsTable from "../../components/Home/Sprints/Table";

const Sprints = () => {
    const [selectedType, setSelectedType] = useState("Kanban");

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mx-6 mt-3 mb-2">
                <h3 className="text-base">
                    Sprint Planning
                </h3>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 divide-x divide-gray-400">
                        <div className="text-[11px]">
                            Created by: Chetan Bafna
                        </div>
                        <div className="text-[11px] flex items-center gap-1 pl-3 cursor-pointer">
                            <Edit3 size={10} />
                            Edit Sprint
                        </div>
                        <div className="text-[11px] flex items-center gap-1 pl-3 cursor-pointer">
                            <Trash2 className="mb-[2px]" size={10} />
                            Delete Sprint
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[13px] text-[#E95420] cursor-pointer">
                        <ArrowLeft size={13} color="#000" />
                        Back
                    </div>
                </div>
            </div>
            <hr className="border border-gray-200" />

            <TaskActions
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                addType={"Sprint"}
            />

            <hr className="border border-gray-200" />

            <div className="flex items-center justify-between mx-4 mt-3 mb-2 gap-2">
                <select className="border border-gray-300 rounded-none p-2 text-[14px] w-full">
                    <option value="Kanban">Kanban</option>
                    <option value="Table">Table</option>
                </select>
                <select className="border border-gray-300 rounded-none p-2 text-[14px] w-full">
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                </select>
                <select className="border border-gray-300 rounded-none p-2 text-[14px] w-full">
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                </select>
                <button className="bg-[#C72030] text-white rounded-none p-2 text-[14px] w-[30rem]">
                    Search
                </button>
            </div>

            {
                selectedType === 'Kanban' ? <SprintBoardSection /> : <SprintsTable />
            }
        </div>
    );
};

export default Sprints;
