import {
    Folder,
    User,
    Clock,
    Star,
    Users,
    Tag,
    FolderOpen,
    Trash2,
    HardDrive,
    Settings,
    ChevronDown,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    hasDropdown?: boolean;
    onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, hasDropdown, onClick }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={cn(
            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            active
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-border/50"
        )}
    >
        <div className="flex items-center gap-3">
            {icon}
            <span>{label}</span>
        </div>
        {hasDropdown && <ChevronDown className="h-4 w-4 opacity-60" />}
    </button>
);

interface SidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const mainNavItems = [
        { id: "all", icon: <Folder className="h-4 w-4" />, label: "All files" },
        { id: "personal", icon: <User className="h-4 w-4" />, label: "Personal files" },
        { id: "recent", icon: <Clock className="h-4 w-4" />, label: "Recent" },
        { id: "favorites", icon: <Star className="h-4 w-4" />, label: "Favorites" },
        { id: "shares", icon: <Users className="h-4 w-4" />, label: "Shares", hasDropdown: true },
        { id: "tags", icon: <Tag className="h-4 w-4" />, label: "Tags" },
        { id: "folders", icon: <FolderOpen className="h-4 w-4" />, label: "All folders", hasDropdown: true },
    ];

    return (
        <aside className="flex h-full w-64 flex-col border-r border-sidebar-border">
            {/* Search */}
            <div className="p-3">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Filter file names ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 bg-sidebar-border/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-muted pr-8"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-sidebar-muted hover:text-sidebar-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-0.5">
                {mainNavItems.map((item) => (
                    <SidebarItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activeSection === item.id}
                        hasDropdown={item.hasDropdown}
                        onClick={() => onSectionChange(item.id)}
                    />
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="border-t border-sidebar-border p-2 space-y-0.5">
                <SidebarItem
                    icon={<Trash2 className="h-4 w-4" />}
                    label="Deleted files"
                    onClick={() => onSectionChange("deleted")}
                />
                <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-muted">
                    <HardDrive className="h-4 w-4" />
                    <span>35 MB used</span>
                </div>
                <SidebarItem
                    icon={<Settings className="h-4 w-4" />}
                    label="Files settings"
                    onClick={() => onSectionChange("settings")}
                />
            </div>
        </aside>
    );
};
