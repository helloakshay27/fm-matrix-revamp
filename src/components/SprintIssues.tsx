import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Eye, Plus } from "lucide-react";
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import axios from "axios";
import { toast } from "sonner";
import { useUpdateIssue } from "@/hooks/useIssues";

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
];

const ISSUE_STATUS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "reopen", label: "Reopen" },
    { value: "closed", label: "Closed" },
];

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
});

const SprintIssues = ({ issues }: { issues: any[] }) => {
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [users, setUsers] = useState<any[]>([]);
    const [issueTypeOptions, setIssueTypeOptions] = useState<{ value: any; label: string }[]>([]);

    const updateMutation = useUpdateIssue();

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
        try {
            await updateMutation.mutateAsync({ id: issueId, data: { responsible_person_id: assignedToId }, baseUrl, token });
            toast.success("Issue updated successfully");
        } catch (error) {
            toast.error("Failed to update issue");
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
            return (
                <div className="flex flex-col gap-2">
                    <div
                        className="max-w-[500px] overflow-hidden text-ellipsis whitespace-nowrap font-medium"
                        title={item.title}
                    >
                        {item.title}
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
                closed: { dot: "bg-red-500" },
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
        <Button className="bg-[#C72030] hover:bg-[#A01020] text-white" onClick={() => navigate("/vas/issues")}>
            <Plus className="w-4 h-4 mr-2" />
            Add
        </Button>
    );

    return (
        <EnhancedTable
            data={mappedIssues}
            columns={columns}
            renderCell={renderCell}
            leftActions={leftActions}
        />
    );
};

export default SprintIssues;
