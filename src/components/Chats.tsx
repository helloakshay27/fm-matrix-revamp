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
import { ClipboardPlus, X } from "lucide-react";
import CreateChatTask from "./CreateChatTask";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { createChatTask } from "@/store/slices/channelSlice";
import { useParams } from "react-router-dom";

const Chats = ({ messages }) => {
    const { id } = useParams()
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
            await dispatch(createChatTask({ baseUrl, token, data: payload })).unwrap();
            toast.success("Chat task created successfully");
            setOpenTaskModal(false);
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
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
                                    <div className="bg-white rounded-2xl px-4 py-2 text-sm shadow max-w-xs">
                                        {message.body}
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
                                setOpenTaskModal(true); // 👈 open MUI modal instead
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
