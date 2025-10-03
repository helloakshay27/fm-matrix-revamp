import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

const ChannelSidebar = () => {
    const dispath = useAppDispatch();
    const navigate = useNavigate();

    const [isGroupsOpen, setIsGroupsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [users, setUsers] = useState([]);

    const fetchInternalUsers = async () => {
        try {
            const response = await dispath(fetchFMUsers()).unwrap();
            setUsers(response.users);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchInternalUsers();
    }, []);

    return (
        <div className="w-64 h-[calc(100vh-112px)] py-3 border-r border-gray-200 shadow-md space-y-2">
            <div className="w-full px-3">
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
                    <div className="pl-6 space-y-1 h-[15rem] overflow-auto">
                        {users.map((user) => (
                            <div
                                className="text-sm text-gray-700 cursor-pointer hover:text-[#c72030] py-1 px-2 rounded"
                                key={user.id}
                                onClick={() => navigate(`/channels/messages/${user.id}`)}
                            >
                                {user.full_name}
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
                        <div className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded">
                            Group 1
                        </div>
                        <div className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded">
                            Group 2
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChannelSidebar;
