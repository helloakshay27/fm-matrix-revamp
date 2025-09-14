const UploadButton = ({ folderId, onUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) onUpload(folderId, file.name);
    };

    return (
        <label className="text-xs text-[#c72030] border border-[#c72030] rounded-sm px-2 cursor-pointer ml-2">
            +File
            <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
    );
};

export default UploadButton;
