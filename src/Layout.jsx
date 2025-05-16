import { useState } from "react"
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const Layout = ({ children, isSidebarOpen, setIsSidebarOpen }) => {

    return (
        <div className="h-screen w-screen">
            <Navbar />
            <div className="flex h-[calc(100vh-58px)] w-screen">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className={`relative overflow-auto ${isSidebarOpen ? "w-[calc(100vw-13rem)]" : "w-full"}`}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout