import ChannelSidebar from "@/components/ChannelSidebar";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const ChannelsLayout = () => {
    const { setIsSidebarCollapsed } = useLayout();

    useEffect(() => {
        setIsSidebarCollapsed(true);
    }, []);

    return (
        <div className="bg-[#fafafa] flex">
            <ChannelSidebar />
            <Outlet />
        </div>
    );
};