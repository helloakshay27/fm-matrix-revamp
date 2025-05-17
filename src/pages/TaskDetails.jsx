import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
    ChevronDown,
    ChevronDownCircle,
    MoreHorizontal,
} from "lucide-react";
import { useRef, useState } from "react";
import SourceIcon from "@mui/icons-material/Source";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SubtaskTable from "../components/Task/Modals/subtaskTable";




const Members = () => {


    const allNames = [
        'Abdul Ghaffar', 'Bilal Shaikh', 'Mahendra Lungare',
        'Komal Shinde', 'Dinesh Shinde', 'Chetan Bafna',
        'Name G', 'Name H', 'Name I',
        'Name J', 'Name K', 'Name L',
    ];

    return (
        <div className="flex items-start p-4 bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg text-[12px] my-3"> {/* Main container with some styling */}
            {/* Left Fixed Item */}
            <div className="left-name-container w-35 flex-shrink-0 pr-4 py-2 my-auto mx-auto"> {/* Fixed width, adjust as needed */}
                <span className="text-gray-700">Anshil Bansari</span>
            </div>

            <div className="divider w-px bg-pink-500 self-stretch mx-4"></div> {/* self-stretch to match height of flex items */}

            <div className="names-grid-container flex-grow overflow-x-auto"> {/* Allows horizontal scrolling for names */}
                <div
                    className="
                  grid grid-flow-col grid-rows-3 auto-cols-min gap-x-8 gap-y-2 py-2
                "
                >
                    {allNames.map((name, index) => (
                        <span key={index} className="text-gray-600 whitespace-nowrap"> {/* whitespace-nowrap if names shouldn't wrap */}
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Status = () => {
    return (
        <div className="overflow-x-auto w-full">
            <div className="flex items-start p-5 gap-5 bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg text-[12px] my-3 min-w-[800px]">
                <div>
                    <button className="bg-[#88D760] py-1 px-4 text-white rounded-[30px] w-[94px] h-[30px] text-[12px]">Active</button>
                </div>

                <div>
                    <h1 className="text-[12px] text-center  w-[200px]">1 hr 23 mins 10 sec</h1>
                    <img src="/arrow.png" alt="arrow" />
                </div>
                <div>
                    <button className="bg-[#D6D6D6] py-1 px-4 rounded-[30px] w-[140px] h-[30px] text-[12px] text-[#000000]">Yet to Complete</button>
                </div>
            </div>
        </div>
    );
}

const Documents = () => {
    return (
        <div>
            <div className="flex items-start gap-2 p-5">
                <SourceIcon />
                <h1 className="text-[#0063AF]">BRD.xls</h1>
            </div>
            <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
        </div>

    )
}


const TaskDetails = () => {
    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);
    const [tab, setTab] = useState("Subtasks");

    useGSAP(() => {
        gsap.set(firstContentRef.current, { height: "auto" });
        gsap.set(secondContentRef.current, { height: "auto" });
    }, []);

    const toggleFirstCollapse = () => {
        if (isFirstCollapsed) {
            gsap.to(firstContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(firstContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
        setIsFirstCollapsed(!isFirstCollapsed);
    };

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

    return (
        <div className="m-4">
            <div className="px-4 pt-1">
                <h2 className="text-[15px] p-3 px-0">
                    <span className=" mr-3">Project-ID</span>
                    <span >Project Name</span>
                </h2>

                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                <div className="flex items-center justify-between my-3 text-[12px]">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Created By : Kshitij Rasal</span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-3">
                            Created On : 01-01-2024 09:00 AM
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex relative items-center gap-2 cursor-pointer px-2 py-1 w-[150px] rounded-md text-sm text-white bg-[#C85E68]">
                            Active <ChevronDown className="absolute right-2" />
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span>
                            <EditOutlinedIcon className="mx-1" sx={{ fontSize: "12px" }} />                       Edit Task
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>

                        <span>
                            <DeleteOutlinedIcon className="mx-1" sx={{ fontSize: "12px" }} />
                            Delete Task
                        </span>
                    </div>
                    <MoreHorizontal color="#E95420" className="cursor-pointer" />
                </div>
                <div className="border-b-[3px] border-grey my-3 "></div>

                <div className="border rounded-md shadow-custom p-5 mb-4 text-[14px]">
                    <div
                        className="font-[600] text-[16px] flex items-center gap-4"
                        onClick={toggleFirstCollapse}
                    >
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"
                                } transition-transform`}
                        />{" "}
                        Description
                    </div>
                    <div className="mt-3 overflow-hidden " ref={firstContentRef}>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus amet quaerat in libero quod esse fugiat praesentium? Reiciendis pariatur officiis provident cupiditate dolor aut, aliquid, perspiciatis quod a quis obcaecati.
                        </p>
                    </div>
                </div>

        

                <div className="border rounded-md shadow-custom p-5 mb-4 bg-[#F7F7F782]">
                    <div
                        className="font-[600] text-[16px] flex items-center gap-4"
                        onClick={toggleSecondCollapse}
                    >
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"
                                } transition-transform`}
                        />
                        Details
                    </div>

                    <div className="mt-3 overflow-hidden" ref={secondContentRef}>
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    Responsible Person :
                                </div>
                                <div className="text-left text-[12px]">Prashant Gajare</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Priority :</div>
                                <div className="text-left text-[12px]">Urgent</div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Start Date :</div>
                                <div className="text-left text-[12px]">25/03/2025</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Identified By :</div>
                                <div className="text-left text-[12px]">Sohail Ansari</div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">End Date :</div>
                                <div className="text-left text-[12px]">26/03/2025</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Tested By :</div>
                                <div className="text-left text-[12px]">-</div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Issue Type :</div>
                                <div className="text-left text-[12px]">Bug</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">QA Status :</div>
                                <div className="text-left text-[12px]">-</div>
                            </div>
                        </div>
                    </div>
                </div>



                <div>
                    <div className="flex items-center justify-between my-3" >
                        <div className="flex items-center gap-10">
                            {tab == "Subtasks" ?
                                <div id={1} className="text-[14px] font-[400] selected" onClick={() => { setTab("Subtasks") }}>Subtasks</div> :
                                <div id={1} className="text-[14px] font-[400] cursor-pointer" onClick={() => { setTab("Subtasks") }}>Subtasks</div>}

                            {tab == "Dependency" ?
                                <div id={2} className="text-[14px] font-[400] selected" onClick={() => { setTab("Dependency") }}>Dependency</div> :
                                <div id={2} className="text-[14px] font-[400]  cursor-pointer" onClick={() => { setTab("Dependency") }}>Dependency</div>}

                            {tab == "Comments" ?
                                <div id={3} className="text-[14px] font-[400] selected" onClick={() => { setTab("Comments") }}>Comments</div> :
                                <div id={3} className="text-[14px] font-[400]  cursor-pointer" onClick={() => { setTab("Comments") }}>Comments</div>}

                            {tab == "Attachments" ?
                                <div id={4} className="text-[14px] font-[400] selected" onClick={() => { setTab("Attachments") }}>Issues</div> :
                                <div id={4} className="text-[14px] font-[400]  cursor-pointer" onClick={() => { setTab("Attachments") }}>Issues</div>}

                            {tab == "Activity Log" ?
                                <div id={5} className="text-[14px] font-[400] selected" onClick={() => { setTab("Activity Log") }}>Activity Log</div> :
                                <div id={5} className="text-[14px] font-[400]  cursor-pointer" onClick={() => { setTab("Activity Log") }}>Activity Log</div>}


                        </div>

                    </div>
                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

                    <div>
                        {tab == "Subtasks" && <SubtaskTable />}
                        {tab == "Documents" && <Documents />}
                        {tab == "Status" && <Status />}
                        {tab == "Issues" && <Issues />}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default TaskDetails;
