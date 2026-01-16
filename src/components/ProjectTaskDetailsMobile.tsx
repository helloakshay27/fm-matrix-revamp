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
    const { id } = useParams<{ id: string }>();
    const [isPermitInfoExpanded, setIsPermitInfoExpanded] = useState(true);
    const [comments, setComments] = useState('');
    const [taskData, setTaskData] = useState<TaskData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchTaskDetails(id);
        }
    }, [id]);

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
                </div>


            </div>

            {/* Content */}
            <div className="p-4">
                {/* Permit Info Card */}
                <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
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

                            {/* Task Owner */}
                            {taskData.responsible_person && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Responsible Person</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.responsible_person.name}</span>
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


                            {/* End Date */}
                            {taskData.target_date && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">End Date</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{taskData.target_date}</span>
                                </div>
                            )}
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