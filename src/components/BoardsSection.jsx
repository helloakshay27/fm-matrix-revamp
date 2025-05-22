import { useState } from "react";
import Boards from "./Boards";
import TaskCard from "./TaskCard";
import ProjectCard from "./ProjectCard";
import Xarrow from "react-xarrows";
import { cardsTitle, projects as initialProjects } from "../data/Data";
import TaskSubCard from "./TaskSubCard";

const BoardsSection = ({ tasks, section }) => {
    const [subCardVisibility, setSubCardVisibility] = useState({});
    const [taskData, setTaskData] = useState(tasks);
    const [projects, setProjects] = useState(initialProjects);
    const [arrowLinks, setArrowLinks] = useState([]);

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

    // NEW: Handle multiple arrow toggle per task
    const handleLink = (sourceId, targetIds = []) => {
        if (targetIds.length === 0) return;

        setArrowLinks((prevLinks) => {
            const areAllLinksActive = targetIds.every((targetId) =>
                prevLinks.some(link => link.sourceId === sourceId && link.targetId === targetId)
            );

            if (areAllLinksActive) {
                // Remove all current arrows from this task
                return prevLinks.filter(
                    link => !(link.sourceId === sourceId && targetIds.includes(link.targetId))
                );
            } else {
                // Add missing arrows
                const newLinks = targetIds
                    .filter(targetId => !prevLinks.some(link => link.sourceId === sourceId && link.targetId === targetId))
                    .map(targetId => ({ sourceId, targetId }));
                return [...prevLinks, ...newLinks];
            }
        });
    };

    return (
        <div className="relative">
            <div className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap" style={{ height: "75vh" }}>
                {cardsTitle.map((card) => {
                    const filteredTasks = taskData.filter(
                        (task) => task.status === card.title
                    );
                    const filteredProjects = projects.filter(
                        (project) => project.status === card.title
                    );

                    return (
                        <Boards
                            key={card.id}
                            add={card.add}
                            color={card.color}
                            count={
                                section === "Tasks"
                                    ? filteredTasks.length
                                    : filteredProjects.length
                            }
                            title={card.title}
                            onDrop={handleDrop}
                        >
                            {section === "Tasks" ? (
                                filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => {
                                        const taskId = `task-${task.id}`;
                                        const dependsOnArr = Array.isArray(task.dependsOn)
                                            ? task.dependsOn
                                            : task.dependsOn
                                                ? [task.dependsOn]
                                                : [];

                                        const formattedDependsOn = dependsOnArr.map(dep => `task-${dep}`);

                                        // Determine if all dependencies are linked (for icon color)
                                        const allLinked = formattedDependsOn.length > 0 &&
                                            formattedDependsOn.every(depId =>
                                                arrowLinks.some(link => link.sourceId === taskId && link.targetId === depId)
                                            );

                                        return (
                                            <div key={task.id} id={taskId} className="relative">
                                                <TaskCard
                                                    task={task}
                                                    toggleSubCard={() => toggleSubCard(task.id)}
                                                    handleLink={() => {
                                                        handleLink(taskId, formattedDependsOn);
                                                    }}
                                                    iconColor={allLinked ? "#DA2400" : "#A0A0A0"}
                                                />
                                                {task.subtasks.map((subtask) => (
                                                    <TaskSubCard
                                                        key={subtask.id}
                                                        subtask={subtask}
                                                        isVisible={subCardVisibility[task.id] || false}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <img
                                        src="/draganddrop.svg"
                                        alt="svg"
                                        className="w-full"
                                    />
                                )
                            ) : (
                                filteredProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        id={`project-${project.id}`}
                                        className="relative"
                                    >
                                        <ProjectCard project={project} />
                                    </div>
                                ))
                            )}
                        </Boards>
                    );
                })}
            </div>

            {/* Xarrows */}
            {arrowLinks.map((link, index) => (
                <Xarrow
                    key={`${link.sourceId}-${link.targetId}`}
                    start={link.sourceId}
                    end={link.targetId}
                    strokeWidth={1.5}
                    headSize={6}
                    curveness={0.3}
                    color="#DA2400"
                    lineColor="#DA2400"
                    showHead={true}
                    dashness={false}
                    path="smooth"
                    // zIndex={1000 + index} // ensures higher layer for newer arrows
                    // labels={
                    //     <div className="text-xs text-red-700 bg-white p-1 rounded shadow">
                    //         {`${link.sourceId.replace('task-', '')} ➜ ${link.targetId.replace('task-', '')}`}
                    //     </div>
                    // }
                    className="custom-xarrow"
                />
            ))}

        </div>
    );
};

export default BoardsSection;
