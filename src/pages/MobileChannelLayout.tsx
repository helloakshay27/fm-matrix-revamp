import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchConversations, fetchGroups } from "@/store/slices/channelSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Plus, ArrowLeft, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NewConversationModal from "@/components/NewConversationModal";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { Button } from "@/components/ui/button";

interface Conversation {
    id: string;
    sender_id: string;
    receiver_id: string;
    sender_name: string;
    receiver_name: string;
    last_message?: string;
    last_message_at?: string;
    last_message_read?: boolean;
}

interface Group {
    id: string;
    name: string;
    last_message?: string;
    last_message_at?: string;
    last_message_read?: boolean;
}

interface User {
    id: string;
    full_name: string;
}

const MobileChannelLayout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

    const modalRef = useRef<HTMLDivElement | null>(null);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct");
    const [newConversationModal, setNewConversationModal] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [userSearchQuery, setUserSearchQuery] = useState("");

    const fetchInternalUsers = async () => {
        try {
            const response = await dispatch(fetchFMUsers()).unwrap();
            setUsers(
                response.users.filter((user: any) => user.employee_type === "internal")
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

    const filteredConversations = conversations.filter((conversation) => {
        const displayedName =
            currentUserId === conversation.sender_id
                ? conversation.receiver_name
                : conversation.sender_name;
        return displayedName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = users.filter((user) =>
        user.full_name.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    const formatTime = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (messageDate.getTime() === today.getTime()) {
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const renderAvatar = (name: string, bgColor: string) => (
        <div
            className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}
        >
            {getInitials(name)}
        </div>
    );

    const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
        const displayedName =
            currentUserId === conversation.sender_id
                ? conversation.receiver_name
                : conversation.sender_name;

        const displayedId =
            currentUserId === conversation.sender_id
                ? conversation.receiver_id
                : conversation.sender_id;

        const isActive = id === conversation.id;
        const hasUnread = conversation.last_message_read === false;

        const bgColors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-pink-500",
            "bg-red-500",
        ];
        const bgColor =
            bgColors[String(displayedId).charCodeAt(0) % bgColors.length];

        return (
            <div
                onClick={() => navigate(`/mobile/channels/messages/${conversation.id}`)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${isActive
                    ? "bg-[#C72030]/10 border-l-4 border-[#C72030]"
                    : "hover:bg-gray-50"
                    } border-b border-gray-100`}
            >
                {renderAvatar(displayedName, bgColor)}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span
                            className={`text-sm font-medium truncate ${hasUnread ? "text-gray-900 font-semibold" : "text-gray-800"
                                }`}
                        >
                            {displayedName}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(conversation.last_message_at)}
                        </span>
                    </div>

                    <p
                        className={`text-xs truncate ${hasUnread
                            ? "text-gray-600 font-medium"
                            : "text-gray-500"
                            }`}
                    >
                        {conversation.last_message || "No messages yet"}
                    </p>
                </div>

                {hasUnread && (
                    <div className="w-3 h-3 rounded-full bg-[#C72030] flex-shrink-0" />
                )}
            </div>
        );
    };

    const GroupItem = ({ group }: { group: Group }) => {
        const isActive = id === group.id;
        const hasUnread = group.last_message_read === false;

        return (
            <div
                onClick={() => navigate(`/mobile/channels/groups/${group.id}`)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${isActive
                    ? "bg-[#C72030]/10 border-l-4 border-[#C72030]"
                    : "hover:bg-gray-50"
                    } border-b border-gray-100`}
            >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C72030] to-red-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                    {getInitials(group.name)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span
                            className={`text-sm font-medium truncate ${hasUnread ? "text-gray-900 font-semibold" : "text-gray-800"
                                }`}
                        >
                            {group.name}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(group.last_message_at)}
                        </span>
                    </div>

                    <p
                        className={`text-xs truncate ${hasUnread ? "text-gray-600 font-medium" : "text-gray-500"
                            }`}
                    >
                        {group.last_message || "No messages yet"}
                    </p>
                </div>

                {hasUnread && (
                    <div className="w-3 h-3 rounded-full bg-[#C72030] flex-shrink-0" />
                )}
            </div>
        );
    };

    const ConversationListSkeleton = () => (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border-b border-gray-100">
                    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0 bg-gray-200" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24 bg-gray-200" />
                        <Skeleton className="h-3 w-32 bg-gray-100" />
                    </div>
                </div>
            ))}
        </>
    );

    const EmptyState = ({ icon: Icon, title, description }: any) => (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <Icon size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium text-center">{title}</p>
            <p className="text-gray-400 text-xs text-center">{description}</p>
        </div>
    );

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 space-y-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 flex-1">Messages</h1>
                    <button
                        onClick={() => setNewConversationModal(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Plus size={20} className="text-[#C72030]" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("direct")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "direct"
                        ? "text-[#C72030] border-b-2 border-[#C72030]"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Direct ({conversations.length})
                </button>
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "groups"
                        ? "text-[#C72030] border-b-2 border-[#C72030]"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Groups ({groups.length})
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "direct" ? (
                    <div>
                        {isLoadingConversations ? (
                            <ConversationListSkeleton />
                        ) : filteredConversations.length > 0 ? (
                            filteredConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                />
                            ))
                        ) : (
                            <EmptyState
                                icon={MessageCircle}
                                title="No conversations yet"
                                description="Start a new conversation to connect"
                            />
                        )}
                    </div>
                ) : (
                    <div>
                        {isLoadingGroups ? (
                            <ConversationListSkeleton />
                        ) : filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <GroupItem key={group.id} group={group} />
                            ))
                        ) : (
                            <EmptyState
                                icon={MessageCircle}
                                title="No groups yet"
                                description="Join or create a group to start chatting"
                            />
                        )}
                    </div>
                )}
            </div>

            {/* New Conversation Modal */}
            {newConversationModal && (
                <NewConversationModal
                    modalRef={modalRef}
                    filteredUsers={filteredUsers}
                    searchQuery={userSearchQuery}
                    setSearchQuery={setUserSearchQuery}
                    setNewConversationModal={setNewConversationModal}
                    conversations={conversations}
                    onConversationCreated={getConversations}
                    onGroupCreated={getGroups}
                />
            )}
        </div>
    );
};

export default MobileChannelLayout;
