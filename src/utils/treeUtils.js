// export const updateTree = (tree, folderId, newNode) => {
//     return tree.map((node) => {
//         if (node.id === folderId && node.type === "folder") {
//             return { ...node, children: [...node.children, newNode] };
//         } else if (node.children) {
//             return {
//                 ...node,
//                 children: updateTree(node.children, folderId, newNode),
//             };
//         }
//         return node;
//     });
// };

// export const generateId = () => Date.now() + Math.random();


export const generateId = () => Math.random().toString(36).substr(2, 9);
