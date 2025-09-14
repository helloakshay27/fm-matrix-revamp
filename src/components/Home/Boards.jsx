import { useGSAP } from "@gsap/react";
import { ArrowLeftToLine, Plus } from "lucide-react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useDrop } from "react-dnd";

const Boards = ({ color, add, title, count = 0, children, className, onDrop }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const cardRef = useRef(null);
    const titleRef = useRef(null);
    const btnRef = useRef(null);

    const [, dropRef] = useDrop(() => ({
        accept: ["TASK", "SUBTASK", "PROJECT"], // Accept drag items of these types
        drop: (item) => {
            if (onDrop) {
                // Safely extract type, id, and fromTaskId from item
                const dropItem = {
                    type: item.type || "TASK",
                    id: item.id,
                    fromTaskId: item.fromTaskId
                };
                const formattedTitle = title.toLowerCase().replace(/\s+/g, "_");
                // console.log("Dropped item:", dropItem, "on title:", formattedTitle);
                // Call the provided onDrop handler with the item and target status
                onDrop(dropItem, formattedTitle); // 'title' likely represents the drop zone's status (e.g., "To Do", "In Progress")
            }
        }
    }));
    useGSAP(() => {
        gsap.to(cardRef.current, {
            width: isCollapsed ? "4rem" : "20%",
            duration: 0.2,
        });

        gsap.to(titleRef.current, {
            position: isCollapsed ? "absolute" : "static",
            top: isCollapsed ? -15 : 0,
            left: isCollapsed ? 60 : 0,
            duration: 0.2,
        });

        gsap.to(btnRef.current, {
            position: isCollapsed ? "absolute" : "static",
            top: isCollapsed ? -11 : 0,
            left: isCollapsed ? -20 : 0,
            rotate: isCollapsed ? 90 : 0,
            duration: 0.2,
        });
    }, [isCollapsed]);

    return (
        <div
            ref={(el) => {
                cardRef.current = el;
                dropRef(el);
            }}
            className={`bg-[#DEE6E8] h-full rounded-md px-2 py-3 flex flex-col gap-4 ${className}`}
            style={
                window.location.pathname === '/sprint'
                    ? { minWidth: isCollapsed ? '4rem' : '250px', maxWidth: !isCollapsed && "250px" }
                    : { minWidth: isCollapsed && "4rem", maxWidth: !isCollapsed && "20%" }
            }
        >
            <div
                className={`w-full relative ${isCollapsed ? "rotate-90" : "rotate-0"}`}
            >
                <h3
                    ref={titleRef}
                    className="text-white py-2 px-4 rounded-md text-xs w-max z-10"
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
                        ref={btnRef}
                        className="bg-white p-1 rounded-md shadow-md"
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
};

export default Boards;