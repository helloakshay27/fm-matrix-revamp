// import { format } from "date-fns";
// import { useEffect, useRef, useState } from "react";
// import {
//     ContextMenu,
//     ContextMenuContent,
//     ContextMenuItem,
//     ContextMenuSeparator,
//     ContextMenuTrigger,
// } from "@/components/ui/context-menu";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { ClipboardPlus, FileText, X, Reply, Forward, Search, Users, MessageCircle } from "lucide-react";
// import CreateChatTask from "./CreateChatTask";
// import { toast } from "sonner";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { createChatTask, sendMessage } from "@/store/slices/channelSlice";
// import { useParams } from "react-router-dom";

// const Chats = ({ messages, onReply }) => {
//     const { id } = useParams();
//     const dispatch = useAppDispatch();
//     const token = localStorage.getItem("token");
//     const baseUrl = localStorage.getItem("baseUrl");
//     const currentUserId = localStorage.getItem("userId");
//     const bottomRef = useRef(null);

//     const { data: conversations } = useAppSelector(state => state.fetchConversations)
//     const { data: groups } = useAppSelector(state => state.fetchGroups)

//     const [selectedMessage, setSelectedMessage] = useState(null);
//     const [openTaskModal, setOpenTaskModal] = useState(false);
//     const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
//     const [showActions, setShowActions] = useState(false);
//     const [showForwardDialog, setShowForwardDialog] = useState(false);
//     const [messageToForward, setMessageToForward] = useState(null);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedForwardTargets, setSelectedForwardTargets] = useState([]);
//     const hoverTimeoutRef = useRef(null);

//     useEffect(() => {
//         if (bottomRef.current) {
//             bottomRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }, [messages]);

//     useEffect(() => {
//         return () => {
//             if (hoverTimeoutRef.current) {
//                 clearTimeout(hoverTimeoutRef.current);
//             }
//         };
//     }, []);

//     const handleMouseEnter = (index) => {
//         if (hoverTimeoutRef.current) {
//             clearTimeout(hoverTimeoutRef.current);
//         }

//         setHoveredMessageIndex(index);

//         hoverTimeoutRef.current = setTimeout(() => {
//             setShowActions(true);
//         }, 300);
//     };

//     const handleMouseLeave = () => {
//         if (hoverTimeoutRef.current) {
//             clearTimeout(hoverTimeoutRef.current);
//         }

//         setShowActions(false);
//         setHoveredMessageIndex(null);
//     };

//     const handleCreateTask = async (payload) => {
//         try {
//             await dispatch(
//                 createChatTask({ baseUrl, token, data: payload })
//             ).unwrap();
//             toast.success("Chat task created successfully");
//             setOpenTaskModal(false);
//         } catch (error) {
//             console.log(error);
//             toast.error(error);
//         }
//     };

//     const handleReply = (message) => {
//         onReply(message);
//     };

//     const handleForward = (message) => {
//         setMessageToForward(message);
//         setShowForwardDialog(true);
//         setSelectedForwardTargets([]);
//         setSearchQuery("");
//     };

//     const toggleForwardTarget = (target, type) => {
//         const targetId = `${type}-${target.id}`;
//         setSelectedForwardTargets(prev => {
//             if (prev.find(t => t.id === targetId)) {
//                 return prev.filter(t => t.id !== targetId);
//             } else {
//                 return [...prev, { id: targetId, data: target, type }];
//             }
//         });
//     };

//     const handleSendForward = async () => {
//         if (selectedForwardTargets.length === 0) {
//             toast.error("Please select at least one conversation or group");
//             return;
//         }

//         try {
//             const forwardPromises = selectedForwardTargets.map(async (target) => {
//                 const payload = new FormData();
//                 payload.append("message[body]", messageToForward.body || "");
//                 payload.append("message[is_forwarded]", "true");

//                 if (target.type === "conversation") {
//                     payload.append("message[conversation_id]", target.data.id);
//                 } else {
//                     payload.append("message[project_space_id]", target.data.id);
//                 }

//                 // Forward attachments URLs if any
//                 if (messageToForward.attachments && messageToForward.attachments.length > 0) {
//                     messageToForward.attachments.forEach((attachment) => {
//                         if (attachment.url) {
//                             payload.append("message[attachment_urls][]", attachment.url);
//                         }
//                     });
//                 }

//                 return dispatch(sendMessage({ baseUrl, token, data: payload })).unwrap();
//             });

//             await Promise.all(forwardPromises);

//             toast.success(`Message forwarded to ${selectedForwardTargets.length} ${selectedForwardTargets.length === 1 ? 'chat' : 'chats'}`);
//             setShowForwardDialog(false);
//             setMessageToForward(null);
//             setSelectedForwardTargets([]);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to forward message");
//         }
//     };

//     // Find parent message by parent_id
//     const findParentMessage = (parentId) => {
//         return messages.find(msg => msg.id === parentId);
//     };

//     const filterConversations = (list, query) => {
//         if (!query.trim()) return list || [];
//         return (list || []).filter(item => {
//             const name = item.name || item.receiver_name || item.sender_name || "";
//             return name.toLowerCase().includes(query.toLowerCase());
//         });
//     };

//     const renderMessageWithMentions = (text) => {
//         if (!text) return null;

//         const mentionColors = [
//             { bg: "bg-blue-100", text: "text-blue-700", hover: "hover:bg-blue-200" },
//             {
//                 bg: "bg-green-100",
//                 text: "text-green-700",
//                 hover: "hover:bg-green-200",
//             },
//             {
//                 bg: "bg-purple-100",
//                 text: "text-purple-700",
//                 hover: "hover:bg-purple-200",
//             },
//             { bg: "bg-pink-100", text: "text-pink-700", hover: "hover:bg-pink-200" },
//             {
//                 bg: "bg-orange-100",
//                 text: "text-orange-700",
//                 hover: "hover:bg-orange-200",
//             },
//             { bg: "bg-teal-100", text: "text-teal-700", hover: "hover:bg-teal-200" },
//             {
//                 bg: "bg-indigo-100",
//                 text: "text-indigo-700",
//                 hover: "hover:bg-indigo-200",
//             },
//         ];

//         const mentionRegex = /@\*\*([^*]+)\*\*|@(\w+(?:\s+\w+)?)/g;
//         const parts = [];
//         let lastIndex = 0;
//         let match;
//         let mentionIndex = 0;

//         while ((match = mentionRegex.exec(text)) !== null) {
//             if (match.index > lastIndex) {
//                 parts.push({
//                     type: "text",
//                     content: text.substring(lastIndex, match.index),
//                 });
//             }

//             const username = match[1] || match[2];

//             parts.push({
//                 type: "mention",
//                 content: `@${username}`,
//                 username: username,
//                 colorIndex: mentionIndex % mentionColors.length,
//             });

//             mentionIndex++;
//             lastIndex = match.index + match[0].length;
//         }

//         if (lastIndex < text.length) {
//             parts.push({
//                 type: "text",
//                 content: text.substring(lastIndex),
//             });
//         }

//         if (parts.length === 0) {
//             return <span className="whitespace-pre-line break-words">{text}</span>;
//         }

//         return (
//             <span className="whitespace-pre-line break-words">
//                 {parts.map((part, index) => {
//                     if (part.type === "mention") {
//                         const color = mentionColors[part.colorIndex];
//                         return (
//                             <span
//                                 key={index}
//                                 className={`${color.bg} ${color.text} ${color.hover} px-1 rounded font-medium cursor-pointer transition-colors`}
//                                 title={`Mentioned: ${part.username}`}
//                             >
//                                 {part.content}
//                             </span>
//                         );
//                     }
//                     return <span key={index}>{part.content}</span>;
//                 })}
//             </span>
//         );
//     };

//     const renderAttachments = (attachments) => {
//         if (!attachments || attachments.length === 0) return null;

//         const imageFiles = attachments.filter((a) =>
//             a?.content_type?.startsWith("image/")
//         );
//         const otherFiles = attachments.filter(
//             (a) => !a?.content_type?.startsWith("image/")
//         );

//         return (
//             <div className="mt-2 space-y-2">
//                 {imageFiles.length > 0 && (
//                     <div
//                         className={`grid gap-2 ${imageFiles.length === 1
//                             ? "grid-cols-1"
//                             : imageFiles.length === 2
//                                 ? "grid-cols-2"
//                                 : "grid-cols-2"
//                             }`}
//                     >
//                         {imageFiles.slice(0, 4).map((file, i) => {
//                             const url = file?.url || file;
//                             const name = file?.filename || url?.split("/").pop();
//                             const extraCount =
//                                 imageFiles.length > 4 ? imageFiles.length - 4 : 0;

//                             return (
//                                 <div
//                                     key={i}
//                                     className="relative group overflow-hidden rounded-lg shadow-sm border border-gray-200"
//                                 >
//                                     <a href={url} target="_blank" rel="noopener noreferrer">
//                                         <img
//                                             src={url}
//                                             alt={name}
//                                             className="object-cover w-full h-32 sm:h-40 transition-transform duration-200 group-hover:scale-105"
//                                         />
//                                         {i === 3 && extraCount > 0 && (
//                                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium text-lg">
//                                                 +{extraCount} more
//                                             </div>
//                                         )}
//                                     </a>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}

//                 {otherFiles.length > 0 && (
//                     <div className="flex flex-col gap-2">
//                         {otherFiles.map((file, i) => {
//                             const url = file?.url || file;
//                             const name = file?.filename || url?.split("/").pop();

//                             return (
//                                 <a
//                                     key={i}
//                                     href={url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 border border-gray-200 transition"
//                                 >
//                                     <FileText className="w-4 h-4 text-gray-600" />
//                                     <span className="truncate max-w-[150px]">{name}</span>
//                                 </a>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     const renderReplyPreview = (parentMessage, isMe) => {
//         if (!parentMessage) return null;

//         return (
//             <div className={`mb-2 border-l-4 ${isMe ? 'border-gray-400 bg-gray-50' : 'border-[#C72030] bg-red-50'} rounded p-2`}>
//                 <div className="text-xs font-semibold text-gray-700 mb-1">
//                     {parentMessage.user_name}
//                 </div>
//                 <div className="text-xs text-gray-600 truncate">
//                     {parentMessage.body || "Attachment"}
//                 </div>
//             </div>
//         );
//     };

//     const filteredConversations = filterConversations(conversations, searchQuery);
//     const filteredGroups = filterConversations(groups, searchQuery);

//     return (
//         <div className="flex-1 w-full bg-[#F9F9F9] overflow-y-auto max-h-[calc(100vh-160px)]">
//             {[...messages].reverse().map((message, index) => {
//                 const isMe = message?.user_id?.toString() === currentUserId;
//                 const shouldShowActions = hoveredMessageIndex === index && showActions;
//                 const parentMessage = message.parent_id ? findParentMessage(message.parent_id) : null;

//                 return (
//                     <div
//                         key={index}
//                         className={`mb-6 flex flex-col ${isMe ? "items-end" : "items-start"
//                             }`}
//                         onMouseEnter={() => handleMouseEnter(index)}
//                         onMouseLeave={handleMouseLeave}
//                     >
//                         <div
//                             className={`text-xs text-gray-500 mb-2 ${isMe ? "mr-12" : "ml-12"
//                                 }`}
//                         >
//                             {message.created_at &&
//                                 format(message.created_at, "dd MMM yyyy, hh:mm a")}
//                         </div>

//                         <ContextMenu>
//                             <ContextMenuTrigger asChild>
//                                 <div className="flex items-start space-x-3 cursor-pointer relative">
//                                     <div
//                                         className={`absolute top-1/2 -translate-y-1/2 flex gap-1 z-10 transition-all duration-300 ease-out ${isMe ? "left-[-70px]" : "right-[-70px]"
//                                             } ${shouldShowActions
//                                                 ? "opacity-100 scale-100"
//                                                 : "opacity-0 scale-90 pointer-events-none"
//                                             }`}
//                                     >
//                                         <button
//                                             onClick={() => handleReply(message)}
//                                             className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
//                                             title="Reply"
//                                         >
//                                             <Reply className="w-4 h-4 text-gray-600" />
//                                         </button>
//                                         <button
//                                             onClick={() => handleForward(message)}
//                                             className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
//                                             title="Forward"
//                                         >
//                                             <Forward className="w-4 h-4 text-gray-600" />
//                                         </button>
//                                     </div>

//                                     {!isMe && (
//                                         <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-sm flex items-center justify-center mt-[2px]">
//                                             {(message.user_name || "U")[0].toUpperCase()}
//                                         </div>
//                                     )}
//                                     <div
//                                         className={`rounded-2xl px-4 py-2 text-sm shadow max-w-xs bg-white`}
//                                     >
//                                         {parentMessage && renderReplyPreview(parentMessage, isMe)}
//                                         {renderAttachments(message.attachments)}
//                                         {message.body && (
//                                             <div
//                                                 className={`${message.attachments?.length > 0 || parentMessage ? "mt-2" : ""
//                                                     }`}
//                                             >
//                                                 {renderMessageWithMentions(message.body)}
//                                             </div>
//                                         )}
//                                     </div>
//                                     {isMe && (
//                                         <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-sm flex items-center justify-center mt-[2px]">
//                                             {(message.user_name || "U")[0].toUpperCase()}
//                                         </div>
//                                     )}
//                                 </div>
//                             </ContextMenuTrigger>

//                             <ContextMenuContent className="w-48 rounded-lg p-1 shadow-lg">
//                                 <ContextMenuItem
//                                     onClick={() => handleReply(message)}
//                                     className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
//                                 >
//                                     <Reply className="w-4 h-4 text-gray-600" />
//                                     <span>Reply</span>
//                                 </ContextMenuItem>

//                                 <ContextMenuItem
//                                     onClick={() => handleForward(message)}
//                                     className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
//                                 >
//                                     <Forward className="w-4 h-4 text-gray-600" />
//                                     <span>Forward</span>
//                                 </ContextMenuItem>

//                                 <ContextMenuItem
//                                     onClick={() => setSelectedMessage(message)}
//                                     className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
//                                 >
//                                     <ClipboardPlus className="w-4 h-4 text-gray-600" />
//                                     <span>Create Task</span>
//                                 </ContextMenuItem>

//                                 <ContextMenuSeparator />

//                                 <ContextMenuItem
//                                     inset
//                                     onClick={() => { }}
//                                     className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
//                                 >
//                                     <X className="w-4 h-4 text-gray-600" />
//                                     <span>Cancel</span>
//                                 </ContextMenuItem>
//                             </ContextMenuContent>
//                         </ContextMenu>
//                     </div>
//                 );
//             })}

//             {/* Forward Dialog */}
//             <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
//                 <DialogContent className="sm:max-w-lg">
//                     <DialogHeader>
//                         <DialogTitle>Forward Message</DialogTitle>
//                         <DialogDescription>
//                             Select conversations or groups to forward this message to
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="space-y-4">
//                         {/* Search */}
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                             <Input
//                                 placeholder="Search conversations or groups..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="pl-9"
//                             />
//                         </div>

//                         {/* Tabs */}
//                         <Tabs defaultValue="conversations" className="w-full">
//                             <TabsList className="grid w-full grid-cols-2">
//                                 <TabsTrigger value="conversations" className="flex items-center gap-2">
//                                     <MessageCircle className="w-4 h-4" />
//                                     Conversations
//                                 </TabsTrigger>
//                                 <TabsTrigger value="groups" className="flex items-center gap-2">
//                                     <Users className="w-4 h-4" />
//                                     Groups
//                                 </TabsTrigger>
//                             </TabsList>

//                             <TabsContent value="conversations" className="mt-4">
//                                 <ScrollArea className="h-[300px] pr-4">
//                                     {filteredConversations && filteredConversations.length > 0 ? (
//                                         <div className="space-y-2">
//                                             {filteredConversations.map((conv) => {
//                                                 const displayName = conv.receiver_name || conv.sender_name || "Unknown";
//                                                 const targetId = `conversation-${conv.id}`;
//                                                 const isSelected = selectedForwardTargets.some(t => t.id === targetId);

//                                                 return (
//                                                     <div
//                                                         key={conv.id}
//                                                         onClick={() => toggleForwardTarget(conv, "conversation")}
//                                                         className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
//                                                             ? "bg-[#C72030] text-white"
//                                                             : "hover:bg-gray-100"
//                                                             }`}
//                                                     >
//                                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isSelected
//                                                             ? "bg-white text-[#C72030]"
//                                                             : "bg-[#F2EEE9] text-[#C72030]"
//                                                             }`}>
//                                                             {displayName[0]?.toUpperCase()}
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">
//                                                             <div className="font-medium truncate">{displayName}</div>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     ) : (
//                                         <div className="text-center py-8 text-gray-500">
//                                             No conversations found
//                                         </div>
//                                     )}
//                                 </ScrollArea>
//                             </TabsContent>

//                             <TabsContent value="groups" className="mt-4">
//                                 <ScrollArea className="h-[300px] pr-4">
//                                     {filteredGroups && filteredGroups.length > 0 ? (
//                                         <div className="space-y-2">
//                                             {filteredGroups.map((group) => {
//                                                 const targetId = `group-${group.id}`;
//                                                 const isSelected = selectedForwardTargets.some(t => t.id === targetId);

//                                                 return (
//                                                     <div
//                                                         key={group.id}
//                                                         onClick={() => toggleForwardTarget(group, "group")}
//                                                         className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
//                                                             ? "bg-[#C72030] text-white"
//                                                             : "hover:bg-gray-100"
//                                                             }`}
//                                                     >
//                                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isSelected
//                                                             ? "bg-white text-[#C72030]"
//                                                             : "bg-[#F2EEE9] text-[#C72030]"
//                                                             }`}>
//                                                             {group.name?.[0]?.toUpperCase() || "G"}
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">
//                                                             <div className="font-medium truncate">{group.name}</div>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     ) : (
//                                         <div className="text-center py-8 text-gray-500">
//                                             No groups found
//                                         </div>
//                                     )}
//                                 </ScrollArea>
//                             </TabsContent>
//                         </Tabs>

//                         {selectedForwardTargets.length > 0 && (
//                             <div className="text-sm text-gray-600">
//                                 {selectedForwardTargets.length} {selectedForwardTargets.length === 1 ? 'chat' : 'chats'} selected
//                             </div>
//                         )}
//                     </div>

//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setShowForwardDialog(false)}>
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleSendForward}
//                             disabled={selectedForwardTargets.length === 0}
//                             className="bg-[#C72030] hover:bg-[#a01828]"
//                         >
//                             Forward
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Create Task Dialog */}
//             <Dialog
//                 open={!!selectedMessage}
//                 onOpenChange={() => setSelectedMessage(null)}
//             >
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader>
//                         <DialogTitle>Create a Task</DialogTitle>
//                         <DialogDescription>
//                             Do you want to create a task for this message?
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
//                         {selectedMessage?.body}
//                     </div>
//                     <DialogFooter className="flex justify-end gap-2 mt-4">
//                         <Button variant="outline" onClick={() => setSelectedMessage(null)}>
//                             No
//                         </Button>
//                         <Button
//                             onClick={() => {
//                                 setSelectedMessage(null);
//                                 setOpenTaskModal(true);
//                             }}
//                         >
//                             Yes
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             <CreateChatTask
//                 openTaskModal={openTaskModal}
//                 setOpenTaskModal={setOpenTaskModal}
//                 onCreateTask={handleCreateTask}
//                 message={selectedMessage}
//                 id={id}
//             />

//             <div ref={bottomRef} className="h-0" />
//         </div>
//     );
// };

// export default Chats;




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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardPlus, FileText, X, Reply, Forward, Search, Users, MessageCircle, CornerDownRight } from "lucide-react";
import CreateChatTask from "./CreateChatTask";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createChatTask, sendMessage } from "@/store/slices/channelSlice";
import { useParams } from "react-router-dom";

const Chats = ({ messages, onReply }) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const currentUserId = localStorage.getItem("userId");
    const bottomRef = useRef(null);

    const { data: conversations } = useAppSelector(state => state.fetchConversations)
    const { data: groups } = useAppSelector(state => state.fetchGroups)

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
    const [showActions, setShowActions] = useState(false);
    const [showForwardDialog, setShowForwardDialog] = useState(false);
    const [messageToForward, setMessageToForward] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedForwardTargets, setSelectedForwardTargets] = useState([]);
    const hoverTimeoutRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = (index) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        setHoveredMessageIndex(index);

        hoverTimeoutRef.current = setTimeout(() => {
            setShowActions(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        setShowActions(false);
        setHoveredMessageIndex(null);
    };

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

    const handleReply = (message) => {
        onReply(message);
    };

    const handleForward = (message) => {
        setMessageToForward(message);
        setShowForwardDialog(true);
        setSelectedForwardTargets([]);
        setSearchQuery("");
    };

    const toggleForwardTarget = (target, type) => {
        const targetId = `${type}-${target.id}`;
        setSelectedForwardTargets(prev => {
            if (prev.find(t => t.id === targetId)) {
                return prev.filter(t => t.id !== targetId);
            } else {
                return [...prev, { id: targetId, data: target, type }];
            }
        });
    };

    const handleSendForward = async () => {
        if (selectedForwardTargets.length === 0) {
            toast.error("Please select at least one conversation or group");
            return;
        }

        try {
            const forwardPromises = selectedForwardTargets.map(async (target) => {
                const payload = new FormData();
                payload.append("message[body]", messageToForward.body || "");
                payload.append("message[is_forwarded]", "true");

                if (target.type === "conversation") {
                    payload.append("message[conversation_id]", target.data.id);
                } else {
                    payload.append("message[project_space_id]", target.data.id);
                }

                // Forward attachments URLs if any
                if (messageToForward.attachments && messageToForward.attachments.length > 0) {
                    messageToForward.attachments.forEach((attachment) => {
                        if (attachment.url) {
                            payload.append("message[attachment_urls][]", attachment.url);
                        }
                    });
                }

                return dispatch(sendMessage({ baseUrl, token, data: payload })).unwrap();
            });

            await Promise.all(forwardPromises);

            toast.success(`Message forwarded to ${selectedForwardTargets.length} ${selectedForwardTargets.length === 1 ? 'chat' : 'chats'}`);
            setShowForwardDialog(false);
            setMessageToForward(null);
            setSelectedForwardTargets([]);
        } catch (error) {
            console.log(error);
            toast.error("Failed to forward message");
        }
    };

    // Find parent message by parent_id
    const findParentMessage = (parentId) => {
        return messages.find(msg => msg.id === parentId);
    };

    const filterConversations = (list, query) => {
        if (!query.trim()) return list || [];
        return (list || []).filter(item => {
            const name = item.name || item.receiver_name || item.sender_name || "";
            return name.toLowerCase().includes(query.toLowerCase());
        });
    };

    const renderMessageWithMentions = (text) => {
        if (!text) return null;

        const mentionColors = [
            { bg: "bg-blue-100", text: "text-blue-700", hover: "hover:bg-blue-200" },
            {
                bg: "bg-green-100",
                text: "text-green-700",
                hover: "hover:bg-green-200",
            },
            {
                bg: "bg-purple-100",
                text: "text-purple-700",
                hover: "hover:bg-purple-200",
            },
            { bg: "bg-pink-100", text: "text-pink-700", hover: "hover:bg-pink-200" },
            {
                bg: "bg-orange-100",
                text: "text-orange-700",
                hover: "hover:bg-orange-200",
            },
            { bg: "bg-teal-100", text: "text-teal-700", hover: "hover:bg-teal-200" },
            {
                bg: "bg-indigo-100",
                text: "text-indigo-700",
                hover: "hover:bg-indigo-200",
            },
        ];

        const mentionRegex = /@\*\*([^*]+)\*\*|@(\w+(?:\s+\w+)?)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        let mentionIndex = 0;

        while ((match = mentionRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({
                    type: "text",
                    content: text.substring(lastIndex, match.index),
                });
            }

            const username = match[1] || match[2];

            parts.push({
                type: "mention",
                content: `@${username}`,
                username: username,
                colorIndex: mentionIndex % mentionColors.length,
            });

            mentionIndex++;
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push({
                type: "text",
                content: text.substring(lastIndex),
            });
        }

        if (parts.length === 0) {
            return <span className="whitespace-pre-line break-words">{text}</span>;
        }

        return (
            <span className="whitespace-pre-line break-words">
                {parts.map((part, index) => {
                    if (part.type === "mention") {
                        const color = mentionColors[part.colorIndex];
                        return (
                            <span
                                key={index}
                                className={`${color.bg} ${color.text} ${color.hover} px-1 rounded font-medium cursor-pointer transition-colors`}
                                title={`Mentioned: ${part.username}`}
                            >
                                {part.content}
                            </span>
                        );
                    }
                    return <span key={index}>{part.content}</span>;
                })}
            </span>
        );
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

    const renderReplyPreview = (parentMessage, isMe) => {
        if (!parentMessage) return null;

        return (
            <div className={`mb-2 border-l-4 ${isMe ? 'border-gray-400 bg-gray-50' : 'border-[#C72030] bg-red-50'} rounded p-2`}>
                <div className="text-xs font-semibold text-gray-700 mb-1">
                    {parentMessage.user_name}
                </div>
                <div className="text-xs text-gray-600 truncate">
                    {parentMessage.body || "Attachment"}
                </div>
            </div>
        );
    };

    const filteredConversations = filterConversations(conversations, searchQuery);
    const filteredGroups = filterConversations(groups, searchQuery);

    return (
        <div className="flex-1 w-full bg-[#F9F9F9] overflow-y-auto max-h-[calc(100vh-160px)]">
            {[...messages].reverse().map((message, index) => {
                const isMe = message?.user_id?.toString() === currentUserId;
                const shouldShowActions = hoveredMessageIndex === index && showActions;
                const parentMessage = message.parent_id ? findParentMessage(message.parent_id) : null;

                return (
                    <div
                        key={index}
                        className={`mb-6 flex flex-col ${isMe ? "items-end" : "items-start"
                            }`}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
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
                                <div className="flex items-start space-x-3 cursor-pointer relative">
                                    <div
                                        className={`absolute top-1/2 -translate-y-1/2 flex gap-1 z-10 transition-all duration-300 ease-out ${isMe ? "left-[-70px]" : "right-[-70px]"
                                            } ${shouldShowActions
                                                ? "opacity-100 scale-100"
                                                : "opacity-0 scale-90 pointer-events-none"
                                            }`}
                                    >
                                        <button
                                            onClick={() => handleReply(message)}
                                            className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                                            title="Reply"
                                        >
                                            <Reply className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleForward(message)}
                                            className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
                                            title="Forward"
                                        >
                                            <Forward className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>

                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-sm flex items-center justify-center mt-[2px]">
                                            {(message.user_name || "U")[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-2xl px-4 py-2 text-sm shadow max-w-xs bg-white`}
                                    >
                                        {message.is_forwarded && (
                                            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1 italic">
                                                <CornerDownRight className="w-3 h-3" />
                                                <span>Forwarded</span>
                                            </div>
                                        )}
                                        {parentMessage && renderReplyPreview(parentMessage, isMe)}
                                        {renderAttachments(message.attachments)}
                                        {message.body && (
                                            <div
                                                className={`${message.attachments?.length > 0 || parentMessage ? "mt-2" : ""
                                                    }`}
                                            >
                                                {renderMessageWithMentions(message.body)}
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
                                    onClick={() => handleReply(message)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                >
                                    <Reply className="w-4 h-4 text-gray-600" />
                                    <span>Reply</span>
                                </ContextMenuItem>

                                <ContextMenuItem
                                    onClick={() => handleForward(message)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                                >
                                    <Forward className="w-4 h-4 text-gray-600" />
                                    <span>Forward</span>
                                </ContextMenuItem>

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

            {/* Forward Dialog */}
            <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Forward Message</DialogTitle>
                        <DialogDescription>
                            Select conversations or groups to forward this message to
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search conversations or groups..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="conversations" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="conversations" className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Conversations
                                </TabsTrigger>
                                <TabsTrigger value="groups" className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Groups
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="conversations" className="mt-4">
                                <ScrollArea className="h-[300px] pr-4">
                                    {filteredConversations && filteredConversations.length > 0 ? (
                                        <div className="space-y-2">
                                            {filteredConversations.map((conv) => {
                                                const displayName = conv.receiver_name || conv.sender_name || "Unknown";
                                                const targetId = `conversation-${conv.id}`;
                                                const isSelected = selectedForwardTargets.some(t => t.id === targetId);

                                                return (
                                                    <div
                                                        key={conv.id}
                                                        onClick={() => toggleForwardTarget(conv, "conversation")}
                                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                                                            ? "bg-[#C72030] text-white"
                                                            : "hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isSelected
                                                            ? "bg-white text-[#C72030]"
                                                            : "bg-[#F2EEE9] text-[#C72030]"
                                                            }`}>
                                                            {displayName[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate">{displayName}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No conversations found
                                        </div>
                                    )}
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="groups" className="mt-4">
                                <ScrollArea className="h-[300px] pr-4">
                                    {filteredGroups && filteredGroups.length > 0 ? (
                                        <div className="space-y-2">
                                            {filteredGroups.map((group) => {
                                                const targetId = `group-${group.id}`;
                                                const isSelected = selectedForwardTargets.some(t => t.id === targetId);

                                                return (
                                                    <div
                                                        key={group.id}
                                                        onClick={() => toggleForwardTarget(group, "group")}
                                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                                                            ? "bg-[#C72030] text-white"
                                                            : "hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isSelected
                                                            ? "bg-white text-[#C72030]"
                                                            : "bg-[#F2EEE9] text-[#C72030]"
                                                            }`}>
                                                            {group.name?.[0]?.toUpperCase() || "G"}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate">{group.name}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No groups found
                                        </div>
                                    )}
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>

                        {selectedForwardTargets.length > 0 && (
                            <div className="text-sm text-gray-600">
                                {selectedForwardTargets.length} {selectedForwardTargets.length === 1 ? 'chat' : 'chats'} selected
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowForwardDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendForward}
                            disabled={selectedForwardTargets.length === 0}
                            className="bg-[#C72030] hover:bg-[#a01828]"
                        >
                            Forward
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Task Dialog */}
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