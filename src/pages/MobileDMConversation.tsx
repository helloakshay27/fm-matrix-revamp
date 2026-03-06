import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Paperclip, Smile, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { fetchConversation, fetchConversationMessages, sendMessage } from "@/store/slices/channelSlice";
import { useWebSocket } from "@/hooks/useWebSocket";
import { emojis } from "@/utils/emojies";
import MobileChats from "@/components/MobileChats";

const MobileDMConversation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = currentUser?.id || "";

    const paperclipRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const isUserInitiatedScroll = useRef(false);

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [conversation, setConversation] = useState({
        receiver_name: "",
        recipient_id: "",
        sender_name: "",
        sender_id: "",
    });

    const { manager: webSocketManager, connect } = useWebSocket();

    useEffect(() => {
        if (token) {
            connect(token, `wss://${baseUrl}/cable`);
        }

        return () => {
            webSocketManager.unsubscribeFromConversation(id);
        };
    }, [token, connect]);

    const fetchData = async () => {
        try {
            const response = await dispatch(fetchConversation({ baseUrl, token, id })).unwrap();
            setConversation(response);
        } catch (error) {
            toast.error("Failed to load conversation");
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await dispatch(
                fetchConversationMessages({ baseUrl, token, id, per_page: 50, page: 1, param: "conversation_id_eq" })
            ).unwrap();
            setMessages(response.messages);
        } catch (error) {
            toast.error("Failed to load messages");
        }
    };

    const markAsRead = async () => {
        try {
            await axios.post(`https://${baseUrl}/conversations/${id}/mark_as_read.json`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchMessages();
        markAsRead();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (messagesEndRef.current && !isUserInitiatedScroll.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setAttachments((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEmojiClick = (emoji) => {
        setInput((prev) => prev + emoji);
    };

    const handleReply = (message) => {
        setReplyingTo(message);
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    const sendMessages = async (e) => {
        e.preventDefault();
        if (!input.trim() && attachments.length === 0) return;

        const payload = new FormData();
        payload.append("message[body]", input);
        payload.append("message[conversation_id]", id);

        if (replyingTo) {
            payload.append("message[parent_id]", replyingTo.id);
        }

        attachments.forEach((attachment) => {
            payload.append("message[attachments][]", attachment);
        });

        try {
            const response = await dispatch(sendMessage({ baseUrl, token, data: payload })).unwrap();
            setMessages([response, ...messages]);
            setInput("");
            setAttachments([]);
            setReplyingTo(null);
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    useEffect(() => {
        const subscriptionTimer = setTimeout(() => {
            const sub = webSocketManager.subscribeToConversation(id, {
                onConnected: () => {
                    setIsSubscribed(true);
                },
                onNewMessage: (message) => {
                    if (message.user_id === currentUser.id && message.conversation_id !== id) {
                        return;
                    }
                    setMessages((prev) => {
                        const exists = prev.some((msg) => msg.id === message.id);
                        if (exists) return prev;
                        return [message, ...prev];
                    });
                    isUserInitiatedScroll.current = false;
                },
                onDisconnected: () => {
                    setIsSubscribed(false);
                },
            });

            return () => {
                if (sub && typeof sub.unsubscribe === "function") {
                    sub.unsubscribe();
                }
            };
        }, 500);

        return () => clearTimeout(subscriptionTimer);
    }, [id, currentUser.id]);

    const displayedName =
        currentUser?.id === conversation.sender_id
            ? conversation.receiver_name
            : conversation.sender_name;

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
                >
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <div className="flex-1">
                    <h1 className="font-semibold text-gray-900 text-base">{displayedName}</h1>
                    <p className="text-xs text-gray-500">
                        {isSubscribed ? (
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>Online
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>Offline
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Messages Area with MobileChats Component */}
            <div
                className="flex-1 overflow-y-auto"
                onScroll={() => {
                    isUserInitiatedScroll.current = true;
                }}
            >
                <MobileChats messages={messages} onReply={handleReply} bottomRef={messagesEndRef} />
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyingTo && (
                <div className="mx-3 mb-2 p-2 bg-gray-100 border-l-4 border-[#C72030] rounded flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700">
                            Replying to {replyingTo.user_name || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                            {replyingTo.body || "Attachment"}
                        </p>
                    </div>
                    <button
                        onClick={cancelReply}
                        className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="px-3 py-2 bg-gray-100 border-t border-gray-200 space-y-2">
                    <p className="text-xs font-medium text-gray-700">Attachments ({attachments.length})</p>
                    <div className="flex gap-2 flex-wrap">
                        {attachments.map((file, index) => (
                            <div key={index} className="relative">
                                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-600 truncate flex-col">
                                    <span>📄</span>
                                    <span className="text-xs mt-1">{file.name.substring(0, 8)}</span>
                                </div>
                                <button
                                    onClick={() => removeAttachment(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div
                    ref={emojiPickerRef}
                    className="max-h-48 overflow-y-auto bg-white border-t border-gray-200 p-3 grid grid-cols-6 gap-3"
                >
                    {emojis.map((emoji, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                handleEmojiClick(emoji);
                                setShowEmojiPicker(false);
                            }}
                            className="text-2xl hover:bg-gray-100 p-2 rounded transition-colors"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={sendMessages} className="border-t border-gray-200 bg-white p-3 space-y-3">
                <div className="flex items-end gap-2">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        title="Emoji"
                    >
                        <Smile size={20} className="text-gray-600" />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-sm"
                    />

                    <input
                        ref={paperclipRef}
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => paperclipRef.current?.click()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        title="Attach file"
                    >
                        <Paperclip size={20} className="text-gray-600" />
                    </button>

                    <button
                        type="submit"
                        disabled={!input.trim() && attachments.length === 0}
                        className="p-2 bg-[#C72030] hover:bg-red-700 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Send message"
                    >
                        <Send size={20} className="text-white" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MobileDMConversation;
