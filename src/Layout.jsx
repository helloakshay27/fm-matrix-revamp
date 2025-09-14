import Sidebar from "./components/Home/Sidebar";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";
import SetupSidebar from "./components/SetupSidebar";

const Layout = ({ children, isSidebarOpen, setIsSidebarOpen }) => {
    const { pathname } = useLocation();

    // Check if the current path is a cloud portal route
    const isCloudPortal = pathname.startsWith("/cloud-");

    // If it's a cloud portal route, render without sidebar and header
    if (isCloudPortal) {
        return (
            <div className="h-screen w-screen">
                <main className="relative overflow-auto w-full h-full">
                    {children}
                </main>
            </div>
        );
    }

    // Regular layout with sidebar and header
    return (
        <div className="h-screen w-screen">
            <Navbar />
            <div className="flex h-[calc(100vh-58px)] w-screen">
                {pathname.startsWith("/setup") ? (
                    <SetupSidebar
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                ) : (
                    <Sidebar
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                )}
                <main
                    className={`relative overflow-auto ${isSidebarOpen ? "w-[calc(100vw-14rem)]" : "w-full"
                        }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
