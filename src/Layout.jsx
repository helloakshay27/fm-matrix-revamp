import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";
import SetupSidebar from "./components/SetupSidebar";

const Layout = ({ children, isSidebarOpen, setIsSidebarOpen }) => {
    const { pathname } = useLocation();
    console.log(pathname);

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
