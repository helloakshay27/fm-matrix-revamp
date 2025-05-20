import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { momTabs } from "../../data/Data";

const MinutesOfMeeting = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(momTabs[0].id);

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
        <>
            <div className="relative flex items-center mx-6 mt-3 mb-0 gap-10 text-sm">
                {momTabs.map((tab) => (
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

            <div className="flex items-center justify-end mx-4 my-3 text-sm">
                <button className="text-[12px] flex items-center justify-center gap-2 bg-red text-white px-3 py-2 w-40" onClick={() => navigate("/new-mom")}>
                    <Plus size={18} />{" "}
                    New MoM
                </button>
            </div>

            <div className="text-[14px] font-light mx-4">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">MoM id</th>
                                <th className="px-4 py-2 w-[25%]">Minutes Title</th>
                                <th className="px-4 py-2">Date Of Meeting</th>
                                <th className="px-4 py-2 w-[15%]">Organizer</th>
                                <th className="px-4 py-2">Meeting Mode</th>
                                <th className="px-4 py-2">Participants</th>
                                <th className="px-4 py-2">Agenda Items</th>
                                <th className="px-4 py-2">Action Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4">1</td>
                                <td className="p-4">Meeting 1</td>
                                <td style={{ padding: "1rem" }}>2023-06-01</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Online</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Meeting 1</td>
                                <td className="p-4">Meeting 1</td>
                            </tr>
                            <tr>
                                <td className="p-4">1</td>
                                <td className="p-4">Meeting 1</td>
                                <td style={{ padding: "1rem" }}>2023-06-01</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Online</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Meeting 1</td>
                                <td className="p-4">Meeting 1</td>
                            </tr>
                            <tr>
                                <td className="p-4">1</td>
                                <td className="p-4">Meeting 1</td>
                                <td style={{ padding: "1rem" }}>2023-06-01</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Online</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Meeting 1</td>
                                <td className="p-4">Meeting 1</td>
                            </tr>
                            <tr>
                                <td className="p-4">1</td>
                                <td className="p-4">Meeting 1</td>
                                <td style={{ padding: "1rem" }}>2023-06-01</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Online</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Meeting 1</td>
                                <td className="p-4">Meeting 1</td>
                            </tr>
                            <tr>
                                <td className="p-4">1</td>
                                <td className="p-4">Meeting 1</td>
                                <td style={{ padding: "1rem" }}>2023-06-01</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Online</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Meeting 1</td>
                                <td className="p-4">Meeting 1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default MinutesOfMeeting