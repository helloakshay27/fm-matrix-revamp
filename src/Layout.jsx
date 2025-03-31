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
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className={`relative overflow-auto ${isSidebarOpen ? "w-[calc(100vw-12rem)]" : "w-full"}`}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout