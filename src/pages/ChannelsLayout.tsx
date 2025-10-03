import ChannelSidebar from "@/components/ChannelSidebar";
import { Outlet } from "react-router-dom";

export const ChannelsLayout = () => {
    return (
        <div
            className="bg-[#fafafa] flex"
        >
            <ChannelSidebar />
            <Outlet />
        </div>
    );
};