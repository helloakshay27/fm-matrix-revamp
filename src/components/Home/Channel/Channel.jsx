import ChatLayout from "./ChatLayout";
import SideBar from "./SideBar";

const Channel = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <ChatLayout />
      </div>
    </div>

  );
};

export default Channel;
