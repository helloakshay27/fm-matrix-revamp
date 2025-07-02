import { useEffect, useState } from "react";
import DependancyBoardCard from "../Home/DependancyBoardCard";
import DependancyKanbanBoard from "../Home/DependancyKanbanBoard";
import { useDispatch, useSelector } from 'react-redux';
import { createDependancy, fetchTasksOfMilestone, updateDependancy } from "../../redux/slices/taskSlice";

const DependancyKanban = () => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    const { fetchTasksOfMilestone: tasks = [] } = useSelector(state => state.fetchTasksOfMilestone);
    const { taskDetails: task } = useSelector(state => state.taskDetails);

    const [taskData, setTaskData] = useState([]);

    useEffect(() => {
        if (task?.milestone_id) {
            dispatch(fetchTasksOfMilestone({ token, id: task.milestone_id }));
        }
    }, [dispatch, task?.milestone_id]);

    useEffect(() => {
        if (tasks.length > 0 && task?.id) {
            const predecessorIds = (task?.predecessor_task || []).flat();
            const successorIds = (task?.successor_task || []).flat();

            const updatedData = tasks.map(t => {
                if (t.id === task.id) {
                    return { ...t, section: "Main Task" };
                } else if (predecessorIds.includes(t.id)) {
                    return { ...t, section: "Predecessor" };
                } else if (successorIds.includes(t.id)) {
                    return { ...t, section: "Successor" };
                } else {
                    return { ...t, section: "List of Tasks" };
                }
            });

            setTaskData(updatedData);
        }
    }, [tasks, task]);

    const handleDrop = async (item, newStatus) => {
        const { id: draggedTaskId } = item;

        setTaskData(prev =>
            prev.map(task =>
                task.id === draggedTaskId ? { ...task, section: newStatus } : task
            )
        );

        if (["Predecessor", "Successor"].includes(newStatus) && task?.id) {
            const payload = {
                task_dependency: {
                    task_id: task.id,
                    dependent_task_id: draggedTaskId,
                    active: true,
                    project_management_id: task.project_management_id,
                    dependence_type: newStatus,
                },
            };

            const dependancyId = task?.task_dependencies?.find(d => d.dependent_task_id === draggedTaskId)?.id;

            const predecessorIds = (task?.predecessor_task || []).flat();
            const successorIds = (task?.successor_task || []).flat();

            const alreadyPredecessor = predecessorIds.includes(draggedTaskId);
            const alreadySuccessor = successorIds.includes(draggedTaskId);

            if (alreadyPredecessor || alreadySuccessor) {
                dispatch(updateDependancy({ token, id: dependancyId, payload }));
            } else {
                dispatch(createDependancy({ token, payload }));
            }
        }
    };

    return (
        <div className="min-h-[400px] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap">
            {
                ["List of Tasks", "Predecessor", "Main Task", "Successor"].map(card => {
                    const filteredTasks = taskData.filter(task => task.section === card);

                    const isDropDisabled = card === "Main Task" || card === "List of Tasks";
                    const dropHandler = isDropDisabled ? () => { } : handleDrop;

                    return (
                        <DependancyKanbanBoard title={card} onDrop={dropHandler} key={card}>
                            {
                                filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => (
                                        <div key={task.id} className="w-full">
                                            <DependancyBoardCard task={task} draggable={card !== "Main Task"} />
                                        </div>
                                    ))
                                ) : <img src="/draganddrop.svg" alt="svg" className="w-full" />
                            }
                        </DependancyKanbanBoard>
                    );
                })
            }
        </div>
    );

};

export default DependancyKanban;