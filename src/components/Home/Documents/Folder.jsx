import { useState } from "react";
import UploadButton from "./UploadButton";
import { generateId } from "../../../utils/treeUtils";

const Folder = ({ data, onAddFolder, onUploadFile }) => {
    const [expanded, setExpanded] = useState(true);

    const handleAddFolder = () => {
        const name = prompt("Folder name:");
        if (name) {
            const newFolder = {
                id: generateId(),
                name,
                type: "folder",
                children: [],
            };
            onAddFolder(data.id, newFolder);
        }
    };

    return (
        <div className="ml-4 mb-2">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center justify-center w-5 h-5"
                    aria-label={expanded ? "Collapse folder" : "Expand folder"}
                >
                    {expanded ? "📂" : "📁"}
                </button>
                <span className="font-semibold text-sm">{data.name}</span>
                <button
                    onClick={handleAddFolder}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md cursor-pointer hover:bg-blue-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-150"
                    aria-label="Add new folder"
                >
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Folder
                </button>
                <UploadButton folderId={data.id} onUpload={onUploadFile} />
            </div>

            {expanded && (
                <div className="ml-6 mt-3">
                    {data.children.map((item) =>
                        item.type === "folder" ? (
                            <Folder
                                key={item.id}
                                data={item}
                                onAddFolder={onAddFolder}
                                onUploadFile={onUploadFile}
                            />
                        ) : (
                            <div key={item.id} className="text-sm ml-6 flex items-center gap-1 mt-3">
                                📄 {item.name}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Folder;