import { useDrag } from "react-dnd";
import TaskSubCard from "../Task/TaskSubCard";

const DraggableSubTask = ({ subtask, taskId, ItemTypes, isVisible }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.SUBTASK,
        item: { type: ItemTypes.SUBTASK, id: subtask.id, fromTaskId: taskId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <TaskSubCard
                subtask={subtask}
                isVisible={isVisible}
            />
        </div>
    );
};

export default DraggableSubTask;