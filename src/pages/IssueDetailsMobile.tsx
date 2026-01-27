import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface IssueData {
    id: number;
    [key: string]: any;
}

const IssueDetailsMobile = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isIssueInfoExpanded, setIsIssueInfoExpanded] = useState(true);
    const [issueData, setIssueData] = useState<IssueData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchIssueDetails(id);
        }
    }, [id]);

    const fetchIssueDetails = async (issueId: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const baseUrl = localStorage.getItem("baseUrl") ?? "lockated-api.gophygital.work";

            if (!token) {
                toast.error('Authentication token not found');
                return;
            }

            const response = await fetch(
                `https://${baseUrl}/issues/${issueId}.json?token=${token}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setIssueData(data.issue || data);
        } catch (error) {
            console.error('Failed to load issue details:', error);
            toast.error('Failed to load issue details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-red-500 text-white";
            case "in_progress":
                return "bg-blue-500 text-white";
            case "closed":
                return "bg-green-600 text-white";
            case "resolved":
                return "bg-green-500 text-white";
            case "on_hold":
                return "bg-orange-400 text-white";
            case "pending":
                return "bg-yellow-400 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "critical":
                return "bg-red-600 text-white";
            case "high":
                return "bg-orange-500 text-white";
            case "medium":
                return "bg-yellow-500 text-white";
            case "low":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    const transformStatus = (status: string): string => {
        const statusMap: Record<string, string> = {
            "open": "OPEN",
            "in_progress": "IN PROGRESS",
            "closed": "CLOSED",
            "on_hold": "ON HOLD",
            "resolved": "RESOLVED",
            "pending": "PENDING",
        };
        return statusMap[status] || status.toUpperCase();
    };

    const transformPriority = (priority: string): string => {
        const priorityMap: Record<string, string> = {
            "high": "HIGH",
            "medium": "MEDIUM",
            "low": "LOW",
            "critical": "CRITICAL",
        };
        return priorityMap[priority] || priority.toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!issueData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Issue not found</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-3"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Title Section */}
                {issueData.title && (
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h1 className="text-2xl font-bold text-gray-900">{issueData.title}</h1>
                        <p className="text-sm text-gray-600 mt-2">Issue ID: #{issueData.id}</p>
                    </div>
                )}

                {/* Description Section */}
                {issueData.description && (
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{issueData.description}</p>
                    </div>
                )}

                {/* Issue Details Card */}
                <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                    {/* Collapsible Header */}
                    <button
                        onClick={() => setIsIssueInfoExpanded(!isIssueInfoExpanded)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-white border-b border-gray-200"
                    >
                        <span className="font-semibold text-gray-900">Issue Details</span>
                        <ChevronDown
                            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isIssueInfoExpanded ? 'transform rotate-180' : ''
                                }`}
                        />
                    </button>

                    {/* Issue Info Content */}
                    {isIssueInfoExpanded && (
                        <div className="px-4 py-3 space-y-3">
                            {/* Issue Type */}
                            {issueData.issue_type_name && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Type</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{issueData.issue_type_name}</span>
                                </div>
                            )}

                            {/* Status */}
                            {issueData.status && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Status</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{transformStatus(issueData.status)}</span>
                                </div>
                            )}

                            {/* Priority */}
                            {issueData.priority && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Priority</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{transformPriority(issueData.priority)}</span>
                                </div>
                            )}

                            {/* Assigned To */}
                            {(issueData.responsible_person?.name || issueData.assigned_to) && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Assigned To</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{issueData.responsible_person?.name || issueData.assigned_to}</span>
                                </div>
                            )}

                            {/* Created By */}
                            {(issueData.created_by?.name || issueData.created_by) && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Created By</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">
                                        {typeof issueData.created_by === 'object' ? issueData.created_by.name : issueData.created_by}
                                    </span>
                                </div>
                            )}

                            {/* Project */}
                            {issueData.project_management_name && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Project</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{issueData.project_management_name}</span>
                                </div>
                            )}

                            {/* Milestone */}
                            {issueData.milstone_name && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Milestone</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{issueData.milstone_name}</span>
                                </div>
                            )}

                            {/* Task */}
                            {issueData.task_management_name && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Task</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{issueData.task_management_name}</span>
                                </div>
                            )}

                            {/* Start Date */}
                            {issueData.start_date && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Start Date</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">
                                        {new Date(issueData.start_date).toLocaleDateString("en-GB")}
                                    </span>
                                </div>
                            )}

                            {/* Due Date */}
                            {(issueData.due_date || issueData.end_date) && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Due Date</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">
                                        {new Date(issueData.due_date || issueData.end_date).toLocaleDateString("en-GB")}
                                    </span>
                                </div>
                            )}

                            {/* Created At */}
                            {issueData.created_at && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Created At</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">
                                        {new Date(issueData.created_at).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            )}

                            {/* Updated At */}
                            {issueData.updated_at && (
                                <div className="flex items-start">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Updated At</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">
                                        {new Date(issueData.updated_at).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Tags Section */}
                {issueData.tags && issueData.tags.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {issueData.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Attachments Section */}
                {issueData.attachments && issueData.attachments.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Attachments</h3>
                        <div className="space-y-2">
                            {issueData.attachments.map((attachment: any, index: number) => (
                                <a
                                    key={index}
                                    href={attachment.file_url || attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    <span className="truncate">{attachment.file_name || attachment.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueDetailsMobile;
