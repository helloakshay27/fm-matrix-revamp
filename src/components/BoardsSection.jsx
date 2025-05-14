import { useState } from "react";
import Boards from "./Boards";
import TaskCard from "./TaskCard";
import TaskSubCard from "./TaskSubCard";
import { cardsTitle, projects } from "../data/Data";
import ProjectCard from "./ProjectCard";

const BoardsSection = ({ tasks, section }) => {
    const [subCardVisibility, setSubCardVisibility] = useState({});

    const toggleSubCard = (taskId) => {
        setSubCardVisibility((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    return (
        <div className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
            {cardsTitle.map((card) => {
                const filteredTasks = tasks.filter(task => task.status === card.title);
                return (
                    <Boards
                        key={card.id}
                        add={card.add}
                        color={card.color}
                        count={section === "Tasks" ? filteredTasks.length : 0}
                        title={card.title}
                        className="flex items-start justify-start"
                    >
                        {
                            section === "Tasks" ? (
                                tasks.filter(task => task.status === card.title).length > 0 ? (
                                    tasks
                                        .filter(task => task.status === card.title)
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
                                projects.filter(project => project.status === card.title).length > 0 ? (
                                    projects
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