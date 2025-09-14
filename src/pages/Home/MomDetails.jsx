import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDownCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMomDetails } from "../../redux/slices/momSlice";
import MomTasks from "../../components/Home/MOM/MomTasks";
import MomAttachments from "../../components/Home/MOM/MomAttachments";

function formatToDDMMYYYY_AMPM(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert hour 0 to 12
    hours = String(hours).padStart(2, '0');

    return `${day} /${month}/${year} ${hours}:${minutes} ${ampm}`;
}

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 76) + 180;
    const g = Math.floor(Math.random() * 76) + 180;
    const b = Math.floor(Math.random() * 76) + 180;
    return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const MomDetails = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const secondContentRef = useRef(null);

    const { fetchMomDetails: mom } = useSelector((state) => state.fetchMomDetails);

    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [tab, setTab] = useState("Tasks");

    useGSAP(() => {
        gsap.set(secondContentRef.current, { height: "auto" });
    }, []);

    const toggleSecondCollapse = () => {
        if (isSecondCollapsed) {
            gsap.to(secondContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(secondContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
        setIsSecondCollapsed(!isSecondCollapsed);
    };

    useEffect(() => {
        dispatch(fetchMomDetails({ token, id }))
    }, [dispatch])

    return (
        <div className='m-4'>
            <div className="px-4 pt-1">
                <h2 className="text-[15px] p-3 px-0">
                    <span className=" mr-3">M-{mom.id}</span>
                    <span>{mom.title}</span>
                </h2>

                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                <div className="flex items-center justify-between my-3 text-[12px]">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Created By : Atharv</span>

                        <span className="h-6 w-[1px] border border-gray-300"></span>

                        <span className="flex items-center gap-3">
                            Created On : {formatToDDMMYYYY_AMPM(mom.created_at)}
                        </span>
                    </div>

                </div>
                <div className="border-b-[3px] border-grey my-3 "></div>

                <div className="border rounded-md shadow-custom p-5 mb-4">
                    <div
                        className="font-[600] text-[16px] flex items-center gap-4"
                        onClick={toggleSecondCollapse}
                    >
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"
                                } transition-transform`}
                        />{" "}
                        Details
                    </div>

                    <div className="mt-3 overflow-hidden " ref={secondContentRef}>
                        <div className="flex flex-col">
                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Date of Meeting :
                                    </div>
                                    <div className="text-left text-[12px]">{formatToDDMMYYYY_AMPM(mom.meeting_date)}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Participants :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        <div className="flex items-center">
                                            {mom.mom_attendees?.map((member, index) => (
                                                <div
                                                    key={index}
                                                    title={member.name}
                                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-gray-800 cursor-pointer ${index !== 0 ? "-ml-[6px]" : ""
                                                        }`}
                                                    style={{ backgroundColor: getRandomColor() }}
                                                >
                                                    {member.name ? member.name.charAt(0) : ""}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Meeting Type:
                                    </div>
                                    <div className="text-left text-[12px]">{mom.meeting_type}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Meeting Mode :
                                    </div>
                                    <div className="text-left text-[12px]">{mom.meeting_mode}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-10">
                            {["Tasks", "Attachments"].map((item, idx) => (
                                <div
                                    key={item}
                                    id={idx + 1}
                                    className={`text-[14px] font-[400] ${tab === item ? "selected" : "cursor-pointer"
                                        }`}
                                    onClick={() => setTab(item)}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

                    <div>
                        {tab == "Tasks" && <MomTasks tasks={mom.mom_tasks} />}
                        {tab == "Attachments" && <MomAttachments attachments={mom.attachments} id={mom.id} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MomDetails