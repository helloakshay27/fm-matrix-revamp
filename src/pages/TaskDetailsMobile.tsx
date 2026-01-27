import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface TaskData {
    id: number;
    [key: string]: any;
}

const TaskDetailsMobile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { taskId } = useParams<{ taskId: string }>();
    const [isTaskInfoExpanded, setIsTaskInfoExpanded] = useState(true);
    const [taskData, setTaskData] = useState<TaskData | null>(null);
    const [loading, setLoading] = useState(true);
    const [completionPercentage, setCompletionPercentage] = useState('');

    // Extract token from URL or storage
    let token: string | null = null;
    const searchParams = new URLSearchParams(location.search);
    token = searchParams.get('token') || searchParams.get('access_token');

    if (!token && location.hash) {
        const hash = location.hash.replace(/^#/, '');
        const hashParams = new URLSearchParams(hash);
        token = hashParams.get('token') || hashParams.get('access_token');
    }

    // Store token in storage if provided
    useEffect(() => {
        if (token) {
            sessionStorage.setItem('mobile_token', token);
            localStorage.setItem('token', token);
        }
    }, [token]);

    const baseUrl = localStorage.getItem("baseUrl") ?? "lockated-api.gophygital.work";
    const storedToken = sessionStorage.getItem("mobile_token") || localStorage.getItem("token");

    useEffect(() => {
        if (taskId) {
            fetchTaskDetails(taskId);
        }
    }, [taskId]);

    const fetchTaskDetails = async (id: string) => {
        try {
            setLoading(true);
            if (!storedToken) {
                toast.error('Authentication token not found');
                return;
            }

            const response = await axios.get(
                `https://${baseUrl}/task_managements/${id}.json?token=${storedToken}`
            );

            const data = response.data?.task_management || response.data;
            setTaskData(data);
            setCompletionPercentage(data.completion_percentage || '');
        } catch (error) {
            console.error('Failed to load task details:', error);
            toast.error('Failed to load task details');
        } finally {
            setLoading(false);
        }
    };

    const handleCompletionChange = async () => {
        if (!completionPercentage) {
            toast.error('Please enter a completion percentage');
            return;
        }

        const percentage = Number(completionPercentage);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            toast.error('Please enter a valid percentage (0-100)');
            return;
        }

        try {
            const payload = {
                task_management: {
                    completion_percentage: percentage,
                }
            };

            await axios.patch(
                `https://${baseUrl}/task_managements/${taskId}.json?token=${storedToken}`,
                payload,
            );

            if (taskData) {
                setTaskData({ ...taskData, completion_percentage: percentage });
            }
            toast.success('Task completion updated successfully');
        } catch (error) {
            console.error('Error updating task completion:', error);
            toast.error('Failed to update task completion');
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-3"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Task Details</h1>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Task Info Card */}
                <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                    {/* Collapsible Header */}
                    <button
                        onClick={() => setIsTaskInfoExpanded(!isTaskInfoExpanded)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-white border-b border-gray-200"
                    >
                        <span className="font-semibold text-gray-900">Task Details</span>
                        <ChevronDown
                            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isTaskInfoExpanded ? 'transform rotate-180' : ''}`}
                        />
                    </button>

                    {/* Task Info Content */}
                    {isTaskInfoExpanded && (
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
                            {taskData.description && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Description</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.description}</span>
                                </div>
                            )}

                            {/* Status */}
                            {taskData.status && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Status</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.status}</span>
                                </div>
                            )}

                            {/* Task Code */}
                            {taskData.task_code && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Task Code</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.task_code}</span>
                                </div>
                            )}

                            {/* Responsible Person */}
                            {taskData.responsible_person_name && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Responsible</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.responsible_person_name}</span>
                                </div>
                            )}

                            {/* Priority */}
                            {taskData.priority && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Priority</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.priority}</span>
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

                            {/* Project */}
                            {taskData.project_management_title && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Project</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.project_management_title}</span>
                                </div>
                            )}

                            {/* Milestone */}
                            {taskData.milestone_title && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Milestone</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.milestone_title}</span>
                                </div>
                            )}

                            {/* Estimated Hours */}
                            {taskData.estimated_hour && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Est. Hours</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.estimated_hour}h</span>
                                </div>
                            )}

                            {/* Completion Percentage */}
                            <div className="flex mb-3 pt-3 border-t border-gray-200">
                                <span className="text-sm text-gray-700 w-32 flex-shrink-0">Completion</span>
                                <span className="text-sm text-gray-500 mr-2">:</span>
                                <div className="flex-1 flex gap-2 items-center">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={completionPercentage}
                                        onChange={(e) => setCompletionPercentage(e.target.value)}
                                        placeholder="0"
                                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-500">%</span>
                                    <button
                                        onClick={handleCompletionChange}
                                        className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};;

export default TaskDetailsMobile;
