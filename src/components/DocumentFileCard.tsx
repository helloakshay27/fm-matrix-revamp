import { Folder, MoreHorizontal, FileText, Image, FileCode } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FileItem {
    id: string;
    name: string;
    type: "folder" | "file" | "image" | "document";
    modified: string;
    size?: string;
    preview?: string;
}

interface FileCardProps {
    file: FileItem;
    selected: boolean;
    onSelect: (id: string) => void;
    viewMode: "grid" | "list";
}

const getFileIcon = (type: FileItem["type"], className: string) => {
    switch (type) {
        case "folder":
            return null;
        case "image":
            return <Image className={className} />;
        case "document":
            return <FileText className={className} />;
        default:
            return <FileCode className={className} />;
    }
};

export const FileCard = ({ file, selected, onSelect, viewMode }: FileCardProps) => {
    if (viewMode === "list") {
        return (
            <div
                className={cn(
                    "group flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 hover:bg-secondary/50",
                    selected && "bg-secondary"
                )}
            >
                <Checkbox
                    checked={selected}
                    onCheckedChange={() => onSelect(file.id)}
                    className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />

                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {file.type === "folder" ? (
                        <div className="h-8 w-8 rounded bg-folder flex items-center justify-center">
                            <Folder className="h-4 w-4 text-background" />
                        </div>
                    ) : (
                        <div className="h-8 w-8 rounded bg-card flex items-center justify-center">
                            {getFileIcon(file.type, "h-4 w-4 text-muted-foreground")}
                        </div>
                    )}
                    <span className="text-sm font-medium truncate">{file.name}</span>
                </div>

                <span className="text-sm text-muted-foreground w-24">{file.size || "—"}</span>
                <span className="text-sm text-muted-foreground w-32">{file.modified}</span>

                <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "group relative flex flex-col rounded-xl transition-all duration-200 hover:bg-secondary/30 p-3 animate-fade-in",
                selected && "bg-secondary/50"
            )}
        >
            <div className="absolute top-4 left-4 z-10">
                <Checkbox
                    checked={selected}
                    onCheckedChange={() => onSelect(file.id)}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary bg-background/80"
                />
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                {file.type === "folder" ? (
                    <div className="w-full h-full bg-folder/90 flex items-end justify-center pb-4">
                        <Folder className="h-12 w-12 text-muted-foreground" />
                    </div>
                ) : file.preview ? (
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${file.preview})` }}
                    />
                ) : (
                    <div className="w-full h-full bg-card flex items-center justify-center">
                        {getFileIcon(file.type, "h-12 w-12 text-muted-foreground")}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{file.modified}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground h-8 w-8"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
