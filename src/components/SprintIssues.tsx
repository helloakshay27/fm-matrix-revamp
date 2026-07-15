import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight, Eye, Filter, Pause, Play, Plus, Search, X } from "lucide-react";
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import axios from "axios";
import { toast } from "sonner";
import { useUpdateIssue } from "@/hooks/useIssues";
import clsx from "clsx";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";

const columns: ColumnConfig[] = [
    { key: "actions", label: "Actions", sortable: false, draggable: false, defaultVisible: true },
    { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "title", label: "Title", sortable: true, draggable: true, defaultVisible: true },
    { key: "project_name", label: "Project Name", sortable: true, draggable: true, defaultVisible: true },
    { key: "issue_type", label: "Type", sortable: true, draggable: true, defaultVisible: true },
    { key: "priority", label: "Priority", sortable: true, draggable: true, defaultVisible: true },
    { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
    { key: "assigned_to", label: "Responsible Person", sortable: true, draggable: true, defaultVisible: true },
    { key: "raised_by", label: "Raised By", sortable: true, draggable: true, defaultVisible: true },
    { key: "start_date", label: "Start Date", sortable: true, draggable: true, defaultVisible: true },
    { key: "due_date", label: "End Date", sortable: true, draggable: true, defaultVisible: true },
    { key: "started_time", label: "Actual Efforts Taken", sortable: false, draggable: true, defaultVisible: true },
];

const ISSUE_STATUS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "reopen", label: "Reopen" },
    { value: "closed", label: "Closed" },
    { value: "overdue", label: "Overdued" },
];

const FILTER_STATUS_OPTIONS = [
    { label: "Open", value: "open", color: "bg-blue-500" },
    { label: "In Progress", value: "in_progress", color: "bg-amber-500" },
    { label: "On Hold", value: "on_hold", color: "bg-gray-500" },
    { label: "Completed", value: "completed", color: "bg-teal-500" },
    { label: "Reopen", value: "reopen", color: "bg-orange-500" },
    { label: "Closed", value: "closed", color: "bg-red-500" },
];

const FILTER_PRIORITY_OPTIONS = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
];

const EMPTY_FILTERS = {
    statuses: [] as string[],
    priorities: [] as string[],
    types: [] as string[],
    assignees: [] as string[],
    raisedBy: [] as string[],
};

type FilterState = typeof EMPTY_FILTERS;

const mapIssueData = (issue: any) => ({
    id: issue.id?.toString() || "",
    project_name: issue.project_management_name || "Not Selected",
    milestone_name: issue.milestone_name,
    task_name: issue.task_management_name,
    sub_task_name: issue.sub_task_management_name,
    title: issue.title || "",
    description: issue.description || "",
    issue_type: issue.issue_type || "",
    priority: issue.priority || "",
    status: issue.status || "open",
    assigned_to: issue.responsible_person_id,
    raised_by: issue?.created_by?.name,
    start_date: issue.start_date ? new Date(issue.start_date).toLocaleDateString() : "",
    due_date: issue.end_date ? new Date(issue.end_date).toLocaleDateString() : "",
    is_started: issue.is_started || false,
    active_time_till_now: issue.active_time_till_now || null,
});

const SprintIssues = ({ issues }: { issues: any[] }) => {
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [users, setUsers] = useState<any[]>([]);
    const [issueTypeOptions, setIssueTypeOptions] = useState<{ value: any; label: string }[]>([]);

    // Filter state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pendingFilters, setPendingFilters] = useState<FilterState>(EMPTY_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<FilterState>(EMPTY_FILTERS);
    const [filterDropdowns, setFilterDropdowns] = useState({
        status: false, priority: false, type: false, assignee: false, raisedBy: false,
    });
    const [filterSearch, setFilterSearch] = useState({
        status: "", priority: "", type: "", assignee: "", raisedBy: "",
    });

    const updateMutation = useUpdateIssue();

    // Pause / Play modal state
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [pauseIssueId, setPauseIssueId] = useState<number | null>(null);
    const [isPauseLoading, setIsPauseLoading] = useState(false);

    // Responsible Person Change Modal State
    const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
    const [responsibleTaskId, setResponsibleTaskId] = useState<string | null>(null);
    const [pendingResponsiblePersonId, setPendingResponsiblePersonId] = useState<string | null>(null);
    const [isResponsibleLoading, setIsResponsibleLoading] = useState(false);

    const getUsers = useCallback(async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(response.data.users);
        } catch (error) {
            console.log(error);
        }
    }, [baseUrl, token]);

    const fetchIssueTypes = useCallback(async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/issue_types.json`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIssueTypeOptions(
                (response.data || []).map((i: any) => ({ value: i.id, label: i.name }))
            );
        } catch (error) {
            console.error("Error fetching issue types:", error);
        }
    }, [baseUrl, token]);

    useEffect(() => {
        if (token && baseUrl) {
            getUsers();
            fetchIssueTypes();
        }
    }, [token, baseUrl]);

    const handleIssueTypeChange = async (issueId: string, newType: string) => {
        try {
            await updateMutation.mutateAsync({ id: issueId, data: { issue_type: newType }, baseUrl, token });
            toast.success("Issue type updated successfully");
        } catch (error) {
            toast.error("Failed to update issue type");
        }
    };

    const handleIssueUpdate = async (issueId: string, assignedToId: string) => {
        const currentIssue = issues.find((issue: any) => String(issue.id) === String(issueId));
        const currentAssignedTo = currentIssue?.responsible_person_id;
        if (currentAssignedTo && currentAssignedTo !== assignedToId) {
            setResponsibleTaskId(issueId);
            setPendingResponsiblePersonId(assignedToId);
            setIsResponsibleModalOpen(true);
        } else {
            try {
                await updateMutation.mutateAsync({ id: issueId, data: { responsible_person_id: assignedToId }, baseUrl, token });
                toast.success("Issue updated successfully");
            } catch (error) {
                toast.error("Failed to update issue");
            }
        }
    };

    const handleResponsiblePersonChange = async (reason: string, issueId: string, newPersonId: string) => {
        setIsResponsibleLoading(true);
        try {
            await updateMutation.mutateAsync({ id: issueId, data: { responsible_person_id: newPersonId }, baseUrl, token });
            toast.success("Issue responsible person updated successfully");
            setIsResponsibleModalOpen(false);
            setResponsibleTaskId(null);
            setPendingResponsiblePersonId(null);
        } catch (error) {
            toast.error("Failed to update issue");
        } finally {
            setIsResponsibleLoading(false);
        }
    };

    const handlePlayIssue = async (id: number) => {
        try {
            await updateMutation.mutateAsync({ id: String(id), data: { status: "started" }, baseUrl, token });
            toast.success("Issue started successfully");
        } catch (error) {
            toast.error("Failed to start issue");
        }
    };

    const handlePauseIssueSubmit = async (reason: string, iid: number) => {
        if (!iid) return;
        setIsPauseLoading(true);
        try {
            await updateMutation.mutateAsync({ id: String(iid), data: { status: "stopped" }, baseUrl, token });
            toast.success("Issue paused successfully");
            setIsPauseModalOpen(false);
            setPauseIssueId(null);
        } catch (error) {
            toast.error("Failed to pause issue");
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handleEndIssueSubmit = async (reason: string, iid: number) => {
        if (!iid) return;
        setIsPauseLoading(true);
        try {
            await updateMutation.mutateAsync({ id: String(iid), data: { status: "completed" }, baseUrl, token });
            toast.success("Issue ended successfully");
            setIsPauseModalOpen(false);
            setPauseIssueId(null);
        } catch (error) {
            toast.error("Failed to end issue");
        } finally {
            setIsPauseLoading(false);
        }
    };

    const handleIssueStatusChange = async (issueId: string, newStatus: string) => {
        try {
            await updateMutation.mutateAsync({ id: issueId, data: { status: newStatus }, baseUrl, token });
            toast.success("Issue status updated successfully");
        } catch (error) {
            toast.error("Failed to update issue status");
        }
    };

    const mappedIssues = issues.map(mapIssueData);

    // Apply frontend filters
    const filteredIssues = mappedIssues.filter((item) => {
        if (appliedFilters.statuses.length > 0 && !appliedFilters.statuses.includes(item.status)) return false;
        if (appliedFilters.priorities.length > 0 && !appliedFilters.priorities.includes(item.priority?.toLowerCase())) return false;
        if (appliedFilters.types.length > 0 && !appliedFilters.types.includes(String(item.issue_type))) return false;
        if (appliedFilters.assignees.length > 0 && !appliedFilters.assignees.includes(String(item.assigned_to))) return false;
        if (appliedFilters.raisedBy.length > 0 && !appliedFilters.raisedBy.includes(item.raised_by)) return false;
        return true;
    });

    const activeFilterCount = Object.values(appliedFilters).filter((v) => v.length > 0).length;

    const toggleFilterDropdown = (key: keyof typeof filterDropdowns) => {
        setFilterDropdowns((prev) => ({
            status: false, priority: false, type: false, assignee: false, raisedBy: false,
            [key]: !prev[key],
        }));
    };

    const toggleFilterOption = (key: keyof FilterState, value: string) => {
        setPendingFilters((prev) => {
            const current = prev[key] as string[];
            return {
                ...prev,
                [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
            };
        });
    };

    const applyFilters = () => {
        setAppliedFilters(pendingFilters);
        setIsFilterOpen(false);
    };

    const resetFilters = () => {
        setPendingFilters(EMPTY_FILTERS);
        setAppliedFilters(EMPTY_FILTERS);
        setFilterSearch({ status: "", priority: "", type: "", assignee: "", raisedBy: "" });
        setIsFilterOpen(false);
        toast.success("Filters reset");
    };

    const openFilterPanel = () => {
        setPendingFilters(appliedFilters);
        setIsFilterOpen(true);
    };

    // Derive raised-by options from loaded issues
    const raisedByOptions = Array.from(
        new Map(mappedIssues.filter((i) => i.raised_by).map((i) => [i.raised_by, i.raised_by])).values()
    ).map((name) => ({ label: name, value: name }));

    const assigneeOptions = users.map((u) => ({ label: u.full_name, value: String(u.id) }));

    const renderFilterCheckboxList = (
        options: { label: string; value: string; color?: string }[],
        filterKey: keyof FilterState,
        searchKey: keyof typeof filterSearch
    ) => {
        const term = filterSearch[searchKey].toLowerCase();
        const filtered = options.filter((o) => o.label.toLowerCase().includes(term));
        return (
            <div className="max-h-40 overflow-y-auto p-2">
                {filtered.map((opt) => (
                    <label
                        key={opt.value}
                        className="flex items-center justify-between py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded"
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={(pendingFilters[filterKey] as string[]).includes(opt.value)}
                                onChange={() => toggleFilterOption(filterKey, opt.value)}
                            />
                            <span>{opt.label}</span>
                        </div>
                        {opt.color && <span className={clsx("w-2 h-2 rounded-full", opt.color)} />}
                    </label>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">No results found</div>
                )}
            </div>
        );
    };

    const renderCell = (item: any, columnKey: string) => {
        if (columnKey === "actions") {
            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="p-1"
                        onClick={() => navigate(`/vas/issues/${item.id}`)}
                        title="View Issue Details"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            );
        }
        if (columnKey === "title") {
            const isCompleted = item.status === "completed" || item.status === "closed";
            const isStarted = item.is_started;
            return (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 w-[20rem]">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="w-full truncate">{item.title}</span>
                                </TooltipTrigger>
                                <TooltipContent className="rounded-[5px]">
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {!isCompleted && (
                            isStarted ? (
                                <button
                                    onClick={() => { setPauseIssueId(Number(item.id)); setIsPauseModalOpen(true); }}
                                    className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
                                    title="Pause issue"
                                >
                                    <Pause size={13} className="text-orange-500" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePlayIssue(Number(item.id))}
                                    className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-50"
                                    title="Start issue"
                                >
                                    <Play size={13} className="text-green-500" />
                                </button>
                            )
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {item.milestone_name && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.milestone_name}
                            </span>
                        )}
                        {item.task_name && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.task_name}
                            </span>
                        )}
                        {item.sub_task_name && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {item.sub_task_name}
                            </span>
                        )}
                    </div>
                </div>
            );
        }
        if (columnKey === "started_time") {
            return <ActiveTimer activeTimeTillNow={item?.active_time_till_now} isStarted={item?.is_started} />;
        }
        if (columnKey === "priority") {
            return item[columnKey];
        }
        if (columnKey === "status") {
            const statusColorMap = {
                open: { dot: "bg-blue-500" },
                in_progress: { dot: "bg-amber-500" },
                on_hold: { dot: "bg-gray-500" },
                completed: { dot: "bg-teal-500" },
                reopen: { dot: "bg-orange-500" },
                closed: { dot: "bg-green-800" },
                overdue: { dot: "bg-red-500" },
            };
            const colors = statusColorMap[item.status as keyof typeof statusColorMap] || statusColorMap.open;
            return (
                <FormControl variant="standard" sx={{ width: 148 }}>
                    <Select
                        value={item.status}
                        onChange={(e) => handleIssueStatusChange(item.id, e.target.value as string)}
                        disableUnderline
                        renderValue={(value) => (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span className={`inline-block w-2 h-2 rounded-full ${colors.dot}`}></span>
                                <span>{ISSUE_STATUS.find((opt) => opt.value === value)?.label || value}</span>
                            </div>
                        )}
                        sx={{ fontSize: "0.875rem", cursor: "pointer", "& .MuiSelect-select": { padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" } }}
                    >
                        {ISSUE_STATUS.map((opt) => {
                            const optColors = statusColorMap[opt.value as keyof typeof statusColorMap];
                            return (
                                <MenuItem key={opt.value} value={opt.value} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span className={`inline-block w-2 h-2 rounded-full ${optColors?.dot || "bg-gray-500"}`}></span>
                                    <span>{opt.label}</span>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            );
        }
        if (columnKey === "issue_type") {
            return (
                <FormControl variant="standard" sx={{ width: 128 }}>
                    <Select
                        value={item.issue_type}
                        onChange={(e) => handleIssueTypeChange(item.id, e.target.value as string)}
                        disableUnderline
                        sx={{ fontSize: "0.875rem", cursor: "pointer", "& .MuiSelect-select": { padding: "4px 0" } }}
                    >
                        {issueTypeOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        if (columnKey === "assigned_to") {
            return (
                <FormControl variant="standard" sx={{ width: 188 }}>
                    <Select
                        value={item.assigned_to}
                        onChange={(e) => handleIssueUpdate(item.id, e.target.value as string)}
                        disableUnderline
                        sx={{ fontSize: "0.875rem", cursor: "pointer", "& .MuiSelect-select": { padding: "4px 0" } }}
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        return item[columnKey];
    };

    const leftActions = (
        <div className="flex items-center gap-2">
            <Button className="bg-[#C72030] hover:bg-[#A01020] text-white" onClick={() => navigate("/vas/issues")}>
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
            {/* <Button
                variant="outline"
                className="relative border-[#C72030] text-[#C72030] hover:bg-red-50"
                onClick={openFilterPanel}
            >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#C72030] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {activeFilterCount}
                    </span>
                )}
            </Button> */}
        </div>
    );

    return (
        <>
            <EnhancedTable
                data={filteredIssues}
                columns={columns}
                renderCell={renderCell}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
                onFilterClick={openFilterPanel}
            />

            {isPauseModalOpen && (
                <IssuePauseModal
                    isOpen={isPauseModalOpen}
                    onClose={() => { setIsPauseModalOpen(false); setPauseIssueId(null); }}
                    onSubmit={handlePauseIssueSubmit}
                    onEndIssue={handleEndIssueSubmit}
                    isLoading={isPauseLoading}
                    issueId={pauseIssueId}
                />
            )}

            <ResponsiblePersonReasonModal
                isOpen={isResponsibleModalOpen}
                onClose={() => {
                    setIsResponsibleModalOpen(false);
                    setResponsibleTaskId(null);
                    setPendingResponsiblePersonId(null);
                }}
                onSubmit={(reason: string) => {
                    if (responsibleTaskId && pendingResponsiblePersonId) {
                        handleResponsiblePersonChange(reason, responsibleTaskId, pendingResponsiblePersonId);
                    }
                }}
                isLoading={isResponsibleLoading}
            />

            {/* Filter Backdrop */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}

            {/* Filter Drawer */}
            <div
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${isFilterOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold">Filter Issues</h2>
                    <X className="cursor-pointer" onClick={() => setIsFilterOpen(false)} />
                </div>

                <div className="flex-1 overflow-y-auto divide-y">
                    {/* Status */}
                    <div className="p-6 py-3">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown("status")}>
                            <span className="font-medium text-sm select-none">Status</span>
                            {filterDropdowns.status ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </div>
                        {filterDropdowns.status && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter status..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={filterSearch.status}
                                        onChange={(e) => setFilterSearch((p) => ({ ...p, status: e.target.value }))}
                                    />
                                </div>
                                {renderFilterCheckboxList(FILTER_STATUS_OPTIONS, "statuses", "status")}
                            </div>
                        )}
                    </div>

                    {/* Priority */}
                    <div className="p-6 py-3">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown("priority")}>
                            <span className="font-medium text-sm select-none">Priority</span>
                            {filterDropdowns.priority ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </div>
                        {filterDropdowns.priority && (
                            <div className="mt-4 border">
                                {renderFilterCheckboxList(FILTER_PRIORITY_OPTIONS, "priorities", "priority")}
                            </div>
                        )}
                    </div>

                    {/* Issue Type */}
                    <div className="p-6 py-3">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown("type")}>
                            <span className="font-medium text-sm select-none">Issue Type</span>
                            {filterDropdowns.type ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </div>
                        {filterDropdowns.type && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter issue type..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={filterSearch.type}
                                        onChange={(e) => setFilterSearch((p) => ({ ...p, type: e.target.value }))}
                                    />
                                </div>
                                {renderFilterCheckboxList(
                                    issueTypeOptions.map((o) => ({ label: o.label, value: String(o.value) })),
                                    "types",
                                    "type"
                                )}
                            </div>
                        )}
                    </div>

                    {/* Assigned To */}
                    <div className="p-6 py-3">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown("assignee")}>
                            <span className="font-medium text-sm select-none">Assigned To</span>
                            {filterDropdowns.assignee ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </div>
                        {filterDropdowns.assignee && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter assignee..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={filterSearch.assignee}
                                        onChange={(e) => setFilterSearch((p) => ({ ...p, assignee: e.target.value }))}
                                    />
                                </div>
                                {renderFilterCheckboxList(assigneeOptions, "assignees", "assignee")}
                            </div>
                        )}
                    </div>

                    {/* Raised By */}
                    <div className="p-6 py-3">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFilterDropdown("raisedBy")}>
                            <span className="font-medium text-sm select-none">Raised By</span>
                            {filterDropdowns.raisedBy ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                        </div>
                        {filterDropdowns.raisedBy && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter raised by..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={filterSearch.raisedBy}
                                        onChange={(e) => setFilterSearch((p) => ({ ...p, raisedBy: e.target.value }))}
                                    />
                                </div>
                                {renderFilterCheckboxList(raisedByOptions, "raisedBy", "raisedBy")}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-center items-center gap-4 px-6 py-3 border-t">
                    <button
                        className="bg-[#C62828] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c] transition-colors duration-200"
                        onClick={applyFilters}
                    >
                        Apply
                    </button>
                    <button
                        className="border border-[#C62828] text-[#C62828] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50 transition-colors duration-200"
                        onClick={resetFilters}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </>
    );
};

const IssuePauseModal = ({ isOpen, onClose, onSubmit, onEndIssue, isLoading, issueId }: any) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) setReason('');
    }, [isOpen]);

    const handlePause = () => {
        if (!reason.trim()) { toast.error('Please enter a reason for pausing'); return; }
        onSubmit(reason, issueId);
    };

    const handleEnd = () => {
        if (!reason.trim()) { toast.error('Please enter a reason for ending'); return; }
        onEndIssue(reason, issueId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[30rem]">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Reason for Pause/End</h2>
                <div className="mb-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        rows={4}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex gap-3 justify-between">
                    <Button onClick={handleEnd} disabled={isLoading} className="px-4 py-2 !bg-red-600 !text-white rounded-md disabled:opacity-50">
                        {isLoading ? 'Submitting...' : 'End Issue'}
                    </Button>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button onClick={handlePause} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                            {isLoading ? 'Submitting...' : 'Pause Issue'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResponsiblePersonReasonModal = ({ isOpen, onClose, onSubmit, isLoading }: any) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) setReason('');
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) { toast.error('Please enter a reason for changing the responsible person'); return; }
        onSubmit(reason);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[30rem]">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Reason for Responsible Person Change</h2>
                <div className="mb-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for changing responsible person..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {isLoading ? 'Submitting...' : 'Change Responsible Person'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SprintIssues;
