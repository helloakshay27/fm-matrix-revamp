import Chats from "@/components/Chats";
import { useLayout } from "@/contexts/LayoutContext";
import { useAppDispatch } from "@/store/hooks";
import { fetchConversationMessages, fetchGroupConversation, sendMessage } from "@/store/slices/channelSlice";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ChatTasks from "./ChatTasks";
import { Paperclip, X } from "lucide-react";
import ChatAttachments from "./ChatAttachments";

const GroupConversation = () => {
    const { id } = useParams();
    const { isSidebarCollapsed } = useLayout();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const paperclipRef = useRef(null);

    const [activeTab, setActiveTab] = useState("chat");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [attachments, setAttachments] = useState([]);
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
    }, [activeTab])

    const sendMessages = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const payload = new FormData();
        payload.append("message[body]", input);
        payload.append("message[project_space_id]", id);
        attachments.forEach((attachment) => {
            payload.append("message[attachments][]", attachment);
        });

        try {
            const response = await dispatch(
                sendMessage({ baseUrl, token, data: payload })
            ).unwrap();
            setMessages([...messages, response]);
            setInput("");
            setAttachments([]);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setAttachments((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
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

                <button className="text-sm flex items-center space-x-1">
                    <span className="text-xl text-black">&larr;</span>
                    <span className="text-[#C72030]">Back</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === "chat" && id && <Chats messages={messages} />}
                {activeTab === "task" && <ChatTasks />}
                {activeTab === "attachments" && <ChatAttachments />}
            </div>

            {activeTab === "chat" && (
                <div
                    className={`w-[calc(100vw-${isSidebarCollapsed ? "20rem" : "32rem"
                        })] mx-auto px-6 py-4 flex items-center space-x-2`}
                >
                    <div className="relative flex-1 bg-white rounded-2xl shadow-md p-3 flex flex-col">
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
                            placeholder="Type here and hit enter"
                            className="w-full bg-transparent py-1 pr-2 pl-8 text-sm focus:outline-none resize-none max-h-24 overflow-y-auto"
                            rows={1}
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

                        <Paperclip
                            className="absolute bottom-[16px] left-3 text-gray-500 cursor-pointer"
                            size={18}
                            onClick={() => paperclipRef.current.click()}
                        />
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            ref={paperclipRef}
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
            )}
        </div>
    );
};

export default GroupConversation;