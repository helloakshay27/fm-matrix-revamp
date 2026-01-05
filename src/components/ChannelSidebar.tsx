import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NewConversationModal from "./NewConversationModal";
import { fetchConversations, fetchGroups } from "@/store/slices/channelSlice";
import { Skeleton } from "./ui/skeleton";

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
        <div className={`w-64 ${localStorage.getItem('selectedView') === 'employee' ? "h-[calc(100vh-60px)]" : "h-[calc(100vh-112px)]"} py-3 border-r border-gray-200 shadow-md space-y-2 relative`}>
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

                                    return (
                                        <div
                                            className={`text-sm text-gray-700 cursor-pointer hover:text-[#c72030] py-1 px-2 rounded ${isActive
                                                ? 'text-red-600 font-semibold'
                                                : 'hover:text-red-600'
                                                }`}
                                            key={conversation.id}
                                            onClick={() =>
                                                navigate(`/vas/channels/messages/${conversation.id}`)
                                            }
                                        >
                                            {displayedName}
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
                                    return (
                                        <div
                                            className={`text-sm text-gray-700 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded ${isActive
                                                ? 'text-red-600 font-semibold'
                                                : 'hover:text-red-600'
                                                }`}
                                            key={group.id}
                                            onClick={() => navigate(`/vas/channels/groups/${group.id}`)}
                                        >
                                            {group.name}
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
