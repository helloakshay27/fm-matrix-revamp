import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssues, deleteIssue, updateIssue } from "@/store/slices/issueSlice";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, Edit, ChevronDown, List, ChartNoAxesColumn } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import AddIssueModal from "@/components/AddIssueModal";
import { FormControl, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";

interface Issue {
    id?: string;
    project_name?: string;
    milestone_name?: string;
    task_name?: string;
    sub_task_name?: string;
    title?: string;
    description?: string;
    issue_type?: string;
    priority?: string;
    status?: string;
    assigned_to?: string;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
    start_date?: string;
    due_date?: string;
    project_id?: string;
    milestone_id?: string;
    task_id?: string;
}

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];
const STATUS_OPTIONS = ["Open", "In Progress", "On Hold", "Completed", "Closed"];
const ISSUE_TYPE_OPTIONS = ["Bug", "Feature", "Enhancement", "Documentation", "Support"];

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "ID",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "project_name",
        label: "Project Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "milestone_name",
        label: "Milestone Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "task_name",
        label: "Task Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "sub_task_name",
        label: "Subtask Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "title",
        label: "Title",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "issue_type",
        label: "Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "priority",
        label: "Priority",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "status",
        label: "Status",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "assigned_to",
        label: "Resible Person",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "start_date",
        label: "Start Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "due_date",
        label: "End Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
];

const ISSUSE_STATUS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "reopen", label: "Reopen" },
    { value: "closed", label: "Closed" },
];

const IssuesListPage = () => {
    const navigate = useNavigate();
    const { id: projectId } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const { data, loading } = useAppSelector(
        (state) => state.fetchIssues || { data: [], loading: false }
    );
    const rawIssues = Array.isArray(data.issues) ? data.issues : [];

    // Map API response to table format
    const mapIssueData = (issue: any): Issue => {
        return {
            id: issue.id?.toString() || "",
            project_name: issue.project_management_name || "Not Selected",
            milestone_name: issue.milstone_name || "Not Selected",
            task_name: issue.task_management_name || "Not Selected",
            sub_task_name: issue.sub_task_management_name || "Not Selected",
            title: issue.title || "",
            description: issue.description || "",
            issue_type: issue.issue_type || "",
            priority: issue.priority || "",
            status: issue.status || "Open",
            assigned_to: issue.responsible_person_id,
            created_by: issue.created_by?.full_name || issue.created_by_name || "",
            created_at: issue.created_at || "",
            updated_at: issue.updated_at || "",
            start_date: issue.start_date ? new Date(issue.start_date).toLocaleDateString() : "",
            due_date: issue.end_date ? new Date(issue.end_date).toLocaleDateString() : issue.target_date ? new Date(issue.target_date).toLocaleDateString() : "",
            project_id: issue.project_management_id || issue.project_id || "",
            milestone_id: issue.milestone_id || "",
            task_id: issue.task_management_id || issue.task_id || "",
        };
    };

    const issues: Issue[] = rawIssues.map(mapIssueData);

    const [users, setUsers] = useState([])
    const [issueTypeOptions, setIssueTypeOptions] = useState([]);
    const [openIssueModal, setOpenIssueModal] = useState(false);
    const [selectedView, setSelectedView] = useState<"List" | "Kanban">("List");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getUsers = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setUsers(response.users);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/issue_types.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const issueTypes = response.data.issue_types || response.data || [];
            setIssueTypeOptions(
                issueTypes.map((i: any) => ({
                    value: i.id,
                    label: i.name,
                }))
            );
        } catch (error) {
            console.error('Error fetching issue types:', error);
            toast.error('Failed to load issue types.');
        }
    };

    useEffect(() => {
        if (baseUrl && token) {
            fetchData();
        }
    }, [baseUrl, token]);

    useEffect(() => {
        dispatch(fetchIssues({ baseUrl, token, id: projectId })).unwrap();
    }, []);

    const handleOpenDialog = () => setOpenIssueModal(true);

    const handleDeleteIssue = async (issueId: string) => {
        if (!window.confirm("Are you sure you want to delete this issue?")) return;
        try {
            await dispatch(deleteIssue({ baseUrl, token, id: issueId })).unwrap();
            toast.success("Issue deleted successfully");
            if (projectId && baseUrl && token) {
                dispatch(fetchIssues({ baseUrl, token, id: projectId }));
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete issue");
        }
    };

    const renderActions = (item: any) => (
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

    const handleIssueTypeChange = async (issueId: string, newType: string) => {
        try {
            await dispatch(updateIssue({ baseUrl, token, id: issueId, data: { issue_type: newType } })).unwrap();
            toast.success("Issue type updated successfully");
            dispatch(fetchIssues({ baseUrl, token, id: projectId })).unwrap();
        } catch (error) {
            console.log(error)
        }
    }

    const handleIssueUpdate = async (issueId: string, assignedToId: string) => {
        try {
            await dispatch(updateIssue({ baseUrl, token, id: issueId, data: { responsible_person_id: assignedToId } })).unwrap();
            toast.success("Issue updated successfully");
            dispatch(fetchIssues({ baseUrl, token, id: projectId })).unwrap();
        } catch (error) {
            console.log(error)
        }
    }

    const handleIssueStatusChange = async (issueId: string, newStatus: string) => {
        try {
            await dispatch(updateIssue({ baseUrl, token, id: issueId, data: { status: newStatus } })).unwrap();
            toast.success("Issue status updated successfully");
            dispatch(fetchIssues({ baseUrl, token, id: projectId })).unwrap();
        } catch (error) {
            console.log(error)
        }
    }

    const renderCell = (item: any, columnKey: string) => {
        if (columnKey === "priority") {
            return item[columnKey]
        }
        if (columnKey === "status") {
            return <FormControl
                variant="standard"
                sx={{ width: 128 }} // same as w-32
            >
                <Select
                    value={item.status}
                    onChange={(e) =>
                        handleIssueStatusChange(item.id, e.target.value as string)
                    }
                    disableUnderline
                    sx={{
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        "& .MuiSelect-select": {
                            padding: "4px 0",
                        },
                    }}
                >
                    {ISSUSE_STATUS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        }
        if (columnKey === "issue_type") {
            return <FormControl
                variant="standard"
                sx={{ width: 128 }} // same as w-32
            >
                <Select
                    value={item.issue_type}
                    onChange={(e) =>
                        handleIssueTypeChange(item.id, e.target.value as string)
                    }
                    disableUnderline
                    sx={{
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        "& .MuiSelect-select": {
                            padding: "4px 0",
                        },
                    }}
                >
                    {issueTypeOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        }
        if (columnKey === "assigned_to") {
            return <FormControl
                variant="standard"
                sx={{ width: 128 }} // same as w-32
            >
                <Select
                    value={item.assigned_to}
                    onChange={(e) =>
                        handleIssueUpdate(item.id, e.target.value as string)
                    }
                    disableUnderline
                    sx={{
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        "& .MuiSelect-select": {
                            padding: "4px 0",
                        },
                    }}
                >
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.full_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        }
        return item[columnKey];
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={handleOpenDialog}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <EnhancedTable
                data={issues}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                loading={loading}
                leftActions={leftActions}
                emptyMessage="No issues found. Create one to get started."
            />

            {/* Add Issue Modal */}
            <AddIssueModal
                openDialog={openIssueModal}
                handleCloseDialog={() => setOpenIssueModal(false)}
            />
        </div>
    );
};

export default IssuesListPage;
