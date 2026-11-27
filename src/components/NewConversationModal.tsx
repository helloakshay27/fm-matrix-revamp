import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/store/hooks";
import { createConversation, createGroup } from "@/store/slices/channelSlice";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Check, Loader2, Search, X } from "lucide-react";

// Same avatar palette as the group info "Add members" panel
const AVATAR_STYLES = [
  "bg-brand-light text-brand",
  "bg-brand-green-light text-brand-green",
  "bg-brand-teal-light text-brand-teal",
  "bg-brand-purple-light text-gray-700",
  "bg-brand-warning-light text-gray-700",
];
const getAvatarStyle = (name?: string) => {
  const str = name || "";
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) | 0;
  return AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
};
const getInitial = (name?: string) => (name || "U").trim()[0]?.toUpperCase() || "U";

const NewConversationModal = ({
  modalRef,
  anchorPosition,
  filteredUsers,
  searchQuery,
  setSearchQuery,
  setNewConversationModal,
  conversations,
  onConversationCreated,
  onGroupCreated,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  const [activeTab, setActiveTab] = useState("direct");
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    currentUserId ? [currentUserId] : []
  );
  const [groupName, setGroupName] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [escalateUsers, setEscalateUsers] = useState<any[]>([]);
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Fetch escalate users
  useEffect(() => {
    const fetchEscalateUsers = async () => {
      setUserLoading(true);
      try {
        const response = await axios.get(
          `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEscalateUsers(response.data.users || []);
      } catch (error) {
        console.log("Error fetching escalate users:", error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchEscalateUsers();
  }, [baseUrl, token]);

  const existingConversationMap = useMemo(() => {
    const map = new Map<string, string>();
    conversations.forEach((conversation) => {
      if (conversation.sender_id === currentUserId) {
        map.set(String(conversation.recipient_id), String(conversation.id));
      } else if (conversation.recipient_id === currentUserId) {
        map.set(String(conversation.sender_id), String(conversation.id));
      }
    });
    return map;
  }, [conversations, currentUserId]);

  const availableUsers = useMemo(() => {
    return escalateUsers
      .filter((user) => user.id !== currentUserId)
      .filter((user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [escalateUsers, currentUserId, searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    setGroupName("");
    setSelectedUsers(currentUserId ? [currentUserId] : []);
    setActiveTab("direct");
    setNewConversationModal(false);
  };

  const handleCreateConversation = async (id: string) => {
    const existingId = existingConversationMap.get(String(id));
    if (existingId) {
      handleClose();
      navigate(`/vas/channels/messages/${existingId}`);
      return;
    }

    const payload = {
      conversation: {
        sender_id: currentUserId,
        recipient_id: id,
      },
    };
    try {
      const response = await dispatch(
        createConversation({ baseUrl, token, data: payload })
      ).unwrap();
      handleClose();
      if (onConversationCreated) {
        await onConversationCreated();
      }
      navigate(`/vas/channels/messages/${response.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error("Please select at least 2 members.");
      return;
    }

    const payload = {
      project_space: {
        name: groupName.trim(),
        user_ids: selectedUsers,
        created_by_id: currentUserId,
        resource_type: "Pms::Site",
        resource_id: localStorage.getItem("selectedSiteId"),
      },
    };

    setCreatingGroup(true);
    try {
      const response = await dispatch(
        createGroup({ baseUrl, token, data: payload })
      ).unwrap();
      handleClose();
      // Refresh groups list
      if (onGroupCreated) {
        await onGroupCreated();
      }
      navigate(`/vas/channels/groups/${response.id}`);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.name && Array.isArray(error.response.data.name)) {
        toast.error("Group with this name already exists");
      }
    } finally {
      setCreatingGroup(false);
    }
  };

  // Members picked for the new group, excluding the creator (always included)
  const pickedMembers = escalateUsers.filter(
    (user) => user.id !== currentUserId && selectedUsers.includes(user.id)
  );
  const canCreateGroup = groupName.trim().length > 0 && pickedMembers.length > 0;

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="fixed w-[32rem] h-[35rem] bg-white flex flex-col shadow-2xl rounded-2xl p-4 space-y-4 border border-gray-100 z-50"
      style={{ top: anchorPosition?.top ?? 4, left: anchorPosition?.left ?? 248 }}
      ref={modalRef}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          New Conversation
        </h2>
        <button
          className="text-gray-400 hover:text-gray-600 transition"
          onClick={handleClose}
        >
          ✕
        </button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setSearchQuery("");
        }}
        className="w-full flex-1 flex flex-col min-h-0"
      >
        <TabsList className="w-full bg-white border border-gray-200">
          <TabsTrigger
            value="direct"
            className="w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Direct Message
          </TabsTrigger>
          <TabsTrigger
            value="group"
            className="w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Create Group
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="direct"
          className="flex-1 flex flex-col space-y-4 mt-4 min-h-0 data-[state=inactive]:hidden"
        >
          <div className="relative">
            <Input
              placeholder="Search for users..."
              className="pl-10 pr-4 py-2 rounded-[5px] border border-gray-200 focus:ring-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
            {userLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : availableUsers.length > 0 ? (
              availableUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleCreateConversation(user.id)}
                >
                  <div className="w-9 h-9 rounded-full bg-[#F2EEE9] flex items-center justify-center font-medium text-[#c72030]">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">
                      {user.full_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {existingConversationMap.has(String(user.id))
                        ? "Open conversation"
                        : "Click to start chat"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                No users found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="group"
          className="flex-1 flex flex-col mt-4 min-h-0 data-[state=inactive]:hidden"
        >
          {/* Group name, search and list scroll together; the search bar sticks
              to the top once the group name scrolls away (like the group details modal) */}
          <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
          {/* Group name */}
          <div>
            <input
              id="new-group-name"
              type="text"
              aria-label="Group name"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={100}
              className="compact-input w-full h-9 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-brand transition-colors"
            />
          </div>

          {/* Member search + selected chips (sticky) */}
          <div className="sticky top-0 z-[5] bg-white -mx-1 px-1 pt-2.5 pb-2">
          <div>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                aria-label="Search people to add"
                placeholder="Search people to add"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="compact-input w-full h-9 pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-brand transition-colors"
              />
            </div>
          </div>

          {/* Selected chips */}
          {pickedMembers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 max-h-[60px] overflow-y-auto">
              {pickedMembers.map((user) => (
                <span
                  key={user.id}
                  className="inline-flex items-center gap-1.5 pl-1 pr-1.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${getAvatarStyle(user.full_name)}`}
                  >
                    {getInitial(user.full_name)}
                  </span>
                  <span className="max-w-[120px] truncate">{user.full_name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleUserSelection(user.id)}
                    className="h-auto w-auto sm:h-auto sm:w-auto p-0.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 [&_svg]:text-current"
                    title="Remove"
                    aria-label={`Remove ${user.full_name}`}
                  >
                    <X size={12} />
                  </Button>
                </span>
              ))}
            </div>
          )}
          </div>

          {/* People list */}
          <div className="mt-1 space-y-0.5">
            {userLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))
            ) : availableUsers.length > 0 ? (
              availableUsers.map((user) => {
                const checked = selectedUsers.includes(user.id);
                return (
                  <Button
                    key={user.id}
                    type="button"
                    variant="ghost"
                    onClick={() => toggleUserSelection(user.id)}
                    aria-pressed={checked}
                    className={`w-full h-auto sm:h-auto justify-start gap-3 px-3 py-2.5 rounded-xl text-left whitespace-normal tracking-normal [&_svg]:text-current ${checked ? "bg-brand-selected" : "hover:bg-gray-50"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${getAvatarStyle(user.full_name)}`}
                    >
                      {getInitial(user.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {user.full_name}
                      </div>
                      {user.email && (
                        <div className="text-xs font-normal text-gray-500 truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-brand border-brand text-white" : "border-gray-300"}`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </span>
                  </Button>
                );
              })
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                No people found
              </div>
            )}
          </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {pickedMembers.length > 0
                ? `${pickedMembers.length} ${pickedMembers.length === 1 ? "member" : "members"} selected`
                : "Select people"}
            </span>
            <Button
              type="button"
              onClick={handleCreateGroup}
              disabled={!canCreateGroup || creatingGroup}
              className="h-9 sm:h-9 min-w-[120px] px-4 rounded-lg text-sm"
            >
              {creatingGroup && <Loader2 size={14} className="animate-spin" />}
              {creatingGroup ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewConversationModal;
