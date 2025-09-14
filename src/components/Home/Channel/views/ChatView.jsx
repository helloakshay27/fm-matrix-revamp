import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createMessage,
    fetchMessagesOfConversation,
    resetSendMessage,
} from "../../../../redux/slices/channelSlice";
import { useWebSocket } from "../../../../hooks/useWebSocket";
import toast from "react-hot-toast";

const ChatView = ({ type, id }) => {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const dispatch = useDispatch();
    const bottomRef = useRef(null);
    const { success } = useSelector((state) => state.createMessage);

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const chatContainerRef = useRef(null);
    const isUserInitiatedScroll = useRef(false);

    const { manager: webSocketManager } = useWebSocket();

    useEffect(() => {
        if (bottomRef.current && !isUserInitiatedScroll.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            const container = chatContainerRef.current;
            const prevScrollHeight = container?.scrollHeight ?? 0;
            const prevScrollTop = container?.scrollTop ?? 0;

            try {
                const { messages: fetchedMessages, meta } = await dispatch(
                    fetchMessagesOfConversation({ token, id, page })
                ).unwrap();

                setMessages((prevMessages) => {
                    const existingIds = new Set(prevMessages.map((msg) => msg.id));
                    const newMessages = fetchedMessages.filter((msg) => !existingIds.has(msg.id));
                    return [...prevMessages, ...newMessages];
                });

                setHasMore(meta.next_page !== null);

                setTimeout(() => {
                    if (container) {
                        const newScrollHeight = container.scrollHeight;
                        const scrollDiff = newScrollHeight - prevScrollHeight;
                        container.scrollTop = prevScrollTop + scrollDiff;
                    }
                }, 0);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        if (page && token && id) {
            fetchMessages();
        }
    }, [page, token, id, dispatch]);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (container.scrollTop === 0 && hasMore) {
                isUserInitiatedScroll.current = true;
                setPage((prev) => prev + 1);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [hasMore]);

    useEffect(() => {
        if (type === "chat") {
            webSocketManager.subscribeToConversation(id, {
                onNewMessage: (message) => {
                    console.log("📩 Chat message received:", message);
                    setMessages((prev) => [...prev, message]);
                    isUserInitiatedScroll.current = false;
                },
            });
        } else if (type === "group") {
            webSocketManager.subscribeToProjectSpace(id, {
                onNewMessage: (message) => {
                    console.log("📩 Group message received:", message);
                    setMessages((prev) => [...prev, message]);
                    isUserInitiatedScroll.current = false;
                },
            });
        }
    }, [type, id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const payload = {
            body: input,
            project_space_id: type === "group" ? id : null,
            conversation_id: type === "chat" ? id : null,
        };

        try {
            const response = await dispatch(
                createMessage({ token, payload })
            ).unwrap();

            setMessages((prev) => [response, ...prev]);
            setInput("");
            dispatch(resetSendMessage());
            isUserInitiatedScroll.current = false;
        } catch (err) {
            console.error("Failed to send message:", err);
            toast.dismiss();
            toast.error("Internal server error");
        }
    };

    useEffect(() => {
        if (success) {
            setInput("");
            dispatch(resetSendMessage());
        }
    }, [success]);

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return `${date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        })}, ${date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            <div
                ref={chatContainerRef}
                className="flex-1 w-full bg-[#F9F9F9] px-6 py-4 overflow-y-auto max-h-[calc(100vh-160px)]"
            >
                {[...messages].reverse().map((message, index) => (
                    <div
                        key={index}
                        className={`mb-6 flex flex-col ${message.user_id === currentUser.id ? "items-end" : "items-start"}`}
                    >
                        <div
                            className={`text-xs text-gray-500 mb-2 ${message.user_id === currentUser.id ? "mr-14" : "ml-14"}`}
                        >
                            {formatTimestamp(message.created_at)}
                        </div>
                        <div className="flex items-start space-x-3">
                            {message.user_id !== currentUser.id && (
                                <div className="w-8 h-8 rounded-full bg-[#5986FF] text-white text-sm flex items-center justify-center">
                                    {(message.user_name || "U")[0].toUpperCase()}
                                </div>
                            )}
                            <div className="bg-white rounded-2xl px-4 py-2 text-sm shadow max-w-xs">
                                {message.body}
                            </div>
                            {message.user_id === currentUser.id && (
                                <div className="w-8 h-8 rounded-full bg-[#5986FF] text-white text-sm flex items-center justify-center">
                                    {(message.user_name || "U")[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} className="h-0" />
            </div>

            <div className="w-[800px] mx-auto bg-white px-6 py-6 flex items-center space-x-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Type here and hit enter"
                        className="w-full bg-[#F9F9F9] rounded-full px-4 py-4 pr-10 text-sm focus:outline-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage(e);
                        }}
                    />
                </div>
                <button
                    type="button"
                    className="text-gray-500 text-xl"
                    onClick={sendMessage}
                >
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                        <path
                            d="M4.25 28.3332V19.8332L15.5833 16.9998L4.25 14.1665V5.6665L31.1667 16.9998L4.25 28.3332Z"
                            fill="black"
                            fillOpacity="0.2"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatView;