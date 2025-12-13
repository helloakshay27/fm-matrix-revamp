import { generateId } from '@/components/DocumentUploadButton';
import Folder from '@/components/Folder';
import { useState } from 'react';

const ProjectDocuments = () => {
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
};

export default ProjectDocuments;
