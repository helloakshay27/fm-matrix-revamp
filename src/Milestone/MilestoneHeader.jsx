import React, { useEffect } from "react";
import { Filter } from "lucide-react"; // Importing a filter icon from lucide-react
import TaskActions from "../components/Home/TaskActions";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetails } from "../redux/slices/projectSlice";

const MilestoneHeader = () => {
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const dispatch = useDispatch();

    const { fetchProjectDetails: project } = useSelector(state => state.fetchProjectDetails)

    useEffect(() => {
        dispatch(fetchProjectDetails({ token, id }))
    }, [dispatch])

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <h3 className="text-[11px] text-gray-400 mx-6 my-4">{project.title} / Milestones</h3>
            <hr className="border border-gray-200" />

            {/* <div className="relative flex items-center mx-3 mt-3 mb-0 gap-10 text-sm">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        ref={(el) => (tabRefs.current[tab.id] = el)}
                        className={`relative cursor-pointer pb-3 ${activeTab === tab.id ? "text-[#E95420]" : "text-gray-600"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
                <div
                    ref={underlineRef}
                    className="absolute bottom-0 h-[2px] bg-[#E95420]"
                />
            </div>

            <hr className="border border-gray-200" /> */}

            <TaskActions selectedType={"Gantt"} setSelectedType={"Gantt"} addType={"Milestone"} />


        </div>
    );
};

export default MilestoneHeader;