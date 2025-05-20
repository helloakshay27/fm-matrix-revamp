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
import SubtaskTable from "../../components/Task/Modals/subtaskTable";
import DependancyKanban from "../../components/DependancyKanban";

const Status = () => {
    return (
        <div className="overflow-x-auto w-full">
            <div className="flex items-start p-5 gap-5 bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg text-[12px] my-3 min-w-[800px]">
                <div className="flex flex-col gap-2">
                    <span><i>Chetan Bafna <span className="text-[#C72030]">added</span> task</i></span>
                    <span><i>01 Jan 2025 09:30 AM</i></span>
                </div>

                <div>
                    <h1 className="text-[12px] text-center  w-[200px]">1 hr 23 mins 10 sec</h1>
                    <img src="/arrow.png" alt="arrow" />
                </div>
                <div className="flex flex-col gap-2">
                    <span><i>Chetan Bafna <span className="text-[#C72030]">added</span> task</i></span>
                    <span><i>01 Jan 2025 09:30 AM</i></span>
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

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const handleAddComment = () => {
        console.log(comment);
        if (comment) {
            setComments([...comments, comment]);
            setComment("");
            console.log(comments);
        }
    }
    const handleCancelComment = () => {
        setComment("");
    }

    return (
        <div className="text-[14px] flex flex-col gap-2">
            <div className="flex justify-start m-2 gap-5">
                <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white  text-center p-1.5">
                    <span className="">CB</span>
                </div>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-[95%] h-[70px] bg-[#F2F4F4] p-2 border-2 b-[#DFDFDF]" placeholder="Add comment here. Type @ to mentions users. Type # to mention tags"></textarea>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="bg-red text-white h-[30px] px-3 cursor-pointer p-1 mr-2" onClick={handleAddComment}>Add Comment</button>
                <button className="border-2 border-[#C72030] h-[30px] cursor-pointer p-1 px-3" onClick={handleCancelComment}>Cancel</button>
            </div>
            {comments.map((comment) => {

                return (
                    <div className="relative flex justify-start m-2 gap-5">
                        <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white  text-center p-1.5">
                            <span className="">CB</span>
                        </div>
                        <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
                            <h1 className="font-bold">Chetan Bafna</h1>
                            <span>{comment}</span>
                            <div className="flex gap-2 text-[10px]">
                                <span>DD/MM/YYYY HH:MM</span>
                                <span>Edit</span>
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

const Attachments = () => {
    return (
        <div className="flex justify-start flex-col gap-3 p-5 text-[14px] mt-2">
            <span>No Documents Attahced</span>
            <span className="text-[#C2C2C2]">Drop or attach relevant documents here</span>
            <button className="bg-[#C72030] h-[40px] w-[240px] text-white px-5">Attach Files</button>
        </div>
    );
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
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    Responsible Person  :
                                </div>
                                <div className="text-left text-[12px]">Sohail Ansari</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]]">
                                    Priority :
                                </div>
                                <div className="text-left text-[12px]">High</div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    Start Date :
                                </div>
                                <div className="text-left text-[12px]">30/01/2023</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    MileStones :
                                </div>
                                <div className="text-left text-[12px]">0/1</div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    End Date :
                                </div>
                                <div className="text-left text-[12px]"> - </div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-semibold">
                                    Tags :
                                </div>
                                <div className="text-left text-[12px] flex items-start gap 2">
                                    {["Newtask", "FM Matrix"].map((item) => {
                                        return (
                                            <div className="border-2  border-[#E95420] rounded-full p-2 text-[12px] mx-2">
                                                {item}
                                            </div>
                                        );
                                    })}


                                </div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    Duration :
                                </div>
                                <div className="text-left text-[#029464] text-[12px]">00d : 00h : 30m</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-semibold">
                                    Observer :
                                </div>
                                <div className="text-left text-[12px] flex items-start gap 2">
                                    {["Chetan Bafna", "Mahendra Lungare"].map((item) => {
                                        return (
                                            <div className="border-2  border-[#E95420] rounded-full p-2 text-[12px] mx-2">
                                                {item}
                                            </div>
                                        );
                                    })}


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between my-3" >
                        <div className="flex items-center gap-10">
                            {
                                ["Subtasks", "Dependency", "Comments", "Attachments", "Activity Log"].map((tabName, index) => (
                                    <div
                                        key={index}
                                        id={index + 1}
                                        className={`text-[14px] font-[400] ${tab === tabName ? "selected" : "cursor-pointer"}`}
                                        onClick={() => setTab(tabName)}
                                    >
                                        {tabName}
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

                    <div>
                        {tab == "Subtasks" && <SubtaskTable />}
                        {tab == "Dependency" && <DependancyKanban />}
                        {tab == "Comments" && <Comments />}
                        {tab == "Attachments" && <Attachments />}
                        {tab == "Activity Log" && <Status />}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default TaskDetails;
