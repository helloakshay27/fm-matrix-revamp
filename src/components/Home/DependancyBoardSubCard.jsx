import { User2 } from "lucide-react";
import { useDrag } from "react-dnd";

const DependancyBoardSubCard = ({ subtask, isVisible, draggable, item }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "SUBTASK",
        item: { ...item, type: "SUBTASK" },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [item]);

    if (!isVisible) return null;

    return (
        <div
            ref={draggable ? dragRef : null}
            style={{ opacity: isDragging ? 0.5 : 1, cursor: draggable ? "move" : "default" }}
            className={`w-[90%] h-max bg-white p-2 shadow-xl text-sm flex flex-col space-y-3 mb-2 float-right transition-all duration-300 ${isVisible ? "block" : "hidden pointer-events-none"}`}
        >
            <p className="mb-2">
                <span className="text-blue-500">{`T${subtask.parent_id}-S${subtask.id}`}</span> {subtask.title}
            </p>
            <div className="flex items-start gap-2">
                <User2 className="text-[#C72030]" size={15} />
                {/* <span className="text-[11px]">{subtask?.responsible_person?.name || "-"}</span> */}
            </div>
            <hr className="border border-gray-200" />
            <div className="flex items-center justify-end">
                <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1 text-[9px] cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* SVG path remains unchanged */}
                        </svg>
                        <span className="text-[9px] w-max">30 Nov</span>
                    </span>
                    <span className="h-6 w-6 flex items-center justify-center bg-green-600 text-white rounded-full text-[8px] font-light">
                        AT
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DependancyBoardSubCard;