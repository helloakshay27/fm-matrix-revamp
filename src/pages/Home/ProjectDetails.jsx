import gsap from "gsap";
import IssuesTable from "../../components/Home/Issues/Table";
import {
    ChevronDown,
    ChevronDownCircle,
    PencilIcon,
    Trash2,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    changeProjectStatus,
    deleteProject,
    fetchProjectDetails,
    removeAttachment,
} from "../../redux/slices/projectSlice";
import AddProjectModal from "../../components/Home/Projects/AddProjectModal";
import { attachFiles } from "../../redux/slices/projectSlice";
import toast from "react-hot-toast";

const Issues = () => {
    return <IssuesTable />;
};

const Members = ({ allNames, projectOwner }) => {
    return (
        <div className="flex items-start p-4 bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg text-[12px] my-3">
            {" "}
            <div className="left-name-container w-35 flex-shrink-0 pr-4 py-2 my-auto mx-auto">
                {" "}
                <span className="text-gray-700">{projectOwner}</span>
            </div>
            <div className="divider w-px bg-pink-500 self-stretch mx-4"></div>{" "}
            <div className="names-grid-container flex-grow overflow-x-auto">
                {" "}
                <div
                    className="
                  grid grid-flow-col grid-rows-3 auto-cols-min gap-x-8 gap-y-2 py-2
                "
                >
                    {allNames.map((name, index) => (
                        <span key={index} className="text-gray-600 whitespace-nowrap">
                            {" "}
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

const Status = ({ project }) => {
    const logs = [...(project?.project_status_logs || [])].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    return (
        <div className="overflow-x-auto w-full p-4">
            <div className="flex items-center gap-4 min-w-[800px]">
                {logs.map((log, index) => {
                    const nextLog = logs[index + 1];
                    const currentTime = new Date(log.created_at);
                    const nextTime = nextLog ? new Date(nextLog.created_at) : null;
                    const duration = nextTime
                        ? formatDuration(nextTime - currentTime)
                        : null;

                    const normalizedStatus = log.status?.toLowerCase();
                    const badgeStyle =
                        STATUS_COLORS[normalizedStatus] || "bg-gray-400 text-white";

                    return (
                        <Fragment key={log.id}>
                            <span
                                className={`rounded-full px-4 py-1 text-sm font-medium capitalize ${badgeStyle}`}
                            >
                                {log.status}
                            </span>

                            {duration && (
                                <>
                                    <div className="flex flex-col items-center justify-start min-w-[100px]">
                                        <h1 className="text-[9px] text-center">{duration}</h1>
                                        <img src="/arrow.png" alt="arrow" className="mt-1" />
                                    </div>
                                </>
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const Attachments = ({ attachments, id }) => {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const [files, setFiles] = useState(attachments);

    // ✅ Sync files with props
    useEffect(() => {
        setFiles(attachments);
    }, [attachments]);

    const handleAttachFile = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (!selectedFiles.length) return;

        // ✅ Check for file size limit (10MB per file)
        const oversizedFiles = selectedFiles.filter((file) => file.size > 10 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error("Each file must be less than 10MB.");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("project_management[attachments][]", file);
        });

        try {
            await dispatch(attachFiles({ token, id, payload: formData })).unwrap();
            await dispatch(fetchProjectDetails({ token, id })); // ✅ Refetch updated attachments
        } catch (error) {
            console.error("File upload or fetch failed:", error);
            toast.error("File upload failed. Please try again.");
        }
    };

    const removeFile = async (fileId) => {
        try {
            await dispatch(removeAttachment({ token, id, image_id: fileId })).unwrap();
            toast.dismiss();
            toast.success("File removed successfully.");
            await dispatch(fetchProjectDetails({ token, id })); // ✅ Ensure fresh data is loaded
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to remove file. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-3 p-5">
            {files.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
                        {files.map((file, index) => {
                            const fileName = file.document_file_name;
                            const fileUrl = file.document_url;
                            const fileExt = fileName.split(".").pop().toLowerCase();
                            const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExt);
                            const isPdf = fileExt === "pdf";
                            const isWord = ["doc", "docx"].includes(fileExt);
                            const isExcel = ["xls", "xlsx"].includes(fileExt);

                            return (
                                <div
                                    key={index}
                                    className="border rounded p-2 flex flex-col items-center justify-center text-center shadow-sm bg-white relative"
                                >
                                    <Trash2
                                        size={20}
                                        color="#C72030"
                                        className="absolute top-2 right-2 cursor-pointer"
                                        onClick={() => removeFile(file.id)}
                                    />

                                    <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
                                        {isImage ? (
                                            <img src={fileUrl} alt={fileName} className="object-contain h-full" />
                                        ) : isPdf ? (
                                            <span className="text-red-600 font-bold">PDF</span>
                                        ) : isWord ? (
                                            <span className="text-blue-600 font-bold">DOC</span>
                                        ) : isExcel ? (
                                            <span className="text-green-600 font-bold">XLS</span>
                                        ) : (
                                            <span className="text-gray-500 font-bold">FILE</span>
                                        )}
                                    </div>

                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={fileName}
                                        className="text-xs text-blue-700 hover:underline truncate w-full"
                                        title={fileName}
                                    >
                                        {fileName}
                                    </a>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4"
                        onClick={handleAttachFile}
                    >
                        Attach Files{" "}
                        <span className="text-[10px]">( Max 10 MB )</span>
                    </button>
                </>
            ) : (
                <div className="text-[14px] mt-2">
                    <span>No Documents Attached</span>
                    <div className="text-[#C2C2C2]">Drop or attach relevant documents here</div>
                    <button
                        className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4"
                        onClick={handleAttachFile}
                    >
                        Attach Files{" "}
                        <span className="text-[10px]">( Max 10 MB )</span>
                    </button>

                </div>
            )}

            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    );
};

const mapStatusToDisplay = (rawStatus) => {
    const statusMap = {
        open: "Active",
        in_progress: "In Progress",
        on_hold: "On Hold",
        overdue: "Overdue",
        completed: "Completed",
    };
    return statusMap[rawStatus?.toLowerCase()] || "Active";
};

const mapDisplayToApiStatus = (displayStatus) => {
    const reverseStatusMap = {
        Active: "active",
        "In Progress": "in_progress",
        "On Hold": "on_hold",
        Overdue: "overdue",
        Completed: "completed",
    };
    return reverseStatusMap[displayStatus] || "open";
};

const ProjectDetails = () => {
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const navigate = useNavigate();

    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [tab, setTab] = useState("Member");
    const [projectMembers, setProjectMembers] = useState([]);

    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);

    const dispatch = useDispatch();

    const { fetchProjectDetails: project } = useSelector(
        (state) => state.fetchProjectDetails
    );
    const { changeProjectStatus: statusSuccess } = useSelector(
        (state) => state.changeProjectStatus
    );
    const { success } = useSelector((state) => state.deleteProject);

    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Active");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (project?.status) {
            setSelectedOption(mapStatusToDisplay(project.status));
        }
    }, [project?.status]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const dropdownOptions = [
        "Active",
        "In Progress",
        "On Hold",
        "Overdue",
        "Completed",
    ];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);

        dispatch(
            changeProjectStatus({
                token,
                id,
                payload: {
                    project_management: { status: mapDisplayToApiStatus(option) },
                },
            })
        );
    };

    useEffect(() => {
        if (statusSuccess) {
            dispatch(fetchProjectDetails({ token, id }));
        }
    }, [statusSuccess]);

    useGSAP(() => {
        gsap.set(firstContentRef.current, { height: "auto" });
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
        dispatch(fetchProjectDetails({ token, id }));
    }, []);

    useEffect(() => {
        if (project && project.project_team) {
            const members = project.project_team?.project_team_members.map(
                (member) => member?.user?.name
            );
            setProjectMembers(members);
        }
    }, [project]);

    useEffect(() => {
        if (success) {
            navigate("/projects");
        }
    }, [success]);

    function formatToDDMMYYYY_AMPM(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12; // Convert hour 0 to 12
        hours = String(hours).padStart(2, "0");

        return `${day} /${month}/${year} ${hours}:${minutes} ${ampm}`;
    }

    return (
        <div className="m-4">
            {isEditModalOpen && (
                <AddProjectModal
                    isEdit={true}
                    endText="Updated"
                    projectname="Edit Project"
                    isModalOpen={isEditModalOpen}
                    setIsModalOpen={setIsEditModalOpen}
                />
            )}

            <div className="px-4 pt-1">
                <h2 className="text-[15px] p-3 px-0">
                    <span className=" mr-3">Project-{project.id}</span>
                    <span>{project.title}</span>
                </h2>

                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                <div className="flex items-center justify-between my-3 text-[12px]">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Created By : {project.created_by_name}</span>

                        <span className="h-6 w-[1px] border border-gray-300"></span>

                        <span className="flex items-center gap-3">
                            Created On : {formatToDDMMYYYY_AMPM(project.created_at)}
                        </span>

                        <span className="h-6 w-[1px] border border-gray-300"></span>

                        {/* Status Dropdown */}
                        <span className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm text-white bg-[#9CE463]">
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="flex items-center gap-1 cursor-pointer px-2 py-1"
                                    onClick={() => setOpenDropdown(!openDropdown)}
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded={openDropdown}
                                    tabIndex={0}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && setOpenDropdown(!openDropdown)
                                    }
                                >
                                    <span className="text-[13px]">{selectedOption}</span>{" "}
                                    {/* Display selected option */}
                                    <ChevronDown
                                        size={15}
                                        className={`${openDropdown ? "rotate-180" : ""
                                            } transition-transform`}
                                    />
                                </div>
                                <ul
                                    className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"
                                        }`}
                                    role="menu"
                                    style={{
                                        minWidth: "150px",
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                        zIndex: 1000,
                                    }}
                                >
                                    {dropdownOptions.map((option, idx) => (
                                        <li key={idx} role="menuitem">
                                            <button
                                                className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option
                                                    ? "bg-gray-100 font-semibold"
                                                    : ""
                                                    }`}
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
                            onClick={() => dispatch(deleteProject({ token, id: project.id }))}
                        >
                            <Trash2 size={15} />
                            <span>Delete Project</span>
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
                                        Project Manager :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {project.project_owner_name}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]]">
                                        Priority :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {project.priority?.charAt(0).toUpperCase() +
                                            project.priority?.slice(1).toLowerCase() || ""}
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
                                        {project.project_type_name}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Milestones :
                                    </div>
                                    <div className="text-left text-[12px]">{`${project.completed_milestone_count}/${project.total_milestone_count}`}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Start Date :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {project.start_date}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-semibold">
                                        Tasks :
                                    </div>
                                    <div className="text-left text-[12px]">{`${project.completed_task_management_count}/${project.total_task_management_count}`}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        End Date :
                                    </div>
                                    <div className="text-left text-[12px]">
                                        {project.end_date}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Issues :
                                    </div>
                                    <div className="text-left text-[12px]">{`${project.completed_issues_count}/${project.total_issues_count}`}</div>
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
                        {tab == "Member" && (
                            <Members
                                allNames={projectMembers}
                                projectOwner={project.project_owner_name}
                            />
                        )}
                        {tab == "Documents" && (
                            <Attachments attachments={project.attachments} id={project.id} />
                        )}
                        {tab == "Status" && <Status project={project} />}
                        {tab == "Issues" && <Issues />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
