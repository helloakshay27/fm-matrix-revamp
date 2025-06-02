import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import SprintBoardSection from "../../components/Home/Sprints/SprintBoardSection";

const Sprints = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState("Select Project");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (!dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (projectName) => {
        setSelectedProject(projectName);
        setIsOpen(false);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mx-6 mt-3 mb-2">
                <h3 className="text-base">
                    Sprint Planning
                </h3>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-[13px] text-[#E95420] cursor-pointer">
                        <ArrowLeft size={13} color="#000" />
                        Back
                    </div>
                </div>
            </div>
            <hr className="border border-gray-200" />

            <div className="flex items-center justify-end mx-4 mt-3 mb-2 gap-2">
                <div className="w-[30rem] relative" ref={dropdownRef}>
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex justify-between select-none items-center w-full border px-4 py-2 cursor-pointer text-sm bg-white"
                    >
                        <span>{selectedProject}</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>

                    {isOpen && (
                        <div className="absolute top-full left-0 w-full bg-white shadow-md p-4 border rounded-sm z-10 mt-2">
                            {/* Search Input */}
                            <div className="flex items-center border px-3 py-2 mb-4">
                                <Search className="w-4 h-4 text-red-600 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search project..."
                                    className="w-full text-sm outline-none"
                                    disabled
                                />
                            </div>

                            <div className="text-sm space-y-3">
                                <div
                                    className="cursor-pointer hover:text-red-600"
                                    onClick={() => handleSelect("Project Management Revamp")}
                                >
                                    Project Management Revamp
                                </div>
                                <hr />
                                <div
                                    className="cursor-pointer hover:text-red-600"
                                    onClick={() => handleSelect("Kalpataru customer app : Post sales")}
                                >
                                    Kalpataru customer app : Post sales
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button className="bg-[#C72030] text-white rounded-none p-2 text-[14px] w-36">
                    Search
                </button>
            </div>

            <SprintBoardSection />
        </div>
    );
};

export default Sprints;
