import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
    ThumbsUp,
    Heart,
    Flame,
    MessageCircle,
    Pin,
    EyeOff,
    Trash2,
    Plus,
    X,
    Upload,
    MessageSquare,
    MoreVertical,
} from "lucide-react";

interface CommunityFeedTabProps {
    communityId?: string;
}

interface Comment {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    timestamp: string;
    content: string;
    likes: number;
    replies?: number;
    isReported?: boolean;
}

interface Post {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    category: string;
    timestamp: string;
    type: "text" | "image" | "poll";
    content: string;
    image?: string;
    poll?: {
        question: string;
        options: { text: string; votes: number; percentage: number }[];
        totalVotes: number;
    };
    reactions: {
        thumbsUp: number;
        heart: number;
        fire: number;
    };
    comments: number;
    commentsList?: Comment[];
    isPinned?: boolean;
    status: "Active" | "Inactive";
}

const CommunityFeedTab = ({ communityId }: CommunityFeedTabProps) => {
    const [createPostOpen, setCreatePostOpen] = useState(false);
    const [createPollOpen, setCreatePollOpen] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [communityActive, setCommunityActive] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [showCommentsForPost, setShowCommentsForPost] = useState<string | null>(null);

    // Mock data for demonstration
    const posts: Post[] = [
        {
            id: "1",
            author: {
                name: "Admin 1",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin1",
            },
            category: "Tech Talk",
            timestamp: "2h ago",
            type: "text",
            content:
                "What are your thoughts on the latest AI developments? I think we're entering an exciting era of innovation!",
            reactions: { thumbsUp: 24, heart: 12, fire: 8 },
            comments: 15,
            commentsList: [
                {
                    id: "c1",
                    author: {
                        name: "Jessica Taylor",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
                    },
                    timestamp: "2h ago",
                    content: "This is really helpful! Thanks for sharing these insights.",
                    likes: 12,
                    replies: 1,
                },
                {
                    id: "c2",
                    author: {
                        name: "Sarah Johnson",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                    },
                    timestamp: "1h ago",
                    content: "Glad you found it useful!",
                    likes: 5,
                },
                {
                    id: "c3",
                    author: {
                        name: "Alex Kumar",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                    },
                    timestamp: "1h ago",
                    content: "Could you elaborate more on the third point? I'm curious to learn more about it.",
                    likes: 8,
                    isReported: true,
                },
            ],
            status: "Active",
        },
        {
            id: "2",
            author: {
                name: "Admin 2",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin2",
            },
            category: "Fitness & Wellness",
            timestamp: "5h ago",
            type: "image",
            content:
                "Morning workout complete! 💪 Sharing my progress from the past 3 months.",
            image:
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop",
            reactions: { thumbsUp: 45, heart: 32, fire: 18 },
            comments: 23,
            commentsList: [
                {
                    id: "c4",
                    author: {
                        name: "Mike Chen",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
                    },
                    timestamp: "3h ago",
                    content: "Amazing transformation! What's your workout routine?",
                    likes: 18,
                    replies: 2,
                },
                {
                    id: "c5",
                    author: {
                        name: "Emma Davis",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
                    },
                    timestamp: "2h ago",
                    content: "So inspiring! Keep up the great work 💪",
                    likes: 24,
                },
                {
                    id: "c6",
                    author: {
                        name: "David Wilson",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
                    },
                    timestamp: "1h ago",
                    content: "Can you share your diet plan as well?",
                    likes: 15,
                },
            ],
            isPinned: true,
            status: "Active",
        },
        {
            id: "3",
            author: {
                name: "Admin 3",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin3",
            },
            category: "Food Lovers",
            timestamp: "8h ago",
            type: "poll",
            content: "Quick poll: What's your favorite cuisine?",
            poll: {
                question: "What's your favorite cuisine?",
                options: [
                    { text: "Italian", votes: 45, percentage: 27 },
                    { text: "Japanese", votes: 38, percentage: 23 },
                    { text: "Mexican", votes: 29, percentage: 18 },
                    { text: "Indian", votes: 52, percentage: 32 },
                ],
                totalVotes: 164,
            },
            reactions: { thumbsUp: 15, heart: 0, fire: 0 },
            comments: 8,
            commentsList: [
                {
                    id: "c7",
                    author: {
                        name: "Maria Garcia",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
                    },
                    timestamp: "4h ago",
                    content: "I voted for Indian! The spices are just incredible.",
                    likes: 6,
                },
                {
                    id: "c8",
                    author: {
                        name: "Tom Anderson",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
                    },
                    timestamp: "3h ago",
                    content: "Italian all the way! Nothing beats a good pasta.",
                    likes: 9,
                    replies: 1,
                },
            ],
            status: "Active",
        },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
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
        if (files && files[0]) {
            // Check if it's an image or video file
            if (files[0].type.startsWith('image/') || files[0].type.startsWith('video/')) {
                setSelectedFile(files[0]);
            }
        }
    };

    const handleCreatePost = () => {
        // Handle post creation logic here
        setCreatePostOpen(false);
        setPostContent("");
        setSelectedFile(null);
    };


    const PostCard = ({ post }: { post: Post }) => (
        <div className="bg-white rounded-[10px] border border-gray-200 p-6 mb-4 w-[80%]">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                            {post.isPinned && <Pin className="w-4 h-4 text-red-500" />}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                {post.type === "image" && "📷 Image"}
                                {post.type === "text" && "📝 Text"}
                                {post.type === "poll" && "📊 Poll"}
                            </span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost">
                    <MoreVertical size={14} className="text-gray-500 cursor-pointer" />
                </Button>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 mb-4">{post.content}</p>

            {/* Post Image */}
            {post.type === "image" && post.image && (
                <img
                    src={post.image}
                    alt="Post content"
                    className="w-full rounded-lg mb-4"
                />
            )}

            {/* Poll */}
            {post.type === "poll" && post.poll && (
                <div className="mb-4 space-y-3">
                    {post.poll.options.map((option, index) => (
                        <div
                            key={index}
                            className="relative bg-white rounded-[5px] px-4 py-2 overflow-hidden border border-gray-200"
                        >
                            <div
                                className="absolute inset-0 bg-[rgba(196,184,157,0.13)] transition-all"
                                style={{ width: `${option.percentage}%` }}
                            />
                            <div className="relative flex items-center justify-between">
                                <span className="text-sm font-normal text-gray-600">{option.text}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">{option.votes} votes</span>
                                    <span className="text-sm font-medium text-[#C4B89D]">
                                        {option.percentage}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reactions and Comments */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                    👍
                    <span className="text-sm font-medium">{post.reactions.thumbsUp}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                    ❤️
                    <span className="text-sm font-medium">{post.reactions.heart}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                    🔥
                    <span className="text-sm font-medium">{post.reactions.fire}</span>
                </button>
                <button
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
                    onClick={() => setShowCommentsForPost(showCommentsForPost === post.id ? null : post.id)}
                >
                    <MessageSquare size={14} />
                    <span className="text-sm font-medium">{post.comments} comments</span>
                </button>
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="!text-gray-700 !border-gray-300 rounded-[5px] px-2 hover:bg-gray-50 flex items-center"
                >
                    <Pin size={13} />
                    {post.isPinned ? "Unpin" : "Unpin"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="!text-gray-700 !border-gray-300 rounded-[5px] px-2 hover:bg-gray-50 flex items-center"
                >
                    <EyeOff size={13} />
                    Hide
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="!text-red-600 !border-red-600 rounded-[5px] px-2 hover:bg-red-50 flex items-center"
                >
                    <Trash2 size={13} />
                    Delete
                </Button>
            </div>

            {/* Comments Section */}
            {showCommentsForPost === post.id && post.commentsList && (
                <div className="mt-6 space-y-4">
                    {post.commentsList.map((comment) => (
                        <div key={comment.id} className="bg-white border border-gray-200 rounded-[8px] p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={comment.author.avatar}
                                        alt={comment.author.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                                            {comment.isReported && (
                                                <Badge variant="destructive" className="text-xs px-2 py-0.5 bg-red-100 text-red-600 border-0">
                                                    🚩 1 Report
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{comment.timestamp}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-3">{comment.content}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                                        <Heart size={16} />
                                        <span className="text-sm font-medium">{comment.likes}</span>
                                    </button>
                                    {comment.replies && comment.replies > 0 && (
                                        <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors">
                                            <MessageCircle size={16} />
                                            <span className="text-sm font-medium">{comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}</span>
                                        </button>
                                    )}
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

    return (
        <div className="space-y-4">
            {/* Community Header */}
            <div className="bg-[#F6F4EE] rounded-lg border border-gray-200 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src="https://api.dicebear.com/7.x/identicon/svg?seed=MondayHaters"
                        alt="Monday Haters"
                        className="w-10 h-10 rounded-full"
                    />
                    <h2 className="text-xl font-semibold text-gray-900">Monday Haters</h2>
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
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {/* Create Post Modal */}
            <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
                <DialogContent className="max-w-2xl bg-[#F9F8F6] rounded-[16px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">Create Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Add Media
                            </label>
                            {selectedFile ? (
                                <div className="bg-white border border-[#E5E5E5] p-4 text-center rounded-[8px]">
                                    <div className="relative">
                                        {selectedFile.type.startsWith('image/') ? (
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="Preview"
                                                className="max-h-64 rounded-lg"
                                            />
                                        ) : selectedFile.type.startsWith('video/') ? (
                                            <video
                                                src={URL.createObjectURL(selectedFile)}
                                                controls
                                                className="max-h-64 rounded-lg"
                                            />
                                        ) : null}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
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
                                    />
                                    <label
                                        htmlFor="file-upload"
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

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCreatePostOpen(false);
                                    setPostContent("");
                                    setSelectedFile(null);
                                }}
                                className="border-[#E5E5E5] text-gray-700 hover:bg-gray-50 rounded-[8px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="!bg-[#c72030] !hover:bg-[#b01d2a] !text-white rounded-[8px]"
                                onClick={handleCreatePost}
                            >
                                Publish Post
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
                            {selectedFile ? (
                                <div className="bg-white border border-[#E5E5E5] p-4 text-center rounded-[8px]">
                                    <div className="relative">
                                        {selectedFile.type.startsWith('image/') ? (
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="Preview"
                                                className="max-h-64 rounded-lg"
                                            />
                                        ) : selectedFile.type.startsWith('video/') ? (
                                            <video
                                                src={URL.createObjectURL(selectedFile)}
                                                controls
                                                className="max-h-64 rounded-lg"
                                            />
                                        ) : null}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
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
