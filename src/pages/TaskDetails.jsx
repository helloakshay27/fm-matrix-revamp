import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
    ChevronDown,
    ChevronDownCircle,
    LucideShoppingBag,
    MoreHorizontal,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const TaskDetails = () => {
    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("comments");
    const tabs = [
        { id: "comments", label: "Comments" },
        { id: "subtasks", label: "Subtasks" },
        { id: "attachments", label: "Attachements" },
        { id: "dependency", label: "Dependency" },
    ];
    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);

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
            <Link to="">Task Management</Link> {">"}{" "}
            <span className="text-[#E95420]">Task Details</span>
            <div className="px-4 pt-4">
                <h2 className="text-[30px]">
                    <span className="text-[#006BA4]">#XXXX</span> Design Task Management
                    Web Screens
                </h2>

                <div className="flex items-center justify-between my-3">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>By Kshitij Rasal</span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-3">
                            {" "}
                            <LucideShoppingBag color="#E95420" size={18} />
                            Internal Products
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-2 cursor-pointer">
                            Open <ChevronDown />
                        </span>
                    </div>
                    <MoreHorizontal color="#E95420" className="cursor-pointer" />
                </div>

                <div className="border rounded-md shadow-custom p-5 mb-4">
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
                    <p ref={firstContentRef} className="ms-12 mt-3 overflow-hidden">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                        explicabo ad facilis ratione consectetur repellat laboriosam, velit
                        est, nesciunt officia earum aperiam dolorum, error illo assumenda
                        dolore iure pariatur vel molestias nostrum eum quaerat eaque
                        corporis? Aut minus fugit fugiat eveniet, cumque non, esse
                        asperiores eos iure ipsa reiciendis nobis?
                    </p>
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
                        Task Information
                    </div>

                    <div className="mt-3 overflow-hidden" ref={secondContentRef}>
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    Priority :
                                </div>
                                <div className="text-left text-[14px]">High</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-start gap-3">
                                <div className="text-right">Observers :</div>
                                <div className="text-left flex items-center gap-1">
                                    <span className="h-6 w-6 flex items-center justify-center bg-blue-900 text-white rounded-full text-[8px] font-light">
                                        AK
                                    </span>
                                    <span className="h-6 w-6 flex items-center justify-center bg-blue-900 text-white rounded-full text-[8px] font-light">
                                        AK
                                    </span>
                                </div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    Assign To :
                                </div>
                                <div className="text-left text-[14px]">Devesh Jain</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-start gap-3">
                                <div className="text-right">Created On :</div>
                                <div className="text-left flex items-center gap-4">
                                    28/01/2023 <span>15:35</span>
                                </div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    Due Date :
                                </div>
                                <div className="text-left text-[14px]">30/01/2023</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-start gap-3">
                                <div className="text-right">Tags :</div>
                                <div className="text-left flex items-center gap-4">
                                    <div className="flex items-center flex-wrap">
                                        <span className="tag">
                                            <span>Web Pages</span>
                                        </span>
                                        <span className="tag">
                                            <span>FM Matrix</span>
                                        </span>
                                        <span className="tag">
                                            <span>Hisociety</span>
                                        </span>
                                        <span className="tag">
                                            <span>Hisociety</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    Start Date :
                                </div>
                                <div className="text-left text-[14px]">15/01/2023</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-start gap-3">
                                <div className="text-right">Special Initiative :</div>
                                <div className="text-left flex items-center gap-4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border rounded-md shadow-custom p-5 mb-4">
                    <div className="flex items-center gap-10">
                        {tabs.map((tab) => (
                            <span
                                key={tab.id}
                                className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#E95420] ${activeTab === tab.id ? "after:block" : "after:hidden"
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </span>
                        ))}
                    </div>

                    <div className="mt-6">
                        {activeTab === "comments" && (
                            <div className="flex items-start justify-between gap-3">
                                <span className="h-10 w-10 bg-[#019E78] rounded-full p-3 text-white flex items-center justify-center">
                                    KR
                                </span>
                                <form className="w-full">
                                    <textarea
                                        rows={7}
                                        className="border focus:outline-none p-3 rounded-md w-full"
                                    ></textarea>
                                    <div className="flex items-center justify-end gap-4 mt-2">
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center bg-[#E95420] text-white px-4 py-2 rounded-full w-52"
                                        >
                                            Save Comment
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center justify-center border border-[#E95420] px-4 py-2 rounded-full w-40"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "subtasks" && (
                            <div className="overflow-x-auto bg-white border">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Id
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r w-[30rem]">
                                                Task Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Assignee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Start Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Due Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Priority
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                xxxx
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                Design Task Management Web Screens
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                Open
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                {" "}
                                                <span className="h-6 w-6 flex items-center justify-center bg-blue-900 text-white rounded-full text-[8px] font-light">
                                                    AK
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                15/01/2023
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                30/01/2023
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                High
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === "attachments" && (
                            <div className="my-12">
                                <p className="text-[16px]">No Documents Associated</p>
                                <p className="text-[#DFDFDF] text-[14px] mt-3 mb-5">Drop or attach relevant documents here</p>
                                <button
                                    type="button"
                                    className="flex items-center justify-center bg-[#E95420] text-white px-4 py-2 rounded-full w-52"
                                >
                                    Save Comment
                                </button>
                            </div>
                        )}
                        {activeTab === "dependency" && (
                            <div className="overflow-x-auto bg-white border">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Id
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r w-[30rem]">
                                                Task Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Assignee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Start Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Due Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                Priority
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                                Predecessor Tasks
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
