import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NewConversationModal from "./NewConversationModal";
import { fetchConversations, fetchGroups } from "@/store/slices/channelSlice";
import { Skeleton } from "./ui/skeleton";
import { useNotification } from "@/contexts/NotificationContext";

const ChannelSidebar = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const modalRef = useRef<HTMLDivElement | null>(null);

    const [isGroupsOpen, setIsGroupsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [newConversationModal, setNewConversationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
    const [conversations, setConversations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);

    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    // Use notification context to listen for new notifications
    const { notifications } = useNotification();

    const fetchInternalUsers = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setUsers(
                response.users.filter((user) => user.employee_type === "internal")
            );
        } catch (error) {
            console.log(error);
        }
    };

    const getConversations = async () => {
        setIsLoadingConversations(true);
        try {
            const response = await dispatch(
                fetchConversations({ baseUrl, token })
            ).unwrap();
            setConversations(response);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingConversations(false);
        }
    };

    const getGroups = async () => {
        setIsLoadingGroups(true);
        try {
            const response = await dispatch(fetchGroups({ baseUrl, token })).unwrap();
            setGroups(response);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingGroups(false);
        }
    };

    useEffect(() => {
        fetchInternalUsers();
        getConversations();
        getGroups();
    }, []);

    // Move conversation to top when a notification arrives
    useEffect(() => {
        if (notifications.length === 0) return;

        const latestNotification = notifications[0];

        // If notification is for a conversation, move it to top
        if (latestNotification.ntype === "conversation" && latestNotification.payload?.conversation_id) {
            const conversationId = latestNotification.payload.conversation_id;

            setConversations((prevConversations) => {
                const conversationIndex = prevConversations.findIndex((c) => c.id === conversationId || c.id === String(conversationId));

                if (conversationIndex !== -1) {
                    // Move conversation to top and mark as unread
                    const reorderedConversations = [...prevConversations];
                    const conversation = reorderedConversations[conversationIndex];

                    // Mark as unread if not already
                    if (conversation.last_message_read !== false) {
                        conversation.last_message_read = false;
                    }

                    // Only move if not already at top
                    if (conversationIndex !== 0) {
                        const [movedConversation] = reorderedConversations.splice(conversationIndex, 1);
                        reorderedConversations.unshift(movedConversation);
                    }

                    return reorderedConversations;
                }

                return prevConversations;
            });
        }

        // If notification is for a group, move it to top
        if (latestNotification.ntype === "projectspace" && latestNotification.payload?.project_space_id) {
            const groupId = latestNotification.payload.project_space_id;

            setGroups((prevGroups) => {
                const groupIndex = prevGroups.findIndex((g) => g.id === groupId || g.id === String(groupId));

                if (groupIndex !== -1) {
                    // Move group to top and mark as unread
                    const reorderedGroups = [...prevGroups];
                    const group = reorderedGroups[groupIndex];

                    // Mark as unread if not already
                    if (group.last_message_read !== false) {
                        group.last_message_read = false;
                    }

                    // Only move if not already at top
                    if (groupIndex !== 0) {
                        const [movedGroup] = reorderedGroups.splice(groupIndex, 1);
                        reorderedGroups.unshift(movedGroup);
                    }

                    return reorderedGroups;
                }

                return prevGroups;
            });
        }
    }, [notifications]);

    const handleSidebarSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSidebarSearchQuery(query);

        if (query) {
            setIsMessagesOpen(true);
            setIsGroupsOpen(true);
        }
    };

    const filteredConversations = conversations.filter((conversation) => {
        const displayedName =
            currentUserId === conversation.sender_id
                ? conversation.receiver_name
                : conversation.sender_name;

        return displayedName.toLowerCase().includes(sidebarSearchQuery.toLowerCase());
    });

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
    );

    const filteredUsers = users.filter((user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setNewConversationModal(false);
            }
        }

        if (newConversationModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [newConversationModal]);

    return (
        <div className={`w-64 ${localStorage.getItem('user_role_name') === 'Employee' ? "h-[calc(100vh-64px)]" : "h-[calc(100vh-112px)]"} py-3 border-r border-gray-200 shadow-md space-y-2 relative`}>
            <div className="w-full px-3" onClick={() => setNewConversationModal(true)}>
                <Button className="w-full">+ New Chat</Button>
            </div>

            <div className="px-3">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border border-gray-200 rounded-[2px] bg-transparent px-3 py-1 focus:outline-none"
                    value={sidebarSearchQuery}
                    onChange={handleSidebarSearch}
                />
            </div>

            <div>
                <button
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 py-2 px-3 w-full"
                    onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                >
                    <span className="text-sm font-medium">Direct Messages</span>
                    {isMessagesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isMessagesOpen && (
                    <div className="pl-6 space-y-1 max-h-[12rem] overflow-auto">
                        {
                            isLoadingConversations ? (
                                // Skeleton loaders for conversations
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="py-1 px-2">
                                        <Skeleton className="h-5 w-full bg-gray-200 rounded-[4px]" />
                                    </div>
                                ))
                            ) : filteredConversations.length > 0 ? (
                                filteredConversations.map((conversation) => {
                                    const displayedName =
                                        currentUserId === conversation.sender_id
                                            ? conversation.receiver_name
                                            : conversation.sender_name;
                                    const isActive = location.pathname === `/vas/channels/messages/${conversation.id}`;
                                    const hasUnreadMessages = conversation.last_message_read === false;

                                    return (
                                        <div
                                            className={`text-sm text-gray-700 cursor-pointer hover:text-[#c72030] py-1 px-2 rounded flex items-center justify-between gap-2 ${isActive
                                                ? 'text-red-600 font-semibold'
                                                : 'hover:text-red-600'
                                                }`}
                                            key={conversation.id}
                                            onClick={() => {
                                                setConversations((prev) =>
                                                    prev.map((c) =>
                                                        c.id === conversation.id
                                                            ? { ...c, last_message_read: true }
                                                            : c
                                                    )
                                                );
                                                navigate(`/vas/channels/messages/${conversation.id}`);
                                            }}
                                        >
                                            <span className="flex-1 truncate">{displayedName}</span>
                                            {hasUnreadMessages && (
                                                <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-sm text-gray-700 cursor-pointer hover:text-[#c72030] py-1 px-2 rounded">
                                    No conversations found
                                </div>
                            )
                        }
                    </div>
                )}
            </div>

            <div>
                <button
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 py-2 px-3 w-full"
                    onClick={() => setIsGroupsOpen(!isGroupsOpen)}
                >
                    <span className="text-sm font-medium">Groups</span>
                    {isGroupsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isGroupsOpen && (
                    <div className="pl-6 space-y-1 max-h-[12rem] overflow-auto">
                        {
                            isLoadingGroups ? (
                                // Skeleton loaders for groups
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="py-1 px-2">
                                        <Skeleton className="h-5 w-full rounded-[4px] bg-gray-200" />
                                    </div>
                                ))
                            ) : filteredGroups.length > 0 ? (
                                filteredGroups.map((group) => {
                                    const isActive = location.pathname === `/vas/channels/groups/${group.id}`;
                                    const hasUnreadMessages = group.last_message_read === false;
                                    return (
                                        <div
                                            className={`text-sm text-gray-700 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded flex items-center justify-between gap-2 ${isActive
                                                ? 'text-red-600 font-semibold'
                                                : 'hover:text-red-600'
                                                }`}
                                            key={group.id}
                                            onClick={() => {
                                                setGroups((prev) =>
                                                    prev.map((g) =>
                                                        g.id === group.id
                                                            ? { ...g, last_message_read: true }
                                                            : g
                                                    )
                                                );
                                                navigate(`/vas/channels/groups/${group.id}`);
                                            }}
                                        >
                                            <span className="flex-1 truncate">{group.name}</span>
                                            {hasUnreadMessages && (
                                                <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-sm text-gray-700 cursor-pointer hover:text-[#c72030] py-1 px-2 rounded">
                                    No groups found
                                </div>
                            )
                        }
                    </div>
                )}
            </div>

            {newConversationModal && (
                <NewConversationModal
                    modalRef={modalRef}
                    filteredUsers={filteredUsers}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setNewConversationModal={setNewConversationModal}
                    conversations={conversations}
                    onConversationCreated={getConversations}
                    onGroupCreated={getGroups}
                />
            )}
        </div>
    );
};

export default ChannelSidebar;
