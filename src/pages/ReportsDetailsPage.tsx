import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface ReportDetail {
    id?: number;
    reported_by?: string;
    reported_against?: string;
    created_at?: string;
    status?: string;
    active?: boolean;
    description?: string;
    report_type?: string;
    post?: Post;
    comment?: Comment;
}

interface Attachment {
    id: number;
    document_content_type: string;
    document_url?: string;
    url?: string;
}

interface Comment {
    id: number;
    body: string;
    commentable_id: number;
    commentable_type: string;
    commentor_id: number;
    active: boolean | null;
    created_at: string;
    updated_at: string;
    commentor_full_name: string;
    commentor_profile_image: string | null;
    commentor_site_name: string;
    attachments: Attachment[];
    reports_count?: number;
}

interface Post {
    id: number;
    title: string | null;
    body: string;
    active: boolean;
    blocked: boolean;
    resource_id: number;
    resource_type: string;
    created_at: string;
    updated_at: string;
    creator_full_name: string;
    creator_site_name: string;
    creator_image_url: string | null;
    resource_name: string;
    total_likes: number;
    likes_with_user_names?: any[];
    likes_with_emoji?: Record<string, number>;
    isliked?: boolean;
    attachments: Attachment[];
    comments?: Comment[];
}

const ReportsDetailsPage = () => {
    const { id, communityId } = useParams();
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [reportDetails, setReportDetails] = useState<ReportDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewStatus, setReviewStatus] = useState("Under Review");

    useEffect(() => {
        fetchReportDetails();
    }, [id, communityId]);

    const fetchReportDetails = async () => {
        try {
            setLoading(true);
            // Update API endpoint based on actual backend
            const response = await axios.get(
                `https://${baseUrl}/communities/${communityId}/report_detail.json?report_id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setReportDetails(response.data.report);
            setReviewStatus(response.data?.report?.status || "Under Review");
        } catch (error) {
            console.error("Error fetching report details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getDateFromTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const getTimeFromTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);

        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };


    if (loading) {
        return (
            <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            {/* Header with back button */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div>

            {/* Main Content Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                {/* Header with Title and Status */}
                <div className="bg-[#F6F4EE] px-6 py-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <FileText size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Report Detail
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-[#FFF4E6] text-[#F59E0B] px-3 py-1 rounded text-sm font-medium">
                            {reviewStatus}
                        </span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 bg-white">
                    {/* Details Grid - 2 columns */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report by</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.reported_by}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Date</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {getDateFromTimestamp(reportDetails?.created_at)}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Status</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Issue Description</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium text-sm">
                                    {reportDetails?.description}
                                </span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Against</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.reported_against || "Raj"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Time</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {getTimeFromTimestamp(reportDetails?.created_at)}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Review Status</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <select
                                    value={reviewStatus}
                                    onChange={(e) => setReviewStatus(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 text-sm font-medium text-gray-900 bg-white cursor-pointer"
                                >
                                    <option value="under_review">Under Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post and Comment Section - shown when post data exists */}
            {reportDetails?.post && (
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <div className="bg-[#F6F4EE] px-6 py-4 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                                <FileText size={22} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Reported Content
                            </h2>
                        </div>
                    </div>
                    <div className="p-6 bg-white">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={reportDetails.post.creator_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reportDetails.post.creator_full_name}`}
                                    alt={reportDetails.post.creator_full_name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{reportDetails.post.creator_full_name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>{reportDetails.post.resource_name}</span>
                                        <span>•</span>
                                        <span>{formatTimestamp(reportDetails.post.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {reportDetails.post.title && (
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">{reportDetails.post.title}</h2>
                        )}
                        <p className="text-gray-700 mb-4">{reportDetails.post.body}</p>
                        {reportDetails.post.attachments && reportDetails.post.attachments.length > 0 && (
                            <div className={`mb-4 gap-1 ${reportDetails.post.attachments.length === 1 ? 'grid grid-cols-1' :
                                reportDetails.post.attachments.length === 2 ? 'grid grid-cols-2' :
                                    reportDetails.post.attachments.length === 3 ? 'grid grid-cols-2' :
                                        'grid grid-cols-2'
                                }`}>
                                {reportDetails.post.attachments.map((attachment, index) => (
                                    <div
                                        key={attachment.id}
                                        className={`relative overflow-hidden rounded-lg ${reportDetails.post.attachments.length === 1 ? 'col-span-1' :
                                            reportDetails.post.attachments.length === 3 && index === 0 ? 'col-span-2' :
                                                reportDetails.post.attachments.length > 4 && index === 0 ? 'col-span-2 row-span-2' :
                                                    ''
                                            }`}
                                        style={{
                                            height: reportDetails.post.attachments.length === 1 ? '400px' :
                                                reportDetails.post.attachments.length === 2 ? '300px' :
                                                    reportDetails.post.attachments.length === 3 && index === 0 ? '300px' :
                                                        reportDetails.post.attachments.length === 3 ? '200px' :
                                                            reportDetails.post.attachments.length > 4 && index === 0 ? '400px' : '200px'
                                        }}
                                    >
                                        {(attachment.document_content_type?.startsWith('image/') || attachment.url?.includes('image')) ? (
                                            <img
                                                src={attachment.document_url || attachment.url}
                                                alt="Post attachment"
                                                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            />
                                        ) : (attachment.document_content_type?.startsWith('video/') || attachment.url?.includes('video')) ? (
                                            <video
                                                src={attachment.document_url || attachment.url}
                                                controls
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                        {reportDetails.post.attachments.length > 4 && index === 3 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                                <span className="text-white text-3xl font-semibold">
                                                    +{reportDetails.post.attachments.length - 4}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )).slice(0, 4)}
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                                👍
                                <span className="text-sm font-medium">{reportDetails.post.likes_with_emoji?.thumb || 0}</span>
                            </button>
                            <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                                ❤️
                                <span className="text-sm font-medium">{reportDetails.post.likes_with_emoji?.heart || 0}</span>
                            </button>
                            <button className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                                🔥
                                <span className="text-sm font-medium">{reportDetails.post.likes_with_emoji?.fire || 0}</span>
                            </button>
                        </div>
                        {reportDetails.comment && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Reported Comment</h4>
                                <div className="bg-red-50 border border-red-200 rounded-[8px] p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={reportDetails.comment.commentor_profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reportDetails.comment.commentor_full_name}`}
                                                alt={reportDetails.comment.commentor_full_name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900">{reportDetails.comment.commentor_full_name}</h4>
                                                </div>
                                                <p className="text-sm text-gray-500">{formatTimestamp(reportDetails.comment.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-3">{reportDetails.comment.body}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                                                <Heart size={16} />
                                                <span className="text-sm font-medium">0</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsDetailsPage;
