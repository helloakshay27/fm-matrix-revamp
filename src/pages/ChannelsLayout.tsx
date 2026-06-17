import ChannelSidebar from "@/components/ChannelSidebar";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const ChannelsLayout = () => {
    const { setCurrentSection } = useLayout();

    const view = localStorage.getItem("selectedView");

    useEffect(() => {
        setCurrentSection(view === "admin" ? "Value Added Services" : "Project Task");
    }, [setCurrentSection]);

    return (
        <div className="bg-[#fafafa] flex flex-col md:flex-row min-w-0 max-w-full overflow-x-hidden">
            <ChannelSidebar />
            <div className="min-w-0 flex-1">
                <Outlet />
            </div>
        </div>
    );
};