import { useState } from "react";
import { useParams } from "react-router-dom"

const DMConversation = () => {
    const { id } = useParams();

    const [activeTab, setActiveTab] = useState("chat");

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
                    <>Chat</>
                )}
                {activeTab === "task" && <>Tasks</>}
                {activeTab === "shared" && <>Shared</>}
            </div>
        </div>
    )
}

export default DMConversation