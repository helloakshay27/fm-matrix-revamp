import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAudienceUsersQuery } from "../hooks/useAudienceUsersQuery";
import type { NotificationTargetSelection } from "../types/customNotification";

interface NotificationUserInlineListProps {
  selectedIds: number[];
  onToggle: (user: NotificationTargetSelection) => void;
}

export function NotificationUserInlineList({
  selectedIds,
  onToggle,
}: NotificationUserInlineListProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useAudienceUsersQuery();

  const users = useMemo<NotificationTargetSelection[]>(
    () => (data ?? []).map((u) => ({ id: u.id, name: u.full_name })),
    [data]
  );

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => u.name.toLowerCase().includes(term));
  }, [users, search]);

  if (isError) {
    return <p className="px-4 py-3 text-sm text-brand-error">Failed to load users</p>;
  }
  if (isLoading) {
    return <p className="px-4 py-3 text-sm text-gray-500">Loading users...</p>;
  }

  return (
    <div>
      {users.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9"
            />
          </div>
        </div>
      )}
      {filteredUsers.length === 0 ? (
        <p className="px-4 py-3 text-sm text-gray-500">
          {users.length === 0 ? "No users available" : "No users match your search"}
        </p>
      ) : (
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
          {filteredUsers.map((user) => (
            <label
              key={user.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
            >
              <Checkbox
                checked={selectedIds.includes(user.id)}
                onCheckedChange={() => onToggle(user)}
              />
              <span className="text-sm text-gray-900">{user.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
