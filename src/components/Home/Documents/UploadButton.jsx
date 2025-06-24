// import { generateId } from "../../../utils/treeUtils";

// const UploadButton = ({ folderId, onUpload }) => {
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const newFile = {
//                 id: generateId(),
//                 name: file.name,
//                 type: "file",
//             };
//             onUpload(folderId, newFile);
//         }
//     };

//     return (
//         <label className="text-xs text-green-600 cursor-pointer">
//             Upload
//             <input type="file" className="hidden" onChange={handleFileChange} />
//         </label>
//     );
// };

// export default UploadButton;



import { generateId } from "../../../utils/treeUtils";

const UploadButton = ({ folderId, onUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newFile = {
                id: generateId(),
                name: file.name,
                type: "file",
            };
            onUpload(folderId, newFile);
        }
    };

    return (
        <label
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-md cursor-pointer hover:bg-green-200 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-150"
            aria-label="Upload file"
        >
            <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 111.414 1.414l-4 4.5a1 1 0 01-1.414 0l-4-4.5a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
                <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v8a1 1 0 11-2 0V4a1 1 0 011-1z"
                    clipRule="evenodd"
                />
            </svg>
            Upload
            <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
            />
        </label>
    );
};

export default UploadButton;