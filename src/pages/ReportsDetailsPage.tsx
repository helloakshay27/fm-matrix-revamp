import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, File, FileText, Heart, MoreVertical, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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

interface PollOption {
    id: number;
    name: string;
    total_votes: number;
    voted: boolean;
    vote_percentage: number;
    votes: any[];
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
    poll_options?: PollOption[];
}

const ReportsDetailsPage = () => {
    const { id, communityId } = useParams();
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [reportDetails, setReportDetails] = useState<ReportDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewStatus, setReviewStatus] = useState("Under Review");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const [postContent, setPostContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [createPostOpen, setCreatePostOpen] = useState(false);
    const [createPollOpen, setCreatePollOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; type: 'post' | 'comment' | null; id: number | null }>({ open: false, type: null, id: null });

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
            setExistingAttachments(response.data?.report?.post?.attachments || []);
        } catch (error) {
            console.error("Error fetching report details:", error);
        } finally {
            setLoading(false);
        }
    };

    console.log(existingAttachments)

    const updateReportStatus = async (newStatus: string) => {
        try {
            setUpdatingStatus(true);
            const response = await axios.get(
                `https://${baseUrl}/communities/${communityId}/update_report_status.json`,
                {
                    params: {
                        report_id: id,
                        status: newStatus,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success || response.status === 200) {
                setReviewStatus(newStatus);
                // Optionally refresh the report details
                await fetchReportDetails();
            }
        } catch (error) {
            console.error("Error updating report status:", error);
            // Revert the status on error
            setReviewStatus(reportDetails?.status || "Under Review");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setReviewStatus(newStatus);
        updateReportStatus(newStatus);
    };

    const formatStatusDisplay = (status: string): string => {
        const statusMap: Record<string, string> = {
            under_review: "Under Review",
            action_in_progress: "In Progress",
            resolved: "Resolved",
            closed: "Closed",
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: string): { bg: string; text: string; dot: string } => {
        const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
            under_review: { bg: "bg-[rgba(217,202,32,0.24)]", text: "text-[#000]", dot: "bg-yellow-500" },
            action_in_progress: { bg: "bg-[rgba(59,130,246,0.24)]", text: "text-blue-700", dot: "bg-blue-500" },
            resolved: { bg: "bg-[rgba(34,197,94,0.24)]", text: "text-green-700", dot: "bg-green-500" },
            closed: { bg: "bg-[rgba(107,114,128,0.24)]", text: "text-gray-700", dot: "bg-gray-500" },
        };
        return colorMap[status] || { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" };
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const filesArray = Array.from(files).filter(
                file => file.type.startsWith('image/') || file.type.startsWith('video/')
            );
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
    };

    const handleRemovePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            setPollOptions(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        setPollOptions(prev => {
            const newOptions = [...prev];
            newOptions[index] = value;
            return newOptions;
        });
    };

    const handleEditPost = (post: Post) => {
        setIsEditMode(true);
        setEditingPost(post);
        setPostContent(post.body);
        setExistingAttachments(post.attachments || []);
        setSelectedFiles([]);

        // Check if post has poll options
        if (post.poll_options && post.poll_options.length > 0) {
            // Open poll modal for poll posts
            setPollOptions(post.poll_options.map(opt => opt.name));
            setCreatePollOpen(true);
        } else {
            // Open regular post modal for normal posts
            setCreatePostOpen(true);
        }
    };

    const handleAddPollOption = () => {
        setPollOptions(prev => [...prev, '']);
    };

    const handleCreatePost = async () => {
        if (!postContent.trim()) {
            toast.error('Please enter post content');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('body', postContent);

            if (!isEditMode) {
                formData.append('resource_id', communityId || '');
                formData.append('resource_type', 'Community');
            }

            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file) => {
                    formData.append('attachments[]', file);
                });
            }

            const url = isEditMode
                ? `https://${baseUrl}/posts/${editingPost?.id}.json`
                : `https://${baseUrl}/posts.json`;

            const method = isEditMode ? 'patch' : 'post';

            const response = await axios[method](
                url,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success(isEditMode ? 'Post updated successfully' : 'Post created successfully');

                // Check if post has poll options
                const postData = response.data.post || response.data;
                if (postData && postData.poll_options && postData.poll_options.length > 0) {
                    // Post is of poll type, open poll modal for editing
                    setEditingPost(postData);
                    setCreatePostOpen(false);
                    setCreatePollOpen(true);
                } else {
                    setCreatePostOpen(false);
                    setPostContent("");
                    setSelectedFiles([]);
                    setIsEditMode(false);
                    setEditingPost(null);
                    setExistingAttachments([]);
                }

                await fetchReportDetails(); // Refresh the posts list
            }
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} post. Please try again.`);
        }
    };

    const handleCreatePoll = async () => {
        if (!postContent.trim()) {
            toast.error('Please enter poll content');
            return;
        }

        // Validate poll options - at least 2 non-empty options
        const validOptions = pollOptions.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
            toast.error('Please provide at least 2 poll options');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('body', postContent);
            formData.append('resource_id', communityId || '');
            formData.append('resource_type', 'Community');

            // Add poll options
            validOptions.forEach((option, index) => {
                formData.append(`poll_options_attributes[${index}][name]`, option);
            });

            // Add attachments if any
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file) => {
                    formData.append('attachments[]', file);
                });
            }

            const response = await axios.post(
                `https://${baseUrl}/posts.json`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success('Poll created successfully');
                setCreatePollOpen(false);
                setPostContent("");
                setSelectedFiles([]);
                setPollOptions(['', '']);
                await fetchReportDetails(); // Refresh the posts list
            }
        } catch (error) {
            console.error('Error creating poll:', error);
            toast.error('Failed to create poll. Please try again.');
        }
    };


    const handleDeletePost = async (postId: number) => {
        setDeleteConfirmation({ open: true, type: 'post', id: postId });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation.id) return;

        try {
            if (deleteConfirmation.type === 'post') {
                const response = await axios.delete(
                    `https://${baseUrl}/posts/${deleteConfirmation.id}.json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200 || response.status === 204) {
                    toast.success('Post deleted successfully');
                    await fetchReportDetails();
                }
            } else if (deleteConfirmation.type === 'comment') {
                await axios.delete(
                    `https://${baseUrl}/comments/${deleteConfirmation.id}.json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                toast.success('Comment deleted successfully');
                await fetchReportDetails();
            }
            navigate(`/pulse/community/${communityId}`)
        } catch (error) {
            console.error(`Error deleting ${deleteConfirmation.type}:`, error);
            toast.error(`Failed to delete ${deleteConfirmation.type}. Please try again.`);
        } finally {
            setDeleteConfirmation({ open: false, type: null, id: null });
        }
    }

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

    const deleteComment = (commentId: number) => {
        setDeleteConfirmation({ open: true, type: 'comment', id: commentId });
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
            {/* <div className="flex items-center justify-between gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div> */}
            <h1 className="font-medium text-[15px] text-[rgba(26,26,26,0.5)] mb-4"><Link to={'/pulse/community'}>Community</Link> <span className="font-normal">{">"}</span> Report Details</h1>

            {/* Main Content Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                {/* Header with Title and Status */}
                <div className="bg-[#F6F4EE] px-6 py-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <File size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Report Detail
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`${getStatusColor(reviewStatus).bg} ${getStatusColor(reviewStatus).text} px-3 py-1 rounded text-sm flex items-center gap-2`}>
                            <svg width="13" height="14" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.1875 6.75V3.9375C6.1875 3.78832 6.24676 3.64524 6.35225 3.53975C6.45774 3.43426 6.60082 3.375 6.75 3.375C6.89918 3.375 7.04226 3.43426 7.14775 3.53975C7.25324 3.64524 7.3125 3.78832 7.3125 3.9375V6.75C7.3125 6.89918 7.25324 7.04226 7.14775 7.14775C7.04226 7.25324 6.89918 7.3125 6.75 7.3125C6.60082 7.3125 6.45774 7.25324 6.35225 7.14775C6.24676 7.04226 6.1875 6.89918 6.1875 6.75ZM6.75 10.125C6.91688 10.125 7.08001 10.0755 7.21876 9.9828C7.35752 9.89009 7.46566 9.75831 7.52952 9.60414C7.59338 9.44996 7.61009 9.28031 7.57754 9.11664C7.54498 8.95297 7.46462 8.80263 7.34662 8.68463C7.22862 8.56663 7.07828 8.48627 6.91461 8.45371C6.75094 8.42116 6.58129 8.43787 6.42711 8.50173C6.27294 8.56559 6.14116 8.67373 6.04845 8.81249C5.95573 8.95124 5.90625 9.11437 5.90625 9.28125C5.90625 9.50503 5.99514 9.71964 6.15338 9.87787C6.31161 10.0361 6.52622 10.125 6.75 10.125ZM13.5 1.125V5.0625C13.5 8.76937 11.7056 11.0159 10.2002 12.2477C8.57883 13.5738 6.96586 14.0245 6.89555 14.0428C6.79887 14.0691 6.69692 14.0691 6.60023 14.0428C6.52992 14.0245 4.91906 13.5738 3.29555 12.2477C1.79438 11.0159 0 8.76937 0 5.0625V1.125C0 0.826631 0.118526 0.540483 0.329505 0.329505C0.540483 0.118526 0.826631 0 1.125 0H12.375C12.6734 0 12.9595 0.118526 13.1705 0.329505C13.3815 0.540483 13.5 0.826631 13.5 1.125ZM12.375 1.125H1.125V5.0625C1.125 7.68516 2.09672 9.8093 4.01273 11.3773C4.82853 12.0445 5.75498 12.5635 6.75 12.9108C7.75821 12.5573 8.69624 12.0289 9.52102 11.3498C11.4145 9.78469 12.375 7.66898 12.375 5.0625V1.125Z" fill="#1A1A1A" />
                            </svg>
                            {formatStatusDisplay(reviewStatus)}
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
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.reported_by}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Date</span>
                                <span className="text-gray-900 font-medium">
                                    {getDateFromTimestamp(reportDetails?.created_at)}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Status</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Issue Description</span>
                                <span className="text-gray-900 font-medium text-sm">
                                    {reportDetails?.description}
                                </span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Against</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.reported_against || "Raj"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Time</span>
                                <span className="text-gray-900 font-medium">
                                    {getTimeFromTimestamp(reportDetails?.created_at)}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Review Status</span>
                                <select
                                    value={reviewStatus}
                                    onChange={handleStatusChange}
                                    disabled={updatingStatus}
                                    className="border border-gray-300 rounded pr-2 py-1 text-sm text-gray-900 bg-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option value="under_review">Under Review</option>
                                    <option value="action_in_progress">Action In Progress</option>
                                    <option value="resolved">Resolve</option>
                                    <option value="closed">Closed</option>
                                </select>
                                {updatingStatus && (
                                    <span className="ml-2 text-xs text-gray-500">Updating...</span>
                                )}
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
                                <File size={22} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Reported Content
                            </h2>
                        </div>
                        <span className={`${getStatusColor(reviewStatus).bg} ${getStatusColor(reviewStatus).text} px-3 py-1 rounded text-sm flex items-center gap-2`}>
                            <svg width="13" height="14" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.1875 6.75V3.9375C6.1875 3.78832 6.24676 3.64524 6.35225 3.53975C6.45774 3.43426 6.60082 3.375 6.75 3.375C6.89918 3.375 7.04226 3.43426 7.14775 3.53975C7.25324 3.64524 7.3125 3.78832 7.3125 3.9375V6.75C7.3125 6.89918 7.25324 7.04226 7.14775 7.14775C7.04226 7.25324 6.89918 7.3125 6.75 7.3125C6.60082 7.3125 6.45774 7.25324 6.35225 7.14775C6.24676 7.04226 6.1875 6.89918 6.1875 6.75ZM6.75 10.125C6.91688 10.125 7.08001 10.0755 7.21876 9.9828C7.35752 9.89009 7.46566 9.75831 7.52952 9.60414C7.59338 9.44996 7.61009 9.28031 7.57754 9.11664C7.54498 8.95297 7.46462 8.80263 7.34662 8.68463C7.22862 8.56663 7.07828 8.48627 6.91461 8.45371C6.75094 8.42116 6.58129 8.43787 6.42711 8.50173C6.27294 8.56559 6.14116 8.67373 6.04845 8.81249C5.95573 8.95124 5.90625 9.11437 5.90625 9.28125C5.90625 9.50503 5.99514 9.71964 6.15338 9.87787C6.31161 10.0361 6.52622 10.125 6.75 10.125ZM13.5 1.125V5.0625C13.5 8.76937 11.7056 11.0159 10.2002 12.2477C8.57883 13.5738 6.96586 14.0245 6.89555 14.0428C6.79887 14.0691 6.69692 14.0691 6.60023 14.0428C6.52992 14.0245 4.91906 13.5738 3.29555 12.2477C1.79438 11.0159 0 8.76937 0 5.0625V1.125C0 0.826631 0.118526 0.540483 0.329505 0.329505C0.540483 0.118526 0.826631 0 1.125 0H12.375C12.6734 0 12.9595 0.118526 13.1705 0.329505C13.3815 0.540483 13.5 0.826631 13.5 1.125ZM12.375 1.125H1.125V5.0625C1.125 7.68516 2.09672 9.8093 4.01273 11.3773C4.82853 12.0445 5.75498 12.5635 6.75 12.9108C7.75821 12.5573 8.69624 12.0289 9.52102 11.3498C11.4145 9.78469 12.375 7.66898 12.375 5.0625V1.125Z" fill="#1A1A1A" />
                            </svg>
                            {formatStatusDisplay(reviewStatus)}
                        </span>
                    </div>
                    <div className="p-6 bg-white">
                        <div className="flex items-start justify-between mb-4 w-[70%]">
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical size={14} className="text-gray-500 cursor-pointer" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => handleEditPost(reportDetails.post!)}>
                                        Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDeletePost(reportDetails.post!.id)}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        Delete Post
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {reportDetails.post.title && (
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">{reportDetails.post.title}</h2>
                        )}
                        <p className="text-gray-700 mb-4 w-[70%]">{reportDetails.post.body}</p>
                        {reportDetails.post.attachments && reportDetails.post.attachments.length > 0 && (
                            <div className={`mb-4 gap-1 w-[70%] ${reportDetails.post.attachments.length === 1 ? 'grid grid-cols-1' :
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
                        <div className="flex items-center gap-4 w-[70%]">
                            {(() => {
                                const EMOJI_MAP: Record<string, { icon: string; hoverClass: string }> = {
                                    thumbs_up: { icon: "👍", hoverClass: "hover:text-blue-600" },
                                    laugh: { icon: "😂", hoverClass: "hover:text-green-600" },
                                    heart: { icon: "❤️", hoverClass: "hover:text-red-600" },
                                    angry: { icon: "😠", hoverClass: "hover:text-red-800" },
                                    clap: { icon: "👏", hoverClass: "hover:text-yellow-600" },
                                };

                                return Object.entries(reportDetails.post.likes_with_emoji || {}).map(
                                    ([emojiKey, count]) => {
                                        const emoji = EMOJI_MAP[emojiKey];
                                        if (!emoji || count === 0) return null;

                                        return (
                                            <button
                                                key={emojiKey}
                                                className={`flex items-center gap-1 text-gray-600 transition-colors ${emoji.hoverClass}`}
                                            >
                                                <span>{emoji.icon}</span>
                                                <span className="text-sm font-medium">{count}</span>
                                            </button>
                                        );
                                    }
                                );
                            })()}
                        </div>
                        {reportDetails.comment && (
                            <div className="mt-6 w-[70%]">
                                <h4 className="font-semibold text-gray-900 mb-4">Reported Comment</h4>
                                <div className="border border-[#c72030] rounded-[8px] p-4">
                                    <div className="flex items-start gap-6 mb-3">
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

                                        <span
                                            className="bg-[rgba(199,32,48,0.5)] text-white w-[139px] px-3 py-2 rounded text-xs font-medium inline-flex items-center gap-2 cursor-pointer"
                                        >
                                            <FileText size={16} /> 1 Report
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-3">{reportDetails.comment.body}</p>
                                    <div className="flex items-center justify-between border-t pt-3">
                                        <div className="flex items-center gap-4">
                                            {/* <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                                                <Heart size={16} />
                                                <span className="text-sm font-medium">0</span>
                                            </button> */}
                                        </div>
                                        <Button variant="ghost" size="sm" className="border border-[#c72030] rounded-[5px] text-[#c72030]" onClick={() => deleteComment(reportDetails.comment.id)}>
                                            <Trash2 size={18} color="#c72030" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Dialog open={createPostOpen} onOpenChange={(open) => {
                setCreatePostOpen(open);
                if (!open) {
                    // Reset all state when closing
                    setPostContent("");
                    setSelectedFiles([]);
                    setIsEditMode(false);
                    setEditingPost(null);
                    setExistingAttachments([]);
                }
            }}>
                <DialogContent className="max-w-2xl bg-[#F9F8F6] rounded-[16px] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            {isEditMode ? 'Edit Post' : 'Create Post'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 overflow-y-auto flex-1 pr-2">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Add Media
                            </label>
                            {(selectedFiles.length > 0 || existingAttachments.length > 0) ? (
                                <div className="bg-white border border-[#E5E5E5] p-4 rounded-[8px]">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Display existing attachments */}
                                        {existingAttachments.map((attachment) => (
                                            <div key={attachment.id} className="relative">
                                                {attachment.document_content_type.startsWith('image/') ? (
                                                    <img
                                                        src={attachment.document_url}
                                                        alt="Existing attachment"
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : attachment.document_content_type.startsWith('video/') ? (
                                                    <video
                                                        src={attachment.document_url}
                                                        controls
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : null}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setExistingAttachments(prev => prev.filter(a => a.id !== attachment.id));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {/* Display new files */}
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="relative">
                                                {file.type.startsWith('image/') ? (
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : file.type.startsWith('video/') ? (
                                                    <video
                                                        src={URL.createObjectURL(file)}
                                                        controls
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : null}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Add more files button */}
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            id="file-upload-more"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept="image/*,video/*"
                                            multiple
                                        />
                                        <label
                                            htmlFor="file-upload-more"
                                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add More Files
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`bg-white border p-12 text-center transition-colors rounded-[8px] ${isDragging
                                        ? 'border-[#c72030] border-2 bg-red-50'
                                        : 'border-[#E5E5E5]'
                                        }`}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*,video/*"
                                        multiple
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer text-[#9CA3AF]"
                                    >
                                        <p className="text-sm leading-relaxed">
                                            Choose files or<br />drag & drop them here
                                        </p>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Post Content
                            </label>
                            <Textarea
                                placeholder="Write your announcement or message..."
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="min-h-[120px] bg-white border-[#E5E5E5] placeholder:text-[#9CA3AF] rounded-[8px]"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCreatePostOpen(false);
                                    setPostContent("");
                                    setSelectedFiles([]);
                                    setIsEditMode(false);
                                    setEditingPost(null);
                                    setExistingAttachments([]);
                                }}
                                className="border-[#E5E5E5] text-gray-700 hover:bg-gray-50 rounded-[8px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="!bg-[#c72030] !hover:bg-[#b01d2a] !text-white rounded-[8px]"
                                onClick={handleCreatePost}
                            >
                                {isEditMode ? 'Update Post' : 'Publish Post'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Poll Modal */}
            <Dialog open={createPollOpen} onOpenChange={(open) => {
                setCreatePollOpen(open);
                if (!open) {
                    // Reset poll state when closing
                    setPostContent("");
                    setSelectedFiles([]);
                    setPollOptions(['', '']);
                }
            }}>
                <DialogContent className="max-w-2xl bg-[#F9F8F6] rounded-[16px] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">Create Admin Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 overflow-y-auto flex-1 pr-2">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Add Media
                            </label>
                            {selectedFiles.length > 0 ? (
                                <div className="bg-white border border-[#E5E5E5] p-4 rounded-[8px]">
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="relative">
                                                {file.type.startsWith("image/") ? (
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : file.type.startsWith("video/") ? (
                                                    <video
                                                        src={URL.createObjectURL(file)}
                                                        controls
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : null}

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedFiles((prev) =>
                                                            prev.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Add more files button */}
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            id="poll-file-upload-more"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept="image/*,video/*"
                                            multiple
                                        />
                                        <label
                                            htmlFor="poll-file-upload-more"
                                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add More Files
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`bg-white border p-12 text-center transition-colors rounded-[8px] ${isDragging
                                        ? 'border-[#c72030] border-2 bg-red-50'
                                        : 'border-[#E5E5E5]'
                                        }`}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        id="poll-file-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*,video/*"
                                        multiple
                                    />
                                    <label
                                        htmlFor="poll-file-upload"
                                        className="cursor-pointer text-[#9CA3AF]"
                                    >
                                        <p className="text-sm leading-relaxed">
                                            Choose files or<br />drag & drop them here
                                        </p>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Post Content
                            </label>
                            <Textarea
                                placeholder="Write your announcement or message..."
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="min-h-[120px] bg-white border-[#E5E5E5] placeholder:text-[#9CA3AF] rounded-[8px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Poll Options
                            </label>
                            <div className="space-y-3">
                                {pollOptions.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            placeholder={`Option ${index + 1}`}
                                            value={option}
                                            onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                            className="bg-white border-[#E5E5E5] placeholder:text-[#9CA3AF] rounded-[8px] flex-1"
                                        />
                                        {pollOptions.length > 2 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemovePollOption(index)}
                                                className="!text-red-600 hover:!bg-red-50 h-10 px-3"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    onClick={handleAddPollOption}
                                    className="w-auto border-[#E5E5E5] text-gray-700 hover:bg-gray-50 rounded-[8px] flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Option
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCreatePollOpen(false);
                                    setPostContent("");
                                    setSelectedFiles([]);
                                    setPollOptions(['', '']);
                                }}
                                className="border-[#E5E5E5] text-gray-700 hover:bg-gray-50 rounded-[8px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#c72030] hover:bg-[#b01d2a] text-white rounded-[8px]"
                                onClick={handleCreatePoll}
                            >
                                Publish Poll
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmation.open} onOpenChange={(open) => {
                if (!open) setDeleteConfirmation({ open: false, type: null, id: null });
            }}>
                <DialogContent className="max-w-sm bg-white rounded-lg p-0 flex flex-col border-0 shadow-lg">
                    <div className="bg-white pt-12 text-center flex flex-col">
                        <h2 className="text-base font-semibold text-gray-900 mb-12 leading-tight">
                            Are you sure you want to Delete<br />this {deleteConfirmation.type === 'post' ? 'Community Post' : 'Comment'} ?
                        </h2>
                        <div className="flex mt-auto">
                            <button
                                onClick={() => setDeleteConfirmation({ open: false, type: null, id: null })}
                                className="flex-1 px-3 py-4 bg-[#E7E3D9] text-[#6C6C6C] font-semibold text-[14px] transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-3 py-4 bg-[#C72030] !text-white font-semibold text-[14px] hover:bg-[#A01020] transition-colors"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReportsDetailsPage;
