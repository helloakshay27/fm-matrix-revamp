import { useDrop } from "react-dnd";

const DependancyKanbanBoard = ({ children, title, onDrop }) => {
    const [, dropRef] = useDrop(() => ({
        accept: ["TASK", "SUBTASK"],
        drop: (item) => {
            if (onDrop) {
                onDrop(item, title); // Pass the full item
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
    );
};

export default DependancyKanbanBoard;