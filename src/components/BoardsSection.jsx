import { useState } from "react";
import Boards from "./Boards";
import TaskCard from "./TaskCard";
import TaskSubCard from "./TaskSubCard";
import { cardsTitle, projects as initialProjects } from "../data/Data";
import ProjectCard from "./ProjectCard";

const BoardsSection = ({ tasks, section }) => {
    const [subCardVisibility, setSubCardVisibility] = useState({});
    const [taskData, setTaskData] = useState(tasks);
    const [projects, setProjects] = useState(initialProjects)

    const toggleSubCard = (taskId) => {
        setSubCardVisibility((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const handleDrop = (item, newStatus) => {
        const { type, id, fromTaskId } = item;

        if (type === "TASK") {
            setTaskData((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, status: newStatus } : task
                )
            );
        } else if (type === "SUBTASK") {
            setTaskData((prev) =>
                prev.map((task) =>
                    task.id === fromTaskId
                        ? {
                            ...task,
                            subtasks: task.subtasks.map((subtask) =>
                                subtask.id === id ? { ...subtask, status: newStatus } : subtask
                            ),
                        }
                        : task
                )
            );
        } else if (type === "PROJECT") {
            setProjects((prev) =>
                prev.map((project) =>
                    project.id === id ? { ...project, status: newStatus } : project
                )
            );
        }
    };

    return (
        <div className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
            {cardsTitle.map((card) => {
                const filteredTasks = taskData.filter(task => task.status === card.title);
                const filteredProjects = projects.filter(project => project.status === card.title);
                return (
                    <Boards
                        key={card.id}
                        add={card.add}
                        color={card.color}
                        count={section === "Tasks" ? filteredTasks.length : filteredProjects.length}
                        title={card.title}
                        className="flex items-start justify-start"
                        onDrop={handleDrop}
                    >
                        {
                            section === "Tasks" ? (
                                filteredTasks.length > 0 ? (
                                    filteredTasks
                                        .map((task) => (
                                            <div key={task.id} className="w-full">
                                                <TaskCard
                                                    task={task}
                                                    toggleSubCard={() => toggleSubCard(task.id)}
                                                />
                                                {task.subtasks.map((subtask) => (
                                                    <TaskSubCard
                                                        key={subtask.id}
                                                        subtask={subtask}
                                                        isVisible={subCardVisibility[task.id] || false}
                                                    />
                                                ))}
                                            </div>
                                        ))
                                ) : (
                                    <img src="/draganddrop.svg" alt="svg" className="w-full" />
                                )
                            ) : (
                                filteredProjects.length > 0 ? (
                                    filteredProjects
                                        .filter(project => project.status === card.title)
                                        .map((project) => (
                                            <ProjectCard key={project.id} project={project} />
                                        ))
                                ) : (
                                    <img src="/draganddrop.svg" alt="svg" className="w-full" />
                                )
                            )
                        }
                    </Boards>
                )
            })}
        </div>
    );
};

export default BoardsSection;