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
        <div className="bg-[#fafafa] flex">
            <ChannelSidebar />
            <Outlet />
        </div>
    );
};