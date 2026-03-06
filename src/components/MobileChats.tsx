import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardPlus, FileText, X, Reply, Forward, Search, Users, MessageCircle, CornerDownRight, Pin, PinOff, MoreVertical } from "lucide-react";
import CreateChatTask from "./CreateChatTask";
import PinnedMessagesHeader from "./PinnedMessagesHeader";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createChatTask, sendMessage, updateMessage } from "@/store/slices/channelSlice";
import { useParams } from "react-router-dom";

const MobileChats = ({ messages, onReply, bottomRef }) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const currentUserId = localStorage.getItem("userId");
    const messageRefs = useRef({});
    const longPressTimeoutRef = useRef(null);

    const { data: conversations } = useAppSelector(state => state.fetchConversations);
    const { data: groups } = useAppSelector(state => state.fetchGroups);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [showForwardDialog, setShowForwardDialog] = useState(false);
    const [messageToForward, setMessageToForward] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedForwardTargets, setSelectedForwardTargets] = useState([]);
    const [showActionMenu, setShowActionMenu] = useState(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleLongPress = (message) => {
        setShowActionMenu(message.id);
    };

    const handleTouchStart = (message) => {
        longPressTimeoutRef.current = setTimeout(() => {
            handleLongPress(message);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current);
        }
    };

    useEffect(() => {
        return () => {
            if (longPressTimeoutRef.current) {
                clearTimeout(longPressTimeoutRef.current);
            }
        };
    }, []);

    const handleCreateTask = async (payload) => {
        try {
            await dispatch(
                createChatTask({ baseUrl, token, data: payload })
            ).unwrap();
            toast.success("Chat task created successfully");
            setOpenTaskModal(false);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    const handleReply = (message) => {
        onReply(message);
        setShowActionMenu(null);
    };

    const handleForward = (message) => {
        setMessageToForward(message);
        setShowForwardDialog(true);
        setSelectedForwardTargets([]);
        setSearchQuery("");
        setShowActionMenu(null);
    };

    const handlePin = async (message) => {
        try {
            if (message.is_pinned) {
                await dispatch(
                    updateMessage({ baseUrl, token, id: message.id, data: { message: { is_pinned: false } } })
                ).unwrap();
                toast.success("Message unpinned");
            } else {
                await dispatch(
                    updateMessage({ baseUrl, token, id: message.id, data: { message: { is_pinned: true } } })
                ).unwrap();
                toast.success("Message pinned");
            }
            setShowActionMenu(null);
        } catch (error) {
            console.log(error);
            toast.error("Failed to update pin status");
        }
    };

    const scrollToMessage = (messageId) => {
        const messageElement = messageRefs.current[messageId];
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
            messageElement.classList.add("highlight-message");
            setTimeout(() => {
                messageElement.classList.remove("highlight-message");
            }, 2000);
        }
    };

    const toggleForwardTarget = (target, type) => {
        const targetId = `${type}-${target.id}`;
        setSelectedForwardTargets(prev => {
            if (prev.find(t => t.id === targetId)) {
                return prev.filter(t => t.id !== targetId);
            } else {
                return [...prev, { id: targetId, data: target, type }];
            }
        });
    };

    const handleSendForward = async () => {
        if (selectedForwardTargets.length === 0) {
            toast.error("Please select at least one conversation or group");
            return;
        }

        try {
            const forwardPromises = selectedForwardTargets.map(async (target) => {
                const payload = new FormData();
                payload.append("message[body]", messageToForward.body || "");
                payload.append("message[is_forwarded]", "true");

                if (target.type === "conversation") {
                    payload.append("message[conversation_id]", target.data.id);
                } else {
                    payload.append("message[project_space_id]", target.data.id);
                }

                if (messageToForward.attachments && messageToForward.attachments.length > 0) {
                    messageToForward.attachments.forEach((attachment) => {
                        if (attachment.url) {
                            payload.append("message[attachment_urls][]", attachment.url);
                        }
                    });
                }

                return dispatch(sendMessage({ baseUrl, token, data: payload })).unwrap();
            });

            await Promise.all(forwardPromises);

            toast.success(`Message forwarded to ${selectedForwardTargets.length} ${selectedForwardTargets.length === 1 ? 'chat' : 'chats'}`);
            setShowForwardDialog(false);
            setMessageToForward(null);
            setSelectedForwardTargets([]);
        } catch (error) {
            console.log(error);
            toast.error("Failed to forward message");
        }
    };

    const findParentMessage = (parentId) => {
        return messages.find(msg => msg.id === parentId);
    };

    const filterConversations = (list, query) => {
        if (!query.trim()) return list || [];
        return (list || []).filter(item => {
            const name = item.name || item.receiver_name || item.sender_name || "";
            return name.toLowerCase().includes(query.toLowerCase());
        });
    };

    const renderMessageWithMentions = (text) => {
        if (!text) return null;

        const mentionColors = [
            { bg: "bg-blue-100", text: "text-blue-700", hover: "hover:bg-blue-200" },
            {
                bg: "bg-green-100",
                text: "text-green-700",
                hover: "hover:bg-green-200",
            },
            {
                bg: "bg-purple-100",
                text: "text-purple-700",
                hover: "hover:bg-purple-200",
            },
            { bg: "bg-pink-100", text: "text-pink-700", hover: "hover:bg-pink-200" },
            {
                bg: "bg-orange-100",
                text: "text-orange-700",
                hover: "hover:bg-orange-200",
            },
            { bg: "bg-teal-100", text: "text-teal-700", hover: "hover:bg-teal-200" },
            {
                bg: "bg-indigo-100",
                text: "text-indigo-700",
                hover: "hover:bg-indigo-200",
            },
        ];

        // Combined regex to match mentions and URLs
        const mentionRegex = /@\*\*([^*]+)\*\*|@(\w+(?:\s+\w+)?)/g;
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

        // Split text by both mentions and URLs
        const parts = [];
        let lastIndex = 0;
        let match;
        let mentionIndex = 0;

        // First pass: collect all matches with their positions
        const allMatches = [];

        // Collect mention matches
        while ((match = mentionRegex.exec(text)) !== null) {
            allMatches.push({
                type: 'mention',
                index: match.index,
                length: match[0].length,
                username: match[1] || match[2],
                colorIndex: mentionIndex % mentionColors.length
            });
            mentionIndex++;
        }

        // Collect URL matches
        const urlMatches = [];
        while ((match = urlRegex.exec(text)) !== null) {
            urlMatches.push({
                type: 'url',
                index: match.index,
                length: match[0].length,
                url: match[0]
            });
        }

        allMatches.push(...urlMatches);

        // Sort by index
        allMatches.sort((a, b) => a.index - b.index);

        // Build parts array
        lastIndex = 0;
        allMatches.forEach((match) => {
            if (match.index > lastIndex) {
                parts.push({
                    type: "text",
                    content: text.substring(lastIndex, match.index),
                });
            }

            if (match.type === 'mention') {
                parts.push({
                    type: "mention",
                    content: `@${match.username}`,
                    username: match.username,
                    colorIndex: match.colorIndex,
                });
            } else if (match.type === 'url') {
                parts.push({
                    type: "url",
                    content: match.url,
                    href: match.url.startsWith('http') ? match.url : `https://${match.url}`
                });
            }

            lastIndex = match.index + match.length;
        });

        if (lastIndex < text.length) {
            parts.push({
                type: "text",
                content: text.substring(lastIndex),
            });
        }

        if (parts.length === 0) {
            return <span className="whitespace-pre-line break-words">{text}</span>;
        }

        return (
            <span className="whitespace-pre-line break-words">
                {parts.map((part, index) => {
                    if (part.type === "mention") {
                        const color = mentionColors[part.colorIndex];
                        return (
                            <span
                                key={index}
                                className={`${color.bg} ${color.text} px-1 rounded font-medium cursor-pointer transition-colors`}
                                title={`Mentioned: ${part.username}`}
                            >
                                {part.content}
                            </span>
                        );
                    }
                    if (part.type === "url") {
                        return (
                            <a
                                key={index}
                                href={part.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#C72030] hover:text-[#a01828] underline font-medium transition-colors"
                                title={`Open link: ${part.href}`}
                            >
                                {part.content}
                            </a>
                        );
                    }
                    return <span key={index}>{part.content}</span>;
                })}
            </span>
        );
    };

    const renderAttachments = (attachments) => {
        if (!attachments || attachments.length === 0) return null;

        const imageFiles = attachments.filter((a) =>
            a?.content_type?.startsWith("image/")
        );
        const otherFiles = attachments.filter(
            (a) => !a?.content_type?.startsWith("image/")
        );

        return (
            <div className="mt-2 space-y-2">
                {imageFiles.length > 0 && (
                    <div
                        className={`grid gap-2 ${imageFiles.length === 1
                            ? "grid-cols-1"
                            : "grid-cols-2"
                            }`}
                    >
                        {imageFiles.slice(0, 4).map((file, i) => {
                            const url = file?.url || file;
                            const name = file?.filename || url?.split("/").pop();
                            const extraCount =
                                imageFiles.length > 4 ? imageFiles.length - 4 : 0;

                            return (
                                <div
                                    key={i}
                                    className="relative group overflow-hidden rounded-lg shadow-sm border border-gray-200"
                                >
                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={url}
                                            alt={name}
                                            className="object-cover w-full h-32 transition-transform duration-200"
                                        />
                                        {i === 3 && extraCount > 0 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium text-lg">
                                                +{extraCount} more
                                            </div>
                                        )}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}

                {otherFiles.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {otherFiles.map((file, i) => {
                            const url = file?.url || file;
                            const name = file?.filename || url?.split("/").pop();

                            return (
                                <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 border border-gray-200 transition"
                                >
                                    <FileText className="w-4 h-4 text-gray-600" />
                                    <span className="truncate max-w-[150px]">{name}</span>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderReplyPreview = (parentMessage, isMe) => {
        if (!parentMessage) return null;

        return (
            <div
                onClick={() => scrollToMessage(parentMessage.id)}
                className={`mb-2 border-l-4 ${isMe 
                    ? 'border-white/40 bg-white/10 hover:bg-white/20' 
                    : 'border-[#C72030] bg-red-50 hover:bg-red-100'
                } rounded p-2 cursor-pointer transition-colors duration-200`}
            >
                <div className={`text-xs font-semibold mb-1 ${isMe ? 'text-white' : 'text-gray-700'}`}>
                    {parentMessage.user_name}
                </div>
                <div className={`text-xs truncate ${isMe ? 'text-white/80' : 'text-gray-600'}`}>
                    {parentMessage.body || "Attachment"}
                </div>
            </div>
        );
    };

    const filteredConversations = filterConversations(conversations, searchQuery);
    const filteredGroups = filterConversations(groups, searchQuery);

    return (
        <div className="flex flex-col h-full">
            <style>{`
                .highlight-message {
                    animation: highlightPulse 2s ease-in-out;
                }
                
                @keyframes highlightPulse {
                    0%, 100% { background-color: transparent; }
                    50% { background-color: rgba(199, 32, 48, 0.1); }
                }
            `}</style>

            <PinnedMessagesHeader
                messages={messages}
                onUnpin={handlePin}
                onMessageClick={(message) => scrollToMessage(message.id)}
            />

            <div className="flex-1 w-full bg-gray-50 overflow-y-auto overflow-x-hidden px-2 py-1 space-y-1">
                {[...messages].reverse().map((message) => {
                    const isMe = message?.user_id?.toString() === currentUserId;
                    const parentMessage = message.parent_id ? findParentMessage(message.parent_id) : null;
                    const isActionMenuOpen = showActionMenu === message.id;

                    return (
                        <div
                            key={message.id}
                            ref={(el) => messageRefs.current[message.id] = el}
                            className={`mb-6 flex flex-col transition-colors duration-300 ${isMe ? "items-end" : "items-start"}`}
                            onTouchStart={() => handleTouchStart(message)}
                            onTouchEnd={handleTouchEnd}
                        >
                            {!isMe && (
                                <div className="text-[10px] text-gray-500 mb-1 ml-10">
                                    <span className="mr-2 font-medium">
                                        {message.user_name || message.user?.firstname || 'Unknown User'}
                                    </span>
                                    {message.created_at && format(message.created_at, "dd MMM yyyy, hh:mm a")}
                                </div>
                            )}

                            <div className={`flex items-start space-x-2 cursor-pointer relative ${isMe ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                                {!isMe && (
                                    <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-xs flex items-center justify-center mt-[2px] cursor-pointer font-semibold shadow-sm">
                                        {(message.user_name || message.user?.firstname || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                                
                                <div className={`rounded-2xl px-3 py-2 text-sm shadow-sm max-w-[280px] relative ${isMe 
                                    ? "bg-[#C72030] text-white" 
                                    : "bg-white text-gray-900 border border-gray-100"}`}>
                                    
                                    {isMe && (
                                        <div className="text-[10px] text-white/70 mb-1 flex justify-between items-center gap-4">
                                            <span>{message.created_at && format(message.created_at, "hh:mm a")}</span>
                                        </div>
                                    )}

                                    {message.is_pinned && (
                                        <div className={`absolute -top-1.5 -right-1.5 rounded-full p-0.5 shadow-sm ${isMe ? 'bg-white' : 'bg-[#C72030]'}`}>
                                            <Pin className={`w-2.5 h-2.5 ${isMe ? 'text-[#C72030]' : 'text-white'} fill-current`} />
                                        </div>
                                    )}
                                    {message.is_forwarded && (
                                        <div className={`flex items-center gap-1 text-[10px] mb-1 italic ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                                            <CornerDownRight className="w-2.5 h-2.5" />
                                            <span>Forwarded</span>
                                        </div>
                                    )}
                                    {parentMessage && renderReplyPreview(parentMessage, isMe)}
                                    {renderAttachments(message.attachments)}
                                    {message.body && (
                                        <div className={`${message.attachments?.length > 0 || parentMessage ? "mt-1.5" : ""}`}>
                                            {renderMessageWithMentions(message.body)}
                                        </div>
                                    )}
                                    {isActionMenuOpen && (
                                        <div className="absolute top-0 right-0 p-1">
                                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
                                        </div>
                                    )}
                                </div>

                                {isMe && (
                                    <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-xs flex items-center justify-center mt-[2px] font-semibold shadow-sm">
                                        {(message.user_name || "U")[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Premium Mobile Action Sheet */}
            {showActionMenu && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
                    onClick={() => setShowActionMenu(null)}
                >
                    <div 
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
                        <h3 className="text-sm font-semibold text-gray-900 px-2">Message Actions</h3>
                        
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => handleReply(messages.find(m => m.id === showActionMenu))}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors active:bg-gray-100"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Reply className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium">Reply</span>
                            </button>
                            
                            <button
                                onClick={() => handleForward(messages.find(m => m.id === showActionMenu))}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors active:bg-gray-100"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                    <Forward className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-medium">Forward</span>
                            </button>
                            
                            <button
                                onClick={() => handlePin(messages.find(m => m.id === showActionMenu))}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors active:bg-gray-100"
                            >
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                    {messages.find(m => m.id === showActionMenu)?.is_pinned ? (
                                        <PinOff className="w-4 h-4 text-orange-600" />
                                    ) : (
                                        <Pin className="w-4 h-4 text-orange-600" />
                                    )}
                                </div>
                                <span className="font-medium">
                                    {messages.find(m => m.id === showActionMenu)?.is_pinned ? "Unpin Message" : "Pin Message"}
                                </span>
                            </button>
                            
                            <button
                                onClick={() => {
                                    setSelectedMessage(messages.find(m => m.id === showActionMenu));
                                    setShowActionMenu(null);
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors active:bg-gray-100"
                            >
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                                    <ClipboardPlus className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="font-medium">Create Task</span>
                            </button>

                            <button
                                onClick={() => setShowActionMenu(null)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors active:bg-red-100 mt-2"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                                    <X className="w-4 h-4 text-red-600" />
                                </div>
                                <span className="font-medium">Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Forward Dialog */}
            <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
                <DialogContent className="sm:max-w-sm max-h-96">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Forward Message</DialogTitle>
                        <DialogDescription>Select chats to forward to</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 max-h-64">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 text-sm"
                            />
                        </div>

                        <Tabs defaultValue="conversations" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-8 text-xs">
                                <TabsTrigger value="conversations" className="text-xs">Chats</TabsTrigger>
                                <TabsTrigger value="groups" className="text-xs">Groups</TabsTrigger>
                            </TabsList>

                            <TabsContent value="conversations" className="mt-3">
                                <ScrollArea className="h-48 pr-3">
                                    {filteredConversations && filteredConversations.length > 0 ? (
                                        <div className="space-y-1">
                                            {filteredConversations.map((conv) => {
                                                const displayName = conv.receiver_name || conv.sender_name || "Unknown";
                                                const targetId = `conversation-${conv.id}`;
                                                const isSelected = selectedForwardTargets.some(t => t.id === targetId);

                                                return (
                                                    <div
                                                        key={conv.id}
                                                        onClick={() => toggleForwardTarget(conv, "conversation")}
                                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm ${isSelected
                                                            ? "bg-[#C72030] text-white"
                                                            : "hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${isSelected
                                                            ? "bg-white text-[#C72030]"
                                                            : "bg-gray-200 text-gray-600"
                                                            }`}>
                                                            {displayName[0]?.toUpperCase()}
                                                        </div>
                                                        <span className="truncate">{displayName}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500 text-sm">No chats</div>
                                    )}
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="groups" className="mt-3">
                                <ScrollArea className="h-48 pr-3">
                                    {filteredGroups && filteredGroups.length > 0 ? (
                                        <div className="space-y-1">
                                            {filteredGroups.map((group) => {
                                                const targetId = `group-${group.id}`;
                                                const isSelected = selectedForwardTargets.some(t => t.id === targetId);

                                                return (
                                                    <div
                                                        key={group.id}
                                                        onClick={() => toggleForwardTarget(group, "group")}
                                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm ${isSelected
                                                            ? "bg-[#C72030] text-white"
                                                            : "hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${isSelected
                                                            ? "bg-white text-[#C72030]"
                                                            : "bg-gray-200 text-gray-600"
                                                            }`}>
                                                            {group.name?.[0]?.toUpperCase() || "G"}
                                                        </div>
                                                        <span className="truncate">{group.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500 text-sm">No groups</div>
                                    )}
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>

                        {selectedForwardTargets.length > 0 && (
                            <div className="text-xs text-gray-600 text-center">
                                {selectedForwardTargets.length} selected
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setShowForwardDialog(false)} size="sm">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendForward}
                            disabled={selectedForwardTargets.length === 0}
                            className="bg-[#C72030] hover:bg-[#a01828]"
                            size="sm"
                        >
                            Forward
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Task Dialog */}
            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                        <DialogDescription>Create a task from this message?</DialogDescription>
                    </DialogHeader>
                    <div className="p-2 bg-gray-50 rounded-md text-xs text-gray-700 max-h-24 overflow-y-auto">
                        {selectedMessage?.body}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setSelectedMessage(null)} size="sm">
                            No
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenTaskModal(true);
                            }}
                            size="sm"
                        >
                            Yes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CreateChatTask
                openTaskModal={openTaskModal}
                setOpenTaskModal={setOpenTaskModal}
                onCreateTask={handleCreateTask}
                message={selectedMessage}
                id={id}
            />
        </div>
    );
};

export default MobileChats;
