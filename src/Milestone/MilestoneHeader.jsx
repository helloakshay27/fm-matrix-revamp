import React from "react";
import { Filter } from "lucide-react"; // Importing a filter icon from lucide-react

const MilestoneHeader = () => {
    return (
        <div className="p-4">
            {/* Header Section */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
                <div className="text-sm text-gray-500">
                    <span className="font-medium">Project 1</span> / Milestones
                </div>

            </div>

            {/* Button Section */}
            <div className="flex justify-end mt-4 space-x-4">
                <div className="flex items-center space-x-6 px-4 py-2 ">
                    {/* <span className="text-red-500 text-sm cursor-pointer hover:underline">Gantt</span> */}
                    <Filter className="text-gray-500 cursor-pointer hover:text-gray-700" />
                </div>
                <button className="bg-red-500 text-white text-sm px-6 py-2 rounded hover:bg-red-600 flex items-center">
                    + New Milestone
                </button>
            </div>
        </div>
    );
};

export default MilestoneHeader;