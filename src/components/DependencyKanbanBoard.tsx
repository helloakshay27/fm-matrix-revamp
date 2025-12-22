import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DependencyKanbanBoardProps {
    children: ReactNode;
    title: string;
    onDrop?: (item: any, title: string) => void;
}

const DependencyKanbanBoard = ({ children, title, onDrop }: DependencyKanbanBoardProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: title,
        data: {
            type: "KANBAN_COLUMN",
            title: title,
            onDrop: onDrop,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`bg-[#DEE6E8] h-[400px] min-h-[400px] rounded-[5px] p-2 flex flex-col gap-4 w-[25%] min-w-[20%] transition-colors ${isOver ? "bg-blue-100" : ""
                }`}
        >
            <div className="w-full px-1 text-[12px] font-semibold text-gray-700">
                {title}
            </div>
            <div className="h-full overflow-y-auto no-scrollbar w-full">{children}</div>
        </div>
    );
};

export default DependencyKanbanBoard;
