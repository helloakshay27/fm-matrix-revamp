import { format } from "date-fns";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { ClipboardPlus, FileText, X, Reply, Forward, Search, Users, MessageCircle, CornerDownRight, Pin, PinOff, ChevronDown } from "lucide-react";
import CreateChatTask from "./CreateChatTask";
import PinnedMessagesHeader from "./PinnedMessagesHeader";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createChatTask, sendMessage, updateMessage } from "@/store/slices/channelSlice";
import { useLocation, useParams } from "react-router-dom";

// initialUnreadCount (optional): how many of the newest messages were unread when the
// chat was opened (e.g. from the API). When not given, the last-read position this
// browser remembered for the chat is used instead.
const Chats = ({ messages, onReply, bottomRef, fetchMessages, initialUnreadCount = 0 }: any) => {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const currentUserId = localStorage.getItem("userId");
    const messageRefs = useRef({});

    const { data: conversations } = useAppSelector(state => state.fetchConversations)
    const { data: groups } = useAppSelector(state => state.fetchGroups)

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
    const [showActions, setShowActions] = useState(false);
    const [showForwardDialog, setShowForwardDialog] = useState(false);
    const [messageToForward, setMessageToForward] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedForwardTargets, setSelectedForwardTargets] = useState([]);
    const hoverTimeoutRef = useRef(null);

    // ---- Scroll position, unread divider and "scroll to bottom" button ----
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const unreadDividerRef = useRef<HTMLDivElement | null>(null);
    // Ids of the messages from the previous render, used to tell a freshly
    // opened chat apart from new messages arriving in the same chat.
    const prevMessageIdsRef = useRef<Set<any>>(new Set());
    const isAtBottomRef = useRef(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    // Id of the first unread message (the divider is drawn above it)
    const [unreadBoundaryId, setUnreadBoundaryId] = useState<any>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const AT_BOTTOM_THRESHOLD = 80;

    const updateIsAtBottom = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= AT_BOTTOM_THRESHOLD;
        isAtBottomRef.current = atBottom;
        setIsAtBottom(atBottom);
    };

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        const el = scrollContainerRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior });
    };

    // ---- Last-read position, remembered per user + chat in this browser ----
    const chatType = /\/groups\//.test(location.pathname) ? "group" : "dm";
    const lastReadKey = `chat-last-read:${currentUserId}:${chatType}:${id}`;
    const readLastRead = (): string | null => {
        try {
            return localStorage.getItem(lastReadKey);
        } catch {
            return null;
        }
    };
    const saveLastRead = (messageId: any) => {
        try {
            localStorage.setItem(lastReadKey, String(messageId));
        } catch {
            /* storage unavailable - nothing to remember */
        }
    };
    // Guards against saving another chat's messages while the new chat is still loading
    const belongsToThisChat = (m: any) => {
        const chatId = chatType === "group" ? m?.project_space_id : m?.conversation_id;
        return chatId === undefined || chatId === null || String(chatId) === String(id);
    };
    // Set while a freshly opened chat still has to scroll to its last-read message
    const pendingLandingRef = useRef<{ messageId: any } | null>(null);

    useLayoutEffect(() => {
        const list = messages || [];
        if (list.length === 0) return;
        const prevIds = prevMessageIdsRef.current;
        const isFreshChat = prevIds.size === 0 || !list.some((m) => prevIds.has(m.id));
        prevMessageIdsRef.current = new Set(list.map((m) => m.id));

        if (isFreshChat) {
            // list is newest-first
            let boundary = null; // first unread message (divider goes above it)
            let count = 0;
            let landOnId = null; // last read message to scroll to

            if (initialUnreadCount > 0) {
                count = Math.min(initialUnreadCount, list.length);
                boundary = list[count - 1]?.id;
                landOnId = list[count]?.id ?? null;
            } else {
                const lastReadId = readLastRead();
                if (lastReadId) {
                    const idx = list.findIndex((m) => String(m.id) === lastReadId);
                    // Not in the loaded page => it is older than everything loaded, so all of it is new
                    const newer = idx === -1 ? list : list.slice(0, idx);
                    const unreadFromOthers = newer.filter((m) => m?.user_id?.toString() !== currentUserId);
                    if (unreadFromOthers.length > 0) {
                        boundary = newer[newer.length - 1].id;
                        count = unreadFromOthers.length;
                        landOnId = idx === -1 ? null : list[idx].id;
                    }
                }
            }

            setUnreadBoundaryId(boundary);
            setUnreadCount(count);
            // Reset scroll state left over from a previously open chat
            isAtBottomRef.current = true;
            setIsAtBottom(true);
            if (boundary) {
                pendingLandingRef.current = { messageId: landOnId };
            } else {
                pendingLandingRef.current = null;
                scrollToBottom("auto");
            }
            return;
        }

        const newMessages = list.filter((m) => !prevIds.has(m.id)); // newest-first
        if (newMessages.length === 0) return; // edits, pins, refetches - don't move

        const sentByMe = newMessages.some((m) => m?.user_id?.toString() === currentUserId);
        if (sentByMe) {
            // Sending a message always takes you to the bottom and clears unread state
            setUnreadBoundaryId(null);
            setUnreadCount(0);
            scrollToBottom("smooth");
            return;
        }

        if (isAtBottomRef.current) {
            scrollToBottom("smooth");
            return;
        }

        // Scrolled up reading older messages: don't yank the user, count them as unread
        setUnreadCount((c) => c + newMessages.length);
        setUnreadBoundaryId((b) => b ?? newMessages[newMessages.length - 1].id);
    }, [messages]);

    // Freshly opened chat with unread messages: land on the last read message
    // (just above the divider), or on the divider if the last read one isn't loaded.
    useLayoutEffect(() => {
        const pending = pendingLandingRef.current;
        if (!pending || !unreadBoundaryId) return;
        pendingLandingRef.current = null;
        const container = scrollContainerRef.current;
        const target = (pending.messageId != null && messageRefs.current[pending.messageId]) || unreadDividerRef.current;
        if (!container || !target) return;
        container.scrollTop = target.offsetTop - container.offsetTop - 16;
        updateIsAtBottom();
        // Everything fits on screen - the unread messages are already visible
        if (isAtBottomRef.current && messages?.[0]) saveLastRead(messages[0].id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unreadBoundaryId]);

    // While the user is at the bottom, the newest message counts as read
    useEffect(() => {
        if (pendingLandingRef.current || !isAtBottom) return;
        const newest = messages?.[0];
        if (newest && belongsToThisChat(newest)) saveLastRead(newest.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAtBottom, messages, lastReadKey]);

    // Once the user has reached the bottom, the unread messages are read:
    // clear the count right away and remove the divider shortly after.
    useEffect(() => {
        if (!isAtBottom) return;
        if (unreadCount) setUnreadCount(0);
        if (!unreadBoundaryId) return;
        const t = setTimeout(() => setUnreadBoundaryId(null), 2000);
        return () => clearTimeout(t);
    }, [isAtBottom, unreadBoundaryId]);

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = (index) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        setHoveredMessageIndex(index);

        hoverTimeoutRef.current = setTimeout(() => {
            setShowActions(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        setShowActions(false);
        setHoveredMessageIndex(null);
    };

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
    };

    const handleForward = (message) => {
        setMessageToForward(message);
        setShowForwardDialog(true);
        setSelectedForwardTargets([]);
        setSearchQuery("");
    };

    const handlePin = async (message) => {
        try {
            if (message.is_pinned) {
                await dispatch(
                    updateMessage({ baseUrl, token, id: message.id, data: { message: { is_pinned: false } } })
                ).unwrap();
                fetchMessages();
                toast.success("Message unpinned");
            } else {
                await dispatch(
                    updateMessage({ baseUrl, token, id: message.id, data: { message: { is_pinned: true } } })
                ).unwrap();
                fetchMessages();
                toast.success("Message pinned");
            }
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
                                className={`${color.bg} ${color.text} ${color.hover} px-1 rounded font-medium cursor-pointer transition-colors`}
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
                            : imageFiles.length === 2
                                ? "grid-cols-2"
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
                                            className="object-cover w-full h-32 sm:h-40 transition-transform duration-200 group-hover:scale-105"
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
                className={`mb-2 border-l-4 ${isMe ? 'border-gray-400 bg-gray-50 hover:bg-gray-100' : 'border-[#C72030] bg-red-50 hover:bg-red-100'} rounded p-2 cursor-pointer transition-colors duration-200`}
            >
                <div className="text-xs font-semibold text-gray-700 mb-1">
                    {parentMessage.user_name}
                </div>
                <div className="text-xs text-gray-600 truncate">
                    {parentMessage.body || "Attachment"}
                </div>
            </div>
        );
    };

    const filteredConversations = filterConversations(conversations, searchQuery);
    const filteredGroups = filterConversations(groups, searchQuery);

    return (
        <TooltipProvider>
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

                <div className="relative flex-1 min-h-0 flex flex-col">
                <div
                    ref={scrollContainerRef}
                    onScroll={updateIsAtBottom}
                    className="flex-1 w-full bg-[#F9F9F9] overflow-y-auto max-h-[calc(100vh-160px)] px-6 py-2.5"
                >
                    {[...messages].reverse().map((message, index) => {
                        const isMe = message?.user_id?.toString() === currentUserId;
                        const shouldShowActions = hoveredMessageIndex === index && showActions;
                        const parentMessage = message.parent_id ? findParentMessage(message.parent_id) : null;

                        return (
                            <Fragment key={index}>
                            {message.id === unreadBoundaryId && (
                                <div ref={unreadDividerRef} className="flex items-center gap-3 my-4">
                                    <div className="flex-1 h-px bg-gray-300" />
                                    <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm">
                                        Unread messages
                                    </span>
                                    <div className="flex-1 h-px bg-gray-300" />
                                </div>
                            )}
                            <div
                                ref={(el) => messageRefs.current[message.id] = el}
                                className={`mb-6 flex flex-col transition-colors duration-300 ${isMe ? "items-end" : "items-start"
                                    }`}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div
                                    className={`text-xs text-gray-500 mb-2 ${isMe ? "mr-12" : "ml-16"
                                        }`}
                                >
                                    {!isMe && <span className="mr-2">
                                        {message.user_name || message.user?.firstname || 'Unknown User'}
                                    </span>}
                                    {message.created_at &&
                                        format(message.created_at, "dd MMM yyyy, hh:mm a")}
                                </div>

                                <ContextMenu>
                                    <ContextMenuTrigger asChild>
                                        <div className="flex items-start space-x-3 cursor-pointer relative">
                                            <div
                                                className={`absolute top-1/2 -translate-y-1/2 flex gap-1 z-10 transition-all duration-300 ease-out ${isMe ? "left-[-65px]" : "right-[-75px]"
                                                    } ${shouldShowActions
                                                        ? "opacity-100 scale-100"
                                                        : "opacity-0 scale-90 pointer-events-none"
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => handleReply(message)}
                                                    className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                                                    title="Reply"
                                                >
                                                    <Reply className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleForward(message)}
                                                    className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                                                    title="Forward"
                                                >
                                                    <Forward className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>

                                            {!isMe && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-sm flex items-center justify-center mt-[2px] cursor-pointer">
                                                            {(message.user_name || message.user?.firstname || 'U')[0].toUpperCase()}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{message.user_name || message.user?.firstname || 'Unknown User'}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            <div
                                                className={`rounded-2xl px-4 py-2 text-sm shadow max-w-xs bg-white relative`}
                                            >
                                                {message.is_pinned && (
                                                    <div className="absolute -top-2 -right-2 bg-[#C72030] rounded-full p-1">
                                                        <Pin className="w-3 h-3 text-white fill-white" />
                                                    </div>
                                                )}
                                                {message.is_forwarded && (
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1 italic">
                                                        <CornerDownRight className="w-3 h-3" />
                                                        <span>Forwarded</span>
                                                    </div>
                                                )}
                                                {parentMessage && renderReplyPreview(parentMessage, isMe)}
                                                {renderAttachments(message.attachments)}
                                                {message.body && (
                                                    <div
                                                        className={`${message.attachments?.length > 0 || parentMessage ? "mt-2" : ""
                                                            }`}
                                                    >
                                                        {renderMessageWithMentions(message.body)}
                                                    </div>
                                                )}
                                            </div>
                                            {isMe && (
                                                <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-sm flex items-center justify-center mt-[2px]">
                                                    {(message.user_name || "U")[0].toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </ContextMenuTrigger>

                                    <ContextMenuContent className="w-48 rounded-lg p-1 shadow-lg">
                                        <ContextMenuItem
                                            onClick={() => handleReply(message)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                        >
                                            <Reply className="w-4 h-4 text-gray-600" />
                                            <span>Reply</span>
                                        </ContextMenuItem>

                                        <ContextMenuItem
                                            onClick={() => handleForward(message)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                        >
                                            <Forward className="w-4 h-4 text-gray-600" />
                                            <span>Forward</span>
                                        </ContextMenuItem>

                                        <ContextMenuItem
                                            onClick={() => handlePin(message)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                        >
                                            {message.is_pinned ? (
                                                <>
                                                    <PinOff className="w-4 h-4 text-gray-600" />
                                                    <span>Unpin Message</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Pin className="w-4 h-4 text-gray-600" />
                                                    <span>Pin Message</span>
                                                </>
                                            )}
                                        </ContextMenuItem>

                                        <ContextMenuItem
                                            onClick={() => setSelectedMessage(message)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                        >
                                            <ClipboardPlus className="w-4 h-4 text-gray-600" />
                                            <span>Create Task</span>
                                        </ContextMenuItem>

                                        <ContextMenuSeparator />

                                        <ContextMenuItem
                                            inset
                                            onClick={() => { }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                        >
                                            <X className="w-4 h-4 text-gray-600" />
                                            <span>Cancel</span>
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            </div>
                            </Fragment>
                        );
                    })}

                    <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Forward Message</DialogTitle>
                                <DialogDescription>
                                    Select conversations or groups to forward this message to
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search conversations or groups..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                <Tabs defaultValue="conversations" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="conversations" className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                            Conversations
                                        </TabsTrigger>
                                        <TabsTrigger value="groups" className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Groups
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="conversations" className="mt-4">
                                        <ScrollArea className="h-[300px] pr-4">
                                            {filteredConversations && filteredConversations.length > 0 ? (
                                                <div className="space-y-2">
                                                    {filteredConversations.map((conv) => {
                                                        const displayName = conv.receiver_name || conv.sender_name || "Unknown";
                                                        const targetId = `conversation-${conv.id}`;
                                                        const isSelected = selectedForwardTargets.some(t => t.id === targetId);

                                                        return (
                                                            <div
                                                                key={conv.id}
                                                                onClick={() => toggleForwardTarget(conv, "conversation")}
                                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                                                                    ? "bg-[#C72030] text-white"
                                                                    : "hover:bg-gray-100"
                                                                    }`}
                                                            >
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isSelected
                                                                    ? "bg-white text-[#C72030]"
                                                                    : "bg-[#F2EEE9] text-[#C72030]"
                                                                    }`}>
                                                                    {displayName[0]?.toUpperCase()}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium truncate">{displayName}</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No conversations found
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>

                                    <TabsContent value="groups" className="mt-4">
                                        <ScrollArea className="h-[300px] pr-4">
                                            {filteredGroups && filteredGroups.length > 0 ? (
                                                <div className="space-y-2">
                                                    {filteredGroups.map((group) => {
                                                        const targetId = `group-${group.id}`;
                                                        const isSelected = selectedForwardTargets.some(t => t.id === targetId);

                                                        return (
                                                            <div
                                                                key={group.id}
                                                                onClick={() => toggleForwardTarget(group, "group")}
                                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                                                                    ? "bg-[#C72030] text-white"
                                                                    : "hover:bg-gray-100"
                                                                    }`}
                                                            >
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isSelected
                                                                    ? "bg-white text-[#C72030]"
                                                                    : "bg-[#F2EEE9] text-[#C72030]"
                                                                    }`}>
                                                                    {group.name?.[0]?.toUpperCase() || "G"}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium truncate">{group.name}</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No groups found
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>

                                {selectedForwardTargets.length > 0 && (
                                    <div className="text-sm text-gray-600">
                                        {selectedForwardTargets.length} {selectedForwardTargets.length === 1 ? 'chat' : 'chats'} selected
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowForwardDialog(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSendForward}
                                    disabled={selectedForwardTargets.length === 0}
                                    className="bg-[#C72030] hover:bg-[#a01828]"
                                >
                                    Forward
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Create Task Dialog */}
                    <Dialog
                        open={!!selectedMessage}
                        onOpenChange={() => setSelectedMessage(null)}
                    >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create a Task</DialogTitle>
                                <DialogDescription>
                                    Do you want to create a task for this message?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                                {selectedMessage?.body.slice(0, 100) + (selectedMessage?.body.length > 100 ? '...' : '')}
                            </div>
                            <DialogFooter className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                                    No
                                </Button>
                                <Button
                                    onClick={() => {
                                        setSelectedMessage(selectedMessage);
                                        setOpenTaskModal(true);
                                    }}
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

                    <div ref={bottomRef} className="h-0" />
                </div>

                {!isAtBottom && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => scrollToBottom("smooth")}
                        className="absolute bottom-4 right-6 h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 [&_svg]:text-current"
                        title="Scroll to latest message"
                        aria-label="Scroll to latest message"
                    >
                        <ChevronDown size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-brand text-white text-[11px] font-semibold flex items-center justify-center">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </Button>
                )}
                </div>
            </div>
        </TooltipProvider>
    );
};

export default Chats;