import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileCard, FileItem } from "./DocumentFileCard";

interface FileGridProps {
    files: FileItem[];
    selectedFiles: string[];
    onSelectFile: (id: string) => void;
    onSelectAll: () => void;
    viewMode: "grid" | "list";
}

export const FileGrid = ({
    files,
    selectedFiles,
    onSelectFile,
    onSelectAll,
    viewMode
}: FileGridProps) => {
    const allSelected = files.length > 0 && selectedFiles.length === files.length;

    if (viewMode === "list") {
        return (
            <div className="flex flex-col">
                {/* List Header */}
                <div className="flex items-center gap-4 px-4 py-2 border-b border-border text-sm text-muted-foreground">
                    <Checkbox
                        checked={allSelected}
                        onCheckedChange={onSelectAll}
                        className="border-muted-foreground"
                    />
                    <div className="flex items-center gap-1 flex-1">
                        <span>Name</span>
                        <ChevronDown className="h-3 w-3" />
                    </div>
                    <span className="w-24">Size</span>
                    <span className="w-32">Modified</span>
                    <div className="w-10" />
                </div>

                {/* List Items */}
                <div className="flex flex-col">
                    {files.map((file, index) => (
                        <FileCard
                            key={file.id}
                            file={file}
                            selected={selectedFiles.includes(file.id)}
                            onSelect={onSelectFile}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Grid Header */}
            <div className="flex items-center gap-4 px-3 py-2 border-b border-border text-sm text-muted-foreground">
                <Checkbox
                    checked={allSelected}
                    onCheckedChange={onSelectAll}
                    className="border-muted-foreground"
                />
                <div className="flex items-center gap-1 flex-1">
                    <span>Name</span>
                    <ChevronDown className="h-3 w-3" />
                </div>
                <span>Size</span>
                <span>Modified</span>
            </div>

            {/* Grid Items */}
            <div className={cn(
                "grid gap-2 p-2",
                "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            )}>
                {files.map((file, index) => (
                    <FileCard
                        key={file.id}
                        file={file}
                        selected={selectedFiles.includes(file.id)}
                        onSelect={onSelectFile}
                        viewMode={viewMode}
                    />
                ))}
            </div>
        </div>
    );
};
