// const ProjectDetailsPage = () => {
//     return (
//         <div>ProjectDetailsPage</div>
//     )
// }

// export default ProjectDetailsPage


import { ChevronDown, ChevronDownCircle, PencilIcon, Trash2 } from "lucide-react";
import { Fragment, useRef, useState } from "react";

const Members = ({ allNames, projectOwner }) => {
    return (
        <div className="flex items-start p-4 bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg text-[12px] my-3">
            <div className="left-name-container w-35 flex-shrink-0 pr-4 py-2 my-auto mx-auto">
                <span className="text-gray-700">{projectOwner}</span>
            </div>
            <div className="divider w-px bg-pink-500 self-stretch mx-4"></div>
            <div className="names-grid-container flex-grow overflow-x-auto">
                <div
                    className="
                  grid grid-flow-col grid-rows-3 auto-cols-min gap-x-8 gap-y-2 py-2
                "
                >
                    {allNames.map((name, index) => (
                        <span key={index} className="text-gray-600 whitespace-nowrap">
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const STATUS_COLORS = {
    active: "bg-[#88D760] text-white",
    "in progress": "bg-[#88D760] text-white",
    "on hold": "bg-[#FFC107] text-black",
    overdue: "bg-[#FF5B5B] text-white",
    completed: "bg-[#D6D6D6] text-black",
};

const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours) parts.push(`${hours} hr`);
    if (minutes) parts.push(`${minutes} mins`);
    if (seconds || parts.length === 0) parts.push(`${seconds} sec`);
    return parts.join(" ");
};

const Attachments = ({ attachments }) => {
    return (
        <div className="flex flex-col gap-3 p-5">
            {attachments.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
                        {attachments.map((file, index) => (
                            <div
                                key={index}
                                className="border rounded p-2 flex flex-col items-center justify-center text-center shadow-sm bg-white relative"
                            >
                                <Trash2
                                    size={20}
                                    color="#C72030"
                                    className="absolute top-2 right-2 cursor-pointer"
                                />

                                <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
                                    {file.isImage ? (
                                        <img src={file.url} alt={file.name} className="object-contain h-full" />
                                    ) : file.isPdf ? (
                                        <span className="text-red-600 font-bold">PDF</span>
                                    ) : file.isWord ? (
                                        <span className="text-blue-600 font-bold">DOC</span>
                                    ) : file.isExcel ? (
                                        <span className="text-green-600 font-bold">XLS</span>
                                    ) : (
                                        <span className="text-gray-500 font-bold">FILE</span>
                                    )}
                                </div>

                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={file.name}
                                    className="text-xs text-blue-700 hover:underline truncate w-full"
                                    title={file.name}
                                >
                                    {file.name}
                                </a>
                            </div>
                        ))}
                    </div>

                    <button
                        className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4"
                    >
                        Attach Files <span className="text-[10px]">( Max 10 MB )</span>
                    </button>
                </>
            ) : (
                <div className="text-[14px] mt-2">
                    <span>No Documents Attached</span>
                    <div className="text-[#C2C2C2]">Drop or attach relevant documents here</div>
                    <button
                        className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4"
                    >
                        Attach Files <span className="text-[10px]">( Max 10 MB )</span>
                    </button>
                </div>
            )}
        </div>
    );
};

const ProjectDetails = () => {
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [tab, setTab] = useState("Member");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const secondContentRef = useRef(null);

    const staticProject = {
        id: "86",
        title: "efd",
        created_by_name: "Tejas Chaudharry",
        created_at: "2025-09-15T19:30:00Z",
        status: "active",
        project_owner_name: "Ubaid Hashmat",
        priority: "High",
        project_type_name: "Real Estate",
        completed_milestone_count: 0,
        total_milestone_count: 0,
        completed_task_management_count: 0,
        total_task_management_count: 0,
        completed_issues_count: 0,
        total_issues_count: 0,
        start_date: "2025-09-15",
        end_date: "2025-09-17",
        attachments: [
            { id: 1, name: "document1.pdf", url: "#", isPdf: true, isImage: false, isWord: false, isExcel: false },
            { id: 2, name: "image1.jpg", url: "#", isPdf: false, isImage: true, isWord: false, isExcel: false },
        ],
    };

    const staticMembers = ["Deepak yadav", "Vinayak"];
    const [selectedOption, setSelectedOption] = useState("Active");

    const dropdownOptions = ["Active", "In Progress", "On Hold", "Overdue", "Completed"];
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    function formatToDDMMYYYY_AMPM(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = Number(String(hours).padStart(2, "0"));
        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    }

    return (
        <div className="m-4">

            <div className="px-4 pt-1">
                <h2 className="text-[15px] p-3 px-0">
                    <span className="mr-3">Project-{staticProject.id}</span>
                    <span>{staticProject.title}</span>
                </h2>

                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                <div className="flex items-center justify-between my-3 text-[12px]">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Created By : {staticProject.created_by_name}</span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-3">
                            Created On : {formatToDDMMYYYY_AMPM(staticProject.created_at)}
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm text-white bg-[#9CE463]">
                            <div className="relative">
                                <div
                                    className="flex items-center gap-1 cursor-pointer px-2 py-1"
                                >
                                    <span className="text-[13px]">{selectedOption}</span>
                                    <ChevronDown
                                        size={15}
                                    />
                                </div>
                                <ul
                                    className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden hidden`}
                                    style={{
                                        minWidth: "150px",
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                        zIndex: 1000,
                                    }}
                                >
                                    {dropdownOptions.map((option, idx) => (
                                        <li key={idx}>
                                            <button
                                                className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option ? "bg-gray-100 font-semibold" : ""}`}
                                                onClick={() => handleOptionSelect(option)}
                                            >
                                                {option}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <PencilIcon size={15} />
                            <span>Edit Project</span>
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span
                            className="flex items-center gap-1 cursor-pointer"
                        >
                            <Trash2 size={15} />
                            <span>Delete Project</span>
                        </span>
                    </div>
                </div>
                <div className="border-b-[3px] border-grey my-3"></div>

                <div className="border rounded-md shadow-custom p-5 mb-4">
                    <div
                        className="font-[600] text-[16px] flex items-center gap-4"
                        onClick={() => setIsSecondCollapsed(!isSecondCollapsed)}
                    >
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"} transition-transform`}
                        />{" "}
                        Details
                    </div>

                    <div className="mt-3 overflow-hidden" ref={secondContentRef}>
                        <div className="flex flex-col">
                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Project Manager :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {staticProject.project_owner_name}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Priority :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {staticProject.priority}
                                    </div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Project Type:
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {staticProject.project_type_name}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Milestones :
                                    </div>
                                    <div className="text-left text-[12px]">{`${staticProject.completed_milestone_count}/${staticProject.total_milestone_count}`}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Start Date :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {staticProject.start_date}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-semibold">
                                        Tasks :
                                    </div>
                                    <div className="text-left text-[12px]">{`${staticProject.completed_task_management_count}/${staticProject.total_task_management_count}`}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        End Date :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {staticProject.end_date}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Issues :
                                    </div>
                                    <div className="text-left text-[12px]">{`${staticProject.completed_issues_count}/${staticProject.total_issues_count}`}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-10">
                            {["Member", "Documents", "Status", "Issues"].map((item, idx) => (
                                <div
                                    key={item}
                                    className={`text-[14px] font-[400] ${tab === item ? "selected" : "cursor-pointer"}`}
                                    onClick={() => setTab(item)}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

                    <div>
                        {tab === "Member" && (
                            <Members
                                allNames={staticMembers}
                                projectOwner={staticProject.project_owner_name}
                            />
                        )}
                        {tab === "Documents" && (
                            <Attachments attachments={staticProject.attachments} />
                        )}
                        {tab === "Status" && <></>}
                        {tab === "Issues" && <div>Issues Table Placeholder</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;