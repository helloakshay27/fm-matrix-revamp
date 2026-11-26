import { ChevronDown, ChevronRight, Loader2, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NewConversationModal from "./NewConversationModal";
import {
  deleteConversation,
  fetchConversations,
  fetchGroups,
} from "@/store/slices/channelSlice";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Skeleton } from "./ui/skeleton";
import { useNotification } from "@/contexts/NotificationContext";

const ChannelSidebar = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const modalRef = useRef<HTMLDivElement | null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement | null>(null);

  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newConversationModal, setNewConversationModal] = useState(false);
  const [modalAnchor, setModalAnchor] = useState({ top: 4, left: 248 });
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [chatToDelete, setChatToDelete] = useState<any>(null);
  const [deletingChat, setDeletingChat] = useState(false);

  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  // Use notification context to listen for new notifications
  const { notifications } = useNotification();

  const fetchInternalUsers = async () => {
    try {
      const response = await dispatch(fetchFMUsers()).unwrap();
      setUsers(
        response.users.filter((user) => user.employee_type === "internal")
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const response = await dispatch(
        fetchConversations({ baseUrl, token })
      ).unwrap();
      setConversations(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    setDeletingChat(true);
    try {
      await dispatch(
        deleteConversation({ baseUrl, token, id: chatToDelete.id })
      ).unwrap();
      setConversations((prev) =>
        prev.filter((c) => String(c.id) !== String(chatToDelete.id))
      );
      toast.success("Chat deleted");
      // If the deleted chat is currently open, leave it
      if (location.pathname.endsWith(`/channels/messages/${chatToDelete.id}`)) {
        navigate(
          location.pathname.startsWith("/business-compass/channels")
            ? "/business-compass/channels"
            : "/vas/channels"
        );
      }
      setChatToDelete(null);
    } catch (error) {
      console.log(error);
      toast.error(typeof error === "string" ? error : "Failed to delete chat");
    } finally {
      setDeletingChat(false);
    }
  };

  const getGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const response = await dispatch(fetchGroups({ baseUrl, token })).unwrap();
      setGroups(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchInternalUsers();
    getConversations();
    getGroups();
  }, []);

  // Reflect a group rename (from GroupConversation's info modal) in the list
  useEffect(() => {
    const handleGroupRenamed = (e: Event) => {
      const { id, name } = (e as CustomEvent).detail || {};
      if (!id || !name) return;
      setGroups((prev) =>
        prev.map((g) => (String(g.id) === String(id) ? { ...g, name } : g))
      );
    };
    const handleGroupLeft = (e: Event) => {
      const { id } = (e as CustomEvent).detail || {};
      if (!id) return;
      setGroups((prev) => prev.filter((g) => String(g.id) !== String(id)));
    };
    window.addEventListener("channel-group-renamed", handleGroupRenamed);
    window.addEventListener("channel-group-left", handleGroupLeft);
    return () => {
      window.removeEventListener("channel-group-renamed", handleGroupRenamed);
      window.removeEventListener("channel-group-left", handleGroupLeft);
    };
  }, []);

  // Move conversation to top when a notification arrives
  useEffect(() => {
    if (notifications.length === 0) return;

    const latestNotification = notifications[0];

    // If notification is for a conversation, move it to top
    if (
      latestNotification.ntype === "conversation" &&
      latestNotification.payload?.conversation_id
    ) {
      const conversationId = latestNotification.payload.conversation_id;

      setConversations((prevConversations) => {
        const conversationIndex = prevConversations.findIndex(
          (c) => c.id === conversationId || c.id === String(conversationId)
        );

        if (conversationIndex !== -1) {
          // Move conversation to top and mark as unread
          const reorderedConversations = [...prevConversations];

          // Mark as unread (copy - items from the Redux thunk are frozen)
          reorderedConversations[conversationIndex] = {
            ...reorderedConversations[conversationIndex],
            last_message_read: false,
          };

          // Only move if not already at top
          if (conversationIndex !== 0) {
            const [movedConversation] = reorderedConversations.splice(
              conversationIndex,
              1
            );
            reorderedConversations.unshift(movedConversation);
          }

          return reorderedConversations;
        }

        return prevConversations;
      });
    }

    // If notification is for a group, move it to top
    if (
      latestNotification.ntype === "projectspace" &&
      latestNotification.payload?.project_space_id
    ) {
      const groupId = latestNotification.payload.project_space_id;

      setGroups((prevGroups) => {
        const groupIndex = prevGroups.findIndex(
          (g) => g.id === groupId || g.id === String(groupId)
        );

        if (groupIndex !== -1) {
          // Move group to top and mark as unread
          const reorderedGroups = [...prevGroups];

          // Mark as unread (copy - items from the Redux thunk are frozen)
          reorderedGroups[groupIndex] = {
            ...reorderedGroups[groupIndex],
            last_message_read: false,
          };

          // Only move if not already at top
          if (groupIndex !== 0) {
            const [movedGroup] = reorderedGroups.splice(groupIndex, 1);
            reorderedGroups.unshift(movedGroup);
          }

          return reorderedGroups;
        }

        return prevGroups;
      });
    }
  }, [notifications]);

  const handleSidebarSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSidebarSearchQuery(query);

    if (query) {
      setIsMessagesOpen(true);
      setIsGroupsOpen(true);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const displayedName =
      currentUserId === conversation.sender_id
        ? conversation.receiver_name
        : conversation.sender_name;

    return displayedName
      .toLowerCase()
      .includes(sidebarSearchQuery.toLowerCase());
  });

  // Wrap every case-insensitive occurrence of the search query in a highlight
  const highlightMatch = (text: string) => {
    const query = sidebarSearchQuery.trim();
    if (!query || !text) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-brand-light text-inherit font-semibold rounded-sm">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setNewConversationModal(false);
      }
    }

    if (newConversationModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newConversationModal]);

  // Position the "New Conversation" modal (fixed to the viewport, so it
  // isn't clipped by / doesn't add horizontal scroll to this narrow,
  // scrollable sidebar column) right at this column's own right edge.
  useEffect(() => {
    if (!newConversationModal) return;

    const updatePosition = () => {
      const rect = sidebarWrapperRef.current?.getBoundingClientRect();
      if (rect) {
        setModalAnchor({ top: rect.top + 4, left: rect.right - 8 });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [newConversationModal]);

  return (
    <div
      ref={sidebarWrapperRef}
      className={`w-full shrink-0 md:w-64 ${localStorage.getItem("user_role_name") === "Employee" ? "md:h-[calc(100vh-64px)]" : "md:h-[calc(100vh-112px)]"} max-h-[60vh] overflow-y-auto md:max-h-none md:flex md:flex-col md:overflow-hidden py-3 border-b md:border-b-0 md:border-r border-gray-200 shadow-md space-y-2 relative`}
    >
      <div
        className="w-full px-3 shrink-0"
        onClick={() => setNewConversationModal(true)}
      >
        <Button className="w-full">+ New Chat</Button>
      </div>

      <div className="px-3 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-200 rounded-[2px] bg-transparent pl-3 pr-8 py-1 focus:outline-none"
            value={sidebarSearchQuery}
            onChange={handleSidebarSearch}
          />
          {sidebarSearchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSidebarSearchQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-auto w-auto p-0.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 [&_svg]:text-current"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={14} />
            </Button>
          )}
        </div>
      </div>

      <div className="md:flex md:flex-col md:min-h-0 md:flex-1 md:max-h-max">
        <button
          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 py-2 px-3 w-full shrink-0"
          onClick={() => setIsMessagesOpen(!isMessagesOpen)}
        >
          <span className="text-sm font-medium">Direct Messages</span>
          <div className="flex items-center gap-1.5">
            {(() => {
              const unreadCount = conversations.filter(
                (c) => c.last_message_read === false
              ).length;
              return unreadCount > 0 ? (
                <span className="bg-brand text-white text-[11px] leading-none font-semibold rounded-[9px] min-w-[18px] h-[18px] inline-flex items-center justify-center px-1.5">
                  {unreadCount}
                </span>
              ) : null;
            })()}
            {isMessagesOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>
        </button>

        {isMessagesOpen && (
          <div className="pl-6 space-y-1 max-h-[12rem] md:max-h-none md:min-h-0 overflow-auto">
            {isLoadingConversations ? (
              // Skeleton loaders for conversations
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="py-1 px-2">
                  <Skeleton className="h-5 w-full bg-gray-200 rounded-[4px]" />
                </div>
              ))
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const displayedName =
                  currentUserId === conversation.sender_id
                    ? conversation.receiver_name
                    : conversation.sender_name;
                const isActive =
                  location.pathname ===
                  `/vas/channels/messages/${conversation.id}`;
                const hasUnreadMessages =
                  conversation.last_message_read === false;

                return (
                  <ContextMenu key={conversation.id}>
                    <ContextMenuTrigger asChild>
                      <div
                        className={`text-sm text-gray-700 cursor-pointer hover:text-[#c72030] py-1 px-2 rounded flex items-center justify-between gap-2 ${
                          isActive
                            ? "text-red-600 font-semibold"
                            : "hover:text-red-600"
                        }`}
                        onClick={() => {
                          setConversations((prev) =>
                            prev.map((c) =>
                              c.id === conversation.id
                                ? { ...c, last_message_read: true }
                                : c
                            )
                          );
                          if (
                            location.pathname.startsWith(
                              "/business-compass/channels"
                            )
                          ) {
                            navigate(
                              `/business-compass/channels/messages/${conversation.id}`
                            );
                          } else {
                            navigate(
                              `/vas/channels/messages/${conversation.id}`
                            );
                          }
                        }}
                      >
                        <span className="flex-1 truncate">{highlightMatch(displayedName)}</span>
                        {hasUnreadMessages && (
                          <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                        )}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-40">
                      <ContextMenuItem
                        onSelect={() =>
                          setChatToDelete({
                            id: conversation.id,
                            name: displayedName,
                          })
                        }
                        className="text-brand-error focus:text-brand-error focus:bg-brand-error-bg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete chat
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })
            ) : (
              <div className="text-sm text-gray-700 cursor-pointer hover:text-[#c72030] py-1 px-2 rounded">
                No conversations found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="md:flex md:flex-col md:min-h-0 md:flex-1 md:max-h-max">
        <button
          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 py-2 px-3 w-full shrink-0"
          onClick={() => setIsGroupsOpen(!isGroupsOpen)}
        >
          <span className="text-sm font-medium">Groups</span>
          <div className="flex items-center gap-1.5">
            {(() => {
              const unreadCount = groups.filter(
                (g) => g.last_message_read === false
              ).length;
              return unreadCount > 0 ? (
                <span className="bg-brand text-white text-[11px] leading-none font-semibold rounded-[9px] min-w-[18px] h-[18px] inline-flex items-center justify-center px-1.5">
                  {unreadCount}
                </span>
              ) : null;
            })()}
            {isGroupsOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>
        </button>

        {isGroupsOpen && (
          <div className="pl-6 space-y-1 max-h-[12rem] md:max-h-none md:min-h-0 overflow-auto">
            {isLoadingGroups ? (
              // Skeleton loaders for groups
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="py-1 px-2">
                  <Skeleton className="h-5 w-full rounded-[4px] bg-gray-200" />
                </div>
              ))
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                const isActive =
                  location.pathname === `/vas/channels/groups/${group.id}`;
                const hasUnreadMessages = group.last_message_read === false;
                return (
                  <div
                    className={`text-sm text-gray-700 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded flex items-center justify-between gap-2 ${
                      isActive ? "text-red-600 font-semibold" : ""
                    }`}
                    key={group.id}
                    onClick={() => {
                      setGroups((prev) =>
                        prev.map((g) =>
                          g.id === group.id
                            ? { ...g, last_message_read: true }
                            : g
                        )
                      );
                      if (
                        location.pathname.startsWith(
                          "/business-compass/channels"
                        )
                      ) {
                        navigate(
                          `/business-compass/channels/groups/${group.id}`
                        );
                      } else {
                        navigate(`/vas/channels/groups/${group.id}`);
                      }
                    }}
                  >
                    <span className="flex-1 truncate">{highlightMatch(group.name)}</span>
                    {hasUnreadMessages && (
                      <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-700 py-1 px-2 rounded">
                No groups found
              </div>
            )}
          </div>
        )}
      </div>

      {newConversationModal && (
        <NewConversationModal
          modalRef={modalRef}
          anchorPosition={modalAnchor}
          filteredUsers={filteredUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setNewConversationModal={setNewConversationModal}
          conversations={conversations}
          onConversationCreated={getConversations}
          onGroupCreated={getGroups}
        />
      )}

      <AlertDialog
        open={!!chatToDelete}
        onOpenChange={(open) => {
          if (!open && !deletingChat) setChatToDelete(null);
        }}
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete all chat history
              {chatToDelete?.name ? ` with ${chatToDelete.name}` : ""}. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingChat}>
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleDeleteChat} disabled={deletingChat}>
              {deletingChat && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChannelSidebar;
