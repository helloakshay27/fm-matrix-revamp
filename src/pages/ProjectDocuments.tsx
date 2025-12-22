import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/DocumentSidebar";
import { TopBar } from "@/components/DocumentTopbar";
import { WelcomeHeader } from "@/components/DocumentWelcomHeader";
import { FilterTabs } from "@/components/DocumentFilterTab";
import { FileGrid } from "@/components/DocumentFilterGrid";
import { FileItem } from "@/components/DocumentFileCard";

const mockFiles: FileItem[] = [
    { id: "1", name: "Templates", type: "folder", modified: "September 2" },
    { id: "2", name: "Talk", type: "folder", modified: "2 weeks ago" },
    { id: "3", name: "Photos", type: "folder", modified: "September 2" },
    { id: "4", name: "Documents", type: "folder", modified: "September 2" },
    { id: "5", name: "Templates credits.md", type: "document", modified: "September 2", size: "4 KB" },
    { id: "6", name: "Project Hub", type: "document", modified: "September 2", size: "12 KB" },
    { id: "7", name: "Welcome Guide", type: "document", modified: "September 2", size: "8 KB" },
    { id: "8", name: "User Manual", type: "document", modified: "September 2", size: "24 KB" },
    { id: "9", name: "Brand Assets", type: "folder", modified: "September 2" },
    { id: "10", name: "Archive", type: "folder", modified: "August 15" },
];

const Index = () => {
    const [activeSection, setActiveSection] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list" | "tree">("grid");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleSelectFile = (id: string) => {
        setSelectedFiles((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedFiles.length === mockFiles.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(mockFiles.map((f) => f.id));
        }
    };

    const handleNewClick = () => {
        console.log("New file/folder clicked");
    };

    return (
        <div className="flex h-[calc(100vh-65px)] w-full bg-background overflow-hidden">
            {/* Sidebar */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                sidebarOpen ? "w-64" : "w-0"
            )}>
                {sidebarOpen && (
                    <Sidebar
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                    />
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onNewClick={handleNewClick}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="p-6">
                        <WelcomeHeader />
                        <FilterTabs />
                        <FileGrid
                            files={mockFiles}
                            selectedFiles={selectedFiles}
                            onSelectFile={handleSelectFile}
                            onSelectAll={handleSelectAll}
                            viewMode={viewMode}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Index;
