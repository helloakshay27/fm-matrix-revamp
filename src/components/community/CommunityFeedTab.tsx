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
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { ImageCarouselModal } from "./ImageCarouselModal";
import { ReactionsModal } from "./ReactionsModal";

interface CommunityFeedTabProps {
    communityId?: string;
    communityName?: string;
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
    type: 'post' | 'event' | 'notice';
    event_date?: string;
    event_time?: string;
    event_location?: string;
    location?: string;
    expire_time?: string;
}

const CommunityFeedTab = ({ communityId, communityName }: CommunityFeedTabProps) => {
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
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const [isToggling, setIsToggling] = useState<number | null>(null)
    const [isActive, setIsActive] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; type: 'post' | 'comment' | null; id: number | null }>({ open: false, type: null, id: null });
    const [carouselOpen, setCarouselOpen] = useState(false);
    const [carouselAttachments, setCarouselAttachments] = useState<Attachment[]>([]);
    const [carouselStartIndex, setCarouselStartIndex] = useState(0);
    const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>([]);
    const [reactionsModalOpen, setReactionsModalOpen] = useState(false);
    const [reactionsModalData, setReactionsModalData] = useState<Like[]>([]);

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
            attachments: notice.cover_image ? [{
                id: notice.cover_image.id,
                url: notice.cover_image.url,
                document_content_type: "image/jpeg"
            }] : [],
            type: 'notice',
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
        try {
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/posts.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const posts = response.data.posts.map(post => ({
                ...post,
                type: 'post'
            }))
            const events = response.data.events.map(transformedEvent)
            const notices = response.data.notices ? response.data.notices.map(transformedNotice) : []

            const combined = [...posts, ...events, ...notices].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setPosts(combined);
        } catch (error) {
            console.log(error)
        }
    }

    console.log(posts)

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
            setPollOptions(post.poll_options.map(opt => opt.name));
            setCreatePollOpen(true);
        } else {
            // Open regular post modal for normal posts
            setCreatePostOpen(true);
        }
    };

    const handleDeletePost = (postId: number) => {
        setDeleteConfirmation({ open: true, type: 'post', id: postId });
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
        setPollOptions(prev => [...prev, '']);
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

            // Add removed attachment IDs when editing
            if (isEditMode && removedAttachmentIds.length > 0) {
                removedAttachmentIds.forEach((id) => {
                    formData.append('attachment_ids[]', id.toString());
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
                setRemovedAttachmentIds([]);
                await fetchPosts(); // Refresh the posts list
            }
        } catch (error) {
            console.error('Error creating poll:', error);
            toast.error('Failed to create poll. Please try again.');
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
                            <DropdownMenuItem onClick={() => handleEditPost(post)}>
                                Edit Post
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 focus:text-red-600"
                            >
                                Delete Post
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Post Title */}
                {post.title && (
                    <h2 className="text-[16px] font-[500] text-gray-900 mb-2">{post.title}</h2>
                )}

                {/* Post Content */}
                <p className="text-[14px] font-[400] text-gray-700 mb-4">{post.body}</p>

                {
                    post.type === "event" && post.event_date && (
                        <div className="mb-4 space-y-2 text-sm text-gray-700 flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">
                                    <Calendar1 size={14} />
                                </span>
                                <span>{new Date(post.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} @ {new Date(post.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
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
                                        <span className="text-[#C4B89D]">{option.vote_percentage}%</span>
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
                            const shouldShowMore = post.attachments.length > 4 && index === 3;

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
                                            src={attachment.url}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    ) : null}

                                    {/* Show count overlay for 5+ images */}
                                    {shouldShowMore && (
                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center hover:bg-opacity-70 transition-opacity">
                                            <span className="text-white text-3xl font-semibold">
                                                +{post.attachments.length - 4}
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
                        }).slice(0, 4)}
                    </div>
                )}

                {/* Reactions and Comments */}
                {
                    post.type === "post" && (
                        <div className="flex items-center gap-3 border-t border-b border-gray-200 py-3">
                            {Object.entries(post.likes_with_emoji || {}).map(
                                ([emojiKey, count]) => {
                                    const emoji = EMOJI_MAP[emojiKey];

                                    if (!emoji || count === 0) return null;

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
                                }
                            )}
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
                            <div key={comment.id} className="bg-white border border-gray-200 rounded-[8px] p-4">
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
                                                {comment.reports_count && comment.reports_count > 0 && (
                                                    <span
                                                        className="bg-[rgba(199,32,48,0.5)] text-white text-xs font-bold px-3 py-1 rounded-[4px] flex items-center gap-1 cursor-pointer hover:bg-[#c72030] transition-colors"
                                                        onClick={() => navigate(`/pulse/community/${communityId}/reports?resourceType=Comment&resourceId=${comment.id}`)}
                                                    >
                                                        <FileText size={13} />{comment.reports_count} Report{comment.reports_count > 1 ? 's' : ''}
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
                                        <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                                            <Heart size={16} />
                                            <span className="text-sm font-medium">0</span>
                                        </button>
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
                        src="https://api.dicebear.com/7.x/identicon/svg?seed=MondayHaters"
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
                        <DropdownMenuItem onClick={() => setCreatePostOpen(true)}>
                            Create Post
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCreatePollOpen(true)}>
                            Create Poll
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Feed Posts */}
            <div>
                {posts.length > 0 ? (
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
                    setPollOptions(['', '']);
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
                                    setPollOptions(['', '']);
                                }}
                                className="!border-gray-300 !bg-[#F9F8F6] !text-gray-700 hover:bg-gray-50 rounded-[8px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="!bg-[#c72030] !hover:bg-[#b01d2a] !text-white rounded-[8px]"
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
                                className="flex-1 px-3 py-4 bg-[#D3D3D3] text-[#6C6C6C] font-semibold text-[14px] hover:bg-[#C0C0C0] transition-colors"
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
