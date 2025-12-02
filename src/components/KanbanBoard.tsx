import { ArrowLeftToLine } from "lucide-react";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

const KanbanBoard = ({ color, add, title, count = 0, children, className, onDrop }: { color: string, add: boolean, title: string, count?: number, children?: React.ReactNode, className?: string, onDrop?: (data: any, status: string) => void }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const columnStatus = title.toLowerCase().replace(/\s+/g, "_");

    const { setNodeRef, isOver } = useDroppable({
        id: `kanban-${title.toLowerCase().replace(/\s+/g, "-")}`,
        data: {
            title: columnStatus,
            type: "KANBAN_COLUMN"
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`bg-[#DEE6E8] h-full ${isCollapsed ? "min-w-[4rem]" : "min-w-[250px]"} rounded-[5px] px-2 py-3 flex flex-col gap-4 transition-all duration-200 ${isOver ? "ring-2 ring-blue-500 bg-blue-50" : ""} ${className}`}
        // style={
        //     window.location.pathname === '/sprint'
        //         ? { minWidth: isCollapsed ? '4rem' : '250px', maxWidth: !isCollapsed && "250px" }
        //         : { minWidth: isCollapsed && "4rem", maxWidth: !isCollapsed && "20%" }
        // }
        >
            <div
                className={`w-full relative transition-transform duration-200 ${isCollapsed ? "rotate-90" : "rotate-0"}`}
            >
                <h3
                    className={`text-white py-2 px-4 rounded-[5px] text-xs w-max z-10 transition-all duration-200 ${isCollapsed ? "absolute top-[-15px] left-[60px]" : "static"
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