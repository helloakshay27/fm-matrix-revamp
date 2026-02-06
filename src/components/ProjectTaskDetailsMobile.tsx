import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskData {
    id: number;
    [key: string]: any;
}

const ProjectTaskDetailsMobile = () => {
    const navigate = useNavigate();
    const { id, taskId } = useParams<{ id: string, taskId: string }>();
    const [isPermitInfoExpanded, setIsPermitInfoExpanded] = useState(true);
    const [comments, setComments] = useState('');
    const [taskData, setTaskData] = useState<TaskData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (taskId) {
            fetchTaskDetails(taskId);
        }
    }, [taskId]);

    const fetchTaskDetails = async (taskId: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Authentication token not found');
                return;
            }

            const response = await fetch(
                `https://lockated-api.gophygital.work/task_managements/${taskId}.json?token=${token}`,
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
            setTaskData(data);
            setComments(data.comments || '');
        } catch (error) {
            console.error('Failed to load task details:', error);
            toast.error('Failed to load task details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!taskData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Task not found</p>
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
    const transformStatus = (status: string): string => {
        const statusMap: Record<string, string> = {
            "open": "OPEN",
            "in_progress": "IN PROGRESS",
            "completed": "CLOSED",
            "on_hold": "ON HOLD",
            "overdue": "OVERDUE",
        };
        return statusMap[status] || status.toUpperCase();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-600" };
            case "completed":
                return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-600" };
            case "in_progress":
                return { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-600" };
            case "on_hold":
                return { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-600" };
            case "overdue":
                return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-600" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-600" };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-shrink-0"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 truncate">
                        {taskData?.title || "Task Details"}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Description Card */}
                {taskData.description && (
                    <div className="bg-white rounded-[10px] shadow-lg mb-4 p-4">
                        <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {taskData.description}
                        </p>
                    </div>
                )}

                {/* Permit Info Card */}
                <div className="bg-white rounded-[10px] shadow-lg mb-4 overflow-hidden">
                    {/* Collapsible Header */}
                    <button
                        onClick={() => setIsPermitInfoExpanded(!isPermitInfoExpanded)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-white border-b border-gray-200"
                    >
                        <span className="font-semibold text-gray-900">Task Details</span>
                        <ChevronDown
                            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isPermitInfoExpanded ? 'transform rotate-180' : ''
                                }`}
                        />
                    </button>

                    {/* Permit Info Content */}
                    {isPermitInfoExpanded && (
                        <div className="px-4 py-3">
                            {/* Task ID */}
                            <div className="flex mb-3">
                                <span className="text-sm text-gray-700 w-32 flex-shrink-0">Task ID</span>
                                <span className="text-sm text-gray-500 mr-2">:</span>
                                <span className="text-sm text-gray-900 flex-1">{taskData.id}</span>
                            </div>

                            {/* Title */}
                            {taskData.title && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Title</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.title}</span>
                                </div>
                            )}

                            {/* Description */}


                            {/* Status */}
                            {taskData.status && (
                                <div className="flex mb-3 items-center">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Status</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    {(() => {
                                        const statusColor = getStatusColor(taskData.status);
                                        const displayStatus = transformStatus(taskData.status);
                                        return (
                                            <span className={`${statusColor.bg} ${statusColor.text} pl-2 pr-3 py-1 rounded-full font-medium text-xs flex items-center gap-1.5 w-fit`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                                                {displayStatus}
                                            </span>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Task Owner */}
                            {taskData.responsible_person && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Responsible Person</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.responsible_person.name}</span>
                                </div>
                            )}

                            {/* Start Date */}
                            {taskData.expected_start_date && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Start Date</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.expected_start_date}</span>
                                </div>
                            )}

                            {/* End Date */}
                            {taskData.target_date && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">End Date</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.target_date}</span>
                                </div>
                            )}

                            <div className="flex mb-3">
                                <span className="text-sm text-gray-700 w-32 flex-shrink-0">Efforts Duration:</span>
                                <span className="text-sm text-gray-500 mr-2">:</span>
                                <span className="text-sm text-gray-900 flex-1">{taskData.estimated_hour} hours</span>
                            </div>

                            <div className="flex mb-3">
                                <span className="text-sm text-gray-700 w-32 flex-shrink-0">Observers</span>
                                <span className="text-sm text-gray-500 mr-2">:</span>
                                <span className="text-sm text-gray-900 flex-1">{taskData.observers.map((observer: any) => observer.user_name).join(', ')}</span>
                            </div>

                            {/* Priority */}
                            {taskData.priority && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Priority</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.priority}</span>
                                </div>
                            )}

                            <div className="flex mb-3">
                                <span className="text-sm text-gray-700 w-32 flex-shrink-0">Tags</span>
                                <span className="text-sm text-gray-500 mr-2">:</span>
                                <span className="text-sm text-gray-900 flex-1">{taskData.task_tags.map((tag: any) => tag?.company_tag?.name).join(', ')}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                {/* <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-4 py-3">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Comments
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Enter your comments here..."
                            className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default ProjectTaskDetailsMobile