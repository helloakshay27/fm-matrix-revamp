import Chats from "@/components/Chats";
import { useLayout } from "@/contexts/LayoutContext";
import { useAppDispatch } from "@/store/hooks";
import { fetchConversation, fetchConversationMessages, fetchGroupConversation, sendMessage } from "@/store/slices/channelSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const GroupConversation = () => {
    const { id } = useParams();
    const { isSidebarCollapsed } = useLayout();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [activeTab, setActiveTab] = useState("chat");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState({
        name: "",
    });

    const fetchData = async () => {
        try {
            const response = await dispatch(
                fetchGroupConversation({ baseUrl, token, id })
            ).unwrap();
            setConversation(response);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await dispatch(
                fetchConversationMessages({ baseUrl, token, id, per_page: 50, page: 1 })
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

        const interval = setInterval(() => {
            fetchMessages();
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    const sendMessages = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const payload = {
            body: input,
            project_space_id: id,
        }
        try {
            const response = await dispatch(
                sendMessage({ baseUrl, token, data: payload })
            ).unwrap();
            setMessages([...messages, response]);
            setInput("");
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

    const handleCreateTask = (message) => {
        console.log("Creating task from message:", message);
    };

    return (
        <div
            className={`flex flex-col h-[calc(100vh-112px)] ${isSidebarCollapsed ? "w-[calc(100vw-20rem)]" : "w-[calc(100vw-32rem)]"
                } min-w-0 overflow-hidden`}
        >
            <div className="flex justify-between items-center px-6 py-4 border-b ">
                <div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-[#F2EEE9] flex items-center justify-center text-[#C72030] font-semibold">
                            {
                                conversation?.name?.[0]?.toUpperCase()
                            }
                        </div>
                        <h2 className="text-lg font-medium text-black">
                            {
                                conversation?.name
                            }
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
                            className={`cursor-pointer ${activeTab === "shared"
                                ? "text-black border-b-2 border-black pb-1"
                                : ""
                                }`}
                            onClick={() => setActiveTab("shared")}
                        >
                            Shared
                        </span>
                    </div>
                </div>

                <button className="text-sm flex items-center space-x-1">
                    <span className="text-xl text-black">&larr;</span>
                    <span className="text-[#C72030]">Back</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === "chat" && id && <Chats messages={messages} onCreateTask={handleCreateTask} />}
                {activeTab === "task" && <>Tasks</>}
                {activeTab === "shared" && <>Shared</>}
            </div>

            {activeTab === "chat" && (
                <div>
                    <div
                        className={`w-[calc(100vw-${isSidebarCollapsed ? "20rem" : "32rem"
                            })] mx-auto px-6 py-6 flex items-center space-x-2`}
                    >
                        <div className="relative flex-1">
                            <textarea
                                placeholder="Type here and hit enter"
                                className={`w-full bg-white px-4 py-4 pr-10 text-sm focus:outline-none shadow-md resize-none 
      ${input.split("\n").length > 1 ? "rounded-2xl" : "rounded-full"}`}
                                rows={1}
                                style={{
                                    maxHeight: "6rem",
                                    overflowY: "auto",
                                }}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);

                                    e.target.style.height = "auto";
                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessages(e);
                                    }
                                }}
                            />
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
                </div>
            )}
        </div>
    );
};

export default GroupConversation;
