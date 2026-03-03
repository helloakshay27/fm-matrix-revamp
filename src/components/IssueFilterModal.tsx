import { X, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import qs from "qs";
import { toast } from "sonner";
import axios from "axios";

const statusOptions = [
    { label: "Open", value: "open", color: "bg-blue-500" },
    { label: "In Progress", value: "in_progress", color: "bg-amber-500" },
    { label: "On Hold", value: "on_hold", color: "bg-gray-500" },
    { label: "Completed", value: "completed", color: "bg-teal-500" },
    { label: "Reopen", value: "reopen", color: "bg-orange-500" },
    { label: "Closed", value: "closed", color: "bg-red-500" },
];

const priorityOptions = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
];

const IssueFilterModal = ({
    isModalOpen,
    setIsModalOpen,
    onApplyFilters,
    issueTypes,
    users,
    projects,
}) => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const modalRef = useRef(null);

    console.log(issueTypes)

    const getInitialFilters = () => {
        try {
            const saved = localStorage.getItem("issueFilters");
            return saved
                ? JSON.parse(saved)
                : {
                    selectedStatuses: [],
                    selectedPriorities: [],
                    selectedTypes: [],
                    selectedAssignees: [],
                    selectedCreators: [],
                    selectedProjects: [],
                    dates: { startDate: "", endDate: "" },
                    statusSearch: "",
                    typeSearch: "",
                    assigneeSearch: "",
                    creatorSearch: "",
                    projectSearch: "",
                };
        } catch (error) {
            console.error("Error parsing issueFilters from localStorage:", error);
            return {
                selectedStatuses: [],
                selectedPriorities: [],
                selectedTypes: [],
                selectedAssignees: [],
                selectedCreators: [],
                selectedProjects: [],
                dates: { startDate: "", endDate: "" },
                statusSearch: "",
                typeSearch: "",
                assigneeSearch: "",
                creatorSearch: "",
                projectSearch: "",
            };
        }
    };

    const [selectedStatuses, setSelectedStatuses] = useState(
        getInitialFilters().selectedStatuses
    );
    const [selectedPriorities, setSelectedPriorities] = useState(
        getInitialFilters().selectedPriorities
    );
    const [selectedTypes, setSelectedTypes] = useState(
        getInitialFilters().selectedTypes
    );
    const [selectedAssignees, setSelectedAssignees] = useState(
        getInitialFilters().selectedAssignees
    );
    const [selectedCreators, setSelectedCreators] = useState(
        getInitialFilters().selectedCreators
    );
    const [selectedProjects, setSelectedProjects] = useState(
        getInitialFilters().selectedProjects
    );
    const [dates, setDates] = useState(getInitialFilters().dates);
    const [statusSearch, setStatusSearch] = useState(
        getInitialFilters().statusSearch
    );
    const [typeSearch, setTypeSearch] = useState(getInitialFilters().typeSearch);
    const [assigneeSearch, setAssigneeSearch] = useState(
        getInitialFilters().assigneeSearch
    );
    const [creatorSearch, setCreatorSearch] = useState(
        getInitialFilters().creatorSearch
    );
    const [projectSearch, setProjectSearch] = useState(
        getInitialFilters().projectSearch
    );

    // Save filters to localStorage
    useEffect(() => {
        const filters = {
            selectedStatuses,
            selectedPriorities,
            selectedTypes,
            selectedAssignees,
            selectedCreators,
            selectedProjects,
            dates,
            statusSearch,
            typeSearch,
            assigneeSearch,
            creatorSearch,
            projectSearch,
        };
        if (
            selectedStatuses.length > 0 ||
            selectedPriorities.length > 0 ||
            selectedTypes.length > 0 ||
            selectedAssignees.length > 0 ||
            selectedCreators.length > 0 ||
            selectedProjects.length > 0 ||
            statusSearch ||
            typeSearch ||
            assigneeSearch ||
            creatorSearch ||
            projectSearch ||
            dates.startDate ||
            dates.endDate
        ) {
            localStorage.setItem("issueFilters", JSON.stringify(filters));
        }
    }, [
        selectedStatuses,
        selectedPriorities,
        selectedTypes,
        selectedAssignees,
        selectedCreators,
        selectedProjects,
        dates,
        statusSearch,
        typeSearch,
        assigneeSearch,
        creatorSearch,
        projectSearch,
    ]);

    // Dropdown open/close state
    const [dropdowns, setDropdowns] = useState({
        status: false,
        priority: false,
        issueType: false,
        assignee: false,
        createdBy: false,
        project: false,
        startDate: false,
        endDate: false,
    });

    const toggleDropdown = (key: string) => {
        setDropdowns((prev) => {
            const isAlreadyOpen = prev[key as keyof typeof prev];
            if (isAlreadyOpen) {
                return { ...prev, [key]: false };
            }
            return {
                status: false,
                priority: false,
                issueType: false,
                assignee: false,
                createdBy: false,
                project: false,
                startDate: false,
                endDate: false,
                [key]: true,
            };
        });
    };

    // Toggle checkbox option selection
    const toggleOption = (
        value: string,
        selected: string[],
        setSelected: (selected: string[]) => void
    ) => {
        if (selected.includes(value)) {
            setSelected(selected.filter((v) => v !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Render checkbox list with search filtering
    const renderCheckboxList = (
        options: any[],
        selected: string[],
        setSelected: (selected: string[]) => void,
        searchTerm: string = ""
    ) => {
        const filtered = options.filter((opt) =>
            typeof opt === "string"
                ? opt.toLowerCase().includes(searchTerm.toLowerCase())
                : opt.label?.toLowerCase().includes(searchTerm?.toLowerCase())
        );

        return (
            <div className="max-h-40 overflow-y-auto p-2">
                {filtered.map((option) => {
                    const label = typeof option === "string" ? option : option.label;
                    const value = typeof option === "string" ? option : option.value;
                    const color = typeof option === "string" ? null : option.color;
                    return (
                        <label
                            key={value}
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
                {filtered.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">
                        No results found
                    </div>
                )}
            </div>
        );
    };

    // Clear all selections and reset to initial data
    const clearAll = () => {
        // Clear all state
        setSelectedStatuses([]);
        setSelectedPriorities([]);
        setSelectedTypes([]);
        setSelectedAssignees([]);
        setSelectedCreators([]);
        setSelectedProjects([]);
        setStatusSearch("");
        setTypeSearch("");
        setAssigneeSearch("");
        setCreatorSearch("");
        setProjectSearch("");
        setDates({ startDate: "", endDate: "" });
        localStorage.removeItem("issueFilters");

        // Build empty filter query to clear all filters
        const emptyFilters: Record<string, any> = {
            "q[status_in][]": [],
            "q[issue_type_in][]": [],
            "q[priority_in][]": [],
            "q[responsible_person_id_in][]": [],
            "q[created_by_id_in][]": [],
            "q[project_management_id_in][]": [],
            "q[start_date_eq]": "",
            "q[end_date_eq]": "",
        };
        const emptyQueryString = qs.stringify(emptyFilters, {
            arrayFormat: "repeat",
        });

        // Use setTimeout to ensure state updates are applied before calling onApplyFilters
        setTimeout(() => {
            // Apply empty filter to reload all data
            onApplyFilters?.(emptyQueryString);

            // Show success toast
            toast.success("Filters reset successfully");
        }, 0);
    };

    // Apply filters and dispatch API call
    const handleApplyFilters = () => {
        const newFilters: Record<string, any> = {
            "q[status_in][]": selectedStatuses,
            "q[issue_type_in][]": selectedTypes,
            "q[priority_in][]": selectedPriorities,
            "q[responsible_person_id_in][]": selectedAssignees,
            "q[created_by_id_in][]": selectedCreators,
            "q[project_management_id_in][]": selectedProjects,
            "q[start_date_eq]": dates.startDate || "",
            "q[end_date_eq]": dates.endDate || "",
        };
        const queryString = qs.stringify(newFilters, { arrayFormat: "repeat" });
        onApplyFilters?.(queryString);
        closeModal();
    };

    // const issueTypeOptions =
    //     issueTypes && issueTypes.length > 0
    //         ? issueTypes.map((type: any) => ({
    //             label: type.name,
    //             value: type.id,
    //         }))
    //         : [];

    const userOptions =
        users && users.length > 0
            ? users.map((user: any) => ({
                label: user.full_name,
                value: user.id || `${user.firstname}-${user.lastname}`,
            }))
            : [];

    const projectOptions =
        projects && projects.length > 0
            ? projects.map((project: any) => ({
                label: project.title || project.project_code,
                value: project.id,
            }))
            : [];

    return (
        <>
            {/* Backdrop */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={closeModal}
                />
            )}

            {/* Modal */}
            <div
                ref={modalRef}
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${isModalOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold">Filter Issues</h2>
                    <X className="cursor-pointer" onClick={closeModal} />
                </div>

                <div className="flex-1 overflow-y-auto divide-y">
                    {/* Status Filter */}
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

                    {/* Priority Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("priority")}
                        >
                            <span className="font-medium text-sm select-none">Priority</span>
                            {dropdowns.priority ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.priority && (
                            <div className="mt-4 border">
                                {renderCheckboxList(
                                    priorityOptions,
                                    selectedPriorities,
                                    setSelectedPriorities
                                )}
                            </div>
                        )}
                    </div>

                    {/* Issue Type Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("issueType")}
                        >
                            <span className="font-medium text-sm select-none">
                                Issue Type
                            </span>
                            {dropdowns.issueType ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.issueType && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter issue type..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={typeSearch}
                                        onChange={(e) => setTypeSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    issueTypes,
                                    selectedTypes,
                                    setSelectedTypes,
                                    typeSearch
                                )}
                            </div>
                        )}
                    </div>

                    {/* Project Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("project")}
                        >
                            <span className="font-medium text-sm select-none">Project</span>
                            {dropdowns.project ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.project && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter project..."
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

                    {/* Assigned To Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("assignee")}
                        >
                            <span className="font-medium text-sm select-none">
                                Assigned To
                            </span>
                            {dropdowns.assignee ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.assignee && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search
                                        className="absolute left-3 top-2.5 text-red-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filter assignee..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={assigneeSearch}
                                        onChange={(e) => setAssigneeSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    userOptions,
                                    selectedAssignees,
                                    setSelectedAssignees,
                                    assigneeSearch
                                )}
                            </div>
                        )}
                    </div>

                    {/* Raised By Filter */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("createdBy")}
                        >
                            <span className="font-medium text-sm select-none">
                                Raised By
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
                                        placeholder="Filter raised by..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={creatorSearch}
                                        onChange={(e) => setCreatorSearch(e.target.value)}
                                    />
                                </div>
                                {renderCheckboxList(
                                    userOptions,
                                    selectedCreators,
                                    setSelectedCreators,
                                    creatorSearch
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center items-center gap-4 px-6 py-3 border-t">
                    <button
                        className="bg-[#C62828] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c] transition-colors duration-200"
                        onClick={handleApplyFilters}
                    >
                        Apply
                    </button>
                    <button
                        className="border border-[#C62828] text-[#C62828] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50 transition-colors duration-200"
                        onClick={clearAll}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </>
    );
};

export default IssueFilterModal;
