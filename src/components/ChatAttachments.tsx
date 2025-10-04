import { useAppDispatch } from "@/store/hooks";
import { fetchConversationMessages } from "@/store/slices/channelSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { FileIcon, ImageIcon } from "lucide-react";

const ChatAttachments = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [attachments, setAttachments] = useState([]);

    const fetchAttachments = async () => {
        try {
            const response = await dispatch(
                fetchConversationMessages({
                    baseUrl,
                    token,
                    id,
                    per_page: 100,
                    page: 1,
                    param: "conversation_id_eq",
                    attachments_id_null: true,
                })
            ).unwrap();

            const allAttachments = response.messages
                ?.map((msg) => msg.attachments || [])
                .flat()
                .filter((a) => a && a.url);

            setAttachments(allAttachments);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch attachments");
        }
    };

    useEffect(() => {
        fetchAttachments();
    }, [id]);

    const isImage = (doctype = "") => doctype.startsWith("image/");
    const isVideo = (doctype = "") => doctype.startsWith("video/");
    const isPdf = (doctype = "") => doctype === "application/pdf";

    return (
        <div className="p-4">
            {attachments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-10">
                    No attachments found
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {attachments.map((file, index) => (
                        <div
                            key={index}
                            className="relative group bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all"
                        >
                            {isImage(file.doctype) ? (
                                <img
                                    src={file.url}
                                    alt={`attachment-${file.id}`}
                                    className="w-full h-40 object-cover"
                                />
                            ) : isVideo(file.doctype) ? (
                                <video
                                    src={file.url}
                                    controls
                                    className="w-full h-40 object-cover"
                                />
                            ) : isPdf(file.doctype) ? (
                                <div className="flex flex-col items-center justify-center h-40 bg-gray-100 text-gray-700">
                                    <FileIcon className="w-8 h-8 mb-2 text-red-500" />
                                    <span className="text-xs truncate w-28 text-center">
                                        {file.url.split("/").pop()}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 bg-gray-100 text-gray-700">
                                    <ImageIcon className="w-8 h-8 mb-2 text-blue-500" />
                                    <span className="text-xs truncate w-28 text-center">
                                        {file.url.split("/").pop()}
                                    </span>
                                </div>
                            )}

                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                                    View
                                </span>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatAttachments;
