import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { changeProjectStatus, fetchProjectById } from "@/store/slices/projectManagementSlice";
import { ArrowLeft, ChevronDown, ChevronDownCircle, PencilIcon, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
        project_team: {
            project_team_members: [],
        },
    })

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
            } catch (error) {
                console.log(error)
            }
        }

        getProjectDetails()
    }, [])

    const staticMembers = ["Deepak yadav", "Vinayak"];
    const [selectedOption, setSelectedOption] = useState("Active");

    const dropdownOptions = ["Active", "In Progress", "On Hold", "Overdue", "Completed"];

    const handleOptionSelect = async (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);

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
                        className="font-[600] text-[13px] flex items-center gap-4"
                        onClick={() => setIsSecondCollapsed(!isSecondCollapsed)}
                    >
                        <ChevronDownCircle
                            color="#c72030"
                            size={30}
                            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"} transition-transform`}
                        />{" "}
                        Details
                    </div>

                    <div className="mt-3 overflow-hidden" ref={secondContentRef}>
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
                                        {project.priority}
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
                                    <div className="text-right text-[13px] font-[500]">
                                        Milestones :
                                    </div>
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
                                    <div className="text-right text-[13px] font-semibold">
                                        Tasks :
                                    </div>
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
                                    className={`text-[13px] font-[400] ${tab === item ? "selected" : "cursor-pointer"}`}
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
                            <div>Document Table Placeholder</div>
                        )}
                        {tab === "Status" && <></>}
                        {tab === "Issues" && <div>Issues Table Placeholder</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;