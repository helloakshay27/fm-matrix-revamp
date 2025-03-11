import { ChevronRight } from "lucide-react"
import { useState } from "react"
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-screen w-screen">
            <Navbar />
            <div className="flex h-[calc(100vh-66px)] w-screen">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main className={`relative ${isSidebarOpen ? "w-[calc(100vw-12rem)]" : "w-full"}`}>
                    <span
                        className={`w-8 h-8 rounded-r-full bg-white shadow-lg shadow-gray-500/50 flex items-center justify-end cursor-pointer absolute top-3 left-0 pr-2 opacity-30 hover:opacity-100 transition-all ${isSidebarOpen ? "hidden" : ""
                            }`}
                        onClick={() => {
                            setIsSidebarOpen(true);
                        }}
                    >
                        <ChevronRight size={20} />
                    </span>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout