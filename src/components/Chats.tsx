import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardPlus, FileText, X } from "lucide-react";
import CreateChatTask from "./CreateChatTask";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { createChatTask } from "@/store/slices/channelSlice";
import { useParams } from "react-router-dom";

const Chats = ({ messages }) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const bottomRef = useRef(null);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [openTaskModal, setOpenTaskModal] = useState(false);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleCreateTask = async (payload) => {
        try {
            await dispatch(
                createChatTask({ baseUrl, token, data: payload })
            ).unwrap();
            toast.success("Chat task created successfully");
            setOpenTaskModal(false);
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    const renderAttachments = (attachments) => {
        if (!attachments || attachments.length === 0) return null;

        const imageFiles = attachments.filter((a) =>
            a?.content_type?.startsWith("image/")
        );
        const otherFiles = attachments.filter(
            (a) => !a?.content_type?.startsWith("image/")
        );

        return (
            <div className="mt-2 space-y-2">
                {/* 🖼️ Image Grid */}
                {imageFiles.length > 0 && (
                    <div
                        className={`grid gap-2 ${imageFiles.length === 1
                            ? "grid-cols-1"
                            : imageFiles.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2"
                            }`}
                    >
                        {imageFiles.slice(0, 4).map((file, i) => {
                            const url = file?.url || file;
                            const name = file?.filename || url?.split("/").pop();
                            const extraCount =
                                imageFiles.length > 4 ? imageFiles.length - 4 : 0;

                            return (
                                <div
                                    key={i}
                                    className="relative group overflow-hidden rounded-lg shadow-sm border border-gray-200"
                                >
                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={url}
                                            alt={name}
                                            className="object-cover w-full h-32 sm:h-40 transition-transform duration-200 group-hover:scale-105"
                                        />
                                        {i === 3 && extraCount > 0 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium text-lg">
                                                +{extraCount} more
                                            </div>
                                        )}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 📄 File Attachments */}
                {otherFiles.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {otherFiles.map((file, i) => {
                            const url = file?.url || file;
                            const name = file?.filename || url?.split("/").pop();

                            return (
                                <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 border border-gray-200 transition"
                                >
                                    <FileText className="w-4 h-4 text-gray-600" />
                                    <span className="truncate max-w-[150px]">{name}</span>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 w-full bg-[#F9F9F9] overflow-y-auto max-h-[calc(100vh-160px)]">
            {[...messages].reverse().map((message, index) => {
                const isMe =
                    message?.user_id?.toString() === localStorage.getItem("userId");

                return (
                    <div
                        key={index}
                        className={`mb-6 flex flex-col ${isMe ? "items-end" : "items-start"
                            }`}
                    >
                        <div
                            className={`text-xs text-gray-500 mb-2 ${isMe ? "mr-12" : "ml-12"
                                }`}
                        >
                            {message.created_at &&
                                format(message.created_at, "dd MMM yyyy, hh:mm a")}
                        </div>

                        <ContextMenu>
                            <ContextMenuTrigger asChild>
                                <div className="flex items-start space-x-3 cursor-pointer">
                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-sm flex items-center justify-center mt-[2px]">
                                            {(message.user_name || "U")[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-2xl px-4 py-2 text-sm shadow max-w-xs bg-white`}
                                    >
                                        {renderAttachments(message.attachments)}
                                        {message.body && (
                                            <div
                                                className={`whitespace-pre-line break-words ${message.attachments?.length > 0 ? "mt-2" : ""
                                                    }`}
                                            >
                                                {message.body}
                                            </div>
                                        )}
                                    </div>
                                    {isMe && (
                                        <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-sm flex items-center justify-center mt-[2px]">
                                            {(message.user_name || "U")[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </ContextMenuTrigger>

                            <ContextMenuContent className="w-48 rounded-lg p-1 shadow-lg">
                                <ContextMenuItem
                                    onClick={() => setSelectedMessage(message)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                >
                                    <ClipboardPlus className="w-4 h-4 text-gray-600" />
                                    <span>Create Task</span>
                                </ContextMenuItem>

                                <ContextMenuSeparator />

                                <ContextMenuItem
                                    inset
                                    onClick={() => { }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                    <span>Cancel</span>
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    </div>
                );
            })}

            <Dialog
                open={!!selectedMessage}
                onOpenChange={() => setSelectedMessage(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create a Task</DialogTitle>
                        <DialogDescription>
                            Do you want to create a task for this message?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                        {selectedMessage?.body}
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                            No
                        </Button>
                        <Button
                            onClick={() => {
                                setSelectedMessage(null);
                                setOpenTaskModal(true);
                            }}
                        >
                            Yes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CreateChatTask
                openTaskModal={openTaskModal}
                setOpenTaskModal={setOpenTaskModal}
                onCreateTask={handleCreateTask}
                message={selectedMessage}
                id={id}
            />

            <div ref={bottomRef} className="h-0" />
        </div>
    );
};

export default Chats;
