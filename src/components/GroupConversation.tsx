import Chats from "@/components/Chats";
import { useLayout } from "@/contexts/LayoutContext";
import { useAppDispatch } from "@/store/hooks";
import { fetchConversationMessages, fetchGroupConversation, removeUserFromGroup, sendMessage } from "@/store/slices/channelSlice";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ChatTasks from "./ChatTasks";
import { Paperclip, X, UserMinus, Smile } from "lucide-react";
import ChatAttachments from "./ChatAttachments";
import { emojis } from "@/utils/emojies";

const GroupConversation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isSidebarCollapsed } = useLayout();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const paperclipRef = useRef(null);
    const textareaRef = useRef(null);
    const mentionDropdownRef = useRef(null);
    const modalRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const bottomRef = useRef(null);

    const [activeTab, setActiveTab] = useState("chat");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [spaceUsers, setSpaceUsers] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [conversation, setConversation] = useState({
        name: "",
    });
    const [showGroupDetails, setShowGroupDetails] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [mentionSearch, setMentionSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [mentionStartPos, setMentionStartPos] = useState(0);
    const [mentions, setMentions] = useState([]);

    const fetchData = async () => {
        try {
            const response = await dispatch(
                fetchGroupConversation({ baseUrl, token, id })
            ).unwrap();
            setConversation(response);
            setSpaceUsers(response.project_space_users);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await dispatch(
                fetchConversationMessages({ baseUrl, token, id, per_page: 50, page: 1, param: "project_space_id_eq" })
            ).unwrap();
            setMessages(response.messages);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchMessages();
    }, [id]);

    useEffect(() => {
        if (activeTab === "chat") {
            const interval = setInterval(() => {
                fetchMessages();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [activeTab, id]);

    useEffect(() => {
        if (showMentionDropdown && mentionSearch !== null) {
            const filtered = spaceUsers.filter(user => {
                const name = user.user_name
                return name.toLowerCase().includes(mentionSearch.toLowerCase());
            });
            setFilteredUsers(filtered);
            setSelectedMentionIndex(0);
        }
    }, [mentionSearch, spaceUsers, showMentionDropdown]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mentionDropdownRef.current && !mentionDropdownRef.current.contains(event.target)) {
                setShowMentionDropdown(false);
            }
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowGroupDetails(false);
            }
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;

        setInput(value);
        setCursorPosition(cursorPos);

        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;

        const textBeforeCursor = value.substring(0, cursorPos);
        const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

        if (lastAtSymbol !== -1) {
            const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);

            if (textAfterAt.includes(' ')) {
                setShowMentionDropdown(false);
                setMentionSearch("");
            } else {
                const charBeforeAt = lastAtSymbol > 0 ? textBeforeCursor[lastAtSymbol - 1] : ' ';
                if (charBeforeAt === ' ' || lastAtSymbol === 0) {
                    setShowMentionDropdown(true);
                    setMentionSearch(textAfterAt);
                    setMentionStartPos(lastAtSymbol);
                } else {
                    setShowMentionDropdown(false);
                }
            }
        } else {
            setShowMentionDropdown(false);
            setMentionSearch("");
        }
    };

    const insertMention = (user) => {
        const userName = user.user_name
        const beforeMention = input.substring(0, mentionStartPos);
        const afterMention = input.substring(cursorPosition);
        const newInput = `${beforeMention}@${userName} ${afterMention}`;

        setInput(newInput);
        setShowMentionDropdown(false);
        setMentions([...mentions, { id: user.id, name: userName }]);

        setTimeout(() => {
            const newCursorPos = mentionStartPos + userName.length + 2;
            textareaRef.current.selectionStart = newCursorPos;
            textareaRef.current.selectionEnd = newCursorPos;
            textareaRef.current.focus();
        }, 0);
    };

    const handleReply = (message) => {
        setReplyingTo(message);
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    const handleKeyDown = (e) => {
        if (showMentionDropdown) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedMentionIndex((prev) =>
                    prev < filteredUsers.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedMentionIndex((prev) => prev > 0 ? prev - 1 : 0);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredUsers.length > 0) {
                    insertMention(filteredUsers[selectedMentionIndex]);
                }
            } else if (e.key === "Escape") {
                setShowMentionDropdown(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessages(e);
        }
    };

    const sendMessages = async (e) => {
        e.preventDefault();
        if (!input.trim() && attachments.length === 0) return;
        const payload = new FormData();
        payload.append("message[body]", input);
        payload.append("message[project_space_id]", id);

        // Add parent_id if replying to a message
        if (replyingTo) {
            payload.append("message[parent_id]", replyingTo.id);
        }

        mentions.forEach((mention) => {
            payload.append("message[mentioned_user_ids][]", mention.id);
        });

        attachments.forEach((attachment) => {
            payload.append("message[attachments][]", attachment);
        });

        try {
            const response = await dispatch(
                sendMessage({ baseUrl, token, data: payload })
            ).unwrap();
            setMessages([response, ...messages]);
            setInput("");
            setAttachments([]);
            setMentions([]);
            setReplyingTo(null);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setAttachments((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveMember = async (userId) => {
        try {
            await dispatch(
                removeUserFromGroup({ baseUrl, token, userId })
            ).unwrap();
            setShowGroupDetails(false);
            fetchData()
            toast.success("User removed from group");
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    };

    const handleEmojiClick = (emoji) => {
        setInput((prev) => prev + emoji);
    };

    return (
        <div
            className={`flex flex-col h-[calc(100vh-112px)] ${isSidebarCollapsed ? "w-[calc(100vw-20rem)]" : "w-[calc(100vw-32rem)]"
                } min-w-0 overflow-hidden`}
        >
            <div className="flex justify-between items-center px-6 py-4 border-b ">
                <div>
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-10 h-10 rounded-full bg-[#F2EEE9] flex items-center justify-center text-[#C72030] font-semibold cursor-pointer hover:bg-[#e8e0d7] transition-colors"
                            onClick={() => setShowGroupDetails(true)}
                        >
                            {conversation?.name?.[0]?.toUpperCase()}
                        </div>
                        <h2
                            className="text-lg font-medium text-black cursor-pointer hover:text-[#C72030] transition-colors"
                            onClick={() => setShowGroupDetails(true)}
                        >
                            {conversation?.name}
                        </h2>
                    </div>
                    <div className="flex space-x-6 mt-2 ml-1 text-sm font-medium text-gray-500">
                        <span
                            className={`cursor-pointer ${activeTab === "chat"
                                ? "text-black border-b-2 border-black pb-1"
                                : ""
                                }`}
                            onClick={() => setActiveTab("chat")}
                        >
                            Chat
                        </span>
                        <span
                            className={`cursor-pointer ${activeTab === "task"
                                ? "text-black border-b-2 border-black pb-1"
                                : ""
                                }`}
                            onClick={() => setActiveTab("task")}
                        >
                            Tasks
                        </span>
                        <span
                            className={`cursor-pointer ${activeTab === "attachments"
                                ? "text-black border-b-2 border-black pb-1"
                                : ""
                                }`}
                            onClick={() => setActiveTab("attachments")}
                        >
                            Attachments
                        </span>
                    </div>
                </div>

                <button className="text-sm flex items-center space-x-1" onClick={() => navigate('/vas/channels')}>
                    <span className="text-xl text-black">&larr;</span>
                    <span className="text-[#C72030]">Back</span>
                </button>
            </div>

            {/* Group Details Modal */}
            {showGroupDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-[#F2EEE9] flex items-center justify-center text-[#C72030] font-semibold text-lg">
                                    {conversation?.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-black">{conversation?.name}</h3>
                                    <p className="text-sm text-gray-500">{spaceUsers.length} members</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowGroupDetails(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Members List */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-gray-700">Members</h4>
                            </div>

                            <div className="space-y-2">
                                {spaceUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-[#F2EEE9] flex items-center justify-center text-[#C72030] font-semibold flex-shrink-0">
                                                {(user.user_name || "U")[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {user.user_name}
                                                </div>
                                                {user.email && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {user.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMember(user.id)}
                                            className="flex-shrink-0 ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove member"
                                        >
                                            <UserMinus size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t bg-gray-50">
                            <button
                                onClick={() => setShowGroupDetails(false)}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {activeTab === "chat" && id && <Chats messages={messages} onReply={handleReply} bottomRef={bottomRef} />}
                {activeTab === "task" && <ChatTasks />}
                {activeTab === "attachments" && <ChatAttachments />}
            </div>

            {activeTab === "chat" && (
                <div
                    className={`w-[calc(100vw-${isSidebarCollapsed ? "20rem" : "32rem"
                        })] mx-auto px-6 py-4 flex items-center space-x-2`}
                >
                    <div className="relative flex-1">
                        {showMentionDropdown && filteredUsers.length > 0 && (
                            <div
                                ref={mentionDropdownRef}
                                className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-50"
                            >
                                {filteredUsers.map((user, index) => (
                                    <div
                                        key={user.id}
                                        className={`px-4 py-2 cursor-pointer flex items-center space-x-3 ${index === selectedMentionIndex
                                            ? "bg-gray-100"
                                            : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => insertMention(user)}
                                        onMouseEnter={() => setSelectedMentionIndex(index)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#F2EEE9] flex items-center justify-center text-[#C72030] font-semibold text-sm">
                                            {(user.user_name || "U")[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {user.user_name}
                                            </div>
                                            {user.email && user.name && (
                                                <div className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-md p-3 flex flex-col">
                            {/* Reply Preview */}
                            {replyingTo && (
                                <div className="mb-2 bg-gray-50 border-l-4 border-[#C72030] rounded p-2 flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-[#C72030] mb-1">
                                            Replying to {replyingTo.user_name}
                                        </div>
                                        <div className="text-xs text-gray-600 truncate">
                                            {replyingTo.body || "Attachment"}
                                        </div>
                                    </div>
                                    <button
                                        onClick={cancelReply}
                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {attachments.map((file, index) => {
                                        const fileURL = URL.createObjectURL(file);
                                        const isImage = file.type.startsWith("image/");
                                        return (
                                            <div
                                                key={index}
                                                className="relative rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden w-16 h-16"
                                            >
                                                {isImage ? (
                                                    <img
                                                        src={fileURL}
                                                        alt={file.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-xs text-gray-600 text-center p-2">
                                                        {file.name.length > 10
                                                            ? file.name.slice(0, 10) + "..."
                                                            : file.name}
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-white rounded-full shadow p-[2px]"
                                                    onClick={() => removeAttachment(index)}
                                                >
                                                    <X className="w-3 h-3 text-gray-600" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <textarea
                                ref={textareaRef}
                                placeholder="Type here and hit enter"
                                className="w-full bg-transparent py-1 pr-2 pl-12 text-sm focus:outline-none resize-none max-h-24 overflow-y-auto"
                                rows={1}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                            />

                            <div className="absolute bottom-[16px] left-3 flex items-center space-x-1">
                                <Paperclip
                                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                                    size={18}
                                    onClick={() => paperclipRef.current.click()}
                                />
                                <div className="relative" ref={emojiPickerRef}>
                                    <Smile
                                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                                        size={18}
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    />
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-8 left-0 bg-white border rounded-lg shadow-lg p-3 w-64 h-48 overflow-y-auto z-50">
                                            <div className="grid grid-cols-8 gap-1">
                                                {emojis.map((emoji, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                                                        onClick={() => handleEmojiClick(emoji)}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                ref={paperclipRef}
                            />
                        </div>
                    </div>
                    <button type="button" className="text-gray-500 text-xl" onClick={sendMessages}>
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                            <path
                                d="M4.25 28.3332V19.8332L15.5833 16.9998L4.25 14.1665V5.6665L31.1667 16.9998L4.25 28.3332Z"
                                fill="#C72030"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroupConversation;