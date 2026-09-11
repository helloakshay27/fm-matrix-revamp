import { X, Search, ChevronRight, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import qs from "qs";
import { toast } from "sonner";
import axios from "axios";
import { renderGroupedUserCheckboxList } from "@/components/GroupedUserCheckboxList";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Date <-> "YYYY-MM-DD" helpers for the date range filter
const formatDateToYMD = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const parseYMDToDate = (value: string): Date | null => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

// "yyyy-MM-dd" -> "MM/DD/YYYY" for the date range input display
const formatYMDToDisplay = (value: string): string => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
};

const statusOptions = [
    { label: "Open", value: "open", color: "bg-blue-500" },
    { label: "In Progress", value: "in_progress", color: "bg-amber-500" },
    { label: "On Hold", value: "on_hold", color: "bg-gray-500" },
    { label: "Completed", value: "completed", color: "bg-teal-500" },
    { label: "Reopen", value: "reopen", color: "bg-orange-500" },
    { label: "Closed", value: "closed", color: "bg-green-800" },
    { label: "Overdued", value: "overdue", color: "bg-red-500" },
];

const priorityOptions = [
    { label: "Q1: Urgent & Important", value: "P1" },
    { label: "Q2: Important, Not Urgent", value: "P2" },
    { label: "Q3: Urgent, Not Important", value: "P3" },
    { label: "Q4: Not Urgent or Important", value: "P4" },
];

const IssueFilterModal = ({
    isModalOpen,
    setIsModalOpen,
    onApplyFilters,
    issueTypes,
    users,
    projects,
    hideProjectFilter = false,
    hideTagsFilter = false,
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
                    selectedTags: [],
                    dates: { completedAt: "" },
                    dateRangeFilter: { startDate: "", endDate: "" },
                    statusSearch: "",
                    typeSearch: "",
                    assigneeSearch: "",
                    creatorSearch: "",
                    projectSearch: "",
                    tagSearch: "",
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
                selectedTags: [],
                dates: { completedAt: "" },
                dateRangeFilter: { startDate: "", endDate: "" },
                statusSearch: "",
                typeSearch: "",
                assigneeSearch: "",
                creatorSearch: "",
                projectSearch: "",
                tagSearch: "",
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
    const [selectedTags, setSelectedTags] = useState(
        getInitialFilters().selectedTags
    );
    const [dates, setDates] = useState(getInitialFilters().dates);
    const [dateRangeFilter, setDateRangeFilter] = useState(
        getInitialFilters().dateRangeFilter
    );
    const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
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
    const [tagSearch, setTagSearch] = useState(
        getInitialFilters().tagSearch
    );
    const [tags, setTags] = useState<any[]>([]);

    // Save filters to localStorage
    useEffect(() => {
        const filters = {
            selectedStatuses,
            selectedPriorities,
            selectedTypes,
            selectedAssignees,
            selectedCreators,
            selectedProjects,
            selectedTags,
            dates,
            dateRangeFilter,
            statusSearch,
            typeSearch,
            assigneeSearch,
            creatorSearch,
            projectSearch,
            tagSearch,
        };
        if (
            selectedStatuses.length > 0 ||
            selectedPriorities.length > 0 ||
            selectedTypes.length > 0 ||
            selectedAssignees.length > 0 ||
            selectedCreators.length > 0 ||
            selectedProjects.length > 0 ||
            selectedTags.length > 0 ||
            statusSearch ||
            typeSearch ||
            assigneeSearch ||
            creatorSearch ||
            projectSearch ||
            tagSearch ||
            dates.completedAt ||
            dateRangeFilter.startDate ||
            dateRangeFilter.endDate
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
        selectedTags,
        dates,
        dateRangeFilter,
        statusSearch,
        typeSearch,
        assigneeSearch,
        creatorSearch,
        projectSearch,
        tagSearch,
    ]);

    // Dropdown open/close state
    const [dropdowns, setDropdowns] = useState({
        status: false,
        priority: false,
        issueType: false,
        assignee: false,
        createdBy: false,
        project: false,
        tags: false,
        completedAt: false,
        dateRange: false,
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
                completedAt: false,
                dateRange: false,
                tags: false,
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
        if (selected?.includes(value)) {
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
                ? opt.toLowerCase()?.includes(searchTerm.toLowerCase())
                : opt.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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
                                    checked={selected?.includes(value)}
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
        setSelectedTags([]);
        setStatusSearch("");
        setTypeSearch("");
        setAssigneeSearch("");
        setCreatorSearch("");
        setProjectSearch("");
        setTagSearch("");
        setDates({ completedAt: "" });
        setDateRangeFilter({ startDate: "", endDate: "" });
        localStorage.removeItem("issueFilters");

        // Use setTimeout to ensure state updates are applied before calling onApplyFilters
        setTimeout(() => {
            onApplyFilters?.("");

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
            "q[task_tags_company_tag_id_in][]": selectedTags,
        };
        if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
            newFilters["q[start_date_gteq]"] = dateRangeFilter.startDate;
            newFilters["q[start_date_lteq]"] = dateRangeFilter.endDate;
            newFilters["q[end_date_gteq]"] = dateRangeFilter.startDate;
            newFilters["q[end_date_lteq]"] = dateRangeFilter.endDate;
        }
        if (dates.completedAt) {
            newFilters["q[completed_at_gteq]"] = `${dates.completedAt} 00:00:00`;
            newFilters["q[completed_at_lteq]"] = `${dates.completedAt} 23:59:59`;
        }
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

    const projectOptions =
        projects && projects.length > 0
            ? projects.map((project: any) => ({
                label: project.title || project.project_code,
                value: project.id,
            }))
            : [];

    // Fetch tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(
                    `https://${baseUrl}/company_tags.json`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const tagsList = response.data || [];
                setTags(tagsList);
            } catch (error) {
                console.log("Error fetching tags:", error);
                // If the endpoint doesn't exist, tags can be empty
                setTags([]);
            }
        };

        if (token && baseUrl && !hideTagsFilter) {
            fetchTags();
        }
    }, [baseUrl, token, hideTagsFilter]);

    const tagOptions =
        tags && tags.length > 0
            ? tags.map((tag: any) => ({
                label: tag.name || tag.label,
                value: tag.id,
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
                    {!hideProjectFilter && (
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
                    )}

                    {/* Tags Filter */}
                    {!hideTagsFilter && (
                        <div className="p-6 py-3">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDropdown("tags")}
                            >
                                <span className="font-medium text-sm select-none">Tags</span>
                                {dropdowns.tags ? (
                                    <ChevronDown className="text-gray-400" />
                                ) : (
                                    <ChevronRight className="text-gray-400" />
                                )}
                            </div>
                            {dropdowns.tags && (
                                <div className="mt-4 border">
                                    <div className="relative border-b">
                                        <Search
                                            className="absolute left-3 top-2.5 text-red-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Filter tags..."
                                            className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                            value={tagSearch}
                                            onChange={(e) => setTagSearch(e.target.value)}
                                        />
                                    </div>
                                    {renderCheckboxList(
                                        tagOptions,
                                        selectedTags,
                                        setSelectedTags,
                                        tagSearch
                                    )}
                                </div>
                            )}
                        </div>
                    )}

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
                                {renderGroupedUserCheckboxList(
                                    users,
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
                                {renderGroupedUserCheckboxList(
                                    users,
                                    selectedCreators,
                                    setSelectedCreators,
                                    creatorSearch
                                )}
                            </div>
                        )}
                    </div>

                    {/* Completed At */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("completedAt")}
                        >
                            <span className="font-medium text-sm select-none">Completed At</span>
                            {dropdowns.completedAt ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.completedAt && (
                            <div className="mt-4">
                                <input
                                    type="date"
                                    value={dates.completedAt}
                                    onChange={(e) => setDates({ ...dates, completedAt: e.target.value })}
                                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                />
                            </div>
                        )}
                    </div>

                    {/* Date Range */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown("dateRange")}
                        >
                            <span className="font-medium text-sm select-none">Date Range</span>
                            {dropdowns.dateRange ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.dateRange && (
                            <div className="mt-4">
                                <div className="relative mb-3">
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder="MM/DD/YYYY – MM/DD/YYYY"
                                        onClick={() => setIsDateRangePickerOpen(true)}
                                        value={
                                            dateRangeFilter.startDate
                                                ? `${formatYMDToDisplay(dateRangeFilter.startDate)} – ${dateRangeFilter.endDate
                                                    ? formatYMDToDisplay(dateRangeFilter.endDate)
                                                    : "MM/DD/YYYY"
                                                }`
                                                : ""
                                        }
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 pr-9 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-600"
                                    />
                                    {dateRangeFilter.startDate ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDateRangeFilter({ startDate: "", endDate: "" })
                                            }
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            aria-label="Clear date range"
                                        >
                                            <X size={14} />
                                        </button>
                                    ) : (
                                        <CalendarIcon
                                            size={14}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                    )}
                                </div>
                                {isDateRangePickerOpen && (
                                    <DateRangePicker
                                        startDate={parseYMDToDate(dateRangeFilter.startDate)}
                                        endDate={parseYMDToDate(dateRangeFilter.endDate)}
                                        onChange={({ startDate, endDate }) => {
                                            setDateRangeFilter({
                                                startDate: startDate ? formatDateToYMD(startDate) : "",
                                                endDate: endDate ? formatDateToYMD(endDate) : "",
                                            });
                                            if (startDate && endDate) {
                                                setIsDateRangePickerOpen(false);
                                            }
                                        }}
                                    />
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
