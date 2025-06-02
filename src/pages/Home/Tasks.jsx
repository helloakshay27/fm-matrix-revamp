import { useEffect, useState } from 'react';
import TaskActions from '../../components/Home/TaskActions.jsx';
import BoardsSection from '../../components/Home/BoardsSection.jsx';
import TasksList from '../../components/Home/Task/TasksList.jsx';

const Tasks = ({ setIsSidebarOpen }) => {
    const [selectedType, setSelectedType] = useState(() => {
        return localStorage.getItem("selectedTaskType") || "List";
    });

    useEffect(() => {
        localStorage.setItem("selectedTaskType", selectedType);
    }, [selectedType]);

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <h3 className="text-[11px] text-gray-400 mx-6 my-4">Project 1 / Milestone / Task</h3>
            <hr className="border border-gray-200" />

            <TaskActions
                setIsSidebarOpen={setIsSidebarOpen}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                addType={"Task"}
                context="Tasks"
            />

            {
                selectedType === "Kanban" ? (
                    <BoardsSection section={"Tasks"} />
                ) : selectedType === "List" ? (
                    <TasksList />
                ) : <></>
            }
        </div>
    );
};

export default Tasks;
