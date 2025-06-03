import { useDrop } from "react-dnd";

const DependancyKanbanBoard = ({ children, title, onDrop }) => {
    const [, dropRef] = useDrop(() => ({
        accept: "TASK",
        drop: (item) => {
            if (onDrop) {
                onDrop({ type: item.type || "TASK", id: item.id, fromTaskId: item.fromTaskId }, title);
            }
        },
    }));

    return (
        <div ref={dropRef} className="bg-[#DEE6E8] h-[400px] min-h-[400px] rounded-md p-2 flex flex-col gap-4 w-[25%] min-w-[20%]">
            <div className="w-full px-1 text-[12px]">
                {title}
            </div>
            <div className="h-full overflow-y-auto no-scrollbar w-full">
                {children}
            </div>
        </div>
    )
}

export default DependancyKanbanBoard