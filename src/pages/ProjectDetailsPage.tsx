import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { changeProjectStatus, fetchProjectById, attachFiles, removeAttachment } from "@/store/slices/projectManagementSlice";
import { ArrowLeft, ChevronDown, ChevronDownCircle, PencilIcon, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, Fragment } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";

const Members = ({ allNames, projectOwner }) => {
    return (
        <div className="flex items-start p-4 bg-[rgba(247, 247, 247, 0.51)] shadow-md rounded-[10px] text-[13px] my-3">
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
    active: "bg-[#E4636A] text-white",
    "in_progress": "bg-[#08AEEA] text-white",
    "on_hold": "bg-[#7BD2B5] text-black",
    overdue: "bg-[#FF2733] text-white",
    completed: "bg-[#83D17A] text-black",
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
    return parts.join(' ');
};

const Status = ({ project }) => {
    const logs = [...(project?.project_status_logs || [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return (
        <div className="overflow-x-auto w-full p-4">
            <div className="flex items-center gap-4 min-w-[800px]">
                {logs.map((log, index) => {
                    const nextLog = logs[index + 1];
                    const currentTime = new Date(log.created_at).getTime();
                    const nextTime = nextLog ? new Date(nextLog.created_at).getTime() : null;
                    const duration = nextTime ? formatDuration(nextTime - currentTime) : null;

                    const normalizedStatus = log.status?.toLowerCase();
                    const badgeStyle = STATUS_COLORS[normalizedStatus] || 'bg-gray-400 text-white';

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
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [files, setFiles] = useState(attachments);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

    useEffect(() => {
        setFiles(attachments);
    }, [attachments]);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        if (!selectedFiles.length) return;

        const oversizedFiles = selectedFiles.filter((file) => file.size > 10 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('Each file must be less than 10MB.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('project_management[attachments][]', file);
        });

        try {
            await dispatch(attachFiles({ token, baseUrl, id, payload: formData })).unwrap();
            toast.dismiss();
            toast.success('Files uploaded successfully');
            // Refetch project details to get updated attachments
            const response = await dispatch(fetchProjectById({ baseUrl, token, id })).unwrap();
            setFiles(response.attachments || []);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('File upload failed:', error);
            toast.error('File upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const removeFile = async (fileId: string) => {
        setDeletingFileId(fileId);
        try {
            await dispatch(removeAttachment({ token, baseUrl, id, image_id: fileId })).unwrap();
            // Instantly remove from UI
            setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
            toast.dismiss();
            toast.success('File removed successfully.');
            // Refetch to ensure consistency
            const response = await dispatch(fetchProjectById({ baseUrl, token, id })).unwrap();
            setFiles(response.attachments || []);
        } catch (error) {
            toast.error('Failed to remove file. Please try again.');
            // Refetch to revert UI
            const response = await dispatch(fetchProjectById({ baseUrl, token, id })).unwrap();
            setFiles(response.attachments || []);
        } finally {
            setDeletingFileId(null);
        }
    };

    return (
        <div className="flex flex-col gap-3 p-5">
            {files && files.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
                        {files.map((file: any, index: number) => {
                            const fileUrl = file.document || file.document_url || file.url;
                            const doctype = file.doctype || '';
                            const fileId = file.id;
                            const isDeleting = deletingFileId === fileId;

                            // Extract file extension from doctype (e.g., "image/jpeg" -> "jpg")
                            let fileExt = '';
                            if (doctype) {
                                const mimeType = doctype.split('/')[1]?.toLowerCase() || '';
                                fileExt = mimeType === 'jpeg' ? 'jpg' : mimeType;
                            }

                            const isImage = doctype?.startsWith('image/');
                            const isPdf = doctype === 'application/pdf';
                            const isWord = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(doctype);
                            const isExcel = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(doctype);

                            // Generate filename from URL or doctype
                            const urlParts = fileUrl?.split('/') || [];
                            const fileName = urlParts[urlParts.length - 1] || `file.${fileExt}`;

                            return (
                                <a
                                    key={index}
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={fileName}
                                    title={fileName}
                                    className={`border rounded p-2 flex flex-col items-center justify-center text-center shadow-sm bg-white relative hover:shadow-md transition-all cursor-pointer group ${isDeleting ? 'opacity-50 pointer-events-none' : ''
                                        }`}
                                >
                                    {isDeleting ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                                                <span className="text-xs text-white font-semibold">Deleting...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <Trash2
                                            size={20}
                                            color="#C72030"
                                            className="absolute top-2 right-2 cursor-pointer hover:opacity-80 transition-opacity z-10"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFile(fileId);
                                            }}
                                        />
                                    )}

                                    <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                                        {isImage && fileUrl ? (
                                            <img src={fileUrl} alt={fileName} className="object-cover w-full h-full" />
                                        ) : isPdf ? (
                                            <span className="text-red-600 font-bold text-lg">PDF</span>
                                        ) : isWord ? (
                                            <span className="text-blue-600 font-bold text-lg">DOC</span>
                                        ) : isExcel ? (
                                            <span className="text-green-600 font-bold text-lg">XLS</span>
                                        ) : (
                                            <span className="text-gray-500 font-bold text-lg">FILE</span>
                                        )}
                                    </div>
                                </a>
                            );
                        })}
                    </div>

                    <button
                        className={`bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4 rounded hover:bg-[#a01a24] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={handleAttachFile}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                Attach Files <span className="text-[10px]">( Max 10 MB )</span>
                            </>
                        )}
                    </button>
                </>
            ) : (
                <div className="text-[14px] mt-2">
                    <span>No Documents Attached</span>
                    <div className="text-[#C2C2C2]">Drop or attach relevant documents here</div>
                    <button
                        className={`bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4 rounded hover:bg-[#a01a24] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={handleAttachFile}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                Attach Files <span className="text-[10px]">( Max 10 MB )</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                disabled={isUploading}
            />
        </div>
    );
};

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const dropdownRef = useRef(null);
    const secondContentRef = useRef(null);

    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [projectMembers, setProjectMembers] = useState([]);
    const [tab, setTab] = useState("Member");
    const [project, setProject] = useState({
        id: "",
        title: "",
        status: "",
        created_by_name: "",
        created_at: "",
        project_owner_name: "",
        start_date: "",
        end_date: "",
        priority: "",
        project_type_name: "",
        completed_milestone_count: "",
        total_milestone_count: "",
        completed_task_management_count: "",
        total_task_management_count: "",
        completed_issues_count: "",
        total_issues_count: "",
        project_status_logs: [],
        attachments: [],
        project_team: {
            project_team_members: [],
        },
    })

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
        const getProjectDetails = async () => {
            try {
                const response = await dispatch(fetchProjectById({ baseUrl, token, id })).unwrap();
                setProject(response)
                if (response?.status) {
                    setSelectedOption(mapStatusToDisplay(response.status));
                }
            } catch (error) {
                console.log(error)
            }
        }

        getProjectDetails()
    }, [])

    const [selectedOption, setSelectedOption] = useState("Active");

    const dropdownOptions = ["Active", "In Progress", "On Hold", "Overdue", "Completed"];

    const mapStatusToDisplay = (rawStatus) => {
        const statusMap = {
            active: 'Active',
            in_progress: 'In Progress',
            on_hold: 'On Hold',
            overdue: 'Overdue',
            completed: 'Completed',
        };
        return statusMap[rawStatus?.toLowerCase()] || 'Active';
    };

    const handleOptionSelect = async (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);

        try {
            await dispatch(
                changeProjectStatus({
                    baseUrl,
                    token,
                    id,
                    payload: {
                        project_management: { status: mapDisplayToApiStatus(option) },
                    },
                })
            ).unwrap();
            toast.dismiss();
            toast.success("Status updated successfully");
            // Refetch project details to get updated data
            const response = await dispatch(fetchProjectById({ baseUrl, token, id })).unwrap();
            setProject(response);
        } catch (error) {
            toast.error("Failed to update status");
            console.error(error);
        }
    };

    const mapDisplayToApiStatus = (displayStatus) => {
        const reverseStatusMap = {
            Active: "active",
            "In Progress": "in_progress",
            "On Hold": "on_hold",
            Overdue: "overdue",
            Completed: "completed",
        };
        return reverseStatusMap[displayStatus] || "active";
    };

    const toggleSecondCollapse = () => {
        if (secondContentRef.current) {
            if (isSecondCollapsed) {
                secondContentRef.current.style.maxHeight = secondContentRef.current.scrollHeight + 'px';
                secondContentRef.current.style.opacity = '1';
            } else {
                secondContentRef.current.style.maxHeight = '0';
                secondContentRef.current.style.opacity = '0';
            }
        }
        setIsSecondCollapsed(!isSecondCollapsed);
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
        <div className="my-4 m-8">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-0"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            <div className="pt-1">
                <h2 className="text-[15px] p-3 px-0">
                    <span className="mr-3">Project-{project.id}</span>
                    <span>{project.title}</span>
                </h2>

                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                <div className="flex items-center justify-between my-3 text-[13px]">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Created By : {project.created_by_name}</span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-3">
                            Created On : {formatToDDMMYYYY_AMPM(project.created_at)}
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm ${STATUS_COLORS[mapDisplayToApiStatus(selectedOption).toLowerCase()] || "bg-gray-400 text-white"}`}>
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
                        >
                            <Trash2 size={15} />
                            <span>Delete Project</span>
                        </span>
                    </div>
                </div>
                <div className="border-b-[3px] border-grey my-3"></div>

                <div className="border rounded-[10px] shadow-md p-5 mb-4">
                    <div
                        className="font-[600] text-[13px] flex items-center gap-4 cursor-pointer"
                        onClick={toggleSecondCollapse}
                    >
                        <ChevronDownCircle
                            color="#c72030"
                            size={30}
                            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"} transition-transform`}
                        />{" "}
                        Details
                    </div>

                    <div
                        className="mt-3 overflow-hidden transition-all duration-500"
                        ref={secondContentRef}
                        style={{
                            maxHeight: isSecondCollapsed ? '0' : 'auto',
                            opacity: isSecondCollapsed ? 0 : 1,
                        }}
                    >
                        <div className="flex flex-col">
                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[13px] font-[500]">
                                        Project Manager :
                                    </div>
                                    <div className="text-left text-[13px]">
                                        {project.project_owner_name}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[13px] font-[500]">
                                        Priority :
                                    </div>
                                    <div className="text-left text-[13px]">
                                        {project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1).toLowerCase() || ''}
                                    </div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[13px] font-[500]">
                                        Project Type:
                                    </div>
                                    <div className="text-left text-[13px]">
                                        {project.project_type_name}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <Link to={`milestones`} className="text-right text-[13px] font-[500]">
                                        Milestones :
                                    </Link>
                                    <div className="text-left text-[13px]">{`${project.completed_milestone_count}/${project.total_milestone_count}`}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[13px] font-[500]">
                                        Start Date :
                                    </div>
                                    <div className="text-left text-[13px]">
                                        {project.start_date}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <Link
                                        to={`/tasks?project_id=${project.id}`}
                                        className="text-right text-[13px] font-semibold"
                                    >
                                        Tasks :
                                    </Link>
                                    <div className="text-left text-[13px]">{`${project.completed_task_management_count}/${project.total_task_management_count}`}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[13px] font-[500]">
                                        End Date :
                                    </div>
                                    <div className="text-left text-[13px]">
                                        {project.end_date}
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[13px] font-[500]">
                                        Issues :
                                    </div>
                                    <div className="text-left text-[13px]">{`${project.completed_issues_count}/${project.total_issues_count}`}</div>
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
                                    className={`text-[13px] font-[400] ${tab === item ? "selected font-semibold border-b-2 border-[#c72030]" : "cursor-pointer"}`}
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
                                allNames={projectMembers}
                                projectOwner={project.project_owner_name}
                            />
                        )}
                        {tab === "Documents" && (
                            <Attachments attachments={project.attachments || []} id={project.id} />
                        )}
                        {tab === "Status" && <Status project={project} />}
                        {tab === "Issues" && <div>Issues Table Placeholder</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;