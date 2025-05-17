import { useRef, useState } from "react";
import EditProjectModal from "../components/EditProjectModal";
import TaskActions from "../components/TaskActions";
import ProjectList from "../components/ProjectList";
import BoardsSection from "../components/BoardsSection";
import { projects, tabs } from "../data/Data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const tasks = [
    {
        id: 23123,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 23125,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 23925,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 93125,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
]

const Projects = ({ setIsSidebarOpen }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [selectedType, setSelectedType] = useState("List")
    const [isEdit, setIsEdit] = useState(false)

    const tabRefs = useRef({});
    const underlineRef = useRef(null);

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
            <div className="relative flex items-center mx-6 mt-3 mb-0 gap-10 text-sm">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        ref={(el) => (tabRefs.current[tab.id] = el)}
                        className={`relative cursor-pointer text-[12px] pb-3 ${activeTab === tab.id ? "text-[#C72030]" : "text-gray-600"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
                <div
                    ref={underlineRef}
                    className="absolute bottom-0 h-[2px] bg-[#C72030]"
                />
            </div>

            <hr className="border border-gray-200" />

            <TaskActions setIsSidebarOpen={setIsSidebarOpen} selectedType={selectedType} setSelectedType={setSelectedType} addType={"Project"} />

            {
                selectedType === 'List' ? (
                    <ProjectList tasks={tasks} setIsEdit={setIsEdit} />
                ) : (
                    <BoardsSection tasks={projects} section={"Projects"} />
                )
            }


            {
                isEdit && (
                    <EditProjectModal
                        isModalOpen={isEdit}
                        setIsModalOpen={setIsEdit}
                    />
                )
            }
                 
        </div>
    )
}

export default Projects