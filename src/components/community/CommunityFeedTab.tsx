import { useEffect, useState } from "react";
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
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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
}

const CommunityFeedTab = ({ communityId, communityName }: CommunityFeedTabProps) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [createPostOpen, setCreatePostOpen] = useState(false);
    const [createPollOpen, setCreatePollOpen] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [communityActive, setCommunityActive] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [showCommentsForPost, setShowCommentsForPost] = useState<number | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([])

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}/posts.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setPosts(response.data.posts);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
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
        setCreatePostOpen(true);
    };

    const handleDeletePost = async (postId: number) => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const response = await axios.delete(
                `https://${baseUrl}/posts/${postId}.json`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 204) {
                toast.success('Post deleted successfully');
                await fetchPosts(); // Refresh the posts list
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post. Please try again.');
        }
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
                setCreatePostOpen(false);
                setPostContent("");
                setSelectedFiles([]);
                setIsEditMode(false);
                setEditingPost(null);
                setExistingAttachments([]);
                await fetchPosts(); // Refresh the posts list
            }
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} post. Please try again.`);
        }
    };


    // Helper function to format timestamp
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

    const PostCard = ({ post }: { post: Post }) => {
        // Calculate total reactions from likes_with_emoji
        const thumbsUpCount = post.likes_with_emoji?.thumb || 0;
        const heartCount = post.likes_with_emoji?.heart || 0;
        const fireCount = post.likes_with_emoji?.fire || 0;

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
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
                )}

                {/* Post Content */}
                <p className="text-gray-700 mb-4">{post.body}</p>

                {/* Post Attachments - WhatsApp Style */}
                {post.attachments && post.attachments.length > 0 && (
                    <div className={`mb-4 gap-1 ${post.attachments.length === 1 ? 'grid grid-cols-1' :
                        post.attachments.length === 2 ? 'grid grid-cols-2' :
                            post.attachments.length === 3 ? 'grid grid-cols-2' :
                                'grid grid-cols-2'
                        }`}>
                        {post.attachments.map((attachment, index) => (
                            <div
                                key={attachment.id}
                                className={`relative overflow-hidden rounded-lg ${post.attachments.length === 1 ? 'col-span-1' :
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
                            >
                                {attachment.document_content_type.startsWith('image/') ? (
                                    <img
                                        src={attachment.url}
                                        alt="Post attachment"
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    />
                                ) : attachment.document_content_type.startsWith('video/') ? (
                                    <video
                                        src={attachment.url}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                ) : null}
                                {/* Show count overlay for 5+ images */}
                                {post.attachments.length > 4 && index === 3 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                        <span className="text-white text-3xl font-semibold">
                                            +{post.attachments.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )).slice(0, 4)}
                    </div>
                )}

                {/* Reactions and Comments */}
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                        👍
                        <span className="text-sm font-medium">{thumbsUpCount}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                        ❤️
                        <span className="text-sm font-medium">{heartCount}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                        🔥
                        <span className="text-sm font-medium">{fireCount}</span>
                    </button>
                    <button
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
                        onClick={() => setShowCommentsForPost(showCommentsForPost === post.id ? null : post.id)}
                    >
                        <MessageSquare size={14} />
                        <span className="text-sm font-medium">{post.comments.length} comments</span>
                    </button>
                </div>

                {/* Post Actions */}
                {/* <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="!text-gray-700 !border-gray-300 rounded-[5px] px-2 hover:bg-gray-50 flex items-center"
                    >
                        <Pin size={13} />
                        Pin
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="!text-gray-700 !border-gray-300 rounded-[5px] px-2 hover:bg-gray-50 flex items-center"
                    >
                        <EyeOff size={13} />
                        {post.blocked ? "Unhide" : "Hide"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="!text-red-600 !border-red-600 rounded-[5px] px-2 hover:bg-red-50 flex items-center"
                    >
                        <Trash2 size={13} />
                        Delete
                    </Button>
                </div> */}

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
                                            </div>
                                            <p className="text-sm text-gray-500">{formatTimestamp(comment.created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-3">{comment.body}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                                            <Heart size={16} />
                                            <span className="text-sm font-medium">0</span>
                                        </button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="!text-red-600 hover:!bg-red-50 flex items-center gap-1 h-8 px-3"
                                    >
                                        <Trash2 size={14} />
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
                            checked={communityActive}
                            onChange={(e) => setCommunityActive(e.target.checked)}
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
                            {communityActive ? "Active" : "Inactive"}
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
                    <DropdownMenuContent align="end" className="w-48">
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
                <DialogContent className="max-w-2xl bg-[#F9F8F6] rounded-[16px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            {isEditMode ? 'Edit Post' : 'Create Post'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5">
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
            <Dialog open={createPollOpen} onOpenChange={setCreatePollOpen}>
                <DialogContent className="max-w-2xl bg-[#F9F8F6] rounded-[16px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">Create Admin Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5">
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
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
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
                                    />
                                    <label
                                        htmlFor="poll-file-upload"
                                        className="cursor-pointer text-[#9CA3AF]"
                                    >
                                        <p className="text-sm leading-relaxed">
                                            Choose a file or<br />drag & drop it here
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
                                <Input
                                    placeholder="Option 1"
                                    className="bg-white border-[#E5E5E5] placeholder:text-[#9CA3AF] rounded-[8px]"
                                />
                                <Input
                                    placeholder="Option 2"
                                    className="bg-white border-[#E5E5E5] placeholder:text-[#9CA3AF] rounded-[8px]"
                                />
                                <Button
                                    variant="outline"
                                    className="w-auto border-[#E5E5E5] text-gray-700 hover:bg-gray-50 rounded-[8px]"
                                >
                                    Add Option
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setCreatePollOpen(false)}
                                className="border-[#E5E5E5] text-gray-700 hover:bg-gray-50 rounded-[8px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#c72030] hover:bg-[#b01d2a] text-white rounded-[8px]"
                                onClick={() => setCreatePollOpen(false)}
                            >
                                Publish Poll
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CommunityFeedTab;
