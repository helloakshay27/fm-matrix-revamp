import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { fetchMomDetails, removeMomAttachment } from "../../../redux/slices/momSlice";

const MomAttachments = ({ attachments, id }) => {
    const dispatch = useDispatch();

    const handleRemoveAttachment = async (attachmentId) => {
        const token = localStorage.getItem("token");
        try {
            await dispatch(removeMomAttachment({ token, id, image_id: attachmentId })).unwrap();
            toast.dismiss();
            toast.success("File removed successfully.");
            await dispatch(fetchMomDetails({ token, id })).unwrap();
        } catch (error) {
            console.error("File upload or task fetch failed:", error);
            toast.error("Failed to remove file. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-3 p-5">
            {attachments.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
                        {attachments.map((file, index) => {
                            const fileName = file.document_file_name;
                            const fileUrl = file.document_url;
                            const fileExt = fileName.split('.').pop().toLowerCase();
                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExt);
                            const isPdf = fileExt === 'pdf';
                            const isWord = ['doc', 'docx'].includes(fileExt);
                            const isExcel = ['xls', 'xlsx'].includes(fileExt);

                            return (
                                <div
                                    key={index}
                                    className="border rounded p-2 flex flex-col items-center justify-center text-center shadow-sm bg-white relative"
                                >
                                    <Trash2 size={20} color="#C72030" className="absolute top-1 right-1 cursor-pointer" onClick={() => { handleRemoveAttachment(file.id) }} />
                                    {/* Preview or icon */}
                                    <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
                                        {isImage ? (
                                            <img src={fileUrl} alt={fileName} className="object-contain h-full" />
                                        ) : isPdf ? (
                                            <span className="text-red-600 font-bold">PDF</span>
                                        ) : isWord ? (
                                            <span className="text-blue-600 font-bold">DOC</span>
                                        ) : isExcel ? (
                                            <span className="text-green-600 font-bold">XLS</span>
                                        ) : (
                                            <span className="text-gray-500 font-bold">FILE</span>
                                        )}
                                    </div>

                                    {/* File name and link */}
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={fileName}
                                        className="text-xs text-blue-700 hover:underline truncate w-full"
                                        title={fileName}
                                    >
                                        {fileName}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="text-[14px] mt-2">
                    <span>No Documents Attached</span>
                </div>
            )}
        </div>
    );
};

export default MomAttachments;