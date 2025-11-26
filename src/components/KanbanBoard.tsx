import { ArrowLeftToLine } from "lucide-react";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

const KanbanBoard = ({ color, add, title, count = 0, children, className, onDrop }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { setNodeRef } = useDroppable({
        id: `kanban-${title.toLowerCase().replace(/\s+/g, "-")}`,
        data: {
            title: title.toLowerCase().replace(/\s+/g, "_"),
            type: "KANBAN_COLUMN"
        }
    });

    const handleDrop = (event) => {
        if (onDrop) {
            const dropItem = {
                type: event.active.data.current?.type || "TASK",
                id: event.active.id,
                fromTaskId: event.active.data.current?.fromTaskId
            };
            const formattedTitle = title.toLowerCase().replace(/\s+/g, "_");
            onDrop(dropItem, formattedTitle);
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`bg-[#DEE6E8] h-full rounded-md px-2 py-3 flex flex-col gap-4 transition-all duration-200 ${className}`}
            style={
                window.location.pathname === '/sprint'
                    ? { minWidth: isCollapsed ? '4rem' : '250px', maxWidth: !isCollapsed && "250px" }
                    : { minWidth: isCollapsed && "4rem", maxWidth: !isCollapsed && "20%" }
            }
        >
            <div
                className={`w-full relative transition-transform duration-200 ${isCollapsed ? "rotate-90" : "rotate-0"}`}
            >
                <h3
                    className={`text-white py-2 px-4 rounded-md text-xs w-max z-10 transition-all duration-200 ${isCollapsed ? "absolute top-[-15px] left-[60px]" : "static"
                        }`}
                    style={{ backgroundColor: color }}
                >
                    {count} {title}
                </h3>

                <div className="flex items-center gap-2 absolute top-0 right-0">
                    {/* {add && !isCollapsed && (
                        <button className="bg-white p-1 rounded-md shadow-md">
                            <Plus size={15} className="text-[#E95420]" />
                        </button>
                    )} */}
                    <button
                        className={`bg-white p-1 rounded-md shadow-md transition-all duration-200 ${isCollapsed ? "absolute top-[-11px] left-[-20px] rotate-90" : "static rotate-0"
                            }`}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <ArrowLeftToLine size={15} className="text-[#E95420]" />
                    </button>
                </div>
            </div>

            <div className="h-full overflow-y-auto no-scrollbar w-full">
                {!isCollapsed && children}
            </div>
        </div>
    );
}

export default KanbanBoard