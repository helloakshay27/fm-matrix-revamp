import { useState } from 'react';
import { tabs } from '../data/Data.js'
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import TaskActions from '../components/TaskActions.jsx';
import BoardsSection from '../components/BoardsSection.jsx';
import TasksList from '../components/TasksList.jsx';

const Home = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [selectedType, setSelectedType] = useState("Kanban");


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
            <h3 className="font-semibold text-base mx-3 mt-3 mb-2">Project Name</h3>
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

            <TaskActions selectedType={selectedType} setSelectedType={setSelectedType} addType={"Task"} />

            <hr className="border border-[#E95420]" />

            {
                selectedType === "Kanban" ? (
                    <BoardsSection />
                ) : selectedType === "List" ? (
                    <TasksList />
                ) : <BoardsSection />
            }
        </div>
    )
}

export default Home