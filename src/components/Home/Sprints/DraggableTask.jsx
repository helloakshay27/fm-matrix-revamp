import { useDrag } from "react-dnd";
import TaskCard from "../Task/TaskCard";

const DraggableTask = ({
    task,
    taskId,
    formattedDependsOn,
    allLinked,
    toggleSubCard,
    handleLink,
    subCardVisibility,
    ItemTypes,
    subTasks
}) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TASK,
        item: { type: ItemTypes.TASK, id: task.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            id={taskId}
            className="relative"
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <TaskCard
                task={task}
                toggleSubCard={() => toggleSubCard(task.id)}
                {...(formattedDependsOn.length > 0 && {
                    handleLink: () => handleLink(taskId, formattedDependsOn),
                    iconColor: allLinked ? "#A0A0A0" : "#DA2400",
                })}
            />
            {subTasks}
        </div>
    );
};

export default DraggableTask;