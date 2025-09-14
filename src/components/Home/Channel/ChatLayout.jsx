import { useEffect, useState } from "react";
import ChatView from "./views/ChatView";
import TaskView from "./views/TaskView";
import SharedView from "./views/SharedView";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchChannelById } from "../../../redux/slices/channelSlice";

const ChatLayout = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const path = useLocation().pathname;

  const { fetchChannelById: channel } = useSelector((state) => state.fetchChannelById);
  const { success } = useSelector(state => state.createMessage)

  const [activeTab, setActiveTab] = useState("chat");
  const [id, setId] = useState()

  useEffect(() => {
    if (success) {
      dispatch(fetchChannelById({ id, token, type: path.includes("group") ? "group" : "chat" }));
    }
  }, [success]);

  useEffect(() => {
    if (path.includes("group")) {
      const id = path.split("/").pop();
      setId(id)
      dispatch(fetchChannelById({ id, token, type: "group" }));
    }
    if (path.includes("chat")) {
      const id = path.split("/").pop();
      setId(id)
      dispatch(fetchChannelById({ id, token, type: "chat" }));
    }
  }, [path, dispatch]);

  return (
    <div className="flex flex-col w-full h-full min-w-0 overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b ">
        <div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#5986FF] flex items-center justify-center text-white font-semibold">
              {(channel.name || channel.receiver_name || 'U')[0].toUpperCase()}
            </div>
            <h2 className="text-lg font-medium text-black">{channel.name ? channel.name : channel.receiver_name}</h2>
          </div>
          <div className="flex space-x-6 mt-2 ml-14 text-sm font-medium text-gray-500">
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

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "chat" && id && (
          <ChatView
            channel={channel}
            type={path.includes("group") ? "group" : "chat"}
            id={id}
          />
        )}
        {activeTab === "task" && <TaskView />}
        {activeTab === "shared" && <SharedView />}
      </div>
    </div>
  );
};

export default ChatLayout;
