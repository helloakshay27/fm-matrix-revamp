import { useState } from "react";
import UploadButton from "../../../components/Home/Documents/UploadButton";
import { generateId } from "../../../utils/treeUtils";
import CloseIcon from '@mui/icons-material/Close';

const FolderNameModal = ({ isOpen, onClose, onSubmit }) => {
    const [folderName, setFolderName] = useState("");

    const handleSubmit = () => {
        if (folderName.trim()) {
            onSubmit(folderName.trim());
            setFolderName("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
            <div className="w-[560px] h-[280px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">
                {/* Close Icon */}
                <div className="flex justify-end p-4">
                    <CloseIcon className="cursor-pointer" onClick={onClose} />
                </div>

                {/* Input Section */}
                <div className="px-6">
                    <label className="block text-[14px] text-[#1B1B1B] mb-3">
                        Add New Folder
                    </label>
                    <input
                        type="text"
                        placeholder="Enter role name here..."
                        className="border border-[#C0C0C0] w-full px-4 py-3 text-[#1B1B1B] text-[13px]"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                </div>

                {/* Footer Buttons */}
                <div className="absolute bg-[#D5DBDB] bottom-0 left-0 right-0 h-[90px] flex justify-center items-center gap-4">
                    <button
                        className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
                        onClick={handleSubmit}
                    >
                        Create
                    </button>
                    <button
                        className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const Folder = ({ data, onAddFolder, onUploadFile }) => {
    const [expanded, setExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddFolder = (name) => {
        const newFolder = {
            id: generateId(),
            name,
            type: "folder",
            children: [],
        };
        onAddFolder(data.id, newFolder);
    };

    return (
        <div className="relative pl-4 border-l border-dotted border-gray-400">
            <div className="relative flex items-center gap-2 py-1 before:absolute before:top-1/2 before:-left-4 before:w-4 before:border-t border-dotted border-gray-400">
                <span
                    className="cursor-pointer text-sm"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "▾" : "▸"}
                </span>
                <span className="text-sm">{data.name}</span>
                <button
                    className="text-xs bg-[#c72030] text-white px-2 py-0.5 rounded hover:bg-[#a91b27] transition-colors duration-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Folder
                </button>
                <UploadButton folderId={data.id} onUpload={onUploadFile} />
            </div>

            {expanded && (
                <div className="ml-4">
                    {data.children.map((item) =>
                        item.type === "folder" ? (
                            <Folder
                                key={item.id}
                                data={item}
                                onAddFolder={onAddFolder}
                                onUploadFile={onUploadFile}
                            />
                        ) : (
                            <div
                                key={item.id}
                                className="relative ml-4 text-sm py-0.5 before:absolute before:top-1/2 before:-left-4 before:w-4 before:border-t border-dotted border-gray-400"
                            >
                                {item.name}
                            </div>
                        )
                    )}
                </div>
            )}

            <FolderNameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddFolder}
            />
        </div>
    );
};

export default Folder;
