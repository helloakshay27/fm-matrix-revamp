import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { filterIssue, fetchIssue } from "../../../../redux/slices/IssueSlice";
import { useParams } from "react-router-dom";
import qs from "qs";
import { set } from "react-hook-form";

const colorOptions = [
    { label: "Open", color: "bg-[#c85e68]", value: "open" },
    { label: "In Progress", color: "bg-yellow-500", value: "in_progress" },
    { label: "Completed", color: "bg-green-400", value: "completed" },
    { label: "Overdue", color: "bg-red-500", value: "overdue" },
    { label: "On Hold", color: "bg-grey-500", value: "on_hold" },
    { label: "Abort", color: "bg-red-800", value: "abort" },
];

const IssueFilter = ({ isModalOpen, setIsModalOpen }) => {
    const token = localStorage.getItem("token");
    const { id, mid } = useParams();
    const modalRef = useRef(null);

    const getInitialFilters = () => {
        try {
            const saved = localStorage.getItem("IssueFilters");
            return saved
                ? JSON.parse(saved)
                : {
                    selectedStatuses: [],
                    selectedResponsible: [],
                    selectedCreators: [],
                    selectedTypes: [],
                    selectedProjects: [],
                    selectedMilestones: [],
                    selectedTasks: [],
                    dates: { startDate: "", endDate: "" },
                    statusSearch: "",
                    ResponsiblePersonSearch: "",
                    creatorSearch: "",
                    typeSearch: "",
                    projectSearch: "",
                    milestoneSearch: "",
                    taskSearch: "",
                };
        } catch (error) {
            console.error("Error parsing projectFilters from localStorage:", error);
            return {
                selectedStatuses: [],
                selectedResponsible: [],
                selectedCreators: [],
                selectedTypes: [],
                selectedProjects: [],
                selectedMilestones: [],
                selectedTasks: [],
                dates: { startDate: "", endDate: "" },
                statusSearch: "",
                ResponsiblePersonSearch: "",
                creatorSearch: "",
                typeSearch: "",
                projectSearch: "",
                milestoneSearch: "",
                taskSearch: "",
            };
        }
    };

    // Selected options
    const [selectedStatuses, setSelectedStatuses] = useState(
        getInitialFilters().selectedStatuses
    );
    const [selectedResponsible, setSelectedResponsible] = useState(
        getInitialFilters().selectedResponsible
    );
    const [selectedTypes, setSelectedTypes] = useState(
        getInitialFilters().selectedTypes
    );
    const [selectedProjects, setSelectedProjects] = useState(
        getInitialFilters().selectedProjects
    );
    const [selectedMilestones, setSelectedMilestones] = useState(
        getInitialFilters().selectedMilestones
    );
    const [selectedTasks, setSelectedTasks] = useState(
        getInitialFilters().selectedTasks
    );
    // const [selectedManagers, setSelectedManagers] = useState([]);
    const [selectedCreators, setSelectedCreators] = useState(
        getInitialFilters().selectedCreators
    );
    const [dates, setDates] = useState({ "Start Date": "", "End Date": "" });
    const [responsiblePersonOptions, setResponsiblePersonOptions] = useState([]);
    const [createdByOptions, setCreatedByOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [milestoneOptions, setMilestoneOptions] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);

    // Search inputs inside dropdowns
    const [statusSearch, setStatusSearch] = useState("");
    const [ResponsiblePersonSearch, setResponsiblePersonSearch] = useState("");
    const [creatorSearch, setCreatorSearch] = useState("");
    const [typeSearch, setTypeSearch] = useState("");
    const [projectSearch, setProjectSearch] = useState("");
    const [milestoneSearch, setMilestoneSearch] = useState("");
    const [taskSearch, setTaskSearch] = useState("");
    // Dropdown open/close state (only one open at a time)
    const [dropdowns, setDropdowns] = useState({
        status: false,
        ResponsiblePerson: false,
        startDate: false,
        endDate: false,
        creator: false,
        type: false,
        projects: false,
        milestone: false,
        task: false,
    });
    const dispatch = useDispatch();

    const {
        fetchUsers: users,
        loading: usersLoading,
        error,
    } = useSelector((state) => state.fetchUsers);

    const {
        fetchIssue: IssuesFromStore,
        loading: loadingIssues,
        error: issuesError,
    } = useSelector((state) => state.fetchIssues);

    useEffect(() => {
        if (IssuesFromStore?.length > 0) {
            const uniqueMap = new Map();

            IssuesFromStore.forEach((Issue) => {
                const color = colorOptions.find(
                    (option) => option.value === Issue.status
                );
                if (color && !uniqueMap.has(color.value)) {
                    uniqueMap.set(color.value, {
                        label: color.label,
                        color: color.color,
                        value: color.value,
                    });
                }
            });

            setStatusOptions(Array.from(uniqueMap.values()));
        }

        if (IssuesFromStore?.length > 0) {
            const uniqueMap = new Map();

            IssuesFromStore.forEach((Issue) => {
                if (
                    Issue.responsible_person &&
                    !uniqueMap.has(Issue.responsible_person.id)
                ) {
                    uniqueMap.set(Issue.responsible_person.id, {
                        label: Issue.responsible_person.name,
                        value: Issue.responsible_person.id,
                    });
                }
            });

            setResponsiblePersonOptions(Array.from(uniqueMap.values()));
        }

        if (users?.length > 0) {
            setCreatedByOptions(
                users.map((user) => ({
                    label: user.firstname + " " + user.lastname,
                    value: user.id,
                }))
            );
        }

        if (IssuesFromStore?.length > 0) {
            const uniqueMap = new Map();

            IssuesFromStore.forEach((Issue, index) => {
                if (Issue.issue_type && !uniqueMap.has(Issue.issue_type)) {
                    uniqueMap.set(Issue.issue_type, {
                        label:
                            Issue.issue_type.charAt(0).toUpperCase() +
                            Issue.issue_type.slice(1),
                        value: Issue.issue_type,
                    });
                }
            });

            setTypeOptions(Array.from(uniqueMap.values()));
        }

        if (IssuesFromStore?.length > 0) {
            const uniqueMap = new Map();

            IssuesFromStore.forEach((Issue, index) => {
                if (
                    Issue.project_management_id &&
                    Issue.project_management_name &&
                    !uniqueMap.has(Issue.project_management_id)
                ) {
                    uniqueMap.set(Issue.project_management_id, {
                        label: Issue.project_management_name,
                        value: Issue.project_management_id,
                    });
                }
            });

            setProjectOptions(Array.from(uniqueMap.values()));
        }
        if (IssuesFromStore?.length > 0) {
            const uniqueMap = new Map();

            IssuesFromStore.forEach((Issue, index) => {
                if (
                    Issue.milestone_id &&
                    Issue.milstone_name &&
                    !uniqueMap.has(Issue.milestone_id)
                ) {
                    uniqueMap.set(Issue.milestone_id, {
                        label: Issue.milstone_name,
                        value: Issue.milestone_id,
                    });
                }
            });

            setMilestoneOptions(Array.from(uniqueMap.values()));
        }
        if (IssuesFromStore?.length > 0) {
            const uniqueMap = new Map();

            IssuesFromStore.forEach((Issue, index) => {
                if (
                    Issue.task_management_id &&
                    Issue.task_management_name &&
                    !uniqueMap.has(Issue.task_management_id)
                ) {
                    uniqueMap.set(Issue.task_management_id, {
                        label: Issue.task_management_name,
                        value: Issue.task_management_id,
                    });
                }
            });

            setTaskOptions(Array.from(uniqueMap.values()));
        }
    }, [IssuesFromStore, users]);

    // Save filter state to localStorage whenever it changes
    useEffect(() => {
        const filters = {
            selectedStatuses,
            selectedResponsible,
            selectedCreators,
            selectedTypes,
            selectedProjects,
            selectedMilestones,
            selectedTasks,
            dates,
            statusSearch,
            ResponsiblePersonSearch,
            creatorSearch,
            typeSearch,
            projectSearch,
            milestoneSearch,
            taskSearch,
        };
        if (
            selectedStatuses?.length > 0 ||
            selectedResponsible?.length > 0 ||
            selectedCreators?.length > 0 ||
            dates["Start Date"] ||
            dates["End Date"] ||
            statusSearch ||
            ResponsiblePersonSearch ||
            creatorSearch ||
            typeSearch ||
            projectSearch ||
            milestoneSearch ||
            taskSearch ||
            selectedTypes?.length > 0 ||
            selectedProjects?.length > 0 ||
            selectedMilestones?.length > 0 ||
            selectedTasks?.length > 0
        ) {
            localStorage.setItem("IssueFilters", JSON.stringify(filters));
        }
    }, [
        selectedStatuses,
        selectedResponsible,
        selectedCreators,
        selectedTypes,
        selectedProjects,
        selectedMilestones,
        selectedTasks,
        dates,
        statusSearch,
        ResponsiblePersonSearch,
        creatorSearch,
        typeSearch,
        projectSearch,
        milestoneSearch,
        taskSearch,
    ]);

    const handleApplyFilter = (overideFilters) => {
        console.log(dates);
        try {
            const newFilter = {
                "q[status_in][]": selectedStatuses?.length > 0 ? selectedStatuses : [],
                "q[created_by_id_eq]":
                    selectedCreators?.length > 0 ? selectedCreators : [],
                "q[start_date_eq]": dates["Start Date"],
                "q[end_date_eq]": dates["End Date"],
                "q[responsible_person_id_in][]":
                    selectedResponsible?.length > 0 ? selectedResponsible : [],
                "q[issue_type_in][]": selectedTypes?.length > 0 ? selectedTypes : [],
                "q[project_management_id_in][]":
                    selectedProjects?.length > 0 ? selectedProjects : [],
                "q[task_management_id_in][]":
                    selectedTasks?.length > 0 ? selectedTasks : [],
                "q[milestone_id_in][]":
                    selectedMilestones?.length > 0 ? selectedMilestones : [],
            };
            if (newFilter) {
                const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });

                dispatch(
                    filterIssue({
                        token,
                        filter: overideFilters ? overideFilters : queryString,
                    })
                );
                setIsModalOpen(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const toggleDropdown = (key) => {
        setDropdowns((prev) => {
            const isAlreadyOpen = prev[key];
            if (isAlreadyOpen) {
                return { ...prev, [key]: false };
            }
            return {
                status: false,
                ResponsiblePerson: false,
                creator: false,
                [key]: true,
            };
        });
    };

    // Toggle checkbox option selection
    const toggleOption = (value, selected, setSelected) => {
        setSelected((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    // Close modal animation
    const closeModal = () => {
        gsap.to(modalRef.current, {
            x: "100%",
            duration: 0.4,
            ease: "power3.in",
            onComplete: () => setIsModalOpen(false),
        });
    };

    // Open modal animation
    useGSAP(() => {
        if (isModalOpen) {
            gsap.fromTo(
                modalRef.current,
                { x: "100%" },
                { x: "0%", duration: 0.4, ease: "power3.out" }
            );
        }
    }, [isModalOpen]);

    // Render checkbox list with search filtering
    const renderCheckboxList = (
        options,
        selected,
        setSelected,
        searchTerm = ""
    ) => {
        const filtered = options.filter((opt) =>
            typeof opt === "string"
                ? opt.toLowerCase().includes(searchTerm.toLowerCase())
                : opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="max-h-40 overflow-y-auto p-2">
                {filtered.map((option) => {
                    const label = typeof option === "string" ? option : option.label;
                    const color = typeof option === "string" ? null : option.color;
                    const value = typeof option === "string" ? option : option.value;

                    return (
                        <label
                            key={label}
                            className="flex items-center justify-between py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(value)}
                                    onChange={() => toggleOption(value, selected, setSelected)}
                                />
                                <span>{label}</span>
                            </div>
                            {color && (
                                <span className={clsx("w-2 h-2 rounded-full", color)}></span>
                            )}
                        </label>
                    );
                })}
                {filtered?.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">
                        No results found
                    </div>
                )}
            </div>
        );
    };

    // Clear all selections and search inputs
    const clearAll = () => {
        setSelectedStatuses([]);
        setSelectedResponsible([]);
        setSelectedCreators([]);
        setSelectedProjects([]);
        setSelectedMilestones([]);
        setSelectedTasks([]);
        setSelectedTypes([]);
        setDates({ "Start date": "", "End date": "" });
        setStatusSearch("");
        setProjectSearch("");
        setMilestoneSearch("");
        setTaskSearch("");
        setResponsiblePersonSearch("");
        setCreatorSearch("");
        setTypeSearch("");
        localStorage.removeItem("IssueFilters");
        handleApplyFilter({});
        // dispatch(fetchIssues({ token }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="bg-white w-full max-w-sm h-full shadow-xl flex flex-col relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold">Filter</h2>
                    <X className="cursor-pointer" onClick={closeModal} />
                </div>

                <div className="px-6 py-4 border-b">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-2.5 text-red-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Filter search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y">
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("status")}
                        >
                            <span className="font-medium text-sm select-none">Status</span>
                            {dropdowns.status ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.status && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter status..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={statusSearch}
                                        onChange={(e) => setStatusSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    statusOptions,
                                    selectedStatuses,
                                    setSelectedStatuses,
                                    statusSearch
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("projects")}
                        >
                            <span className="font-medium text-sm select-none">Project</span>
                            {dropdowns.projects ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.projects && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter project type..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={projectSearch}
                                        onChange={(e) => setProjectSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    projectOptions,
                                    selectedProjects,
                                    setSelectedProjects,
                                    projectSearch
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("milestone")}
                        >
                            <span className="font-medium text-sm select-none">Milestone</span>
                            {dropdowns.milestone ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.milestone && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter project type..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={milestoneSearch}
                                        onChange={(e) => setMilestoneSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    milestoneOptions,
                                    selectedMilestones,
                                    setSelectedMilestones,
                                    milestoneSearch
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("task")}
                        >
                            <span className="font-medium text-sm select-none">Task</span>
                            {dropdowns.task ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.task && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter project type..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={taskSearch}
                                        onChange={(e) => setTaskSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    taskOptions,
                                    selectedTasks,
                                    setSelectedTasks,
                                    taskSearch
                                )}
                            </div>
                        )}
                    </div>

                    {/* Project Type */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("ResponsiblePerson")}
                        >
                            <span className="font-medium text-sm select-none">
                                Responsible Person
                            </span>
                            {dropdowns.ResponsiblePerson ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.ResponsiblePerson && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter project type..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={ResponsiblePersonSearch}
                                        onChange={(e) => setResponsiblePersonSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    responsiblePersonOptions,
                                    selectedResponsible,
                                    setSelectedResponsible,
                                    ResponsiblePersonSearch
                                )}
                            </div>
                        )}
                    </div>

                    {/* Issue Type */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("type")}
                        >
                            <span className="font-medium text-sm select-none">Type</span>
                            {dropdowns.type ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.type && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter project manager..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={typeSearch}
                                        onChange={(e) => setTypeSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    typeOptions,
                                    selectedTypes,
                                    setSelectedTypes,
                                    typeSearch
                                )}
                            </div>
                        )}
                    </div>

                    {["startDate", "endDate"].map((key) => {
                        const label = key === "startDate" ? "Start Date" : "End Date";
                        return (
                            <div key={key} className="p-6 py-3">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDropdown(key)}
                                >
                                    <span className="font-medium text-sm select-none">
                                        {label}
                                    </span>

                                    {dropdowns[key] ? (
                                        <ChevronDown className="text-gray-400" />
                                    ) : (
                                        <ChevronRight className="text-gray-400" />
                                    )}
                                </div>

                                {dropdowns[key] && (
                                    <div className="mt-4 px-1">
                                        <input
                                            type="date"
                                            value={dates[label]}
                                            onChange={(e) =>
                                                setDates((prev) => ({
                                                    ...prev,
                                                    [label]: e.target.value,
                                                }))
                                            }
                                            className="w-full p-2 border rounded text-sm"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("createdBy")}
                        >
                            <span className="font-medium text-sm select-none">
                                Created By
                            </span>
                            {dropdowns.createdBy ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.createdBy && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter created by..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={creatorSearch}
                                        onChange={(e) => setCreatorSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    createdByOptions,
                                    selectedCreators,
                                    setSelectedCreators,
                                    creatorSearch
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4 px-6 py-3 border-t">
                    <button
                        className="bg-[#C62828] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]"
                        onClick={() => handleApplyFilter(null)}
                    >
                        Apply
                    </button>
                    <button
                        className="border border-[#C62828] text-[#C62828] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50"
                        onClick={clearAll}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IssueFilter;
