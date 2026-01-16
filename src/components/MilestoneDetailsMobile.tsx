import React, { useState, useEffect } from 'react'
import { ArrowLeft, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface MilestoneData {
    id: number;
    [key: string]: any;
}

const MilestoneDetailsMobile = () => {
    const navigate = useNavigate();
    const { mid } = useParams<{ mid: string }>();
    const [isPermitInfoExpanded, setIsPermitInfoExpanded] = useState(true);
    const [comments, setComments] = useState('');
    const [milestoneData, setMilestoneData] = useState<MilestoneData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (mid) {
            fetchMilestoneDetails(mid);
        }
    }, [mid]);

    const fetchMilestoneDetails = async (milestoneId: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Authentication token not found');
                return;
            }

            const response = await fetch(
                `https://lockated-api.gophygital.work/milestones/${milestoneId}.json?token=${token}`,
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
            setMilestoneData(data);
            setComments(data.comments || '');
        } catch (error) {
            console.error('Failed to load milestone details:', error);
            toast.error('Failed to load milestone details');
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

    if (!milestoneData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Milestone not found</p>
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
                        <span className="font-semibold text-gray-900">Milestone Details</span>
                        <ChevronDown
                            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isPermitInfoExpanded ? 'transform rotate-180' : ''
                                }`}
                        />
                    </button>

                    {/* Permit Info Content */}
                    {isPermitInfoExpanded && (
                        <div className="px-4 py-3">
                            {/* Milestone ID */}
                            <div className="flex mb-3">
                                <span className="text-sm text-gray-700 w-32 flex-shrink-0">Milestone ID</span>
                                <span className="text-sm text-gray-500 mr-2">:</span>
                                <span className="text-sm text-gray-900 flex-1">{milestoneData.id}</span>
                            </div>

                            {/* Title */}
                            {milestoneData.title && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Title</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{milestoneData.title}</span>
                                </div>
                            )}

                            {/* Description */}
                            {milestoneData.description && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Description</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{milestoneData.description}</span>
                                </div>
                            )}

                            {/* Status */}
                            {milestoneData.status && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Status</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{milestoneData.status}</span>
                                </div>
                            )}

                            {/* Mile Stone Owner */}
                            {milestoneData.mile_stone_owner && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Mile Stone Owner</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{milestoneData.mile_stone_owner}</span>
                                </div>
                            )}

                            {/* Priority */}
                            {milestoneData.priority && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Priority</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{milestoneData.priority}</span>
                                </div>
                            )}

                            {/* Start Date */}
                            {milestoneData.start_date && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">Start Date</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{milestoneData.start_date}</span>
                                </div>
                            )}

                            {/* End Date */}
                            {milestoneData.end_date && (
                                <div className="flex mb-3">
                                    <span className="text-sm text-gray-700 w-32 flex-shrink-0">End Date</span>
                                    <span className="text-sm text-gray-500 mr-2">:</span>
                                    <span className="text-sm text-gray-900 flex-1">{milestoneData.end_date}</span>
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

export default MilestoneDetailsMobile