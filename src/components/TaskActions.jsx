import {
    ArrowLeftToLine,
    ChartNoAxesColumn,
    ChevronDown,
    Filter,
    Plus,
    Search,
} from "lucide-react";
import { useState } from "react";
import AddTaskModal from "./AddTaskModal";

const TaskActions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between mx-3 my-3 text-sm">
                <div className="flex items-center gap-3 divide-x divide-gray-400">
                    <div className="flex items-center gap-1 cursor-pointer">
                        <span className="text-[#E95420]">Status</span>{" "}
                        <ChevronDown size={15} />
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer pl-3">
                        <ChartNoAxesColumn size={15} className="rotate-180 text-[#E95420]" />
                        <span className="text-[#E95420]">Kanban</span>{" "}
                        <ChevronDown size={15} />
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer pl-3">
                        <Search size={20} className="text-gray-600" />
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer pl-3">
                        <Filter size={20} className="text-gray-600" />
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer pl-3">
                        <ArrowLeftToLine
                            size={20}
                            className={`text-[#E95420]`}
                        />
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-1 bg-[#E95420] text-white px-4 py-2 rounded-full w-52">
                    <Plus /> Add Task
                </button>
            </div>

            {isModalOpen && <AddTaskModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </>
    );
};

export default TaskActions;
