import { useRef, useState } from "react";
import { tabs } from "../data/Data";
import { useGSAP } from "@gsap/react";
import { ArrowLeftToLine, Plus } from "lucide-react";
import gsap from "gsap";
import TaskActions from "../components/TaskActions";

const Sprints = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [selectedType, setSelectedType] = useState("Kanban");
    const [isOpenCardCollapsed, setIsOpenCardCollapsed] = useState(false);
    const [isProgressCardCollapsed, setIsProgressCardCollapsed] = useState(false);
    const [isHoldCardCollapsed, setIsHoldCardCollapsed] = useState(false);
    const [isSprintCardCollapsed, setIsSprintCardCollapsed] = useState(false);

    const tabRefs = useRef({});
    const underlineRef = useRef(null);
    const openCardRef = useRef(null);
    const progressCardRef = useRef(null);
    const openTitleRef = useRef(null);
    const progressTitleRef = useRef(null);
    const openBtnRef = useRef(null);
    const progressBtnRef = useRef(null);
    const holdCardRef = useRef(null);
    const holdBtnRef = useRef(null);
    const holdTitleRef = useRef(null);
    const sprintBtnRef = useRef(null);
    const sprintTitleRef = useRef(null);
    const sprintCardRef = useRef(null);

    useGSAP(() => {
        gsap.to(openCardRef.current, {
            width: isOpenCardCollapsed ? "4rem" : "20%",
            duration: 0.2,
        });

        gsap.to(progressCardRef.current, {
            width: isProgressCardCollapsed ? "4rem" : "20%",
            duration: 0.2,
        });

        gsap.to(holdCardRef.current, {
            width: isHoldCardCollapsed ? "4rem" : "20%",
            duration: 0.2,
        });

        gsap.to(sprintCardRef.current, {
            width: isSprintCardCollapsed ? "4rem" : "40%",
            duration: 0.2,
        });

        gsap.to(openTitleRef.current, {
            position: isOpenCardCollapsed ? "absolute" : "",
            top: isOpenCardCollapsed ? -15 : "0",
            left: isOpenCardCollapsed ? 60 : "",
        });

        gsap.to(holdTitleRef.current, {
            position: isHoldCardCollapsed ? "absolute" : "",
            top: isHoldCardCollapsed ? -15 : "0",
            left: isHoldCardCollapsed ? 60 : "",
        });

        gsap.to(progressTitleRef.current, {
            position: isProgressCardCollapsed ? "absolute" : "",
            top: isProgressCardCollapsed ? -15 : "0",
            left: isProgressCardCollapsed ? 60 : "",
        });

        gsap.to(sprintTitleRef.current, {
            position: isSprintCardCollapsed ? "absolute" : "",
            top: isSprintCardCollapsed ? -15 : "0",
            left: isSprintCardCollapsed ? 60 : "",
        });

        gsap.to(openBtnRef.current, {
            position: isOpenCardCollapsed ? "absolute" : "",
            top: isOpenCardCollapsed ? -11 : "0",
            left: isOpenCardCollapsed ? -20 : "",
            rotate: isOpenCardCollapsed ? 90 : 0,
        });

        gsap.to(progressBtnRef.current, {
            position: isProgressCardCollapsed ? "absolute" : "",
            top: isProgressCardCollapsed ? -11 : "0",
            left: isProgressCardCollapsed ? -20 : "",
            rotate: isProgressCardCollapsed ? 90 : 0,
        });

        gsap.to(holdBtnRef.current, {
            position: isHoldCardCollapsed ? "absolute" : "",
            top: isHoldCardCollapsed ? -11 : "0",
            left: isHoldCardCollapsed ? -20 : "",
            rotate: isHoldCardCollapsed ? 90 : 0,
        });

        gsap.to(sprintBtnRef.current, {
            position: isSprintCardCollapsed ? "absolute" : "",
            top: isSprintCardCollapsed ? -11 : "0",
            left: isSprintCardCollapsed ? -20 : "",
            rotate: isSprintCardCollapsed ? 90 : 0,
        });
    }, [
        isOpenCardCollapsed,
        isProgressCardCollapsed,
        isHoldCardCollapsed,
        isSprintCardCollapsed,
    ]);

    useGSAP(() => {
        if (tabRefs.current[activeTab] && underlineRef.current) {
            const tab = tabRefs.current[activeTab];
            const { offsetLeft, offsetWidth } = tab;

            gsap.to(underlineRef.current, {
                left: offsetLeft,
                width: offsetWidth,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, [activeTab]);

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <h3 className="font-semibold text-base mx-3 mt-3 mb-2">
                Internal Product
            </h3>
            <hr className="border border-gray-200" />

            <div className="relative flex items-center mx-3 mt-3 mb-0 gap-10 text-sm">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        ref={(el) => (tabRefs.current[tab.id] = el)}
                        className={`relative cursor-pointer pb-3 ${activeTab === tab.id ? "text-[#E95420]" : "text-gray-600"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
                <div
                    ref={underlineRef}
                    className="absolute bottom-0 h-[2px] bg-[#E95420]"
                />
            </div>

            <hr className="border border-gray-200" />

            <TaskActions
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                addType={"Sprint"}
            />

            <hr className="border border-[#E95420]" />

            <div className="h-[80%] mx-3 my-3 flex items-start gap-1">
                <div
                    ref={openCardRef}
                    className={`w-[20%] bg-[#DEE6E8] h-full rounded-md p-3 flex flex-col gap-14 items-start justify-start`}
                >
                    <div
                        className={`w-full relative ${isOpenCardCollapsed ? "rotate-90" : "rotate-0"
                            }`}
                    >
                        <h3
                            ref={openTitleRef}
                            className="bg-red-500 text-white py-2 px-4 rounded-md text-xs w-max absolute top-0 left-0 z-10"
                            style={{ backgroundColor: "#E4636A" }}
                        >
                            0 Open
                        </h3>

                        <div className="flex items-center gap-2 absolute top-0 right-0">
                            {!isOpenCardCollapsed && (
                                <button className="bg-white p-1 rounded-md shadow-md">
                                    <Plus size={15} className="text-[#E95420]" />
                                </button>
                            )}
                            <button
                                ref={openBtnRef}
                                className="bg-white p-1 rounded-md shadow-md"
                                onClick={() => {
                                    setIsOpenCardCollapsed(!isOpenCardCollapsed);
                                }}
                            >
                                <ArrowLeftToLine size={15} className="text-[#E95420]" />
                            </button>
                        </div>
                    </div>

                    <div className="h-full overflow-y-auto no-scrollbar">
                        {!isOpenCardCollapsed && <img src="/draganddrop.svg" alt="svg" />}
                    </div>
                </div>
                <div
                    ref={progressCardRef}
                    className={`w-[20%] bg-[#DEE6E8] h-full rounded-md p-3 flex flex-col gap-14 items-start justify-start`}
                >
                    <div
                        className={`w-full relative ${isProgressCardCollapsed ? "rotate-90" : "rotate-0"
                            }`}
                    >
                        <h3
                            ref={progressTitleRef}
                            className="bg-red-500 text-white py-2 px-4 rounded-md text-xs w-max absolute top-0 left-0 z-10"
                            style={{ backgroundColor: "#08AEEA" }}
                        >
                            0 In Progress
                        </h3>

                        <div className="flex items-center gap-2 absolute top-0 right-0">
                            {!isProgressCardCollapsed && (
                                <button className="bg-white p-1 rounded-md shadow-md">
                                    <Plus size={15} className="text-[#E95420]" />
                                </button>
                            )}
                            <button
                                ref={progressBtnRef}
                                className="bg-white p-1 rounded-md shadow-md"
                                onClick={() => {
                                    setIsProgressCardCollapsed(!isProgressCardCollapsed);
                                }}
                            >
                                <ArrowLeftToLine size={15} className="text-[#E95420]" />
                            </button>
                        </div>
                    </div>

                    <div className="h-full overflow-y-auto no-scrollbar">
                        {!isProgressCardCollapsed && (
                            <img src="/draganddrop.svg" alt="svg" />
                        )}
                    </div>
                </div>
                <div
                    ref={holdCardRef}
                    className={`w-[20%] bg-[#DEE6E8] h-full rounded-md p-3 flex flex-col gap-14 items-start justify-start`}
                >
                    <div
                        className={`w-full relative ${isHoldCardCollapsed ? "rotate-90" : "rotate-0"
                            }`}
                    >
                        <h3
                            ref={holdTitleRef}
                            className="bg-red-500 text-white py-2 px-4 rounded-md text-xs w-max absolute top-0 left-0 z-10"
                            style={{ backgroundColor: "#7BD2B5" }}
                        >
                            0 Hold
                        </h3>

                        <div className="flex items-center gap-2 absolute top-0 right-0">
                            {!isHoldCardCollapsed && (
                                <button className="bg-white p-1 rounded-md shadow-md">
                                    <Plus size={15} className="text-[#E95420]" />
                                </button>
                            )}
                            <button
                                ref={holdBtnRef}
                                className="bg-white p-1 rounded-md shadow-md"
                                onClick={() => {
                                    setIsHoldCardCollapsed(!isHoldCardCollapsed);
                                }}
                            >
                                <ArrowLeftToLine size={15} className="text-[#E95420]" />
                            </button>
                        </div>
                    </div>

                    <div className="h-full overflow-y-auto no-scrollbar">
                        {!isHoldCardCollapsed && <img src="/draganddrop.svg" alt="svg" />}
                    </div>
                </div>

                <div
                    ref={sprintCardRef}
                    className={`w-[40%] bg-[#DEE6E8] h-full rounded-md p-3 flex flex-col gap-14 items-start justify-start`}
                >
                    <div
                        className={`w-full relative ${isSprintCardCollapsed ? "rotate-90" : "rotate-0"
                            }`}
                    >
                        <h3
                            ref={sprintTitleRef}
                            className="py-2 px-4 rounded-md w-max absolute top-0 left-0 z-10"
                        >
                            Sprints
                        </h3>

                        <div className="flex items-center gap-2 absolute top-0 right-0">
                            <button
                                ref={sprintBtnRef}
                                className="bg-white p-1 rounded-md shadow-md"
                                onClick={() => {
                                    setIsSprintCardCollapsed(!isSprintCardCollapsed);
                                }}
                            >
                                <ArrowLeftToLine size={15} className="text-[#E95420]" />
                            </button>
                        </div>
                    </div>

                    <div className="h-full overflow-y-auto no-scrollbar">
                        {!isSprintCardCollapsed && (
                            <div class="rounded-[2px] border border-dashed border-[#8C8C8C] bg-[#F9F9F9] blank p-8 mt-3">
                                <p className="text-[#8C8C8C] text-center text-[13px] font-[300]">
                                    {" "}
                                    Tap here or on + Create Sprint to create a sprint. Add tasks
                                    from Open / In Progress / On Hold and drop them in the created
                                    sprint.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sprints;
