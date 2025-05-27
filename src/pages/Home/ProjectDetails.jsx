import gsap from "gsap";
import SourceIcon from "@mui/icons-material/Source";
import IssuesTable from "../../components/Home/Issues/Table";
import { ChevronDown, ChevronDownCircle, MoreHorizontal, PencilIcon, TrashIcon, Trash2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeProjectStatus, fetchProjectDetails } from "../../redux/slices/projectSlice";
import AddProjectModal from "../../components/Home/Projects/AddProjectModal";

const Issues = () => {
    return <IssuesTable />;
};

const Members = ({ allNames, projectOwner }) => {
    return (
        <div className="flex items-start p-4 bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg text-[12px] my-3">
            {" "}
            {/* Main container with some styling */}
            {/* Left Fixed Item */}
            <div className="left-name-container w-35 flex-shrink-0 pr-4 py-2 my-auto mx-auto">
                {" "}
                {/* Fixed width, adjust as needed */}
                <span className="text-gray-700">{projectOwner}</span>
            </div>
            <div className="divider w-px bg-pink-500 self-stretch mx-4"></div>{" "}
            {/* self-stretch to match height of flex items */}
            <div className="names-grid-container flex-grow overflow-x-auto">
                {" "}
                {/* Allows horizontal scrolling for names */}
                <div
                    className="
                  grid grid-flow-col grid-rows-3 auto-cols-min gap-x-8 gap-y-2 py-2
                "
                >
                    {allNames.map((name, index) => (
                        <span key={index} className="text-gray-600 whitespace-nowrap">
                            {" "}
                            {/* whitespace-nowrap if names shouldn't wrap */}
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
                    <button className="bg-[#88D760] py-1 px-4 text-white rounded-[30px] w-[94px] h-[30px] text-[12px]">
                        Active
                    </button>
                </div>
                <div>
                    <h1 className="text-[12px] text-center  w-[200px]">
                        1 hr 23 mins 10 sec
                    </h1>
                    <img src="/arrow.png" alt="arrow" />
                </div>
                <div>
                    <button className="bg-[#D6D6D6] py-1 px-4 rounded-[30px] w-[140px] h-[30px] text-[12px] text-[#000000]">
                        Yet to Complete
                    </button>
                </div>
            </div>
        </div>
    );
};

const Documents = () => {
    return (
        <div>
            <div className="flex items-start gap-2 p-5">
                <SourceIcon />
                <h1 className="text-[#0063AF]">BRD.xls</h1>
            </div>
            <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
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
    return statusMap[rawStatus?.toLowerCase()] || "Active"; // Default to "Active" if unknown
};

// Utility function to map display status back to API format
const mapDisplayToApiStatus = (displayStatus) => {
    const reverseStatusMap = {
        Active: "active",
        "In Progress": "in_progress",
        "On Hold": "on_hold",
        Overdue: "overdue",
        Completed: "completed",
    };
    return reverseStatusMap[displayStatus] || "open"; // Default to "open" if unknown
};

const ProjectDetails = () => {
    const { id } = useParams();

    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [tab, setTab] = useState("Member");
    const [projectMembers, setProjectMembers] = useState([])

    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);

    const dispatch = useDispatch();
    const { fetchProjectDetails: project } = useSelector((state) => state.fetchProjectDetails);

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

    const dropdownOptions = ["Active", "In Progress", "On Hold", "Overdue", "Completed"];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);

        dispatch(changeProjectStatus({ id, payload: { project_management: { status: mapDisplayToApiStatus(option) } } }));
    };

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
        dispatch(fetchProjectDetails(id))
    }, [])

    useEffect(() => {
        if (project && project.project_members) {
            const members = project.project_members.map((member) => member.user.firstname + " " + member.user.lastname);
            setProjectMembers(members);
        }
    }, [project]);

    function formatToDDMMYYYY_AMPM(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // Convert hour 0 to 12
        hours = String(hours).padStart(2, '0');

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
                    <span className=" mr-3">Project-ID</span>
                    <span>Project Name</span>
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

                        <span
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => setIsEditModalOpen(true)}                        >
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
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    Project Manager :
                                </div>
                                <div className="text-left text-[12px]">{project.project_owner_name}</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]]">
                                    Priority :
                                </div>
                                <div className="text-left text-[12px]">{project.priority?.charAt(0).toUpperCase() +
                                    project.priority?.slice(1).toLowerCase() || ""}</div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    Project Type:
                                </div>
                                <div className="text-left text-[12px]">{project.project_type}</div>
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
                                    Start Date :
                                </div>
                                <div className="text-left text-[12px]">{project.start_date}</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-semibold">
                                    Tasks :
                                </div>
                                <div className="text-left text-[12px]">0/3</div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    End Date :
                                </div>
                                <div className="text-left text-[12px]">{project.end_date}</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">
                                    Issues :
                                </div>
                                <div className="text-left text-[12px]"> 3/5 </div>
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
                        {tab == "Member" && <Members allNames={projectMembers} projectOwner={project.project_owner_name} />}
                        {tab == "Documents" && <Documents />}
                        {tab == "Status" && <Status />}
                        {tab == "Issues" && <Issues />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
