import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { projects, tabs } from "../../data/Data";
import TaskActions from "../../components/Home/TaskActions";
import ProjectList from "../../components/Home/Projects/ProjectList";
import BoardsSection from "../../components/Home/BoardsSection";
import { useNavigate } from "react-router-dom";
import IssuesTable from "../../components/Home/Issues/Table";
import ProjectTemplates from "../Setup/ProjectTemplates";
const Projects = ({ setIsSidebarOpen }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [activeTabLabel, setActiveTabLabel] = useState(tabs[0].id);
    const [selectedType, setSelectedType] = useState(
        "List");
    const [filters, setFilters] = useState({});

    const tabRefs = useRef({});
    const underlineRef = useRef(null);
    const navigate = useNavigate();

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
                        onClick={() => {
                            setActiveTab(tab.id);
                            setActiveTabLabel(tab.id);
                        }}
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

            <TaskActions
                setIsSidebarOpen={setIsSidebarOpen}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                addType={activeTabLabel === "active_projects" ? "Project" : activeTabLabel}
                setFilters={setFilters}
                filters={filters}
                context={"Projects"}
            />

            {activeTab === tabs[0].id && (
                <>
                    {selectedType === "List" ? (
                        <ProjectList />
                    ) : (
                        <BoardsSection section={"Projects"} />
                    )}
                </>
            )}

            {
                activeTab === tabs[1].id && (
                    <ProjectTemplates />
                )
            }
            {
                activeTab === tabs[2].id && (
                    <div>Tempelate</div>
                )
            }
            {/* {
                activeTab === tabs[3].id && selectedType === "List" && (
                    <IssuesTable />
                )
            } */}
        </div>
    );
};

export default Projects;