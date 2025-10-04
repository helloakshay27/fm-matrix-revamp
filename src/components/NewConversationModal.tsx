// import { useNavigate } from "react-router-dom"
// import { Input } from "./ui/input"
// import { useAppDispatch } from "@/store/hooks"
// import { createConversation } from "@/store/slices/channelSlice";

// const NewConversationModal = ({ modalRef, filteredUsers, searchQuery, setSearchQuery, setNewConversationModal }) => {
//     const navigate = useNavigate();
//     const dispatch = useAppDispatch();
//     const token = localStorage.getItem("token");
//     const baseUrl = localStorage.getItem("baseUrl");

//     const handleCreateConversation = async (id: string) => {
//         const payload = {
//             conversation: {
//                 sender_id: JSON.parse(localStorage.getItem('user'))?.id,
//                 recipient_id: id
//             }
//         }
//         try {
//             const response = await dispatch(createConversation({ baseUrl, token, data: payload })).unwrap();
//             setNewConversationModal(false);
//             navigate(`/channels/messages/${response.id}`);
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     return (
//         <div className="absolute top-1 left-[15.5rem] w-[28rem] h-[35rem] bg-white flex flex-col shadow-2xl rounded-2xl p-4 space-y-4 border border-gray-100" ref={modalRef}>
//             <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                     Start a Conversation
//                 </h2>
//                 <button className="text-gray-400 hover:text-gray-600 transition" onClick={() => setNewConversationModal(false)}>
//                     ✕
//                 </button>
//             </div>

//             <div className="relative">
//                 <Input
//                     placeholder="Search for users..."
//                     className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <svg
//                     className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
//                     />
//                 </svg>
//             </div>

//             <div className="h-full w-full overflow-y-auto space-y-2 pr-1">
//                 {filteredUsers.map((user) => (
//                     <div
//                         key={user.id}
//                         className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition"
//                         onClick={() => handleCreateConversation(user.id)}
//                     >
//                         <div className="w-9 h-9 rounded-full bg-[#F2EEE9] flex items-center justify-center font-medium text-[#c72030]">
//                             {user.full_name.charAt(0)}
//                         </div>

//                         <div className="flex flex-col">
//                             <span className="text-sm font-medium text-gray-800">
//                                 {user.full_name}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                                 Click to start chat
//                             </span>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default NewConversationModal




import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { useAppDispatch } from "@/store/hooks";
import { createConversation, createGroup } from "@/store/slices/channelSlice";
import { useState } from "react";
import { toast } from "sonner";

const NewConversationModal = ({
    modalRef,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    setNewConversationModal,
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [activeTab, setActiveTab] = useState<"direct" | "group">("direct");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");

    const handleCreateConversation = async (id: string) => {
        const payload = {
            conversation: {
                sender_id: JSON.parse(localStorage.getItem("user"))?.id,
                recipient_id: id,
            },
        };
        try {
            const response = await dispatch(
                createConversation({ baseUrl, token, data: payload })
            ).unwrap();
            setNewConversationModal(false);
            navigate(`/channels/messages/${response.id}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length < 2) {
            toast.error("Enter a group name and select at least 2 members.");
            return;
        }

        const payload = {
            project_space: {
                name: groupName,
                user_ids: selectedUsers,
                created_by_id: JSON.parse(localStorage.getItem("user"))?.id,
                resource_type: "Pms::Site",
                resource_id: localStorage.getItem('selectedSiteId')
            },
        };

        try {
            const response = await dispatch(createGroup({ baseUrl, token, data: payload })).unwrap();
            setNewConversationModal(false);
            navigate(`/channels/groups/${response.id}`);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleUserSelection = (id: string) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
        );
    };

    return (
        <div
            className="absolute top-1 left-[15.5rem] w-[32rem] h-[35rem] bg-white flex flex-col shadow-2xl rounded-2xl p-4 space-y-4 border border-gray-100"
            ref={modalRef}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                    {activeTab === "direct" ? "Start a Conversation" : "Create a Group"}
                </h2>
                <button
                    className="text-gray-400 hover:text-gray-600 transition"
                    onClick={() => setNewConversationModal(false)}
                >
                    ✕
                </button>
            </div>

            <div className="flex border-b border-gray-200">
                <button
                    className={`px-4 py-2 text-sm font-medium relative ${activeTab === "direct"
                        ? "text-[#c72030]"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                    onClick={() => setActiveTab("direct")}
                >
                    Direct Message
                    {activeTab === "direct" && (
                        <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-[#c72030] rounded"></span>
                    )}
                </button>
                <button
                    className={`ml-6 px-4 py-2 text-sm font-medium relative ${activeTab === "group"
                        ? "text-[#c72030]"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                    onClick={() => setActiveTab("group")}
                >
                    Create Group
                    {activeTab === "group" && (
                        <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-[#c72030] rounded"></span>
                    )}
                </button>
            </div>

            {
                activeTab === 'group' && (
                    <Input
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="pr-4 py-2 rounded-[10px] border border-gray-200 focus:ring-2"
                    />
                )
            }

            <div className="relative">
                <Input
                    placeholder={
                        activeTab === "direct"
                            ? "Search for users..."
                            : "Search & select group members..."
                    }
                    className="pl-10 pr-4 py-2 rounded-[10px] border border-gray-200 focus:ring-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                    />
                </svg>
            </div>

            <div className="h-full w-full overflow-y-auto space-y-2 pr-1">
                {activeTab === "direct" ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => handleCreateConversation(user.id)}
                        >
                            <div className="w-9 h-9 rounded-full bg-[#F2EEE9] flex items-center justify-center font-medium text-[#c72030]">
                                {user.full_name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800">
                                    {user.full_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                    Click to start chat
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col space-y-3">
                        <div className="space-y-2 overflow-y-auto max-h-60">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition ${selectedUsers.includes(user.id)
                                        ? "bg-[#c72030]/10"
                                        : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => toggleUserSelection(user.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        readOnly
                                    />
                                    <div className="w-9 h-9 rounded-full bg-[#F2EEE9] flex items-center justify-center font-medium text-[#c72030]">
                                        {user.full_name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">
                                        {user.full_name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleCreateGroup}
                            className="mt-2 px-4 py-2 bg-[#c72030] text-white rounded-lg hover:bg-[#a81b27] transition"
                        >
                            Create Group
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewConversationModal;
