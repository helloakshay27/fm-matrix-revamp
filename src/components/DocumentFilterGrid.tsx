import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileCard, FileItem } from "./DocumentFileCard";
import { generateId } from "./DocumentUploadButton";
import { useState } from "react";
import Folder from "./Folder";

interface FileGridProps {
    files: FileItem[];
    selectedFiles: string[];
    onSelectFile: (id: string) => void;
    onSelectAll: () => void;
    viewMode: "grid" | "list" | "tree";
}

export const FileGrid = ({
    files,
    selectedFiles,
    onSelectFile,
    onSelectAll,
    viewMode
}: FileGridProps) => {
    const allSelected = files.length > 0 && selectedFiles.length === files.length;

    const [treeData, setTreeData] = useState([
        {
            id: 'root',
            name: 'PROJECTS',
            type: 'folder',
            children: [],
        },
    ]);

    const addFolder = (parentId, newFolder) => {
        const add = (nodes) =>
            nodes.map((node) => {
                if (node.id === parentId && node.type === 'folder') {
                    return { ...node, children: [...node.children, newFolder] };
                }
                if (node.children) {
                    return { ...node, children: add(node.children) };
                }
                return node;
            });
        setTreeData((prev) => add(prev));
    };

    const uploadFile = (folderId, fileName) => {
        const add = (nodes) =>
            nodes.map((node) => {
                if (node.id === folderId && node.type === 'folder') {
                    return {
                        ...node,
                        children: [...node.children, { id: generateId(), name: fileName, type: 'file' }],
                    };
                }
                if (node.children) {
                    return { ...node, children: add(node.children) };
                }
                return node;
            });
        setTreeData((prev) => add(prev));
    };

    if (viewMode === "tree") {
        return (
            <div className="p-4">
                <button
                    onClick={() =>
                        addFolder('root', {
                            id: generateId(),
                            name: 'New Folder',
                            type: 'folder',
                            children: [],
                        })
                    }
                    className="bg-[#c72030] text-white px-3 py-1 text-sm rounded mb-3"
                >
                    + Add
                </button>

                {treeData.map((folder) => (
                    <Folder key={folder.id} data={folder} onAddFolder={addFolder} onUploadFile={uploadFile} />
                ))}
            </div>
        );
    }

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
