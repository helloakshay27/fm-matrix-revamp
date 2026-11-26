import Chats from "@/components/Chats";
import { useLayout } from "@/contexts/LayoutContext";
import { useAppDispatch } from "@/store/hooks";
import { fetchConversationMessages, fetchGroupConversation, removeUserFromGroup, sendMessage, updateGroup } from "@/store/slices/channelSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ChatTasks from "./ChatTasks";
import { Paperclip, X, UserMinus, UserPlus, Smile, Search, ArrowLeft, Check, Loader2, Users, Pencil, LogOut } from "lucide-react";
import ChatAttachments from "./ChatAttachments";
import { emojis } from "@/utils/emojies";
import { useWebSocket } from "@/hooks/useWebSocket";
import axios from "axios";

const GroupConversation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isSidebarCollapsed } = useLayout();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const paperclipRef = useRef(null);
    const textareaRef = useRef(null);
    const mentionDropdownRef = useRef(null);
    const modalRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const bottomRef = useRef(null);
    const isUserInitiatedScroll = useRef(false);

    const [activeTab, setActiveTab] = useState("chat");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [spaceUsers, setSpaceUsers] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [conversation, setConversation] = useState<any>({
        name: "",
    });
    const [showGroupDetails, setShowGroupDetails] = useState(false);

    // Add members (group info modal)
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [memberSearch, setMemberSearch] = useState("");
    const [selectedNewMembers, setSelectedNewMembers] = useState<number[]>([]);
    const [addingMembers, setAddingMembers] = useState(false);
    const [membersFilter, setMembersFilter] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState("");
    const [savingName, setSavingName] = useState(false);
    const [confirmLeave, setConfirmLeave] = useState(false);
    const [leavingGroup, setLeavingGroup] = useState(false);
    const [confirmRemoveId, setConfirmRemoveId] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [mentionSearch, setMentionSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [mentionStartPos, setMentionStartPos] = useState(0);
    const [mentions, setMentions] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const { manager: webSocketManager, connect } = useWebSocket();

    useEffect(() => {
        textareaRef.current.focus();
    }, [id])
    useEffect(() => {
        console.log('🔌 WebSocket connection effect running');

        if (token) {
            console.log('✅ Token available, connecting...');
            connect(`wss://${baseUrl}/cable`);
        } else {
            console.error('❌ No token available for WebSocket connection');
        }

        return () => {
            console.log('🧹 Cleaning up WebSocket subscriptions');
            webSocketManager.unsubscribeFromConversation(id);
        };
    }, [token, connect]);

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

    const markAsRead = async () => {
        try {
            await axios.post(`https://${baseUrl}/project_spaces/${id}/mark_as_read.json`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
        fetchMessages();
        markAsRead();
    }, [id]);

    // useEffect(() => {
    //     if (activeTab === "chat") {
    //         const interval = setInterval(() => {
    //             fetchMessages();
    //         }, 5000);

    //         return () => clearInterval(interval);
    //     }
    // }, [activeTab, id]);

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
        setRemovingId(userId);
        try {
            await dispatch(
                removeUserFromGroup({ baseUrl, token, userId })
            ).unwrap();
            setConfirmRemoveId(null);
            await fetchData();
            toast.success("User removed from group");
        } catch (error) {
            console.log(error)
            toast.error(error)
        } finally {
            setRemovingId(null);
        }
    };

    const filteredMembers = useMemo(
        () =>
            spaceUsers.filter((u) =>
                `${u.user_name || ""} ${u.email || ""}`
                    .toLowerCase()
                    .includes(membersFilter.toLowerCase())
            ),
        [spaceUsers, membersFilter]
    );

    const isCurrentUserMember = (u) =>
        u.user_id !== undefined && Number(u.user_id) === Number(currentUser?.id);

    const getInitial = (name) => (name || "U").trim()[0]?.toUpperCase() || "U";

    // Stable soft avatar colour per name, from theme tokens
    const AVATAR_STYLES = [
        "bg-brand-light text-brand",
        "bg-brand-green-light text-brand-green",
        "bg-brand-teal-light text-brand-teal",
        "bg-brand-purple-light text-gray-700",
        "bg-brand-warning-light text-gray-700",
    ];
    const getAvatarStyle = (name) => {
        const str = name || "";
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) | 0;
        return AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
    };

    const myMembership = spaceUsers.find((u) => isCurrentUserMember(u));

    // Current user first, then alphabetical
    const sortedMembers = [...filteredMembers].sort((a, b) => {
        const aMe = isCurrentUserMember(a) ? 1 : 0;
        const bMe = isCurrentUserMember(b) ? 1 : 0;
        if (aMe !== bMe) return bMe - aMe;
        return (a.user_name || "").localeCompare(b.user_name || "");
    });

    const handleLeaveGroup = async () => {
        if (!myMembership) return;
        setLeavingGroup(true);
        try {
            await dispatch(
                removeUserFromGroup({ baseUrl, token, userId: myMembership.id })
            ).unwrap();
            window.dispatchEvent(new CustomEvent("channel-group-left", { detail: { id } }));
            toast.success("You left the group");
            setShowGroupDetails(false);
            navigate("/vas/channels");
        } catch (error) {
            console.log(error);
            toast.error(typeof error === "string" ? error : "Failed to leave group");
        } finally {
            setLeavingGroup(false);
            setConfirmLeave(false);
        }
    };

    const startRename = () => {
        setRenameValue(conversation?.name || "");
        setIsRenaming(true);
    };

    const cancelRename = () => {
        setIsRenaming(false);
        setRenameValue("");
    };

    const handleRenameGroup = async () => {
        const newName = renameValue.trim();
        if (!newName) {
            toast.error("Group name cannot be empty.");
            return;
        }
        if (newName === conversation?.name) {
            cancelRename();
            return;
        }

        setSavingName(true);
        try {
            await dispatch(
                updateGroup({ baseUrl, token, id, data: { project_space: { name: newName } } })
            ).unwrap();
            setConversation((prev) => ({ ...prev, name: newName }));
            // Let ChannelSidebar update its locally-held group list
            window.dispatchEvent(
                new CustomEvent("channel-group-renamed", { detail: { id, name: newName } })
            );
            toast.success("Group renamed");
            cancelRename();
        } catch (error) {
            console.log(error);
            toast.error(typeof error === "string" ? error : "Failed to rename group");
        } finally {
            setSavingName(false);
        }
    };

    // Actual user ids of current members (not project_space_user membership ids).
    // Returns null if they can't be resolved, so we never PATCH a list that would drop members.
    const getExistingMemberUserIds = (): number[] | null => {
        if (Array.isArray(conversation?.user_ids)) {
            return conversation.user_ids.map(Number);
        }
        const ids = spaceUsers.map((u) => u.user_id);
        if (ids.some((uid) => uid === undefined || uid === null)) return null;
        return ids.map(Number);
    };

    const existingMemberIds = useMemo(
        () => new Set(getExistingMemberUserIds() || []),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [conversation, spaceUsers]
    );

    const fetchAllUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllUsers(response.data.users || []);
        } catch (error) {
            console.log("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setUsersLoading(false);
        }
    };

    const openAddMembers = () => {
        setShowAddMembers(true);
        setMemberSearch("");
        setSelectedNewMembers([]);
        if (allUsers.length === 0) fetchAllUsers();
    };

    const closeAddMembers = () => {
        setShowAddMembers(false);
        setMemberSearch("");
        setSelectedNewMembers([]);
    };

    const addableUsers = useMemo(
        () =>
            allUsers
                .filter((u) => !existingMemberIds.has(Number(u.id)))
                .filter((u) =>
                    (u.full_name || "").toLowerCase().includes(memberSearch.toLowerCase())
                ),
        [allUsers, existingMemberIds, memberSearch]
    );

    const toggleNewMember = (userId: number) => {
        setSelectedNewMembers((prev) =>
            prev.includes(userId) ? prev.filter((u) => u !== userId) : [...prev, userId]
        );
    };

    const handleAddMembers = async () => {
        if (selectedNewMembers.length === 0) {
            toast.error("Please select at least one member.");
            return;
        }
        const existingIds = getExistingMemberUserIds();
        if (!existingIds) {
            toast.error("Unable to read current group members. Please refresh and try again.");
            return;
        }

        const payload = {
            project_space: {
                user_ids: Array.from(new Set([...existingIds, ...selectedNewMembers])),
            },
        };

        setAddingMembers(true);
        try {
            await dispatch(updateGroup({ baseUrl, token, id, data: payload })).unwrap();
            toast.success("Members added to group");
            closeAddMembers();
            fetchData();
        } catch (error) {
            console.log(error);
            toast.error(typeof error === "string" ? error : "Failed to add members");
        } finally {
            setAddingMembers(false);
        }
    };

    const handleEmojiClick = (emoji) => {
        setInput((prev) => prev + emoji);
    };

    // Reset the add-members picker whenever the group info modal closes
    useEffect(() => {
        if (!showGroupDetails) {
            closeAddMembers();
            setMembersFilter("");
            setConfirmRemoveId(null);
            setConfirmLeave(false);
            cancelRename();
        }
    }, [showGroupDetails]);

    useEffect(() => {
        if (bottomRef.current && !isUserInitiatedScroll.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        const subscriptionTimer = setTimeout(() => {
            const sub = webSocketManager.subscribeToProjectSpace(id, {
                onConnected: () => {
                    console.log('🎉 SUBSCRIPTION SUCCESSFUL - Chat connected!');
                    setIsSubscribed(true);
                    toast.success('Real-time chat connected!', { duration: 2000 });
                },
                onNewMessage: (message) => {
                    console.log(message)
                    if (String(message.project_space_id) !== id) {
                        return;
                    }

                    console.log("In Group converstaion - New message received:", message)

                    setMessages((prev) => {
                        const exists = prev.some((msg) => msg.id === message.id);
                        if (exists) return prev;
                        return [message, ...prev];
                    });

                    if (!('Notification' in window)) {
                        toast.error('Not supported');
                        return;
                    }

                    isUserInitiatedScroll.current = false;
                },
                onDisconnected: () => {
                    console.log('❌ Chat subscription disconnected');
                    setIsSubscribed(false);
                    toast.error('Real-time chat disconnected');
                }
            });
            console.log('📋 Subscription object:', sub);
        }, 2000); // Wait 2 seconds for connection to establish

        return () => {
            console.log('⏰ Clearing subscription timer');
            clearTimeout(subscriptionTimer);
        };
    }, [id, isSubscribed, webSocketManager, currentUser.id]);

    return (
        <div
            className={`flex flex-col ${localStorage.getItem('user_role_name') === 'Employee' ? "h-[calc(100vh-64px)]" : "h-[calc(100vh-112px)]"} w-full ${isSidebarCollapsed ? "md:w-[calc(100vw-20rem)]" : "md:w-[calc(100vw-32rem)]"
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
                            <p className="text-sm text-gray-500">{spaceUsers.length} members</p>
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
                    <div
                        ref={modalRef}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[440px] max-h-[88vh] overflow-hidden flex flex-col"
                    >
                        {!showAddMembers ? (
                            <>
                                <button
                                    onClick={() => setShowGroupDetails(false)}
                                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    title="Close"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex-1 overflow-y-auto scrollbar-hide">
                                    {/* Profile header */}
                                    <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center bg-gradient-to-b from-brand-selected to-white">
                                        <div
                                            className={`w-20 h-20 rounded-full flex items-center justify-center font-semibold text-3xl ring-4 ring-white shadow-sm ${getAvatarStyle(conversation?.name)}`}
                                        >
                                            {getInitial(isRenaming ? renameValue : conversation?.name)}
                                        </div>

                                        {isRenaming ? (
                                            <div className="w-full mt-4 text-left">
                                                <label htmlFor="group-rename-input" className="block text-xs font-medium text-gray-500 mb-1.5">
                                                    Group name
                                                </label>
                                                <input
                                                    id="group-rename-input"
                                                    type="text"
                                                    autoFocus
                                                    value={renameValue}
                                                    maxLength={100}
                                                    disabled={savingName}
                                                    onChange={(e) => setRenameValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleRenameGroup();
                                                        if (e.key === "Escape") cancelRename();
                                                    }}
                                                    className="w-full px-3 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light disabled:opacity-60 transition-colors"
                                                    placeholder="Enter group name"
                                                />
                                                <div className="flex items-center justify-between gap-3 mt-3">
                                                    <span className="text-xs text-gray-400">{renameValue.length}/100</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={cancelRename}
                                                            disabled={savingName}
                                                            className="px-3.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleRenameGroup}
                                                            disabled={savingName || !renameValue.trim() || renameValue.trim() === conversation?.name}
                                                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            {savingName && <Loader2 size={14} className="animate-spin" />}
                                                            {savingName ? "Saving..." : "Save"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mt-4 flex items-center justify-center gap-1 max-w-full">
                                                    <h3 className="text-xl font-semibold text-gray-900 truncate">{conversation?.name}</h3>
                                                    <button
                                                        onClick={startRename}
                                                        className="p-1.5 rounded-md text-gray-400 hover:text-brand hover:bg-brand-light flex-shrink-0 transition-colors"
                                                        title="Rename group"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                </div>
                                                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                                                    <Users size={14} />
                                                    Group · {spaceUsers.length} {spaceUsers.length === 1 ? "member" : "members"}
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Members section */}
                                    <div className="px-4 pb-4">
                                        {/* Sticks to the top once the profile header scrolls away; only the list scrolls below it */}
                                        <div className="sticky top-0 z-[5] bg-white -mx-4 px-4 pt-4 pb-1 border-b border-transparent">
                                            <div className="flex items-center justify-between px-2 pb-3 pr-10">
                                                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                                    Members
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                                        {spaceUsers.length}
                                                    </span>
                                                </h4>
                                            </div>

                                            {spaceUsers.length > 4 && (
                                                <div className="relative px-2 pb-3">
                                                    <Search size={16} className="absolute left-5 top-[18px] -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={membersFilter}
                                                        onChange={(e) => setMembersFilter(e.target.value)}
                                                        placeholder="Search members"
                                                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-brand transition-colors"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <ul className="space-y-0.5 pt-1">
                                            {/* Add members action row */}
                                            {!membersFilter && (
                                                <li>
                                                    <button
                                                        onClick={openAddMembers}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 transition-colors"
                                                    >
                                                        <span className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0">
                                                            <UserPlus size={18} />
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900">Add members</span>
                                                    </button>
                                                </li>
                                            )}

                                            {sortedMembers.length === 0 ? (
                                                <li className="py-8 text-center text-sm text-gray-500">No members found</li>
                                            ) : (
                                                sortedMembers.map((user) => {
                                                    const isMe = isCurrentUserMember(user);
                                                    const isConfirming = confirmRemoveId === user.id;
                                                    const isRemoving = removingId === user.id;
                                                    // Self-removal lives in the "Leave group" footer when we can identify the user
                                                    const canRemove = !(isMe && myMembership);
                                                    return (
                                                        <li
                                                            key={user.id}
                                                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isConfirming ? "bg-brand-error-bg" : "hover:bg-gray-50"}`}
                                                        >
                                                            <div
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${getAvatarStyle(user.user_name)}`}
                                                            >
                                                                {getInitial(user.user_name)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                {isConfirming ? (
                                                                    <p className="text-sm text-gray-800 truncate">
                                                                        Remove <span className="font-medium">{user.user_name}</span>?
                                                                    </p>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <span className="text-sm font-medium text-gray-900 truncate">{user.user_name}</span>
                                                                            {isMe && (
                                                                                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded bg-brand-light text-brand flex-shrink-0">
                                                                                    You
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {user.email && (
                                                                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                            {isConfirming ? (
                                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                    <button
                                                                        onClick={() => setConfirmRemoveId(null)}
                                                                        disabled={isRemoving}
                                                                        className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRemoveMember(user.id)}
                                                                        disabled={isRemoving}
                                                                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-brand-error rounded-md hover:opacity-90 disabled:opacity-60"
                                                                    >
                                                                        {isRemoving && <Loader2 size={12} className="animate-spin" />}
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                canRemove && (
                                                                    <button
                                                                        onClick={() => setConfirmRemoveId(user.id)}
                                                                        className="p-2 rounded-lg text-gray-300 group-hover:text-gray-500 hover:!text-brand-error hover:bg-brand-error-bg focus:text-brand-error transition-colors flex-shrink-0"
                                                                        title="Remove member"
                                                                    >
                                                                        <UserMinus size={16} />
                                                                    </button>
                                                                )
                                                            )}
                                                        </li>
                                                    );
                                                })
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* Footer: leave group */}
                                {myMembership && (
                                    <div className="px-4 py-3 border-t border-gray-100">
                                        {confirmLeave ? (
                                            <div className="flex items-center justify-between gap-3 px-2 py-1">
                                                <p className="text-sm text-gray-700">Leave this group?</p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setConfirmLeave(false)}
                                                        disabled={leavingGroup}
                                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleLeaveGroup}
                                                        disabled={leavingGroup}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-brand-error rounded-lg hover:opacity-90 disabled:opacity-60"
                                                    >
                                                        {leavingGroup && <Loader2 size={14} className="animate-spin" />}
                                                        Leave
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmLeave(true)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-error rounded-lg hover:bg-brand-error-bg transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Leave group
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Add Members Header */}
                                <div className="px-4 pt-4 pb-3 flex items-center gap-2">
                                    <button
                                        onClick={closeAddMembers}
                                        className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                                        title="Back"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900">Add members</h3>
                                        <p className="text-xs text-gray-500 truncate">to {conversation?.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowGroupDetails(false)}
                                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                        title="Close"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="px-6 pb-3 border-b border-gray-100">
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            autoFocus
                                            value={memberSearch}
                                            onChange={(e) => setMemberSearch(e.target.value)}
                                            placeholder="Search people"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-brand transition-colors"
                                        />
                                    </div>

                                    {/* Selected chips */}
                                    {selectedNewMembers.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3 max-h-20 overflow-y-auto">
                                            {selectedNewMembers.map((uid) => {
                                                const u = allUsers.find((x) => Number(x.id) === uid);
                                                return (
                                                    <span
                                                        key={uid}
                                                        className="flex items-center gap-1 pl-1 pr-1 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                                                    >
                                                        <span
                                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${getAvatarStyle(u?.full_name)}`}
                                                        >
                                                            {getInitial(u?.full_name)}
                                                        </span>
                                                        <span className="max-w-[120px] truncate">{u?.full_name || "User"}</span>
                                                        <button
                                                            onClick={() => toggleNewMember(uid)}
                                                            className="p-0.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200"
                                                            title="Remove"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-2 min-h-[240px]">
                                    {usersLoading ? (
                                        <ul className="space-y-1">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <li key={i} className="flex items-center gap-3 px-3 py-2.5">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                                                    <div className="flex-1 space-y-1.5">
                                                        <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
                                                        <div className="h-2.5 w-1/3 rounded bg-gray-100 animate-pulse" />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : addableUsers.length === 0 ? (
                                        <div className="py-12 flex flex-col items-center text-center">
                                            <span className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                                                <Users size={20} />
                                            </span>
                                            <p className="text-sm font-medium text-gray-700">No people found</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {memberSearch ? "Try a different name" : "Everyone is already in this group"}
                                            </p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-0.5">
                                            {addableUsers.map((u) => {
                                                const checked = selectedNewMembers.includes(Number(u.id));
                                                return (
                                                    <li key={u.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleNewMember(Number(u.id))}
                                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${checked ? "bg-brand-selected" : "hover:bg-gray-50"}`}
                                                        >
                                                            <div
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${getAvatarStyle(u.full_name)}`}
                                                            >
                                                                {getInitial(u.full_name)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-900 truncate">{u.full_name}</div>
                                                                {u.email && <div className="text-xs text-gray-500 truncate">{u.email}</div>}
                                                            </div>
                                                            <span
                                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-brand border-brand text-white" : "border-gray-300"}`}
                                                            >
                                                                {checked && <Check size={12} strokeWidth={3} />}
                                                            </span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
                                    <span className="text-sm text-gray-500">
                                        {selectedNewMembers.length > 0 ? `${selectedNewMembers.length} selected` : "Select people"}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={closeAddMembers}
                                            disabled={addingMembers}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddMembers}
                                            disabled={addingMembers || selectedNewMembers.length === 0}
                                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {addingMembers && <Loader2 size={14} className="animate-spin" />}
                                            {addingMembers ? "Adding..." : "Add"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {activeTab === "chat" && id && <Chats messages={messages} onReply={handleReply} bottomRef={bottomRef} fetchMessages={fetchMessages} />}
                {activeTab === "task" && <ChatTasks />}
                {activeTab === "attachments" && <ChatAttachments />}
            </div>

            {activeTab === "chat" && (
                <div
                    className={`w-full md:w-[calc(100vw-${isSidebarCollapsed ? "20rem" : "32rem"
                        })] mx-auto px-4 sm:px-6 py-4 flex items-center space-x-2`}
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
                    <button
                        type="button"
                        onClick={sendMessages}
                        disabled={input.trim() === "" && attachments.length === 0}
                        className="
    text-xl
    text-[#C72030]
    disabled:text-gray-300
    disabled:cursor-not-allowed
  "
                    >
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                            <path
                                d="M4.25 28.3332V19.8332L15.5833 16.9998L4.25 14.1665V5.6665L31.1667 16.9998L4.25 28.3332Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                </div>
            )}
        </div>
    );
};

export default GroupConversation;