import { useState } from "react";
import { dependancyData } from "../data/Data"
import DependancyBoardCard from "./DependancyBoardCard";
import DependancyKanbanBoard from "./DependancyKanbanBoard"

const DependancyKanban = () => {
    const [taskData, setTaskData] = useState(dependancyData);

    const handleDrop = (item, newStatus) => {
        const { id } = item;

        setTaskData((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, section: newStatus } : task
            )
        );

    };

    return (
        <div className="min-h-[400px] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
            {
                ["List of Tasks", "Predecessor", "Main Task", "Successor"].map(card => {
                    const filteredTasks = taskData.filter(task => task.section === card);
                    return (
                        <DependancyKanbanBoard title={card} onDrop={handleDrop} key={card}>
                            {
                                filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => (
                                        <div key={task.id} className="w-full">
                                            <DependancyBoardCard
                                                task={task}
                                            />
                                        </div>
                                    ))
                                ) : <img src="/draganddrop.svg" alt="svg" className="w-full" />
                            }
                        </DependancyKanbanBoard>
                    )
                })
            }
        </div>
    )
}

export default DependancyKanban