import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { useNavigate, useParams } from "react-router-dom";
import NewConversationModal from "./NewConversationModal";
import { fetchConversations, fetchGroups } from "@/store/slices/channelSlice";

const ChannelSidebar = () => {
    const { id } = useParams();
    const dispath = useAppDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const modalRef = useRef<HTMLDivElement | null>(null);

    const [isGroupsOpen, setIsGroupsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [newConversationModal, setNewConversationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [conversations, setConversations] = useState([]);
    const [groups, setGroups] = useState([]);

    const fetchInternalUsers = async () => {
        try {
            const response = await dispath(fetchFMUsers()).unwrap();
            setUsers(
                response.users.filter((user) => user.employee_type === "internal")
            );
        } catch (error) {
            console.log(error);
        }
    };

    const getConversations = async () => {
        try {
            const response = await dispath(
                fetchConversations({ baseUrl, token })
            ).unwrap();
            setConversations(response);
        } catch (error) {
            console.log(error);
        }
    };

    const getGroups = async () => {
        try {
            const response = await dispath(
                fetchGroups({ baseUrl, token })
            ).unwrap();
            setGroups(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchInternalUsers();
        getConversations();
        getGroups();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
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
        <div className="w-64 h-[calc(100vh-112px)] py-3 border-r border-gray-200 shadow-md space-y-2 relative">
            <div
                className="w-full px-3"
                onClick={() => setNewConversationModal(true)}
            >
                <Button className="w-full">+ New Chat</Button>
            </div>

            <div>
                <button
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 py-2 px-3 w-full"
                    onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                >
                    <span className="text-sm font-medium">Direct Messages</span>
                    {isMessagesOpen ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </button>

                {isMessagesOpen && (
                    <div className="pl-6 space-y-1 max-h-[15rem] overflow-auto">
                        {conversations.map((conversation) => (
                            <div
                                className={`text-sm text-gray-700 cursor-pointer hover:text-[#c72030] py-1 px-2 rounded ${conversation.id === Number(id)
                                    ? "text-[#c72030]"
                                    : ""
                                    }`}
                                key={conversation.id}
                                onClick={() =>
                                    navigate(`/channels/messages/${conversation.id}`)
                                }
                            >
                                {JSON.parse(localStorage.getItem("user"))?.id ===
                                    conversation.sender_id
                                    ? conversation.receiver_name
                                    : conversation.sender_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 py-2 px-3 w-full"
                    onClick={() => setIsGroupsOpen(!isGroupsOpen)}
                >
                    <span className="text-sm font-medium">Groups</span>
                    {isGroupsOpen ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </button>

                {isGroupsOpen && (
                    <div className="pl-6 space-y-1">
                        {groups.map((group) => (
                            <div
                                className={`text-sm text-gray-700 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded ${group.id === Number(id)
                                    ? "text-[#c72030]"
                                    : ""
                                    }`}
                                key={group.id}
                                onClick={() =>
                                    navigate(`/channels/groups/${group.id}`)
                                }
                            >
                                {group.name}
                            </div>
                        ))}
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
                />
            )}
        </div>
    );
};

export default ChannelSidebar;
