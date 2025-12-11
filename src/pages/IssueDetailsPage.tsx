import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssueById, updateIssue, deleteIssue } from "@/store/slices/issueSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import AddIssueModal from "@/components/AddIssueModal";

interface Issue {
    id?: string;
    title?: string;
    description?: string;
    issue_type?: string;
    priority?: string;
    status?: string;
    assigned_to?: string;
    assigned_to_id?: string;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
    start_date?: string;
    due_date?: string;
    project_id?: string;
    milestone_id?: string;
    task_id?: string;
    tags?: string[];
    attachments?: any[];
    comments?: any[];
}

const IssueDetailsPage = () => {
    const navigate = useNavigate();
    const { issueId } = useParams<{ issueId: string }>();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [issueData, setIssueData] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fetch issue details
    useEffect(() => {
        if (issueId && baseUrl && token) {
            setLoading(true);
            dispatch(fetchIssueById({ baseUrl, token, id: issueId }))
                .unwrap()
                .then((data) => {
                    setIssueData(data);
                })
                .catch((error) => {
                    toast.error(
                        error instanceof Error ? error.message : "Failed to load issue"
                    );
                    navigate(-1);
                })
                .finally(() => setLoading(false));
        }
    }, [issueId, baseUrl, token, dispatch, navigate]);

    const handleDeleteIssue = async () => {
        if (!window.confirm("Are you sure you want to delete this issue?")) return;

        try {
            await dispatch(deleteIssue({ baseUrl, token, id: issueId! })).unwrap();
            toast.success("Issue deleted successfully");
            navigate(-1);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete issue"
            );
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "urgent":
                return "bg-red-100 text-red-800";
            case "high":
                return "bg-orange-100 text-orange-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
            case "in progress":
                return "bg-purple-100 text-purple-800";
            case "on_hold":
            case "on hold":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "closed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading issue details...</div>
            </div>
        );
    }

    if (!issueData) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Issue not found</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 p-0"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {issueData.title}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Created by {issueData.created_by} on{" "}
                            {formatDate(issueData.created_at)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteIssue}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Status and Priority Badges */}
                <div className="flex gap-3">
                    <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded ${getStatusColor(issueData.status || "")}`}
                    >
                        {issueData.status || "N/A"}
                    </span>
                    <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded ${getPriorityColor(issueData.priority || "")}`}
                    >
                        {issueData.priority || "N/A"}
                    </span>
                </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Type */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Type</h3>
                        <p className="text-lg font-semibold text-gray-900">
                            {issueData.issue_type || "N/A"}
                        </p>
                    </div>

                    {/* Assigned To */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Assigned To</h3>
                        <p className="text-lg font-semibold text-gray-900">
                            {issueData.assigned_to || "Unassigned"}
                        </p>
                    </div>

                    {/* Start Date */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Start Date</h3>
                        <p className="text-lg font-semibold text-gray-900">
                            {formatDate(issueData.start_date)}
                        </p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Due Date */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Due Date</h3>
                        <p className="text-lg font-semibold text-gray-900">
                            {formatDate(issueData.due_date)}
                        </p>
                    </div>

                    {/* Updated At */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Last Updated</h3>
                        <p className="text-lg font-semibold text-gray-900">
                            {formatDate(issueData.updated_at)}
                        </p>
                    </div>

                    {/* Tags */}
                    {issueData.tags && issueData.tags.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {issueData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {issueData.description || "No description provided"}
                </div>
            </div>

            {/* Attachments Section */}
            {issueData.attachments && issueData.attachments.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                    <div className="space-y-2">
                        {issueData.attachments.map((attachment, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                            >
                                <span className="text-sm text-gray-700">
                                    {attachment.name || `Attachment ${index + 1}`}
                                </span>
                                <button className="text-blue-600 hover:text-blue-800">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comments Section */}
            {issueData.comments && issueData.comments.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
                    <div className="space-y-4">
                        {issueData.comments.map((comment, index) => (
                            <div
                                key={index}
                                className="border-b border-gray-200 pb-4 last:border-b-0"
                            >
                                <p className="text-sm font-medium text-gray-900">
                                    {comment.author || "Anonymous"}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                    {formatDate(comment.created_at)}
                                </p>
                                <p className="text-sm text-gray-700">{comment.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            <AddIssueModal
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                issueData={issueData}
                isEditMode={true}
                onIssueCreated={() => {
                    if (issueId && baseUrl && token) {
                        dispatch(fetchIssueById({ baseUrl, token, id: issueId }))
                            .unwrap()
                            .then((data) => setIssueData(data));
                    }
                }}
            />
        </div>
    );
};

export default IssueDetailsPage;
