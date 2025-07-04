import gsap from "gsap";
import { ChevronDown, ChevronDownCircle, Trash2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { attachFile, fetchIssue, removeIssueAttachment, updateIssue } from "../../redux/slices/IssueSlice";
import toast from "react-hot-toast";

const Attachments = ({ attachments, id }) => {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const [files, setFiles] = useState(attachments);

    // ✅ Keep local state in sync with parent prop
    useEffect(() => {
        setFiles(attachments);
    }, [attachments]);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (!selectedFiles.length) return;

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("issue[attachments][]", file);
        });

        try {
            await dispatch(attachFile({ token, id, payload: formData })).unwrap();
            toast.success("Files uploaded successfully.");
            await dispatch(fetchIssue({ token, id })).unwrap(); // ✅ refresh full issue
        } catch (error) {
            console.error("File upload failed:", error);
            toast.error("Failed to upload file.");
        }
    };

    const handleRemoveFile = async (fileId) => {
        try {
            await dispatch(removeIssueAttachment({ token, id, image_id: fileId })).unwrap();
            toast.dismiss();
            toast.success("File removed successfully.");
            await dispatch(fetchIssue({ token, id })).unwrap(); // ✅ refresh full issue again
        } catch (error) {
            console.error("File deletion failed:", error);
            toast.error("Failed to delete file.");
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
                                        onClick={() => handleRemoveFile(file.id)}
                                    />

                                    {/* Preview */}
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

                                    {/* Filename */}
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
                        Attach Files
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
                        Attach Files
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


const Comments = ({ comment }) => {
    return (
        <div className="p-2 text-[14px]">
            {comment?.map((comment) => (
                <div key={comment.id} className="relative flex justify-start m-2 gap-5">
                    <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                        <span className="">{comment.commentor_full_name.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
                        <h1 className="font-bold">{comment.commentor_full_name}</h1>
                        {comment.body
                            .replace(/@\[(.*?)\]\(\d+\)/g, '@$1')
                            .replace(/#\[(.*?)\]\(\d+\)/g, '#$1')}
                        <div className="flex gap-2 text-[10px]">
                            <span>{formatToDDMMYYYY_AMPM(comment.created_at)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    )
}

const mapStatusToDisplay = (rawStatus) => {
    const statusMap = {
        open: "Open",
        in_progress: "In Progress",
        on_hold: "On Hold",
        completed: "Completed",
    };
    return statusMap[rawStatus?.toLowerCase()] || "Active";
};

const mapDisplayToApiStatus = (displayStatus) => {
    const reverseStatusMap = {
        Open: "open",
        "In Progress": "in_progress",
        "On Hold": "on_hold",
        Completed: "completed",
    };
    return reverseStatusMap[displayStatus] || "open";
};

const IssueDetails = () => {
    const token = localStorage.getItem("token");
    const { id } = useParams();
    console.log(id);
    const navigate = useNavigate()

    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [tab, setTab] = useState("Comments");

    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);

    const dispatch = useDispatch();

    const issues = useSelector((state) => state.fetchIssues.fetchIssue);
    const { success: statusSuccess } = useSelector((state) => state.updateIssues);

    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Active");
    const [issueDetails, setIssueDetails] = useState();

    useEffect(() => {
        if (issues && Array.isArray(issues) && issues.length > 0) {
            setIssueDetails(issues.find(issue => issue.id == id));
        }
    }, [id, issues])

    useEffect(() => {
        if (issueDetails?.status) {
            setSelectedOption(mapStatusToDisplay(issueDetails.status));
        }
    }, [issueDetails?.status, issueDetails?.id, issueDetails]);

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

    const dropdownOptions = ["Open", "In Progress", "On Hold", "Completed"];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);
        const payload = {
            status: mapDisplayToApiStatus(option)
        }
        dispatch(updateIssue({ token, id, payload }));
    };

    useEffect(() => {
        if (statusSuccess) {
            dispatch(fetchIssue({ token, id }))
        }
    }, [statusSuccess])

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

    return (
        <div className="m-4">
            <div className="px-4 pt-1">
                <h2 className="text-[15px] p-3 px-0">
                    <span className=" mr-3">Issue-{issueDetails?.id}</span>
                    <span>{issueDetails?.title}</span>
                </h2>

                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                <div className="flex items-center justify-between my-3 text-[12px]">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Created By : {issueDetails?.created_by?.name}</span>

                        <span className="h-6 w-[1px] border border-gray-300"></span>

                        <span className="flex items-center gap-3">
                            Created On : {formatToDDMMYYYY_AMPM(issueDetails?.created_at)}
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
                                    onKeyDown={(e) => e.key === "Enter" && setOpenDropdown(!openDropdown)}
                                >
                                    <span className="text-[13px]">{selectedOption}</span> {/* Display selected option */}
                                    <ChevronDown
                                        size={15}
                                        className={`${openDropdown ? "rotate-180" : ""} transition-transform`}
                                    />
                                </div>
                                <ul
                                    className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"}`}
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
                                                className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option ? "bg-gray-100 font-semibold" : ""
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
                                        Responsible Person :
                                    </div>
                                    <div className="text-left text-[12px]">{issueDetails?.responsible_person.name}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]]">
                                        Priority :
                                    </div>
                                    <div className="text-left text-[12px]">{issueDetails?.priority?.charAt(0).toUpperCase() +
                                        issueDetails?.priority?.slice(1).toLowerCase() || ""}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Issue Type:
                                    </div>
                                    <div className="text-left text-[12px]">{issueDetails?.issue_type}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        MileStone :
                                    </div>
                                    <div className="text-left text-[12px]">{issueDetails?.milstone_name || ""}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Start Date :
                                    </div>
                                    <div className="text-left text-[12px]">{formatToDDMMYYYY_AMPM(issueDetails?.start_date)}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-semibold">
                                        Task :
                                    </div>
                                    <div className="text-left text-[12px]">{issueDetails?.task_management_name || ""}</div>
                                </div>
                            </div>

                            <span className="border h-[1px] inline-block w-full my-4"></span>

                            <div className="flex items-center ml-36">
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        End Date :
                                    </div>
                                    <div className="text-left text-[12px]">{formatToDDMMYYYY_AMPM(issueDetails?.end_date)}</div>
                                </div>
                                <div className="w-1/2 flex items-center justify-start gap-3">
                                    <div className="text-right text-[12px] font-[500]">
                                        Project :
                                    </div>
                                    <div className="text-left text-[12px]">{issueDetails?.project_management_name || ""}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-10">
                            {["Comments", "Documents"].map((item, idx) => (
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
                        {tab == "Documents" && <Attachments attachments={issueDetails?.attachments} id={issueDetails?.id} />}
                        {tab == "Comments" && <Comments comment={issueDetails?.comments} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;
