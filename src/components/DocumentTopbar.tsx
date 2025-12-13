import { Menu, Folder, Plus, List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopBarProps {
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    onNewClick: () => void;
    onToggleSidebar: () => void;
}

export const TopBar = ({ viewMode, onViewModeChange, onNewClick, onToggleSidebar }: TopBarProps) => {
    return (
        <header className="flex h-14 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={onToggleSidebar}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2 ml-2">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                        <Folder className="h-4 w-4 text-primary" />
                        <span>All files</span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-4 text-primary hover:text-primary hover:bg-primary/10 font-medium"
                    onClick={onNewClick}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                </Button>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "text-muted-foreground hover:text-foreground",
                        viewMode === "list" && "bg-secondary text-foreground"
                    )}
                    onClick={() => onViewModeChange("list")}
                >
                    <List className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "text-muted-foreground hover:text-foreground",
                        viewMode === "grid" && "bg-secondary text-foreground"
                    )}
                    onClick={() => onViewModeChange("grid")}
                >
                    <Grid3X3 className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
};
