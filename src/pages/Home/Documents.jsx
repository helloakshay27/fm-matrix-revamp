import { useState } from "react";
import Folder from "../../components/Home/Documents/Folder";
import { updateTree, generateId } from "../../utils/treeUtils";

const Documents = () => {
    const [tree, setTree] = useState([
        {
            id: generateId(),
            name: "Root",
            type: "folder",
            children: [],
        },
    ]);

    const handleAddFolder = (parentId, newFolder) => {
        setTree((prev) => updateTree(prev, parentId, newFolder));
    };

    const handleUploadFile = (parentId, newFile) => {
        setTree((prev) => updateTree(prev, parentId, newFile));
    };

    return (
        <div className="p-6 bg-white shadow-md rounded min-h-screen">
            <h1 className="text-xl font-bold mb-4">📁 Document Uploader</h1>
            {tree.map((node) => (
                <Folder
                    key={node.id}
                    data={node}
                    onAddFolder={handleAddFolder}
                    onUploadFile={handleUploadFile}
                />
            ))}
        </div>
    );
}

export default Documents