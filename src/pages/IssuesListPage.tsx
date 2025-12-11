import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssues, deleteIssue } from "@/store/slices/issueSlice";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, Edit, ChevronDown, List, ChartNoAxesColumn } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import AddIssueModal from "@/components/AddIssueModal";

interface Issue {
    id?: string;
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
        label: "Assigned To",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "due_date",
        label: "Due Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
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
    const issues = Array.isArray(data) ? data : [];

    const [openIssueModal, setOpenIssueModal] = useState(false);
    const [selectedView, setSelectedView] = useState<"List" | "Kanban">("List");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (projectId && baseUrl && token) {
            dispatch(fetchIssues({ baseUrl, token, id: projectId })).unwrap();
        }
    }, [projectId, dispatch, baseUrl, token]);

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
                onClick={() => navigate(`/issues/${item.id}`)}
                title="View Issue Details"
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => setOpenIssueModal(true)}
                title="Edit Issue"
            >
                <Edit className="w-4 h-4" />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={() => item.id && handleDeleteIssue(item.id)}
                title="Delete Issue"
            >
                <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
        </div>
    );

    const renderCell = (item: any, columnKey: string) => {
        if (columnKey === "priority") {
            const priorityColors: Record<string, string> = {
                Urgent: "bg-red-100 text-red-800",
                High: "bg-orange-100 text-orange-800",
                Medium: "bg-yellow-100 text-yellow-800",
                Low: "bg-green-100 text-green-800",
            };
            return (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[item[columnKey]] || "bg-gray-100 text-gray-800"}`}>
                    {item[columnKey]}
                </span>
            );
        }
        if (columnKey === "status") {
            const statusColors: Record<string, string> = {
                Open: "bg-blue-100 text-blue-800",
                "In Progress": "bg-purple-100 text-purple-800",
                "On Hold": "bg-yellow-100 text-yellow-800",
                Completed: "bg-green-100 text-green-800",
                Closed: "bg-gray-100 text-gray-800",
            };
            return (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item[columnKey]] || "bg-gray-100 text-gray-800"}`}>
                    {item[columnKey]}
                </span>
            );
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

    // const rightActions = (
    //     <div className="flex items-center">
    //         <div className="relative" ref={dropdownRef}>
    //             <button
    //                 onClick={() => setIsOpen(!isOpen)}
    //                 className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
    //             >
    //                 <span className="text-[#C72030] font-medium flex items-center gap-2">
    //                     {selectedView === "Kanban" ? (
    //                         <>
    //                             <ChartNoAxesColumn className="w-4 h-4" />
    //                             Kanban
    //                         </>
    //                     ) : (
    //                         <>
    //                             <List className="w-4 h-4" />
    //                             List
    //                         </>
    //                     )}
    //                     <ChevronDown className="w-4 h-4" />
    //                 </span>
    //             </button>
    //             {isOpen && (
    //                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
    //                     <button
    //                         onClick={() => {
    //                             setSelectedView("List");
    //                             setIsOpen(false);
    //                         }}
    //                         className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
    //                     >
    //                         <List className="w-4 h-4" />
    //                         List View
    //                     </button>
    //                     <button
    //                         onClick={() => {
    //                             setSelectedView("Kanban");
    //                             setIsOpen(false);
    //                         }}
    //                         className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
    //                     >
    //                         <ChartNoAxesColumn className="w-4 h-4" />
    //                         Kanban View
    //                     </button>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <EnhancedTable
                data={issues}
                columns={columns}
                onRowClick={(item) => navigate(`/issues/${item.id}`)}
                renderActions={renderActions}
                renderCell={renderCell}
                loading={loading}
                leftActions={leftActions}
                // rightActions={rightActions}
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
