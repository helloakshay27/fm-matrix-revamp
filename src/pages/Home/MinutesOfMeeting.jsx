import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { momTabs } from "../../data/Data";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoM } from "../../redux/slices/momSlice";

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 76) + 180;
    const g = Math.floor(Math.random() * 76) + 180;
    const b = Math.floor(Math.random() * 76) + 180;
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const MinutesOfMeeting = () => {
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { fetchMoM: mom } = useSelector(state => state.fetchMoM)

    const [activeTab, setActiveTab] = useState(momTabs[0].id);

    useEffect(() => {
        dispatch(fetchMoM({ token }))
    }, [dispatch])

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

            <div className="flex items-center justify-end mx-8 my-5 text-sm">
                <button className="text-[12px] flex items-center justify-center gap-2 bg-red text-white px-3 py-2 w-40" onClick={() => navigate("/new-mom")}>
                    <Plus size={18} />{" "}
                    New MoM
                </button>
            </div>

            <div className="text-[14px] font-light mx-8">
                <div className="overflow-x-auto rounded-md border border-gray-300">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-4">MoM id</th>
                                <th className="px-4 py-4 w-[25%]">Minutes Title</th>
                                <th className="px-4 py-4">Date Of Meeting</th>
                                <th className="px-4 py-4 w-[15%]">Organizer</th>
                                <th className="px-4 py-4">Meeting Mode</th>
                                <th className="px-4 py-4">Participants</th>
                                <th className="px-4 py-4">Agenda Items</th>
                                <th className="px-4 py-4">Action Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [...mom].reverse().map(item => (
                                    <tr>
                                        <td className="p-4">{item.id}</td>
                                        <td className="p-4">{item.title}</td>
                                        <td style={{ padding: "1rem" }}>{item.meeting_date?.split("T")[0]}</td>
                                        <td className="p-4">John Doe</td>
                                        <td className="p-4">{item.meeting_mode}</td>
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                {item.mom_attendees?.map((member, index) => (
                                                    <div
                                                        key={index}
                                                        title={member.name}
                                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-gray-800 cursor-pointer ${index !== 0 ? "-ml-[6px]" : ""}`}
                                                        style={{ backgroundColor: getRandomColor() }}
                                                    >
                                                        {member.name ? member.name.charAt(0) : ""}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">Meeting 1</td>
                                        <td className="p-4">Meeting 1</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default MinutesOfMeeting