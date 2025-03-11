import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeftToLine, Plus } from "lucide-react";
import { useRef, useState } from "react";

const Boards = ({ color, add, title, count, children, className }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const cardRef = useRef(null);
    const titleRef = useRef(null);
    const btnRef = useRef(null);

    useGSAP(() => {
        gsap.to(cardRef.current, {
            width: isCollapsed ? "4rem" : "25%",
            duration: 0.2,
        });

        gsap.to(titleRef.current, {
            position: isCollapsed ? "absolute" : "",
            top: isCollapsed ? -15 : "0",
            left: isCollapsed ? 60 : "",
        });

        gsap.to(btnRef.current, {
            position: isCollapsed ? "absolute" : "",
            top: isCollapsed ? -11 : "0",
            left: isCollapsed ? -20 : "",
            rotate: isCollapsed ? 90 : 0,
        });
    }, [isCollapsed]);

    return (
        <>
            <div
                ref={cardRef}
                className={`w-1/4 bg-[#DEE6E8] h-full rounded-md p-3 flex flex-col gap-14 ${className}`}
            >
                <div
                    className={`w-full relative ${isCollapsed ? "rotate-90" : "rotate-0"
                        }`}
                >
                    <h3
                        ref={titleRef}
                        className="bg-red-500 text-white py-2 px-4 rounded-md text-xs w-max absolute top-0 left-0 z-10"
                        style={{ backgroundColor: color }}
                    >
                        {count} {title}
                    </h3>

                    <div className="flex items-center gap-2 absolute top-0 right-0">
                        {add && !isCollapsed && (
                            <button className="bg-white p-1 rounded-md shadow-md">
                                <Plus size={15} className="text-[#E95420]" />
                            </button>
                        )}
                        <button
                            ref={btnRef}
                            className="bg-white p-1 rounded-md shadow-md"
                            onClick={() => {
                                setIsCollapsed(!isCollapsed);
                            }}
                        >
                            <ArrowLeftToLine size={15} className="text-[#E95420]" />
                        </button>
                    </div>
                </div>

                <div className="h-full overflow-y-auto no-scrollbar">
                    {children
                        ? !isCollapsed && children
                        : !isCollapsed && <img src="/draganddrop.svg" alt="svg" />}
                </div>
            </div>
        </>
    );
};

export default Boards;
