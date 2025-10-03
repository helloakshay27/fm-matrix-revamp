import Chats from "@/components/Chats";
import { useState } from "react";
import { useParams } from "react-router-dom"

const DMConversation = () => {
    const { id } = useParams();

    const [activeTab, setActiveTab] = useState("chat");
    const [input, setInput] = useState("")

    return (
        <div className="flex flex-col h-[calc(100vh-112px)] w-[calc(100vw-32rem)] min-w-0 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b ">
                <div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-[#F2EEE9] flex items-center justify-center text-[#C72030] font-semibold">
                            U
                        </div>
                        <h2 className="text-lg font-medium text-black">User</h2>
                    </div>
                    <div className="flex space-x-6 mt-2 ml-1 text-sm font-medium text-gray-500">
                        <span
                            className={`cursor-pointer ${activeTab === 'chat' ? 'text-black border-b-2 border-black pb-1' : ''}`}
                            onClick={() => setActiveTab("chat")}
                        >
                            Chat
                        </span>
                        <span
                            className={`cursor-pointer ${activeTab === 'task' ? 'text-black border-b-2 border-black pb-1' : ''}`}
                            onClick={() => setActiveTab("task")}
                        >
                            Tasks
                        </span>
                        <span
                            className={`cursor-pointer ${activeTab === 'shared' ? 'text-black border-b-2 border-black pb-1' : ''}`}
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
                {activeTab === "chat" && id && (
                    <Chats />
                )}
                {activeTab === "task" && <>Tasks</>}
                {activeTab === "shared" && <>Shared</>}
            </div>

            {
                activeTab === 'chat' && (
                    <div>
                        <div className="w-[calc(100vw-32rem)] mx-auto px-6 py-6 flex items-center space-x-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Type here and hit enter"
                                    className="w-full bg-white rounded-full px-4 py-4 pr-10 text-sm focus:outline-none shadow-md"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                // onKeyDown={(e) => {
                                //     if (e.key === "Enter") sendMessage(e);
                                // }}
                                />
                            </div>
                            <button
                                type="button"
                                className="text-gray-500 text-xl"
                            >
                                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                                    <path
                                        d="M4.25 28.3332V19.8332L15.5833 16.9998L4.25 14.1665V5.6665L31.1667 16.9998L4.25 28.3332Z"
                                        fill="#C72030"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default DMConversation