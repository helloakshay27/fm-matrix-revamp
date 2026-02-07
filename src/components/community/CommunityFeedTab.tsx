import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
    Heart,
    Pin,
    EyeOff,
    Trash2,
    Plus,
    X,
    MessageSquare,
    MoreVertical,
    FileText,
    Calendar1,
    MapPin,
    Folder,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { ImageCarouselModal } from "./ImageCarouselModal";
import { ReactionsModal } from "./ReactionsModal";
import { format } from "date-fns";

interface CommunityFeedTabProps {
    communityId?: string;
    communityName?: string;
    communityImg?: string;
}

interface Attachment {
    id: number;
    document_content_type: string;
    url: string;
}

interface CommentAttachment {
    // Define structure if needed
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
    attachments: CommentAttachment[];
    reports_count?: number;
}

interface Like {
    id: number;
    user_id: number;
    thing_id: number;
    created_at: string;
    updated_at: string;
    thing_type: string;
    thing: null;
    emoji_name: string | null;
    user_name: string;
    site_name: string;
    profile_image: string | null;
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
    likes_with_user_names: Like[];
    likes_with_emoji: Record<string, number>;
    isliked: boolean;
    attachments: Attachment[];
    comments: Comment[];
    poll_options?: PollOption[];
    type: 'post' | 'event' | 'notice' | 'document';
    event_date?: string;
    event_time?: string;
    event_location?: string;
    location?: string;
    expire_time?: string;
    file_size?: string;
    file_format?: string;
    document_id?: number;
    attachment?: {
        file_size: string;
        file_type: string;
        url: string;
    };
}

const CommunityFeedTab = ({ communityId, communityName, communityImg }: CommunityFeedTabProps) => {
    console.log(communityImg)
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [createPostOpen, setCreatePostOpen] = useState(false);
    const [createPollOpen, setCreatePollOpen] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [showCommentsForPost, setShowCommentsForPost] = useState<number | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    interface PollOptionInput {
        id?: number;
        name: string;
    }

    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
    const [pollOptions, setPollOptions] = useState<PollOptionInput[]>([{ name: '' }, { name: '' }]);
    const [isToggling, setIsToggling] = useState<number | null>(null)
    const [isActive, setIsActive] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; type: 'post' | 'comment' | 'document' | 'notice' | 'event' | null; id: number | null }>({ open: false, type: null, id: null });
    const [carouselOpen, setCarouselOpen] = useState(false);
    const [carouselAttachments, setCarouselAttachments] = useState<Attachment[]>([]);
    const [carouselStartIndex, setCarouselStartIndex] = useState(0);
    const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>([]);
    const [reactionsModalOpen, setReactionsModalOpen] = useState(false);
    const [reactionsModalData, setReactionsModalData] = useState<Like[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    // Skeleton Loader Component
    const PostSkeleton = () => (
        <div className="bg-white rounded-[10px] border border-gray-200 p-6 mb-4 w-[80%] animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>

            {/* Title Skeleton */}
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>

            {/* Content Skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>

            {/* Image Skeleton */}
            <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>

            {/* Reactions Skeleton */}
            <div className="flex gap-4 border-t border-b border-gray-200 py-3">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
        </div>
    );

    const transformedEvent = (event: any) => {
        return {
            id: event.id,
            title: event.event_name,
            body: event.description,
            active: event.active,
            created_at: event.created_at,
            creator_full_name: event.created_by,
            creator_image_url: null,
            resource_name: communityName,
            attachments: event.documents.map((doc: any) => ({
                id: doc.id,
                document_content_type: doc.doctype,
                url: doc.document,
            })),
            type: 'event',
            event_date: event.from_time,
            location: event.event_at,
        }
    }

    const transformedNotice = (notice: any) => {
        return {
            id: notice.id,
            title: notice.notice_heading,
            body: notice.notice_text || '',
            active: notice.active,
            created_at: notice.created_at,
            creator_full_name: notice.created_by,
            creator_image_url: null,
            resource_name: communityName,
            attachments: notice.attachments.map((doc: any) => ({
                id: doc.id,
                document_content_type: doc.document_content_type,
                url: doc.url,
            })),
            type: 'notice',
        }
    }

    const transformedDocument = (document: any) => {
        const formatFileSize = (bytes: number): string => {
            if (!bytes || bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
        };

        return {
            id: document.id,
            title: document.title,
            body: document.folder_name || document.category || '',
            active: document.active !== false,
            created_at: document.created_at,
            creator_full_name: document.created_by_full_name || 'Admin',
            creator_image_url: null,
            resource_name: communityName,
            attachment: {
                file_size: formatFileSize(parseInt(document.attachment?.file_size) || 0),
                file_type: document.attachment?.file_type,
                url: document.attachment?.file_url,
            },
            type: 'document',
            file_size: formatFileSize(parseInt(document.attachment?.file_size) || 0),
            file_format: document.attachment?.file_type || document.format || 'PDF',
            document_id: document.id,
        }
    }


    const fetchData = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setIsActive(response.data.active)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPosts = async () => {
        setIsLoadingPosts(true);
        try {
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/posts.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            // Transform posts based on shared_from_type
            const posts = response.data.posts.map((post: any) => {
                let transformedPost: any = {
                    ...post,
                    type: 'post' // default type
                };

                // Check if this is a shared event or notice
                if (post.shared_from_type === 'Event' && post.event) {
                    transformedPost = {
                        ...post,
                        ...transformedEvent(post.event),
                        type: 'event'
                    };
                } else if (post.shared_from_type === 'Noticeboard' && post.notice) {
                    transformedPost = {
                        ...post,
                        ...transformedNotice(post.notice),
                        type: 'notice'
                    };
                }

                return transformedPost;
            });

            // Fetch documents
            let documents = [];
            try {
                const docResponse = await axios.get(`https://${baseUrl}/folders/by_communities.json?community_ids=[${communityId}]`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const allDocuments = docResponse.data.folders.flatMap((folder: any) => folder.documents) || [];
                documents = allDocuments.map(transformedDocument);
            } catch (docError) {
                console.log('Error fetching documents:', docError);
            }

            const combined = [...posts, ...documents].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setPosts(combined);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingPosts(false);
        }
    }

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
                    await fetchPosts();
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
                await fetchPosts();
            } else if (deleteConfirmation.type === 'document') {
                await axios.post(
                    `https://${baseUrl}/folders/update_permission.json`,
                    {
                        permissible_type: "Document",
                        permissible_id: deleteConfirmation.id,
                        access_to: "Community",
                        remove_items: [Number(communityId)]
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                toast.success('Document deleted successfully');
                await fetchPosts();
            } else if (deleteConfirmation.type === 'notice') {
                // Fetch notice data to get community_ids
                const noticeResponse = await axios.get(
                    `https://${baseUrl}/pms/admin/noticeboards/${deleteConfirmation.id}.json`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const noticeData = noticeResponse.data;
                const currentCommunityIds = noticeData.community_ids || [];

                // Filter out current communityId from the array
                const filteredCommunityIds = currentCommunityIds.filter(
                    (cId: string | number) => String(cId) !== String(communityId)
                );

                // Update notice with filtered community_ids
                await axios.put(
                    `https://${baseUrl}/pms/admin/noticeboards/${deleteConfirmation.id}.json`,
                    { noticeboard: { community_ids: filteredCommunityIds } },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                toast.success('Notice deleted successfully');
                await fetchPosts();
            } else if (deleteConfirmation.type === 'event') {
                // Update the community to remove this event
                await axios.put(
                    `https://${baseUrl}/communities/${communityId}.json`,
                    { community: { event_ids: [deleteConfirmation.id] } },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                toast.success('Event deleted successfully');
                await fetchPosts();
            }
        } catch (error) {
            console.error(`Error deleting ${deleteConfirmation.type}:`, error);
            toast.error(`Failed to delete ${deleteConfirmation.type}. Please try again.`);
        } finally {
            setDeleteConfirmation({ open: false, type: null, id: null });
        }
    }

    useEffect(() => {
        fetchData()
        fetchPosts()
    }, [])

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

    const handleEditPost = (post: Post) => {
        setIsEditMode(true);
        setEditingPost(post);
        setPostContent(post.body);
        setExistingAttachments(post.attachments || []);
        setSelectedFiles([]);

        // Check if post has poll options
        if (post.poll_options && post.poll_options.length > 0) {
            // Open poll modal for poll posts
            setPollOptions(post.poll_options.map(opt => ({ id: opt.id, name: opt.name })));
            setCreatePollOpen(true);
        } else {
            // Open regular post modal for normal posts
            setCreatePostOpen(true);
        }
    };

    const handleDeletePost = (postId: number, postType?: string) => {
        let deleteType: 'post' | 'comment' | 'document' | 'notice' | 'event' | null = 'post';

        if (postType === 'document') {
            deleteType = 'document';
        } else if (postType === 'notice') {
            deleteType = 'notice';
        } else if (postType === 'event') {
            deleteType = 'event';
        }

        setDeleteConfirmation({ open: true, type: deleteType, id: postId });
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

            // Add removed attachment IDs when editing
            if (isEditMode && removedAttachmentIds.length > 0) {
                removedAttachmentIds.forEach((id) => {
                    formData.append('attachment_ids[]', id.toString());
                });
            }

            const url = isEditMode
                ? `https://${baseUrl}/posts/${editingPost?.id}.json`
                : `https://${baseUrl}/posts.json`;

            const method = isEditMode ? 'put' : 'post';

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
                    setRemovedAttachmentIds([]);
                }

                await fetchPosts(); // Refresh the posts list
            }
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} post. Please try again.`);
        }
    };

    const handleStatusChange = async (id: number, currentActive: boolean) => {
        const newActive = !currentActive;
        setIsToggling(id);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('community[active]', newActive ? 'true' : 'false');

            await axios.put(
                `https://${baseUrl}/communities/${id}.json`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            setIsActive(newActive);
            toast.success(`Community ${newActive ? 'activated' : 'deactivated'} successfully`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update community status");
        } finally {
            setIsToggling(null);
        }
    };

    const deleteComment = (commentId: number) => {
        setDeleteConfirmation({ open: true, type: 'comment', id: commentId });
    };

    // Poll option handlers
    const handleAddPollOption = () => {
        setPollOptions(prev => [...prev, { name: '' }]);
    };

    const handleRemovePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            setPollOptions(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        setPollOptions(prev => {
            const newOptions = [...prev];
            newOptions[index] = { ...newOptions[index], name: value };
            return newOptions;
        });
    };

    const handleCreatePoll = async () => {
        if (!postContent.trim()) {
            toast.error('Please enter poll content');
            return;
        }

        // Validate poll options - at least 2 non-empty options
        const validOptions = pollOptions.filter(opt => opt.name.trim() !== '');
        if (validOptions.length < 2) {
            toast.error('Please provide at least 2 poll options');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('body', postContent);
            formData.append('resource_id', communityId || '');
            formData.append('resource_type', 'Community');

            // Calculate removed options if in edit mode
            let removedOptions: PollOption[] = [];
            if (isEditMode && editingPost?.poll_options) {
                const currentIds = pollOptions.map(o => o.id).filter(Boolean);
                removedOptions = editingPost.poll_options.filter(o => !currentIds.includes(o.id));
            }

            let formIndex = 0;

            // Add current options (New + Updates)
            validOptions.forEach((option) => {
                formData.append(`poll_options_attributes[${formIndex}][name]`, option.name);
                if (option.id) {
                    formData.append(`poll_options_attributes[${formIndex}][id]`, option.id.toString());
                }
                formIndex++;
            });

            // Add removed options (Deletes)
            if (isEditMode && removedOptions.length > 0) {
                removedOptions.forEach((option) => {
                    formData.append(`poll_options_attributes[${formIndex}][id]`, option.id.toString());
                    formData.append(`poll_options_attributes[${formIndex}][_destroy]`, 'true');
                    formIndex++;
                });
            }

            // Add attachments if any
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file) => {
                    formData.append('attachments[]', file);
                });
            }

            // Add removed attachment IDs when editing
            if (isEditMode && removedAttachmentIds.length > 0) {
                removedAttachmentIds.forEach((id) => {
                    formData.append('attachment_ids[]', id.toString());
                });
            }

            const url = isEditMode
                ? `https://${baseUrl}/posts/${editingPost?.id}.json`
                : `https://${baseUrl}/posts.json`;

            const method = isEditMode ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                toast.success(isEditMode ? 'Poll updated successfully' : 'Poll created successfully');
                setCreatePollOpen(false);
                setPostContent("");
                setSelectedFiles([]);
                setPollOptions([{ name: '' }, { name: '' }]);
                setRemovedAttachmentIds([]);
                setIsEditMode(false);
                setEditingPost(null);
                setExistingAttachments([]);
                await fetchPosts(); // Refresh the posts list
            }
        } catch (error) {
            console.error('Error creating poll:', error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} poll. Please try again.`);
        }
    };

    // Helper function to format timestamp
    // const formatTimestamp = (timestamp: string) => {
    //     const date = new Date(timestamp);
    //     const now = new Date();
    //     const diffInMs = now.getTime() - date.getTime();
    //     const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    //     const diffInDays = Math.floor(diffInHours / 24);

    //     if (diffInHours < 1) {
    //         const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    //         return `${diffInMinutes}m ago`;
    //     } else if (diffInHours < 24) {
    //         return `${diffInHours}h ago`;
    //     } else if (diffInDays < 7) {
    //         return `${diffInDays}d ago`;
    //     } else {
    //         return date.toLocaleDateString();
    //     }
    // };

    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        const year = date.getFullYear();

        // Get ordinal suffix (st, nd, rd, th)
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) suffix = 'st';
        else if (day % 10 === 2 && day !== 12) suffix = 'nd';
        else if (day % 10 === 3 && day !== 13) suffix = 'rd';

        // Get time with space in hour12 format
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const timeStr = `${String(hours).padStart(2, '0')} : ${minutes} ${ampm}`;

        return `${weekday} ${day}${suffix} ${month}, ${year} @ ${timeStr}`;
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();

        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) {
            return "Just now";
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };


    const PostCard = ({ post }: { post: Post }) => {
        const EMOJI_MAP: Record<
            string,
            { icon: string; hoverClass: string }
        > = {
            thumbs_up: { icon: "👍", hoverClass: "hover:text-blue-600" },
            laugh: { icon: "😂", hoverClass: "hover:text-green-600" },
            heart: { icon: "❤️", hoverClass: "hover:text-red-600" },
            angry: { icon: "😠", hoverClass: "hover:text-red-800" },
            clap: { icon: "👏", hoverClass: "hover:text-yellow-600" },
        };

        const REACTION_ORDER = [
            "thumbs_up",
            "heart",
            "laugh",
            "clap",
            "angry",
        ];


        return (
            <div className="bg-white rounded-[10px] border border-gray-200 p-6 mb-4 w-[80%]">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={post.creator_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.creator_full_name}`}
                            alt={post.creator_full_name}
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{post.creator_full_name}</h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{post.resource_name}</span>
                                <span>•</span>
                                <span>{formatTimestamp(post.created_at)}</span>
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
                            {
                                post.type === "post" && (
                                    <DropdownMenuItem onClick={() => handleEditPost(post)}>
                                        Edit Post
                                    </DropdownMenuItem>
                                )
                            }
                            <DropdownMenuItem
                                onClick={() => handleDeletePost(post.id, post.type)}
                                className="text-red-600 focus:text-red-600"
                            >
                                Delete {post.type === 'document' ? 'Document' : post.type === 'notice' ? 'Notice' : post.type === 'event' ? 'Event' : 'Post'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {
                    post.type !== 'document' && (
                        <>
                            {/* Post Title */}
                            {post.title && (
                                <h2 className="text-[16px] font-[500] text-gray-900 mb-2">{post.title}</h2>
                            )}

                            {/* Post Content */}
                            {
                                post.body && (
                                    <p className="text-[14px] font-[400] text-gray-700 mb-4">{post.body}</p>
                                )
                            }

                            {
                                post.type === "event" && post.event_date && (
                                    <div className="mb-4 space-y-2 text-sm text-gray-700 flex items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">
                                                {/* <Calendar1 size={14} /> */}
                                                <svg width="11" height="12" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.25 0.75H7.125V0.375C7.125 0.275544 7.08549 0.180161 7.01517 0.109835C6.94484 0.0395088 6.84946 0 6.75 0C6.65054 0 6.55516 0.0395088 6.48483 0.109835C6.41451 0.180161 6.375 0.275544 6.375 0.375V0.75H2.625V0.375C2.625 0.275544 2.58549 0.180161 2.51516 0.109835C2.44484 0.0395088 2.34946 0 2.25 0C2.15054 0 2.05516 0.0395088 1.98484 0.109835C1.91451 0.180161 1.875 0.275544 1.875 0.375V0.75H0.75C0.551088 0.75 0.360322 0.829018 0.21967 0.96967C0.0790176 1.11032 0 1.30109 0 1.5V9C0 9.19891 0.0790176 9.38968 0.21967 9.53033C0.360322 9.67098 0.551088 9.75 0.75 9.75H8.25C8.44891 9.75 8.63968 9.67098 8.78033 9.53033C8.92098 9.38968 9 9.19891 9 9V1.5C9 1.30109 8.92098 1.11032 8.78033 0.96967C8.63968 0.829018 8.44891 0.75 8.25 0.75ZM1.875 1.5V1.875C1.875 1.97446 1.91451 2.06984 1.98484 2.14016C2.05516 2.21049 2.15054 2.25 2.25 2.25C2.34946 2.25 2.44484 2.21049 2.51516 2.14016C2.58549 2.06984 2.625 1.97446 2.625 1.875V1.5H6.375V1.875C6.375 1.97446 6.41451 2.06984 6.48483 2.14016C6.55516 2.21049 6.65054 2.25 6.75 2.25C6.84946 2.25 6.94484 2.21049 7.01517 2.14016C7.08549 2.06984 7.125 1.97446 7.125 1.875V1.5H8.25V3H0.75V1.5H1.875ZM8.25 9H0.75V3.75H8.25V9ZM5.0625 5.4375C5.0625 5.54875 5.02951 5.65751 4.9677 5.75001C4.90589 5.84251 4.81804 5.91461 4.71526 5.95718C4.61248 5.99976 4.49938 6.0109 4.39026 5.98919C4.28115 5.96749 4.18092 5.91391 4.10225 5.83525C4.02359 5.75658 3.97001 5.65635 3.94831 5.54724C3.9266 5.43812 3.93774 5.32502 3.98032 5.22224C4.02289 5.11946 4.09499 5.03161 4.18749 4.9698C4.27999 4.90799 4.38875 4.875 4.5 4.875C4.64918 4.875 4.79226 4.93426 4.89775 5.03975C5.00324 5.14524 5.0625 5.28832 5.0625 5.4375ZM7.125 5.4375C7.125 5.54875 7.09201 5.65751 7.0302 5.75001C6.96839 5.84251 6.88054 5.91461 6.77776 5.95718C6.67498 5.99976 6.56188 6.0109 6.45276 5.98919C6.34365 5.96749 6.24342 5.91391 6.16475 5.83525C6.08609 5.75658 6.03251 5.65635 6.01081 5.54724C5.9891 5.43812 6.00024 5.32502 6.04282 5.22224C6.08539 5.11946 6.15749 5.03161 6.24999 4.9698C6.34249 4.90799 6.45125 4.875 6.5625 4.875C6.71168 4.875 6.85476 4.93426 6.96025 5.03975C7.06574 5.14524 7.125 5.28832 7.125 5.4375ZM3 7.3125C3 7.42375 2.96701 7.53251 2.9052 7.62501C2.84339 7.71751 2.75554 7.78961 2.65276 7.83218C2.54998 7.87476 2.43688 7.8859 2.32776 7.86419C2.21865 7.84249 2.11842 7.78891 2.03975 7.71025C1.96109 7.63158 1.90751 7.53135 1.88581 7.42224C1.8641 7.31312 1.87524 7.20002 1.91782 7.09724C1.96039 6.99446 2.03249 6.90661 2.12499 6.8448C2.21749 6.78299 2.32625 6.75 2.4375 6.75C2.58668 6.75 2.72976 6.80926 2.83525 6.91475C2.94074 7.02024 3 7.16332 3 7.3125ZM5.0625 7.3125C5.0625 7.42375 5.02951 7.53251 4.9677 7.62501C4.90589 7.71751 4.81804 7.78961 4.71526 7.83218C4.61248 7.87476 4.49938 7.8859 4.39026 7.86419C4.28115 7.84249 4.18092 7.78891 4.10225 7.71025C4.02359 7.63158 3.97001 7.53135 3.94831 7.42224C3.9266 7.31312 3.93774 7.20002 3.98032 7.09724C4.02289 6.99446 4.09499 6.90661 4.18749 6.8448C4.27999 6.78299 4.38875 6.75 4.5 6.75C4.64918 6.75 4.79226 6.80926 4.89775 6.91475C5.00324 7.02024 5.0625 7.16332 5.0625 7.3125ZM7.125 7.3125C7.125 7.42375 7.09201 7.53251 7.0302 7.62501C6.96839 7.71751 6.88054 7.78961 6.77776 7.83218C6.67498 7.87476 6.56188 7.8859 6.45276 7.86419C6.34365 7.84249 6.24342 7.78891 6.16475 7.71025C6.08609 7.63158 6.03251 7.53135 6.01081 7.42224C5.9891 7.31312 6.00024 7.20002 6.04282 7.09724C6.08539 6.99446 6.15749 6.90661 6.24999 6.8448C6.34249 6.78299 6.45125 6.75 6.5625 6.75C6.71168 6.75 6.85476 6.80926 6.96025 6.91475C7.06574 7.02024 7.125 7.16332 7.125 7.3125Z" fill="black" />
                                                </svg>

                                            </span>
                                            <span>{formatEventDate(post.event_date)}</span>
                                        </div>
                                        {post.location && (
                                            <div className="flex items-center gap-2 !mt-0">
                                                <span className="text-lg">
                                                    <MapPin size={14} />
                                                </span>
                                                <span>{post.location}</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            }

                            {
                                post.type === "notice" && post.expire_time && (
                                    <div className="mb-4 space-y-2 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">📅</span>
                                            <span>Expires: {new Date(post.expire_time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} @ {new Date(post.expire_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Poll Options - Display if post has poll_options */}
                            {post.poll_options && post.poll_options.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    {post.poll_options.map((option) => (
                                        <div
                                            key={option.id}
                                            className="relative bg-[#fff] border border-gray-200 rounded-[5px] px-4 py-2 transition-colors overflow-hidden"
                                        >
                                            {/* Progress bar background */}
                                            <div
                                                className="absolute inset-0 bg-[rgba(196,184,157,0.13)] rounded-[5px]"
                                                style={{ width: `${option.vote_percentage}%` }}
                                            ></div>

                                            <div className="relative flex items-center justify-between">
                                                <span className="font-normal text-[#1F1F1F]">{option.name}</span>
                                                <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                                                    <span>{option.total_votes} votes</span>
                                                    <span className="text-[#C4B89D]">{option.vote_percentage.toFixed(2)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Post Attachments - Instagram Style Carousel */}
                            {post.attachments && post.attachments.length > 0 && (
                                <div className={`mb-4 gap-1 ${post.attachments.length === 1 ? 'grid grid-cols-1' :
                                    post.attachments.length === 2 ? 'grid grid-cols-2' :
                                        post.attachments.length === 3 ? 'grid grid-cols-2' :
                                            'grid grid-cols-2'
                                    }`}>
                                    {post.attachments.map((attachment, index) => {
                                        const isImage = attachment?.document_content_type?.startsWith('image/');
                                        const isVideo = attachment.document_content_type?.startsWith('video/');
                                        const shouldShowMore = post.attachments.length > 3 && index === 2;

                                        return (
                                            <div
                                                key={attachment.id}
                                                className={`relative overflow-hidden rounded-lg cursor-pointer group ${post.attachments.length === 1 ? 'col-span-1' :
                                                    post.attachments.length === 3 && index === 0 ? 'col-span-2' :
                                                        post.attachments.length > 4 && index === 0 ? 'col-span-2 row-span-2' :
                                                            ''
                                                    }`}
                                                style={{
                                                    height: post.attachments.length === 1 ? '400px' :
                                                        post.attachments.length === 2 ? '300px' :
                                                            post.attachments.length === 3 && index === 0 ? '300px' :
                                                                post.attachments.length === 3 ? '200px' :
                                                                    post.attachments.length > 4 && index === 0 ? '400px' : '200px'
                                                }}
                                                onClick={() => {
                                                    if (isImage || isVideo) {
                                                        setCarouselAttachments(post.attachments);
                                                        setCarouselStartIndex(index);
                                                        setCarouselOpen(true);
                                                    }
                                                }}
                                            >
                                                {isImage ? (
                                                    <img
                                                        src={attachment.url}
                                                        alt="Post attachment"
                                                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                                    />
                                                ) : isVideo ? (
                                                    <video
                                                        // src={attachment.url}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                    >
                                                        <source src={attachment.url} type="video/mp4" />
                                                    </video>
                                                ) : null}

                                                {/* Show count overlay for 5+ images */}
                                                {shouldShowMore && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center hover:bg-opacity-70 transition-opacity">
                                                        <span className="text-white text-3xl font-semibold">
                                                            +{post.attachments.length - 2}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Image Count Badge (if multiple images) */}
                                                {post.attachments.filter(a => a?.document_content_type?.startsWith('image/')).length > 1 && (
                                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                        </svg>
                                                        {post.attachments.filter(a => a.document_content_type.startsWith('image/')).length}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }).slice(0, 3)}
                                </div>
                            )}
                        </>
                    )
                }

                {/* Document Card Display */}
                {post.type === 'document' && (
                    <div
                        className="bg-[#F6F4EE] rounded-lg p-4 cursor-pointer"
                        onClick={() => navigate(`/pulse/community/document/${post.document_id}`)}
                    >
                        <div className="flex items-center gap-4">
                            {/* Document Icon */}
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-14 h-14 bg-[#E6E0D3] rounded-lg">
                                    <Folder size={24} className="text-[#c72030]" />
                                </div>
                            </div>

                            {/* Document Info */}
                            <div className="flex-grow min-w-0">
                                <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">{post.title}</h3>
                                {post.attachment?.file_size && <span className="text-sm font-[500] text-gray-600">{post.attachment.file_size}</span>}
                                <p className="text-gray-600 text-sm font-[500] mt-1 truncate">
                                    Created:{" "}
                                    {post.created_at &&
                                        new Date(post.created_at).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                </p>

                            </div>
                        </div>
                    </div>
                )}

                {/* Reactions and Comments */}
                {
                    post.type === "post" && (
                        <div className="flex items-center gap-3 border-t border-b border-gray-200 py-3">
                            {REACTION_ORDER.map((emojiKey) => {
                                const count = post.likes_with_emoji?.[emojiKey];
                                const emoji = EMOJI_MAP[emojiKey];

                                if (!emoji || !count || count === 0) return null;

                                return (
                                    <button
                                        key={emojiKey}
                                        onClick={() => {
                                            setReactionsModalData(post.likes_with_user_names);
                                            setReactionsModalOpen(true);
                                        }}
                                        className={`flex items-center gap-1 text-gray-600 transition-colors cursor-pointer hover:opacity-75 ${emoji.hoverClass}`}
                                    >
                                        <span>{emoji.icon}</span>
                                        <span className="text-sm font-medium">{count}</span>
                                    </button>
                                );
                            })}
                            <button
                                className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
                                onClick={() => setShowCommentsForPost(showCommentsForPost === post.id ? null : post.id)}
                            >
                                <MessageSquare size={14} />
                                <span className="text-sm font-medium">{post?.comments?.length} comments</span>
                            </button>
                        </div>
                    )
                }

                {/* Comments Section */}
                {showCommentsForPost === post.id && post.comments && post.comments.length > 0 && (
                    <div className="mt-6 space-y-4">
                        {post.comments.map((comment) => (
                            <div key={comment.id} className={`bg-white rounded-[8px] p-4 border ${(comment.reports_count && comment.reports_count > 0) ? "border-[#c72030]" : "border-gray-200"
                                }`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={comment.commentor_profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.commentor_full_name}`}
                                            alt={comment.commentor_full_name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{comment.commentor_full_name}</h4>
                                                {(comment.reports_count > 0) && (
                                                    <span
                                                        className="bg-[rgba(199,32,48,0.5)] text-white text-xs px-2 py-1 rounded-[4px] flex items-center gap-1 cursor-pointer hover:bg-[#c72030] transition-colors w-[125px]"
                                                        onClick={() => navigate(`/pulse/community/${communityId}/reports?resourceType=Comment&resourceId=${comment.id}`)}
                                                    >
                                                        <FileText size={12} />{comment.reports_count} Report{comment.reports_count > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">{formatTimestamp(comment.created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-3 text-sm">{comment.body}</p>

                                <div className="flex items-center justify-between border-t border-gray-200 w-[75%] pt-2">
                                    <div className="flex items-center gap-4">
                                        {/* <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                                            <Heart size={16} />
                                            <span className="text-sm font-medium">0</span>
                                        </button> */}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="border border-[#c72030] rounded-[5px] text-[#c72030]"
                                        onClick={() => deleteComment(comment.id)}
                                    >
                                        <Trash2 size={14} color="#c72030" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Community Header */}
            <div className="bg-[#F6F4EE] rounded-lg border border-gray-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={communityImg || "https://api.dicebear.com/7.x/identicon/svg?seed=MondayHaters"}
                        alt={communityName}
                        className="w-10 h-10 rounded-full"
                    />
                    <h2 className="text-xl font-semibold text-gray-900">{communityName}</h2>
                </div>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isActive}
                            onChange={() => handleStatusChange(Number(id), isActive)}
                            disabled={isToggling === Number(id)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#10B981',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#10B981',
                                },
                                '& .MuiSwitch-switchBase': {
                                    color: '#EF4444',
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: '#FCA5A5',
                                },
                            }}
                        />
                    }
                    label={
                        <span className="text-sm font-medium">
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    }
                    labelPlacement="end"
                />
            </div>

            {/* Create Post Button */}
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="!bg-[#c72030] hover:bg-[#c72030] !text-white">
                            <Plus className="w-4 h-4 mr-2" color="white" />
                            Create Post
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[9.1rem]">
                        <DropdownMenuItem className="font-medium justify-center" onClick={() => setCreatePostOpen(true)}>
                            Create Post
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-medium justify-center" onClick={() => setCreatePollOpen(true)}>
                            Create Poll
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Feed Posts */}
            <div>
                {isLoadingPosts ? (
                    <div className="space-y-4">
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No posts available
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
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
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            {isEditMode ? 'Edit Post' : 'Create Post'}
                        </DialogTitle>
                        <Button variant="ghost" onClick={() => setCreatePostOpen(false)}>
                            <X />
                        </Button>
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
                                                        src={attachment.url}
                                                        alt="Existing attachment"
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : attachment.document_content_type.startsWith('video/') ? (
                                                    <video
                                                        src={attachment.url}
                                                        controls
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : null}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setExistingAttachments(prev => prev.filter(a => a.id !== attachment.id));
                                                        setRemovedAttachmentIds(prev => [...prev, attachment.id]);
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
                                className="!border-gray-300 !bg-[#F9F8F6] !text-gray-700 hover:bg-gray-50 rounded-[8px]"
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
                    setPollOptions([{ name: '' }, { name: '' }]);
                    setExistingAttachments([]);
                    setRemovedAttachmentIds([]);
                    setIsEditMode(false);
                    setEditingPost(null);
                }
            }}>
                <DialogContent className="max-w-2xl bg-[#F9F8F6] rounded-[16px] max-h-[90vh] flex flex-col">
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle className="text-xl font-semibold text-gray-900">Create Admin Post</DialogTitle>
                        <Button variant="ghost" onClick={() => setCreatePollOpen(false)}>
                            <X />
                        </Button>
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
                                                        src={attachment.url}
                                                        alt="Existing attachment"
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : attachment.document_content_type.startsWith('video/') ? (
                                                    <video
                                                        src={attachment.url}
                                                        controls
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : null}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setExistingAttachments(prev => prev.filter(a => a.id !== attachment.id));
                                                        setRemovedAttachmentIds(prev => [...prev, attachment.id]);
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
                                            value={option.name}
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
                                    className="w-auto !border-gray-300 !bg-[#F9F8F6] !text-gray-700 hover:bg-gray-50 rounded-[8px] flex items-center gap-2"
                                >
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
                                    setPollOptions([{ name: '' }, { name: '' }]);
                                    setExistingAttachments([]);
                                    setRemovedAttachmentIds([]);
                                    setIsEditMode(false);
                                    setEditingPost(null);
                                }}
                                className="!border-gray-300 !bg-[#F9F8F6] !text-gray-700 hover:bg-gray-50 rounded-[8px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="!bg-[#c72030] !hover:bg-[#b01d2a] !text-white rounded-[8px]"
                                onClick={handleCreatePoll}
                            >
                                {isEditMode ? 'Update Poll' : 'Publish Poll'}
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
                            Are you sure you want to Delete<br />this {deleteConfirmation.type === 'post' ? 'Community Post' : deleteConfirmation.type === 'document' ? 'Document' : deleteConfirmation.type === 'notice' ? 'Notice' : deleteConfirmation.type === 'event' ? 'Event' : 'Comment'} ?
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

            {/* Image Carousel Modal */}
            <ImageCarouselModal
                open={carouselOpen}
                onOpenChange={setCarouselOpen}
                attachments={carouselAttachments}
                initialIndex={carouselStartIndex}
            />

            {/* Reactions Modal */}
            <ReactionsModal
                open={reactionsModalOpen}
                onOpenChange={setReactionsModalOpen}
                reactions={reactionsModalData}
            />
        </div>
    );
};

export default CommunityFeedTab;